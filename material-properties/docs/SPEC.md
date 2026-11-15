# Building pages for the Material properties exercise book

Year 10 AQA GCSE D&T students use this on **iPads** (Safari, touch only, landscape ~1180×820 or portrait ~820×1180, sometimes a laptop). It's a lined exercise book drawn in blue biro: you turn pages, read short notes, watch pen-drawn animations, run little experiments, play games and answer questions. **Every answer is auto-saved to the teacher** (blanks too), so every activity must be recorded through the ui kit.

The whole lesson is 60 minutes over 11 pages → each page is **4–7 minutes** of work. Keep reading short; make students *do* things.

## Files & rules
- Your page(s) live in `pages/pNN-name.js` (the file already exists as a stub; replace it). Touch nothing else (not `lib/`, `index.html`, other pages). If you think the shared kit needs a change, say so in your report instead.
- Read **fully** first: `docs/CONTENT.md` (the facts: only teach/test what's there, UK spelling), `lib/book.js` (the ui kit API at the top), `lib/ink.js` (the pen-drawing kit API at the top), and the finished sample `pages/p01-starter.js`.
- The style is the Ballpoint Notebook: blue Bic ink (Ink.BLUE), red pen for corrections/emphasis (Ink.RED), occasional green tick (Ink.GREEN). Bubble-letter headings (`ui.h`), handwriting (Gloria Hallelujah) and Fredoka for labels. Wobbly pen lines, hatching for shading (`k.hatch`), hatched drop shadows (`k.box`/`k.shadow`). The full reference style lives at `/home/claude/papercraft-explainer-kit/styles/ballpoint-notebook/` (style-prompt.md + reference-explainer.js) if you want to study it. Draw subjects accurately (a real wax-and-pin rod, a real tensile test piece, etc.).
- `Book.page({ id, title, build(ui, root) })` — one call per page, ids `p02`…`p11` as in index.html.

## Activities & recording
- Use the ui kit (`ui.mcq`, `ui.tf`, `ui.fill`, `ui.write`, `ui.sort`, `ui.match`, `ui.predict`, `ui.rate`). For custom interactives (experiments, games) use `const r = ui.record(id, { label, type, max })` and call `r.set({ answer, correct, score, max, mis })` whenever the student does something meaningful (answer = a short human-readable string the teacher can read, e.g. `"predicted: oak floats ✓, ebony floats ✗"`).
- **ids** are stable and unique: `'p03.float-predict'`. **label** = what the teacher sees in the dashboard, short and specific (e.g. `"Float/sink predictions (8 blocks)"`).
- **mis** = misconception tags (comma-separated) when a wrong answer reveals one. Use these tags only:
  `hard-vs-tough` · `strong-vs-hard` · `malleable-vs-ductile` · `density-vs-weight` · `elastic-vs-stretchy` · `metal-feels-cold` · `brittle-vs-weak` · `heat-vs-electricity` · `absorbency` · `fusibility-thermoset` · `physical-vs-working` · `conductor-insulator`
- Wrong answers must **teach**: show why it's wrong and what's right (the kit does this when you give `why`/`explain`).
- Every page ends with something that checks understanding of that page.

## Interaction & layout (iPad!)
- Touch first: tap targets ≥ 44 px, no hover-only things, no tiny drag handles. For canvas interactions use **pointer events** (`pointerdown/move/up`), `touch-action: none` on the canvas while dragging, and map coordinates with `getBoundingClientRect()` (canvases are CSS-scaled; their logical size is the width/height you set).
- Content width is about **860 px** at landscape (less in portrait — must still work at ~640 px). Make canvases `w: 860` logical and let them scale (`ui.anim` does). Text on canvases ≥ 22 px logical.
- Body text: short sentences, ≤ 3 lines per paragraph, key words in `<b>` or `<span class="key">`. Use `ui.box(html, {tag:'Notes'})` for the key definitions students must learn.
- Animations: `ui.anim({ w, h, duration, poster, draw(k,t), sound(k) })` — a pen draws on the paper (strokes over time with the moving pen), plays when tapped. Typical 8–20 s. Use `poster:` (a time) so the page doesn't show an empty box before it's played (show the setup, not the answer). Add `sound(k)` with pen strokes in sync (`k.play('stroke', t, {material:'pen', dur, gain:.5})`, `success`, `error`, `pop`, `paper`) — keep it gentle.
- For interactive canvas experiments, write your own render loop with the Ink helpers: `Ink.stroke(ctx, pts, {color, w, p})`, `Ink.hatchFill`, `Ink.hatchShadow`, `Ink.drawBubble`, `Ink.geo` (rect, ellipse, curve, head). Set `ctx.globalCompositeOperation = 'multiply'` so ink sits *in* the paper (transparent canvas over the lined page). Cache static drawings in offscreen canvases; animate only what moves. Use `Book.sfx(name, params)` for sounds (`tick`, `pop`, `success`, `error`, `thud`, `stamp`, `paper`, `stroke`...).
- Stop your own loops when the page is hidden (check `root.closest('.page').classList.contains('hidden')` each frame and skip work).

## Testing
```
cd /home/claude/bsp-dt-resources/material-properties
python3 tools/shot.py /tmp/nb-NN --pages 3 --full                 # iPad landscape, scrolls through long pages
python3 tools/shot.py /tmp/nb-NN-p --pages 3 --full --size 820x1180  # portrait
python3 tools/shot.py /tmp/x --pages 3 --script "document.querySelector('.ink-anim')._inkAnim.seek(6)"
```
(Google Fonts are blocked in this sandbox so screenshots use fallback fonts; that's expected.) **Look at every screenshot** with the Read tool. Also script real interactions with Playwright (tap answers, run your experiment) and check that `Book.state.items` holds what you expect. Zero console errors.

## Report back
1–2 lines per page on what it does and roughly how many minutes; every fact shown (compact list) for checking against CONTENT.md; the activity ids + labels + max marks; best screenshot paths; known issues.
