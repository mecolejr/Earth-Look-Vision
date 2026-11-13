import { City } from "@/types";

// Sources: 2021 Census of Portugal (population); Wikipedia climate. Ethnic breakdown is a rough estimate: Portugal does not record ethnicity in its census.
// Not collected for this city: per-category hate-crime data (US FBI categories do not apply), so
// hateCrimesByCategory is empty and discriminationReports/policeAccountabilityScore are 0 (unused placeholders).
// Estimates (not from a published source): crime rate, LGBTQ safety index, LGBTQ population,
// venue/provider/restaurant/institution counts, transit/walk/bike scores, job-market scores, cost of living.
export const lisbon: City = {
  "id": "lisbon",
  "name": "Lisbon",
  "country": "Portugal",
  "state": "Lisbon",
  "population": 545796,
  "costOfLivingIndex": 82,
  "coordinates": {
    "lat": 38.7223,
    "lon": -9.1393
  },
  "demographics": {
    "totalPopulation": 545796,
    "ethnicBreakdown": {
      "White/Caucasian": 80,
      "Black/African American": 8,
      "Asian": 5,
      "Hispanic/Latino": 5,
      "Other": 2
    },
    "lgbtqPopulation": 4.5,
    "religionBreakdown": {
      "Christian": 70,
      "None": 22,
      "Muslim": 3,
      "Hindu": 1,
      "Buddhist": 1,
      "Other": 3
    },
    "medianAge": 46
  },
  "safety": {
    "overallCrimeRate": 25,
    "hateCrimesByCategory": {},
    "discriminationReports": 0,
    "lgbtqSafetyIndex": 82,
    "policeAccountabilityScore": 0
  },
  "political": {
    "votingPatterns": {
      "democratic": 60,
      "republican": 25,
      "independent": 15
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 78
  },
  "climate": {
    "averageTemp": 64,
    "summerHighAvg": 84,
    "winterLowAvg": 48,
    "sunnyDays": 274,
    "annualRainfall": 31,
    "annualSnowfall": 0,
    "humidityLevel": "moderate",
    "seasonType": "mild-winters",
    "type": "Mediterranean"
  },
  "jobMarket": {
    "unemploymentRate": 6.0,
    "topIndustries": [
      "Tourism",
      "Finance",
      "Technology",
      "Media",
      "Shipping"
    ],
    "techHubScore": 70,
    "remoteWorkFriendly": 78
  },
  "healthcare": {
    "qualityIndex": 78,
    "lgbtqAffirmingProviders": 90,
    "mentalHealthAccess": 60
  },
  "transit": {
    "publicTransitScore": 72,
    "walkabilityScore": 78,
    "bikeability": 40
  },
  "culture": {
    "diverseRestaurants": 3000,
    "culturalInstitutions": [
      "National Tile Museum",
      "Gulbenkian Museum",
      "Belem Tower",
      "MAAT"
    ],
    "lgbtqVenues": 40,
    "religiousInstitutions": {
      "Christian": 300,
      "Muslim": 8,
      "Hindu": 4,
      "Buddhist": 4,
      "Jewish": 3
    }
  }
};
