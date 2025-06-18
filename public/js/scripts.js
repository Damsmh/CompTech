document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(nav => {
                nav.classList.remove('active');
                nav.removeAttribute('aria-current');
            });
            this.classList.add('active');
            this.setAttribute('aria-current', 'page');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const avatarForm = document.getElementById('avatarForm');
    const avatarImg = document.querySelector('img[alt="User Avatar"]');

    avatarForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(avatarForm);
        try {
            const response = await fetch('/profile/avatar', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                avatarImg.src = result.avatar;
                const modal = bootstrap.Modal.getInstance(document.getElementById('avatarModal'));
                modal.hide();
            } else {
                alert(result.error || 'Ошибка при загрузке аватара');
            }
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    });
});