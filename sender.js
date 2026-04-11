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

function showToast(message, type = 'info') {
    let toast = document.querySelector('.toast-notification');

    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        document.body.appendChild(toast);
    }

    const icon = type === 'success'
        ? `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `
        : `
            <svg class="toast-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
        `;

    toast.innerHTML = `${icon}<span class="toast-message">${message}</span>`;
    toast.className = `toast-notification ${type} show`;

    clearTimeout(window.toastTimer);
    clearTimeout(window.toastHideTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove('show');

        window.toastHideTimer = setTimeout(() => {
            if (toast && !toast.classList.contains('show')) {
                toast.remove();
            }
        }, 350);
    }, 3000);
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();

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
            showToast('Сообщение отправлено! Я свяжусь с вами в ближайшее время.', 'success');
            form.reset();
        } else {
            showToast(data.message || 'Не удалось отправить сообщение.', 'error');
        }
    } catch (error) {
        showToast('Ошибка сети. Попробуйте позже.', 'error');
    }
});