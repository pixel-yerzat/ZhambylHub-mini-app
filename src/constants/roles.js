import { Code2, Rocket, Briefcase, Users } from 'lucide-react';

export const USER_ROLES = [
  {
    id: 'developer',
    titleRu: 'Разработчик / Инженер',
    titleKz: 'Әзірлеуші / Инженер',
    descRu: 'Пишу код, создаю AI и участвую в хакатонах',
    descKz: 'Код жазамын, хакатондарға қатысамын',
    icon: Code2,
    badgeColor: 'badge-teal',
    defaultTag: 'Fullstack / AI Developer'
  },
  {
    id: 'founder',
    titleRu: 'Фаундер / Стартапер',
    titleKz: 'Фаундер / Стартапер',
    descRu: 'Загружаю PDF питч-дек, ищу инвестиции и команду',
    descKz: 'PDF питч-дек жүктеймін, инвестиция іздеймін',
    icon: Rocket,
    badgeColor: 'badge-violet',
    defaultTag: 'Startup Founder & Lead'
  },
  {
    id: 'investor',
    titleRu: 'Инвестор / Бизнес-ангел',
    titleKz: 'Инвестор / Бизнес-періште',
    descRu: 'Изучаю PDF презентации проектов региона',
    descKz: 'Өңірдің IT жобаларының PDF дектерін қараймын',
    icon: Briefcase,
    badgeColor: 'badge-amber',
    defaultTag: 'Venture / Angel Investor'
  },
  {
    id: 'community',
    titleRu: 'Комьюнити / Гость',
    titleKz: 'Қоғамдастық / Қонақ',
    descRu: 'Посещаю ивенты, учусь и нахожу единомышленников',
    descKz: 'Іс-шараларға қатысып, білім аламын',
    icon: Users,
    badgeColor: 'badge-blue',
    defaultTag: 'Community Member'
  }
];

export const getRoleConfig = (roleId) => {
  return USER_ROLES.find(r => r.id === roleId) || USER_ROLES[3];
};
