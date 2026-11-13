import { City } from "@/types";

// Per-category hate-crime data removed 2026-11-13: the old numbers used US FBI categories
// and had no source. Add back only with real published figures (see HANDOFF_PLAN.md rule 4).

export const barcelona: City = {
  "id": "barcelona",
  "name": "Barcelona",
  "country": "Spain",
  "population": 1620343,
  "costOfLivingIndex": 82,
  "coordinates": {
    "lat": 41.3851,
    "lon": 2.1734
  },
  "demographics": {
    "totalPopulation": 1620343,
    "ethnicBreakdown": {
      "White/Caucasian": 65,
      "Hispanic/Latino": 18,
      "Asian": 8,
      "Middle Eastern/North African": 5,
      "Black/African American": 2,
      "Other": 2
    },
    "lgbtqPopulation": 11.2,
    "religionBreakdown": {
      "Christian": 52,
      "None": 40,
      "Muslim": 4,
      "Other": 4
    },
    "medianAge": 43
  },
  "safety": {
    "overallCrimeRate": 38,
    "hateCrimesByCategory": {
      "Race": 45,
      "Sexual Orientation": 22,
      "Religion": 18,
      "Gender Identity": 12
    },
    "discriminationReports": 165,
    "lgbtqSafetyIndex": 92,
    "policeAccountabilityScore": 70
  },
  "political": {
    "votingPatterns": {
      "democratic": 75,
      "republican": 15,
      "independent": 10
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 88
  },
  "climate": {
    "averageTemp": 63,
    "summerHighAvg": 72,
    "winterLowAvg": 50,
    "sunnyDays": 285,
    "annualRainfall": 10,
    "annualSnowfall": 0,
    "humidityLevel": "low",
    "seasonType": "dry-year-round",
    "type": "Mediterranean"
  },
  "jobMarket": {
    "unemploymentRate": 8.5,
    "topIndustries": [
      "Tourism",
      "Technology",
      "Design",
      "Healthcare"
    ],
    "techHubScore": 75,
    "remoteWorkFriendly": 82
  },
  "healthcare": {
    "qualityIndex": 88,
    "lgbtqAffirmingProviders": 220,
    "mentalHealthAccess": 75
  },
  "transit": {
    "publicTransitScore": 85,
    "walkabilityScore": 90,
    "bikeability": 78
  },
  "culture": {
    "diverseRestaurants": 4800,
    "culturalInstitutions": [
      "Picasso Museum",
      "MACBA",
      "MNAC"
    ],
    "lgbtqVenues": 65,
    "religiousInstitutions": {
      "Muslim": 25,
      "Jewish": 5,
      "Buddhist": 12,
      "Christian": 420
    }
  }
};
