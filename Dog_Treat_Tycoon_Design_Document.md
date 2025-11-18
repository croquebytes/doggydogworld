# Dog Treat Tycoon — Full Design Spec + LLM Implementation Guide

## Overview
A humorous idle/incremental web-native game where two dogs inherit a treat factory and scale their biscuit empire across galaxies. Inspired by Paperclips, Egg Inc., and Gnorp, the game balances pure idle progression with interactive systems (dispatch, minigames) and player-driven upgrades.

### Target Breakdown
- 70% Idle (auto production, upgrades, prestige)
- 20% Management (missions, crafting, strategic upgrades)
- 10% Minigames/Tap Actions (optional bursts, timing bonuses)

---

## Core Gameplay Loop
1. **Treats/sec (TPS)** via buildings.
2. Spend treats on upgrades and new systems.
3. Unlock more buildings, research, and systems over time.
4. Prestige into **Alpha Bones** (permanent global bonuses).
5. Expand into **Policy**, **Dispatch**, and **Space** systems.

---

## Mechanics & Systems

### ✅ Core Idle Progression
- Click to bake treats (manual +1 → +multipliers)
- Buy buildings that generate TPS (auto)
- Building cost: `baseCost * scale ^ owned` (scale 1.15–1.18)
- Total TPS = sum(buildingTPS × count × buildingMod × globalMod)
- Prestige: reset for **Alpha Bones** using `floor((log10(treats) - 6)^1.5)`

### ✅ Buy-Max (Closed Form)
```js
// Max buildings player can buy given cost growth
// totalCost = base * scale^owned * (scale^n - 1)/(scale - 1)
```

### 🚀 Prestige Layers
- **Alpha Bones**: permanent +10% global TPS per bone
- **Constellation Bones** (future): space-layer prestige currency

---

## Interactive Systems

### 🐾 Pack Dispatch (Midgame)
- Send 2–5 dogs on 3m–2h quests: Forage, Fight Cats, Convert Strays
- Dogs have traits (e.g. Nosey, Brave) → affect success rates
- Returns: Treats, Flavor Points, Relics, Reputation
- Traits + power determine success and loot

### 👩‍💼 Human Influencers (Marketing)
- Hire humans to run viral campaigns
- Gain **Clout** to spend on one-time buffs or audience multipliers
- Viral chance (1–5%) for short TPS spikes

### 🧪 Research (Tree Unlock)
- Use Flavor Points to unlock automation, synergy, quality tech
- Queued research (time-based 5m–2h)
- Each milestone (25/50/100 buildings) unlocks new nodes

### 🌌 Space Expansion (Late Game)
- Ship Treat Crates to Luna, Mars, Europa, etc.
- Routes have timers (1h–24h) and risk/reward
- Return **Stardust** → used in Constellation grid

### 🗳️ Policy / Presidency Layer
- Set Treat Tax (0–5%) → generates Policy Points (PP)
- PP spent on permanent perks (e.g., -5% costs, +10% TPS)
- Weekly Elections: player hits vote threshold → major bonus

---

## Visual / UX Features

### 🔻 Persistent Bottom Tracker Bar
- Sticks across screens, collapsible
- Shows: Treats, TPS, Bones, + tiny dog sprite
- Expand: top 5 production sources, events, click power

### 🐕 Sprite Animations
- Dogs (Scout, Patch) with states: idle, wag, blink, hop
- Used in tracker bar and Overview cards
- Sprite sheet format: row-per-state, consistent frames

### 🎯 Active Mini-Events (Optional)
- Every 10–20m, player sees 1 of 3 Event Cards
- E.g., “Squirrel Heist” → mini chase for rewards

---

## Retention Features
- Offline Progress (capped to 8–12h)
- Daily streak (5-day ladder → rerolls, multipliers)
- Weekly policy resets (Presidency system)
- Achievements: 20–50 tiers, tiny permanent bonuses

---

## To-Do: For LLM Implementation

### 🔨 Core Systems
- [ ] Buy-Max closed form function per building
- [ ] Prestige function: `floor((log10(treats) - 6)^1.5)`
- [ ] Milestone registry (buildingId, [25, 50, 100])

### 📊 UI/UX
- [ ] Tracker bar (collapsed + expanded UI)
- [ ] Sprite animation loader + frame tick manager
- [ ] Tooltip system for upgrades/buildings
- [ ] Event card draw & modal

### 📦 Systems to Build
- [ ] Pack Dispatch system (state, mission queue, dog traits)
- [ ] Influencer marketing loop (Clout, campaign cards)
- [ ] Research tree & queue (unlock by building count)
- [ ] Space routes (timer-driven stardust yield)
- [ ] Policy/Tax logic (Treat Tax → PP → upgrades)

### 📈 Meta & Data
- [ ] State.research, .dispatch, .space, .politics, .achievements
- [ ] Save/load all new systems with autosave
- [ ] Dynamic UI: hide tabs until unlocked

### 🔔 Retention
- [ ] Offline progress calculator (TPS × elapsed capped)
- [ ] Daily check-in bonuses + reward picker

---

## Design References
- Egg, Inc. — Dispatch system + layered currency
- Paperclips — Elegant exponential pacing
- Gnorp — Minimalist feel, evolving UI
- Adventure Communist — Policy/upgrade trees
- Realm Grinder — Deep prestige/research layers

---

## Stretch Systems (Future)
- Cosmetic dog skins (event-locked)
- “Dogfluencer” mini rhythm game (wag-to-the-beat)
- Cross-device cloud save
- Procedural relics with passive buffs
- Territory influence map (cats contest land)
- “New Game++” with trait inheritance across prestiges

---

*Ready to build. Toss this to an agent.*
