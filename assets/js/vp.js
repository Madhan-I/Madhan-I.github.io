/* Tablets narrower than 1024px render the laptop layout, scaled to fit. Phones and laptops are unchanged. */
(function () {
  var m = document.querySelector('meta[name=viewport]'); if (!m || !window.screen) return;
  var normal = 'width=device-width, initial-scale=1, viewport-fit=cover';
  function set() {
    var a = Math.min(screen.width, screen.height), b = Math.max(screen.width, screen.height);
    if (a < 700) { m.setAttribute('content', normal); document.documentElement.classList.remove('tab-scaled'); return; }
    var land = window.matchMedia && matchMedia('(orientation: landscape)').matches;
    var scaled = (land ? b : a) < 1024;
    m.setAttribute('content', scaled ? 'width=1024, viewport-fit=cover' : normal);
    document.documentElement.classList.toggle('tab-scaled', scaled);
  }
  set();
  window.addEventListener('orientationchange', function () { setTimeout(set, 60); });
})();

/* After a refresh, start at the top of the page (Back from a blog post still returns to where you were) */
(function () {
  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    var reload = nav ? nav.type === 'reload' : (performance.navigation && performance.navigation.type === 1);
    if (!reload || location.hash) return;
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    window.addEventListener('load', function () { window.scrollTo(0, 0); });
  } catch (e) {}
})();
