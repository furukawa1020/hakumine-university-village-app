const CACHE_NAME = 'hakumine-university-village-v2';
const urlsToCache = [
  '/',
  '/dashboard',
  '/calendar',
  '/chat',
  '/map',
  '/quests',
  '/diary',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Service Worker のインストール
self.addEventListener('install', (event) => {
  console.log('Service Worker: Install event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Service Worker のアクティベーション
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate event');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// フェッチイベントの処理
self.addEventListener('fetch', (event) => {
  // API呼び出しやFirebase関連はキャッシュしない
  if (event.request.url.includes('api') || 
      event.request.url.includes('firebase') ||
      event.request.url.includes('googleapis')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュがある場合はそれを返す
        if (response) {
          return response;
        }
        
        // ネットワークから取得を試みる
        return fetch(event.request)
          .then((response) => {
            // レスポンスが無効な場合は何もしない
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // レスポンスをキャッシュにコピー
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
      .catch(() => {
        // オフライン時のフォールバック
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});
