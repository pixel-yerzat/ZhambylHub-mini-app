/**
 * App Global Constants & Storage Keys
 */

export const STORAGE_KEYS = {
  THEME: 'zh_theme',
  USER: 'zh_user',
  LANG: 'zh_lang',
  EVENTS: 'zh_events',
  PROJECTS: 'zh_projects',
  REGISTRATIONS: 'zh_registrations',
  REVIEWED_DECKS: 'zh_reviewed_decks',
};

export const FILE_LIMITS = {
  MAX_PDF_SIZE_BYTES: 10 * 1024 * 1024,   // 10 MB
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024,  // 5 MB
};

export const PROJECT_TAGS = [
  { id: 'all', labelRu: 'Все', labelKz: 'Барлығы' },
  { id: 'AI', labelRu: 'AI & Data', labelKz: 'AI & Data' },
  { id: 'AgroTech', labelRu: 'AgroTech', labelKz: 'AgroTech' },
  { id: 'GovTech', labelRu: 'GovTech', labelKz: 'GovTech' },
  { id: 'MedTech', labelRu: 'MedTech', labelKz: 'MedTech' },
  { id: 'FinTech', labelRu: 'FinTech', labelKz: 'FinTech' },
];

export const PROJECT_CATEGORIES = [
  'AI & Machine Learning',
  'FinTech & Banking',
  'AgroTech & Ecology',
  'GovTech & Smart City',
  'EdTech & Education',
  'MedTech & Health',
  'E-Commerce & Retail',
  'Other Innovations'
];

export const EVENT_CATEGORIES = [
  'Pizza Pitch',
  'Хакатон',
  'Воркшоп / Митап',
  'Demo Day',
  'Лекция / Мастер-класс',
  'Networking'
];

export const APP_CONFIG = {
  CITY: 'Тараз',
  HUB_NAME: 'Zhambyl Hub',
  DEFAULT_LANGUAGE: 'ru',
  DEFAULT_THEME: 'dark',
};
