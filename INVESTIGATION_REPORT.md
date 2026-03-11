# Bug & Mobile UI Investigation Report

**Branch:** `investigation/bug-diagnosis`  
**Date:** March 11, 2026  
**Scope:** Verify known bugs, diagnose mobile horizontal scroll. No code changes made.

---

## 1. Streak Bug — CONFIRMED

### Summary
The streak **never increments beyond 1** because `lastPlayedDate` is overwritten to today when the first round is saved, before `updateStreak` runs. When `updateStreak` runs after round 3, it can no longer detect that the player played yesterday.

### Root Cause (Code Trace)

**File:** `src/lib/storage.ts`

1. **When saving round 1** (lines 61–69):
   ```ts
   if (!state.todayResults || state.lastPlayedDate !== today) {
     state.todayResults = { ... };
     state.lastPlayedDate = today;  // ← Overwrites previous value
   }
   ```
   If the player played yesterday, `lastPlayedDate` was `"2026-03-10"`. As soon as round 1 is saved today, it becomes `"2026-03-11"`. The fact that they played yesterday is lost.

2. **When finalizing after round 3** (lines 102–104, 119–133):
   ```ts
   function finalizeDailyResults(state, today) {
     updateStreak(state, today);  // ...
   }
   function updateStreak(state, today) {
     const yesterday = getYesterdayDateET(today);  // "2026-03-10"
     if (state.lastPlayedDate === yesterday) {
       state.currentStreak += 1;   // ← Never reached
     } else if (state.lastPlayedDate === today) {
       // Already counted today (guard) — does nothing
     } else {
       state.currentStreak = 1;    // Reset on gap
     }
   }
   ```
   At this point `state.lastPlayedDate === "2026-03-11"` (today). So:
   - `lastPlayedDate === yesterday` is false
   - `lastPlayedDate === today` is true → we hit the “already counted” branch and **do not increment**
   - Streak stays at 1

### Reproduction
1. Day 1: Complete all 3 rounds → streak becomes 1.
2. Day 2: Complete all 3 rounds → streak should become 2 but stays 1.

### Fix Direction
Store `lastCompletedDate` separately, or pass the previous `lastPlayedDate` into `updateStreak` before overwriting it in `saveRoundResult`.

---

## 2. Prior Results Pin Data Bug — CONFIRMED (Low Impact)

### Summary
When resuming a game (e.g. after completing round 1 and refreshing), `priorResults` are built with `pinLat: 0, pinLng: 0` instead of the saved values from `RoundResult`.

### Root Cause

**File:** `src/app/play/page.tsx` (lines 156–168)

```ts
const priorResults: GuessResult[] = (saved?.rounds ?? []).map((r) => ({
  courseId: r.courseId,
  nameGuess: "",
  nameCorrect: r.nameCorrect,
  pinLat: 0,      // ← Should be r.pinLat ?? 0
  pinLng: 0,      // ← Should be r.pinLng ?? 0
  pinDistance: r.pinDistance,
  // ...
}));
```

`RoundResult` includes optional `pinLat` and `pinLng` (see `src/lib/types.ts`), and `saveRoundResult` does persist them (lines 239–240). The bug is only in this reconstruction.

### Impact
- **Current flow:** Prior round reveals are not shown during play. Only `latestResult` (the most recent round) is displayed. So the wrong pin coords are never rendered in the current UI.
- **Results page:** Loads directly from `localStorage` via `getTodayResults()` and uses `round.pinLat ?? lat` in `roundResultToGuessResult`, so pins are correct there.
- **Latent risk:** If a “view previous round” feature is added during play, the pin would appear at (0, 0) instead of the actual guess.

### Fix Direction
Use `pinLat: r.pinLat ?? 0` and `pinLng: r.pinLng ?? 0` (or fall back to course location for RevealMap).

---

## 3. UsernameModal Loading State Bug — CONFIRMED

### Summary
If `createPlayer` fails (e.g. Supabase error, network issue), the modal stays in a permanent “Creating…” loading state with no way to recover except refresh or “Continue without a name”.

### Root Cause

**File:** `src/components/auth/UsernameModal.tsx` (lines 15–28)

```ts
async function handleSubmit(e) {
  // ...
  setLoading(true);
  setError("");
  onSubmit(trimmed);  // ← Fire-and-forget; does not await
}
```

**File:** `src/app/page.tsx` (lines 71–78)

```ts
async function handleCreatePlayer(name: string) {
  const p = await createPlayer(name);
  if (p) {
    setPlayer(p);
    setNeedsUsername(false);
  }
  // On failure: no callback, no setLoading(false), no setError
}
```

The modal never receives success/failure. It sets `loading = true` and never clears it. The parent only unmounts the modal on success; on failure it does nothing.

### Reproduction
1. Disconnect network or use an invalid Supabase config.
2. Enter a name and submit.
3. Modal shows “Creating…” indefinitely.

### Fix Direction
- Change `onSubmit` to return a `Promise<boolean>` or accept an `onComplete(success: boolean)` callback.
- Or have the modal call `createPlayer` directly and handle loading/error itself.

---

## 4. Course Images — NOT A BUG

### Summary
Course images are present and correctly referenced.

