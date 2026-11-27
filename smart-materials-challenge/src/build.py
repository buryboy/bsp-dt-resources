"""Build the smart materials design challenge into ../ipad/index.html (one self-contained page that works offline).
page.html gets the Lexend and Patrick Hand fonts (/*FONTS*/) and jsPDF + html2canvas (/*LIBS*/, files placed next to this script)."""
import base64, hashlib, pathlib, re, sys
HERE = pathlib.Path(__file__).resolve().parent; ROOT = HERE.parent.parent; NAME = 'smart-materials-challenge'
t = (HERE / 'page.html').read_text(); fd = ROOT / 'fonts' / 'files'
b64 = lambda fn: base64.b64encode((fd / fn).read_bytes()).decode()
t = t.replace('/*FONTS*/', "@font-face{font-family:'Lexend';font-weight:100 900;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}@font-face{font-family:'Patrick Hand';font-weight:400;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format('woff2')}" % (b64('lexend-latin-wght-normal.woff2'), b64('patrick-hand-latin-400-normal.woff2')))
libs = ''
for n in ('jspdf.umd.min.js', 'html2canvas.min.js'):
    p = HERE / n
    if not p.exists(): sys.exit(f'put {n} next to build.py first')
    libs += p.read_text() + '\n'
t = t.replace('/*LIBS*/', libs)
t = t.replace('</title>', '</title>\n<link rel="manifest" href="app.webmanifest">\n<link rel="apple-touch-icon" href="../../book-kit/icons/%s-180.png">\n<meta name="theme-color" content="#22262b">' % NAME, 1)
k = t.rindex('</body>')
t = t[:k] + "<script>if('serviceWorker' in navigator && location.protocol==='https:'){navigator.serviceWorker.register('sw.js').catch(()=>{});}</script>\n<script src=\"../../book-kit/updater.js\"></script>\n" + t[k:]
out = HERE.parent / 'ipad' / 'index.html'; out.write_text(t)
h = hashlib.sha256(t.encode() + (ROOT / 'book-kit' / 'updater.js').read_bytes()).hexdigest()[:12]
sw = HERE.parent / 'ipad' / 'sw.js'; sw.write_text(re.sub(r"ipad-%s-[0-9a-f]{12}" % NAME, 'ipad-%s-%s' % (NAME, h), sw.read_text()))
print(out, len(t) // 1024, 'KB, cache', h)
