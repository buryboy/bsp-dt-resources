// Offline cache for the Y13 critical path analysis workbook (one self-contained page). Bump CACHE when index.html changes.
const CACHE = 'ipad-critical-path-3b142f46df6c';
const FILES = [
 "./",
 "app.webmanifest",
 "../../book-kit/updater.js",
 "../../book-kit/icons/critical-path-180.png",
 "../../book-kit/icons/critical-path-192.png",
 "../../book-kit/icons/critical-path-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-critical-path-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
