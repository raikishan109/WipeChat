self.addEventListener('install', (event) => {
  console.log('WipeChat Service Worker installing.');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('WipeChat Service Worker activating.');
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Add custom caching logic here if needed
});
