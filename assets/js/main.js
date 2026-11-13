/* Writing: move the newest post (marked is-new by the build) to the front, before any phone trimming runs. (13 Nov 2026) */
(function () { var li = document.querySelector('#writing .writing-cards li.is-new'); if (li && li.parentNode.firstElementChild !== li) li.parentNode.insertBefore(li, li.parentNode.firstElementChild); })();

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
      [['.lb-meta', 'data-meta'], ['.lb-desc', 'data-desc'], ['.lb-note', 'data-note']].forEach(function (f) {
        var el = dlg.querySelector(f[0]), v = a.getAttribute(f[1]); if (!el) return; el.textContent = v || ''; el.hidden = !v;
      });
      var ex = dlg.querySelector('.lb-extra'), exh = a.getAttribute('data-extra');
      if (ex) { ex.hidden = !exh; if (exh) { ex.textContent = (a.getAttribute('data-extra-label') || 'More') + ' ↗'; ex.onclick = function (ev) { ev.preventDefault(); img.src = exh; cap.textContent = (a.getAttribute('data-caption') || '') + ': ' + (a.getAttribute('data-extra-label') || ''); ex.hidden = true; }; } }
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
      var det = toc.querySelector('details'), narrow = window.matchMedia('(max-width: 1099px)');
      if (det && narrow.matches) det.open = false;
      /* Compact bar below 1100px: starts closed (no page jump) and shows the section being read */
      var sum = toc.querySelector('summary'), now = document.createElement('span');
      now.className = 'toc-now'; now.setAttribute('aria-live', 'polite'); if (sum) sum.appendChild(now);
      var wasStuck = false;
      ol.addEventListener('click', function () { if (det && narrow.matches) det.open = false; });
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
        var stuck = narrow.matches && toc.getBoundingClientRect().top <= 1 && window.scrollY > 200;
        if (stuck !== wasStuck) { toc.classList.toggle('stuck', stuck); wasStuck = stuck; }
        now.innerHTML = cur >= 0 ? '<i>' + (cur + 1) + ' of ' + links.length + '</i>' : '';
        if (cur >= 0) now.appendChild(document.createTextNode(links[cur][1].textContent));
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
    var list = document.querySelector('.post-list'); if (list) list.classList.toggle('filtered', !!cur || words.length > 0);
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

