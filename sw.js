// Service worker: experiencia offline limitada y segura.
const VERSION = 'v1'
const SHELL = `shell-${VERSION}`   // archivos de la app (HTML, JS, CSS, iconos)
const DATOS = `datos-${VERSION}`   // respuestas GET de la API (solo lectura)

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest', './icon.svg'])))
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {   // elimina cachés de versiones anteriores
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => ![SHELL, DATOS].includes(k)).map((k) => caches.delete(k)))))
  self.clients.claim()
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return            // POST/PATCH/DELETE nunca se cachean ni se simulan
  const url = new URL(req.url)

  if (url.pathname.startsWith('/tareas') || url.pathname.endsWith('/tareas')) {   // API: red primero, caché como respaldo
    e.respondWith(
      fetch(req).then((r) => {
        if (r.ok) { const copia = r.clone(); caches.open(DATOS).then((c) => c.put(req, copia)) }
        return r
      }).catch(() => caches.match(req).then((r) => r || new Response(JSON.stringify({ error: { mensaje: 'Sin conexion y sin datos guardados' } }), { status: 503, headers: { 'Content-Type': 'application/json' } })))
    )
    return
  }
  if (url.origin === location.origin) {       // app shell: caché primero y actualiza en segundo plano
    e.respondWith(
      caches.match(req).then((guardado) => {
        const red = fetch(req).then((r) => { if (r.ok) { const copia = r.clone(); caches.open(SHELL).then((c) => c.put(req, copia)) } return r })
        return guardado || red.catch(() => caches.match('./index.html'))
      })
    )
  }
})
