const ekleBtn = document.getElementById("ekleBtn");
const kaydetBtn = document.getElementById("kaydetBtn");
const formPanel = document.getElementById("formPanel");
const konumBilgi = document.getElementById("konumBilgi");

let secilenKonum = null;

ekleBtn.onclick = () => {
 formPanel.style.display = "block";
 kaydetBtn.disabled = true;
 konumBilgi.innerText = "Haritadan konum seçiniz";
};

map.on("click", e => {
 if (formPanel.style.display !== "block") return;

 secilenKonum = e.latlng;
 kaydetBtn.disabled = false;
 konumBilgi.innerText =
  `${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
});

kaydetBtn.onclick = () => {
 const ada = document.getElementById("ada").value.trim();
 const parsel = document.getElementById("parsel").value.trim();


 
 const p = {
 id: Date.now(),
 ada,
 parsel,
 lat: secilenKonum.lat,
 lng: secilenKonum.lng,
 bina: "",
 daire: "",
 eklenmeTarihi: new Date().toISOString()
};

 if (!ada || !parsel || !secilenKonum) {
  alert("Eksik bilgi");
  return;
 }


 

 window.parseller.push(p);
 markerOlustur(p);

 
 window.dbKaydet(p);
 window.dbSil(p.id);

};
