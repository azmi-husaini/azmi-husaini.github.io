const CACHE_NAME = "premier-league-v1";
var urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/layout/nav.html",
    "/pages/clubs.html",
    "/pages/favorites.html",
    "/pages/home.html",
    "/pages/standings.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/api.js",
    "/js/idb-tim.js",
    "/js/idb.js",
    "/js/main.js",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/push.js",
    "/images/favicon.ico",
    "/images/beranda.svg",
    "/images/icons/maskable-icon-96.png",
    "/images/icons/maskable-icon-192.png",
    "/images/icons/maskable-icon-512.png",
    "https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;600&display=swap",
    "https://fonts.gstatic.com/s/merriweathersans/v13/2-c99IRs1JiJN1FRAMjTN5zd9vgsFHX1QjXp8Bte.woff2",
    "https://fonts.googleapis.com/icon?family=Material+Icons"
];

self.addEventListener("install", function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function(event) {
    var base_url = "https://api.football-data.org/v2";

    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function(cache) {
                return fetch(event.request).then(function(response) {
                    cache.put(event.request.url, response.clone());

                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function(response) {
                return response || fetch(event.request);
            })
        )
    }
});

self.addEventListener("activate", function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log(`ServiceWorker: cache ${cacheName} dihapus`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("push", function(event) {
    let body;

    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }

    let options = {
        body: body,
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
        },
    };

    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});