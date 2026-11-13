import { City } from "@/types";

export const denver: City = {
  "id": "denver",
  "name": "Denver",
  "country": "United States",
  "state": "Colorado",
  "population": 716000,
  "costOfLivingIndex": 112,
  "coordinates": {
    "lat": 39.7392,
    "lon": -104.9903
  },
  "demographics": {
    "totalPopulation": 716000,
    "ethnicBreakdown": {
      "White/Caucasian": 54,
      "Hispanic/Latino": 29,
      "Black/African American": 9,
      "Asian": 4,
      "Multiracial": 3,
      "Other": 1
    },
    "lgbtqPopulation": 8.0,
    "religionBreakdown": {
      "Christian": 55,
      "None": 38,
      "Jewish": 2,
      "Muslim": 1,
      "Buddhist": 2,
      "Hindu": 1
    },
    "medianAge": 35
  },
  "safety": {
    "overallCrimeRate": 52,
    "hateCrimesByCategory": {
      "Race": 40,
      "Sexual Orientation": 18,
      "Religion": 8,
      "Gender Identity": 6
    },
    "discriminationReports": 160,
    "lgbtqSafetyIndex": 87,
    "policeAccountabilityScore": 62,
    "hateCrimesByBiasCategory": {
      "antiBlack": 3.4,
      "antiHispanic": 1.5,
      "antiAsian": 0.1,
      "antiGay": 2.1
    },
    "hateCrimeDataYear": 2023
  },
  "political": {
    "votingPatterns": {
      "democratic": 73,
      "republican": 18,
      "independent": 9
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 78
  },
  "climate": {
    "averageTemp": 51,
    "summerHighAvg": 89,
    "winterLowAvg": 18,
    "sunnyDays": 300,
    "annualRainfall": 15,
    "annualSnowfall": 57,
    "humidityLevel": "low",
    "seasonType": "four-seasons",
    "type": "Semi-arid"
  },
  "jobMarket": {
    "unemploymentRate": 4.5,
    "topIndustries": [
      "Technology",
      "Aerospace",
      "Energy",
      "Healthcare",
      "Outdoor Recreation"
    ],
    "techHubScore": 84,
    "remoteWorkFriendly": 90
  },
  "healthcare": {
    "qualityIndex": 84,
    "lgbtqAffirmingProviders": 240,
    "mentalHealthAccess": 78
  },
  "transit": {
    "publicTransitScore": 55,
    "walkabilityScore": 61,
    "bikeability": 70
  },
  "culture": {
    "diverseRestaurants": 2900,
    "culturalInstitutions": [
      "Denver Art Museum",
      "Red Rocks Amphitheatre",
      "Denver Center for the Performing Arts",
      "The Center on Colfax"
    ],
    "lgbtqVenues": 40,
    "religiousInstitutions": {
      "Christian": 500,
      "Jewish": 30,
      "Muslim": 15,
      "Buddhist": 20,
      "Hindu": 8
    }
  }
};
