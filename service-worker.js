const CACHE_NAME = 'walchsee-v2';
const APP_FILES = [
  './', './index.html', './dagplanning.html', './restaurants.html', './wandelingen.html', './praktisch.html',
  './css/style.css', './js/app.js', './data/walchsee.json', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES))));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
