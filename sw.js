var staticCacheName = 'restaurant-static-1';
var imageCache = 'restaurant-images';

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(['/', 'index.html', 'restaurant.html', 'js/main.js', 'js/dbhelper.js', 'js/serviceworkerRegister.js', 'js/restaurant_info.js', 'css/styles.css', 'data/restaurants.json']);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
        .filter(function (cacheName) {
          return (
            cacheName.startsWith('restaurant-static-') && cacheName != staticCacheName
          );
        })
        .map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  )
});

self.addEventListener('fetch', function (event) {

  var requestUrl = new URL(event.request.url);

  // Make sure we are on the same origin
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/dist/img/')) {
      event.respondWith(photoCache(event.request));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});

function photoCache(request) {
  var imageUrl = request.url

  return caches.open(imageCache).then(function(cache){
    return cache.match(imageUrl).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(responsFromNetwork){
        cache.put(imageUrl, responsFromNetwork.clone());
        return responsFromNetwork;
      });
    });
  });
}