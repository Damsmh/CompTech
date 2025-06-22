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

    


    const sortAscBtn = document.getElementById('sortAsc');
    const sortDescBtn = document.getElementById('sortDesc');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const minPriceLabel = document.getElementById('minPriceLabel');
    const maxPriceLabel = document.getElementById('maxPriceLabel');
    const productList = document.getElementById('productList');

    async function initializePriceRange() {
        try {
            const response = await fetch('/products/price-range');
            const { minPrice, maxPrice } = await response.json();
            minPriceInput.min = minPrice;
            minPriceInput.max = maxPrice;
            maxPriceInput.min = minPrice;
            maxPriceInput.max = maxPrice;
            minPriceInput.value = minPrice;
            maxPriceInput.value = maxPrice;
            minPriceLabel.textContent = `${minPrice}₽`;
            maxPriceLabel.textContent = `${maxPrice}₽`;
        } catch (err) {
            console.error('Ошибка загрузки диапазона цен:', err);
        }
    }

    async function fetchProducts(sort = null, minPrice = null, maxPrice = null) {
        try {
            const params = new URLSearchParams();
            if (sort) params.append('sort', sort);
            if (minPrice !== null) params.append('minPrice', minPrice);
            if (maxPrice !== null) params.append('maxPrice', maxPrice);
            const response = await fetch(`/products/list?${params.toString()}`);
            if (!response.ok) throw new Error('Network error');
            const html = await response.text();
            productList.innerHTML = html;
        } catch (err) {
            console.error('Ошибка загрузки товаров:', err);
        }
    }

    sortAscBtn.addEventListener('click', () => {
        console.log('Sort Ascending');
        fetchProducts('asc');
    });
    sortDescBtn.addEventListener('click', () => {
        console.log('Sort Descending');
        fetchProducts('desc');
    });

    minPriceInput.addEventListener('input', () => {
        minPriceLabel.textContent = `${minPriceInput.value}₽`;
        if (parseInt(minPriceInput.value) > parseInt(maxPriceInput.value)) {
            maxPriceInput.value = minPriceInput.value;
            maxPriceLabel.textContent = `${minPriceInput.value}₽`;
        }
        fetchProducts(null, minPriceInput.value, maxPriceInput.value);
    });

    maxPriceInput.addEventListener('input', () => {
        console.log(maxPriceInput.value);
        console.log(minPriceInput.value);
        maxPriceLabel.textContent = `${maxPriceInput.value}₽`;
        if (parseInt(maxPriceInput.value) < parseInt(minPriceInput.value)) {
            minPriceInput.value = maxPriceInput.value;
            minPriceLabel.textContent = `${maxPriceInput.value}₽`;
        }
        fetchProducts(null, minPriceInput.value, maxPriceInput.value);
    });

    initializePriceRange();


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

