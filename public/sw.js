const CACHE_VERSION = 'dashboard-v1'
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icon.svg',
  '/favicon.svg',
]
const API_PREFIX = 'http://127.0.0.1:8000/'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)).catch(() => null)
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((c) => c !== CACHE_VERSION).map((c) => caches.delete(c)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = req.url

  if (url.startsWith(API_PREFIX)) {
    event.respondWith(networkFirst(req))
    return
  }

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match('/index.html'))
    )
    return
  }

  event.respondWith(cacheFirst(req))
})

async function cacheFirst(req) {
  const cache = await caches.open(CACHE_VERSION)
  const cached = await cache.match(req)
  if (cached) return cached
  try {
    const resposta = await fetch(req)
    if (resposta.ok) cache.put(req, resposta.clone())
    return resposta
  } catch {
    return cached || Response.error()
  }
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE_VERSION)
  try {
    const resposta = await fetch(req)
    if (resposta.ok) cache.put(req, resposta.clone())
    return resposta
  } catch {
    const cached = await cache.match(req)
    return cached || Response.error()
  }
}
