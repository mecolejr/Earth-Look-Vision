export interface ClimatePreferences {
  temperaturePreference: "cold" | "mild" | "warm" | "hot" | "";
  seasonPreference: "four-seasons" | "mild-winters" | "no-winter" | "dry-year-round" | "";
  precipitationPreference: "dry" | "moderate" | "rainy" | "";
  humidityPreference: "dry" | "moderate" | "humid" | "";
  sunshinePreference: "sunny" | "mixed" | "cloudy-ok" | "";
}

export const DEFAULT_CLIMATE_PREFERENCES: ClimatePreferences = {
  temperaturePreference: "",
  seasonPreference: "",
  precipitationPreference: "",
  humidityPreference: "",
  sunshinePreference: "",
};

export const CLIMATE_OPTIONS = {
  temperature: [
    { value: "cold", label: "Cold (Below 50°F average)", description: "Love snow and bundling up" },
    { value: "mild", label: "Mild (50-65°F average)", description: "Comfortable year-round temps" },
    { value: "warm", label: "Warm (65-80°F average)", description: "Enjoy outdoor activities" },
    { value: "hot", label: "Hot (Above 80°F average)", description: "Love the heat" },
  ],
  seasons: [
    { value: "four-seasons", label: "Four Distinct Seasons", description: "Experience all seasons" },
    { value: "mild-winters", label: "Mild Winters", description: "Avoid extreme cold" },
    { value: "no-winter", label: "No Real Winter", description: "Warm year-round" },
    { value: "dry-year-round", label: "Dry Year-Round", description: "Desert/Mediterranean climate" },
  ],
  precipitation: [
    { value: "dry", label: "Dry Climate", description: "Less than 20 inches/year" },
    { value: "moderate", label: "Moderate Rainfall", description: "20-40 inches/year" },
    { value: "rainy", label: "Rainy Climate", description: "More than 40 inches/year" },
  ],
  humidity: [
    { value: "dry", label: "Low Humidity", description: "Dry, desert-like air" },
    { value: "moderate", label: "Moderate Humidity", description: "Balanced comfort" },
    { value: "humid", label: "High Humidity", description: "Tropical feel" },
  ],
  sunshine: [
    { value: "sunny", label: "Lots of Sunshine", description: "200+ sunny days/year" },
    { value: "mixed", label: "Mixed Weather", description: "Variety of conditions" },
    { value: "cloudy-ok", label: "Cloudy is OK", description: "Don't need constant sun" },
  ],
};

export interface IdentityProfile {
  ethnicities: string[];
  genderIdentity: string;
  sexualOrientation: string;
  religion: string;
  politicalViews: string;
  familyStructure: string;
  incomeLevel: string;
  careerField: string;
  ageRange: string;
  disabilities: string[];
  languages: string[];
  climatePreferences: ClimatePreferences;
}

export interface PrivacySettings {
  useEthnicity: boolean;
  useGenderIdentity: boolean;
  useSexualOrientation: boolean;
  useReligion: boolean;
  usePoliticalViews: boolean;
  useFamilyStructure: boolean;
  useIncomeLevel: boolean;
  useCareerField: boolean;
  useAgeRange: boolean;
  useDisabilities: boolean;
}

export const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  useEthnicity: true,
  useGenderIdentity: true,
  useSexualOrientation: true,
  useReligion: true,
  usePoliticalViews: true,
  useFamilyStructure: true,
  useIncomeLevel: true,
  useCareerField: true,
  useAgeRange: true,
  useDisabilities: true,
};

export const PRIVACY_LABELS: Record<keyof PrivacySettings, { label: string; description: string }> = {
  useEthnicity: { label: "Race & Ethnicity", description: "Affects diversity and safety scores based on community representation" },
  useGenderIdentity: { label: "Gender Identity", description: "Influences LGBTQ+ acceptance and safety assessments" },
  useSexualOrientation: { label: "Sexual Orientation", description: "Impacts LGBTQ+ community and protection ratings" },
  useReligion: { label: "Religion", description: "Affects cultural fit and community availability scores" },
  usePoliticalViews: { label: "Political Views", description: "Influences political alignment and policy assessments" },
  useFamilyStructure: { label: "Family Structure", description: "Affects family-friendliness and school ratings" },
  useIncomeLevel: { label: "Income Level", description: "Impacts cost of living affordability calculations" },
  useCareerField: { label: "Career Field", description: "Influences job market and industry opportunity scores" },
  useAgeRange: { label: "Age Range", description: "Affects relevant lifestyle and community ratings" },
  useDisabilities: { label: "Disabilities", description: "Impacts accessibility and healthcare assessments" },
};

