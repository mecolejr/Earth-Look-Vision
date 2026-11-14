import { City } from "@/types";

export const portland: City = {
  "id": "portland",
  "name": "Portland",
  "country": "United States",
  "state": "Oregon",
  "population": 635109,
  "costOfLivingIndex": 111,
  "coordinates": {
    "lat": 45.5152,
    "lon": -122.6784
  },
  "demographics": {
    "totalPopulation": 635109,
    "ethnicBreakdown": {
        "White/Caucasian": 68,
        "Hispanic/Latino": 10,
        "Asian": 8,
        "Black/African American": 6,
        "Multiracial": 6,
        "Other": 2
    },
    "lgbtqPopulation": 6.0,
    "religionBreakdown": {
        "None": 48,
        "Christian": 38,
        "Jewish": 2,
        "Muslim": 1,
        "Buddhist": 2,
        "Other": 9
    },
    "medianAge": 38
  },
  "safety": {
    "overallCrimeRate": 50,
    "hateCrimesByCategory": {},
    "discriminationReports": 85,
    "lgbtqSafetyIndex": 88,
    "policeAccountabilityScore": 58
  },
  "political": {
    "votingPatterns": {
      "democratic": 79,
      "republican": 17,
      "independent": 4
    },
    "lgbtqProtections": true,
    "reproductiveRights": true,
    "immigrationFriendly": true,
    "progressiveScore": 87
  },
  "climate": {
    "averageTemp": 55,
    "summerHighAvg": 80,
    "winterLowAvg": 36,
    "sunnyDays": 144,
    "annualRainfall": 36,
    "annualSnowfall": 3,
    "humidityLevel": "moderate",
    "seasonType": "mild-winters",
    "type": "Oceanic"
  },
  "jobMarket": {
    "unemploymentRate": 4.1,
    "topIndustries": [
        "Technology",
        "Manufacturing",
        "Sustainable Industries",
        "Healthcare",
        "Craft Beverage"
    ],
    "techHubScore": 84,
    "remoteWorkFriendly": 88
  },
  "healthcare": {
    "qualityIndex": 80,
    "lgbtqAffirmingProviders": 1500,
    "mentalHealthAccess": 70
  },
  "transit": {
    "publicTransitScore": 65,
    "walkabilityScore": 66,
    "bikeability": 84
  },
  "culture": {
    "diverseRestaurants": 1900,
    "culturalInstitutions": [
        "Portland Art Museum",
        "Powell's Books",
        "International Rose Test Garden"
    ],
    "lgbtqVenues": 48,
    "religiousInstitutions": {
        "Christian": 520,
        "Jewish": 18,
        "Muslim": 8,
        "Buddhist": 22
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
