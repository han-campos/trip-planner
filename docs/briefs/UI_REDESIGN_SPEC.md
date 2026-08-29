# Trip Planner — Mobile-First UI Redesign Spec

## 0. Impact / effort priorities

| Priority | Work | Why it matters |
|---|---|---|
| **P0** | Design tokens, top bar, bottom nav, chips, cards, map markers | Fixes “prototype / Bootstrap” feel fastest |
| **P0** | Remove `TRIP PLANNER V1`, replace raw `<select>` with trip sheet | Removes loudest prototype signal |
| **P1** | Guide/Map segmented control, Leaflet marker/popup styling, legend | Makes core feature feel product-grade |
| **P1** | Phrases, Bookings, Add-Trip wizard consistency | Prevents feature-by-feature visual drift |
| **P2** | Motion polish, desktop refinement, empty states | Nice-to-have after core mobile pass |

---

# 1. Design tokens

## 1.1 Font

Use **Inter** if self-hosted or bundled. If you want to stay fully static with zero font files, use the system stack below. Do **not** use Bootstrap default font.

```css
--font-sans:
  "Inter",
  ui-sans-serif,
  system-ui,
  -apple-system,
  "Segoe UI",
  Roboto,
  "Helvetica Neue",
  Arial,
  sans-serif;
```

Weights:

| Weight | Use |
|---:|---|
| 400 | Body, helper text |
| 500 | Chips, labels, secondary buttons |
| 600 | Card titles, nav active, inputs |
| 700 | Hero titles, wizard headings |

---

## 1.2 Color tokens

Keep the blue family. Deepen toward indigo/slate. Use semantic names in CSS, not raw hexes in components.

```css
:root {
  /* Base */
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-2: #F1F5F9;
  --color-surface-3: #E2E8F0;

  --color-border: #E2E8F0;
  --color-border-strong: #CBD5E1;

  /* Primary blue/indigo */
  --color-primary: #4F46E5;
  --color-primary-hover: #4338CA;
  --color-primary-active: #3730A3;
  --color-primary-soft: #EEF2FF;
  --color-primary-border: #C7D2FE;
  --color-on-primary: #FFFFFF;

  /* Text */
  --color-text-1: #1E293B;
  --color-text-2: #475569;
  --color-text-3: #64748B;
  --color-text-disabled: #94A3B8;

  /* Semantic */
  --color-success: #059669;
  --color-success-soft: #ECFDF5;
  --color-warning: #B45309;
  --color-warning-soft: #FFFBEB;
  --color-danger: #DC2626;
  --color-danger-soft: #FEF2F2;

  /* Overlays / focus */
  --color-overlay: rgba(15, 23, 42, 0.45);
  --color-focus-ring: rgba(79, 70, 229, 0.28);

  /* Map / category colors */
  --color-cat-beach: #0EA5E9;
  --color-cat-beach-soft: #E0F2FE;

  --color-cat-hiking: #4F46E5;
  --color-cat-hiking-soft: #EEF2FF;

  --color-cat-town: #6366F1;
  --color-cat-town-soft: #E0E7FF;

  --color-cat-dining: #1D4ED8;
  --color-cat-dining-soft: #DBEAFE;

  --color-cat-history: #64748B;
  --color-cat-history-soft: #F1F5F9;

  --color-cat-tour: #7C3AED;
  --color-cat-tour-soft: #EDE9FE;
}
```

### Color usage rules

| Token | Use |
|---|---|
| `--color-bg` | App background |
| `--color-surface` | Cards, top bar, bottom nav, sheets |
| `--color-surface-2` | Segmented control track, pressed states, input hover |
| `--color-border` | Default card/input borders |
| `--color-primary` | Primary buttons, active chips, active nav, links |
| `--color-primary-soft` | Active chip background, selected icon pill, active card accent |
| `--color-text-1` | Headings, card titles, primary labels |
| `--color-text-2` | Body text, input text |
| `--color-text-3` | Captions, meta, inactive nav, helper text |
| `--color-success/warning/danger` | Booking status only. Do not use for general UI accents. |

---

## 1.3 Spacing scale