export interface PriorityWeights {
  safety: number;
  lgbtqAcceptance: number;
  diversityInclusion: number;
  costOfLiving: number;
  jobMarket: number;
  healthcare: number;
  climate: number;
  publicTransit: number;
  culturalInstitutions: number;
  politicalAlignment: number;
}

export type OnboardingStep = 0 | 1 | 2 | 3;

export type SubscriptionTier = "free" | "premium";

export interface PremiumSubscription {
  tier: SubscriptionTier;
  subscribedAt?: string;
  expiresAt?: string;
}

export const FREE_TIER_LIMITS = {
  maxComparisons: 3,
  maxSavedCities: 5,
  hasDetailedReports: false,
  hasPrioritySupport: false,
};

export const PREMIUM_FEATURES = [
  {
    id: "unlimited_comparisons",
    title: "Unlimited Comparisons",
    description: "Compare as many cities as you want side-by-side",
    icon: "layers" as const,
  },
  {
    id: "detailed_reports",
    title: "Detailed City Reports",
    description: "In-depth analysis with neighborhood breakdowns and local insights",
    icon: "file-text" as const,
  },
  {
    id: "priority_support",
    title: "Priority Support",
    description: "Get help faster with dedicated support access",
    icon: "headphones" as const,
  },
  {
    id: "early_access",
    title: "Early Access",
    description: "Be the first to try new features and city data",
    icon: "zap" as const,
  },
];

export interface AppSettings {
  dataSaverMode: boolean;
  showNetworkIndicator: boolean;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  dataSaverMode: false,
  showNetworkIndicator: true,
};

