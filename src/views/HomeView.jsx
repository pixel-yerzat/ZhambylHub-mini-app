import React from 'react';
import { useApp } from '@/context';
import { 
  Calendar, Rocket, ChevronRight, 
  MapPin, Plus, Star, Flame, Sparkles 
} from 'lucide-react';
import { RoleBadge, EventCategoryBadge } from '@/components/common/Badge';

export const HomeView = ({ setActiveTab }) => {
  const { 
    events, 
    projects, 
    openModal, 
    lang, 
    myRegistrations, 
    user 
  } = useApp();

  const featuredProjects = projects.slice(0, 3);
  const hotEvent = events[0];

  const handleOpenEvent = (event) => {
    openModal('event-detail', event);
  };

  const handleOpenDeck = (proj) => {
    openModal('presentation', proj);
  };

  return (
    <>
      <div className="home-bg-video-container" aria-hidden="true">
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          className="home-bg-video"
        >
          <source src="/hub_bg.mp4" type="video/mp4" />
        </video>
        <div className="home-bg-video-overlay" />
      </div>

      <div className="app-main-content relative">
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
        </section>

        {/* 2. Quick User Role Banner */}
        <div 
          onClick={() => openModal('change-role')}
          className="glass-card w-full flex items-center justify-between p-3.5 cursor-pointer hover:border-[#663af3]/50 transition-all active:scale-[0.99] group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.35)] flex items-center justify-center text-white shrink-0">
              <Sparkles className="w-5 h-5 text-[#a78bfa]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white truncate">
                  {user.firstName || 'Инноватор'} {user.lastName || ''}
                </span>
                <RoleBadge role={user.role} roleTitle={user.roleTitle} size="xs" />
              </div>
              <p className="text-[11px] text-[#9da7ba] truncate mt-0.5">
                {user.skillsOrInterest || 'Нажмите, чтобы изменить роль и стек'}
              </p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-[#9da7ba] group-hover:text-white shrink-0 transition-colors" />
        </div>

        {/* 3. Featured Hot Event Card */}
        {hotEvent && (
          <section className="w-full space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#c7d3ea] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#ffab91]" />
                <span>{lang === 'ru' ? 'Ближайший ивент' : 'Жақын арадағы іс-шара'}</span>
              </h2>
              <button
                onClick={() => setActiveTab('events')}
                className="text-[11px] text-[#a78bfa] hover:text-[#d1c4e9] font-medium"
              >
                {lang === 'ru' ? 'Все события' : 'Барлығы'} →
              </button>
            </div>

            <div 
              onClick={() => handleOpenEvent(hotEvent)}
              className="glass-card feature-card-glow w-full !p-4 cursor-pointer hover:border-[#663af3] transition-all relative overflow-hidden group space-y-3"
            >
              {/* Event Top row */}
              <div className="flex items-center justify-between gap-2">
                <EventCategoryBadge categoryName={hotEvent.categoryName} hasProjects={hotEvent.hasProjects} />
                <span className="text-[11px] font-mono text-[#c7d3ea] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#a78bfa]" />
                  {hotEvent.date}
                </span>
              </div>

              {/* Title & Desc */}
              <div>
                <h3 className="font-display text-base font-bold text-white group-hover:text-gradient-skywash transition-all leading-snug">
                  {lang === 'ru' ? hotEvent.title : (hotEvent.titleKz || hotEvent.title)}
                </h3>
                <p className="text-xs text-[#9da7ba] mt-1 line-clamp-2 leading-relaxed">
                  {lang === 'ru' ? hotEvent.shortDesc : (hotEvent.shortDescKz || hotEvent.shortDesc)}
                </p>
              </div>

              {/* Bottom Details Row */}
              <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-[11px] text-[#9da7ba]">
                <div className="flex items-center gap-1 truncate max-w-[65%]">
                  <MapPin className="w-3.5 h-3.5 text-[#80cbc4] shrink-0" />
                  <span className="truncate">{hotEvent.locationShort || 'Zhambyl Hub'}</span>
                </div>
                <button className="btn-ghost-pill !py-1 !px-2.5 text-[10px] text-white group-hover:border-[#663af3]">
                  <span>{lang === 'ru' ? 'Подробнее' : 'Толығырақ'}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 4. Featured Startups Catalog with PDF Decks */}
        <section className="w-full space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#c7d3ea] flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span>{lang === 'ru' ? 'Питч-деки стартапов' : 'Стартаптар презентациялары'}</span>
            </h2>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-[11px] text-[#a78bfa] hover:text-[#d1c4e9] font-medium"
            >
              {lang === 'ru' ? 'Каталог' : 'Каталог'} →
            </button>
          </div>

          <div className="space-y-2.5">
            {featuredProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleOpenDeck(proj)}
                className="glass-card !p-3.5 cursor-pointer hover:border-[#663af3]/60 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[rgba(102,58,243,0.15)] border border-[rgba(102,58,243,0.3)] flex items-center justify-center text-base shrink-0">
                    {proj.logoIcon || '🚀'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-display text-xs font-bold text-white truncate">
                        {proj.name}
                      </h4>
                      <span className="badge badge-teal text-[9px] !py-0 !px-1.5 font-mono">
                        PDF
                      </span>
                    </div>
                    <p className="text-[11px] text-[#9da7ba] truncate mt-0.5">
                      {proj.category} · {proj.founder}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-[#ffab91]">
                    <Star className="w-3 h-3 fill-[#ffab91]" />
                    <span className="font-bold">{proj.rating || '5.0'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9da7ba] group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Ecosystem Hub Stats Banner */}
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="glass-card !p-3 text-center space-y-0.5">
            <span className="font-display text-base font-bold text-white block">
              {events.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">
              Ивентов
            </span>
          </div>

          <div className="glass-card !p-3 text-center space-y-0.5">
            <span className="font-display text-base font-bold text-white block">
              {projects.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">
              Стартапов
            </span>
          </div>

          <div className="glass-card !p-3 text-center space-y-0.5">
            <span className="font-display text-base font-bold text-[#80cbc4] block">
              {myRegistrations.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">
              {lang === 'ru' ? 'Моих записей' : 'Қатысуларым'}
            </span>
          </div>
        </div>

      </div>
    </>
  );
};
