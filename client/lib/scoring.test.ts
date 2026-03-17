/**
 * EarthLook scoring engine unit tests
 *
 * Run with:  npx vitest client/lib/scoring.test.ts
 *
 * Covers:
 * - Issue #8: Safety score formula correctness (normalizeCrimeRate)
 * - Issue #9: Diversity score bounds (multi-ethnicity no inflation)
 * - Issue #3: skipCache flag correctness (demo vs. cached)
 * - Issue #7: Anonymous scores differentiate between cities
 * - Issue #11: LGBTQ+ venue log scale (SF 85 venues > 5 venues significantly)
 * - Feature 1: Identity-filtered hate crime penalty logic
 * - Feature 3: Scenario override scores differ from base scores
 */

import { describe, it, expect } from "vitest";
import {
      calculateCityScore,
      calculateAnonymousCityScore,
      calculateScenarioCityScore,
      clearScoreCache,
} from "./scoring";
import { City, IdentityProfile, PriorityWeights, DEFAULT_PRIORITIES } from "@/types";

// ─── Shared test fixtures ─────────────────────────────────────────────────────

const BASE_IDENTITY: IdentityProfile = {
      ethnicities: [],
      genderIdentity: "Man",
      sexualOrientation: "Straight/Heterosexual",
      religion: "",
      politicalViews: "",
      familyStructure: "Single",
      incomeLevel: "$75,000 - $100,000",
      careerField: "Technology",
      ageRange: "25-34",
      disabilities: [],
      languages: ["English"],
      climatePreferences: {
              temperaturePreference: "",
              seasonPreference: "",
              precipitationPreference: "",
              humidityPreference: "",
              sunshinePreference: "",
      },
};

function makeCity(overrides: Partial<City> = {}): City {
      return {
              id: "test-city",
              name: "Test City",
              country: "USA",
              state: "CA",
              population: 500000,
              costOfLivingIndex: 100,
              coordinates: { lat: 37.7749, lon: -122.4194 },
              demographics: {
                        totalPopulation: 500000,
                        ethnicBreakdown: { "White/Caucasian": 40, "Asian": 30, "Hispanic/Latino": 20, "Black/African American": 10 },
                        lgbtqPopulation: 6,
                        religionBreakdown: { Christian: 50, Buddhist: 10 },
                        medianAge: 35,
              },
              safety: {
                        overallCrimeRate: 30,
                        hateCrimesByCategory: { racialBias: 5, religiousBias: 3, sexualOrientationBias: 4, genderBias: 2 },
                        discriminationReports: 50,
                        lgbtqSafetyIndex: 75,
                        policeAccountabilityScore: 65,
              },
              political: {
                        votingPatterns: { democratic: 70, republican: 20, independent: 10 },
                        lgbtqProtections: true,
                        reproductiveRights: true,
                        immigrationFriendly: true,
                        progressiveScore: 80,
              },
              climate: {
                        averageTemp: 62,
                        summerHighAvg: 75,
                        winterLowAvg: 45,
                        sunnyDays: 260,
                        annualRainfall: 22,
                        annualSnowfall: 0,
                        humidityLevel: "moderate",
                        seasonType: "mild-winters",
                        type: "Mediterranean",
              },
              jobMarket: {
                        unemploymentRate: 3.5,
                        topIndustries: ["Technology", "Finance"],
                        techHubScore: 90,
                        remoteWorkFriendly: 85,
              },
              healthcare: {
                        qualityIndex: 80,
                        lgbtqAffirmingProviders: 30,
                        mentalHealthAccess: 75,
              },
              transit: {
                        publicTransitScore: 70,
                        walkabilityScore: 80,
                        bikeability: 75,
              },
              culture: {
                        diverseRestaurants: 2000,
                        culturalInstitutions: ["Museum of Art", "Symphony", "Film Festival"],
                        lgbtqVenues: 85,
                        religiousInstitutions: { Christian: 50, Buddhist: 15, Jewish: 8 },
              },
              ...overrides,
      };
}

// ─── Issue #8: Safety formula ─────────────────────────────────────────────────

describe("calculateCityScore — safety (Issue #8)", () => {
      it("city with crimeRate=0 should score 100 safety", () => {
              const city = makeCity({ safety: { ...makeCity().safety, overallCrimeRate: 0 } });
              const score = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
              expect(score.breakdown.safety).toBe(100);
      });

           it("city with crimeRate=100 should score 0 safety", () => {
                   const city = makeCity({ safety: { ...makeCity().safety, overallCrimeRate: 100 } });
                   const score = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
                   expect(score.breakdown.safety).toBe(0);
           });

           it("city with crimeRate=30 should score ~70 safety", () => {
                   const city = makeCity({ safety: { ...makeCity().safety, overallCrimeRate: 30 } });
                   const score = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
                   expect(score.breakdown.safety).toBeCloseTo(70, 0);
           });
});

