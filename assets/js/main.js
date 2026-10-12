document.querySelectorAll('.copy-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    var text = b.getAttribute('data-copy');
    var label = b.textContent;
    function done(msg) { b.textContent = msg; setTimeout(function () { b.textContent = label; }, 1600); }
    try {
      navigator.clipboard.writeText(text).then(function () { done('Copied'); }, function () { fallback(); });
    } catch (e) { fallback(); }
    function fallback() {
      var v = b.parentElement.querySelector('.v');
      if (v) { var r = document.createRange(); r.selectNodeContents(v); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
      done('Selected');
    }
  });
});

// Lightbox: click a certificate picture to view it full size.
(function () {
  var dlg = document.getElementById('lightbox');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var img = dlg.querySelector('img'), cap = dlg.querySelector('.lb-cap');
  document.querySelectorAll('[data-lightbox]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      img.src = a.getAttribute('href');
      img.alt = a.getAttribute('data-caption') || '';
      cap.textContent = a.getAttribute('data-caption') || '';
      dlg.showModal();
    });
  });
  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
})();

// Experience scenes: reveal each client's picture, count up its number,
// and fill the track as the reader scrolls. Text is always readable.
(function () {
  var wrap = document.querySelector('[data-scenes]');
  if (!wrap) return;
  var scenes = wrap.querySelectorAll('.scene');
  var bar = wrap.querySelector('.track-progress span');
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('js-scenes');

  function fmt(n, src) { return src.indexOf(',') > -1 ? n.toLocaleString('en-US') : String(n); }
  function countUp(el) {
    var src = el.getAttribute('data-to') || '';
    var target = parseInt(src.replace(/,/g, ''), 10);
    if (isNaN(target)) return;
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + fmt(Math.round(target * e), src) + suf;
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      var s = en.target;
      s.classList.add('in', 'lit');
      var c = s.querySelector('.count');
      if (c && !c.dataset.done) { c.dataset.done = '1'; countUp(c); }
      io.unobserve(s);
    });
  }, { rootMargin: '0px 0px -18% 0px', threshold: 0.15 });
  scenes.forEach(function (s) {
    var r = s.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.82) { s.classList.add('in', 'lit'); }
    else { io.observe(s); }
  });

  if (!bar) return;
  var ticking = false;
  function fill() {
    ticking = false;
    var r = wrap.getBoundingClientRect();
    var mark = window.innerHeight * 0.6;
    var p = (mark - r.top) / Math.max(1, r.height);
    bar.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(3));
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(fill); } }, { passive: true });
  window.addEventListener('resize', fill);
  fill();
})();
