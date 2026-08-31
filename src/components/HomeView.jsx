import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, Calendar, Rocket, Presentation, ChevronRight, 
  MapPin, Clock, Trophy, Flame, CheckCircle, Plus, ShieldCheck, 
  Layers, Award, Cpu, Globe, Users
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const HomeView = ({ setActiveTab }) => {
  const { 
    events, 
    projects, 
    points, 
    quests, 
    claimDaily, 
    openModal, 
    lang, 
    myTickets 
  } = useApp();

  const [eventFilter, setEventFilter] = useState('all');

  const filteredEvents = events.filter(e => {
    if (eventFilter === 'with_projects') return e.hasProjects;
    if (eventFilter === 'without_projects') return !e.hasProjects;
    return true;
  });

  const featuredProjects = projects.slice(0, 3);
  const hotEvent = events[0];

  const handleOpenEvent = (event) => {
    openModal('event-detail', event);
  };

  const handleOpenDeck = (proj) => {
    openModal('presentation', proj);
  };

  return (
    <div className="space-y-8 pb-8 px-5 pt-4">
      {/* 1. Hero Section (AuthKit Centerpiece) */}
      <div className="text-center pt-2 pb-1 space-y-4">
        {/* Eyebrow Label */}
        <div className="eyebrow-container">
          <div className="eyebrow-line"></div>
          <span className="eyebrow-text">
            {lang === 'ru' ? 'Инновационный центр Тараза' : 'Тараз Инновация Орталығы'}
          </span>
          <div className="eyebrow-line"></div>
        </div>

        {/* Hero Display Wordmark */}
        <div className="space-y-2">
          <h1 className="font-display text-3xl md:text-4xl text-gradient-skywash tracking-tight leading-tight">
            Zhambyl Hub
          </h1>
          <p className="text-sm text-[#c7d3ea] max-w-xs mx-auto leading-relaxed">
            {lang === 'ru'
              ? 'Единая платформа для участия в хакатонах, защиты проектов и просмотра презентаций.'
              : 'Хакатондарға қатысу, жобаларды қорғау және таныстырылымдарды қарау платформасы.'}
          </p>
        </div>

        {/* Floating Glass Overview Card */}
        <div className="glass-card p-5 mx-auto max-w-sm mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="badge badge-violet">
              {lang === 'ru' ? 'Экосистема Hub' : 'Hub Экожүйесі'}
            </span>
            <span className="text-xs font-mono text-[#9da7ba]">
              {events.length} {lang === 'ru' ? 'ивента' : 'шара'} · {projects.length} {lang === 'ru' ? 'проектов' : 'жоба'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setActiveTab('events')}
              className="btn-violet text-xs !py-2.5 !px-3 flex items-center justify-center gap-2 w-full"
            >
              <Calendar className="w-4 h-4" />
              <span>{lang === 'ru' ? 'Мероприятия' : 'Шаралар'}</span>
            </button>

            <button
              onClick={() => openModal('submit-project')}
              className="btn-ghost-pill text-xs !py-2.5 !px-3 flex items-center justify-center gap-2 w-full"
            >
              <Plus className="w-4 h-4 text-[#663af3]" />
              <span>{lang === 'ru' ? 'Подать проект' : 'Жоба қосу'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Feature Icon Row (AuthKit 4-Feature Architecture) */}
      <div className="py-2 border-y border-[rgba(186,215,247,0.08)]">
        <div className="flex items-center justify-around">
          <div 
            onClick={() => setActiveTab('projects')}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="feature-icon-tile group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-[#d1e4fa]" />
            </div>
            <span className="text-xs text-[#c7d3ea] font-medium">Питч-деки</span>
          </div>

          <div 
            onClick={() => setActiveTab('events')}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="feature-icon-tile group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5 text-[#d1e4fa]" />
            </div>
            <span className="text-xs text-[#c7d3ea] font-medium">Хакатоны</span>
          </div>

          <div 
            onClick={() => setActiveTab('projects')}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="feature-icon-tile group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-[#d1e4fa]" />
            </div>
            <span className="text-xs text-[#c7d3ea] font-medium">AI & Лаб</span>
          </div>

          <div 
            onClick={() => setActiveTab('rewards')}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="feature-icon-tile group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-[#d1e4fa]" />
            </div>
            <span className="text-xs text-[#c7d3ea] font-medium">Баллы</span>
          </div>
        </div>
      </div>

      {/* 3. Hot Spotlight Event Card */}
      {hotEvent && (
        <div className="space-y-3">
          <div className="eyebrow-container">
            <div className="eyebrow-line"></div>
            <span className="eyebrow-text">
              {lang === 'ru' ? 'Главное событие' : 'Басты шара'}
            </span>
            <div className="eyebrow-line"></div>
          </div>

          <div
            onClick={() => handleOpenEvent(hotEvent)}
            className="glass-card p-6 cursor-pointer relative overflow-hidden group hover:border-[rgba(186,215,247,0.28)] transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="badge badge-violet">
                {hotEvent.hasProjects ? '🚀 Хакатон с защитой проектов' : 'Воркшоп'}
              </span>
              <span className="text-xs font-mono text-[#d8ecf8] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#663af3]" />
                +{hotEvent.rewardPoints} pts
              </span>
            </div>

            <h3 className="font-display text-base font-semibold text-white leading-snug">
              {hotEvent.title}
            </h3>

            <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed">
              {hotEvent.shortDesc}
            </p>

            <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(186,215,247,0.08)] text-xs text-[#9da7ba]">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#663af3]" />
                <span className="text-[#d1e4fa]">{hotEvent.date}</span>
              </div>
              <div className="flex items-center gap-1 text-[#d8ecf8] font-medium group-hover:translate-x-0.5 transition-transform">
                <span>{lang === 'ru' ? 'Регистрация' : 'Тіркелу'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#663af3]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Events with Filter Pills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-display text-base font-semibold text-white">
            {lang === 'ru' ? 'Календарь мероприятий' : 'Шаралар күнтізбесі'}
          </h3>
          <button
            onClick={() => setActiveTab('events')}
            className="text-xs text-[#d8ecf8] hover:text-white flex items-center gap-1 font-medium"
          >
            <span>{lang === 'ru' ? 'Все' : 'Барлығы'}</span>
            <ChevronRight className="w-3 h-3 text-[#663af3]" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              hapticFeedback.selection();
              setEventFilter('all');
            }}
            className={`btn-ghost-pill text-xs !py-2 !px-3.5 whitespace-nowrap ${eventFilter === 'all' ? 'btn-pill-active' : ''}`}
          >
            {lang === 'ru' ? 'Все форматы' : 'Барлығы'}
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setEventFilter('with_projects');
            }}
            className={`btn-ghost-pill text-xs !py-2 !px-3.5 whitespace-nowrap ${eventFilter === 'with_projects' ? 'btn-pill-active' : ''}`}
          >
            🚀 {lang === 'ru' ? 'С защитой проектов' : 'Жобалармен'}
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setEventFilter('without_projects');
            }}
            className={`btn-ghost-pill text-xs !py-2 !px-3.5 whitespace-nowrap ${eventFilter === 'without_projects' ? 'btn-pill-active' : ''}`}
          >
            🎓 {lang === 'ru' ? 'Без проектов' : 'Жобасыз'}
          </button>
        </div>

        {/* Events List Cards */}
        <div className="space-y-3">
          {filteredEvents.slice(0, 3).map((ev) => {
            const isRegistered = myTickets.some(t => t.eventId === ev.id);

            return (
              <div
                key={ev.id}
                onClick={() => handleOpenEvent(ev)}
                className="glass-card p-5 cursor-pointer transition-all active:scale-[0.99] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`badge ${ev.hasProjects ? 'badge-violet' : 'badge-teal'}`}>
                    {ev.hasProjects ? 'С защитой проектов' : 'Лекция / Воркшоп'}
                  </span>
                  <div className="flex items-center gap-2">
                    {isRegistered && (
                      <span className="badge badge-teal">✓ Билет есть</span>
                    )}
                    <span className="font-mono text-xs text-[#a78bfa]">
                      +{ev.rewardPoints} pts
                    </span>
                  </div>
                </div>

                <h4 className="font-display text-sm font-semibold text-white leading-snug">
                  {lang === 'ru' ? ev.title : (ev.titleKz || ev.title)}
                </h4>

                <div className="flex items-center justify-between text-xs text-[#9da7ba] pt-2 border-t border-[rgba(186,215,247,0.08)]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#663af3]" />
                    <span>{ev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#c7d3ea]">
                    <MapPin className="w-3.5 h-3.5 text-[#269684]" />
                    <span className="truncate max-w-[130px]">{ev.locationShort}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Interactive Pitch Decks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Presentation className="w-4 h-4 text-[#663af3]" />
            <h3 className="font-display text-base font-semibold text-white">
              {lang === 'ru' ? 'Презентации стартапов' : 'Стартаптар таныстырылымы'}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs text-[#d8ecf8] hover:text-white flex items-center gap-1 font-medium"
          >
            <span>{lang === 'ru' ? 'Каталог' : 'Каталог'}</span>
            <ChevronRight className="w-3 h-3 text-[#663af3]" />
          </button>
        </div>

        <p className="text-xs text-[#9da7ba] px-1">
          {lang === 'ru'
            ? 'Листайте слайды питч-деков, ставьте оценки и получайте +35 Hub Points за разбор.'
            : 'Питч-дек слайдтарын қарап, баға беріңіз және +35 ұпай алыңыз.'}
        </p>

        {/* Deck Cards */}
        <div className="grid grid-cols-1 gap-3">
          {featuredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => handleOpenDeck(proj)}
              className="glass-card p-5 cursor-pointer transition-all group space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] flex items-center justify-center text-xl shrink-0">
                    {proj.logoIcon}
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-white group-hover:text-[#d8ecf8] transition-colors">
                      {proj.name}
                    </h4>
                    <p className="text-xs text-[#9da7ba]">
                      {proj.founder} · <span className="text-[#269684]">{proj.stage}</span>
                    </p>
                  </div>
                </div>

                <span className="badge badge-violet font-mono text-[11px]">
                  {proj.presentation?.slidesCount || 5} слайдов
                </span>
              </div>

              <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed">
                {proj.shortDesc}
              </p>

              <div className="flex items-center justify-between pt-2 mt-1 border-t border-[rgba(186,215,247,0.08)] text-xs">
                <span className="text-[#ffab91]">★ {proj.rating} ({proj.reviewsCount})</span>
                <span className="text-[#d8ecf8] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <span>{lang === 'ru' ? 'Смотреть слайды' : 'Слайдты көру'}</span>
                  <ChevronRight className="w-3 h-3 text-[#663af3]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
