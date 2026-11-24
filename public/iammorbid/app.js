(function () {
  'use strict';

  var MUX = 'https://stream.mux.com/';
  var IMG = 'https://image.mux.com/';
  var players = [];

  function src(id) { return MUX + id + '.m3u8'; }

  function attach(video, id) {
    if (video.dataset.ready) return;
    video.dataset.ready = '1';
    // hls.js first: some Chromium builds answer "maybe" to native HLS and then fail
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ startLevel: -1, capLevelToPlayerSize: true });
      hls.loadSource(src(id));
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = src(id);
    }
  }

  function pauseAll(except) {
    players.forEach(function (v) { if (v !== except && !v.paused) v.pause(); });
  }

  // video tiles
  document.querySelectorAll('.vid[data-mux]').forEach(function (fig) {
    var id = fig.dataset.mux;
    var t = fig.dataset.t || '1';
    var holder = fig;
    if (fig.classList.contains('hero-vid')) {
      holder = document.createElement('div');
      holder.className = 'frame';
      fig.insertBefore(holder, fig.firstChild);
    }
    var wide = fig.classList.contains('v169');
    var v = document.createElement('video');
    v.setAttribute('playsinline', '');
    v.preload = 'none';
    v.poster = IMG + id + '/thumbnail.jpg?time=' + t + '&width=' + (wide ? 1280 : 720);
    var play = document.createElement('button');
    play.className = 'play';
    play.setAttribute('aria-label', 'Play with sound');
    play.textContent = '▶';
    var exp = document.createElement('button');
    exp.className = 'expand';
    exp.setAttribute('aria-label', 'Full screen');
    exp.textContent = '⤢';
    holder.appendChild(v);
    holder.appendChild(play);
    holder.appendChild(exp);
    players.push(v);

    var started = false;
    function toggle() {
      attach(v, id);
      if (v.paused) {
        pauseAll(v);
        v.muted = false;
        if (!started && t) { started = true; }
        var p = v.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        v.pause();
      }
    }
    play.addEventListener('click', toggle);
    v.addEventListener('click', toggle);
    v.addEventListener('play', function () { fig.classList.add('playing'); });
    v.addEventListener('pause', function () { fig.classList.remove('playing'); });
    exp.addEventListener('click', function () {
      var at = v.currentTime || 0;
      v.pause();
      openVideo(id, at, v.poster);
    });
  });

  // clip carousel (several short mp4 clips in one 16:9 frame)
  document.querySelectorAll('.clips').forEach(function (fig) {
    var n = +fig.dataset.n, i = 0, playing = false;
    var v = fig.querySelector('video');
    var count = fig.querySelector('.c-count');
    var dots = fig.querySelector('.c-dots');
    players.push(v);
    for (var k = 0; k < n; k++) {
      var d = document.createElement('button');
      d.setAttribute('aria-label', 'Clip ' + (k + 1));
      (function (k) { d.addEventListener('click', function () { go(k, playing); }); })(k);
      dots.appendChild(d);
    }
    function mark() {
      count.textContent = (i + 1) + ' / ' + n;
      Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === i); });
    }
    function go(k, autoplay) {
      i = (k + n) % n;
      v.poster = 'media/set/set-' + (i + 1) + '.jpg';
      v.src = 'media/set/set-' + (i + 1) + '.mp4';
      mark();
      if (autoplay) start(); else { fig.classList.remove('playing'); }
    }
    function start() {
      if (!v.getAttribute('src')) v.src = 'media/set/set-' + (i + 1) + '.mp4';
      pauseAll(v);
      v.muted = false;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    }
    fig.querySelector('.play').addEventListener('click', start);
    v.addEventListener('click', function () { if (v.paused) start(); else v.pause(); });
    fig.querySelector('.c-prev').addEventListener('click', function () { go(i - 1, playing); });
    fig.querySelector('.c-next').addEventListener('click', function () { go(i + 1, playing); });
    v.addEventListener('play', function () { playing = true; fig.classList.add('playing'); });
    v.addEventListener('pause', function () { if (!v.ended) { playing = false; fig.classList.remove('playing'); } });
    v.addEventListener('ended', function () { if (i < n - 1) go(i + 1, true); else { playing = false; go(0, false); } });
    var x0 = null;
    fig.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    fig.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(dx < 0 ? i + 1 : i - 1, playing);
    });
    mark();
  });

  // tabs
  document.querySelectorAll('.tabs').forEach(function (bar) {
    var group = bar.dataset.group;
    var panels = document.querySelector('.panels[data-group="' + group + '"]');
    bar.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        bar.querySelectorAll('button').forEach(function (x) {
          x.classList.toggle('on', x === b);
          x.setAttribute('aria-selected', x === b ? 'true' : 'false');
        });
        panels.querySelectorAll('.panel').forEach(function (p) {
          var on = p.dataset.panel === b.dataset.tab;
          p.classList.toggle('on', on);
          if (!on) p.querySelectorAll('video').forEach(function (v) { v.pause(); });
        });
      });
    });
  });

  // lightbox
  var lb = document.getElementById('lb');
  var stage = lb.querySelector('.lb-stage');
  var count = lb.querySelector('.lb-count');
  var imgs = Array.prototype.slice.call(document.querySelectorAll('img[data-lb]'));
  var idx = 0;
  var lbVideo = null;

  function open() {
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeLB() {
    document.body.style.overflow = '';
    if (lbVideo) {
      lbVideo.pause();
      if (lbVideo._hls) lbVideo._hls.destroy();
      lbVideo = null;
    }
    stage.innerHTML = '';
    lb.hidden = true;
    lb.classList.remove('video');
  }

  function showImg(i) {
    idx = (i + imgs.length) % imgs.length;
    stage.innerHTML = '';
    var im = document.createElement('img');
    im.src = imgs[idx].src;
    im.alt = imgs[idx].alt;
    im.addEventListener('click', function (e) {
      e.stopPropagation();
      if (im.classList.contains('zoom')) {
        im.classList.remove('zoom');
      } else {
        var r = im.getBoundingClientRect();
        im.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + '% ' + ((e.clientY - r.top) / r.height * 100) + '%';
        im.classList.add('zoom');
      }
    });
    stage.appendChild(im);
    count.textContent = (idx + 1) + ' / ' + imgs.length;
  }

  function openVideo(id, at, poster) {
    pauseAll(null);
    lb.classList.add('video');
    stage.innerHTML = '';
    var v = document.createElement('video');
    v.setAttribute('playsinline', '');
    v.controls = true;
    v.poster = poster;
    stage.appendChild(v);
    lbVideo = v;
    attach(v, id);
    v.addEventListener('loadedmetadata', function () { if (at) v.currentTime = at; }, { once: true });
    v.muted = false;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
    open();
  }

  imgs.forEach(function (im, i) {
    im.addEventListener('click', function () {
      pauseAll(null);
      lb.classList.remove('video');
      showImg(i);
      open();
    });
  });

  lb.querySelector('.lb-x').addEventListener('click', closeLB);
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); showImg(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); showImg(idx + 1); });
  stage.addEventListener('click', function (e) { if (e.target === stage) closeLB(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLB();
    if (lb.classList.contains('video')) return;
    if (e.key === 'ArrowLeft') showImg(idx - 1);
    if (e.key === 'ArrowRight') showImg(idx + 1);
  });

  var sx = null;
  stage.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (sx === null || lb.classList.contains('video')) return;
    var dx = e.changedTouches[0].clientX - sx;
    var zoomed = stage.querySelector('img.zoom');
    if (!zoomed && Math.abs(dx) > 50) showImg(idx + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();

// entrances: each section's parts rise in once, one after another
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var sets = ['.hero-text > *', '.hero-vid', '.sec .wrap > h2', '.sec .wrap > .sub', '.sec .wrap > .tabs', '.why li', '.acc', '.photos img', '.cta-row'];
  var els = [];
  sets.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) {
      var i = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.classList.add('rv'); el.style.setProperty('--d', Math.min(i, 6) * 70 + 'ms'); els.push(el);
    });
  });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
