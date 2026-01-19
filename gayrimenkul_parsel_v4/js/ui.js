const menuBtn = document.getElementById("menuBtn");
const menuPanel = document.getElementById("menuPanel");

menuBtn.onclick = () => {
 menuPanel.style.display =
  menuPanel.style.display === "none" ? "block" : "none";
};
window.addEventListener("DOMContentLoaded", () => {

 /* ===============================
    SOL MENÜ AÇ / KAPAT
 ================================ */
 const menuBtn = document.getElementById("menuBtn");
 const menuPanel = document.getElementById("menuPanel");

 if (menuBtn && menuPanel) {
  menuBtn.onclick = () => {
   menuPanel.style.display =
    menuPanel.style.display === "none" ? "block" : "none";
  };
 }

 /* ===============================
    PARSEL SORGU
 ================================ */
 parselSorguBagla();

 /* ===============================
    MAHALLE
 ================================ */
 mahalleleriYukle();
 mahalleSecimBagla();

});
