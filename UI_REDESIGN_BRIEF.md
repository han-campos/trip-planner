# Trip Planner — UI Redesign Design Brief (for Qwen 3 827B)

You are a senior UI/UX design architect. Produce a concrete, implementable design
direction for a **mobile-first React web app** (a shared trip planner). The app is
currently live but reads as "generic React library / 2015 bootstrap." We want it to
look **modern, sleek, and intentional** — think Notion/Airbnb/Linear quality.

## Non-negotiables (from the owner)
- **Keep the blue color family.** Do NOT blow up the palette. We're *refining* the
  existing blues, not replacing them. Deepen toward indigo/slate with an off-white
  background. Approved direction: rich indigo `#4F46E5`-ish primary, off-white
  `#F8FAFC` background, dark slate `#1E293B` headings / slate `#64748B` body.
- **Unified icon set.** Replace the current emoji + mixed-icon soup with a single,
  consistent stroke-based set (Lucide-style). Same weight throughout.
- **Mobile-first.** This is used mostly on phones.
- $0, static React/Vite, no new heavy framework.

## What the app has (all features MUST survive)
4 bottom tabs: **Guide, Phrases, Bookings, Add Trip**. Within Guide: a Guide⇄Map
slider, a city filter (All/Crete/Athens) and a horizontally-scrollable category chip
rail (Beaches, Hiking, Towns, Dining, History, Tours). Map = Leaflet with
color-coded/emoji markers + legend. Plus edit-mode (add/remove places), bookings
with address autocomplete, Add-Trip wizard.

## Known problems to solve (from the earlier vision feedback)
1. **"TRIP PLANNER V1" eyetal** in the top bar — signals developer prototype. Remove / replace with a clean wordmark.
2. **Bootstrap-y blue + thin-border square buttons** look dated.
3. **Busy top bar**: trip dropdown + (soon-removed) Lock button + 2 filter rows + hero card stacked = visual noise.
4. **Hero card's blue bottom border** reads like a stray loading bar; internal header (title + "Menu") reads like a table row.
5. **Mixed icon/emoji styles + inconsistency** (Active color states clash; bottom-nav icons vary in style).
6. **Typography**: weak hierarchy, small/low-contrast body text (accessibility).
7. **Filter chips**: crowded/small; need bigger touch targets, subtle active state.

## Your deliverables (concrete, actionable)
Produce:
1. **Design tokens** — exact color hexes (expanded from blue family), spacing scale,
   border-radius scale, shadow values, type scale (sizes/weights) with the font
   recommendation (Inter or similar).
2. **Component redesign spec**, screen by screen:
   - Top bar / header (kill V1, clean wordmark, trip-switcher as a sheet/tap not a raw `<select>`)
   - Guide view: hero card, section cards, filter chips (bigger, subtle active), cards
   - Guide⇄Map slider + category rail
   - Map pane + legend + popups
   - Bottom tab bar (clean floating bar or refined, unified icons, subtle active state)
   - Phrases deck, Bookings, Add-Trip wizard (consistent with the same system)
3. **Icon list** — map each current emoji to a Lucide-style icon + the component slot.
4. **Small CSS architecture note** — how to express it as CSS custom properties
   tokens (we already use `:root` vars in `styles.css`).

Prioritize impact per effort. Keep it implementable by a capable React dev with
plain CSS (no new UI library). Mobile-first with a desktop refinement.

Output a tight, structured spec (tokens first), not generic advice.