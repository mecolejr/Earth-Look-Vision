import { City } from "@/types";

export const miami: City = {
  "id": "miami",
  "name": "Miami",
  "country": "United States",
  "state": "Florida",
  "population": 489812,
  "costOfLivingIndex": 102,
  "coordinates": {
    "lat": 25.7617,
    "lon": -80.1918
  },
  "demographics": {
    "totalPopulation": 489812,
    "ethnicBreakdown": {
        "Hispanic/Latino": 70,
        "White/Caucasian": 12,
        "Black/African American": 13,
        "Asian": 1,
        "Multiracial": 3,
        "Other": 1
    },
    "lgbtqPopulation": 4.5,
    "religionBreakdown": {
        "Christian": 65,
        "None": 22,
        "Jewish": 5,
        "Muslim": 1,
        "Other": 7
    },
    "medianAge": 40
  },
  "safety": {
    "overallCrimeRate": 46,
    "hateCrimesByCategory": {},
    "discriminationReports": 90,
    "lgbtqSafetyIndex": 54,
    "policeAccountabilityScore": 45
  },
  "political": {
    "votingPatterns": {
      "democratic": 44,
      "republican": 55,
      "independent": 1
    },
    "lgbtqProtections": false,
    "reproductiveRights": false,
    "immigrationFriendly": false,
    "progressiveScore": 42
  },
  "climate": {
    "averageTemp": 78,
    "summerHighAvg": 90,
    "winterLowAvg": 61,
    "sunnyDays": 249,
    "annualRainfall": 62,
    "annualSnowfall": 0,
    "humidityLevel": "high",
    "seasonType": "no-winter",
    "type": "Tropical"
  },
  "jobMarket": {
    "unemploymentRate": 3.2,
    "topIndustries": [
        "Tourism",
        "Finance",
        "International Trade",
        "Real Estate",
        "Healthcare"
    ],
    "techHubScore": 68,
    "remoteWorkFriendly": 72
  },
  "healthcare": {
    "qualityIndex": 72,
    "lgbtqAffirmingProviders": 1700,
    "mentalHealthAccess": 50
  },
  "transit": {
    "publicTransitScore": 42,
    "walkabilityScore": 78,
    "bikeability": 50
  },
  "culture": {
    "diverseRestaurants": 1600,
    "culturalInstitutions": [
        "P\u00e9rez Art Museum Miami",
        "Vizcaya Museum and Gardens",
        "Wynwood Walls"
    ],
    "lgbtqVenues": 45,
    "religiousInstitutions": {
        "Christian": 700,
        "Jewish": 60,
        "Muslim": 10
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
