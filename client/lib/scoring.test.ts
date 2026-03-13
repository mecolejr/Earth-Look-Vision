/**
 * Unit tests for scoring.ts
 *
 * Run with: npx vitest client/lib/scoring.test.ts
 *
 * Issue #24: Scoring functions are pure/deterministic — ideal for unit testing.
 * Install vitest as a devDependency to run these:
 *   npm install -D vitest
 */

import { describe, it, expect } from "vitest";
import {
    calculateCityScore,
    calculateAnonymousCityScore,
    clearScoreCache,
} from "./scoring";
import {
    DEFAULT_IDENTITY,
    DEFAULT_PRIORITIES,
    DEFAULT_PRIVACY_SETTINGS,
} from "@/types";
import type { City, IdentityProfile, PriorityWeights } from "@/types";

// ─── Minimal city fixture ────────────────────────────────────────────────────

const CITY_CHEAP: City = {
    id: "test-cheap",
    name: "Cheapville",
    state: "TX",
    country: "USA",
    coordinates: { lat: 30, lng: -97 },
    costOfLivingIndex: 80, // low cost → high score
    safety: {
          overallCrimeRate: 20,
          hateCrimesByCategory: { race: 1, lgbtq: 1, religion: 1, disability: 1 },
          lgbtqSafetyIndex: 70,
    },
    demographics: {
          population: 100000,
          lgbtqPopulation: 5,
          ethnicBreakdown: { "White": 70, "Hispanic": 20, "Black/African American": 10 },
    },
    political: { progressiveScore: 40, lgbtqProtections: false },
    jobMarket: {
          unemploymentRate: 4,
          techHubScore: 30,
          remoteWorkFriendly: 60,
    },
    healthcare: {
          qualityIndex: 65,
          lgbtqAffirmingProviders: 10,
          mentalHealthAccess: 60,
    },
    climate: {
          averageTemp: 70,
          seasonType: "mild",
          winterLowAvg: 40,
          annualRainfall: 30,
          humidityLevel: "moderate",
          sunnyDays: 220,
    },
    transit: {
          publicTransitScore: 40,
          walkabilityScore: 50,
          bikeability: 40,
    },
    culture: {
          lgbtqVenues: 5,
          diverseRestaurants: 200,
          culturalInstitutions: ["Museum", "Theater"],
          religiousInstitutions: { Christian: 50, Muslim: 5 },
    },
    sponsored: { isSponsored: false },
};

const CITY_EXPENSIVE: City = {
    ...CITY_CHEAP,
    id: "test-expensive",
    name: "Expenseville",
    costOfLivingIndex: 180, // high cost → low score
};

const CITY_SAFE_LGBTQ: City = {
    ...CITY_CHEAP,
    id: "test-lgbtq-friendly",
    name: "Rainbowtown",
    safety: {
          ...CITY_CHEAP.safety,
          lgbtqSafetyIndex: 95,
          overallCrimeRate: 20,
    },
    political: { progressiveScore: 90, lgbtqProtections: true },
    culture: {
          ...CITY_CHEAP.culture,
          lgbtqVenues: 80,
    },
    demographics: {
          ...CITY_CHEAP.demographics,
          lgbtqPopulation: 15,
    },
};

// ─── Identity fixtures ────────────────────────────────────────────────────────

const LGBTQ_IDENTITY: IdentityProfile = {
    ...DEFAULT_IDENTITY,
    sexualOrientation: "Gay",
    genderIdentity: "Non-binary",
};

