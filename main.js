window.addEventListener('error', function (e) {
  try { Toasts.push('Error: ' + (e && e.message ? e.message : 'Unknown'), 'error'); } catch (_) {}
});
/* Dog Treat Tycoon - v0.1.0
*/

/* ================================
   NUMBER FORMATTING
==================================*/
const num = {
  format(n) {
    if (!isFinite(n)) return "Infinity";
    if (Math.abs(n) < 1000) return n.toFixed(0);
    const e = Math.floor(safeLog10(Math.abs(n)));
    if (e < 6) {
      const suffixes = ["", "K", "M", "B", "T"];
      const idx = Math.floor(e / 3);
      return (n / Math.pow(10, idx * 3)).toFixed(2) + suffixes[idx];
    }
    const mant = n / Math.pow(10, e);
    return mant.toFixed(3) + "e" + e;
  },
  format2(n) {
    if (!isFinite(n)) return "Infinity";
    if (Math.abs(n) < 1) return n.toFixed(3);
    if (Math.abs(n) < 1000) return n.toFixed(2);
    const e = Math.floor(safeLog10(Math.abs(n)));
    if (e < 6) {
      const suffixes = ["", "K", "M", "B", "T"];
      const idx = Math.floor(e / 3);
      return (n / Math.pow(10, idx * 3)).toFixed(2) + suffixes[idx];
    }
    const mant = n / Math.pow(10, e);
    return mant.toFixed(3) + "e" + e;
  }
};

/* ================================
   GAME DATA
==================================*/
const DATA = {
  version: "0.1.0",
  baseClick: 1,
  internCost: 75,
  buildings: [
    ["plot", "Farm Plot", 15, 0.15, 1.14],
    ["oven", "Pup Oven", 85, 1.2, 1.145],
    ["line", "Treat Line", 650, 10, 1.15],
    ["truck", "Delivery Truck", 5000, 60, 1.15],
    ["robot", "Robo-Barker", 45000, 400, 1.15],
    ["lab", "Flavor Lab", 5.0e5, 2500, 1.15],
    ["launch", "Space Kennel", 6.0e6, 14000, 1.16],
    ["dyson", "Biscuit Dyson", 7.5e7, 75000, 1.17],
  ],
  upgrades: [
    ["click1", "Buttery Batter", "Clicks +100%", 100, {type: "treats", amt: 50}, g => g.mod.click *= 2],
    ["click2", "Golden Spatula", "Clicks +150%", 500, {type: "treats", amt: 250}, g => g.mod.click *= 2.5],
    ["plot1", "Mulch Magic", "Farm Plots +100% TPS", 250, {type: "owned", id: "plot", amt: 5}, g => g.mod.plot *= 2],
    ["plot2", "Organic Soil", "Farm Plots +100% TPS", 1000, {type: "owned", id: "plot", amt: 15}, g => g.mod.plot *= 2],
    ["oven1", "Convection Craze", "Ovens +100% TPS", 1200, {type: "owned", id: "oven", amt: 5}, g => g.mod.oven *= 2],
    ["oven2", "Industrial Heating", "Ovens +150% TPS", 5000, {type: "owned", id: "oven", amt: 15}, g => g.mod.oven *= 2.5],
    ["line1", "Assembly Automation", "Treat Lines +100% TPS", 8000, {type: "owned", id: "line", amt: 5}, g => g.mod.line *= 2],
    ["global1", "Pupper Pride", "All production +50%", 7500, {type: "treats", amt: 5000}, g => g.mod.global *= 1.5],
    ["global2", "Pack Synergy", "All production +75%", 25000, {type: "treats", amt: 15000}, g => g.mod.global *= 1.75],
    ["truck1", "Express Delivery", "Trucks +100% TPS", 40000, {type: "owned", id: "truck", amt: 5}, g => g.mod.truck *= 2],
    ["click3", "Diamond Whisker", "Clicks +200%", 75000, {type: "treats", amt: 50000}, g => g.mod.click *= 3],
    ["line2", "Precision Engineering", "Treat Lines +150% TPS", 100000, {type: "owned", id: "line", amt: 15}, g => g.mod.line *= 2.5],
    ["truck2", "Hyper Delivery", "Trucks +150% TPS", 150000, {type: "owned", id: "truck", amt: 15}, g => g.mod.truck *= 2.5],
    ["robot1", "AI Barking", "Robo-Barkers +100% TPS", 200000, {type: "owned", id: "robot", amt: 5}, g => g.mod.robot *= 2],
    ["robot2", "Neural Networks", "Robo-Barkers +150% TPS", 500000, {type: "owned", id: "robot", amt: 15}, g => g.mod.robot *= 2.5],
    ["lab1", "Molecular Mastery", "Flavor Labs +100% TPS", 1000000, {type: "owned", id: "lab", amt: 3}, g => g.mod.lab *= 2],
    ["lab2", "Quantum Flavor", "Flavor Labs +200% TPS", 5000000, {type: "owned", id: "lab", amt: 10}, g => g.mod.lab *= 3],
    ["global3", "Brand Recognition", "All production +100%", 500000, {type: "treats", amt: 250000}, g => g.mod.global *= 2],
    ["global4", "Treat Empire", "All production +150%", 2000000, {type: "treats", amt: 1000000}, g => g.mod.global *= 2.5],
    ["click4", "Master's Touch", "Clicks +300%", 1000000, {type: "treats", amt: 500000}, g => g.mod.click *= 4],
    ["launch1", "Orbital Boosters", "Space Kennels +100% TPS", 10000000, {type: "owned", id: "launch", amt: 2}, g => g.mod.launch *= 2],
    ["launch2", "Warp Drive", "Space Kennels +200% TPS", 50000000, {type: "owned", id: "launch", amt: 5}, g => g.mod.launch *= 3],
    ["dyson1", "Solar Arrays", "Biscuit Dysons +100% TPS", 100000000, {type: "owned", id: "dyson", amt: 1}, g => g.mod.dyson *= 2],
    ["dyson2", "Stellar Harvesting", "Biscuit Dysons +300% TPS", 1000000000, {type: "owned", id: "dyson", amt: 3}, g => g.mod.dyson *= 4],
  ],
  research: [
    ["res1", "Quality Control", "All buildings +25%", 5e4, g => g.mod.global *= 1.25],
    ["res2", "Granulated Dark Matter", "Space-tier +100%", 2e6, g => { g.mod.launch *= 2; g.mod.dyson *= 2; }],
  ],
};

/* ================================
   GAME STATE
==================================*/
function createEmptyBuildings() {
  const obj = {};
  for (let i = 0; i < DATA.buildings.length; i++) {
    const id = DATA.buildings[i][0];
    obj[id] = 0;
  }
  return obj;
}

const ACHIEVEMENTS = [
  { id: "first_click", name: "First Crumbs", reward: "+5% click power", check: function () { return State.meta.clicks >= 1; }, effect: function (mod) { mod.click *= 1.05; } },
  { id: "hundred_clicks", name: "Click Master", reward: "+5% click power", check: function () { return State.meta.clicks >= 100; }, effect: function (mod) { mod.click *= 1.05; } },
  { id: "first_building", name: "Rising Dough", reward: "+2% global production", check: function () { return Object.values(State.buildings).some(function (v) { return v >= 1; }); }, effect: function (mod) { mod.global *= 1.02; } },
  { id: "ten_buildings", name: "Factory Floor", reward: "+3% global production", check: function () { return Object.values(State.buildings).reduce(function(sum, v) { return sum + v; }, 0) >= 10; }, effect: function (mod) { mod.global *= 1.03; } },
  { id: "fifty_buildings", name: "Industrial Complex", reward: "+5% global production", check: function () { return Object.values(State.buildings).reduce(function(sum, v) { return sum + v; }, 0) >= 50; }, effect: function (mod) { mod.global *= 1.05; } },
  { id: "ten_plots", name: "Plot Twist", reward: "+5% Farm Plot output", check: function () { return State.buildings.plot >= 10; }, effect: function (mod) { mod.plot *= 1.05; } },
  { id: "ten_ovens", name: "Bake Sale", reward: "+5% Oven output", check: function () { return State.buildings.oven >= 10; }, effect: function (mod) { mod.oven *= 1.05; } },
  { id: "hundred_treats", name: "Treat Flood", reward: "+3% global production", check: function () { return State.meta.lifetimeTreats >= 1000; }, effect: function (mod) { mod.global *= 1.03; } },
  { id: "million_treats", name: "Treat Tycoon", reward: "+5% global production", check: function () { return State.meta.lifetimeTreats >= 1e6; }, effect: function (mod) { mod.global *= 1.05; } },
  { id: "tps_10", name: "Steady Stream", reward: "+2% global production", check: function () { return totalTPS() >= 10; }, effect: function (mod) { mod.global *= 1.02; } },
  { id: "tps_100", name: "Production Line", reward: "+3% global production", check: function () { return totalTPS() >= 100; }, effect: function (mod) { mod.global *= 1.03; } },
  { id: "tps_1000", name: "Mass Production", reward: "+5% global production", check: function () { return totalTPS() >= 1000; }, effect: function (mod) { mod.global *= 1.05; } },
  { id: "first_intern", name: "Pup HR", reward: "+5% click power", check: function () { return State.interns >= 1; }, effect: function (mod) { mod.click *= 1.05; } },
  { id: "first_upgrade", name: "Researcher", reward: "+2% global production", check: function () { return Object.keys(State.upgradesBought).length >= 1; }, effect: function (mod) { mod.global *= 1.02; } },
  { id: "five_upgrades", name: "Tech Tree", reward: "+3% global production", check: function () { return Object.keys(State.upgradesBought).length >= 5; }, effect: function (mod) { mod.global *= 1.03; } },
  { id: "research_first", name: "Lab Notes", reward: "+3% global production", check: function () { return Object.keys(State.researchBought).length >= 1; }, effect: function (mod) { mod.global *= 1.03; } },
  { id: "prestige_first", name: "Alpha Initiate", reward: "+5% global production", check: function () { return State.prestige.bones >= 1; }, effect: function (mod) { mod.global *= 1.05; } },
  { id: "prestige_five", name: "Pack Leader", reward: "+5% global production", check: function () { return State.prestige.bones >= 5; }, effect: function (mod) { mod.global *= 1.05; } },
  { id: "space_pup", name: "Space Pup", reward: "+10% Space Kennel power", check: function () { return State.buildings.launch >= 1; }, effect: function (mod) { mod.launch *= 1.1; } },
  { id: "first_crit", name: "Golden Bake", reward: "+10% crit chance", check: function () { return (State.meta.critClicks || 0) >= 1; }, effect: function (mod) { mod.click *= 1.05; } },
  { id: "crit_master", name: "Master Baker", reward: "+5% click power", check: function () { return (State.meta.critClicks || 0) >= 50; }, effect: function (mod) { mod.click *= 1.05; } },
  { id: "combo_five", name: "Rapid Fire", reward: "+5% click power", check: function () { return (State.meta.clickCombo || 0) >= 5; }, effect: function (mod) { mod.click *= 1.05; } },
  { id: "thousand_clicks", name: "Clicking Legend", reward: "+10% click power", check: function () { return State.meta.clicks >= 1000; }, effect: function (mod) { mod.click *= 1.1; } },
  { id: "hundred_buildings", name: "Mega Factory", reward: "+8% global production", check: function () { return Object.values(State.buildings).reduce(function(sum, v) { return sum + v; }, 0) >= 100; }, effect: function (mod) { mod.global *= 1.08; } },
  { id: "ten_interns", name: "HR Department", reward: "+10% click power", check: function () { return State.interns >= 10; }, effect: function (mod) { mod.click *= 1.1; } },
  { id: "ten_lines", name: "Assembly King", reward: "+10% Treat Line output", check: function () { return State.buildings.line >= 10; }, effect: function (mod) { mod.line *= 1.1; } },
  { id: "ten_trucks", name: "Logistics Pro", reward: "+10% Truck output", check: function () { return State.buildings.truck >= 10; }, effect: function (mod) { mod.truck *= 1.1; } },
  { id: "five_robots", name: "Automation Expert", reward: "+10% Robo-Barker output", check: function () { return State.buildings.robot >= 5; }, effect: function (mod) { mod.robot *= 1.1; } },
  { id: "five_labs", name: "Science Pup", reward: "+15% Flavor Lab output", check: function () { return State.buildings.lab >= 5; }, effect: function (mod) { mod.lab *= 1.15; } },
  { id: "billion_treats", name: "Treat Billionaire", reward: "+10% global production", check: function () { return State.meta.lifetimeTreats >= 1e9; }, effect: function (mod) { mod.global *= 1.1; } },
  { id: "tps_10000", name: "Industrial Revolution", reward: "+8% global production", check: function () { return totalTPS() >= 10000; }, effect: function (mod) { mod.global *= 1.08; } },
  { id: "ten_upgrades", name: "Tech Savvy", reward: "+5% global production", check: function () { return Object.keys(State.upgradesBought).length >= 10; }, effect: function (mod) { mod.global *= 1.05; } },
  { id: "prestige_ten", name: "Alpha Elite", reward: "+10% global production", check: function () { return State.prestige.bones >= 10; }, effect: function (mod) { mod.global *= 1.1; } },
  { id: "prestige_twenty", name: "Omega Leader", reward: "+15% global production", check: function () { return State.prestige.bones >= 20; }, effect: function (mod) { mod.global *= 1.15; } },
];

