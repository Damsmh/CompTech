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

    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      if (currentPath === linkPath || currentPath.startsWith(linkPath + '/')) {
        link.classList.add("active");
      }
    });

    const avatarForm = document.getElementById('avatarForm');
    const avatarImg = document.querySelector('img[alt="User Avatar"]');

    avatarForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(avatarForm);
        try {
            const response = await fetch('/profile/avatar', {
                method: 'POST',
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

    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');

    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = emailForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;

        const email = emailInput.value;
        try {
            const response = await fetch('/profile/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (result.success) {
                emailInput.value = result.email;
            } else {
                alert(result.error || 'Ошибка при обновлении email');
            }
        } catch (err) {
            alert('Ошибка: ' + err.message);
        } finally {
            submitButton.disabled = false;
        }
    });

    document.querySelectorAll('.update-form input[name="quantity"]').forEach(input => {
        input.addEventListener('change', function() {
            this.form.submit();
        });
    });
});