const LOW_INCOME_IDENTITY: IdentityProfile = {
    ...DEFAULT_IDENTITY,
    incomeLevel: "Under $25,000",
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("calculateCityScore — cost of living", () => {
    beforeEach(() => clearScoreCache());

           it("scores a low-cost city higher than a high-cost city with default identity", () => {
                 const cheap = calculateCityScore(
                         CITY_CHEAP,
                         DEFAULT_IDENTITY,
                         DEFAULT_PRIORITIES
                       );
                 const expensive = calculateCityScore(
                         CITY_EXPENSIVE,
                         DEFAULT_IDENTITY,
                         DEFAULT_PRIORITIES
                       );
                 expect(cheap.breakdown.costOfLiving).toBeGreaterThan(
                         expensive.breakdown.costOfLiving
                       );
           });

           it("penalises high-cost cities more heavily for low-income users", () => {
                 const defaultScore = calculateCityScore(
                         CITY_EXPENSIVE,
                         DEFAULT_IDENTITY,
                         DEFAULT_PRIORITIES
                       );
                 const lowIncomeScore = calculateCityScore(
                         CITY_EXPENSIVE,
                         LOW_INCOME_IDENTITY,
                         DEFAULT_PRIORITIES
                       );
                 expect(lowIncomeScore.breakdown.costOfLiving).toBeLessThan(
                         defaultScore.breakdown.costOfLiving
                       );
           });
});

describe("calculateCityScore — LGBTQ+ acceptance", () => {
    beforeEach(() => clearScoreCache());

           it("scores LGBTQ+-friendly city higher for LGBTQ+ users", () => {
                 const friendlyScore = calculateCityScore(
                         CITY_SAFE_LGBTQ,
                         LGBTQ_IDENTITY,
                         DEFAULT_PRIORITIES
                       );
                 const unfriendlyScore = calculateCityScore(
                         CITY_CHEAP,
                         LGBTQ_IDENTITY,
                         DEFAULT_PRIORITIES
                       );
                 expect(friendlyScore.breakdown.lgbtqAcceptance).toBeGreaterThan(
                         unfriendlyScore.breakdown.lgbtqAcceptance
                       );
           });

           it("lgbtqAcceptance score is between 0 and 100", () => {
                 const score = calculateCityScore(
                         CITY_SAFE_LGBTQ,
                         LGBTQ_IDENTITY,
                         DEFAULT_PRIORITIES
                       );
                 expect(score.breakdown.lgbtqAcceptance).toBeGreaterThanOrEqual(0);
                 expect(score.breakdown.lgbtqAcceptance).toBeLessThanOrEqual(100);
           });
});

describe("calculateCityScore — safety formula (Issue #8)", () => {
    beforeEach(() => clearScoreCache());

           it("a city with overallCrimeRate=65 has a safety score above 0", () => {
                 const city: City = {
                         ...CITY_CHEAP,
                         safety: { ...CITY_CHEAP.safety, overallCrimeRate: 65 },
                 };
                 const score = calculateCityScore(city, DEFAULT_IDENTITY, DEFAULT_PRIORITIES);
                 // Before the fix this was returning 35 (100 - 65); now it should still be 35
                  // but importantly be > 0 and correctly reflect that 65/100 crime = 35/100 safety
                  expect(score.breakdown.safety).toBe(35);
                 expect(score.breakdown.safety).toBeGreaterThan(0);
           });

           it("a city with overallCrimeRate=100 has safety score near 0", () => {
                 const city: City = {
                         ...CITY_CHEAP,
                         safety: { ...CITY_CHEAP.safety, overallCrimeRate: 100 },
                 };
                 const score = calculateCityScore(city, DEFAULT_IDENTITY, DEFAULT_PRIORITIES);
                 expect(score.breakdown.safety).toBe(0);
           });
});

describe("calculateCityScore — diversity score (Issue #9)", () => {
    beforeEach(() => clearScoreCache());

           it("diversity score stays within 0-100 even with a high percentage match", () => {
                 const identity: IdentityProfile = {
                         ...DEFAULT_IDENTITY,
                         ethnicities: ["White"],
                 };
                 // White = 70% — before the fix this added 70 * 1.5 = 105 points, exceeding 100
                  const score = calculateCityScore(CITY_CHEAP, identity, DEFAULT_PRIORITIES);
                 expect(score.breakdown.diversityInclusion).toBeLessThanOrEqual(100);
                 expect(score.breakdown.diversityInclusion).toBeGreaterThanOrEqual(0);
           });
});

describe("calculateCityScore — skipCache flag (Issue #3)", () => {
    it("returns the same score regardless of skipCache value", () => {
          const cached = calculateCityScore(
                  CITY_CHEAP,
                  DEFAULT_IDENTITY,
                  DEFAULT_PRIORITIES,
                  undefined,
                  false
                );
          const noCache = calculateCityScore(
                  CITY_CHEAP,
                  DEFAULT_IDENTITY,
                  DEFAULT_PRIORITIES,
                  undefined,
                  true
                );
          expect(cached.overall).toBe(noCache.overall);
    });
});

describe("calculateAnonymousCityScore — differentiation (Issue #7)", () => {
    it("differentiates cities meaningfully (not all identical scores)", () => {
          const cheapScore = calculateAnonymousCityScore(CITY_CHEAP);
          const expensiveScore = calculateAnonymousCityScore(CITY_EXPENSIVE);
          expect(cheapScore.overall).not.toBe(expensiveScore.overall);
    });

           it("score is between 0 and 100", () => {
                 const score = calculateAnonymousCityScore(CITY_CHEAP);
                 expect(score.overall).toBeGreaterThanOrEqual(0);
                 expect(score.overall).toBeLessThanOrEqual(100);
           });
});