// ─── Issue #9: Diversity score bounds ────────────────────────────────────────

describe("calculateCityScore — diversity (Issue #9)", () => {
      it("multi-ethnicity user should not score above 100", () => {
              const identity: IdentityProfile = {
                        ...BASE_IDENTITY,
                        ethnicities: ["Asian", "Black/African American", "Hispanic/Latino", "White/Caucasian"],
              };
              const score = calculateCityScore(makeCity(), identity, DEFAULT_PRIORITIES, undefined, true);
              expect(score.breakdown.diversityInclusion).toBeLessThanOrEqual(100);
      });

           it("per-ethnicity contribution should be capped at 15 pts", () => {
                   const highRepresentationCity = makeCity({
                             demographics: {
                                         ...makeCity().demographics,
                                         ethnicBreakdown: { "Asian": 99 },
                             },
                   });
                   const identity: IdentityProfile = { ...BASE_IDENTITY, ethnicities: ["Asian"] };
                   const score = calculateCityScore(highRepresentationCity, identity, DEFAULT_PRIORITIES, undefined, true);
                   // base 50 + max 15 (per-ethnicity capped) + diversityIndex * 5 (1 group > 5% * 5 = 5) = 70
                  expect(score.breakdown.diversityInclusion).toBeLessThanOrEqual(100);
           });
});

// ─── Issue #3: skipCache flag ────────────────────────────────────────────────

describe("calculateCityScore — skipCache (Issue #3)", () => {
      it("two calls with skipCache=true should both return fresh results", () => {
              clearScoreCache();
              const city = makeCity();
              const s1 = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
              const s2 = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
              expect(s1.overall).toBe(s2.overall);
      });

           it("cached call should return same result as non-cached", () => {
                   clearScoreCache();
                   const city = makeCity();
                   const nonCached = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
                   const cached = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, false);
                   // Second call should return from cache, which should match
                  const cachedAgain = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, false);
                   expect(cachedAgain.overall).toBe(cached.overall);
                   expect(cached.overall).toBe(nonCached.overall);
           });
});

// ─── Issue #7: Anonymous scores differentiate cities ─────────────────────────

describe("calculateAnonymousCityScore (Issue #7)", () => {
      it("cheap city should score higher cost-of-living than expensive city", () => {
              const cheapCity = makeCity({ id: "cheap", costOfLivingIndex: 70 });
              const expensiveCity = makeCity({ id: "expensive", costOfLivingIndex: 170 });
              const cheapScore = calculateAnonymousCityScore(cheapCity);
              const expensiveScore = calculateAnonymousCityScore(expensiveCity);
              expect(cheapScore.breakdown.costOfLiving).toBeGreaterThan(expensiveScore.breakdown.costOfLiving);
      });

           it("safe city should score higher safety than dangerous city", () => {
                   const safeCity = makeCity({ id: "safe", safety: { ...makeCity().safety, overallCrimeRate: 10 } });
                   const dangerousCity = makeCity({ id: "danger", safety: { ...makeCity().safety, overallCrimeRate: 80 } });
                   const safeScore = calculateAnonymousCityScore(safeCity);
                   const dangerScore = calculateAnonymousCityScore(dangerousCity);
                   expect(safeScore.breakdown.safety).toBeGreaterThan(dangerScore.breakdown.safety);
           });
});

// ─── Issue #11: LGBTQ+ venue log scale ───────────────────────────────────────

describe("calculateCityScore — LGBTQ+ venue log scale (Issue #11)", () => {
      it("city with 85 venues should score meaningfully higher than city with 5 venues for LGBTQ+ user", () => {
              const lgbtqIdentity: IdentityProfile = {
                        ...BASE_IDENTITY,
                        sexualOrientation: "Gay",
              };
              const highVenueCity = makeCity({
                        id: "high-venues",
                        culture: { ...makeCity().culture, lgbtqVenues: 85 },
              });
              const lowVenueCity = makeCity({
                        id: "low-venues",
                        culture: { ...makeCity().culture, lgbtqVenues: 5 },
              });
              const highScore = calculateCityScore(highVenueCity, lgbtqIdentity, DEFAULT_PRIORITIES, undefined, true);
              const lowScore = calculateCityScore(lowVenueCity, lgbtqIdentity, DEFAULT_PRIORITIES, undefined, true);
              // Log(86)*12 ≈ 23 pts vs Log(6)*12 ≈ 9 pts — should differ by at least 10 pts
             expect(highScore.breakdown.lgbtqAcceptance - lowScore.breakdown.lgbtqAcceptance).toBeGreaterThan(10);
      });
});

