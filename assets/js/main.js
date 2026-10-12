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
