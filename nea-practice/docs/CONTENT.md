# NEA practice run (AQA GCSE D&T 8552 NEA)

A practice design folder. Students do a short project set by the teacher and fill this book in as they go.

- **Pages:** cover · 1 What is the NEA? · 2 Your practice project (set in `config.js` → `project`) · 3–8 Sections A–F · 9 Check yourself.
- **Sections and boxes:** all in `rubric.js` (what / why / what the moderator looks for / tips, and every fill-in box). Edit there; pages build from it.
- **Section marks:** A 10, B 10, C 20, D 20, E 20, F 20 = 100; about 30–35 hours in the real NEA.
- **Tracking:** every box saves its text, first-answered and last-changed time, number of edits and word count. Long-writing pages also push to the teacher at most once a minute while a student types.
- **Indicative marks (teacher only):** `NEA.score()` in `rubric.js`: length 35%, criteria covered 50%, structure (lists, numbers, “because…”) 15%. Shown in the dashboard's 📐 NEA marks tab with a box-by-box breakdown. Students never see them (`hideScores: true`). Not a moderated mark.
- **Look:** Sketchbook Graphite (`sketchbook.css`, `nea.js`): cream cartridge paper, graphite ink, Caveat + IBM Plex Mono, spiral binding.
- **Lock:** `config.js` → `gateHash` (SHA-256 of the password). Light protection only: the files are public on GitHub. Set to `''` to open it. The book is registered in `workbooks.js` with `hidden: true` and is not linked from the homepage.
- After changing boxes: `python3 book-kit/tools/make_manifest.py nea-practice`.
- **Photos:** each section page has a “Your sketchbook evidence” gallery (`photos.js`), and every box has “📷 add a photo for this box”. Students can also paste or drag images onto any box. Photos are shrunk to ~1600 px JPEG, kept on the device (IndexedDB) and uploaded privately to the teacher's Drive (“Exercise book images / <lesson> / <email>”) via `Code.gs` (`a=img`). Each is tagged to a box and captioned; the list is saved as the `nea.<section>.photos` activity. Students see only their own photos; the dashboard fetches thumbnails with the PIN.
