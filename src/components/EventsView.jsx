import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, MapPin, Sparkles, Search, 
  Rocket, Users, Presentation, CheckCircle, ChevronRight 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const EventsView = () => {
  const { events, myTickets, openModal, projects, lang } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((ev) => {
    if (categoryFilter === 'with_projects' && !ev.hasProjects) return false;
    if (categoryFilter === 'without_projects' && ev.hasProjects) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title.toLowerCase().includes(q) || (ev.titleKz && ev.titleKz.toLowerCase().includes(q));
      const matchDesc = ev.description?.toLowerCase().includes(q) || ev.shortDesc?.toLowerCase().includes(q);
      const matchCat = ev.categoryName?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchCat;
    }

    return true;
  });

  const handleOpenEvent = (ev) => {
    hapticFeedback.impact('light');
    openModal('event-detail', ev);
  };

  const handleOpenDeck = (e, proj) => {
    e.stopPropagation();
    hapticFeedback.impact('light');
    openModal('presentation', proj);
  };

  return (
    <div className="app-main-content space-y-6 pt-4 pb-8">
      {/* Top Header & Search */}
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-gradient-skywash">
              {lang === 'ru' ? 'Мероприятия Hub' : 'Hub Іс-шаралары'}
            </h1>
            <p className="text-xs text-[#9da7ba] mt-0.5">
              {lang === 'ru' 
                ? 'Хакатоны, питч-сессии и воркшопы' 
                : 'Хакатондар, питч-сессиялар және воркшоптар'}
            </p>
          </div>
          <span className="badge badge-violet font-mono text-xs">
            {filteredEvents.length} {lang === 'ru' ? 'событий' : 'шара'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#9da7ba] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ru' ? 'Поиск по названию или теме...' : 'Іс-шараларды іздеу...'}
            className="glass-input pl-10 text-xs"
          />
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] w-full">
          <button
            onClick={() => {
              hapticFeedback.selection();
              setCategoryFilter('all');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'all'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            {lang === 'ru' ? 'Все' : 'Барлығы'}
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setCategoryFilter('with_projects');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              categoryFilter === 'with_projects'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'С проектами' : 'Жобалармен'}</span>
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setCategoryFilter('without_projects');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
              categoryFilter === 'without_projects'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            {lang === 'ru' ? 'Без проектов' : 'Жобасыз'}
          </button>
        </div>
      </div>

      {/* Events Listing */}
      <div className="w-full flex flex-col gap-3.5">
        {filteredEvents.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-white">Мероприятия не найдены</p>
            <p className="text-xs text-[#9da7ba]">Попробуйте изменить параметры фильтра</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isRegistered = myTickets.some(t => t.eventId === ev.id);
            const eventProjects = ev.hasProjects 
              ? projects.filter(p => ev.participatingProjects?.includes(p.id)) 
              : [];

            return (
              <div
                key={ev.id}
                onClick={() => handleOpenEvent(ev)}
                className="glass-card cursor-pointer transition-all active:scale-[0.99] space-y-3 relative group"
              >
                {/* Top Badge & Spots Info */}
                <div className="flex items-center justify-between">
                  <span className={`badge ${ev.hasProjects ? 'badge-violet' : 'badge-teal'}`}>
                    {ev.hasProjects ? '🚀 Pitch Day / Хакатон' : '🎓 Воркшоп / Митап'}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#a78bfa] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#663af3]" />
                      +{ev.rewardPoints} pts
                    </span>

                    {isRegistered && (
                      <span className="badge badge-teal">
                        <CheckCircle className="w-3 h-3" />
                        Билет
                      </span>
                    )}
                  </div>
                </div>

                {/* Event Title & Short Desc */}
                <div className="space-y-1.5">
                  <h3 className="font-display text-base font-semibold text-white group-hover:text-[#d8ecf8] transition-colors leading-snug">
                    {lang === 'ru' ? ev.title : (ev.titleKz || ev.title)}
                  </h3>
                  <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed">
                    {lang === 'ru' ? ev.shortDesc : (ev.shortDescKz || ev.shortDesc)}
                  </p>
                </div>

                {/* Participating Projects */}
                {ev.hasProjects && eventProjects.length > 0 && (
                  <div className="pt-2 border-t border-[rgba(186,215,247,0.08)] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#9da7ba]">
                      <span className="flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5 text-[#663af3]" />
                        Проекты на защите ({eventProjects.length}):
                      </span>
                      <span className="text-[11px] text-[#663af3] font-medium">Смотреть слайды</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {eventProjects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={(e) => handleOpenDeck(e, proj)}
                          className="btn-ghost-pill text-xs !py-1 !px-2.5 text-[#d1e4fa] flex items-center gap-1.5"
                        >
                          <span>{proj.logoIcon}</span>
                          <span className="font-medium">{proj.name}</span>
                          <Presentation className="w-3 h-3 text-[#a78bfa]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Meta */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(186,215,247,0.08)] text-xs text-[#9da7ba]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#663af3]" />
                    <span className="text-[#d1e4fa]">{ev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#d8ecf8] font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>{isRegistered ? 'Мой билет' : 'Подробнее'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#663af3]" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