Use a 4px base. Mobile touch targets must be at least **44px**.

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 64px;

  --touch-min: 44px;
  --touch-comfort: 48px;
}
```

### Common spacing

| Use | Value |
|---|---:|
| Icon-to-text gap | `--space-2` = 8px |
| Card inner padding | `--space-4` = 16px |
| Card-to-card gap | `--space-3` = 12px |
| Section gap | `--space-6` = 24px |
| Page horizontal padding | `--space-4` = 16px |
| Bottom nav clearance | `calc(var(--space-9) + env(safe-area-inset-bottom))` |

---

## 1.4 Border-radius scale

Avoid square Bootstrap-style controls.

```css
:root {
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}
```

| Component | Radius |
|---|---:|
| Small icon button | `--radius-sm` |
| Input, button, card | `--radius-md` |
| Hero card, bottom sheet, map filter card | `--radius-lg` |
| Bottom nav, large modal | `--radius-xl` |
| Chips, pills, segmented control | `--radius-full` |

---

## 1.5 Shadows

Use subtle shadows, not heavy drop shadows.

```css
:root {
  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08),
               0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 6px 16px rgba(15, 23, 42, 0.10);
  --shadow-lg: 0 16px 40px rgba(15, 23, 42, 0.16);
  --shadow-focus: 0 0 0 4px var(--color-focus-ring);
}
```

| Elevation | Use |
|---|---|
| `--shadow-xs` | Default cards |
| `--shadow-sm` | Active cards, trip switcher, segmented thumb |
| `--shadow-md` | Map legend, floating controls, bottom sheet |
| `--shadow-lg` | Bottom nav, modal, wizard sheet |
| `--shadow-focus` | Focus-visible state |

---

## 1.6 Type scale

Mobile-first. Increase slightly on desktop if needed.

```css
:root {
  --text-xs: 12px;
  --leading-xs: 1.4;

  --text-sm: 14px;
  --leading-sm: 1.5;

  --text-base: 16px;
  --leading-base: 1.5;

  --text-md: 18px;
  --leading-md: 1.4;

  --text-lg: 20px;
  --leading-lg: 1.3;

  --text-xl: 24px;
  --leading-xl: 1.2;

  --text-2xl: 28px;
  --leading-2xl: 1.15;

  --tracking-tight: -0.015em;
  --tracking-normal: 0;
  --tracking-wide: 0.02em;
}
```

| Token | Size / line | Weight | Use |
|---|---:|---:|---|
| `--text-xs` | 12 / 1.4 | 500 | Tiny labels, legend, badges |
| `--text-sm` | 14 / 1.5 | 400–500 | Chips, captions, meta, helper |
| `--text-base` | 16 / 1.5 | 400 | Body, inputs, list text |
| `--text-md` | 18 / 1.4 | 600 | Card title, phrase text |
| `--text-lg` | 20 / 1.3 | 600 | Hero title, section title |
| `--text-xl` | 24 / 1.2 | 700 | Wizard heading, empty state title |
| `--text-2xl` | 28 / 1.15 | 700 | Large emphasis only |

### Typography rules

- Headings: `--color-text-1`, `letter-spacing: var(--tracking-tight)`.
- Body: `--color-text-2`.
- Meta/captions: `--color-text-3`, minimum 12px.
- Do not use 11px for anything user-facing.
- Inputs must use 16px to prevent iOS zoom.

---

## 1.7 Motion tokens

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 260ms;
}
```

Use motion only for:

- Bottom sheet open/close
- Guide/Map thumb slide
- Chip / nav active state
- Card press state

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

# 2. Component redesign spec

## 2.1 Global layout

### Mobile shell

```css
html, body {
  height: 100%;
}

body {
  margin: 0;
  background: var(--color-bg);
  color: var(--color-text-2);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  line-height: var(--leading-base);
  -webkit-font-smoothing: antialiased;
}
```

Use dynamic viewport height for map and full-screen sheets:

```css
.app {
  min-height: 100dvh;
  padding-bottom: calc(var(--space-9) + env(safe-area-inset-bottom));
}
```

### Focus state

