import { City } from "@/types";

export const phoenix: City = {
  "id": "phoenix",
  "name": "Phoenix",
  "country": "United States",
  "state": "Arizona",
  "population": 1665481,
  "costOfLivingIndex": 108,
  "coordinates": {
    "lat": 33.4484,
    "lon": -112.074
  },
  "demographics": {
    "totalPopulation": 1665481,
    "ethnicBreakdown": {
        "White/Caucasian": 42,
        "Hispanic/Latino": 42,
        "Black/African American": 7,
        "Asian": 4,
        "Native American": 2,
        "Multiracial": 3
    },
    "lgbtqPopulation": 4.3,
    "religionBreakdown": {
        "Christian": 62,
        "None": 28,
        "Jewish": 2,
        "Muslim": 2,
        "Other": 6
    },
    "medianAge": 34
  },
  "safety": {
    "overallCrimeRate": 48,
    "hateCrimesByCategory": {},
    "discriminationReports": 65,
    "lgbtqSafetyIndex": 52,
    "policeAccountabilityScore": 46
  },
  "political": {
    "votingPatterns": {
      "democratic": 48,
      "republican": 51,
      "independent": 1
    },
    "lgbtqProtections": false,
    "reproductiveRights": true,
    "immigrationFriendly": false,
    "progressiveScore": 46
  },
  "climate": {
    "averageTemp": 76,
    "summerHighAvg": 104,
    "winterLowAvg": 46,
    "sunnyDays": 299,
    "annualRainfall": 8,
    "annualSnowfall": 0,
    "humidityLevel": "low",
    "seasonType": "dry-year-round",
    "type": "Hot desert"
  },
  "jobMarket": {
    "unemploymentRate": 4.2,
    "topIndustries": [
        "Healthcare",
        "Technology",
        "Manufacturing",
        "Real Estate",
        "Finance"
    ],
    "techHubScore": 72,
    "remoteWorkFriendly": 75
  },
  "healthcare": {
    "qualityIndex": 70,
    "lgbtqAffirmingProviders": 1400,
    "mentalHealthAccess": 52
  },
  "transit": {
    "publicTransitScore": 32,
    "walkabilityScore": 41,
    "bikeability": 46
  },
  "culture": {
    "diverseRestaurants": 1700,
    "culturalInstitutions": [
        "Heard Museum",
        "Desert Botanical Garden",
        "Musical Instrument Museum"
    ],
    "lgbtqVenues": 28,
    "religiousInstitutions": {
        "Christian": 900,
        "Muslim": 15,
        "Jewish": 20,
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
