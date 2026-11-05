/**
 * PRIVACY BY DESIGN — INTENTIONAL ARCHITECTURE
 *
 * All identity-based scoring is computed client-side on the user's device.
 * This is not an accident or oversight — it means sensitive identity data
 * (ethnicity, sexual orientation, religion, political views, etc.) never
 * leaves the device and never touches the server.
 *
 * DO NOT move calculateCityScore or any identity-aware scoring logic
 * server-side, even if it looks like a straightforward architectural
 * improvement. Keeping this logic client-side is a deliberate privacy
 * guarantee for EarthLook's users.
 */

import {
      City,
      CityScore,
      CityWithScore,
      IdentityProfile,
      PriorityWeights,
      PrivacySettings,
      ScoreHighlight,
      ClimatePreferences,
      HateCrimesByBiasCategory,
      DEFAULT_PRIVACY_SETTINGS,
      DEFAULT_CLIMATE_PREFERENCES,
} from "@/types";

interface CacheEntry {
      score: CityScore;
      timestamp: number;
}

const scoreCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000;

function generateCacheKey(
      cityId: string,
      identity: IdentityProfile,
      priorities: PriorityWeights,
      privacySettings: PrivacySettings
    ): string {
      return `${cityId}:${JSON.stringify({ identity, priorities, privacySettings })}`;
}

function getCachedScore(key: string): CityScore | null {
      const entry = scoreCache.get(key);
      if (!entry) return null;
      if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
              scoreCache.delete(key);
              return null;
      }
      return entry.score;
}

function setCachedScore(key: string, score: CityScore): void {
      if (scoreCache.size > 500) {
              const oldestKey = scoreCache.keys().next().value;
              if (oldestKey) scoreCache.delete(oldestKey);
      }
      scoreCache.set(key, { score, timestamp: Date.now() });
}

export function clearScoreCache(): void {
      scoreCache.clear();
}

function normalizeWeight(weights: PriorityWeights): Record<string, number> {
      const total = Object.values(weights).reduce((sum, val) => sum + val, 0);
      const normalized: Record<string, number> = {};
      for (const key of Object.keys(weights)) {
              normalized[key] = (weights[key as keyof PriorityWeights] / total) * 100;
      }
      return normalized;
}

export function applyPrivacyFilter(
      identity: IdentityProfile,
      privacy: PrivacySettings
    ): IdentityProfile {
      return {
              ethnicities: privacy.useEthnicity ? identity.ethnicities : [],
              genderIdentity: privacy.useGenderIdentity ? identity.genderIdentity : "",
              sexualOrientation: privacy.useSexualOrientation
                ? identity.sexualOrientation
                        : "",
              religion: privacy.useReligion ? identity.religion : "",
              politicalViews: privacy.usePoliticalViews ? identity.politicalViews : "",
              familyStructure: privacy.useFamilyStructure ? identity.familyStructure : "",
              incomeLevel: privacy.useIncomeLevel ? identity.incomeLevel : "",
              careerField: privacy.useCareerField ? identity.careerField : "",
              ageRange: privacy.useAgeRange ? identity.ageRange : "",
              disabilities: privacy.useDisabilities ? identity.disabilities : [],
              languages: identity.languages,
              climatePreferences:
                        identity.climatePreferences || DEFAULT_CLIMATE_PREFERENCES,
      };
}

// Issue #8: overallCrimeRate is a raw index, not a 0-100 safety scale.
// Normalise it to a 0-100 range so higher values indicate worse safety.
function normalizeCrimeRate(raw: number): number {
      return Math.max(0, Math.min(100, raw));
}

/**
 * Feature 1 — Identity-Filtered Hate Crime & Safety Data
 *
 * Maps user identity dimensions to the relevant FBI hate crime bias categories.
 * Returns the relevant per-100k rate(s) from the city's granular data.
 *
 * If the city doesn't have granular data (hateCrimesByBiasCategory is absent),
 * returns null so the caller can fall back to legacy aggregate scoring.
 *
 * The mapping logic:
 * - Ethnicity → anti-[ethnicity] categories
 * - Sexual orientation → anti-gay / anti-lesbian / anti-bisexual
 * - Gender identity (trans/non-binary) → anti-transgender / anti-genderNonconforming
 * - Religion → anti-[religion] categories
 * - Disabilities → anti-disability
 *
 * Returns a penalty value in [0, 30] representing how much to subtract
 * from the base safety score, and a human-readable note explaining the
 * personalisation so users understand why their score may differ.
 */
