alert("map.js çalıştı");

/* ===============================
   HARİTA
================================ */
const map = L.map("map").setView(CONFIG.baslangic, CONFIG.zoom);



L.tileLayer(
 "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
).addTo(map);

// SAFARI TEST TILE (GEÇİCİ)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19
}).addTo(map);



const mahalleler = [
 { ad: "KARAHASANLI", lat: 37.8091279, lng: 28.9774192, zoom: 13 },
 { ad: "ŞEMİKLER", lat: 37.8052527, lng: 29.0336559, zoom: 14 },
 { ad: "1200 EVLER", lat: 37.7817481, lng: 28.9941842, zoom: 15 },
 { ad: "HALLAÇLAR", lat: 37.7772927, lng: 28.9742580, zoom: 14 },
 { ad: "GERZELE", lat: 37.7218188, lng: 29.0029297, zoom: 13 },
 { ad: "ÇAKMAK", lat: 37.7909707, lng: 28.9832659, zoom: 14 },
 { ad: "YENİŞAFAK", lat: 37.8073537, lng: 29.0113674, zoom: 14 },
 { ad: "ADALET", lat: 37.7812792, lng: 29.0050224, zoom: 14 },
 { ad: "SELÇUK BEY", lat: 37.7914074, lng: 29.0042270, zoom: 14 },
 { ad: "BEREKETLER", lat: 37.7914074, lng: 29.0042270, zoom: 14 },
 { ad: "SERVERGAZİ", lat: 37.7291979, lng: 28.9819032, zoom: 13 },
 { ad: "GÖVEÇLİK", lat: 37.7911116, lng: 28.9581642, zoom: 15 }
];
function mahalleleriYukle() {
 const select = document.getElementById("mahalleSelect");
 if (!select) return;

 select.innerHTML = `<option value="">Mahalle seç</option>`;

 mahalleler.forEach(m => {
  const opt = document.createElement("option");
  opt.value = m.ad;
  opt.textContent = m.ad;
  select.appendChild(opt);
 });
}

function mahalleSecimBagla() {
 const select = document.getElementById("mahalleSelect");
 if (!select) return;

 select.onchange = () => {
  const m = mahalleler.find(x => x.ad === select.value);
  if (!m) return;

  map.setView([m.lat, m.lng], m.zoom || 14);
 };
}


/* ===============================
   GLOBAL VERİ
================================ */
window.parseller = [];

