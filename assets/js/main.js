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

// Slide-in transitions: each section and job card enters like a new slide.
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal, .deck .job');
  if (reduce || document.body.classList.contains('no-motion') || !('IntersectionObserver' in window) || !items.length) return;
  document.documentElement.classList.add('js');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach(function (el) {
    // anything already on screen shows immediately, without a flash
    var r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92) el.classList.add('in');
    io.observe(el);
  });
})();

// Experience deck: on desktop every job card gets the same height so each one fully covers the last as it stacks.
(function () {
  var deck = document.querySelector('.deck');
  if (!deck) return;
  var mq = window.matchMedia('(min-width: 1000px) and (min-height: 720px)');
  function size() {
    deck.style.removeProperty('--job-h');
    if (!mq.matches) return;
    var max = 0;
    deck.querySelectorAll('.job').forEach(function (j) { max = Math.max(max, j.offsetHeight); });
    deck.style.setProperty('--job-h', max + 'px');
  }
  size();
  window.addEventListener('resize', size);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(size);
})();

// Home page: hide the header name while the large hero name is on screen, so it never appears twice.
(function () {
  var nav = document.querySelector('nav'), big = document.querySelector('.hero-copy h1');
  if (!nav || !big || !('IntersectionObserver' in window)) return;
  nav.classList.add('name-hidden');
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { nav.classList.toggle('name-hidden', e.isIntersecting); });
  }, { rootMargin: '-64px 0px 0px 0px' }).observe(big);
})();
