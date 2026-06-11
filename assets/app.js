const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll('img[src*="photo.jpg"], img[src*="sign.png"]');
  imgs.forEach((img) => {
    if (!img.src.includes("nocache=")) {
      img.src = img.getAttribute("src").split("?")[0] + "?nocache=" + nocache;
    }
  });
});

// ====================== ФІКС ПЕРЕХОДУ ======================
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

        // ВИПРАВЛЕНО: показуємо головний екран
        $(".main").addClass("active");
        $(".block1").addClass("active");
        $(".blockStart").addClass("active");

        // Додатковий фікс
        document.querySelectorAll(".block")[0].classList.add("active");
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

// ====================== РЕШТА КОДУ ======================
document.querySelectorAll(".start-block > button").forEach(function (el) {
  el.addEventListener("click", function () {
    if ($(this).attr("data-type") == "delete") {
      vhod("minus");
    } else {
      vhod("plus");
    }
  });
});

document.querySelector(".biometry-btn").addEventListener("click", () => {
  const startDiv = $(".start-div");
  startDiv.removeClass("active").addClass("hiding");

  setTimeout(() => {
    startDiv.remove();
  }, 400);

  $(".main").addClass("active");
  $(".block1").addClass("active");
  $(".blockStart").addClass("active");
});

// ====================== ВСІ ІНШІ ЧАСТИНИ (без змін) ======================
var isWorking = true;
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
  isInWebAppiOS = window.navigator.standalone === true;
  isInWebAppChrome = window.matchMedia("(display-mode: standalone)").matches;
  if (isInWebAppiOS == false && isInWebAppChrome == false) {
    isWorking = false;
    $("body").html('<div class="nonono"><br><b>@frfakd_bot</b><br>Натисніть три точки в браузері і додайте цю сторінку на головний екран</div>');
    $("body").addClass("nononopage");
  }
} else {
  isWorking = false;
  $("body").html('<div class="nonono">Тільки з мобільних пристроїв</div>');
  $("body").addClass("nononopage");
}

// ... (весь інший код з marquee, data loading, sliders, modals тощо — залишається без змін) ...

// (Повний оригінальний код з attachments/app.js + фікс вище)