const MILESTONES = {
  plot: [25, 50, 100],
  oven: [25, 50, 100],
  line: [25, 50, 100],
  truck: [10, 25, 50],
  robot: [5, 15, 30],
  lab: [5, 15, 25],
  launch: [3, 10, 20],
  dyson: [1, 5, 15],
};

const DISPATCH_MISSIONS = [
  { id: "forage", name: "Moonlight Forage", duration: 180, reward: { treats: 150, reputation: 2 }, risk: 0.05, description: "Sniff out rare truffles for treat infusion." },
  { id: "scout", name: "Scout the Cats", duration: 420, reward: { treats: 600, relic: 1, reputation: 4 }, risk: 0.15, description: "Gather intel on the rival cat syndicate." },
  { id: "convert", name: "Convert Strays", duration: 600, reward: { treats: 900, flavor: 6, reputation: 6 }, risk: 0.2, description: "Recruit new paws to the pack." }
];

const MARKETING_CAMPAIGNS = [
  { id: "short_form", name: "Short-form Reels", cost: 0, duration: 120, multiplier: 1.5, viralChance: 0.05, viralMultiplier: 4 },
  { id: "livestream", name: "Pup Livestream", cost: 15, duration: 240, multiplier: 2, viralChance: 0.07, viralMultiplier: 5 },
  { id: "docu", name: "Docu-Series", cost: 30, duration: 420, multiplier: 2.5, viralChance: 0.1, viralMultiplier: 6 }
];

const RESEARCH_PROJECTS = [
  { id: "auto1", name: "Auto Mixer Arms", desc: "+5% all TPS", time: 180, unlock: function(){ return State.buildings.oven >= 10; }, effect: function(){ State.research.permanent.auto1 = true; } },
  { id: "flavor1", name: "Flavor Extraction", desc: "+10% Flavor Lab output", time: 420, unlock: function(){ return State.buildings.lab >= 5; }, effect: function(){ State.research.permanent.flavor1 = true; } },
  { id: "dispatch1", name: "Pack Logistics", desc: "+1 active dispatch slot", time: 300, unlock: function(){ return State.meta.reputation >= 10; }, effect: function(){ State.dispatch.slots += 1; } },
  { id: "marketing1", name: "Audience Targeting", desc: "+1 campaign option", time: 360, unlock: function(){ return State.marketing.clout >= 10; }, effect: function(){ State.marketing.unlocks.marketing1 = true; } },
  { id: "space1", name: "Orbital Launch Pads", desc: "+1 space route slot", time: 540, unlock: function(){ return State.space.stardust >= 10; }, effect: function(){ State.space.slots += 1; } }
];

const SPACE_ROUTES = [
  { id: "luna", name: "Luna Shuttle", duration: 900, risk: 0.05, reward: { stardust: 3, treats: 800 } },
  { id: "mars", name: "Mars Freighter", duration: 1800, risk: 0.12, reward: { stardust: 8, treats: 2200 } },
  { id: "europa", name: "Europa Ice Run", duration: 2700, risk: 0.18, reward: { stardust: 15, treats: 4200 } }
];

const POLICY_PERKS = [
  { id: "subsidy", name: "Small Biz Subsidies", cost: 50, desc: "-5% building costs", apply: function(){ State.politics.perks.subsidy = true; } },
  { id: "space_act", name: "Space Treat Act", cost: 80, desc: "+10% space-tier TPS", apply: function(){ State.politics.perks.space_act = true; } },
  { id: "healthcare", name: "Pet Healthcare", cost: 120, desc: "+5% global TPS", apply: function(){ State.politics.perks.healthcare = true; } }
];

const EVENT_DECK = [
  { id: "squirrel", title: "Squirrel Heist!", desc: "A rogue squirrel crew raids the pantry.", choices: [
    { label: "Chase Them!", effect: function(){ State.treats = Math.max(0, State.treats - 200); logEvent("Lost 200 treats but secured future safety.", "warning"); } },
    { label: "Offer Peace Treats", effect: function(){ State.treats = Math.max(0, State.treats - 100); State.meta.reputation += 2; logEvent("Gained 2 reputation with woodland allies.", "success"); } },
    { label: "Ignore", effect: function(){ logEvent("The squirrels nibble a few treats but scamper off.", "info"); } }
  ]},
  { id: "supply", title: "Bulk Flour Deal", desc: "Supplier offers a discount for a limited time.", choices: [
    { label: "Buy In (50 treats)", effect: function(){ if (State.treats >= 50) { State.treats -= 50; State.meta.bulkDiscountTimer = 300; logEvent("Cost reduced for 5 minutes!", "success"); } else { logEvent("Not enough treats!", "error"); } } },
    { label: "Decline", effect: function(){ logEvent("Passed on the flour deal.", "info"); } }
  ]},
  { id: "viral", title: "Random Viral Pup!", desc: "A cute blooper video is trending.", choices: [
    { label: "Ride the Trend", effect: function(){ startViralBoost(3, 120); logEvent("Viral multiplier engaged!", "success"); } },
    { label: "Stay Humble", effect: function(){ logEvent("Ignored the buzz.", "info"); } }
  ]}
];

const State = {
  treats: 0,
  interns: 0,
  buildings: createEmptyBuildings(),
  upgradesBought: {},
  researchBought: {},
  prestige: {
    bones: 0,
    constellationBones: 0,
    totalPrestiges: 0,
  },
  meta: {
    lastSave: Date.now(),
    trackerExpanded: false,
    reducedMotion: false,
    clicks: 0,
    lifetimeTreats: 0,
    reputation: 0,
    bulkDiscountTimer: 0,
    clickCombo: 0,
    lastClickTime: 0,
    critClicks: 0,
  },
  metrics: {
    samples: Array(90).fill(0),
    deltaTreats: Array(90).fill(0),
    index: 0,
  },
  events: [],
  achievements: {},
  milestones: {},
  dispatch: {
    dogs: [
      { id: "scout", name: "Scout", trait: "Nosey", power: 6 },
      { id: "patch", name: "Patch", trait: "Brave", power: 7 },
      { id: "radar", name: "Radar", trait: "Swift", power: 5 },
    ],
    slots: 2,
    active: [],
    reputation: 0,
  },
  marketing: {
    clout: 0,
    active: null,
    cooldown: 0,
    audienceBonus: 0,
    unlocks: {},
  },
  research: {
    active: null,
    queue: [],
    permanent: {},
    paused: false,
  },
  space: {
    stardust: 0,
    slots: 2,
    active: [],
  },
  politics: {
    taxRate: 0,
    policyPoints: 0,
    votes: 0,
    support: 100,
    perks: {},
  }
};

function freshModifiers() {
  const mod = { global: 1, click: 1 };
  for (const [id] of DATA.buildings) mod[id] = 1;
  mod.global *= 1 + (State.prestige.bones * 0.1);
  mod.global *= Math.pow(1.25, State.prestige.constellationBones || 0);
  applyAchievementRewards(mod);
  applyMilestoneRewards(mod);
  if (State.research.permanent.auto1) mod.global *= 1.05;
  if (State.research.permanent.flavor1) mod.lab *= 1.1;
  if (State.marketing.active && State.marketing.active.timeRemaining > 0) {
    mod.global *= State.marketing.active.multiplier || 1;
    if (State.marketing.active.viralRemaining > 0) {
      mod.global *= State.marketing.active.viralMultiplier || 1;
    }
  }
  if (State.marketing.viral && State.marketing.viral.timeRemaining > 0) {
    mod.global *= State.marketing.viral.multiplier;
  }
  if (State.politics.perks.healthcare) mod.global *= 1.05;
  if (State.politics.perks.subsidy) State.meta.activeDiscount = true;
  if (State.politics.perks.space_act) {
    mod.launch *= 1.1;
    mod.dyson *= 1.05;
  }

  // Building Synergies: Downstream buildings buff upstream
  const synergies = [
    { from: "oven", to: "plot", bonus: 0.005 },      // Each Oven: +0.5% to Plots
    { from: "line", to: "oven", bonus: 0.005 },      // Each Line: +0.5% to Ovens
    { from: "truck", to: "line", bonus: 0.01 },      // Each Truck: +1% to Lines
    { from: "robot", to: "truck", bonus: 0.01 },     // Each Robot: +1% to Trucks
    { from: "lab", to: "robot", bonus: 0.015 },      // Each Lab: +1.5% to Robots
    { from: "launch", to: "lab", bonus: 0.02 },      // Each Launch: +2% to Labs
    { from: "dyson", to: "launch", bonus: 0.025 },   // Each Dyson: +2.5% to Launches
  ];

  synergies.forEach(function(syn) {
    const count = State.buildings[syn.from] || 0;
    if (count > 0) {
      mod[syn.to] *= 1 + (count * syn.bonus);
    }
  });

  return mod;
}

const Game = {
  mod: freshModifiers(),
  tracker: {
    timer: 0,
    interval: 0.16, // ~6 updates/sec
  },
  lastBuildingSelected: null,
  unlocks: {
    upgrades: false,
    research: false,
    prestige: false,
    dispatch: false,
    marketing: false,
    space: false,
    policy: false
  }
};

const Tracker = {
  lastTPS: 0,
  lastTreatDelta: 0,
};

/* ================================
   TOASTS
==================================*/
const Toasts = {
  push(message, type = "info", duration = 3200) {
    const stack = document.getElementById("toastStack");
    if (!stack) return;
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    stack.appendChild(toast);
    setTimeout(() => this.dismiss(toast), duration);
  },
  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add("fade");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 220);
  }
};

