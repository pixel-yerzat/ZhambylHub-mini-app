import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Rocket, X, UploadCloud, FileText, CheckCircle, 
  Sparkles, AlertCircle, Trash2, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';
import { uploadPitchDeckPdfToSupabase } from '../services/supabase';

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export const SubmitProjectModal = () => {
  const { closeModal, addNewProject, user, lang, showToast } = useApp();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'AI & Machine Learning',
    stage: 'MVP / Prototype',
    tag: 'Startup',
    shortDesc: '',
    logoIcon: 'Rocket',
    pdfUrl: '',
    pdfFileName: '',
    pdfFileSize: ''
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFileError('');
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      hapticFeedback.notification('error');
      setFileError('Разрешены только файлы формата PDF (.pdf)');
      return;
    }

    if (file.size > MAX_PDF_SIZE_BYTES) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.shortDesc.trim()) return;

    if (!selectedFile && !formData.pdfUrl.trim()) {
      setFileError('Пожалуйста, выберите PDF-файл презентации или вставьте ссылку на PDF');
      hapticFeedback.notification('error');
      return;
    }

    setIsUploading(true);
    hapticFeedback.impact('heavy');

    let finalPdfUrl = formData.pdfUrl.trim();
    let finalFileName = formData.pdfFileName || `${formData.name}_pitch_deck.pdf`;
    let finalFileSize = formData.pdfFileSize || '2.4 MB';

    if (selectedFile) {
      const uploadRes = await uploadPitchDeckPdfToSupabase(selectedFile, user.id);
      if (!uploadRes.success) {
        setIsUploading(false);
        setFileError(uploadRes.error || 'Ошибка загрузки файла');
        hapticFeedback.notification('error');
        return;
      }
      finalPdfUrl = uploadRes.url;
      finalFileName = uploadRes.fileName;
      finalFileSize = uploadRes.fileSize;
    }

    await addNewProject({
      name: formData.name,
      category: formData.category,
      stage: formData.stage,
      tag: formData.tag,
      shortDesc: formData.shortDesc,
      logoIcon: formData.logoIcon,
      pdfDeckUrl: finalPdfUrl,
      pdfDeckName: finalFileName,
      pdfDeckSize: finalFileSize,
      status: user.role === 'moderator' ? 'approved' : 'pending'
    });

    setIsUploading(false);
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-md flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="modal-handle-bar"></div>

        {/* Modal Header */}
        <div className="px-6 pt-3 pb-4 flex items-start justify-between gap-3 border-b border-[rgba(186,215,247,0.12)]">
          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-white leading-tight">
              {lang === 'ru' ? 'Подать стартап & PDF' : 'Жобаны және PDF декті қосу'}
            </h2>
            <p className="text-xs text-[#9da7ba] leading-relaxed">
              Заполните информацию о проекте для каталога стартапов.
            </p>
          </div>

          <button 
            onClick={closeModal}
            className="w-8 h-8 rounded-full bg-[rgba(186,214,247,0.08)] hover:bg-[rgba(186,214,247,0.16)] text-[#9da7ba] hover:text-white flex items-center justify-center transition-colors shrink-0 mt-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto no-scrollbar px-6 py-5 flex-1">
          {/* Project Name */}
          <div className="space-y-1.5">
            <label className="form-label">Название стартапа / проекта *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Например: Taraz AgroTech AI"
              className="glass-input text-xs"
            />
          </div>

          {/* Category & Stage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="form-label">Сфера</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, tag: e.target.value.split(' ')[0] })}
                className="glass-input text-xs bg-[#090c1a]"
              >
                <option value="AI & Data">AI & Machine Learning</option>
                <option value="AgroTech">AgroTech</option>
                <option value="GovTech">GovTech</option>
                <option value="MedTech">MedTech</option>
                <option value="EdTech">EdTech</option>
                <option value="FinTech">FinTech</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="form-label">Стадия</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="glass-input text-xs bg-[#090c1a]"
              >
                <option value="Idea / Concept">Идея (Idea)</option>
                <option value="MVP / Prototype">Прототип (MVP)</option>
                <option value="Early Traction">Traction</option>
                <option value="Scaling">Scaling</option>
              </select>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="form-label">Краткое описание (Elevator Pitch) *</label>
            <textarea
              required
              rows={2}
              value={formData.shortDesc}
              onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })}
              placeholder="Какую проблему решает проект и в чем ценность решения..."
              className="glass-input text-xs !rounded-2xl"
            />
          </div>

          {/* PDF Pitch Deck Upload Area */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="form-label !mb-0 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#663af3]" />
                <span>PDF Презентация (Pitch Deck) *</span>
              </label>
              <span className="badge badge-teal font-mono text-[10px]">
                Лимит: 10 MB
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {fileError && (
              <div className="p-3 rounded-2xl bg-[rgba(228,109,76,0.15)] border border-[rgba(228,109,76,0.35)] flex items-center gap-2 text-xs text-[#ffab91]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {!selectedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[rgba(186,215,247,0.18)] hover:border-[#663af3] bg-[rgba(186,214,247,0.02)] rounded-3xl p-5 text-center cursor-pointer transition-all space-y-2"
              >
                <UploadCloud className="w-8 h-8 text-[#663af3] mx-auto" />
                <div>
                  <p className="text-xs font-semibold text-white">Нажмите для выбора PDF-файла</p>
                  <p className="text-[10px] text-[#9da7ba] mt-0.5">Формат .PDF · Максимально 10 MB</p>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[rgba(102,58,243,0.14)] border border-[rgba(102,58,243,0.35)] flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#663af3] flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(102,58,243,0.5)]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-[#80cbc4] font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB / 10 MB · Готов к загрузке
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setFileError('');
                  }}
                  className="p-1.5 rounded-full hover:bg-[rgba(255,255,255,0.1)] text-[#ffab91]"
                  title="Удалить файл"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Optional Direct PDF Link */}
            <div className="pt-1">
              <input
                type="url"
                value={formData.pdfUrl}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                placeholder="Или вставьте ссылку на PDF файл"
                className="glass-input text-xs"
              />
            </div>
          </div>

          {/* Sync Notice */}
          <div className="p-3.5 rounded-2xl bg-[rgba(102,58,243,0.08)] border border-[rgba(102,58,243,0.2)] flex items-center gap-2.5 text-xs text-[#d8ecf8]">
            <ShieldCheck className="w-4 h-4 text-[#80cbc4] shrink-0" />
            <span>Проект будет отправлен на модерацию команды Zhambyl Hub</span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className="w-full btn-violet text-sm !py-4 font-bold justify-center rounded-full shadow-[0_6px_28px_rgba(102,58,243,0.5)]"
            >
              {isUploading ? 'Загрузка PDF в Supabase (до 10 MB)...' : 'Отправить проект на модерацию'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
