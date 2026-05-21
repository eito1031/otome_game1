const CACHE = 'eito-v2';

self.addEventListener('install', e => {
  const base = self.registration.scope;
  const ASSETS = [
    base,
    base + 'index.html',
    base + 'style.css',
    base + 'app.js',
    base + 'manifest.json',
    base + 'icon.svg',
  ];
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
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
  if (e.request.url.includes('api.anthropic.com')) return;
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
