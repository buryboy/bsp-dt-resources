// Offline cache for the HEIC to JPEG converter. Bump CACHE when index.html changes.
const CACHE = 'ipad-heic-to-jpeg-ea7d2c0659db';
const FILES = [
 "./",
 "app.webmanifest",
 "heic-to.js",
 "../../book-kit/updater.js",
 "../../book-kit/icons/heic-to-jpeg-180.png",
 "../../book-kit/icons/heic-to-jpeg-192.png",
 "../../book-kit/icons/heic-to-jpeg-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-heic-to-jpeg-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
