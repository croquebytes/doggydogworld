# Dog Treat Tycoon — Project Summary & TODO (v0.1.0)

Two pups inherit a tiny dog-treat operation and scale it into a cosmos-spanning snack empire. This doc summarizes the current prototype and outlines next steps for features, UI polish, and content expansions — including silly/fun premises to keep the vibes high.

---

## 1) Current State (Prototype Snapshot)
- **Core Loop**: Click to bake treats → buy Buildings → increase Treats/sec (TPS) → unlock Upgrades/Research → Prestige for **Alpha Bones** (perm global multiplier) → repeat.
- **Economy**: Geometric building cost scaling; data-driven buildings & upgrades; prestige formula: `floor((log10(treats) - 6)^1.5)`; +10% global per bone.
- **UI**: Clean pixel-friendly layout, tabs (Overview, Buildings, Upgrades, Research, Prestige, Settings), readable number formatting.
- **Meta**: Autosave every 30s; Export/Import saves; offline progress on load.

---

## 2) Immediate TODO (Next Ship)
**A. Bottom Tracking / Stats Bar (persistent, collapsible)**
- Fixed bar across all tabs: shows **Treats**, **TPS**, **Alpha Bones**, and quick actions (Save, Export, Settings).
- **Expand / Minimize**:
  - Minimized: compact counters + small dog sprite(s) idling.
  - Expanded: detailed breakdown (per-building TPS, multipliers, recent gains), activity feed (e.g., “+1.2K/s from Ovens”).
- **Implementation plan**:
  - HTML: add `<footer id="trackerBar" class="sticky">` + toggle button.
  - CSS: `position: sticky; bottom: 0;` dark panel, large counters for mobile.
  - JS: stateful `UI.trackerExpanded` + `renderTracker()`; persist in `State.meta`.
  - Performance: compute per-building deltas once per tick; throttle DOM updates to 6–10 FPS for the tracker.

**B. Sprite Animation Hooks**
- Minimal, reusable sprite component for dogs and icons:
  - Sprite sheet atlas per entity (idle, blink, hop, wag).
  - Component props: `src`, `frameW/H`, `fps`, `loop`, `states`.
  - Tick-driven animation with `requestAnimationFrame` (no external libs).
- Placeholder assets + stub states: `idle`, `wag`, `blink` used in the tracker and Overview hero cards.

**C. Polish & UX**
- Buy-Max (fast path) using geometric series closed form.
- Keyboard hotkeys: `1–8` buy buildings, `M` buy-max, `P` prestige confirm.
- Toasts for purchase success / can’t afford.

---

## 3) Short-Term Roadmap (1–2 iterations)
- **Milestones** (25/50/100 of a building): thematic bonuses (e.g., *“Golden Leash”*: Ovens buff Plots by +5% each milestone tier).
- **Upgrade Trees**: branchy choices (A/B/C) per tier for replayability.
- **Crit-Clicks**: low-chance x10 click + streak meter for “Perfect Bakes.”
- **Softcaps & Tuning**: gentle diminishing returns to pace late-game.
- **Achievements**: meta goals; modest rewards; show in tracker bar when unlocked.
- **Sound FX & Haptics**: ultra subtle click/upgrade/ascend cues; volume slider.

---

## 4) Mid- to Long-Term Systems
**A. “Dog Treat Factory” track (early–mid game)**
- Buildings: *Farm Plot → Pup Oven → Treat Line → Delivery Truck → QA Kennel → Flavor Lab → Space Kennel → Dyson Biscuit* (in code).
- Synergies: downstream buildings buff upstream (e.g., each Truck adds +1% to Treat Line TPS).
- Events: random “Health Inspection” (pause/boost), “Bulk Flour Deal” (-20% costs for 60s).

**B. “Run for President” (tax the treats) meta**
- Unlock after X ascensions: political campaign layer.
- Currencies: **Votes**, **Influence**, **Policy Points**.
- Mechanic: levy **Treat Tax** (1–5%) → generates **Policy Points** per tick; too high causes **Popularity** decay; balance the curve.
- Policy Tree (permanent after win):
  - *Small-Biz Subsidies*: -5% building costs.
  - *Space Treat Act*: +10% space-tier TPS.
  - *Pet Healthcare*: +5% global, but -2% treat tax cap (balance lever).
- Mini-events: debates (choose 1 of 3 cards for buffs/nerfs for 10m).

**C. “Colonize Space with Dog Treats” (late game)**
- New map: **Luna Kennel**, **Mars Bakery**, **Europa Freezer**, **Nebula Flavor Foundry**.
- New resource: **Stardust** or **Cosmic Crumbs** → crafted from late-tier buildings.
- Interstellar shipping lanes: assign fleets to routes; optimize yield vs. travel time.
- Cosmic prestige layer (“Ascend II”): convert Stardust into **Constellation Bones** (meta-multiplier on Alpha Bones).

