const staticCacheName = "site-static-v6"; //
const dynamicCacheName = "site-dynamic-v3";
const assets = [
  "/",
  "./index.html",

  "./pages/fallback.html",
  "./js/app.js",
  "./js/ui.js",
  "./css/style.css",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
  "https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];
// limit cache size -- delete oldest one
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

//install sw
self.addEventListener("install", e => {
  console.log("serviceWorker has been installed");
  e.waitUntil(
    // wait for caches to be done b4 install finish
    caches
      .open(staticCacheName)
      .then(cache => {
        console.log("caching shell assets");
        cache.addAll(assets);
      })
      .catch(err => console.log(err))
  );
});

//listen to activate evt
self.addEventListener("activate", e => {
  //delete old cache
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== staticCacheName && key !== dynamicCacheName)
          .map(key => caches.delete(key))
      );
    })
  );
});

//fetch event
self.addEventListener("fetch", e => {
  // do not save cache from firestore api; save in indexdb
  if (e.request.url.indexOf("firestore.googleapis.com") === -1) {
    // check if theres something in cache that match the request
    e.respondWith(
      caches
        .match(e.request)
        .then(cacheRes => {
          return (
            cacheRes ||
            fetch(e.request).then(fetchRes => {
              //save new request to dynamic cache
              return caches.open(dynamicCacheName).then(cache => {
                cache.put(e.request.url, fetchRes.clone());
                limitCacheSize(dynamicCacheName, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (e.request.url.indexOf(".html") > -1) {
            return caches.match("./pages/fallback.html");
          }
        })
    );
  }
});