/* Earlier career: open as many as you like, plus show/hide all */
(function () {
  var box = document.getElementById('earlier'); if (!box) return;
  var items = [].slice.call(box.querySelectorAll('details.early')), btn = box.querySelector('.e-all'), all = false;
  /* Opened roles stay open; each one closes only when clicked again.
     When every earlier role is open (one by one or all at once), the button reads "Hide earlier roles" and its amber wave stops for good. */
  function sync() {
    var every = items.every(function (d) { return d.open; });
    if (every) btn.classList.add('used');
    if (every !== all) {
      all = every;
      btn.textContent = all ? 'Hide earlier roles' : 'Show all earlier roles';
      btn.setAttribute('aria-expanded', all ? 'true' : 'false');
    }
  }
  items.forEach(function (d) { d.addEventListener('toggle', sync); });
  btn.addEventListener('click', function () {
    box.dataset.bulk = Date.now();
    all = !all;
    items.forEach(function (d) { d.open = all; });
    btn.textContent = all ? 'Hide earlier roles' : 'Show all earlier roles';
    btn.setAttribute('aria-expanded', all ? 'true' : 'false');
    /* keep the list's top in view after opening or closing (otherwise the page lands on the last role) */
    requestAnimationFrame(function () { box.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
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
    document.getElementById('certifications').classList.toggle('all-open', show);
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
  function check() { els.forEach(function (el) { el.classList.remove('ragged'); if (maxGap(el) > 16) el.classList.add('ragged'); }); }
  window.addEventListener('load', check); window.addEventListener('resize', function () { clearTimeout(check.t); check.t = setTimeout(check, 150); });
})();

/* Guest lectures: first row visible, the rest on demand */
(function () {
  /* Show-more toggles for talks and community cards: 4 shown on desktop, 2 on phones */
  var phone = window.matchMedia('(max-width: 767px)'), tablet = window.matchMedia('(min-width: 768px) and (max-width: 1024px)');
  [['.talk-toggle', '.talk-more', 'Show fewer talks', 'more highlights'], ['.comm-toggle', '.comm-more', 'Show fewer', 'more']].forEach(function (cfg) {
    var btn = document.querySelector(cfg[0]); if (!btn) return;
    var more = [].slice.call(document.querySelectorAll(cfg[1]));
    var list = more.length ? more[0].parentElement : null; if (!list) return;
    var items = [].slice.call(list.children);
    function label() {
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) { btn.textContent = cfg[2]; return; }
      var shown = phone.matches ? 1 : tablet.matches ? 2 : 4; btn.textContent = 'Show ' + Math.max(items.length - shown, 0) + ' ' + cfg[3];
    }
    items.forEach(function (li, i) { if (i >= 1 && i < 4) li.classList.add('m-extra'); });
    btn.addEventListener('click', function () {
      var show = btn.getAttribute('aria-expanded') !== 'true';
      more.forEach(function (li) { li.hidden = !show; });
      list.classList.toggle('m-open', show);
      btn.setAttribute('aria-expanded', show ? 'true' : 'false'); label();
    });
    label(); if (phone.addEventListener) { phone.addEventListener('change', label); tablet.addEventListener('change', label); }
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

/* Phones: training formats collapsed until "Show formats" */
(function () {
  var box = document.querySelector('.train-formats'); if (!box) return;
  var btn = box.querySelector('.fmt-toggle'); if (!btn) return;
  var n = box.querySelectorAll('.fi').length; if (n) btn.textContent = 'Show all ' + n + ' formats';
  btn.addEventListener('click', function () { box.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); });
})();

/* Phones: first 3 bullets of each full role, then "Show N more" */
(function () {
  [].forEach.call(document.querySelectorAll('#experience ol.deck .job-body > ul'), function (ul) {
    var n = ul.children.length - 3; if (n < 1) return;
    ul.classList.add('m-cut');
    var b = document.createElement('button'); b.type = 'button'; b.className = 'job-more';
    b.textContent = 'Show ' + n + ' more';
    ul.insertAdjacentElement('afterend', b);
    b.addEventListener('click', function () { ul.classList.add('m-open'); });
  });
})();

/* Amber wave on "Show all certifications", "Show all earlier roles", "All writing" and the "Volunteering & events" tab until clicked */
(function () {
  [].forEach.call(document.querySelectorAll('.cert-toggle, #earlier .e-all, #writing .wr-all, #hl-t2'), function (b) {
    b.classList.add('wave');
    b.addEventListener('click', function () { b.classList.add('used'); });
    if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { b.classList.add('hint'); io.disconnect(); } }); }, { threshold: .1 }); io.observe(b); } else { b.classList.add('hint'); }
  });
})();

/* Phones: Recognition panels as tabs (Education / Delivery / Training) */
(function () {
  var wrap = document.querySelector('#recognition .three'); if (!wrap) return;
  var groups = [].slice.call(wrap.children).filter(function (g) { return g.classList.contains('panel'); }); if (groups.length < 2) return;
  var short = { 'Training & Mentoring': 'Training' };
  var bar = document.createElement('div'); bar.className = 'cert-tabs rec-tabs'; bar.setAttribute('role', 'tablist');
  groups.forEach(function (g, i) {
    var h = g.querySelector('h3'), name = h ? h.textContent.trim() : 'Group ' + (i + 1);
    var b = document.createElement('button'); b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = short[name] || name;
    b.addEventListener('click', function () {
      groups.forEach(function (x, j) { x.classList.toggle('m-on', j === i); });
      [].forEach.call(bar.children, function (x, j) { x.classList.toggle('on', j === i); x.setAttribute('aria-selected', j === i ? 'true' : 'false'); });
      b.classList.add('visited');
    });
    bar.appendChild(b);
  });
  wrap.classList.add('m-tabbed'); wrap.parentNode.insertBefore(bar, wrap); bar.children[0].click();
  if ('IntersectionObserver' in window) { var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { bar.classList.add('hint'); io.disconnect(); } }); }, { threshold: .1 }); io.observe(bar); } else { bar.classList.add('hint'); }
})();

/* Phones: an opened earlier role scrolls fully into view (nothing hidden behind the browser toolbar) */
(function () {
  var phone = window.matchMedia('(max-width: 767px)');
  [].forEach.call(document.querySelectorAll('#earlier details.early'), function (d) {
    d.addEventListener('toggle', function () {
      var box = document.getElementById('earlier');
      if (!d.open || !phone.matches || (box && Date.now() - (+box.dataset.bulk || 0) < 1500)) return;
      setTimeout(function () {
        var r = d.getBoundingClientRect(), head = 80, room = window.innerHeight - 90;
        if (r.bottom > room || r.top < head) {
          var target = r.height + head > room ? r.top - head : r.bottom - room;
          window.scrollBy({ top: target, behavior: 'smooth' });
        }
      }, 60);
    });
  });
})();