**D. Silly/Fun Premise Packs**
- *Treat Standardization Directorate (TSD)*: bureaucratic tree that adds goofy forms.
- *Underground Squirrel Syndicate*: random heists steal/copy treats; counter with “Squirrel Treat Accord” upgrade.
- *Dogfluencer Network*: viral spikes; temporary +x% click power after “post.”
- *Cat Treat Detente*: peace treaty grants cross-species buffs at cost of 1% efficiency (flavor conflict).

---

## 5) Sprite Animation Plan (Tech Notes)
- **Atlas format**: `png` with rows per state, uniform frame size. Example: `dog_scout.png` → rows: idle(4f), wag(6f), blink(2f).
- **Engine hooks**:
  - `Sprite({ canvas|img, src, frameW, frameH, fps, stateMap })`.
  - API: `.play(state)`, `.stop()`, `.update(dt)`, `.draw(ctx, x, y, scale)`.
- **Usage**:
  - Tracker bar: idle + blink on idle; wag when treats change > threshold.
  - Overview buttons: play “hop” briefly on click/purchase.
- **Asset pipeline**: drop files in `/assets/img/sprites`; JSON manifest optional for state/frame counts.

---

## 6) UI/UX Spec — Persistent Bottom Tracker Bar
- **Collapsed**: `Treats`, `TPS`, `Bones`, tiny dog sprite, “▲” to expand.
- **Expanded**: per-building TPS (top 5), last 60s production chart (sparklines later), recent events, quick buttons (Save, Export, Settings).
- **Mobile**: large numbers; swipe-up to expand; swipe-down to collapse.
- **Tech plan**:
  - HTML: `<footer id="tracker">` + `<button id="trackerToggle">`.
  - CSS: sticky footer, high contrast; `will-change: transform` for smooth expand.
  - JS: `UI.trackerExpanded` in `State.meta`; `renderTracker()` throttled; event listeners for toggle/swipe.
- **Data**: keep a ring buffer of last N tick samples for instantaneous TPS + sparkline later.

---

## 7) Data & Code Tasks (LLM-Friendly Tickets)
- [ ] Add `UI.trackerExpanded` flag to `State.meta`; implement sticky tracker component and `renderTracker()`.
- [ ] Implement `Sprite` helper (RAF-based), plus `dogs/scout.png` and `dogs/patch.png` placeholders.
- [ ] Buy-Max (closed-form): compute max n such that sum(base * scale^k) ≤ treats.
- [ ] Milestones system: generic registry keyed by building id + thresholds; apply effects to `Game.mod`.
- [ ] Policy system scaffold (President layer): `State.politics = { votes, influence, taxRate, popularity, policies:{}, events:[] }` with tick effects.
- [ ] Space layer scaffold: `State.space = { routes:[], stardust:0 }`; simple route assignments that add TPS after travel time.
- [ ] Event system: timeboxed effects with start/end callbacks; basic UI feed in tracker.
- [ ] Achievements: registry + first 20 simple achievements; toast + small reward on unlock.
- [ ] Settings: volume slider + toggle animations/reduced motion.

---

## 8) Balancing Notes
- Early game: keep click meaningful via upgrades, crits, and small synergies.
- Mid game: milestone bursts every ~5–10m; policy choices create divergent builds.
- Late game: introduce new currency and interstellar routes to avoid pure number creep burnout.
- Prestige pacing: target first prestige ~15–30 minutes for new players.

---

## 9) Acceptance Criteria for Next PR
- Tracker bar implemented (collapsed/expanded) and persists between sessions.
- At least one animated sprite state appears in the tracker and Overview.
- Buy-Max closed-form wired for at least first 4 buildings.
- 6–10 basic achievements and toast UI present.
- README updated with tracker controls and sprite guidelines.

---

## 10) Notes for Artists / Audio (Optional)
- Pixel dogs: 32×32 or 48×48 frame size, strong silhouette, readable on dark UI.
- Tiny SFX: click, purchase, ascend; keep under -18 LUFS integrated; provide volume slider defaults low.

---

## 11) Stretch Ideas (Fun)
- Seasonal events (Howl-oween, Barksgiving): limited cosmetics and event currencies.
- Crossovers with fictional brands (e.g., “Celestial Kibble Co.”) for temporary policies.
- Photo mode: capture tracker bar with confetti for shareable “number go up” moments.

---

*End of doc — iterate freely. Woof.*
