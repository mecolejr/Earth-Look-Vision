interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  category: string;
}

interface UserIdentity {
  race?: string;
  gender?: string;
  sexuality?: string;
  religion?: string;
  politicalViews?: string;
  familyStructure?: string;
  careerField?: string;
}

interface RerankResult {
  index: number;
  relevance_score: number;
}

const ARTICLES: ArticleData[] = [
  {
    id: "austin-lgbtq-haven",
    title: "Austin: A Growing Haven for LGBTQ+ Families",
    excerpt: "How Texas's capital is becoming an unexpected sanctuary for queer families despite state politics.",
    tags: ["LGBTQ+", "families", "Texas", "community"],
    category: "city-spotlight",
  },
  {
    id: "seattle-healthcare-update",
    title: "Seattle Expands Trans-Affirming Healthcare Access",
    excerpt: "New city initiative funds gender-affirming care for uninsured residents.",
    tags: ["healthcare", "transgender", "policy", "Seattle"],
    category: "policy-changes",
  },
  {
    id: "portland-bipoc-entrepreneur",
    title: "From Nigeria to Portland: A Black Entrepreneur's Journey",
    excerpt: "How Adaeze found community and success in the Pacific Northwest.",
    tags: ["Black-owned", "immigrant", "entrepreneurship", "food"],
    category: "community-stories",
  },
  {
    id: "denver-disability-access",
    title: "Denver Leads Nation in Disability-Friendly Urban Design",
    excerpt: "New accessibility initiatives make the Mile High City more welcoming than ever.",
    tags: ["disability", "accessibility", "urban-design", "Denver"],
    category: "city-spotlight",
  },
  {
    id: "california-housing-policy",
    title: "California's New Housing Laws: What They Mean for Low-Income Families",
    excerpt: "Breaking down recent legislation aimed at addressing the affordability crisis.",
    tags: ["housing", "policy", "California", "affordability"],
    category: "policy-changes",
  },
  {
    id: "muslim-community-minneapolis",
    title: "Finding Home: Muslim Families Thriving in Minneapolis",
    excerpt: "Inside the vibrant Somali and broader Muslim community in the Twin Cities.",
    tags: ["Muslim", "Somali", "immigrant", "Minneapolis", "community"],
    category: "community-stories",
  },
  {
    id: "sf-tech-diversity",
    title: "San Francisco Tech's Diversity Problem—and the Startups Fixing It",
    excerpt: "How minority-led tech companies are changing the industry from within.",
    tags: ["tech", "diversity", "San Francisco", "entrepreneurship"],
    category: "city-spotlight",
  },
  {
    id: "nyc-senior-lgbtq",
    title: "Growing Old and Queer in New York City",
    excerpt: "LGBTQ+ seniors find community and care in specialized programs.",
    tags: ["LGBTQ+", "seniors", "NYC", "aging", "healthcare"],
    category: "community-stories",
  },
  {
    id: "montreal-lgbtq-haven",
    title: "Montreal: North America's Most Affordable LGBTQ+ Haven?",
    excerpt: "Exploring why queer folks are increasingly choosing Montreal over US cities.",
    tags: ["LGBTQ+", "culture", "bilingual", "Montreal"],
    category: "city-spotlight",
  },
];

function buildUserQuery(identity: UserIdentity): string {
  const parts: string[] = [];

  if (identity.sexuality && identity.sexuality !== "prefer-not-to-say") {
    if (["gay", "lesbian", "bisexual", "pansexual", "queer", "asexual"].includes(identity.sexuality)) {
      parts.push("LGBTQ+ community", "queer", "pride");
    }
  }

  if (identity.gender && identity.gender !== "prefer-not-to-say") {
    if (["transgender-man", "transgender-woman", "non-binary", "genderqueer", "genderfluid"].includes(identity.gender)) {
      parts.push("transgender", "trans-affirming", "gender identity");
    }
  }

  if (identity.race && identity.race !== "prefer-not-to-say") {
    const raceKeywords: Record<string, string[]> = {
      "black": ["Black", "African American", "BIPOC", "racial justice"],
      "african-american": ["Black", "African American", "BIPOC", "racial justice"],
      "hispanic": ["Latino", "Hispanic", "Latinx", "immigration"],
      "latino": ["Latino", "Hispanic", "Latinx", "immigration"],
      "asian": ["Asian", "Asian American", "AAPI"],
      "middle-eastern": ["Middle Eastern", "Arab", "Muslim"],
      "native-american": ["Native American", "Indigenous", "tribal"],
      "pacific-islander": ["Pacific Islander", "AAPI"],
    };
    if (raceKeywords[identity.race]) {
      parts.push(...raceKeywords[identity.race]);
    }
  }

  if (identity.religion && identity.religion !== "prefer-not-to-say" && identity.religion !== "none") {
    parts.push(identity.religion, "faith community", "religious");
  }

  if (identity.familyStructure) {
    if (identity.familyStructure === "single-parent" || identity.familyStructure === "with-children") {
      parts.push("families", "children", "parenting");
    }
    if (identity.familyStructure === "same-sex-parents") {
      parts.push("LGBTQ+ families", "same-sex parents", "queer families");
    }
  }

  if (identity.careerField) {
    parts.push(identity.careerField, "career", "professional");
  }

  if (parts.length === 0) {
    return "community stories diversity inclusion cities";
  }

  return parts.join(" ");
}

export async function getPersonalizedRecommendations(
  identity: UserIdentity,
  limit: number = 5
): Promise<{ id: string; title: string; excerpt: string; relevanceScore: number }[]> {
  const apiKey = process.env.COHERE_API_KEY;
  
  if (!apiKey) {
    console.log("Cohere API key not found, returning default recommendations");
    return ARTICLES.slice(0, limit).map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      relevanceScore: 0.5,
    }));
  }

  const query = buildUserQuery(identity);
  
  const documents = ARTICLES.map(article => 
    `${article.title}. ${article.excerpt} Tags: ${article.tags.join(", ")}`
  );

  try {
    const response = await fetch("https://api.cohere.ai/v1/rerank", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "rerank-english-v3.0",
        query,
        documents,
        top_n: limit,
        return_documents: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cohere API error:", response.status, errorText);
      return ARTICLES.slice(0, limit).map(article => ({
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        relevanceScore: 0.5,
      }));
    }

    const data = await response.json();
    const results: RerankResult[] = data.results || [];

    return results.map((result: RerankResult) => {
      const article = ARTICLES[result.index];
      return {
        id: article.id,
        title: article.title,
        excerpt: article.excerpt,
        relevanceScore: result.relevance_score,
      };
    });
  } catch (error) {
    console.error("Error calling Cohere API:", error);
    return ARTICLES.slice(0, limit).map(article => ({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      relevanceScore: 0.5,
    }));
  }
}
