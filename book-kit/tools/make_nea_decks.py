#!/usr/bin/env python3
"""Build the NEA stage introduction slideshows for the teacher pages.

    python3 book-kit/tools/make_nea_decks.py

Content lives in nea_gcse.py (AQA 8552 sections A to F) and nea_alevel.py (Edexcel 9DT0/02 grids 1 to 11).
Writes ipad-home/teacher/dt/nea/gcse-<a..f>.html, alevel-<g1..g11>.html and the list page nea/index.html.
Each deck: title · what you need to do and why · key terms · what the moderator looks for · a worked example on an
A3 sheet with numbered notes · weak vs strong · where it goes in the folder · checklist · your turn.
"""
import html, json, pathlib, re, sys

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from nea_gcse import GCSE, CLIENT as GC_CLIENT  # noqa: E402
from nea_alevel import ALEVEL  # noqa: E402
import make_home  # noqa: E402

OUT = make_home.HOME / 'teacher/dt/nea'
E = html.escape


ROOT = make_home.ROOT
HANDIN = ('Each of these is a sheet in your NEA workbook on the iPad. Finished a sheet? Tap **📄 Save sheet**, then **Share / save** and choose **Showbie** to hand it in.')


def sheets(rubric):
    # the workbook's own sheets, so the slides name exactly the pages students fill in
    s = (ROOT / rubric).read_text()
    return re.findall(r"id: '([a-z0-9]+)-[a-z-]+', title: '([^']*)', guide: \{ what: '([^']*)'", s)


def with_sheets(d, prefix, rows):
    mine = [(t, w) for k, t, w in rows if k == prefix]
    if not mine:
        return d
    d = dict(d)
    d['pagesNote'] = HANDIN
    d['pages'] = mine
    d['check'] = d['check'] + ['I saved each finished sheet and shared it to **Showbie**']
    return d


def write(name, deck, course):
    data = json.dumps(deck, ensure_ascii=False).replace('</', '<\\/')
    (OUT / name).write_text(f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>{E(deck["chip"])}: {E(deck["title"])} · {E(course)}</title>
<link rel="stylesheet" href="deck.css">
</head><body>
<div id="deck"></div>
<script>window.DECK = {data};</script>
<script src="deck.js"></script>
</body></html>
''')


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rows = {'gcse': [], 'alevel': []}
    gs, als = sheets('nea-practice/rubric.js'), sheets('nea-alevel/rubric.js')
    for d in GCSE:
        d = with_sheets(dict(d, theme='sketch'), d['key'], gs); write(f'gcse-{d["key"]}.html', d, 'AQA GCSE D&T NEA')
        rows['gcse'].append((f'gcse-{d["key"]}.html', d['chip'], d['title'], d['facts'][0][1]))
    for d in ALEVEL:
        d = with_sheets(dict(d, theme='studio'), d['key'], als); write(f'alevel-{d["key"]}.html', d, 'Edexcel A level D&T NEA')
        rows['alevel'].append((f'alevel-{d["key"]}.html', d['chip'], d['title'], d['facts'][0][1]))

    def lst(r):
        return '<div class="spec">' + ''.join(f'<a class="row" href="{f}"><span class="code">{E(c.split()[-1])}</span><span class="t"><b>{E(t)}</b><small>{E(m)} marks</small></span><span class="go">›</span></a>' for f, c, t, m in r) + '</div>'
    body = ('<h1>NEA stage introductions</h1><p class="sub">Put one on the board when the class starts a stage. Tap the right of the screen (or press →) to move on; '
            'on the example slides each tap reveals the next numbered note. Full screen with ⤢.</p>'
            '<section id="ks4"><h2>GCSE · AQA 8552 NEA</h2><p class="sub">Sketchbook style, matching the NEA practice book. Worked example: the practice context “Small spaces, big lives”.</p>'
            + lst(rows['gcse']) + '</section>'
            '<section id="ks5"><h2>A level · Edexcel 9DT0/02 NEA</h2><p class="sub">Drafting-studio style, matching the A level practice book. Worked example: the practice context “Inclusive living”.</p>'
            + lst(rows['alevel']) + '</section>')
    make_home.page('teacher/dt/nea/index.html', 'NEA stage introductions', [('Home', ''), ('Teachers', 'teacher/'), ('D&T', 'teacher/dt/')], body, 3)
    print(f'NEA decks: {len(GCSE)} GCSE, {len(ALEVEL)} A level -> {OUT}')


if __name__ == '__main__':
    main()
