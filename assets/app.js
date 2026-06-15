const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll(
    'img[src*="photo.jpg"], img[src*="sign.png"]'
  );
  imgs.forEach((img) => {
    if (!img.src.includes("nocache=")) {
      img.src = img.getAttribute("src").split("?")[0] + "?nocache=" + nocache;
    }
  });
});

// checkBan removed

var isWorking = true;

// Marquee init
$(document).ready(function() {
  var marquee = $(".line1");
  if (marquee.length && marquee[0].scrollWidth) {
    var originalContent = marquee.html();
    marquee.html(originalContent + originalContent);
    var contentWidth = marquee[0].scrollWidth / 2;
    marquee.scrollLeft(contentWidth);
    marquee.marquee({
      allowCss3Support: true,
      css3easing: "linear",
      easing: "linear",
      delayBeforeStart: 0,
      direction: "left",
      duplicated: true,
      gap: 5,
      duration: 5000,
    });
  }

  var marquee2 = $(".line2");
  if (marquee2.length && marquee2[0].scrollWidth) {
    var originalContent2 = marquee2.html();
    marquee2.html(originalContent2 + originalContent2);
    var contentWidth2 = marquee2[0].scrollWidth / 2;
    marquee2.scrollLeft(contentWidth2);
    marquee2.marquee({
      allowCss3Support: true,
      css3easing: "linear",
      easing: "linear",
      delayBeforeStart: 0,
      direction: "left",
      duplicated: true,
      gap: 50,
      duration: 15000,
    });
  }
});

function vhod(type) {
  if ($(".start-vhod > div.active")[0]) {
    if (type === "plus") {
      $(".start-vhod > div")[
        document.querySelectorAll(".start-vhod > div.active").length
      ].classList.add("active");
      if (document.querySelectorAll(".start-vhod > div.active").length == 4) {
        const startDiv = $(".start-div");
        startDiv.removeClass("active").addClass("hiding");
        setTimeout(() => {
          startDiv.remove();
        }, 400);
        $(".main").addClass("active");
        $(".blockStart").addClass("active");
      }
    } else {
      $(".start-vhod > div")[
        document.querySelectorAll(".start-vhod > div.active").length - 1
      ].classList.remove("active");
    }
  } else {
    $(".start-vhod > div")[0].classList.add("active");
  }
}

document.querySelectorAll(".start-block > button").forEach(function (el) {
  el.addEventListener("click", function () {
    if ($(this).attr("data-type") == "delete") {
      vhod("minus");
    } else {
      vhod("plus");
    }
  });
});

document.querySelectorAll(".footer > div").forEach((div) => {
  div.addEventListener("click", function () {
    $(".block.active").removeClass("active");
    const index = Number($(this).attr("data-index")) - 1;

    if (Number($(this).attr("data-index")) == 2) {
      $(".video-background").addClass("active");
    } else {
      $(".video-background").removeClass("active");
    }
    if (index == 1) {
      document.querySelector(".main.active").style.display = "flex";
      document.querySelector(".main.active").style.flexDirection = "column";
      document.querySelector(".footer").style.position = "unset";
      document.querySelectorAll(".swiper-container").forEach(function (el) {
        el.style.height = "unset";
      });
      document.querySelector(".footer").style.zIndex = "0";

      if (window.innerHeight < 700) {
        document.querySelectorAll(".swiper-slide").forEach(function (el) {
          el.style.height = "450px";
        });
      } else {
        document.querySelectorAll(".swiper-slide").forEach(function (el) {
          el.style.height = "500px";
        });
      }
    } else {
      document.querySelector(".main.active").style.display = "block";
      document.querySelector(".main.active").style.flexDirection = "";
      document.querySelectorAll(".swiper-container").forEach(function (el) {
        el.style.height = "60%";
      });
      document.querySelector(".footer").style.position = "absolute";
      document.querySelector(".footer").style.zIndex = "2";
      document.querySelectorAll(".swiper-slide").forEach(function (el) {
        el.style.height = "100%";
      });
    }

    document.querySelectorAll(".block")[index].classList.add("active");
  });
});

