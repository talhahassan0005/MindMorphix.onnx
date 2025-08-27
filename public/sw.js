// Service Worker for MindMorphix - Performance Optimization
const CACHE_NAME = 'mindmorphix-v1.0.0';
const STATIC_CACHE = 'mindmorphix-static-v1.0.0';
const DYNAMIC_CACHE = 'mindmorphix-dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/Detection',
  '/AboutUs',
  '/Blogs',
  '/Support',
  '/howitworks',
  '/login',
  '/singup',
  '/HeroSection.mp4',
  '/onnxmodel.onnx',
  '/braintumor.png',
  '/file.svg',
  '/globe.svg',
  '/next.svg',
  '/promisepic.jpg',
  '/TeamPic.jpg',
  '/vercel.svg',
  '/window.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle ONNX model with special caching strategy
  if (url.pathname === '/onnxmodel.onnx') {
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              if (response) {
                console.log('ONNX model served from cache');
                return response;
              }
              
              return fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.status === 200) {
                    console.log('ONNX model cached for future use');
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                });
            });
        })
    );
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.open(STATIC_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              if (response) {
                return response;
              }
              return fetch(request);
            });
        })
    );
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          return caches.open(DYNAMIC_CACHE)
            .then((cache) => {
              return cache.match(request);
            });
        })
    );
    return;
  }

  // Default strategy for other requests
  event.respondWith(
    fetch(request)
      .catch(() => {
        return caches.open(DYNAMIC_CACHE)
          .then((cache) => {
            return cache.match(request);
          });
      })
  );
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Perform any background tasks here
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Message handling for performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.ports[0].postMessage({
      type: 'CACHE_INFO',
      staticCache: STATIC_CACHE,
      dynamicCache: DYNAMIC_CACHE,
      staticAssets: STATIC_ASSETS
    });
  }
});
