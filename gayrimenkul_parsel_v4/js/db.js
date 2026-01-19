const DB_NAME = "parselDB";
const DB_VERSION = 1;
const STORE = "parseller";

let db = null;

export function dbAc() {
 return new Promise((resolve, reject) => {
  const req = indexedDB.open(DB_NAME, DB_VERSION);

  req.onupgradeneeded = e => {
   db = e.target.result;
   if (!db.objectStoreNames.contains(STORE)) {
    db.createObjectStore(STORE, { keyPath: "id" });
   }
  };

  req.onsuccess = e => {
   db = e.target.result;
   resolve(db);
  };

  req.onerror = () => reject("DB açılamadı");
 });
}

export function parselEkle(p) {
 return new Promise(resolve => {
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(p);
  tx.oncomplete = resolve;
 });
}

export function parselleriGetir() {
 return new Promise(resolve => {
  const tx = db.transaction(STORE, "readonly");
  const req = tx.objectStore(STORE).getAll();
  req.onsuccess = () => resolve(req.result || []);
 });
}

export function parselSil(id) {
 return new Promise(resolve => {
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);
  tx.oncomplete = resolve;
 });
}
import { parselEkle } from "./db.js";

await parselEkle(p);
import { dbAc, parselleriGetir } from "./db.js";

window.addEventListener("DOMContentLoaded", async () => {
 await dbAc();
 const kayitlar = await parselleriGetir();

 kayitlar.forEach(p => {
  window.parseller.push(p);
  markerOlustur(p);
 });
});
fotoInput.onchange = () => {
 const files = Array.from(fotoInput.files);

 files.forEach(file => {
  p.fotograflar = p.fotograflar || [];
  p.fotograflar.push(file); // 🔥 Blob

  parselEkle(p);
 });
};
const url = URL.createObjectURL(blob);
img.src = url;
import { parselEkle } from "./db.js";
