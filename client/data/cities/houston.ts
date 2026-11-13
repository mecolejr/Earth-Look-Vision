import { City } from "@/types";

export const houston: City = {
  "id": "houston",
  "name": "Houston",
  "country": "United States",
  "state": "Texas",
  "population": 2314000,
  "costOfLivingIndex": 96,
  "coordinates": {
    "lat": 29.7604,
    "lon": -95.3698
  },
  "demographics": {
    "totalPopulation": 2314000,
    "ethnicBreakdown": {
      "Hispanic/Latino": 44,
      "White/Caucasian": 24,
      "Black/African American": 22,
      "Asian": 7,
      "Multiracial": 2,
      "Other": 1
    },
    "lgbtqPopulation": 7.0,
    "religionBreakdown": {
      "Christian": 70,
      "None": 20,
      "Muslim": 3,
      "Jewish": 1,
      "Buddhist": 2,
      "Hindu": 2
    },
    "medianAge": 34
  },
  "safety": {
    "overallCrimeRate": 60,
    "hateCrimesByCategory": {
      "Race": 15,
      "Sexual Orientation": 9,
      "Religion": 4,
      "Gender Identity": 2
    },
    "discriminationReports": 290,
    "lgbtqSafetyIndex": 62,
    "policeAccountabilityScore": 50,
    "hateCrimesByBiasCategory": {
      "antiBlack": 0.2,
      "antiHispanic": 0.3,
      "antiGay": 0.4
    },
    "hateCrimeDataYear": 2023
  },
  "political": {
    "votingPatterns": {
      "democratic": 63,
      "republican": 28,
      "independent": 9
    },
    "lgbtqProtections": false,
    "reproductiveRights": false,
    "immigrationFriendly": true,
    "progressiveScore": 55
  },
  "climate": {
    "averageTemp": 70,
    "summerHighAvg": 94,
    "winterLowAvg": 43,
    "sunnyDays": 204,
    "annualRainfall": 50,
    "annualSnowfall": 0,
    "humidityLevel": "high",
    "seasonType": "no-winter",
    "type": "Humid subtropical"
  },
  "jobMarket": {
    "unemploymentRate": 4.7,
    "topIndustries": [
      "Energy",
      "Healthcare",
      "Aerospace",
      "Manufacturing",
      "Port & Logistics"
    ],
    "techHubScore": 72,
    "remoteWorkFriendly": 75
  },
  "healthcare": {
    "qualityIndex": 90,
    "lgbtqAffirmingProviders": 310,
    "mentalHealthAccess": 62
  },
  "transit": {
    "publicTransitScore": 36,
    "walkabilityScore": 47,
    "bikeability": 48
  },
  "culture": {
    "diverseRestaurants": 9500,
    "culturalInstitutions": [
      "Museum of Fine Arts Houston",
      "Space Center Houston",
      "Houston Grand Opera",
      "Montrose Center"
    ],
    "lgbtqVenues": 35,
    "religiousInstitutions": {
      "Christian": 1500,
      "Muslim": 80,
      "Jewish": 40,
      "Buddhist": 30,
      "Hindu": 25
    }
  }
};