function getIdentityHateCrimePenalty(
      hc: HateCrimesByBiasCategory,
      identity: IdentityProfile
    ): { penalty: number; note: string | null } {
      let maxRelevantRate = 0;
      const matchedCategories: string[] = [];

  // Ethnicity mapping
  for (const ethnicity of identity.ethnicities) {
          const lower = ethnicity.toLowerCase();
          let rate: number | undefined;
          if (lower.includes("black") || lower.includes("african")) {
                    rate = hc.antiBlack;
                    if (rate) matchedCategories.push("race/ethnicity");
          } else if (lower.includes("hispanic") || lower.includes("latino")) {
                    rate = hc.antiHispanic;
                    if (rate) matchedCategories.push("race/ethnicity");
          } else if (lower.includes("asian")) {
                    rate = hc.antiAsian;
                    if (rate) matchedCategories.push("race/ethnicity");
          } else if (lower.includes("middle eastern") || lower.includes("arab") || lower.includes("north african")) {
                    rate = hc.antiArab;
                    if (rate) matchedCategories.push("race/ethnicity");
          } else if (lower.includes("native american") || lower.includes("indigenous")) {
                    rate = hc.antiNativeAmerican;
                    if (rate) matchedCategories.push("race/ethnicity");
          } else if (lower.includes("white")) {
                    rate = hc.antiWhite;
                    if (rate) matchedCategories.push("race/ethnicity");
          }
          if (rate && rate > maxRelevantRate) maxRelevantRate = rate;
  }

  // Sexual orientation mapping
  const orientation = identity.sexualOrientation?.toLowerCase() ?? "";
      if (orientation === "gay") {
              const rate = hc.antiGay ?? 0;
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("sexual orientation");
      } else if (orientation === "lesbian") {
              const rate = hc.antiLesbian ?? 0;
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("sexual orientation");
      } else if (orientation === "bisexual") {
              const rate = hc.antiBisexual ?? 0;
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("sexual orientation");
      } else if (["queer", "pansexual", "asexual"].some((o) => orientation.includes(o))) {
              // Use the broader LGBTQ+ proxy: average of gay + lesbian rates
        const rate = ((hc.antiGay ?? 0) + (hc.antiLesbian ?? 0)) / 2;
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("sexual orientation");
      }

  // Gender identity mapping (trans / non-binary)
  const gender = identity.genderIdentity?.toLowerCase() ?? "";
      if (gender.includes("trans") || gender === "non-binary" || gender === "genderqueer" ||
                gender === "genderfluid" || gender === "agender" || gender === "two-spirit") {
              const transRate = hc.antiTransgender ?? 0;
              const gncRate = hc.antiGenderNonconforming ?? 0;
              const rate = Math.max(transRate, gncRate);
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("gender identity");
      }

  // Religion mapping
  const religion = identity.religion?.toLowerCase() ?? "";
      if (religion === "jewish") {
              const rate = hc.antiJewish ?? 0;
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("religion");
      } else if (religion === "muslim") {
              const rate = hc.antiMuslim ?? 0;
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("religion");
      } else if (!["agnostic", "atheist", "prefer not to say", ""].includes(religion)) {
              const rate = hc.antiOtherReligion ?? 0;
              if (rate > maxRelevantRate) maxRelevantRate = rate;
              if (rate > 0) matchedCategories.push("religion");
      }

  // Disability mapping
  if (identity.disabilities && identity.disabilities.length > 0) {
          const rate = hc.antiDisability ?? 0;
          if (rate > maxRelevantRate) maxRelevantRate = rate;
          if (rate > 0) matchedCategories.push("disability status");
  }

  if (maxRelevantRate === 0) {
          return { penalty: 0, note: null };
  }

  // Convert rate (per 100k) to a 0-30 penalty.
  // A rate of 10/100k (very high) maps to ~25 points penalty.
  // A rate of 1/100k (low) maps to ~2-3 points penalty.
  // Using log scale so incremental rates still register.
  const penalty = Math.min(30, Math.log10(maxRelevantRate + 1) * 15);
      const unique = [...new Set(matchedCategories)];
      const note = `Safety score personalised for your ${unique.join(" & ")} — identity-specific hate crime data from FBI statistics.`;

  return { penalty, note };
}

