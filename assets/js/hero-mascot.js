/* ───────────────────────────────────────────────
   Маленький театрик кукол — карусель кукол в шапке
   Порядок перемешивается при каждой загрузке страницы:
   первый персонаж всегда случайный, дальше куклы
   сменяют друг друга сами.
   Подключается после store.js.
   ─────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var T = global.TEATR;
  var slot = document.querySelector('[data-mascot-rotator]');
  if (!slot || !T) return;

  /* Куклы, у которых нет своей карточки в афише, но которые хочется показать. */
  var EXTRA = [
    {
      src: 'assets/mascot/krasnaya-shapochka-volk.webp',
      title: 'Красная шапочка',
      alt: 'Кукла волка из спектакля «Красная шапочка»'
    }
  ];

  var list = T.published()
    .filter(function (s) { return s.mascot; })
    .map(function (s) {
      return {
        src: s.mascot,
        title: s.title,
        alt: 'Кукла из спектакля «' + s.title + '»'
      };
    })
    .concat(EXTRA);

  if (!list.length) return;

  /* Фишер—Йетс: и первый кадр случайный, и порядок каждый раз новый. */
  for (var i = list.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var swap = list[i]; list[i] = list[j]; list[j] = swap;
  }

  var interval = parseInt(slot.getAttribute('data-interval'), 10) || 5500;
  var calm = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;

  slot.innerHTML = '';
  slot.classList.add('mascot-rotator');

  function makeLayer() {
    var img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    slot.appendChild(img);
    return img;
  }

  var layers = [makeLayer(), makeLayer()];
  var caption = document.createElement('span');
  caption.className = 'mascot-name';
  slot.appendChild(caption);

  var live = 0;   // какой слой сейчас на виду
  var at = 0;     // какая кукла сейчас на виду
  var timer = null;
  var busy = false;

  /** Кладёт куклу в слой и зовёт cb, когда картинка готова. */
  function load(layer, item, cb) {
    layer.onload = function () {
      /* широкие куклы — кит, журавли — иначе вылезают за кромку шапки */
      layer.classList.toggle('is-wide', layer.naturalWidth / layer.naturalHeight > 1.2);
      cb();
    };
    layer.onerror = cb;
    layer.alt = item.alt;
    layer.src = item.src;
  }

  function preload(item) {
    var img = new Image();
    img.decoding = 'async';
    img.src = item.src;
  }

  function show(item) {
    caption.textContent = '«' + item.title + '»';
    caption.classList.add('is-on');
  }

  function next() {
    if (busy || list.length < 2) return;
    busy = true;
    var upcoming = list[(at + 1) % list.length];
    var back = layers[1 - live];
    caption.classList.remove('is-on');
    load(back, upcoming, function () {
      back.classList.add('is-on');
      layers[live].classList.remove('is-on');
      live = 1 - live;
      at = (at + 1) % list.length;
      show(upcoming);
      busy = false;
      preload(list[(at + 1) % list.length]);
    });
  }

  /* Крутим только когда есть кому смотреть: шапка в кадре, вкладка
     активна, курсор не на кукле. Состояния держим отдельно, иначе
     возврат во вкладку запускал бы карусель за пределами экрана. */
  var inView = !global.IntersectionObserver;
  var hovered = false;

  function sync() {
    var should = !calm && list.length > 1 && inView && !hovered && !document.hidden;
    if (should && !timer) {
      timer = setInterval(next, interval);
    } else if (!should && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  /* первая кукла */
  load(layers[0], list[0], function () {
    layers[0].classList.add('is-on');
    show(list[0]);
    if (list.length > 1) preload(list[1]);
  });

  /* по нажатию листаем сами: на телефоне ховера нет, а разглядеть
     всех кукол, не дожидаясь очереди, хочется */
  slot.addEventListener('click', function () {
    next();
    if (timer) { clearInterval(timer); timer = null; sync(); }
  });

  slot.addEventListener('mouseenter', function () { hovered = true; sync(); });
  slot.addEventListener('mouseleave', function () { hovered = false; sync(); });
  document.addEventListener('visibilitychange', sync);

  if (global.IntersectionObserver) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      sync();
    }, { threshold: 0.15 }).observe(slot);
  }

  sync();
})(window);