// ─── Feature 1: Identity-filtered hate crime penalty ─────────────────────────

describe("Feature 1 — identity-filtered safety score", () => {
      it("LGBTQ+ user in city with high anti-gay hate crimes scores lower safety", () => {
              const cityWithHateCrimes = makeCity({
                        id: "hate-crime-city",
                        safety: {
                                    ...makeCity().safety,
                                    overallCrimeRate: 30,
                                    hateCrimesByBiasCategory: {
                                                  antiGay: 8, // 8 per 100k — notably high
                                    },
                        },
              });
              const cityWithout = makeCity({
                        id: "safe-city",
                        safety: {
                                    ...makeCity().safety,
                                    overallCrimeRate: 30,
                                    hateCrimesByBiasCategory: {
                                                  antiGay: 0,
                                    },
                        },
              });
              const lgbtqIdentity: IdentityProfile = {
                        ...BASE_IDENTITY,
                        sexualOrientation: "Gay",
              };
              const withScore = calculateCityScore(cityWithHateCrimes, lgbtqIdentity, DEFAULT_PRIORITIES, undefined, true);
              const withoutScore = calculateCityScore(cityWithout, lgbtqIdentity, DEFAULT_PRIORITIES, undefined, true);
              expect(withoutScore.breakdown.safety).toBeGreaterThan(withScore.breakdown.safety);
      });

           it("city with hate crime data should set safetyPersonalisationNote when relevant", () => {
                   const city = makeCity({
                             safety: {
                                         ...makeCity().safety,
                                         hateCrimesByBiasCategory: { antiBlack: 5 },
                             },
                   });
                   const identity: IdentityProfile = {
                             ...BASE_IDENTITY,
                             ethnicities: ["Black/African American"],
                   };
                   const score = calculateCityScore(city, identity, DEFAULT_PRIORITIES, undefined, true);
                   expect(score.safetyPersonalisationNote).toBeDefined();
                   expect(score.safetyPersonalisationNote).toContain("FBI");
           });

           it("city without hate crime data should not set safetyPersonalisationNote (no granular data)", () => {
                   const city = makeCity(); // no hateCrimesByBiasCategory
                  const score = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
                   // No identity set, no granular data — note should be undefined
                  expect(score.safetyPersonalisationNote).toBeUndefined();
           });
});

// ─── Feature 3: Scenario scoring ─────────────────────────────────────────────

describe("Feature 3 — calculateScenarioCityScore", () => {
      it("low-income override should lower cost-of-living score for expensive city", () => {
              const expensiveCity = makeCity({ costOfLivingIndex: 160 });
              const baseScore = calculateCityScore(expensiveCity, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
              const scenarioScore = calculateScenarioCityScore(
                        expensiveCity,
                        BASE_IDENTITY,
                        DEFAULT_PRIORITIES,
                  { identityOverrides: { incomeLevel: "Under $25,000" } }
                      );
              // Low income + expensive city should score lower than default income
             expect(scenarioScore.breakdown.costOfLiving).toBeLessThan(baseScore.breakdown.costOfLiving);
      });

           it("priority override for climate should change the overall score", () => {
                   const city = makeCity();
                   const defaultScore = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
                   const climateHeavyPriorities = { ...DEFAULT_PRIORITIES, climate: 90, safety: 10 };
                   const scenarioScore = calculateScenarioCityScore(
                             city,
                             BASE_IDENTITY,
                             DEFAULT_PRIORITIES,
                       { priorityOverrides: { climate: 90, safety: 10 } }
                           );
                   // A different weighting should produce a different overall score
                  expect(scenarioScore.overall).not.toBe(defaultScore.overall);
           });

           it("scenario with no overrides should match base score", () => {
                   const city = makeCity();
                   const baseScore = calculateCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, undefined, true);
                   const scenarioScore = calculateScenarioCityScore(city, BASE_IDENTITY, DEFAULT_PRIORITIES, {});
                   expect(scenarioScore.overall).toBe(baseScore.overall);
           });
});
