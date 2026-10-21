/* Tablets narrower than 1024px render the laptop layout, scaled to fit. Phones and laptops are unchanged. */
(function () {
  var m = document.querySelector('meta[name=viewport]'); if (!m || !window.screen) return;
  var normal = 'width=device-width, initial-scale=1, viewport-fit=cover';
  function set() {
    var a = Math.min(screen.width, screen.height), b = Math.max(screen.width, screen.height);
    if (a < 700) { m.setAttribute('content', normal); return; }
    var land = window.matchMedia && matchMedia('(orientation: landscape)').matches;
    m.setAttribute('content', (land ? b : a) < 1024 ? 'width=1024, viewport-fit=cover' : normal);
  }
  set();
  window.addEventListener('orientationchange', function () { setTimeout(set, 60); });
})();
