(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var hero = document.querySelector("[data-hero]");
        if (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
            var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
            var index = 0;
            var activate = function (next) {
                if (!slides.length) {
                    return;
                }
                index = (next + slides.length) % slides.length;
                slides.forEach(function (slide, i) {
                    slide.classList.toggle("active", i === index);
                });
                dots.forEach(function (dot, i) {
                    dot.classList.toggle("active", i === index);
                });
            };
            dots.forEach(function (dot, i) {
                dot.addEventListener("click", function () {
                    activate(i);
                });
            });
            window.setInterval(function () {
                activate(index + 1);
            }, 5200);
        }

        var searchInput = document.querySelector("[data-search-input]");
        if (searchInput) {
            var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
            searchInput.addEventListener("input", function () {
                var keyword = searchInput.value.trim().toLowerCase();
                cards.forEach(function (card) {
                    var text = [
                        card.getAttribute("data-title"),
                        card.getAttribute("data-year"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-region")
                    ].join(" ").toLowerCase();
                    card.classList.toggle("is-hidden", keyword && text.indexOf(keyword) === -1);
                });
            });
        }
    });
})();
