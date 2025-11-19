# Special Environments & Constraints

Use this file to describe **special environments, tools, and constraints** that LLMs
should respect when working on **Dog Treat Tycoon / doggydogworld**.

---

## 1. Target Platforms

- [x] Browser (desktop)
- [x] Browser (mobile)
- [ ] Steam / Desktop client
- [ ] Mobile app (iOS / Android)
- [ ] Other: …

Notes:
- **Primary target:** Web/mobile webapp (responsive design)
- **Secondary/future targets:** Potential ports to other platforms (not immediate priority)

## 2. Runtime & Engines

- **Primary runtime:** Pure HTML/CSS/JS in browser
- **Framework restrictions:**
  - NO React, Vue, Angular, or heavy frameworks at runtime
  - Vanilla JavaScript (ES5-safe where possible for broad compatibility)
  - NO build step required (runs directly from index.html)
- **Future considerations:** Possible Love2D port mentioned in design docs

## 3. Build & Tooling

- **Build tools:** NONE currently
  - Pure vanilla HTML/CSS/JS
  - No transpilation, bundling, or compilation required
- **Package manager:** None required for runtime
  - May use npm/yarn for development tooling if needed in future
- **Testing frameworks:** None currently implemented
  - May add Vitest or similar in future

## 4. Performance & Size Constraints

- **Max bundle size target:** Keep reasonable for low-end devices
  - Current main.js: ~76KB (acceptable)
  - Target: Under 200KB total for core game
- **Devices we especially care about:**
  - Low-end Android devices
  - Mobile browsers (iOS Safari, Chrome Mobile)
  - Older desktop browsers (ES5 compatibility maintained)
- **FPS or smoothness expectations:**
  - Sprite animations: 60 FPS via RAF
  - UI updates: Throttled to 6-10 FPS for efficiency
  - Game loop: Smooth idle progression

## 5. LLM Environment Notes

- **Typical model(s) used:**
  - Claude Sonnet 4.5 (current session)
  - Supports complex multi-file operations
- **Available tools:**
  - ✓ File system read/write access
  - ✓ Git operations (on branch `claude/setup-master-orchestrator-01AuUvPxz9nHd9DfkNfeAmhz`)
  - ✓ Bash command execution
  - ✓ Code analysis and refactoring
- **Token or context limits to keep in mind:**
  - Budget: 200K tokens per session
  - Prefer focused, incremental changes over massive rewrites

## 6. Anything to Avoid

- **Libraries / patterns to avoid:**
  - Heavy frameworks (React, Vue, Angular)
  - Complex build pipelines
  - External dependencies that break offline-first design
  - Optional chaining (?.) and nullish coalescing (??) for ES5 compatibility
- **Tech debt areas to leave alone for now:**
  - None specified (all areas open for improvement)
- **Other "do not touch" zones:**
  - Must maintain offline-first capability
  - Must preserve save/load functionality
  - Must keep data-driven content approach (configs, not hardcoded logic)

## 7. Design Constraints

- **Offline-first:** Game must run fully offline (localStorage for saves)
- **Data-driven:** Buildings, upgrades, research, events, etc. should be in DATA objects
- **Clean separation:** Game logic vs. UI rendering kept separate
- **Mobile-friendly:** Responsive design, touch-friendly controls
- **Accessibility:** Support reduced motion, clear visual hierarchy

---

**Last updated:** 2025-11-19 by Master Orchestrator
