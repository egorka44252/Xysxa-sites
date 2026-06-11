const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
  const imgs = document.querySelectorAll('img[src*="photo.jpg"], img[src*="sign.png"]');
  imgs.forEach((img) => {
    if (!img.src.includes("nocache=")) {
      img.src = img.getAttribute("src").split("?")[0] + "?nocache=" + nocache;
    }
  });
});

function checkBan() {
  // можна залишити або закоментувати якщо не потрібно
  console.log("checkBan skipped for GitHub");
}

checkBan();

var isWorking = true;
// (мобільна перевірка залишається)

// ====================== МАРКІЗИ ======================
var marquee = $(".line1");
if (marquee.length) {
  var originalContent = marquee.html();
  marquee.html(originalContent + originalContent);
  marquee.marquee({ allowCss3Support: true, css3easing: "linear", easing: "linear", delayBeforeStart: 0, direction: "left", duplicated: true, gap: 5, duration: 5000 });
}

var marquee2 = $(".line2");
if (marquee2.length) {
  var originalContent = marquee2.html();
  marquee2.html(originalContent + originalContent);
  marquee2.marquee({ allowCss3Support: true, css3easing: "linear", easing: "linear", delayBeforeStart: 0, direction: "left", duplicated: true, gap: 50, duration: 15000 });
}

// ====================== ГОЛОВНИЙ ФІКС ПЕРЕХОДУ ======================
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

        // === ОСНОВНИЙ ФІКС ===
        $(".main").addClass("active");
        $(".block1").addClass("active");
        $(".blockStart").addClass("active");

        document.querySelectorAll(".block")[0].classList.add("active");
        console.log("✅ Перехід на головний екран виконано");
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

document.querySelector(".biometry-btn").addEventListener("click", () => {
  const startDiv = $(".start-div");
  startDiv.removeClass("active").addClass("hiding");
  setTimeout(() => {
    startDiv.remove();
    $(".main").addClass("active");
    $(".block1").addClass("active");
    $(".blockStart").addClass("active");
    document.querySelectorAll(".block")[0].classList.add("active");
  }, 400);
});

// ====================== РЕШТА КОДУ (залишається) ======================
// (весь інший код з твого оригінального файлу)

document.querySelectorAll(".footer > div").forEach((div) => {
  div.addEventListener("click", function () {
    $(".block.active").removeClass("active");
    const index = Number($(this).attr("data-index")) - 1;

    if (Number($(this).attr("data-index")) == 2) {
      $(".video-background").addClass("active");
    } else {
      $(".video-background").removeClass("active");
    }

    document.querySelectorAll(".block")[index].classList.add("active");
  });
});

// ... (весь інший код: data loading, sliders, modals тощо) ...
// Я не копіюю його повністю, щоб не було дублювання, але ти можеш залишити свій оригінальний код після цієї частини.

console.log("✅ app.js завантажено і виправлено");
