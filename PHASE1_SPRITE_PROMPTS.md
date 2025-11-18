Dog Treat Tycoon — Phase 1 Sprite Prompts

Scope
- Deliver 2 dog idle sprites (48x48), 3 core UI icons (16x16), and 3 thin banners (800x80).
- Style: crisp pixel art, limited palette, 1–2 px outline, 2–3 tone shading. Transparent backgrounds for sprites/icons.
- Palette anchors (suggested):
  - Background: #0f0f12, #17171b
  - Accent Orange: #ffb74d
  - Accent Blue: #5ec8f2
  - Good Green: #8bc34a
  - Danger Red: #ff6b6b
  - Text/Lines: #eeeeef (light), #b3b3bd (muted)

General Instructions
- Pixel size: exact target sizes (no scaling in final export). If you work at 8–10x, downscale with nearest-neighbor only.
- Anti-aliasing: off. Keep edges crisp; avoid gradients and soft brushes.
- Outlines: use 1–2 px darker outline for readability against dark UI.
- Shading: 2–3 tones per material; keep clusters clean; avoid banding.
- File format: PNG with transparency (sprites/icons). Banners can be PNG (opaque) over dark background.
- Naming: match exactly as listed below.

Dogs (48x48 each)
1) scout-idle.png
- Artist brief: Friendly mid-sized dog in idle pose facing forward or slight 3/4 right. Light brown/tan short fur with cream chest/cheeks, small triangular ears, bright eyes, a small blue bandana for a pop of color. Subtle 2-tone shading to suggest volume. Cute and readable at 48x48.
- Composition: centered, full body fits within 48x48, 1–2 px outline, transparent background.
- Color: keep fur to ~4–6 colors total (incl. outline/shades). Use #5ec8f2 for bandana highlight if it fits palette.
- Animation: not required for Phase 1 (idle single frame only). Leave a bit of headroom for later wag/blink.
- AI prompt (Stable Diffusion-like):
  pixel art, 48x48 game sprite, cute mid-sized dog idle pose facing forward 3/4 right, light brown/tan short fur with cream chest and cheeks, small triangular ears, blue bandana accent, clean 1–2 px dark outline, simple 2–3 tone shading, crisp edges, transparent background, limited palette, no anti-aliasing, no gradients
- Negative prompt: photorealistic, blur, smear, anti-aliased edges, vector, gradients, high-res painting, extra limbs

2) patch-idle.png
- Artist brief: Loyal companion dog with white fur and a single warm-brown patch over one eye (“Patch”), short fur, floppy ears, red bandana. Same style and proportions as Scout for consistency.
- Composition: centered full body, 1–2 px outline, transparent background, fits 48x48.
- Color: white + brown patch + 2–3 tones for shading; use #ffb74d/#8bc34a accents sparingly if desired.
- AI prompt:
  pixel art, 48x48 game sprite, friendly dog idle pose facing forward 3/4 right, white short fur with a single brown eye patch, floppy ears, red bandana, clean 1–2 px dark outline, simple 2–3 tone shading, crisp edges, transparent background, limited palette, no anti-aliasing, no gradients
- Negative prompt: photorealistic, blur, smear, anti-aliased edges, vector, gradients, high-res painting, extra limbs

Core Icons (16x16 each)
Export at exact 16x16 with transparent background. Keep shapes bold and instantly readable.

3) treat.png
- Artist brief: Biscuit/bone-shaped treat icon; warm cookie color; 1 px outline, a highlight pixel cluster, one shadow cluster.
- AI prompt:
  pixel art icon, 16x16, biscuit bone-shaped dog treat, warm cookie color, 1 px dark outline, 2–3 tone shading, crisp edges, transparent background, limited palette, no anti-aliasing
- Negative: blur, gradients, thin unreadable shapes, photorealism

4) bone.png (Alpha Bone)
- Artist brief: Special “Alpha Bone” with subtle glow. Use a small inner highlight and a minimal outer glow that still reads at 16x16.
- AI prompt:
  pixel art icon, 16x16, stylized glowing bone, subtle halo highlight, 1 px outline, 2–3 tone shading, crisp edges, transparent background, limited palette, no anti-aliasing
