import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Rocket, Presentation, ChevronRight, 
  MapPin, Plus, Cpu, Users, Award, FileText, 
  CheckCircle2, Star, GraduationCap, Flame, Sparkles, Building2 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const HomeView = ({ setActiveTab }) => {
  const { 
    events, 
    projects, 
    openModal, 
    lang, 
    myRegistrations,
    user 
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
    <div className="app-main-content">
      {/* 1. Hero Section */}
      <section className="hero-wrapper">
        {/* Eyebrow */}
        <div className="eyebrow-container">
          <div className="eyebrow-line"></div>
          <span className="eyebrow-text">
            {lang === 'ru' ? 'Инновационный центр Тараза' : 'Тараз Инновация Орталығы'}
          </span>
          <div className="eyebrow-line"></div>
        </div>

        {/* Wordmark */}
        <h1 className="hero-title">
          Zhambyl Hub
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          {lang === 'ru'
            ? 'Единая платформа для участия в хакатонах, защиты проектов и просмотра презентаций.'
            : 'Хакатондарға қатысу, жобаларды қорғау және таныстырылымдарды қарау платформасы.'}
        </p>

        {/* CTA Buttons */}
        <div className="hero-actions-row">
          <button
            onClick={() => setActiveTab('events')}
            className="btn-violet"
          >
            <Calendar className="w-4 h-4" />
            <span>{lang === 'ru' ? 'Мероприятия' : 'Шаралар'}</span>
          </button>

          <button
            onClick={() => openModal('submit-project')}
            className="btn-ghost-pill"
          >
            <Plus className="w-4 h-4 text-[#663af3]" />
            <span>{lang === 'ru' ? 'Подать проект' : 'Жоба қосу'}</span>
          </button>
        </div>

        {/* 2-Column Stats Card */}
        <div className="hero-stats-card max-w-xs grid-cols-2">
          <div className="stat-item">
            <span className="stat-number">{events.length}</span>
            <span className="stat-label">{lang === 'ru' ? 'Ивента' : 'Шара'}</span>
          </div>
          <div className="stat-item bordered">
            <span className="stat-number text-[#b6d9fc]">{projects.length}</span>
            <span className="stat-label">{lang === 'ru' ? 'Стартапа' : 'Жоба'}</span>
          </div>
        </div>
      </section>

      {/* 2. Feature Icons Row */}
      <section className="feature-nav-wrapper">
        <div className="feature-nav-grid">
          <button
            onClick={() => setActiveTab('projects')}
            className="feature-nav-btn"
          >
            <div className="feature-icon-circle">
              <Rocket className="w-5 h-5 text-[#a78bfa]" />
            </div>
            <span className="feature-nav-label">Питч-деки</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className="feature-nav-btn"
          >
            <div className="feature-icon-circle">
              <Calendar className="w-5 h-5 text-[#663af3]" />
            </div>
            <span className="feature-nav-label">Хакатоны</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className="feature-nav-btn"
          >
            <div className="feature-icon-circle">
              <Cpu className="w-5 h-5 text-[#80cbc4]" />
            </div>
            <span className="feature-nav-label">AI & Лаб</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="feature-nav-btn"
          >
            <div className="feature-icon-circle">
              <Users className="w-5 h-5 text-[#90caf9]" />
            </div>
            <span className="feature-nav-label">Комьюнити</span>
          </button>
        </div>
      </section>

      {/* 3. Hot Spotlight Event */}
      {hotEvent && (
        <section className="section-wrapper">
          <div className="eyebrow-container">
            <div className="eyebrow-line"></div>
            <span className="eyebrow-text">
              {lang === 'ru' ? 'Главное событие' : 'Басты шара'}
            </span>
            <div className="eyebrow-line"></div>
          </div>

          <div
            onClick={() => handleOpenEvent(hotEvent)}
            className="glass-card cursor-pointer group space-y-3"
          >
            {/* Event Cover Image */}
            {hotEvent.imageUrl || hotEvent.image_url ? (
              <div className="w-full h-36 rounded-xl overflow-hidden mb-2 border border-[rgba(186,215,247,0.1)]">
                <img 
                  src={hotEvent.imageUrl || hotEvent.image_url} 
                  alt={hotEvent.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : null}

            <div className="flex items-center justify-between gap-2">
              <span className="badge badge-violet flex items-center gap-1">
                <Rocket className="w-3 h-3 text-[#a78bfa]" />
                <span>{hotEvent.hasProjects ? 'Хакатон с защитой' : 'Воркшоп'}</span>
              </span>
              <span className="text-xs text-[#d8ecf8] font-mono">
                {hotEvent.date}
              </span>
            </div>

            <h3 className="font-display text-base font-semibold text-white leading-snug">
              {hotEvent.title}
            </h3>

            <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed">
              {hotEvent.shortDesc}
            </p>

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-[rgba(186,215,247,0.08)] text-xs text-[#9da7ba]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#269684]" />
                <span className="text-[#d1e4fa]">{hotEvent.locationShort}</span>
              </div>
              <div className="flex items-center gap-1 text-[#d8ecf8] font-medium group-hover:translate-x-0.5 transition-transform">
                <span>{lang === 'ru' ? 'Регистрация' : 'Тіркелу'}</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#663af3]" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Events Calendar Section */}
      <section className="section-wrapper">
        <div className="section-header">
          <h3 className="section-title">
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
        <div className="flex items-center justify-center flex-wrap gap-2">
          <button
            onClick={() => {
              hapticFeedback.selection();
              setEventFilter('all');
            }}
            className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 ${eventFilter === 'all' ? 'btn-pill-active' : ''}`}
          >
            {lang === 'ru' ? 'Все форматы' : 'Барлығы'}
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setEventFilter('with_projects');
            }}
            className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 flex items-center gap-1.5 ${eventFilter === 'with_projects' ? 'btn-pill-active' : ''}`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'С защитой проектов' : 'Жобалармен'}</span>
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setEventFilter('without_projects');
            }}
            className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 flex items-center gap-1.5 ${eventFilter === 'without_projects' ? 'btn-pill-active' : ''}`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{lang === 'ru' ? 'Без проектов' : 'Жобасыз'}</span>
          </button>
        </div>

        {/* Events Cards */}
        <div className="flex flex-col gap-3">
          {filteredEvents.length === 0 ? (
            <div className="glass-card p-6 text-center space-y-2">
              <Calendar className="w-7 h-7 text-[#9da7ba] mx-auto opacity-40" />
              <p className="text-xs font-semibold text-white">Мероприятия скоро появятся</p>
              <p className="text-[11px] text-[#9da7ba]">
                Организаторы добавляют новые события в экосистему.
              </p>
            </div>
          ) : (
            filteredEvents.slice(0, 3).map((ev) => {
              const isRegistered = myRegistrations?.some(r => r.eventId === ev.id || r.event_id === ev.id);

              return (
                <div
                  key={ev.id}
                  onClick={() => handleOpenEvent(ev)}
                  className="glass-card cursor-pointer transition-all active:scale-[0.99] space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`badge ${ev.hasProjects ? 'badge-violet' : 'badge-teal'} flex items-center gap-1`}>
                      {ev.hasProjects ? <Rocket className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                      <span>{ev.hasProjects ? 'С защитой проектов' : 'Лекция / Воркшоп'}</span>
                    </span>
                    {isRegistered && (
                      <span className="badge badge-teal flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#269684]" />
                        <span>Вы записаны</span>
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-sm font-semibold text-white leading-snug">
                    {lang === 'ru' ? ev.title : (ev.titleKz || ev.title)}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-[#9da7ba] pt-2.5 border-t border-[rgba(186,215,247,0.08)]">
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
            })
          )}
        </div>
      </section>

      {/* 5. Pitch Decks Showcase */}
      <section className="section-wrapper">
        <div className="section-header">
          <div className="flex items-center gap-2">
            <Presentation className="w-4 h-4 text-[#663af3]" />
            <h3 className="section-title">
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
            ? 'Листайте PDF-деки стартапов и знакомьтесь с проектами региона.'
            : 'PDF-дектерді қарап, өңір жобаларымен танысыңыз.'}
        </p>

        {/* Deck Cards */}
        <div className="flex flex-col gap-3">
          {featuredProjects.length === 0 ? (
            <div className="glass-card p-6 text-center space-y-2">
              <Rocket className="w-7 h-7 text-[#9da7ba] mx-auto opacity-40" />
              <p className="text-xs font-semibold text-white">Стартапы еще не добавлены</p>
              <button
                onClick={() => openModal('submit-project')}
                className="btn-violet text-xs !py-1.5 !px-3.5 mt-2"
              >
                + Загрузить PDF питч-дек
              </button>
            </div>
          ) : (
            featuredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleOpenDeck(proj)}
                className="glass-card cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.14)] flex items-center justify-center text-[#d8ecf8] shrink-0">
                      <Rocket className="w-5 h-5 text-[#663af3]" />
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

                  <span className="badge badge-violet font-mono text-[11px] shrink-0">
                    PDF Deck
                  </span>
                </div>

                <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed">
                  {proj.shortDesc}
                </p>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[rgba(186,215,247,0.08)] text-xs">
                  <div className="flex items-center gap-1 text-[#ffab91]">
                    <Star className="w-3.5 h-3.5 fill-[#ffab91]" />
                    <span className="font-semibold">{proj.rating}</span>
                    <span className="text-[#9da7ba]">({proj.reviewsCount})</span>
                  </div>
                  <div className="text-[#d8ecf8] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <FileText className="w-3.5 h-3.5 text-[#663af3]" />
                    <span>{lang === 'ru' ? 'Смотреть PDF' : 'PDF көру'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#663af3]" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
