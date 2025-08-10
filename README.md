# Offline Knowledge Hub (PWA) — with In-Browser Summarization & Transcription

This project is a Progressive Web App (PWA) that runs fully in the browser. It stores user files locally in IndexedDB and performs:

- OCR on images using Tesseract.js
- Summarization in-browser using transformers.js (Xenova)
- Automatic Speech Recognition (ASR) in-browser using transformers.js (Xenova)

Important notes:
- On first use the browser will download models (may take time). After download they are cached for offline use.
- Everything stays in the user's browser and IndexedDB — no server uploads.
- If you want to host the code publicly, push this folder to GitHub and enable GitHub Pages.

Files included:
- index.html, style.css, app.js, db.js, ocr.js, summarizer.js, transcription.js, manifest.json, service-worker.js

