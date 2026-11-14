# EarthLook Build Plan — Working Model Handoff

**Read this first at the start of every session.** This file is the work queue and
rulebook for building EarthLook toward launch. A larger model (Fable) reviews
progress at the checkpoints marked below; your job is to complete milestones and
leave the project verifiably healthy after every session.

## What this app is

EarthLook helps people with marginalized identities find cities where they'll
thrive: personalized city scores based on the user's identity and priorities.
All identity-based scoring runs on-device (see the header comment in
`client/lib/scoring.ts`) — NEVER move it server-side. Mj (the owner) is not a
professional developer: explain things in simple, everyday language, and never
assume they can debug code themselves.

## Hard rules (break these and the app breaks)

1. Work INSIDE Replit (shell + workflows). Commit to git after every verified step;
   push to GitHub branch `version-2` (`git push origin main:version-2`).
   NEVER touch the `main` or `lean-version` branches. Never force-push.
2. Follow the Replit rules in `ISSUES.md` (R1–R4). Especially R4: after creating
   or deleting source files from the shell, restart the **Start Frontend** workflow.
3. Before every commit: `npx tsc --noEmit` must print nothing, and
   `npx tsx scripts/check-cities.ts` must pass. Then look at the app in the
   Preview and click through at least: Explore → a city page → back.
4. Add cities only by the process in `replit.md` ("City Catalog" section).
   Never invent hate-crime statistics: include `hateCrimesByBiasCategory` only
   with real published per-100k figures and a `hateCrimeDataYear`; otherwise
   omit it (the app then shows its "aggregate data only" notice).
5. Keep commits small (one milestone step per commit) with plain-English messages.
6. If something breaks and you can't fix it within one session: STOP, commit
   nothing further, write what happened under "Status log" below, and tell Mj to
   run a Fable checkpoint. `git checkout -- .` restores the last good state.

## Milestones (work top to bottom)

- [x] **M1 — City photos.** Add image URLs for the 8 new cities missing from
  `CITY_IMAGE_URLS` in `client/components/OptimizedImage.tsx` (atlanta, houston,
  washington-dc, tulsa, kansas-city, pittsburgh, columbus, albuquerque).
  Verify each URL actually loads (curl -I → 200) before committing. Until then
  they show the fallback hero image, which is acceptable.
- [x] **M2 — International batch.** Add Montreal, Vancouver, Mexico City, Lisbon,
  London by the documented process. Research real data; follow rule 4 strictly.
  → **FABLE CHECKPOINT after M2**
