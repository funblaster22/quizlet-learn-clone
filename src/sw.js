// Adapted from https://glitch.com/edit/#!/workbox-strategies
// Resource https://developers.google.com/web/tools/workbox/modules/workbox-strategies
// Resource https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook
import {precacheAndRoute} from 'workbox-precaching'
import * as workbox from 'workbox-core';

precacheAndRoute(self.__WB_MANIFEST);

addEventListener('message', async event => {
    // event is an ExtendableMessageEvent object
    const {urls, deckId} = event.data;

    event.waitUntil((async () => {
        await (await caches.open("deck" + deckId)).addAll(urls);
        event.source.postMessage({head: "progress", body: 100});
    })());

});

/*/ To avoid async issues, we load strategies before we call it in the event listener
const {strategies} = workbox;

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(event.request.url);
    if (url.pathname.includes('/play')) {
        const cacheFirst = new workbox.strategies.CacheFirst();
        event.respondWith(cacheFirst.handle({event, request}));
    } else if (url.hostname === location.hostname && !url.pathname.includes('/search')) {
        const networkFirst = new workbox.strategies.NetworkFirst();
        event.respondWith(networkFirst.handle({event, request}));
    } else if (staticResources.includes(url.href)) {  // Non-changing libraries like jQuery
        const cacheOnly = new workbox.strategies.CacheOnly();
        event.respondWith(cacheOnly.handle({event, request}));
    } else {
        const networkOnly = new workbox.strategies.NetworkOnly();
        event.respondWith(networkOnly.handle({event, request}));
    }
});*/

// This immediately deploys the service worker w/o requiring a refresh
self.skipWaiting();
workbox.clientsClaim();

/*self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(workbox.core.cacheNames.runtime).then(function(cache) {
      return cache.addAll(staticResources);
    })
  );
});*/