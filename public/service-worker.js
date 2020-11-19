importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js');
const precaching = [
    { url: "/", revision: "1" },
    { url: "/index.html", revision: "1" },
    { url: "/manifest.json", revision: "1" },
    { url: "/layout/nav.html", revision: "1" },
    { url: "/pages/clubs.html", revision: "1" },
    { url: "/pages/favorites.html", revision: "1" },
    { url: "/pages/home.html", revision: "1" },
    { url: "/pages/standings.html", revision: "1" },
    { url: "/css/materialize.min.css", revision: "1" },
    { url: "/css/style.css", revision: "1" },
    { url: "/js/api.js", revision: "1" },
    { url: "/js/idb.js", revision: "1" },
    { url: "/js/idb-tim.js", revision: "1" },
    { url: "/js/main.js", revision: "1" },
    { url: "/js/materialize.min.js", revision: "1" },
    { url: "/js/nav.js", revision: "1" },
    { url: "/js/push.js", revision: "1" },
    { url: "/images/favicon.ico", revision: "1" },
    { url: "/images/icons/maskable-icon-96.png", revision: "1" },
    { url: "/images/icons/maskable-icon-192.png", revision: "1" },
    { url: "/images/icons/maskable-icon-512.png", revision: "1" },
    { url: "https://fonts.gstatic.com/s/merriweathersans/v13/2-c99IRs1JiJN1FRAMjTN5zd9vgsFHX1QjXp8Bte.woff2", revision: "1" },
    { url: "https://fonts.googleapis.com/css2?family=Merriweather+Sans:wght@400;600&display=swap", revision: "1" },
    { url: "https://fonts.googleapis.com/icon?family=Material+Icons", revision: "1" },
];

workbox.precaching.precacheAndRoute(precaching, {
    // Ignore all URL parameters.
    ignoreURLParametersMatching: [/.*/],
});

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.CacheFirst({
        cacheName: "cache-images",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60 * 24 * 30,
                maxEntries: 100,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    ({ url }) => url.origin === "https://api.football-data.org",
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: "cache-api",
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxAgeSeconds: 60 * 60,
            }),
        ],
    })
);


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
