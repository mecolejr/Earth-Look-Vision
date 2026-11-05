export type BlogCategory = "city-spotlight" | "policy-changes" | "community-stories";

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  cityId?: string;
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  imageUrl?: string;
  tags: string[];
}

export const BLOG_CATEGORIES: Record<BlogCategory, { label: string; icon: string; color: string }> = {
  "city-spotlight": { label: "City Spotlights", icon: "map-pin", color: "#6B4E9C" },
  "policy-changes": { label: "Policy Changes", icon: "file-text", color: "#F4A261" },
  "community-stories": { label: "Community Stories", icon: "users", color: "#4CAF8E" },
};

export const blogArticles: BlogArticle[] = [
  {
    id: "austin-lgbtq-haven",
    title: "Austin: A Growing Haven for LGBTQ+ Families",
    excerpt: "How Texas's capital is becoming an unexpected sanctuary for queer families despite state politics.",
    content: `Austin has long been known as the "blue dot" in Texas, but its reputation as a haven for LGBTQ+ families has grown significantly over the past few years. Despite challenging state-level policies, the city has doubled down on local protections and community support.

**Local Protections in Action**

The Austin City Council has consistently passed resolutions affirming LGBTQ+ rights, and local law enforcement has received extensive training on serving the community. The city's non-discrimination ordinance provides protections that state law doesn't offer.

**Community Support Networks**

Organizations like Out Youth Austin and the Austin LGBTQ+ Chamber of Commerce have created strong support networks. There are over 50 LGBTQ+-owned businesses in the downtown area alone, and the community hosts one of the largest Pride celebrations in the South.

**Schools and Education**

Austin ISD has implemented comprehensive anti-bullying policies and support systems for LGBTQ+ students. Several schools have active Gender and Sexuality Alliances (GSAs), and the district provides training for teachers on supporting transgender and non-binary students.

**What Residents Say**

"We moved here from a smaller Texas town, and the difference is night and day," says Maria, who relocated with her wife and two children. "Our kids have friends with same-sex parents, and the schools have been incredibly supportive."

**Looking Forward**

While challenges remain at the state level, Austin continues to build infrastructure and community support that makes it an attractive option for LGBTQ+ families seeking both opportunity and acceptance in the South.`,
    category: "city-spotlight",
    cityId: "austin",
    author: "Sarah Chen",
    publishedAt: "2026-01-28",
    readTimeMinutes: 5,
    tags: ["LGBTQ+", "families", "Texas", "community"],
  },
  {
    id: "seattle-healthcare-update",
    title: "Seattle Expands Trans-Affirming Healthcare Access",
    excerpt: "New city initiative funds gender-affirming care for uninsured residents.",
    content: `Seattle has announced a groundbreaking initiative to expand access to gender-affirming healthcare for transgender and non-binary residents, regardless of insurance status.

**The New Initiative**

Starting March 2026, the city will allocate $5 million annually to fund gender-affirming care through public health clinics. This includes hormone therapy, mental health support, and assistance navigating surgical options.

**What's Covered**

The program covers:
- Hormone replacement therapy (HRT)
- Mental health counseling with trans-competent providers
- Navigation assistance for gender-affirming surgeries
- Voice therapy and other supportive services
- Legal name and gender marker change assistance

**Community Response**

Trans advocacy groups have praised the initiative. "This is life-changing for so many in our community," said Alex Rivera of the Seattle Trans Support Coalition. "Access to care shouldn't depend on your employer's insurance policy or your income level."

**Eligibility**

Seattle residents who are uninsured or underinsured can apply through participating clinics. There's no income requirement, though the program prioritizes those with the greatest financial need.

**National Implications**

Healthcare policy experts say Seattle's model could be replicated in other progressive cities. "This demonstrates that municipalities can take action even when state or federal policies fall short," noted Dr. Jennifer Walsh of the University of Washington.

The program launches in March 2026, with enrollment opening in February.`,
    category: "policy-changes",
    cityId: "seattle",
    author: "Jordan Martinez",
    publishedAt: "2026-01-25",
    readTimeMinutes: 4,
    tags: ["healthcare", "transgender", "policy", "Seattle"],
  },
  {
    id: "portland-bipoc-entrepreneur",
    title: "From Nigeria to Portland: A Black Entrepreneur's Journey",
    excerpt: "How Adaeze found community and success in the Pacific Northwest.",
    content: `When Adaeze Okonkwo moved from Lagos to Portland five years ago, she wasn't sure what to expect. Today, she runs one of the city's most successful African fusion restaurants and mentors other immigrant entrepreneurs.

**Finding Her Place**

"Portland surprised me," Adaeze recalls. "I'd heard it was very white, but I found pockets of incredible diversity and genuine welcome. The Nigerian community here is small but mighty."

She started by selling jollof rice at the Portland Saturday Market. The response was overwhelming. "People were curious and excited about African food. That encouraged me to dream bigger."

**Building Àṣẹ Kitchen**

In 2024, Adaeze opened Àṣẹ Kitchen (àṣẹ means "power" in Yoruba) in the Alberta Arts District. The restaurant combines Nigerian flavors with Pacific Northwest ingredients.

"I use local salmon but prepare it with suya spices. Oregon hazelnuts go into my chin chin. It's a conversation between cultures."

**The Challenges**

It hasn't been easy. "Financing was the biggest hurdle. Traditional banks didn't understand my business model." Adaeze eventually secured funding through a community development financial institution (CDFI) that specializes in supporting minority entrepreneurs.

She also faced microaggressions. "Some customers assumed I was staff, not the owner. But I've learned to let my food speak for itself."

**Paying It Forward**

Today, Adaeze runs quarterly workshops for immigrant entrepreneurs through the Black Oregon Business Collective. "I want to shorten the learning curve for others. If I can do this, anyone can."

**Her Advice**

"Find your people. Portland has resources for immigrants and entrepreneurs of color - you just have to know where to look. And don't wait until everything is perfect to start. Start small, learn, grow."

Àṣẹ Kitchen is located at 2847 NE Alberta Street and is open Tuesday through Sunday.`,
    category: "community-stories",
    cityId: "portland",
    author: "Marcus Thompson",
    publishedAt: "2026-01-22",
    readTimeMinutes: 6,
    tags: ["Black-owned", "immigrant", "entrepreneurship", "food"],
  },
  {
    id: "denver-disability-access",
    title: "Denver Leads Nation in Disability-Friendly Urban Design",
    excerpt: "New accessibility initiatives make the Mile High City more welcoming than ever.",
    content: `Denver has emerged as a national leader in disability-friendly urban design, with new initiatives that go far beyond ADA compliance.

**Beyond Compliance**

While federal law sets minimum accessibility standards, Denver's "Access for All" program aims to make the city genuinely welcoming for people with all types of disabilities.

"Compliance is the floor, not the ceiling," says City Councilwoman Patricia Hernandez, who uses a wheelchair. "We want Denver to be a place where disabled people thrive, not just survive."

**Key Initiatives**

The program includes:
- Sensory-friendly spaces in all new public buildings
- Audio description in city parks
- Subsidized accessible transit passes
- Employment programs for disabled residents
- Accessible housing requirements in new developments

**The Disability Community Weighs In**

"I've lived in five different cities, and Denver is by far the most accessible," says longtime resident Michael Torres, who is blind. "The audio crosswalks work, the transit system is reliable, and businesses actually want my patronage."

**Economic Impact**

The city estimates that improved accessibility has attracted over 10,000 new disabled residents in the past three years, contributing an estimated $500 million to the local economy.

**Lessons for Other Cities**

Denver's approach emphasizes involving disabled residents in planning from the start. "Nothing about us without us isn't just a slogan here," says Hernandez. "We have disabled people in decision-making roles across city government."

The Access for All program continues to expand, with new initiatives planned for 2026 including a disability-friendly tourism campaign and enhanced employment support.`,
    category: "policy-changes",
    cityId: "denver",
    author: "Lisa Wong",
    publishedAt: "2026-01-20",
    readTimeMinutes: 5,
    tags: ["disability", "accessibility", "urban planning", "Denver"],
  },
  {
    id: "toronto-immigrant-welcome",
    title: "Toronto's Immigrant Welcome Centers Transform Newcomer Experience",
    excerpt: "How Canada's largest city is rethinking immigrant integration.",
    content: `Toronto has opened five new Immigrant Welcome Centers across the city, offering a one-stop-shop for newcomers navigating life in Canada.

**A New Model**

Unlike traditional immigration services, these centers take a holistic approach. Each location offers language classes, employment services, housing assistance, and cultural orientation under one roof.

"We know that settling in a new country is overwhelming," says Program Director Fatima Hassan. "Our goal is to reduce that stress by having everything in one place."

**Services Offered**

Each Welcome Center provides:
- Language assessment and classes in 12 languages
- Employment workshops and job placement assistance
- Housing navigators who help find appropriate accommodation
- Mental health support with culturally competent counselors
- Legal clinics for immigration questions
- Children's programs and childcare during appointments

**Community Partners**

The centers work with over 100 community organizations representing different cultural groups. "We can't serve everyone ourselves," Hassan explains. "But we can connect newcomers to communities that understand their specific needs."

**Early Results**

In the first six months, the centers have served over 25,000 newcomers. Employment rates for users are 40% higher than for those who don't use the services, and users report significantly higher satisfaction with their settlement experience.

**A Personal Story**

Ahmed and Layla arrived from Syria with their three children last spring. "The Welcome Center in Scarborough saved us," Layla says. "They helped us find an apartment, enroll the kids in school, and find jobs. We felt like we had family here."

The centers are open Monday through Saturday, with evening hours on Thursdays. No appointment is necessary for initial consultations.`,
    category: "city-spotlight",
    cityId: "toronto",
    author: "Priya Sharma",
    publishedAt: "2026-01-18",
    readTimeMinutes: 5,
    tags: ["immigration", "refugees", "services", "Toronto"],
  },
  {
    id: "sf-housing-crisis-lgbtq",
    title: "San Francisco Addresses LGBTQ+ Senior Housing Crisis",
    excerpt: "New development provides safe, affordable housing for LGBTQ+ elders.",
    content: `San Francisco has opened a new affordable housing complex specifically designed for LGBTQ+ seniors, addressing a growing crisis as the community's pioneers age.

**The Challenge**

Many LGBTQ+ seniors face unique challenges: they're more likely to be single, less likely to have children who can provide support, and may face discrimination in traditional senior housing.

"Some of our residents went back into the closet in other facilities because they didn't feel safe," says Executive Director Robert Chen of Lavender Seniors of the Bay Area. "That's unacceptable after a lifetime of fighting for visibility."

**Harvey Milk Senior Housing**

The new 100-unit development in the Castro District offers affordable apartments for LGBTQ+ seniors aged 62 and over, with 20% of units reserved for formerly homeless individuals.

Amenities include:
- On-site health clinic with LGBTQ+-competent providers
- Community spaces for programming and socialization
- Rooftop garden
- Pet-friendly policies
- Intergenerational programming with local LGBTQ+ youth groups

**More Than Housing**

"This isn't just about four walls and a roof," says resident Patricia Williams, 78, a longtime activist. "It's about community. I can walk down the hall and find people who understand my life, my history, my needs."

**A Model for Other Cities**

San Francisco's model is being studied by cities across the country. "Every city with an aging LGBTQ+ population needs to be thinking about this," notes researcher Dr. Soon-Young Park. "These are the Stonewall generation. They deserve to age with dignity."

Applications for the waitlist are available through the San Francisco Mayor's Office of Housing and Community Development.`,
    category: "community-stories",
    cityId: "san-francisco",
    author: "David Kim",
    publishedAt: "2026-01-15",
    readTimeMinutes: 5,
    tags: ["LGBTQ+", "seniors", "housing", "San Francisco"],
  },
  {
    id: "chicago-hate-crime-response",
    title: "Chicago Launches Innovative Hate Crime Response Program",
    excerpt: "New initiative combines rapid response with community healing.",
    content: `Chicago has launched a comprehensive hate crime response program that aims to both hold perpetrators accountable and help communities heal.

**A Dual Approach**

The "Justice and Healing" program pairs enhanced law enforcement response with community-based restorative practices.

"Prosecution alone doesn't heal communities," says Cook County State's Attorney Maria Rodriguez. "We need both justice and healing."

**How It Works**

When a hate crime occurs:
1. Specialized detectives respond within hours
2. Victim advocates provide immediate support
3. Community liaisons connect with affected groups
4. Restorative circles are offered if appropriate
5. Long-term counseling is available for all affected

**Early Results**

In the program's first year, hate crime clearance rates have increased by 35%, and victim satisfaction with the justice process has more than doubled.

"Finally, I felt like the system was on my side," says one victim who was attacked outside a mosque. "They didn't just take a report and disappear."

**Community Involvement**

The program was developed with extensive input from communities most affected by hate crimes, including Muslim, Jewish, Black, LGBTQ+, and Asian American communities.

"Our voices shaped this program," says community leader James Washington. "That's why it works."

**Training and Resources**

All Chicago police officers now receive annual hate crime training, and specialized units can be deployed to any district. The city has also launched a multilingual reporting hotline and app.

The program is funded through a combination of city funds, federal grants, and private philanthropy.`,
    category: "policy-changes",
    cityId: "chicago",
    author: "Angela Foster",
    publishedAt: "2026-01-12",
    readTimeMinutes: 5,
    tags: ["hate crimes", "safety", "community", "Chicago"],
  },
  {
    id: "montreal-bilingual-rainbow",
    title: "Montreal: Where Bilingual Culture Meets LGBTQ+ Celebration",
    excerpt: "How Quebec's vibrant metropolis creates space for diverse identities.",
    content: `Montreal has long been known for its unique bilingual culture, but the city is equally notable for its vibrant and welcoming LGBTQ+ community.

**A Cultural Crossroads**

"Being queer in Montreal means being part of multiple cultures," explains local artist Marie-Claire Dubois. "We have the French influence, the English influence, and our own queer culture that draws from both."

The city's famous Village (Le Village) is one of North America's largest LGBTQ+ neighborhoods, featuring pedestrian-only streets in summer and year-round programming.

**Healthcare and Rights**

Quebec was one of the first Canadian provinces to add sexual orientation to its human rights charter (1977) and to recognize same-sex relationships (1999). Today, Montreal offers:

- Comprehensive gender-affirming care through the public healthcare system
- LGBTQ+-specific mental health services
- Support for queer refugees and asylum seekers
- Youth programs in both French and English

**The Arts Scene**

Montreal's LGBTQ+ arts scene is thriving. Divers/Cité, the city's Pride festival, draws over a million attendees annually. Year-round, venues like Cabaret Mado and Unity offer drag, music, and community events.

"The arts here are so integrated," says performer Alexandre St-Pierre. "Queer artists aren't siloed - we're part of the mainstream Montreal cultural scene."

**Challenges and Progress**

Like everywhere, Montreal isn't perfect. Racism within LGBTQ+ spaces and challenges for trans residents persist. But organizations like AGIR and the Coalition des familles LGBT+ are working to address these issues.

**Why People Stay**

"I could live anywhere," says long-time resident Sophie Tremblay. "But Montreal gives me affordable rent, excellent healthcare, a thriving queer scene, and maple syrup. What more could I want?"`,
    category: "city-spotlight",
    cityId: "montreal",
    author: "Jean-François Roy",
    publishedAt: "2026-01-08",
    readTimeMinutes: 6,
    tags: ["LGBTQ+", "culture", "bilingual", "Montreal"],
  },
];

export function getArticlesByCategory(category: BlogCategory): BlogArticle[] {
  return blogArticles.filter((article) => article.category === category);
}

export function getArticleById(id: string): BlogArticle | undefined {
  return blogArticles.find((article) => article.id === id);
}

export function getLatestArticles(count: number = 5): BlogArticle[] {
  return [...blogArticles]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, count);
}

export function getArticlesForCity(cityId: string): BlogArticle[] {
  return blogArticles.filter((article) => article.cityId === cityId);
}
