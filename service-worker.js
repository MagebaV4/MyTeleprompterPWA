// ========================================
// MY TELEPROMPTER - SERVICE WORKER
// VERSION 2 - GITHUB PAGES SUPPORT
// ========================================

const CACHE_NAME = "myteleprompter-v9";

const APP_BASE = self.registration.scope;

const FILES_TO_CACHE = [
    APP_BASE,
    new URL("index.html", APP_BASE).href,
    new URL("manifest.json", APP_BASE).href,
    new URL("icons/icon-192.png", APP_BASE).href,
    new URL("icons/icon-512.png", APP_BASE).href
];

// Install and cache application files
self.addEventListener("install", function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();

});

// Activate and remove old caches
self.addEventListener("activate", function (event) {

    event.waitUntil(
        caches.keys().then(function (cacheNames) {

            return Promise.all(
                cacheNames
                    .filter(function (name) {
                        return name.startsWith("myteleprompter-")
                            && name !== CACHE_NAME;
                    })
                    .map(function (name) {
                        return caches.delete(name);
                    })
            );

        })
    );

    self.clients.claim();

});

// Serve cached files when offline
self.addEventListener("fetch", function (event) {

    if (event.request.method !== "GET") {
        return;
    }

    if (event.request.mode === "navigate") {

        event.respondWith(
            fetch(event.request).catch(function () {
                return caches.match(APP_BASE);
            })
        );

        return;
    }

    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {
            return cachedResponse || fetch(event.request);
        })
    );

});