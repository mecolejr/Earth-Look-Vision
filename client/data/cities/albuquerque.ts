import { City } from "@/types";

export const albuquerque: City = {
  "id": "albuquerque",
  "name": "Albuquerque",
  "country": "United States",
  "state": "New Mexico",
  "population": 563000,
  "costOfLivingIndex": 88,
  "coordinates": {
    "lat": 35.0844,
    "lon": -106.6504
  },
  "demographics": {
    "totalPopulation": 563000,
    "ethnicBreakdown": {
      "Hispanic/Latino": 50,
      "White/Caucasian": 36,
      "Native American": 5,
      "Black/African American": 3,
      "Asian": 3,
      "Multiracial": 3
    },
    "lgbtqPopulation": 7.5,
    "religionBreakdown": {
      "Christian": 65,
      "None": 29,
      "Jewish": 1,
      "Muslim": 1,
      "Buddhist": 2,
      "Hindu": 1
    },
    "medianAge": 37
  },
  "safety": {
    "overallCrimeRate": 66,
    "hateCrimesByCategory": {
      "Race": 8,
      "Sexual Orientation": 4,
      "Religion": 2,
      "Gender Identity": 2
    },
    "discriminationReports": 85,
    "lgbtqSafetyIndex": 80,
    "policeAccountabilityScore": 42
  },
  "political": {
    "votingPatterns": {
      "democratic": 60,
      "republican": 28,
      "independent": 12
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 66
  },
  "climate": {
    "averageTemp": 57,
    "summerHighAvg": 92,
    "winterLowAvg": 26,
    "sunnyDays": 310,
    "annualRainfall": 9,
    "annualSnowfall": 10,
    "humidityLevel": "low",
    "seasonType": "four-seasons",
    "type": "High desert"
  },
  "jobMarket": {
    "unemploymentRate": 4.4,
    "topIndustries": [
      "Government & National Labs",
      "Film Production",
      "Healthcare",
      "Aerospace",
      "Technology"
    ],
    "techHubScore": 62,
    "remoteWorkFriendly": 75
  },
  "healthcare": {
    "qualityIndex": 70,
    "lgbtqAffirmingProviders": 85,
    "mentalHealthAccess": 58
  },
  "transit": {
    "publicTransitScore": 30,
    "walkabilityScore": 43,
    "bikeability": 55
  },
  "culture": {
    "diverseRestaurants": 1100,
    "culturalInstitutions": [
      "Indian Pueblo Cultural Center",
      "ABQ BioPark",
      "KiMo Theatre",
      "Transgender Resource Center of New Mexico"
    ],
    "lgbtqVenues": 12,
    "religiousInstitutions": {
      "Christian": 400,
      "Jewish": 8,
      "Muslim": 5,
      "Buddhist": 10,
      "Hindu": 3
    }
  }
};
