// Проста темна тема (можна розширити)
function toggleTheme() {
    document.body.classList.toggle('dark');
}

// Показати модальне вікно
function showModal() {
    document.getElementById('modal').style.display = 'flex';
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

// Закриття модалки при кліку поза нею
document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) hideModal();
});

// Додати активний клас для навігації (симуляція)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Повідомлення при завантаженні
window.onload = () => {
    console.log('%cСайт для телефону готовий! ✅', 'color: #0052cc; font-size: 16px;');
};
