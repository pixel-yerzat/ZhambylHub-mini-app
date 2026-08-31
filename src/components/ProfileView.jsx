import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  QrCode, Rocket, History, Info, 
  MapPin, Send, ExternalLink, ShieldCheck, 
  Edit3, Database, Sparkles, Check 
} from 'lucide-react';
import { openTelegramLink, hapticFeedback } from '../utils/telegram';

export const ProfileView = () => {
  const { 
    user, 
    points, 
    myTickets, 
    projects, 
    pointHistory, 
    openModal, 
    lang 
  } = useApp();

  const [activeProfileTab, setActiveProfileTab] = useState('tickets');

  const userProjects = projects.filter(p => p.founder.includes(user.firstName) || p.founder.includes('Yerzat') || p.founderRole.includes('Team Lead') || p.founderRole.includes('Founder'));

  const handleOpenTicket = (ticket) => {
    hapticFeedback.impact('light');
    openModal('ticket', ticket);
  };

  const handleOpenDeck = (proj) => {
    hapticFeedback.impact('light');
    openModal('presentation', proj);
  };

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'founder':
        return { label: '🚀 Фаундер', class: 'badge-violet' };
      case 'investor':
        return { label: '💼 Инвестор', class: 'badge-amber' };
      case 'community':
        return { label: '🌟 Комьюнити', class: 'badge-blue' };
      case 'developer':
      default:
        return { label: '💻 Разработчик', class: 'badge-teal' };
    }
  };

  const roleInfo = getRoleBadgeStyle(user.role);

  return (
    <div className="space-y-4 pb-8 px-5 pt-4">
      {/* Profile Header Card */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.18)] flex items-center justify-center font-display text-xl font-medium text-white shrink-0 shadow-[0_0_20px_rgba(102,58,243,0.3)]">
              {user.firstName[0] || 'Z'}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-base font-semibold text-white truncate">
                  {user.firstName} {user.lastName}
                </h2>
                <ShieldCheck className="w-4 h-4 text-[#269684]" />
              </div>

              <p className="text-xs text-[#9da7ba] font-mono">@{user.username}</p>

              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className={`badge ${roleInfo.class} text-[11px]`}>
                  {roleInfo.label}
                </span>
                <span className="badge badge-violet text-[10px]">
                  Level 3 (Silver)
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => openModal('change-role')}
            className="btn-ghost-pill text-xs !py-1 !px-2.5 text-[#d8ecf8] shrink-0"
            title="Сменить роль"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#663af3]" />
            <span>Роль</span>
          </button>
        </div>

        {/* User Skills / Bio */}
        {user.skillsOrInterest && (
          <div className="text-xs text-[#c7d3ea] p-2.5 rounded-xl bg-[rgba(5,6,15,0.7)] border border-[rgba(186,215,247,0.08)]">
            <span className="text-[#9da7ba] text-[11px]">Фокус: </span>
            <span>{user.skillsOrInterest}</span>
          </div>
        )}

        {/* Supabase Status Pill */}
        <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-[11px] text-[#9da7ba]">
          <div className="flex items-center gap-1.5 text-[#80cbc4]">
            <Database className="w-3.5 h-3.5 text-[#269684]" />
            <span>Профиль синхронизирован с Supabase</span>
          </div>
          <span className="font-mono text-white font-semibold">TG #{user.id}</span>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgba(186,215,247,0.08)] text-center">
          <div>
            <span className="font-mono text-xs font-semibold text-[#a78bfa] block">
              {points.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono">
              Hub Points
            </span>
          </div>
          <div className="border-x border-[rgba(186,215,247,0.08)]">
            <span className="font-mono text-xs font-semibold text-white block">
              {myTickets.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono">
              {lang === 'ru' ? 'Билетов' : 'Билеттер'}
            </span>
          </div>
          <div>
            <span className="font-mono text-xs font-semibold text-[#d1e4fa] block">
              {userProjects.length}
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono">
              {lang === 'ru' ? 'Проектов' : 'Жобалар'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('tickets');
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeProfileTab === 'tickets'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Билеты' : 'Билеттер'} ({myTickets.length})</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('projects');
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeProfileTab === 'projects'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Проекты' : 'Жобалар'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('history');
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeProfileTab === 'history'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'История' : 'Тарих'}</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveProfileTab('about');
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1 ${
            activeProfileTab === 'about'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.35)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Hub info</span>
        </button>
      </div>

      {/* Tab 1: Tickets */}
      {activeProfileTab === 'tickets' && (
        <div className="space-y-3">
          {myTickets.length === 0 ? (
            <div className="glass-card p-8 text-center space-y-2">
              <QrCode className="w-7 h-7 text-[#9da7ba] mx-auto opacity-40" />
              <p className="text-sm font-semibold text-white">У вас пока нет активных билетов</p>
              <p className="text-xs text-[#9da7ba]">
                Зарегистрируйтесь на мероприятие в разделе «Ивенты»
              </p>
            </div>
          ) : (
            myTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => handleOpenTicket(ticket)}
                className="glass-card p-5 cursor-pointer transition-all active:scale-[0.99] space-y-2.5 group"
              >
                <div className="flex items-center justify-between">
                  <span className="badge badge-teal text-[10px]">
                    {ticket.role === 'project' ? '🚀 С проектом' : '👤 Участник'}
                  </span>
                  <span className="font-mono text-xs font-semibold text-[#80cbc4]">
                    {ticket.ticketNumber}
                  </span>
                </div>

                <h4 className="font-display text-sm font-semibold text-white leading-snug">
                  {ticket.eventTitle}
                </h4>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-xs text-[#9da7ba]">
                  <span>{ticket.eventDate}</span>
                  <span className="text-[#d8ecf8] font-medium flex items-center gap-1">
                    <QrCode className="w-3 h-3 text-[#663af3]" />
                    <span>Показать QR</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Projects */}
      {activeProfileTab === 'projects' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-xs font-semibold text-white uppercase">
              {lang === 'ru' ? 'Ваши проекты' : 'Жобаларыңыз'}
            </h3>
            <button
              onClick={() => openModal('submit-project')}
              className="btn-ghost-pill text-xs !py-1 !px-2.5 text-[#d8ecf8]"
            >
              + Добавить
            </button>
          </div>

          {userProjects.length === 0 ? (
            <div className="glass-card p-8 text-center space-y-2">
              <Rocket className="w-7 h-7 text-[#9da7ba] mx-auto opacity-40" />
              <p className="text-sm font-semibold text-white">Вы еще не добавили проекты</p>
              <p className="text-xs text-[#9da7ba]">
                Подайте проект и получите +150 Hub Points!
              </p>
            </div>
          ) : (
            userProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => handleOpenDeck(proj)}
                className="glass-card p-4 cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{proj.logoIcon}</span>
                    <div>
                      <h4 className="font-display text-sm font-semibold text-white">{proj.name}</h4>
                      <p className="text-xs text-[#9da7ba]">{proj.tag} · {proj.stage}</p>
                    </div>
                  </div>
                  <span className="badge badge-violet text-[10px]">
                    {proj.presentation?.slidesCount || 4} слайда
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-xs">
                  <span className="text-[#ffab91]">★ {proj.rating} ({proj.reviewsCount})</span>
                  <span className="text-[#d8ecf8]">Смотреть презентацию →</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeProfileTab === 'history' && (
        <div className="space-y-2.5">
          <div className="glass-card divide-y divide-[rgba(186,215,247,0.08)]">
            {pointHistory.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3.5">
                <div>
                  <p className="text-xs font-semibold text-white">{tx.description}</p>
                  <p className="text-[10px] text-[#9da7ba] font-mono">{tx.date}</p>
                </div>
                <span className={`font-mono text-xs font-bold ${
                  tx.type === 'plus' ? 'text-[#80cbc4]' : 'text-[#ffab91]'
                }`}>
                  {tx.type === 'plus' ? `+${tx.amount}` : tx.amount} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: About */}
      {activeProfileTab === 'about' && (
        <div className="glass-card p-5 space-y-3.5 text-xs">
          <div>
            <h3 className="font-display text-sm font-semibold text-gradient-skywash mb-1">
              Zhambyl Hub — Региональный IT-Хаб
            </h3>
            <p className="text-[#c7d3ea] leading-relaxed">
              Официальное представительство Astana Hub в Жамбылской области. Развиваем стартапы, хакатоны и сообщество инноваторов в Таразе.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-[rgba(186,215,247,0.08)]">
            <div className="flex items-start gap-2 text-[#d1e4fa]">
              <MapPin className="w-3.5 h-3.5 text-[#269684] shrink-0 mt-0.5" />
              <span>г. Тараз, проспект Төле би, 45</span>
            </div>
            <div className="flex items-start gap-2 text-[#d1e4fa]">
              <Send className="w-3.5 h-3.5 text-[#027dea] shrink-0 mt-0.5" />
              <span>Telegram: @zhambyl_hub</span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => openTelegramLink('https://t.me/zhambyl_hub')}
              className="w-full btn-ghost-pill text-xs !py-2 text-white justify-center"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Открыть Telegram-канал</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
