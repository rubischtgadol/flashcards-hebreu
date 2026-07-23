/*
 * Service worker de la PWA (hors-ligne). Non utilisé par flashcards_hebreu.html
 * (le standalone est déjà autonome) : l'enregistrement vit dans le bloc
 * BUILD:ONLINE-ONLY d'app.html, et dans le portail (index.html).
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
// v19 : le filtre « Thèmes » (12 champs sémantiques, data-theme sur les tables
// Noms/Adjectifs/Verbes du carnet). Le bump porte le nouvel app.html au premier
// lancement : c'est une fonctionnalité visible de l'écran de départ, pas un
// contenu qui se rafraîchit seul.
//
// v10 : le dernier lot d'exemples (Prépositions, Adverbes, Mots interrogatifs — 54 mots,
// 510 → 564). Le contenu se rafraîchit seul en stale-while-revalidate, donc ce bump n'est
// pas indispensable ; il est délibéré. Ces trois catégories sont celles où l'exemple *est*
// l'enseignement — une préposition ne s'apprend qu'en contexte —, et faire attendre un
// lancement de plus pour les voir apparaître serait payer une latence pour rien.
//
// v9 : l'écran de départ se replie (Catégories/Niveau) + la note Prononciation affiche
// le voiceURI. Le bump n'est pas cosmétique : la stratégie est du stale-while-revalidate,
// donc sans lui l'ancien app.html serait servi au premier lancement et le nouveau
// seulement au second — or c'est précisément sur ce nouvel écran que l'identifiant de
// la voix doit être relevé. Un diagnostic qu'on demande à quelqu'un doit être visible
// du premier coup.
// v12 : le diagnostic de latence (dossier « lag iPhone ») s'affiche dans
// « Réglages avancés ». Le bump est la condition de l'enquête : la mesure doit
// être sur le téléphone au premier lancement, pas au second — c'est exactement
// le cas « un diagnostic qu'on demande à quelqu'un doit être visible du
// premier coup » de v9.
// v14 : les liens Google Fonts des trois pages passent en non-bloquant (chantier
// « premier affichage » — en <link> classique, WebKit ne peint rien tant que la
// feuille n'est pas arrivée). Le bump est nécessaire : les coquilles HTML sont en
// stale-while-revalidate, donc sans lui l'ancien index.html/app.html — celui qui
// bloque — serait resservi une fois de plus, et le correctif du premier
// affichage ne serait justement pas là au premier affichage.
// v13 : le lot de correction de l'audit (nikoud de מָלוֹן et סִפְרִיָּה, genre
// de סַכָּנָה ; le pluriel de גַּב est resté — גַּבּוֹת attesté par l'Académie).
// Le contenu se rafraîchirait seul, mais deux vocalisations apprises étaient
// fausses : elles doivent disparaître du téléphone au premier lancement, pas
// au second.
// v22 : lot grammaire n°2 — 4 sections neuves dans le carnet (Le présent,
// L'impératif promu depuis le bonus du futur, Le conditionnel הָיִיתִי,
// Suffixes possessifs) + bloc « Reconnaître le binyan » ; le sommaire passe
// à 35 pilules. Nouveau cours = visible au premier lancement.
// v25 : sens de lecture réparé sur mobile — au verso des cartes verbes les
// formes se lisent droite→gauche (.forms en direction:rtl), et dans le carnet
// les rangs de vocabulaire remettent les inflexions sur une ligne avec
// l'exemple EN DESSOUS. Correctif visuel = visible au premier lancement.
// v26 : verso des verbes en grille 2×2 (.forms.forms-grid) — singulier au-dessus,
// pluriel dessous, masculin à droite en RTL, comme une table de conjugaison ;
// noms et adjectifs gardent la ligne souple. Visible au premier lancement.
const VERSION = 'v28';
const CACHE = 'flashcards-hebreu-' + VERSION;

const ASSETS = [
  './',
  './app.html',
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

  // Seules les navigations vers la racine (/ ou /index.html) sont normalisées
  // sur la coquille './' — c'est désormais le PORTAIL. Les autres pages
  // (app.html, vocabulaire_hebreu.html) doivent être servies telles quelles —
  // les rabattre sur './' casserait l'appli et le carnet.
  const isRootNav = req.mode === 'navigate' &&
    (url.pathname.endsWith('/') || url.pathname.endsWith('/index.html'));
  const cacheKey = isRootNav ? './' : req.url;

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
