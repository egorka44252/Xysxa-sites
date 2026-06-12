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

// Marquee init - safe, runs after DOM ready
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

// Ban logic
var wrongAttempts = 0;
var MAX_ATTEMPTS = 5;
var BAN_SECONDS = 30;
var banInterval = null;

function showBan() {
  var banScreen = document.getElementById('ban-screen');
  var timerEl = document.getElementById('ban-timer');
  if (!banScreen) return;
  banScreen.classList.add('active');
  var secs = BAN_SECONDS;
  timerEl.textContent = '0:' + (secs < 10 ? '0' : '') + secs;
  if (banInterval) clearInterval(banInterval);
  banInterval = setInterval(function() {
    secs--;
    timerEl.textContent = '0:' + (secs < 10 ? '0' : '') + secs;
    if (secs <= 0) {
      clearInterval(banInterval);
      banInterval = null;
      wrongAttempts = 0;
      banScreen.classList.remove('active');
      // reset dots
      document.querySelectorAll('.start-vhod > div').forEach(function(d){ d.classList.remove('active'); });
    }
  }, 1000);
}

function shakeVhod() {
  var vhodEl = document.querySelector('.start-vhod');
  if (!vhodEl) return;
  vhodEl.style.transition = 'transform 0.05s';
  var moves = [10, -10, 8, -8, 5, -5, 0];
  var i = 0;
  var shakeInterval = setInterval(function() {
    vhodEl.style.transform = 'translateX(' + moves[i] + 'px)';
    i++;
    if (i >= moves.length) {
      clearInterval(shakeInterval);
      vhodEl.style.transform = '';
      // reset dots after wrong
      document.querySelectorAll('.start-vhod > div').forEach(function(d){ d.classList.remove('active'); });
    }
  }, 50);
}

