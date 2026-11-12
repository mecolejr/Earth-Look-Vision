import { City } from "@/types";

export const amsterdam: City = {
  "id": "amsterdam",
  "name": "Amsterdam",
  "country": "Netherlands",
  "population": 872680,
  "costOfLivingIndex": 112,
  "coordinates": {
    "lat": 52.3676,
    "lon": 4.9041
  },
  "demographics": {
    "totalPopulation": 872680,
    "ethnicBreakdown": {
      "White/Caucasian": 55,
      "Middle Eastern/North African": 18,
      "Asian": 10,
      "Black/African American": 8,
      "Hispanic/Latino": 5,
      "Other": 4
    },
    "lgbtqPopulation": 14.2,
    "religionBreakdown": {
      "None": 62,
      "Christian": 18,
      "Muslim": 12,
      "Other": 8
    },
    "medianAge": 37
  },
  "safety": {
    "overallCrimeRate": 32,
    "hateCrimesByCategory": {
      "Race": 55,
      "Sexual Orientation": 28,
      "Religion": 42,
      "Gender Identity": 15
    },
    "discriminationReports": 180,
    "lgbtqSafetyIndex": 95,
    "policeAccountabilityScore": 82,
    "hateCrimesByBiasCategory": {
      "antiBlack": 1.9,
      "antiWhite": 0.2,
      "antiHispanic": 0.4,
      "antiAsian": 0.7,
      "antiArab": 1.2,
      "antiNativeAmerican": 0,
      "antiJewish": 4.8,
      "antiMuslim": 1.4,
      "antiOtherReligion": 0.4,
      "antiGay": 3,
      "antiLesbian": 1.1,
      "antiBisexual": 0.2,
      "antiTransgender": 0.8,
      "antiGenderNonconforming": 0.5,
      "antiDisability": 0.1
    },
    "hateCrimeDataYear": 2022
  },
  "political": {
    "votingPatterns": {
      "democratic": 68,
      "republican": 18,
      "independent": 14
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 92
  },
  "climate": {
    "averageTemp": 52,
    "summerHighAvg": 73,
    "winterLowAvg": 36,
    "sunnyDays": 160,
    "annualRainfall": 24,
    "annualSnowfall": 2,
    "humidityLevel": "moderate",
    "seasonType": "mild-winters",
    "type": "Oceanic"
  },
  "jobMarket": {
    "unemploymentRate": 3.8,
    "topIndustries": [
      "Finance",
      "Technology",
      "Creative",
      "Tourism"
    ],
    "techHubScore": 85,
    "remoteWorkFriendly": 90
  },
  "healthcare": {
    "qualityIndex": 90,
    "lgbtqAffirmingProviders": 280,
    "mentalHealthAccess": 88
  },
  "transit": {
    "publicTransitScore": 90,
    "walkabilityScore": 88,
    "bikeability": 98
  },
  "culture": {
    "diverseRestaurants": 3200,
    "culturalInstitutions": [
      "Rijksmuseum",
      "Anne Frank House",
      "Van Gogh Museum"
    ],
    "lgbtqVenues": 75,
    "religiousInstitutions": {
      "Muslim": 45,
      "Jewish": 8,
      "Buddhist": 15,
      "Christian": 180
    }
  }
};
