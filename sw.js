const CACHE_NAME = 'bytepay-cache-v1';
const ASSETS_TO_CACHE = [
  '/BytePay/',
  '/BytePay/index.html',
  '/BytePay/manifest.json',
  '/BytePay/icono1.png',
  '/BytePay/icono2.png'
];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones y servir desde la caché o red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Escuchar notificaciones Push (para alertas de fechas o contratos)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'BytePay Notificación';
  const options = {
    body: data.body || 'Tienes un vencimiento o pago próximo.',
    icon: '/BytePay/icono1.png',
    badge: '/BytePay/icono2.png',
    data: { url: data.url || '/BytePay/index.html' }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Manejar la acción cuando el usuario hace clic en la notificación
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
