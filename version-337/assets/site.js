(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
      return;
    }
    document.addEventListener('DOMContentLoaded', fn);
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }

    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(parseInt(dot.getAttribute('data-hero-dot'), 10));
        start();
      });
    });

    show(0);
    start();
  }

  function setupFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('.filter-panel'));
    panels.forEach(function (panel) {
      var scope = panel.parentElement.querySelector('.js-filter-scope') || document;
      var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
      var search = panel.querySelector('.js-search');
      var category = panel.querySelector('.js-category-filter');
      var year = panel.querySelector('.js-year-filter');
      var result = panel.querySelector('.js-filter-result');

      if (year) {
        var years = cards.map(function (card) {
          return card.getAttribute('data-year') || '';
        }).filter(Boolean).sort().reverse();
        Array.from(new Set(years)).forEach(function (item) {
          var option = document.createElement('option');
          option.value = item;
          option.textContent = item;
          year.appendChild(option);
        });
      }

      function filter() {
        var keyword = search ? search.value.trim().toLowerCase() : '';
        var selectedCategory = category ? category.value : '';
        var selectedYear = year ? year.value : '';
        var visible = 0;

        cards.forEach(function (card) {
          var text = [
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-category')
          ].join(' ').toLowerCase();
          var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchedCategory = !selectedCategory || card.getAttribute('data-category') === selectedCategory;
          var matchedYear = !selectedYear || card.getAttribute('data-year') === selectedYear;
          var shown = matchedKeyword && matchedCategory && matchedYear;
          card.classList.toggle('is-hidden-by-filter', !shown);
          if (shown) {
            visible += 1;
          }
        });

        if (result) {
          result.textContent = '当前显示 ' + visible + ' / ' + cards.length + ' 个影片入口';
        }
      }

      [search, category, year].forEach(function (el) {
        if (el) {
          el.addEventListener('input', filter);
          el.addEventListener('change', filter);
        }
      });

      filter();
    });
  }

  function setupPlayer() {
    var video = document.querySelector('.js-hls-player');
    if (!video) {
      return;
    }

    var source = video.getAttribute('data-src');
    var playButton = document.querySelector('.js-video-play');

    function loadSource() {
      if (!source) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    loadSource();

    if (playButton) {
      playButton.addEventListener('click', function () {
        loadSource();
        var promise = video.play();
        playButton.classList.add('is-hidden');
        if (promise && promise.catch) {
          promise.catch(function () {
            playButton.classList.remove('is-hidden');
          });
        }
      });
      video.addEventListener('play', function () {
        playButton.classList.add('is-hidden');
      });
      video.addEventListener('pause', function () {
        if (!video.ended) {
          playButton.classList.remove('is-hidden');
        }
      });
    }
  }

  ready(function () {
    setupHero();
    setupFilters();
    setupPlayer();
  });
})();
