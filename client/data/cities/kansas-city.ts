import { City } from "@/types";

export const kansasCity: City = {
  "id": "kansas-city",
  "name": "Kansas City",
  "country": "United States",
  "state": "Missouri",
  "population": 509000,
  "costOfLivingIndex": 90,
  "coordinates": {
    "lat": 39.0997,
    "lon": -94.5786
  },
  "demographics": {
    "totalPopulation": 509000,
    "ethnicBreakdown": {
      "White/Caucasian": 55,
      "Black/African American": 26,
      "Hispanic/Latino": 11,
      "Asian": 3,
      "Multiracial": 4,
      "Other": 1
    },
    "lgbtqPopulation": 6.5,
    "religionBreakdown": {
      "Christian": 70,
      "None": 25,
      "Jewish": 1,
      "Muslim": 2,
      "Buddhist": 1,
      "Hindu": 1
    },
    "medianAge": 35
  },
  "safety": {
    "overallCrimeRate": 62,
    "hateCrimesByCategory": {
      "Race": 25,
      "Sexual Orientation": 4,
      "Religion": 2,
      "Gender Identity": 5
    },
    "discriminationReports": 110,
    "lgbtqSafetyIndex": 78,
    "policeAccountabilityScore": 48,
    "hateCrimesByBiasCategory": {
      "antiBlack": 3.9,
      "antiHispanic": 1.2,
      "antiAsian": 0.2,
      "antiGay": 0.4,
      "antiTransgender": 1.0
    },
    "hateCrimeDataYear": 2023
  },
  "political": {
    "votingPatterns": {
      "democratic": 60,
      "republican": 30,
      "independent": 10
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 60
  },
  "climate": {
    "averageTemp": 56,
    "summerHighAvg": 90,
    "winterLowAvg": 22,
    "sunnyDays": 215,
    "annualRainfall": 39,
    "annualSnowfall": 15,
    "humidityLevel": "moderate",
    "seasonType": "four-seasons",
    "type": "Humid continental"
  },
  "jobMarket": {
    "unemploymentRate": 4.2,
    "topIndustries": [
      "Logistics",
      "Healthcare",
      "Technology",
      "Finance",
      "Engineering"
    ],
    "techHubScore": 65,
    "remoteWorkFriendly": 80
  },
  "healthcare": {
    "qualityIndex": 76,
    "lgbtqAffirmingProviders": 95,
    "mentalHealthAccess": 62
  },
  "transit": {
    "publicTransitScore": 34,
    "walkabilityScore": 45,
    "bikeability": 42
  },
  "culture": {
    "diverseRestaurants": 1600,
    "culturalInstitutions": [
      "Nelson-Atkins Museum of Art",
      "Kauffman Center for the Performing Arts",
      "18th & Vine Jazz District",
      "Kansas City Center for Inclusion"
    ],
    "lgbtqVenues": 18,
    "religiousInstitutions": {
      "Christian": 700,
      "Jewish": 15,
      "Muslim": 12,
      "Buddhist": 6,
      "Hindu": 4
    }
  }
};
