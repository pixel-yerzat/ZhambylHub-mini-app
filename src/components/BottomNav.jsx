import React from 'react';
import { Home, Calendar, Rocket, Award, User } from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';
import { useApp } from '../context/AppContext';

export const BottomNav = ({ activeTab, setActiveTab }) => {
  const { lang, myTickets } = useApp();

  const handleTabChange = (tabId) => {
    hapticFeedback.selection();
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    {
      id: 'home',
      label: lang === 'ru' ? 'Главная' : 'Басты',
      icon: Home
    },
    {
      id: 'events',
      label: lang === 'ru' ? 'Ивенты' : 'Шаралар',
      icon: Calendar
    },
    {
      id: 'projects',
      label: lang === 'ru' ? 'Проекты' : 'Жобалар',
      icon: Rocket
    },
    {
      id: 'rewards',
      label: lang === 'ru' ? 'Баллы' : 'Ұпайлар',
      icon: Award
    },
    {
      id: 'profile',
      label: lang === 'ru' ? 'Профиль' : 'Профиль',
      icon: User,
      badgeCount: myTickets.length > 0 ? myTickets.length : null
    }
  ];

  return (
    <div className="bottom-nav-bar">
      <nav className="bottom-nav-inner">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`bottom-nav-item relative ${isActive ? 'active' : ''}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#ffffff]' : 'text-[#9da7ba]'}`} />
                {tab.badgeCount && (
                  <span className="absolute -top-1 -right-2 bg-[#663af3] text-white text-[9px] font-bold px-1 rounded-full border border-[#05060f]">
                    {tab.badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] tracking-tight ${isActive ? 'font-semibold text-white' : 'text-[#9da7ba]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
