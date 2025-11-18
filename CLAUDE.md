# CLAUDE.md - AI Assistant Guide for Dog Treat Tycoon

## Project Overview

**Dog Treat Tycoon** is a browser-based idle/incremental game where two dogs (Scout and Patch) inherit a biscuit stand and scale it into a galaxy-spanning treat empire. The game is built with vanilla JavaScript (ES5-safe), HTML5, and CSS3 with no build tools or external dependencies.

**Version:** 0.1.0 (Prototype)
**Tech Stack:** Vanilla JS (ES5), HTML5 Canvas, CSS3, LocalStorage
**Target:** Modern browsers, mobile-friendly, no build required

### Core Game Loop
1. Generate Treats via clicking and building production (TPS)
2. Spend Treats on buildings, upgrades, and research
3. Unlock new systems (Dispatch, Marketing, Space, Policy)
4. Prestige (Pack Ascension) for Alpha Bones (permanent +10% global multiplier)
5. Repeat with exponential scaling

---

## Repository Structure

```
/
├── index.html              # Main HTML entry point, complete UI structure
├── main.js                 # Core game logic (~2079 lines)
├── sprite.js               # Sprite animation system (RAF-based)
├── styles.css              # All styling, pixel art aesthetic
├── README.md               # User-facing documentation
├── CLAUDE.md               # This file - AI assistant guide
├── Dog_Treat_Tycoon_Design_Document.md      # Full design spec
├── Dog_Treat_Tycoon_Summary_TODO.md         # Roadmap and TODO items
├── ISSUES_AND_FIXES.md                      # Bug tracking and solutions
├── PIXEL_ART_ASSET_LIST.md                  # Asset requirements and guidelines
├── PHASE1_SPRITE_PROMPTS.md                 # Sprite creation prompts
├── __snippet.txt           # Code snippets/scratchpad
└── assets/
    └── img/
        ├── dogs/           # Dog sprite sheets (scout, patch, etc.)
        ├── icons/          # 16x16 UI icons
        ├── buildings/      # 32x32 building sprites
        ├── banners/        # 800x80 progression banners
        ├── ui/             # UI decorations
        ├── effects/        # Particle effects
        └── sprites/        # Legacy sprite location
            └── README.md   # Sprite usage guide
```

---

## Code Architecture & Design Patterns

### File Organization

**index.html**
- Complete UI structure with all tabs and sections
- Semantic HTML with data attributes for event delegation
- Accessibility features (ARIA labels, roles)
- Persistent tracker bar (footer) and toast stack

**main.js** (Single file, ~2079 lines)
- Global error handler (line 1-3)
- Number formatting utilities (line 10-36)
- Game data constants (line 38-164)
- State management (line 166-227)
- Core game systems (modifiers, buildings, upgrades, etc.)
- Rendering functions (idempotent UI updates)
- Event handlers (resilient click delegation)
- Save/load system (LocalStorage)
- Game loop (RAF-driven, 60 FPS)

**sprite.js** (~139 lines)
- Self-contained Sprite class
- Frame-based animation with sprite sheets
- Supports: states, FPS, looping, completion callbacks
- Placeholder rendering when images fail to load
- No external dependencies

**styles.css**
- CSS custom properties for theming
- Dark mode pixel art aesthetic
- Responsive design (mobile-first)
- Toast positioning (top-right, top-center on mobile)
- Sticky tracker bar with expand/collapse

---

## Key Conventions & Patterns

### 1. ES5-Safe Code
**CRITICAL:** All code must be ES5-compatible for maximum browser support.

**Forbidden:**
- Arrow functions (`=>`)
- `let`/`const` (use `var` or avoid redeclaration)
- Template literals (use string concatenation)
- Optional chaining (`?.`)
- Nullish coalescing (`??`)
- Async/await
- Spread operator (`...`)
- Destructuring

**Allowed:**
- `var` declarations
- `function` keyword
- String concatenation with `+`
- Ternary operators
- Array methods: `map`, `filter`, `reduce`, `forEach`
- `Object.keys()`, `Object.values()`

**Example:**
```javascript
// ❌ WRONG (ES6+)
const multiplier = bonus?.value ?? 1;
const message = `Treats: ${treats}`;

// ✅ CORRECT (ES5)
var multiplier = bonus && bonus.value ? bonus.value : 1;
var message = "Treats: " + treats;
```

### 2. Global State Management

**The `State` Object** (line 166)
Single source of truth for all game state. Mutate directly or through helper functions.

