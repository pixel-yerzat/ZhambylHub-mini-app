/**
 * Zhambyl Hub Data Store — Events, Startups, Presentations, Rewards & Quests
 */

export const INITIAL_EVENTS = [
  {
    id: 'ev-1',
    title: 'Zhambyl AI & GovTech Hackathon 2026',
    titleKz: 'Zhambyl AI & GovTech Hackathon 2026',
    category: 'hackathon',
    categoryName: 'Хакатон',
    categoryNameKz: 'Хакатон',
    hasProjects: true, // Event WITH projects
    status: 'open', // 'open' | 'live' | 'finished'
    date: '12-14 Апреля 2026',
    time: '10:00 — 18:00',
    location: 'Zhambyl Hub (Тараз, Төле би 45) + Онлайн',
    locationShort: 'Тараз / Hub Coworking',
    rewardPoints: 300,
    spotsTotal: 120,
    spotsLeft: 28,
    bannerGradient: 'linear-gradient(135deg, rgba(102, 58, 243, 0.4) 0%, rgba(2, 125, 234, 0.2) 100%)',
    prizePool: '1 500 000 ₸',
    shortDesc: 'Крупнейший региональный хакатон по внедрению искусственного интеллекта и цифровизации сервисов Жамбылской области.',
    shortDescKz: 'Жамбыл облысының сервистерін цифрландыру және жасанды интеллектті енгізу бойынша ең ірі өңірлік хакатон.',
    description: `Хакатон направлен на разработку инновационных решений для региона в сферах Smart City, электронного акимата, цифрового агросектора и образования.
    
Участники могут выступить со своими готовыми концептами или разработать MVP за 48 часов хакатона при поддержке менторов из Astana Hub и ведущих IT-компаний Казахстана.`,
    speakers: [
      { name: 'Алибек Нурланов', role: 'Chief Architect @ Digital Zhambyl', avatar: '👨‍💻' },
      { name: 'Динара Сейфуллина', role: 'Head of AI Incubation, Astana Hub', avatar: '👩‍💼' }
    ],
    agenda: [
      { time: 'День 1, 10:00', title: 'Церемония открытия и формирование команд' },
      { time: 'День 2, 14:00', title: 'Менторская сессия и чек-поинт проектов' },
      { time: 'День 3, 15:00', title: 'Финальный Demo Day и защита презентаций' }
    ],
    participatingProjects: ['proj-1', 'proj-2', 'proj-4']
  },
  {
    id: 'ev-2',
    title: 'Taraz Demo Day & Pitch Battle Vol. 4',
    titleKz: 'Taraz Demo Day & Pitch Battle Vol. 4',
    category: 'pitch_day',
    categoryName: 'Питч-сессия',
    categoryNameKz: 'Питч-сессия',
    hasProjects: true, // Event WITH projects
    status: 'open',
    date: '24 Апреля 2026',
    time: '16:00 — 19:30',
    location: 'Zhambyl Hub Event Hall (Тараз)',
    locationShort: 'Event Hall',
    rewardPoints: 200,
    spotsTotal: 80,
    spotsLeft: 14,
    bannerGradient: 'linear-gradient(135deg, rgba(38, 150, 132, 0.4) 0%, rgba(102, 58, 243, 0.25) 100%)',
    prizePool: 'Гранты & Инвестиции до $20,000',
    shortDesc: 'Битва стартапов региона перед венчурными инвесторами и бизнес-ангелами Центральной Азии.',
    shortDescKz: 'Орталық Азияның венчурлық инвесторлары мен бизнес-періштелері алдындағы өңір стартаптарының сайысы.',
    description: `Открытая питч-сессия выпускников инкубационных программ Zhambyl Hub. Стартапы представят свои интерактивные презентации, traction и финансовые показатели. Зрители смогут оценивать питчи через мини-апп и влиять на приз зрительских симпатий!`,
    speakers: [
      { name: 'Ернар Тажибаев', role: 'Managing Partner @ SilkRoad Angels', avatar: '💼' },
      { name: 'Мадина Омарова', role: 'Venture Scout @ Quest Ventures', avatar: '🌟' }
    ],
    agenda: [
      { time: '16:00', title: 'Сбор гостей, Welcome Coffee & VR Zone' },
      { time: '16:30', title: 'Питчи 8 лучших проектов (по 4 минуты + Q&A)' },
      { time: '18:45', title: 'Голосование жюри и зрителей, нетворкинг' }
    ],
    participatingProjects: ['proj-1', 'proj-2', 'proj-3', 'proj-5']
  },
  {
    id: 'ev-3',
    title: 'Workshop: Разработка Telegram Mini Apps и AI-ботов',
    titleKz: 'Workshop: Telegram Mini Apps және AI-боттарды әзірлеу',
    category: 'workshop',
    categoryName: 'Воркшоп / Без проектов',
    categoryNameKz: 'Воркшоп / Жобасыз',
    hasProjects: false, // Event WITHOUT projects (pure learning / meetup)
    status: 'open',
    date: '18 Апреля 2026',
    time: '18:30 — 20:30',
    location: 'Zhambyl Hub Academy Lab (Офлайн + Zoom трансляция)',
    locationShort: 'Academy Lab / Online',
    rewardPoints: 100,
    spotsTotal: 60,
    spotsLeft: 9,
    bannerGradient: 'linear-gradient(135deg, rgba(2, 125, 234, 0.4) 0%, rgba(228, 109, 76, 0.2) 100%)',
    prizePool: 'Сертификат + Доступ к API',
    shortDesc: 'Практический мастер-класс по созданию интерактивных мини-приложений в Telegram с интеграцией LLM моделей.',
    shortDescKz: 'LLM модельдерін біріктіру арқылы Telegram-да интерактивті шағын қолданбаларды жасау бойынша практикалық воркшоп.',
    description: `Воркшоп ориентирован на разработчиков, дизайнеров и продакт-менеджеров. Разберем архитектуру Telegram WebApp, стилизацию в стиле AuthKit, работу с Haptic Feedback и деплой в облачную инфраструктуру.
    
Регистрация открыта для всех желающих — проект для участия не требуется!`,
    speakers: [
      { name: 'Бауыржан Касымов', role: 'Senior Fullstack Eng @ InDriver Labs', avatar: '💻' }
    ],
    agenda: [
      { time: '18:30', title: 'Введение в архитектуру Telegram Mini Apps (TMA)' },
      { time: '19:15', title: 'Live Coding: подключение SDK и WebApp API' },
      { time: '20:00', title: 'Сессия вопросов и ответов + разбор кода' }
    ],
    participatingProjects: []
  },
  {
    id: 'ev-4',
    title: 'IT-Meetup & Founders Networking Pizza Night',
    titleKz: 'IT-Meetup & Несие/Инноваторлар кездесуі',
    category: 'meetup',
    categoryName: 'Митап / Нетворкинг',
    categoryNameKz: 'Митап / Нетворкинг',
    hasProjects: false, // Event WITHOUT projects
    status: 'open',
    date: '28 Апреля 2026',
    time: '19:00 — 21:30',
    location: 'Zhambyl Hub Terrace Lounge (Тараз)',
    locationShort: 'Terrace Lounge',
    rewardPoints: 80,
    spotsTotal: 50,
    spotsLeft: 12,
    bannerGradient: 'linear-gradient(135deg, rgba(228, 109, 76, 0.35) 0%, rgba(102, 58, 243, 0.25) 100%)',
    prizePool: 'Свободный нетворкинг',
    shortDesc: 'Неформальная встреча фаундеров, разработчиков и энтузиастов Жамбылского IT-сообщества.',
    shortDescKz: 'Жамбыл IT-қоғамдастығының фаундерлері, әзірлеушілері мен энтузиастарының бейресми кездесуі.',
    description: `Уютный вечер на террасе Zhambyl Hub: обсуждаем тренды стартапов, обмениваемся опытом, находим кофаундеров в команды и просто наслаждаемся пиццей и общением.`,
    speakers: [
      { name: 'Ерзат Қанатбек', role: 'Community Lead @ Zhambyl Hub', avatar: '🎙️' }
    ],
    agenda: [
      { time: '19:00', title: 'Welcome Drinks & Ice-breaking' },
      { time: '19:30', title: 'Lightning Talks (3 спикера по 7 минут)' },
      { time: '20:15', title: 'Свободный нетворкинг и пицца' }
    ],
    participatingProjects: []
  }
];

