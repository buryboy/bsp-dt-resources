# Builder brief: classroom tools

Repo root: /home/claude/bsp-dt-resources. Tools live in `tools/` as **one self-contained HTML file per tool** (e.g. `tools/timer.html`), served by GitHub Pages and also at dt.buryboy2000.com/tools/. They run on the teacher's laptop / projector (and some on iPads). No logins, no build step, no external services except Google Fonts and the existing results backend where stated. Nothing is sent anywhere unless the brief says so; say so on screen where relevant (like the noise meter does).

1. Read `tools/kit/tools.js` (API at the top) and `tools/kit/tools.css`, and look at `tools/noise-meter.html` (an existing tool by someone else: match its quality). Include the kit with `<link rel="stylesheet" href="kit/tools.css">` and `<script src="kit/tools.js"></script>`, and start each tool with `TK.top('Tool name')` so every tool has the same top bar (← Tools, title, light/dark, full screen).
2. Shared class lists: tools that use student names use `TK.classSelect` / `TK.currentClass()` so the teacher types a class once and every tool sees it. `tools/classes.html` is the class-list editor (built by the "choosing" builder).
3. Design for the back of a classroom: very large type and numbers, high contrast, works on 1366×768 and 1920×1080 projectors and full screen; also usable on an iPad (touch targets ≥ 44 px). Controls that clutter the board can fade when idle (`TK.idle`). Keyboard shortcuts where natural (space = start/stop, etc.), listed in a small help line.
4. Fun but professional: tasteful animation and sound (`TK.beep`, or your own WebAudio; always with a mute option), no copyrighted characters or music.
5. Settings persist per tool with `TK.store` / `TK.save` (localStorage, wrapped in try/catch).
6. Test with Playwright + /usr/bin/google-chrome headless at 1366×768 and 1920×1080 (and 820×1180 where an iPad use makes sense): load, use every control, check zero console errors, look at screenshots. Serve the repo root with `python3 -m http.server` from /home/claude/bsp-dt-resources.
7. Edit only the files your brief names. Do not edit `tools/kit/*`, `index.html`, `tools/index.html` or other builders' tools (if you need a kit change, say so in your report instead).
8. Report briefly: what each tool does, its controls and shortcuts, anything stored, screenshot paths, known issues.


**Site password:** every HTML page must load the site password screen as the first thing in `<head>`: `<script src="../gate.js"></script>` (or `gate.js` at the repo root). It is skipped automatically on localhost, so local testing is unaffected.
