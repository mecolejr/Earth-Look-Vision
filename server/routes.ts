import type { Express } from "express";
import { createServer, type Server } from "node:http";
import { db } from "./db";
import { newsletterSubscribers } from "@shared/schema";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "./resend";
import { getWeatherForecast, getCurrentWeather } from "./weather";
import { getPersonalizedRecommendations } from "./cohere";

export async function registerRoutes(app: Express): Promise<Server> {
  // Newsletter subscription endpoint
  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email, frequency, preferences } = req.body;

      if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required" });
      }

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
        return res.status(400).json({ error: "Latitude and longitude are required" });
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
        return res.status(400).json({ error: "Latitude and longitude are required" });
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
  app.post("/api/recommendations", async (req, res) => {
    try {
      const { identity, limit = 5 } = req.body;

      if (!identity || typeof identity !== "object") {
        return res.status(400).json({ error: "Identity profile is required" });
      }

      const recommendations = await getPersonalizedRecommendations(identity, limit);
      res.json({ recommendations });
    } catch (error) {
      console.error("Recommendations error:", error);
      res.status(500).json({ error: "Failed to get recommendations" });
    }
  });

  // Distance calculation using Google Maps Distance Matrix API
  app.get("/api/distances", async (req, res) => {
    try {
      const { origin, destinations } = req.query;

      if (!origin || !destinations) {
        return res.status(400).json({ error: "Origin and destinations are required" });
      }

      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "Google Maps API key not configured" });
      }

      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinations}&units=imperial&key=${apiKey}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status !== "OK") {
        return res.status(500).json({ error: "Failed to calculate distances" });
      }

      const distances = data.rows[0]?.elements?.map((element: any) => {
        if (element.status === "OK") {
          return {
            distance: element.distance.text,
            duration: element.duration.text,
          };
        }
        return null;
      }).filter(Boolean);

      res.json({ distances });
    } catch (error) {
      console.error("Distance calculation error:", error);
      res.status(500).json({ error: "Failed to calculate distances" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
