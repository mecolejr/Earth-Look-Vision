import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { db } from "./db";
import { newsletterSubscribers } from "@shared/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { sendWelcomeEmail } from "./resend";
import { getWeatherForecast, getCurrentWeather } from "./weather";
import { getPersonalizedRecommendations } from "./cohere";

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
                    // Update existing subscription
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

          // Create new subscription
          await db.insert(newsletterSubscribers).values({
                    email: email.toLowerCase(),
                    frequency: frequency || "weekly",
                    preferences: preferences || null,
          });

          // Send welcome email (don't block response on email sending)
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

          // Validate identity shape — only allow expected string fields
          const identityResult = UserIdentitySchema.safeParse(identity);
                if (!identityResult.success) {
                          return res.status(400).json({ error: "Invalid identity profile" });
                }

          const recommendations = await getPersonalizedRecommendations(
                    identityResult.data,
                    typeof limit === "number" ? limit : 5,
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

          // Validate that inputs match coordinate format to prevent abuse
          const originStr = origin as string;
                const destinationsStr = destinations as string;

          if (!COORDINATE_PATTERN.test(originStr)) {
                    return res.status(400).json({ error: "Invalid origin format. Expected: lat,lng" });
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

  const httpServer = createServer(app);
    return httpServer;
}
