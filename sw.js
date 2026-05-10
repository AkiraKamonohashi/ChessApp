/* AUTO-UPDATE STRATEGY:
   Change 'v1' to 'v2', 'v3', etc., whenever you upload new code to GitHub.
   The app will detect the change and update the cache automatically.
*/
const CACHE_NAME = 'chess-pro-v1'; 

const assets = [
  './',
  './index.html',
  './chessboard.css',
  './chess.js',
  './chessboard.js',
  './jquery.js',
  './stockfish.js',
  './manifest.json',
  /* Add paths to your piece images for offline play */
  './img/wP.png',
  './img/wN.png',
  './img/wB.png',
  './img/wR.png',
  './img/wQ.png',
  './img/wK.png',
  './img/bP.png',
  './img/bN.png',
  './img/bB.png',
  './img/bR.png',
  './img/bQ.png',
  './img/bK.png'
];

// 1. Install Event: Caches all the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching assets for ' + CACHE_NAME);
      return cache.addAll(assets);
    })
  );
});

// 2. Activate Event: Deletes the OLD cache and updates to the NEW one
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim()) 
  );
});

// 3. Fetch Event: Serves files from cache but fetches new ones if they don't exist
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

// 4. Message Event: Listens for the "UPDATE NOW" button click from index.html
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
