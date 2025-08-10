const DB_NAME = "knowledgeHub";
const DB_VERSION = 1;
let db;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = e => {
      db = e.target.result;
      if (!db.objectStoreNames.contains("files")) {
        const store = db.createObjectStore("files", { keyPath: "id", autoIncrement: true });
        store.createIndex("name", "name", { unique: false });
      }
    };
    request.onsuccess = e => { db = e.target.result; resolve(); };
    request.onerror = e => reject(e);
  });
}

function saveFile(fileObj) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    const req = tx.objectStore("files").add(fileObj);
    req.onsuccess = () => resolve(req.result);
    req.onerror = (e) => reject(e);
  });
}

function getFiles() {
  return new Promise((resolve) => {
    const tx = db.transaction("files", "readonly");
    const store = tx.objectStore("files");
    store.getAll().onsuccess = e => resolve(e.target.result || []);
  });
}
