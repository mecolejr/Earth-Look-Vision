import { City } from "@/types";

export const boston: City = {
  "id": "boston",
  "name": "Boston",
  "country": "United States",
  "state": "Massachusetts",
  "population": 672973,
  "costOfLivingIndex": 149,
  "coordinates": {
    "lat": 42.3601,
    "lon": -71.0589
  },
  "demographics": {
    "totalPopulation": 672973,
    "ethnicBreakdown": {
        "White/Caucasian": 44,
        "Black/African American": 19,
        "Hispanic/Latino": 20,
        "Asian": 11,
        "Multiracial": 4,
        "Other": 2
    },
    "lgbtqPopulation": 4.9,
    "religionBreakdown": {
        "Christian": 54,
        "None": 33,
        "Jewish": 4,
        "Muslim": 2,
        "Buddhist": 1,
        "Other": 6
    },
    "medianAge": 32
  },
  "safety": {
    "overallCrimeRate": 42,
    "hateCrimesByCategory": {},
    "discriminationReports": 95,
    "lgbtqSafetyIndex": 85,
    "policeAccountabilityScore": 62
  },
  "political": {
    "votingPatterns": {
      "democratic": 74,
      "republican": 22,
      "independent": 4
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 85
  },
  "climate": {
    "averageTemp": 52,
    "summerHighAvg": 82,
    "winterLowAvg": 23,
    "sunnyDays": 200,
    "annualRainfall": 44,
    "annualSnowfall": 43,
    "humidityLevel": "moderate",
    "seasonType": "four-seasons",
    "type": "Humid continental"
  },
  "jobMarket": {
    "unemploymentRate": 3.9,
    "topIndustries": [
        "Education",
        "Healthcare",
        "Biotech",
        "Finance",
        "Technology"
    ],
    "techHubScore": 92,
    "remoteWorkFriendly": 82
  },
  "healthcare": {
    "qualityIndex": 88,
    "lgbtqAffirmingProviders": 1900,
    "mentalHealthAccess": 72
  },
  "transit": {
    "publicTransitScore": 74,
    "walkabilityScore": 82,
    "bikeability": 68
  },
  "culture": {
    "diverseRestaurants": 2200,
    "culturalInstitutions": [
        "Museum of Fine Arts",
        "Freedom Trail",
        "Fenway Park",
        "Isabella Stewart Gardner Museum"
    ],
    "lgbtqVenues": 65,
    "religiousInstitutions": {
        "Christian": 950,
        "Jewish": 55,
        "Muslim": 18,
        "Buddhist": 15
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
