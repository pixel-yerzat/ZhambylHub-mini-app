import React, { useState } from 'react';
import { useApp } from '@/context';
import { 
  Calendar, Clock, MapPin, Search, 
  Rocket, Users, Presentation, CheckCircle2, ChevronRight, 
  GraduationCap, Flame, Sparkles 
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';
import { EventCategoryBadge } from '@/components/common/Badge';

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

  return (
    <div className="app-main-content">
      {/* 1. Page Header */}
      <div className="page-header-row">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-xl font-bold text-gradient-skywash leading-tight truncate">
            {lang === 'ru' ? 'Мероприятия Hub' : 'Hub Іс-шаралары'}
          </h1>
          <p className="text-xs text-[#9da7ba] mt-0.5 truncate">
            {lang === 'ru' 
              ? 'Pizza Pitch, хакатоны и воркшопы' 
              : 'Pizza Pitch, хакатондар және воркшоптар'}
          </p>
        </div>
        <span className="badge badge-violet font-mono text-xs shrink-0 mt-0.5">
          {filteredEvents.length} {lang === 'ru' ? 'событий' : 'шара'}
        </span>
      </div>

      {/* 2. Search Bar */}
      <div className="search-bar-row">
        <Search className="w-4 h-4 text-[#9da7ba] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ru' ? 'Поиск Pizza Pitch, хакатона или темы...' : 'Іс-шараларды іздеу...'}
          className="glass-input text-xs"
        />
      </div>

      {/* 3. Category Filter Chips (No scrollbar) */}
      <div className="filter-pills-row no-scrollbar">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('all');
          }}
          className={`filter-pill ${categoryFilter === 'all' ? 'active' : ''}`}
        >
          {lang === 'ru' ? 'Все' : 'Барлығы'}
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('pizza_pitch');
          }}
          className={`filter-pill flex items-center gap-1.5 ${categoryFilter === 'pizza_pitch' ? 'active' : ''}`}
        >
          <Flame className="w-3.5 h-3.5 text-[#ffab91]" />
          <span>Pizza Pitch</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('with_projects');
          }}
          className={`filter-pill flex items-center gap-1.5 ${categoryFilter === 'with_projects' ? 'active' : ''}`}
        >
          <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
          <span>{lang === 'ru' ? 'С питчингом' : 'Питч бар'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setCategoryFilter('without_projects');
          }}
          className={`filter-pill flex items-center gap-1.5 ${categoryFilter === 'without_projects' ? 'active' : ''}`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-[#80cbc4]" />
          <span>{lang === 'ru' ? 'Воркшопы' : 'Воркшоптар'}</span>
        </button>
      </div>

      {/* 4. Events Cards List */}
      <div className="w-full space-y-3.5 pb-6">
        {filteredEvents.length === 0 ? (
          <div className="glass-card text-center p-8 space-y-2">
            <Calendar className="w-8 h-8 text-[#9da7ba] mx-auto opacity-60" />
            <p className="text-xs font-semibold text-white">Мероприятия не найдены</p>
            <p className="text-[11px] text-[#9da7ba]">Попробуйте изменить параметры поиска или фильтра</p>
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isRegistered = myRegistrations.some(r => r.eventId === ev.id || r.event_id === ev.id);
            const eventProjects = projects.filter(p => ev.participatingProjects?.includes(p.id));

            return (
              <div
                key={ev.id}
                onClick={() => handleOpenEvent(ev)}
                className="glass-card !p-4 cursor-pointer hover:border-[#663af3]/70 transition-all relative overflow-hidden group space-y-3"
              >
                {/* Event Image Banner if present */}
                {ev.imageUrl && (
                  <div className="rounded-xl overflow-hidden h-32 w-full border border-[rgba(186,215,247,0.08)]">
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                )}

                {/* Top Row: Category Badge & Date/Status */}
                <div className="flex items-center justify-between gap-2">
                  <EventCategoryBadge categoryName={ev.categoryName} hasProjects={ev.hasProjects} />
                  
                  {isRegistered ? (
                    <span className="badge badge-teal text-[10px] font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{lang === 'ru' ? 'Вы идете' : 'Тіркелдіңіз'}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-[#c7d3ea] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#a78bfa]" />
                      {ev.date}
                    </span>
                  )}
                </div>

                {/* Title & Desc */}
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-gradient-skywash transition-all leading-snug">
                    {lang === 'ru' ? ev.title : (ev.titleKz || ev.title)}
                  </h3>
                  <p className="text-xs text-[#9da7ba] mt-1 line-clamp-2 leading-relaxed">
                    {lang === 'ru' ? ev.shortDesc : (ev.shortDescKz || ev.shortDesc)}
                  </p>
                </div>

                {/* Participating Projects Mini Carousel / Pills if pitching event */}
                {ev.hasProjects && (
                  <div className="pt-1 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-[#c7d3ea] flex items-center gap-1">
                      <Rocket className="w-3 h-3 text-[#a78bfa]" />
                      <span>{lang === 'ru' ? 'Питчинг стартапов с PDF деками' : 'PDF питч-дектер'}</span>
                    </span>

                    {eventProjects.length > 0 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                        {eventProjects.map(p => (
                          <button
                            key={p.id}
                            onClick={(e) => handleOpenDeck(e, p)}
                            className="btn-ghost-pill !py-0.5 !px-2 text-[10px] text-white flex items-center gap-1 shrink-0 hover:border-[#663af3]"
                          >
                            <span>{p.logoIcon || '🚀'}</span>
                            <span className="max-w-[90px] truncate">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Card Footer: Time, Location & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-[11px] text-[#9da7ba]">
                  <div className="flex items-center gap-3 truncate">
                    <span className="flex items-center gap-1 shrink-0 font-mono">
                      <Clock className="w-3 h-3 text-[#a78bfa]" />
                      {ev.time}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-[#80cbc4] shrink-0" />
                      <span className="truncate">{ev.locationShort || 'Zhambyl Hub'}</span>
                    </span>
                  </div>

                  <button className="btn-ghost-pill !py-1 !px-2.5 text-[10px] text-white group-hover:border-[#663af3] shrink-0 flex items-center gap-1">
                    <span>{isRegistered ? (lang === 'ru' ? 'Вы записаны' : 'Тіркелдіңіз') : (lang === 'ru' ? 'Участвовать' : 'Қатысу')}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#663af3]" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
