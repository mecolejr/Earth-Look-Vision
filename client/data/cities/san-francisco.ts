import { City } from "@/types";

export const sanFrancisco: City = {
  "id": "san-francisco",
  "name": "San Francisco",
  "country": "United States",
  "state": "California",
  "population": 874961,
  "costOfLivingIndex": 179,
  "coordinates": {
    "lat": 37.7749,
    "lon": -122.4194
  },
  "demographics": {
    "totalPopulation": 874961,
    "ethnicBreakdown": {
      "Asian": 34,
      "White/Caucasian": 40,
      "Hispanic/Latino": 15,
      "Black/African American": 5,
      "Multiracial": 4,
      "Other": 2
    },
    "lgbtqPopulation": 15.4,
    "religionBreakdown": {
      "Christian": 35,
      "Buddhist": 8,
      "Jewish": 4,
      "Muslim": 2,
      "Hindu": 3,
      "None": 48
    },
    "medianAge": 38
  },
  "safety": {
    "overallCrimeRate": 65,
    "hateCrimesByCategory": {
      "Race": 45,
      "Sexual Orientation": 28,
      "Religion": 15,
      "Gender Identity": 12
    },
    "discriminationReports": 234,
    "lgbtqSafetyIndex": 92,
    "policeAccountabilityScore": 75,
    "hateCrimesByBiasCategory": {
      "antiBlack": 2.1,
      "antiWhite": 0.6,
      "antiHispanic": 1.1,
      "antiAsian": 3.4,
      "antiArab": 0.3,
      "antiNativeAmerican": 0.1,
      "antiJewish": 1.7,
      "antiMuslim": 0.2,
      "antiOtherReligion": 0.5,
      "antiGay": 2.4,
      "antiLesbian": 0.8,
      "antiBisexual": 0.2,
      "antiTransgender": 1.1,
      "antiGenderNonconforming": 0.9,
      "antiDisability": 0.1
    },
    "hateCrimeDataYear": 2023
  },
  "political": {
    "votingPatterns": {
      "democratic": 85,
      "republican": 10,
      "independent": 5
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 92
  },
  "climate": {
    "averageTemp": 57,
    "summerHighAvg": 68,
    "winterLowAvg": 46,
    "sunnyDays": 259,
    "annualRainfall": 24,
    "annualSnowfall": 0,
    "humidityLevel": "moderate",
    "seasonType": "mild-winters",
    "type": "Mediterranean"
  },
  "jobMarket": {
    "unemploymentRate": 3.2,
    "topIndustries": [
      "Technology",
      "Finance",
      "Healthcare",
      "Tourism"
    ],
    "techHubScore": 98,
    "remoteWorkFriendly": 95
  },
  "healthcare": {
    "qualityIndex": 92,
    "lgbtqAffirmingProviders": 450,
    "mentalHealthAccess": 88
  },
  "transit": {
    "publicTransitScore": 80,
    "walkabilityScore": 88,
    "bikeability": 72
  },
  "culture": {
    "diverseRestaurants": 4200,
    "culturalInstitutions": [
      "SFMOMA",
      "Asian Art Museum",
      "Castro Theatre",
      "GLBT Historical Society"
    ],
    "lgbtqVenues": 85,
    "religiousInstitutions": {
      "Buddhist": 45,
      "Jewish": 32,
      "Muslim": 12,
      "Hindu": 8,
      "Christian": 180
    }
  },
  "community": {
    "isVerified": true,
    "memberCount": 2450,
    "verifiedDate": "2025-08-15",
    "communityType": "lgbtq",
    "communityName": "SF Pride Community Network"
  },
  "sponsored": {
    "isSponsored": true,
    "sponsorName": "SF Welcome Center",
    "sponsorMessage": "Discover why San Francisco has been a haven for diverse communities for decades.",
    "featuredUntil": "2026-06-30"
  }
};