function calculateSafetyScore(
      city: City,
      identity: IdentityProfile
    ): { score: number; note: string | null } {
      // Issue #8 fix: use normalized crime rate so 100 = most dangerous
  const normalizedCrime = normalizeCrimeRate(city.safety.overallCrimeRate);
      let baseScore = 100 - normalizedCrime;
      let note: string | null = null;

  // Feature 1: Use granular FBI hate crime data when available
  if (city.safety.hateCrimesByBiasCategory) {
          const { penalty, note: hcNote } = getIdentityHateCrimePenalty(
                    city.safety.hateCrimesByBiasCategory,
                    identity
                  );
          if (penalty > 0) {
                    baseScore -= penalty;
                    note = hcNote;
          }
  } else if (identity.ethnicities.length > 0) {
          // Legacy fallback: use aggregate hate crime data
        const avgHateCrimes =
                  Object.values(city.safety.hateCrimesByCategory).reduce(
                              (a, b) => a + b,
                              0
                            ) / 4;
          const hateCrimePenalty = Math.min(avgHateCrimes / 5, 20);
          baseScore -= hateCrimePenalty;
  }

  return {
          score: Math.max(0, Math.min(100, baseScore)),
          note,
  };
}

function calculateLgbtqScore(city: City, identity: IdentityProfile): number {
      let score = city.safety.lgbtqSafetyIndex;
      const isLgbtq =
              identity.sexualOrientation !== "" &&
              identity.sexualOrientation !== "Straight/Heterosexual";
      const isTransOrNonBinary =
              identity.genderIdentity !== "" &&
              !["Woman", "Man"].includes(identity.genderIdentity);

  if (isLgbtq || isTransOrNonBinary) {
          if (!city.political.lgbtqProtections) {
                    score -= 20;
          }
          // Issue #11 fix: logarithmic scale so high venue counts score meaningfully
        const venueBonus =
                  city.culture.lgbtqVenues > 0
              ? Math.min(20, Math.log10(city.culture.lgbtqVenues + 1) * 12)
                    : 0;
          score += venueBonus;
          score += city.demographics.lgbtqPopulation * 2;
  }
      return Math.max(0, Math.min(100, score));
}

function calculateDiversityScore(city: City, identity: IdentityProfile): number {
      let score = 50;
      if (identity.ethnicities.length > 0) {
              for (const ethnicity of identity.ethnicities) {
                        const percentage = city.demographics.ethnicBreakdown[ethnicity] || 0;
                        // Issue #9 fix: cap per-ethnicity contribution
                score += Math.min((percentage / 100) * 30, 15);
              }
      }
      const diversityIndex = Object.values(city.demographics.ethnicBreakdown).filter(
              (v) => v > 5
            ).length;
      score += diversityIndex * 5;
      return Math.max(0, Math.min(100, score));
}

function calculateCostScore(city: City, identity: IdentityProfile): number {
      const baseScore = 200 - city.costOfLivingIndex;
      let incomeMultiplier = 1;
      if (identity.incomeLevel) {
              if (
                        identity.incomeLevel.includes("Under") ||
                        identity.incomeLevel.includes("25,000")
                      ) {
                        incomeMultiplier = 1.5;
              } else if (identity.incomeLevel.includes("250,000")) {
                        incomeMultiplier = 0.5;
              }
      }
      return Math.max(0, Math.min(100, baseScore * incomeMultiplier));
}

function calculateJobScore(city: City, identity: IdentityProfile): number {
      let score = 100 - city.jobMarket.unemploymentRate * 10;
      if (identity.careerField === "Technology") {
              score += city.jobMarket.techHubScore * 0.3;
      }
      score += city.jobMarket.remoteWorkFriendly * 0.2;
      return Math.max(0, Math.min(100, score));
}

