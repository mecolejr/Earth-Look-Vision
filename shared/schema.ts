/**
 * IMPORTANT — DATA SENSITIVITY NOTICE (Issue #1)
 *
 * The `newsletterSubscribers` table stores sensitive personal identity data
 * (ethnicity, gender identity, sexual orientation, religion, political views)
 * in a plain JSONB column. This creates serious ethical, legal (GDPR/CCPA),
 * and reputational risk for an app whose primary users are from marginalized
 * communities.
 *
 * REQUIRED before production launch:
 * 1. Implement field-level encryption for the `preferences` column, OR
 * 2. Store only a hashed/anonymised preference profile (not raw identity values), OR
 * 3. Remove identity fields entirely — most newsletter tools do not need them.
 * Newsletter personalisation can be achieved without storing raw PII by
 * sending preference tokens or score ranges instead of raw identity labels.
 *
 * DATA RETENTION POLICY (must be implemented):
 * - Inactive subscribers should be purged after 12 months (set isActive=false,
 *   then delete after grace period).
 * - On unsubscribe, identity fields in `preferences` must be deleted immediately;
 *   only the email address should be retained for suppression list purposes.
 * - User-facing privacy policy must document which fields are stored and for
 *   how long, as required by GDPR Article 13/14 and CCPA.
 *
 * See: https://gdpr-info.eu/art-9-gdpr/ (special categories of personal data)
 */

import { sql } from "drizzle-orm";
import {
      pgTable,
      text,
      varchar,
      timestamp,
      jsonb,
      boolean,
      integer,
      real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
      id: varchar("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
      username: text("username").notNull().unique(),
      password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
      username: true,
      password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

/**
 * newsletterSubscribers
 *
 * Warning: The `preferences` JSONB column contains sensitive PII — see the data
 * sensitivity notice at the top of this file before making changes.
 *
 * The identity fields (ethnicity, genderIdentity, sexualOrientation, religion,
 * politicalViews) are SPECIAL CATEGORY data under GDPR Art. 9 and must be
 * treated with the highest level of care. They must NOT be logged, exposed
 * in error messages, or transmitted to third-party analytics services.
 */
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
      id: varchar("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
      email: text("email").notNull().unique(),
      subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
      isActive: boolean("is_active").default(true).notNull(),
      /**
             * Warning: SENSITIVE PII — see top-of-file notice.
       * TODO: Encrypt this column at rest before production launch.
       * Consider storing only hashed preference tokens rather than raw values.
       */
      preferences: jsonb("preferences").$type<{
              ethnicity?: string[];
              genderIdentity?: string;
              sexualOrientation?: string;
              religion?: string;
              politicalViews?: string;
              priorityWeights?: Record<string, number>;
              topCities?: string[];
      }>(),
      frequency: text("frequency").default("weekly").notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(
      newsletterSubscribers
    ).pick({
      email: true,
      preferences: true,
      frequency: true,
});

export type InsertNewsletterSubscriber = z.infer<
      typeof insertNewsletterSubscriberSchema
    >;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

/**
 * testimonials
 *
 * Feature 2 — Community Testimonials & "People Like You" Layer
 *
 * Stores user-submitted testimonials about cities, tagged with the identity
 * dimensions the user is comfortable associating with their review.
 *
 * PRIVACY NOTE: Identity fields are ALL optional. Users choose which dimensions
 * to share. "anonymous" is the default — no identity fields required.
 *
 * MODERATION: `status` field supports a lightweight review queue.
 * Only "approved" testimonials are served to end users.
 */
export const testimonials = pgTable("testimonials", {
      id: varchar("id")
        .primaryKey()
        .default(sql`gen_random_uuid()`),
      cityId: text("city_id").notNull(),
      /**
             * Short text (max 280 chars). Moderated before display.
       */
      content: text("content").notNull(),
      /**
             * Star rating 1-5.
       */
      rating: integer("rating").notNull(),
      /**
             * Identity dimensions the user chose to associate with this testimonial.
       * All optional — privacy-first by default.
       */
      ethnicity: text("ethnicity"),
      genderIdentity: text("gender_identity"),
      sexualOrientation: text("sexual_orientation"),
      religion: text("religion"),
      /**
             * "pending" | "approved" | "rejected"
       * New submissions start as "pending" and require moderation.
       */
      status: text("status").default("pending").notNull(),
      /**
             * Optional author display name. Null = shown as "Anonymous".
       */
      displayName: text("display_name"),
      createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials)
  .pick({
          cityId: true,
          content: true,
          rating: true,
          ethnicity: true,
          genderIdentity: true,
          sexualOrientation: true,
          religion: true,
          displayName: true,
  })
  .extend({
          content: z.string().min(10).max(280),
          rating: z.number().int().min(1).max(5),
          cityId: z.string().min(1),
          ethnicity: z.string().optional(),
          genderIdentity: z.string().optional(),
          sexualOrientation: z.string().optional(),
          religion: z.string().optional(),
          displayName: z.string().max(50).optional(),
  });

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
