import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Rocket, Info, MapPin, Send, 
  ExternalLink, ShieldCheck, Edit3, Database, 
  ShieldAlert, CheckCircle2, FileText, ChevronRight, 
  Briefcase, Sparkles, Code2, Star 
} from 'lucide-react';
import { openTelegramLink, hapticFeedback } from '../utils/telegram';
import { ModeratorView } from './ModeratorView';

export const ProfileView = () => {
  const { 
    user, 
    myRegistrations, 
    projects, 
    openModal, 
    lang 
  } = useApp();

  const isModerator = user.role === 'moderator';
  const [activeProfileTab, setActiveProfileTab] = useState(isModerator ? 'moderation' : 'registrations');

  const userProjects = projects.filter(p => p.founder?.includes(user.firstName) || p.founderId === user.id || p.founder?.includes('Yerzat'));

  const handleOpenDeck = (proj) => {
    hapticFeedback.impact('light');
    openModal('presentation', proj);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'moderator':
        return (
          <span className="badge badge-violet text-[11px] flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Модератор Hub</span>
          </span>
        );
      case 'founder':
        return (
          <span className="badge badge-violet text-[11px] flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>Фаундер</span>
          </span>
        );
      case 'investor':
        return (
          <span className="badge badge-amber text-[11px] flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#ffab91]" />
            <span>Инвестор</span>
          </span>
        );
      case 'community':
        return (
          <span className="badge badge-blue text-[11px] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#90caf9]" />
            <span>Комьюнити</span>
          </span>
        );
      case 'developer':
      default:
        return (
          <span className="badge badge-teal text-[11px] flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-[#80cbc4]" />
            <span>Разработчик</span>
          </span>
        );
    }
  };

  return (
    <div className="app-main-content">
      {/* 1. Main Profile Card with Explicit Margins */}
      <div 
        className="glass-card" 
        style={{ 
          marginBottom: '26px', 
          padding: '24px', 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.4)] flex items-center justify-center font-display text-2xl font-bold text-white shrink-0 shadow-[0_0_18px_rgba(102,58,243,0.35)]">
              {user.firstName ? user.firstName[0] : 'Z'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base font-bold text-white truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <ShieldCheck className="w-4 h-4 text-[#269684]" />
              </div>

              <p className="text-xs text-[#9da7ba] font-mono mt-0.5">@{user.username}</p>

              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {getRoleBadge(user.role)}
                <span className="badge badge-violet text-[10px]">
                  {isModerator ? 'Staff Access' : 'Zhambyl Resident'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => openModal('change-role')}
            className="btn-ghost-pill text-xs !py-1.5 !px-3 text-[#d8ecf8] shrink-0"
            title="Сменить роль"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#663af3]" />
            <span>Роль</span>
          </button>
        </div>

        {/* User Skills / Bio */}
        {user.skillsOrInterest && (
          <div className="text-xs text-[#c7d3ea] p-3 rounded-xl bg-[rgba(5,6,15,0.7)] border border-[rgba(186,215,247,0.08)]">
            <span className="text-[#9da7ba] text-[11px]">Фокус: </span>
            <span className="text-white font-medium">{user.skillsOrInterest}</span>
          </div>
        )}

        {/* Supabase Status Pill */}
        <div className="flex items-center justify-between pt-3 border-t border-[rgba(186,215,247,0.08)] text-[11px] text-[#9da7ba]">
          <div className="flex items-center gap-1.5 text-[#80cbc4]">
            <Database className="w-3.5 h-3.5 text-[#269684]" />
            <span>Синхронизировано с Supabase</span>
          </div>
          <span className="font-mono text-white font-semibold">TG #{user.id}</span>
        </div>

        {/* Mini Stats Counter */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[rgba(186,215,247,0.08)] text-center">
          <div>
            <span className="font-mono text-base font-bold text-white block">
              {myRegistrations?.length || 0}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono tracking-wider">
              {lang === 'ru' ? 'Регистраций' : 'Тіркелулер'}
            </span>
          </div>
          <div className="border-l border-[rgba(186,215,247,0.08)]">
            <span className="font-mono text-base font-bold text-[#d1e4fa] block">
              {userProjects.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono tracking-wider">
              {lang === 'ru' ? 'Стартапов' : 'Жобалар'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs with Guaranteed Margins */}
      <div 
        className="w-full no-scrollbar"
        style={{ 
          marginBottom: '26px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px', 
          borderRadius: '18px', 
          background: 'rgba(186, 214, 247, 0.06)', 
          border: '1px solid rgba(186, 215, 247, 0.12)',
          overflowX: 'auto'
        }}
      >
        {isModerator && (
          <button
            onClick={() => {
              hapticFeedback.selection();
              setActiveProfileTab('moderation');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeProfileTab === 'moderation'
                ? 'bg-[#663af3] text-white shadow-[0_0_14px_rgba(102,58,243,0.5)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Модерация</span>
          </button>
        )}

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('registrations');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeProfileTab === 'registrations'
              ? 'bg-[#663af3] text-white shadow-[0_0_14px_rgba(102,58,243,0.5)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Мои записи' : 'Шаралар'} ({myRegistrations?.length || 0})</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('projects');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeProfileTab === 'projects'
              ? 'bg-[#663af3] text-white shadow-[0_0_14px_rgba(102,58,243,0.5)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Стартапы' : 'Жобалар'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('about');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeProfileTab === 'about'
              ? 'bg-[#663af3] text-white shadow-[0_0_14px_rgba(102,58,243,0.5)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Hub info</span>
        </button>
      </div>

      {/* 3. Tab Contents with Guaranteed Vertical Spacing */}
      <div className="w-full" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Tab: Moderator Panel */}
        {isModerator && activeProfileTab === 'moderation' && (
          <ModeratorView />
        )}

        {/* Tab 1: Event Registrations */}
        {activeProfileTab === 'registrations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
            {(!myRegistrations || myRegistrations.length === 0) ? (
              <div className="glass-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
                <Calendar className="w-8 h-8 text-[#9da7ba] mx-auto opacity-40 mb-3" />
                <p className="text-sm font-semibold text-white mb-1">Вы еще не записались на мероприятия</p>
                <p className="text-xs text-[#9da7ba]">
                  Выберите Pizza Pitch, хакатон или воркшоп в разделе «Ивенты»
                </p>
              </div>
            ) : (
              myRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="glass-card"
                  style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}
                >
                  <div className="flex items-center justify-between">
                    <span className={`badge ${reg.registration_type === 'pitch_project' || reg.registrationType === 'pitch_project' ? 'badge-violet' : 'badge-teal'} text-[10px] flex items-center gap-1.5`}>
                      {reg.registration_type === 'pitch_project' || reg.registrationType === 'pitch_project' ? <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#269684]" />}
                      <span>{reg.registration_type === 'pitch_project' || reg.registrationType === 'pitch_project' ? 'С защитой проекта' : 'Участник'}</span>
                    </span>
                    <span className="badge badge-teal text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#269684]" />
                      <span>Зарегистрирован</span>
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-white leading-snug">
                    {reg.event_title || reg.eventTitle}
                  </h4>

                  {(reg.project_name || reg.projectName) && (
                    <div className="p-3.5 rounded-xl bg-[rgba(102,58,243,0.08)] border border-[rgba(102,58,243,0.2)] text-xs text-[#c7d3ea] space-y-1">
                      <p className="font-semibold text-white">
                        Проект: {reg.project_name || reg.projectName}
                      </p>
                      {(reg.team_members || reg.teamMembers) && (
                        <p className="text-[11px] text-[#9da7ba]">
                          Команда: {reg.team_members || reg.teamMembers}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(186,215,247,0.08)] text-xs text-[#9da7ba]">
                    <span>Уведомление придет в @{user.username}</span>
                    <span className="text-[#80cbc4] font-medium">Статус подтвержден</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Projects */}
        {activeProfileTab === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
            <div className="flex items-center justify-between px-1 mb-1">
              <h3 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                {lang === 'ru' ? 'Ваши проекты' : 'Жобаларыңыз'}
              </h3>
              <button
                onClick={() => openModal('submit-project')}
                className="btn-ghost-pill text-xs !py-1.5 !px-3 text-[#d8ecf8]"
              >
                + Добавить
              </button>
            </div>

            {userProjects.length === 0 ? (
              <div className="glass-card" style={{ padding: '32px 20px', textAlign: 'center' }}>
                <Rocket className="w-8 h-8 text-[#9da7ba] mx-auto opacity-40 mb-3" />
                <p className="text-sm font-semibold text-white mb-1">Вы еще не добавили проекты</p>
                <p className="text-xs text-[#9da7ba]">
                  Загрузите свой PDF питч-дек в каталог стартапов
                </p>
              </div>
            ) : (
              userProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenDeck(proj)}
                  className="glass-card cursor-pointer transition-all"
                  style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.14)] flex items-center justify-center text-white shrink-0">
                        <Rocket className="w-5 h-5 text-[#663af3]" />
                      </div>
                      <div>
                        <h4 className="font-display text-base font-bold text-white">{proj.name}</h4>
                        <p className="text-xs text-[#9da7ba]">{proj.tag} · {proj.stage}</p>
                      </div>
                    </div>
                    <span className="badge badge-violet text-[10px]">
                      PDF Презентация
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[rgba(186,215,247,0.08)] text-xs">
                    <span className="text-[#ffab91] flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#ffab91]" />
                      <span>{proj.rating} ({proj.reviewsCount})</span>
                    </span>
                    <span className="text-[#d8ecf8] font-medium">Смотреть PDF дек →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: About */}
        {activeProfileTab === 'about' && (
          <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <h3 className="font-display text-base font-bold text-gradient-skywash mb-2">
                Zhambyl Hub — Региональный IT-Хаб
              </h3>
              <p className="text-xs text-[#c7d3ea] leading-relaxed">
                Официальное представительство Astana Hub в Жамбылской области. Развиваем стартапы, хакатоны и сообщество инноваторов в Таразе.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[rgba(186,215,247,0.08)] text-xs">
              <div className="flex items-start gap-2.5 text-[#d1e4fa]">
                <MapPin className="w-4 h-4 text-[#269684] shrink-0 mt-0.5" />
                <span>г. Тараз, проспект Төле би, 45</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#d1e4fa]">
                <Send className="w-4 h-4 text-[#027dea] shrink-0 mt-0.5" />
                <span>Telegram: @zhambyl_hub</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => openTelegramLink('https://t.me/zhambyl_hub')}
                className="w-full btn-ghost-pill text-xs !py-3 text-white justify-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Открыть Telegram-канал</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
