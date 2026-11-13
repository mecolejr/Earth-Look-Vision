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

- [ ] **M1 — City photos.** Add image URLs for the 8 new cities missing from
  `CITY_IMAGE_URLS` in `client/components/OptimizedImage.tsx` (atlanta, houston,
  washington-dc, tulsa, kansas-city, pittsburgh, columbus, albuquerque).
  Verify each URL actually loads (curl -I → 200) before committing. Until then
  they show the fallback hero image, which is acceptable.
- [ ] **M2 — International batch.** Add Montreal, Vancouver, Mexico City, Lisbon,
  London by the documented process. Research real data; follow rule 4 strictly.
  → **FABLE CHECKPOINT after M2**
- [ ] **M3 — Onboarding polish.** Fix remaining open items in `ISSUES.md`
  (#15 Compare columns not tappable, #27 missing accessibility labels), then
  walk the full onboarding flow in Preview as a new user and fix rough edges.
- [ ] **M4 — City Detail polish.** Every section renders for every city,
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

- 2026-11-13 (Fable): Plan created. 18 cities built and validated (10 pending
  apply to Replit at the time of writing). Baseline: typecheck clean, checker
  green, reviews system seeded and working, app verified in Preview.
