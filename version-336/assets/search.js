(function() {
  const input = document.getElementById('globalSearchInput');
  const results = document.getElementById('searchResults');
  const buttons = Array.from(document.querySelectorAll('[data-search-filter]'));
  let filter = 'all';

  function paramsQuery() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  function createCard(movie) {
    const tags = movie.tags.slice(0, 4).map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '  <a class="poster" href="' + movie.url + '">',
      '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="poster-mask"></span>',
      '    <span class="play-dot">▶</span>',
      '  </a>',
      '  <div class="movie-info">',
      '    <div class="meta-row"><span>' + movie.year + '</span><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.oneLine) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join('\n');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function textOf(movie) {
    return [
      movie.title,
      movie.year,
      movie.region,
      movie.type,
      movie.genre,
      movie.tags.join(' '),
      movie.oneLine
    ].join(' ').toLowerCase();
  }

  function render() {
    const query = input.value.trim().toLowerCase();
    const matched = MOVIE_SEARCH_DATA.filter(function(movie) {
      const text = textOf(movie);
      const filterOk = filter === 'all' || text.includes(filter.toLowerCase());
      const queryOk = !query || text.includes(query);
      return filterOk && queryOk;
    }).slice(0, 120);
    results.innerHTML = matched.map(createCard).join('\n');
  }

  if (input) {
    input.value = paramsQuery();
    input.addEventListener('input', render);
  }

  buttons.forEach(function(button) {
    button.addEventListener('click', function() {
      filter = button.getAttribute('data-search-filter') || 'all';
      buttons.forEach(function(item) {
        item.classList.toggle('active', item === button);
      });
      render();
    });
  });

  render();
})();
