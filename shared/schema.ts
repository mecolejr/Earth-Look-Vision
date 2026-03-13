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
 *    Newsletter personalisation can be achieved without storing raw PII by
 *    sending preference tokens or score ranges instead of raw identity labels.
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
 * ⚠️  The `preferences` JSONB column contains sensitive PII — see the data
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
         * ⚠️  SENSITIVE PII — see top-of-file notice.
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