```css
:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### Desktop refinement

At `min-width: 768px`:

- Center content: `max-width: 720px; margin-inline: auto;`
- Increase page padding: `24px`
- Top bar height: `64px`
- Hide floating bottom nav
- Move tabs into top bar as inline tabs
- Map can become `height: 60vh` instead of full-screen

---

## 2.2 Top bar / header

### Goal

Remove prototype feel. Kill:

- `TRIP PLANNER V1`
- Raw `<select>`
- Lock button
- Stacked filter rows in top bar
- Blue bottom border / stray loading bar look

### Layout

```text
[Brand]                         [Trip switcher]
```

### Spec

| Property | Value |
|---|---:|
| Height | `56px` mobile, `64px` desktop |
| Position | `sticky; top: 0; z-index: 50;` |
| Background | `color-mix(in srgb, var(--color-bg) 88%, transparent)` |
| Backdrop | `backdrop-filter: blur(12px);` |
| Border bottom | `1px solid transparent` until scrolled, then `var(--color-border)` |
| Padding | `0 var(--space-4)` |

### Brand / wordmark

Do **not** use `V1`.

Option A — text only:

```css
.topbar__brand {
  font-size: var(--text-base);
  line-height: 1;
  font-weight: 600;
  color: var(--color-text-1);
  letter-spacing: var(--tracking-tight);
}
```

Option B — small brand mark:

```text
[28px rounded square] Trip Planner
```

Brand mark:

| Property | Value |
|---|---:|
| Size | `28px × 28px` |
| Radius | `8px` |
| Background | `var(--color-primary-soft)` |
| Icon | `Compass` |
| Icon size | `16px` |
| Icon color | `var(--color-primary)` |
| Gap to text | `8px` |

### Trip switcher

Replace raw `<select>` with a button that opens a bottom sheet.

| Property | Value |
|---|---:|
| Height | `40px` |
| Padding | `8px 12px` |
| Radius | `var(--radius-full)` |
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Shadow | `var(--shadow-xs)` |
| Font | `14px / 500` |
| Text color | `var(--color-text-1)` |
| Icon | `ChevronDown` |
| Icon size | `16px` |
| Max trip name width | `120px` with ellipsis |

States:

| State | Style |
|---|---|
| Hover | `border-color: var(--color-border-strong)` |
| Focus-visible | `box-shadow: var(--shadow-focus)` |
| Open | `border-color: var(--color-primary-border)` |

### Trip switcher sheet

Use bottom sheet, not dropdown.

| Property | Value |
|---|---:|
| Max height | `70dvh` |
| Radius top | `var(--radius-xl)` |
| Background | `var(--color-surface)` |
| Shadow | `var(--shadow-lg)` |
| Handle | `36px × 4px`, `--color-border-strong`, full radius |
| Header | `Trips`, `20px / 600`, `--color-text-1` |
| Close button | `X`, `44px` touch target |
| Search input | `48px` height, `12px` radius |
| Trip row | `64px` min height, `12px` radius |
| Active trip row | `background: var(--color-primary-soft); border: 1px solid var(--color-primary-border);` |

Trip row content:

```text
[Trip name]
[Dates · City]              [ChevronRight]
```

Footer:

- `New trip` primary button, `52px` height.

---

## 2.3 Guide view

### Overall structure

```text
Top bar
Hero card
Filter toolbar
Guide/Map slider
Section cards / place cards
```

To reduce noise:

- Top bar contains only brand + trip switcher.
- Filters live inside Guide, not top bar.
- Hero card is one card, not a table row.
- No blue bottom border.

---

## 2.4 Hero card

### Goal

Fix:

- Blue bottom border reading as loading bar
- Internal header reading like a table row
- “Menu” text feeling dated

### Spec

| Property | Value |
|---|---:|
| Margin bottom | `16px` |
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Radius | `var(--radius-lg)` |
| Shadow | `var(--shadow-sm)` |
| Padding | `16px` |
| Min height | `112px` |

### Content

```text
Trip title                         [Edit icon button]
Subtitle
Meta row
```

### Title

| Property | Value |
|---|---:|
| Font | `20px / 1.3 / 600` |
| Color | `var(--color-text-1)` |
| Letter-spacing | `var(--tracking-tight)` |

### Subtitle

| Property | Value |
|---|---:|
| Font | `14px / 1.5 / 400` |
| Color | `var(--color-text-3)` |
| Margin top | `4px` |

Example:

```text
Crete & Athens
May 12 – May 20 · 4 people
```

### Meta row

Use icons + text:

```text
[MapPin] Heraklion   [CalendarDays] 8 days   [Users] 4
```

| Property | Value |
|---|---:|
| Font | `13px / 1.4 / 500` |
| Color | `var(--color-text-3)` |
| Icon size | `16px` |
| Gap | `12px` |
| Margin top | `12px` |

### Active trip chip

If the trip is active:

| Property | Value |
|---|---:|
| Height | `24px` |
| Padding | `0 10px` |
| Radius | `var(--radius-full)` |
| Background | `var(--color-primary-soft)` |
| Text | `Active` |
| Font | `12px / 600` |
| Color | `var(--color-primary)` |

Place top-right, left of edit button if needed.

### Edit button

Replace “Menu” text.

| Property | Value |
|---|---:|
| Size | `40px × 40px` |
| Radius | `12px` |
| Icon | `Pencil` |
| Icon size | `18px` |
| Default color | `var(--color-text-2)` |
| Hover background | `var(--color-surface-2)` |
| Active edit state | `background: var(--color-primary-soft); color: var(--color-primary);` |

When edit mode is active:

- Icon changes to `Check`
- Label can appear as small chip: `Editing`
- Place cards show remove controls
- Add-place FAB appears

---

## 2.5 Guide/Map slider

Use a segmented control, not a raw slider or awkward toggle.

### Spec

| Property | Value |
|---|---:|
| Height | `56px` |
| Padding | `4px` |
| Background | `var(--color-surface-2)` |
| Radius | `16px` |
| Border | `1px solid var(--color-border)` |
| Shadow | `var(--shadow-xs)` |
| Options | `Guide`, `Map` |
| Option height | `48px` |
| Thumb radius | `12px` |
| Thumb background | `var(--color-surface)` |
| Thumb shadow | `var(--shadow-sm)` |
| Transition | `transform var(--duration-base) var(--ease-out)` |

### Option content

```text
[Compass] Guide
[Map] Map
```

| Property | Value |
|---|---:|
| Icon size | `18px` |
| Label font | `14px / 600` |
| Inactive color | `var(--color-text-3)` |
| Active color | `var(--color-primary)` |
| Gap | `8px` |

### Behavior

- `Guide` selected: show hero, filters, cards.
- `Map` selected: show full map pane, hide hero/list.
- Keep city/category filters visible in both modes, but style them as floating map controls in Map mode.

---

## 2.6 Filter toolbar

### Goal

Fix crowded/small chips.

### Layout

```text
[City segmented control]
[Category chip rail]
```

Place below hero in Guide mode. In Map mode, place as floating card over map.

### City segmented control

Cities: `All`, `Crete`, `Athens`.

| Property | Value |
|---|---:|
| Height | `44px` |
| Padding | `4px` |
| Background | `var(--color-surface-2)` |
| Radius | `var(--radius-full)` |
| Option min width | `72px` |
| Option height | `36px` |
| Option radius | `var(--radius-full)` |
| Font | `14px / 500` |
| Inactive color | `var(--color-text-2)` |
| Active background | `var(--color-surface)` |
| Active shadow | `var(--shadow-sm)` |
| Active color | `var(--color-primary)` |

Accessibility:

- Use `role="tablist"` or radio group.
- Keyboard: arrow keys move selection.
- Minimum touch target remains 44px container.

### Category chip rail

Categories:

```text
Beaches, Hiking, Towns, Dining, History, Tours
```

| Property | Value |
|---|---:|
| Rail height | `44px` |
| Overflow | `overflow-x: auto` |
| Scrollbar | hidden |
| Gap | `8px` |
| Chip height | `44px` |
| Chip padding | `0 16px` |
| Chip radius | `var(--radius-full)` |
| Chip border | `1px solid var(--color-border)` |
| Chip background | `var(--color-surface)` |
| Chip font | `14px / 500` |
| Chip icon size | `16px` |
| Icon-to-label gap | `8px` |
| Inactive color | `var(--color-text-2)` |
| Active background | `var(--color-primary-soft)` |
| Active border | `var(--color-primary-border)` |
| Active color | `var(--color-primary)` |
| Pressed background | `var(--color-surface-2)` |

Chip content:

```text
[Waves] Beaches
[Mountain] Hiking
[Building2] Towns
[UtensilsCrossed] Dining
[Landmark] History
[Route] Tours
```

Behavior:

- `All` city + all categories = no filter.
- Category chips can be single-select or multi-select depending on current app logic. If multi-select, active chips remain filled; add a small `X` inside active chip if needed.
- Do not make active state too loud. Use soft indigo, not solid blue.

---

## 2.7 Section cards / place cards

### Section header

Use for grouped categories.

```text
[Category icon] Beaches        [3]
```

| Property | Value |
|---|---:|
| Font | `13px / 600` |
| Color | `var(--color-text-3)` |
| Letter-spacing | `0.04em` |
| Text transform | `uppercase` |
| Icon size | `16px` |
| Icon color | category color |
| Count | `12px / 500`, `--color-text-3` |
| Margin top | `24px` |
| Margin bottom | `12px` |

### Place card

| Property | Value |
|---|---:|
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Radius | `14px` |
| Shadow | `var(--shadow-xs)` |
| Padding | `14px` |
| Min height | `84px` |
| Gap between cards | `12px` |

### Card layout

```text
[Category tile] [Title]                 [ChevronRight]
                [Subtitle]
                [Meta row]
