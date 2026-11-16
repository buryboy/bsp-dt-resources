# NEA kit: A3 landscape folder sheets

Shared by `nea-practice/` (AQA GCSE, sketchbook look) and `nea-alevel/` (Edexcel A level, studio look).

- `core.js` scoring (length 35% · criteria covered 50% · structure 15%), `NEA.define`, `NEA.media` (photos/sketches per section for the dashboard).
- `sheets.js` one book page = one A3 landscape sheet (1600 × 1131 board) scaled to fit; pinch / ⌘-scroll / buttons zoom; guidance strip on the left;
  text boxes (scored), photo frames, sketch frames (Apple Pencil, mouse, or finger once tapped; finger pans if a Pencil has been used), html blocks, rating rows.
  ⤧ Arrange moves/resizes anything (saved per sheet), ＋ adds text/photo/sketch, ⬇ PDF renders every sheet to an A3 landscape PDF (vendor/html2canvas + jsPDF).
- `sheets.css` both themes (`body.theme-sketch` / `body.theme-studio`), lock screen.
- `start.js` themes the canvas ink and opens the book behind the optional password lock (`BOOK_CONFIG.gateHash`).

Records: `nea.<field>` text (scored), `ph.<id>` photo `{k,id,cap,at}`, `sk.<id>` sketch `{k,id,at,n}`, `sheet.<id>` layout + extras `{lay, extra[]}`.
Photos and sketch PNGs are uploaded privately to the teacher's Drive by `book-kit/backend/Code.gs` (`a=img`). Strokes and photos are also kept on the device (IndexedDB).
Layouts are in each book's `rubric.js`: `at: [col, row, cols, rows]` on a 12 × 9 grid.
