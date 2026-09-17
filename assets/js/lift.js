/* ───────────────────────────────────────────────
   Маленький театрик кукол — кукла встаёт при прокрутке

   На телефоне ховера нет, поэтому эффект отдаём скроллу: чем ближе
   карточка к середине экрана, тем выше поднимается кукла. Прогресс 0…1
   кладётся в переменную --lift, а собирает из неё трансформацию CSS.

   Считаем только для карточек, которые сейчас на экране, и только
   в кадре анимации — на скролл не вешаем тяжёлых вычислений.
   ─────────────────────────────────────────────── */
(function () {
  'use strict';

  var touch = window.matchMedia('(hover: none)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var visible = [];      /* карточки, попавшие в кадр */
  var observer = null;
  var frame = 0;
  var on = false;

  /** 0 — кукла лежит, 1 — карточка ровно в фокусе экрана */
  function progress(card) {
    var art = card.querySelector('.card-art');
    if (!art) return 0;
    var box = art.getBoundingClientRect();
    var view = window.innerHeight || document.documentElement.clientHeight;
    var focus = view * 0.46;                       /* чуть выше середины */
    var reach = view * 0.44;                       /* на каком удалении затухает */
    var p = 1 - Math.abs(box.top + box.height / 2 - focus) / reach;
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    return p * p * (3 - 2 * p);                    /* сглаживаем края */
  }

  function update() {
    frame = 0;
    for (var i = 0; i < visible.length; i++) {
      var card = visible[i];
      var p = progress(card);
      card.style.setProperty('--lift', p.toFixed(3));
      card.classList.toggle('is-lifted', p > 0.12);
    }
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(update);
  }

  function clear(card) {
    card.style.removeProperty('--lift');
    card.classList.remove('is-lifted');
  }

  function start() {
    if (on) return;
    on = true;

    observer = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var card = entries[i].target;
        var at = visible.indexOf(card);
        if (entries[i].isIntersecting) {
          if (at === -1) visible.push(card);
        } else if (at !== -1) {
          visible.splice(at, 1);
          clear(card);
        }
      }
      schedule();
    }, { rootMargin: '10% 0px' });

    var cards = document.querySelectorAll('.card');
    for (var i = 0; i < cards.length; i++) {
      if (cards[i].querySelector('.card-art img')) observer.observe(cards[i]);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
  }

  function stop() {
    if (!on) return;
    on = false;
    if (observer) { observer.disconnect(); observer = null; }
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    for (var i = 0; i < visible.length; i++) clear(visible[i]);
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
