export interface Partner {
  id: string;
  name: string;
  type: "relocation" | "realtor" | "legal" | "moving";
  specialty: string;
  description: string;
  rating: number;
  reviewCount: number;
  lgbtqFriendly: boolean;
  languages: string[];
  contactEmail: string;
  phone?: string;
  website?: string;
  verified: boolean;
}

export interface CityPartners {
  cityId: string;
  partners: Partner[];
}

export const PARTNER_DATA: Record<string, Partner[]> = {
  "san-francisco": [
    {
      id: "sf-reloc-1",
      name: "Bay Area Relocation Services",
      type: "relocation",
      specialty: "LGBTQ+ Friendly Relocations",
      description: "Full-service relocation specialists helping diverse families find their perfect Bay Area home.",
      rating: 4.9,
      reviewCount: 234,
      lgbtqFriendly: true,
      languages: ["English", "Spanish", "Mandarin"],
      contactEmail: "hello@bayareareloc.com",
      phone: "(415) 555-0123",
      website: "https://bayareareloc.com",
      verified: true,
    },
    {
      id: "sf-realtor-1",
      name: "Castro Realty Group",
      type: "realtor",
      specialty: "Castro & Mission Districts",
      description: "Serving the LGBTQ+ community for over 20 years. Experts in Castro, Mission, and Noe Valley neighborhoods.",
      rating: 4.8,
      reviewCount: 189,
      lgbtqFriendly: true,
      languages: ["English", "Spanish"],
      contactEmail: "info@castrorealty.com",
      phone: "(415) 555-0456",
      verified: true,
    },
    {
      id: "sf-moving-1",
      name: "Rainbow Movers SF",
      type: "moving",
      specialty: "Local & Long Distance",
      description: "LGBTQ+ owned moving company. Careful handling, fair prices, and a team that understands diverse families.",
      rating: 4.7,
      reviewCount: 312,
      lgbtqFriendly: true,
      languages: ["English"],
      contactEmail: "move@rainbowmovers.com",
      phone: "(415) 555-0789",
      verified: true,
    },
  ],
  "new-york": [
    {
      id: "ny-reloc-1",
      name: "NYC Welcome Services",
      type: "relocation",
      specialty: "International & Domestic Relocations",
      description: "Helping newcomers navigate NYC's unique housing market. Specializing in diverse and immigrant families.",
      rating: 4.8,
      reviewCount: 456,
      lgbtqFriendly: true,
      languages: ["English", "Spanish", "French", "Mandarin"],
      contactEmail: "welcome@nycwelcome.com",
      phone: "(212) 555-0123",
      website: "https://nycwelcome.com",
      verified: true,
    },
    {
      id: "ny-realtor-1",
      name: "Brooklyn Pride Realty",
      type: "realtor",
      specialty: "Brooklyn Neighborhoods",
      description: "LGBTQ+ owned. Experts in Park Slope, Prospect Heights, and Bed-Stuy. We find homes where you'll thrive.",
      rating: 4.9,
      reviewCount: 278,
      lgbtqFriendly: true,
      languages: ["English", "Spanish"],
      contactEmail: "homes@brooklynpride.com",
      phone: "(718) 555-0456",
      verified: true,
    },
    {
      id: "ny-legal-1",
      name: "Immigrant Rights Legal",
      type: "legal",
      specialty: "Immigration & Housing Law",
      description: "Legal support for immigrants relocating to NYC. Housing rights, visa assistance, and tenant advocacy.",
      rating: 4.6,
      reviewCount: 124,
      lgbtqFriendly: true,
      languages: ["English", "Spanish", "Arabic", "Mandarin"],
      contactEmail: "help@immigrantrightslegal.com",
      verified: true,
    },
  ],
  "seattle": [
    {
      id: "sea-reloc-1",
      name: "Pacific Northwest Relocations",
      type: "relocation",
      specialty: "Tech Industry Relocations",
      description: "Helping tech workers and their families transition to Seattle. We understand remote work needs and diverse households.",
      rating: 4.7,
      reviewCount: 198,
      lgbtqFriendly: true,
      languages: ["English", "Mandarin", "Hindi"],
      contactEmail: "info@pnwreloc.com",
      phone: "(206) 555-0123",
      website: "https://pnwreloc.com",
      verified: true,
    },
    {
      id: "sea-realtor-1",
      name: "Capitol Hill Living",
      type: "realtor",
      specialty: "Capitol Hill & Central District",
      description: "Deep roots in Seattle's most diverse neighborhoods. LGBTQ+ owned and operated since 2005.",
      rating: 4.8,
      reviewCount: 167,
      lgbtqFriendly: true,
      languages: ["English"],
      contactEmail: "find@capitolhillliving.com",
      phone: "(206) 555-0456",
      verified: true,
    },
  ],
  "austin": [
    {
      id: "aus-reloc-1",
      name: "Keep Austin Moving",
      type: "relocation",
      specialty: "California to Texas Relocations",
      description: "Specializing in helping West Coast transplants find their place in Austin's unique culture.",
      rating: 4.6,
      reviewCount: 289,
      lgbtqFriendly: true,
      languages: ["English", "Spanish"],
      contactEmail: "hello@keepaustinmoving.com",
      phone: "(512) 555-0123",
      verified: true,
    },
    {
      id: "aus-realtor-1",
      name: "East Austin Homes",
      type: "realtor",
      specialty: "East Austin & Mueller",
      description: "Finding homes in Austin's most progressive and diverse neighborhoods. LGBTQ+ ally certified.",
      rating: 4.7,
      reviewCount: 143,
      lgbtqFriendly: true,
      languages: ["English", "Spanish"],
      contactEmail: "homes@eastaustinhomes.com",
      phone: "(512) 555-0456",
      verified: true,
    },
  ],
  "denver": [
    {
      id: "den-reloc-1",
      name: "Mile High Relocation",
      type: "relocation",
      specialty: "Mountain West Transitions",
      description: "Helping families relocate to Colorado. We understand altitude adjustments and outdoor lifestyles.",
      rating: 4.5,
      reviewCount: 156,
      lgbtqFriendly: true,
      languages: ["English", "Spanish"],
      contactEmail: "info@milehighreloc.com",
      phone: "(303) 555-0123",
      verified: true,
    },
    {
      id: "den-realtor-1",
      name: "Capitol Hill Denver Realty",
      type: "realtor",
      specialty: "Cap Hill & RiNo",
      description: "Denver's most LGBTQ+ friendly real estate team. Experts in walkable, diverse neighborhoods.",
      rating: 4.8,
      reviewCount: 112,
      lgbtqFriendly: true,
      languages: ["English"],
      contactEmail: "homes@caphilldenver.com",
      phone: "(303) 555-0456",
      verified: true,
    },
  ],
};

export function getPartnersForCity(cityId: string): Partner[] {
  return PARTNER_DATA[cityId] || [];
}

export function getPartnerTypeLabel(type: Partner["type"]): string {
  switch (type) {
    case "relocation":
      return "Relocation Service";
    case "realtor":
      return "Real Estate Agent";
    case "legal":
      return "Legal Services";
    case "moving":
      return "Moving Company";
    default:
      return "Partner";
  }
}

export function getPartnerTypeIcon(type: Partner["type"]): string {
  switch (type) {
    case "relocation":
      return "briefcase";
    case "realtor":
      return "home";
    case "legal":
      return "shield";
    case "moving":
      return "truck";
    default:
      return "users";
  }
}
