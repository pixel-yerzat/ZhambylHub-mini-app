/**
 * Zhambyl Hub Data Store — Clean Initial State (Populated via Supabase)
 */

export const INITIAL_EVENTS = [];
export const INITIAL_PROJECTS = [];
export const INITIAL_REWARDS = [
  {
    id: 'rew-1',
    title: 'Фирменный худи Zhambyl Hub',
    desc: 'Оверсайз худи из премиального футера с вышивкой Zhambyl Innovator',
    price: 350,
    icon: '🧥'
  },
  {
    id: 'rew-2',
    title: 'Футболка Hub Resident',
    desc: 'Лимитированная футболка с голографическим принтом AI & Web3',
    price: 200,
    icon: '👕'
  },
  {
    id: 'rew-3',
    title: 'Умная термокружка Hub',
    desc: 'Нержавеющая сталь с LED-датчиком температуры и логотипом Hub',
    price: 150,
    icon: '☕'
  },
  {
    id: 'rew-4',
    title: 'Стикерпак IT Taraz',
    desc: 'Набор виниловых влагостойких стикеров для ноутбука',
    price: 50,
    icon: '🎨'
  }
];

export const INITIAL_QUESTS = [
  {
    id: 'q-1',
    title: 'Ежедневный визит в Hub App',
    points: 15,
    action: 'daily',
    isDone: false
  },
  {
    id: 'q-2',
    title: 'Зарегистрироваться на мероприятие',
    points: 50,
    action: 'register_event',
    isDone: false
  },
  {
    id: 'q-3',
    title: 'Оценить PDF презентацию стартапа',
    points: 35,
    action: 'review_presentation',
    isDone: false
  },
  {
    id: 'q-4',
    title: 'Подать проект со своим PDF питч-деком',
    points: 150,
    action: 'add_project',
    isDone: false
  }
];

export const LEADERBOARD = [
  { id: 'lead-1', name: 'Yerzat Innovator', roleTitle: 'Fullstack & AI Lead', points: 480 },
  { id: 'lead-2', name: 'Alisher Dev', roleTitle: 'AgroTech Founder', points: 390 },
  { id: 'lead-3', name: 'Dina Startuper', roleTitle: 'EdTech Creator', points: 310 },
  { id: 'lead-4', name: 'Sanzhar ML', roleTitle: 'Computer Vision Dev', points: 265 },
  { id: 'lead-5', name: 'Aruzhan UX', roleTitle: 'Product Designer', points: 195 }
];

export const INITIAL_PAST_WINNERS = [
  {
    id: 'w-1',
    title: 'Smart Parking Almaty (Умная парковка)',
    description: 'Система компьютерного зрения и IoT датчиков для поиска свободных парковочных мест в реальном времени.',
    category: 'Smart City / IoT',
    eventName: 'Hub Hackathon Spring 2024',
    year: '2024',
    track: '1st Place · Best Smart City Solution',
    features: ['RTSP камеры', 'ML прогноз', 'Telegram WebApp']
  },
  {
    id: 'w-2',
    title: 'AgroDron Taraz (Агродроны Жамбыл)',
    description: 'Автономные БПЛА с мультиспектральными камерами для анализа состояния посевов и точечного полива.',
    category: 'AgroTech / AI',
    eventName: 'Zhambyl AgroHack 2024',
    year: '2024',
    track: '1st Place · AgroTech Innovation',
    features: ['Компьютерное зрение', 'Карты вегетации NDVI', 'Экономия воды 40%']
  },
  {
    id: 'w-3',
    title: 'MedCard QR (Цифровая медкарта)',
    description: 'Мгновенный доступ к экстренной медкарте пациента по зашифрованному QR-коду на браслете.',
    category: 'HealthTech / GovTech',
    eventName: 'Digital Taraz Demo Day 2025',
    year: '2025',
    track: 'Grand Prix · Social Impact',
    features: ['Шифрование ГОСТ', 'Офлайн доступ', 'Синхронизация с DamuMed']
  }
];
