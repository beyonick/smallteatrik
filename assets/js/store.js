/* ───────────────────────────────────────────────
   Маленький театрик кукол — хранилище спектаклей
   Прототип: данные лежат в localStorage браузера.
   Админка пишет, главная и страница спектакля читают.
   При подключении бэкенда меняются только load/save.
   ─────────────────────────────────────────────── */
(function (global) {
  'use strict';

  var KEY = 'smallteatrik:shows:v3';
  var TICKET_URL = 'https://gelendzhik.kassy.ru/events/detskie/';

  var DEFAULTS = [
    {
      id: 'cvetik-semicvetik',
      title: 'Цветик-семицветик',
      tagline: 'по В. Катаеву',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'pink',
      art: 'a1',
      mascot: 'assets/mascot/cvetik-semicvetik.webp',
      ticketUrl: '',
      published: true,
      short: 'По сказке Валентина Катаева: о волшебном цветке, семи желаниях и о том, как важно заботиться о других.',
      description: [
        'Спектакль по сказке Валентина Катаева. Девочка Женя живёт в Москве прошлого века. Однажды странная бабушка дарит ей волшебный цветок: семь лепестков — семь желаний.',
        'Желания тратятся быстро, а настоящую радость Женя находит, когда помогает мальчику Вите. История о том, как важно заботиться о других, и о том, что возможности, слова и время не возвращаются.'
      ],
      photos: ['assets/photo/scene-shirma.jpg', 'assets/photo/kids-whale.jpg', 'assets/photo/audience.jpg', 'assets/photo/forest.jpg']
    },
    {
      id: 'lyagushka',
      title: 'Лягушка-путешественница',
      tagline: 'по В. Гаршину',
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
      short: 'По сказке В. Гаршина: о храброй лягушке-фантазёрке, путешествии на юг и любви к родному болоту.',
      description: [
        'По мотивам сказки Всеволода Гаршина. Лягушка была не хвастушкой, а фантазёркой и любительницей приключений — и вместе с добрыми утками отправилась на юг. Мечта сбылась, но никакие южные красоты не затмили любви к родному болоту.',
        'Спектакль о возвращении домой со счастливым финалом. Один из самых любимых у детей и хорош для первого знакомства с театром: никаких громких звуков, только классическая музыка, шумы и голоса природы.'
      ],
      photos: ['assets/photo/frogs.jpg', 'assets/photo/seagulls.jpg', 'assets/photo/forest.jpg', 'assets/photo/kids-whale.jpg']
    },
    {
      id: 'gusi-lebedi',
      title: 'Гуси-лебеди',
      tagline: 'русская сказка',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'mint',
      art: 'a2',
      mascot: 'assets/mascot/gusi-lebedi.webp',
      ticketUrl: '',
      published: true,
      short: 'Русская сказка о том, как капризная девочка стала заботливой. С играми и общим хороводом в финале.',
      description: [
        'Русская сказка о том, как капризная и вздорная девочка стала заботливой и послушной, а силы природы помогли ей в этом. О взаимоотношениях, помощи и благодарности — о том, что одинаково интересно и детям, и взрослым.',
        'Весёлый интерактивный спектакль с хорошим финалом и общим хороводом. Его уже полюбили зрители от года до ста лет. Сказка — ложь, да в ней намёк, а кто слушал — молодец!'
      ],
      photos: ['assets/photo/gusi-scene.jpg', 'assets/photo/gusi-actors.jpg', 'assets/photo/gusi-geese.jpg', 'assets/photo/gusi-khorovod.jpg']
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
      short: 'По рассказам Мамина-Сибиряка: маленькая козявочка открывает мир. Музыкальный интерактив о живой природе.',
      description: [
        'Кукольный спектакль по рассказам Дмитрия Мамина-Сибиряка о том, как родилась маленькая козявочка и как она познаёт мир. На пути ей встречаются цветочек, шмель, червяк, рыбы и лягушка — и каждая встреча чему-то учит.',
        'Козявочка набирается опыта, учится новому и находит друзей. Музыкальный интерактивный спектакль о живой природе для самых маленьких — и для взрослых, которые пришли вместе с ними.'
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
      short: 'По сказке Джулии Дональдсон: маленькая улитка мечтала о кругосветном путешествии — и спасла кита.',
      description: [
        'Спектакль по мотивам сказки Джулии Дональдсон о маленькой улитке, которая мечтала объехать весь свет. О том, что возможности безграничны, если верить в себя, о настоящей дружбе улитки и кита, о силе духа и упорстве в достижении цели.',
        'Интерактивный музыкальный спектакль для детей с двух лет: в финале весь зал вместе спасает кита.'
      ],
      photos: ['assets/photo/kids-whale.jpg', 'assets/photo/seagulls.jpg', 'assets/photo/audience.jpg', 'assets/photo/frogs.jpg']
    },
    {
      id: 'krasnaya-shapochka',
      title: 'Красная шапочка',
      tagline: 'по Ш. Перро',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'pink',
      art: 'a1',
      mascot: 'assets/mascot/krasnaya-shapochka.webp',
      ticketUrl: '',
      published: true,
      short: 'Сказка Шарля Перро на традиционной ширме: о любви к маме, взрослении и о том, что добро всегда побеждает.',
      description: [
        'Кукольный спектакль на традиционной ширме: актёров не видно, на сцене работают только куклы. Поставлен по мотивам сказки Шарля Перро.',
        'О любви к маме и о взрослении. О том, что если мама сказала не разговаривать с незнакомцами, то и не надо, — а волк всегда остаётся волком. О добром лесорубе, понимающей бабушке, тихом семейном счастье и о том, что добро всегда побеждает.'
      ],
      photos: ['assets/photo/russian-tale.jpg', 'assets/photo/kids-costumes.jpg', 'assets/photo/audience.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'fedorino-gore',
      title: 'Федорино горе',
      tagline: 'по К. Чуковскому',
      age: '4+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'orange',
      art: 'a3',
      mascot: 'assets/mascot/fedorino-gore.webp',
      ticketUrl: '',
      published: true,
      short: '«Театр в театре» по Чуковскому: актриса так увлеклась сценой, что забыла про котов и обиженную посуду.',
      description: [
        'Спектакль «театр в театре» по мотивам сказки Корнея Чуковского. О том, что каждая женщина — актриса, и о том, как, увлёкшись театром, легко забыть про хозяйство, Федориных котов и обиженную посуду.',
        'Лесные жители — любители чистоты — весело учат зрителей наводить порядок, а заодно приоткрывают театральную кухню: неписаные законы сцены и службы, которые незримо участвуют в спектакле. Музыкальная история со счастливым финалом для детей с 4 лет и взрослых.'
      ],
      photos: ['assets/photo/russian-tale.jpg', 'assets/photo/audience.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'skazka-o-glupom-myshonke',
      title: 'Сказка о глупом мышонке',
      tagline: 'по С. Маршаку',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'violet',
      art: 'a4',
      mascot: 'assets/mascot/skazka-o-glupom-myshonke.webp',
      ticketUrl: '',
      published: true,
      short: 'Музыкальная колыбельная по Маршаку: о слепой маминой любви, взаимовыручке и о том, что кошка — всегда кошка.',
      description: [
        'Весёлый музыкальный спектакль-колыбельная по мотивам произведений Самуила Маршака. Зал участвует в истории вместе с героями.',
        'О слепой любви мамы к ребёнку, о взаимовыручке родителей и о том, что кошка всегда останется кошкой — сколько бы она ни пела колыбельных.'
      ],
      photos: ['assets/photo/scene-shirma.jpg', 'assets/photo/frogs.jpg', 'assets/photo/audience.jpg', 'assets/photo/forest.jpg']
    },
    {
      id: 'kolobok',
      title: 'Колобок',
      tagline: 'скоморошина',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'yellow',
      art: 'a5',
      mascot: 'assets/mascot/kolobok.webp',
      ticketUrl: '',
      published: true,
      short: 'Спектакль-скоморошина: как пшеница родится, как хлеб пекут и куда укатился колобок.',
      description: [
        'Спектакль-скоморошина о деде и бабке, народных традициях и умении вести хозяйство. Настоящий замес: зрители узнают, как родится пшеница, как получают муку, ставят тесто и пекут хлеб, — а потом отправляются с колобком в путешествие со счастливым финалом.',
        'Яркие скоморохи, простые персонажи, народная музыка. Куклы и реквизит сваляны из натуральной шерсти. Для малышей с года и взрослых.'
      ],
      photos: ['assets/photo/kids-costumes.jpg', 'assets/photo/russian-tale.jpg', 'assets/photo/audience.jpg', 'assets/photo/kids-giraffe.jpg']
    },
    {
      id: 'aybolit',
      title: 'Айболит',
      tagline: 'по К. Чуковскому',
      age: '4+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'mint',
      art: 'a2',
      mascot: 'assets/mascot/aybolit.webp',
      ticketUrl: '',
      published: true,
      short: 'По Чуковскому: как злой разбойник Бармалей стал добрым доктором. Песни, танцы и много юмора.',
      description: [
        'Весёлый интерактивный музыкальный спектакль по мотивам сказки Корнея Чуковского — о том, как злой разбойник Бармалей стал добрым доктором.',
        'В спектакле много песен, танцев, забавных сцен и юмора. Взрослые вспоминают своё детство, прививки и походы к доктору, дети следят за сюжетом — и счастливы все. Для детей с 4 лет и семейного просмотра.'
      ],
      photos: ['assets/photo/doctors.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/audience.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'zhuk-nosorog',
      title: 'Солдатская сказка, или Приключения жука-носорога',
      tagline: 'по К. Паустовскому',
      age: '2+',
      duration: 40,
      price: 800,
      date: '',
      venue: 'Школы и детские сады, ДК им. Л. Плешкова',
      tone: 'orange',
      art: 'a3',
      mascot: 'assets/mascot/zhuk-nosorog.webp',
      ticketUrl: '',
      published: true,
      short: 'По Паустовскому: мальчик подарил отцу, уходящему на фронт, живого жука. Жук прошёл с солдатом всю войну.',
      description: [
        'Спектакль по рассказу Константина Паустовского. Мальчик подружился с жуком-носорогом, а когда отец уходил на фронт, подарил ему своего единственного друга: «Ты его не теряй, сбереги!»',
        'Всю войну солдат носил жука в сумке. Жук стал ему боевым товарищем, совершил подвиг и спас отцу жизнь. А после войны отец и сын вместе выпустили его на волю — в мирное небо.',
        'Это война глазами жука. Мы рассказываем её детям с двух лет языком театра: просто, наглядно, без грохота и громких звуков. Играем ко Дню защитника Отечества и ко Дню Победы — в зале и в школах города.'
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
      mascot: 'assets/mascot/zhuravlinye-perya.webp',
      ticketUrl: '',
      published: true,
      short: 'Японская сказка о выборе и о том, как легко разрушить самое важное. Живая музыка, куклы и шесть актёров.',
      description: [
        'Спектакль по японской сказке — история о выборе, вечных ценностях и о том, как легко разрушить то, что кажется самым важным. Трогательная и глубокая сказка о том, что не зависит ни от времени, ни от возраста.',
        'В постановке заняты шесть актёров. Живая музыка, куклы и актёрская игра, вдохновлённые традициями японского театра кабуки. Для зрителей с 6 лет.'
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
      short: 'Снежная история о двух снеговичках, которые искали солнышко, и о любви к ближнему. Тихий зимний спектакль.',
      description: [
        'Снежная история о двух снеговичках, которые искали солнышко. О любви к ближнему и о том, как снеговики отдали всё, что у них было, чтобы другим было хорошо.',
        'Тихий спектакль про снежное детство: санки и валенки, маму в окне, мудрую ворону и природный круговорот.'
      ],
      photos: ['assets/photo/forest.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/kids-whale.jpg', 'assets/photo/audience.jpg']
    },
    {
      id: 'veselye-medvezhata',
      title: 'Весёлые медвежата',
      tagline: 'спектакль на ширме',
      age: '2+',
      duration: 35,
      price: 800,
      date: '2026-09-26T10:30',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'orange',
      art: 'a3',
      mascot: 'assets/mascot/kolobok-lisa.webp',
      ticketUrl: 'https://gelendzhik.kassy.ru/events/detskie/2-7678/',
      published: true,
      short: 'Медвежата Топ и Топа гостят у бабушки с дедушкой. Традиционный кукольный спектакль на ширме.',
      description: [
        'Традиционный кукольный спектакль на ширме: перчаточные и тростевые куклы, актёров не видно.',
        'Два медвежонка, Топ и Топа, гостят в деревне у бабушки с дедушкой. Дедушкины правила — зарядка, уборка, умывание и девизы, которые помогают в жизни, — бабушкина безграничная любовь и, конечно, весёлые приключения, когда медвежата остаются одни.'
      ],
      photos: ['assets/photo/kids-costumes.jpg', 'assets/photo/audience.jpg', 'assets/photo/kids-giraffe.jpg', 'assets/photo/scene-shirma.jpg']
    },
    {
      id: 'alenka-i-gusenok',
      title: 'Алёнка и гусёнок',
      tagline: 'интерактивная сказка',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'yellow',
      art: 'a4',
      mascot: '',
      ticketUrl: '',
      published: false,
      short: 'Лиса утащила гусёнка, и весь зал вместе с Алёнкой и ёжиком отправляется его спасать.',
      description: [
        'Интерактивная история о том, как девочка Алёнка пасла гусёнка, как его утащила лиса и как зрители вместе с Алёнкой и ёжиком спасали малыша.',
        'Сказка со счастливым финалом о дружбе и об ответственности за того, кого приручил.'
      ],
      photos: []
    },
    {
      id: 'nosorog-i-zhirafa',
      title: 'Носорог и жирафа',
      tagline: 'о дружбе',
      age: '1+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'mint',
      art: 'a5',
      mascot: '',
      ticketUrl: '',
      published: false,
      short: 'История о дружбе носорога и жирафы и о том, что каждому лучше оставаться самим собой.',
      description: [
        'История о дружбе носорога и жирафы. Обезьяна хотела их поссорить, но у неё ничего не вышло.',
        'Спектакль о том, что каждый должен оставаться самим собой — в этом его прелесть. В финале всё встаёт на свои места, а друзья остаются друзьями.'
      ],
      photos: []
    },
    {
      id: 'ishchu-mamu',
      title: 'Ищу маму',
      tagline: 'по Джулии Дональдсон',
      age: '2+',
      duration: 35,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'pink',
      art: 'a1',
      mascot: '',
      ticketUrl: '',
      published: false,
      short: 'Спектакль-игра: маленькая обезьянка потерялась в джунглях, и зрители помогают ей найти маму.',
      description: [
        'Интерактивный спектакль по мотивам сказки Джулии Дональдсон. Актёры играют в живом плане, куклы большие. Маленькая обезьянка заигралась в джунглях и потерялась.',
        'Мотылёк и зрители помогают ей найти маму: сравнивают со слоном, змеёй, летучей мышью, попугаем, лягушкой — но всё не та! В финале мотылёк понимает: это у насекомых дети не похожи на родителей, а мама обезьянки тоже обезьянка. Встреча с мамой и папой завершает историю.'
      ],
      photos: []
    },
    {
      id: 'ty-kto-ya-znayu-tebya',
      title: 'Ты кто? Я знаю тебя',
      tagline: 'по А. Платонову',
      age: '6+',
      duration: 55,
      price: 800,
      date: '',
      venue: 'ДК им. Л. Плешкова, Малый зал',
      tone: 'violet',
      art: 'a3',
      mascot: '',
      ticketUrl: '',
      published: false,
      short: 'Спектакль-притча по рассказам Андрея Платонова о детях военного времени, которым пришлось рано повзрослеть.',
      description: [
        'Спектакль-притча по рассказам Андрея Платонова «Железная старуха», «Цветок на песке», «Возвращение», «Сухой хлеб», «Никита» и его дневникам. Пятилетний Никита живёт в деревне во время войны: мама целыми днями в поле, папа на фронте. Обо всём на свете ему рассказывает 87-летний дедушка.',
        'Неспешная история о вечном: о любви и смерти, о подвиге и бессмертии. Возвращение отца с фронта — продолжение жизни семьи, страны и всего живого. Играем на столе, заняты пять актёров, куклы деревянные.'
      ],
      photos: []
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
