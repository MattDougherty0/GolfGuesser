# Mobile Layout Investigation

## What the Screenshots Show

**Bad state (IMG_7673, IMG_7674):**
- Right side of content cut off
- "Architect -20" hint button partially/fully cut off
- "Tournament -105" and "Fun Fact -45" buttons cut off
- Satellite/aerial image right edge cut off
- Timer "0:11" cut off on right
- Course name input extends past visible area
- Browser UI (refresh icon, tabs icon) cut off
- Forces horizontal scroll

**Good state (IMG_7672 - one of them):**
- Further out zoom level
- All content visible and centered
- No horizontal scroll

---

## Root Cause Analysis

### 1. **Flex Container Width Cascade**

The play page structure:
```
body (no explicit width)
└── div.min-h-screen.w-full.overflow-x-hidden.px-4  (outer)
    └── div.mx-auto.flex.max-w-full.sm:max-w-4xl   (inner)
        ├── div.max-w-[500px]  (header row)
        ├── ClueImage (max-w-[500px])
        ├── div.max-w-[500px]  (hints)
        └── div.max-w-[500px]  (guess section)
```

**The problem:** `max-w-[500px]` on children means they can request up to 500px. On a ~375px viewport (minus 32px padding = 343px), the inner flex container *should* be constrained by `max-w-full` (100% of parent). But flex column containers size their width to the **max of their children's content widths**. If any child has `min-width: auto` (flex default) and content that's 500px, the container could expand to 500px, pushing the body wider than the viewport.

### 2. **ClueImage Has No Parent Width Constraint**

ClueImage is a direct child of the flex container. It has `w-full max-w-[500px]`. In a flex column, `w-full` = 100% of the parent. But the parent's width is determined by its children. Circular dependency. The ClueImage's inner content (the `<img>`) has `w-full` and `object-cover` - the image could have intrinsic dimensions that force a minimum width if the aspect ratio is preserved.

### 3. **Leaflet Map - Safari-Specific 1600px**

From `node_modules/leaflet/dist/leaflet.css`:
```css
.leaflet-safari .leaflet-tile-container {
  width: 1600px;
  height: 1600px;
}
```

On Safari (iOS uses Safari WebView), the tile container is 1600px. The map wrapper has `overflow: hidden`, so it *should* clip. But if the map container doesn't have an explicit width constraint, or if the overflow isn't applied correctly, this could leak.

### 4. **Missing Explicit Viewport Constraint**

- `html` and `body` have `overflow-x: hidden` but no `width: 100%` or `max-width: 100vw`
- On some mobile browsers, the initial containing block can behave differently
- Body might expand to fit content before overflow-x kicks in

### 5. **HintPanel Buttons - Flex Wrap**

The hint buttons use `flex flex-wrap justify-center`. The buttons have `px-4` and text. On a narrow screen, they wrap to 2 rows. But the *container* has `max-w-[500px]` - if the container is 500px on a 375px viewport, the buttons would overflow. The container width depends on the parent flex - if the parent is 500px, we overflow.

### 6. **Header Row (Round + Timer)**

`flex justify-between` with `max-w-[500px]` - if this div is 500px wide on mobile, it would overflow. The timer on the right would be cut off (matches screenshot).

---

## Most Likely Culprit

**The inner flex container is expanding to 500px** because its children have `max-w-[500px]` and the flex algorithm sizes the container to fit the "preferred" width of its children. On mobile, we need the container to be **capped at viewport width minus padding**, not 500px.

The fix: The outer div needs to establish a **definite width** that the inner div inherits. Using `width: 100%` on the outer div should work - but the outer div's parent (body) might not have a definite width in all browsers. Adding `width: 100%` and `max-width: 100%` to both `html` and `body` would ensure the viewport is the constraint.

---

## Recommended Fixes (for when you're ready)

1. **globals.css:** Add `width: 100%` and `max-width: 100%` to `html` and `body` to establish a definite viewport-constrained width.

2. **Play page:** Change all `max-w-[500px]` to `max-w-[min(500px,100%)]` or use a responsive approach: `w-full max-w-[500px]` with the parent having `max-w-full`. Ensure the outer div has `box-sizing: border-box` (Tailwind default) so `px-4` is included.

3. **ClueImage, HintPanel, etc.:** Add `max-w-full` as a fallback so they never exceed the parent: `max-w-[500px] max-w-full` - but that's redundant. Better: ensure the parent has `min-w-0` so flex children can shrink below their content size.

4. **Leaflet:** Add explicit `width: 100%` and `max-width: 100%` to the map container wrapper, and ensure the parent has `overflow: hidden` and a definite width.

5. **Nuclear option:** Use `overflow-x: clip` on `html` (more aggressive than `hidden`) and add `width: 100vw` with `overflow-x: hidden` on body - but `100vw` can include scrollbar on some browsers.

---

## Files to Modify (when implementing)

- `src/app/globals.css` - html/body width constraints
- `src/app/play/page.tsx` - outer/inner container structure
- `src/components/game/ClueImage.tsx` - ensure it can shrink
- `src/components/game/HintPanel.tsx` - container constraints
- `src/components/game/MapGuess.tsx` - map wrapper constraints
