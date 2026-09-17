/**
 * Zhambyl Hub Data Store — Clean Initial State (Populated via Supabase)
 */

export const INITIAL_EVENTS = [];
export const INITIAL_PROJECTS = [];


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
