const CACHE_NAME = 'bytepay-cache-v1';
const assetsToCache = [
  './index.html',
  './manifest.json',
  './icono1.png',
  './icono2.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
});