```javascript
State = {
  treats: 0,                    // Current treats
  interns: 0,                   // Intern count
  buildings: {},                // Building counts by id
  upgradesBought: {},           // Purchased upgrades
  researchBought: {},           // Completed research
  prestige: { bones: 0 },       // Alpha Bones
  meta: {                       // Metadata
    lastSave: Date.now(),
    trackerExpanded: false,
    reducedMotion: false,
    clicks: 0,
    lifetimeTreats: 0,
    reputation: 0,
    bulkDiscountTimer: 0
  },
  metrics: {                    // TPS tracking
    samples: Array(90),
    deltaTreats: Array(90),
    index: 0
  },
  events: [],                   // Event feed
  achievements: {},             // Unlocked achievements
  milestones: {},               // Milestone tracking
  dispatch: {},                 // Pack dispatch system
  marketing: {},                // Influencer campaigns
  research: {},                 // Research queue
  space: {},                    // Space routes
  politics: {}                  // Policy system
}
```

**The `Game` Object** (line 255)
Runtime computed values and game configuration.

```javascript
Game = {
  mod: freshModifiers(),        // Cached multipliers
  tracker: {
    timer: 0,
    interval: 0.16              // 6 updates/sec
  },
  lastBuildingSelected: null,
  unlocks: {}                   // System unlock flags
}
```

### 3. Modifier System

**`freshModifiers()` function** (line 229)
Recomputes all multipliers from current game state. Call after any change to scaling rules.

```javascript
function freshModifiers() {
  var mod = { global: 1, click: 1 };
  // Initialize building mods
  for (var i = 0; i < DATA.buildings.length; i++) {
    mod[DATA.buildings[i][0]] = 1;
  }
  // Apply Alpha Bones
  mod.global *= 1 + (State.prestige.bones * 0.1);
  // Apply achievements, milestones, research, etc.
  applyAchievementRewards(mod);
  applyMilestoneRewards(mod);
  // ... more modifiers
  return mod;
}
```

**After modifying State:**
```javascript
State.prestige.bones += 5;
Game.mod = freshModifiers();  // MUST call to update cached mods
render();                      // Update UI
```

### 4. Event Delegation

**Resilient Click Handling** (ISSUES_AND_FIXES.md fix)
All buttons use event delegation with fallback to `getAttribute()` for cross-browser support.

```javascript
// Event handler pattern
document.addEventListener("click", function (e) {
  var target = e.target;

  // Walk up to find button
  while (target && target.tagName !== "BUTTON") {
    target = target.parentNode;
    if (!target || target === document.body) return;
  }

  // Get data attribute with fallback
  var buildingId = target.dataset.buy || target.getAttribute("data-buy");

  if (buildingId) {
    buyBuilding(buildingId, 1);
  }
});
```

**Data Attributes Used:**
- `data-tab`: Tab navigation
- `data-buy`: Buy building (1x)
- `data-buymax`: Buy max buildings
- `data-upgrade`: Purchase upgrade
- `data-research-queue`: Queue research
- `data-dispatch`: Send dispatch mission
- `data-campaign`: Launch marketing campaign
- `data-space`: Launch space route
- `data-policy`: Purchase policy perk
- `data-track-action`: Tracker bar actions

### 5. Rendering Pattern

**Idempotent Rendering**
All `render*()` functions can be called repeatedly without side effects.

```javascript
function renderBuildings() {
  var container = document.getElementById("buildingList");
  if (!container) return;

  container.innerHTML = DATA.buildings.map(function (b) {
    var id = b[0];
    var cost = buildingCost(id);
    var canBuy = State.treats >= cost;

    return '<div class="card">' +
      '<h3>' + b[1] + '</h3>' +
      '<div class="meta">Cost: ' + num.format(cost) + '</div>' +
      '<button data-buy="' + id + '" class="' + (canBuy ? 'buy' : 'locked') + '">' +
      (canBuy ? 'Buy' : 'Need ' + num.format(cost - State.treats)) +
      '</button>' +
      '</div>';
  }).join("");
}
```

**Performance:** Keep rendering light. Heavy computation should be cached or done in game loop.

### 6. Toast Notifications

**`Toasts.push(message, type, duration)`**
Low-friction user feedback.

```javascript
// Types: 'success', 'error', 'info', 'warning'
Toasts.push("Building purchased!", "success");
Toasts.push("Not enough treats!", "error", 2000);
```

**Location:** Top-right (desktop), top-center (mobile) to avoid content overlap.

### 7. Event Feed

**`logEvent(message, type)`**
Logs to tracker feed and future notification system.

