import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, QrCode, Copy, ShieldCheck 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const TicketModal = () => {
  const { modalData, closeModal, lang, showToast } = useApp();
  const ticket = modalData;
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const copyTicketCode = () => {
    hapticFeedback.impact('light');
    navigator.clipboard?.writeText?.(ticket.ticketNumber);
    setCopied(true);
    showToast('Номер билета скопирован', ticket.ticketNumber);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-sm flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(186,215,247,0.12)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#269684]" />
            <span className="text-xs font-mono font-medium text-white uppercase tracking-wider">
              {lang === 'ru' ? 'Электронный билет' : 'Электронды билет'}
            </span>
          </div>
          <button
            onClick={closeModal}
            className="btn-ghost-pill !p-1.5 text-[#c7d3ea]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket Container */}
        <div className="p-4 space-y-3">
          <div className="glass-card ticket-shimmer p-5 relative overflow-hidden space-y-3">
            
            {/* Top Brand & Status */}
            <div className="flex items-center justify-between border-b border-[rgba(186,215,247,0.08)] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] flex items-center justify-center font-display text-[10px] text-[#d8ecf8]">
                  Z
                </div>
                <span className="font-display text-xs font-medium text-white">Zhambyl Hub</span>
              </div>

              <span className="badge badge-teal text-[10px] font-mono">
                АКТИВЕН
              </span>
            </div>

            {/* Event Title */}
            <div>
              <span className="badge badge-violet text-[10px]">
                {ticket.role === 'project' ? '🚀 С проектом' : '👤 Участник'}
              </span>
              <h3 className="font-display text-sm font-semibold text-white leading-snug pt-1">
                {ticket.eventTitle}
              </h3>
              {ticket.projectName && (
                <p className="text-xs text-[#a78bfa] mt-0.5">
                  Проект: «{ticket.projectName}»
                </p>
              )}
            </div>

            {/* Date & Location */}
            <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-[rgba(5,6,15,0.7)] border border-[rgba(186,215,247,0.08)]">
              <div>
                <p className="text-[10px] text-[#9da7ba] uppercase font-mono">Дата & Время</p>
                <p className="text-white font-medium mt-0.5">{ticket.eventDate}</p>
                <p className="text-[11px] text-[#c7d3ea]">{ticket.eventTime}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#9da7ba] uppercase font-mono">Локация</p>
                <p className="text-white font-medium mt-0.5 truncate">{ticket.location}</p>
              </div>
            </div>

            {/* SVG QR Code */}
            <div className="flex flex-col items-center justify-center p-3.5 bg-white rounded-xl shadow-[0_0_20px_rgba(102,58,243,0.2)]">
              <svg 
                viewBox="0 0 100 100" 
                className="w-36 h-36 text-[#05060f]"
                fill="currentColor"
              >
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#05060f" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="13" width="10" height="10" rx="2" fill="#663af3" />

                <rect x="69" y="5" width="26" height="26" rx="4" fill="#05060f" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="77" y="13" width="10" height="10" rx="2" fill="#663af3" />

                <rect x="5" y="69" width="26" height="26" rx="4" fill="#05060f" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="#ffffff" />
                <rect x="13" y="77" width="10" height="10" rx="2" fill="#663af3" />

                <rect x="36" y="8" width="6" height="6" rx="1.5" />
                <rect x="46" y="8" width="6" height="6" rx="1.5" />
                <rect x="56" y="14" width="6" height="6" rx="1.5" />
                <rect x="36" y="22" width="6" height="6" rx="1.5" />
                <rect x="48" y="24" width="6" height="6" rx="1.5" />

                <rect x="8" y="38" width="6" height="6" rx="1.5" />
                <rect x="18" y="44" width="6" height="6" rx="1.5" />
                <rect x="8" y="52" width="6" height="6" rx="1.5" />

                <rect x="38" y="38" width="24" height="24" rx="4" fill="#663af3" />
                <rect x="43" y="43" width="14" height="14" rx="2" fill="#ffffff" />
                <rect x="47" y="47" width="6" height="6" rx="1" fill="#663af3" />

                <rect x="68" y="38" width="6" height="6" rx="1.5" />
                <rect x="82" y="44" width="6" height="6" rx="1.5" />
                <rect x="74" y="54" width="6" height="6" rx="1.5" />

                <rect x="36" y="68" width="6" height="6" rx="1.5" />
                <rect x="48" y="72" width="6" height="6" rx="1.5" />
                <rect x="58" y="80" width="6" height="6" rx="1.5" />
                <rect x="70" y="70" width="6" height="6" rx="1.5" />
                <rect x="82" y="82" width="6" height="6" rx="1.5" />
              </svg>

              <span className="font-mono text-[11px] font-bold text-[#05060f] tracking-widest mt-1.5">
                {ticket.ticketNumber}
              </span>
            </div>

            {/* Attendee Info Footer */}
            <div className="pt-2 border-t border-dashed border-[rgba(186,215,247,0.12)] flex items-center justify-between text-xs">
              <div>
                <p className="text-[10px] text-[#9da7ba]">Гость:</p>
                <p className="font-semibold text-white truncate">{ticket.attendeeName}</p>
              </div>
              <button
                onClick={copyTicketCode}
                className="btn-ghost-pill text-xs !py-1 !px-2"
              >
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Скопировано' : 'Код билета'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
