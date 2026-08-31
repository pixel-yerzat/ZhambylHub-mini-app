import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, ChevronLeft, ChevronRight, Star, Send, 
  MessageSquare, Sparkles, Award, ExternalLink, Check 
} from 'lucide-react';
import { hapticFeedback, openTelegramLink } from '../utils/telegram';

export const PresentationViewerModal = () => {
  const { modalData, closeModal, ratePresentation, reviewedPresentations, lang } = useApp();
  const project = modalData;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [ratings, setRatings] = useState({
    problem: 5,
    solution: 5,
    market: 4,
    pitch: 5
  });
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!project || !project.presentation) return null;

  const presentation = project.presentation;
  const slides = presentation.slides || [];
  const currentSlide = slides[currentSlideIndex] || {};
  const isReviewed = reviewedPresentations.includes(project.id);

  const nextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      hapticFeedback.impact('light');
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      hapticFeedback.impact('light');
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleRatingChange = (category, value) => {
    hapticFeedback.selection();
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    ratePresentation(project.id, ratings, comment);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-md max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(186,215,247,0.12)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xl">{project.logoIcon}</span>
            <div className="min-w-0">
              <h3 className="font-display text-sm font-semibold text-white truncate">{project.name}</h3>
              <p className="text-[11px] text-[#9da7ba] font-mono">
                {lang === 'ru' ? 'Питч-дек стартапа' : 'Стартап таныстырылымы'} · {project.stage}
              </p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="btn-ghost-pill !p-1.5 text-[#c7d3ea]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Presentation Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Slide Deck Container */}
          <div className="glass-card p-5 relative min-h-[260px] flex flex-col justify-between">
            {/* Top Slide Meta Bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="badge badge-violet">
                {currentSlide.badge || `Slide ${currentSlideIndex + 1}`}
              </span>
              <span className="text-xs font-mono text-[#9da7ba]">
                {currentSlideIndex + 1} / {slides.length}
              </span>
            </div>

            {/* Slide Content */}
            <div className="space-y-2.5 my-auto py-2">
              <h2 className="font-display text-lg text-gradient-skywash leading-snug">
                {currentSlide.title}
              </h2>
              
              {currentSlide.subtitle && (
                <p className="text-xs text-[#c7d3ea] leading-relaxed">
                  {currentSlide.subtitle}
                </p>
              )}

              {/* Highlights */}
              {currentSlide.highlights && currentSlide.highlights.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {currentSlide.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#d1e4fa]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#663af3] mt-1.5 shrink-0"></span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentSlide.content && (
                <p className="text-xs text-[#9da7ba] italic pt-2 border-t border-[rgba(186,215,247,0.08)]">
                  {currentSlide.content}
                </p>
              )}
            </div>

            {/* Slide Navigation Controls */}
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-[rgba(186,215,247,0.08)]">
              <button
                onClick={prevSlide}
                disabled={currentSlideIndex === 0}
                className={`btn-ghost-pill text-xs !py-1 !px-2.5 ${currentSlideIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> {lang === 'ru' ? 'Назад' : 'Артқа'}
              </button>

              {/* Slide Dots */}
              <div className="flex items-center gap-1.5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      hapticFeedback.selection();
                      setCurrentSlideIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      currentSlideIndex === idx 
                        ? 'w-5 bg-[#663af3]' 
                        : 'w-1.5 bg-[rgba(186,215,247,0.2)]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                disabled={currentSlideIndex === slides.length - 1}
                className={`btn-ghost-pill text-xs !py-1 !px-2.5 ${currentSlideIndex === slides.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {lang === 'ru' ? 'Вперед' : 'Алға'} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Founder Contact */}
          <div className="flex items-center justify-between p-3 glass-card">
            <div>
              <span className="text-[10px] text-[#9da7ba] uppercase font-mono">{lang === 'ru' ? 'Основатель' : 'Фаундер'}</span>
              <p className="text-xs font-semibold text-white mt-0.5">{project.founder}</p>
            </div>

            <button
              onClick={() => openTelegramLink(`https://t.me/${project.founder.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`)}
              className="btn-ghost-pill text-xs !py-1.5 !px-3"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#663af3]" />
              <span>{lang === 'ru' ? 'Написать' : 'Жазу'}</span>
            </button>
          </div>

          {/* Rating Section */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                {lang === 'ru' ? 'Оценка питч-дека' : 'Таныстырылымды бағалау'}
              </h4>
              <span className="badge badge-amber text-[10px]">
                {isReviewed ? 'Оценено' : '+35 Hub Points'}
              </span>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-2.5">
              {/* Criteria */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#c7d3ea]">Проблема & Решение:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange('problem', star)}
                      className="p-0.5 text-[#ffab91]"
                    >
                      <Star className={`w-3.5 h-3.5 ${ratings.problem >= star ? 'fill-[#e46d4c] text-[#e46d4c]' : 'text-[#3f4959]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#c7d3ea]">Бизнес-модель & Рынок:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange('market', star)}
                      className="p-0.5 text-[#ffab91]"
                    >
                      <Star className={`w-3.5 h-3.5 ${ratings.market >= star ? 'fill-[#e46d4c] text-[#e46d4c]' : 'text-[#3f4959]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-[#c7d3ea]">Подача & Слайды:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange('pitch', star)}
                      className="p-0.5 text-[#ffab91]"
                    >
                      <Star className={`w-3.5 h-3.5 ${ratings.pitch >= star ? 'fill-[#e46d4c] text-[#e46d4c]' : 'text-[#3f4959]'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={lang === 'ru' ? 'Совет основателям...' : 'Кеңесіңіз...'}
                  className="glass-input text-xs py-1.5"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-violet text-xs py-2.5 font-semibold"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#80cbc4]" /> {lang === 'ru' ? 'Оценка сохранена' : 'Бағаланды'}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> 
                    {isReviewed ? 'Обновить оценку' : 'Отправить оценку (+35 pts)'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
