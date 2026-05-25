(function() {
  const slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots = Array.from(slider.querySelectorAll('.hero-dot'));
    let index = 0;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() {
        show(i);
      });
    });

    setInterval(function() {
      show(index + 1);
    }, 5200);
  }

  document.querySelectorAll('[data-filter-panel]').forEach(function(panel) {
    const input = panel.querySelector('input');
    const buttons = Array.from(panel.querySelectorAll('[data-filter]'));
    const listing = panel.nextElementSibling;
    const cards = listing ? Array.from(listing.children) : [];
    let activeFilter = 'all';

    function matchCard(card) {
      const query = input ? input.value.trim().toLowerCase() : '';
      const text = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-tags') || '',
        card.getAttribute('data-genre') || '',
        card.textContent || ''
      ].join(' ').toLowerCase();
      const filterOk = activeFilter === 'all' || text.includes(activeFilter.toLowerCase());
      const queryOk = !query || text.includes(query);
      return filterOk && queryOk;
    }

    function applyFilter() {
      cards.forEach(function(card) {
        card.classList.toggle('hidden-by-filter', !matchCard(card));
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        activeFilter = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function(btn) {
          btn.classList.toggle('active', btn === button);
        });
        applyFilter();
      });
    });
  });
})();