export const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'AulieAta Smart Agro',
    category: 'AgroTech & AI',
    tag: 'AgroTech',
    stage: 'MVP / Pilot',
    rating: 4.9,
    reviewsCount: 38,
    founder: 'Асет Сапарбаев & Team',
    founderRole: 'CEO & IoT Engineer',
    logoIcon: '🌾',
    shortDesc: 'IoT-мониторинг почвы и AI-прогнозирование урожайности для фермеров Жамбылской области.',
    shortDescKz: 'Жамбыл облысының фермерлері үшін топырақты IoT-бақылау және өнімділікті AI-болжау жүйесі.',
    metrics: [
      { label: 'Пилотных ферм', value: '14 хозяйств' },
      { label: 'Экономия воды', value: 'до 32%' },
      { label: 'Точность AI', value: '94.2%' }
    ],
    presentation: {
      title: 'AulieAta Smart Agro Pitch Deck',
      slidesCount: 6,
      slides: [
        {
          slideNumber: 1,
          title: 'AulieAta Smart Agro: Будущее сельского хозяйства',
          subtitle: 'Интеллектуальная система точного земледелия для юга Казахстана',
          type: 'cover',
          highlights: ['Автономные IoT-сенсоры', 'AI-алгоритмы анализа влажности', 'Экономия ресурсов до 35%'],
          badge: 'Cover Slide',
          content: 'Мы объединяем доступные датчики влажности и минерализации почвы с передовой нейросетью прогноза полива и болезней растений.'
        },
        {
          slideNumber: 2,
          title: 'Проблема: Дефицит воды и ручное управление',
          subtitle: '70% фермеров Жамбылской области теряют урожай из-за неоптимального полива',
          type: 'problem',
          highlights: [
            'Критический дефицит поливной воды в регионе',
            'Отсутствие данных в реальном времени с полей',
            'Высокая стоимость импортных европейских агро-станций'
          ],
          badge: 'The Problem',
          content: 'Потери агросектора региона составляют более 2.4 млрд тенге ежегодно из-за запоздалого выявления засоления и засухи.'
        },
        {
          slideNumber: 3,
          title: 'Решение: Сенсоры + Telegram Mini App для фермера',
          subtitle: 'Простой интерфейс, работающий даже при слабом 2G/3G покрытии',
          type: 'solution',
          highlights: [
            'Беспроводные датчики с автономностью до 2 лет',
            'Telegram-бот с ежедневными рекомендациями на казахском и русском',
            'Автоматическое включение систем капельного орошения'
          ],
          badge: 'Our Solution',
          content: 'Фермер видит состояние каждого гектара прямо в своем смартфоне и получает пуш-уведомления: «Участок №4: полив через 2 часа, 15 литров на сотку».'
        },
        {
          slideNumber: 4,
          title: 'Рынок и Бизнес-модель',
          subtitle: 'TAM: $42M (Казахстан и ЦА) | SAM: $8.5M (Южные регионы РК)',
          type: 'market',
          highlights: [
            'Hardware-as-a-Service: аренда сенсоров (25,000 ₸/мес на 50 га)',
            'SaaS подписка на AI-аналитику урожайности',
            'Партнерство с местными агро-кредитными кооперативами'
          ],
          badge: 'Business Model',
          content: 'План на 2026-2027 год: подключение 120 крупных фермерских хозяйств в Жамбылской, Туркестанской и Алматинской областях.'
        },
        {
          slideNumber: 5,
          title: 'Тракшн и Результаты пилота',
          subtitle: 'Успешные полевые испытания в Байзакском и Жамбылском районах',
          type: 'traction',
          highlights: [
            '14 подключенных хозяйств в регионе',
            'Сэкономлено 180,000 кубометров поливной воды',
            'Рост урожайности томатов и лука на 18%'
          ],
          badge: 'Traction',
          content: 'Проект получил 1-е место на региональном конкурсе инноваций Zhambyl Hub и грант на прототипирование.'
        },
        {
          slideNumber: 6,
          title: 'Команда и The Ask',
          subtitle: 'Привлекаем $40,000 на масштабирование производства сенсоров',
          type: 'team_ask',
          highlights: [
            'Асет Сапарбаев (CEO, 6 лет в IoT разработке)',
            'Ердос Муканов (Lead AI/Data Scientist)',
            'Использование средств: 50% производство, 30% маркетинг, 20% R&D'
          ],
          badge: 'The Ask',
          content: 'Контакты: @aset_agro | Zhambyl Hub Resident | +7 (705) 555-01-44'
        }
      ]
    }
  },
  {
    id: 'proj-2',
    name: 'Taraz CityPass & AR Heritage',
    category: 'GovTech & Tourism',
    tag: 'GovTech / AR',
    stage: 'Beta / Launch',
    rating: 4.8,
    reviewsCount: 45,
    founder: 'Камила Берикова',
    founderRole: 'Product & AR Developer',
    logoIcon: '🏛️',
    shortDesc: 'Единый цифровой туристический пасс и AR-гид по древним памятникам Тараза (Карахан, Айша-Биби).',
    shortDescKz: 'Тараздың ежелгі ескерткіштеріне арналған бірыңғай цифрлық туристік пасс және AR-гид.',
    metrics: [
      { label: 'Пользователей', value: '4,200+' },
      { label: 'AR локаций', value: '18 точек' },
      { label: 'Партнеров', value: '24 музея/кафе' }
    ],
    presentation: {
      title: 'Taraz CityPass AR Pitch Deck',
      slidesCount: 5,
      slides: [
        {
          slideNumber: 1,
          title: 'Taraz CityPass: Древний Тараз в дополненной реальности',
          subtitle: 'Туристический супер-апп и оживающая история Великого Шелкового Пути',
          type: 'cover',
          highlights: ['AR реконструкция мавзолеев', 'Единый QR билет во все музеи', 'Квесты с баллами'],
          badge: 'Cover',
          content: 'Превращаем 2000-летнюю историю Тараза в захватывающий интерактивный опыт для туристов и школьников.'
        },
        {
          slideNumber: 2,
          title: 'Проблема: Разрозненный туризм и слабый маркетинг',
          subtitle: 'Туристы не знают, куда пойти, и тратят время на кассы',
          type: 'problem',
          highlights: [
            'Нет единой цифровой платформы для туристов в Таразе',
            'Молодежи скучно слушать классические экскурсии',
            'Музеи не имеют инструментов для сбора аналитики гостей'
          ],
          badge: 'Problem',
          content: 'Город с богатейшей историей недополучает до 60% потенциальной выручки от сувениров, экскурсий и HoReCa.'
        },
        {
          slideNumber: 3,
          title: 'AR-Реконструкции в браузере и Telegram',
          subtitle: 'Наведи камеру смартфона — и увидишь Караханидскую крепость XII века',
          type: 'solution',
          highlights: [
            'Работает без скачивания тяжелых 3D приложений (WebXR/TMA)',
            'Аудиогид на 4 языках (KZ, RU, EN, CH)',
            'Скидки и кэшбэк в ресторанах национальной кухни Тараза'
          ],
          badge: 'Solution',
          content: 'Пользователи проходят исторические квесты по Таразу, зарабатывают бейджи и скидочные купоны.'
        },
        {
          slideNumber: 4,
          title: 'Тяга и Партнерства',
          subtitle: 'Поддержка Управления туризма Жамбылской области и Zhambyl Hub',
          type: 'traction',
          highlights: [
            '4,200 активных пользователей за 3 месяца',
            'Оцифровано 18 ключевых исторических локаций',
            'Выручка от комиссий с билетов и CityPass: 3.8M ₸'
          ],
          badge: 'Traction',
          content: 'Готовим масштабирование на Туркестан и Сайрам.'
        },
        {
          slideNumber: 5,
          title: 'The Ask: $25,000 на 3D моделирование и маркетинг',
          subtitle: 'Инвестиции в туристический суперапп Шелкового Пути',
          type: 'team_ask',
          highlights: ['Команда из 5 человек (3D, Mobile, Sales)', 'Срок окупаемости: 14 месяцев'],
          badge: 'The Ask',
          content: 'Контакты: @kamila_ar | resident@zhambylhub.kz'
        }
      ]
    }
  },
  {
    id: 'proj-3',
    name: 'MedQ Zhambyl — Smart Clinic Queue',
    category: 'MedTech & AI',
    tag: 'MedTech',
    stage: 'MVP',
    rating: 4.7,
    reviewsCount: 22,
    founder: 'Дамир Оспанов',
    founderRole: 'Founder & Fullstack Developer',
    logoIcon: '🩺',
    shortDesc: 'Умная электронная очередь и AI-триаж пациентов для региональных поликлиник Тараза.',
    shortDescKz: 'Тараз қаласының емханаларына арналған ақылды электронды кезек және AI-триаж жүйесі.',
    metrics: [
      { label: 'Поликлиник', value: '3 клиники' },
      { label: 'Сокращение ожидания', value: '-45%' },
      { label: 'Обработано талонов', value: '18,500+' }
    ],
    presentation: {
      title: 'MedQ Smart Queue Pitch Deck',
      slidesCount: 4,
      slides: [
        {
          slideNumber: 1,
          title: 'MedQ: Цифровизация очередей в поликлиниках',
          subtitle: 'AI-прогнозирование времени приема и Telegram-запись без очередей',
          type: 'cover',
          highlights: ['Интеграция с DamuMed', 'Telegram уведомления о времени приема', 'AI-триаж симптомов'],
          badge: 'Cover',
          content: 'Устраняем живые очереди и стресс в поликлиниках за счет предиктивного распределения пациентов.'
        },
        {
          slideNumber: 2,
          title: 'Проблема: Часы ожидания в коридорах поликлиник',
          subtitle: 'Пациенты тратят в среднем 1.5–2 часа под кабинетом врача',
          type: 'problem',
          highlights: [
            'Сбои живой очереди и конфликты',
            'Опоздания врачей сбивают все расписание',
            'Высокая нагрузка на персонал регистратуры'
          ],
          badge: 'Problem',
          content: 'MedQ динамически пересчитывает время вызова и присылает пуш: «Ваш прием через 15 минут, можете подходить».'
        },
        {
          slideNumber: 3,
          title: 'Результаты внедрения в Поликлинике №2 г. Тараз',
          subtitle: 'Время ожидания сократилось с 85 до 24 минут',
          type: 'traction',
          highlights: ['92% положительных отзывов пациентов', 'Интеграция заняла всего 3 дня'],
          badge: 'Results',
          content: 'Проект готов к подключению всех районных больниц Жамбылской области.'
        },
        {
          slideNumber: 4,
          title: 'Команда и планы расширения',
          subtitle: 'Поиск грантового финансирования 5,000,000 ₸',
          type: 'team_ask',
          highlights: ['Основатели: Дамир Оспанов, Султан Каримов (врач-терапевт)'],
          badge: 'The Ask',
          content: 'Связь: @damir_medq | Zhambyl Hub Incubation'
        }
      ]
    }
  },
  {
    id: 'proj-4',
    name: 'Jasa AI — Kazakh Voice & LLM Assistant',
    category: 'AI & NLP',
    tag: 'AI / NLP',
    stage: 'Early Stage',
    rating: 4.9,
    reviewsCount: 19,
    founder: 'Санжар Жолдасбек',
    founderRole: 'AI Research Engineer',
    logoIcon: '🤖',
    shortDesc: 'Нейросетевая модель распознавания и генерации казахской речи с диалектами южного региона.',
    shortDescKz: 'Оңтүстік өңір диалектілеріне бейімделген қазақ тіліндегі сөйлеуді тану және генерациялау AI моделі.',
    metrics: [
      { label: 'Точность WER', value: '7.8%' },
      { label: 'Часов датасета', value: '1,200+ сағат' },
      { label: 'API запросов', value: '50k+/ай' }
    ],
    presentation: {
      title: 'Jasa AI Speech Technologies',
      slidesCount: 4,
      slides: [
        {
          slideNumber: 1,
          title: 'Jasa AI: Голосовой интеллект на государственном языке',
          subtitle: 'Быстрый и точный Speech-to-Text & Text-to-Speech для бизнеса и госорганов',
          type: 'cover',
          highlights: ['Обучение на южно-казахстанском датасете', 'Генерация естественного голоса', 'On-premise и Cloud API'],
          badge: 'Cover',
          content: 'Мы делаем технологии искусственного интеллекта по-настоящему доступными для казахскоязычной аудитории.'
        },
        {
          slideNumber: 2,
          title: 'Технологическое преимущество',
          subtitle: 'Распознавание смешанной казахско-русской речи (Code-Switching)',
          type: 'solution',
          highlights: ['Высокая скорость транскрипции (х0.1 realtime)', 'Автоматическая расстановка знаков препинания'],
          badge: 'Tech',
          content: 'Идеально подходит для контакт-центров, стенографирования заседаний акимата и голосовых ассистентов.'
        },
        {
          slideNumber: 3,
          title: 'Кейсы применения в Таразе',
          subtitle: 'Транскрибация обращений граждан в Единый контакт-центр 109',
          type: 'traction',
          highlights: ['Автоматизация 40% типовых звонков', 'Ускорение обработки заявок в 3 раза'],
          badge: 'Cases',
          content: 'Готовится интеграция с городскими диспетчерскими службами.'
        },
        {
          slideNumber: 4,
          title: 'Планы и Сотрудничество',
          subtitle: 'Открыты к пилотам с финтех и телеком компаниями',
          type: 'team_ask',
          highlights: ['Контакты: @sanzhar_jasa | Taraz AI Lab'],
          badge: 'Contacts',
          content: 'Zhambyl Hub Community'
        }
      ]
    }
  }
];

