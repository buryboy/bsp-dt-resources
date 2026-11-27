// Offline cache for the GCSE Design & Technology revision app (one self-contained page). Bump CACHE when index.html changes.
const CACHE = 'ipad-gcse-revision-14bd04da247b';
const FILES = [
 "./",
 "app.webmanifest",
 "../../book-kit/updater.js",
 "../../book-kit/three/three.min.js",
 "../../book-kit/three/OrbitControls.js",
 "../../book-kit/icons/gcse-revision-180.png",
 "../../book-kit/icons/gcse-revision-192.png",
 "../../book-kit/icons/gcse-revision-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-gcse-revision-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
