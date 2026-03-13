# EarthLook Development Roadmap

This document tracks the full development plan for the EarthLook app — a privacy-first city-comparison platform for people navigating relocation decisions through the lens of identity, safety, and belonging.

---

## Architecture Principles (Non-Negotiable)

- **Privacy-by-design:** All identity-aware scoring computation runs client-side in `client/lib/scoring.ts`. Identity data never leaves the device for scoring purposes.
- - **Anonymous by default:** Every identity dimension is opt-in. Users can explore the app in full anonymous mode.
  - - **Moderation-first UGC:** All user-generated content (testimonials) enters a `pending` moderation queue before becoming visible.
    - - **No scenario data stored server-side:** Scenario Testing computations are ephemeral and on-device only.
     
      - ---

      ## Milestone 1 — Foundation & Bug Fixes ✅ Complete

      25 issues resolved covering: navigation stability, scoring formula correctness, TypeScript strict-mode compliance, accessibility (a11y) labels, ProfileScreen completeness, CityDetailScreen data rendering, and test infrastructure setup.

      ---

      ## Milestone 2 — Personalization & Trust ✅ Complete

      ### Feature 1 — Identity-Filtered Hate Crime & Safety Data ✅

      **What was built:**
      - Added `HateCrimesByBiasCategory` interface covering 15 FBI bias motivation categories (race, ethnicity, religion, sexual orientation, gender identity, disability, and sub-categories), all values per-100k population normalized.
      - - Extended `CitySafetyData` with optional `hateCrimesByBiasCategory` and `hateCrimeDataYear` fields.
        - - Implemented `getIdentityHateCrimePenalty()` in `client/lib/scoring.ts` — applies a log-scale penalty to the safety score based on the hate crime categories relevant to the user's identity dimensions.
          - - Added `safetyPersonalisationNote` to `CityScore` so UI components can surface an explanation of why a personalized safety score differs from the aggregate.
            - - Falls back gracefully to aggregate crime data for cities that do not yet have granular FBI bias-category data.
              - - Extended `scoring.test.ts` with 3 test cases covering penalty application, note presence, and aggregate fallback.
                - - **Post-launch follow-up (✅ done):** Populated `hateCrimesByBiasCategory` for all 8 cities with real FBI NIBRS (US cities, 2023), Statistics Canada (Toronto, 2022), BKA PMK (Berlin, 2023), and Spanish Interior Ministry (Barcelona, 2022) data — all per-100k normalized.
                  - - **Post-launch follow-up (✅ done):** Wired `safetyPersonalisationNote` into `CityDetailScreen` as a three-state banner: (a) blue personalised note when active, (b) green "data available — add profile" prompt when granular data exists but no identity match fires, (c) amber "aggregate data only" notice when no granular data.
                   
                    - **Files touched:** `shared/schema.ts`, `client/types/index.ts`, `client/lib/scoring.ts`, `client/lib/scoring.test.ts`, `client/data/cities.ts`, `client/screens/CityDetailScreen.tsx`
                   
                    - ---

                    ### Feature 2 — Community Testimonials & "People Like You" Layer ✅

                    **What was built:**
                    - Added `testimonials` table to `shared/schema.ts` with Drizzle ORM definition and Zod validation schema. Fields: `cityId`, `rating` (1–5 integer), `content` (10–280 chars), `displayName` (max 50 chars, defaults to "Anonymous"), `identityDimensions` (JSON, optional), `status` (`pending` | `approved` | `rejected`), timestamps.
                    - - `POST /api/testimonials` — validates with `TestimonialSubmitSchema`, inserts with `status: "pending"`, returns sanitized response (no identity data echoed back).
                      - - `GET /api/testimonials/:cityId` — accepts optional identity query params, filters and ranks testimonials by identity relevance, returns approved testimonials plus aggregate stats (`averageRating`, `totalCount`, `peoplelikeYouCount`, `peoplelikeYouAverageRating`).
                        - - `useTestimonials` hook — manages fetch (identity-aware query params), submit, optimistic state, and request cancellation.
                          - - `TestimonialsSection` component — renders `AggregateBanner` (people-like-you vs. overall rating), `TestimonialCard` list with identity-matched sorting, `WriteReviewForm` with `StarRating` picker and privacy controls (user chooses which identity dimensions to attach to their testimonial, with anonymous as default).
                            - - **Post-launch follow-up (✅ done):** `TestimonialsSection` is now rendered in `CityDetailScreen` between "Highlights for You" and "Things to Consider", passing `filteredIdentity` (privacy-filtered via `applyPrivacyFilter`) for identity-matched sorting. Hidden in anonymous mode.
                             
                              - **Files touched/created:** `shared/schema.ts`, `server/routes.ts`, `client/hooks/useTestimonials.ts`, `client/components/TestimonialsSection.tsx`, `client/screens/CityDetailScreen.tsx`
                             
                              - ---

                              ### Feature 3 — Scenario Testing ("What If?") ✅

                              **What was built:**
                              - Added `ScenarioProfile` type and `SCENARIO_TEMPLATES` constant with 6 pre-built templates: "What if I have kids?", "What if I transition?", "What if I retire?", "What if I go remote?", "What if I'm on a tight budget?", "What if I need medical access?".
                              - - Added `calculateScenarioCityScore()` export in `client/lib/scoring.ts` — accepts a `ScenarioProfile` overlay, merges it with (or substitutes for) the real user profile, and calls `calculateCityScore()` with `skipCache: true`. The real user profile is never mutated.
                                - - `ScenarioTestingScreen` — template chip selector, active scenario detail card, city-by-city before/after delta table with `DeltaBadge` color-coded indicators, and an on-device privacy notice confirming no scenario data leaves the device.
                                  - - Registered as a modal screen in `RootStackNavigator` (`ScenarioTesting: undefined`).
                                    - - Entry point added to `ProfileScreen` as a "What If? Scenario Testing" card.
                                      - - Extended `scoring.test.ts` with 3 test cases covering priority weight override, cost score delta, and no-op scenario parity.
                                       
                                        - **Files touched/created:** `client/types/index.ts`, `client/lib/scoring.ts`, `client/screens/ScenarioTestingScreen.tsx`, `client/navigation/RootStackNavigator.tsx`, `client/screens/ProfileScreen.tsx`, `client/lib/scoring.test.ts`
                                       
                                        - ---

                                        ## Open Items & Ongoing Watch Points

                                        ### 1. Testimonials Moderation Workflow ✅ Resolved
                                        The testimonials pipeline is now fully operational with a protected admin moderation dashboard.

                                        **What was built:**
                                        - `adminAuth` middleware in `server/routes.ts` — bearer-token guard keyed to `ADMIN_SECRET` env var. Fails closed (503) if no secret is configured.
                                        - `GET /api/admin/testimonials` — returns all testimonials with counts by status, supports `?status=` filter.
                                        - `POST /api/admin/testimonials/:id/approve` — promotes a testimonial to `approved`.
                                        - `POST /api/admin/testimonials/:id/reject` — moves to `rejected`.
                                        - `DELETE /api/admin/testimonials/:id` — permanent deletion for spam/illegal content.
                                        - `GET /admin?secret=<ADMIN_SECRET>` — browser-accessible dark-mode moderation dashboard. Shows live counts, filter tabs (Pending / Approved / Rejected / All), and per-card Approve/Reject/Delete actions with optimistic UI updates.
                                        - `scripts/seed-testimonials.ts` — inserts 19 curated approved testimonials across all 8 cities (diverse identities, realistic voices). Run via `npm run db:seed:testimonials`. Safe to re-run (idempotent).

                                        **To activate in Replit:**
                                        1. Add `ADMIN_SECRET=<your-strong-password>` to Replit Secrets.
                                        2. Run `npm run db:seed:testimonials` once to populate seed data.
                                        3. Access the dashboard at `/admin?secret=<your-password>`.
                                           
                                            - ### 2. `hateCrimesByBiasCategory` Coverage ✅ Resolved
                                            - All 8 cities now have `hateCrimesByBiasCategory` populated with real government data (FBI NIBRS, Statistics Canada, BKA, Spanish Interior Ministry — all per-100k normalized, data years 2022–2023). The UI in `CityDetailScreen` shows a three-state data-completeness banner so users always know whether their safety score is personalised or aggregate.
                                           
                                            - ### 3. Issue #1 — PII Encryption Not Yet Implemented ⚠️ Still Open
                                            - PII encryption for stored identity data was documented in Milestone 1 as a hard requirement before real user data flows in. This is still outstanding. Do not ship user-facing identity collection features (testimonials with identity dimensions, profile persistence) to production until field-level encryption is in place on the server and the encryption key management strategy is defined.
                                           
                                            - ### 4. Feature Gaps — Not Yet Scoped or Scheduled
                                            - The following capability areas have been identified but not yet designed or scheduled for a milestone:
                                            - - **Neighborhood-level scoring** — current scoring is city-level only; block-group or tract-level data would significantly improve accuracy for dense metros.
                                              - - **Political policy tracker** — automated ingestion of municipal policy changes (e.g., anti-discrimination ordinances, healthcare access policies) that affect city scores over time.
                                                - - **Moving checklist personalization** — a dynamic checklist generated from the user's profile and target city (e.g., name-change resources, community organizations, affirming healthcare providers).
                                                  - - **Connection platform** — a way for users who have relocated to a city to opt in to connecting with others considering the same move (requires significant privacy and safety design work before implementation).
                                                   
                                                    - ---

                                                    *Last updated: Milestone 2 post-launch items resolved — hate crime data populated for all cities, UI wiring complete. Two watch points remain open (testimonials moderation, PII encryption).*
                                                    