```

### Category tile

| Property | Value |
|---|---:|
| Size | `40px × 40px` |
| Radius | `10px` |
| Background | category soft color |
| Icon | category icon |
| Icon size | `20px` |
| Icon color | category color |

Examples:

| Category | Background | Icon color |
|---|---:|---:|
| Beaches | `--color-cat-beach-soft` | `--color-cat-beach` |
| Hiking | `--color-cat-hiking-soft` | `--color-cat-hiking` |
| Towns | `--color-cat-town-soft` | `--color-cat-town` |
| Dining | `--color-cat-dining-soft` | `--color-cat-dining` |
| History | `--color-cat-history-soft` | `--color-cat-history` |
| Tours | `--color-cat-tour-soft` | `--color-cat-tour` |

### Card text

| Element | Style |
|---|---:|
| Title | `16px / 600`, `--color-text-1` |
| Subtitle | `14px / 400`, `--color-text-3` |
| Meta | `13px / 500`, `--color-text-3` |
| Meta icon size | `14px` |
| Meta gap | `12px` |

Meta examples:

```text
[MapPin] Heraklion
[Clock] 2h
[Users] Good for groups
```

### Card right action

Default:

- `ChevronRight`
- Size: `18px`
- Color: `var(--color-text-3)`
- Touch target: `44px`

Edit mode:

- Replace chevron with `Trash2`
- Icon button: `40px × 40px`
- Radius: `12px`
- Default color: `var(--color-text-3)`
- Hover/press: `background: var(--color-danger-soft); color: var(--color-danger);`

### Card states

| State | Style |
|---|---|
| Default | `border: var(--color-border)`, `shadow-xs` |
| Hover | `border-color: var(--color-border-strong)` |
| Pressed | `background: var(--color-surface-2)` |
| Selected | `border-color: var(--color-primary-border); background: var(--color-primary-soft);` |

---

## 2.8 Edit mode

Trigger:

- Hero card `Pencil` button.

When active:

1. Hero edit button becomes `Check` + `Editing` chip.
2. Place cards show `Trash2` action.
3. Add-place FAB appears.
4. Optional: show drag handle `GripVertical` on left if reordering is supported.

### Add-place FAB

| Property | Value |
|---|---:|
| Size | `56px × 56px` |
| Shape | circle |
| Background | `var(--color-primary)` |
| Icon | `Plus` |
| Icon size | `24px` |
| Icon color | `--color-on-primary` |
| Shadow | `var(--shadow-md)` |
| Position | `fixed; right: 16px; bottom: calc(var(--space-9) + env(safe-area-inset-bottom));` |
| Visible | only in Guide edit mode |

Add-place sheet:

- Use bottom sheet.
- Fields:
  - Name
  - Category
  - City
  - Address
  - Notes
  - Coordinates / map picker if supported
- Primary CTA: `Save place`

---

## 2.9 Map pane

### Layout

When `Map` is selected:

```text
Top bar
Map fills remaining viewport
Floating filter card
Floating legend
Floating map controls
```

### Map container

```css
.map-pane {
  position: relative;
  height: calc(100dvh - var(--topbar-height));
}
```

If using a normal page flow:

```css
.map-pane {
  height: calc(100dvh - 56px - var(--bottom-nav-height) - env(safe-area-inset-bottom));
}
```

Disable default Leaflet zoom controls and style custom controls.

---

## 2.10 Map filter card

Floating over map.

| Property | Value |
|---|---:|
| Position | `absolute; top: 12px; left: 12px; right: 12px;` |
| Background | `color-mix(in srgb, var(--color-surface) 95%, transparent)` |
| Backdrop | `blur(12px)` |
| Border | `1px solid var(--color-border)` |
| Radius | `var(--radius-lg)` |
| Shadow | `var(--shadow-md)` |
| Padding | `10px` |

Contains:

- City segmented control
- Category chip rail

Same chip specs as Guide, but rail can be slightly more compact:

| Property | Value |
|---|---:|
| Chip height | `40px` |
| Chip padding | `0 14px` |
| Font | `13px / 500` |

Keep touch target acceptable by making the whole chip tappable.

---

## 2.11 Map markers

Replace emoji markers with Lucide-style `divIcon` markers.

### Marker

Use Leaflet `L.divIcon`.

| Property | Value |
|---|---:|
| Default size | `32px × 32px` |
| Selected size | `40px × 40px` |
| Shape | circle |
| Border | `2px solid #FFFFFF` |
| Selected border | `3px solid #FFFFFF` |
| Shadow | `var(--shadow-sm)` |
| Icon size | `16px` |
| Icon color | `#FFFFFF` |
| Background | category color |
| Anchor | center |