/* ================================
   SPRITES
==================================*/
const SpriteManager = {
  sprites: {},
  reduced: false,
  sheet: null,
  init() {
    if (typeof Sprite === "undefined") return;
    this.reduced = !!State.meta.reducedMotion;
    this.sheet = this.createPlaceholderSheet();
    this.mount("trackerDog", { id: "tracker", autoBlink: true, wagThreshold: 1 });
    this.mount("heroScoutSprite", { id: "scout", autoBlink: true });
    this.mount("heroPatchSprite", { id: "patch", autoBlink: true });
  },
  createPlaceholderSheet() {
    const size = 32;
    const rows = 4;
    const cols = 6;
    const canvas = document.createElement("canvas");
    canvas.width = size * cols;
    canvas.height = size * rows;
    const ctx = canvas.getContext("2d");
    const palettes = [
      ["#202436", "#5ec8f8"],
      ["#202436", "#ffb74d"],
      ["#202436", "#8bc34a"],
      ["#202436", "#ff6b6b"],
    ];
    for (let row = 0; row < rows; row++) {
      const [base, accent] = palettes[row];
      const frames = row === 1 ? 6 : row === 2 ? 2 : 4;
      for (let col = 0; col < frames; col++) {
        const x = col * size;
        const y = row * size;
        ctx.fillStyle = base;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = accent;
        const bounce = row === 3 ? Math.sin((col / frames) * Math.PI) ** 2 * 6 : 0;
        ctx.fillRect(x + 8, y + 10 - bounce, 16, 16);
        ctx.fillStyle = "#fff";
        ctx.fillRect(x + 12, y + 12 - bounce, 4, 4);
        ctx.fillRect(x + 16, y + 12 - bounce, 4, 4);
      }
    }
    const img = new Image();
    img.src = canvas.toDataURL();
    return img;
  },
  mount(elementId, { id = elementId, autoBlink = false, wagThreshold = 1 } = {}) {
    const canvas = document.getElementById(elementId);
    if (!canvas || typeof Sprite === "undefined") return;
    const ctx = canvas.getContext("2d");
    const sprite = new Sprite({
      image: this.sheet,
      frameWidth: 32,
      frameHeight: 32,
      scale: 2,
      states: {
        idle: { row: 0, frames: 4, fps: 4, loop: true },
        wag: { row: 1, frames: 6, fps: 10, loop: false, next: "idle" },
        blink: { row: 2, frames: 2, fps: 8, loop: false, next: "idle" },
        hop: { row: 3, frames: 4, fps: 12, loop: false, next: "idle" },
      },
      initialState: "idle",
    });
    this.sprites[id] = {
      canvas,
      ctx,
      sprite,
      blinkTimer: autoBlink ? 2 + Math.random() * 4 : null,
      wagThreshold,
      wagCooldown: 0,
      autoBlink,
    };
    sprite.draw(ctx, 0, 0, sprite.scale);
  },
  update(dt) {
    Object.values(this.sprites).forEach(entry => {
      if (!entry) return;
      const { sprite, ctx, autoBlink } = entry;
      if (this.reduced) {
        if (sprite.current !== "idle") sprite.play("idle", { reset: true });
        sprite.draw(ctx, 0, 0, sprite.scale);
        return;
      }
      if (autoBlink && entry.blinkTimer !== null) {
        entry.blinkTimer -= dt;
        if (entry.blinkTimer <= 0) {
          sprite.play("blink", { loop: false, reset: true });
          entry.blinkTimer = 2 + Math.random() * 4;
        }
      }
      if (entry.wagCooldown > 0) entry.wagCooldown = Math.max(0, entry.wagCooldown - dt);
      sprite.update(dt);
      sprite.draw(ctx, 0, 0, sprite.scale);
    });
  },
  trigger(id, state) {
    if (this.reduced) return;
    const entry = this.sprites[id];
    if (!entry) return;
    entry.sprite.play(state, { loop: false, reset: true });
    if (state === "wag") entry.wagCooldown = 2;
  },
  registerTreatGain(delta) {
    const tracker = this.sprites.tracker;
    if (!tracker || this.reduced) return;
    if (delta < tracker.wagThreshold || tracker.wagCooldown > 0) return;
    tracker.sprite.play("wag", { loop: false, reset: true });
    tracker.wagCooldown = 2.5;
  },
  setReducedMotion(flag) {
    this.reduced = flag;
    if (flag) {
      Object.values(this.sprites).forEach(entry => {
        if (!entry) return;
        entry.sprite.play("idle", { reset: true });
        entry.sprite.draw(entry.ctx, 0, 0, entry.sprite.scale);
      });
    }
  }
};

/* ================================
   HELPERS
==================================*/
function getBuildingDef(id) {
  return DATA.buildings.find(b => b[0] === id);
}

function buildingCost(id, owned) {
  const def = getBuildingDef(id);
  if (!def) return Infinity;
  const [ , , base, , scale ] = def;
  let cost = base * Math.pow(scale, owned);
  let discount = 1;
  if (State.meta.bulkDiscountTimer > 0) discount *= 0.9;
  if (State.politics.perks.subsidy) discount *= 0.95;
  return Math.ceil(cost * discount);
}

function buildingTPS(id) {
  const def = getBuildingDef(id);
  if (!def) return 0;
  return def[3] * Game.mod[id] * Game.mod.global;
}

function internTPS() {
  return State.interns * 0.25 * Game.mod.click * Game.mod.global;
}

function getBuildingSynergies(buildingId) {
  const synergies = [
    { from: "oven", to: "plot", bonus: 0.005 },
    { from: "line", to: "oven", bonus: 0.005 },
    { from: "truck", to: "line", bonus: 0.01 },
    { from: "robot", to: "truck", bonus: 0.01 },
    { from: "lab", to: "robot", bonus: 0.015 },
    { from: "launch", to: "lab", bonus: 0.02 },
    { from: "dyson", to: "launch", bonus: 0.025 },
  ];

  const inbound = synergies.filter(function(s) { return s.to === buildingId; });
  const outbound = synergies.filter(function(s) { return s.from === buildingId; });

  return { inbound: inbound, outbound: outbound };
}

function totalTPS() {
  const buildingTotal = DATA.buildings.reduce((sum, [id]) => sum + State.buildings[id] * buildingTPS(id), 0);
  const internTotal = internTPS();
  return buildingTotal + internTotal;
}

function safeLog10(value) {
  if (value <= 0) return -Infinity;
  return Math.log(value) / Math.LN10;
}

function bonesGainIfAscend(treats) {
  const val = Math.max(0, safeLog10(Math.max(1, treats)) - 6);
  return Math.floor(Math.pow(val, 1.5));
}

function buildingBulkCost(def, owned, qty, collectPrices = false) {
  if (qty <= 0) return { cost: 0, prices: [], nextScalePow: Math.pow(def[4], owned) };
  const base = def[2];
  const scale = def[4];
  let scalePow = Math.pow(scale, owned);
  let cost = 0;
  const prices = collectPrices ? [] : null;
  for (let i = 0; i < qty; i++) {
    const price = Math.ceil(base * scalePow);
    cost += price;
    if (prices) prices.push(price);
    scalePow *= scale;
  }
  return { cost, prices, nextScalePow: scalePow };
}

function maxAffordableQuantity(def, owned, budget) {
  if (budget <= 0) return 0;
  const base = def[2];
  const scale = def[4];
  const firstCost = Math.ceil(base * Math.pow(scale, owned));
  if (budget < firstCost) return 0;
  if (scale === 1) return Math.floor(budget / firstCost);
  const numerator = budget * (scale - 1);
  const denominator = base * Math.pow(scale, owned);
  const raw = Math.log(1 + numerator / denominator) / Math.log(scale);
  if (!isFinite(raw) || raw <= 0) return 0;
  return Math.max(1, Math.floor(raw));
}

function canAfford(cost) { return State.treats >= cost; }
function spend(cost) { State.treats -= cost; }

function ensureMilestoneEntry(id) {
  if (!State.milestones[id]) State.milestones[id] = [];
  return State.milestones[id];
}

function checkBuildingMilestones(id) {
  const def = getBuildingDef(id);
  if (!def || !MILESTONES[id]) return;
  const milestones = ensureMilestoneEntry(id);
  const owned = State.buildings[id];
  let updated = false;
  for (let i = 0; i < MILESTONES[id].length; i++) {
    const threshold = MILESTONES[id][i];
    if (owned >= threshold && milestones.indexOf(threshold) === -1) {
      milestones.push(threshold);
      logEvent(`${def[1]} milestone reached (${threshold})!`, "success");
      Toasts.push(`Milestone: ${def[1]} ${threshold}`, "success");
      updated = true;
    }
  }
  if (updated) Game.mod = freshModifiers();
}

function totalDogPower() {
  return (State.dispatch.dogs || []).reduce(function (sum, dog) {
    return sum + (dog.power || 0);
  }, 0);
}

function startDispatchMission(missionId) {
  const mission = DISPATCH_MISSIONS.find(function (m) { return m.id === missionId; });
  if (!mission) return;
  if (State.dispatch.active.length >= State.dispatch.slots) {
    Toasts.push("No open dispatch slots.", "error");
    return;
  }
  const power = totalDogPower();
  const entry = {
    id: "dispatch_" + Date.now(),
    mission: mission.id,
    name: mission.name,
    remaining: mission.duration,
    duration: mission.duration,
    reward: mission.reward,
    risk: mission.risk,
    power: power,
  };
  State.dispatch.active.push(entry);
  logEvent(`Mission started: ${mission.name}`, "info");
}

function updateDispatch(dt) {
  if (!State.dispatch.active.length) return;
  const completed = [];
  for (let i = 0; i < State.dispatch.active.length; i++) {
    const entry = State.dispatch.active[i];
    entry.remaining -= dt;
    if (entry.remaining <= 0) {
      completed.push(entry);
    }
  }
  if (!completed.length) return;
  completed.forEach(function (entry) {
    const mission = DISPATCH_MISSIONS.find(function (m) { return m.id === entry.mission; });
    const successChance = Math.min(0.95, 1 - entry.risk + entry.power * 0.01);
    const success = Math.random() < successChance;
    if (success) {
      if (entry.reward.treats) State.treats += entry.reward.treats;
      if (entry.reward.reputation) {
        State.meta.reputation += entry.reward.reputation;
        State.dispatch.reputation += entry.reward.reputation;
      }
      if (entry.reward.relic) State.marketing.clout += entry.reward.relic;
      if (entry.reward.flavor) State.research.permanent.flavorPoints = (State.research.permanent.flavorPoints || 0) + entry.reward.flavor;
      logEvent(`Mission success: ${entry.name}`, "success");
      Toasts.push(`Dispatch returned: ${entry.name}`, "success");
    } else {
      logEvent(`Mission failed: ${entry.name}`, "error");
      Toasts.push(`Dispatch failed (${entry.name})`, "error");
    }
  });
  State.dispatch.active = State.dispatch.active.filter(function (entry) {
    return completed.indexOf(entry) === -1;
  });
}

function availableCampaigns() {
  return MARKETING_CAMPAIGNS.filter(function (campaign) {
    if (campaign.id === "docu" && !State.marketing.unlocks.marketing1) return false;
    return true;
  });
}

function startCampaignById(id) {
  if (State.marketing.active && State.marketing.active.timeRemaining > 0) {
    Toasts.push("Campaign already running.", "error");
    return;
  }
  if (State.marketing.cooldown > 0) {
    Toasts.push("Campaign team resting.", "error");
    return;
  }
  const campaign = MARKETING_CAMPAIGNS.find(function (c) { return c.id === id; });
  if (!campaign) return;
  if (State.marketing.clout < campaign.cost) {
    Toasts.push("Not enough clout.", "error");
    return;
  }
  State.marketing.clout -= campaign.cost;
  const viral = Math.random() < (campaign.viralChance + (State.marketing.audienceBonus || 0));
  State.marketing.active = {
    id: campaign.id,
    name: campaign.name,
    multiplier: campaign.multiplier + (State.marketing.audienceBonus || 0),
    viralMultiplier: viral ? campaign.viralMultiplier : 1,
    viralRemaining: viral ? campaign.duration : 0,
    timeRemaining: campaign.duration,
  };
  State.marketing.cooldown = campaign.duration / 2;
  if (viral) {
    logEvent(`Campaign went viral! (${campaign.name})`, "success");
  } else {
    logEvent(`Campaign launched: ${campaign.name}`, "info");
  }
  Game.mod = freshModifiers();
}

function startViralBoost(multiplier, duration) {
  State.marketing.viral = { multiplier: multiplier, timeRemaining: duration };
  Game.mod = freshModifiers();
}