/* ===============================
   MARKER OLUŞTUR
================================ */
function markerOlustur(p) {
 const marker = L.marker([p.lat, p.lng]).addTo(map);
 const tarih = p.eklenmeTarihi
 ? new Date(p.eklenmeTarihi).toLocaleString("tr-TR")
 : "Bilinmiyor";


 // sorgu için metadata
 marker.options.ada = p.ada;
 marker.options.parsel = p.parsel;
 marker._pid = p.id;

 marker.bindPopup(() => `
 <div style="width:230px">

  <!-- SEKME BUTONLARI -->
  <div style="display:flex;margin-bottom:5px">
   <button class="tabBtn aktif" data-tab="oz_${p.id}" style="flex:1">Özellikler</button>
   <button class="tabBtn" data-tab="ilet_${p.id}" style="flex:1">İletişim</button>
  </div>

  <!-- ÖZELLİKLER -->
  <div id="oz_${p.id}" class="tabIcerik">
   <b>${p.ada}/${p.parsel}</b><br><br>

   <b>🏢 Bina</b><br>
   <textarea id="bina_${p.id}" rows="2" style="width:100%">${p.bina || ""}</textarea><br>

   <b>🏠 Daire</b><br>
   <textarea id="daire_${p.id}" rows="2" style="width:100%">${p.daire || ""}</textarea>
  </div>

  <!-- İLETİŞİM -->
  <div id="ilet_${p.id}" class="tabIcerik" style="display:none">
   <b>👷 Müteahhit</b><br>
   <input id="mut_${p.id}" style="width:100%" value="${p.muteahhit || ""}"><br>

   <b>📞 Telefon</b><br>
   <input id="tel_${p.id}" style="width:100%" value="${p.telefon || ""}"><br>

   <b>📧 E-posta</b><br>
   <input id="ep_${p.id}" style="width:100%" value="${p.eposta || ""}">
  </div>
  


  <br>
  <button id="kaydet_${p.id}">💾 Kaydet</button>
  <button id="sil_${p.id}" style="color:red">🗑 Sil</button>

<b>📸 Fotoğraflar</b><br>
<input type="file" id="foto_${p.id}" accept="image/*" multiple>

<div id="galeri_${p.id}" style="
 display:flex;
 flex-wrap:wrap;
 gap:6px;
 margin-top:6px;
">
 ${ (p.fotograflar || []).map(f => `
  <img src="${f}"
   class="galeriImg"
   style="
    width:70px;
    height:70px;
    object-fit:cover;
    border-radius:6px;
    cursor:pointer;
   ">
 `).join("") }
</div>






<hr>
<div style="font-size:11px;color:#666;text-align:center">
 🕒 Eklenme Tarihi<br>
 <b>${tarih}</b>
</div>


 <a href="https://www.google.com/maps?q=${p.lat},${p.lng}"
    target="_blank"
    style="display:block;text-align:center;font-weight:bold">
  📍 Google Maps’te Aç
 </a>
 </div>
`);

let kadastroAcik = true;

const katmanBtn = document.getElementById("katmanBtn");

katmanBtn.onclick = () => {
 if (kadastroAcik) {
  map.removeLayer(kadastro);
  katmanBtn.innerText = "🗺 Kadastro Aç";
 } else {
  kadastro.addTo(map);
  katmanBtn.innerText = "🗺 Kadastro Kapat";
 }
 kadastroAcik = !kadastroAcik;
};


 marker.on("popupopen", () => {
   const popupEl = marker.getPopup().getElement();
popupEl.querySelectorAll(".galeriImg").forEach(img => {
 img.onclick = () => {
  modalImg.src = img.src;
  fotoModal.style.display = "flex";
 };
});

// sekme butonları
popupEl.querySelectorAll(".tabBtn").forEach(btn => {
 btn.onclick = () => {
  popupEl.querySelectorAll(".tabBtn").forEach(b => b.classList.remove("aktif"));
  popupEl.querySelectorAll(".tabIcerik").forEach(i => i.style.display = "none");

  btn.classList.add("aktif");
  popupEl.querySelector("#" + btn.dataset.tab).style.display = "block";
 };
});

  const el = marker.getPopup().getElement();
  L.DomEvent.disableClickPropagation(el);

  const btn = document.getElementById("kaydet_" + p.id);
  if (!btn) return;

  btn.onclick = () => {
 p.bina = document.getElementById("bina_" + p.id).value;
 p.daire = document.getElementById("daire_" + p.id).value;

 p.muteahhit = document.getElementById("mut_" + p.id).value;
 p.telefon = document.getElementById("tel_" + p.id).value;
 p.eposta = document.getElementById("ep_" + p.id).value;




  

};
const fotoInput = document.getElementById("foto_" + p.id);
const galeri = document.getElementById("galeri_" + p.id);

if (fotoInput && galeri) {
 fotoInput.onchange = () => {
  const files = Array.from(fotoInput.files);

  files.forEach(file => {
   const reader = new FileReader();
   reader.onload = e => {

    // 1️⃣ veriye ekle
    p.fotograflar = p.fotograflar || [];
    p.fotograflar.push(e.target.result);

    localStorage.setItem("parseller", JSON.stringify(window.parseller));

    // 2️⃣ ekranda göster
    const img = document.createElement("img");
    img.src = e.target.result;
    img.className = "galeriImg";
    img.style.width = "70px";
    img.style.height = "70px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";
    img.style.cursor = "pointer";

    // 3️⃣ büyütme
    img.onclick = () => {
     modalImg.src = img.src;
     fotoModal.style.display = "flex";
    };

    galeri.appendChild(img);
   };
   reader.readAsDataURL(file);
  });

  fotoInput.value = "";
 };
}


  const silBtn = document.getElementById("sil_" + p.id);
if (silBtn) {
 silBtn.onclick = () => {
  if (!confirm("Bu parseli silmek istiyor musunuz?")) return;

  // 1️⃣ Haritadan markerı kaldır
  map.removeLayer(marker);

  // 2️⃣ Diziden sil
  window.parseller = window.parseller.filter(x => x.id !== p.id);

  // 3️⃣ LocalStorage güncelle
  localStorage.setItem("parseller", JSON.stringify(window.parseller));

  alert("Parsel silindi");
 };
}

 });
}

/* ===============================
   LOCALSTORAGE YÜKLE
================================ */
function yukle() {
 const data = localStorage.getItem("parseller");
 if (!data) return;

 const kayitlar = JSON.parse(data);
 window.parseller.length = 0;

 kayitlar.forEach(p => {
  window.parseller.push(p);
  markerOlustur(p);
 });
}

/* ===============================
   PARSEL SORGU
================================ */
function parselSorguBagla() {
 const btn = document.getElementById("sorgulaBtn");
 if (!btn) {
  console.warn("sorgulaBtn yok");
  return;
 }

 btn.onclick = () => {
  const ada = document.getElementById("sAda").value.trim();
  const parsel = document.getElementById("sParsel").value.trim();

  if (!ada || !parsel) {
   alert("Ada ve parsel giriniz");
   return;
  }

  let bulundu = false;

  map.eachLayer(layer => {
   if (
    layer instanceof L.Marker &&
    layer.options.ada === ada &&
    layer.options.parsel === parsel
   ) {
    map.setView(layer.getLatLng(), 18);
    layer.openPopup();
    bulundu = true;
   }
  });

  if (!bulundu) {
   alert("Parsel bulunamadı");
  }
 };
}

/* ===============================
   BAŞLAT
================================ */

window.addEventListener("DOMContentLoaded", () => {
 yukle();
 parselSorguBagla();
 mahalleleriYukle();
 mahalleSecimBagla();
});
const fotoModal = document.getElementById("fotoModal");
const modalImg = document.getElementById("modalImg");

if (fotoModal) {
 fotoModal.onclick = () => {
  fotoModal.style.display = "none";
  modalImg.src = "";
 };
 window.dbSil(p.id);

}
