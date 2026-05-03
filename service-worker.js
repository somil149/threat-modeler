// ========================================
// Service Worker - Offline Support
// ========================================

const CACHE_NAME = 'threatmodeler-v1.7.0';
const urlsToCache = [
  '/threat-modeler/',
  '/threat-modeler/index.html',
  '/threat-modeler/styles.css',
  '/threat-modeler/app.js',
  '/threat-modeler/utils/storage.js',
  '/threat-modeler/utils/scoring.js',
  '/threat-modeler/utils/graph.js',
  '/threat-modeler/utils/export.js',
  '/threat-modeler/utils/keyboard.js',
  '/threat-modeler/utils/firebase-auth.js',
  '/threat-modeler/data/templates.json',
  '/threat-modeler/data/threat-patterns.json',
  '/threat-modeler/data/owasp-top10.json',
  '/threat-modeler/data/cloud-threats.json',
  '/threat-modeler/data/api-container-threats.json',
  '/threat-modeler/data/compliance.json',
  '/threat-modeler/data/component-library.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Return offline page if available
          return caches.match('/threat-modeler/index.html');
        });
      })
  );
});

// Background sync for offline changes
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-projects') {
    event.waitUntil(syncProjects());
  }
});

async function syncProjects() {
  // Sync logic for offline changes
  console.log('Syncing projects...');
  // Implementation would sync localStorage changes to server
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/threat-modeler/assets/icon-192.png',
    badge: '/threat-modeler/assets/badge.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
