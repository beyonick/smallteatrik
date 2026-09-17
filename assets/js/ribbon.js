/* ───────────────────────────────────────────────
   Маленький театрик кукол — живая жёлтая лента

   В разметке лежит только осевая линия (path в defs) и надпись по ней.
   Скрипт превращает ось в ленту постоянной ширины: считает нормали и строит
   по ним залитый контур. На самопересечении лента остаётся цельной.
   Надпись повторяется по всей длине и едет по кругу без шва.

   Без JS остаётся запасной вариант: обычная обводка из разметки.
   ─────────────────────────────────────────────── */
(function () {
  'use strict';

  var SPEED = 34;      /* единиц пути в секунду */
  var STEP = 3;        /* шаг выборки вдоль оси */
  var HALF = 19;       /* половина ширины ленты — одинаковая по всей длине */

  var SVGNS = 'http://www.w3.org/2000/svg';

  function el(name, attrs) {
    var node = document.createElementNS(SVGNS, name);
    for (var k in attrs) if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    return node;
  }

  /** Точки оси с нормалями. */
  function sample(path, len) {
    var pts = [];
    for (var s = 0; s <= len; s += STEP) {
      var p = path.getPointAtLength(s);
      var a = path.getPointAtLength(Math.max(0, s - 1.2));
      var b = path.getPointAtLength(Math.min(len, s + 1.2));
      var tx = b.x - a.x, ty = b.y - a.y;
      var t = Math.hypot(tx, ty) || 1;
      pts.push({ s: s, x: p.x, y: p.y, nx: -ty / t, ny: tx / t });
    }
    return pts;
  }

  /** Замкнутый контур ленты на отрезке [s0, s1]. */
  function shape(pts, len, s0, s1, scale) {
    var w = HALF * (scale || 1);
    var left = [], right = [];
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (p.s < s0 || p.s > s1) continue;
      left.push((p.x + p.nx * w).toFixed(1) + ' ' + (p.y + p.ny * w).toFixed(1));
      right.push((p.x - p.nx * w).toFixed(1) + ' ' + (p.y - p.ny * w).toFixed(1));
    }
    if (left.length < 2) return '';
    return 'M' + left.join('L') + 'L' + right.reverse().join('L') + 'Z';
  }

  function build(box) {
    var svg = box.querySelector('svg');
    var path = box.querySelector('defs path');
    var text = box.querySelector('text');
    var tp = box.querySelector('textPath');
    if (!svg || !path || !text || !tp) return null;

    var len = path.getTotalLength();
    if (!len) return null;

    var pts = sample(path, len);

    var art = el('g', { 'class': 'ribbon-art' });
    var band = el('path', { 'class': 'band-fill', d: shape(pts, len, 0, len) });
    var under = el('path', { 'class': 'band-under', d: band.getAttribute('d') });

    art.appendChild(under);
    art.appendChild(band);

    var fallback = box.querySelector('.ribbon-fallback');
    svg.insertBefore(art, text);
    art.appendChild(text);
    if (fallback) fallback.remove();

    return { text: text, tp: tp, len: len };
  }

  function animate(box, parts) {
    var phrase = (box.getAttribute('data-phrase') || parts.tp.textContent).trim() + ' · ';
    parts.tp.textContent = phrase;
    var unit = parts.text.getComputedTextLength();
    if (!unit) return;

    /* повторов хватает на всю линию плюс один запас — на время сдвига */
    var times = Math.ceil((parts.len + unit) / unit) + 1;
    parts.tp.textContent = new Array(times + 1).join(phrase);

    var offset = 0, last = 0, frame = 0, inView = true;

    function tick(now) {
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      offset -= SPEED * dt;
      if (offset <= -unit) offset += unit;
      parts.tp.setAttribute('startOffset', offset.toFixed(2));
      frame = requestAnimationFrame(tick);
    }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    function sync() {
      var run = !reduce.matches && inView && !document.hidden;
      if (run && !frame) { last = 0; frame = requestAnimationFrame(tick); }
      if (!run && frame) { cancelAnimationFrame(frame); frame = 0; }
    }

    if (window.IntersectionObserver) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        sync();
      }).observe(box);
    }
    document.addEventListener('visibilitychange', sync);
    if (reduce.addEventListener) reduce.addEventListener('change', sync);
    sync();
  }

  function init() {
    var boxes = document.querySelectorAll('[data-ribbon]');
    for (var i = 0; i < boxes.length; i++) {
      var parts = build(boxes[i]);
      if (parts) animate(boxes[i], parts);
    }
  }

  /* шрифт грузится асинхронно — меряем после него, иначе повторов не хватит */
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(init);
  else window.addEventListener('load', init);
})();
