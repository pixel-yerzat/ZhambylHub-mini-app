import React, { useState } from 'react';
import { useApp } from '@/context';
import { 
  Calendar, Rocket, Send, 
  Edit3, CheckCircle2, ChevronRight, 
  Star 
} from 'lucide-react';
import { openTelegramLink, hapticFeedback } from '@/utils/telegram';
import { RoleBadge } from '@/components/common/Badge';

export const ProfileView = () => {
  const { 
    user, 
    myRegistrations, 
    projects, 
    events,
    openModal, 
    lang 
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState('registrations');

  const userProjects = projects.filter(p => p.founder?.includes(user.firstName) || p.founderId === user.id || p.founder?.includes('Yerzat'));

  const handleOpenDeck = (proj) => {
    hapticFeedback.impact('light');
    openModal('presentation', proj);
  };

  const handleOpenEvent = (reg) => {
    hapticFeedback.impact('light');
    const matchedEvent = events.find(e => e.id === reg.eventId || e.id === reg.event_id || e.title === reg.eventTitle);
    if (matchedEvent) {
      openModal('event-detail', matchedEvent);
    }
  };

  return (
    <div className="app-main-content">
      {/* 1. Profile Hero Card */}
      <div className="glass-card !p-4 relative overflow-hidden space-y-3.5">
        
        {/* Background glow orb */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#663af3]/15 rounded-full blur-2xl pointer-events-none" />

        {/* User Info Row */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar with gradient border */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#663af3] to-[#80cbc4] p-[2px] shrink-0 shadow-[0_0_16px_rgba(102,58,243,0.35)]">
              <div className="w-full h-full rounded-[14px] bg-[#05060f] flex items-center justify-center font-display text-base font-bold text-white">
                {user.firstName ? user.firstName[0] : 'Z'}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-display text-sm font-bold text-white truncate">
                  {user.firstName} {user.lastName}
                </h2>
                {user.isTelegram && (
                  <span className="w-2 h-2 rounded-full bg-[#269684]" title="Telegram Verified" />
                )}
              </div>
              <span className="text-xs text-[#9da7ba] font-mono truncate block">
                @{user.username || 'zhambyl_member'}
              </span>
            </div>
          </div>

          <button
            onClick={() => openModal('change-role')}
            className="btn-ghost-pill !py-1.5 !px-2.5 text-xs text-[#c7d3ea] hover:border-[#663af3] flex items-center gap-1.5 shrink-0"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#663af3]" />
            <span>{lang === 'ru' ? 'Роль' : 'Рөл'}</span>
          </button>
        </div>

        {/* Role & Skills Strip */}
        <div className="p-2.5 rounded-xl bg-[rgba(102,58,243,0.12)] border border-[rgba(102,58,243,0.25)] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <RoleBadge role={user.role} roleTitle={user.roleTitle} size="xs" />
            <span className="text-xs text-[#d1e4fa] truncate">
              {user.skillsOrInterest || 'Участник IT сообщества Жамбыл'}
            </span>
          </div>

          <span className="badge badge-teal text-[9px] font-mono shrink-0">
            СИНХРОНИЗИРОВАНО
          </span>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[rgba(186,215,247,0.08)]">
          <div className="text-center p-2 rounded-xl bg-[rgba(186,214,247,0.02)]">
            <span className="font-display text-base font-bold text-white block">
              {myRegistrations.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">
              {lang === 'ru' ? 'Моих записей' : 'Қатысуларым'}
            </span>
          </div>

          <div className="text-center p-2 rounded-xl bg-[rgba(186,214,247,0.02)]">
            <span className="font-display text-base font-bold text-white block">
              {userProjects.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">
              {lang === 'ru' ? 'Моих стартапов' : 'Жобаларым'}
            </span>
          </div>
        </div>

      </div>

      {/* 2. Subtabs: Registrations / My Projects */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.1)] w-full">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('registrations');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeProfileTab === 'registrations'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Мои мероприятия' : 'Іс-шараларым'} ({myRegistrations.length})</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('projects');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeProfileTab === 'projects'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Мои стартапы' : 'Жобалар'} ({userProjects.length})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* SUBTAB 1: EVENT REGISTRATIONS */}
      {activeProfileTab === 'registrations' && (
        <div className="space-y-3 pb-6">
          {myRegistrations.length === 0 ? (
            <div className="glass-card text-center p-8 space-y-2">
              <Calendar className="w-8 h-8 text-[#9da7ba] mx-auto opacity-60" />
              <p className="text-xs font-semibold text-white">
                {lang === 'ru' ? 'У вас пока нет активных записей' : 'Сізде әлі белсенді тіркелулер жоқ'}
              </p>
              <p className="text-[11px] text-[#9da7ba]">
                {lang === 'ru' ? 'Зарегистрируйтесь на хакатон или Pizza Pitch в разделе Мероприятия' : 'Іс-шаралар бөлімінде хакатон немесе Pizza Pitch-ке тіркеліңіз'}
              </p>
            </div>
          ) : (
            myRegistrations.map((reg) => (
              <div
                key={reg.id}
                onClick={() => handleOpenEvent(reg)}
                className="glass-card !p-4 cursor-pointer hover:border-[#663af3] transition-all space-y-3 relative group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="badge badge-teal text-[10px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{lang === 'ru' ? 'ВЫ ЗАРЕГИСТРИРОВАНЫ' : 'ТІРКЕЛДІҢІЗ'}</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#9da7ba]">
                    {reg.createdAt || '2026'}
                  </span>
                </div>

                <div>
                  <h4 className="font-display text-sm font-bold text-white group-hover:text-gradient-skywash transition-all">
                    {reg.eventTitle}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-[#9da7ba] mt-1">
                    <span>Участник: <strong className="text-white font-medium">{reg.attendeeName}</strong></span>
                    <span>·</span>
                    <span className="text-[#a78bfa]">{reg.registrationType === 'pitch_project' || reg.registrationType === 'pitch_team' ? 'Питч стартапа' : 'Слушатель'}</span>
                  </div>
                </div>

                {reg.projectName && (
                  <div className="p-2 rounded-xl bg-[rgba(102,58,243,0.12)] border border-[rgba(102,58,243,0.25)] text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <Rocket className="w-3.5 h-3.5 text-[#a78bfa] shrink-0" />
                      <span className="text-white font-medium truncate">{reg.projectName}</span>
                    </div>
                    {reg.pdfDeckUrl && (
                      <span className="badge badge-violet text-[9px] font-mono shrink-0">
                        PDF Deck
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-[11px]">
                  <span className="text-[#9da7ba] font-mono">
                    {reg.registrationType === 'pitch_team' || reg.registrationType === 'pitch_project' ? 'Питчинг проекта' : 'Участие в качестве слушателя'}
                  </span>
                  <span className="text-[#c7d3ea] font-semibold flex items-center gap-1 group-hover:text-white">
                    <span>{lang === 'ru' ? 'Подробнее' : 'Толығырақ'}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#663af3]" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* SUBTAB 2: MY PROJECTS */}
      {activeProfileTab === 'projects' && (
        <div className="space-y-3 pb-6">
          {userProjects.length === 0 ? (
            <div className="glass-card text-center p-8 space-y-2">
              <Rocket className="w-8 h-8 text-[#9da7ba] mx-auto opacity-60" />
              <p className="text-xs font-semibold text-white">Вы еще не добавили проекты</p>
              <p className="text-[11px] text-[#9da7ba]">Загрузите ваш PDF питч-дек для участия в питчингах Zhambyl Hub</p>
              <button
                onClick={() => openModal('submit-project')}
                className="btn-violet py-2 px-4 text-xs inline-flex items-center gap-1.5 mt-2"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Загрузить PDF питч-дек</span>
              </button>
            </div>
          ) : (
            userProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleOpenDeck(proj)}
                className="glass-card !p-3.5 cursor-pointer hover:border-[#663af3] transition-all space-y-2.5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.35)] flex items-center justify-center text-sm shrink-0">
                      {proj.logoIcon || '🚀'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display text-xs font-bold text-white truncate">
                        {proj.name}
                      </h4>
                      <span className="text-[10px] text-[#9da7ba] block truncate">
                        {proj.category} · {proj.stage}
                      </span>
                    </div>
                  </div>

                  <span className="badge badge-teal text-[10px] font-mono shrink-0">
                    {proj.status === 'pending' ? 'НА ПРОВЕРКЕ' : 'ОПУБЛИКОВАН'}
                  </span>
                </div>

                <p className="text-xs text-[#d1e4fa] line-clamp-2">
                  {proj.shortDesc}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-[11px] text-[#9da7ba]">
                  <span className="flex items-center gap-1 text-[#ffab91]">
                    <Star className="w-3 h-3 fill-[#ffab91]" />
                    <strong className="text-white font-bold">{proj.rating || '5.0'}</strong>
                  </span>

                  <span className="text-[#a78bfa] font-semibold flex items-center gap-1">
                    <span>Презентация</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. Telegram Channel & Support Link */}
      <div className="pt-2 pb-8">
        <button
          onClick={() => openTelegramLink('https://t.me/zhambylhub')}
          className="btn-ghost-pill w-full py-3 text-xs flex items-center justify-center gap-2 hover:border-[#663af3]"
        >
          <Send className="w-4 h-4 text-[#663af3]" />
          <span>Официальный Telegram-канал Zhambyl Hub</span>
        </button>
      </div>
    </div>
  );
};