/* "Show all certifications": make every group visible at once (no waiting for the scroll-in animation) */
(function () {
  var btn = document.querySelector('.cert-toggle'); if (!btn) return;
  btn.addEventListener('click', function () {
    [].forEach.call(document.querySelectorAll('#certifications .cg, #certifications .reveal'), function (e) { e.classList.add('in'); });
  });
})();

/* Phones, "Show all certifications": the group you were viewing comes first, then the others in their usual order */
(function () {
  var btn = document.querySelector('.cert-toggle'), wrap = document.querySelector('#certifications .cert-groups'), sec = document.getElementById('certifications');
  if (!btn || !wrap || !sec) return;
  var orig = [].slice.call(wrap.children);
  btn.addEventListener('click', function () {
    if (!wrap.classList.contains('m-tabbed')) return;
    if (sec.classList.contains('all-open')) {
      var active = wrap.querySelector('.cg.m-on'), first = wrap.querySelector('.cg');
      if (active && first && active !== first) wrap.insertBefore(active, first);
    } else {
      orig.forEach(function (n) { wrap.appendChild(n); });
    }
  });
})();

/* Phones: Leadership & tools / Technical chips packed into full, justified rows */
(function () {
  var phone = window.matchMedia('(max-width: 767px)');
  function pack(ul) {
    var items = [].slice.call(ul.children);
    items.forEach(function (li) { li.style.order = ''; });
    if (!phone.matches || !ul.offsetWidth) return;
    ul.classList.add('m-measure');
    var gap = parseFloat(getComputedStyle(ul).columnGap) || 8, avail = ul.clientWidth;
    var rem = items.map(function (li, i) { return { li: li, w: li.getBoundingClientRect().width, i: i }; });
    ul.classList.remove('m-measure');
    /* first-fit in your order: each chip joins the first row that still has room, so the top skills stay near the top */
    var rows = [];
    rem.forEach(function (x) {
      for (var r = 0; r < rows.length; r++) { if (rows[r].w + gap + x.w <= avail) { rows[r].w += gap + x.w; rows[r].items.push(x); return; } }
      rows.push({ w: x.w, items: [x] });
    });
    var n = 0;
    rows.forEach(function (r) { r.items.forEach(function (x) { x.li.style.order = ++n; }); });
  }
  function all() { [].forEach.call(document.querySelectorAll('.skillbox .sk-chips ul'), pack); }
  [].forEach.call(document.querySelectorAll('.skillbox .sk-tab'), function (t) { t.addEventListener('click', function () { setTimeout(all, 0); }); });
  window.addEventListener('resize', function () { clearTimeout(all.t); all.t = setTimeout(all, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(all); all();
})();
/* Credentials: open the collapsed section when a link points inside it */
(function () {
  var d = document.querySelector('details.creds');
  if (!d) return;
  function openFor(h) { if (h && h.length > 1) { try { if (d.querySelector(h)) d.open = true; } catch (e) {} } }
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href*="#"]'); if (a) openFor(a.hash); }, true);
  window.addEventListener('hashchange', function () { openFor(location.hash); });
  openFor(location.hash);
  if (location.hash && d.open) { var el = document.querySelector(location.hash); if (el) el.scrollIntoView(); }
})();

// Resume download menu: close on outside click, Escape, or after a choice
(function () {
  var menus = document.querySelectorAll('details.res-menu, details.res-dd');
  if (!menus.length) return;
  document.addEventListener('click', function (e) {
    menus.forEach(function (m) {
      if (m.open && (!m.contains(e.target) || e.target.closest('.res-pop a'))) {
        setTimeout(function () { m.open = false; }, 0);
      }
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') menus.forEach(function (m) { if (m.open) { m.open = false; m.querySelector('summary').focus(); } });
  });
})();

/* Phone only: show the first two points of each main role; the rest sit behind a "Show more" button.
   Without JavaScript, or on wider screens, every point stays visible. (audit Nov 2026) */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 640px)').matches) return;
  [].forEach.call(document.querySelectorAll('.deck > li.job .job-body > ul'), function (ul) {
    var items = [].slice.call(ul.children); if (items.length <= 2) return;
    /* This trim replaces the older 3-point CSS trim on phones: switch that one off so the two never stack */
    ul.classList.add('m-open');
    var extra = items.slice(2);
    extra.forEach(function (li) { li.classList.add('pt-x'); li.hidden = true; });
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'pt-more'; btn.setAttribute('aria-expanded', 'false');
    var label = function (open) { return open ? 'Show less' : 'Show ' + extra.length + ' more'; };
    btn.textContent = label(false);
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      extra.forEach(function (li) { li.hidden = !open; });
      btn.setAttribute('aria-expanded', String(open)); btn.textContent = label(open);
    });
    ul.parentNode.insertBefore(btn, ul.nextSibling);
  });
})();

