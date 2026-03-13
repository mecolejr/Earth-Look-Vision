# EarthLook Development Roadmap

This document tracks the full development plan for the EarthLook app — a privacy-first city-comparison platform for people navigating relocation decisions through the lens of identity, safety, and belonging.

---

## Architecture Principles (Non-Negotiable)

- **Privacy-by-design:** All identity-aware scoring computation runs client-side in `client/lib/scoring.ts`. Identity data never leaves the device for scoring purposes.
- **Anonymous by default:** Every identity dimension is opt-in. Users can explore the app in full anonymous mode.
- **Moderation-first UGC:** All user-generated content (testimonials) enters a `pending` moderation queue before becoming visible.
- **No scenario data stored server-side:** Scenario Testing computations are ephemeral and on-device only.

---

## Milestone 1 — Foundation & Bug Fixes ✅ Complete

25 issues resolved covering: navigation stability, scoring formula correctness, TypeScript strict-mode compliance, accessibility (a11y) labels, ProfileScreen completeness, CityDetailScreen data rendering, and test infrastructure setup.

---

## Milestone 2 — Personalization & Trust ✅ Complete

### Feature 1 — Identity-Filtered Hate Crime & Safety Data ✅

**What was built:**
- Added `HateCrimesByBiasCategory` interface covering 15 FBI bias motivation categories (race, ethnicity, religion, sexual orientation, gender identity, disability, and sub-categories), all values per-100k population normalized.
- Extended `CitySafetyData` with optional `hateCrimesByBiasCategory` and `hateCrimeDataYear` fields.
- Implemented `getIdentityHateCrimePenalty()` in `client/lib/scoring.ts` — applies a log-scale penalty to the safety score based on the hate crime categories relevant to the user's identity dimensions.
- Added `safetyPersonalisationNote` to `CityScore` so UI components can surface an explanation of why a personalized safety score differs from the aggregate.
- Falls back gracefully to aggregate crime data for cities that do not yet have granular FBI bias-category data.
- Extended `scoring.test.ts` with 3 test cases covering penalty application, note presence, and aggregate fallback.

**Files touched:** `shared/schema.ts`, `client/types/index.ts`, `client/lib/scoring.ts`, `client/lib/scoring.test.ts`

---

### Feature 2 — Community Testimonials & "People Like You" Layer ✅

**What was built:**
- Added `testimonials` table to `shared/schema.ts` with Drizzle ORM definition and Zod validation schema. Fields: `cityId`, `rating` (1–5 integer), `content` (10–280 chars), `displayName` (max 50 chars, defaults to "Anonymous"), `identityDimensions` (JSON, optional), `status` (`pending` | `approved` | `rejected`), timestamps.
- `POST /api/testimonials` — validates with `TestimonialSubmitSchema`, inserts with `status: "pending"`, returns sanitized response (no identity data echoed back).
- `GET /api/testimonials/:cityId` — accepts optional identity query params, filters and ranks testimonials by identity relevance, returns approved testimonials plus aggregate stats (`averageRating`, `totalCount`, `peoplelikeYouCount`, `peoplelikeYouAverageRating`).
- `useTestimonials` hook — manages fetch (identity-aware query params), submit, optimistic state, and request cancellation.
- `TestimonialsSection` component — renders `AggregateBanner` (people-like-you vs. overall rating), `TestimonialCard` list with identity-matched sorting, `WriteReviewForm` with `StarRating` picker and privacy controls (user chooses which identity dimensions to attach to their testimonial, with anonymous as default).

**Files touched/created:** `shared/schema.ts`, `server/routes.ts`, `client/hooks/useTestimonials.ts`, `client/components/TestimonialsSection.tsx`

---

### Feature 3 — Scenario Testing ("What If?") ✅

**What was built:**
- Added `ScenarioProfile` type and `SCENARIO_TEMPLATES` constant with 6 pre-built templates: "What if I have kids?", "What if I transition?", "What if I retire?", "What if I go remote?", "What if I'm on a tight budget?", "What if I need medical access?".
- Added `calculateScenarioCityScore()` export in `client/lib/scoring.ts` — accepts a `ScenarioProfile` overlay, merges it with (or substitutes for) the real user profile, and calls `calculateCityScore()` with `skipCache: true`. The real user profile is never mutated.
- `ScenarioTestingScreen` — template chip selector, active scenario detail card, city-by-city before/after delta table with `DeltaBadge` color-coded indicators, and an on-device privacy notice confirming no scenario data leaves the device.
- Registered as a modal screen in `RootStackNavigator` (`ScenarioTesting: undefined`).
- Entry point added to `ProfileScreen` as a "What If? Scenario Testing" card.
- Extended `scoring.test.ts` with 3 test cases covering priority weight override, cost score delta, and no-op scenario parity.

**Files touched/created:** `client/types/index.ts`, `client/lib/scoring.ts`, `client/screens/ScenarioTestingScreen.tsx`, `client/navigation/RootStackNavigator.tsx`, `client/screens/ProfileScreen.tsx`, `client/lib/scoring.test.ts`

---

## Open Items & Ongoing Watch Points

### 1. Testimonials Moderation Workflow — Required Before Feature Goes Live
The testimonials pipeline is fully built but all submissions land in `status: "pending"` with no mechanism to approve them yet. Before this feature is visible to users, one of the following is needed:
- A simple admin UI (protected route) to review and approve/reject pending testimonials.
- An automated moderation pass (e.g., a lightweight profanity/hate-speech filter that auto-approves clean submissions).
- Seeding the database with an initial set of approved testimonials so the feature is not empty on launch.

### 2. `hateCrimesByBiasCategory` Coverage — Most Cities Currently Fall Back to Aggregate
The `hateCrimesByBiasCategory` field is optional on `CitySafetyData`. No cities in the current seed data (`client/data/cities.ts`) have been populated with FBI granular data yet, meaning Feature 1 personalization is not active in practice. Recommended actions:
- Populate at least the top 10–15 cities with FBI UCR/NIBRS hate crime data.
- Add a UI indicator (e.g., a small badge or tooltip on the safety score) showing whether the displayed score reflects personalized or aggregate data, so users understand data completeness.

### 3. Issue #1 — PII Encryption Not Yet Implemented
PII encryption for stored identity data was documented in Milestone 1 as a hard requirement before real user data flows in. This is still outstanding. Do not ship user-facing identity collection features (testimonials with identity dimensions, profile persistence) to production until field-level encryption is in place on the server and the encryption key management strategy is defined.

### 4. Feature Gaps — Not Yet Scoped or Scheduled
The following capability areas have been identified but not yet designed or scheduled for a milestone:
- **Neighborhood-level scoring** — current scoring is city-level only; block-group or tract-level data would significantly improve accuracy for dense metros.
- **Political policy tracker** — automated ingestion of municipal policy changes (e.g., anti-discrimination ordinances, healthcare access policies) that affect city scores over time.
- **Moving checklist personalization** — a dynamic checklist generated from the user's profile and target city (e.g., name-change resources, community organizations, affirming healthcare providers).
- **Connection platform** — a way for users who have relocated to a city to opt in to connecting with others considering the same move (requires significant privacy and safety design work before implementation).

---

*Last updated: Milestone 2 complete — all three Personalization & Trust features committed to main branch.*
