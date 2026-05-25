
(function () {
  const video = document.querySelector('[data-player-video]');
  const button = document.querySelector('[data-player-button]');
  const overlay = document.querySelector('[data-player-overlay]');

  if (!video || !button) {
    return;
  }

  let attached = false;

  function attach() {
    if (attached) {
      return;
    }

    attached = true;
    const mediaUrl = button.getAttribute('data-url');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = mediaUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(mediaUrl);
      hls.attachMedia(video);
    } else {
      video.src = mediaUrl;
    }
  }

  function play() {
    attach();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    const result = video.play();

    if (result && typeof result.catch === 'function') {
      result.catch(function () {});
    }
  }

  button.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
})();
