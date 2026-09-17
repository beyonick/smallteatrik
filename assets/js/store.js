/* ───────────────────────────────────────────────
   Маленький театрик кукол — хранилище спектаклей
   Прототип: данные лежат в localStorage браузера.
   Админка пишет, главная и страница спектакля читают.
   При подключении бэкенда меняются только load/save.
   ─────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var KEY = 'smallteatrik:shows:v1';
  var TICKET_URL = 'https://gelendzhik.kassy.ru/shows/detskie/2-2333/';

  var DEFAULTS = [
    {
      id: 'zhuravlinye-perya',
      title: 'Журавлиные перья',
      tagline: 'японская сказка',
      age: '6+',
      duration: 55,
      price: 1000,
      date: '2026-10-11T19:00',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'violet',
      art: 'a4',
      mascot: '',
      ticketUrl: TICKET_URL,
      published: true,
      short: 'История о выборе и о том, как легко разрушить то, что кажется самым важным. Куклы, живая музыка и традиции японского театра.',
      description: [
        'Одна из самых известных японских сказок — о мудрости, счастье и цене сделанного выбора. Трогательная и глубокая история поднимает темы, которые остаются актуальными независимо от времени и возраста.',
        'В постановке заняты пятеро актёров. Зрителей ждёт сочетание живой музыки, кукол и актёрской игры, вдохновлённое традициями японского театра: ширма, тростевые куклы и музыканты прямо на сцене.',
        'Возрастное ограничение 6+, но на прошлых показах были дети и младше — смотрели до конца.'
      ],
      photos: ['assets/photo/scene-shirma.jpg', 'assets/photo/seagulls.jpg', 'assets/photo/forest.jpg', 'assets/photo/audience.jpg']
    },
    {
      id: 'gusi-lebedi',
      title: 'Гуси-лебеди',
      tagline: 'русская сказка',
      age: '2+',
      duration: 35,
      price: 800,
      date: '2026-09-27T11:00',
      venue: 'Площадка «Город сказок»',
      tone: 'mint',
      art: 'a2',
      mascot: '',
      ticketUrl: TICKET_URL,
      published: true,
      short: 'О смелости, доброте и любви к близким. Играем в зале и под открытым небом на площадке «Город сказок».',
      description: [
        'Добрая русская сказка о девочке, которая не уберегла братца, — и отправилась за ним через печку, яблоню и молочную реку.',
        'История о смелости, доброте и любви к близким, рассказанная с помощью кукол, музыки и настоящего театрального волшебства.',
        'Спектакль идёт и в зале, и на открытой площадке: летом мы показываем его в «Городе сказок» в рамках открытия курортного сезона.'
      ],
      photos: ['assets/photo/russian-tale.jpg', 'assets/photo/kids-costumes.jpg', 'assets/photo/hall-kindergarten.jpg', 'assets/photo/kids-whale.jpg']
    },
    {
      id: 'kozyavochka',
      title: 'Козявочка',
      tagline: 'музыкальный интерактив',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'yellow',
      art: 'a5',
      mascot: '',
      ticketUrl: TICKET_URL,
      published: true,
      short: 'Козявочке встречаются цветок, шмель, червяк, рыбы и лягушка. Спектакль о рождении и познании мира.',
      description: [
        'Спектакль о рождении и познании мира. Козявочке встречаются цветочек, шмель, червяк, рыбы, лягушка — эта наивная, но сложная природа существования даёт знания жизни.',
        'Козявочка приобретает навыки и умения и обретает дружбу. Музыкальный интерактивный спектакль о живой природе — для самых маленьких и не совсем маленьких.',
        'Идеально для первого похода в театр: короткий, громкий и с песнями. Для просмотра всей семьёй.'
      ],
      photos: ['assets/photo/frogs.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/forest.jpg', 'assets/photo/audience.jpg']
    },
    {
      id: 'zhuk-nosorog',
      title: 'Похождения жука-носорога',
      tagline: 'по рассказу К. Паустовского',
      age: '6+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'Школы и детские сады',
      tone: 'orange',
      art: 'a3',
      mascot: '',
      ticketUrl: TICKET_URL,
      published: true,
      short: 'Мальчик подарил отцу, уходящему на фронт, живого жука. Жук прошёл всю войну рядом с солдатом.',
      description: [
        'Спектакль по рассказу Константина Паустовского о путешествии жука-носорога. Маленький мальчик подарил отцу, который уходил на фронт, живого жука.',
        'Всю войну солдат носил подарок сына в солдатской сумке. Не потерял. Сберёг. Жук прошёл войну наравне с солдатом и однажды даже спас ему жизнь.',
        'Играем к Дню Защитника Отечества и ко Дню Победы в школах города. После спектакля дети рисуют к нему рисунки — часть из них висит в городском ДК.'
      ],
      photos: ['assets/photo/soldiers.jpg', 'assets/photo/hall-kindergarten.jpg', 'assets/photo/scene-shirma.jpg', 'assets/photo/kids-costumes.jpg']
    },
    {
      id: 'kolobok',
      title: 'Колобок',
      tagline: 'первый театр',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'pink',
      art: 'a1',
      mascot: '',
      ticketUrl: TICKET_URL,
      published: true,
      short: 'Самая первая сказка в жизни зрителя: короткая, громкая и с песнями. Подходит для дебюта в театре.',
      description: [
        'Та самая сказка, которую ребёнок знает наизусть ещё до того, как впервые придёт в театр. Поэтому её и стоит смотреть первой: следить за сюжетом не надо, можно просто смотреть на кукол.',
        'Тридцать пять минут, живая музыка, знакомые песенки и звери, которых можно потрогать после спектакля.'
      ],
      photos: ['assets/photo/kids-costumes.jpg', 'assets/photo/russian-tale.jpg', 'assets/photo/audience.jpg', 'assets/photo/kids-giraffe.jpg']
    },
    {
      id: 'lyagushka',
      title: 'Лягушка-путешественница',
      tagline: 'живая музыка',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'sky',
      art: 'a6',
      mascot: '',
      ticketUrl: TICKET_URL,
      published: true,
      short: 'О том, как важно вовремя промолчать. С полётом на прутике и оркестром из двух человек прямо на сцене.',
      description: [
        'Лягушка придумала, как полететь с утками на юг, — и не удержалась от того, чтобы всем об этом рассказать.',
        'История о том, как важно вовремя промолчать. С полётом на прутике, марионетками-утками и оркестром из двух человек прямо на сцене.'
      ],
      photos: ['assets/photo/frogs.jpg', 'assets/photo/seagulls.jpg', 'assets/photo/forest.jpg', 'assets/photo/kids-whale.jpg']
    }
  ];

  var MONTHS = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  var WEEKDAYS = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) return parsed;
      }
    } catch (e) { /* приватный режим, заблокированные куки — работаем на дефолтах */ }
    return clone(DEFAULTS);
  }

  function save(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function reset() {
    try { localStorage.removeItem(KEY); } catch (e) { /* нечего чистить */ }
    return clone(DEFAULTS);
  }

  function get(id) {
    var list = load();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function published() {
    return load().filter(function (s) { return s.published !== false; });
  }

  /** Ближайший предстоящий спектакль; если будущих дат нет — первый в списке. */
  function next() {
    var now = Date.now();
    var dated = published().filter(function (s) { return s.date && !isNaN(new Date(s.date)); });
    dated.sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    var upcoming = dated.filter(function (s) { return new Date(s.date).getTime() >= now; });
    return upcoming[0] || published()[0] || null;
  }

  /** «13 июля, пн, 19:00» */
  function formatDate(iso, opts) {
    if (!iso) return '';
    var d = new Date(iso);
    if (isNaN(d)) return '';
    var out = d.getDate() + ' ' + MONTHS[d.getMonth()];
    if (!opts || opts.weekday !== false) out += ', ' + WEEKDAYS[d.getDay()];
    if (!opts || opts.time !== false) {
      out += ', ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }
    return out;
  }

  /** «13 июля» — для плашки на карточке */
  function formatShort(iso) {
    return formatDate(iso, { weekday: false, time: false });
  }

  function slugify(text) {
    var map = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
    return String(text).toLowerCase().split('').map(function (ch) {
      if (map[ch] !== undefined) return map[ch];
      if (/[a-z0-9]/.test(ch)) return ch;
      return '-';
    }).join('').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'spektakl';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  global.TEATR = {
    KEY: KEY,
    TICKET_URL: TICKET_URL,
    DEFAULTS: DEFAULTS,
    load: load,
    save: save,
    reset: reset,
    get: get,
    published: published,
    next: next,
    formatDate: formatDate,
    formatShort: formatShort,
    slugify: slugify,
    escapeHtml: escapeHtml,
    clone: clone
  };
})(window);
