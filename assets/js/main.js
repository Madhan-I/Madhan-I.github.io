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

/* Read count: shown only when GoatCounter is set up, public counts are allowed, and the number is meaningful */
(function () {
  var el = document.querySelector('.post .reads'); if (!el || !window.fetch) return;
  fetch(el.dataset.src).then(function (r) { return r.ok ? r.json() : null; }).then(function (d) {
    if (!d || !d.count) return; var n = parseInt(String(d.count).replace(/[^0-9]/g, ''), 10);
    if (n >= 50) { el.textContent = ' · ' + d.count + ' reads'; el.hidden = false; }
  }).catch(function () {});
})();
/* Blog search can be prefilled from a hashtag link (?q=) */
(function () {
  var q = document.querySelector('.bh-search input'); if (!q) return;
  try { var v = new URLSearchParams(location.search).get('q'); if (v) { q.value = v.replace(/([a-z])([A-Z])/g, '$1 $2'); q.dispatchEvent(new Event('input')); } } catch (e) {}
})();

/* Earlier career: one open at a time, plus show/hide all */
(function () {
  var box = document.getElementById('earlier'); if (!box) return;
  var items = [].slice.call(box.querySelectorAll('details.early')), btn = box.querySelector('.e-all'), all = false;
  items.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (all || !d.open) return;
      items.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });
  btn.addEventListener('click', function () {
    all = !all;
    items.forEach(function (d) { d.open = all; });
    btn.textContent = all ? 'Hide earlier roles' : 'Show all earlier roles';
    btn.setAttribute('aria-expanded', all ? 'true' : 'false');
    if (!all) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

(function () {
  document.querySelectorAll('details.early .e-close').forEach(function (b) {
    b.addEventListener('click', function () { var d = b.closest('details'); d.open = false; d.querySelector('summary').focus(); });
  });
})();

/* Certifications: core groups first, the rest on demand */
(function () {
  var btn = document.querySelector('.cert-toggle'), more = document.getElementById('cert-more'); if (!btn || !more) return;
  btn.addEventListener('click', function () {
    var show = more.hidden; more.hidden = !show; document.querySelectorAll('.cert-x').forEach(function (e) { e.hidden = !show; });
    more.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
    btn.textContent = show ? 'Show fewer certifications' : 'Show all certifications';
    btn.setAttribute('aria-expanded', show ? 'true' : 'false');
    if (!show) document.getElementById('certifications').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* Number boxes stay justified; a box falls back to left-aligned only if justifying would open wide gaps at this screen width */
(function () {
  var els = document.querySelectorAll('.metric p, .metric .t'); if (!els.length) return;
  function maxGap(el) {
    var tn = el.firstChild; if (!tn || tn.nodeType !== 3) return 0;
    var s = tn.textContent, re = /\S+/g, m, prev = null, mx = 0;
    while ((m = re.exec(s))) { var r = document.createRange(); r.setStart(tn, m.index); r.setEnd(tn, m.index + m[0].length); var b = r.getClientRects()[0]; if (prev && b && Math.abs(b.top - prev.top) < 3) mx = Math.max(mx, b.left - prev.right); prev = b; }
    return mx;
  }
  function check() { els.forEach(function (el) { el.classList.remove('ragged'); if (maxGap(el) > 11) el.classList.add('ragged'); }); }
  window.addEventListener('load', check); window.addEventListener('resize', function () { clearTimeout(check.t); check.t = setTimeout(check, 150); });
})();

/* Guest lectures: first row visible, the rest on demand */
(function () {
  /* Show-more toggles for talks and community cards: 4 shown on desktop, 2 on phones */
  var phone = window.matchMedia('(max-width: 767px)');
  [['.talk-toggle', '.talk-more', 'Show fewer talks', 'more highlights'], ['.comm-toggle', '.comm-more', 'Show fewer', 'more']].forEach(function (cfg) {
    var btn = document.querySelector(cfg[0]); if (!btn) return;
    var more = [].slice.call(document.querySelectorAll(cfg[1]));
    var list = more.length ? more[0].parentElement : null; if (!list) return;
    var items = [].slice.call(list.children);
    function label() {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) { btn.textContent = cfg[2]; return; }
      var shown = phone.matches ? 2 : 4; btn.textContent = 'Show ' + Math.max(items.length - shown, 0) + ' ' + cfg[3];
    }
    items.forEach(function (li, i) { if (i >= 2 && i < 4) li.classList.add('m-extra'); });
    btn.addEventListener('click', function () {
      var show = btn.getAttribute('aria-expanded') !== 'true';
      more.forEach(function (li) { li.hidden = !show; });
      list.classList.toggle('m-open', show);
      btn.setAttribute('aria-expanded', show ? 'true' : 'false'); label();
    });
    label(); if (phone.addEventListener) phone.addEventListener('change', label);
  });
})();

/* Training card tabs */
(function () {
  var box = document.querySelector('.skillbox'); if (!box) return;
  var tabs = box.querySelectorAll('.sk-tab'), panels = box.querySelectorAll('.sk-panel');
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { box.classList.add('hint'); io.disconnect(); } }); }, { threshold: .1 }); io.observe(box); } else { box.classList.add('hint'); }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var k = t.getAttribute('data-sk'); t.classList.add('visited');
      tabs.forEach(function (x) { var on = x === t; x.classList.toggle('on', on); x.setAttribute('aria-selected', on ? 'true' : 'false'); });
      panels.forEach(function (p) { p.hidden = p.getAttribute('data-panel') !== k; });
    });
  });
})();