function calculateHealthcareScore(
      city: City,
      identity: IdentityProfile
    ): number {
      let score = city.healthcare.qualityIndex;
      const isLgbtq =
              identity.sexualOrientation !== "" &&
              identity.sexualOrientation !== "Straight/Heterosexual";
      if (isLgbtq) {
              score += Math.min(city.healthcare.lgbtqAffirmingProviders / 10, 15);
      }
      score += city.healthcare.mentalHealthAccess * 0.1;
      return Math.max(0, Math.min(100, score));
}

function calculateClimateScore(city: City, identity: IdentityProfile): number {
      const prefs = identity.climatePreferences || DEFAULT_CLIMATE_PREFERENCES;
      let score = 50;
      let totalPrefs = 0;

  if (prefs.temperaturePreference) {
          totalPrefs++;
          const avgTemp = city.climate.averageTemp;
          if (prefs.temperaturePreference === "cold" && avgTemp < 50) {
                    score += 15;
          } else if (
                    prefs.temperaturePreference === "mild" &&
                    avgTemp >= 50 &&
                    avgTemp < 65
                  ) {
                    score += 15;
          } else if (
                    prefs.temperaturePreference === "warm" &&
                    avgTemp >= 65 &&
                    avgTemp < 80
                  ) {
                    score += 15;
          } else if (prefs.temperaturePreference === "hot" && avgTemp >= 80) {
                    score += 15;
          } else {
                    const tempDiff = Math.abs(
                                avgTemp - getTargetTemp(prefs.temperaturePreference)
                              );
                    score += Math.max(0, 10 - tempDiff / 3);
          }
  }

  if (prefs.seasonPreference) {
          totalPrefs++;
          if (prefs.seasonPreference === city.climate.seasonType) {
                    score += 15;
          } else if (
                    (prefs.seasonPreference === "mild-winters" &&
                             city.climate.winterLowAvg > 35) ||
                    (prefs.seasonPreference === "no-winter" && city.climate.winterLowAvg > 50)
                  ) {
                    score += 10;
          }
  }

  if (prefs.precipitationPreference) {
          totalPrefs++;
          const rainfall = city.climate.annualRainfall;
          if (prefs.precipitationPreference === "dry" && rainfall < 20) {
                    score += 10;
          } else if (
                    prefs.precipitationPreference === "moderate" &&
                    rainfall >= 20 &&
                    rainfall <= 40
                  ) {
                    score += 10;
          } else if (prefs.precipitationPreference === "rainy" && rainfall > 40) {
                    score += 10;
          }
  }

  if (prefs.humidityPreference) {
          totalPrefs++;
          if (prefs.humidityPreference === city.climate.humidityLevel) {
                    score += 10;
          }
  }

  if (prefs.sunshinePreference) {
          totalPrefs++;
          const sunnyDays = city.climate.sunnyDays;
          if (prefs.sunshinePreference === "sunny" && sunnyDays >= 200) {
                    score += 10;
          } else if (
                    prefs.sunshinePreference === "mixed" &&
                    sunnyDays >= 150 &&
                    sunnyDays < 200
                  ) {
                    score += 10;
          } else if (prefs.sunshinePreference === "cloudy-ok" && sunnyDays < 180) {
                    score += 10;
          }
  }

  if (totalPrefs === 0) {
          score += city.climate.sunnyDays / 10;
          if (city.climate.averageTemp >= 50 && city.climate.averageTemp <= 75) {
                    score += 15;
          }
  }

  return Math.max(0, Math.min(100, score));
}

function getTargetTemp(preference: string): number {
      switch (preference) {
          case "cold": return 40;
          case "mild": return 57;
          case "warm": return 72;
          case "hot": return 85;
          default: return 60;
      }
}

function calculateTransitScore(city: City): number {
      return (
              city.transit.publicTransitScore * 0.5 +
              city.transit.walkabilityScore * 0.3 +
              city.transit.bikeability * 0.2
            );
}

function calculateCultureScore(city: City, identity: IdentityProfile): number {
      let score = 50;
      score += Math.min(city.culture.diverseRestaurants / 500, 20);
      score += city.culture.culturalInstitutions.length * 3;
      // Issue #13 fix: optional chaining for international cities
  if (identity.religion) {
          const count = city.culture.religiousInstitutions?.[identity.religion] ?? 0;
          score += Math.min(count / 5, 15);
  }
      const isLgbtq =
              identity.sexualOrientation !== "" &&
              identity.sexualOrientation !== "Straight/Heterosexual";
      if (isLgbtq) {
              score += Math.min(city.culture.lgbtqVenues / 5, 15);
      }
      return Math.max(0, Math.min(100, score));
}

