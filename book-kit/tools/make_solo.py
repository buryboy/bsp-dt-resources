#!/usr/bin/env python3
"""Make the iPad (no sign-in, no data) version of a workbook.

    python3 book-kit/tools/make_solo.py levers-linkages

Writes <folder>/ipad/index.html, <folder>/ipad/app.webmanifest and <folder>/ipad/sw.js.
- index.html is the workbook's index.html with every path moved one folder up, book-kit/solo.js loaded after
  config.js (results server off, "Save this page as PDF" on every page) and the home-screen app tags added.
- sw.js caches every file the workbook uses, so after the first visit it works offline. Its cache name is a hash
  of those files, so re-running this after any change makes iPads pick up the new version next time they are online.
Re-run it whenever the workbook's pages change.
"""
import hashlib, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]


def main(folder):
    book = ROOT / folder
    src = (book / 'index.html').read_text()
    out = book / 'ipad'
    out.mkdir(exist_ok=True)

    def up(m):
        attr, q, url = m.group(1), m.group(2), m.group(3)
        if re.match(r'^(https?:|data:|#|/)', url):
            return m.group(0)
        path = url.split('?')[0]
        f = (book / path).resolve()
        ver = hashlib.sha256(f.read_bytes()).hexdigest()[:8] if f.is_file() else '1'
        return f'{attr}={q}../{path}?h={ver}{q}'  # content hash, so an iPad never runs a stale cached copy

    html = re.sub(r'\b(src|href)=(["\'])([^"\']+)\2', up, src)
    cfg = re.search(r'<script src="\.\./config\.js[^"]*"></script>', html)
    solo_h = hashlib.sha256((ROOT / 'book-kit/solo.js').read_bytes()).hexdigest()[:8]
    if not cfg:
        sys.exit('no config.js in ' + folder)
    html = html.replace(cfg.group(0), cfg.group(0) + f'\n<script src="../../book-kit/solo.js?h={solo_h}"></script>', 1)
    ico = folder if (ROOT / f'book-kit/icons/{folder}-192.png').is_file() else 'icon'  # own icon from make_icons.py
    title = re.search(r'<title>(.*?)</title>', html)
    name = (title.group(1).split('·')[0].strip() if title else folder)
    head_extra = (f'<link rel="manifest" href="app.webmanifest">\n<link rel="apple-touch-icon" href="../../book-kit/icons/{ico}-180.png">\n'
                  f'<meta name="apple-mobile-web-app-title" content="{name}">\n<meta name="theme-color" content="#1f4d36">\n<meta name="robots" content="noindex">\n')
    html = html.replace('</title>', '</title>\n' + head_extra, 1)
    html = re.sub(r'<title>(.*?)</title>', lambda m: f'<title>{name} · iPad</title>', html, count=1)
    (out / 'index.html').write_text(html)

    (out / 'app.webmanifest').write_text(json.dumps({
        'name': f'{name} · BSP D&T', 'short_name': name[:12], 'start_url': './', 'scope': './', 'display': 'standalone',
        'background_color': '#1f4d36', 'theme_color': '#1f4d36',
        'icons': [{'src': f'../../book-kit/icons/{ico}-192.png', 'sizes': '192x192', 'type': 'image/png'},
                  {'src': f'../../book-kit/icons/{ico}-512.png', 'sizes': '512x512', 'type': 'image/png'}]}, indent=1))

    # everything to cache: the page, its scripts and styles, fonts, PDF libraries, icons
    urls = ['./', 'app.webmanifest']
    for u in re.findall(r'\b(?:src|href)=["\']([^"\']+)["\']', html):
        if not re.match(r'^(https?:|data:|#|/)', u) and u not in urls:
            urls.append(u)
    extra = [ROOT / 'book-kit/install-help.js', ROOT / 'nea-kit/vendor/html2canvas.min.js', ROOT / 'nea-kit/vendor/jspdf.umd.min.js', ROOT / 'fonts/fonts.css']
    extra += sorted((ROOT / 'fonts/files').glob('*.woff2'))
    extra += sorted((ROOT / 'book-kit/icons').glob(f'{ico}-*.png'))
    for f in extra:
        u = '../../' + str(f.relative_to(ROOT)).replace('\\', '/')
        if u not in urls:
            urls.append(u)
    h, keep = hashlib.sha256(), []
    for u in urls:
        p = out / 'index.html' if u == './' else (out / u.split('?')[0]).resolve()
        if p.is_file():
            h.update(p.read_bytes()); keep.append(u)
        else:
            print('  missing (skipped):', u)
    urls = keep
    ver = h.hexdigest()[:12]
    sw = f"""// Offline cache for the iPad version of this workbook. Made by book-kit/tools/make_solo.py: do not edit by hand.
const CACHE = 'ipad-{folder}-{ver}';
const FILES = {json.dumps(urls, indent=1)};
self.addEventListener('install', (e) => {{ e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); }});
self.addEventListener('activate', (e) => {{ e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-{folder}-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); }});
self.addEventListener('fetch', (e) => {{
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {{ // the page itself: newest copy when online, cached copy when not
    e.respondWith(fetch(r).then((res) => {{ const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }}).catch(() => caches.match('./')));
    return;
  }}
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => {{ if (res.ok && new URL(r.url).origin === location.origin) {{ const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); }} return res; }})));
}});
"""
    (out / 'sw.js').write_text(sw)
    print(f'{folder}/ipad: {len(urls)} files cached, version {ver}')


if __name__ == '__main__':
    for f in sys.argv[1:]:
        main(f.strip('/'))
