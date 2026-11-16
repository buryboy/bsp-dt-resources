# Builder brief (all workbooks)

You are building pages of an interactive iPad exercise-book workbook for Year 10 AQA GCSE Design & Technology. Repo root: /home/claude/bsp-dt-resources.

1. Read `book-kit/docs/SPEC.md` first and follow it exactly. It tells you what else to read: the API headers of `book-kit/book.js` and `book-kit/ink.js`.
2. Read your workbook's `docs/CONTENT.md` (the only source of facts, and the misconception tag ids) and `docs/PAGES.md` (the brief for each page: ids, activities, record ids).
3. Study finished pages for the standard expected (blue biro on lined paper, pen-drawn canvases that the student operates by touch, predict → test → conclude, notes that only appear/un-blur after the activity):
   - starters: `levers-linkages/pages/p01-starter.js`, `systems-electronics/pages/p01-starter.js`
   - labs/benches: `systems-electronics/pages/p04-sensors.js`, `cams-gears-pulleys/pages/p03-cam-shapes.js`, `material-properties/pages/p06-test-lab.js`
   - calculations that echo the student's own answers: `levers-linkages/pages/p05-mechanical-advantage.js`
   - choose/test workbench: `systems-electronics/pages/p08-system-builder.js`
   - detective, exam practice, exit quiz, final quiz: `levers-linkages/pages/p09-mechanism-detective.js`, `p10-exam-practice.js`, `p11-exit-quiz.js`, `levers-linkages/final-quiz.js`
4. Replace the stub files for YOUR pages only. Edit nothing else (not book-kit, not other pages, not index.html, config.js or manifest.js).
5. Rules that matter most:
   - Accuracy: every fact and answer must match CONTENT.md; re-do every calculation. Where PAGES.md suggests something that CONTENT.md contradicts, CONTENT.md wins. If you add an illustrative number not in CONTENT.md, keep it plausible and list it in your report.
   - Never give the answer away on the page: blur notes/drawings during an activity (`ui.hideWhile` or the `peek-lock` class), put reveals after the activity, never print an intermediate answer in a calculation (echo the student's own), keep MCQ options similar in length, and don't label drawings with the answer.
   - Every activity records with a stable id and a teacher-readable label; wrong options carry `mis` tags from CONTENT.md and a `why`.
   - Touch-friendly (targets ≥ 44 px, drag works with a finger, page still scrolls), works in landscape 1180×820 and portrait 820×1180, state restores on reload.
   - Engaging for 14-year-olds: things to poke, drag, test and discover; short text.
6. Test with `python3 book-kit/tools/shot.py /tmp/<dir> --book <folder> --pages <n,…>` in both sizes plus your own scripted Playwright taps/drags (block the backend URL in your own scripts); look at the screenshots; zero console errors.
7. Final report, brief: what each page does; every fact shown; activity ids/labels/max; all answers/accepted solutions; anything beyond CONTENT.md; best screenshot paths; known issues. For final-quiz.js list the 20 questions with answers.