- Negative: heavy bloom, blur, gradients, photorealism

5) timer.png
- Artist brief: Tiny circular clock or stopwatch with a clear hand at a readable angle (e.g., 2 o’clock). Keep bezel strong and readable at 16x16.
- AI prompt:
  pixel art icon, 16x16, circular clock/stopwatch with clear minute hand, strong bezel, 1 px outline, 2–3 tone shading, crisp edges, transparent background, limited palette, no anti-aliasing
- Negative: thin lines, blur, gradients, photorealism

Banners (800x80 each)
Notes
- These are wide, thin, horizontal “scenes” that sit behind UI panels. Work with dark backgrounds and warm industrial highlights. Use simple parallax: background silhouettes, midground machines, foreground table/props. Avoid tiny details that will be lost; aim for bold shapes.
- Export: exact 800x80 PNG (opaque). Keep edges crisp; avoid noisy dither.

6) starter.png
- Scene brief: Empty factory floor. One simple wooden/metal table with a few treats on top. Minimal equipment; clean and sparse. Dark gray background walls, warm lighting hints.
- Composition guide:
  - Background: dark wall panels/pillars silhouettes (#0f0f12/#17171b)
  - Midground: a single table centered/offset, small crates
  - Foreground: subtle floor tiles/lines, soft vignette
- AI prompt:
  wide pixel art background, 800x80, empty cozy factory interior, dark gray walls, single simple table with a few dog treats on top, warm accent lighting, clean industrial vibe, crisp pixels, limited palette, no anti-aliasing, no gradients
- Negative: clutter, high detail micro-text, blur, photorealism

7) first-building.png
- Scene brief: Early growth. One small farm plot visible with sprouting ingredients in background. Scout and/or Patch peeking in (very small), excited. Still fairly minimal.
- Composition guide:
  - Background: factory interior opens to a window/door showing a small sprouting plot
  - Midground: a compact oven shell or tool silhouette
  - Foreground: a small box of treats, tiny dog cameo
- AI prompt:
  wide pixel art background, 800x80, cozy factory interior with a window/door revealing a small farm plot sprouting ingredients, minimal early equipment, tiny cute dog cameo looking excited, warm industrial palette, crisp pixels, limited palette, no anti-aliasing, no gradients
- Negative: busy clutter, blur, photorealism

8) growing.png
- Scene brief: Several plots and an oven visible; light steam; signs of activity; a sense of ramping production. Dogs working in background silhouettes.
- Composition guide:
  - Background: multiple plot silhouettes and piping
  - Midground: one oven with a small steam plume
  - Foreground: conveyor segment with a few treats
- AI prompt:
  wide pixel art background, 800x80, factory floor with multiple farm plots and one oven producing light steam, treats moving on a small conveyor segment, subtle workers/dog silhouettes, warm inviting industrial style, crisp pixels, limited palette, no anti-aliasing, no gradients
- Negative: over-detailed machinery, blur, gradients, photorealism

Export & Delivery
- Dogs: 48x48 PNG, transparent background, centered; filename: scout-idle.png, patch-idle.png.
- Icons: 16x16 PNG, transparent background; filename: treat.png, bone.png, timer.png.
- Banners: 800x80 PNG (opaque); filename: starter.png, first-building.png, growing.png.
- Consistency: Keep line weight, outline shade, and contrast consistent across all assets.
- Optional workflow tip: draw at 8–10x, then scale down with nearest-neighbor. Verify at 1x for readability.

Folder Paths (preferred)
- Dogs: assets/img/sprites/dogs/
- Icons: assets/img/sprites/ui/
- Banners: assets/img/banners/

Style Lock Checklist (quick QA before export)
- [ ] Sizes match exactly (48x48, 16x16, 800x80)
- [ ] Edges crisp, no anti-aliased pixels
- [ ] 1–2 px outlines used where relevant
- [ ] 2–3 tone shading per material
- [ ] Transparent backgrounds for sprites/icons
- [ ] Naming and folder paths match

