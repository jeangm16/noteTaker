const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/notes.html",
    "/manifest.webmanifest",
    "/assets/css/styles.css",
    "/assets/js/index.js",
];

const CACHE_NAME = "static-cache-v2";

const DATA_CACHE_NAME = "data-cache-v1";

// when the service worker is installed
self.addEventListener("install", function (evt) {
    // tell the service worker to wait until all of this is finished
    evt.waitUntil(
        // open the static cache and once it's open (promise) then
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            // add all of the files that we want to cache into the static file cache
            return cache.addAll(FILES_TO_CACHE);
        })
    );

    // now tell the current service working to stop waiting, this ensures that the newly
    // installed service worker takes over the page when it's installed (if it was updated),
    // rather than requiring the pages to be refreshed
    self.skipWaiting();
});

// the activate event is fired right after the installation, this activate event
// is used when we want to clean up anything that may have been left over from 
// the previous service worker
self.addEventListener("activate", function (evt) {
    // tell the service worker to wait until all of this is finished
    evt.waitUntil(
        // we're getting ALL of the items from the cache by their key
        caches.keys().then(keyList => {
            // we want to return a promise (that is required for this method to work)
            // we are using Promise.all so that it will wait until all of the
            // delete methods we are calling below will be completed before moving on
            return Promise.all(
                // we're mapping over all of the keys from the cache
                keyList.map(key => {
                    // if the key does not match the current CACHE_NAME and the DATA_CACHE_NAME
                    // then it is an older cache and we don't need it anymore. Basically we
                    // probably changed CACHE_NAME from "static-cache-v1" to "static-cache-v2"
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );