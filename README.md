# Dog Treat Tycoon - Idle Incremental (Prototype v0.1.0)

Two pups inherit a sleepy biscuit stand and turn it into a galaxy-class snack empire. This repo is a clean, documented baseline that human teammates and LLM agents can iterate on quickly.

## Features
- **Idle core loop** - click to bake treats, buy buildings for TPS, prestige for Alpha Bones.
- **Crit-click system** - 10% base chance for 3x critical bakes; build combos with rapid clicking (max 10x combo = +50% power).
- **Pack Dispatch & Missions** - send pups on timed quests for loot and reputation with visual progress bars.
- **Human Influencers & Clout** - launch campaigns with viral spikes and audience upgrades; real-time progress tracking.
- **Space Routes & Stardust** - ship treats to Luna, Mars, and beyond for late-game currency with mission timers.
- **Research Queue** - queue long-term breakthroughs with progress visualization.
- **Closed-form Buy Max and hotkeys** - Shift = x10, Ctrl/Cmd = x100, M repeats the last building, P ascends.
- **Sprite helper** - RAF-driven canvas sprites for Scout, Patch, and the tracker pup (hooks live in sprite.js + SpriteManager).
- **Achievements system** - 33 achievements with permanent buffs covering clicks, buildings, production, and prestige.
- **Rich upgrade tree** - 27 upgrades spanning all buildings from early-game clicks to late-game Dyson spheres.
- **Interactive tooltips** - hover over any building or upgrade for detailed stats, percentages, and scaling info.
- **Progress bars** - visual feedback for all timed activities (dispatch, research, space routes, marketing campaigns).
- **Autosave, import/export, offline progress** - everything persists in localStorage; manual save is one click from the tracker.

## Run
Open index.html in any modern browser. No build tools required.

## Project Structure
```
/assets/img/sprites   # drop pixel art atlases here
index.html
styles.css
sprite.js             # tiny sprite-sheet animator
main.js               # gameplay + UI
README.md
```

## Core Loop (Design Snapshot)
1. Generate Treats via clicking and building TPS.
2. Spend Treats on more buildings, unlock upgrades and research.
3. Trigger achievements, milestones, and events for tactical boosts.
4. Prestige (Pack Ascension) to convert late-game Treats into Alpha Bones (permanent +10% global each).
5. Repeat with faster ramps and new systems (policies, space routes, seasonal events, etc.).

### Current Economy Notes
- Building cost: `cost = baseCost * scale^owned`
- Building TPS: `baseTPS * buildingMod[id] * Game.mod.global`
- Prestige gain: `floor((log10(Treats) - 6)^1.5)`
- Tracker samples TPS six times per second for averages and future sparkline hooks.

## Controls & Hotkeys
- Click **Bake Treat** for manual gains (Scout hops):
  - 10% chance for critical bake (3x multiplier) - increases with combo
  - Rapid clicking (under 500ms between clicks) builds combo multiplier
  - Combo displayed on button in real-time (max 10x combo = +50% power)
  - Combo resets if you wait more than 500ms between clicks
- Buy buildings via buttons or hotkeys:
  - `1-8` buy the corresponding building (`Shift` = x10, `Ctrl/Cmd` = x100).
  - `M` repeats Buy Max on the last building selected.
  - `P` prompts Pack Ascension.
- Tracker footer buttons: quick Save / Export / Settings jump.
- Hover over buildings and upgrades for detailed tooltips with stats and percentages.

## Tracker & Event Feed
- **Collapsed**: Treats, TPS, Bones, animated pup.
- **Expanded**: Top producers, average TPS, recent events (saves, hires, imports, etc.).
- Expansion state persists via `State.meta.trackerExpanded`.

## Sprite Pipeline
- Place sprite atlases under `assets/img/sprites/` (for example `assets/img/sprites/dogs/scout.png`).
- Use uniform frame sizes (32x32 or 48x48). Rows = animation states, columns = frames.
- Declare states in `SpriteManager.mount` or provide a manifest for richer animations.
- Respect reduced motion: set `State.meta.reducedMotion` (future Settings slider) to freeze sprites.

## Agent Notes (LLM-Friendly)
- Gameplay state lives in the global `State` object; mutate through helper functions.
- `Game.mod` caches multipliers; call `freshModifiers()` after changing scaling rules.
- UI rendering is idempotent; keep `render()` light and compute heavy work elsewhere.
- Use `logEvent(...)` for anything the player should notice (tracker feed + future notifications).
- `Toasts.push(message, type)` for low-friction feedback (`success`, `error`, `info`).
- Metrics arrays are fixed-size (90 samples); reuse them for analytics or sparklines.

## Roadmap Hooks
- **Milestones system** - per-building thresholds with synergies and tracker callouts.
- **Policy layer** - presidential campaign meta with Votes, Influence, and Policy Points.
- **Space routes** - stardust shipping mini-optimizer for late game pacing.
- **Event cadence** - timed buffs/nerfs (Bulk Flour Deal, Health Inspection, Squirrel Heist).
- **Accessibility & Settings** - reduced motion toggle, volume slider, number-format preferences.

## Flavor Tidbits
- **Scout** - energetic clicker pup; crit-click streaks fit naturally.
- **Patch** - logistics-minded; loves automations, research, and milestone effects.
- Expect Squirrel Syndicate raids, Dogfluencer marketing spikes, and Treat Tax debates.

## License
MIT - remix freely. A quick shout-out is appreciated but never required.
