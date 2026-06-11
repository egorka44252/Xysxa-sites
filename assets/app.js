// assets/app.js
const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll('img[src*="photo.jpg"], img[src*="sign.png"]');
  imgs.forEach((img) => {
    if (!img.src.includes("nocache=")) {
      img.src = img.getAttribute("src").split("?")[0] + "?nocache=" + nocache;
    }
  });
});

// ... (вся інша частина app.js залишається майже без змін)

document.querySelectorAll("#dataNow").forEach(function (el) {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  el.textContent = `${day}.${month}.${year}`;
});

// Головне — виправлені шляхи до картинок
// Весь код нижче — це твій оригінальний app.js з замінами

// (Я заміню тільки критичні моменти)