function vhod(type) {
  if (banInterval) return; // blocked
  if ($(".start-vhod > div.active")[0]) {
    if (type === "plus") {
      var activeDots = document.querySelectorAll(".start-vhod > div.active").length;
      if (activeDots < 4) {
        $(".start-vhod > div")[activeDots].classList.add("active");
      }
      if (document.querySelectorAll(".start-vhod > div.active").length == 4) {
        wrongAttempts = 0;
        const startDiv = $(".start-div");
        startDiv.removeClass("active").addClass("hiding");
        setTimeout(() => {
          startDiv.remove();
        }, 400);
        $(".main").addClass("active");
        $(".blockStart").addClass("active");
      }
    } else {
      var activeDots = document.querySelectorAll(".start-vhod > div.active").length;
      if (activeDots === 4) {
        // Delete on full = wrong attempt
        wrongAttempts++;
        shakeVhod();
        if (wrongAttempts >= MAX_ATTEMPTS) {
          showBan();
        }
      } else {
        $(".start-vhod > div")[activeDots - 1].classList.remove("active");
      }
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

// Ініціалізація даних з localStorage (Settings) + Swiper
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
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Январь — это 0!
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

// Генерация случайных блоков цифр под штрихкодом
function randomizeShText(shTextElement) {
  if (!shTextElement) return;
  const spans = shTextElement.querySelectorAll("span");
  const codes = [
    Math.floor(Math.random() * 9000 + 1000), // 4 цифры
    Math.floor(Math.random() * 9000 + 1000), // 4 цифры
    Math.floor(Math.random() * 90000 + 10000), // 5 цифр
  ];
  spans.forEach((span, idx) => {
    const code = codes[idx % codes.length];
    span.textContent = code;
  });
}

// Функция для запуска обратного отсчета
function startCountdown(element, minutes, seconds) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  // Обновление элемента на странице, чтобы отобразить текущее время обратного отсчета
  function updateCountdown() {
    // Если время вышло, остановите таймер
    if (minutes === 0 && seconds === 0) {
      clearInterval(countdownInterval);
      return;
    }

    // Уменьшите количество секунд
    seconds--;

    // Если секунды меньше нуля, уменьшите количество минут и установите секунды в 59
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }

    // Обновите элемент обратного отсчета на странице
    element.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Запустите таймер, вызывая updateCountdown каждую секунду
  countdownInterval = setInterval(updateCountdown, 1000);
}

// Найдите все элементы с классом 'countdown'
const countdownElements = document.querySelectorAll(
  ".qrcodeBlock > span > span"
);

document.querySelectorAll(".slider").forEach((e) => {
  e.addEventListener("click", function () {
    const current = $(this);
    const element = this.querySelector(".qrcodeBlock > span > span");
    const time = element.getAttribute("data-time").split(":");
    const minutes = parseInt(time[0], 10);
    const seconds = parseInt(time[1], 10);
    startCountdown(element, minutes, seconds);

    // Обновляем цифры под штрихкодом при каждом перевороте
    randomizeShText(this.querySelector(".shText"));

    anime({
      targets: e,
      rotateY: {
        value: "+=180",
        delay: 0,
      },
      easing: "linear",
      duration: 100,
      complete: function (anim) {
        playing = false;
      },
    });

    document.querySelectorAll(".slider").forEach((e) => {
      const el = e.getAttribute("style");
      if (el) {
        const transformMatch = el.match(/rotateY\((-?\d+(\.\d+)?)deg\)/);
        if (transformMatch) {  // Добавь эту проверку
          const rotate = transformMatch[1];
          if (Number.isInteger(Number(rotate) / 360)) {
            console.log("открыто");
          } else {
            e.setAttribute("style", "transform: rotateY(0deg);");
          }
        }
      }
    });
  });
});

document.querySelectorAll(".qrChange > div > div").forEach(function (e) {
  e.addEventListener("click", function (event) {
    event.stopPropagation();
    $(this).css({ background: "black" });
    $(this).find("img").css("filter", "brightness(0) invert(1)");
    const our = $(this).parent("div");
    console.log(our);
    var need = "";
    if (our.attr("data-index") === "1") {
      $(".changeCode").removeClass("shcode");
      $(".changeCode").addClass("qrcode");
      $(".shText").css("display", "none");
      need = our.next(`[data-index="2"]`);
    } else {
      $(".changeCode").addClass("shcode");
      $(".changeCode").removeClass("qrcode");
      $(".shText").css("display", "flex");
      need = our.prev(`[data-index="1"]`);
    }
    need.find("div").css("background", "#ddd");
    need.find("div > img").css("filter", "brightness(1) invert(0)");
  });
});

new Swiper(".sliderNews", {
  pagination: {
    el: ".swiper-pagination2",
    clickable: true,
  },
  // slidesPerView: 1.15,
  // centeredSlides: true,
  spaceBetween: 30,
});

function getCurrentDateTime() {
  // Получаем текущую дату и время
  const now = new Date();

  // Получаем часы и минуты
  let hours = now.getHours();
  let minutes = now.getMinutes();

  // Дополняем нулями до двух цифр при необходимости
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  // Получаем день, месяц и год
  let day = now.getDate();
  let month = now.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
  const year = now.getFullYear();

  // Дополняем нулями до двух цифр при необходимости
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;

  // Формируем строку в нужном формате
  const formattedDateTime = `${hours}:${minutes} | ${day}.${month}.${year}`;

  return formattedDateTime;
}

// Выводим текущие дату и время в нужном формате
document.querySelectorAll("#getCurrentDateTime").forEach((e) => {
  e.textContent = getCurrentDateTime();
});

document.querySelectorAll("#openQr").forEach(function (e) {
  e.addEventListener("click", function (element) {
    const type = $(this).attr("data-index");
    const div = document.querySelector(`.${type}`);

    // Обновляем цифры под штрихкодом при показе QR/штрихкода
    randomizeShText(div.querySelector(".shText"));

    $(`.${type}_block_div.active`).removeClass("active");

    anime({
      targets: div,
      rotateY: {
        value: "+=180",
        delay: 0,
      },
      easing: "linear",
      duration: 100,
      complete: function (anim) {
        playing = false;
      },
    });

    const her = $(`.${type}`).find(".qrChange > div > div")[0];

    console.log(her);

    $(her).css({ background: "black" });
    $(her).find("img").css("filter", "brightness(0) invert(1)");
    const our = $(her).parent("div");
    var need = "";
    if (our.attr("data-index") === "1") {
      $(".changeCode").removeClass("shcode");
      $(".changeCode").addClass("qrcode");
      $(".shText").css("display", "none");
      need = our.next(`[data-index="2"]`);
    } else {
      $(".changeCode").addClass("shcode");
      $(".changeCode").removeClass("qrcode");
      $(".shText").css("display", "flex");
      need = our.prev(`[data-index="1"]`);
    }
    need.find("div").css("background", "#ddd");
    need.find("div > img").css("filter", "brightness(1) invert(0)");
  });
});

document.querySelectorAll("#openSh").forEach(function (e) {
  e.addEventListener("click", function (element) {
    const type = $(this).attr("data-index");
    const div = document.querySelector(`.${type}`);

    // Обновляем цифры под штрихкодом при показе QR/штрихкода
    randomizeShText(div.querySelector(".shText"));

    $(`.${type}_block_div.active`).removeClass("active");

    anime({
      targets: div,
      rotateY: {
        value: "+=180",
        delay: 0,
      },
      easing: "linear",
      duration: 100,
      complete: function (anim) {
        playing = false;
      },
    });

    const her = $(`.${type}`).find(".qrChange > div > div")[1];

   

    $(her).css({ background: "black" });
    $(her).find("img").css("filter", "brightness(0) invert(1)");
    const our = $(her).parent("div");
    var need = "";
    if (our.attr("data-index") === "1") {
      $(".changeCode").removeClass("shcode");
      $(".changeCode").addClass("qrcode");
      $(".shText").css("display", "none");
      need = our.next(`[data-index="2"]`);
    } else {
      $(".changeCode").addClass("shcode");
      $(".changeCode").removeClass("qrcode");
      $(".shText").css("display", "flex");
      need = our.prev(`[data-index="1"]`);
    }
    need.find("div").css("background", "#ddd");
    need.find("div > img").css("filter", "brightness(1) invert(0)");
  });
});

setTimeout(function () {
  $(".block2.active").removeClass("active");
}, 1000);

// $('.study').parent('div').remove();

// Пройдитесь по всем элементам и запустите для каждого обратный отсчёт
// Функция для показа попапа
function showNoInternetPopup() {
  const popup = document.getElementById("no-internet-popup");
  popup.classList.add("active");
}

// Функция для скрытия попапа
function hideNoInternetPopup() {
  const popup = document.getElementById("no-internet-popup");
  popup.classList.remove("active");
}

// Закрытие попапа при клике на фон
document
  .getElementById("no-internet-popup")
  .addEventListener("click", function (e) {
    if (e.target === this) {
      hideNoInternetPopup();
    }
  });

// Обработчик для кнопки "Оновити"
document.getElementById("update-button").addEventListener("click", function () {
  const userAgent = navigator.userAgent;
  let updateUrl;

  if (/android/i.test(userAgent)) {
    updateUrl = "https://play.google.com/store/apps/details?id=ua.gov.diia.app";
  } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
    updateUrl = "https://apps.apple.com/ua/app/%D0%B4%D1%96%D1%8F/id1483878560";
  } else {
    // По умолчанию Play Market, если User Agent не распознан
    updateUrl = "https://play.google.com/store/apps/details?id=ua.gov.diia.app";
  }

  window.location.href = updateUrl;
});

// Обработчики для кнопок в "Сервіси"
document.querySelectorAll(".services > div").forEach((service) => {
  service.addEventListener("click", function (e) {
    e.preventDefault();
    showErrorPopup();
  });
});

// Обработчики для кнопок в "Меню"
document
  .querySelectorAll(".columnMenu > div > div, .columnMenu > button")
  .forEach((menuItem) => {
    menuItem.addEventListener("click", function (e) {
      e.preventDefault();
      showErrorPopup();
    });
  });

// Обработчики для кнопок в "Стрічка" (block1 blockStart)

// Попап только на кнопки с id="buttonLoad"
document.querySelectorAll("#buttonLoad").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    showErrorPopup();
  });
});

