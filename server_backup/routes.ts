import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "node:http";
import { db } from "./db";
import { newsletterSubscribers, testimonials } from "@shared/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { z } from "zod";
import { sendWelcomeEmail } from "./resend";
import { getWeatherForecast, getCurrentWeather } from "./weather";
import { getPersonalizedRecommendations } from "./cohere";

// ─────────────────────────────────────────────────────────────────────────────
// Admin auth middleware — protects all /admin/* routes with a bearer token.
// Set ADMIN_SECRET in your environment variables. Never hard-code a value here.
// ─────────────────────────────────────────────────────────────────────────────
function adminAuth(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    // Fail closed: if no secret is configured, block all admin access.
    return res.status(503).json({ error: "Admin access not configured" });
  }
  const authHeader = req.headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || token !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Validation schema for newsletter subscription email
const newsletterSchema = z.object({
      email: z.string().email(),
      frequency: z.string().optional(),
      preferences: z.object({}).passthrough().optional().nullable(),
});

// Validation schema for user identity (used in recommendations endpoint)
const UserIdentitySchema = z.object({
      race: z.string().optional(),
      gender: z.string().optional(),
      sexuality: z.string().optional(),
      religion: z.string().optional(),
      politicalViews: z.string().optional(),
      familyStructure: z.string().optional(),
      careerField: z.string().optional(),
});

// Coordinate pattern for Google Maps API inputs
const COORDINATE_PATTERN = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;

/**
 * Feature 2 — Testimonial submission schema.
 * Mirrors the Zod schema in shared/schema.ts but is re-declared here
 * so routes.ts doesn't need to import from the schema directly.
 */
const TestimonialSubmitSchema = z.object({
      cityId: z.string().min(1),
      content: z.string().min(10).max(280),
      rating: z.number().int().min(1).max(5),
      // Identity dimensions — all optional, privacy-first
      ethnicity: z.string().optional(),
      genderIdentity: z.string().optional(),
      sexualOrientation: z.string().optional(),
      religion: z.string().optional(),
      displayName: z.string().max(50).optional(),
});

/**
 * Feature 2 — Identity match query schema.
 * Used by GET /api/testimonials/:cityId to filter by identity dimensions.
 */
