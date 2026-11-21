#!/usr/bin/env python3
"""Make the iPad (no sign-in, no data) version of a level-based activity (woods-and-timbers, ks3-electronics).

    python3 book-kit/tools/make_solo_pages.py woods-and-timbers ks3-electronics

Copies every page into <folder>/ipad/ with paths moved one folder up, loads book-kit/solo-pages.js (Save as PDF button),
switches off any hand-off to outside forms, and writes app.webmanifest + sw.js (offline cache) like make_solo.py.
Re-run it whenever the original pages change.
"""
import hashlib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
EXT = re.compile(r'^(https?:|data:|#|/|mailto:|\$\{)')


def h8(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()[:8] if p.is_file() else '1'


def main(folder):
    src_dir = ROOT / folder
    out = src_dir / 'ipad'
    out.mkdir(exist_ok=True)
    pages = sorted(p for p in src_dir.glob('*.html'))
    local_html = {p.name for p in pages}
    assets = set()

    def up(m):
        attr, q, url = m.group(1), m.group(2), m.group(3)
        if EXT.match(url):
            return m.group(0)
        path = url.split('?')[0]
        if path in local_html:            # another page of this activity: its iPad copy sits next to this one
            return m.group(0)
        if path in ('../', '..', '../index.html'):
            return f'{attr}={q}../../ipad/{q}'
        f = (src_dir / path).resolve()
        rel = '../' + path
        assets.add(rel)
        return f'{attr}={q}{rel}?h={h8(f)}{q}'

    solo_h = h8(ROOT / 'book-kit/solo-pages.js')
    ico = folder if (ROOT / f'book-kit/icons/{folder}-192.png').is_file() else 'icon'
    name = folder.replace('-', ' ').title()
    for p in pages:
        html = re.sub(r'\b(src|href)=(["\'])([^"\']+)\2', up, p.read_text())
        had_gate = 'gate.js' in html
        html = re.sub(r'<script src="[^"]*gate\.js[^"]*"></script>\n?', '', html)  # open book: no site password
        t = re.search(r'<title>(.*?)</title>', html)
        if p.name == 'index.html' and t:
            name = t.group(1).split('·')[0].split('|')[0].strip()
        head = (f'<script src="../../book-kit/solo-pages.js?h={solo_h}"></script>\n<link rel="manifest" href="app.webmanifest">\n'
                f'<link rel="apple-touch-icon" href="../../book-kit/icons/{ico}-180.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n'
                f'<meta name="apple-mobile-web-app-title" content="{name}">\n<meta name="theme-color" content="#1f4d36">\n<meta name="robots" content="noindex">\n')
        html = re.sub(r'(<script src="\.\./\.\./gate\.js[^"]*"></script>\n?)', lambda m: m.group(1) + head, html, count=1) if False else html.replace('<head>', '<head>\n' + head, 1)
        # Woods & Timbers: no Microsoft Forms hand-off; save the quiz as a PDF instead
        html = re.sub(r"const FORM_TEMPLATE='[^']*';", "const FORM_TEMPLATE=''; /* iPad version: nothing is sent anywhere */", html)
        html = html.replace('Your answers will be sent to your teacher.', 'When you finish, save your answers as a PDF and hand it in on Showbie.')
        html = html.replace("Your teacher hasn’t connected the answer form yet. Show this screen to your teacher, or copy your answers.", "<b>Last step:</b> tap <b>Save as PDF</b> and hand it in on Showbie.")
        html = html.replace('<button class="ghost" id="qc2">📋 Copy answers</button>',
                            '<button class="cta" style="flex:2;width:auto" onclick="SoloPDF.saveEl(this.closest(\'.qc\'), \'Level ${level} quiz: ${esc(LEVEL_NAMES[level])}\')">📄 Save as PDF</button><button class="ghost" id="qc2">📋 Copy answers</button>')
        (out / p.name).write_text(html)

    assets.discard('../../gate.js'); assets.discard('../gate.js')
    (out / 'app.webmanifest').write_text(json.dumps({
        'name': f'{name} · BSP D&T', 'short_name': name[:12], 'start_url': './', 'scope': './', 'display': 'standalone',
        'background_color': '#1f4d36', 'theme_color': '#1f4d36',
        'icons': [{'src': f'../../book-kit/icons/{ico}-192.png', 'sizes': '192x192', 'type': 'image/png'},
                  {'src': f'../../book-kit/icons/{ico}-512.png', 'sizes': '512x512', 'type': 'image/png'}]}, indent=1))

    urls = ['./', 'app.webmanifest'] + sorted(local_html)
    for u in sorted(assets):
        urls.append(f'{u}?h={h8((src_dir / u[3:]).resolve())}')
    for f in [ROOT / 'book-kit/install-help.js', ROOT / 'book-kit/solo-pages.js', ROOT / 'nea-kit/vendor/html2canvas.min.js', ROOT / 'nea-kit/vendor/jspdf.umd.min.js']:
        u = '../../' + str(f.relative_to(ROOT))
        urls.append(u + (f'?h={h8(f)}' if f.name in ('solo-pages.js', 'gate.js') else ''))
    urls += ['../../' + str(f.relative_to(ROOT)) for f in sorted((ROOT / 'fonts/files').glob('*.woff2'))]
    urls += ['../../fonts/fonts.css'] if any('fonts.css' in a for a in assets) else []
    urls += [f'../../book-kit/icons/{ico}-{n}.png' for n in (180, 192, 512)]
    hh, keep = hashlib.sha256(), []
    for u in dict.fromkeys(urls):
        p = out / 'index.html' if u == './' else (out / u.split('?')[0]).resolve()
        if p.is_file():
            hh.update(p.read_bytes()); keep.append(u)
        else:
            print('  missing (skipped):', u)
    ver = hh.hexdigest()[:12]
    (out / 'sw.js').write_text(f"""// Offline cache for the iPad version of this activity. Made by book-kit/tools/make_solo_pages.py: do not edit by hand.
const CACHE = 'ipad-{folder}-{ver}';
const FILES = {json.dumps(keep, indent=1)};
self.addEventListener('install', (e) => {{ e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); }});
self.addEventListener('activate', (e) => {{ e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-{folder}-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', (e) => {{
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {{
    e.respondWith(fetch(r).then((res) => {{ const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); return res; }}).catch(() => caches.match(r, {{ ignoreSearch: true }}).then((hit) => hit || caches.match('./'))));
    return;
  }}
  e.respondWith(caches.match(r, {{ ignoreVary: true }}).then((hit) => hit || caches.match(r.url.split('?')[0]).then((h2) => h2 || fetch(r).then((res) => {{ if (res.ok && new URL(r.url).origin === location.origin) {{ const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); }} return res; }}))));
}});
""")
    print(f'{folder}/ipad: {len(pages)} pages, {len(keep)} files cached, version {ver}')


if __name__ == '__main__':
    for f in sys.argv[1:]:
        main(f.strip('/'))