// А третью кнопку делаем без id и с прямой ссылкой
// (удалите id="buttonLoad" у третьей кнопки в HTML)

// Обработчик для "Незламність" в "Стрічка"

// Обработчик для "Популярні послуги" в "Стрічка"
document
  .querySelectorAll(".block1.blockStart .popular_poslugu_block > div")
  .forEach((popularItem) => {
    popularItem.addEventListener("click", function (e) {
      e.preventDefault();
      showErrorPopup();
    });
  });

// Обработчики для "Додати документ" и "Змінити порядок документів" в "Документи"
document
  .querySelectorAll(".block2 .swiper-slide:last-child > .slider > div")
  .forEach((docAction) => {
    docAction.addEventListener("click", function (e) {
      e.preventDefault();
      showErrorPopup();
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

  // Якщо відео недоступне — через 300мс показуємо пін
  const fallbackTimer = setTimeout(showPin, 300);

  video.addEventListener("error", function () {
    clearTimeout(fallbackTimer);
    showPin();
  });

  video.addEventListener("ended", function () {
    clearTimeout(fallbackTimer);
    showPin();
  });

  video.addEventListener("canplay", function () {
    clearTimeout(fallbackTimer);
  });

  if (video.readyState >= 3) {
    clearTimeout(fallbackTimer);
    video.play();
  }
});

document.querySelector(".biometry-btn").addEventListener("click", () => {
  const startDiv = $(".start-div");

  startDiv.removeClass("active").addClass("hiding");

  setTimeout(() => {
    startDiv.remove();
  }, 400);

  $(".main").addClass("active");
  $(".blockStart").addClass("active");
});

function showErrorPopup() {
  document.getElementById("error-popup").classList.add("active");
}

document.querySelectorAll(".error-close, .error-retry").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.getElementById("error-popup").classList.remove("active");
  });
});