function calculatePoliticalScore(city: City, identity: IdentityProfile): number {
      let score = 50;
      if (identity.politicalViews) {
              const isProgressive = ["Very Progressive", "Progressive"].includes(
                        identity.politicalViews
                      );
              const isConservative = ["Conservative", "Very Conservative"].includes(
                        identity.politicalViews
                      );
              if (isProgressive) {
                        score = city.political.progressiveScore;
              } else if (isConservative) {
                        score = 100 - city.political.progressiveScore;
              }
      }
      return Math.max(0, Math.min(100, score));
}

function generateHighlights(
      city: City,
      breakdown: CityScore["breakdown"],
      identity: IdentityProfile
    ): { highlights: ScoreHighlight[]; concerns: ScoreHighlight[] } {
      const highlights: ScoreHighlight[] = [];
      const concerns: ScoreHighlight[] = [];

  if (breakdown.lgbtqAcceptance >= 85) {
          highlights.push({
                    icon: "heart",
                    text: "Strong LGBTQ+ community & protections",
                    type: "positive",
          });
  } else if (breakdown.lgbtqAcceptance < 60) {
          concerns.push({
                    icon: "alert-circle",
                    text: "Limited LGBTQ+ protections",
                    type: "negative",
          });
  }

  if (breakdown.safety >= 80) {
          highlights.push({
                    icon: "shield",
                    text: "Low crime and high safety index",
                    type: "positive",
          });
  } else if (breakdown.safety < 50) {
          concerns.push({
                    icon: "alert-triangle",
                    text: "Higher crime rate in some areas",
                    type: "warning",
          });
  }

  if (breakdown.diversityInclusion >= 75) {
          const mainEthnicity = identity.ethnicities[0];
          if (mainEthnicity && city.demographics.ethnicBreakdown[mainEthnicity]) {
                    const pct = city.demographics.ethnicBreakdown[mainEthnicity];
                    highlights.push({
                                icon: "users",
                                text: `${pct}% ${mainEthnicity} population`,
                                type: "positive",
                    });
          }
  }

  if (breakdown.costOfLiving >= 75) {
          highlights.push({
                    icon: "dollar-sign",
                    text: "Affordable cost of living",
                    type: "positive",
          });
  } else if (breakdown.costOfLiving < 40) {
          concerns.push({
                    icon: "trending-up",
                    text: "High cost of living",
                    type: "warning",
          });
  }

  if (breakdown.publicTransit >= 80) {
          highlights.push({
                    icon: "navigation",
                    text: "Excellent public transit",
                    type: "positive",
          });
  } else if (breakdown.publicTransit < 50) {
          concerns.push({
                    icon: "map",
                    text: "Limited public transportation",
                    type: "warning",
          });
  }

  if (city.demographics.lgbtqPopulation >= 10) {
          highlights.push({
                    icon: "heart",
                    text: `${city.demographics.lgbtqPopulation.toFixed(1)}% LGBTQ+ population`,
                    type: "positive",
          });
  }

  if (identity.religion) {
          const count = city.culture.religiousInstitutions?.[identity.religion] ?? 0;
          if (count >= 20) {
                    highlights.push({
                                icon: "home",
                                text: `${count} ${identity.religion} institutions`,
                                type: "positive",
                    });
          } else if (count > 0 && count < 10) {
                    concerns.push({
                                icon: "home",
                                text: `Limited ${identity.religion} community presence`,
                                type: "warning",
                    });
          }
  }

  const prefs = identity.climatePreferences;
      if (prefs && breakdown.climate >= 75) {
              if (prefs.temperaturePreference) {
                        highlights.push({
                                    icon: "thermometer",
                                    text: `Climate matches your ${prefs.temperaturePreference} temperature preference`,
                                    type: "positive",
                        });
              }
              if (prefs.sunshinePreference === "sunny" && city.climate.sunnyDays >= 250) {
                        highlights.push({
                                    icon: "sun",
                                    text: `${city.climate.sunnyDays} sunny days per year`,
                                    type: "positive",
                        });
              }
      } else if (prefs && breakdown.climate < 50) {
              if (prefs.temperaturePreference) {
                        const tempLabel =
                                    prefs.temperaturePreference === "cold"
                            ? "cooler"
                                      : prefs.temperaturePreference === "hot"
                            ? "warmer"
                                      : "different";
                        concerns.push({
                                    icon: "thermometer",
                                    text: `Climate may be ${tempLabel} than preferred`,
                                    type: "warning",
                        });
              }
      }

  return {
          highlights: highlights.slice(0, 4),
          concerns: concerns.slice(0, 3),
  };
}