```javascript
function logEvent(message, type) {
  type = type || "info";
  State.events.unshift({
    message: message,
    type: type,
    time: Date.now()
  });
  if (State.events.length > 50) State.events.length = 50;
  renderTrackerFeed();
}

// Usage
logEvent("Hired 10 interns!", "success");
logEvent("Space route to Luna completed", "info");
```

### 8. Number Formatting

**`num.format(n)` and `num.format2(n)`**
Consistent number display across UI.

```javascript
num.format(1234)        // "1.23K"
num.format(1234567)     // "1.235e6"
num.format2(12.345)     // "12.35" (more precision for small numbers)
```

### 9. Economy Formulas

**Building Cost:**
```javascript
function buildingCost(id, owned) {
  owned = owned !== undefined ? owned : State.buildings[id] || 0;
  var data = DATA.buildings.find(function(b) { return b[0] === id; });
  var base = data[2];
  var scale = data[4];
  return Math.floor(base * Math.pow(scale, owned));
}
```

**Building TPS:**
```javascript
function buildingTPS(id) {
  var data = DATA.buildings.find(function(b) { return b[0] === id; });
  var baseTPS = data[3];
  var count = State.buildings[id] || 0;
  var buildingMod = Game.mod[id] || 1;
  var globalMod = Game.mod.global || 1;
  return baseTPS * count * buildingMod * globalMod;
}
```

**Prestige Gain:**
```javascript
function prestigeGain() {
  if (State.treats < 1e6) return 0;
  var log = safeLog10(State.treats);
  return Math.floor(Math.pow(log - 6, 1.5));
}
```

**Safe Log10 (handles edge cases):**
```javascript
function safeLog10(n) {
  if (n <= 0) return 0;
  return Math.log(n) / Math.LN10;
}
```

---

## Development Workflows

### Adding a New Building

1. **Add to `DATA.buildings` array** (line 45)
```javascript
// [id, name, baseCost, baseTPS, costScale]
["newBuilding", "Building Name", 1000, 50, 1.15]
```

2. **Initialize in `createEmptyBuildings()`** (auto-generated from DATA)

3. **Add modifier to `freshModifiers()`** (line 229)
```javascript
for (var i = 0; i < DATA.buildings.length; i++) {
  mod[DATA.buildings[i][0]] = 1;
}
```

4. **Create upgrade (optional)**
```javascript
DATA.upgrades.push([
  "newBuilding1",
  "Upgrade Name",
  "Building +100% TPS",
  5000,
  {type: "owned", id: "newBuilding", amt: 5},
  function(g) { g.mod.newBuilding *= 2; }
]);
```

5. **Add milestones (optional)** (line 107)
```javascript
MILESTONES.newBuilding = [25, 50, 100];
```

6. **Add icon assets**
   - `assets/img/icons/icon-newBuilding.png` (16x16)
   - `assets/img/buildings/building-newBuilding.png` (32x32)

7. **Test:** Verify cost scaling, TPS calculation, and rendering

### Adding an Upgrade

1. **Add to `DATA.upgrades` array** (line 55)
```javascript
[
  "upgradeId",                  // Unique ID
  "Upgrade Name",               // Display name
  "Description of effect",      // Tooltip text
  500,                          // Cost in treats
  {type: "treats", amt: 250},   // Unlock condition
  function(g) {                 // Effect function
    g.mod.global *= 1.5;        // Modify Game.mod
  }
]
```

**Unlock Types:**
- `{type: "treats", amt: 1000}` - Requires X treats earned
- `{type: "owned", id: "plot", amt: 10}` - Requires 10 Farm Plots
- `{type: "bones", amt: 5}` - Requires 5 Alpha Bones

2. **Rendering is automatic** - `renderUpgrades()` handles display

3. **Purchase handled by** `buyUpgrade(id)` function

### Adding a New System Tab

1. **Add tab button** in `index.html` (line 37)
```html
<button data-tab="newsystem">New System</button>
```

2. **Add tab section** in `index.html`
```html
<section id="newsystem" class="tab">
  <h2>New System</h2>
  <p>Description...</p>
  <div id="newsystemContent"></div>
</section>
```

3. **Add state to `State` object** (line 166)
```javascript
State.newsystem = {
  currency: 0,
  active: [],
  unlocks: {}
};
```

4. **Add unlock flag** to `Game.unlocks` (line 262)
```javascript
Game.unlocks.newsystem = false;
```

5. **Add unlock condition** in game loop or event
```javascript
if (State.treats >= 10000 && !Game.unlocks.newsystem) {
  Game.unlocks.newsystem = true;
  showTab("newsystem");
  logEvent("New System unlocked!", "success");
}
```

