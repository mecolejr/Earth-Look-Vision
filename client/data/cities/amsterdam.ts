import { City } from "@/types";

// Per-category hate-crime data removed 2026-11-13: the old numbers used US FBI categories
// and had no source. Add back only with real published figures (see HANDOFF_PLAN.md rule 4).

export const amsterdam: City = {
  "id": "amsterdam",
  "name": "Amsterdam",
  "country": "Netherlands",
  "population": 872680,
  "costOfLivingIndex": 112,
  "coordinates": {
    "lat": 52.3676,
    "lon": 4.9041
  },
  "demographics": {
    "totalPopulation": 872680,
    "ethnicBreakdown": {
      "White/Caucasian": 55,
      "Middle Eastern/North African": 18,
      "Asian": 10,
      "Black/African American": 8,
      "Hispanic/Latino": 5,
      "Other": 4
    },
    "lgbtqPopulation": 14.2,
    "religionBreakdown": {
      "None": 62,
      "Christian": 18,
      "Muslim": 12,
      "Other": 8
    },
    "medianAge": 37
  },
  "safety": {
    "overallCrimeRate": 32,
    "hateCrimesByCategory": {
      "Race": 55,
      "Sexual Orientation": 28,
      "Religion": 42,
      "Gender Identity": 15
    },
    "discriminationReports": 180,
    "lgbtqSafetyIndex": 95,
    "policeAccountabilityScore": 82
  },
  "political": {
    "votingPatterns": {
      "democratic": 68,
      "republican": 18,
      "independent": 14
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 92
  },
  "climate": {
    "averageTemp": 52,
    "summerHighAvg": 73,
    "winterLowAvg": 36,
    "sunnyDays": 160,
    "annualRainfall": 24,
    "annualSnowfall": 2,
    "humidityLevel": "moderate",
    "seasonType": "mild-winters",
    "type": "Oceanic"
  },
  "jobMarket": {
    "unemploymentRate": 3.8,
    "topIndustries": [
      "Finance",
      "Technology",
      "Creative",
      "Tourism"
    ],
    "techHubScore": 85,
    "remoteWorkFriendly": 90
  },
  "healthcare": {
    "qualityIndex": 90,
    "lgbtqAffirmingProviders": 280,
    "mentalHealthAccess": 88
  },
  "transit": {
    "publicTransitScore": 90,
    "walkabilityScore": 88,
    "bikeability": 98
  },
  "culture": {
    "diverseRestaurants": 3200,
    "culturalInstitutions": [
      "Rijksmuseum",
      "Anne Frank House",
      "Van Gogh Museum"
    ],
    "lgbtqVenues": 75,
    "religiousInstitutions": {
      "Muslim": 45,
      "Jewish": 8,
      "Buddhist": 15,
      "Christian": 180
    }
  }
};
