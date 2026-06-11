const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ app.js завантажено");

    function goToMainScreen() {
        console.log("🚀 Запуск головного екрану...");

        // Прибираємо стартовий екран
        $(".start-div").fadeOut(300, function() {
            $(this).remove();
        });

        // Показуємо головний контент
        $(".main").addClass("active").css("display", "block");
        $(".block1").addClass("active").css("display", "block");
        $(".blockStart").addClass("active");

        // Примусово показуємо перший блок
        document.querySelectorAll(".block").forEach(b => {
            b.style.display = "none";
        });
        
        const mainBlock = document.querySelector(".block1");
        if (mainBlock) {
            mainBlock.style.display = "block";
            mainBlock.classList.add("active");
        }

        console.log("✅ Головний екран примусово показаний");
    }

    // Вхід кодом
    function vhod(type) {
        if (type === "plus") {
            const count = document.querySelectorAll(".start-vhod > div.active").length;
            if (count < 4) {
                $(".start-vhod > div").eq(count).addClass("active");
            }
            if (count + 1 === 4) {
                goToMainScreen();
            }
        } else {
            $(".start-vhod > div.active").last().removeClass("active");
        }
    }

    // Кнопки коду
    document.querySelectorAll(".start-block button").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.dataset.type === "delete") {
                vhod("minus");
            } else {
                vhod("plus");
            }
        });
    });

    // Біометрія
    document.querySelector(".biometry-btn").addEventListener("click", goToMainScreen);

    // Якщо через 2 секунди все ще на старті — примусово перейти
    setTimeout(() => {
        if ($(".start-div").length > 0) {
            console.log("⚠️ Автоматичний перехід через таймер");
            goToMainScreen();
        }
    }, 2500);

    console.log("✅ Скрипт готовий");
});
