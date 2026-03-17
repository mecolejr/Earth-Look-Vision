# EarthLook â Open Issues

This file is the source of truth for all known bugs and UX issues. Update it whenever a fix is committed. At the start of any new session, read this file first to know exactly where things stand.

**Last updated:** 2026-03-17
**Audit basis:** Full code review of client/screens/ against the 17-issue list.
**Commit convention:** fix(#N): short description â matches the issue number below.
**Build target:** Replit (Node 20, Expo SDK 54). Every fix must run cleanly in Replit before being considered done.

---

## Replit Compatibility — Standing Rules

This app is developed and hosted on Replit. All code changes must remain compatible with the Replit environment. The following rules must be followed on every commit:

| Rule | Why |
|------|-----|
| Never upgrade `expo` past SDK 54 | Replit workflow calls `npx expo start`; SDK 55+ triggers an interactive install prompt that hangs the workflow |
| Always use locally installed `expo` binary | Use `./node_modules/.bin/expo` or the `expo:dev` script — never bare `npx expo start` in workflow config |
| `tsx` must be listed in `devDependencies` | Backend workflow uses `tsx` to run `server/index.ts`; it must be installed, not assumed global |
| No JSX syntax errors in navigator files | Replit surfaces these immediately at boot — e.g. `</View>View>` typos crash the entire app |
| Backend runs on port 5000, frontend on 8081 | Replit port mappings are fixed; do not change these |

### Known Replit Issues

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| R1 | `tsx` not installed — backend workflow failed to start on fresh Replit import | ✅ Fixed Mar 15 | package.json (devDependencies) |
| R2 | `npx expo start` in workflow tried to install SDK 55 interactively, hanging the frontend | ✅ Fixed Mar 15 | .replit workflow config / package.json expo:dev script |
| R3 | `</View>View>` typo in RootStackNavigator.tsx line 49 crashed app at boot | ✅ Fixed Mar 15 | client/navigation/RootStackNavigator.tsx |

---

## Status Key
| Symbol | Meaning |
|--------|---------|
| Fixed | Resolved and committed |
| Open | Not yet started |
| In Progress | Work has begun but not committed |

---

## Critical

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| 10 | Set Up Profile empty-state button was a no-op (onAction: () => {}) | Fixed Mar 13 | client/screens/ExploreScreen.tsx |
| 17 | No Alert confirmation before resetProfile() â one tap wiped all data | Fixed Mar 13 | client/screens/ProfileScreen.tsx |

---

## High

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| 6 | No back button on onboarding Steps 2 and 3 â header only shows ProgressIndicator, Android users are stuck | â
 Fixed Mar 14 | IdentityStep2Screen.tsx, PrioritiesStepScreen.tsx, OnboardingNavigator.tsx |
| 8 | All 10 priority sliders default to 50 regardless of Steps 1 and 2 input â causes decision fatigue | â
 Fixed Mar 14 | client/screens/PrioritiesStepScreen.tsx |
| 9 | No LiveScorePreview on Step 3 Priorities â the most impactful step has zero visual feedback | â
 Fixed Mar 14 | client/screens/PrioritiesStepScreen.tsx |
| 15 | City columns in Compare screen have no onPress â tapping a city does nothing, no path to CityDetail | â
 Fixed Mar 14 | client/screens/CompareScreen.tsx |
| 20 | Destructive action â verify it's wrapped in an Alert.alert() confirmation. | â
 Verified Mar 14 | client/screens/ProfileScreen.tsx |
| 24 | Destructive action â verify it's wrapped in an Alert.alert() confirmation. | â
 Fixed Mar 14 | client/screens/CompareScreen.tsx |

---

## Medium

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| 3 | canProceed is hardcoded to true on Step 1 â Continue is always enabled even with nothing selected | â
 Fixed Mar 14 | client/screens/IdentityStep1Screen.tsx |
| 12 | Key Differences in Compare always shows 4 hardcoded categories â ignores user priority weights | â
 Fixed Mar 14 | client/screens/CompareScreen.tsx |
| 14 | handleSaveIdentity and handleSavePriorities only call setActiveSection(null) â Save button is a false affordance | â
 Fixed Mar 14 | client/screens/ProfileScreen.tsx |
| 18 | welcome-hero.png used as a placeholder image outside of WelcomeScreen. | â
 Fixed Mar 14 | client/screens/ExploreScreen.tsx |
| 19 | Pressable missing accessibilityLabel â needed for screen readers. | â
 Fixed Mar 14 | client/screens/ExploreScreen.tsx |
| 21 | Pressable missing accessibilityLabel â needed for screen readers. | ✅ Fixed Mar 15 | client/screens/IdentityStep2Screen.tsx |
| 22 | Pressable missing accessibilityLabel â needed for screen readers. | ✅ Fixed Mar 15 | client/screens/PrioritiesStepScreen.tsx |
| 23 | welcome-hero.png used as a placeholder image outside of WelcomeScreen. | ✅ Fixed Mar 15 | client/screens/ExploreScreen.tsx |
| 25 | Pressable missing accessibilityLabel â needed for screen readers. | ✅ Fixed Mar 15 | client/screens/PrioritiesStepScreen.tsx |
| 26 | Pressable missing accessibilityLabel â needed for screen readers. | ✅ Fixed Mar 15 | client/screens/CompareScreen.tsx |
| 27 | Pressable missing accessibilityLabel — needed for screen readers. | 🔴 Open | client/screens/CompareScreen.tsx |
| 28 | SyntaxError in UserProfileContext.tsx (198:38) — Unexpected token in closing Provider tag, crashes app on load. | ✅ Fixed Mar 15 | client/contexts/UserProfileContext.tsx |

---

## Polish

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| 1 | Welcome screen has too many competing actions â 3 secondary links are identical in visual weight | ✅ Fixed Mar 14 | client/screens/WelcomeScreen.tsx |
| 2 | Persona picker expands inline â should be a bottom sheet modal, cramped on iPhone SE | ✅ Fixed Mar 14 | client/screens/WelcomeScreen.tsx |
| 4 | Climate preferences on Step 1 have no visual grouping â Temperature, Seasons, Precipitation need wrapping card | ✅ Fixed Mar 14 | client/screens/IdentityStep1Screen.tsx |
| 5 | LiveScorePreview compact mode on Step 1 does not show job market bar â weakens aha moment | ✅ Fixed Mar 14 | client/screens/IdentityStep1Screen.tsx, LiveScorePreview.tsx |
| 7 | Race/Ethnicity is the only multi-select on Step 2 â Gender, Orientation, Religion, Political Views should also support multi-select | ✅ Fixed Mar 14 | client/screens/IdentityStep2Screen.tsx |
| 11 | All sponsored city cards show the same welcome-hero.png placeholder | ✅ Fixed Mar 14 | client/screens/ExploreScreen.tsx, client/data/cities.ts |
| 13 | Compare screen has nested horizontal and vertical scroll â awkward on small phones | ✅ Fixed Mar 14 | client/screens/CompareScreen.tsx |
| 16 | Map tab on web has no download-the-app prompt â Expo Go message exists but could be clearer | ✅ Fixed Mar 14 | client/screens/MapScreen.web.tsx |
| 29 | .replit sets entrypoint = "README.md" instead of client/index.js. | ✅ Fixed Mar 17 | .replit |
| 30 | replit.nix is missing — no system-level package pinning for native deps. | ✅ Fixed Mar 17 | replit.nix |
| 31 | app.json missing platforms array — Expo build target is ambiguous. | ✅ Fixed Mar 17 | app.json |
| 32 | server/index.ts has no catch-all SPA route — deep links 404 on reload. | ✅ Fixed Mar 17 | server/index.ts |
| 33 | replit.md has no How to Run section — agents and contributors lack run context. | ✅ Fixed Mar 17 | replit.md |

---

---

## Replit Config Audit — Mar 16

Full audit of `.replit`, `replit.nix`, `app.json`, and `server/index.ts` against Replit Cloud Run requirements.

### 🔴 Issues (need fixing)

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| R4 | `entrypoint = "README.md"` in `.replit` — should point to `client/index.js` (actual app entry, not a doc file) | 🔴 Open | .replit |
| R5 | `replit.nix` is missing — `.replit` declares `[nix] channel = "stable-24_05"` but no `replit.nix` exists; any native dependency will fail silently | 🔴 Open | replit.nix (missing) |
| R6 | `app.json` has no `"platforms"` array — omitting it causes ambiguous build output and can confuse `expo export` on Replit | 🔴 Open | app.json |

### 🟡 Warnings (won't break immediately)

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| R7 | `web.output = "single"` (SPA) requires Express catch-all route — deep links will 404 on reload if `server/index.ts` doesn't fall through to `index.html` for unknown paths | 🟡 Open | server/index.ts |
| R8 | `expo:static:build` delegates to `node scripts/build.js` (custom script) — if it depends on `$REPLIT_DEV_DOMAIN` at build time, Cloud Run builds may fail silently | 🟡 Open | scripts/build.js |
| R9 | `replit.md` has no run/build instructions — Replit agents read this file for workflow hints; missing context causes every agentic session to start blind | 🟡 Open | replit.md |

### ✅ Confirmed Correct

| Requirement | Status |
|-------------|--------|
| `modules = ["nodejs-22"]` declared | ✅ |
| `run = ["npm", "run", "server:prod"]` | ✅ |
| `build = ["sh", "-c", "npm run expo:static:build && npm run server:build"]` | ✅ |
| `deploymentTarget = "cloudrun"` | ✅ |
| Ports: 5000 (main), 8081→80 (Expo), 8082→3000 | ✅ |
| All key scripts in `package.json` (`expo:dev`, `server:dev`, `server:prod`, `server:build`, `expo:static:build`) | ✅ |
| `client/index.js` exists; `"main": "client/index.js"` in `package.json` | ✅ |
| `server/index.ts` exists | ✅ |
| Dev script uses `$REPLIT_DEV_DOMAIN` env var (not hardcoded URLs) | ✅ |
| `[env] PORT = "5000"` in `.replit` | ✅ |
| Parallel "Start Backend" + "Start Expo" wired to Run button | ✅ |
| `replit.md` present | ✅ |

### Fix Order (Replit Config)

1. **R4** — Change `entrypoint = "README.md"` → `entrypoint = "client/index.js"` in `.replit`
2. **R5** — Add a minimal `replit.nix` (even empty) to pin the Nix channel
3. **R6** — Add `"platforms": ["ios", "android", "web"]` to `app.json`
4. **R7** — Verify `server/index.ts` has a catch-all static file route for the Expo SPA bundle
5. **R8** — Review `scripts/build.js` for `$REPLIT_DEV_DOMAIN` dependency at build time
6. **R9** — Add a "How to run" section to `replit.md` describing dev and prod workflows

---

## JSX Corruption — Standing Rule & Incident Log

### Standing Rule

**All code changes must produce valid JSX.** The following patterns are forbidden and must be caught before committing:

| Anti-pattern | Example | Fix |
|---|---|---|
| Duplicated closing tag | `</View>View>` | `</View>` |
| Orphaned closing tag after function brace | `}\n</Tab.Navigator>` | Remove the orphaned tag |
| Unclosed JSX element | `<View>` with no matching `</View>` | Add the closing tag in the correct position |

Replit surfaces JSX syntax errors immediately at boot and crashes the entire app — there is no graceful fallback.

### Incident: Widespread JSX Corruption — Mar 17

9 files were found to have corrupted JSX. Root cause: closing tags were duplicated (e.g. `</View>View>`) or orphaned closing tags were appended after function closing braces (e.g. `}</Tab.Navigator>`).

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| J1 | Duplicated/orphaned JSX closing tags across 9 files — crashed app at boot | ✅ Fixed Mar 17 | client/navigation/RootStackNavigator.tsx |
| J2 | Duplicated/orphaned JSX closing tags | ✅ Fixed Mar 17 | client/navigation/MainTabNavigator.tsx |
| J3 | Duplicated/orphaned JSX closing tags | ✅ Fixed Mar 17 | client/contexts/UserProfileContext.tsx |
| J4 | Duplicated/orphaned JSX closing tags | ✅ Fixed Mar 17 | client/screens/CityDetailScreen.tsx |
| J5 | Duplicated/orphaned JSX closing tags | ✅ Fixed Mar 17 | client/screens/InteractiveDemoScreen.tsx |
| J6 | Duplicated/orphaned JSX closing tags | ✅ Fixed Mar 17 | client/screens/ProfileScreen.tsx |
| J7 | Duplicated/orphaned JSX closing tags | ✅ Fixed Mar 17 | client/screens/ScenarioTestingScreen.tsx |
| J8 | Duplicated/orphaned JSX closing tags | ✅ Fixed Mar 17 | client/components/TestimonialsSection.tsx |

### Prevention Checklist (before every commit)

- [ ] No `</Tag>Tag>` patterns in any changed file
- [ ] No closing tags appearing after a `}` function brace
- [ ] `npx tsc --noEmit` passes with no JSX errors
- [ ] Replit backend and frontend both boot cleanly after the change

## Fix Order Recommendation

Work top-to-bottom by priority. Suggested batching:

Batch A â High, quick wins:
- #6 Add back chevron to Step 2 and Step 3 headers
- #15 Wrap city columns in Pressable navigating to CityDetail

Batch B â High, requires logic:
- #8 Pre-populate slider defaults from Steps 1 and 2 profile data
- #9 Add LiveScorePreview to PrioritiesStepScreen

Batch C â Medium:
- #3 Gate canProceed on at least one chip selection
- #12 Surface top N user priority weights in Key Differences
- #14 Remove false Save button or gate save to button press

Batch D â Polish:
- #1, #2, #4, #5, #7, #11, #13, #16