/* Phone only: About shows its first two paragraphs; the rest sit behind a "Read more" button.
   Without JavaScript, or on wider screens, every paragraph stays visible. (11 Nov 2026) */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 767px)').matches) return;
  var copy = document.querySelector('#about .copy'); if (!copy) return;
  var extra = [].slice.call(copy.querySelectorAll('p')).slice(2); if (!extra.length) return;
  extra.forEach(function (p) { p.hidden = true; });
  var btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'pt-more about-more'; btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Read more';
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') !== 'true';
    extra.forEach(function (p) { p.hidden = !open; });
    btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? 'Show less' : 'Read more';
  });
  copy.appendChild(btn);
})();

/* Credential groups with data-show: first N badges. "See all badges" opens all three cards at once;
   each list then scrolls inside the same height as before, so the page does not grow. No JS shows everything. (12 Nov 2026) */
(function () {
  var wrap = document.getElementById('cert-more'); if (!wrap) return;
  var lists = [].slice.call(wrap.querySelectorAll('ul[data-show]')); if (!lists.length) return;
  var phone = window.matchMedia && window.matchMedia('(max-width: 1099px)').matches; /* phones and tablets */
  var showN = function (ul) { var n = +ul.getAttribute('data-show') || 6; return phone ? Math.min(4, n) : n; };
  var extras = lists.map(function (ul) { var n = showN(ul), ex = []; [].slice.call(ul.children).forEach(function (li, k) { if (li.classList.contains('cert-sub') ? k > n : k >= n) ex.push(li); }); ex.forEach(function (li) { li.hidden = true; }); return ex; });
  /* a sub-heading right at the cut stays hidden with the rest */
  lists.forEach(function (ul, k) { var n = showN(ul), li = ul.children[n]; if (li && li.classList.contains('cert-sub') && extras[k].indexOf(li) < 0) { li.hidden = true; extras[k].unshift(li); } });
  var btns = [];
  lists.forEach(function (ul) { ul.addEventListener('scroll', function () { ul.classList.toggle('at-end', ul.scrollTop + ul.clientHeight >= ul.scrollHeight - 4); }, { passive: true }); });
  function set(open) {
    var h = 0; if (open) lists.forEach(function (ul) { h = Math.max(h, ul.getBoundingClientRect().height); });
    extras.forEach(function (ex) { ex.forEach(function (li) { li.hidden = !open; }); });
    lists.forEach(function (ul) { ul.style.maxHeight = open ? Math.round(h) + 'px' : ''; ul.classList.toggle('cg-scroll', open); ul.classList.toggle('at-end', !open || ul.scrollHeight - ul.clientHeight < 4); if (!open) ul.scrollTop = 0; if (open) ul.setAttribute('tabindex', '0'); else ul.removeAttribute('tabindex'); });
    btns.forEach(function (b) { b.setAttribute('aria-expanded', String(open)); b.textContent = open ? 'Show fewer ↑' : 'See all badges ↓'; });
  }
  lists.forEach(function (ul, k) {
    if (!extras[k].length || ul.parentNode.querySelector('.group-link')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'group-link cg-more'; b.setAttribute('aria-expanded', 'false'); b.textContent = 'See all badges ↓';
    b.addEventListener('click', function () { set(b.getAttribute('aria-expanded') !== 'true'); });
    ul.parentNode.insertBefore(b, ul.nextSibling); btns.push(b);
  });
})();

/* Laptop and tablet: clients card starts level with the first About line and ends level with the last (14 Nov 2026) */
(function () {
  var copy = document.querySelector('#about .copy'), side = document.querySelector('#about .about-side'); if (!copy || !side) return;
  var mq = window.matchMedia('(min-width: 768px)');
  function lineBox(p, atEnd) {
    var t = atEnd ? p.lastChild : p.firstChild; if (!t || t.nodeType !== 3 || !t.data.length) return null;
    var r = document.createRange(), i = atEnd ? t.data.length - 1 : 0; r.setStart(t, i); r.setEnd(t, i + 1);
    var b = r.getClientRects()[0]; if (!b) return null;
    var half = (parseFloat(getComputedStyle(p).lineHeight) - b.height) / 2;
    return { top: b.top - half, bottom: b.bottom + half };
  }
  function place() {
    side.style.marginTop = ''; side.style.height = ''; side.classList.remove('fit');
    if (!mq.matches || side.getBoundingClientRect().left < copy.getBoundingClientRect().right - 4) return; /* only when side by side */
    var ps = copy.querySelectorAll('p'); if (!ps.length) return;
    var f = lineBox(ps[0], false), l = lineBox(ps[ps.length - 1], true); if (!f || !l) return;
    var d = f.top - side.getBoundingClientRect().top; side.style.marginTop = Math.round(d) + 'px';
    side.classList.add('fit'); side.style.height = Math.round(l.bottom - f.top) + 'px';
  }
  window.addEventListener('resize', function () { clearTimeout(place.t); place.t = setTimeout(place, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place); place();
})();

/* Speaking / Volunteering tabs: one row instead of two. Without JS both panels show with their own headings. (13 Nov 2026) */
(function () {
  var box = document.querySelector('.hl-tabs'); if (!box) return;
  var tabs = [].slice.call(box.querySelectorAll('[role=tab]')), panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
  box.classList.add('is-tabbed');
  function pick(k, focus) {
    tabs.forEach(function (t, i) { var on = i === k; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (panels[i]) panels[i].hidden = !on; });
    if (focus) tabs[k].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(i); });
    t.addEventListener('keydown', function (e) { var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (n) { e.preventDefault(); pick((i + n + tabs.length) % tabs.length, true); } });
  });
  pick(0);
})();

