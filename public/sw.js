const CACHE_NAME = 'routineos-v1.0.0'
const STATIC_CACHE_NAME = 'routineos-static-v1.0.0'
const DYNAMIC_CACHE_NAME = 'routineos-dynamic-v1.0.0'

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/manifest.json',
    '/globals.css',
    '/_next/static/css/app/layout.css',
    '/_next/static/css/app/page.css',
    // Add other critical static assets
]

// API endpoints to cache
const CACHE_URLS = [
    '/api/auth',
    '/api/sheets/sync'
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...')

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static files')
                return cache.addAll(STATIC_FILES)
            })
            .catch((error) => {
                console.error('Service Worker: Failed to cache static files', error)
            })
    )

    // Force activation of new service worker
    self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...')

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE_NAME &&
                        cacheName !== DYNAMIC_CACHE_NAME &&
                        cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Deleting old cache', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )

    // Take control of all clients
    return self.clients.claim()
})

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return
    }

    // Handle different types of requests
    if (request.method === 'GET') {
        event.respondWith(handleGetRequest(request))
    } else if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
        event.respondWith(handleMutationRequest(request))
    }
})

// Handle GET requests with cache-first strategy for static assets
async function handleGetRequest(request) {
    const url = new URL(request.url)

    // Static assets - cache first
    if (isStaticAsset(url.pathname)) {
        return cacheFirst(request, STATIC_CACHE_NAME)
    }

    // API requests - network first with cache fallback
    if (url.pathname.startsWith('/api/')) {
        return networkFirst(request, DYNAMIC_CACHE_NAME)
    }

    // Pages - network first with cache fallback
    return networkFirst(request, DYNAMIC_CACHE_NAME)
}

// Handle mutation requests with background sync
async function handleMutationRequest(request) {
    try {
        // Try network first
        const response = await fetch(request.clone())

        // If successful, update cache if it's a cacheable endpoint
        if (response.ok && shouldCacheResponse(request.url)) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME)
            cache.put(request.clone(), response.clone())
        }

        return response
    } catch (error) {
        // If offline, queue the request for background sync
        console.log('Service Worker: Queueing request for background sync', request.url)

        // Store the request for later retry
        await storeFailedRequest(request)

        // Return a custom offline response
        return new Response(
            JSON.stringify({
                error: 'Request queued for when online',
                offline: true,
                timestamp: Date.now()
            }),
            {
                status: 202,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }
}

// Cache-first strategy
async function cacheFirst(request, cacheName) {
    try {
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(request)

        if (cachedResponse) {
            return cachedResponse
        }

        const networkResponse = await fetch(request)
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone())
        }

        return networkResponse
    } catch (error) {
        console.error('Service Worker: Cache-first strategy failed', error)
        return new Response('Offline - content not available', { status: 503 })
    }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request)

        if (networkResponse.ok) {
            const cache = await caches.open(cacheName)
            cache.put(request, networkResponse.clone())
        }

        return networkResponse
    } catch (error) {
        // Network failed, try cache
        const cache = await caches.open(cacheName)
        const cachedResponse = await cache.match(request)

        if (cachedResponse) {
            return cachedResponse
        }

        // Return offline fallback
        return getOfflineFallback(request)
    }
}

// Check if URL is a static asset
function isStaticAsset(pathname) {
    return pathname.startsWith('/_next/static/') ||
        pathname.startsWith('/icons/') ||
        pathname.startsWith('/images/') ||
        pathname.endsWith('.css') ||
        pathname.endsWith('.js') ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.jpeg') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.ico')
}

// Check if response should be cached
function shouldCacheResponse(url) {
    return CACHE_URLS.some(cacheUrl => url.includes(cacheUrl))
}

// Store failed requests for background sync
async function storeFailedRequest(request) {
    try {
        const requestData = {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            body: await request.text(),
            timestamp: Date.now()
        }

        // Store in IndexedDB or localStorage
        const failedRequests = JSON.parse(localStorage.getItem('failedRequests') || '[]')
        failedRequests.push(requestData)
        localStorage.setItem('failedRequests', JSON.stringify(failedRequests))
    } catch (error) {
        console.error('Service Worker: Failed to store request', error)
    }
}

// Get offline fallback response
function getOfflineFallback(request) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/')) {
        return new Response(
            JSON.stringify({
                error: 'No internet connection',
                offline: true,
                message: 'This request will be retried when you come back online'
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }

    // For pages, return a basic offline page
    return new Response(
        `<!DOCTYPE html>
    <html>
    <head>
      <title>RoutineOS - Offline</title>
      <style>
        body { 
          font-family: system-ui, sans-serif; 
          background: #111827; 
          color: #f9fafb; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          min-height: 100vh; 
          margin: 0; 
          text-align: center; 
        }
        .offline-container { 
          max-width: 400px; 
          padding: 2rem; 
        }
        .offline-icon { 
          font-size: 4rem; 
          margin-bottom: 1rem; 
        }
        h1 { 
          color: #3b82f6; 
          margin-bottom: 1rem; 
        }
        p { 
          color: #9ca3af; 
          line-height: 1.6; 
        }
        .retry-btn { 
          background: #3b82f6; 
          color: white; 
          border: none; 
          padding: 0.75rem 1.5rem; 
          border-radius: 0.5rem; 
          font-size: 1rem; 
          cursor: pointer; 
          margin-top: 1rem; 
        }
        .retry-btn:hover { 
          background: #2563eb; 
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <div class="offline-icon">📱</div>
        <h1>You're Offline</h1>
        <p>RoutineOS is not available right now. Please check your internet connection and try again.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>`,
        {
            status: 503,
            headers: { 'Content-Type': 'text/html' }
        }
    )
}

// Background sync for failed requests
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(retryFailedRequests())
    }
})

// Retry failed requests when online
async function retryFailedRequests() {
    try {
        const failedRequests = JSON.parse(localStorage.getItem('failedRequests') || '[]')
        const successfulRequests = []

        for (const requestData of failedRequests) {
            try {
                const request = new Request(requestData.url, {
                    method: requestData.method,
                    headers: requestData.headers,
                    body: requestData.body || undefined
                })

                const response = await fetch(request)

                if (response.ok) {
                    successfulRequests.push(requestData)
                    console.log('Service Worker: Successfully retried request', requestData.url)
                }
            } catch (error) {
                console.error('Service Worker: Failed to retry request', requestData.url, error)
            }
        }

        // Remove successful requests from storage
        if (successfulRequests.length > 0) {
            const remainingRequests = failedRequests.filter(
                req => !successfulRequests.some(success => success.timestamp === req.timestamp)
            )
            localStorage.setItem('failedRequests', JSON.stringify(remainingRequests))
        }
    } catch (error) {
        console.error('Service Worker: Error during background sync', error)
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'New update available!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open RoutineOS',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Close',
                icon: '/icons/xmark.png'
            }
        ]
    }

    event.waitUntil(
        self.registration.showNotification('RoutineOS', options)
    )
})

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        )
    }
})

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }

    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
                return cache.addAll(event.data.urls)
            })
        )
    }
}) 