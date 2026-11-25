# BSP Design & Technology – Interactive Resources

Interactive workbooks for The British School of Paris D&T department, hosted with GitHub Pages.

**Live site:** https://buryboy.github.io/bsp-dt-resources/

| Folder | Resource |
|---|---|
| `woods-and-timbers/` | GCSE (AQA) Woods & Timbers – 8 levels |
| `ks3-electronics/` | KS3 Circuit Lab – 13 levels |
| `tin-can-lamp/` | Year 9 upcycled tin can lamp workbook (student picks a 1960s or 1980s theme). Self-contained page in `tin-can-lamp/ipad/` |
| `critical-path/` | Y13 A level revision workbook: critical path analysis (Edexcel 9DT0 topic 12.2a), worked example, what-if delays, kettle launch case, plan your own NEA with CPA, exam practice. Self-contained page in `critical-path/ipad/` |
| `alevel-revision/` | A level Product Design revision app (Edexcel 9DT0 Paper 1). Opens on a Home page listing topics 1–12 with red/amber/green progress; one revision booklet per topic (notes, key words, quizzes with instant feedback, exam questions with self-marking, NEA prompts); built-in self-check and revision list to email; backup/restore. Booklets live in `src/booklets/`; see `src/README.md`. |
| `alevel-self-check/` | Replaced by `alevel-revision/`: now redirects there (ratings carry over). |
| `grooved-pine/` | Y12 A level (Edexcel) project booklet: The Grooved Pine Challenge, NEA grids 1–4 with hints. One self-contained page in `grooved-pine/ipad/` (draw, photos, resizable boxes, A3 PDF export) |
| `lab-breakout/` | GCSE material properties escape room: team stations on computers plus a vault puzzle for the interactive whiteboard. Student access has no password; board and teacher menu use a teacher PIN (default 0000, see `TPIN` in the file). `team-sheets.pdf` is the printable answer sheet for each team |

Each folder is self-contained. To add a new set, add a new folder with its own `index.html` and a card on the homepage (`index.html`).

## iPad sites (open versions)

`book-kit/tools/build_ipad_site.py ../ipad-sites` builds the separate open website (no sign-in, nothing sent anywhere).
Its front pages come from `ipad-home/`: run `book-kit/tools/make_home.py` after changing `ipad-home/data.json`.

- **Home:** I'm a student (KS3 / KS4 / KS5 workbooks) · I'm a teacher (subject → D&T → AQA 8552 topics with board pages, notes sheets, PowerPoints and print packs). Print packs on the site have their answer key removed; Kahoot files are not published.
- **NEA stage introductions:** board slideshows for each AQA GCSE NEA section (A to F) and each Edexcel A level grid (1 to 11), at `teacher/dt/nea/`. Content is in `book-kit/tools/nea_gcse.py` and `nea_alevel.py`; rebuild with `make_nea_decks.py`.
- **Updates:** every iPad workbook has a *Check for updates* button (`book-kit/updater.js`). After you change a workbook, re-run `make_solo.py` / `make_solo_pages.py` and rebuild the site; students tap the button (or get a prompt when they next open it online) and new pages appear. Answers are kept because they are stored on the iPad by page id and question id, so **add pages freely, but never rename or reuse an existing page or question id** (answers saved under the old id would no longer show).
