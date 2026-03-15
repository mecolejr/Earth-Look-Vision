# EarthLook â Open Issues

This file is the source of truth for all known bugs and UX issues. Update it whenever a fix is committed. At the start of any new session, read this file first to know exactly where things stand.

**Last updated:** 2026-03-15
**Audit basis:** Full code review of client/screens/ against the 17-issue list.
**Commit convention:** fix(#N): short description â matches the issue number below.

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
| 6 | No back button on onboarding Steps 2 and 3 â header only shows ProgressIndicator, Android users are stuck | â Fixed Mar 14 | IdentityStep2Screen.tsx, PrioritiesStepScreen.tsx, OnboardingNavigator.tsx |
| 8 | All 10 priority sliders default to 50 regardless of Steps 1 and 2 input â causes decision fatigue | â Fixed Mar 14 | client/screens/PrioritiesStepScreen.tsx |
| 9 | No LiveScorePreview on Step 3 Priorities â the most impactful step has zero visual feedback | â Fixed Mar 14 | client/screens/PrioritiesStepScreen.tsx |
| 15 | City columns in Compare screen have no onPress â tapping a city does nothing, no path to CityDetail | â Fixed Mar 14 | client/screens/CompareScreen.tsx |
| 20 | Destructive action â verify it's wrapped in an Alert.alert() confirmation. | â Verified Mar 14 | client/screens/ProfileScreen.tsx |
| 24 | Destructive action â verify it's wrapped in an Alert.alert() confirmation. | â Fixed Mar 14 | client/screens/CompareScreen.tsx |

---

## Medium

| # | Issue | Status | Files Affected |
|---|-------|--------|----------------|
| 3 | canProceed is hardcoded to true on Step 1 â Continue is always enabled even with nothing selected | â Fixed Mar 14 | client/screens/IdentityStep1Screen.tsx |
| 12 | Key Differences in Compare always shows 4 hardcoded categories â ignores user priority weights | â Fixed Mar 14 | client/screens/CompareScreen.tsx |
| 14 | handleSaveIdentity and handleSavePriorities only call setActiveSection(null) â Save button is a false affordance | â Fixed Mar 14 | client/screens/ProfileScreen.tsx |
| 18 | welcome-hero.png used as a placeholder image outside of WelcomeScreen. | â Fixed Mar 14 | client/screens/ExploreScreen.tsx |
| 19 | Pressable missing accessibilityLabel â needed for screen readers. | â Fixed Mar 14 | client/screens/ExploreScreen.tsx |
| 21 | Pressable missing accessibilityLabel â needed for screen readers. | ð´ Open | client/screens/IdentityStep2Screen.tsx |
| 22 | Pressable missing accessibilityLabel â needed for screen readers. | ð´ Open | client/screens/PrioritiesStepScreen.tsx |
| 23 | welcome-hero.png used as a placeholder image outside of WelcomeScreen. | ð´ Open | client/screens/ExploreScreen.tsx |
| 25 | Pressable missing accessibilityLabel â needed for screen readers. | ð´ Open | client/screens/PrioritiesStepScreen.tsx |
| 26 | Pressable missing accessibilityLabel â needed for screen readers. | ð´ Open | client/screens/CompareScreen.tsx |

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

---

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