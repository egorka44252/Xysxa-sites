const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ app.js завантажено");

    // Фікс переходу після стартового екрану
    function goToMain() {
        const startDiv = $(".start-div");
        startDiv.removeClass("active").addClass("hiding");
        setTimeout(() => {
            startDiv.remove();
            $(".main").addClass("active");
            $(".block1").addClass("active");
            $(".blockStart").addClass("active");
            document.querySelectorAll(".block")[0].classList.add("active");
            console.log("✅ Перехід на головний екран виконано");
        }, 300);
    }

    // Вхід через кнопки
    function vhod(type) {
        if (type === "plus") {
            if (document.querySelectorAll(".start-vhod > div.active").length < 4) {
                $(".start-vhod > div")[
                    document.querySelectorAll(".start-vhod > div.active").length
                ].classList.add("active");
            }
            if (document.querySelectorAll(".start-vhod > div.active").length == 4) {
                goToMain();
            }
        } else {
            $(".start-vhod > div")[
                document.querySelectorAll(".start-vhod > div.active").length - 1
            ].classList.remove("active");
        }
    }

    document.querySelectorAll(".start-block > button").forEach(el => {
        el.addEventListener("click", () => {
            if (el.getAttribute("data-type") == "delete") {
                vhod("minus");
            } else {
                vhod("plus");
            }
        });
    });

    document.querySelector(".biometry-btn").addEventListener("click", goToMain);

    // Кнопка "Приложение" → Telegram бот
    // Додай це в block1 (стрічка) або в меню
});

// Інший код (marquee, data loading тощо) можна залишити з твого старого файлу
