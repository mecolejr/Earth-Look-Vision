import { City } from "@/types";

export const losAngeles: City = {
  "id": "los-angeles",
  "name": "Los Angeles",
  "country": "United States",
  "state": "California",
  "population": 3869089,
  "costOfLivingIndex": 138,
  "coordinates": {
    "lat": 34.0522,
    "lon": -118.2437
  },
  "demographics": {
    "totalPopulation": 3869089,
    "ethnicBreakdown": {
        "Hispanic/Latino": 47,
        "White/Caucasian": 28,
        "Asian": 12,
        "Black/African American": 8,
        "Multiracial": 4,
        "Other": 1
    },
    "lgbtqPopulation": 5.1,
    "religionBreakdown": {
        "Christian": 48,
        "None": 34,
        "Jewish": 5,
        "Muslim": 3,
        "Buddhist": 3,
        "Hindu": 1,
        "Other": 6
    },
    "medianAge": 36
  },
  "safety": {
    "overallCrimeRate": 52,
    "hateCrimesByCategory": {},
    "discriminationReports": 210,
    "lgbtqSafetyIndex": 78,
    "policeAccountabilityScore": 55
  },
  "political": {
    "votingPatterns": {
      "democratic": 65,
      "republican": 32,
      "independent": 3
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 78
  },
  "climate": {
    "averageTemp": 66,
    "summerHighAvg": 84,
    "winterLowAvg": 50,
    "sunnyDays": 284,
    "annualRainfall": 15,
    "annualSnowfall": 0,
    "humidityLevel": "low",
    "seasonType": "dry-year-round",
    "type": "Mediterranean"
  },
  "jobMarket": {
    "unemploymentRate": 4.4,
    "topIndustries": [
        "Entertainment",
        "Technology",
        "Trade & Logistics",
        "Fashion",
        "Healthcare"
    ],
    "techHubScore": 90,
    "remoteWorkFriendly": 80
  },
  "healthcare": {
    "qualityIndex": 78,
    "lgbtqAffirmingProviders": 1800,
    "mentalHealthAccess": 65
  },
  "transit": {
    "publicTransitScore": 53,
    "walkabilityScore": 68,
    "bikeability": 55
  },
  "culture": {
    "diverseRestaurants": 4500,
    "culturalInstitutions": [
        "The Getty Center",
        "Griffith Observatory",
        "LACMA",
        "Hollywood Walk of Fame"
    ],
    "lgbtqVenues": 140,
    "religiousInstitutions": {
        "Christian": 2200,
        "Jewish": 90,
        "Muslim": 60,
        "Buddhist": 70,
        "Hindu": 20
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
