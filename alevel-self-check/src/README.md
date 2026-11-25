# A level Product Design self-check (Edexcel 9DT0 Component 1)

Students rate every Paper 1 spec point (Don't understand / Understand a little / Confident). Confident opens a short exam-style question with a gated, self-marked mark scheme. Page 7 builds a revision list they can save as PDF, copy, or email to their teacher from their own mail app. The teacher tally page (`ipad-home/teacher/dt/self-check-tally.html`, made by `make_home.py`) adds up pasted lists for a class.

Edit `template.html`, then put `jspdf.umd.min.js` (2.5.2) and `html2canvas.min.js` (1.4.1) next to `build.py` and run it. Copy the result to `../ipad/index.html` with the manifest, icon, service-worker and updater lines, and bump the cache name in `../ipad/sw.js`.

Answers are kept in localStorage key `pd-selfcheck-9dt0-v1`. Nothing is sent anywhere.