const ModalMoove = (modal, modalContent, overlay) => {
  let startY;
  let currentY;
  let isDragging = false;

  modal.addEventListener("touchstart", function (e) {
    startY = e.touches[0].clientY;
    isDragging = true;
    modal.style.transition = "none";
    overlay.style.transition = "none";
  });
  modal.addEventListener("touchmove", function (e) {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    // Проверяем, если начался скроллинг внутри содержимого
    if (modalContent.scrollTop === 0 && diffY > 0) {
      e.preventDefault();
      if (diffY > 0) {
        modal.style.top = `calc(5% + ${diffY}px)`;
        const opacity = Math.max(0, 0.7 - diffY / 1000);
        overlay.style.opacity = opacity;
      }
    }
  });
  modal.addEventListener("touchend", function () {
    isDragging = false;
    modal.style.transition = "top 0.3s";
    if (currentY - startY > 200) {
      modal.style.top = "100%";
      modal.classList.remove("open");
      overlay.classList.add("hidden");
    } else {
      modal.style.top = "5%";
      overlay.style.opacity = 0.7;
    }
  });
};
const modalPasport = document.getElementById("pasport-modal");
const modalContentPasport = document.querySelector(".pasport-modal-content");

const modalZagran = document.getElementById("zagran-modal");
const modalContentZagran = document.querySelector(".zagran-modal-content");

const modalStudy = document.getElementById("study-modal");
const modalContentStudy = document.querySelector(".study-modal-content");

const modalPrava = document.getElementById("prava-modal");
const modalContentPrava = document.querySelector(".prava-modal-content");

const modaleDoc = document.getElementById("eDoc-modal");
const modalContenteDoc = document.querySelector(".eDoc-modal-content");

const modalBirth = document.getElementById("birth-modal");
const modalContentBirth = document.querySelector(".birth-modal-content");

const overlay = document.getElementById("overlay");
ModalMoove(modalBirth, modalContentBirth, overlay);
ModalMoove(modalPasport, modalContentPasport, overlay);
ModalMoove(modalZagran, modalContentZagran, overlay);
ModalMoove(modalStudy, modalContentStudy, overlay);
ModalMoove(modalPrava, modalContentPrava, overlay);
ModalMoove(modaleDoc, modalContenteDoc, overlay);

document.querySelectorAll("#fullInfoPasport").forEach((el) => {
  el.addEventListener("click", function () {
    modalPasport.style.top = "5%";
    modalPasport.classList.add("open");
    overlay.classList.remove("hidden");
    const dataIndex = this.getAttribute("data-index");
    $(`.pasport_block_div`).removeClass("active");
    $(`.pasport_block_div > div`).removeClass("active");
  });
});

document.querySelectorAll("#fullInfoZagran").forEach((el) => {
  el.addEventListener("click", function () {
    modalZagran.style.top = "5%";
    modalZagran.classList.add("open");
    overlay.classList.remove("hidden");
    const dataIndex = this.getAttribute("data-index");
    $(`.zagran_block_div`).removeClass("active");
    $(`.zagran_block_div > div`).removeClass("active");
  });
});

