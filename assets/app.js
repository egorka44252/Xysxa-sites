const nocache = Date.now();

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ app.js завантажено");

    function goToMain() {
        console.log("🚀 Перехід на головний екран");

        $(".start-div").fadeOut(300, function() {
            $(this).remove();
        });

        $(".main").addClass("active").css({"display":"block", "opacity":"1"});
        $(".block1").addClass("active").css("display", "block");
        $(".blockStart").addClass("active");

        document.querySelectorAll(".block").forEach(b => b.style.display = "none");
        const mainBlock = document.querySelector(".block1");
        if (mainBlock) mainBlock.style.display = "block";

        console.log("✅ Головний екран показаний");
    }

    // Вхід кодом
    function vhod(type) {
        if (type === "plus") {
            const count = document.querySelectorAll(".start-vhod > div.active").length;
            if (count < 4) {
                $(".start-vhod > div").eq(count).addClass("active");
            }
            if (count + 1 === 4) {
                setTimeout(goToMain, 200);
            }
        } else {
            $(".start-vhod > div.active").last().removeClass("active");
        }
    }

    document.querySelectorAll(".start-block button").forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.getAttribute("data-type") === "delete") {
                vhod("minus");
            } else {
                vhod("plus");
            }
        });
    });

    document.querySelector(".biometry-btn").addEventListener("click", goToMain);

    // Автоматичний перехід, якщо застряг
    setTimeout(() => {
        if ($(".start-div").is(":visible")) {
            goToMain();
        }
    }, 3000);
});