### CSS

```css
.map-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: var(--shadow-sm);
  display: grid;
  place-items: center;
  color: #fff;
}

.map-marker--selected {
  width: 40px;
  height: 40px;
  border-width: 3px;
  box-shadow:
    var(--shadow-md),
    0 0 0 4px var(--color-focus-ring);
}

.map-marker--beach { background: var(--color-cat-beach); }
.map-marker--hiking { background: var(--color-cat-hiking); }
.map-marker--town { background: var(--color-cat-town); }
.map-marker--dining { background: var(--color-cat-dining); }
.map-marker--history { background: var(--color-cat-history); }
.map-marker--tour { background: var(--color-cat-tour); }
```

### Marker icons

| Category | Lucide icon |
|---|---|
| Beaches | `Waves` |
| Hiking | `Mountain` |
| Towns | `Building2` |
| Dining | `UtensilsCrossed` |
| History | `Landmark` |
| Tours | `Route` |

---

## 2.12 Map legend

Floating bottom card.

| Property | Value |
|---|---:|
| Position | `absolute; left: 12px; right: 12px; bottom: calc(var(--space-4) + env(safe-area-inset-bottom));` |
| Background | `color-mix(in srgb, var(--color-surface) 95%, transparent)` |
| Backdrop | `blur(12px)` |
| Border | `1px solid var(--color-border)` |
| Radius | `14px` |
| Shadow | `var(--shadow-md)` |
| Padding | `10px 12px` |
| Overflow | horizontal scroll |
| Gap | `8px` |

Legend item:

```text
[dot] Beaches
```

| Property | Value |
|---|---:|
| Height | `32px` |
| Padding | `0 10px` |
| Radius | `var(--radius-full)` |
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Dot size | `8px` |
| Dot radius | full |
| Label | `12px / 500`, `--color-text-2` |
| Active background | `var(--color-primary-soft)` |
| Active border | `var(--color-primary-border)` |
| Active label | `--color-primary` |

Legend behavior:

- Tapping a legend item filters markers.
- Active legend item matches active category chip.
- If all categories are active, show all markers.

---

## 2.13 Map controls

Floating right side, above legend.

| Control | Icon | Size | Use |
|---|---|---:|---|
| Recenter | `LocateFixed` | `44px` | Fly to user/current trip center |
| Zoom in | `Plus` | `44px` | Optional if custom zoom |
| Zoom out | `Minus` | `44px` | Optional if custom zoom |

Style:

| Property | Value |
|---|---:|
| Shape | circle |
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Shadow | `var(--shadow-md)` |
| Icon size | `20px` |
| Icon color | `var(--color-text-2)` |
| Pressed | `background: var(--color-surface-2)` |

Position:

```css
.map-controls {
  position: absolute;
  right: 12px;
  bottom: calc(72px + env(safe-area-inset-bottom));
  display: grid;
  gap: 8px;
}
```

---

## 2.14 Map popups

Style Leaflet popups to match cards.

### Popup wrapper

```css
.leaflet-popup-content-wrapper {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.leaflet-popup-content {
  margin: 12px;
  font-family: var(--font-sans);
}
```

### Popup content

```text
Title
Subtitle
Meta row
[Directions] [Add/Remove]
```

| Element | Style |
|---|---:|
| Title | `15px / 600`, `--color-text-1` |
| Subtitle | `13px / 400`, `--color-text-3` |
| Meta | `12px / 500`, `--color-text-3` |
| Action button | `36px × 36px`, `10px` radius |
| Primary action | `background: var(--color-primary-soft); color: var(--color-primary);` |
| Danger action | `background: var(--color-danger-soft); color: var(--color-danger);` |

Actions:

| Action | Icon | Use |
|---|---|---|
| Directions | `Navigation` | Open maps / route |
| Add to trip | `Plus` | Add place |
| Remove from trip | `Trash2` | Edit mode only |

Close button:

- `X`
- Size: `16px`
- Position: top-right
- Touch target: `32px` minimum, preferably `44px` if space allows.

---

## 2.15 Bottom tab bar

### Goal

Fix mixed icons and weak active state.

### Option: floating bottom bar

Recommended for modern feel.

| Property | Value |
|---|---:|
| Position | `fixed; left: 12px; right: 12px; bottom: 12px;` |
| Height | `64px + env(safe-area-inset-bottom)` |
| Padding bottom | `env(safe-area-inset-bottom)` |
| Background | `color-mix(in srgb, var(--color-surface) 95%, transparent)` |
| Backdrop | `blur(12px)` |
| Border | `1px solid var(--color-border)` |
| Radius | `var(--radius-xl)` |
| Shadow | `var(--shadow-lg)` |
| Z-index | `60` |
| Grid | `grid-template-columns: repeat(4, 1fr);` |

