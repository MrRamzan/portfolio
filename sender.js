window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

function toggleMenu() {
    const menuToggle = document.querySelector('.toggle');
    const menu = document.querySelector('.menu');
    menuToggle.classList.toggle('active');
    menu.classList.toggle('active');
}

const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('.form-status');

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    formStatus.style.display = 'none';
    formStatus.textContent = '';

    const payload = {
        name: document.querySelector('#name').value.trim(),
        email: document.querySelector('#email').value.trim(),
        subject: document.querySelector('#subject').value.trim(),
        message: document.querySelector('#message').value.trim()
    };

    try {
        const response = await fetch('http://localhost:8080/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            formStatus.textContent = 'Сообщение отправлено! Я свяжусь с вами в ближайшее время.';
            formStatus.style.display = 'block';
            form.reset();
        } else {
            formStatus.textContent = data.message || 'Не удалось отправить сообщение.';
            formStatus.style.display = 'block';
        }
    } catch (error) {
        formStatus.textContent = 'Ошибка сети. Попробуйте позже.';
        formStatus.style.display = 'block';
    }
});