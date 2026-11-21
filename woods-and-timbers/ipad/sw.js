// Offline cache for the iPad version of this activity. Made by book-kit/tools/make_solo_pages.py: do not edit by hand.
const CACHE = 'ipad-woods-and-timbers-2d73ee71cfeb';
const FILES = [
 "./",
 "app.webmanifest",
 "index.html",
 "level1.html",
 "level2.html",
 "level3.html",
 "level4.html",
 "level5.html",
 "level6.html",
 "level7.html",
 "level8.html",
 "../../fonts/fonts.css?h=2b91edd6",
 "../../vendor/three/OrbitControls.js?h=02bb4ade",
 "../../vendor/three/three.min.js?h=9274bbce",
 "../../book-kit/install-help.js",
 "../../book-kit/updater.js",
 "../../book-kit/solo-pages.js?h=e80f7906",
 "../../nea-kit/vendor/html2canvas.min.js",
 "../../nea-kit/vendor/jspdf.umd.min.js",
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
 "../../fonts/fonts.css",
 "../../book-kit/icons/woods-and-timbers-180.png",
 "../../book-kit/icons/woods-and-timbers-192.png",
 "../../book-kit/icons/woods-and-timbers-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-woods-and-timbers-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); return res; }).catch(() => caches.match(r, { ignoreSearch: true }).then((hit) => hit || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r, { ignoreVary: true }).then((hit) => hit || caches.match(r.url.split('?')[0]).then((h2) => h2 || fetch(r).then((res) => { if (res.ok && new URL(r.url).origin === location.origin) { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); } return res; }))));
});
