(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var video = document.querySelector(".movie-video");
        var button = document.querySelector(".play-overlay");
        var wrap = document.querySelector(".video-wrap");
        if (!video || !button || !wrap) {
            return;
        }

        var stream = video.getAttribute("data-stream");
        var prepared = false;

        var prepare = function () {
            if (prepared || !stream) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        };

        var play = function () {
            prepare();
            var result = video.play();
            if (result && typeof result.catch === "function") {
                result.catch(function () {});
            }
        };

        button.addEventListener("click", play);
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        video.addEventListener("play", function () {
            wrap.classList.add("is-playing");
        });
        video.addEventListener("pause", function () {
            wrap.classList.remove("is-playing");
        });
    });
})();
