self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Recordatorio CREI";
  const options = {
    body: data.body || "Tienes un evento importante próximo.",
    icon: data.icon || "/app-logo.png",
    badge: data.badge || "/icon.svg",
    tag: data.tag || "crei-calendar-reminder",
    renotify: true,
    data: {
      url: data.url || "/es/portal-terapeutas/app/eventos-importantes",
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = new URL(
    event.notification.data?.url || "/es/portal-terapeutas/app/eventos-importantes",
    self.location.origin,
  ).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => client.url === targetUrl);
      if (existing && "focus" in existing) return existing.focus();
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
      return undefined;
    }),
  );
});
