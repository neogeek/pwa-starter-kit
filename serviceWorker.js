const cacheName = 'pwa-starter-kit';
const cacheVersion = `${cacheName}::1.0.0`;

const cachedFiles = [
    '/',
    '/styles.css'
];

self.addEventListener('install', event => {

    event.waitUntil(
        caches.open(cacheVersion)
            .then(cache => cache.addAll(cachedFiles))
    );

});

self.addEventListener('activate', event => {

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key.indexOf(cacheName) === 0 && key !== cacheVersion)
                    .map(key => caches.delete(key))
            )
        )
    );

    return self.clients.claim();

});

self.addEventListener('fetch', event => {

    event.respondWith(
        caches.match(event.request)
            .then(response => {

                caches.open(cacheVersion).then(cache => cache.add(event.request.url));

                return response || fetch(event.request);

            })
    );

});
