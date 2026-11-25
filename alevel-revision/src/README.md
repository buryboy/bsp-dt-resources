# A level Product Design revision app (Edexcel 9DT0 Paper 1)

One iPad app: a Home page (always the first thing it shows), a revision booklet per topic, the self-check, and a results page that emails the revision list to the teacher (the first line of that email is what `teacher/dt/self-check-tally.html` looks for).

## Files
- `app.html` – page shell and styles.
- `engine.js` – Home, booklet player, self-check, results, progress, backup/restore, PDF.
- `spec.js` – the 44 spec points used by the self-check (also read by `book-kit/tools/make_home.py` for the tally page).
- `booklets/*.js` – one file per topic, loaded in name order. Each calls `BOOKLETS.push({ id, topic, title, pages: [...] })`.
- `build.py` – builds `../ipad/index.html` and bumps the cache in `../ipad/sw.js`. Put `jspdf.umd.min.js` (2.5.2) and `html2canvas.min.js` (1.4.1) next to it first.

## Adding a booklet
Copy an existing booklet file and change `id` (short, never reused), `topic` and `title`. A page is `{ t: 'Title', spec: '4.1', blocks: [...] }`. Block types:
`notes` (HTML) · `tip` · `keys: [[term, meaning]]` · `mcq: [[question, [options], correctIndex, why]]` · `tf: [[statement, true/false, why]]` ·
`sort: { q, cats: [...], items: [[text, catIndex]] }` · `match: { q, lh, rh, pairs: [[left, right]] }` · `gap: { text with {{answers}}, extra: [...] }` ·
`order: { q, steps: [in the right order] }` · `calc: [[question, answer, tolerance, unit, working]]` · `exam: [[question with **command word**, marks, [mark scheme points]]]` · `nea: 'prompt'`.

Answers are saved by a hash of the question text, so editing a question's wording resets that one question for students; adding pages or questions does not affect saved work.
Saved data: localStorage `pd-revision-9dt0-v1` (on first run it copies ratings from the old self-check, `pd-selfcheck-9dt0-v1`). The critical path workbook keeps its own save (`cpa-y13-v1`); Home estimates its progress from that.