function updateMarketing(dt) {
  if (State.marketing.cooldown > 0) {
    State.marketing.cooldown = Math.max(0, State.marketing.cooldown - dt);
  }
  if (State.marketing.active) {
    const hadViral = State.marketing.active.viralRemaining > 0;
    State.marketing.active.timeRemaining -= dt;
    if (State.marketing.active.viralRemaining > 0) {
      State.marketing.active.viralRemaining = Math.max(0, State.marketing.active.viralRemaining - dt);
      if (hadViral && State.marketing.active.viralRemaining === 0) {
        Game.mod = freshModifiers();
      }
    }
    if (State.marketing.active.timeRemaining <= 0) {
      logEvent(`Campaign concluded: ${State.marketing.active.name}`, "info");
      State.marketing.active = null;
      Game.mod = freshModifiers();
    }
  }
  if (State.marketing.viral) {
    State.marketing.viral.timeRemaining -= dt;
    if (State.marketing.viral.timeRemaining <= 0) {
      State.marketing.viral = null;
      Game.mod = freshModifiers();
    }
  }
}

function queueResearch(id) {
  if (State.research.queue.some(function (item) { return item.id === id; }) ||
      (State.research.active && State.research.active.id === id)) {
    Toasts.push("Research already queued.", "error");
    return;
  }
  const project = RESEARCH_PROJECTS.find(function (p) { return p.id === id; });
  if (!project) return;
  if (project.unlock && !project.unlock()) {
    Toasts.push("Requirement not met.", "error");
    return;
  }
  State.research.queue.push({
    id: project.id,
    name: project.name,
    desc: project.desc,
    remaining: project.time,
    time: project.time,
  });
  logEvent(`Queued research: ${project.name}`, "info");
  if (!State.research.active) startNextResearch();
}

function startNextResearch() {
  if (State.research.active || State.research.paused) return;
  const next = State.research.queue.shift();
  if (!next) return;
  State.research.active = next;
}

function updateResearch(dt) {
  if (State.research.paused) return;
  if (!State.research.active) {
    startNextResearch();
    return;
  }
  State.research.active.remaining -= dt;
  if (State.research.active.remaining <= 0) {
    const project = RESEARCH_PROJECTS.find(function (p) { return p.id === State.research.active.id; });
    if (project && typeof project.effect === "function") {
      project.effect();
      State.research.permanent[project.id] = true;
      logEvent(`Research complete: ${project.name}`, "success");
      Toasts.push(`Research unlocked: ${project.name}`, "success");
      Game.mod = freshModifiers();
    }
    State.research.active = null;
    startNextResearch();
  }
}

function startSpaceRoute(id) {
  const route = SPACE_ROUTES.find(function (r) { return r.id === id; });
  if (!route) return;
  if (State.space.active.length >= State.space.slots) {
    Toasts.push("All launch pads busy.", "error");
    return;
  }
  State.space.active.push({
    id: "route_" + Date.now(),
    routeId: route.id,
    name: route.name,
    remaining: route.duration,
    duration: route.duration,
    reward: route.reward,
    risk: route.risk,
  });
  logEvent(`Route launched: ${route.name}`, "info");
}

function updateSpace(dt) {
  if (!State.space.active.length) return;
  const completed = [];
  State.space.active.forEach(function (entry) {
    entry.remaining -= dt;
    if (entry.remaining <= 0) completed.push(entry);
  });
  if (!completed.length) return;
  completed.forEach(function (entry) {
    const route = SPACE_ROUTES.find(function (r) { return r.id === entry.routeId; });
    const successChance = Math.max(0.6, 1 - entry.risk);
    const success = Math.random() < successChance;
    if (success) {
      if (entry.reward.treats) State.treats += entry.reward.treats;
      if (entry.reward.stardust) State.space.stardust += entry.reward.stardust;
      logEvent(`Route completed: ${entry.name}`, "success");
      Toasts.push(`Return cargo from ${entry.name}`, "success");
    } else {
      logEvent(`Route failed: ${entry.name}`, "error");
      Toasts.push(`Route failed (${entry.name})`, "error");
    }
  });
  State.space.active = State.space.active.filter(function (entry) {
    return completed.indexOf(entry) === -1;
  });
}

function updatePolicy(treatDelta, dt) {
  const taxRate = State.politics.taxRate || 0;
  if (taxRate <= 0) {
    State.politics.support = Math.min(100, (State.politics.support || 0) + dt * 0.05);
    return 0;
  }
  const taxFraction = taxRate / 100;
  const taxedAmount = treatDelta * taxFraction;
  if (taxedAmount <= 0) return 0;
  State.politics.policyPoints += taxedAmount;
  State.politics.votes += taxedAmount * 0.2;
  State.politics.support = Math.max(40, (State.politics.support || 0) - taxRate * dt * 0.001);
  return taxedAmount;
}


function purchasePolicyPerk(id) {
  const perk = POLICY_PERKS.find(function (p) { return p.id === id; });
  if (!perk) return;
  if (State.politics.perks[id]) {
    Toasts.push("Policy already enacted.", "error");
    return;
  }
  if (State.politics.policyPoints < perk.cost) {
    Toasts.push("Not enough policy points.", "error");
    return;
  }
  State.politics.policyPoints -= perk.cost;
  State.politics.perks[id] = true;
  if (typeof perk.apply === "function") perk.apply();
  logEvent(`Policy enacted: ${perk.name}`, "success");
  Toasts.push(`Policy enacted: ${perk.name}`, "success");
  Game.mod = freshModifiers();
}

function updateEvents(dt) {
  State.meta.eventTimer -= dt;
  if (State.meta.eventTimer > 0) return;
  State.meta.eventTimer = 480 + Math.random() * 240;
  presentEventCard();
}

function presentEventCard() {
  if (State.meta.activeEvent) return;
  const deck = EVENT_DECK.slice();
  const card = deck[Math.floor(Math.random() * deck.length)];
  if (!card) return;
  State.meta.activeEvent = card;
  renderEventModal(card);
}

function resolveEventChoice(effect) {
  if (typeof effect === "function") effect();
  State.meta.activeEvent = null;
  hideEventModal();
}
function logEvent(msg, type = "info") {
  const time = new Date().toLocaleTimeString();
  State.events.push({ msg, type, time });
  if (State.events.length > 30) State.events.shift();
}

function applyAchievementRewards(mod) {
  for (const ach of ACHIEVEMENTS) {
    if (State.achievements[ach.id] && typeof ach.effect === "function") {
      ach.effect(mod);
    }
  }
}

function unlockAchievement(ach) {
  State.achievements[ach.id] = true;
  Game.mod = freshModifiers();
  const rewardText = ach.reward ? ` - ${ach.reward}` : "";
  logEvent(`Achievement unlocked: ${ach.name}${rewardText}`, "success");
  Toasts.push(`Achievement: ${ach.name}${rewardText}`, "success");
}

function checkUnlocks() {
  const totalBuildings = Object.values(State.buildings).reduce(function(sum, val) { return sum + val; }, 0);
  const bones = State.prestige.bones;
  let newUnlock = false;

  if (!Game.unlocks.upgrades && totalBuildings >= 1) {
    Game.unlocks.upgrades = true;
    newUnlock = true;
    logEvent("Upgrades unlocked!", "success");
    Toasts.push("New Tab Unlocked: Upgrades", "success");
  }

  if (!Game.unlocks.prestige && State.treats >= 1e6) {
    Game.unlocks.prestige = true;
    newUnlock = true;
    logEvent("Pack Ascension unlocked!", "success");
    Toasts.push("New Tab Unlocked: Prestige", "success");
  }

  if (!Game.unlocks.research && (totalBuildings >= 10 || bones >= 1)) {
    Game.unlocks.research = true;
    newUnlock = true;
    logEvent("Research unlocked!", "success");
    Toasts.push("New Tab Unlocked: Research", "success");
  }

  if (!Game.unlocks.dispatch && bones >= 1) {
    Game.unlocks.dispatch = true;
    newUnlock = true;
    logEvent("Pack Dispatch unlocked!", "success");
    Toasts.push("New Tab Unlocked: Dispatch", "success");
  }

  if (!Game.unlocks.marketing && bones >= 2) {
    Game.unlocks.marketing = true;
    newUnlock = true;
    logEvent("Marketing unlocked!", "success");
    Toasts.push("New Tab Unlocked: Marketing", "success");
  }

  if (!Game.unlocks.space && bones >= 5) {
    Game.unlocks.space = true;
    newUnlock = true;
    logEvent("Space Routes unlocked!", "success");
    Toasts.push("New Tab Unlocked: Space", "success");
  }

  if (!Game.unlocks.policy && bones >= 10) {
    Game.unlocks.policy = true;
    newUnlock = true;
    logEvent("Policy & Tax unlocked!", "success");
    Toasts.push("New Tab Unlocked: Policy", "success");
  }

  if (newUnlock) updateTabVisibility();
}

function updateTabVisibility() {
  const tabs = document.querySelectorAll(".tabs button");
  tabs.forEach(function(tab) {
    const tabName = tab.getAttribute("data-tab");
    const unlocked = tabName === "overview" || tabName === "buildings" || tabName === "settings" || Game.unlocks[tabName];
    if (unlocked) {
      tab.style.display = "";
      tab.classList.remove("locked");
      tab.removeAttribute("title");
    } else {
      tab.style.display = "none";
      tab.classList.add("locked");
    }
  });
}

function updateNextGoal() {
  const textEl = document.getElementById("nextGoalText");
  const hintEl = document.getElementById("nextGoalHint");
  const progressEl = document.getElementById("nextGoalProgress");
  if (!textEl || !hintEl || !progressEl) return;

  const totalBuildings = Object.values(State.buildings).reduce(function(sum, val) { return sum + val; }, 0);
  const bones = State.prestige.bones;
  const treats = State.treats;

  let goal = "";
  let hint = "";
  let progress = 0;

  if (totalBuildings === 0) {
    goal = "Build your first Farm Plot to start producing treats automatically!";
    hint = "Click 'Bake Treat' to gather 15 treats, then visit the Buildings tab.";
    progress = Math.min(100, (treats / 15) * 100);
  } else if (!Game.unlocks.upgrades) {
    goal = "Unlock the Upgrades tab!";
    hint = "You already have a building - the Upgrades tab should be unlocked!";
    progress = 100;
  } else if (totalBuildings < 10 && bones === 0) {
    goal = "Build 10 total buildings to unlock Research";
    hint = "Keep buying buildings and upgrades to grow your production.";
    progress = (totalBuildings / 10) * 100;
  } else if (treats < 1e6) {
    goal = "Reach 1 Million treats to unlock Prestige";
    hint = "Use 'Buy Max' to quickly expand your factory.";
    progress = Math.min(100, (treats / 1e6) * 100);
  } else if (!Game.unlocks.prestige) {
    goal = "Unlock Prestige - Pack Ascension awaits!";
    hint = "Check the tabs - Prestige should be available!";
    progress = 100;
  } else if (bones === 0) {
    goal = "Complete your first Prestige for Alpha Bones";
    hint = "Alpha Bones give permanent bonuses - visit the Prestige tab!";
    progress = 100;
  } else if (bones < 2) {
    goal = "Earn 2 Alpha Bones to unlock Marketing";
    hint = "Each prestige makes the next run faster!";
    progress = (bones / 2) * 100;
  } else if (bones < 5) {
    goal = "Earn 5 Alpha Bones to unlock Space Routes";
    hint = "Use Dispatch missions to gather extra resources.";
    progress = (bones / 5) * 100;
  } else if (bones < 10) {
    goal = "Earn 10 Alpha Bones to unlock Policy & Tax";
    hint = "Space routes provide Stardust for late-game upgrades.";
    progress = (bones / 10) * 100;
  } else {
    goal = "All systems unlocked! Aim for the stars!";
    hint = "Maximize your empire with all available systems.";
    progress = 100;
  }

  textEl.textContent = goal;
  hintEl.textContent = hint;
  progressEl.style.width = progress + "%";
}

