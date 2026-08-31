/**
 * Zhambyl Hub Data Store — Clean Initial State (Populated via Supabase)
 */

export const INITIAL_EVENTS = [];
export const INITIAL_PROJECTS = [];
export const INITIAL_REWARDS = [];
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

export const LEADERBOARD = [];