- [x] **M3 — Onboarding polish.** Fix remaining open items in `ISSUES.md`
  (#15 Compare columns not tappable, #27 missing accessibility labels), then
  walk the full onboarding flow in Preview as a new user and fix rough edges.
- [x] **M4 — City Detail polish.** Every section renders for every city,
  including cities with no bias-category data and no reviews. Weather errors
  must fail gracefully.
  → **FABLE CHECKPOINT after M4**
- [ ] **M5 — Compare + Map.** Compare works with 18+ cities; Map shows all
  cities; both handle cities added later with no code changes.
- [ ] **M6 — Reviews hardening (DO NOT START without a Fable checkpoint first).**
  PII encryption for identity data attached to reviews is a documented launch
  blocker (see EARTHLOOK_ROADMAP.md "Issue #1"). Design must be reviewed before
  implementation.

## Fable checkpoint protocol (cheap by design)

At each marked checkpoint, Mj starts a short session with the larger model, which
will only: read this file's Status log, run `git log --oneline -10`,
`npx tsc --noEmit`, `npx tsx scripts/check-cities.ts`, glance at the Preview,
and reply on-track / off-track with corrections. No building. Keep it under a
few minutes of work.

## Status log (newest first — update after every session)

- 2026-11-13 M4 DONE. FABLE CHECKPOINT DUE. City Detail: hero photo was blank (image wrapper had no height) - fixed and verified on Amsterdam. Weather: server uses US National Weather Service only, so non-US cities always failed; the page now says Live weather is only available for US cities right now and skips the request. Verified in Preview: Amsterdam (international, no bias data, has reviews) and Tulsa (US, no bias data, no reviews, live weather 54F) render every section. FOR FABLE / MJ TO DECIDE: (1) the 20 seeded reviews (Nina K., Damian O., ...) are invented but displayed like real community reviews - must be labelled as samples or removed before launch; (2) estimated numbers (e.g. LGBTQ+ population %) display as facts with no estimate marker; (3) global live weather would need a second provider (e.g. Open-Meteo, free for non-commercial use only); (4) check the scoring change noted below. Next after checkpoint: M5.
- 2026-11-13 M3 DONE (with caveats). Added screen-reader roles/labels/state to shared components: Chip (all onboarding choices), Button, CityCard + its compare button, Welcome secondary buttons (ISSUES #29). ChipGroup now accepts friendly labels; climate chips show Cold/Four Distinct Seasons/etc while still storing the same values. Verified in Preview: app loads, Profile chips render. NOT visually verified: the lifestyle step itself (new climate labels, always-enabled Continue) because reaching it needs a Start Over pop-up click from Mj. Decided NOT a bug: Compare picks survive Reset Profile (the dialog only promises to erase lifestyle/identity/priority data; Privacy > Delete All Data clears everything). CARRY INTO M4: City Detail page has a blank photo area at the top (likely the same no-height image wrapper as CityCard); live weather shows Unable to load weather; other screens still lack a11y labels on raw Pressables. Next: M4, then FABLE CHECKPOINT.
- 2026-11-13 (M3 onboarding walk-through done as a new user: Welcome > lifestyle > identity > priorities > Explore all work). Fixed: (a) city photos were blank on the main Explore list cards (CityCard image wrapper had no height) - verified in Preview; (b) lifestyle step said answers are optional but Continue was disabled until one was picked - Continue is now always enabled (typecheck clean, NOT yet re-walked in Preview because that needs another reset dialog click from Mj). STILL OPEN for M3: climate chips show raw ids (four-seasons, dry-year-round) instead of friendly labels; Compare selections survive a profile reset; a11y labels missing on many other screens (ISSUES #27 only covered Compare).
- 2026-11-13 (M3 in progress): ISSUES #15 and #27 verified already fixed (Compare column opens city page; all 3 Pressables labelled). Fixed "Comparing 1 cities" wording. NEW #28: Alert.alert is a no-op on web, so all 18 confirmation pop-ups did nothing in the web version; added client/lib/showAlert.ts (window.confirm/alert on web, Alert.alert on native) and switched all 18 calls. VERIFIED by Mj: Profile > Start Over now shows the confirm dialog and OK resets to the Welcome screen. NOTE for automated sessions: browser dialogs block the automation tool; ask Mj to click them. Onboarding walk-through as a new user: in progress.
- 2026-11-13 FOR FABLE TO CHECK at the next checkpoint (Mj approved, made on Fable): Correction 2 applied in client/lib/scoring.ts calculateSafetyScore. Removed the legacy else-if fallback that subtracted up to 20 points using hateCrimesByCategory when a city had no hateCrimesByBiasCategory. Now cities without bias data get NO hate-crime penalty (safety = crime rate only). Check: (1) scoring still client-side only, (2) safety scores for no-data cities rose by a few points at most, (3) cities with FBI data unchanged, (4) hateCrimesByCategory is now unused by scoring and could be retired from the City type later.
- 2026-11-13 (Fable checkpoint after M2): ON TRACK. Typecheck clean, 23 cities pass, scoring/server untouched. Correction 1 DONE: removed unsourced hateCrimesByBiasCategory + hateCrimeDataYear from Toronto, Amsterdam, Berlin, Barcelona. Correction 2 OPEN (needs Mj OK before touching client/lib/scoring.ts): Montreal, Vancouver, Mexico City, Lisbon, London have an empty hateCrimesByCategory, so the legacy fallback subtracts nothing for them while US cities without bias data get a deduction; propose treating no-data the same everywhere. Estimates in the 5 international files must be replaced with sourced figures before launch. Next: M3.
- 2026-11-13 (Claude): M2 done. Added Montreal, Vancouver, Mexico City, Lisbon, London (23 cities). Real: population, ethnic/religion shares (Canada/UK census), climate. NO bias-category hate-crime data (US FBI categories do not apply) so those cities use aggregate safety only. ESTIMATES to review at the Fable checkpoint: crime rate, LGBTQ safety index/population/venues, job/transit scores, cost of living, ethnic split for Mexico City and Lisbon, London climate. Each file has a header comment listing this. Also found: existing Toronto/Amsterdam/Berlin/Barcelona files have hateCrimesByBiasCategory numbers with unverified sources. FABLE CHECKPOINT DUE.
- 2026-11-13 (Claude): M1 done. Added real photos for the 8 new cities (all checked 200). Typecheck clean, checker green. Next: M2 (international cities).
- 2026-11-13 (Fable): Plan created. 18 cities built and validated (10 pending
  apply to Replit at the time of writing). Baseline: typecheck clean, checker
  green, reviews system seeded and working, app verified in Preview.

### M4 Fable checkpoint (2026-11-13) — VERDICT: ON TRACK
- Verified: `npx tsc --noEmit` clean; `npx tsx scripts/check-cities.ts` all 23 cities pass; no server-side changes since M2; `client/lib/scoring.ts` confirmed free of fetch/axios/API calls (scoring stays fully client-side).
- Reviewed the Correction 2 scoring diff (legacy hate-crime fallback removal) line by line — matches what was described, no unintended side effects.
- Three open decisions carried forward, with recommendation:
  1. 20 seeded community reviews are fictional but shown as real — RECOMMEND: add a "Sample review" tag now (small, cheap).
  2. Many displayed numbers (e.g. LGBTQ+ population %) are estimates with no visual distinction from sourced data — RECOMMEND: defer to the pre-launch data pass.
  3. Worldwide live weather needs a second, non-US weather provider (e.g. Open-Meteo) — RECOMMEND: defer, not worth it yet.
- Recommendation: move back to a cheaper model for M5 (Compare + Map), since it's standard building work, not a checkpoint.

### M5: Compare + Map polish (2026-11-13) — done
- Compare screen: removed two dead imports (unused `Alert`, unused `ScoreBar`) left over from the M3 showAlert migration.
- Map screen (native): added a dismiss/close button on the selected-city preview card (previously no way to deselect without tapping another marker); added marker `title`/`description` and accessibility labels on the city detail Pressable, matching the a11y pattern from M3.
- Map screen (web fallback): added accessibility labels to the download buttons and city cards.
- Same dead-`Alert`-import cleanup applied to 4 other screens touched by the M3 showAlert migration (MovingChecklistScreen, SupportScreen, NewsletterScreen, ProfileScreen) — found while reviewing, same root cause, same fix, zero risk.
- Verified: tsc clean, all 23 cities pass, Compare screen visually confirmed in Preview. Native Map tab is hidden on web by design (Issue #4) so it can't be visually checked in this browser Preview — verified by typecheck only; worth a real device/simulator check before launch.
- Not done this pass (noted, not forgotten): a worldwide weather provider, estimate labeling in the UI, and the sample-review tag are still open from the M4 checkpoint.

## Sample-review tagging (post-M5, pre-M6)

Tagged the 20 seeded/fictional community testimonials as samples so they
are no longer indistinguishable from real user submissions (the first of
the three items recommended at the M4 checkpoint).

- Added `isSample` boolean column to `testimonials` (default false,
  excluded from `insertTestimonialSchema` so users can never set it).
- `scripts/seed-testimonials.ts` now sets `isSample: true` on insert and
  backfills it on existing rows when re-run (all 20 seed rows confirmed
  backfilled).
- Added `isSample?: boolean` to the client `Testimonial` type and a
  "Sample review" badge next to the author name in `TestimonialCard`.
- Ran `npm run db:push` (additive column, no data loss) then re-ran the
  seed script to backfill.

Bug found and fixed while verifying: `GET /api/testimonials/:cityId` maps
rows through an explicit `safeTestimonials` allowlist before responding
(a deliberate guard so new DB columns aren't auto-exposed to the client).
That allowlist didn't include `isSample`, so the badge data never reached
the app even though the DB and seed script were correct. Added
`isSample: t.isSample` to the allowlist in `server/routes.ts`. Verified
by curling the endpoint directly before/after and confirming `isSample`
appears, since the native app's "anonymous mode" default profile hides
the whole testimonials section in this browser Preview (can't visually
confirm the badge render without setting up a non-anonymous profile).

Verification: `npx tsc --noEmit` clean, `npx tsx scripts/check-cities.ts`
all 23 cities pass, no server-route behavior changed other than the one
added field, no files created/deleted (edits only, so no Metro restart
needed).

Still open from M4: estimate-labeling in UI, second weather provider.
M6 (Reviews PII hardening) still requires a Fable checkpoint before
starting, per the standing rule.

## Fable checkpoint (post sample-tagging)

Verdict: ON TRACK. Reviewed M5 + sample-tagging work; tsc and
check-cities verified clean on Replit, commit 4a59555 pushed to
version-2. The safeTestimonials allowlist found during verification is
the exact code path M6 will harden — good find, M6 is now well-scoped.

M6 (Reviews PII hardening) is CLEARED to start in the next Sonnet
session. Scope: review what identity fields the API exposes per
testimonial, consider aggregating/bucketing identity tags client-side,
and rate-limit/validate the POST endpoint.

Housekeeping: the backend on Replit is currently running from a manual
shell process (nohup), not the Start Backend workflow — restart the
workflow properly at the start of the next session so it survives
Replit restarts.

## M6 (Reviews PII hardening) — done

Cleared by the Fable checkpoint above. Scope was: opt-in consent before identity info attaches to a review, rate limiting on submission, and tighter server-side validation. Per Mj's confirmed answers: identity tags stay visible on individual reviews (no change to that display logic).

Server (`server/routes.ts`):
- Added `express-rate-limit` (new dependency, installed). `testimonialSubmitLimiter`: 15-minute window, 5 requests per window, standard headers, custom JSON message. Applied to `POST /api/testimonials` only.
- `server/index.ts`: added `app.set("trust proxy", 1)` right after the Express app is created, so `req.ip` reflects the real client behind Cloud Run's reverse proxy (required for the rate limiter to key correctly).
- Added `.max(60)` to the four identity fields (`ethnicity`, `genderIdentity`, `sexualOrientation`, `religion`) in both `TestimonialSubmitSchema` and `IdentityFilterSchema` — these were previously unbounded free text.

Client (`client/components/TestimonialsSection.tsx`):
- `WriteReviewForm` now builds an opt-in checklist from the viewer's own profile identity values. Each item (ethnicity/gender identity/sexual orientation/religion) is only offered if the profile has a value, and every checkbox defaults to UNCHECKED. A footer line previews exactly what will show on the review if everything currently checked is submitted.
- Only the checked items are sent in the `selectedIdentity` object passed to `onSubmit`; nothing is auto-attached from the profile anymore (previously all four fields were spread unconditionally).
- Simplified the privacy-notice copy below the form to drop the now-inaccurate "used to help others find reviews from people like them" line, keeping only the moderation-queue notice.
- Left `TestimonialCard`'s `identityParts` display logic untouched — per-review identity tags still render as before.

Transfer note: both files were moved to Replit via the chunked base64 shell method (browser-typed, no direct git push available from the cloud sandbox). `TestimonialsSection.tsx` picked up a few bytes of corruption in transit this time (a dropped word and one dropped `</ThemedText>` closing tag, found via bisecting cumulative md5sum checksums against the local file and confirmed by a live `tsc --noEmit` failure) — both were patched by hand on Replit and re-verified clean. Worth flagging: a browser-typed base64 transfer of a large file is not perfectly reliable even after a clean-looking decode; the backup-swap-tsc-check cycle is what actually caught it, not the md5/byte comparison.

Verification: `npx tsc --noEmit` clean and `npx tsx scripts/check-cities.ts` passes (same 12 expected pre-existing warnings, 23/23 cities) on both files, on Replit, after the dependency install.

Outstanding: same as the M4/M5 note above — the native app's anonymous-mode default profile hides the whole TestimonialsSection in this browser Preview, so the new consent-checkbox UI has not been visually confirmed in Preview. No console errors on the City Detail screen otherwise.

## Post-M6 polish (Nov 14, 2026)
- Backend now runs under the Start Backend workflow (manual process retired).
- City detail: LGBTQ+ population stat relabeled "LGBTQ+ Population (est.)" since it is an estimate.
- Weather: server/weather.ts tries NWS first (US only); on failure it falls back to MET Norway Locationforecast (server/metNorway.ts, global, no key, identifying User-Agent) with the same period shape. Open-Meteo was tried first but api.open-meteo.com is unreachable from Replit's network. Non-US days are grouped by UTC date and precipitation probability is null (MET gives amounts only).
- Verified: tsc clean, check-cities passes, London returns 7 periods via fallback, New York still uses NWS.
- Follow-up: removed the client-side US-only gate on the weather card so non-US cities show live weather via the MET Norway fallback; checked Amsterdam in Preview.

## M7 — Data provenance + real safety data (scoped by Fable, 2026-11-14)
Goal: every number in the app is either sourced or labeled an estimate.
- [ ] **7a. Provenance fields.** Add optional `sources: string[]` and
  `lastUpdated: "YYYY-MM"` to the city type. check-cities warns when a city
  has no lastUpdated. Backfill the 23 cities with at least one source each
  and a date. No invented citations: if the original source is unknown, write
  "unsourced — needs verification" and the UI shows nothing.
- [ ] **7b. FBI hate-crime import (US cities).** One-time script
  `scripts/import-hate-crimes.ts` using the FBI Crime Data Explorer API
  (free key, data.gov signup — Mj must create this). Writes per-bias-category
  counts into the 12 US city files that lack them, each tagged with source +
  year. Non-US cities stay aggregate-only. Rule 4 (never invent) still binding.
- [ ] **7c. Surface it.** City Detail gets a small "Data sources & freshness"
  footer: lastUpdated date and tappable source list. Estimated stats keep the
  "(est.)" suffix pattern from the LGBTQ+ stat.
Order: 7a → 7b → 7c. Fable checkpoint after 7b, before 7c polish.
