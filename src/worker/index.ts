// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference lib="webworker" />

export {};
declare const self: ServiceWorkerGlobalScope;

self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const title = data.title || "Notificación de CREI";
    const options = {
      body: data.body || "Tienes una nueva actualización",
      icon: data.icon || "/app-logo.png",
      badge: "/icon.svg",
      data: data.url ? { url: data.url } : undefined,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && "focus" in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});
