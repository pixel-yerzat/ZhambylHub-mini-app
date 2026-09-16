import React, { useState } from 'react';
import { useApp } from '@/context';
import { 
  QrCode, Copy, ShieldCheck 
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';
import { ModalStackSheet } from '@/components/common/ModalStackSheet';

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
    <ModalStackSheet
      onClose={closeModal}
      maxWidth="max-w-sm"
      title={lang === 'ru' ? 'Электронный билет' : 'Электронды билет'}
      icon={ShieldCheck}
    >
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

          {/* Event Name */}
          <div>
            <span className="text-[10px] font-mono text-[#9da7ba] uppercase block mb-0.5">
              Мероприятие
            </span>
            <h3 className="font-display text-base font-bold text-white leading-snug">
              {ticket.eventTitle}
            </h3>
          </div>

          {/* Attendee Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs border-y border-[rgba(186,215,247,0.08)] py-2.5">
            <div>
              <span className="text-[9px] text-[#9da7ba] uppercase font-mono block">Участник</span>
              <span className="font-semibold text-white truncate block">{ticket.attendeeName}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#9da7ba] uppercase font-mono block">Тип участия</span>
              <span className="font-semibold text-[#a78bfa] truncate block">
                {ticket.registrationType === 'pitch_project' ? 'Питч стартапа' : 'Слушатель'}
              </span>
            </div>
          </div>

          {/* QR Code for Check-in */}
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="p-3 rounded-2xl bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <QrCode className="w-32 h-32" />
            </div>
            <p className="text-[10px] font-mono text-[#9da7ba] text-center">
              Покажите QR-код администратору на входе в Hub
            </p>
          </div>

          {/* Ticket Code with Copy */}
          <div 
            onClick={copyTicketCode}
            className="flex items-center justify-between p-2.5 rounded-xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.1)] cursor-pointer hover:border-[#663af3]/50 transition-all"
          >
            <div className="min-w-0">
              <span className="text-[9px] text-[#9da7ba] uppercase font-mono block">Код билета</span>
              <span className="font-mono text-xs font-bold text-white tracking-widest truncate block">
                {ticket.ticketNumber}
              </span>
            </div>
            <button className="btn-ghost-pill !p-1 text-[#c7d3ea]">
              {copied ? <ShieldCheck className="w-3.5 h-3.5 text-[#269684]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

        </div>

        <button
          onClick={closeModal}
          className="btn-violet w-full py-2.5 text-xs font-semibold mb-6"
        >
          Закрыть
        </button>
      </div>
    </ModalStackSheet>
  );
};
