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


document.querySelectorAll('.update-form input[name="quantity"]').forEach(input => {
  input.addEventListener('change', function() {
    this.form.submit();
  });
});

document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll(".navbar .nav-link");
    const currentPath = window.location.pathname;

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;

      if (currentPath === linkPath || currentPath.startsWith(linkPath + '/')) {
        link.classList.add("active");
      }
    });
  });