document.querySelectorAll("#fullInfoStudy").forEach((el) => {
  el.addEventListener("click", function () {
    modalStudy.style.top = "5%";
    modalStudy.classList.add("open");
    overlay.classList.remove("hidden");
    const dataIndex = this.getAttribute("data-index");
    $(`.study_block_div`).removeClass("active");
    $(`.study_block_div > div`).removeClass("active");
  });
});

document.querySelectorAll("#fullInfoeDoc").forEach((el) => {
  el.addEventListener("click", function () {
    modaleDoc.style.top = "5%";
    modaleDoc.classList.add("open");
    overlay.classList.remove("hidden");
    const dataIndex = this.getAttribute("data-index");
    $(`.eDoc_block_div`).removeClass("active");
    $(`.eDoc_block_div > div`).removeClass("active");
  });
});
document.querySelectorAll("#fullInfoBirth").forEach((el) => {
  el.addEventListener("click", function () {
    modalBirth.style.top = "5%";
    modalBirth.classList.add("open");
    overlay.classList.remove("hidden");
    $(`.birth_block_div`).removeClass("active");
    $(`.birth_block_div > div`).removeClass("active");
  });
});
document.querySelectorAll("#fullInfoPrava").forEach((el) => {
  el.addEventListener("click", function () {
    modalPrava.style.top = "5%";
    modalPrava.classList.add("open");
    overlay.classList.remove("hidden");
    const dataIndex = this.getAttribute("data-index");
    $(`.prava_block_div`).removeClass("active");
    $(`.prava_block_div > div`).removeClass("active");
  });
});

function startModalCountdown(modalSelector) {
  const timerEl = document.querySelector(
    `${modalSelector} .qrcodeBlock > span > span[data-time]`
  );
  if (!timerEl) return;

  const time = timerEl.getAttribute("data-time").split(":");
  let minutes = parseInt(time[0], 10);
  let seconds = parseInt(time[1], 10);

  // Очищаем старый таймер, если был
  if (window.modalCountdownInterval)
    clearInterval(window.modalCountdownInterval);

  window.modalCountdownInterval = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(window.modalCountdownInterval);
        return;
      }
      minutes--;
      seconds = 59;
    } else {
      seconds--;
    }

    timerEl.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  }, 1000);
}

// 2. Закрытие любой модалки + остановка таймера
function closeAllModals() {
  document.querySelectorAll(".modal.open").forEach((m) => {
    m.classList.remove("open");
  });
  if (window.modalCountdownInterval) {
    clearInterval(window.modalCountdownInterval);
    window.modalCountdownInterval = null;
  }
}

// 3. Универсальный обработчик для всех кнопок "Повна інформація"
document.querySelectorAll('[id^="fullInfo"]').forEach((btn) => {
  btn.addEventListener("click", function () {
    const id = this.id; // например fullInfoPasport, fullInfoZagran и т.д.

    let modalId = "";
    if (id.includes("Pasport")) modalId = "#pasport-modal";
    else if (id.includes("Zagran")) modalId = "#zagran-modal";
    else if (id.includes("Study")) modalId = "#study-modal";
    else if (id.includes("Prava")) modalId = "#prava-modal";
    else if (id.includes("Birth")) modalId = "#birth-modal";
    // Добавь сюда новые, если появятся (например #fullInfoPodatki → '#podatki-modal')

    if (modalId && document.querySelector(modalId)) {
      closeAllModals(); // закрываем все предыдущие
      document.querySelector(modalId).classList.add("open");
      startModalCountdown(modalId);

      // Обновляем цифры под штрихкодом, если в модалке есть .shText
      const shTextInModal = document.querySelector(`${modalId} .shText`);
      randomizeShText(shTextInModal);

      // Закрываем меню с опциями (чтобы не висело)
      const docType = modalId.replace("#", "").replace("-modal", "");
      $(`.${docType}_block_div`).removeClass("active");
      $(`.${docType}_block_div > div`).removeClass("active");
    }
  });
});

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", function (e) {
    if (e.target === this || e.target.classList.contains("handle")) {
      closeAllModals();
    }
  });
});

