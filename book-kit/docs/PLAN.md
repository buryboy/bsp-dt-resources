# AQA GCSE D&T (8552) exercise-book workbooks: plan

One workbook = one lesson of about an hour (11 pages) + a 20-question one-go final quiz for homework.
Built in this order, one at a time. ✔ = live.

| # | Workbook (folder) | Spec | Status |
|---|---|---|---|
| 1 | Material properties (`material-properties`) | 3.1.6 | ✔ |
| 2 | Motion, levers & linkages (`levers-linkages`) | 3.1.5 mechanical devices | building |
| 3 | Cams, gears & pulleys | 3.1.5 | |
| 4 | Metals & alloys | 3.1.6 | |
| 5 | Polymers | 3.1.6 | |
| 6 | Papers & boards | 3.1.6 | |
| 7 | Textiles | 3.1.6 | |
| 8 | Smart, modern & composite materials | 3.1.3 | |
| 9 | Systems & electronics: inputs, processes, outputs | 3.1.4 | |
| 10 | Energy generation & storage | 3.1.2 | |
| 11 | New & emerging technologies | 3.1.1 | |
| 12 | Forces, stresses & reinforcing | 3.2.2 | |
| 13 | Scales of production | 3.2.7 | |
| 14 | Ecological & social footprint (6 Rs, life cycle) | 3.2.3 | |
| 15 | Surface treatments & finishes | 3.2.9 | |
| 16 | Tolerances, material management & D&T maths | 3.3.8–3.3.9 | |
| 17 | Design strategies & the work of others | 3.3.3–3.3.4 | |
| 18 | Timbers (the older Woods & Timbers workbook already covers this) | 3.1.6 | later |

To add one: copy the structure of `material-properties/`, write `docs/CONTENT.md`, build pages against `book-kit/docs/SPEC.md`, write `final-quiz.js`, run `book-kit/tools/make_manifest.py <folder>`, add it to `workbooks.js` and the hub `index.html`.
