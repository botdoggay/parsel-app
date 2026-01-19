import { dbAc, parselleriGetir, parselEkle, parselSil } from "./db.js";

window.addEventListener("DOMContentLoaded", async () => {

 await dbAc();

 // IndexedDB’den yükle
 const kayitlar = await parselleriGetir();

 kayitlar.forEach(p => {
  window.parseller.push(p);
  markerOlustur(p); // map.js fonksiyonu
 });

});
window.dbKaydet = parselEkle;
window.dbSil = parselSil;
