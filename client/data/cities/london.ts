import { City } from "@/types";

// Sources: 2021 Census of England and Wales (population, ethnic group and religion shares). Climate from memory of Heathrow normals: please re-check.
// Not collected for this city: per-category hate-crime data (US FBI categories do not apply), so
// hateCrimesByCategory is empty and discriminationReports/policeAccountabilityScore are 0 (unused placeholders).
// Estimates (not from a published source): crime rate, LGBTQ safety index, LGBTQ population,
// venue/provider/restaurant/institution counts, transit/walk/bike scores, job-market scores, cost of living.
export const london: City = {
  "id": "london",
  "name": "London",
  "country": "United Kingdom",
  "state": "England",
  "population": 8799800,
  "costOfLivingIndex": 165,
  "coordinates": {
    "lat": 51.5074,
    "lon": -0.1278
  },
  "demographics": {
    "totalPopulation": 8799800,
    "ethnicBreakdown": {
      "White/Caucasian": 53.8,
      "Asian": 20.8,
      "Black/African American": 13.5,
      "Multiracial": 5.7,
      "Middle Eastern/North African": 2,
      "Other": 4.2
    },
    "lgbtqPopulation": 3.2,
    "religionBreakdown": {
      "Christian": 40.7,
      "Muslim": 15,
      "Hindu": 5.2,
      "Jewish": 1.7,
      "Sikh": 1.6,
      "Buddhist": 0.9,
      "None": 27,
      "Other": 7.9
    },
    "medianAge": 36
  },
  "safety": {
    "overallCrimeRate": 48,
    "hateCrimesByCategory": {},
    "discriminationReports": 0,
    "lgbtqSafetyIndex": 80,
    "policeAccountabilityScore": 0
  },
  "political": {
    "votingPatterns": {
      "democratic": 65,
      "republican": 22,
      "independent": 13
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 80
  },
  "climate": {
    "averageTemp": 52,
    "summerHighAvg": 75,
    "winterLowAvg": 37,
    "sunnyDays": 155,
    "annualRainfall": 24,
    "annualSnowfall": 2,
    "humidityLevel": "moderate",
    "seasonType": "four-seasons",
    "type": "Oceanic"
  },
  "jobMarket": {
    "unemploymentRate": 5.0,
    "topIndustries": [
      "Finance",
      "Technology",
      "Creative industries",
      "Professional services",
      "Tourism"
    ],
    "techHubScore": 88,
    "remoteWorkFriendly": 85
  },
  "healthcare": {
    "qualityIndex": 80,
    "lgbtqAffirmingProviders": 500,
    "mentalHealthAccess": 68
  },
  "transit": {
    "publicTransitScore": 85,
    "walkabilityScore": 72,
    "bikeability": 55
  },
  "culture": {
    "diverseRestaurants": 15000,
    "culturalInstitutions": [
      "British Museum",
      "Tate Modern",
      "V&A",
      "National Gallery"
    ],
    "lgbtqVenues": 150,
    "religiousInstitutions": {
      "Christian": 4000,
      "Muslim": 450,
      "Hindu": 170,
      "Jewish": 150,
      "Sikh": 60
    }
  },
  "sources": ["unsourced — needs verification"],
  "lastUpdated": "2026-11"
};