/* ===== Дія.AI Chat Logic ===== */
(function() {
  var aiMessages = [];
  var isAiTyping = false;

  function getMsgsEl() { return document.getElementById('diyaAiMessages'); }

  function scrollDown() {
    var el = getMsgsEl();
    if (el) el.scrollTop = el.scrollHeight;
  }

  // Set today's date chip
  function initDateChip() {
    var chip = document.getElementById('daiDateChip');
    if (!chip) return;
    var d = new Date();
    var months = ['січ.','лют.','бер.','квіт.','трав.','черв.','лип.','серп.','вер.','жовт.','лист.','груд.'];
    chip.textContent = d.getDate() + ' ' + months[d.getMonth()];
  }

  // Append AI message block with sparkle icon + actions
  function appendAiBlock(text) {
    var el = getMsgsEl();
    if (!el) return;
    var block = document.createElement('div');
    block.className = 'dai-msg-block';

    var row = document.createElement('div');
    row.className = 'dai-msg-row';

    var icon = document.createElement('div');
    icon.className = 'dai-sparkle-icon';
    icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 6.2L18 10l-6.2 1.8L10 18l-1.8-6.2L2 10l6.2-1.8L10 2Z" fill="currentColor"/><path d="M16 2l.9 2.6L19.5 5.5l-2.6.9L16 9l-.9-2.6L12.5 5.5l2.6-.9L16 2Z" fill="currentColor" opacity="0.5"/></svg>';

    var textDiv = document.createElement('div');
    textDiv.className = 'dai-msg-text';
    // Split by newlines into paragraphs
    text.split('\n').filter(function(l){ return l.trim(); }).forEach(function(line) {
      var p = document.createElement('p');
      p.textContent = line;
      textDiv.appendChild(p);
    });

    row.appendChild(icon);
    row.appendChild(textDiv);

    var actions = document.createElement('div');
    actions.className = 'dai-actions';
    actions.innerHTML = [
      '<button class="dai-action-btn" title="Подобається"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 22V11M2 13v7a2 2 0 002 2h11.26a2 2 0 001.96-1.6l1.54-7A2 2 0 0016.8 11H13V5a2 2 0 00-2-2h-.01a2 2 0 00-2 2v3L7 11" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>',
      '<button class="dai-action-btn" title="Не подобається"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 2v11m5-9v7a2 2 0 01-2 2H8.74a2 2 0 01-1.96 1.6L5.24 21A2 2 0 007.2 23H11v-3a2 2 0 012 2h.01a2 2 0 002-2v-3l2-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>',
      '<button class="dai-action-btn" title="Копіювати"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg></button>'
    ].join('');

    block.appendChild(row);
    block.appendChild(actions);
    el.appendChild(block);
    scrollDown();
  }

  // Append user bubble
  function appendUserBubble(text) {
    var el = getMsgsEl();
    if (!el) return;
    var div = document.createElement('div');
    div.className = 'dai-user-bubble';
    div.textContent = text;
    el.appendChild(div);
    scrollDown();
  }

  // Typing indicator
  function showTyping() {
    var el = getMsgsEl();
    if (!el) return;
    var block = document.createElement('div');
    block.className = 'dai-msg-block';
    block.id = 'dai-typing';
    var row = document.createElement('div');
    row.className = 'dai-msg-row';
    var icon = document.createElement('div');
    icon.className = 'dai-sparkle-icon';
    icon.innerHTML = '<svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2l1.8 6.2L18 10l-6.2 1.8L10 18l-1.8-6.2L2 10l6.2-1.8L10 2Z" fill="currentColor"/></svg>';
    var dots = document.createElement('div');
    dots.className = 'dai-typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    row.appendChild(icon);
    row.appendChild(dots);
    block.appendChild(row);
    el.appendChild(block);
    scrollDown();
  }

  function removeTyping() {
    var t = document.getElementById('dai-typing');
    if (t) t.remove();
  }

  async function sendToAI(userText) {
    if (isAiTyping) return;
    isAiTyping = true;
    aiMessages.push({ role: 'user', content: userText });
    appendUserBubble(userText);
    showTyping();
    try {
      var response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: 'Ти — Дія.AI, розумний помічник у додатку Дія. Відповідай коротко, корисно та зрозуміло. Відповідай українською мовою.',
          messages: aiMessages
        })
      });
      var data = await response.json();
      var aiText = (data.content && data.content[0] && data.content[0].text)
        ? data.content[0].text
        : 'Вибачте, сталася помилка. Спробуйте ще.';
      aiMessages.push({ role: 'assistant', content: aiText });
      removeTyping();
      appendAiBlock(aiText);
    } catch(e) {
      removeTyping();
      appendAiBlock('Помилка з\'єднання. Перевірте інтернет.');
    }
    isAiTyping = false;
  }

  document.addEventListener('DOMContentLoaded', function() {
    initDateChip();

    var sendBtn = document.getElementById('diyaAiSend');
    var input = document.getElementById('diyaAiInput');

    if (sendBtn && input) {
      sendBtn.addEventListener('click', function() {
        var txt = input.value.trim();
        if (!txt || isAiTyping) return;
        input.value = '';
        sendToAI(txt);
      });
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          var txt = input.value.trim();
          if (!txt || isAiTyping) return;
          input.value = '';
          sendToAI(txt);
        }
      });
    }
  });
})();

