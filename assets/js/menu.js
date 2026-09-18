/* ───────────────────────────────────────────────
   Маленький театрик кукол — меню на телефоне

   Панель открывается кнопкой в шапке: шапка остаётся сверху,
   кнопка превращается в крестик. Закрывается по Esc, по клику
   на ссылку и когда экран становится широким — там обычное меню.
   ─────────────────────────────────────────────── */
(function () {
  'use strict';

  var burger = document.getElementById('burger');
  var menu = document.getElementById('navMenu');
  if (!burger || !menu) return;

  var wide = window.matchMedia('(min-width: 621px)');

  function open() {
    menu.hidden = false;
    /* кадр на применение display, иначе не проиграется появление */
    requestAnimationFrame(function () { menu.classList.add('is-open'); });
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Закрыть меню');
    document.body.classList.add('menu-open');
  }

  function close() {
    menu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Меню');
    document.body.classList.remove('menu-open');
    window.setTimeout(function () {
      if (!menu.classList.contains('is-open')) menu.hidden = true;
    }, 240);
  }

  burger.addEventListener('click', function () {
    if (burger.getAttribute('aria-expanded') === 'true') close();
    else open();
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
      close();
      burger.focus();
    }
  });

  function sync() { if (wide.matches) close(); }
  if (wide.addEventListener) wide.addEventListener('change', sync);

  /* подсвечиваем пункт меню текущей страницы */
  var here = location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-links a, .nav-menu-link');
  for (var i = 0; i < links.length; i++) {
    var path = links[i].getAttribute('href').split('#')[0].split('?')[0] || 'index.html';
    if (path === here) links[i].setAttribute('aria-current', 'page');
  }
})();