function updateClickButton() {
  const clickBtn = $("#clickTreat");
  if (!clickBtn) return;
  const clickPower = DATA.baseClick * Game.mod.click * Game.mod.global;
  const combo = State.meta.clickCombo || 0;
  const comboText = combo > 0 ? ` [x${(1 + combo * 0.05).toFixed(2)} COMBO!]` : "";
  clickBtn.textContent = `Bake Treat (+${num.format(clickPower)})${comboText}`;
}

function applyMilestoneRewards(mod) {
  if (!State.milestones) return;
  for (const buildingId in State.milestones) {
    if (!State.milestones.hasOwnProperty(buildingId)) continue;
    const achieved = State.milestones[buildingId] || [];
    if (!achieved.length) continue;
    const perBuildingBoost = 1 + achieved.length * 0.05;
    if (typeof mod[buildingId] === "number") mod[buildingId] *= perBuildingBoost;
    mod.global *= 1 + achieved.length * 0.01;
  }
}

function evaluateAchievements() {
  for (const ach of ACHIEVEMENTS) {
    if (State.achievements[ach.id]) continue;
    try {
      if (ach.check()) unlockAchievement(ach);
    } catch (err) {
      console.warn("Achievement check failed for", ach.id, err);
    }
  }
}

function ensureStateIntegrity() {
  State.meta = Object.assign({
    lastSave: Date.now(),
    trackerExpanded: false,
    reducedMotion: false,
    clicks: 0,
    lifetimeTreats: 0,
    reputation: 0,
    bulkDiscountTimer: 0,
    eventTimer: 180,
    clickCombo: 0,
    lastClickTime: 0,
    critClicks: 0,
  }, State.meta || {});

  if (!State.metrics || !Array.isArray(State.metrics.samples) || !Array.isArray(State.metrics.deltaTreats)) {
    State.metrics = {
      samples: Array(90).fill(0),
      deltaTreats: Array(90).fill(0),
      index: 0,
    };
  } else {
    State.metrics.samples = Array(90).fill(0);
    State.metrics.deltaTreats = Array(90).fill(0);
    if (typeof State.metrics.index !== "number" || !isFinite(State.metrics.index)) {
      State.metrics.index = 0;
    } else {
      State.metrics.index = State.metrics.index % 90;
    }
  }

  if (!Array.isArray(State.events)) State.events = [];
  if (!State.achievements || typeof State.achievements !== "object") State.achievements = {};
  for (const [id] of DATA.buildings) {
    if (typeof State.buildings[id] !== "number") State.buildings[id] = 0;
  }
  for (const key in State.buildings) {
    if (!getBuildingDef(key)) delete State.buildings[key];
  }
  if (!State.milestones || typeof State.milestones !== "object") State.milestones = {};

  if (!State.dispatch || typeof State.dispatch !== "object") {
    State.dispatch = {
      dogs: [
        { id: "scout", name: "Scout", trait: "Nosey", power: 6 },
        { id: "patch", name: "Patch", trait: "Brave", power: 7 },
        { id: "radar", name: "Radar", trait: "Swift", power: 5 },
      ],
      slots: 2,
      active: [],
      reputation: 0,
    };
  }
  if (!Array.isArray(State.dispatch.dogs)) State.dispatch.dogs = [];
  if (!Array.isArray(State.dispatch.active)) State.dispatch.active = [];
  if (typeof State.dispatch.slots !== "number") State.dispatch.slots = 2;

  if (!State.marketing || typeof State.marketing !== "object") {
    State.marketing = { clout: 0, active: null, cooldown: 0, audienceBonus: 0, unlocks: {} };
  }
  if (!State.marketing.unlocks) State.marketing.unlocks = {};
  if (State.marketing.active) {
    if (typeof State.marketing.active.timeRemaining !== "number") State.marketing.active.timeRemaining = 0;
    if (typeof State.marketing.active.multiplier !== "number") State.marketing.active.multiplier = 1;
    if (typeof State.marketing.active.viralMultiplier !== "number") State.marketing.active.viralMultiplier = 1;
    if (typeof State.marketing.active.viralRemaining !== "number") State.marketing.active.viralRemaining = 0;
  }
  if (State.marketing.viral && typeof State.marketing.viral.timeRemaining !== "number") {
    State.marketing.viral.timeRemaining = 0;
  }

  if (!State.research || typeof State.research !== "object") {
    State.research = { active: null, queue: [], permanent: {}, paused: false };
  }
  if (!Array.isArray(State.research.queue)) State.research.queue = [];
  if (!State.research.permanent) State.research.permanent = {};
  if (State.research.active && typeof State.research.active.time !== "number") {
    State.research.active.time = State.research.active.remaining || 0;
  }

  if (!State.space || typeof State.space !== "object") {
    State.space = { stardust: 0, slots: 2, active: [] };
  }
  if (!Array.isArray(State.space.active)) State.space.active = [];
  if (typeof State.space.slots !== "number") State.space.slots = 2;
  if (typeof State.space.stardust !== "number") State.space.stardust = 0;

  if (!State.politics || typeof State.politics !== "object") {
    State.politics = { taxRate: 0, policyPoints: 0, votes: 0, support: 100, perks: {} };
  }
  if (!State.politics.perks) State.politics.perks = {};
}

function recordMetrics(tps, deltaTreats, dt) {
  const samples = State.metrics.samples;
  const deltas = State.metrics.deltaTreats;
  const size = samples.length;
  const idx = State.metrics.index;
  samples[idx] = tps;
  deltas[idx] = deltaTreats;
  State.metrics.index = (idx + 1) % size;
  Tracker.lastTPS = tps;
  Tracker.lastTreatDelta = deltaTreats;
  if (deltaTreats > 0) State.meta.lifetimeTreats += deltaTreats;
  SpriteManager.update(dt);
  if (deltaTreats > 0.5) SpriteManager.registerTreatGain(deltaTreats);
}

function average(values) {
  if (!values || !values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function updateTrackerBanner() {
  const bannerImg = document.getElementById("trackerBannerImg");
  if (!bannerImg) return;

  const tps = totalTPS();
  const bones = State.prestige.bones;
  const totalBuildings = Object.values(State.buildings).reduce(function(sum, val) { return sum + val; }, 0);

  let bannerSrc = "assets/img/banners/starter.png";

  if (bones >= 10) {
    bannerSrc = "assets/img/banners/galaxy.png";
  } else if (bones >= 5) {
    bannerSrc = "assets/img/banners/space.png";
  } else if (bones >= 2) {
    bannerSrc = "assets/img/banners/marketing.png";
  } else if (bones >= 1) {
    bannerSrc = "assets/img/banners/industrial.png";
  } else if (tps >= 1000) {
    bannerSrc = "assets/img/banners/factory.png";
  } else if (tps >= 100) {
    bannerSrc = "assets/img/banners/production.png";
  } else if (totalBuildings >= 10) {
    bannerSrc = "assets/img/banners/growing.png";
  } else if (totalBuildings >= 1) {
    bannerSrc = "assets/img/banners/first-building.png";
  }

  if (bannerImg.src !== bannerSrc) {
    bannerImg.src = bannerSrc;
  }
}

function renderTracker() {
  const tracker = document.getElementById("tracker");
  if (!tracker) return;

  updateTrackerBanner();

  const expanded = !!State.meta.trackerExpanded;
  tracker.classList.toggle("expanded", expanded);
  tracker.classList.toggle("collapsed", !expanded);
  tracker.dataset.expanded = expanded ? "true" : "false";

  const toggle = document.getElementById("trackerToggle");
  if (toggle) {
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    const text = toggle.querySelector(".toggle-text");
    if (text) text.textContent = expanded ? "Collapse Tracker" : "Expand Tracker";
  }

  const treatEl = document.getElementById("trackerTreats");
  const tpsEl = document.getElementById("trackerTPS");
  const bonesEl = document.getElementById("trackerBones");
  if (treatEl) treatEl.textContent = num.format(State.treats);
  if (tpsEl) tpsEl.textContent = num.format(Tracker.lastTPS || totalTPS());
  if (bonesEl) bonesEl.textContent = num.format(State.prestige.bones);

  if (!expanded) return;

  const avgEl = document.getElementById("trackerAvgTPS");
  if (avgEl) avgEl.textContent = num.format(average(State.metrics.samples));

  const perList = document.getElementById("trackerBreakdown");
  if (perList) {
    const producers = [];

    if (State.interns > 0) {
      const each = 0.25 * Game.mod.click * Game.mod.global;
      const total = internTPS();
      producers.push({ name: "Pup Interns", count: State.interns, each, total });
    }

    DATA.buildings.forEach(([id, name]) => {
      const count = State.buildings[id];
      if (!count) return;
      const each = buildingTPS(id);
      const total = each * count;
      producers.push({ name, count, each, total });
    });

    const rows = producers
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map(entry => `<li><span>${entry.name}</span><span>${entry.count} x ${num.format(entry.each)}</span><span>${num.format(entry.total)}/s</span></li>`)
      .join("");
    perList.innerHTML = rows || `<li class="muted">No production yet.</li>`;
  }

  const feed = document.getElementById("trackerFeed");
  if (feed) {
    const events = State.events.slice(-6).reverse();
    feed.innerHTML = events.length
      ? events.map(evt => `<li><span class="evt-time">${evt.time}</span><span class="evt-msg">${evt.msg}</span></li>`).join("")
      : `<li class="muted">No events yet. Get baking!</li>`;
  }
}

/* ================================
   BUY / GAMEPLAY
==================================*/
function buyIntern() {
  const cost = DATA.internCost * Math.pow(1.2, State.interns);
  if (!canAfford(cost)) return 0;
  spend(cost);
  State.interns++;
  logEvent("Hired a pup intern.", "success");
  SpriteManager.trigger("patch", "wag");
  return 1;
}

function buyBuilding(id) {
  const cost = buildingCost(id, State.buildings[id]);
  if (!canAfford(cost)) return 0;
  spend(cost);
  State.buildings[id]++;
  checkBuildingMilestones(id);
  Game.lastBuildingSelected = id;
  const def = getBuildingDef(id);
  logEvent(`Bought ${def ? def[1] : id}.`, "success");
  SpriteManager.trigger("patch", "wag");
  renderBuildings();
  checkUnlocks();
  return 1;
}

function buyMultiple(id, qty) {
  const def = getBuildingDef(id);
  if (!def) return 0;
  qty = Math.max(1, Math.floor(qty));
  const summary = buildingBulkCost(def, State.buildings[id], qty, true);
  let purchased = qty;
  while (purchased > 0 && summary.cost > State.treats) {
    const price = summary.prices.pop();
    summary.cost -= price;
    purchased--;
  }
  if (purchased <= 0) return 0;
  spend(summary.cost);
  State.buildings[id] += purchased;
  checkBuildingMilestones(id);
  Game.lastBuildingSelected = id;
  const name = def[1];
  logEvent(`Bought ${purchased} x ${name}.`, "success");
  SpriteManager.trigger("patch", "wag");
  renderBuildings();
  checkUnlocks();
  return purchased;
}

function buyMax(id) {
  const def = getBuildingDef(id);
  if (!def) return 0;
  const owned = State.buildings[id];
  const budget = State.treats;
  let qty = maxAffordableQuantity(def, owned, budget);
  if (qty <= 0) return 0;
  let summary = buildingBulkCost(def, owned, qty, true);

  const scale = def[4];
  const base = def[2];
  while (qty > 0 && summary.cost > budget) {
    const price = summary.prices.pop();
    summary.cost -= price;
    summary.nextScalePow /= scale;
    qty--;
  }
  if (qty <= 0) return 0;

  let nextPrice = Math.ceil(base * summary.nextScalePow);
  while (summary.cost + nextPrice <= budget) {
    summary.cost += nextPrice;
    summary.prices.push(nextPrice);
    summary.nextScalePow *= scale;
    qty++;
    nextPrice = Math.ceil(base * summary.nextScalePow);
  }

  if (qty <= 0 || summary.cost > budget) return 0;
  spend(summary.cost);
  State.buildings[id] += qty;
  checkBuildingMilestones(id);
  Game.lastBuildingSelected = id;
  logEvent(`Buy Max purchased ${qty} x ${def[1]}.`, "success");
  SpriteManager.trigger("patch", "wag");
  renderBuildings();
  checkUnlocks();
  return qty;
}

function canSeeUpgrade(up) {
  const [, , , , cond] = up;
  if (cond.type === "treats") return State.treats >= cond.amt;
  if (cond.type === "owned") return State.buildings[cond.id] >= cond.amt;
  return true;
}

function buyUpgrade(id) {
  const up = DATA.upgrades.find(u => u[0] === id);
  if (!up || State.upgradesBought[id]) return false;
  const cost = up[3];
  if (!canAfford(cost)) return false;
  spend(cost);
  State.upgradesBought[id] = true;
  Game.mod = freshModifiers();
  up[5](Game);
  logEvent(`Upgrade unlocked: ${up[1]}.`, "success");
  Toasts.push(`Upgrade: ${up[1]}`, "success");
  return true;
}

function buyResearch(id) {
  const r = DATA.research.find(x => x[0] === id);
  if (!r || State.researchBought[id]) return false;
  const cost = r[3];
  if (!canAfford(cost)) return false;
  spend(cost);
  State.researchBought[id] = true;
  Game.mod = freshModifiers();
  r[4](Game);
  logEvent(`Research complete: ${r[1]}.`, "success");
  Toasts.push(`Research: ${r[1]}`, "success");
  return true;
}

function ascend() {
  const gain = bonesGainIfAscend(State.treats);
  if (gain <= 0) {
    Toasts.push("No Alpha Bones available yet", "error");
    return;
  }
  State.prestige.bones += gain;
  State.prestige.totalPrestiges = (State.prestige.totalPrestiges || 0) + 1;
  State.treats = 0;
  State.interns = 0;
  for (const [id] of DATA.buildings) State.buildings[id] = 0;
  State.upgradesBought = {};
  State.researchBought = {};
  Game.mod = freshModifiers();
  logEvent(`Ascended! +${gain} Alpha Bones.`, "success");
  Toasts.push(`Ascended for ${num.format(gain)} Alpha Bones`, "success");
  renderBuildings();
  checkUnlocks();
}

function constellationBonesGainIfAscend(alphaBones) {
  if (alphaBones < 10) return 0;
  const val = Math.max(0, Math.log2(alphaBones) - 3.32);
  return Math.floor(val);
}

function constellationAscend() {
  if (State.prestige.bones < 10) {
    Toasts.push("Need at least 10 Alpha Bones to ascend to Constellations", "error");
    return;
  }
  const gain = constellationBonesGainIfAscend(State.prestige.bones);
  if (gain <= 0) {
    Toasts.push("No Constellation Bones available yet", "error");
    return;
  }
  if (!confirm(`Constellation Ascension will reset your Alpha Bones and all progress, keeping only Constellation Bones and Achievements. Gain ${num.format(gain)} Constellation Bones?`)) {
    return;
  }

  State.prestige.constellationBones += gain;
  State.prestige.bones = 0;
  State.prestige.totalPrestiges = 0;
  State.treats = 0;
  State.interns = 0;
  for (const [id] of DATA.buildings) State.buildings[id] = 0;
  State.upgradesBought = {};
  State.researchBought = {};
  State.dispatch.active = [];
  State.marketing.active = null;
  State.marketing.clout = 0;
  State.research.active = null;
  State.research.queue = [];
  State.space.active = [];
  State.space.stardust = 0;
  State.politics.policyPoints = 0;
  State.politics.votes = 0;
  Game.mod = freshModifiers();
  logEvent(`CONSTELLATION ASCENSION! +${gain} Constellation Bones`, "success");
  Toasts.push(`Ascended to the Stars! +${num.format(gain)} Constellation Bones`, "success");
  renderBuildings();
  checkUnlocks();
}

/* ================================
   SAVE / LOAD / OFFLINE
==================================*/
function save(showToast = false) {
  State.meta.lastSave = Date.now();
  localStorage.setItem("dog_treat_tycoon_save", btoa(JSON.stringify(State)));
  if (showToast) Toasts.push("Game saved!", "info", 2000);
}

function load() {
  try {
    const raw = localStorage.getItem("dog_treat_tycoon_save");
    if (!raw) return;
    const obj = JSON.parse(atob(raw));
    Object.assign(State, obj);
  } catch (err) {
    console.warn("Load failed", err);
  }
}

function applyOfflineProgress() {
  const now = Date.now();
  const last = State.meta.lastSave || now;
  const dt = Math.min(43200, Math.max(0, (now - last) / 1000));
  const gain = totalTPS() * dt;
  if (gain > 0) {
    State.treats += gain;
    logEvent(`Offline baking +${num.format(gain)} treats`, "system");
  }
}

/* ================================
   UI / RENDER
==================================*/
const $ = selector => document.querySelector(selector);

function setupTabs() {
  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab").forEach(panel => panel.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.tab;
      document.getElementById(tab).classList.add("active");
    });
  });
}

