import { City } from "@/types";

export const philadelphia: City = {
  "id": "philadelphia",
  "name": "Philadelphia",
  "country": "United States",
  "state": "Pennsylvania",
  "population": 1574281,
  "costOfLivingIndex": 97,
  "coordinates": {
    "lat": 39.9526,
    "lon": -75.1652
  },
  "demographics": {
    "totalPopulation": 1574281,
    "ethnicBreakdown": {
        "Black/African American": 38,
        "White/Caucasian": 33,
        "Hispanic/Latino": 15,
        "Asian": 8,
        "Multiracial": 4,
        "Other": 2
    },
    "lgbtqPopulation": 4.2,
    "religionBreakdown": {
        "Christian": 62,
        "None": 26,
        "Jewish": 3,
        "Muslim": 3,
        "Buddhist": 1,
        "Other": 5
    },
    "medianAge": 34
  },
  "safety": {
    "overallCrimeRate": 56,
    "hateCrimesByCategory": {},
    "discriminationReports": 140,
    "lgbtqSafetyIndex": 64,
    "policeAccountabilityScore": 48
  },
  "political": {
    "votingPatterns": {
      "democratic": 79,
      "republican": 20,
      "independent": 1
    },
    "lgbtqProtections": false,
    "reproductiveRights": true,
    "immigrationFriendly": false,
    "progressiveScore": 66
  },
  "climate": {
    "averageTemp": 56,
    "summerHighAvg": 86,
    "winterLowAvg": 28,
    "sunnyDays": 210,
    "annualRainfall": 44,
    "annualSnowfall": 20,
    "humidityLevel": "moderate",
    "seasonType": "four-seasons",
    "type": "Humid subtropical"
  },
  "jobMarket": {
    "unemploymentRate": 3.6,
    "topIndustries": [
        "Healthcare",
        "Education",
        "Finance",
        "Life Sciences",
        "Food Service"
    ],
    "techHubScore": 70,
    "remoteWorkFriendly": 70
  },
  "healthcare": {
    "qualityIndex": 75,
    "lgbtqAffirmingProviders": 1300,
    "mentalHealthAccess": 58
  },
  "transit": {
    "publicTransitScore": 62,
    "walkabilityScore": 74,
    "bikeability": 58
  },
  "culture": {
    "diverseRestaurants": 2600,
    "culturalInstitutions": [
        "Philadelphia Museum of Art",
        "Independence Hall",
        "Reading Terminal Market"
    ],
    "lgbtqVenues": 55,
    "religiousInstitutions": {
        "Christian": 1300,
        "Jewish": 45,
        "Muslim": 35,
        "Buddhist": 10
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
