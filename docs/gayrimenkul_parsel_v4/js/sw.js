const CACHE = "parsel-v1";
const FILES = [
 "/",
 "/index.html",
 "/css/style.css",
 "/js/map.js",
 "/js/ui.js",
 "/js/tkgm.js",
 "/js/bina.js",
 "/js/config.js",
 "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
 "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
];

self.addEventListener("install", e => {
 e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(FILES))
 );
});

self.addEventListener("fetch", e => {
 e.respondWith(
  caches.match(e.request).then(r => r || fetch(e.request))
 );
});
