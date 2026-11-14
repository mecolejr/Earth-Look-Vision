import { City } from "@/types";

// Sources: 2021 Census of Canada (population, visible-minority and religion shares); Wikipedia climate normals (Trudeau Airport 1991-2020).
// Not collected for this city: per-category hate-crime data (US FBI categories do not apply), so
// hateCrimesByCategory is empty and discriminationReports/policeAccountabilityScore are 0 (unused placeholders).
// Estimates (not from a published source): crime rate, LGBTQ safety index, LGBTQ population,
// venue/provider/restaurant/institution counts, transit/walk/bike scores, job-market scores, cost of living.
export const montreal: City = {
  "id": "montreal",
  "name": "Montreal",
  "country": "Canada",
  "state": "Quebec",
  "population": 1762949,
  "costOfLivingIndex": 105,
  "coordinates": {
    "lat": 45.5017,
    "lon": -73.5673
  },
  "demographics": {
    "totalPopulation": 1762949,
    "ethnicBreakdown": {
      "White/Caucasian": 60.3,
      "Black/African American": 11.5,
      "Middle Eastern/North African": 9.3,
      "Asian": 12.2,
      "Hispanic/Latino": 4.5,
      "Native American": 0.9,
      "Other": 1.3
    },
    "lgbtqPopulation": 4.4,
    "religionBreakdown": {
      "Christian": 49.5,
      "Muslim": 12,
      "Jewish": 5,
      "Hindu": 2,
      "Buddhist": 2,
      "None": 29.5
    },
    "medianAge": 40
  },
  "safety": {
    "overallCrimeRate": 30,
    "hateCrimesByCategory": {},
    "discriminationReports": 0,
    "lgbtqSafetyIndex": 88,
    "policeAccountabilityScore": 0
  },
  "political": {
    "votingPatterns": {
      "democratic": 70,
      "republican": 18,
      "independent": 12
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 80
  },
  "climate": {
    "averageTemp": 45,
    "summerHighAvg": 80,
    "winterLowAvg": 8,
    "sunnyDays": 195,
    "annualRainfall": 41,
    "annualSnowfall": 85,
    "humidityLevel": "moderate",
    "seasonType": "four-seasons",
    "type": "Humid Continental"
  },
  "jobMarket": {
    "unemploymentRate": 6.0,
    "topIndustries": [
      "Aerospace",
      "Video games and AI",
      "Finance",
      "Film and TV",
      "Higher education"
    ],
    "techHubScore": 72,
    "remoteWorkFriendly": 70
  },
  "healthcare": {
    "qualityIndex": 80,
    "lgbtqAffirmingProviders": 220,
    "mentalHealthAccess": 65
  },
  "transit": {
    "publicTransitScore": 80,
    "walkabilityScore": 76,
    "bikeability": 70
  },
  "culture": {
    "diverseRestaurants": 6500,
    "culturalInstitutions": [
      "Montreal Museum of Fine Arts",
      "Musee d'art contemporain",
      "Pointe-a-Calliere",
      "Jean-Talon Market"
    ],
    "lgbtqVenues": 70,
    "religiousInstitutions": {
      "Christian": 420,
      "Muslim": 60,
      "Jewish": 45,
      "Hindu": 15,
      "Buddhist": 20
    }
  },
  "sources": ["unsourced — needs verification"],
  "lastUpdated": "2026-11"
};
