/* Skill Check: renders quiz days from a JSON file. No outside requests. */
(function () {
  var root = document.getElementById('drill');
  if (!root) return;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function fmt(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>'); }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function nice(iso) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  }
  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  function table(name, t) {
    var h = '<div class="drill-table"><p class="drill-tname">' + esc(name) + '</p><div class="drill-scroll"><table><thead><tr>';
    t.cols.forEach(function (c) { h += '<th>' + esc(c) + '</th>'; });
    h += '</tr></thead><tbody>';
    t.rows.forEach(function (r) {
      h += '<tr>' + r.map(function (v) { return '<td' + (v === 'NULL' ? ' class="null"' : '') + '>' + esc(v) + '</td>'; }).join('') + '</tr>';
    });
    return h + '</tbody></table></div></div>';
  }

  function renderDay(day, data, open) {
    var box = el('details', 'drill-day');
    box.id = day.id;
    if (open) box.open = true;
    var when = new Date(day.date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    box.appendChild(el('summary', null,
      '<span class="drill-num">' + esc(day.series) + ' · ' + esc(when) + '</span><span class="drill-topic">' + esc(day.topic) +
      '</span><span class="drill-score" data-score></span>'));

    if (day.tables.length) {
      var tw = el('div', 'drill-tables');
      tw.innerHTML = '<p class="drill-tlead">Sample data for this set</p>' + day.tables.map(function (t) { return table(t, data.tables[t]); }).join('');
      box.appendChild(tw);
    }

    var key = 'drill-' + day.id, saved = {};
    try { saved = JSON.parse(store(key) || '{}'); } catch (e) {}
    var scoreEl = box.querySelector('[data-score]');
    function score() {
      var a = 0, r = 0;
      day.questions.forEach(function (q, i) { if (saved[i] != null) { a++; if (saved[i] === q.answer) r++; } });
      scoreEl.textContent = a ? r + ' of ' + a + ' right' : '';
    }

    day.questions.forEach(function (q, i) {
      var qd = el('fieldset', 'drill-q');
      qd.appendChild(el('legend', null, '<span>Q' + (i + 1) + '.</span> ' + fmt(q.q)));
      var opts = el('div', 'drill-opts');
      var why = el('p', 'drill-why');
      why.hidden = true;
      q.options.forEach(function (o, k) {
        var b = el('button', 'drill-opt', '<b>' + 'ABCD'[k] + '</b> ' + fmt(o));
        b.type = 'button';
        b.addEventListener('click', function () { pick(k); });
        opts.appendChild(b);
      });
      function pick(k, quiet) {
        var bs = opts.querySelectorAll('button');
        bs.forEach(function (b, j) {
          b.disabled = true;
          if (j === q.answer) b.classList.add('right');
          if (j === k && k !== q.answer) b.classList.add('wrong');
        });
        why.hidden = false;
        why.innerHTML = '<b>' + (k === q.answer ? 'Correct.' : 'Not quite. The answer is ' + 'ABCD'[q.answer] + '.') + '</b> ' + fmt(q.why);
        if (!quiet) { saved[i] = k; store(key, JSON.stringify(saved)); score(); }
      }
      qd.appendChild(opts);
      qd.appendChild(why);
      box.appendChild(qd);
      if (saved[i] != null) pick(saved[i], true);
    });

    var reset = el('button', 'btn ghost drill-reset', 'Try this day again');
    reset.type = 'button';
    reset.addEventListener('click', function () { try { localStorage.removeItem(key); } catch (e) {} location.hash = day.id; location.reload(); });
    box.appendChild(reset);
    score();
    return box;
  }

  fetch(root.getAttribute('data-src'))
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var t = today();
      var live = data.days.filter(function (d) { return d.date <= t; });
      var next = data.days.filter(function (d) { return d.date > t; })[0];
      root.innerHTML = '';
      if (!live.length) {
        root.appendChild(el('p', 'drill-soon', 'The first set unlocks on ' + nice(data.days[0].date) + '.'));
        return;
      }
      var hash = location.hash.slice(1);
      var openId = live.some(function (d) { return d.id === hash; }) ? hash : live[live.length - 1].id;
      live.slice().reverse().forEach(function (d) { root.appendChild(renderDay(d, data, d.id === openId)); });
      if (next) root.insertBefore(el('p', 'drill-soon', 'Next set: ' + esc(next.series) + ', ' + nice(next.date) + '.'), root.firstChild);
      var target = document.getElementById(openId);
      if (hash && target) target.scrollIntoView();
    })
    .catch(function () { root.innerHTML = '<p>Questions could not load. Please refresh.</p>'; });
})();
