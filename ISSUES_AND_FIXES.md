# Dog Treat Tycoon — Issues and Fixes (current)

This note tracks user‑reported problems and the changes applied.

## Reported Problems
- Building Buy/Buy Max buttons appear to do nothing
- Cannot trigger the Buy function for the first building (Farm Plot) even with sufficient treats
- Upgrade purchases don't trigger
- Hard Reset button doesn't reset the game
- Toast notifications obstruct center of screen

## Root Causes Found
- Event delegation depended on event.target.dataset.* only; in some browsers/click targets, the dataset wasn’t read, so clicks were ignored.
- Buttons are nested inside cards; some clicks land on inner elements, not the <button> itself.
- If a runtime error occurred before bindUI() ran, no buttons would function, including Hard Reset.

## Fixes Applied
- Added resilient click handling that walks up to the nearest <button> and falls back to getAttribute('data-...') for all systems:
  - Buildings/Buy‑Max, Upgrades, Research Queue, Dispatch Missions, Marketing Campaigns, Space Routes, Policy Perks, Event Cards.
- Moved toast stack to the top‑right (top‑center on mobile) to avoid overlap with content.
- Strengthened Hard Reset flow and added a global error capture to surface errors as toasts.
- Preserved ES5‑safe code paths (no optional chaining/nullish coalescing, safeLog10, etc.).

## Next Observability Steps
- Global error hook: shows a toast if any unhandled error happens.
- If issues persist, please capture the text shown in the toast and/or browser console.
