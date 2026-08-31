import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, CheckCircle2, XCircle, FileText, 
  Calendar, Rocket, Plus, Eye, Check, X 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const ModeratorView = () => {
  const { 
    projects, 
    events, 
    approveProject, 
    rejectProject, 
    approveEvent, 
    rejectEvent, 
    openModal, 
    lang 
  } = useApp();

  const [activeModTab, setActiveModTab] = useState('projects');

  const pendingProjects = projects.filter(p => p.status === 'pending');
  const allProjects = projects;
  const pendingEvents = events.filter(e => e.status === 'pending');

  const handleApproveProject = (id) => {
    hapticFeedback.impact('heavy');
    approveProject(id);
  };

  const handleRejectProject = (id) => {
    hapticFeedback.impact('medium');
    rejectProject(id);
  };

  const handleOpenDeck = (proj) => {
    openModal('presentation', proj);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* 1. Moderator Header Banner */}
      <div 
        className="glass-card"
        style={{ 
          marginBottom: '20px', 
          padding: '18px 20px', 
          background: 'rgba(102, 58, 243, 0.14)', 
          border: '1px solid rgba(102, 58, 243, 0.35)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: '0 0 20px rgba(102, 58, 243, 0.15)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#663af3] text-white flex items-center justify-center text-sm font-bold shadow-[0_0_12px_rgba(102,58,243,0.5)] shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-white">Панель Модератора Hub</h3>
            <p className="text-[11px] text-[#c7d3ea] mt-0.5">Проверка PDF-деков и публикация ивентов</p>
          </div>
        </div>

        <button
          onClick={() => openModal('create-event')}
          className="btn-violet text-xs !py-2 !px-3.5 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ивент</span>
        </button>
      </div>

      {/* 2. Switcher Tabs */}
      <div 
        style={{ 
          marginBottom: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px', 
          borderRadius: '18px', 
          background: 'rgba(186, 214, 247, 0.06)', 
          border: '1px solid rgba(186, 215, 247, 0.12)' 
        }}
      >
        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveModTab('projects');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeModTab === 'projects'
              ? 'bg-[#663af3] text-white shadow-[0_0_14px_rgba(102,58,243,0.5)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Стартапы & PDF ({pendingProjects.length})</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveModTab('events');
          }}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeModTab === 'events'
              ? 'bg-[#663af3] text-white shadow-[0_0_14px_rgba(102,58,243,0.5)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Ивенты ({pendingEvents.length})</span>
        </button>
      </div>

      {/* 3. Content: Projects Moderation Cards */}
      {activeModTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
          {pendingProjects.length === 0 ? (
            <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
              <CheckCircle2 className="w-10 h-10 text-[#80cbc4] mx-auto opacity-80 mb-3" />
              <p className="text-sm font-semibold text-white mb-1">Все стартапы проверены!</p>
              <p className="text-xs text-[#9da7ba]">Нет новых проектов, ожидающих модерации.</p>
            </div>
          ) : (
            pendingProjects.map((proj) => (
              <div 
                key={proj.id} 
                className="glass-card"
                style={{ 
                  padding: '22px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '14px', 
                  borderLeft: '4px solid #663af3' 
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="badge badge-amber text-[10px] mb-2">
                      Ожидает проверки PDF
                    </span>
                    <h4 className="font-display text-base font-bold text-white truncate mt-1">
                      {proj.name}
                    </h4>
                    <p className="text-xs text-[#9da7ba] truncate mt-0.5">
                      {proj.founder || proj.founder_name} · <span className="text-[#80cbc4]">{proj.category}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenDeck(proj)}
                    className="btn-ghost-pill text-xs !py-1.5 !px-3 text-[#d8ecf8] flex items-center gap-1.5 shrink-0"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#663af3]" />
                    <span>Смотреть PDF</span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-[#c7d3ea] leading-relaxed">
                  {proj.shortDesc}
                </p>

                {/* Actions Footer */}
                <div className="flex items-center justify-between pt-3.5 border-t border-[rgba(186,215,247,0.1)] text-xs">
                  <span className="text-[11px] text-[#9da7ba] font-mono truncate max-w-[140px]">
                    {proj.pdfDeckName || 'pitch_deck.pdf'}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => handleRejectProject(proj.id)}
                      className="py-2 px-3.5 rounded-full text-xs font-semibold bg-[rgba(228,109,76,0.15)] text-[#ffab91] hover:bg-[rgba(228,109,76,0.28)] transition-all flex items-center gap-1 active:scale-95"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Отклонить</span>
                    </button>

                    <button
                      onClick={() => handleApproveProject(proj.id)}
                      className="btn-violet text-xs !py-2 !px-4 font-semibold flex items-center gap-1 active:scale-95"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Одобрить</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content: Events Moderation Cards */}
      {activeModTab === 'events' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
          {pendingEvents.length === 0 ? (
            <div className="glass-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
              <CheckCircle2 className="w-10 h-10 text-[#80cbc4] mx-auto opacity-80 mb-3" />
              <p className="text-sm font-semibold text-white mb-1">Все мероприятия проверены!</p>
              <p className="text-xs text-[#9da7ba]">Нет событий, ожидающих публикации.</p>
            </div>
          ) : (
            pendingEvents.map((ev) => (
              <div 
                key={ev.id} 
                className="glass-card"
                style={{ 
                  padding: '22px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '14px', 
                  borderLeft: '4px solid #269684' 
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="badge badge-teal text-[10px] mb-2">
                      {ev.categoryName || 'Ивент'}
                    </span>
                    <h4 className="font-display text-base font-bold text-white leading-snug mt-1">
                      {ev.title}
                    </h4>
                    <p className="text-xs text-[#9da7ba] mt-0.5">{ev.date} · {ev.locationShort}</p>
                  </div>
                </div>

                <p className="text-xs text-[#c7d3ea] leading-relaxed">
                  {ev.shortDesc}
                </p>

                <div className="flex items-center justify-end gap-2.5 pt-3.5 border-t border-[rgba(186,215,247,0.1)]">
                  <button
                    onClick={() => {
                      hapticFeedback.impact('medium');
                      rejectEvent(ev.id);
                    }}
                    className="py-2 px-3.5 rounded-full text-xs font-semibold bg-[rgba(228,109,76,0.15)] text-[#ffab91] hover:bg-[rgba(228,109,76,0.28)] flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Отклонить</span>
                  </button>

                  <button
                    onClick={() => {
                      hapticFeedback.impact('heavy');
                      approveEvent(ev.id);
                    }}
                    className="btn-violet text-xs !py-2 !px-4 font-semibold flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Опубликовать</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
