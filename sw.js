const version = 'latest'
importScripts(`https://cdn.jsdelivr.net/npm/workbox-sw@${version}`)

if (workbox) {
    console.log("Yes! Workbox is loaded");

    workbox.setConfig({
        modulePathCb(name, debug) {
            const env = debug ? 'dev' : 'prod'
            return `https://cdn.jsdelivr.net/npm/${name}@${version}/build/${name}.${env}.js`
        },
    })

    workbox.precaching.precacheAndRoute([
        {
            "url": "/",
            "revision": "1"
        }
    ]);

    workbox.routing.registerRoute(
        /\.(?:js|css)$/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'static-files',
        }),
    );

    workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'cache-images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 60,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
                }),
            ],
        }),
    );

    workbox.routing.registerRoute(
        new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
        workbox.strategies.cacheFirst({
            cacheName: 'googleapis',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: 30,
                }),
            ],
        }),
    );
} else {
    console.log("No! Workbox didn't load");
}