export const INITIAL_REWARDS = [
  {
    id: 'rew-1',
    title: 'Худи Zhambyl Hub "Midnight Edition"',
    titleKz: 'Zhambyl Hub ресми худиі',
    category: 'merch',
    price: 1200,
    icon: '👕',
    inStock: 15,
    tag: 'Official Merch',
    description: 'Фирменное оверсайз-худи премиум качества с вышивкой логотипа Zhambyl Hub и светоотражающими элементами.'
  },
  {
    id: 'rew-2',
    title: 'Умный Термос Zhambyl Hub с LED-экраном',
    titleKz: 'LED-экранды Smart термос',
    category: 'merch',
    price: 650,
    icon: '☕',
    inStock: 24,
    tag: 'Popular',
    description: 'Матовый термос из нержавеющей стали с сенсорным датчиком температуры напитка.'
  },
  {
    id: 'rew-3',
    title: 'Абонемент в Коворкинг Zhambyl Hub (7 дней)',
    titleKz: 'Коворкингке 7 күндік абонемент',
    category: 'service',
    price: 400,
    icon: '💼',
    inStock: 50,
    tag: 'Productivity',
    description: 'Неделя бесплатного доступа в зону коворкинга Zhambyl Hub с высокоскоростным Wi-Fi, кофе и переговорными.'
  },
  {
    id: 'rew-4',
    title: '1-on-1 Менторская сессия с трекером Astana Hub',
    titleKz: 'Astana Hub трекерімен 1-ге-1 сессия',
    category: 'education',
    price: 850,
    icon: '🎯',
    inStock: 8,
    tag: 'Mentorship',
    description: 'Персональный часовой разбор вашего стартапа, юнит-экономики и стратегии привлечения инвестиций.'
  },
  {
    id: 'rew-5',
    title: 'Голографический Стикерпак "Taraz Dev Community"',
    titleKz: 'Голографиялық стикерлер жинағы',
    category: 'merch',
    price: 150,
    icon: '✨',
    inStock: 100,
    tag: 'Cool Merch',
    description: 'Набор из 12 водостойких стикеров для ноутбука с цитатами и символикой IT Тараза.'
  }
];