/**
 * Calculate the personalised score for a single city.
 *
 * Pass skipCache = true in contexts where real-time responsiveness matters
 * (e.g. InteractiveDemoScreen, ScenarioTestingScreen) to bypass the 5-minute
 * TTL cache entirely.
 *
 * Feature 3: Pass a scenarioIdentity / scenarioPriorities to compute a
 * hypothetical score without affecting the user's stored profile.
 */
export function calculateCityScore(
      city: City,
      identity: IdentityProfile,
      priorities: PriorityWeights,
      privacySettings?: PrivacySettings,
      skipCache = false
    ): CityScore {
      const effectivePrivacy = privacySettings || DEFAULT_PRIVACY_SETTINGS;
      const cacheKey = generateCacheKey(
              city.id,
              identity,
              priorities,
              effectivePrivacy
            );

  if (!skipCache) {
          const cached = getCachedScore(cacheKey);
          if (cached) return cached;
  }

  const effectiveIdentity = privacySettings
        ? applyPrivacyFilter(identity, privacySettings)
          : identity;

  // Feature 1: safety score now returns a note when personalised
  const { score: safetyScore, note: safetyNote } = calculateSafetyScore(
          city,
          effectiveIdentity
        );

  const breakdown = {
          safety: safetyScore,
          lgbtqAcceptance: calculateLgbtqScore(city, effectiveIdentity),
          diversityInclusion: calculateDiversityScore(city, effectiveIdentity),
          costOfLiving: calculateCostScore(city, effectiveIdentity),
          jobMarket: calculateJobScore(city, effectiveIdentity),
          healthcare: calculateHealthcareScore(city, effectiveIdentity),
          climate: calculateClimateScore(city, effectiveIdentity),
          publicTransit: calculateTransitScore(city),
          culturalInstitutions: calculateCultureScore(city, effectiveIdentity),
          politicalAlignment: calculatePoliticalScore(city, effectiveIdentity),
  };

  const weights = normalizeWeight(priorities);
      let overall = 0;
      overall += breakdown.safety * (weights.safety / 100);
      overall += breakdown.lgbtqAcceptance * (weights.lgbtqAcceptance / 100);
      overall += breakdown.diversityInclusion * (weights.diversityInclusion / 100);
      overall += breakdown.costOfLiving * (weights.costOfLiving / 100);
      overall += breakdown.jobMarket * (weights.jobMarket / 100);
      overall += breakdown.healthcare * (weights.healthcare / 100);
      overall += breakdown.climate * (weights.climate / 100);
      overall += breakdown.publicTransit * (weights.publicTransit / 100);
      overall += breakdown.culturalInstitutions * (weights.culturalInstitutions / 100);
      overall += breakdown.politicalAlignment * (weights.politicalAlignment / 100);

  const { highlights, concerns } = generateHighlights(
          city,
          breakdown,
          effectiveIdentity
        );

  const score: CityScore = {
          overall: Math.round(overall),
          breakdown,
          highlights,
          concerns,
          // Feature 1: attach personalisation note when hate crime data drove the score
          safetyPersonalisationNote: safetyNote ?? undefined,
  };

  if (!skipCache) {
          setCachedScore(cacheKey, score);
  }
      return score;
}

export function calculateAllCityScores(
      cities: City[],
      identity: IdentityProfile,
      priorities: PriorityWeights,
      privacySettings?: PrivacySettings
    ): CityWithScore[] {
      return cities
        .map((city) => ({
                  ...city,
                  personalizedScore: calculateCityScore(
                              city,
                              identity,
                              priorities,
                              privacySettings
                            ),
        }))
        .sort(
                  (a, b) =>
                              b.personalizedScore.overall - a.personalizedScore.overall
                );
}

