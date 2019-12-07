var dataCacheName = 'hello-pwa';
var cacheName = 'hello-pwa';
var filesToCache = [
  '/',
  '/index.html',
  'style.css',
  'main.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = '//a.tile.openstreetmap.org';
  if (e.request.url.indexOf(dataUrl) > -1) {
   
    e.respondWith(
      caches.open(dataCacheName).then(function(cache) {
        cache.match(e.request).then(function(response) {
          if(response){
            return response;
          }
        });
        
        // Clone the request. A request is a stream and
        // can only be consumed once. 
          
        var fetchRequest = e.request.clone();

        return fetch(fetchRequest).then(function(response){
          cache.put(e.request.url, response.clone());
          return response;
        });
      })
    );
  } else {
    
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});