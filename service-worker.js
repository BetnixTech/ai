self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("knowledgeHubCache").then(cache => {
      return cache.addAll(["/", "/index.html", "/style.css", "/app.js", "/db.js", "/ocr.js", "/summarizer.js", "/transcription.js"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
