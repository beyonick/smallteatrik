/* ───────────────────────────────────────────────
   Маленький театрик кукол — хранилище спектаклей
   Прототип: данные лежат в localStorage браузера.
   Админка пишет, главная и страница спектакля читают.
   При подключении бэкенда меняются только load/save.
   ─────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var KEY = 'smallteatrik:shows:v2';
  var TICKET_URL = 'https://gelendzhik.kassy.ru/events/detskie/';

  var DEFAULTS = [
    {
      id: 'veselye-medvezhata',
      title: 'Весёлые медвежата',
      tagline: 'новая постановка',
      age: '1+',
      duration: 40,
      price: 800,
      date: '2026-09-26T10:30',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'orange',
      art: 'a3',
      mascot: '',
      ticketUrl: 'https://gelendzhik.kassy.ru/events/detskie/2-7678/',
      published: true,
      short: 'Новая постановка театра: премьера сентябрьской афиши. Кукольный спектакль для всей семьи.',
      description: [
        'Новая постановка «Маленького театрика кукол» — премьера сентябрьской афиши.',
        'Как и все субботние спектакли, идёт в Малом зале ДК им. Л. Плешкова в 10:30. Билет покупается на взрослого и на ребёнка от года, детям до года — бесплатно, на руках у родителей.'
      ],
      photos: ['assets/photo/kids-costumes.jpg', 'assets/photo/audience.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'cvetik-semicvetik',
      title: 'Цветик-семицветик',
      tagline: 'по В. Катаеву',
      age: '1+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'pink',
      art: 'a1',
      mascot: 'assets/mascot/cvetik-semicvetik.webp',
      ticketUrl: '',
      published: true,
      short: 'Добрая история по рассказу Валентина Катаева о том, как важно заботиться о других и ценить возможности.',
      description: [
        'Добрая история по одноимённому рассказу Валентина Катаева о том, как важно заботиться о других и ценить возможности, которые даются не всегда.',
        'Спектакль идёт 35–40 минут без антракта, играем в Малом зале ДК им. Л. Плешкова.'
      ],
      photos: ['assets/photo/scene-shirma.jpg', 'assets/photo/kids-whale.jpg', 'assets/photo/audience.jpg', 'assets/photo/forest.jpg']
    },
    {
      id: 'lyagushka',
      title: 'Лягушка-путешественница',
      tagline: 'первое знакомство с театром',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'sky',
      art: 'a6',
      mascot: 'assets/mascot/lyagushka.webp',
      ticketUrl: 'https://gelendzhik.kassy.ru/shows/detskie/2-2369/',
      published: true,
      short: 'О том, что чрезмерная похвальба может опустить с небес на землю даже исключительную личность.',
      description: [
        'Детский спектакль о том, что чрезмерная похвальба и нескромность могут опустить с небес на землю даже исключительную личность. Или ещё о чём-то — там кто как поймёт.',
        'Один из спектаклей, с которых чаще всего начинают знакомство с театром: короткий, музыкальный и негромкий.'
      ],
      photos: ['assets/photo/frogs.jpg', 'assets/photo/seagulls.jpg', 'assets/photo/forest.jpg', 'assets/photo/kids-whale.jpg']
    },
    {
      id: 'gusi-lebedi',
      title: 'Гуси-лебеди',
      tagline: 'русская сказка',
      age: '1+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'mint',
      art: 'a2',
      mascot: 'assets/mascot/gusi-lebedi.webp',
      ticketUrl: '',
      published: true,
      short: 'Русская сказка о том, как капризная девочка поумнела и как силы природы помогли ей в этом.',
      description: [
        'Русская сказка о том, как одна капризная и вздорная девочка поумнела. И как силы природы помогли ей в этом.',
        'О традициях и ценностях и о воздействии на них времени, о взаимоотношениях в театре и о многих вещах, которые будут интересны и детям, и взрослым. Сказка — ложь, да в ней намёк, а кто слушал — молодец.',
        'Рекомендован для семейного просмотра от 1 до 101 года. Играем и в зале, и на выездах: в детских садах, школах и на фестивалях.'
      ],
      photos: ['assets/photo/russian-tale.jpg', 'assets/photo/kids-costumes.jpg', 'assets/photo/hall-kindergarten.jpg', 'assets/photo/audience.jpg']
    },
    {
      id: 'skazochka-pro-kozyavochku',
      title: 'Сказочка про козявочку',
      tagline: 'по Мамину-Сибиряку',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'yellow',
      art: 'a5',
      mascot: 'assets/mascot/skazochka-pro-kozyavochku.webp',
      ticketUrl: '',
      published: true,
      short: 'О том, как ребёнок познаёт мир. Музыкальный интерактив о живой природе для самых маленьких.',
      description: [
        'Детский кукольный спектакль по рассказам Мамина-Сибиряка — о том, как ребёнок познаёт мир.',
        'Козявочке встречаются цветочек, шмель, червяк, рыбы, лягушка: эта наивная, но сложная природа существования даёт знания жизни. Козявочка приобретает навыки и умения и обретает дружбу.',
        'Музыкальный интерактивный спектакль о живой природе — для самых маленьких и не совсем маленьких. Для просмотра всей семьёй.'
      ],
      photos: ['assets/photo/frogs.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/forest.jpg', 'assets/photo/audience.jpg']
    },
    {
      id: 'ulitka-i-kit',
      title: 'Улитка и кит',
      tagline: 'по Джулии Дональдсон',
      age: '2+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'sky',
      art: 'a6',
      mascot: 'assets/mascot/ulitka-i-kit.webp',
      ticketUrl: '',
      published: true,
      short: 'Улитка мечтала увидеть огромный мир — и спасла кита. Сказка о силе духа и безграничных возможностях.',
      description: [
        'Спектакль по мотивам сказки в стихах Джулии Дональдсон: о мечтающей о путешествии улитке, которая отправилась в дальнее плавание с китом.',
        'О маленькой улитке, спасшей доброго кита-великана от гибели. Сказка о силе духа и о безграничных возможностях.',
        'Интерактивный, весёлый и музыкальный спектакль для детей с двух лет. Любимый многими семьями — играем его не первый сезон.'
      ],
      photos: ['assets/photo/kids-whale.jpg', 'assets/photo/seagulls.jpg', 'assets/photo/audience.jpg', 'assets/photo/frogs.jpg']
    },
    {
      id: 'krasnaya-shapochka',
      title: 'Красная шапочка',
      tagline: 'о любви к маме',
      age: '1+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'pink',
      art: 'a1',
      mascot: 'assets/mascot/krasnaya-shapochka.webp',
      ticketUrl: '',
      published: true,
      short: 'Сказка о любви к маме, о том, что добро всегда побеждает и что не нужно разговаривать с посторонними.',
      description: [
        'Сказка о любви к маме, о том, что добро всегда побеждает, и о том, что не нужно разговаривать с посторонними.',
        'Как и на всех субботних спектаклях, перед началом проходит адаптация: желающие дети выступают со стихами и песнями.'
      ],
      photos: ['assets/photo/russian-tale.jpg', 'assets/photo/kids-costumes.jpg', 'assets/photo/audience.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'fedorino-gore',
      title: 'Федорино горе',
      tagline: 'по К. Чуковскому',
      age: '1+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'orange',
      art: 'a3',
      mascot: 'assets/mascot/fedorino-gore.webp',
      ticketUrl: '',
      published: true,
      short: 'Весёлая музыкальная история о Федоре, посуде и котах — с играми с залом и шутками для взрослых.',
      description: [
        'Спектакль по мотивам одноимённого произведения Корнея Чуковского о том, как Федора совсем не хотела заниматься домашним хозяйством, потому что была занята другими делами.',
        'Весёлая музыкальная история о Федоре, посуде и котах, которая напоминает, что даже самые обычные дела бывают важными.',
        'Современная интерпретация с музыкальными вставками и играми с залом: маленькие зрители помогают героям, а взрослые ловят другой уровень шуток и узнают ту самую Федору.'
      ],
      photos: ['assets/photo/russian-tale.jpg', 'assets/photo/audience.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'skazka-o-glupom-myshonke',
      title: 'Сказка о глупом мышонке',
      tagline: 'по С. Маршаку',
      age: '1+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'violet',
      art: 'a4',
      mascot: '',
      ticketUrl: '',
      published: true,
      short: 'По Маршаку — с авторским продолжением. О том, что непослушание приводит к беде.',
      description: [
        'Спектакль для семейного просмотра по мотивам произведения Самуила Яковлевича Маршака — с авторским продолжением.',
        'Спектакль несёт в себе поучительный смысл: непослушание приводит к беде, а поспешные, необдуманные решения могут довести ситуацию до трагического исхода.'
      ],
      photos: ['assets/photo/scene-shirma.jpg', 'assets/photo/frogs.jpg', 'assets/photo/audience.jpg', 'assets/photo/forest.jpg']
    },
    {
      id: 'kolobok',
      title: 'Колобок',
      tagline: 'скоморошина',
      age: '1+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'yellow',
      art: 'a5',
      mascot: 'assets/mascot/kolobok.webp',
      ticketUrl: '',
      published: true,
      short: 'Скоморошина с играми, песнями и забавами: о том, как хлеб родился и как масленицу празднуют.',
      description: [
        'Русская народная сказка в постановке «Маленького театрика кукол».',
        'Скоморошина с играми, песнями и забавами — о том, как хлеб родился и как масленицу празднуют. Подходит для малышей: сюжет знаком заранее, следить за историей не нужно, можно просто смотреть на кукол.'
      ],
      photos: ['assets/photo/kids-costumes.jpg', 'assets/photo/russian-tale.jpg', 'assets/photo/audience.jpg', 'assets/photo/kids-giraffe.jpg']
    },
    {
      id: 'aybolit',
      title: 'Айболит',
      tagline: 'кукольный спектакль',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'mint',
      art: 'a2',
      mascot: 'assets/mascot/aybolit.webp',
      ticketUrl: '',
      published: true,
      short: 'Кукольный спектакль для всей семьи — один из постоянных в субботней афише театра.',
      description: [
        'Кукольный спектакль для семейного просмотра, один из постоянных в субботней афише театра.',
        'Идёт 35–40 минут в Малом зале ДК им. Л. Плешкова, без микрофона и с живой музыкой.'
      ],
      photos: ['assets/photo/doctors.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/audience.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'zhuk-nosorog',
      title: 'Солдатская сказка, или Приключения жука-носорога',
      tagline: 'по К. Паустовскому',
      age: '6+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'Школы и детские сады, ДК им. Л. Плешкова',
      tone: 'orange',
      art: 'a3',
      mascot: 'assets/mascot/zhuk-nosorog.webp',
      ticketUrl: '',
      published: true,
      short: 'Мальчик подарил отцу, уходящему на фронт, живого жука. Жук прошёл всю войну рядом с солдатом.',
      description: [
        'Спектакль по рассказу Константина Паустовского о путешествии жука-носорога. Маленький мальчик подарил отцу, который уходил на фронт, живого жука.',
        'Всю войну солдат носил подарок сына в солдатской сумке. Не потерял. Сберёг. Жук прошёл войну наравне с солдатом и однажды даже спас ему жизнь.',
        'Играем ко Дню Защитника Отечества и ко Дню Победы — в зале и в школах города. После спектакля дети рисуют к нему рисунки и присылают их в городской ДК.'
      ],
      photos: ['assets/photo/soldiers.jpg', 'assets/photo/hall-kindergarten.jpg', 'assets/photo/scene-shirma.jpg', 'assets/photo/kids-costumes.jpg']
    },
    {
      id: 'zhuravlinye-perya',
      title: 'Журавлиные перья',
      tagline: 'японская сказка',
      age: '6+',
      duration: 55,
      price: 1000,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'violet',
      art: 'a4',
      mascot: '',
      ticketUrl: '',
      published: true,
      short: 'История о выборе и о том, как легко разрушить то, что кажется самым важным. Вечерний спектакль.',
      description: [
        'Спектакль по японской сказке — история о выборе, вечных ценностях и о том, как легко разрушить то, что кажется самым важным. Трогательная и глубокая сказка поднимает темы, которые остаются актуальными независимо от времени и возраста.',
        'В постановке заняты пять актёров. Зрителей ждёт сочетание живой музыки, кукол и актёрской игры, вдохновлённое традициями японского театра.',
        'Идёт 55 минут, играем вечером. Возрастное ограничение 6+, но на прошлых показах были дети и младше — тоже смотрели.'
      ],
      photos: ['assets/photo/scene-shirma.jpg', 'assets/photo/seagulls.jpg', 'assets/photo/forest.jpg', 'assets/photo/audience.jpg']
    },
    {
      id: 'solnyshko',
      title: 'Солнышко и снежные человечки',
      tagline: 'новогодний спектакль',
      age: '1+',
      duration: 35,
      price: 600,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'sky',
      art: 'a6',
      mascot: 'assets/mascot/solnyshko.webp',
      ticketUrl: '',
      published: true,
      short: 'Снежная история о любви к ближнему и о том, как снеговички искали солнышко. Тихий спектакль про снег.',
      description: [
        'Снежная история о любви к ближнему и о том, как снеговички искали солнышко. Тихий спектакль про снег.',
        'Играем в новогодние праздники: перед началом вместо обычной творческой пятиминутки проходят новогодние танцы и игры с Дедом Морозом, а после спектакля можно поиграть с куклами и сфотографироваться с персонажами — бесплатно.'
      ],
      photos: ['assets/photo/forest.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/kids-whale.jpg', 'assets/photo/audience.jpg']
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
