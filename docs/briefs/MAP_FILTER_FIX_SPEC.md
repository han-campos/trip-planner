

## Implementation Spec — Map View: Filter Bar + Attribution Fix

**Assumptions from your screenshot:** `.map-stage` is the `flex: 1` region below the sub-header; `.map-pane` (the Leaflet container) fills it edge-to-edge, *including under* the fixed bottom nav (z-index 60). The filter bar will be a **sibling of the map div**, absolutely positioned, so it never affects layout flow.

---

### FIX 1 — Compact floating filter bar

**Design:** one floating card, two rows. Row 1 = city as a **segmented control** (only 3 values → no scroll, instant state). Row 2 = category **chips**, horizontally scrollable. Total height ≈ 100px; map stays dominant.

**Where:** `TripView.jsx` → map branch (or `MapView.jsx` if the stage lives there). Insert inside `.map-stage`, next to the map div.

**JSX:**

```jsx
const CITIES = ['All', 'Crete', 'Athens'];
const CATEGORIES = ['All', 'Beaches', 'Hiking', 'Towns', 'Dining', 'Museums', 'Nature'];

// state (lift to wherever your marker list is filtered)
const [city, setCity] = useState('All');
const [category, setCategory] = useState('All');

<div className="map-stage">
  <div className="map-pane" ref={mapRef} />

  {/* FIX 1 — compact filter bar, floats over map */}
  <div className="map-filterbar" aria-label="Map filters">
    <div className="map-filterbar__seg">
      {CITIES.map(c => (
        <button
          key={c}
          type="button"
          aria-pressed={city === c}
          className={cx('map-filterbar__seg-btn', city === c && 'is-active')}
          onClick={() => setCity(c)}
        >
          {c}
        </button>
      ))}
    </div>
    <div className="map-filterbar__chips">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          type="button"
          aria-pressed={category === cat}
          className={cx('map-filterbar__chip', category === cat && 'is-active')}
          onClick={() => setCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  </div>

  <div className="map-controls"> {/* existing recenter / + / − */}
    …
  </div>
</div>
```

Wiring: filter your existing markers array by `city`/`category` before rendering (or toggle a `layerGroup` per category). No layout changes needed.

**CSS** → `styles.css`, new "Map view" section:

```css
/* --- positioning context + stacking --- */
.map-stage { position: relative; overflow: hidden; }

/* Contain Leaflet's internal z-indexes (panes go up to 700, controls 1000)
   so sibling overlays only need a small z-index. */
.map-pane { position: absolute; inset: 0; z-index: 0; }
/* (if you keep flex:1 on .map-pane instead, just add `z-index: 0;`) */

/* --- FIX 1: filter bar --- */
.map-filterbar {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  right: var(--space-2);
  z-index: 10;                       /* above map, below bottom-nav (60) */
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--color-surface);
  border-radius: 16px;               /* or var(--radius-lg, 16px) */
  box-shadow: var(--shadow-md);
}

/* Row 1 — city segmented control (fixed, 3 equal segments) */
.map-filterbar__seg {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  padding: 2px;
  background: var(--color-surface-muted, #eef1f4);
  border-radius: var(--radius-full);
}
.map-filterbar__seg-btn {
  height: var(--touch-min);          /* 44px — primary control */
  border: 0;
  background: transparent;
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-muted, #5b6472);
  cursor: pointer;
}
.map-filterbar__seg-btn.is-active {
  background: var(--color-surface);
  color: var(--color-text, #111827);
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.1));
}

/* Row 2 — category chips (horizontally scrollable) */
.map-filterbar__chips {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  overscroll-behavior-x: contain;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;             /* Firefox */
}
.map-filterbar__chips::-webkit-scrollbar { display: none; }

.map-filterbar__chip {
  flex: 0 0 auto;
  height: calc(var(--touch-min) - 12px);  /* 32px; +8px gap ≈ 40px tap zone */
  padding: 0 var(--space-3, 12px);
  border: 1px solid var(--color-border, #d8dce2);
  background: var(--color-surface);
  border-radius: var(--radius-full);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted, #5b6472);
  white-space: nowrap;
  cursor: pointer;
}
.map-filterbar__chip.is-active {
  background: var(--color-accent, #4f46e5);
  border-color: transparent;
  color: #fff;
}
```

**Integration notes (3 lines):**
1. `z-index: 0` on `.map-pane` is the key trick — without it, Leaflet's internal `z-index: 1000` controls would fight your overlay.
2. When fitting bounds, keep markers clear of the bar and nav: `map.fitBounds(bounds, { paddingTopLeft: [16, 112], paddingBottomRight: [16, 88] })`.
3. If you want strict 44px targets on chips too, set chip `height: var(--touch-min)` (card grows to ~112px — still fine).

---

### FIX 2 — Attribution clears the bottom nav

**Where:** `styles.css`. The attribution is positioned relative to the Leaflet container, whose bottom edge sits at the viewport bottom (under the nav) — so we lift it by the nav height. Keeps the map full-bleed.

```css
:root { --nav-h: 64px; }   /* single source of truth — bottom nav uses it too */

.bottom-nav { height: var(--nav-h); }  /* if not already tokenized */

/* FIX 2 — park attribution above the fixed nav */
.leaflet-control-attribution {
  bottom: calc(var(--nav-h) + var(--space-2));  /* 64 + 8 = 72px from viewport bottom */
  right: var(--space-2);
  max-width: 60vw;
  font-size: 10px;
  padding: 2px 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-sm, 6px) 0 0 0;
}
```

No JSX change. The right-side zoom/recenter controls sit mid-right, so bottom-right attribution won't collide with them.

**Alternative** (if you'd rather the map not render under the nav at all): instead of offsetting the attribution, inset the stage — `.map-stage { padding-bottom: var(--nav-h); }` — and drop the `bottom` override. I recommend the offset version: full-bleed map looks better, and it's one rule.

---

**Tokens used:** existing `--color-surface`, `--radius-full`, `--space-2`, `--shadow-md`, `--touch-min`; new/assumed `--nav-h`, `--space-3`, `--color-accent`, `--color-text(-muted)`, `--color-border`, `--shadow-sm` (all with fallbacks above — add to `:root` to match your palette).