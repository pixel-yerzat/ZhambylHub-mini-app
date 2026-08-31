import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, MapPin, X, Users, Rocket, 
  FileText, CheckCircle2, ChevronRight, UploadCloud, 
  Trash2, AlertTriangle, Send, Sparkles, Globe, 
  GraduationCap, Flame, UserCheck, Phone, AtSign 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';
import { uploadPitchDeckPdfToSupabase } from '../services/supabase';

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

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
    projectCategory: 'AI & Data',
    demoUrl: '',
    pdfUrl: '',
    pdfFileName: '',
    pdfFileSize: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event) return null;

  const isAlreadyRegistered = myRegistrations?.some(r => r.eventId === event.id || r.event_id === event.id);

  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Пожалуйста, выберите файл в формате PDF (.pdf)');
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileError(`Файл слишком большой (${sizeMb} MB). Лимит: 10 MB.`);
      return;
    }

    setSelectedFile(file);
    setRegForm(prev => ({
      ...prev,
      pdfFileName: file.name,
      pdfFileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    }));
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    if (!regForm.attendeeName.trim() || !regForm.attendeePhone.trim()) return;

    setIsSubmitting(true);
    hapticFeedback.impact('heavy');

    let finalPdfUrl = regForm.pdfUrl;

    if (regType === 'pitch_project' && selectedFile) {
      const uploadRes = await uploadPitchDeckPdfToSupabase(selectedFile, user.id);
      if (!uploadRes.success) {
        setIsSubmitting(false);
        setFileError(uploadRes.error || 'Ошибка загрузки PDF');
        return;
      }
      finalPdfUrl = uploadRes.url;
    }

    await registerForEvent(event, {
      registrationType: regType,
      attendeeName: regForm.attendeeName,
      attendeePhone: regForm.attendeePhone,
      telegramUsername: regForm.telegramUsername,
      projectName: regType === 'pitch_project' ? regForm.projectName : null,
      projectDesc: regType === 'pitch_project' ? regForm.projectDesc : null,
      teamMembers: regType === 'pitch_project' ? regForm.teamMembers : null,
      projectStage: regType === 'pitch_project' ? regForm.projectStage : null,
      projectCategory: regType === 'pitch_project' ? regForm.projectCategory : null,
      demoOrGithubUrl: regType === 'pitch_project' ? regForm.demoUrl : null,
      pdfDeckUrl: finalPdfUrl
    });

    setIsSubmitting(false);
    setIsRegistering(false);
  };

  const getEventBadge = () => {
    if (event.categoryName?.toLowerCase().includes('pizza') || event.title?.toLowerCase().includes('pizza')) {
      return (
        <span className="badge badge-amber text-xs !py-1 !px-3 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-[#ffab91]" />
          <span>Pizza Pitch</span>
        </span>
      );
    }
    if (event.hasProjects) {
      return (
        <span className="badge badge-violet text-xs !py-1 !px-3 flex items-center gap-1.5">
          <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
          <span>{event.categoryName || 'Pitch Day / Хакатон'}</span>
        </span>
      );
    }
    return (
      <span className="badge badge-teal text-xs !py-1 !px-3 flex items-center gap-1.5">
        <GraduationCap className="w-3.5 h-3.5 text-[#80cbc4]" />
        <span>{event.categoryName || 'Воркшоп / Митап'}</span>
      </span>
    );
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle Bar */}
        <div className="modal-handle-bar"></div>

        {/* Modal Header */}
        <div className="modal-header-box">
          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {getEventBadge()}
            </div>
            <h2 className="font-display text-xl font-bold text-white leading-tight">
              {lang === 'ru' ? event.title : (event.titleKz || event.title)}
            </h2>
            <p className="text-xs text-[#9da7ba] leading-relaxed">
              {event.shortDesc || 'Заполните данные для участия в мероприятии.'}
            </p>
          </div>

          <button 
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[rgba(186,214,247,0.08)] hover:bg-[rgba(186,214,247,0.16)] text-[#9da7ba] hover:text-white flex items-center justify-center transition-colors shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body with Guaranteed 22px Vertical Spacing */}
        <div className="modal-body-form no-scrollbar">
          {/* Optional Event Cover Image */}
          {(event.imageUrl || event.image_url) && !isRegistering && (
            <div className="w-full h-44 rounded-2xl overflow-hidden border border-[rgba(186,215,247,0.14)] shadow-md">
              <img 
                src={event.imageUrl || event.image_url} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Date, Time, Location Pill Rows */}
          <div className="form-group-row">
            {/* Date Pill Input Card */}
            <div className="form-group">
              <label className="form-label">Дата проведения</label>
              <div className="pill-input justify-between">
                <span className="text-xs font-semibold text-white">{event.date}</span>
                <Calendar className="w-4 h-4 text-[#663af3] shrink-0" />
              </div>
            </div>

            {/* Time Pill Input Card */}
            <div className="form-group">
              <label className="form-label">Время</label>
              <div className="pill-input justify-between">
                <span className="text-xs text-[#d1e4fa] font-medium">{event.time || '18:00 - 20:30'}</span>
                <Clock className="w-4 h-4 text-[#663af3] shrink-0" />
              </div>
            </div>
          </div>

          {/* Location Pill Card */}
          <div className="form-group">
            <label className="form-label">Локация</label>
            <div className="pill-input justify-between">
              <span className="text-xs text-[#d1e4fa] truncate">{event.location || 'г. Тараз, проспект Төле би, 45'}</span>
              <MapPin className="w-4 h-4 text-[#269684] shrink-0 ml-2" />
            </div>
          </div>

          {/* Detailed Description */}
          {event.description && event.description !== event.shortDesc && !isRegistering && (
            <div className="p-4 rounded-2xl bg-[rgba(186,214,247,0.03)] border border-[rgba(186,215,247,0.1)] space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9da7ba]">О событии</span>
              <p className="text-xs text-[#c7d3ea] leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Registration Section */}
          {!isRegistering ? (
            <div style={{ marginTop: '8px', paddingBottom: '12px' }}>
              {isAlreadyRegistered ? (
                <div className="p-5 rounded-3xl bg-[rgba(38,150,132,0.15)] border border-[rgba(38,150,132,0.35)] text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#80cbc4] mx-auto" />
                  <p className="text-sm font-bold text-white">Вы уже зарегистрированы на это событие!</p>
                  <p className="text-xs text-[#9da7ba]">
                    Мы отправим вам напоминание в Telegram перед началом.
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => setIsRegistering(true)}
                  className="w-full btn-violet text-sm !py-4 font-bold justify-center rounded-full shadow-[0_6px_28px_rgba(102,58,243,0.5)]"
                >
                  Зарегистрироваться на мероприятие
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleRegistrationSubmit} className="flex flex-col gap-5 pt-2">
              <div className="flex items-center justify-between pb-1 border-b border-[rgba(186,215,247,0.1)]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#d8ecf8]">
                  Форма участника
                </span>
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-xs text-[#ffab91] hover:underline"
                >
                  Отмена
                </button>
              </div>

              {/* Participation Type Switcher */}
              {event.hasProjects && (
                <div className="flex items-center gap-2 p-1.5 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.14)]">
                  <button
                    type="button"
                    onClick={() => setRegType('pitch_project')}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      regType === 'pitch_project'
                        ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.5)]'
                        : 'text-[#9da7ba]'
                    }`}
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    <span>Защита проекта</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegType('listener')}
                    className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      regType === 'listener'
                        ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.5)]'
                        : 'text-[#9da7ba]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Слушатель</span>
                  </button>
                </div>
              )}

              {/* Attendee Name */}
              <div className="form-group">
                <label className="form-label">
                  {regType === 'pitch_project' ? 'Имя и Фамилия капитана *' : 'Имя и Фамилия *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regForm.attendeeName}
                    onChange={(e) => setRegForm({ ...regForm, attendeeName: e.target.value })}
                    placeholder="Например: Аслан Бериков"
                    className="glass-input text-xs pl-11"
                  />
                  <UserCheck className="w-4 h-4 text-[#9da7ba] absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Phone and Telegram */}
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Телефон *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={regForm.attendeePhone}
                      onChange={(e) => setRegForm({ ...regForm, attendeePhone: e.target.value })}
                      placeholder="+7 (777) 123-45-67"
                      className="glass-input text-xs pl-10"
                    />
                    <Phone className="w-3.5 h-3.5 text-[#9da7ba] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Telegram</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={regForm.telegramUsername}
                      onChange={(e) => setRegForm({ ...regForm, telegramUsername: e.target.value })}
                      placeholder="@username"
                      className="glass-input text-xs pl-10"
                    />
                    <AtSign className="w-3.5 h-3.5 text-[#9da7ba] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Pitch Project Extended Fields */}
              {regType === 'pitch_project' && (
                <div className="flex flex-col gap-4 p-5 rounded-3xl bg-[rgba(102,58,243,0.08)] border border-[rgba(102,58,243,0.25)]">
                  <span className="badge badge-violet text-[11px] flex items-center gap-1.5 self-start">
                    <Rocket className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span>Проект на защиту</span>
                  </span>

                  <div className="form-group">
                    <label className="form-label">Название стартапа / проекта *</label>
                    <input
                      type="text"
                      required
                      value={regForm.projectName}
                      onChange={(e) => setRegForm({ ...regForm, projectName: e.target.value })}
                      placeholder="Например: Taraz Smart Waste AI"
                      className="glass-input text-xs"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Краткое описание (Elevator Pitch) *</label>
                    <textarea
                      required
                      rows={2}
                      value={regForm.projectDesc}
                      onChange={(e) => setRegForm({ ...regForm, projectDesc: e.target.value })}
                      placeholder="Какую проблему решает ваш проект..."
                      className="glass-input text-xs !rounded-2xl"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Участники команды и роли *</label>
                    <input
                      type="text"
                      required
                      value={regForm.teamMembers}
                      onChange={(e) => setRegForm({ ...regForm, teamMembers: e.target.value })}
                      placeholder="Данияр (Frontend), Азамат (AI), Диана (Design)"
                      className="glass-input text-xs"
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-group">
                      <label className="form-label">Сфера</label>
                      <select
                        value={regForm.projectCategory}
                        onChange={(e) => setRegForm({ ...regForm, projectCategory: e.target.value })}
                        className="glass-input text-xs bg-[#090c1a]"
                      >
                        <option value="AI & Data">AI & Data</option>
                        <option value="GovTech">GovTech</option>
                        <option value="AgroTech">AgroTech</option>
                        <option value="FinTech">FinTech</option>
                        <option value="MedTech">MedTech</option>
                        <option value="EdTech">EdTech</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Стадия</label>
                      <select
                        value={regForm.projectStage}
                        onChange={(e) => setRegForm({ ...regForm, projectStage: e.target.value })}
                        className="glass-input text-xs bg-[#090c1a]"
                      >
                        <option value="Idea / Concept">Идея (Idea)</option>
                        <option value="MVP / Prototype">Прототип (MVP)</option>
                        <option value="Early Traction">Traction</option>
                      </select>
                    </div>
                  </div>

                  {/* PDF Upload (Limit 10MB) */}
                  <div className="form-group pt-1">
                    <div className="flex items-center justify-between">
                      <label className="form-label !mb-0 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-[#663af3]" />
                        <span>PDF Презентация</span>
                      </label>
                      <span className="text-[10px] text-[#80cbc4] font-mono">Лимит: 10 MB</span>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="application/pdf,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {fileError && (
                      <p className="text-xs text-[#ffab91] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{fileError}</span>
                      </p>
                    )}

                    {!selectedFile ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-[rgba(186,215,247,0.18)] hover:border-[#663af3] bg-[rgba(186,214,247,0.02)] rounded-2xl p-4 text-center text-xs text-[#d8ecf8] flex items-center justify-center gap-2 transition-all"
                      >
                        <UploadCloud className="w-4 h-4 text-[#663af3]" />
                        <span>Выбрать PDF питч-дек (до 10 MB)</span>
                      </button>
                    ) : (
                      <div className="p-3 rounded-2xl bg-[rgba(102,58,243,0.18)] flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className="w-4 h-4 text-[#d8ecf8]" />
                          <span className="text-white truncate font-medium">{selectedFile.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="text-[#ffab91]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div style={{ marginTop: '10px', paddingBottom: '16px' }}>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-violet text-sm !py-4 font-bold justify-center rounded-full shadow-[0_6px_28px_rgba(102,58,243,0.5)]"
                >
                  {isSubmitting ? 'Сохранение регистрации...' : 'Подтвердить регистрацию'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
