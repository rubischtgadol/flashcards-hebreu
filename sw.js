/*
 * Service worker de la PWA (hors-ligne). Non utilisé par flashcards_hebreu.html
 * (le standalone est déjà autonome) : l'enregistrement vit dans le bloc
 * BUILD:ONLINE-ONLY d'index.html.
 *
 * Stratégie : stale-while-revalidate sur les fichiers de l'app — démarrage
 * instantané depuis le cache, mise à jour en arrière-plan (le nouveau
 * vocabulaire apparaît au lancement suivant). Les polices Google sont servies
 * cache-first (immuables).
 *
 * Incrémenter VERSION pour forcer un nouveau cache après un changement de
 * stratégie ou de liste d'assets (pas nécessaire pour le contenu, qui se
 * rafraîchit tout seul).
 */
const VERSION = 'v1';
const CACHE = 'flashcards-hebreu-' + VERSION;

const ASSETS = [
  './',
  './vocabulaire_hebreu.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (url.origin !== location.origin && !isFont) return;

  // Toute navigation (/, /index.html, lien profond) sert la coquille './'.
  const cacheKey = req.mode === 'navigate' ? './' : req.url;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(cacheKey);

    // Polices : immuables, pas besoin de revalider.
    if (cached && isFont) return cached;

    // Refetch par URL (et non par Request) : l'app demande le vocabulaire en
    // cache:'no-store', qu'on ne peut pas réutiliser tel quel pour cache.put.
    const refresh = fetch(cacheKey === './' ? './' : req.url)
      .then((res) => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(cacheKey, res.clone());
        return res;
      })
      .catch(() => null);

    if (cached) {
      e.waitUntil(refresh);
      return cached;
    }
    const fresh = await refresh;
    if (fresh) return fresh;
    return new Response('Hors ligne — ressource absente du cache.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  })());
});
