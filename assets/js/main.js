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

// Mobile menu.
(function () {
  var nav = document.querySelector('nav'), btn = nav && nav.querySelector('.menu-btn');
  if (!btn) return;
  function set(open) { nav.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
  btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
  nav.querySelectorAll('#site-menu a').forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('open')) { set(false); btn.focus(); } });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) set(false); });
})();

// Scroll progress bar (on blog posts it tracks the article).
(function () {
  var bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  var art = document.querySelector('.post .prose'), raf = 0;
  function update() {
    raf = 0;
    var p;
    if (art) { var r = art.getBoundingClientRect(); p = (120 - r.top) / Math.max(1, r.height - window.innerHeight + 200); }
    else { p = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
    bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)).toFixed(4) + ')';
  }
  function req() { if (!raf) raf = requestAnimationFrame(update); }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req, { passive: true });
  update();
})();

// Blog posts: table of contents and copy-link button.
(function () {
  var prose = document.querySelector('.post .prose'), toc = document.querySelector('.toc');
  if (prose && toc) {
    var hs = prose.querySelectorAll('h2');
    if (hs.length >= 3) {
      var ol = toc.querySelector('ol'), links = [];
      hs.forEach(function (h, i) {
        if (!h.id) h.id = 'section-' + (i + 1);
        var li = document.createElement('li'), a = document.createElement('a');
        a.href = '#' + h.id; a.textContent = h.textContent; li.appendChild(a); ol.appendChild(li); links.push([h, a]);
      });
      toc.hidden = false;
      var det = toc.querySelector('details'); if (det && window.matchMedia('(max-width: 760px)').matches) det.open = false;
      ol.addEventListener('click', function () { if (det && window.matchMedia('(max-width: 760px)').matches) det.open = false; });
      var fl = document.createElement('nav'); fl.className = 'toc-float'; fl.setAttribute('aria-label', 'On this page');
      fl.innerHTML = '<b>On this page</b><ol></ol>';
      var flinks = [];
      links.forEach(function (x) { var li = document.createElement('li'), a = document.createElement('a'); a.href = x[1].getAttribute('href'); a.textContent = x[1].textContent; li.appendChild(a); fl.querySelector('ol').appendChild(li); flinks.push(a); });
      document.body.appendChild(fl);
      var endEl = document.querySelector('.author-box') || prose;
      function onScroll() {
        var cur = -1;
        links.forEach(function (x, i) { if (x[0].getBoundingClientRect().top < 160) cur = i; });
        links.forEach(function (x, i) { x[1].classList.toggle('on', i === cur); flinks[i].classList.toggle('on', i === cur); });
        var past = toc.getBoundingClientRect().bottom < 90, before = endEl.getBoundingClientRect().top > 200;
        fl.classList.toggle('show', past && before);
      }
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }
  var cp = document.querySelector('.copy-link');
  if (cp) cp.addEventListener('click', function () {
    var url = cp.getAttribute('data-url'), label = 'Copy article link';
    function done(m) { cp.textContent = m; setTimeout(function () { cp.textContent = label; }, 2200); }
    try { navigator.clipboard.writeText(url).then(function () { done('Link copied'); }, function () { done(url); }); } catch (e) { done(url); }
  });
})();

/* Blog tag filter (supports ?tag= in the URL) */
(function () {
  var bar = document.querySelector('.tag-filter');
  if (!bar) return;
  var cards = document.querySelectorAll('.post-list .post-card');
  var q = document.querySelector('.bh-search input'), none = document.querySelector('.no-hits'), cur = '';
  function apply(tag) {
    if (tag !== undefined) cur = tag;
    var words = q ? q.value.toLowerCase().trim().split(/\s+/).filter(Boolean) : [], shown = 0;
    bar.querySelectorAll('button').forEach(function (b) { b.classList.toggle('on', b.dataset.tag === cur); });
    cards.forEach(function (c) {
      var txt = c.textContent.toLowerCase();
      var hide = (!!cur && (c.dataset.tags || '').split('|').indexOf(cur) < 0) || words.some(function (w) { return txt.indexOf(w) < 0; });
      c.hidden = hide; if (!hide) shown++;
    });
    if (none) none.hidden = shown > 0;
  }
  if (q) q.addEventListener('input', function () { apply(); });
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    apply(b.dataset.tag);
    try { var u = new URL(location.href); if (b.dataset.tag) u.searchParams.set('tag', b.dataset.tag); else u.searchParams.delete('tag'); history.replaceState(null, '', u); } catch (err) {}
  });
  try { var t = new URLSearchParams(location.search).get('tag'); if (t) apply(t); } catch (err) {}
})();
