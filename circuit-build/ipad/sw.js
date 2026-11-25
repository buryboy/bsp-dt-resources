// Offline cache for the iPad sound-circuit build guide. Bump CACHE when index.html changes.
const CACHE = 'ipad-circuit-build-fdca683ddc8c';
const FILES = [
 "./",
 "app.webmanifest",
 "../../book-kit/updater.js",
 "index.html",
 "../../fonts/lexend.css",
 "../../fonts/files/lexend-latin-ext-wght-normal.woff2",
 "../../fonts/files/lexend-latin-wght-normal.woff2",
 "../../book-kit/icons/circuit-build-180.png",
 "../../book-kit/icons/circuit-build-192.png",
 "../../book-kit/icons/circuit-build-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-circuit-build-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put(r, cp)); return res; }).catch(() => caches.match(r, { ignoreSearch: true }).then((hit) => hit || caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r, { ignoreVary: true }).then((hit) => hit || fetch(r)));
});
