import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, Star, ExternalLink, Download, FileText, 
  CheckCircle2, AlertCircle, Maximize2, ShieldCheck, 
  Sparkles, Layers, Rocket 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const PresentationViewerModal = () => {
  const { modalData: project, closeModal, ratePresentation, reviewedPresentations, lang } = useApp();

  if (!project) return null;

  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'info' | 'rate'
  const [iframeError, setIframeError] = useState(false);

  const isReviewed = reviewedPresentations?.includes(project.id);

  // Ratings Form
  const [ratings, setRatings] = useState({
    problem: 5,
    solution: 5,
    market: 5,
    pitch: 5
  });
  const [comment, setComment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleRatingChange = (category, value) => {
    hapticFeedback.selection();
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    hapticFeedback.impact('heavy');
    await ratePresentation(project.id, ratings, comment);
    setIsSaved(true);
    setTimeout(() => {
      setActiveTab('pdf');
    }, 1200);
  };

  const avgScore = ((ratings.problem + ratings.solution + ratings.market + ratings.pitch) / 4).toFixed(1);

  // Generate safe viewer URL
  const pdfUrl = project.pdfDeckUrl;
  const isHttpUrl = pdfUrl && (pdfUrl.startsWith('http://') || pdfUrl.startsWith('https://'));
  const isBlobOrData = pdfUrl && (pdfUrl.startsWith('blob:') || pdfUrl.startsWith('data:'));

  // Use Google Docs viewer wrapper for public HTTP URLs on mobile WebViews, or direct URL for local/blob
  const embedViewerUrl = isHttpUrl 
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true` 
    : pdfUrl;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-lg max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle Bar */}
        <div className="modal-handle-bar"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-3 pb-3 border-b border-[rgba(186,215,247,0.1)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.4)] flex items-center justify-center text-white shrink-0">
              <Rocket className="w-5 h-5 text-[#663af3]" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-white truncate">
                {project.name}
              </h3>
              <p className="text-xs text-[#9da7ba] truncate mt-0.5">
                {project.founder || project.founder_name} · <span className="text-[#80cbc4] font-medium">{project.stage}</span>
              </p>
            </div>
          </div>

          <button 
            onClick={closeModal}
            className="p-1.5 rounded-full text-[#9da7ba] hover:text-white hover:bg-[rgba(186,214,247,0.08)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1.5 mx-6 my-3 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)]">
          <button
            onClick={() => {
              hapticFeedback.selection();
              setActiveTab('pdf');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Презентация</span>
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setActiveTab('info');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'info'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>О проекте</span>
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setActiveTab('rate');
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'rate'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-[#ffab91]" />
            <span>Оценка</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="overflow-y-auto no-scrollbar px-6 pb-6 flex-1 space-y-4">
          {/* TAB 1: ACTUAL PDF EMBED VIEWER */}
          {activeTab === 'pdf' && (
            <div className="space-y-3.5 flex flex-col h-full min-h-[420px]">
              {/* PDF Control & Download Bar */}
              <div className="p-3.5 rounded-xl bg-[rgba(102,58,243,0.08)] border border-[rgba(102,58,243,0.22)] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#663af3] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      {project.pdfDeckName || 'pitch_deck.pdf'}
                    </p>
                    <p className="text-[10px] text-[#80cbc4] font-mono">
                      {project.pdfDeckSize || 'PDF документ'}
                    </p>
                  </div>
                </div>

                {pdfUrl && (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-ghost-pill text-xs !py-1.5 !px-3 text-white flex items-center gap-1 hover:border-[#663af3]"
                      title="Открыть во весь экран"
                    >
                      <Maximize2 className="w-3 h-3 text-[#663af3]" />
                      <span>На весь экран</span>
                    </a>

                    <a
                      href={pdfUrl}
                      download={project.pdfDeckName || 'pitch_deck.pdf'}
                      className="btn-violet text-xs !py-1.5 !px-3 flex items-center gap-1 shadow-sm"
                      title="Скачать PDF"
                    >
                      <Download className="w-3 h-3" />
                      <span>Скачать</span>
                    </a>
                  </div>
                )}
              </div>

              {/* PDF Embedded View Container */}
              {pdfUrl ? (
                <div className="w-full flex-1 min-h-[380px] rounded-2xl overflow-hidden border border-[rgba(186,215,247,0.14)] bg-[#05060f] relative shadow-inner">
                  {!iframeError ? (
                    <iframe
                      src={embedViewerUrl}
                      className="w-full h-full min-h-[380px] border-0 rounded-2xl"
                      title={project.pdfDeckName || "Pitch Deck"}
                      onError={() => setIframeError(true)}
                    />
                  ) : (
                    <div className="p-8 text-center space-y-3 flex flex-col items-center justify-center h-full">
                      <FileText className="w-12 h-12 text-[#663af3] opacity-60" />
                      <p className="text-sm font-semibold text-white">PDF загружен в базу</p>
                      <p className="text-xs text-[#9da7ba] max-w-xs">
                        Для комфортного просмотра откройте файл в полноэкранном режиме или скачайте на устройство.
                      </p>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-violet text-xs !py-2 !px-4"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Открыть {project.pdfDeckName || 'PDF'}</span>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass-card p-8 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-[#ffab91] mx-auto opacity-70" />
                  <p className="text-sm font-semibold text-white">PDF файл еще не прикреплен</p>
                  <p className="text-xs text-[#9da7ba]">
                    Фаундер пока не загрузил финальную версию презентации.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REAL PROJECT DETAILS */}
          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="glass-card p-4 space-y-2">
                <span className="badge badge-violet text-[10px]">
                  Описание стартапа
                </span>
                <p className="text-xs text-[#c7d3ea] leading-relaxed pt-1">
                  {project.shortDesc || 'Описание отсутствует.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[rgba(186,214,247,0.03)] border border-[rgba(186,215,247,0.1)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[#9da7ba]">Фаундер:</span>
                  <span className="font-semibold text-white">{project.founder || project.founder_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9da7ba]">Сфера:</span>
                  <span className="font-semibold text-white">{project.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#9da7ba]">Стадия проекта:</span>
                  <span className="font-semibold text-[#80cbc4]">{project.stage}</span>
                </div>
                {project.teamMembers && (
                  <div className="pt-2 border-t border-[rgba(186,215,247,0.08)]">
                    <span className="text-[#9da7ba] block mb-1">Команда:</span>
                    <span className="font-medium text-[#c7d3ea]">{project.teamMembers}</span>
                  </div>
                )}
                {project.demoUrl && (
                  <div className="pt-2 border-t border-[rgba(186,215,247,0.08)] flex items-center justify-between">
                    <span className="text-[#9da7ba]">Прототип / GitHub:</span>
                    <a href={project.demoUrl} target="_blank" rel="noreferrer" className="text-[#663af3] font-medium underline flex items-center gap-1">
                      <span>Ссылка</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: EXPERT RATING */}
          {activeTab === 'rate' && (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {isSaved ? (
                <div className="glass-card p-6 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#80cbc4] mx-auto" />
                  <h4 className="font-display text-sm font-semibold text-white">
                    Оценка успешно сохранена!
                  </h4>
                  <p className="text-xs text-[#9da7ba]">
                    Ваш экспертный фидбек записан в Supabase.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.12)]">
                    <div>
                      <span className="text-xs text-white font-semibold">Средний балл оценки:</span>
                      <p className="text-[11px] text-[#9da7ba]">По 4 ключевым метрикам</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-[#ffab91] text-[#ffab91]" />
                      <span className="font-mono text-base font-bold text-white">{avgScore}</span>
                    </div>
                  </div>

                  {/* 4 Criteria Sliders */}
                  <div className="space-y-3">
                    {[
                      { key: 'problem', label: '1. Актуальность проблемы', desc: 'Насколько важна проблема для региона' },
                      { key: 'solution', label: '2. Ценность решения', desc: 'Уникальность и качество продукта' },
                      { key: 'market', label: '3. Потенциал рынка', desc: 'Масштабируемость и монетизация' },
                      { key: 'pitch', label: '4. Качество питча & PDF', desc: 'Структура презентации и дизайн' }
                    ].map((crit) => (
                      <div key={crit.key} className="p-3 rounded-xl bg-[rgba(186,214,247,0.02)] border border-[rgba(186,215,247,0.08)] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{crit.label}</span>
                          <span className="font-mono text-xs text-[#ffab91] font-bold">
                            {ratings[crit.key]} / 5
                          </span>
                        </div>
                        <p className="text-[10px] text-[#9da7ba]">{crit.desc}</p>
                        
                        <div className="flex items-center justify-between gap-1 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingChange(crit.key, star)}
                              className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1 ${
                                ratings[crit.key] >= star
                                  ? 'bg-[rgba(228,109,76,0.2)] border-[#e46d4c] text-[#ffab91]'
                                  : 'bg-[rgba(186,214,247,0.03)] border-[rgba(186,215,247,0.1)] text-[#9da7ba]'
                              }`}
                            >
                              <Star className={`w-3 h-3 ${ratings[crit.key] >= star ? 'fill-[#ffab91]' : ''}`} />
                              <span>{star}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="text-xs text-[#9da7ba]">Комментарий / Совет фаундеру:</label>
                    <textarea
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Напишите конструктивный фидбек или рекомендации..."
                      className="glass-input text-xs mt-1.5"
                    />
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full btn-violet text-sm !py-3 font-semibold justify-center shadow-[0_0_20px_rgba(102,58,243,0.4)]"
                  >
                    Отправить экспертную оценку
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
