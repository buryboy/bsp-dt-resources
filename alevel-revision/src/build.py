"""Build the A level Product Design revision app into ../ipad/index.html.

app.html is the shell. It gets: IBM Plex fonts (/*FONTS*/), jsPDF + html2canvas (/*LIBS*/, files placed next to
this script), spec.js (/*SPEC*/), every booklets/*.js in name order (/*BOOKLETS*/) and engine.js (/*ENGINE*/).
Then the iPad extras (manifest, icon, service worker, updater) are added and the cache name in ../ipad/sw.js is bumped.
"""
import base64, hashlib, pathlib, re, sys
HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent.parent
t = (HERE / 'app.html').read_text()
fonts_dir = ROOT / 'fonts' / 'files'
def face(fam, wt, fn):
    b = base64.b64encode((fonts_dir / fn).read_bytes()).decode()
    return "@font-face{font-family:'%s';font-weight:%d;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % (fam, wt, b)
fonts = [('IBM Plex Sans', w, f'ibm-plex-sans-latin-{w}-normal.woff2') for w in (400, 500, 600)] + [('IBM Plex Mono', w, f'ibm-plex-mono-latin-{w}-normal.woff2') for w in (400, 600)]
t = t.replace('/*FONTS*/', ''.join(face(f, int(w), n) for f, w, n in fonts))
libs = ''
for n in ('jspdf.umd.min.js', 'html2canvas.min.js'):
    p = HERE / n
    if not p.exists(): sys.exit(f'put {n} next to build.py first')
    libs += p.read_text() + '\n'
t = t.replace('/*LIBS*/', libs)
t = t.replace('/*SPEC*/', (HERE / 'spec.js').read_text())
# the diagrams (shared by both apps) go in first: 00-kit.js, then one file per group of drawings
diagrams = '\n'.join(p.read_text() for p in sorted((HERE / 'diagrams').glob('*.js')))
t = t.replace('/*BOOKLETS*/', diagrams + '\n' + '\n'.join(p.read_text() for p in sorted((HERE / 'booklets').glob('*.js'))))
t = t.replace('/*ENGINE*/', (HERE / 'engine.js').read_text())
# iPad extras
t = t.replace('</title>', '</title>\n<link rel="manifest" href="app.webmanifest">\n<link rel="apple-touch-icon" href="../../book-kit/icons/alevel-revision-180.png">\n<meta name="theme-color" content="#1f2328">', 1)
t = t.replace('<button class="btn" id="pdfBtn">', '<button class="btn" id="pdfBtn" data-upd-before data-upd-class="plain">', 1)
k = t.rindex('</body>')
t = t[:k] + "<script>if('serviceWorker' in navigator && location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{});}</script>\n<script src=\"../../book-kit/updater.js\"></script>\n" + t[k:]
out = HERE.parent / 'ipad' / 'index.html'
out.write_text(t)
h = hashlib.sha256(t.encode() + (ROOT / 'book-kit' / 'updater.js').read_bytes()).hexdigest()[:12]
sw = HERE.parent / 'ipad' / 'sw.js'
if sw.exists():
    s = sw.read_text(); sw.write_text(re.sub(r"ipad-alevel-revision-[0-9a-f]{12}", 'ipad-alevel-revision-' + h, s))
print(f'{out} {len(t)//1024} KB, cache {h}')
