#!/usr/bin/env python3
"""Screenshot pages of the exercise book at iPad size.
  python3 tools/shot.py /tmp/out [--pages 1,2,3] [--size 1180x820] [--full]
Signs in on the cover, jumps to each page (no turn animation), screenshots the visible page; with --full also
scrolls through long pages. Prints console errors. Also: --script 'js' runs JS on each page before the shot.
"""
import sys, http.server, threading, functools, argparse, pathlib, time
from playwright.sync_api import sync_playwright
ap = argparse.ArgumentParser(); ap.add_argument('out'); ap.add_argument('--pages', default='')
ap.add_argument('--size', default='1180x820'); ap.add_argument('--full', action='store_true'); ap.add_argument('--script', default='')
ap.add_argument('--book', default='material-properties', help='workbook folder')
ap.add_argument('--wait', type=float, default=1.2)
a = ap.parse_args(); out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
root = pathlib.Path(__file__).resolve().parent.parent.parent
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *x): pass
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=str(root)))
threading.Thread(target=srv.serve_forever, daemon=True).start()
W, Hh = map(int, a.size.split('x')); errs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome')
    ctx = b.new_context(viewport={'width': W, 'height': Hh}, has_touch=True, device_scale_factor=1)
    pg = ctx.new_page()
    pg.on('console', lambda m: m.type == 'error' and 'Failed to load resource' not in m.text and errs.append(m.text))
    pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    pg.goto(f'http://127.0.0.1:{srv.server_port}/' + a.book + '/index.html?mute=1'); pg.wait_for_timeout(1500)
    pg.screenshot(path=str(out / 'p00-cover.png'))
    pg.fill('#cv-name', 'Test Student'); pg.fill('#cv-email', 'test.student@bspcloud.net'); pg.select_option('#cv-class', '10A')
    pg.click('#next'); pg.wait_for_timeout(1100)
    n = pg.evaluate('Book.pages.length')
    want = [int(x) for x in a.pages.split(',')] if a.pages else list(range(1, n))
    for i in want:
        pg.evaluate(f'Book.go({i})'); pg.wait_for_timeout(950)
        if a.script: pg.evaluate(a.script); pg.wait_for_timeout(300)
        pg.wait_for_timeout(int(a.wait * 1000))
        pg.screenshot(path=str(out / f'p{i:02d}.png'))
        if a.full:
            h = pg.evaluate(f"document.querySelectorAll('.page')[{i}] ? 0 : 0") 
            sh = pg.evaluate("(()=>{const s=[...document.querySelectorAll('.page')].find(p=>!p.classList.contains('hidden')).querySelector('.sheet');return [s.scrollHeight,s.clientHeight]})()")
            k = 1; y = sh[1] - 80
            while y < sh[0] and k < 12:
                pg.evaluate(f"[...document.querySelectorAll('.page')].find(p=>!p.classList.contains('hidden')).querySelector('.sheet').scrollTop={y}")
                pg.wait_for_timeout(500); pg.screenshot(path=str(out / f'p{i:02d}-{k}.png')); k += 1; y += sh[1] - 80
    b.close()
srv.shutdown()
for e in errs: print('ERR', e)
print('OK' if not errs else f'{len(errs)} errors')