6. **Create render function**
```javascript
function renderNewSystem() {
  var container = document.getElementById("newsystemContent");
  if (!container) return;
  container.innerHTML = "...";
}
```

7. **Add to main `render()` call**
```javascript
function render() {
  // ... existing renders
  if (Game.unlocks.newsystem) renderNewSystem();
}
```

### Adding an Achievement

1. **Add to `ACHIEVEMENTS` array** (line 85)
```javascript
{
  id: "achievement_id",
  name: "Achievement Name",
  reward: "+5% global production",
  check: function() {
    return State.buildings.plot >= 25;  // Condition
  },
  effect: function(mod) {
    mod.global *= 1.05;  // Permanent bonus
  }
}
```

2. **Achievement checking** happens in `checkAchievements()` (called in game loop)

3. **Unlocking** triggers toast and applies effect via `freshModifiers()`

### Creating a Sprite Animation

1. **Prepare sprite sheet** (see PIXEL_ART_ASSET_LIST.md)
   - Rows = animation states
   - Columns = frames
   - Consistent frame size (32x32 or 48x48)

2. **Place in assets**
```
assets/img/dogs/dogname-idle.png
assets/img/dogs/dogname-wag.png
```

3. **Mount sprite** in `SpriteManager.init()` or later
```javascript
SpriteManager.mount("canvasElementId", {
  id: "dogname",
  autoBlink: true,
  wagThreshold: 10  // Wag when treats change > 10
});
```

4. **Sprite states** defined in `SpriteManager.createPlaceholderSheet()` or custom
```javascript
states: {
  idle: { row: 0, frames: 4, fps: 3, loop: true },
  wag: { row: 1, frames: 6, fps: 6, loop: true },
  blink: { row: 2, frames: 2, fps: 4, loop: false, next: "idle" },
  hop: { row: 3, frames: 4, fps: 8, loop: false, once: true, next: "idle" }
}
```

5. **Play animation**
```javascript
var sprite = SpriteManager.sprites["canvasElementId"];
sprite.play("hop", { reset: true });
```

### Save/Load System

**Autosave:** Every 30 seconds via `setInterval(saveGame, 30000)`

**Manual Save:**
```javascript
function saveGame() {
  try {
    var saveData = {
      version: DATA.version,
      state: State,
      game: { unlocks: Game.unlocks }
    };
    localStorage.setItem("dogTreatTycoon", JSON.stringify(saveData));
    logEvent("Game saved.", "success");
  } catch (e) {
    Toasts.push("Save failed!", "error");
  }
}
```

**Load:**
```javascript
function loadGame() {
  try {
    var raw = localStorage.getItem("dogTreatTycoon");
    if (!raw) return false;
    var data = JSON.parse(raw);

    // Merge loaded state
    Object.assign(State, data.state);
    Object.assign(Game.unlocks, data.game.unlocks);

    // Recalculate
    Game.mod = freshModifiers();

    // Handle offline progress
    var elapsed = (Date.now() - State.meta.lastSave) / 1000;
    if (elapsed > 5) {
      applyOfflineProgress(elapsed);
    }

    return true;
  } catch (e) {
    return false;
  }
}
```

**Export/Import:** JSON string in `<textarea>` for manual backup

---

## UI/UX Guidelines

### Design Philosophy
- **Pixel art aesthetic** - Low-res, nostalgic, warm
- **Dark theme** - Easy on eyes for long sessions
- **Mobile-first** - Touch-friendly targets, responsive layout
- **Accessibility** - ARIA labels, keyboard navigation, reduced motion support

### Color Palette (from styles.css)
```css
--bg-dark: #0f0f12;
--bg-mid: #17171b;
--bg-card: #1f1f27;
--accent-orange: #ffb74d;
--accent-blue: #5ec8f2;
--text-light: #eeeeef;
--text-muted: #b3b3bd;
--success: #8bc34a;
--danger: #ff6b6b;
--warning: #ffb74d;
```

### Typography
- **Body:** System fonts (default browser stack)
- **Monospace numbers:** For consistent alignment
- **Sizes:** 14-16px base, 12px meta, 18-24px headings

### Spacing
- **Cards:** 16px padding, 8px gap
- **Buttons:** 40px min height for touch
- **Grid:** CSS Grid with auto-fill, min 200px columns

### Button States
```css
.buy        /* Can afford - orange */
.locked     /* Cannot afford - gray */
.danger     /* Destructive action - red */
.primary    /* Main action - orange */
.secondary  /* Alternative - blue */
.ghost      /* Subtle - transparent */
```

