// Offline cache for the iPad version of this workbook. Made by book-kit/tools/make_solo.py: do not edit by hand.
const CACHE = 'ipad-nea-practice-55d7040cc7ed';
const FILES = [
 "./",
 "app.webmanifest",
 "../../book-kit/icons/nea-practice-180.png",
 "../../book-kit/book.css?h=32238363",
 "../sketchbook.css?h=59de1967",
 "../config.js?h=08617cdf",
 "../../book-kit/solo.js?h=e984f64d",
 "../../book-kit/harness.js?h=73af921e",
 "../../book-kit/sound.js?h=b44355da",
 "../../book-kit/ink.js?h=179d4440",
 "../../book-kit/book.js?h=541b0d5d",
 "../../nea-kit/sheets.css?h=523d804e",
 "../../nea-kit/core.js?h=2b73387e",
 "../rubric.js?h=86d09983",
 "../../nea-kit/sheets.js?h=d9fc24ed",
 "../../nea-kit/start.js?h=1e6ccf48",
 "../pages/sheets.js?h=bee88a72",
 "../manifest.js?h=8614d496",
 "../../book-kit/install-help.js",
 "../../book-kit/updater.js",
 "../../nea-kit/vendor/html2canvas.min.js",
 "../../nea-kit/vendor/jspdf.umd.min.js",
 "../../fonts/fonts.css",
 "../../fonts/files/caveat-latin-ext-wght-normal.woff2",
 "../../fonts/files/caveat-latin-wght-normal.woff2",
 "../../fonts/files/fredoka-latin-ext-wght-normal.woff2",
 "../../fonts/files/fredoka-latin-wght-normal.woff2",
 "../../fonts/files/gloria-hallelujah-latin-400-normal.woff2",
 "../../fonts/files/gloria-hallelujah-latin-ext-400-normal.woff2",
 "../../fonts/files/ibm-plex-mono-latin-400-normal.woff2",
 "../../fonts/files/ibm-plex-mono-latin-600-normal.woff2",
 "../../fonts/files/ibm-plex-mono-latin-ext-400-normal.woff2",
 "../../fonts/files/ibm-plex-mono-latin-ext-600-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-400-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-500-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-600-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-700-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-ext-400-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-ext-500-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-ext-600-normal.woff2",
 "../../fonts/files/ibm-plex-sans-latin-ext-700-normal.woff2",
 "../../fonts/files/inter-latin-ext-wght-normal.woff2",
 "../../fonts/files/inter-latin-wght-normal.woff2",
 "../../fonts/files/josefin-sans-latin-ext-wght-normal.woff2",
 "../../fonts/files/josefin-sans-latin-wght-normal.woff2",
 "../../fonts/files/lexend-latin-ext-wght-normal.woff2",
 "../../fonts/files/lexend-latin-wght-normal.woff2",
 "../../fonts/files/monoton-latin-400-normal.woff2",
 "../../fonts/files/monoton-latin-ext-400-normal.woff2",
 "../../fonts/files/nunito-latin-ext-wght-normal.woff2",
 "../../fonts/files/nunito-latin-wght-normal.woff2",
 "../../fonts/files/patrick-hand-latin-400-normal.woff2",
 "../../fonts/files/patrick-hand-latin-ext-400-normal.woff2",
 "../../fonts/files/press-start-2p-latin-400-normal.woff2",
 "../../fonts/files/press-start-2p-latin-ext-400-normal.woff2",
 "../../fonts/files/source-serif-4-latin-ext-opsz-normal.woff2",
 "../../fonts/files/source-serif-4-latin-opsz-normal.woff2",
 "../../fonts/files/space-grotesk-latin-ext-wght-normal.woff2",
 "../../fonts/files/space-grotesk-latin-wght-normal.woff2",
 "../../fonts/files/space-mono-latin-400-normal.woff2",
 "../../fonts/files/space-mono-latin-700-normal.woff2",
 "../../fonts/files/space-mono-latin-ext-400-normal.woff2",
 "../../fonts/files/space-mono-latin-ext-700-normal.woff2",
 "../../book-kit/icons/nea-practice-192.png",
 "../../book-kit/icons/nea-practice-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-nea-practice-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') { // the page itself: newest copy when online, cached copy when not
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r).then((res) => { if (res.ok && new URL(r.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); } return res; })));
});
