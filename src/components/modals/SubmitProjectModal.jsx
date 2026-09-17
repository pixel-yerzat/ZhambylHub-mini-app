import React, { useState, useRef } from 'react';
import { useApp } from '@/context';
import { 
  Rocket, UploadCloud, FileText, 
  Trash2, AlertTriangle, Sparkles, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';
import { uploadPitchDeckPdfToSupabase } from '@/services/supabase';
import { FILE_LIMITS, PROJECT_CATEGORIES } from '@/constants/app';
import { ModalStackSheet } from '@/components/common/ModalStackSheet';

export const SubmitProjectModal = () => {
  const { closeModal, addNewProject, user, lang } = useApp();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'AI & Machine Learning',
    stage: 'MVP / Prototype',
    tag: 'Startup',
    shortDesc: '',
    founderPhone: user.phone || '',
    teamMembers: '',
    demoUrl: '',
    logoIcon: 'Rocket',
    pdfUrl: '',
    pdfFileName: '',
    pdfFileSize: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [submissionVerdict, setSubmissionVerdict] = useState(null); // null | { status, rejectionReason, similarityScore, aiAnalysis }

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
    setFormData(prev => ({
      ...prev,
      pdfFileName: file.name,
      pdfFileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    }));
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, pdfFileName: '', pdfFileSize: '', pdfUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    hapticFeedback.impact('light');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.shortDesc.trim()) {
      hapticFeedback.notification('error');
      return;
    }

    setIsUploading(true);
    setSubmissionVerdict(null);
    setAiStatusMessage('🤖 AI-арбитр Gemini анализирует проект на оригинальность...');
    hapticFeedback.impact('heavy');

    let uploadedPdfUrl = null;
    if (selectedFile) {
      setAiStatusMessage('📤 Загрузка PDF питч-дека в хранилище...');
      const uploadRes = await uploadPitchDeckPdfToSupabase(selectedFile, user.id);
      if (uploadRes.success && uploadRes.url) {
        uploadedPdfUrl = uploadRes.url;
      }
    }

    setAiStatusMessage('🔍 Проверка на дубликаты и победителей прошлых хакатонов...');

    const result = await addNewProject({
      ...formData,
      pdfDeckUrl: uploadedPdfUrl || null,
      pdfDeckName: formData.pdfFileName || (uploadedPdfUrl ? 'pitch_deck.pdf' : ''),
      pdfDeckSize: formData.pdfFileSize || (uploadedPdfUrl ? '1.8 MB' : '')
    });

    setIsUploading(false);

    if (result) {
      setSubmissionVerdict({
        status: result.status,
        rejectionReason: result.rejectionReason,
        similarityScore: result.similarityScore,
        aiAnalysis: result.aiAnalysis
      });

      if (result.status === 'approved') {
        hapticFeedback.notification('success');
        setTimeout(() => {
          closeModal();
        }, 1600);
      } else {
        hapticFeedback.notification('error');
      }
    } else {
      closeModal();
    }
  };

  return (
    <ModalStackSheet
      onClose={closeModal}
      icon={Rocket}
      title={lang === 'ru' ? 'Подать стартап / Питч-дек' : 'Жобаны қосу / Питч-дек'}
      subtitle={lang === 'ru' ? 'AI-верификация через Gemini' : 'Gemini AI тексеруі'}
    >
      <div className="p-5">

        {/* AI Processing Screen */}
        {isUploading && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-[rgba(102,58,243,0.2)] border border-[#663af3] flex items-center justify-center animate-pulse shadow-[0_0_24px_rgba(102,58,243,0.5)]">
                <Sparkles className="w-8 h-8 text-[#a78bfa] animate-spin" />
              </div>
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white mb-1">
                Gemini AI верификация
              </h3>
              <p className="text-xs text-[#9da7ba] max-w-xs leading-relaxed">
                {aiStatusMessage}
              </p>
            </div>
          </div>
        )}

        {/* Submission Verdict Card (If rejected or pending) */}
        {!isUploading && submissionVerdict && (
          <div className="mb-5">
            {submissionVerdict.status === 'approved' ? (
              <div className="glass-card !bg-[rgba(38,150,132,0.15)] border-[rgba(38,150,132,0.4)] p-4 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#269684] mx-auto" />
                <h4 className="font-display text-sm font-bold text-white">
                  Проект успешно одобрен AI!
                </h4>
                <p className="text-xs text-[#80cbc4]">
                  Проект прошел проверку на уникальность и опубликован в экосистеме Zhambyl Hub.
                </p>
              </div>
            ) : submissionVerdict.status === 'rejected_duplicate' ? (
              <div className="glass-card !bg-[rgba(228,109,76,0.12)] border-[rgba(228,109,76,0.4)] p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider">
                    Отклонено: Похожий проект уже существует
                  </h4>
                </div>
                <p className="text-xs text-[#d1e4fa] leading-relaxed">
                  {submissionVerdict.rejectionReason || 'Вы уже подавали похожий проект. По правилам Хаба один и тот же проект нельзя подавать повторно.'}
                </p>
                {submissionVerdict.similarityScore && (
                  <span className="badge badge-amber text-[10px] font-mono">
                    Сходство: {submissionVerdict.similarityScore}%
                  </span>
                )}
              </div>
            ) : submissionVerdict.status === 'rejected_past_winner' ? (
              <div className="glass-card !bg-red-500/10 border-red-500/35 p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-400">
                  <XCircle className="w-5 h-5 shrink-0" />
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider">
                    Отклонено: Проект-победитель прошлых хакатонов
                  </h4>
                </div>
                <p className="text-xs text-[#d1e4fa] leading-relaxed">
                  {submissionVerdict.rejectionReason || 'Проект имеет критическое сходство с победителями прошлых хакатонов Хаба. Ранее побеждавшие проекты не допускаются к повторному участию.'}
                </p>
              </div>
            ) : (
              <div className="glass-card !bg-[rgba(2,125,234,0.12)] border-[rgba(2,125,234,0.35)] p-4 space-y-2 text-center">
                <Clock className="w-8 h-8 text-[#90caf9] mx-auto" />
                <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
                  Отправлено на рассмотрение жюри
                </h4>
                <p className="text-xs text-[#90caf9]">
                  Заявка ожидает экспертной оценки жюри и организаторов.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Form Fields */}
        {!isUploading && (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Project Name */}
            <div>
              <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                {lang === 'ru' ? 'Название проекта / стартапа *' : 'Жоба атауы *'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: AgroVision AI"
                className="glass-input text-sm"
              />
            </div>

            {/* Category & Stage */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                  {lang === 'ru' ? 'Категория *' : 'Санат *'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="glass-input text-xs"
                >
                  {PROJECT_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                  {lang === 'ru' ? 'Стадия' : 'Кезеңі'}
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="glass-input text-xs"
                >
                  <option value="Idea / Concept">💡 Идея / Концепт</option>
                  <option value="MVP / Prototype">⚡ MVP / Прототип</option>
                  <option value="Early Traction">📈 Первые продажи</option>
                  <option value="Scaling / Seed">🚀 Масштабирование</option>
                </select>
              </div>
            </div>

            {/* PDF Pitch Deck Upload (10MB limit) */}
            <div>
              <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                {lang === 'ru' ? 'PDF Питч-дек / Презентация (до 10 MB)' : 'PDF Питч-дек (10 MB дейін)'}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/pdf,.pdf"
                className="hidden"
              />

              {!formData.pdfFileName ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[rgba(186,215,247,0.2)] hover:border-[#663af3] rounded-2xl p-4 text-center cursor-pointer transition-all bg-[rgba(186,214,247,0.02)] hover:bg-[rgba(102,58,243,0.06)] group"
                >
                  <UploadCloud className="w-7 h-7 text-[#9da7ba] group-hover:text-[#663af3] mx-auto mb-1.5 transition-colors" />
                  <p className="text-xs font-medium text-white mb-0.5">
                    {lang === 'ru' ? 'Нажмите для выбора PDF файла' : 'PDF файлды таңдау үшін басыңыз'}
                  </p>
                  <p className="text-[11px] text-[#9da7ba]">
                    {lang === 'ru' ? 'Слайды презентации стартапа до 10 MB' : '10 MB дейінгі PDF құжат'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[rgba(102,58,243,0.18)] border border-[#663af3]/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-6 h-6 text-[#a78bfa] shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {formData.pdfFileName}
                      </p>
                      <span className="text-[10px] text-[#9da7ba]">
                        {formData.pdfFileSize} · Готов к загрузке в Supabase
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {fileError && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                  {fileError}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                {lang === 'ru' ? 'Краткое описание стартапа *' : 'Жоба сипаттамасы *'}
              </label>
              <textarea
                required
                rows={3}
                value={formData.shortDesc}
                onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="Какую проблему решает стартап, целевая аудитория и уникальность..."
                className="glass-input text-xs"
              />
            </div>

            {/* Team and Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                  {lang === 'ru' ? 'Телефон / WhatsApp' : 'Телефон / WhatsApp'}
                </label>
                <input
                  type="tel"
                  value={formData.founderPhone}
                  onChange={(e) => setFormData({ ...formData, founderPhone: e.target.value })}
                  placeholder="+7 (777) 000-00-00"
                  className="glass-input text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                  {lang === 'ru' ? 'Состав команды' : 'Команда құрамы'}
                </label>
                <input
                  type="text"
                  value={formData.teamMembers}
                  onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                  placeholder="2 разработчика, 1 дизайнер"
                  className="glass-input text-xs"
                />
              </div>
            </div>

            {/* Demo Link */}
            <div>
              <label className="block text-xs font-semibold text-[#c7d3ea] uppercase font-mono tracking-wider mb-1.5">
                {lang === 'ru' ? 'Ссылка на сайт / GitHub / Demo' : 'Сайт немесе Demo сілтемесі'}
              </label>
              <input
                type="url"
                value={formData.demoUrl}
                onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                placeholder="https://myproject.kz"
                className="glass-input text-xs"
              />
            </div>

            {/* AI Verification Notice */}
            <div className="p-3 rounded-2xl bg-[rgba(102,58,243,0.12)] border border-[rgba(102,58,243,0.25)] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#a78bfa] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#c7d3ea] leading-relaxed">
                {lang === 'ru' 
                  ? 'Проект будет автоматически проверен AI-арбитром Gemini на оригинальность и отсутствие дубликатов с прошлых хакатонов.' 
                  : 'Жоба Gemini AI арқылы түпнұсқалыққа автоматты түрде тексеріледі.'}
              </p>
            </div>

            {/* Submit */}
            <div className="pt-2 pb-6">
              <button
                type="submit"
                disabled={isUploading}
                className="btn-violet w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isUploading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Rocket className="w-4 h-4" />
                )}
                <span>
                  {isUploading 
                    ? (lang === 'ru' ? 'AI проверка...' : 'Тексерілуде...') 
                    : (lang === 'ru' ? 'Отправить на AI проверку' : 'AI тексеруге жіберу')}
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </ModalStackSheet>
  );
};