/* ===== Settings Logic ===== */
(function() {
  var STORAGE_KEY = 'diya_settings';
  
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveSettings(s) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch(e) {}
  }

  function applySettings(s) {
    if (s.photo) {
      document.querySelectorAll('img[src="photo.jpg"], img[src*="photo.jpg"]').forEach(function(img) {
        if (img.id !== 'photoPreview') {
          img.src = s.photo;
          img.style.objectFit = 'cover';
        }
      });
    }
    var fullName = [s.last_name, s.first_name, s.middle_name].filter(Boolean).join(' ');
    if (fullName) document.querySelectorAll('#name').forEach(function(el){ el.textContent = fullName; });
    if (s.name_en) document.querySelectorAll('#nameEn').forEach(function(el){ el.textContent = s.name_en; });
    if (s.birthdate) document.querySelectorAll('#birthDate').forEach(function(el){ el.textContent = s.birthdate; });
    if (s.rnokpp) document.querySelectorAll('#rnokpp').forEach(function(el){ el.textContent = s.rnokpp; });
    if (s.passport_num) document.querySelectorAll('#nomerPasport').forEach(function(el){ el.textContent = s.passport_num; });
    if (s.zagran_num) {
      document.querySelectorAll('#zagran_number').forEach(function(el){ el.textContent = s.zagran_num; });
      document.querySelectorAll('#zagranNumber').forEach(function(el){ el.textContent = s.zagran_num; });
    }
    if (s.place_birth) document.querySelectorAll('#placeBirth').forEach(function(el){ el.textContent = s.place_birth; });
    if (fullName) document.querySelectorAll('#textName').forEach(function(el){ el.textContent = fullName.split(' ')[1] || ''; });
    if (s.signature) {
      document.querySelectorAll('img[src="sign.png"], img[src*="sign.png"]').forEach(function(img) {
        img.src = s.signature;
        img.style.maxHeight = '40px';
        img.style.maxWidth = '100px';
        img.style.objectFit = 'contain';
      });
    }
  }

  function fillForm(s) {
    var f = function(id, val) { var el = document.getElementById(id); if (el) el.value = val || ''; };
    f('set_last_name',    s.last_name);
    f('set_first_name',   s.first_name);
    f('set_middle_name',  s.middle_name);
    f('set_name_en',      s.name_en);
    f('set_birthdate',    s.birthdate);
    f('set_rnokpp',       s.rnokpp);
    f('set_passport_num', s.passport_num);
    f('set_zagran_num',   s.zagran_num);
    f('set_place_birth',  s.place_birth);
    var preview = document.getElementById('photoPreview');
    if (preview && s.photo) preview.src = s.photo;
    var canvas = document.getElementById('signatureCanvas');
    if (canvas) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (s.signature) {
        var img = new Image();
        img.onload = function(){ ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
        img.src = s.signature;
      }
    }
  }

  function isCanvasBlank(canvas) {
    var blank = document.createElement('canvas');
    blank.width = canvas.width; blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
  }

  function readForm() {
    var g = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
    var canvas = document.getElementById('signatureCanvas');
    var current = loadSettings();
    var sig = (canvas && !isCanvasBlank(canvas)) ? canvas.toDataURL() : (current.signature || '');
    return {
      photo:        current.photo || '',
      last_name:    g('set_last_name'),
      first_name:   g('set_first_name'),
      middle_name:  g('set_middle_name'),
      name_en:      g('set_name_en'),
      birthdate:    g('set_birthdate'),
      rnokpp:       g('set_rnokpp'),
      passport_num: g('set_passport_num'),
      zagran_num:   g('set_zagran_num'),
      place_birth:  g('set_place_birth'),
      signature:    sig,
    };
  }

  function initSignatureCanvas() {
    var canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;
    var newCanvas = canvas.cloneNode(true);
    canvas.parentNode.replaceChild(newCanvas, canvas);
    canvas = newCanvas;
    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    var s = loadSettings();
    if (s.signature) {
      var img = new Image();
      img.onload = function(){ ctx.drawImage(img, 0, 0, canvas.width, canvas.height); };
      img.src = s.signature;
    }
    var drawing = false;
    function getPos(e) {
      var r = canvas.getBoundingClientRect();
      var sx = canvas.width / r.width, sy = canvas.height / r.height;
      var src = e.touches ? e.touches[0] : e;
      return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
    }
    canvas.addEventListener('mousedown',  function(e){ drawing=true; var p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); });
    canvas.addEventListener('mousemove',  function(e){ if(!drawing) return; var p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); });
    canvas.addEventListener('mouseup',    function(){ drawing=false; });
    canvas.addEventListener('mouseleave', function(){ drawing=false; });
    canvas.addEventListener('touchstart', function(e){ e.preventDefault(); drawing=true; var p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); }, {passive:false});
    canvas.addEventListener('touchmove',  function(e){ e.preventDefault(); if(!drawing) return; var p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); }, {passive:false});
    canvas.addEventListener('touchend',   function(){ drawing=false; });
    var clearBtn = document.getElementById('clearSignBtn');
    if (clearBtn) {
      var nb = clearBtn.cloneNode(true);
      clearBtn.parentNode.replaceChild(nb, clearBtn);
      nb.addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var s = loadSettings(); s.signature = ''; saveSettings(s);
        document.querySelectorAll('img[src*="sign"]').forEach(function(img){ img.src = 'sign.png'; });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var modal        = document.getElementById('settingsModal');
    var openBtn      = document.getElementById('openSettingsBtn');
    var closeBtn     = document.getElementById('closeSettingsBtn');
    var saveBtn      = document.getElementById('saveSettingsBtn');
    var fileInput    = document.getElementById('photoFileInput');
    var clearPhotoBtn= document.getElementById('clearPhotoBtn');

    if (!modal) return;

    applySettings(loadSettings());

    openBtn && openBtn.addEventListener('click', function() {
      fillForm(loadSettings());
      modal.classList.remove('hidden');
      setTimeout(initSignatureCanvas, 50);
    });

    closeBtn && closeBtn.addEventListener('click', function() {
      modal.classList.add('hidden');
    });

    saveBtn && saveBtn.addEventListener('click', function() {
      var s = readForm();
      saveSettings(s);
      applySettings(s);
      modal.classList.add('hidden');
      var n = document.getElementById('notification');
      if (n) {
        var orig = n.textContent;
        n.textContent = '✓ Збережено';
        n.classList.add('show');
        setTimeout(function(){ n.classList.remove('show'); setTimeout(function(){ n.textContent = orig; }, 300); }, 2000);
      }
    });

    fileInput && fileInput.addEventListener('change', function() {
      var file = this.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function(e) {
        var dataUrl = e.target.result;
        var preview = document.getElementById('photoPreview');
        if (preview) preview.src = dataUrl;
        var s = loadSettings(); s.photo = dataUrl; saveSettings(s);
      };
      reader.readAsDataURL(file);
    });

    clearPhotoBtn && clearPhotoBtn.addEventListener('click', function() {
      var s = loadSettings(); s.photo = ''; saveSettings(s);
      var preview = document.getElementById('photoPreview');
      if (preview) preview.src = 'photo.jpg';
      document.querySelectorAll('img[src*="data:image"]').forEach(function(img){
        if (img.id !== 'photoPreview' && !img.src.includes('sign')) img.src = 'photo.jpg';
      });
    });
  });
})();
