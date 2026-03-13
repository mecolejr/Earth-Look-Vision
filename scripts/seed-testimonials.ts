/**
 * seed-testimonials.ts
 *
 * Inserts a curated set of approved seed testimonials for all 8 cities
 * so the "People Like You" feature is not empty on first launch.
 *
 * Run with:
 *   npx tsx scripts/seed-testimonials.ts
 *
 * Safe to re-run — it skips cities that already have approved testimonials.
 */

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "../shared/schema";
import { eq, and } from "drizzle-orm";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// ─────────────────────────────────────────────────────────────────────────────
// Seed data — diverse voices across identities and cities.
// All content is realistic and considerate. Identity fields are optional
// in production (users choose what to share); here they are set to power
// the "People Like You" matching feature from day one.
// ─────────────────────────────────────────────────────────────────────────────
const seeds: Array<schema.InsertTestimonial & { status: "approved" }> = [
  // ── San Francisco ──────────────────────────────────────────────────────────
  {
    cityId: "san-francisco",
    rating: 5,
    content:
      "The Castro neighborhood gave me community I never had back home. Healthcare providers here are genuinely affirming — not just tolerant, actually celebratory.",
    displayName: "Jordan T.",
    genderIdentity: "non-binary",
    sexualOrientation: "queer",
    status: "approved",
  },
  {
    cityId: "san-francisco",
    rating: 4,
    content:
      "Cost of living is real, but the Asian community here is vast. I found Cantonese-speaking doctors, cultural grocery stores, and a whole support network within weeks.",
    displayName: "Michelle L.",
    ethnicity: "asian",
    status: "approved",
  },
  {
    cityId: "san-francisco",
    rating: 3,
    content:
      "Progressive politics and strong worker protections. The housing crisis is a serious barrier though — budget carefully before you commit.",
    displayName: "Devin R.",
    ethnicity: "black",
    status: "approved",
  },

  // ── New York ───────────────────────────────────────────────────────────────
  {
    cityId: "new-york",
    rating: 5,
    content:
      "Harlem is home. The Black cultural institutions, the food, the history — I've never felt more rooted anywhere. This city sees me.",
    displayName: "Marcus W.",
    ethnicity: "black",
    status: "approved",
  },
  {
    cityId: "new-york",
    rating: 4,
    content:
      "Jackson Heights in Queens is the most diverse neighborhood I've ever lived in. I hear my language at the bodega and find my food at every corner.",
    displayName: "Priya S.",
    ethnicity: "south-asian",
    status: "approved",
  },
  {
    cityId: "new-york",
    rating: 4,
    content:
      "Brooklyn's queer scene is thriving and genuinely intersectional. Not just white gay bars — real community across identities.",
    displayName: "Sam K.",
    genderIdentity: "trans woman",
    sexualOrientation: "lesbian",
    status: "approved",
  },

  // ── Austin ─────────────────────────────────────────────────────────────────
  {
    cityId: "austin",
    rating: 3,
    content:
      "The tech scene is great and I found a solid Latino community in East Austin. State-level politics are a concern — know what you're walking into.",
    displayName: "Carlos M.",
    ethnicity: "hispanic",
    status: "approved",
  },
  {
    cityId: "austin",
    rating: 4,
    content:
      "Surprisingly welcoming LGBTQ+ scene for Texas. The annual Pride is massive. Just be aware that state laws don't reflect the city's vibe.",
    displayName: "Riley B.",
    genderIdentity: "non-binary",
    sexualOrientation: "bisexual",
    status: "approved",
  },

  // ── Toronto ────────────────────────────────────────────────────────────────
  {
    cityId: "toronto",
    rating: 5,
    content:
      "As a Black Muslim woman I was bracing for difficulty. Toronto surprised me — diverse neighborhoods, halal food everywhere, and people who don't treat my hijab as a political statement.",
    displayName: "Fatima A.",
    ethnicity: "black",
    religion: "muslim",
    status: "approved",
  },
  {
    cityId: "toronto",
    rating: 5,
    content:
      "Scarborough has the largest Somali diaspora outside East Africa. I moved here and immediately had a community. Healthcare is universal. This city is a gift.",
    displayName: "Ahmed H.",
    ethnicity: "black",
    status: "approved",
  },
  {
    cityId: "toronto",
    rating: 4,
    content:
      "Church Street is iconic. The queer community has real political influence here — not just a party scene but genuine advocacy and housing support.",
    displayName: "Alex V.",
    sexualOrientation: "gay",
    status: "approved",
  },

  // ── Berlin ─────────────────────────────────────────────────────────────────
  {
    cityId: "berlin",
    rating: 5,
    content:
      "The queer scene is unlike anywhere else — radical acceptance, Berghain is just the tip of it. Legal protections are strong and enforced. Moved here and never looked back.",
    displayName: "Lukas F.",
    genderIdentity: "trans man",
    sexualOrientation: "queer",
    status: "approved",
  },
  {
    cityId: "berlin",
    rating: 3,
    content:
      "Great for queer people. As a Black person, I've had to navigate some racial dynamics, particularly outside the city center. Neukölln and Kreuzberg are noticeably more diverse and comfortable.",
    displayName: "Amara N.",
    ethnicity: "black",
    status: "approved",
  },

  // ── Barcelona ──────────────────────────────────────────────────────────────
  {
    cityId: "barcelona",
    rating: 4,
    content:
      "Eixample — the Gayxample — is one of the most welcoming neighborhoods I've lived in. Legal protections are solid and the culture is warm. Language is the only real barrier.",
    displayName: "Pau G.",
    sexualOrientation: "gay",
    status: "approved",
  },
  {
    cityId: "barcelona",
    rating: 3,
    content:
      "Beautiful city. As a Muslim woman, I found a small but tight-knit community. Some neighborhoods are more welcoming than others. Overall I felt safe.",
    displayName: "Yasmine B.",
    religion: "muslim",
    status: "approved",
  },

  // ── Amsterdam ──────────────────────────────────────────────────────────────
  {
    cityId: "amsterdam",
    rating: 5,
    content:
      "The Netherlands has one of the strongest legal frameworks for LGBTQ+ rights. Day-to-day life reflects that — I've held my partner's hand everywhere without a second thought.",
    displayName: "Nina K.",
    sexualOrientation: "lesbian",
    status: "approved",
  },
  {
    cityId: "amsterdam",
    rating: 4,
    content:
      "The Surinamese and Caribbean community here is strong. Finding my culture in Europe was something I didn't expect. Housing is expensive but the quality of life is worth it.",
    displayName: "Damian O.",
    ethnicity: "black",
    status: "approved",
  },

  // ── Seattle ────────────────────────────────────────────────────────────────
  {
    cityId: "seattle",
    rating: 4,
    content:
      "Capitol Hill has a real queer community, not just bars. I found healthcare providers, therapists, and a found family. The rain is real but so is the belonging.",
    displayName: "Tay M.",
    genderIdentity: "non-binary",
    sexualOrientation: "queer",
    status: "approved",
  },
  {
    cityId: "seattle",
    rating: 4,
    content:
      "The International District is home. Vietnamese restaurants, community organizations, and neighbors who share my background. One of the strongest Asian communities in the Pacific Northwest.",
    displayName: "Linh N.",
    ethnicity: "asian",
    status: "approved",
  },
  {
    cityId: "seattle",
    rating: 3,
    content:
      "Good tech jobs and strong union culture. The homelessness crisis and housing costs are real challenges. As a Black professional I've found community but gentrification is erasing it fast.",
    displayName: "Javon C.",
    ethnicity: "black",
    status: "approved",
  },
];

async function seed() {
  console.log("🌱  Starting testimonials seed…\n");

  let inserted = 0;
  let skipped = 0;

  for (const row of seeds) {
    // Check if an approved testimonial with same city + content already exists
    const existing = await db
      .select({ id: schema.testimonials.id })
      .from(schema.testimonials)
      .where(
        and(
          eq(schema.testimonials.cityId, row.cityId),
          eq(schema.testimonials.content, row.content)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      console.log(`  skip  [${row.cityId}] "${row.content.slice(0, 50)}…"`);
      skipped++;
      continue;
    }

    await db.insert(schema.testimonials).values({
      cityId: row.cityId,
      rating: row.rating,
      content: row.content,
      displayName: row.displayName ?? null,
      ethnicity: row.ethnicity ?? null,
      genderIdentity: row.genderIdentity ?? null,
      sexualOrientation: row.sexualOrientation ?? null,
      religion: row.religion ?? null,
      status: "approved",
    });

    console.log(`  ✓  [${row.cityId}] "${row.content.slice(0, 50)}…"`);
    inserted++;
  }

  console.log(`\n✅  Done — ${inserted} inserted, ${skipped} already existed.`);
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  pool.end();
  process.exit(1);
});