export interface UserProfile {
  id: string;
  identity: IdentityProfile;
  priorities: PriorityWeights;
  privacySettings: PrivacySettings;
  appSettings: AppSettings;
  subscription: PremiumSubscription;
  hasCompletedOnboarding: boolean;
  isAnonymousMode: boolean;
  onboardingStep: OnboardingStep;
  currentCityId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CityScore {
  overall: number;
  breakdown: {
    safety: number;
    lgbtqAcceptance: number;
    diversityInclusion: number;
    costOfLiving: number;
    jobMarket: number;
    healthcare: number;
    climate: number;
    publicTransit: number;
    culturalInstitutions: number;
    politicalAlignment: number;
  };
  highlights: ScoreHighlight[];
  concerns: ScoreHighlight[];
}

export interface ScoreHighlight {
  icon: string;
  text: string;
  type: "positive" | "warning" | "negative";
}

export interface CityDemographics {
  totalPopulation: number;
  ethnicBreakdown: Record<string, number>;
  lgbtqPopulation: number;
  religionBreakdown: Record<string, number>;
  medianAge: number;
}

export interface CitySafetyData {
  overallCrimeRate: number;
  hateCrimesByCategory: Record<string, number>;
  discriminationReports: number;
  lgbtqSafetyIndex: number;
  policeAccountabilityScore: number;
}

export interface CityPoliticalData {
  votingPatterns: {
    democratic: number;
    republican: number;
    independent: number;
  };
  lgbtqProtections: boolean;
  reproductiveRights: boolean;
  immigrationFriendly: boolean;
  progressiveScore: number;
}

export interface CommunityVerification {
  isVerified: boolean;
  memberCount?: number;
  verifiedDate?: string;
  communityType?: "lgbtq" | "bipoc" | "immigrants" | "disability" | "general";
  communityName?: string;
}

export interface SponsoredInfo {
  isSponsored: boolean;
  sponsorName?: string;
  sponsorMessage?: string;
  featuredUntil?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  state?: string;
  imageUrl?: string;
  population: number;
  costOfLivingIndex: number;
  coordinates: {
    lat: number;
    lon: number;
  };
  demographics: CityDemographics;
  safety: CitySafetyData;
  political: CityPoliticalData;
  climate: {
    averageTemp: number;
    summerHighAvg: number;
    winterLowAvg: number;
    sunnyDays: number;
    annualRainfall: number;
    annualSnowfall: number;
    humidityLevel: "low" | "moderate" | "high";
    seasonType: "four-seasons" | "mild-winters" | "no-winter" | "dry-year-round";
    type: string;
  };
  jobMarket: {
    unemploymentRate: number;
    topIndustries: string[];
    techHubScore: number;
    remoteWorkFriendly: number;
  };
  healthcare: {
    qualityIndex: number;
    lgbtqAffirmingProviders: number;
    mentalHealthAccess: number;
  };
  transit: {
    publicTransitScore: number;
    walkabilityScore: number;
    bikeability: number;
  };
  culture: {
    diverseRestaurants: number;
    culturalInstitutions: string[];
    lgbtqVenues: number;
    religiousInstitutions: Record<string, number>;
  };
  community?: CommunityVerification;
  sponsored?: SponsoredInfo;
}

export interface CityWithScore extends City {
  personalizedScore: CityScore;
}

export const DEFAULT_IDENTITY: IdentityProfile = {
  ethnicities: [],
  genderIdentity: "",
  sexualOrientation: "",
  religion: "",
  politicalViews: "",
  familyStructure: "",
  incomeLevel: "",
  careerField: "",
  ageRange: "",
  disabilities: [],
  languages: ["English"],
  climatePreferences: DEFAULT_CLIMATE_PREFERENCES,
};

export const DEFAULT_PRIORITIES: PriorityWeights = {
  safety: 50,
  lgbtqAcceptance: 50,
  diversityInclusion: 50,
  costOfLiving: 50,
  jobMarket: 50,
  healthcare: 50,
  climate: 50,
  publicTransit: 50,
  culturalInstitutions: 50,
  politicalAlignment: 50,
};

export const ETHNICITY_OPTIONS = [
  "Asian",
  "Black/African American",
  "Hispanic/Latino",
  "Middle Eastern/North African",
  "Native American/Indigenous",
  "Pacific Islander",
  "White/Caucasian",
  "Multiracial",
  "Other",
];

export const GENDER_OPTIONS = [
  "Woman",
  "Man",
  "Non-binary",
  "Genderqueer",
  "Genderfluid",
  "Agender",
  "Two-Spirit",
  "Prefer to self-describe",
];

export const ORIENTATION_OPTIONS = [
  "Straight/Heterosexual",
  "Gay",
  "Lesbian",
  "Bisexual",
  "Pansexual",
  "Queer",
  "Asexual",
  "Prefer to self-describe",
];

export const RELIGION_OPTIONS = [
  "Agnostic",
  "Atheist",
  "Buddhist",
  "Christian",
  "Hindu",
  "Jewish",
  "Muslim",
  "Sikh",
  "Spiritual but not religious",
  "Other",
  "Prefer not to say",
];

export const POLITICAL_OPTIONS = [
  "Very Progressive",
  "Progressive",
  "Moderate",
  "Conservative",
  "Very Conservative",
  "Libertarian",
  "Apolitical",
];

export const FAMILY_OPTIONS = [
  "Single",
  "In a relationship",
  "Married/Partnered",
  "Single parent",
  "Co-parenting",
  "Planning to have children",
  "Child-free by choice",
];

export const INCOME_OPTIONS = [
  "Under $25,000",
  "$25,000 - $50,000",
  "$50,000 - $75,000",
  "$75,000 - $100,000",
  "$100,000 - $150,000",
  "$150,000 - $250,000",
  "$250,000+",
];

export const CAREER_OPTIONS = [
  "Arts & Entertainment",
  "Business & Finance",
  "Education",
  "Engineering",
  "Healthcare",
  "Hospitality & Tourism",
  "Legal",
  "Manufacturing",
  "Marketing & Sales",
  "Non-profit",
  "Retail",
  "Science & Research",
  "Technology",
  "Trades",
  "Other",
];

export const AGE_OPTIONS = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
];

export const PRIORITY_LABELS: Record<keyof PriorityWeights, string> = {
  safety: "Safety & Low Crime",
  lgbtqAcceptance: "LGBTQ+ Acceptance",
  diversityInclusion: "Diversity & Inclusion",
  costOfLiving: "Affordable Cost of Living",
  jobMarket: "Strong Job Market",
  healthcare: "Quality Healthcare",
  climate: "Good Climate",
  publicTransit: "Public Transportation",
  culturalInstitutions: "Cultural Institutions",
  politicalAlignment: "Political Alignment",
};
