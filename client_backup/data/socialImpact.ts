export interface GrantProgram {
  id: string;
  name: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  fundedBy: string;
  status: "active" | "upcoming" | "closed";
}

export interface ImpactMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: string;
}

export interface CommunityPartner {
  id: string;
  name: string;
  type: "nonprofit" | "foundation" | "government" | "corporate";
  description: string;
  focus: string[];
}

export const GRANT_PROGRAMS: GrantProgram[] = [
  {
    id: "community-access",
    name: "Community Access Program",
    description: "Free premium access for members of underserved communities who are planning a relocation for safety, opportunity, or family reasons.",
    eligibility: [
      "Low-income individuals and families",
      "LGBTQ+ youth and young adults",
      "Refugees and asylum seekers",
      "Domestic violence survivors",
      "Members of marginalized religious communities",
    ],
    benefits: [
      "Free lifetime premium access",
      "Priority support from community liaisons",
      "Connection to local community organizations",
      "Relocation assistance fund eligibility",
    ],
    fundedBy: "Community Foundation for Inclusive Cities",
    status: "active",
  },
  {
    id: "safe-passage",
    name: "Safe Passage Initiative",
    description: "Emergency relocation support for individuals fleeing persecution or discrimination based on their identity.",
    eligibility: [
      "LGBTQ+ individuals in hostile environments",
      "Religious minorities facing persecution",
      "Individuals facing race-based threats",
      "Trans and non-binary individuals seeking affirming care",
    ],
    benefits: [
      "Emergency relocation planning assistance",
      "Connection to safe housing networks",
      "Legal resource referrals",
      "Mental health support resources",
    ],
    fundedBy: "Rainbow Alliance Foundation",
    status: "active",
  },
  {
    id: "economic-mobility",
    name: "Economic Mobility Grant",
    description: "Supporting individuals from economically disadvantaged backgrounds in finding cities with better job opportunities and lower cost of living.",
    eligibility: [
      "First-generation college graduates",
      "Individuals from low-income households",
      "Single parents seeking better opportunities",
      "Recently unemployed workers in transition",
    ],
    benefits: [
      "Detailed job market analysis",
      "Cost of living comparison tools",
      "Career counseling referrals",
      "Moving expense assistance (up to $500)",
    ],
    fundedBy: "Economic Opportunity Alliance",
    status: "active",
  },
];

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    id: "users-served",
    label: "Community Members Served",
    value: "12,400+",
    description: "Individuals from marginalized communities who have used EarthLook to find their new home",
    icon: "users",
  },
  {
    id: "relocations",
    label: "Successful Relocations",
    value: "3,200+",
    description: "Users who successfully relocated to cities better aligned with their identity and needs",
    icon: "home",
  },
  {
    id: "grants-awarded",
    label: "Grant Recipients",
    value: "850+",
    description: "Individuals who received free premium access through our grant programs",
    icon: "award",
  },
  {
    id: "safety-score",
    label: "Safety Improvement",
    value: "78%",
    description: "Of relocated users report feeling safer in their new city",
    icon: "shield",
  },
];

export const COMMUNITY_PARTNERS: CommunityPartner[] = [
  {
    id: "rainbow-alliance",
    name: "Rainbow Alliance Foundation",
    type: "foundation",
    description: "Supporting LGBTQ+ individuals in finding safe and affirming communities nationwide.",
    focus: ["LGBTQ+ Rights", "Safe Housing", "Community Building"],
  },
  {
    id: "inclusive-cities",
    name: "Community Foundation for Inclusive Cities",
    type: "foundation",
    description: "Promoting diversity and inclusion in urban planning and community development.",
    focus: ["Urban Equity", "Diversity", "Inclusion"],
  },
  {
    id: "economic-opportunity",
    name: "Economic Opportunity Alliance",
    type: "nonprofit",
    description: "Breaking barriers to economic mobility for underserved communities.",
    focus: ["Job Access", "Economic Justice", "Career Development"],
  },
  {
    id: "immigrant-welcome",
    name: "Immigrant Welcome Network",
    type: "nonprofit",
    description: "Helping immigrants and refugees find welcoming communities and resources.",
    focus: ["Immigration", "Refugee Support", "Cultural Integration"],
  },
];

export const MISSION_STATEMENT = 
  "EarthLook believes everyone deserves to live in a community where they feel safe, accepted, and able to thrive. Our grant-funded social impact model ensures that cost is never a barrier for those who need this tool the most.";

export const FUNDING_TRANSPARENCY = {
  totalGrantFunding: "$2.4M",
  grantPeriod: "2024-2026",
  percentToPrograms: 85,
  percentToOperations: 15,
  auditor: "Nonprofit Financial Partners",
  annualReportUrl: "#",
};
