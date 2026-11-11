/* Chess Pro AI - service worker (offline cache)
   When you upload a new version, bump CACHE_NAME (v2 -> v3 ...). Players then see an "UPDATE" banner. */
const CACHE_NAME = 'chess-pro-v4';

/* index.html already contains the engine, rules and piece images, so this is all that is needed. */
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      /* one missing optional file must never stop the whole install */
      Promise.all(ASSETS.map((url) => cache.add(url).catch((err) => console.warn('SW: not cached', url, err))))
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE_NAME).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    })
  );
});

/* "UPDATE" button in the app */
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') self.skipWaiting();
});