function renderBuildings() {
  const buildingMarkup = DATA.buildings.map(([id, name, baseCost, baseTPS, scale]) => {
    const owned = State.buildings[id];
    const cost = buildingCost(id, owned);
    const tps = buildingTPS(id);
    const totalProduction = owned * tps;
    const currentTotalTPS = totalTPS();
    const percentOfTotal = currentTotalTPS > 0 ? (totalProduction / currentTotalTPS * 100).toFixed(1) : 0;

    const syns = getBuildingSynergies(id);
    let synergyText = "";

    if (syns.inbound.length > 0) {
      synergyText += "\n\nSYNERGIES (receiving):";
      syns.inbound.forEach(function(s) {
        const fromDef = getBuildingDef(s.from);
        const fromName = fromDef ? fromDef[1] : s.from;
        const count = State.buildings[s.from] || 0;
        const bonus = (count * s.bonus * 100).toFixed(1);
        synergyText += `\n  ${fromName}: +${bonus}% (${count} owned)`;
      });
    }

    if (syns.outbound.length > 0) {
      synergyText += "\n\nSYNERGIES (providing):";
      syns.outbound.forEach(function(s) {
        const toDef = getBuildingDef(s.to);
        const toName = toDef ? toDef[1] : s.to;
        synergyText += `\n  Boosts ${toName} by +${(s.bonus * 100).toFixed(1)}% each`;
      });
    }

    const tooltip = `${name}\n\nBase TPS: ${num.format2(baseTPS)}\nCurrent TPS per unit: ${num.format2(tps)}\nTotal production: ${num.format2(totalProduction)}/s\n(${percentOfTotal}% of total)\n\nCost scale: x${scale.toFixed(3)}\nOwned: ${owned}${synergyText}`;

    const buyMaxTooltip = `Buy Max: ${name}\n\nPurchase as many as you can afford using an optimized bulk-buy algorithm.`;

    return `<div class="card ${!canAfford(cost) ? "locked" : ""}">
      <h4>${name}</h4>
      <div class="meta">Owned: ${owned}</div>
      <div class="meta">Each: ${num.format2(tps)}/s</div>
      <div class="meta">Next Cost: ${num.format(cost)}</div>
      <div class="actions">
        <button class="buy" data-buy="${id}" data-tooltip="${encodeURIComponent(tooltip)}">Buy 1</button>
        <button class="buy" data-buymax="${id}" data-tooltip="${encodeURIComponent(buyMaxTooltip)}">Buy Max</button>
      </div>
    </div>`;
  }).join("");
  const buildingListEl = $("#buildingList");
  if (buildingListEl) {
    buildingListEl.innerHTML = buildingMarkup;
  }
}

function render() {
  $("#treats").textContent = num.format(State.treats);
  $("#tps").textContent = num.format2(totalTPS());
  $("#alphaBones").textContent = num.format(State.prestige.bones);
  $("#interns").textContent = State.interns;

  const buyAutoBtn = $("#buyAuto");
  if (buyAutoBtn) {
    const internCost = DATA.internCost * Math.pow(1.2, State.interns);
    const internProduction = 0.25 * Game.mod.click * Game.mod.global;
    const tooltip = `Pup Intern\n\nEach intern produces ${num.format2(internProduction)}/s\nScales with click power and global multipliers\n\nCost increases by 20% per intern\nNext cost: ${num.format(internCost)}`;
    buyAutoBtn.textContent = `Hire Pup Intern (${num.format(internCost)})`;
    buyAutoBtn.setAttribute("data-tooltip", encodeURIComponent(tooltip));
  }

    const productionLines = [];

  if (State.interns > 0) {
    const internTotal = internTPS();
    productionLines.push(`<li>Pup Interns: ${State.interns} x ${num.format2(0.25 * Game.mod.click * Game.mod.global)} = <b>${num.format2(internTotal)}</b> /s</li>`);
  }

  DATA.buildings.forEach(([id, name]) => {
    const count = State.buildings[id];
    if (count <= 0) return;
    const tps = count * buildingTPS(id);
    productionLines.push(`<li>${name}: ${count} x ${num.format2(buildingTPS(id))} = <b>${num.format2(tps)}</b> /s</li>`);
  });

  $("#productionList").innerHTML = productionLines.join("");

  const upgradesMarkup = DATA.upgrades.map(up => {
    const [id, name, desc, cost] = up;
    const owned = !!State.upgradesBought[id];
    const seen = canSeeUpgrade(up) || owned;
    if (!seen) return "";
    return `<div class="card">
      <h4>${name}</h4>
      <div class="meta">${desc}</div>
      <div class="meta">Cost: ${num.format(cost)}</div>
      <div class="actions">
        <button class="${owned ? "locked" : "buy"}" data-upgrade="${id}" data-tooltip="${encodeURIComponent(desc)}" ${owned ? "disabled" : ""}>${owned ? "Purchased" : "Buy"}</button>
      </div>
    </div>`;
  }).join("");
  $("#upgradeList").innerHTML = upgradesMarkup;

  renderResearchSection();
  renderDispatchSection();
  renderMarketingSection();
  renderSpaceSection();
  renderPolicySection();
  updateNextGoal();
  updateClickButton();

  $("#bonesGain").textContent = num.format(bonesGainIfAscend(State.treats));

  const currentBonesEl = $("#currentBones");
  if (currentBonesEl) currentBonesEl.textContent = num.format(State.prestige.bones);

  const totalPrestigesEl = $("#totalPrestiges");
  if (totalPrestigesEl) totalPrestigesEl.textContent = num.format(State.prestige.totalPrestiges || 0);

  const currentConstellationBonesEl = $("#currentConstellationBones");
  if (currentConstellationBonesEl) currentConstellationBonesEl.textContent = num.format(State.prestige.constellationBones || 0);

  const constellationGainEl = $("#constellationGain");
  const constellationBtn = $("#constellationAscend");
  const constellationInfoEl = $("#constellationInfo");
  if (State.prestige.bones >= 10) {
    const constellationGain = constellationBonesGainIfAscend(State.prestige.bones);
    if (constellationGainEl) constellationGainEl.textContent = num.format(constellationGain);
    if (constellationBtn) {
      constellationBtn.disabled = constellationGain <= 0;
    }
    if (constellationInfoEl) {
      const currentBonus = Math.pow(1.25, State.prestige.constellationBones || 0);
      const newBonus = Math.pow(1.25, (State.prestige.constellationBones || 0) + constellationGain);
      constellationInfoEl.textContent = `Current Bonus: ${(currentBonus * 100).toFixed(0)}% → After Ascension: ${(newBonus * 100).toFixed(0)}%`;
    }
  } else {
    if (constellationGainEl) constellationGainEl.textContent = "0";
    if (constellationBtn) constellationBtn.disabled = true;
    if (constellationInfoEl) constellationInfoEl.textContent = `Requires at least 10 Alpha Bones to unlock. (Currently: ${State.prestige.bones})`;
  }
}

