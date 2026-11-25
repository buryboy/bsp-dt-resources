#!/usr/bin/env python3
"""Build the front pages of the open "iPad sites" website from ipad-home/data.json.

    python3 book-kit/tools/make_home.py

Writes ipad-home/index.html (I'm a student / I'm a teacher), student/, teacher/, teacher/dt/ and one page per GCSE
topic in teacher/dt/gcse/<slug>/. The lesson files themselves (board page, notes sheet, PowerPoint, print pack without
its answer key) already sit in each topic folder. build_ipad_site.py copies the whole ipad-home folder to the site root.
No logins, no forms, nothing sent anywhere: plain pages and files.
"""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[2]
HOME = ROOT / 'ipad-home'
E = html.escape

# student workbooks: folder, title, key stage, spec label (sorted within a key stage by spec)
WORKBOOKS = [
    ('ks3-electronics', 'Circuit Lab: electronics', 'ks3', 'KS3 electronics'),
    ('circuit-build', 'Sound circuit build guide', 'ks3', 'Year 8 electronics'),
    ('tin-can-lamp', 'Upcycled tin can lamp', 'ks3', 'Year 9 · 1960s or 1980s lamp'),
    ('smart-modern-composite', 'Smart, modern & composite materials', 'ks4', '3.1.3'),
    ('systems-electronics', 'Systems & electronics', 'ks4', '3.1.4'),
    ('levers-linkages', 'Levers & linkages', 'ks4', '3.1.5'),
    ('cams-gears-pulleys', 'Cams, gears & pulleys', 'ks4', '3.1.5'),
    ('material-properties', 'Material properties', 'ks4', '3.1.6'),
    ('papers-boards', 'Papers & boards', 'ks4', '3.1.6'),
    ('woods-and-timbers', 'Woods & timbers', 'ks4', '3.1.6'),
    ('metals-alloys', 'Metals & alloys', 'ks4', '3.1.6'),
    ('polymers', 'Polymers', 'ks4', '3.1.6'),
    ('textiles', 'Textiles', 'ks4', '3.1.6'),
    ('nea-practice', 'NEA practice run', 'ks4', 'NEA'),
    ('nea-alevel', 'A level NEA practice', 'ks5', 'NEA'),
    ('grooved-pine', 'The Grooved Pine Challenge', 'ks5', 'Y12 design & make · NEA grids 1–4'),
]
WB = {w[0]: w for w in WORKBOOKS}
NEA_GCSE = [('a', 'Identifying & investigating design possibilities'), ('b', 'Producing a design brief & specification'), ('c', 'Generating design ideas'), ('d', 'Developing design ideas'), ('e', 'Realising design ideas'), ('f', 'Analysing & evaluating')]
NEA_ALEVEL = [(1, 'Identification & investigation of a design possibility'), (2, 'Investigation of needs & research'), (3, 'Specification'), (4, 'Design ideas'), (5, 'Development of design ideas'), (6, 'Final design solution'), (7, 'Review of development & final design'), (8, 'Communication of design ideas'), (9, 'Tools & equipment'), (10, 'Quality & accuracy'), (11, 'Testing & evaluation')]
STAGES = [('ks3', 'Key Stage 3', 'Years 7 to 9'), ('ks4', 'Key Stage 4', 'GCSE · AQA Design & Technology 8552'), ('ks5', 'Key Stage 5', 'A level · Edexcel Design & Technology (Product Design)')]


def page(path, title, crumbs, body, depth):
    up = '../' * depth
    nav = ''.join(f'<a href="{up}{h}">{E(t)}</a><span>›</span>' for t, h in crumbs)
    out = f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>{E(title)} · BSP</title>