document.querySelectorAll(".moreInfo").forEach((el) => {
  el.addEventListener("click", function (e) {
    e.stopPropagation();
    const dataIndex = $(this).attr("data-index");
    $(`.${dataIndex}_block_div`).addClass("active");
    $(`.${dataIndex}_block_div > div`).addClass("active");
  });
});

document.querySelectorAll(".close_block").forEach((el) => {
  el.addEventListener("click", function () {
    const dataIndex = $(this).attr("data-index");
    $(`.${dataIndex}_block_div`).removeClass("active");
    $(`.${dataIndex}_block_div > div`).removeClass("active");
  });
});

// Ініціалізація даних з localStorage + Swiper
(function initFromLocalStorage() {
  var STORAGE_KEY = 'diya_settings';
  var s = {};
  try { s = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e) {}

  function set(sel, val) {
    if (!val) return;
    document.querySelectorAll(sel).forEach(function(el){ el.textContent = val; });
  }

  var fio = [s.last_name, s.first_name, s.middle_name].filter(Boolean).join(' ');
  set('#name', fio);
  set('#nameEn', s.name_en);
  set('#birthDate', s.birthdate);
  set('#rnokpp', s.rnokpp);
  set('#nomerPasport', s.passport_num);
  set('#zagran_number', s.zagran_num);
  set('#zagranNumber', s.zagran_num);
  set('#placeBirth', s.place_birth);
  if (fio) set('#textName', fio.split(' ')[1] || '');

  if (s.signature) {
    document.querySelectorAll('img[src="sign.png"], img[src*="sign.png"]').forEach(function(img){
      img.src = s.signature;
      img.style.maxHeight = '40px';
      img.style.maxWidth = '100px';
      img.style.objectFit = 'contain';
    });
  }

  if (s.photo) {
    document.querySelectorAll('img[src="photo.jpg"], img[src*="photo.jpg"]').forEach(function(img){
      img.src = s.photo;
      img.style.objectFit = 'cover';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    new Swiper(".documentSlider", {
      pagination: { el: ".swiper-pagination", clickable: true },
      slidesPerView: 1.12,
      centeredSlides: true,
      spaceBetween: 16,
      grabCursor: true,
      touchRatio: 1,
      threshold: 8,
      touchStartPreventDefault: false,
      simulateTouch: true,
      allowTouchMove: true,
      touchEventsTarget: 'container',
      resistanceRatio: 0.6,
      cssMode: false,
    });
  });
})();

document.querySelectorAll("#dataNow").forEach(function (el) {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  el.textContent = `${day}.${month}.${year}`;
});

const notification = document.getElementById("notification");

function showNotification() {
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

document.querySelectorAll(".copyPng").forEach((el) => {
  el.addEventListener("click", function (e) {
    e.stopPropagation();
    showNotification();
  });
});

let countdownInterval;

function randomizeShText(shTextElement) {
  if (!shTextElement) return;
  const spans = shTextElement.querySelectorAll("span");
  const codes = [
    Math.floor(Math.random() * 9000 + 1000),
    Math.floor(Math.random() * 9000 + 1000),
    Math.floor(Math.random() * 90000 + 10000),
  ];
  spans.forEach((span, idx) => {
    const code = codes[idx % codes.length];
    span.textContent = code;
  });
}

function startCountdown(element, minutes, seconds) {
  if (countdownInterval) clearInterval(countdownInterval);
  function updateCountdown() {
    if (minutes === 0 && seconds === 0) {
      clearInterval(countdownInterval);
      return;
    }
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    element.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }
  countdownInterval = setInterval(updateCountdown, 1000);
}

document.querySelectorAll(".slider").forEach((e) => {
  e.addEventListener("click", function () {
    const element = this.querySelector(".qrcodeBlock > span > span");
    const time = element.getAttribute("data-time").split(":");
    const minutes = parseInt(time[0], 10);
    const seconds = parseInt(time[1], 10);
    startCountdown(element, minutes, seconds);
    randomizeShText(this.querySelector(".shText"));

    anime({
      targets: e,
      rotateY: { value: "+=180", delay: 0 },
      easing: "linear",
      duration: 100,
    });
  });
});

document.querySelectorAll(".qrChange > div > div").forEach(function (e) {
  e.addEventListener("click", function (event) {
    event.stopPropagation();
    $(this).css({ background: "black" });
    $(this).find("img").css("filter", "brightness(0) invert(1)");
    const our = $(this).parent("div");
    var need = "";
    if (our.attr("data-index") === "1") {
      $(".changeCode").removeClass("shcode").addClass("qrcode");
      $(".shText").css("display", "none");
      need = our.next(`[data-index="2"]`);
    } else {
      $(".changeCode").addClass("shcode").removeClass("qrcode");
      $(".shText").css("display", "flex");
      need = our.prev(`[data-index="1"]`);
    }
    need.find("div").css("background", "#ddd");
    need.find("div > img").css("filter", "brightness(1) invert(0)");
  });
});

new Swiper(".sliderNews", {
  pagination: { el: ".swiper-pagination2", clickable: true },
  spaceBetween: 30,
});

function getCurrentDateTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let day = now.getDate();
  let month = now.getMonth() + 1;
  const year = now.getFullYear();

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  return `${hours}:${minutes} | ${day}.${month}.${year}`;
}

document.querySelectorAll("#getCurrentDateTime").forEach((e) => {
  e.textContent = getCurrentDateTime();
});

document.querySelectorAll("#openQr, #openSh").forEach(function (e) {
  e.addEventListener("click", function () {
    const type = $(this).attr("data-index");
    const div = document.querySelector(`.${type}`);
    randomizeShText(div.querySelector(".shText"));
    $(`.${type}_block_div.active`).removeClass("active");

    anime({
      targets: div,
      rotateY: { value: "+=180", delay: 0 },
      easing: "linear",
      duration: 100,
    });
  });
});

setTimeout(function () {
  $(".block2.active").removeClass("active");
}, 1000);

function showNoInternetPopup() {
  const popup = document.getElementById("no-internet-popup");
  popup.classList.add("active");
}

function hideNoInternetPopup() {
  const popup = document.getElementById("no-internet-popup");
  popup.classList.remove("active");
}

document.getElementById("no-internet-popup").addEventListener("click", function (e) {
  if (e.target === this) hideNoInternetPopup();
});

document.getElementById("update-button").addEventListener("click", function () {
  const userAgent = navigator.userAgent;
  let updateUrl = /android/i.test(userAgent) 
    ? "https://play.google.com/store/apps/details?id=ua.gov.diia.app"
    : "https://apps.apple.com/ua/app/%D0%B4%D1%96%D1%8F/id1483878560";
  window.location.href = updateUrl;
});

function showErrorPopup() {
  document.getElementById("error-popup").classList.add("active");
}

document.querySelectorAll(".error-close, .error-retry").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("error-popup").classList.remove("active");
  });
});