### Tabs

| Tab | Icon |
|---|---|
| Guide | `Compass` |
| Phrases | `Languages` |
| Bookings | `CalendarCheck` |
| Add Trip | `Plus` |

### Tab button

| Property | Value |
|---|---:|
| Min height | `56px` |
| Display | flex column |
| Gap | `4px` |
| Icon size | `22px` |
| Label | `11px / 500` |
| Inactive color | `var(--color-text-3)` |
| Active color | `var(--color-primary)` |

### Active state

Use a subtle pill behind the icon.

```css
.bottom-nav__tab {
  display: grid;
  place-items: center;
  gap: 4px;
  color: var(--color-text-3);
}

.bottom-nav__icon {
  width: 44px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: var(--radius-full);
  transition: background var(--duration-fast) var(--ease-out);
}

.bottom-nav__tab--active {
  color: var(--color-primary);
}

.bottom-nav__tab--active .bottom-nav__icon {
  background: var(--color-primary-soft);
}

.bottom-nav__tab--active .bottom-nav__label {
  font-weight: 600;
}
```

### Behavior

- No bounce.
- No heavy elevation on active tab.
- Keep labels visible.
- Do not make Add Trip a giant center FAB unless the owner wants a 5th action. Keep 4 equal tabs for now.

---

## 2.16 Phrases deck

### Layout

```text
Top bar
Search input
Category chips
Phrase cards
```

### Search input

| Property | Value |
|---|---:|
| Height | `48px` |
| Radius | `12px` |
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Padding | `0 12px` |
| Icon | `Search` |
| Icon size | `18px` |
| Icon color | `var(--color-text-3)` |
| Input font | `16px / 400` |
| Focus border | `var(--color-primary-border)` |
| Focus shadow | `var(--shadow-focus)` |

### Phrase card

| Property | Value |
|---|---:|
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Radius | `14px` |
| Shadow | `var(--shadow-xs)` |
| Padding | `16px` |
| Gap | `12px` |

### Card layout

```text
Phrase text                          [Heart]
Translation
[Audio button] [Copy button]
```

### Text

| Element | Style |
|---|---:|
| Phrase | `18px / 600`, `--color-text-1` |
| Translation | `15px / 400`, `--color-text-2` |
| Language label | `12px / 600`, `--color-text-3`, uppercase |

### Actions

| Action | Icon | Style |
|---|---|---|
| Audio | `Volume2` | `40px` circle, `--color-primary-soft`, icon `--color-primary` |
| Copy | `Copy` | `40px` circle, `--color-surface`, border, icon `--color-text-2` |
| Favorite | `Heart` | `20px`, inactive `--color-text-3`, active `--color-primary` |

### Optional deck mode

If you want a swipe deck:

- Card height: `220px`
- Shadow: `--shadow-md`
- Drag handle: `36px × 4px`
- Swipe actions: `Heart` favorite, `Copy` copy
- Keep list mode as default for simplicity.

---

## 2.17 Bookings

### Layout

```text
Top bar
Summary / add booking
Booking cards
```

### Add booking

Use primary button:

| Property | Value |
|---|---:|
| Height | `52px` |
| Radius | `12px` |
| Background | `var(--color-primary)` |
| Color | `--color-on-primary` |
| Font | `16px / 600` |
| Icon | `Plus` |
| Icon size | `18px` |
| Shadow | `var(--shadow-sm)` |

### Booking card

| Property | Value |
|---|---:|
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Radius | `14px` |
| Shadow | `var(--shadow-xs)` |
| Padding | `14px` |
| Gap | `12px` |

### Card layout

```text
[Service tile] [Booking title]        [Status chip]
               [Address]
               [Date · Time]
```

### Service tile

Use same tile pattern as place cards.

| Service | Icon |
|---|---|
| Hotel | `Hotel` |
| Car | `Car` |
| Flight | `Plane` |
| Activity | `Ticket` |
| Restaurant | `UtensilsCrossed` |
| Tour | `Route` |

### Status chip

| Status | Background | Text |
|---|---:|---:|
| Confirmed | `--color-success-soft` | `--color-success` |
| Pending | `--color-warning-soft` | `--color-warning` |
| Cancelled | `--color-danger-soft` | `--color-danger` |

Chip spec:

| Property | Value |
|---|---:|
| Height | `24px` |
| Padding | `0 10px` |
| Radius | `var(--radius-full)` |
| Font | `12px / 600` |

### Address autocomplete

Input:

| Property | Value |
|---|---:|
| Height | `52px` |
| Radius | `12px` |
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Icon | `MapPin` |
| Icon size | `18px` |
| Input font | `16px` |
| Focus | `--color-primary-border` + `--shadow-focus` |

Suggestions:

Use dropdown or bottom sheet.

| Property | Value |
|---|---:|
| Suggestion row height | `56px` |
| Radius | `10px` |
| Hover background | `var(--color-surface-2)` |
| Icon | `MapPin` |
| Title | `15px / 600`, `--color-text-1` |
| Subtitle | `13px / 400`, `--color-text-3` |

Keyboard:

- Arrow up/down
- Enter selects
- Escape closes

---

## 2.18 Add-Trip wizard

### Goal

Make it feel like a product flow, not a raw form.

### Layout

```text
Wizard header
Progress
Step content
Bottom CTA
```

### Wizard header