<link rel="stylesheet" href="{up}site.css">
</head><body>
<header><div class="in"><a class="brand" href="{up}">THE BRITISH SCHOOL OF PARIS</a><nav>{nav}<b>{E(title)}</b></nav></div></header>
<main>{body}</main>
<footer>No sign-in and nothing is collected: these pages and files work like a book on a shelf. Workbook answers stay on your own iPad.</footer>
</body></html>
'''
    p = HOME / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(out)


def wb_card(folder, up, note=''):
    f, t, ks, spec = WB[folder]
    return (f'<a class="wb" href="{up}{f}/ipad/"><img src="{up}book-kit/icons/{f}-192.png" alt="">'
            f'<span><b>{E(t)}</b><small>{E(note or spec)}</small></span></a>')


def main():
    data = json.loads((HOME / 'data.json').read_text())
    topics = data['topics']
    by_code = {c: t for t in topics for c in t['codes']}

    # landing
    page('index.html', 'Welcome', [], '''
<h1 class="big">Hello. Who are you?</h1>
<div class="two">
 <a class="choice stu" href="student/"><span class="ic">🎒</span><b>I'm a student</b><small>Workbooks for your iPad</small></a>
 <a class="choice tea" href="teacher/"><span class="ic">📚</span><b>I'm a teacher</b><small>Lessons and resources by subject</small></a>
</div>''', 0)

    # student
    body = ['<h1>Workbooks for your iPad</h1>',
            '<ol class="how"><li>Tap your workbook.</li><li>Follow the steps it shows to add it to your Home Screen. It works without Wi-Fi.</li>'
            '<li>Always open it from that icon so your work stays together. Tap <b>⟳ Check for updates</b> when your teacher adds new pages: your answers are kept.</li>'
            '<li>At the end of each page, tap <b>Save this page as PDF</b> and hand it in on Showbie.</li></ol>',
            '<div class="tabs">' + ''.join(f'<a href="#{k}">{E(n)}</a>' for k, n, _ in STAGES) + '</div>']
    for k, n, sub in STAGES:
        cards = ''.join(wb_card(w[0], '../', ('AQA ' + w[3]) if w[2] == 'ks4' and w[3][0].isdigit() else '') for w in WORKBOOKS if w[2] == k)
        body.append(f'<section id="{k}"><h2>{E(n)}</h2><p class="sub">{E(sub)}</p><div class="wbs">{cards}</div></section>')
    page('student/index.html', 'Students', [('Home', '')], ''.join(body), 1)

    # teacher: subjects
    page('teacher/index.html', 'Teachers', [('Home', '')], '''
