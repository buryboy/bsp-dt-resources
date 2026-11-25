"""Build the GCSE Design & Technology revision app into ../ipad/index.html.

The engine is shared with the A level app: it is read from ../../alevel-revision/src/engine.js, so a fix there fixes both
(rebuild both). This folder holds only what is different: the shell and look (app.html), the course details (spec.js)
and the booklets, which also add their own self-check rows with SPEC.push(...).

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
def vface(fam, fn):
    b = base64.b64encode((fonts_dir / fn).read_bytes()).decode()
    return "@font-face{font-family:'%s';font-weight:100 900;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % (fam, b)
t = t.replace('/*FONTS*/', vface('Lexend', 'lexend-latin-wght-normal.woff2') + face('Patrick Hand', 400, 'patrick-hand-latin-400-normal.woff2'))
libs = ''
for n in ('jspdf.umd.min.js', 'html2canvas.min.js'):
    p = ROOT / 'alevel-revision' / 'src' / n
    if not p.exists(): sys.exit(f'put {n} in alevel-revision/src first')
    libs += p.read_text() + '\n'
t = t.replace('/*LIBS*/', libs)
t = t.replace('/*SPEC*/', (HERE / 'spec.js').read_text())
t = t.replace('/*BOOKLETS*/', '\n'.join(p.read_text() for p in sorted((HERE / 'booklets').glob('*.js'))))
t = t.replace('/*ENGINE*/', (ROOT / 'alevel-revision' / 'src' / 'engine.js').read_text())
# iPad extras
t = t.replace('</title>', '</title>\n<link rel="manifest" href="app.webmanifest">\n<link rel="apple-touch-icon" href="../../book-kit/icons/gcse-revision-180.png">\n<meta name="theme-color" content="#1f4d36">', 1)
t = t.replace('<button class="btn" id="pdfBtn">', '<button class="btn" id="pdfBtn" data-upd-before data-upd-class="plain">', 1)
k = t.rindex('</body>')
t = t[:k] + "<script>if('serviceWorker' in navigator && location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{});}</script>\n<script src=\"../../book-kit/updater.js\"></script>\n" + t[k:]
out = HERE.parent / 'ipad' / 'index.html'
out.write_text(t)
h = hashlib.sha256(t.encode() + (ROOT / 'book-kit' / 'updater.js').read_bytes()).hexdigest()[:12]
sw = HERE.parent / 'ipad' / 'sw.js'
if sw.exists():
    s = sw.read_text(); sw.write_text(re.sub(r"ipad-gcse-revision-[0-9a-f]{12}", 'ipad-gcse-revision-' + h, s))
print(f'{out} {len(t)//1024} KB, cache {h}')
