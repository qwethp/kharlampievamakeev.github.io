const CACHE_NAME = "senya-v1"; // Увеличиваем версию кэша
const urlsToCache = [
  "/",
  "/manifest.json",
  "/icon.png",
  "/styles.css",
  "/script.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Удаляем устаревшие кэши
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
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Если ресурс есть в кэше, возвращаем его
      if (response) {
        return response;
      }

      // В противном случае делаем сетевой запрос и кэшируем его для будущего использования
      return fetch(event.request).then((response) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
