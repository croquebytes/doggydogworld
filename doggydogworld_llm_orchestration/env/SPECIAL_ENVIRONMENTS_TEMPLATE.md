# Special Environments & Constraints – Template

Use this file to describe **special environments, tools, and constraints** that LLMs
should respect when working on **Dog Treat Tycoon / doggydogworld**.

Fill in whatever is relevant; leave sections blank if not applicable.

---

## 1. Target Platforms

- [ ] Browser (desktop)
- [ ] Browser (mobile)
- [ ] Steam / Desktop client
- [ ] Mobile app (iOS / Android)
- [ ] Other: …

Notes:
- Primary target:
- Secondary/future targets:

## 2. Runtime & Engines

- Primary runtime: (e.g. “pure HTML/JS in browser”, “Love2D for future port”, etc.)
- Any engines/frameworks allowed at runtime:
  - e.g. “No React; minimal use of Vite only for dev builds.”

## 3. Build & Tooling

- Build tools (if any):
  - e.g. Vite, Webpack, esbuild, none, etc.
- Package manager:
  - e.g. npm / pnpm / yarn / none.
- Testing frameworks:
  - e.g. Jest, Vitest, none yet.

## 4. Performance & Size Constraints

- Max bundle size target (if any):
- Devices we especially care about (low-end Android, etc.):
- FPS or smoothness expectations:

## 5. LLM Environment Notes

- Typical model(s) used:
  - e.g. GPT-5.1 Thinking, Claude, etc.
- Available tools:
  - e.g. File system access, ability to run code, ability to browse, etc.
- Token or context limits to keep in mind:

## 6. Anything to Avoid

- Libraries / patterns to avoid:
- Tech debt areas to leave alone for now:
- Other “do not touch” zones:

---

Keep this file updated as your environment evolves. The **Master Orchestrator** and other
role prompts should check this file (or its contents) when deciding how to implement changes.
