/* ───────────────────────────────────────────────
   Маленький театрик кукол — разметка афиши и расписания
   Одна карточка спектакля и одна строка расписания
   рисуются здесь: главная, афиша и расписание берут их отсюда.
   Подключается после store.js.
   ─────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var T = global.TEATR;
  var esc = T.escapeHtml;

  /** Карточка спектакля для сетки афиши. */
  function cardHtml(s) {
    var href = 'spektakl.html?id=' + encodeURIComponent(s.id);
    var date = s.date ? '<span class="card-date">' + esc(T.formatShort(s.date)) + '</span>' : '';
    var art = s.mascot
      ? '<img src="' + esc(s.mascot) + '" alt="Маскот спектакля «' + esc(s.title) + '»">'
      : '<span class="mascot-tag">3D-маскот<br>«' + esc(s.title) + '»</span>';
    return '' +
      '<article class="card" data-age="' + esc(s.age) + '"' + (s.date ? ' data-dated="1"' : '') + '>' +
        '<a class="card-art ' + esc(s.art || 'a1') + '" href="' + href + '">' + date + art + '</a>' +
        '<h3><a href="' + href + '">' + esc(s.title) + '</a></h3>' +
        '<div class="meta">' +
          '<span class="tag">' + esc(s.age) + '</span>' +
          '<span class="tag">' + esc(s.duration) + ' минут</span>' +
          (s.tagline ? '<span class="tag">' + esc(s.tagline) + '</span>' : '') +
        '</div>' +
        '<p>' + esc(s.short) + '</p>' +
        '<div class="card-foot">' +
          '<b>' + esc(s.price) + ' ₽</b>' +
          /* на телефоне не видно, что карточка кликабельна — даём явную кнопку */
          '<a class="btn btn-line btn-sm card-more" href="' + href + '">Подробнее</a>' +
          '<a class="btn btn-orange btn-sm" href="' + esc(s.ticketUrl || T.TICKET_URL) + '" target="_blank" rel="noopener">Билет</a>' +
        '</div>' +
      '</article>';
  }

  /** Строка расписания: дата слева, спектакль в центре, билет справа. */
  function schedRowHtml(s) {
    var d = new Date(s.date);
    var month = T.formatShort(s.date).split(' ')[1];
    var rest = T.formatDate(s.date).split(', ').slice(1).join(', ');
    return '' +
      '<article class="sched-row">' +
        '<div class="sched-date"><b>' + d.getDate() + '</b><span>' + esc(month) + '</span></div>' +
        '<div>' +
          '<h3><a href="spektakl.html?id=' + encodeURIComponent(s.id) + '">' + esc(s.title) + '</a></h3>' +
          '<div class="sched-meta">' +
            '<span class="tag">' + esc(rest) + '</span>' +
            '<span class="tag">' + esc(s.venue) + '</span>' +
            '<span class="tag">' + esc(s.age) + '</span>' +
            '<span class="tag">' + esc(s.duration) + ' минут</span>' +
          '</div>' +
        '</div>' +
        '<a class="btn btn-orange" href="' + esc(s.ticketUrl || T.TICKET_URL) + '" target="_blank" rel="noopener">' + esc(s.price) + ' ₽ · билет</a>' +
      '</article>';
  }

  /** Предстоящие показы по возрастанию даты. */
  function upcoming() {
    var now = Date.now();
    return T.published()
      .filter(function (s) { return s.date && !isNaN(new Date(s.date)) && new Date(s.date).getTime() >= now; })
      .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
  }

  /** «Октябрь 2026» — заголовок группы в расписании. */
  var MONTHS_NOM = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  function monthTitle(iso) {
    var d = new Date(iso);
    return MONTHS_NOM[d.getMonth()] + ' ' + d.getFullYear();
  }

  /** «1 показ / 2 показа / 5 показов» */
  function plural(n, forms) {
    var n10 = n % 10, n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return forms[1];
    return forms[2];
  }

  T.plural = plural;
  T.cardHtml = cardHtml;
  T.schedRowHtml = schedRowHtml;
  T.upcoming = upcoming;
  T.monthTitle = monthTitle;
})(window);
