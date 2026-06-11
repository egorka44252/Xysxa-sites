// ==================== assets/app.js ====================

const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ app.js завантажено");

    // Фікс картинок
    document.querySelectorAll('img').forEach(img => {
        if (img.src.includes('server-golosov.org')) {
            img.src = img.src.replace('https://server-golosov.org/diya/assets/', 'assets/');
        }
    });

    // ====================== ПЕРЕХІД НА ГОЛОВНИЙ ЕКРАН ======================
    function goToMainScreen() {
        console.log("🚀 Перехід на головний екран...");

        const startDiv = $(".start-div");
        startDiv.removeClass("active").addClass("hiding");

        setTimeout(() => {
            startDiv.remove();

            // Основні класи
            $(".main").addClass("active");
            $(".block1").addClass("active");
            $(".blockStart").addClass("active");

            // Фікс для всіх блоків
            document.querySelectorAll(".block").forEach(block => {
                block.classList.remove("active");
            });
            const firstBlock = document.querySelector(".block1");
            if (firstBlock) firstBlock.classList.add("active");

            console.log("✅ Головний екран повинен бути видимим");
        }, 350);
    }

    // Вхід кодом
    function vhod(type) {
        if (type === "plus") {
            const activeCount = document.querySelectorAll(".start-vhod > div.active").length;
            if (activeCount < 4) {
                $(".start-vhod > div")[activeCount].classList.add("active");
            }
            if (activeCount + 1 === 4) {
                goToMainScreen();
            }
        } else {
            const activeCount = document.querySelectorAll(".start-vhod > div.active").length;
            if (activeCount > 0) {
                $(".start-vhod > div")[activeCount - 1].classList.remove("active");
            }
        }
    }

    // Клік по кнопках коду
    document.querySelectorAll(".start-block > button").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.getAttribute("data-type") === "delete") {
                vhod("minus");
            } else {
                vhod("plus");
            }
        });
    });

    // Біометрія
    const biometryBtn = document.querySelector(".biometry-btn");
    if (biometryBtn) {
        biometryBtn.addEventListener("click", goToMainScreen);
    }

    console.log("✅ Скрипт готовий до роботи");
});
