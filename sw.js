// Service Worker لنظام نداء الطلاب: يستقبل الإشعارات ويعرضها حتى والصفحة مغلقة.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data ? e.data.text() : "" }; }
  var title = d.title || "نداء انصراف";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || "يوجد طالب مطلوب نزوله إلى البوابة.",
    tag: d.tag || "call",
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 120, 300, 120, 300],
    icon: "icon-192.png",
    badge: "icon-192.png",
    lang: "ar",
    dir: "rtl"
  }));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ("focus" in list[i]) return list[i].focus(); }
    return self.clients.openWindow("./");
  }));
});