### Tracker Bar
- **Collapsed:** Treats, TPS, Bones, sprite
- **Expanded:** Top producers, average TPS, event feed, quick actions
- **Position:** Sticky footer, always visible
- **Toggle:** Click banner or toggle button

### Toasts
- **Position:** Top-right (desktop), top-center (mobile)
- **Duration:** 3.2s default
- **Stack:** Max 5 visible, auto-dismiss oldest
- **Types:** success (green), error (red), info (blue), warning (orange)

### Tabs
- **Navigation:** Button row, highlight active
- **Content:** Single section visible, `display: none` others
- **Unlocking:** Hide tabs until system unlocks (e.g., Prestige at 1M treats)

---

## Performance Considerations

### Game Loop
**60 FPS target** with RAF (requestAnimationFrame)

```javascript
var lastTime = 0;
function gameLoop(currentTime) {
  var dt = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (dt > 0.1) dt = 0.1;  // Cap delta to prevent jumps

  tick(dt);  // Update game state

  requestAnimationFrame(gameLoop);
}
```

### Optimization Tips
1. **Cache expensive calculations** in `Game.mod`
2. **Throttle UI updates** - Tracker updates 6x/sec, not 60x/sec
3. **Lazy rendering** - Only render visible tab
4. **Avoid DOM thrashing** - Batch reads, then batch writes
5. **Use `innerHTML` for bulk updates** - Faster than individual DOM manipulations
6. **Fixed-size arrays** for metrics (ring buffer pattern)

### Metrics Tracking
```javascript
State.metrics = {
  samples: Array(90).fill(0),      // Last 90 TPS samples
  deltaTreats: Array(90).fill(0),  // Treat deltas
  index: 0                         // Ring buffer index
};

// Update in game loop
function updateMetrics(dt) {
  var idx = State.metrics.index;
  State.metrics.samples[idx] = totalTPS();
  State.metrics.deltaTreats[idx] = State.treats - (lastTreats || 0);
  State.metrics.index = (idx + 1) % 90;
  lastTreats = State.treats;
}
```

### Reduced Motion
```javascript
if (State.meta.reducedMotion) {
  // Skip sprite updates
  // Disable transitions
  // Instant state changes
}
```

---

## Testing & Quality Assurance

### Manual Testing Checklist

**Core Loop:**
- [ ] Click to bake treats increments correctly
- [ ] Building purchase deducts treats and increments count
- [ ] TPS calculation accurate (check formula)
- [ ] Buildings render with correct cost/count
- [ ] Buy Max calculates correct quantity
- [ ] Hotkeys work (1-8, M, P, Shift, Ctrl/Cmd)

**Systems:**
- [ ] Upgrades unlock at correct thresholds
- [ ] Upgrades apply modifiers correctly
- [ ] Research queues and completes
- [ ] Prestige calculates correct Alpha Bones
- [ ] Prestige resets correct values (keeps bones, research, achievements)
- [ ] Dispatch missions complete and grant rewards
- [ ] Marketing campaigns boost TPS
- [ ] Space routes grant Stardust
- [ ] Policy perks apply correctly

**UI/UX:**
- [ ] All tabs switch correctly
- [ ] Tracker expands/collapses
- [ ] Toasts appear and dismiss
- [ ] Event feed updates
- [ ] Tooltips show (future feature)
- [ ] Mobile responsive layout
- [ ] Touch targets large enough (40px min)

**Persistence:**
- [ ] Autosave works (check every 30s)
- [ ] Manual save stores state
- [ ] Export produces JSON
- [ ] Import restores state
- [ ] Hard reset clears localStorage
- [ ] Offline progress calculates correctly

**Edge Cases:**
- [ ] Buying with exactly enough treats
- [ ] Buying with insufficient treats (error state)
- [ ] Prestige before 1M treats (should be 0 bones)
- [ ] Very large numbers format correctly (e.g., 1e308)
- [ ] Division by zero handled (e.g., safeLog10)
- [ ] Missing images show placeholders
- [ ] Corrupted save data doesn't crash game

### Common Bugs (see ISSUES_AND_FIXES.md)

**Button clicks not working:**
- **Cause:** Event delegation not finding dataset
- **Fix:** Walk up to `<button>` and use `getAttribute()` fallback

**Toast overlap:**
- **Cause:** Center positioning covered content
- **Fix:** Moved to top-right (top-center mobile)

**Prestige not resetting:**
- **Cause:** Missing state properties in reset function
- **Fix:** Ensure all State sections reset except bones, achievements, research