function formatTime(seconds) {
  seconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours + "h " + mins + "m";
  }
  if (minutes > 0) return minutes + "m " + secs + "s";
  return secs + "s";
}

function renderResearchSection() {
  const activeWrap = document.getElementById("activeResearch");
  if (!activeWrap) return;
  const queueWrap = document.getElementById("researchQueue");
  const availWrap = document.getElementById("researchAvailable");

  if (State.research.active) {
    const active = State.research.active;
    const progress = Math.max(0, active.time - active.remaining);
    const pct = Math.min(100, Math.floor((progress / active.time) * 100));
    activeWrap.classList.remove("hidden");
    activeWrap.innerHTML = `<h4>${active.name}</h4>
      <div class="meta">${formatTime(active.remaining)} remaining</div>
      <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
      <p>${active.desc || ""}</p>`;
  } else {
    activeWrap.classList.add("hidden");
  }

  if (queueWrap) {
    queueWrap.innerHTML = (State.research.queue || []).map(function (item, index) {
      return `<div class="card">
        <h4>${item.name}</h4>
        <div class="meta">Starts in position ${index + 1}</div>
        <div class="meta">${formatTime(item.time)}</div>
      </div>`;
    }).join("");
  }

  if (availWrap) {
    availWrap.innerHTML = RESEARCH_PROJECTS.map(function (project) {
      if (State.research.permanent[project.id]) {
        return `<div class="card locked">
          <h4>${project.name}</h4>
          <div class="meta">Completed</div>
        </div>`;
      }
      const queued = (State.research.queue || []).some(function (q) { return q.id === project.id; }) ||
        (State.research.active && State.research.active.id === project.id);
      const unlocked = !project.unlock || project.unlock();
      return `<div class="card">
        <h4>${project.name}</h4>
        <div class="meta">${project.desc}</div>
        <div class="meta">Duration: ${formatTime(project.time)}</div>
        <div class="actions">
          <button class="${queued || !unlocked ? "locked" : "buy"}"
            data-research-queue="${project.id}" ${queued || !unlocked ? "disabled" : ""}>
            ${queued ? "Queued" : unlocked ? "Queue" : "Locked"}
          </button>
        </div>
      </div>`;
    }).join("");
  }
}

function renderDispatchSection() {
  const roster = document.getElementById("dispatchRoster");
  const missions = document.getElementById("dispatchMissionList");
  const active = document.getElementById("dispatchActive");
  if (roster) {
    const rows = (State.dispatch.dogs || []).map(function (dog) {
      return `<li>${dog.name} <span class="meta">Trait: ${dog.trait}</span> <span class="meta">Power: ${dog.power}</span></li>`;
    });
    rows.unshift(`<li>Reputation: <span class="meta">${num.format(State.meta.reputation || 0)}</span></li>`);
    roster.innerHTML = rows.join("");
  }
  if (missions) {
    missions.innerHTML = DISPATCH_MISSIONS.map(function (mission) {
      return `<div class="card">
        <h4>${mission.name}</h4>
        <div class="meta">${mission.description}</div>
        <div class="meta">Duration: ${formatTime(mission.duration)}</div>
        <div class="meta">Risk: ${(mission.risk * 100).toFixed(0)}%</div>
        <div class="actions">
          <button class="buy" data-dispatch="${mission.id}">Send Pack</button>
        </div>
      </div>`;
    }).join("");
  }
  if (active) {
    active.innerHTML = (State.dispatch.active || []).map(function (entry) {
      const progress = ((entry.duration - entry.remaining) / entry.duration * 100).toFixed(1);
      return `<div class="card">
        <h4>${entry.name}</h4>
        <div class="meta">Remaining: ${formatTime(entry.remaining)} / ${formatTime(entry.duration)}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="meta">Reward: ${entry.reward.treats ? num.format(entry.reward.treats) + " treats" : ""}</div>
      </div>`;
    }).join("") || `<div class="card"><p>No active missions.</p></div>`;
  }
}

function renderMarketingSection() {
  const clout = document.getElementById("clout");
  const activeCampaign = document.getElementById("activeCampaign");
  const campaignList = document.getElementById("campaignList");
  if (clout) clout.textContent = num.format(State.marketing.clout || 0);
  if (activeCampaign) {
    if (State.marketing.active) {
      activeCampaign.textContent = `${State.marketing.active.name} (${formatTime(State.marketing.active.timeRemaining)})`;
    } else {
      activeCampaign.textContent = "None";
    }
  }
  if (campaignList) {
    campaignList.innerHTML = availableCampaigns().map(function (c) {
      const running = State.marketing.active && State.marketing.active.id === c.id;
      let progressBar = "";
      if (running && State.marketing.active) {
        const progress = ((c.duration - State.marketing.active.timeRemaining) / c.duration * 100).toFixed(1);
        progressBar = `<div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="meta">Remaining: ${formatTime(State.marketing.active.timeRemaining)}</div>`;
      }
      return `<div class="card ${running ? "active" : ""}">
        <h4>${c.name}</h4>
        <div class="meta">Cost: ${c.cost} clout</div>
        <div class="meta">Multiplier: ${c.multiplier.toFixed(2)}x</div>
        <div class="meta">Duration: ${formatTime(c.duration)}</div>
        ${progressBar}
        <div class="actions">
          <button class="${running ? "locked" : "buy"}" data-campaign="${c.id}" ${running ? "disabled" : ""}>${running ? "Active" : "Launch"}</button>
        </div>
      </div>`;
    }).join("");
  }
}

function renderSpaceSection() {
  const stardust = document.getElementById("stardust");
  const slots = document.getElementById("activeRoutesCount");
  const routes = document.getElementById("spaceRouteList");
  const active = document.getElementById("spaceActive");
  if (stardust) stardust.textContent = num.format(State.space.stardust || 0);
  if (slots) slots.textContent = `${State.space.active.length}/${State.space.slots}`;
  if (routes) {
    routes.innerHTML = SPACE_ROUTES.map(function (route) {
      return `<div class="card">
        <h4>${route.name}</h4>
        <div class="meta">Duration: ${formatTime(route.duration)}</div>
        <div class="meta">Reward: ${route.reward.stardust} Stardust</div>
        <div class="actions">
          <button class="buy" data-space="${route.id}">Launch</button>
        </div>
      </div>`;
    }).join("");
  }
  if (active) {
    active.innerHTML = (State.space.active || []).map(function (entry) {
      const progress = ((entry.duration - entry.remaining) / entry.duration * 100).toFixed(1);
      return `<div class="card">
        <h4>${entry.name}</h4>
        <div class="meta">Remaining: ${formatTime(entry.remaining)} / ${formatTime(entry.duration)}</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="meta">ETA: ${formatTime(entry.remaining)}</div>
      </div>`;
    }).join("") || `<div class="card"><p>No active routes.</p></div>`;
  }
}

function renderPolicySection() {
  const taxSlider = document.getElementById("taxSlider");
  const taxRateLabel = document.getElementById("taxRateLabel");
  const policyPoints = document.getElementById("policyPoints");
  const votes = document.getElementById("votes");
  const support = document.getElementById("support");
  const policyList = document.getElementById("policyList");
  if (taxSlider && typeof State.politics.taxRate === "number") {
    taxSlider.value = State.politics.taxRate;
  }
  if (taxRateLabel) taxRateLabel.textContent = (State.politics.taxRate || 0) + "%";
  if (policyPoints) policyPoints.textContent = num.format(State.politics.policyPoints || 0);
  if (votes) votes.textContent = num.format(State.politics.votes || 0);
  if (support) support.textContent = Math.round(State.politics.support || 0) + "%";
  if (policyList) {
    policyList.innerHTML = POLICY_PERKS.map(function (perk) {
      const owned = !!State.politics.perks[perk.id];
      return `<div class="card">
        <h4>${perk.name}</h4>
        <div class="meta">${perk.desc}</div>
        <div class="meta">Cost: ${perk.cost} PP</div>
        <div class="actions">
          <button class="${owned ? "locked" : "buy"}" data-policy="${perk.id}" ${owned ? "disabled" : ""}>
            ${owned ? "Enacted" : "Enact"}
          </button>
        </div>
      </div>`;
    }).join("");
  }
}

function renderEventModal(card) {
  const modal = document.getElementById("eventModal");
  if (!modal) return;
  document.getElementById("eventTitle").textContent = card.title;
  document.getElementById("eventDescription").textContent = card.desc;
  const choiceContainer = document.getElementById("eventChoices");
  if (choiceContainer) {
    choiceContainer.innerHTML = card.choices.map(function (choice, index) {
      return `<button class="primary" data-event-choice="${index}">${choice.label}</button>`;
    }).join("");
  }
  modal.classList.remove("hidden");
}

function hideEventModal() {
  const modal = document.getElementById("eventModal");
  if (modal) modal.classList.add("hidden");
}

function findActionButton(event) {
  let node = event.target;
  while (node && node !== document.body) {
    if (node.tagName && node.tagName.toLowerCase() === "button") return node;
    node = node.parentElement;
  }
  return null;
}

function getTooltipTarget(element) {
  while (element && element !== document.body) {
    if (element.dataset && element.dataset.tooltip) return element;
    element = element.parentElement;
  }
  return null;
}

function handleTooltipOver(event) {
  const target = getTooltipTarget(event.target);
  const tooltip = document.getElementById("tooltip");
  if (!tooltip) return;
  if (target) {
    let text = target.dataset.tooltip || "";
    try {
      text = decodeURIComponent(text);
    } catch (err) {
      // keep original text
    }
    tooltip.textContent = text;
    tooltip.classList.remove("hidden");
  }
}

function handleTooltipOut(event) {
  const tooltip = document.getElementById("tooltip");
  if (!tooltip) return;
  const related = event.relatedTarget;
  if (!getTooltipTarget(related)) {
    tooltip.classList.add("hidden");
  }
}

function handleTooltipMove(event) {
  const tooltip = document.getElementById("tooltip");
  if (!tooltip || tooltip.classList.contains("hidden")) return;
  const offset = 14;
  tooltip.style.left = event.clientX + offset + "px";
  tooltip.style.top = event.clientY + offset + "px";
}

