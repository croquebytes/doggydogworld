# Sprite Atlas Drop Zone

Place sprite sheets here using pixel-friendly PNGs. Suggested layout:

- dogs/ — hero dogs, companions, mascots (rows per state: idle/wag/blink/hop).
- ui/ — celebration bursts, click pips, other VFX.

Preferred specs:

- Frame size: 32x32 or 48x48 pixels (consistent per sheet).
- Rows group states, columns store frames.
- Keep palettes limited for crisp pixel art; use transparent backgrounds.

See `sprite.js` for how the runtime reads `frameWidth`, `frameHeight`, and `states`.