const IdentityFilterSchema = z.object({
      ethnicity: z.string().optional(),
      genderIdentity: z.string().optional(),
      sexualOrientation: z.string().optional(),
      religion: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
      // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
          try {
                    // Issue #6: Use Zod for proper email validation
            const result = newsletterSchema.safeParse(req.body);
                    if (!result.success) {
                                return res.status(400).json({ error: "Invalid email address" });
                    }

            const { email, frequency, preferences } = result.data;

            // Check if already subscribed
            const existing = await db
                      .select()
                      .from(newsletterSubscribers)
                      .where(eq(newsletterSubscribers.email, email.toLowerCase()))
                      .limit(1);

            if (existing.length > 0) {
                        await db
                          .update(newsletterSubscribers)
                          .set({
                                          isActive: true,
                                          frequency: frequency || "weekly",
                                          preferences: preferences || null,
                          })
                          .where(eq(newsletterSubscribers.email, email.toLowerCase()));
                        return res.json({ message: "Subscription updated", reactivated: true });
            }

            await db.insert(newsletterSubscribers).values({
                        email: email.toLowerCase(),
                        frequency: frequency || "weekly",
                        preferences: preferences || null,
            });

            sendWelcomeEmail(email.toLowerCase()).catch((err) => {
                        console.error("Failed to send welcome email:", err);
            });

            res.json({ message: "Successfully subscribed" });
          } catch (error) {
                    console.error("Newsletter subscription error:", error);
                    res.status(500).json({ error: "Failed to subscribe" });
          }
  });

  // Unsubscribe endpoint
  app.post("/api/newsletter/unsubscribe", async (req, res) => {
          try {
                    const { email } = req.body;
                    if (!email || typeof email !== "string") {
                                return res.status(400).json({ error: "Email is required" });
                    }
                    await db
                      .update(newsletterSubscribers)
                      .set({ isActive: false })
                      .where(eq(newsletterSubscribers.email, email.toLowerCase()));
                    res.json({ message: "Successfully unsubscribed" });
          } catch (error) {
                    console.error("Newsletter unsubscribe error:", error);
                    res.status(500).json({ error: "Failed to unsubscribe" });
          }
  });

  // Weather API endpoints (National Weather Service - no API key required)
  app.get("/api/weather/forecast", async (req, res) => {
          try {
                    const { lat, lon } = req.query;
                    if (!lat || !lon) {
                                return res
                                  .status(400)
                                  .json({ error: "Latitude and longitude are required" });
                    }
                    const latitude = parseFloat(lat as string);
                    const longitude = parseFloat(lon as string);
                    if (isNaN(latitude) || isNaN(longitude)) {
                                return res.status(400).json({ error: "Invalid coordinates" });
                    }
                    const forecast = await getWeatherForecast(latitude, longitude);
                    res.json(forecast);
          } catch (error) {
                    console.error("Weather forecast error:", error);
                    res.status(500).json({ error: "Failed to fetch weather forecast" });
          }
  });

  app.get("/api/weather/current", async (req, res) => {
          try {
                    const { lat, lon } = req.query;
                    if (!lat || !lon) {
                                return res
                                  .status(400)
                                  .json({ error: "Latitude and longitude are required" });
                    }
                    const latitude = parseFloat(lat as string);
                    const longitude = parseFloat(lon as string);
                    if (isNaN(latitude) || isNaN(longitude)) {
                                return res.status(400).json({ error: "Invalid coordinates" });
                    }
                    const current = await getCurrentWeather(latitude, longitude);
                    res.json(current);
          } catch (error) {
                    console.error("Current weather error:", error);
                    res.status(500).json({ error: "Failed to fetch current weather" });
          }
  });

  // Personalized content recommendations using Cohere AI
  // Issue #5: Validate identity input with Zod schema
  app.post("/api/recommendations", async (req, res) => {
          try {
                    const { identity, limit = 5 } = req.body;
                    if (!identity || typeof identity !== "object") {
                                return res.status(400).json({ error: "Identity profile is required" });
                    }
                    const identityResult = UserIdentitySchema.safeParse(identity);
                    if (!identityResult.success) {
                                return res.status(400).json({ error: "Invalid identity profile" });
                    }
                    const recommendations = await getPersonalizedRecommendations(
                                identityResult.data,
                                typeof limit === "number" ? limit : 5
                              );
                    res.json({ recommendations });
          } catch (error) {
                    console.error("Recommendations error:", error);
                    res.status(500).json({ error: "Failed to get recommendations" });
          }
  });

  // Distance calculation using Google Maps Distance Matrix API
  // Issue #20: Validate coordinate inputs before passing to Google Maps
  app.get("/api/distances", async (req, res) => {
          try {
                    const { origin, destinations } = req.query;
                    if (!origin || !destinations) {
                                return res
                                  .status(400)
                                  .json({ error: "Origin and destinations are required" });
                    }
                    const originStr = origin as string;
                    const destinationsStr = destinations as string;
                    if (!COORDINATE_PATTERN.test(originStr)) {
                                return res
                                  .status(400)
                                  .json({ error: "Invalid origin format. Expected: lat,lng" });
                    }
                    const destList = destinationsStr.split("|");
                    if (!destList.every((d) => COORDINATE_PATTERN.test(d.trim()))) {
                                return res
                                  .status(400)
                                  .json({ error: "Invalid destinations format. Expected: lat,lng|lat,lng" });
                    }
                    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
                    if (!apiKey) {
                                return res
                                  .status(500)
                                  .json({ error: "Google Maps API key not configured" });
                    }
                    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(originStr)}&destinations=${encodeURIComponent(destinationsStr)}&units=imperial&key=${apiKey}`;
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.status !== "OK") {
                                return res.status(500).json({ error: "Failed to calculate distances" });
                    }
                    const distances = data.rows[0]?.elements
                      ?.map((element: any) => {
                                    if (element.status === "OK") {
                                                    return {
                                                                      distance: element.distance.text,
                                                                      duration: element.duration.text,
                                                    };
                                    }
                                    return null;
                      })
                      .filter(Boolean);
                    res.json({ distances });
          } catch (error) {
                    console.error("Distance calculation error:", error);
                    res.status(500).json({ error: "Failed to calculate distances" });
          }
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Feature 2 — Community Testimonials
  // ─────────────────────────────────────────────────────────────────────────

  /**
       * POST /api/testimonials
       * Submit a new testimonial. Starts in "pending" status — requires moderation
       * before it is visible to other users.
       */
  app.post("/api/testimonials", async (req, res) => {
          try {
                    const result = TestimonialSubmitSchema.safeParse(req.body);
                    if (!result.success) {
                                return res.status(400).json({
                                              error: "Invalid testimonial data",
                                              details: result.error.flatten().fieldErrors,
                                });
                    }
                    const {
                                cityId,
                                content,
                                rating,
                                ethnicity,
                                genderIdentity,
                                sexualOrientation,
                                religion,
                                displayName,
                    } = result.data;

            const [inserted] = await db
                      .insert(testimonials)
                      .values({
                                    cityId,
                                    content,
                                    rating,
                                    ethnicity: ethnicity || null,
                                    genderIdentity: genderIdentity || null,
                                    sexualOrientation: sexualOrientation || null,
                                    religion: religion || null,
                                    displayName: displayName || null,
                                    status: "pending",
                      })
                      .returning({ id: testimonials.id });

            res.status(201).json({
                        message:
                                      "Testimonial submitted for review. It will appear once approved.",
                        id: inserted.id,
            });
          } catch (error) {
                    console.error("Testimonial submission error:", error);
                    res.status(500).json({ error: "Failed to submit testimonial" });
          }
  });

  /**
       * GET /api/testimonials/:cityId
       * Fetch approved testimonials for a city, optionally filtered to
       * identity-matching testimonials first.
       *
       * Query params (all optional, for identity matching):
       *   ethnicity, genderIdentity, sexualOrientation, religion
       *
       * Returns:
       *   { testimonials: Testimonial[], aggregate: TestimonialAggregate }
       */
  app.get("/api/testimonials/:cityId", async (req, res) => {
          try {
                    const { cityId } = req.params;
                    if (!cityId) {
                                return res.status(400).json({ error: "cityId is required" });
                    }

            // Parse optional identity filter from query params
            const filterResult = IdentityFilterSchema.safeParse(req.query);
                    const identityFilter = filterResult.success ? filterResult.data : {};

            // Fetch all approved testimonials for this city
            const allTestimonials = await db
                      .select()
                      .from(testimonials)
                      .where(
                                    and(
                                                    eq(testimonials.cityId, cityId),
                                                    eq(testimonials.status, "approved")
                                                  )
                                  )
                      .orderBy(testimonials.createdAt);

            // Compute aggregate stats
            const totalCount = allTestimonials.length;
                    const averageRating =
                                totalCount > 0
                        ? allTestimonials.reduce((sum, t) => sum + t.rating, 0) / totalCount
                                  : 0;

            // Identity matching: find testimonials that share at least one dimension
            const matchedDimensions: string[] = [];
                    let identityMatched = allTestimonials;

            if (Object.values(identityFilter).some(Boolean)) {
                        identityMatched = allTestimonials.filter((t) => {
                                      const matches: string[] = [];
                                      if (identityFilter.ethnicity && t.ethnicity === identityFilter.ethnicity) {
                                                      matches.push("race/ethnicity");
                                      }
                                      if (identityFilter.genderIdentity && t.genderIdentity === identityFilter.genderIdentity) {
                                                      matches.push("gender identity");
                                      }
                                      if (identityFilter.sexualOrientation && t.sexualOrientation === identityFilter.sexualOrientation) {
                                                      matches.push("sexual orientation");
                                      }
                                      if (identityFilter.religion && t.religion === identityFilter.religion) {
                                                      matches.push("religion");
                                      }
                                      if (matches.length > 0) {
                                                      matches.forEach((m) => {
                                                                        if (!matchedDimensions.includes(m)) matchedDimensions.push(m);
                                                      });
                                      }
                                      return matches.length > 0;
                        });
            }

            const identityMatchCount = identityMatched.length;
                    const identityMatchRating =
                                identityMatchCount > 0
                        ? identityMatched.reduce((sum, t) => sum + t.rating, 0) /
                                    identityMatchCount
                                  : undefined;

            // Sort: identity-matched first, then all others, most recent first
            const sortedTestimonials =
                        identityMatchCount > 0
                        ? [
                                          ...identityMatched,
                                          ...allTestimonials.filter(
                                                              (t) => !identityMatched.some((m) => m.id === t.id)
                                                            ),
                                        ]
                          : allTestimonials;

            // Strip internal moderation fields before sending to client
            const safeTestimonials = sortedTestimonials.map((t) => ({
                        id: t.id,
                        cityId: t.cityId,
                        content: t.content,
                        rating: t.rating,
                        ethnicity: t.ethnicity,
                        genderIdentity: t.genderIdentity,
                        sexualOrientation: t.sexualOrientation,
                        religion: t.religion,
                        displayName: t.displayName,
                        createdAt: t.createdAt,
            }));

            res.json({
                        testimonials: safeTestimonials,
                        aggregate: {
                                      cityId,
                                      averageRating: Math.round(averageRating * 10) / 10,
                                      totalCount,
                                      identityMatchRating:
                                                      identityMatchRating !== undefined
                                          ? Math.round(identityMatchRating * 10) / 10
                                                        : undefined,
                                      identityMatchCount:
                                                      identityMatchCount > 0 ? identityMatchCount : undefined,
                                      matchedDimensions:
                                                      matchedDimensions.length > 0 ? matchedDimensions : undefined,
                        },
            });
          } catch (error) {
                    console.error("Testimonials fetch error:", error);
                    res.status(500).json({ error: "Failed to fetch testimonials" });
          }
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // Admin — Testimonials Moderation
  // All routes below are protected by the adminAuth middleware.
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * GET /api/admin/testimonials
   * Returns all testimonials, newest first, grouped by status.
   * Query param: ?status=pending|approved|rejected (defaults to all)
   */
  app.get("/api/admin/testimonials", adminAuth, async (req, res) => {
    try {
      const statusFilter = req.query.status as string | undefined;
      const validStatuses = ["pending", "approved", "rejected"];

      let query = db
        .select()
        .from(testimonials)
        .orderBy(desc(testimonials.createdAt));

      const rows = await query;

      const filtered =
        statusFilter && validStatuses.includes(statusFilter)
          ? rows.filter((t) => t.status === statusFilter)
          : rows;

      const counts = {
        pending: rows.filter((t) => t.status === "pending").length,
        approved: rows.filter((t) => t.status === "approved").length,
        rejected: rows.filter((t) => t.status === "rejected").length,
        total: rows.length,
      };

      res.json({ testimonials: filtered, counts });
    } catch (error) {
      console.error("Admin testimonials fetch error:", error);
      res.status(500).json({ error: "Failed to fetch testimonials" });
    }
  });

  /**
   * POST /api/admin/testimonials/:id/approve
   * Moves a testimonial to "approved" status so it appears to users.
   */
  app.post("/api/admin/testimonials/:id/approve", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(testimonials)
        .set({ status: "approved" })
        .where(eq(testimonials.id, id))
        .returning({ id: testimonials.id, status: testimonials.status });

      if (!updated) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json({ message: "Testimonial approved", id: updated.id, status: updated.status });
    } catch (error) {
      console.error("Admin approve error:", error);
      res.status(500).json({ error: "Failed to approve testimonial" });
    }
  });

  /**
   * POST /api/admin/testimonials/:id/reject
   * Moves a testimonial to "rejected" status, hiding it from users.
   */
  app.post("/api/admin/testimonials/:id/reject", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const [updated] = await db
        .update(testimonials)
        .set({ status: "rejected" })
        .where(eq(testimonials.id, id))
        .returning({ id: testimonials.id, status: testimonials.status });

      if (!updated) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json({ message: "Testimonial rejected", id: updated.id, status: updated.status });
    } catch (error) {
      console.error("Admin reject error:", error);
      res.status(500).json({ error: "Failed to reject testimonial" });
    }
  });

  /**
   * DELETE /api/admin/testimonials/:id
   * Permanently deletes a testimonial (use only for spam/illegal content).
   */
  app.delete("/api/admin/testimonials/:id", adminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const [deleted] = await db
        .delete(testimonials)
        .where(eq(testimonials.id, id))
        .returning({ id: testimonials.id });

      if (!deleted) {
        return res.status(404).json({ error: "Testimonial not found" });
      }
      res.json({ message: "Testimonial deleted", id: deleted.id });
    } catch (error) {
      console.error("Admin delete error:", error);
      res.status(500).json({ error: "Failed to delete testimonial" });
    }
  });

  /**
   * GET /admin
   * Serves the admin moderation dashboard (HTML page).
   * Protected: requires ?secret=<ADMIN_SECRET> query param for browser access.
   */
  app.get("/admin", (req, res) => {
    const secret = process.env.ADMIN_SECRET;
    if (!secret) {
      return res.status(503).send("Admin access not configured.");
    }
    // Browser-friendly auth via query param (avoids needing custom headers in browser)
    const provided = req.query.secret as string | undefined;
    if (!provided || provided !== secret) {
      return res
        .status(401)
        .send("<h2>401 Unauthorized</h2><p>Pass ?secret=YOUR_ADMIN_SECRET in the URL.</p>");
    }
    const path = require("node:path");
    const fs = require("node:fs");
    const templatePath = path.resolve(process.cwd(), "server", "templates", "admin.html");
    if (!fs.existsSync(templatePath)) {
      return res.status(404).send("Admin template not found.");
    }
    const html = fs
      .readFileSync(templatePath, "utf-8")
      .replace(/ADMIN_SECRET_PLACEHOLDER/g, secret);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  });

  const httpServer = createServer(app);
      return httpServer;
}
