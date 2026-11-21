# Building pages for a D&T exercise-book workbook

**Layout of the repo (/home/claude/bsp-dt-resources):** `book-kit/` is the shared engine (book.js, ink.js, book.css, harness.js, sound.js, tools/, docs/SPEC.md — never edit it; report needed changes). Each workbook is a folder (`material-properties/` is the finished reference: read some of its pages) with `index.html`, `config.js`, `docs/CONTENT.md` (the facts for that workbook), `pages/pNN-*.js`, `final-quiz.js`, `manifest.js` (generated). Wherever this spec says `lib/x` read `book-kit/x`, and `docs/CONTENT.md` is the one inside your workbook folder.

AQA GCSE D&T students (the year group is in the workbook's config/CONTENT) use this on **iPads** (Safari, touch only, landscape ~1180×820 or portrait ~820×1180, sometimes a laptop). It's a lined exercise book drawn in blue biro: you turn pages, read short notes, watch pen-drawn animations, run little experiments, play games and answer questions. **Every answer is auto-saved to the teacher** (blanks too), so every activity must be recorded through the ui kit.

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
  the tags listed in your workbook's `config.js` under `mis:` (also listed at the end of its CONTENT.md).
- Wrong answers must **teach**: show why it's wrong and what's right (the kit does this when you give `why`/`explain`).
- Every page ends with something that checks understanding of that page.

## Never give the answer away on the page (the teacher checked this!)
- Nothing visible before or while a student answers may state that answer: no notes box, caption, canvas label, animation text or earlier feedback on the same page that hands over the exact answer to a question, sort, match, blank or prediction below it.
- Teach first, then make them **recall**: put the notes above, and blur them during the activity with `ui.hideWhile(actEl, activityId, [elements])` (every `ui.*` activity builder returns its element; it blurs from the first tap until the activity is right or checked 3 times; works for retryable activities: sort, fill, match, mcq). For one-shot activities (tf) or custom ones, add/remove the CSS class `peek-lock` on the elements yourself (on an `.ink-anim` canvas put it on its `.ink-anim-wrap` parent). Tell students in one line that the notes will blur.
- Experiments: the result (values, order, labels like "VERY HARD") appears only after the student has predicted/tested. Captions describe what happened, not the name of the property being asked about next.
- Calculations: never print an intermediate answer the student was asked to work out; echo **their own** earlier answer into the next line instead (see p03 `p03.calc` in material-properties: `.vol-echo`).
- MCQ options: similar length and detail; the right one must not stand out. Wrong-answer explanations must not give away the next question.

## Interaction & layout (iPad!)
- Touch first: tap targets ≥ 44 px, no hover-only things, no tiny drag handles. For canvas interactions use **pointer events** (`pointerdown/move/up`), `touch-action: none` on the canvas while dragging, and map coordinates with `getBoundingClientRect()` (canvases are CSS-scaled; their logical size is the width/height you set).
- Content width is about **860 px** at landscape (less in portrait — must still work at ~640 px). Make canvases `w: 860` logical and let them scale (`ui.anim` does). Text on canvases ≥ 22 px logical.
- Body text: short sentences, ≤ 3 lines per paragraph, key words in `<b>` or `<span class="key">`. Use `ui.box(html, {tag:'Notes'})` for the key definitions students must learn.
- Animations: `ui.anim({ w, h, duration, poster, draw(k,t), sound(k) })` — a pen draws on the paper (strokes over time with the moving pen), plays when tapped. Typical 8–20 s. Use `poster:` (a time) so the page doesn't show an empty box before it's played (show the setup, not the answer). Add `sound(k)` with pen strokes in sync (`k.play('stroke', t, {material:'pen', dur, gain:.5})`, `success`, `error`, `pop`, `paper`) — keep it gentle.
- For interactive canvas experiments, write your own render loop with the Ink helpers: `Ink.stroke(ctx, pts, {color, w, p})`, `Ink.hatchFill`, `Ink.hatchShadow`, `Ink.drawBubble`, `Ink.geo` (rect, ellipse, curve, head). Set `ctx.globalCompositeOperation = 'multiply'` so ink sits *in* the paper (transparent canvas over the lined page). Cache static drawings in offscreen canvases; animate only what moves. Use `Book.sfx(name, params)` for sounds (`tick`, `pop`, `success`, `error`, `thud`, `stamp`, `paper`, `stroke`...).
- Stop your own loops when the page is hidden (check `root.closest('.page').classList.contains('hidden')` each frame and skip work).

## Testing
```
cd /home/claude/bsp-dt-resources
python3 book-kit/tools/shot.py /tmp/nb-NN --book <folder> --pages 3 --full                 # iPad landscape, scrolls through long pages
python3 book-kit/tools/shot.py /tmp/nb-NN-p --book <folder> --pages 3 --full --size 820x1180  # portrait
python3 book-kit/tools/shot.py /tmp/x --book <folder> --pages 3 --script "document.querySelector('.ink-anim')._inkAnim.seek(6)"
```
(Google Fonts are blocked in this sandbox so screenshots use fallback fonts; that's expected.) **Look at every screenshot** with the Read tool. Also script real interactions with Playwright (tap answers, run your experiment) and check that `Book.state.items` holds what you expect. Zero console errors.

## Report back
1–2 lines per page on what it does and roughly how many minutes; every fact shown (compact list) for checking against CONTENT.md; the activity ids + labels + max marks; best screenshot paths; known issues.

## Kit hooks added for themed / long-writing books
- `Ink.FONTS = { bubble, hand, bubbleWeight }`: canvas fonts. A theme can replace them (and recolour `Ink.BLUE/RED/GREEN` in place).
- `Book.saveNow()`: send the current page to the backend now (event `save`), for pages where students write for a long time.
- `BOOK_CONFIG.hideScores`: the finish page shows boxes filled instead of a score.
- `window.__NOGATE = 1`: set by the test tools to skip a workbook's own password lock.


**Site password:** every HTML page must load the site password screen as the first thing in `<head>`: `<script src="../gate.js"></script>` (or `gate.js` at the repo root). It is skipped automatically on localhost, so local testing is unaffected.

## iPad version (no sign-in, no data)
`python3 book-kit/tools/make_solo.py <folder>` writes `<folder>/ipad/` (index.html, app.webmanifest, sw.js).
The iPad page loads `book-kit/solo.js` after config.js: results server off, name + class only on the cover, answers kept on the device
under a separate key, and a **Save this page as PDF** box at the end of every page (A4 PDF with name / page / time, shared via the iPad
share sheet: Showbie, Save to Files). `sw.js` caches every file so it works offline after the first visit (Add to Home Screen).
Re-run make_solo.py after changing a workbook. `gate.js` lets `/ipad/` pages through the maintenance screen (they send no data).
