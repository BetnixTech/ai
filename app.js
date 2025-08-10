window.addEventListener("load", async () => {
  await initDB();
  registerServiceWorker().catch(console.warn);
  loadFiles();

  document.getElementById("importBtn").addEventListener("click", () => {
    document.getElementById("fileInput").click();
  });

  document.getElementById("fileInput").addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);
    for (let file of files) {
      let textContent = "";
      let transcript = "";
      if (file.type.startsWith("image/")) {
        textContent = await runOCR(file);
      } else if (file.type.startsWith("audio/") || file.type.startsWith("video/")) {
        // Store the file blob URL reference and attempt transcription
        transcript = await transcribeAudioFile(file).catch(err => {
          console.warn("transcription failed", err);
          return '';
        });
        textContent = transcript || "[Audio stored, no transcript available]";
      } else if (file.type === "text/plain") {
        textContent = await file.text();
      } else {
        textContent = "[File stored, no text extraction yet]";
      }

      // Summarize if we have textual content
      let summary = "";
      if (textContent && textContent.length > 50) {
        summary = await summarizeText(textContent).catch(err => {
          console.warn("summarization failed", err);
          return '';
        });
      }

      const reader = new FileReader();
      const blob = await new Promise(resolve => {
        reader.onload = () => resolve(new Blob([reader.result]));
        reader.readAsArrayBuffer(file);
      });

      const stored = {
        name: file.name,
        type: file.type,
        added_at: new Date().toISOString(),
        text: textContent,
        summary: summary,
        transcript: transcript,
        blob: blob // storing as Blob in IndexedDB
      };
      await saveFile(stored);
    }
    loadFiles();
  });

  document.getElementById("searchInput").addEventListener("input", loadFiles);
});

async function loadFiles() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const files = await getFiles();
  const list = document.getElementById("fileList");
  list.innerHTML = "";
  files
    .filter(f => {
      const name = (f.name || '').toLowerCase();
      const text = (f.text || '').toLowerCase();
      const summary = (f.summary || '').toLowerCase();
      const transcript = (f.transcript || '').toLowerCase();
      return !query || name.includes(query) || text.includes(query) || summary.includes(query) || transcript.includes(query);
    })
    .forEach(f => {
      const div = document.createElement("div");
      div.className = "file-item";
      const when = new Date(f.added_at).toLocaleString();
      div.innerHTML = `<strong>${f.name}</strong> <span class="small">(${when})</span><br>
        <em>Summary:</em> ${f.summary || '<span class="small">No summary</span>'}<br>
        <em>Transcript:</em> ${f.transcript || '<span class="small">No transcript</span>'}<br>
        <small>${(f.text || '').substring(0, 200)}${(f.text && f.text.length>200)?'...':''}</small>`;
      list.appendChild(div);
    });
}

// Service worker registration
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    await navigator.serviceWorker.register('service-worker.js');
    console.log("Service worker registered");
  }
}