**Hard reset not working:**
- **Cause:** Runtime error before `bindUI()`
- **Fix:** Global error handler + resilient click delegation

---

## Git Workflow

### Branch Strategy
- **main:** Stable releases only
- **claude/*:** Feature branches created by AI assistants
- Current working branch: `claude/claude-md-mi4spks4ppmz2us5-015xzFQimQE9bUcrqk4Vg1T6`

### Commit Message Guidelines
```
Add feature: Brief description

- Bullet points for details
- What changed and why
- Any breaking changes

Refs: #issue_number (if applicable)
```

**Examples:**
```
Add Buy Max closed-form calculation

- Implements geometric series formula for instant max purchase
- Adds buyMax(id) function with cost validation
- Wires M hotkey to repeat last building Buy Max

Improves UX by removing spam-clicking for large purchases
```

```
Fix: Button click delegation on mobile browsers

- Walk up DOM to find button element
- Fallback to getAttribute() for data attributes
- Applies to all systems: buildings, upgrades, research, etc.

Refs: ISSUES_AND_FIXES.md
```

### Commit Best Practices
1. **Small, focused commits** - One logical change per commit
2. **Test before committing** - Verify game still runs
3. **Update docs** - Keep README, CLAUDE.md in sync with code
4. **Lint check (future)** - Run linter before commit
5. **No secrets** - Don't commit API keys, credentials

### Push Protocol
```bash
# Always push to claude/* branch
git push -u origin claude/claude-md-mi4spks4ppmz2us5-015xzFQimQE9bUcrqk4Vg1T6

# On network failures, retry with exponential backoff
# 2s, 4s, 8s, 16s (up to 4 retries)
```

### Pull Request Guidelines
1. **Title:** Clear, concise feature description
2. **Description:**
   - Summary of changes
   - Why the change was needed
   - Testing performed
   - Screenshots (if UI changes)
3. **Link issues** - Close relevant issue numbers
4. **Request review** - Tag maintainers

---

## Common Patterns & Recipes

### Pattern: Adding a Timed Event

```javascript
// 1. Add to State
State.events.timedBuff = {
  active: false,
  timeRemaining: 0,
  multiplier: 1.5
};

// 2. Start event
function startTimedBuff(duration) {
  State.events.timedBuff.active = true;
  State.events.timedBuff.timeRemaining = duration;
  Game.mod = freshModifiers();
  logEvent("Timed buff activated!", "success");
}

// 3. Update in game loop
function tick(dt) {
  if (State.events.timedBuff.active) {
    State.events.timedBuff.timeRemaining -= dt;
    if (State.events.timedBuff.timeRemaining <= 0) {
      State.events.timedBuff.active = false;
      Game.mod = freshModifiers();
      logEvent("Timed buff expired.", "info");
    }
  }
}

// 4. Apply in freshModifiers()
if (State.events.timedBuff.active) {
  mod.global *= State.events.timedBuff.multiplier;
}
```

### Pattern: Milestone System

```javascript
// 1. Define milestones
MILESTONES.plot = [25, 50, 100];

// 2. Check and unlock
function checkMilestones() {
  for (var id in MILESTONES) {
    var thresholds = MILESTONES[id];
    var owned = State.buildings[id] || 0;

    for (var i = 0; i < thresholds.length; i++) {
      var tier = thresholds[i];
      var key = id + "_" + tier;

      if (owned >= tier && !State.milestones[key]) {
        State.milestones[key] = true;
        unlockMilestone(id, tier);
      }
    }
  }
}

// 3. Apply rewards
function applyMilestoneRewards(mod) {
  // Example: Each plot milestone adds 5% to ovens
  var plotMilestones = Object.keys(State.milestones)
    .filter(function(k) { return k.startsWith("plot_"); })
    .length;

  mod.oven *= 1 + (plotMilestones * 0.05);
}
```

### Pattern: Buy Max (Closed Form)

```javascript
function buyMax(buildingId) {
  var data = DATA.buildings.find(function(b) { return b[0] === buildingId; });
  if (!data) return;

  var base = data[2];
  var scale = data[4];
  var owned = State.buildings[buildingId] || 0;
  var treats = State.treats;

  // Geometric series: cost = base * scale^n * (scale^qty - 1) / (scale - 1)
  // Solve for max qty where total cost <= treats

  var maxQty = 0;
  var currentCost = base * Math.pow(scale, owned);

  while (currentCost <= treats) {
    var totalCost = currentCost * (Math.pow(scale, maxQty + 1) - 1) / (scale - 1);
    if (totalCost > treats) break;
    maxQty++;
    currentCost = base * Math.pow(scale, owned + maxQty);
  }

  if (maxQty > 0) {
    buyBuilding(buildingId, maxQty);
  } else {
    Toasts.push("Cannot afford any more!", "error");
  }
}
```

### Pattern: Offline Progress

```javascript
function applyOfflineProgress(elapsedSeconds) {
  var maxOffline = 12 * 60 * 60;  // 12 hours cap
  var capped = Math.min(elapsedSeconds, maxOffline);

  var tps = totalTPS();
  var offlineTreats = tps * capped;

  State.treats += offlineTreats;
  State.meta.lifetimeTreats += offlineTreats;

  var hours = (capped / 3600).toFixed(1);
  logEvent("Offline for " + hours + "h. Earned " + num.format(offlineTreats) + " treats!", "success");
  Toasts.push("Welcome back! +" + num.format(offlineTreats) + " treats", "success", 5000);
}
```

---

## Roadmap & Future Features

### Immediate TODO (from Dog_Treat_Tycoon_Summary_TODO.md)
- [ ] Milestones system (25/50/100 thresholds per building)
- [ ] Crit-click system with streak meter
- [ ] Achievement toasts when unlocked
- [ ] Settings: volume slider, reduced motion toggle
- [ ] Sound FX (click, purchase, ascend)

### Mid-term Systems
- [ ] Pack Dispatch (timed missions, dog traits, reputation)
- [ ] Human Influencers (clout, campaigns, viral spikes)
- [ ] Research tree (flavor points, queued research)
- [ ] Space routes (Luna, Mars, Europa - stardust currency)
- [ ] Policy layer (treat tax, policy points, perks)

### Long-term Vision
- [ ] Constellation Bones (second prestige layer)
- [ ] Seasonal events (Halloween, Thanksgiving)
- [ ] Cosmetic dog skins
- [ ] Cross-device cloud save
- [ ] Procedural relics with passive buffs
- [ ] Territory influence map (cat conflicts)
- [ ] "New Game++" with trait inheritance

### Stretch Goals
- [ ] Mini rhythm game ("Dogfluencer" wag-to-beat)
- [ ] Photo mode with shareable screenshots
- [ ] Procedural event deck
- [ ] Modding API for community content

---

## Helpful Resources

### External Documentation
- **Design Spec:** `Dog_Treat_Tycoon_Design_Document.md`
- **TODO List:** `Dog_Treat_Tycoon_Summary_TODO.md`
- **Bug Tracker:** `ISSUES_AND_FIXES.md`
- **Asset Guide:** `PIXEL_ART_ASSET_LIST.md`
- **Sprite Prompts:** `PHASE1_SPRITE_PROMPTS.md`

### Inspirational Games
- **Cookie Clicker** - Idle mechanics, upgrade trees
- **Egg, Inc.** - Dispatch missions, layered currencies
- **Universal Paperclips** - Elegant pacing, prestige layers
- **Gnorp Apologue** - Minimalist feel, evolving UI
- **Adventure Communist** - Policy trees, event systems
- **Realm Grinder** - Deep research, prestige mechanics

### Key Functions Reference

**Economy:**
- `buildingCost(id, owned)` - Calculate cost for next building
- `buildingTPS(id)` - Calculate TPS for a building type
- `totalTPS()` - Sum all building TPS
- `prestigeGain()` - Calculate Alpha Bones from current treats

**State Management:**
- `freshModifiers()` - Recompute all multipliers
- `saveGame()` - Save to localStorage
- `loadGame()` - Load from localStorage
- `resetGame()` - Hard reset (clear all data)

**UI:**
- `render()` - Master render function (all tabs)
- `renderBuildings()` - Update building list
- `renderUpgrades()` - Update upgrade list
- `renderTracker()` - Update tracker bar
- `switchTab(tabId)` - Change active tab

**User Feedback:**
- `Toasts.push(msg, type, duration)` - Show toast notification
- `logEvent(msg, type)` - Add to event feed

**Sprites:**
- `SpriteManager.init()` - Initialize sprite system
- `SpriteManager.mount(elementId, options)` - Create sprite
- `sprite.play(state, options)` - Play animation state

---

## Tips for AI Assistants

### Before Starting Work
1. **Read recent ISSUES_AND_FIXES.md** - Avoid reintroducing bugs
2. **Check Dog_Treat_Tycoon_Summary_TODO.md** - Understand priorities
3. **Review recent commits** - Understand what changed
4. **Load game in browser** - See current state visually

### During Development
1. **Test incrementally** - After each change, refresh browser
2. **Use browser console** - Check for JS errors
3. **Verify State object** - `console.log(State)` to debug
4. **Check modifiers** - `console.log(Game.mod)` after changes
5. **Monitor performance** - Watch frame rate in DevTools

### Code Quality Checklist
- [ ] ES5-safe (no arrow functions, const, let, template literals)
- [ ] Event delegation with fallback (`getAttribute()`)
- [ ] Idempotent rendering (safe to call multiple times)
- [ ] Numbers formatted via `num.format()` or `num.format2()`
- [ ] User feedback via Toasts or logEvent
- [ ] State changes trigger `Game.mod = freshModifiers()`
- [ ] Heavy computation cached or throttled
- [ ] Mobile-friendly (40px+ touch targets)
- [ ] Accessible (ARIA labels where needed)

### Common Mistakes to Avoid
- ❌ Using ES6+ syntax (breaks in older browsers)
- ❌ Mutating State without updating `Game.mod`
- ❌ Direct `dataset` access without fallback (mobile Safari issues)
- ❌ Forgetting to call `render()` after state changes
- ❌ Creating new elements every render (use `innerHTML` for bulk)
- ❌ Toast spam (one toast per action, not per frame)
- ❌ Breaking save format (always migrate old saves)
- ❌ Hardcoding values (use DATA constants)

### When Stuck
1. **Check browser console** - Look for errors
2. **Inspect State object** - `JSON.stringify(State, null, 2)`
3. **Verify modifiers** - `console.table(Game.mod)`
4. **Test in isolation** - Create minimal reproduction
5. **Review similar code** - Find existing pattern to follow
6. **Ask for clarification** - Better to ask than assume

### Communication
- **Be specific** - "Updated buildingTPS() to include milestone bonuses"
- **Show code** - Include snippets in commit messages
- **Explain why** - Not just what changed, but why
- **Report blockers** - If something is unclear, ask
- **Suggest improvements** - If you see a better pattern, propose it

---

## FAQ

### Q: Why ES5 instead of modern JavaScript?
**A:** Maximum browser compatibility, including older mobile browsers and embedded webviews. No build step required.

### Q: Why no framework (React, Vue, etc.)?
**A:** Keep dependencies zero, load fast, easy for anyone to understand and modify. Vanilla JS is sufficient for this scope.

### Q: How do I add a new currency?
**A:**
1. Add to `State` (e.g., `State.newCurrency = 0`)
2. Add UI display in relevant tab
3. Add logic to earn/spend in game loop
4. Add to save/load system
5. Add number formatting via `num.format()`

### Q: How do I test locally?
**A:** Open `index.html` in any modern browser. No server needed (though file:// protocol has localStorage in some browsers).

### Q: Can I use a local dev server?
**A:** Yes! `python3 -m http.server 8000` or `npx http-server` work great.

### Q: How do I debug State issues?
**A:**
```javascript
// In browser console
JSON.stringify(State, null, 2)  // Pretty print state
console.table(Game.mod)         // View modifiers as table
localStorage.getItem("dogTreatTycoon")  // View raw save
```

### Q: What if I break the save format?
**A:** Add migration logic in `loadGame()`:
```javascript
if (data.version === "0.1.0" && !data.state.newFeature) {
  data.state.newFeature = { /* defaults */ };
}
```

### Q: How do I reset my save while testing?
**A:**
```javascript
localStorage.removeItem("dogTreatTycoon");
location.reload();
```

---

## Version History

**v0.1.0** (Current)
- Core idle loop (click, buildings, TPS)
- Prestige system (Alpha Bones)
- Upgrades and Research
- Tracker bar (collapsed/expanded)
- Sprite animation system
- Achievements (18 basic)
- Dispatch, Marketing, Space, Policy (scaffolds)
- Save/load/export/import
- Offline progress
- Mobile responsive
- Toast notifications
- Event feed

**Future Versions:**
- v0.2.0: Milestones, crit-clicks, sound FX
- v0.3.0: Full Dispatch and Marketing systems
- v0.4.0: Space routes and Stardust
- v0.5.0: Policy layer and treat tax
- v1.0.0: All systems complete, balanced, polished

---

## Contact & Contribution

**Issues:** Report bugs in `ISSUES_AND_FIXES.md`
**Roadmap:** Feature requests in `Dog_Treat_Tycoon_Summary_TODO.md`
**License:** MIT - Remix freely, attribution appreciated

---

**Last Updated:** 2025-11-18
**For:** AI Assistants working on Dog Treat Tycoon

---

*Good luck building! Remember: keep it simple, test often, and have fun. Woof!* 🐕✨
