const CACHE_NAME = 'bytepay-cache-v4';
const assetsToCache = [
  '/BytePay/',
  '/BytePay/index.html',
  '/BytePay/manifest.json'
];

// Instalación: Guarda los archivos base en la caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// Activación: Borra las cachés de versiones anteriores para eliminar el código viejo
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptación: Prioriza la red y respaldá con caché si no hay conexión
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
