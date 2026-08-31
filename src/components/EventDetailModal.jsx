import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Calendar, Clock, MapPin, Sparkles, Trophy, 
  Users, CheckCircle2, Rocket, Presentation, ChevronRight 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const EventDetailModal = () => {
  const { 
    modalData, 
    closeModal, 
    registerForEvent, 
    myTickets, 
    projects, 
    openModal, 
    user, 
    lang 
  } = useApp();
  
  const event = modalData;

  const [role, setRole] = useState('listener');
  const [attendeeName, setAttendeeName] = useState(`${user.firstName} ${user.lastName}`.trim());
  const [attendeePhone, setAttendeePhone] = useState('+7 (7');
  const [projectName, setProjectName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  if (!event) return null;

  const isAlreadyRegistered = myTickets.some(t => t.eventId === event.id);
  const myTicket = myTickets.find(t => t.eventId === event.id);

  const eventProjects = event.hasProjects
    ? projects.filter(p => event.participatingProjects?.includes(p.id))
    : [];

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const result = registerForEvent(event, {
      role,
      attendeeName,
      attendeePhone,
      projectName: role === 'project' ? projectName : null,
      projectId: role === 'project' ? selectedProjectId : null
    });

    if (result) {
      closeModal();
      setTimeout(() => {
        openModal('ticket', result);
      }, 300);
    }
  };

  const openDeck = (proj) => {
    openModal('presentation', proj);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-md max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(186,215,247,0.12)]">
          <div className="flex items-center gap-2">
            <span className={`badge ${event.hasProjects ? 'badge-violet' : 'badge-teal'}`}>
              {event.hasProjects ? 'Pitch Day & Projects' : 'Workshop & Meetup'}
            </span>
          </div>
          <button
            onClick={closeModal}
            className="btn-ghost-pill !p-1.5 text-[#c7d3ea]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Event Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Main Info Card */}
          <div className="glass-card p-5 space-y-3">
            <h2 className="font-display text-lg font-semibold text-white leading-snug">
              {lang === 'ru' ? event.title : (event.titleKz || event.title)}
            </h2>
            
            <p className="text-xs text-[#c7d3ea] leading-relaxed">
              {lang === 'ru' ? event.shortDesc : (event.shortDescKz || event.shortDesc)}
            </p>

            {/* Quick Metadata */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[rgba(186,215,247,0.08)] text-xs">
              <div className="flex items-center gap-1.5 text-[#d1e4fa]">
                <Calendar className="w-3.5 h-3.5 text-[#663af3]" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#d1e4fa]">
                <Clock className="w-3.5 h-3.5 text-[#027dea]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[#a78bfa] font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>+{event.rewardPoints} pts</span>
              </div>
            </div>
          </div>

          {/* Location & Prize */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass-card p-3">
              <span className="text-[10px] text-[#9da7ba] uppercase font-mono">{lang === 'ru' ? 'Локация' : 'Орны'}</span>
              <p className="text-xs text-white font-medium mt-0.5 truncate">{event.locationShort}</p>
            </div>

            <div className="glass-card p-3">
              <span className="text-[10px] text-[#9da7ba] uppercase font-mono">{lang === 'ru' ? 'Призовой фонд' : 'Жүлде'}</span>
              <p className="text-xs text-[#d8ecf8] font-medium mt-0.5 truncate">{event.prizePool}</p>
            </div>
          </div>

          {/* Description */}
          <div className="glass-card p-4 space-y-2">
            <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
              {lang === 'ru' ? 'О мероприятии' : 'Шара туралы'}
            </h4>
            <p className="text-xs text-[#c7d3ea] whitespace-pre-line leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Participating Projects & Pitch Decks */}
          {event.hasProjects && (
            <div className="glass-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                  {lang === 'ru' ? 'Проекты на защите' : 'Питчингтегі жобалар'} ({eventProjects.length})
                </h4>
                <span className="badge badge-violet text-[10px]">
                  Питч-деки
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {eventProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.08)]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg">{proj.logoIcon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{proj.name}</p>
                        <p className="text-[10px] text-[#9da7ba] truncate">{proj.founder}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => openDeck(proj)}
                      className="btn-ghost-pill text-xs !py-1 !px-2.5 text-[#d8ecf8]"
                    >
                      <Presentation className="w-3 h-3 text-[#663af3]" />
                      <span>{lang === 'ru' ? 'Слайды' : 'Слайд'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agenda */}
          {event.agenda && (
            <div className="glass-card p-4 space-y-2">
              <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                {lang === 'ru' ? 'Программа' : 'Бағдарлама'}
              </h4>
              <div className="space-y-2 pt-1">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className="font-mono text-[10px] text-[#663af3] bg-[rgba(102,58,243,0.1)] px-1.5 py-0.5 rounded border border-[rgba(102,58,243,0.2)] shrink-0">
                      {item.time}
                    </span>
                    <span className="text-[#d1e4fa] mt-0.5">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registration Section */}
          <div className="glass-card p-4 space-y-3">
            {isAlreadyRegistered ? (
              <div className="text-center py-2 space-y-2">
                <div className="w-8 h-8 rounded-full bg-[rgba(38,150,132,0.2)] border border-[rgba(38,150,132,0.4)] flex items-center justify-center mx-auto text-[#80cbc4]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white">
                  {lang === 'ru' ? 'Вы зарегистрированы!' : 'Сіз тіркелдіңіз!'}
                </h4>
                <p className="text-xs text-[#9da7ba]">
                  Билет: {myTicket?.ticketNumber}
                </p>
                <button
                  onClick={() => {
                    closeModal();
                    openModal('ticket', myTicket);
                  }}
                  className="btn-violet text-xs py-2 px-4 mt-1"
                >
                  {lang === 'ru' ? 'Показать QR-билет' : 'QR-билетті көрсету'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                  {lang === 'ru' ? 'Регистрация на участие' : 'Қатысуға тіркелу'}
                </h4>

                {/* Role Picker */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('listener')}
                    className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                      role === 'listener'
                        ? 'bg-[rgba(102,58,243,0.18)] border-[#663af3] text-white'
                        : 'bg-[rgba(186,214,247,0.03)] border-[rgba(186,215,247,0.12)] text-[#9da7ba]'
                    }`}
                  >
                    <p className="font-semibold text-white">👤 Слушатель</p>
                    <p className="text-[10px] text-[#9da7ba]">Свободный вход</p>
                  </button>

                  {event.hasProjects && (
                    <button
                      type="button"
                      onClick={() => setRole('project')}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left ${
                        role === 'project'
                          ? 'bg-[rgba(102,58,243,0.18)] border-[#663af3] text-white'
                          : 'bg-[rgba(186,214,247,0.03)] border-[rgba(186,215,247,0.12)] text-[#9da7ba]'
                      }`}
                    >
                      <p className="font-semibold text-white">🚀 С проектом</p>
                      <p className="text-[10px] text-[#9da7ba]">Защита на сцене</p>
                    </button>
                  )}
                </div>

                {role === 'project' && (
                  <div>
                    <label className="text-[11px] text-[#9da7ba]">Название проекта:</label>
                    <input
                      type="text"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Например: Taraz Smart Agro"
                      className="glass-input text-xs mt-1"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[#9da7ba]">Имя:</label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      className="glass-input text-xs mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#9da7ba]">Телефон:</label>
                    <input
                      type="tel"
                      required
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      className="glass-input text-xs mt-1"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-violet text-xs py-2.5 font-semibold mt-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Зарегистрироваться (+{event.rewardPoints} pts)</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
