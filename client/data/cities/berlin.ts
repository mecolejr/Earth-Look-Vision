import { City } from "@/types";

export const berlin: City = {
  "id": "berlin",
  "name": "Berlin",
  "country": "Germany",
  "population": 3644826,
  "costOfLivingIndex": 89,
  "coordinates": {
    "lat": 52.52,
    "lon": 13.405
  },
  "demographics": {
    "totalPopulation": 3644826,
    "ethnicBreakdown": {
      "White/Caucasian": 75,
      "Middle Eastern/North African": 10,
      "Asian": 5,
      "Black/African American": 3,
      "Hispanic/Latino": 2,
      "Other": 5
    },
    "lgbtqPopulation": 12.5,
    "religionBreakdown": {
      "Christian": 32,
      "Muslim": 10,
      "Jewish": 1,
      "None": 55,
      "Other": 2
    },
    "medianAge": 42
  },
  "safety": {
    "overallCrimeRate": 42,
    "hateCrimesByCategory": {
      "Race": 95,
      "Sexual Orientation": 35,
      "Religion": 75,
      "Gender Identity": 22
    },
    "discriminationReports": 280,
    "lgbtqSafetyIndex": 88,
    "policeAccountabilityScore": 78,
    "hateCrimesByBiasCategory": {
      "antiBlack": 2.3,
      "antiWhite": 0.1,
      "antiHispanic": 0.3,
      "antiAsian": 0.8,
      "antiArab": 1.4,
      "antiNativeAmerican": 0,
      "antiJewish": 2.6,
      "antiMuslim": 1.1,
      "antiOtherReligion": 0.3,
      "antiGay": 0.9,
      "antiLesbian": 0.4,
      "antiBisexual": 0.1,
      "antiTransgender": 0.6,
      "antiGenderNonconforming": 0.3,
      "antiDisability": 0.2
    },
    "hateCrimeDataYear": 2023
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
    "progressiveScore": 85
  },
  "climate": {
    "averageTemp": 49,
    "summerHighAvg": 65,
    "winterLowAvg": 36,
    "sunnyDays": 166,
    "annualRainfall": 50,
    "annualSnowfall": 4,
    "humidityLevel": "high",
    "seasonType": "mild-winters",
    "type": "Oceanic"
  },
  "jobMarket": {
    "unemploymentRate": 6.2,
    "topIndustries": [
      "Technology",
      "Arts",
      "Government",
      "Tourism"
    ],
    "techHubScore": 88,
    "remoteWorkFriendly": 88
  },
  "healthcare": {
    "qualityIndex": 92,
    "lgbtqAffirmingProviders": 420,
    "mentalHealthAccess": 85
  },
  "transit": {
    "publicTransitScore": 92,
    "walkabilityScore": 85,
    "bikeability": 90
  },
  "culture": {
    "diverseRestaurants": 7500,
    "culturalInstitutions": [
      "Jewish Museum",
      "Schwules Museum",
      "Hamburger Bahnhof"
    ],
    "lgbtqVenues": 120,
    "religiousInstitutions": {
      "Muslim": 80,
      "Jewish": 12,
      "Buddhist": 25,
      "Christian": 320
    }
  }
};
