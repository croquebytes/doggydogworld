# DoggyDogWorld – LLM Orchestration Pack

This folder is meant to be dropped into your **Dog Treat Tycoon / doggydogworld** repo
to give your LLM agents a shared set of prompts and structure.

It contains:

- `orchestrator/`
  - **MASTER_ORCHESTRATOR_PROMPT.md** – main “boss” prompt for a supervising LLM.
  - **EXECUTE_MASTER_ORCHESTRATOR_PROMPT.md** – a short starter prompt you paste to kick things off.
- `roles/`
  - Specialized job prompts for:
    - Repo Architect & Systems Planner
    - Core Game Systems & Balancing
    - UI/UX & Frontend Implementation
    - Events, LiveOps & Monetization
    - Content, Flavor & Achievements
    - Notetaker / Tracker
- `references/`
  - Place to store design docs, research, and notes.
- `env/`
  - Template for describing special environments (engines, stacks, constraints).

## How to use

1. Add this folder into your repo (e.g. `llm/` or `doc/llm/`).
2. Open `orchestrator/EXECUTE_MASTER_ORCHESTRATOR_PROMPT.md`.
3. Copy the content into your LLM (or point your coding agent at this file).
4. Answer its questions about:
   - Repo root and structure
   - Environment / tools available
   - Immediate priorities (architecture, systems, UI, events, etc.)
5. The orchestrator will then:
   - Read the repo & reference docs (as far as the tooling allows),
   - Propose a plan,
   - Use the role prompts in `roles/` to drive focused implementation work,
   - Ask you to confirm key decisions.

You can also give the **Notetaker / Tracker** job to a separate LLM instance to
maintain a running project log and TODO board, using the templates in `references/`.