/* Community & events: four cards visible, the rest on demand */


/* Contact: email card starts where the action cards start */
(function () {
  var top = document.querySelector('.contact-top'), bot = document.querySelector('.contact-bottom'); if (!top || !bot) return;
  function sync() {
    if (window.innerWidth < 900) { bot.style.gridTemplateColumns = ''; return; }
    bot.style.gridTemplateColumns = getComputedStyle(top).gridTemplateColumns;
  }
  sync(); window.addEventListener('resize', sync); if (document.fonts && document.fonts.ready) document.fonts.ready.then(sync);
})();

/* Phones: first 3 earlier roles, then a "Show more roles" button */
(function () {
  var box = document.getElementById('earlier'); if (!box) return;
  var items = box.querySelectorAll('details.early'); if (items.length <= 3) return;
  var more = document.createElement('button'); more.type = 'button'; more.className = 'm-more-roles';
  more.textContent = 'Show ' + (items.length - 3) + ' more roles';
  items[2].insertAdjacentElement('afterend', more);
  function openAll() { box.classList.add('m-all'); }
  more.addEventListener('click', openAll);
  var all = box.querySelector('.e-all'); if (all) all.addEventListener('click', openAll);
})();

/* Phones: certification groups as tabs */
(function () {
  var wrap = document.querySelector('#certifications .cert-groups'); if (!wrap) return;
  var groups = [].slice.call(wrap.children).filter(function (g) { return g.classList.contains('cg'); }); if (groups.length < 2) return;
  var short = { 'Agile, SAFe® & Service Management': 'Agile & SAFe®', 'DevOps & Reliability': 'DevOps' };
  var bar = document.createElement('div'); bar.className = 'cert-tabs'; bar.setAttribute('role', 'tablist');
  groups.forEach(function (g, i) {
    var h = g.querySelector('h3'), name = h ? h.textContent.trim() : 'Group ' + (i + 1);
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = short[name] || name;
    b.addEventListener('click', function () {
      groups.forEach(function (x, j) { x.classList.toggle('m-on', j === i); });
      [].forEach.call(bar.children, function (x, j) { x.classList.toggle('on', j === i); x.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
    });
    bar.appendChild(b);
  });
  wrap.classList.add('m-tabbed'); wrap.parentNode.insertBefore(bar, wrap); bar.children[0].click(); bar.children[0].classList.add('visited');
  [].forEach.call(bar.children, function (b) { b.addEventListener('click', function () { b.classList.add('visited'); }); });
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { bar.classList.add('hint'); io.disconnect(); } }); }, { threshold: .1 }); io.observe(bar); } else { bar.classList.add('hint'); }
})();

/* "All writing" sweep starts when the Writing section comes into view */
(function () {
  var sec = document.getElementById('writing'); if (!sec || !sec.querySelector('.wr-all')) return;
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { sec.classList.add('hint'); io.disconnect(); } }); }, { threshold: .1 }); io.observe(sec); } else { sec.classList.add('hint'); }
})();