| Property | Value |
|---|---:|
| Height | `56px` |
| Back button | `ArrowLeft`, `44px` touch target |
| Title | `16px / 600`, `--color-text-1` |
| Step label | `13px / 500`, `--color-text-3` |
| Close button | `X`, `44px` touch target |

Example:

```text
[ArrowLeft] New trip          1 of 4        [X]
```

### Progress bar

| Property | Value |
|---|---:|
| Height | `4px` |
| Background | `var(--color-surface-2)` |
| Fill | `var(--color-primary)` |
| Radius | full |
| Margin | `0 16px 16px` |

### Steps

| Step | Title | Fields |
|---|---|---|
| 1 | Trip details | Trip name, travelers, notes |
| 2 | Destination | City search, selected city chips |
| 3 | Dates | Start date, end date |
| 4 | Review | Summary, map preview optional, create |

### Input spec

| Property | Value |
|---|---:|
| Label | `14px / 600`, `--color-text-2` |
| Input height | `52px` |
| Radius | `12px` |
| Background | `var(--color-surface)` |
| Border | `1px solid var(--color-border)` |
| Font | `16px` |
| Helper text | `13px`, `--color-text-3` |
| Error text | `13px`, `--color-danger` |
| Focus | `--color-primary-border` + `--shadow-focus` |

### Destination picker

Use search + selectable city chips.

City chips:

| Property | Value |
|---|---:|
| Height | `44px` |
| Radius | `var(--radius-full)` |
| Inactive | `surface`, border, `--color-text-2` |
| Active | `--color-primary-soft`, `--color-primary-border`, `--color-primary` |
| Icon | `MapPin` |

### Bottom CTA

| Property | Value |
|---|---:|
| Container | sticky bottom, `padding: 12px 16px calc(12px + env(safe-area-inset-bottom))` |
| Background | `color-mix(in srgb, var(--color-bg) 92%, transparent)` |
| Backdrop | `blur(12px)` |
| Back button | secondary, `48px` height |
| Continue button | primary, `52px` height |
| Final CTA | `Create trip` |

### Validation

- Disable `Continue` until required fields are valid.
- Show inline errors after blur or submit attempt.
- Do not use browser default validation bubbles if avoidable.

---

## 2.19 Shared controls

### Primary button

```css
.button--primary {
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-on-primary);
  font-size: var(--text-base);
  font-weight: 600;
  border: 0;
  box-shadow: var(--shadow-sm);
}

.button--primary:hover {
  background: var(--color-primary-hover);
}

.button--primary:active {
  background: var(--color-primary-active);
}

.button--primary:disabled {
  background: var(--color-surface-3);
  color: var(--color-text-disabled);
  box-shadow: none;
}
```

### Secondary button

```css
.button--secondary {
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-1);
  border: 1px solid var(--color-border);
  font-size: var(--text-base);
  font-weight: 600;
}
```

### Ghost button

```css
.button--ghost {
  background: transparent;
  border: 0;
  color: var(--color-text-2);
}
```

### Icon button

```css
.icon-button {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: transparent;
  border: 0;
  color: var(--color-text-2);
}

.icon-button:hover {
  background: var(--color-surface-2);
}
```

### Input

```css
.input {
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0 12px;
  font-size: var(--text-base);
  color: var(--color-text-1);
}

.input::placeholder {
  color: var(--color-text-3);
}

.input:focus-visible {
  outline: none;
  border-color: var(--color-primary-border);
  box-shadow: var(--shadow-focus);
}
```