/* Phones and tablets: trim repeated content (audit Nov 2026; tablets added 8 Nov 2026).
   About no longer repeats the stats (rewritten 5 Nov 2026), so it shows in full.
   Training tracks: first topic shown, the rest behind "Show N more topics" (8 Nov 2026). Desktop and no-JS show everything. */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 1024px)').matches) return;
  function collapse(list, after, more, less) {
    if (!list.length) return;
    list.forEach(function (el) { el.classList.add('pt-x'); el.hidden = true; });
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'pt-more'; btn.setAttribute('aria-expanded', 'false'); btn.textContent = more;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      list.forEach(function (el) { el.hidden = !open; });
      btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? less : more;
    });
    after.parentNode.insertBefore(btn, after.nextSibling);
  }
  var topics = document.querySelector('#training ul.topics');
  if (topics) {
    var items = [].slice.call(topics.children);
    if (items.length > 1) collapse(items.slice(1), topics, 'Show ' + (items.length - 1) + ' more topic' + (items.length - 1 === 1 ? '' : 's'), 'Show fewer topics');
  }
})();

/* Case-study pill: play the light sweep a few times once it scrolls into view */
(function () {
  var links = document.querySelectorAll('.case-link');
  if (!links.length || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('cl-seen'); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  links.forEach(function (l) { io.observe(l); });
})();

/* Quote strip scrolls sideways on phones: make it reachable by keyboard only when it actually scrolls */
(function () {
  var g = document.querySelector('.proof-grid');
  if (!g) return;
  function check() {
    if (g.scrollWidth > g.clientWidth + 1) { g.setAttribute('tabindex', '0'); g.setAttribute('aria-label', 'Client feedback quotes, scroll sideways for more'); }
    else { g.removeAttribute('tabindex'); g.removeAttribute('aria-label'); }
  }
  check();
  window.addEventListener('resize', check);
})();

/* Phones and tablets: each skills tab shows its first group; the rest sit behind "Show all skills".
   Laptops and no-JavaScript visitors see every group. (8 Nov 2026) */
(function () {
  if (!window.matchMedia || !window.matchMedia('(max-width: 1024px)').matches) return;
  [].forEach.call(document.querySelectorAll('.skillbox .sk-chips'), function (panel) {
    var heads = [].slice.call(panel.querySelectorAll(':scope > h4'));
    if (heads.length <= 1) return;
    var extra = [];
    heads.slice(1).forEach(function (h) { extra.push(h); if (h.nextElementSibling && h.nextElementSibling.tagName === 'UL') extra.push(h.nextElementSibling); });
    extra.forEach(function (el) { el.classList.add('pt-x'); el.hidden = true; });
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'pt-more sk-more'; btn.setAttribute('aria-expanded', 'false');
    var more = 'Show ' + (heads.length - 1) + ' more skill group' + (heads.length - 1 === 1 ? '' : 's');
    btn.textContent = more;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      extra.forEach(function (el) { el.hidden = !open; });
      btn.setAttribute('aria-expanded', String(open)); btn.textContent = open ? 'Show fewer skills' : more;
      window.dispatchEvent(new Event('resize'));
    });
    panel.appendChild(btn);
  });
})();
