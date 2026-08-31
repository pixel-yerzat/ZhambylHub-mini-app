import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, MapPin, Search, 
  Rocket, Users, Presentation, CheckCircle2, ChevronRight, 
  GraduationCap, Flame, Sparkles 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const EventsView = () => {
  const { events, myRegistrations, openModal, projects, lang } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((ev) => {
    if (categoryFilter === 'pizza_pitch' && !ev.categoryName?.toLowerCase().includes('pizza') && !ev.title?.toLowerCase().includes('pizza')) return false;
    if (categoryFilter === 'with_projects' && !ev.hasProjects) return false;
    if (categoryFilter === 'without_projects' && ev.hasProjects) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ev.title?.toLowerCase().includes(q) || (ev.titleKz && ev.titleKz.toLowerCase().includes(q));
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

  const getEventBadge = (ev) => {
    if (ev.categoryName?.toLowerCase().includes('pizza') || ev.title?.toLowerCase().includes('pizza')) {
      return (
        <span className="badge badge-amber text-[11px] flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-[#ffab91]" />
          <span>Pizza Pitch</span>
        </span>
      );
    }
    if (ev.hasProjects) {
      return (
        <span className="badge badge-violet text-[11px] flex items-center gap-1.5">
          <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
          <span>{ev.categoryName || 'Pitch Day / Хакатон'}</span>
        </span>
      );
    }
    return (
      <span className="badge badge-teal text-[11px] flex items-center gap-1.5">
        <GraduationCap className="w-3.5 h-3.5 text-[#80cbc4]" />
        <span>{ev.categoryName || 'Воркшоп / Митап'}</span>
      </span>
    );
  };

  return (
    <div className="app-main-content">
      {/* 1. Page Header */}
      <div className="page-header-row">
        <div>
          <h1 className="font-display text-xl font-bold text-gradient-skywash leading-tight">
            {lang === 'ru' ? 'Мероприятия Hub' : 'Hub Іс-шаралары'}
          </h1>
          <p className="text-xs text-[#9da7ba] mt-0.5">
            {lang === 'ru' 
              ? 'Pizza Pitch, хакатоны и воркшопы' 
              : 'Pizza Pitch, хакатондар және воркшоптар'}
          </p>
        </div>
        <span className="badge badge-violet font-mono text-xs shrink-0">
          {filteredEvents.length} {lang === 'ru' ? 'событий' : 'шара'}
        </span>
      </div>

      {/* 2. Search Bar */}
      <div className="search-bar-row">
        <Search className="w-4 h-4 text-[#9da7ba] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ru' ? 'Поиск Pizza Pitch, хакатона или темы...' : 'Іс-шараларды іздеу...'}
          className="glass-input pl-10 text-xs"
        />
      </div>

      {/* 3. Category Filter Chips (No scrollbar) */}
      <div className="filter-pills-row no-scrollbar">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('all');
          }}
          className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 whitespace-nowrap shrink-0 ${categoryFilter === 'all' ? 'btn-pill-active' : ''}`}
        >
          {lang === 'ru' ? 'Все форматы' : 'Барлығы'}
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('pizza_pitch');
          }}
          className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${categoryFilter === 'pizza_pitch' ? 'btn-pill-active' : ''}`}
        >
          <Flame className="w-3.5 h-3.5 text-[#ffab91]" />
          <span>Pizza Pitch</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('with_projects');
          }}
          className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${categoryFilter === 'with_projects' ? 'btn-pill-active' : ''}`}
        >
          <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
          <span>{lang === 'ru' ? 'С защитой проектов' : 'Жобалармен'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('without_projects');
          }}
          className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${categoryFilter === 'without_projects' ? 'btn-pill-active' : ''}`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#80cbc4]" />
          <span>{lang === 'ru' ? 'Воркшопы' : 'Воркшоптар'}</span>
        </button>
      </div>

      {/* 4. Events Cards List */}
      <div className="cards-list-wrapper">
        {filteredEvents.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-white">Мероприятия не найдены</p>
            <p className="text-xs text-[#9da7ba]">Попробуйте изменить параметры поиска или фильтра</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isRegistered = myRegistrations?.some(r => r.eventId === ev.id || r.event_id === ev.id);
            const eventProjects = ev.hasProjects 
              ? projects.filter(p => ev.participatingProjects?.includes(p.id)) 
              : [];

            return (
              <div
                key={ev.id}
                onClick={() => handleOpenEvent(ev)}
                className="glass-card cursor-pointer transition-all active:scale-[0.99] group"
              >
                {/* Event Cover Banner */}
                {ev.imageUrl || ev.image_url ? (
                  <div className="w-full h-36 rounded-xl overflow-hidden mb-3.5 border border-[rgba(186,215,247,0.1)]">
                    <img 
                      src={ev.imageUrl || ev.image_url} 
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : null}

                {/* Top Badge & Registration Status */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  {getEventBadge(ev)}

                  {isRegistered && (
                    <span className="badge badge-teal flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#269684]" />
                      <span>Вы записаны</span>
                    </span>
                  )}
                </div>

                {/* Event Title */}
                <h3 className="font-display text-base font-semibold text-white group-hover:text-[#d8ecf8] transition-colors leading-snug mb-2">
                  {lang === 'ru' ? ev.title : (ev.titleKz || ev.title)}
                </h3>

                {/* Event Description */}
                <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed mb-3.5">
                  {lang === 'ru' ? ev.shortDesc : (ev.shortDescKz || ev.shortDesc)}
                </p>

                {/* Participating Projects */}
                {ev.hasProjects && eventProjects.length > 0 && (
                  <div className="pt-3 mb-3.5 border-t border-[rgba(186,215,247,0.08)] space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#9da7ba]">
                      <span className="flex items-center gap-1.5">
                        <Rocket className="w-3.5 h-3.5 text-[#663af3]" />
                        <span>Проекты на защите ({eventProjects.length}):</span>
                      </span>
                      <span className="text-[11px] text-[#663af3] font-medium">Смотреть PDF</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {eventProjects.map((proj) => (
                        <button
                          key={proj.id}
                          onClick={(e) => handleOpenDeck(e, proj)}
                          className="btn-ghost-pill text-xs !py-1 !px-2.5 text-[#d1e4fa] flex items-center gap-1.5"
                        >
                          <Rocket className="w-3.5 h-3.5 text-[#663af3]" />
                          <span className="font-medium">{proj.name}</span>
                          <Presentation className="w-3 h-3 text-[#a78bfa]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Meta */}
                <div className="flex items-center justify-between pt-3 border-t border-[rgba(186,215,247,0.08)] text-xs text-[#9da7ba]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-[#663af3]" />
                    <span className="text-[#d1e4fa]">{ev.date}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[#d8ecf8] font-medium group-hover:translate-x-0.5 transition-transform">
                    <span>{isRegistered ? 'Детали записи' : 'Регистрация'}</span>
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