/**
 * Anonymous mode scoring.
 *
 * Issue #7: Rather than flat 50s across the board, use real city data to
 * produce a "demographic default" preview score that differentiates cities
 * meaningfully. This teases the value of personalisation without revealing
 * any user-specific data.
 */
export function calculateAnonymousCityScore(city: City): CityScore {
      const normalizedCrime = normalizeCrimeRate(city.safety.overallCrimeRate);
      const breakdown = {
              safety: Math.max(0, Math.min(100, 100 - normalizedCrime)),
              lgbtqAcceptance: city.safety.lgbtqSafetyIndex,
              diversityInclusion: Math.min(
                        100,
                        Object.values(city.demographics.ethnicBreakdown).filter((v) => v > 5)
                          .length *
                          10 +
                          40
                      ),
              costOfLiving: Math.max(0, Math.min(100, 200 - city.costOfLivingIndex)),
              jobMarket:
                        city.jobMarket.unemploymentRate < 4
                          ? 80
                          : city.jobMarket.unemploymentRate < 6
                          ? 65
                          : 50,
              healthcare: city.healthcare.qualityIndex,
              climate:
                        city.climate.averageTemp > 50 && city.climate.averageTemp < 75
                          ? 75
                          : 55,
              publicTransit: city.transit.publicTransitScore,
              culturalInstitutions: Math.min(
                        100,
                        city.culture.culturalInstitutions.length * 15 +
                          (city.culture.lgbtqVenues > 0
                                     ? Math.log10(city.culture.lgbtqVenues + 1) * 10
                                     : 0)
                      ),
              politicalAlignment: city.political.progressiveScore,
      };

  Object.keys(breakdown).forEach((key) => {
          const k = key as keyof typeof breakdown;
          breakdown[k] = Math.max(0, Math.min(100, breakdown[k]));
  });

  const overall = Math.round(
          Object.values(breakdown).reduce((sum, val) => sum + val, 0) / 10
        );

  return {
          overall,
          breakdown,
          highlights: [
              {
                          icon: "info",
                          text: "General city statistics — create a profile for your personalised score",
                          type: "positive" as const,
              },
                  ],
          concerns: [
              {
                          icon: "user",
                          text: "Your personalised score could be significantly different",
                          type: "warning" as const,
              },
                  ],
  };
}

export function calculateAllAnonymousCityScores(
      cities: City[]
    ): CityWithScore[] {
      return cities
        .map((city) => ({
                  ...city,
                  personalizedScore: calculateAnonymousCityScore(city),
        }))
        .sort(
                  (a, b) => b.personalizedScore.overall - a.personalizedScore.overall
                );
}

/**
 * Feature 3 — Scenario Scoring
 *
 * Applies identity and/or priority overrides on top of the user's real
 * profile and returns a hypothetical score. Always bypasses the cache
 * (skipCache = true) since scenario scores are never stored.
 *
 * Usage:
 *   const scenarioScore = calculateScenarioCityScore(
 *     city,
 *     realProfile.identity,
 *     realProfile.priorities,
 *     { identityOverrides: { incomeLevel: "Under $25,000" }, priorityOverrides: { costOfLiving: 90 } }
 *   );
 */
export function calculateScenarioCityScore(
      city: City,
      baseIdentity: IdentityProfile,
      basePriorities: PriorityWeights,
      scenario: { identityOverrides?: Partial<IdentityProfile>; priorityOverrides?: Partial<PriorityWeights> }
    ): CityScore {
      const scenarioIdentity: IdentityProfile = scenario.identityOverrides
        ? { ...baseIdentity, ...scenario.identityOverrides }
              : baseIdentity;
      const scenarioPriorities: PriorityWeights = scenario.priorityOverrides
        ? { ...basePriorities, ...scenario.priorityOverrides }
              : basePriorities;

  return calculateCityScore(
          city,
          scenarioIdentity,
          scenarioPriorities,
          undefined, // no privacy filter in scenarios — user is exploring
          true // always skipCache for scenario scores
        );
}