export const INITIAL_QUESTS = [
  {
    id: 'q-1',
    title: 'Ежедневный вход в мини-апп',
    titleKz: 'Күнделікті кіру бонусы',
    points: 15,
    icon: '⚡',
    action: 'daily',
    isDone: false
  },
  {
    id: 'q-2',
    title: 'Оценить 2 презентации стартапов',
    titleKz: '2 стартаптың таныстырылымын бағалау',
    points: 40,
    icon: '📊',
    action: 'review_presentation',
    isDone: false
  },
  {
    id: 'q-3',
    title: 'Зарегистрироваться на мероприятие',
    titleKz: 'Іс-шараға тіркелу',
    points: 50,
    icon: '🎟️',
    action: 'register_event',
    isDone: false
  },
  {
    id: 'q-4',
    title: 'Добавить свой проект в каталог Hub',
    titleKz: 'Hub каталогына өз жобаңды қосу',
    points: 150,
    icon: '🚀',
    action: 'add_project',
    isDone: false
  }
];

export const LEADERBOARD = [
  { rank: 1, name: 'Асет Сапарбаев', username: 'aset_agro', points: 3450, badge: '👑 Grand Innovator', avatar: '🌾' },
  { rank: 2, name: 'Камила Берикова', username: 'kamila_ar', points: 2890, badge: '⭐ Lead Founder', avatar: '🏛️' },
  { rank: 3, name: 'Дамир Оспанов', username: 'damir_medq', points: 2410, badge: '🚀 Tech Pioneer', avatar: '🩺' },
  { rank: 4, name: 'Санжар Жолдасбек', username: 'sanzhar_jasa', points: 1950, badge: '💡 AI Wizard', avatar: '🤖' },
  { rank: 5, name: 'Айгерим Муратова', username: 'aigera_code', points: 1620, badge: '💻 Dev Ninja', avatar: '👩‍💻' },
  { rank: 6, name: 'Нурсултан Касым', username: 'nurs_taraz', points: 1340, badge: '🎯 Active Member', avatar: '⚡' }
];
