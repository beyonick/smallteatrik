/* ───────────────────────────────────────────────
   Маленький театрик кукол — кукла встаёт при прокрутке

   На телефоне ховера нет, поэтому эффект отдаём скроллу: чем ближе
   карточка к середине экрана, тем выше поднимается кукла. Прогресс 0…1
   кладётся в переменную --lift, а трансформацию собирает из неё CSS.

   Значение не ставится рывком, а подтягивается к цели на каждом кадре:
   на телефоне при прокрутке сворачивается адресная строка, высота окна
   скачет, и без сглаживания кукла дёргалась бы. По той же причине высоту
   берём у документа, а не у окна, и обновляем только на заметном резайзе.
   ─────────────────────────────────────────────── */
(function () {
  'use strict';

  var EASE = 0.18;        /* насколько подтягиваем к цели за кадр */
  var SETTLED = 0.002;    /* ближе этого считаем, что доехали */
  var ON = 0.10;          /* порог, на котором поднимаем карточку над соседями */
  var OFF = 0.03;         /* и порог, на котором опускаем обратно */

  var touch = window.matchMedia('(hover: none)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var items = [];         /* {card, lift, target, shown} */
  var visible = [];
  var observer = null;
  var frame = 0;
  var height = 0;
  var on = false;

  function measure() {
    var next = document.documentElement.clientHeight || window.innerHeight;
    /* мелкие скачки от адресной строки игнорируем */
    if (!height || Math.abs(next - height) > 120) height = next;
  }

  /** 0 — кукла лежит, 1 — карточка ровно в фокусе экрана */
  function target(item) {
    var art = item.card.querySelector('.card-art');
    if (!art) return 0;
    var box = art.getBoundingClientRect();
    var focus = height * 0.46;                     /* чуть выше середины */
    var reach = height * 0.44;                     /* на каком удалении затухает */
    var p = 1 - Math.abs(box.top + box.height / 2 - focus) / reach;
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    return p * p * (3 - 2 * p);                    /* сглаживаем края */
  }

  function tick() {
    frame = 0;
    var moving = false;

    for (var i = 0; i < visible.length; i++) {
      var item = visible[i];
      item.target = target(item);

      var d = item.target - item.lift;
      if (Math.abs(d) < SETTLED) item.lift = item.target;
      else { item.lift += d * EASE; moving = true; }

      item.card.style.setProperty('--lift', item.lift.toFixed(3));

      var show = item.shown ? item.lift > OFF : item.lift > ON;
      if (show !== item.shown) {
        item.shown = show;
        item.card.classList.toggle('is-lifted', show);
      }
    }

    if (moving) frame = requestAnimationFrame(tick);
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(tick);
  }

  function onResize() {
    measure();
    schedule();
  }

  function rest(item) {
    item.lift = 0;
    item.target = 0;
    item.shown = false;
    item.card.style.removeProperty('--lift');
    item.card.classList.remove('is-lifted');
  }

  function start() {
    if (on) return;
    on = true;
    measure();

    var cards = document.querySelectorAll('.card');
    items = [];
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].querySelector('.card-art img')) {
        items.push({ card: cards[i], lift: 0, target: 0, shown: false });
      }
    }

    observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var item = null;
        for (var j = 0; j < items.length; j++) {
          if (items[j].card === entries[i].target) { item = items[j]; break; }
        }
        if (!item) continue;

        var at = visible.indexOf(item);
        if (entries[i].isIntersecting) {
          if (at === -1) visible.push(item);
        } else if (at !== -1) {
          visible.splice(at, 1);
          rest(item);                              /* за кадром — сразу на место */
        }
      }
      schedule();
    }, { rootMargin: '15% 0px' });

    for (i = 0; i < items.length; i++) observer.observe(items[i].card);

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    schedule();
  }

  function stop() {
    if (!on) return;
    on = false;
    if (observer) { observer.disconnect(); observer = null; }
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('orientationchange', onResize);
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    for (var i = 0; i < items.length; i++) rest(items[i]);
    items = [];
    visible = [];
  }

  function sync() {
    if (touch.matches && !reduce.matches && window.IntersectionObserver) start();
    else stop();
  }

  function init() {
    sync();
    if (touch.addEventListener) {
      touch.addEventListener('change', sync);
      reduce.addEventListener('change', sync);
    }
  }

  /* карточки рисует инлайновый скрипт страницы — ждём разбора документа */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
