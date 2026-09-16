import React, { useState } from 'react';
import { useApp } from '@/context';
import { 
  Star, ExternalLink, FileText, 
  CheckCircle2, Sparkles, Rocket 
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';
import { ModalStackSheet } from '@/components/common/ModalStackSheet';

export const PresentationViewerModal = () => {
  const { modalData: project, closeModal, ratePresentation, reviewedPresentations } = useApp();

  const [activeTab, setActiveTab] = useState('pdf'); // 'pdf' | 'info' | 'rate'
  const [iframeError, setIframeError] = useState(false);

  // Ratings Form
  const [ratings, setRatings] = useState({
    problem: 5,
    solution: 5,
    market: 5,
    pitch: 5
  });
  const [comment, setComment] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!project) return null;

  const isReviewed = reviewedPresentations?.includes(project.id);

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

  // Use Google Docs viewer wrapper for public HTTP URLs on mobile WebViews, or direct URL for local/blob
  const embedViewerUrl = isHttpUrl 
    ? `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true` 
    : pdfUrl;

  return (
    <ModalStackSheet
      onClose={closeModal}
      title={project.name}
      subtitle={`${project.category} · ${project.stage}`}
      actions={
        pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost-pill !p-1.5 text-[#c7d3ea]"
            title="Открыть в браузере"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : null
      }
    >
      <div className="flex flex-col h-full">
        {/* Navigation Subtabs (PDF Deck / About Project / Rate) */}
        <div className="flex items-center border-b border-[rgba(186,215,247,0.08)] bg-[rgba(186,214,247,0.02)] px-4 py-2 gap-2 shrink-0">
          <button
            onClick={() => {
              hapticFeedback.selection();
              setActiveTab('pdf');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pdf'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Питч-дек (PDF)</span>
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setActiveTab('info');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'info'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>О проекте</span>
          </button>

          <button
            onClick={() => {
              hapticFeedback.selection();
              setActiveTab('rate');
            }}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 relative ${
              activeTab === 'rate'
                ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
                : 'text-[#9da7ba] hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Оценить</span>
            {isReviewed && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#269684]" />
            )}
          </button>
        </div>

        {/* Body based on active tab */}
        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col min-h-[360px]">

          {/* TAB 1: PDF VIEWER */}
          {activeTab === 'pdf' && (
            <div className="flex-1 flex flex-col bg-[#05060f] relative">
              {pdfUrl ? (
                <div className="flex-1 w-full h-full min-h-[420px] flex flex-col relative">
                  {!iframeError ? (
                    <iframe
                      src={embedViewerUrl}
                      title={`Pitch Deck: ${project.name}`}
                      className="w-full h-full flex-1 border-0 min-h-[420px] bg-[#111425]"
                      onError={() => setIframeError(true)}
                    />
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-[rgba(102,58,243,0.18)] flex items-center justify-center text-[#d8ecf8]">
                        <FileText className="w-6 h-6 text-[#a78bfa]" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-white">
                          Презентация {project.pdfDeckName || 'pitch_deck.pdf'}
                        </h4>
                        <p className="text-xs text-[#9da7ba] mt-1">
                          PDF файл доступен для просмотра во встроенном браузере
                        </p>
                      </div>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-violet py-2 px-4 text-xs inline-flex items-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Открыть PDF файл</span>
                      </a>
                    </div>
                  )}

                  <div className="p-3 bg-[#0a0c18] border-t border-[rgba(186,215,247,0.1)] flex items-center justify-between gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-[#9da7ba]">
                      <Star className="w-3.5 h-3.5 text-[#ffab91] fill-[#ffab91]" />
                      <span className="text-white font-bold">{project.rating || '5.0'}</span>
                      <span className="text-[10px]">({project.reviewsCount || 1} отзывов)</span>
                    </div>

                    <button
                      onClick={() => {
                        hapticFeedback.selection();
                        setActiveTab('rate');
                      }}
                      className="btn-ghost-pill !py-1 !px-2.5 text-xs text-[#c7d3ea] border-[#663af3]/50 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
                      <span>{isReviewed ? 'Изменить оценку' : 'Оценить питч'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#9da7ba]" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-white">
                      Презентация ещё не загружена
                    </h4>
                    <p className="text-xs text-[#9da7ba] mt-1">
                      Фаундер проекта пока не прикрепил PDF питч-дек
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ABOUT PROJECT */}
          {activeTab === 'info' && (
            <div className="p-5 space-y-4">
              <div className="glass-card space-y-2">
                <span className="text-[10px] font-mono text-[#9da7ba] uppercase block">
                  Описание стартапа
                </span>
                <p className="text-xs text-[#d1e4fa] leading-relaxed whitespace-pre-line">
                  {project.shortDesc}
                </p>
              </div>

              {/* Gemini AI Verification Breakdown */}
              {project.aiAnalysis && (
                <div className="glass-card !bg-[rgba(102,58,243,0.12)] border-[#663af3]/40 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#a78bfa] uppercase flex items-center gap-1.5 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Анализ Gemini AI Арбитра</span>
                    </span>
                    <span className="badge badge-teal text-[9px] font-mono">
                      Уникальность: {100 - (project.similarityScore || 10)}%
                    </span>
                  </div>

                  {project.aiAnalysis.detailed_analysis?.core_idea_analysis && (
                    <p className="text-xs text-[#d1e4fa] leading-relaxed">
                      {project.aiAnalysis.detailed_analysis.core_idea_analysis}
                    </p>
                  )}

                  {project.aiAnalysis.detailed_analysis?.novelty_points && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] text-[#9da7ba] uppercase font-mono block">Ключевые инновации:</span>
                      <div className="flex flex-wrap gap-1">
                        {project.aiAnalysis.detailed_analysis.novelty_points.map((p, idx) => (
                          <span key={idx} className="text-[10px] py-0.5 px-2 rounded-lg bg-[rgba(186,214,247,0.06)] text-white">
                            ✓ {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="glass-card space-y-2.5">
                <span className="text-[10px] font-mono text-[#9da7ba] uppercase block">
                  Команда и контакты
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#9da7ba]">
                    <span>Фаундер / Лидер:</span>
                    <span className="text-white font-medium">{project.founder}</span>
                  </div>
                  {project.founderRole && (
                    <div className="flex items-center justify-between text-[#9da7ba]">
                      <span>Роль:</span>
                      <span className="text-[#a78bfa]">{project.founderRole}</span>
                    </div>
                  )}
                  {project.teamMembers && (
                    <div className="flex items-center justify-between text-[#9da7ba]">
                      <span>Состав команды:</span>
                      <span className="text-white">{project.teamMembers}</span>
                    </div>
                  )}
                  {project.founderPhone && (
                    <div className="flex items-center justify-between text-[#9da7ba]">
                      <span>Телефон / WhatsApp:</span>
                      <span className="text-white font-mono">{project.founderPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost-pill w-full py-2.5 text-xs flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#663af3]" />
                  <span>Открыть прототип / сайт стартапа</span>
                </a>
              )}
            </div>
          )}

          {/* TAB 3: RATE & EXPERT REVIEW */}
          {activeTab === 'rate' && (
            <form onSubmit={handleSubmitReview} className="p-5 space-y-4">
              <div className="text-center space-y-1">
                <h3 className="font-display text-sm font-bold text-white">
                  Экспертная оценка питч-дека
                </h3>
                <p className="text-xs text-[#9da7ba]">
                  Оцените проект по 4 ключевым венчурным критериям
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { key: 'problem', label: '1. Актуальность проблемы', desc: 'Насколько понятна и серьезна боль клиента' },
                  { key: 'solution', label: '2. Продукт и решение', desc: 'Ценность и уникальность технологии' },
                  { key: 'market', label: '3. Рынок и масштабируемость', desc: 'Потенциал роста в регионе и мире' },
                  { key: 'pitch', label: '4. Качество презентации', desc: 'Структура, дизайн и понятность слайдов' }
                ].map((item) => (
                  <div key={item.key} className="glass-card !p-3 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{item.label}</span>
                      <span className="badge badge-violet text-[10px] font-mono">
                        {ratings[item.key]} / 5
                      </span>
                    </div>
                    <p className="text-[10px] text-[#9da7ba]">{item.desc}</p>
                    
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleRatingChange(item.key, score)}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            ratings[item.key] === score
                              ? 'bg-[#663af3] text-white shadow-[0_0_8px_rgba(102,58,243,0.5)]'
                              : 'bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.1)] text-[#9da7ba]'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9da7ba] uppercase mb-1">
                  Комментарий и рекомендации фаундеру (опционально)
                </label>
                <textarea
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Отличная бизнес-модель, рекомендую усилить блок Unit-экономики..."
                  className="glass-input text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[rgba(102,58,243,0.15)] border border-[#663af3]/40">
                <span className="text-xs font-medium text-[#c7d3ea]">Средний балл:</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#ffab91] fill-[#ffab91]" />
                  <span className="font-display text-base font-bold text-white">{avgScore}</span>
                  <span className="text-xs text-[#9da7ba]">/ 5.0</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-violet w-full py-2.5 text-xs flex items-center justify-center gap-2 mb-6"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSaved ? 'Сохранено!' : 'Отправить экспертную оценку'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </ModalStackSheet>
  );
};
