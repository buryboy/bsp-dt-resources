// Offline cache for the smart materials design challenge. Bump CACHE when index.html changes.
const CACHE = 'ipad-smart-materials-challenge-7f12341d54b9';
const FILES = [
 "./",
 "app.webmanifest",
 "../../book-kit/updater.js",
 "../../book-kit/icons/smart-materials-challenge-180.png",
 "../../book-kit/icons/smart-materials-challenge-192.png",
 "../../book-kit/icons/smart-materials-challenge-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-smart-materials-challenge-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