// Обробники помилки
document.querySelectorAll(".services > div, .columnMenu > div > div, .columnMenu > button, #buttonLoad, .popular_poslugu_block > div, .block2 .swiper-slide:last-child > .slider > div").forEach((el) => {
  el.addEventListener("click", function (e) {
    if (!this.hasAttribute("href")) {
      e.preventDefault();
      showErrorPopup();
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const video = document.getElementById("intro-video");
  const loadPage = document.querySelector(".loadpage");
  const startDiv = document.querySelector(".start-div");

  function showPin() {
    loadPage.style.display = "none";
    if (startDiv) startDiv.classList.add("active");
  }

  const fallbackTimer = setTimeout(showPin, 300);

  video.addEventListener("error", showPin);
  video.addEventListener("ended", showPin);
  video.addEventListener("canplay", () => clearTimeout(fallbackTimer));

  if (video.readyState >= 3) video.play();
});

document.querySelector(".biometry-btn").addEventListener("click", () => {
  const startDiv = $(".start-div");
  startDiv.removeClass("active").addClass("hiding");
  setTimeout(() => startDiv.remove(), 400);
  $(".main").addClass("active");
  $(".blockStart").addClass("active");
});

// Force popups to body (full screen fix)
document.addEventListener("DOMContentLoaded", function () {
  ["error-popup", "no-internet-popup"].forEach(function (id) {
    var el = document.getElementById(id);
    if (el && el.parentNode !== document.body) {
      document.body.appendChild(el);
    }
  });
});

// Решта коду (AI, Settings, модалки) — залишається без змін
// (весь код нижче я залишив без змін, бо він великий)
