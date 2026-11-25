// Offline cache for the A level Product Design self-check (one self-contained page). Bump CACHE when index.html changes.
const CACHE = 'ipad-alevel-self-check-39b758ccb26f';
const FILES = [
 "./",
 "app.webmanifest",
 "../../book-kit/updater.js",
 "../../book-kit/icons/alevel-self-check-180.png",
 "../../book-kit/icons/alevel-self-check-192.png",
 "../../book-kit/icons/alevel-self-check-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-alevel-self-check-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
