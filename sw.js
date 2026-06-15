const CACHE = 'diya-v3';
const ASSETS = [
  '/Xysxa-sites/',
  '/Xysxa-sites/index.html',
  '/Xysxa-sites/manifest.json',
  '/Xysxa-sites/assets/styles.css',
  '/Xysxa-sites/assets/app.js',
  '/Xysxa-sites/assets/anime.js',
  '/Xysxa-sites/assets/favicon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => cached))
  );
});
