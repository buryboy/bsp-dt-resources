# NEA practice run (AQA GCSE D&T 8552 NEA)

A3 landscape practice folder built with `../nea-kit` (sketchbook look). Students do a short project set in `config.js → project`.

- **Sheets (23):** What is the NEA? · Your practice project · Section A ×4 · B ×2 · C ×4 · D ×4 · E ×3 · F ×3 · Check yourself.
- **Boxes, marks, guidance and layouts:** `rubric.js` (A 10, B 10, C 20, D 20, E 20, F 20 = 100). Intro/outro sheets: `pages/sheets.js`.
- **Teacher only:** 📐 NEA marks tab: indicative marks per section, boxes filled, words, photos/sketches with thumbnails, last edit. `hideScores: true`.
- **Lock:** `config.js → gateHash`. Light protection only. Hidden from the homepage.
- After changing sheets: `python3 book-kit/tools/make_manifest.py nea-practice`.
