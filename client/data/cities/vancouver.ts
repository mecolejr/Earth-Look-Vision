import { City } from "@/types";

// Sources: 2021 Census of Canada (population, visible-minority and religion shares); Wikipedia climate (airport station).
// Not collected for this city: per-category hate-crime data (US FBI categories do not apply), so
// hateCrimesByCategory is empty and discriminationReports/policeAccountabilityScore are 0 (unused placeholders).
// Estimates (not from a published source): crime rate, LGBTQ safety index, LGBTQ population,
// venue/provider/restaurant/institution counts, transit/walk/bike scores, job-market scores, cost of living.
export const vancouver: City = {
  "id": "vancouver",
  "name": "Vancouver",
  "country": "Canada",
  "state": "British Columbia",
  "population": 662248,
  "costOfLivingIndex": 135,
  "coordinates": {
    "lat": 49.2827,
    "lon": -123.1207
  },
  "demographics": {
    "totalPopulation": 662248,
    "ethnicBreakdown": {
      "White/Caucasian": 43.2,
      "Asian": 46,
      "Black/African American": 1.3,
      "Middle Eastern/North African": 1.9,
      "Hispanic/Latino": 2,
      "Native American": 2.3,
      "Other": 3.3
    },
    "lgbtqPopulation": 4.2,
    "religionBreakdown": {
      "None": 55.8,
      "Christian": 29.9,
      "Buddhist": 4,
      "Muslim": 2.8,
      "Sikh": 2.5,
      "Hindu": 1.9,
      "Jewish": 1.8,
      "Other": 1.3
    },
    "medianAge": 40
  },
  "safety": {
    "overallCrimeRate": 45,
    "hateCrimesByCategory": {},
    "discriminationReports": 0,
    "lgbtqSafetyIndex": 90,
    "policeAccountabilityScore": 0
  },
  "political": {
    "votingPatterns": {
      "democratic": 72,
      "republican": 16,
      "independent": 12
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 82
  },
  "climate": {
    "averageTemp": 51,
    "summerHighAvg": 72,
    "winterLowAvg": 34,
    "sunnyDays": 185,
    "annualRainfall": 47,
    "annualSnowfall": 15,
    "humidityLevel": "high",
    "seasonType": "mild-winters",
    "type": "Oceanic"
  },
  "jobMarket": {
    "unemploymentRate": 5.7,
    "topIndustries": [
      "Film and TV",
      "Technology",
      "Tourism",
      "Port and logistics",
      "Forestry"
    ],
    "techHubScore": 78,
    "remoteWorkFriendly": 80
  },
  "healthcare": {
    "qualityIndex": 82,
    "lgbtqAffirmingProviders": 180,
    "mentalHealthAccess": 70
  },
  "transit": {
    "publicTransitScore": 80,
    "walkabilityScore": 78,
    "bikeability": 80
  },
  "culture": {
    "diverseRestaurants": 3500,
    "culturalInstitutions": [
      "Museum of Anthropology at UBC",
      "Vancouver Art Gallery",
      "Granville Island",
      "Chinese Classical Garden"
    ],
    "lgbtqVenues": 35,
    "religiousInstitutions": {
      "Christian": 300,
      "Buddhist": 40,
      "Sikh": 25,
      "Muslim": 20,
      "Hindu": 15
    }
  },
  "sources": ["unsourced — needs verification"],
  "lastUpdated": "2026-11"
};