### Findings
- `public/courses/` exists with 100+ course folders.
- Each course has `aerial-tight.jpg`, `aerial-medium.jpg`, `aerial-wide.jpg`.
- `courses.json` paths match: e.g. `courses/pebble-beach-golf-links/aerial-tight.jpg`.
- `ClueImage` serves images via `/${src}` (e.g. `/courses/.../aerial-tight.jpg`).

Images load correctly. The earlier concern about missing `public/courses/` was incorrect for the current codebase.

---

## 5. Mobile Horizontal Scroll Bar — DIAGNOSIS

### User Report
“They are kinda fixed in terms of being centered and the right zoom, but for some reason an unnecessary horizontal scroll bar does still show up.”

### Current Mitigations (Already in Place)

**`src/app/globals.css`:**
- `html`: `width: 100%`, `max-width: 100vw`, `overflow-x: clip`
- `body`: `width: 100%`, `max-width: 100%`, `overflow-x: hidden`, `min-width: 0`

**Play page** (`src/app/play/page.tsx`):
- Root: `min-h-screen w-full overflow-x-hidden px-4`
- Inner flex: `min-w-0 w-full max-w-full` (sm:max-w-4xl)
- Children: `min-w-0` on ClueImage, HintPanel, GuessInput, MapGuess wrappers

**MapGuess / Leaflet:**
- Wrapper: `min-w-0 w-full max-w-full overflow-hidden`
- Leaflet `.leaflet-container` has `overflow: hidden`
- Safari: `.leaflet-safari .leaflet-tile-container` is 1600×1600px (Leaflet default)

### Workarounds to Access Play Page

**Problem:** Play redirects to results when today's puzzle is completed.

**Solution:** Clear localStorage via javascript URL before navigating:
```
javascript:(function(){localStorage.removeItem('courseiq-player-state');window.location.href='http://localhost:3000/play';})()
```
**Alternative:** Private/incognito window for fresh session.

### Scroll Metrics Injection

To measure scrollWidth vs clientWidth on any page, navigate to:
```
javascript:(function(){var d=document;var m={scrollWidth:d.documentElement.scrollWidth,clientWidth:d.documentElement.clientWidth,overflow:d.documentElement.scrollWidth>d.documentElement.clientWidth,innerWidth:window.innerWidth};d.body.innerHTML='<pre style="padding:20px;font-family:monospace;background:#0D1F17;color:#F5F1EB">'+JSON.stringify(m,null,2)+'</pre>';})()
```

### Browser Test (375×812)
- Resized to mobile dimensions.
- Results page: horizontal scroll attempted; “no scroll occurred (may be at edge)” — no horizontal overflow detected in this session.
- Play page: **tested** — cleared localStorage via `javascript:(function(){localStorage.removeItem('courseiq-player-state');window.location.href='http://localhost:3000/play';})()` then loaded play; injected metrics showed scrollWidth: 772, clientWidth: 772, overflow: false. IDE browser viewport stayed ~772px despite resize to 375px 

### Suspected Causes (If Scroll Persists)

1. **Leaflet Safari tile container**
   - `.leaflet-tile-container` is 1600px in Safari.
   - Even with `overflow: hidden` on `.leaflet-container` and the MapGuess wrapper, some Safari versions may still affect document scroll width.

2. **`overflow-x: clip` support**
   - `clip` is newer; older Safari might fall back differently.
   - Fallback could allow horizontal scroll in edge cases.

3. **Home page**
   - Root: `flex min-h-screen flex-col` — no `overflow-x-hidden` or `min-w-0`.
   - Main card has no `max-width`; flex items default to `min-width: auto`.
   - Long text (e.g. “Continue without a name — no leaderboard tracking”) could force width > viewport.

4. **Play page**
   - Play layout uses `PlayViewportEffect` to set `initial-scale=1.15` on mobile.
   - Combined with any overflow, this could make the scrollbar more noticeable.

### Recommended Next Steps
1. Test on real iOS Safari at 375px width on the **play** page (with Leaflet visible).
2. Use DevTools to measure `document.documentElement.scrollWidth` vs `clientWidth` when the scrollbar appears.
3. Inspect which element has `scrollWidth > clientWidth`.
4. Consider adding `overflow-x: clip` to the play page root if the scroll is isolated there.
5. Add `min-w-0` to the home page main/content card to allow flex shrinking.

---

## Summary Table

| Issue                    | Status   | Severity | Impact                                      |
|--------------------------|----------|----------|---------------------------------------------|
| Streak never increments  | Confirmed| High     | Streaks always 1 after day 2                |
| Prior results pin data   | Confirmed| Low      | No current UI impact; latent for future use |
| UsernameModal loading    | Confirmed| Medium   | Stuck UI on createPlayer failure             |
| Course images            | OK       | —        | Images load correctly                        |
| Mobile horizontal scroll | Unclear  | Medium   | Play tested; no overflow at 772px; real 375px + Safari not verified |

---

## Files Referenced

- `src/lib/storage.ts` — streak logic, `saveRoundResult`, `updateStreak`
- `src/lib/types.ts` — `RoundResult`, `GuessResult`
- `src/app/play/page.tsx` — priorResults construction, play layout
- `src/app/page.tsx` — home layout, `handleCreatePlayer`
- `src/components/auth/UsernameModal.tsx` — loading state
- `src/app/globals.css` — html/body overflow
- `src/components/game/MapGuess.tsx`, `MapGuessLeaflet.tsx` — map layout
- `node_modules/leaflet/dist/leaflet.css` — Safari tile container
