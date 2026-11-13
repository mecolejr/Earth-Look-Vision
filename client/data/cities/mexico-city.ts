import { City } from "@/types";

// Sources: 2020 Census of Mexico (population); Wikipedia climate (Tacubaya station). Ethnic breakdown is a rough estimate: Mexican census does not use these categories.
// Not collected for this city: per-category hate-crime data (US FBI categories do not apply), so
// hateCrimesByCategory is empty and discriminationReports/policeAccountabilityScore are 0 (unused placeholders).
// Estimates (not from a published source): crime rate, LGBTQ safety index, LGBTQ population,
// venue/provider/restaurant/institution counts, transit/walk/bike scores, job-market scores, cost of living.
export const mexicoCity: City = {
  "id": "mexico-city",
  "name": "Mexico City",
  "country": "Mexico",
  "state": "Mexico City",
  "population": 9209944,
  "costOfLivingIndex": 62,
  "coordinates": {
    "lat": 19.4326,
    "lon": -99.1332
  },
  "demographics": {
    "totalPopulation": 9209944,
    "ethnicBreakdown": {
      "Hispanic/Latino": 83,
      "Native American": 9,
      "White/Caucasian": 5,
      "Black/African American": 2,
      "Other": 1
    },
    "lgbtqPopulation": 5.1,
    "religionBreakdown": {
      "Christian": 87,
      "None": 10,
      "Other": 3
    },
    "medianAge": 35
  },
  "safety": {
    "overallCrimeRate": 68,
    "hateCrimesByCategory": {},
    "discriminationReports": 0,
    "lgbtqSafetyIndex": 68,
    "policeAccountabilityScore": 0
  },
  "political": {
    "votingPatterns": {
      "democratic": 70,
      "republican": 15,
      "independent": 15
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 80
  },
  "climate": {
    "averageTemp": 65,
    "summerHighAvg": 82,
    "winterLowAvg": 47,
    "sunnyDays": 240,
    "annualRainfall": 33,
    "annualSnowfall": 0,
    "humidityLevel": "moderate",
    "seasonType": "mild-winters",
    "type": "Subtropical Highland"
  },
  "jobMarket": {
    "unemploymentRate": 4.5,
    "topIndustries": [
      "Services",
      "Finance",
      "Manufacturing",
      "Tourism",
      "Creative industries"
    ],
    "techHubScore": 60,
    "remoteWorkFriendly": 72
  },
  "healthcare": {
    "qualityIndex": 68,
    "lgbtqAffirmingProviders": 150,
    "mentalHealthAccess": 50
  },
  "transit": {
    "publicTransitScore": 75,
    "walkabilityScore": 70,
    "bikeability": 45
  },
  "culture": {
    "diverseRestaurants": 12000,
    "culturalInstitutions": [
      "Museo Nacional de Antropologia",
      "Frida Kahlo Museum",
      "Palacio de Bellas Artes",
      "Chapultepec Park"
    ],
    "lgbtqVenues": 90,
    "religiousInstitutions": {
      "Christian": 2500,
      "Jewish": 20,
      "Muslim": 8,
      "Buddhist": 10
    }
  }
};
