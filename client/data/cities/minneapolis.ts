import { City } from "@/types";

export const minneapolis: City = {
  "id": "minneapolis",
  "name": "Minneapolis",
  "country": "United States",
  "state": "Minnesota",
  "population": 430324,
  "costOfLivingIndex": 94,
  "coordinates": {
    "lat": 44.9778,
    "lon": -93.265
  },
  "demographics": {
    "totalPopulation": 430324,
    "ethnicBreakdown": {
        "White/Caucasian": 60,
        "Black/African American": 19,
        "Hispanic/Latino": 10,
        "Asian": 6,
        "Native American": 1,
        "Multiracial": 4
    },
    "lgbtqPopulation": 4.2,
    "religionBreakdown": {
        "Christian": 54,
        "None": 35,
        "Muslim": 4,
        "Jewish": 2,
        "Buddhist": 1,
        "Other": 4
    },
    "medianAge": 32
  },
  "safety": {
    "overallCrimeRate": 50,
    "hateCrimesByCategory": {},
    "discriminationReports": 70,
    "lgbtqSafetyIndex": 80,
    "policeAccountabilityScore": 52
  },
  "political": {
    "votingPatterns": {
      "democratic": 70,
      "republican": 27,
      "independent": 3
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 78
  },
  "climate": {
    "averageTemp": 47,
    "summerHighAvg": 83,
    "winterLowAvg": 14,
    "sunnyDays": 201,
    "annualRainfall": 31,
    "annualSnowfall": 52,
    "humidityLevel": "moderate",
    "seasonType": "four-seasons",
    "type": "Continental"
  },
  "jobMarket": {
    "unemploymentRate": 4.5,
    "topIndustries": [
        "Healthcare",
        "Finance",
        "Retail",
        "Manufacturing",
        "Technology"
    ],
    "techHubScore": 76,
    "remoteWorkFriendly": 78
  },
  "healthcare": {
    "qualityIndex": 84,
    "lgbtqAffirmingProviders": 1250,
    "mentalHealthAccess": 68
  },
  "transit": {
    "publicTransitScore": 55,
    "walkabilityScore": 68,
    "bikeability": 80
  },
  "culture": {
    "diverseRestaurants": 1400,
    "culturalInstitutions": [
        "Walker Art Center",
        "Minneapolis Institute of Art",
        "Chain of Lakes"
    ],
    "lgbtqVenues": 35,
    "religiousInstitutions": {
        "Christian": 480,
        "Muslim": 25,
        "Jewish": 12,
        "Buddhist": 6
    }
  },
  "sources": [
    "U.S. Census Bureau Vintage 2025 population estimates",
    "Williams Institute, LGBT Adults in Large US Metropolitan Areas (metro-level %)",
    "Wikipedia, 2024 United States presidential election results by county",
    "Missouri Economic Research and Information Center, Cost of Living Data Series (state-level index)",
    "U.S. Bureau of Labor Statistics, Local Area Unemployment Statistics (metro area, Sept 2026)",
    "Guttmacher Institute, state abortion policy tracker",
    "Movement Advancement Project, non-discrimination laws by state",
    "NOAA climate normals via currentresults.com",
    "Composite 0-100 scores (crime/safety, progressive, job-market, healthcare, transit sub-indices) are directional estimates, not independently verified against a named index"
  ],
  "lastUpdated": "2026-11"
};
