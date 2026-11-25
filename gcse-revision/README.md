# GCSE Design & Technology revision app (AQA 8552 Paper 1)

The GCSE sister of `alevel-revision`: a Home page with red/amber/green progress, a revision booklet per specification
section (3.1.1 to 3.3.11), a built-in self-check, and a results page that emails the revision list to the teacher.

It **shares the engine** with the A level app: `src/build.py` reads `../alevel-revision/src/engine.js`. Only what is
different lives here:

- `src/app.html` – the shell, with the GCSE look added at the end of the styles (exercise-book paper, handwritten headings, like the GCSE workbooks).
- `src/spec.js` – `APP` (title, save key, spec codes shown for each topic, the three paper sections, AQA mark bands) and `TOPICS`.
- `src/booklets/*.js` – one per spec section. Each file first adds its self-check rows with `SPEC.push([...])`, then its booklet with `BOOKLETS.push({...})`. Block types are the same as the A level app (see its README).

Build with `python3 src/build.py` (jsPDF 2.5.2 and html2canvas 1.4.1 must be in `alevel-revision/src` while building).
A change to the engine needs both apps rebuilding. Saved work: localStorage `dt-revision-8552-v1`, on the device only.

AQA marks answers of 6 marks or more by band, so the app shows the band table for those instead of a points list
(`APP.levelled` and `APP.LV` in `spec.js`; the band summaries are our own wording).
