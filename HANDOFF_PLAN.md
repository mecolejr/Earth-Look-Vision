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
