var staticCacheName = 'restaurant-static-2';
var imageCache = 'restaurant-images';
var cacheGroup = [
  staticCacheName,
  imageCache
]

/**
 * Serviceworker install event
 * 
 * Open cache and put eveything we want to cache into it.
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(['/',
        'index.html',
        'restaurant.html',
        'js/main.js',
        'js/serviceworkerRegister.js',
        'js/restaurant_info.js',
        'css/styles.css',
      ]);
    }),
    caches.open(imageCache).then(function (cache) {
      return cache.addAll(['/',
        'img/no-img.svg',
      ]);
    })
  );
});

/**
 * Serviceworker activation event
 * Triggers when it is finished installing
 * 
 * Cleans up the cache from older versions
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
        .filter(function (cacheName) {
          return
          cacheName.startsWith('restaurant-') &&
            !cacheGroup.includes(cacheName);
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Fetch event handler.
 * 
 * Returns cached requests or fetches them
 */
self.addEventListener('fetch', function (event) {
  let requestUrl = new URL(event.request.url);


  // Make sure we are on the same origin
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname.startsWith('/img/')) {
      event.respondWith(photoCache(event.request));
      return;
    }

    if (requestUrl.pathname.includes('/restaurant.html')) {
      event.respondWith(
        caches.match(requestUrl.pathname).then(function (response) {

          return response || fetch(event.request).catch((error) => {
            console.error(error)
          })
        }))
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request).catch((error) => {
        console.error(error)
      })
    })
  );
});


/**
 * Check cache for the image and returns if we have the image,
 * else go to the internet and fetch it, and store it for later
 * 
 * @param {ServiceWorker Fetch event} request 
 */
function photoCache(request) {
  var imageUrl = request.url
  return caches.open(imageCache).then(function (cache) {
    return cache.match(imageUrl).then(function (response) {
      if (response) return response;
      return fetch(request).then(function (responsFromNetwork) {
        cache.put(imageUrl, responsFromNetwork.clone());
        return responsFromNetwork;
      }).catch(error => {
        return cache.match('img/no-img.svg').then(function (response) {
          return response;
        });
      });
    });
  });
}