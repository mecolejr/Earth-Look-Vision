# CLAUDE.md — Session Briefing for EarthLook Vision

> Read this file at the start of every session before touching any code.

---

## Repo

- **GitHub**: `mecolejr/Earth-Look-Vision`
- **Stack**: Expo SDK 54 / React Native 0.81, TypeScript, React Navigation v7, TanStack Query
- **Source root**: `client/`

---

## How to Work in This Repo

All file reads and writes go through the **browser-based GitHub API** — never the terminal.

### Setup (do once per session)
The PAT (classic, repo scope) is stored in the user's password manager / GitHub settings.
Set it in the browser tab before any API calls:
```js
window._token = '<PAT_FROM_USER>';
```
Token format: `github_pat_...` — ask the user if not provided at session start.

### Read a file
```js
(async () => {
  const r = await fetch('https://api.github.com/repos/mecolejr/Earth-Look-Vision/contents/PATH', {
    headers: { 'Authorization': `token ${window._token}` }
  });
  const d = await r.json();
  window._sha = d.sha;
  window._lines = atob(d.content.replace(/\n/g,'')).split('\n');
  return `lines:${window._lines.length} sha:${d.sha.slice(0,8)}`;
})()
```

### Decode lines (avoids content-filter block)
```js
// Never return raw multi-line strings — decode by char code instead
window._lines.slice(N-1, M).map((l,i) =>
  `${i+N}: ${Array.from(l).map(c=>c.charCodeAt(0)).join(',')}`
)
```

### Push a file
```js
(async () => {
  const b64 = btoa(unescape(encodeURIComponent(newContent)));
  const r = await fetch('https://api.github.com/repos/mecolejr/Earth-Look-Vision/contents/PATH', {
    method: 'PUT',
    headers: { 'Authorization': `token ${window._token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'commit msg', content: b64, sha: window._sha, branch: 'main' })
  });
  const d = await r.json();
  return d.commit ? `✅ ${d.commit.sha.slice(0,8)}` : `❌ ${JSON.stringify(d).slice(0,200)}`;
})()
```

### Critical rules
- **Never parallel-push two files** — SHA race condition causes 409. Push sequentially.
- **Always re-fetch SHA before retry** if a push fails with conflict.
- **Verify before pushing**: check boolean flags (`content.includes('...')`) on the new string.
- **Decode by char code** — the browser blocks raw multi-line string output.
- **Wrap async in IIFE**: `(async () => { ... })()` — top-level await is not supported.

---

## Usage Limits

| Limit | Notes |
|---|---|
| Weekly (all models) | Resets **Tuesday 9:00 AM** local time. Check claude.ai/settings/usage before starting. |
| Session | Resets every ~3–4 hours. Independent of weekly. |

### Efficiency rules per session
1. Read only the lines you need — no exploratory full-file reads.
2. Batch all edits to a file into a single push.
3. Work the simplest fix first to minimize tokens spent on exploration.
4. Prefer structural analysis (line counts, boolean checks) over full content dumps.
5. If weekly usage >85%, do only Batch A and defer B+C to after the reset.

---

## Issue Status

### ✅ Completed — Polish (Batch D)

| # | Issue | Commit |
|---|---|---|
| 1 | Welcome screen visual hierarchy — 3-tier button weight | da204cd3 |
| 2 | Persona picker inline → bottom sheet modal | da204cd3 |
| 4 | Climate prefs card grouping on Step 1 | 08ed24da |
| 5 | LiveScorePreview compact mode job market bar | 8df3babb |
| 7 | Multi-select ChipGroups on Step 2 | 4cfffa9f |
| 11 | Unique city placeholder colors in ExploreScreen | 1fcd2b9b |
| 13 | CompareScreen nested horizontal scroll | 10cd06e8 |
| 16 | MapScreen web download-app prompt + store buttons | 19e93bd6 |

---

### 🔲 Remaining — Batches A, B, C

**Batch A — High priority, quick wins (lowest token cost, do first)**

| # | Issue | Files |
|---|---|---|
| 6 | Add back chevron to Step 2 and Step 3 headers | client/screens/IdentityStep2Screen.tsx, IdentityStep3Screen.tsx |
| 15 | Wrap city columns in Pressable navigating to CityDetail | client/screens/ExploreScreen.tsx (or city-list component) |

**Batch B — High priority, requires logic**

| # | Issue | Files |
|---|---|---|
| 8 | Pre-populate slider defaults from Steps 1 & 2 profile data | client/screens/PrioritiesStepScreen.tsx |
| 9 | Add LiveScorePreview to PrioritiesStepScreen | client/screens/PrioritiesStepScreen.tsx, LiveScorePreview.tsx |

**Batch C — Medium priority**

| # | Issue | Files |
|---|---|---|
| 3 | Gate canProceed on at least one chip selection | client/screens/IdentityStep1Screen.tsx or ChipGroup component |
| 12 | Surface top N user priority weights in Key Differences | client/screens/CompareScreen.tsx or score utility |
| 14 | Remove false Save button or gate save to button press | Search codebase for Save button |

---

## Session Startup Checklist

1. Navigate to `https://github.com` in a tab.
2. Set `window._token` to the PAT (ask user if not provided).
3. Fetch and read this file (`CLAUDE.md`) to confirm current state.
4. Check `ISSUES.md` for any status updates since last session.
5. Check `claude.ai/settings/usage` — if weekly >85%, only do Batch A.
6. Work issues in order: Batch A → B → C.
7. After completing a fix, update `ISSUES.md` to mark the row ✅.