### Card

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
}
```

### Chip

```css
.chip {
  min-height: var(--touch-min);
  padding: 0 16px;
  border-radius: var(--radius-full);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text-2);
  font-size: var(--text-sm);
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.chip--active {
  background: var(--color-primary-soft);
  border-color: var(--color-primary-border);
  color: var(--color-primary);
}
```

---

# 3. Icon map

Use **one icon system only**.

Recommended: **Lucide**.

Rules:

- No emoji in UI chrome.
- No mixed filled/stroke icons.
- All icons use `currentColor`.
- Stroke width: `1.75` for a refined look.
- Sizes: `14`, `16`, `18`, `20`, `22`, `24`.
- Do not mix Material filled icons with Lucide stroke icons.

## 3.1 Slot-to-icon map

| Slot / current emoji | Replace with Lucide icon | Component / use |
|---|---|---|
| 🧭 Guide tab | `Compass` | Bottom nav, Guide/Map slider |
| 🗺️ Map | `Map` | Guide/Map slider, map tab |
| 📍 Trip switcher | `MapPin` + `ChevronDown` | Top bar trip switcher |
|  Trip wordmark | `Compass` optional | Top bar brand mark |
| 💬 Phrases tab | `Languages` | Bottom nav |
| 📅 Bookings tab | `CalendarCheck` | Bottom nav |
| ➕ Add Trip tab | `Plus` | Bottom nav |
| 🏖️ Beaches | `Waves` | Chips, cards, map markers, legend |
| 🥾 Hiking | `Mountain` | Chips, cards, map markers, legend |
| 🏘️ Towns | `Building2` | Chips, cards, map markers, legend |
| 🍽️ Dining | `UtensilsCrossed` | Chips, cards, map markers, legend |
| 🏛️ History | `Landmark` | Chips, cards, map markers, legend |
| 🚌 Tours | `Route` | Chips, cards, map markers, legend |
| 📆 Date | `CalendarDays` | Hero meta, booking card, wizard |
| ⏰ Time | `Clock` | Meta rows |
| 👥 People | `Users` | Hero meta, wizard travelers |
| 🔍 Search | `Search` | Search inputs |
| ⚙️ Filter | `SlidersHorizontal` | Optional filter button |
| ✏️ Edit | `Pencil` | Hero edit mode |
| ✅ Done | `Check` | Edit mode complete |
| 🗑️ Delete | `Trash2` | Edit mode remove |
| ➕ Add | `Plus` | FAB, add booking, add place |
| ✖️ Close | `X` | Sheets, popups, wizard |
| ← Back | `ArrowLeft` | Wizard, detail screens |
| → Next | `ChevronRight` | Cards, list rows |
| 🧭 Directions | `Navigation` | Map popup |
| 🎯 Recenter | `LocateFixed` | Map control |
| ➕ Zoom in | `Plus` | Map control |
| ➖ Zoom out | `Minus` | Map control |
| 📋 Copy | `Copy` | Phrases |
| 🔊 Audio | `Volume2` | Phrases |
| ❤️ Favorite | `Heart` | Phrases |
| ✅ Confirmed | `Check` | Booking status |
| ⚠️ Pending | `TriangleAlert` | Booking status |
| ❌ Cancelled | `X` | Booking status |
| 📞 Phone | `Phone` | Contact actions |
| ↗️ External | `ExternalLink` | Open in maps |
| 🔒 Lock | Remove | Do not keep unless required |
| ☰ Menu | Remove or `MoreHorizontal` | Avoid top-bar menu noise |
| ⋯ More | `MoreHorizontal` | Card overflow if needed |

---

# 4. CSS custom-property / token architecture note

You already use `:root` vars in `styles.css`. Keep that, but make tokens semantic and layered.

## 4.1 Use CSS layers

```css
@layer tokens, base, components, utilities;
```

Order matters:

1. `tokens`
2. `base`
3. `components`
4. `utilities`

This prevents component CSS from accidentally overriding base styles.

## 4.2 Token layer

```css
@layer tokens {
  :root {
    /* Color */
    --color-bg: #F8FAFC;
    --color-surface: #FFFFFF;
    --color-primary: #4F46E5;

    /* Spacing */
    --space-4: 16px;
    --touch-min: 44px;

    /* Radius */
    --radius-md: 12px;
    --radius-full: 9999px;

    /* Shadow */
    --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08);

    /* Type */
    --font-sans: "Inter", system-ui, sans-serif;
    --text-base: 16px;
    --leading-base: 1.5;
  }
}
```

## 4.3 Base layer

```css
@layer base {
  body {
    margin: 0;
    background: var(--color-bg);
    color: var(--color-text-2);
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-base);
  }
}
```

## 4.4 Component layer

```css
@layer components {
  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-xs);
  }

  .chip {
    min-height: var(--touch-min);
    border-radius: var(--radius-full);
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    color: var(--color-text-2);
  }

  .chip--active {
    background: var(--color-primary-soft);
    border-color: var(--color-primary-border);
    color: var(--color-primary);
  }
}
```

## 4.5 Naming convention

Use semantic names, not visual names.

Good:

```css
--color-primary
--color-surface
--color-text-2
--space-4
--radius-md
--shadow-sm
```

Avoid:

```css
--blue-500
--white
--gray-100
--card-bg
```

Exception: category colors can be semantic by domain:

```css
--color-cat-beach
--color-cat-hiking
```

## 4.6 Do not hardcode component values

Bad:

```css
.chip {
  background: #EEF2FF;
  border-radius: 9999px;
  min-height: 44px;
}
```

Good:

```css
.chip {
  background: var(--color-primary-soft);
  border-radius: var(--radius-full);
  min-height: var(--touch-min);
}
```

## 4.7 Responsive strategy

Mobile-first.

```css
.page {
  padding-inline: var(--space-4);
}

@media (min-width: 768px) {
  .page {
    max-width: 720px;
    margin-inline: auto;
    padding-inline: var(--space-6);
  }
}
```

For bottom nav:

```css
@media (min-width: 768px) {
  .bottom-nav {
    display: none;
  }
}
```

Then show desktop tabs in the top bar.

## 4.8 Safe area

Always use:

```css
padding-bottom: env(safe-area-inset-bottom);
```

For fixed bottom elements:

```css
bottom: calc(12px + env(safe-area-inset-bottom));
```

## 4.9 Accessibility defaults

```css
button,
input,
[role="button"] {
  touch-action: manipulation;
}

:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

Minimum touch target:

```css
.icon-button,
.chip,
.bottom-nav__tab {
  min-height: var(--touch-min);
}
```

---

# 5. Highest-impact implementation order

Do this in order for maximum visual improvement per hour:

1. **Replace tokens in `:root`**
   - Blue/indigo palette
   - Spacing
   - Radius
   - Shadows
   - Type scale

2. **Redesign top bar**
   - Remove `TRIP PLANNER V1`
   - Clean wordmark
   - Trip switcher button
   - Trip bottom sheet

3. **Redesign bottom nav**
   - Floating rounded bar
   - Lucide icons
   - Subtle active pill

4. **Redesign chips**
   - 44px height
   - Soft indigo active state
   - Category icons

5. **Redesign cards**
   - White cards
   - 12–16px radius
   - Category tiles
   - No table-row headers

6. **Redesign map markers**
   - Remove emoji markers
   - Use colored circle `divIcon`
   - Lucide white icons
   - Style popups and legend

7. **Unify Phrases / Bookings / Add-Trip**
   - Same inputs
   - Same buttons
   - Same cards
   - Same status chips

This should make the app feel like a modern product within one focused design pass.