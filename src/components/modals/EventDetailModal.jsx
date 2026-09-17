import React, { useState, useRef } from 'react';
import { useApp } from '@/context';
import { 
  Calendar, Clock, MapPin, Users, Rocket, 
  FileText, CheckCircle2, ChevronRight, UploadCloud, 
  Trash2, AlertTriangle, Send, Sparkles, XCircle 
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';
import { uploadPitchDeckPdfToSupabase } from '@/services/supabase';
import { FILE_LIMITS } from '@/constants/app';
import { ModalStackSheet } from '@/components/common/ModalStackSheet';

export const EventDetailModal = () => {
  const { 
    modalData: event, 
    closeModal, 
    user, 
    myRegistrations, 
    registerForEvent, 
    projects, 
    openModal, 
    lang 
  } = useApp();

  const fileInputRef = useRef(null);

  const [isRegistering, setIsRegistering] = useState(false);
  const [regType, setRegType] = useState(event?.hasProjects ? 'pitch_project' : 'listener');

  // Registration Form
  const [regForm, setRegForm] = useState({
    attendeeName: `${user.firstName} ${user.lastName}`.trim() || '',
    attendeePhone: user.phone || '',
    telegramUsername: user.username || '',
    projectName: '',
    projectDesc: '',
    teamMembers: '',
    projectStage: 'MVP / Prototype',
    projectCategory: 'AI & Machine Learning',
    demoUrl: '',
    pdfUrl: '',
    pdfFileName: '',
    pdfFileSize: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiRejectionError, setAiRejectionError] = useState(null);

  if (!event) return null;

  const isAlreadyRegistered = myRegistrations?.some(r => r.eventId === event.id || r.event_id === event.id);

  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      hapticFeedback.notification('error');
      setFileError('Разрешены только файлы формата PDF (.pdf)');
      return;
    }

    if (file.size > FILE_LIMITS.MAX_PDF_SIZE_BYTES) {
      hapticFeedback.notification('error');
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileError(`Файл слишком большой (${sizeMb} MB). Лимит: 10 MB.`);
      return;
    }

    hapticFeedback.impact('light');
    setSelectedFile(file);
    setRegForm(prev => ({
      ...prev,
      pdfFileName: file.name,
      pdfFileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    }));
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setRegForm(prev => ({ ...prev, pdfFileName: '', pdfFileSize: '', pdfUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    hapticFeedback.impact('light');
  };

  const handleOpenDeck = (proj) => {
    hapticFeedback.impact('light');
    openModal('presentation', proj);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    if (!regForm.attendeeName.trim() || !regForm.attendeePhone.trim()) {
      hapticFeedback.notification('error');
      return;
    }

    setIsSubmitting(true);
    setAiRejectionError(null);
    hapticFeedback.impact('heavy');

    let uploadedPdfUrl = null;
    if (selectedFile) {
      const uploadRes = await uploadPitchDeckPdfToSupabase(selectedFile, user.id);
      if (uploadRes.success && uploadRes.url) {
        uploadedPdfUrl = uploadRes.url;
      }
    }

    const result = await registerForEvent(event, {
      ...regForm,
      registrationType: regType,
      demoOrGithubUrl: regForm.demoUrl,
      pdfDeckUrl: uploadedPdfUrl || (selectedFile ? URL.createObjectURL(selectedFile) : null),
      pdfFileName: regForm.pdfFileName,
      pdfFileSize: regForm.pdfFileSize
    });

    setIsSubmitting(false);

    if (result && !result.success) {
      if (result.rejectionReason) {
        setAiRejectionError({
          reason: result.rejectionReason,
          status: result.status,
          score: result.similarityScore
        });
      }
      return;
    }

    setIsRegistering(false);
  };

  // Find linked/participating projects
  const participatingProjectsList = projects.filter(p => 
    event.participatingProjects?.includes(p.id) || (event.hasProjects && p.status === 'approved')
  ).slice(0, 4);

  return (
    <ModalStackSheet
      onClose={closeModal}
      badge={
        <div className="flex items-center gap-1.5">
          <span className="badge badge-violet text-xs font-mono">
            {event.categoryName || 'Zhambyl Event'}
          </span>
          {event.hasProjects && (
            <span className="badge badge-amber text-[10px] font-mono">
              PITCH DAY
            </span>
          )}
        </div>
      }
    >
      <div className="p-5 space-y-5">

        {/* Event Banner if available */}
        {event.imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-[rgba(186,215,247,0.12)] h-44 w-full">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* Title & Metadata */}
        <div>
          <h1 className="font-display text-xl font-bold text-gradient-skywash leading-tight mb-2">
            {lang === 'ru' ? event.title : (event.titleKz || event.title)}
          </h1>
          <p className="text-xs text-[#9da7ba] leading-relaxed">
            {lang === 'ru' ? event.shortDesc : (event.shortDescKz || event.shortDesc)}
          </p>
        </div>

        {/* Key Facts Pills */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="glass-card !p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[rgba(102,58,243,0.15)] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#a78bfa]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">Дата</span>
              <span className="text-xs font-semibold text-white truncate block">{event.date}</span>
            </div>
          </div>

          <div className="glass-card !p-3 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[rgba(102,58,243,0.15)] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-[#a78bfa]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">Время</span>
              <span className="text-xs font-semibold text-white truncate block">{event.time}</span>
            </div>
          </div>

          <div className="glass-card !p-3 flex items-center gap-2.5 col-span-2">
            <div className="w-8 h-8 rounded-xl bg-[rgba(38,150,132,0.15)] flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-[#80cbc4]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">Локация</span>
              <span className="text-xs font-semibold text-white truncate block">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Full Description & Rules */}
        {event.description && (
          <div className="glass-card space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#c7d3ea]">
              {lang === 'ru' ? 'О мероприятии и регламент' : 'Іс-шара туралы'}
            </h3>
            <p className="text-xs text-[#9da7ba] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
        )}

        {/* Participating Startups / Pitch Decks (If applicable) */}
        {event.hasProjects && participatingProjectsList.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#c7d3ea] flex items-center gap-1.5">
                <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span>{lang === 'ru' ? 'Заявленные питч-деки' : 'Қатысушы жобалар'}</span>
              </h3>
              <span className="text-[10px] font-mono text-[#9da7ba]">
                {participatingProjectsList.length} стартапа
              </span>
            </div>

            <div className="space-y-2">
              {participatingProjectsList.map((proj) => (
                <div 
                  key={proj.id}
                  onClick={() => handleOpenDeck(proj)}
                  className="glass-card !p-3 flex items-center justify-between gap-3 cursor-pointer hover:border-[#663af3]/50 transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[rgba(102,58,243,0.15)] border border-[rgba(102,58,243,0.3)] flex items-center justify-center text-sm shrink-0">
                      {proj.logoIcon || '🚀'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display text-xs font-semibold text-white truncate">
                          {proj.name}
                        </span>
                        <span className="badge badge-teal text-[9px] !py-0 !px-1.5 font-mono">
                          PDF Deck
                        </span>
                      </div>
                      <span className="text-[11px] text-[#9da7ba] truncate block">
                        Фаундер: {proj.founder}
                      </span>
                    </div>
                  </div>

                  <button className="btn-ghost-pill !py-1 !px-2 text-[10px] text-[#c7d3ea] group-hover:border-[#663af3] shrink-0 flex items-center gap-1">
                    <span>Смотреть</span>
                    <ChevronRight className="w-3 h-3 text-[#663af3]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Registration Block */}
        <div className="pt-2 pb-6">
          {isAlreadyRegistered ? (
            <div className="glass-card !bg-[rgba(38,150,132,0.12)] border-[rgba(38,150,132,0.4)] text-center p-4 space-y-1.5">
              <CheckCircle2 className="w-6 h-6 text-[#269684] mx-auto" />
              <p className="text-xs font-bold text-white">
                {lang === 'ru' ? 'Вы зарегистрированы на это событие!' : 'Сіз бұл шараға тіркелгенсіз!'}
              </p>
              <p className="text-[11px] text-[#80cbc4]">
                {lang === 'ru' ? 'Ваша запись сохранена во вкладке Профиль' : 'Тіркелуіңіз Профиль бөлімінде сақталды'}
              </p>
            </div>
          ) : !isRegistering ? (
            <button
              onClick={() => {
                hapticFeedback.impact('medium');
                setIsRegistering(true);
              }}
              className="btn-violet w-full py-3 text-sm flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>
                {event.hasProjects 
                  ? (lang === 'ru' ? 'Зарегистрироваться / Подать питч' : 'Тіркелу / Жобаны қорғау')
                  : (lang === 'ru' ? 'Зарегистрироваться (Слушатель)' : 'Тіркелу (Тыңдаушы)')}
              </span>
            </button>
          ) : (
            /* Inline Registration Form */
            <form onSubmit={handleSubmitRegistration} className="glass-card space-y-3.5 p-4 border-[#663af3]">
              <div className="flex items-center justify-between border-b border-[rgba(186,215,247,0.1)] pb-2">
                <span className="text-xs font-mono uppercase text-[#c7d3ea] font-semibold">
                  {lang === 'ru' ? 'Форма быстрой регистрации' : 'Жедел тіркелу формасы'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-[11px] text-[#9da7ba] hover:text-white"
                >
                  Отмена
                </button>
              </div>

              {/* Role Type Selector for this event */}
              {event.hasProjects && (
                <div>
                  <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
                    Формат участия
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        hapticFeedback.selection();
                        setRegType('pitch_project');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        regType === 'pitch_project'
                          ? 'bg-[rgba(102,58,243,0.25)] border-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.3)]'
                          : 'bg-[rgba(186,214,247,0.04)] border-[rgba(186,215,247,0.12)] text-[#9da7ba]'
                      }`}
                    >
                      <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
                      <span>Питч стартапа</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        hapticFeedback.selection();
                        setRegType('listener');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        regType === 'listener'
                          ? 'bg-[rgba(102,58,243,0.25)] border-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.3)]'
                          : 'bg-[rgba(186,214,247,0.04)] border-[rgba(186,215,247,0.12)] text-[#9da7ba]'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 text-[#80cbc4]" />
                      <span>Слушатель / Гость</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Attendee Name & Phone */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
                    Имя и Фамилия *
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.attendeeName}
                    onChange={(e) => setRegForm({ ...regForm, attendeeName: e.target.value })}
                    placeholder="Алихан Смаилов"
                    className="glass-input text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
                    Номер телефона / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={regForm.attendeePhone}
                    onChange={(e) => setRegForm({ ...regForm, attendeePhone: e.target.value })}
                    placeholder="+7 (707) 123-45-67"
                    className="glass-input text-xs"
                  />
                </div>
              </div>

              {/* Additional Fields if Pitching Project */}
              {regType === 'pitch_project' && (
                <div className="space-y-2.5 pt-1 border-t border-[rgba(186,215,247,0.1)]">
                  <div>
                    <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
                      Название проекта / стартапа *
                    </label>
                    <input
                      type="text"
                      required
                      value={regForm.projectName}
                      onChange={(e) => setRegForm({ ...regForm, projectName: e.target.value })}
                      placeholder="Например: AgroAI Taraz"
                      className="glass-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
                      Краткая суть проекта (1-2 предложения)
                    </label>
                    <textarea
                      rows={2}
                      value={regForm.projectDesc}
                      onChange={(e) => setRegForm({ ...regForm, projectDesc: e.target.value })}
                      placeholder="Умная система капельного орошения на базе AI для фермеров Жамбылской области..."
                      className="glass-input text-xs"
                    />
                  </div>

                  {/* PDF Pitch Deck Upload for Event */}
                  <div>
                    <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
                      Презентация / PDF питч-дек (до 10 MB)
                    </label>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="application/pdf,.pdf"
                      className="hidden"
                    />

                    {!regForm.pdfFileName ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border border-dashed border-[rgba(186,215,247,0.2)] hover:border-[#663af3] rounded-xl p-3 text-center cursor-pointer transition-all bg-[rgba(186,214,247,0.02)]"
                      >
                        <UploadCloud className="w-5 h-5 text-[#a78bfa] mx-auto mb-1" />
                        <span className="text-[11px] text-[#c7d3ea] font-medium block">
                          Прикрепить PDF презентацию
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-[rgba(102,58,243,0.15)] border border-[#663af3]/40">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-[#a78bfa] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {regForm.pdfFileName}
                            </p>
                            <span className="text-[10px] text-[#9da7ba]">
                              {regForm.pdfFileSize}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        {fileError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* AI Verification Notice when registering project */}
              {(regType === 'pitch_project' || regType === 'pitch_team') && (
                <div className="p-3 rounded-xl bg-[rgba(102,58,243,0.12)] border border-[rgba(102,58,243,0.25)] flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#c7d3ea] leading-relaxed">
                    Проект будет автоматически проверен AI-арбитром Gemini на оригинальность и допуск к участию в соревновании.
                  </p>
                </div>
              )}

              {/* AI Rejection Alert if project is a duplicate or past winner */}
              {aiRejectionError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/35 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center gap-2 text-red-400">
                    <XCircle className="w-4 h-4 shrink-0" />
                    <h5 className="font-display text-xs font-bold uppercase tracking-wider">
                      {aiRejectionError.status === 'rejected_past_winner' 
                        ? 'Проект не допущен: Победитель прошлых хакатонов' 
                        : 'Проект не допущен: Похожий проект уже участвовал'}
                    </h5>
                  </div>
                  <p className="text-xs text-[#d1e4fa] leading-relaxed">
                    {aiRejectionError.reason}
                  </p>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-violet w-full py-2.5 text-xs flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#a78bfa] animate-spin" />
                    <span>AI-верификация и регистрация...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>{(regType === 'pitch_project' || regType === 'pitch_team') ? 'Отправить на AI-проверку и записаться' : 'Подтвердить регистрацию'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </ModalStackSheet>
  );
};
