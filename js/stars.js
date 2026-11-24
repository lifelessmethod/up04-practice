/* Starfield + constellation interactivity — Учебная практика 04 */
(function () {
  // ---------- starfield background ----------
  var canvas = document.getElementById('stars');
  if (canvas) {
    var ctx = canvas.getContext('2d'), W, H, stars = [];
    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      stars = [];
      var n = Math.min(220, Math.floor(W * H / 9000));
      for (var i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 1.4 + .3, p: Math.random() * Math.PI * 2,
          s: .008 + Math.random() * .02,
          c: Math.random() < .12 ? '167,139,250' : (Math.random() < .25 ? '125,211,252' : '219,228,255')
        });
      }
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        st.p += st.s;
        var a = .25 + Math.abs(Math.sin(st.p)) * .75;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + st.c + ',' + a + ')';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener('resize', resize);
    resize(); tick();
  }

  // ---------- constellation atlas ----------
  var atlas = document.getElementById('atlas');
  if (!atlas) return;

  var nodes = [
    { id: 1, x: 8,  y: 34 },
    { id: 2, x: 20, y: 70 },
    { id: 3, x: 33, y: 26 },
    { id: 4, x: 46, y: 64 },
    { id: 5, x: 59, y: 24 },
    { id: 6, x: 72, y: 66 },
    { id: 7, x: 89, y: 38 }
  ];
  var links = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6]];

  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var lines = links.map(function (l) {
    var ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.dataset.a = l[0]; ln.dataset.b = l[1];
    svg.appendChild(ln); return ln;
  });
  atlas.appendChild(svg);

  function place() {
    var w = atlas.clientWidth, h = atlas.clientHeight;
    lines.forEach(function (ln) {
      var A = nodes[+ln.dataset.a], B = nodes[+ln.dataset.b];
      ln.setAttribute('x1', A.x / 100 * w); ln.setAttribute('y1', A.y / 100 * h);
      ln.setAttribute('x2', B.x / 100 * w); ln.setAttribute('y2', B.y / 100 * h);
    });
    nodes.forEach(function (n) {
      n.el.style.left = n.x + '%';
      n.el.style.top = n.y + '%';
    });
  }

  var detail = document.getElementById('detail');
  function select(i) {
    nodes.forEach(function (n, j) { n.el.classList.toggle('sel', j === i); });
    lines.forEach(function (ln) {
      ln.classList.toggle('lit', +ln.dataset.a === i || +ln.dataset.b === i);
    });
    var d = window.PRACTICES[i];
    detail.innerHTML =
      '<div class="tag">Практическая работа ' + d.id + '</div>' +
      '<h3>' + d.title + '</h3>' +
      '<p><b>Суть задания:</b> ' + d.task + '</p>' +
      '<p><b>Результат:</b> ' + d.result + '</p>' +
      '<a class="btn" href="practice-' + d.id + '.html">Открыть страницу практики</a> ' +
      '<a class="btn green" href="reports/' + d.file + '" download>Скачать отчёт</a>';
  }

  nodes.forEach(function (n, i) {
    var el = document.createElement('div');
    el.className = 'star';
    el.setAttribute('role', 'link');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Открыть практику ' + n.id + ': ' + window.PRACTICES[i].title);
    el.innerHTML = '<div class="dot"></div><div class="name">Практика ' + n.id + '</div>' +
                   '<div class="go">перейти →</div>';
    el.addEventListener('mouseenter', function () { select(i); });
    el.addEventListener('click', function () { window.open('practice-' + n.id + '.html', '_blank'); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.open('practice-' + n.id + '.html', '_blank'); }
    });
    atlas.appendChild(el);
    n.el = el;
  });
  window.addEventListener('resize', place);
  place();
  select(0);
})();
