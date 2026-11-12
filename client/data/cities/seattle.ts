import { City } from "@/types";

export const seattle: City = {
  "id": "seattle",
  "name": "Seattle",
  "country": "United States",
  "state": "Washington",
  "population": 737015,
  "costOfLivingIndex": 152,
  "coordinates": {
    "lat": 47.6062,
    "lon": -122.3321
  },
  "demographics": {
    "totalPopulation": 737015,
    "ethnicBreakdown": {
      "White/Caucasian": 62,
      "Asian": 16,
      "Black/African American": 7,
      "Hispanic/Latino": 7,
      "Multiracial": 5,
      "Other": 3
    },
    "lgbtqPopulation": 12.9,
    "religionBreakdown": {
      "None": 52,
      "Christian": 38,
      "Buddhist": 3,
      "Jewish": 2,
      "Other": 5
    },
    "medianAge": 35
  },
  "safety": {
    "overallCrimeRate": 52,
    "hateCrimesByCategory": {
      "Race": 42,
      "Sexual Orientation": 25,
      "Religion": 18,
      "Gender Identity": 12
    },
    "discriminationReports": 195,
    "lgbtqSafetyIndex": 90,
    "policeAccountabilityScore": 68,
    "hateCrimesByBiasCategory": {
      "antiBlack": 2.6,
      "antiWhite": 0.5,
      "antiHispanic": 0.9,
      "antiAsian": 2,
      "antiArab": 0.3,
      "antiNativeAmerican": 0.4,
      "antiJewish": 2.4,
      "antiMuslim": 0.5,
      "antiOtherReligion": 0.5,
      "antiGay": 3.1,
      "antiLesbian": 1,
      "antiBisexual": 0.3,
      "antiTransgender": 1.3,
      "antiGenderNonconforming": 0.8,
      "antiDisability": 0.2
    },
    "hateCrimeDataYear": 2023
  },
  "political": {
    "votingPatterns": {
      "democratic": 79,
      "republican": 15,
      "independent": 6
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 88
  },
  "climate": {
    "averageTemp": 52,
    "summerHighAvg": 75,
    "winterLowAvg": 37,
    "sunnyDays": 152,
    "annualRainfall": 37,
    "annualSnowfall": 5,
    "humidityLevel": "high",
    "seasonType": "mild-winters",
    "type": "Oceanic"
  },
  "jobMarket": {
    "unemploymentRate": 3.5,
    "topIndustries": [
      "Technology",
      "Aerospace",
      "Healthcare",
      "Retail"
    ],
    "techHubScore": 95,
    "remoteWorkFriendly": 92
  },
  "healthcare": {
    "qualityIndex": 88,
    "lgbtqAffirmingProviders": 320,
    "mentalHealthAccess": 82
  },
  "transit": {
    "publicTransitScore": 65,
    "walkabilityScore": 73,
    "bikeability": 70
  },
  "culture": {
    "diverseRestaurants": 3800,
    "culturalInstitutions": [
      "SAM",
      "MoPOP",
      "Wing Luke Museum"
    ],
    "lgbtqVenues": 48,
    "religiousInstitutions": {
      "Buddhist": 35,
      "Jewish": 18,
      "Muslim": 15,
      "Hindu": 8,
      "Christian": 380
    }
  },
  "community": {
    "isVerified": true,
    "memberCount": 1850,
    "verifiedDate": "2025-09-10",
    "communityType": "lgbtq",
    "communityName": "Seattle Pride Network"
  },
  "sponsored": {
    "isSponsored": true,
    "sponsorName": "Seattle Metro Tourism",
    "sponsorMessage": "A progressive tech hub where diversity and innovation thrive together.",
    "featuredUntil": "2026-06-30"
  }
};