function bindUI() {
  const clickTreatBtn = $("#clickTreat");
  if (clickTreatBtn) {
    clickTreatBtn.addEventListener("click", function() {
      const now = Date.now();
      const timeSinceLastClick = now - (State.meta.lastClickTime || 0);

      let comboMultiplier = 1;
      if (timeSinceLastClick < 500) {
        State.meta.clickCombo = Math.min(10, (State.meta.clickCombo || 0) + 1);
        comboMultiplier = 1 + (State.meta.clickCombo * 0.05);
      } else {
        State.meta.clickCombo = 0;
      }
      State.meta.lastClickTime = now;

      const critChance = 0.1 + (State.meta.clickCombo * 0.01);
      const isCrit = Math.random() < critChance;
      const critMultiplier = isCrit ? 3 : 1;

      if (isCrit) {
        State.meta.critClicks = (State.meta.critClicks || 0) + 1;
        Toasts.push(`Critical bake! x${critMultiplier}`, "success");
      }

      let gain = DATA.baseClick * Game.mod.click * Game.mod.global * comboMultiplier * critMultiplier;
      State.meta.clicks += 1;
      State.treats += gain;
      SpriteManager.trigger("scout", "hop");
      SpriteManager.registerTreatGain(gain);

      updateClickButton();
    });
  }

  const buyAutoBtn = $("#buyAuto");
  if (buyAutoBtn) {
    buyAutoBtn.addEventListener("click", () => {
      if (buyIntern()) {
        Toasts.push("New pup intern hired!", "success");
      } else {
        Toasts.push("Need more treats for an intern", "error");
      }
    });
  }

  const buildingListElement = $("#buildingList");
  if (buildingListElement) {
    buildingListElement.addEventListener("click", function(e) {
      const btn = findActionButton(e);
      if (!btn) return;
      const buyId = btn.getAttribute("data-buy") || (btn.dataset ? btn.dataset.buy : null);
      const buyMaxId = btn.getAttribute("data-buymax") || (btn.dataset ? btn.dataset.buymax : null);
      if (buyId) {
        const purchased = buyBuilding(buyId);
        const def = getBuildingDef(buyId);
        if (purchased > 0) {
          Toasts.push(`Purchased ${def ? def[1] : buyId}`, "success");
        } else {
          Toasts.push(`Need more treats for ${def ? def[1] : buyId}`, "error");
        }
      }
      if (buyMaxId) {
        const purchased = buyMax(buyMaxId);
        const def = getBuildingDef(buyMaxId);
        if (purchased > 0) {
          Toasts.push(`Buy Max: ${purchased} x ${def ? def[1] : buyMaxId}`, "success");
        } else {
          Toasts.push("Not enough treats for Buy Max", "error");
        }
      }
    });
  }

  $("#upgradeList").addEventListener("click", e => {
    const btn = findActionButton(e);
    if (btn) {
      const id = btn.getAttribute("data-upgrade");
      if (!id) return;
      const success = buyUpgrade(id);
      const up = DATA.upgrades.find(u => u[0] === id);
      if (!success) Toasts.push(`Cannot buy ${up ? up[1] : "upgrade"} yet`, "error");
    }
  });

  const ascendBtn = $("#ascend");
  if (ascendBtn) {
    ascendBtn.addEventListener("click", ascend);
  }

  const constellationAscendBtn = $("#constellationAscend");
  if (constellationAscendBtn) {
    constellationAscendBtn.addEventListener("click", constellationAscend);
  }

  const saveBtn = $("#saveBtn");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      save(true);
      logEvent("Manual save complete.", "system");
    });
  }

  const exportBtn = $("#exportBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      save();
      const saveArea = $("#saveArea");
      if (saveArea) {
        saveArea.value = localStorage.getItem("dog_treat_tycoon_save") || "";
      }
    });
  }

  const importBtn = $("#importBtn");
  if (importBtn) {
    importBtn.addEventListener("click", () => {
      const saveArea = $("#saveArea");
      if (!saveArea) return;
      const raw = saveArea.value.trim();
      if (!raw) return;
      try {
        const obj = JSON.parse(atob(raw));
        localStorage.setItem("dog_treat_tycoon_save", raw);
        Object.assign(State, obj);
        Game.mod = freshModifiers();
        Toasts.push("Import successful!", "success");
        render();
      } catch (err) {
        alert("Import failed. Ensure you pasted the Export text exactly.");
      }
    });
  }

  const resetBtn = $("#resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Hard reset? This cannot be undone.")) return;
      localStorage.removeItem("dog_treat_tycoon_save");
      location.reload();
    });
  }

  const researchAvailable = document.getElementById("researchAvailable");
  if (researchAvailable) {
    researchAvailable.addEventListener("click", e => {
      const btn = findActionButton(e);
      if (btn) {
        const queueId = btn.getAttribute("data-research-queue") || (btn.dataset ? btn.dataset.researchQueue : null);
        if (queueId) queueResearch(queueId);
      }
    });
  }
  const researchPause = document.getElementById("researchPause");
  if (researchPause) {
    researchPause.addEventListener("click", () => {
      State.research.paused = true;
      Toasts.push("Research paused.", "info");
    });
  }
  const researchResume = document.getElementById("researchResume");
  if (researchResume) {
    researchResume.addEventListener("click", () => {
      State.research.paused = false;
      startNextResearch();
      Toasts.push("Research resumed.", "info");
    });
  }

  const dispatchMissions = document.getElementById("dispatchMissionList");
  if (dispatchMissions) {
    dispatchMissions.addEventListener("click", e => {
      const btn = findActionButton(e);
      if (btn) {
      const missionId = btn.getAttribute("data-dispatch") || (btn.dataset ? btn.dataset.dispatch : null);
      if (missionId) startDispatchMission(missionId);
      }
    });
  }

  const campaignList = document.getElementById("campaignList");
  if (campaignList) {
    campaignList.addEventListener("click", e => {
      const btn = findActionButton(e);
      if (btn) {
      const campaignId = btn.getAttribute("data-campaign") || (btn.dataset ? btn.dataset.campaign : null);
      if (campaignId) startCampaignById(campaignId);
      }
    });
  }
  const launchCampaignBtn = document.getElementById("startCampaign");
  if (launchCampaignBtn) {
    launchCampaignBtn.addEventListener("click", () => {
      const available = availableCampaigns();
      if (!available.length) {
        Toasts.push("No campaigns unlocked yet.", "error");
        return;
      }
      startCampaignById(available[0].id);
    });
  }
  const buyAudience = document.getElementById("buyAudience");
  if (buyAudience) {
    buyAudience.addEventListener("click", () => {
      if (State.marketing.clout < 25) {
        Toasts.push("Need more clout.", "error");
        return;
      }
      State.marketing.clout -= 25;
      State.marketing.audienceBonus += 0.1;
      Toasts.push("Audience expanded!", "success");
    });
  }

  const spaceRoutes = document.getElementById("spaceRouteList");
  if (spaceRoutes) {
    spaceRoutes.addEventListener("click", e => {
      const btn = findActionButton(e);
      if (btn) {
      const routeId = btn.getAttribute("data-space") || (btn.dataset ? btn.dataset.space : null);
      if (routeId) startSpaceRoute(routeId);
      }
    });
  }

  const policyList = document.getElementById("policyList");
  if (policyList) {
    policyList.addEventListener("click", e => {
      const btn = findActionButton(e);
      if (btn) {
      const policyId = btn.getAttribute("data-policy") || (btn.dataset ? btn.dataset.policy : null);
      if (policyId) purchasePolicyPerk(policyId);
      }
    });
  }

  const taxSlider = document.getElementById("taxSlider");
  if (taxSlider) {
    taxSlider.addEventListener("input", () => {
      State.politics.taxRate = parseFloat(taxSlider.value) || 0;
      renderPolicySection();
    });
  }

  const eventModal = document.getElementById("eventModal");
  if (eventModal) {
    eventModal.addEventListener("click", e => {
      const btn = findActionButton(e) || e.target;
      const choiceAttr = btn ? (btn.getAttribute("data-event-choice") || (btn.dataset ? btn.dataset.eventChoice : null)) : null;
      if (choiceAttr !== null && choiceAttr !== undefined) {
        const index = parseInt(choiceAttr, 10);
        const card = State.meta.activeEvent;
        if (card && card.choices[index]) {
          resolveEventChoice(card.choices[index].effect);
          return;
        }
      }
      if (btn && btn.id === "eventDismiss") {
        State.meta.activeEvent = null;
        hideEventModal();
      }
    });
  }

  document.body.addEventListener("mouseover", handleTooltipOver);
  document.body.addEventListener("mouseout", handleTooltipOut);
  document.body.addEventListener("mousemove", handleTooltipMove);

  const trackerToggle = $("#trackerToggle");
  if (trackerToggle) {
    trackerToggle.addEventListener("click", () => {
      State.meta.trackerExpanded = !State.meta.trackerExpanded;
      if (State.meta.trackerExpanded) logEvent("Tracker expanded.", "info");
      renderTracker();
    });
  }

  const tracker = $("#tracker");
  if (tracker) {
    tracker.addEventListener("click", e => {
      const target = e.target;
      const dataset = target && target.dataset ? target.dataset : null;
      const action = dataset ? dataset.trackAction : null;
      if (!action) return;
      e.preventDefault();
      if (action === "save") {
        save(true);
        logEvent("Manual save complete.", "system");
      } else if (action === "export") {
        save();
        $("#saveArea").value = localStorage.getItem("dog_treat_tycoon_save") || "";
        switchTab("settings");
        logEvent("Export text updated.", "system");
      } else if (action === "settings") {
        switchTab("settings");
      }
      renderTracker();
    });
  }

  document.addEventListener("keydown", e => {
    const target = e.target;
    const tag = target && target.tagName ? target.tagName : "";
    if (tag === "INPUT" || tag === "TEXTAREA" || (target && target.isContentEditable)) return;
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    const index = parseInt(key, 10);
    if (index >= 1 && index <= DATA.buildings.length) {
      const [id, name] = DATA.buildings[index - 1];
      Game.lastBuildingSelected = id;
      let purchased = 0;
      if (e.ctrlKey || e.metaKey) {
        purchased = buyMultiple(id, 100);
      } else if (e.shiftKey) {
        purchased = buyMultiple(id, 10);
      } else {
        purchased = buyBuilding(id);
      }
      if (purchased > 0) {
        const label = purchased > 1 ? `${purchased} x ${name}` : name;
        Toasts.push(`Purchased ${label}`, "success");
      } else {
        Toasts.push(`Need more treats for ${name}`, "error");
      }
      e.preventDefault();
      return;
    }
    if (key === "m" && Game.lastBuildingSelected) {
      const def = getBuildingDef(Game.lastBuildingSelected);
      const purchased = buyMax(Game.lastBuildingSelected);
      if (purchased > 0) {
        Toasts.push(`Buy Max: ${purchased} x ${def ? def[1] : Game.lastBuildingSelected}`, "success");
      } else {
        Toasts.push("Not enough treats to Buy Max", "error");
      }
      e.preventDefault();
      return;
    }
    if (key === "p") {
      const potential = bonesGainIfAscend(State.treats);
      if (potential > 0 && confirm(`Ascend now for ${num.format(potential)} Alpha Bones?`)) {
        ascend();
      } else if (potential <= 0) {
        Toasts.push("No Alpha Bones available yet", "error");
      }
      e.preventDefault();
    }
  });
}

function switchTab(tabId) {
  document.querySelectorAll(".tabs button").forEach(b => b.classList.toggle("active", b.dataset.tab === tabId));
  document.querySelectorAll(".tab").forEach(panel => panel.classList.toggle("active", panel.id === tabId));
}

/* ================================
   LOOP
==================================*/
let lastTick = performance.now();
function tick() {
  const now = performance.now();
  const dt = Math.max(0, now - lastTick) / 1000;
  lastTick = now;

  const tps = totalTPS();
  const before = State.treats;
  State.treats += tps * dt;
  State.treats += State.interns * 0.25 * dt * Game.mod.click * Game.mod.global;
  let delta = State.treats - before;
  const tax = updatePolicy(delta, dt);
  if (tax > 0) {
    State.treats = Math.max(0, State.treats - tax);
    delta = State.treats - before;
  }
  recordMetrics(tps, delta, dt);
  if (State.meta.bulkDiscountTimer > 0) {
    State.meta.bulkDiscountTimer = Math.max(0, State.meta.bulkDiscountTimer - dt);
    if (State.meta.bulkDiscountTimer === 0) Game.mod = freshModifiers();
  }
  updateDispatch(dt);
  updateMarketing(dt);
  updateResearch(dt);
  updateSpace(dt);
  updateEvents(dt);

  Game.tracker.timer += dt;
  if (Game.tracker.timer >= Game.tracker.interval) {
    Game.tracker.timer = 0;
    renderTracker();
    evaluateAchievements();
    checkUnlocks();
  }

  render();
  requestAnimationFrame(tick);
}

/* ================================
   INIT
==================================*/
function init() {
  load();
  ensureStateIntegrity();
  Game.mod = freshModifiers();
  setupTabs();
  bindUI();
  renderBuildings();
  SpriteManager.init();
  applyOfflineProgress();
  logEvent("Pack HQ booted up.", "info");
  renderTracker();
  render();
  evaluateAchievements();
  checkUnlocks();
  updateTabVisibility();
  requestAnimationFrame(tick);
  setInterval(save, 30000);
}

document.addEventListener("DOMContentLoaded", init);











