/* Lightbox: fullscreen image preview for the gallery */
(function () {
  var figures = Array.prototype.slice.call(document.querySelectorAll('.gallery figure'));
  if (!figures.length) return;

  var items = figures.map(function (fig) {
    return { src: fig.querySelector('img').getAttribute('src'),
             cap: fig.querySelector('figcaption').textContent };
  });
  var idx = 0;

  var overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.innerHTML =
    '<button class="lb-btn lb-close" aria-label="Закрыть">✕</button>' +
    '<button class="lb-btn lb-prev" aria-label="Назад">‹</button>' +
    '<figure class="lb-figure">' +
      '<img alt="">' +
      '<figcaption></figcaption>' +
    '</figure>' +
    '<button class="lb-btn lb-next" aria-label="Вперёд">›</button>' +
    '<div class="lb-count"></div>';
  document.body.appendChild(overlay);

  var img = overlay.querySelector('img');
  var cap = overlay.querySelector('figcaption');
  var count = overlay.querySelector('.lb-count');

  function show(i) {
    idx = (i + items.length) % items.length;
    img.src = items[idx].src;
    cap.textContent = items[idx].cap;
    count.textContent = (idx + 1) + ' / ' + items.length;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  figures.forEach(function (fig, i) {
    fig.style.cursor = 'zoom-in';
    fig.addEventListener('click', function () { show(i); });
  });
  overlay.querySelector('.lb-close').addEventListener('click', close);
  overlay.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  overlay.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
