import { City } from "@/types";

export const toronto: City = {
  "id": "toronto",
  "name": "Toronto",
  "country": "Canada",
  "state": "Ontario",
  "population": 2794356,
  "costOfLivingIndex": 128,
  "coordinates": {
    "lat": 43.6532,
    "lon": -79.3832
  },
  "demographics": {
    "totalPopulation": 2794356,
    "ethnicBreakdown": {
      "White/Caucasian": 48,
      "Asian": 35,
      "Black/African American": 9,
      "Hispanic/Latino": 3,
      "Middle Eastern/North African": 3,
      "Other": 2
    },
    "lgbtqPopulation": 9.8,
    "religionBreakdown": {
      "Christian": 55,
      "Muslim": 9,
      "Hindu": 6,
      "Buddhist": 3,
      "Jewish": 4,
      "None": 23
    },
    "medianAge": 40
  },
  "safety": {
    "overallCrimeRate": 35,
    "hateCrimesByCategory": {
      "Race": 85,
      "Sexual Orientation": 42,
      "Religion": 120,
      "Gender Identity": 18
    },
    "discriminationReports": 320,
    "lgbtqSafetyIndex": 90,
    "policeAccountabilityScore": 72,
    "hateCrimesByBiasCategory": {
      "antiBlack": 1.6,
      "antiWhite": 0.2,
      "antiHispanic": 0.4,
      "antiAsian": 1.1,
      "antiArab": 0.8,
      "antiNativeAmerican": 0.2,
      "antiJewish": 4.3,
      "antiMuslim": 2.9,
      "antiOtherReligion": 0.6,
      "antiGay": 1.5,
      "antiLesbian": 0.5,
      "antiBisexual": 0.1,
      "antiTransgender": 0.7,
      "antiGenderNonconforming": 0.4,
      "antiDisability": 0.1
    },
    "hateCrimeDataYear": 2022
  },
  "political": {
    "votingPatterns": {
      "democratic": 65,
      "republican": 25,
      "independent": 10
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 82
  },
  "climate": {
    "averageTemp": 45,
    "summerHighAvg": 73,
    "winterLowAvg": 22,
    "sunnyDays": 205,
    "annualRainfall": 38,
    "annualSnowfall": 35,
    "humidityLevel": "moderate",
    "seasonType": "four-seasons",
    "type": "Humid Continental"
  },
  "jobMarket": {
    "unemploymentRate": 5.8,
    "topIndustries": [
      "Finance",
      "Technology",
      "Film",
      "Healthcare"
    ],
    "techHubScore": 85,
    "remoteWorkFriendly": 82
  },
  "healthcare": {
    "qualityIndex": 88,
    "lgbtqAffirmingProviders": 380,
    "mentalHealthAccess": 78
  },
  "transit": {
    "publicTransitScore": 78,
    "walkabilityScore": 72,
    "bikeability": 65
  },
  "culture": {
    "diverseRestaurants": 8500,
    "culturalInstitutions": [
      "ROM",
      "AGO",
      "Aga Khan Museum",
      "Bata Shoe Museum"
    ],
    "lgbtqVenues": 55,
    "religiousInstitutions": {
      "Muslim": 65,
      "Hindu": 42,
      "Buddhist": 35,
      "Jewish": 48,
      "Christian": 680
    }
  }
};
