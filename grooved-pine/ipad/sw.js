// Offline cache for the Grooved Pine Challenge booklet (one self-contained page). Bump CACHE when index.html changes.
const CACHE = 'ipad-grooved-pine-3c8bbf2c4779';
const FILES = [
 "./",
 "app.webmanifest",
 "../../book-kit/icons/grooved-pine-180.png",
 "../../book-kit/icons/grooved-pine-192.png",
 "../../book-kit/icons/grooved-pine-512.png"
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('ipad-grooved-pine-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request; if (r.method !== 'GET') return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(CACHE).then((c) => c.put('./', cp)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
