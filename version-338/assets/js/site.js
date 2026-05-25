
(function () {
  const toggle = document.querySelector('.menu-toggle');
  const panel = document.querySelector('.mobile-panel');

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.carousel-dots button'));
  let current = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function startCarousel() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      if (timer) {
        window.clearInterval(timer);
      }
      showSlide(index);
      startCarousel();
    });
  });

  showSlide(0);
  startCarousel();

  const filterForms = Array.from(document.querySelectorAll('[data-filter-form]'));

  filterForms.forEach(function (form) {
    const scopeSelector = form.getAttribute('data-scope') || 'body';
    const scope = document.querySelector(scopeSelector) || document;
    const cards = Array.from(scope.querySelectorAll('[data-title]'));
    const empty = document.querySelector(form.getAttribute('data-empty') || '');
    const searchInput = form.querySelector('[name="keyword"]');
    const yearSelect = form.querySelector('[name="year"]');
    const regionSelect = form.querySelector('[name="region"]');

    function applyFilter() {
      const keyword = (searchInput && searchInput.value || '').trim().toLowerCase();
      const year = yearSelect && yearSelect.value || '';
      const region = regionSelect && regionSelect.value || '';
      let visible = 0;

      cards.forEach(function (card) {
        const text = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-region') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-year') || ''
        ].join(' ').toLowerCase();
        const matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
        const matchesYear = !year || (card.getAttribute('data-year') || '') === year;
        const matchesRegion = !region || (card.getAttribute('data-region') || '') === region;
        const isVisible = matchesKeyword && matchesYear && matchesRegion;

        card.style.display = isVisible ? '' : 'none';
        if (isVisible) {
          visible += 1;
        }
      });

      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applyFilter();
    });

    [searchInput, yearSelect, regionSelect].forEach(function (field) {
      if (field) {
        field.addEventListener('input', applyFilter);
        field.addEventListener('change', applyFilter);
      }
    });

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q && searchInput) {
      searchInput.value = q;
    }

    applyFilter();
  });
})();