<h1>Choose a subject</h1>
<div class="subjects"><a class="subj" href="dt/"><span class="ic">🛠️</span><b>Design &amp; Technology</b><small>KS3, GCSE (AQA 8552) and A level</small></a></div>''', 1)

    # teacher: DT
    b = ['<h1>Design &amp; Technology</h1>',
         '<div class="tabs">' + ''.join(f'<a href="#{k}">{E(n)}</a>' for k, n, _ in STAGES) + '</div>',
         '<section id="ks3"><h2>Key Stage 3</h2><p class="sub">Years 7 to 9</p><div class="wbs">' + wb_card('ks3-electronics', '../../') + wb_card('circuit-build', '../../') + wb_card('tin-can-lamp', '../../') + '</div><p class="soon">More KS3 projects to come.</p></section>',
         '<section id="ks4"><h2>Key Stage 4 · GCSE</h2><p class="sub">AQA Design &amp; Technology 8552. Each topic has a taught lesson (board page and notes sheet), an application lesson (PowerPoint and print pack) and links to the student workbooks.</p>']
    for code, name, rows in data['spec']:
        b.append(f'<h3><span class="code">{code}</span>{E(name)}</h3><div class="spec">')
        for c, t in rows:
            tp = by_code.get(c)
            if tp:
                also = [x for x in tp['codes'] if x != c]
                extra = f'<small>Taught together with {", ".join(also)}</small>' if also else f'<small>{E(tp["app"])}</small>'
                b.append(f'<a class="row" href="gcse/{tp["slug"]}/"><span class="code">{c}</span><span class="t"><b>{E(t)}</b>{extra}</span><span class="go">›</span></a>')
            else:
                b.append(f'<div class="row off"><span class="code">{c}</span><span class="t"><b>{E(t)}</b><small>Coming soon</small></span></div>')
        b.append('</div>')
    b.append('<h3><span class="code">NEA</span>Non-exam assessment</h3><div class="spec">'
             + ''.join(f'<a class="row" href="nea/gcse-{k}.html"><span class="code">{k.upper()}</span><span class="t"><b>{E(t)}</b><small>Stage introduction slides</small></span><span class="go">›</span></a>' for k, t in NEA_GCSE)
             + '</div><div class="wbs" style="margin-top:12px">' + wb_card('nea-practice', '../../', 'Practice run workbook, sections A to F') + '</div></section>')
    b.append('<section id="ks5"><h2>Key Stage 5 · A level</h2><p class="sub">Edexcel Design &amp; Technology (Product Design)</p>'
             '<h3><span class="code">NEA</span>9DT0/02 Independent design and make project</h3><div class="spec">'
             + ''.join(f'<a class="row" href="nea/alevel-g{n}.html"><span class="code">Grid {n}</span><span class="t"><b>{E(t)}</b><small>Stage introduction slides</small></span><span class="go">›</span></a>' for n, t in NEA_ALEVEL)
             + '</div><div class="wbs" style="margin-top:12px">' + wb_card('nea-alevel', '../../', 'NEA practice workbook') + wb_card('grooved-pine', '../../', 'Y12 project booklet · grids 1–4, with hints') + '</div><p class="soon">More A level resources to come.</p></section>')
    page('teacher/dt/index.html', 'Design & Technology', [('Home', ''), ('Teachers', 'teacher/')], ''.join(b), 2)

    # teacher: one page per GCSE topic
    titles = {c: t for _, _, rows in data['spec'] for c, t in rows}
    for tp in topics:
        f = tp['files']
        codes = ' · '.join(tp['codes'])
        covers = ''.join(f'<li><span class="code">{c}</span>{E(titles[c])}</li>' for c in tp['codes'])
        wbs = ''.join(wb_card(w, '../../../../') for w in tp['workbooks'])
        body = f'''
<p class="kicker">AQA GCSE D&amp;T 8552 · {codes}</p><h1>{E(tp["title"])}</h1>
<ul class="covers">{covers}</ul>
<div class="parts">
 <div class="part"><span class="n">1</span><h2>Taught lesson</h2><p>Interactive board page: tap-to-reveal cards, predict-then-run lab tests and an exam question. Students fill in the notes sheet as you go.</p>
  <a class="btn" href="{f["lesson"]}">Open the board page</a><a class="btn ghost" href="{E(f["notes"])}">Notes sheet (PDF)</a></div>
 <div class="part"><span class="n">2</span><h2>Application lesson: {E(tp["app"])}</h2><p>{E(tp["appdesc"])} Solo work, self-marked in green pen from the answer slides.</p>
  <a class="btn" href="{E(f["deck"])}">PowerPoint</a><a class="btn ghost" href="{E(f["pack"])}">Print pack (PDF)</a>
  <p class="small">The print pack here has no answer key, and the Kahoot file is not on the site. Use your own copies of those.</p></div>
 {f'<div class="part"><span class="n">3</span><h2>Student workbooks</h2><p>iPad workbooks for this topic. Nothing is collected; students save pages as PDF for Showbie.</p><div class="wbs">{wbs}</div></div>' if wbs else ''}
</div>'''
        page(f'teacher/dt/gcse/{tp["slug"]}/index.html', tp['title'], [('Home', ''), ('Teachers', 'teacher/'), ('D&T', 'teacher/dt/')], body, 4)
    print(f'home pages built: {len(topics)} GCSE topics')


if __name__ == '__main__':
    main()
