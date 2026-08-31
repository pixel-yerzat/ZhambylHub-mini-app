import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Rocket, Sparkles, Plus, Trash2 } from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const SubmitProjectModal = () => {
  const { closeModal, addNewProject, lang } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('AI & Machine Learning');
  const [tag, setTag] = useState('AI / Smart City');
  const [stage, setStage] = useState('MVP / Prototype');
  const [shortDesc, setShortDesc] = useState('');
  const [logoIcon, setLogoIcon] = useState('💡');
  
  const [slides, setSlides] = useState([
    {
      slideNumber: 1,
      title: 'Титульный слайд: Название & Концепт',
      subtitle: 'Краткое позиционирование вашего стартапа',
      type: 'cover',
      badge: 'Cover',
      highlights: ['Zhambyl Hub Ecosystem', 'Target: Kazakhstan & CA'],
      content: ''
    },
    {
      slideNumber: 2,
      title: 'Проблема: Какую боль решаем?',
      subtitle: 'Кто страдает от этой проблемы и сколько денег теряется?',
      type: 'problem',
      badge: 'Problem',
      highlights: ['Ключевая боль клиентов', 'Текущие неэффективные решения'],
      content: ''
    },
    {
      slideNumber: 3,
      title: 'Решение & Технология',
      subtitle: 'Как именно наш продукт закрывает эту проблему',
      type: 'solution',
      badge: 'Solution',
      highlights: ['Уникальное торговое предложение', 'Инновационный стек технологий'],
      content: ''
    },
    {
      slideNumber: 4,
      title: 'Команда & The Ask',
      subtitle: 'Необходимые ресурсы и инвестиции',
      type: 'team_ask',
      badge: 'The Ask',
      highlights: ['Поиск кофаундеров и менторов', 'Цель: запуск пилота в Таразе'],
      content: ''
    }
  ]);

  const handleSlideChange = (index, field, value) => {
    setSlides(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const addCustomSlide = () => {
    hapticFeedback.impact('light');
    const newIndex = slides.length + 1;
    setSlides(prev => [
      ...prev,
      {
        slideNumber: newIndex,
        title: `Слайд ${newIndex}: Новый раздел`,
        subtitle: 'Описание слайда',
        type: 'custom',
        badge: `Slide ${newIndex}`,
        highlights: ['Ключевой тезис 1', 'Ключевой тезис 2'],
        content: ''
      }
    ]);
  };

  const removeSlide = (index) => {
    if (slides.length <= 2) return;
    hapticFeedback.impact('light');
    setSlides(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !shortDesc) return;

    const updatedSlides = slides.map((s, idx) => {
      if (idx === 0) {
        return { ...s, title: name, subtitle: shortDesc, content: shortDesc };
      }
      return s;
    });

    addNewProject({
      name,
      category,
      tag,
      stage,
      shortDesc,
      logoIcon,
      slides: updatedSlides
    });

    closeModal();
  };

  const icons = ['💡', '🚀', '🌾', '🏛️', '🩺', '🤖', '⚡', '💻', '🌐', '🛡️', '📊', '🎓'];

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div 
        className="modal-sheet max-w-md max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(186,215,247,0.12)]">
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-[#663af3]" />
            <span className="font-display text-xs font-semibold text-white uppercase tracking-wider">
              {lang === 'ru' ? 'Подать проект в Hub' : 'Жобаны ұсыну'}
            </span>
          </div>
          <button
            onClick={closeModal}
            className="btn-ghost-pill !p-1.5 text-[#c7d3ea]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="glass-card p-4 space-y-3">
            <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
              {lang === 'ru' ? 'Основная информация' : 'Негізгі ақпарат'}
            </h4>

            {/* Icon Picker */}
            <div>
              <label className="text-[11px] text-[#9da7ba]">Иконка проекта:</label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {icons.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setLogoIcon(ic)}
                    className={`w-7 h-7 rounded-full text-sm flex items-center justify-center transition-all ${
                      logoIcon === ic 
                        ? 'bg-[#663af3] ring-1 ring-white scale-110 shadow-[0_0_8px_#663af3]' 
                        : 'bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)]'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#9da7ba]">Название стартапа:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Taraz AI Waste"
                className="glass-input text-xs mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#9da7ba]">Индустрия:</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setTag(e.target.value.split(' ')[0]);
                  }}
                  className="glass-input text-xs mt-1 bg-[#05060f] text-white"
                >
                  <option value="AI & Machine Learning">AI & ML</option>
                  <option value="AgroTech & IoT">AgroTech</option>
                  <option value="GovTech & Smart City">GovTech</option>
                  <option value="MedTech & Health">MedTech</option>
                  <option value="EdTech & Education">EdTech</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#9da7ba]">Стадия:</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="glass-input text-xs mt-1 bg-[#05060f] text-white"
                >
                  <option value="Idea / Концепт">Idea</option>
                  <option value="MVP / Прототип">MVP</option>
                  <option value="Pilot / Пилот">Pilot</option>
                  <option value="Scaling / Рост">Scaling</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-[#9da7ba]">Краткое описание:</label>
              <textarea
                required
                rows={2}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Что делает ваш продукт..."
                className="glass-input text-xs mt-1 resize-none"
              />
            </div>
          </div>

          {/* Slide Deck Builder */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-xs font-semibold text-white uppercase tracking-wider">
                Слайды презентации ({slides.length})
              </h4>
              <button
                type="button"
                onClick={addCustomSlide}
                className="btn-ghost-pill text-xs !py-1 !px-2 text-[#d8ecf8]"
              >
                <Plus className="w-3 h-3" /> Слайд
              </button>
            </div>

            <div className="space-y-2.5 pt-1">
              {slides.map((s, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.08)] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="badge badge-violet text-[10px]">
                      Слайд {idx + 1}
                    </span>
                    {slides.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeSlide(idx)}
                        className="text-[#9da7ba] hover:text-[#e46d4c] p-0.5 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={s.title}
                    onChange={(e) => handleSlideChange(idx, 'title', e.target.value)}
                    placeholder="Заголовок слайда"
                    className="glass-input text-xs !py-1 font-semibold"
                  />

                  <input
                    type="text"
                    value={s.subtitle || ''}
                    onChange={(e) => handleSlideChange(idx, 'subtitle', e.target.value)}
                    placeholder="Подзаголовок"
                    className="glass-input text-xs !py-1 text-[#c7d3ea]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full btn-violet text-xs py-3 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Опубликовать и получить +150 pts</span>
          </button>
        </form>
      </div>
    </div>
  );
};
