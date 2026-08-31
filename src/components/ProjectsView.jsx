import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Rocket, Search, Presentation, Star, Plus, ChevronRight 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const ProjectsView = () => {
  const { projects, openModal, reviewedPresentations, lang } = useApp();

  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tags = [
    { id: 'all', label: lang === 'ru' ? 'Все' : 'Барлығы' },
    { id: 'AI', label: 'AI & Data' },
    { id: 'AgroTech', label: 'AgroTech' },
    { id: 'GovTech', label: 'GovTech / AR' },
    { id: 'MedTech', label: 'MedTech' }
  ];

  const filteredProjects = projects.filter((proj) => {
    if (selectedTag !== 'all' && !proj.tag?.toLowerCase().includes(selectedTag.toLowerCase()) && !proj.category?.toLowerCase().includes(selectedTag.toLowerCase())) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = proj.name.toLowerCase().includes(q);
      const matchDesc = proj.shortDesc?.toLowerCase().includes(q);
      const matchFounder = proj.founder?.toLowerCase().includes(q);
      return matchName || matchDesc || matchFounder;
    }

    return true;
  });

  const handleOpenDeck = (proj) => {
    hapticFeedback.impact('light');
    openModal('presentation', proj);
  };

  return (
    <div className="app-main-content space-y-6 pt-4 pb-8">
      {/* Header & Add Project Action */}
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-semibold text-gradient-skywash">
            {lang === 'ru' ? 'Каталог стартапов' : 'Стартаптар каталогы'}
          </h1>
          <p className="text-xs text-[#9da7ba]">
            {lang === 'ru' ? 'Инновационные проекты и питч-деки' : 'Инновациялық жобалар'}
          </p>
        </div>

        <button
          onClick={() => openModal('submit-project')}
          className="btn-violet text-xs !py-2 !px-3.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Подать' : 'Қосу'}</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full">
        <Search className="w-4 h-4 text-[#9da7ba] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ru' ? 'Поиск проекта по названию или автору...' : 'Жобаны іздеу...'}
          className="glass-input pl-10 text-xs"
        />
      </div>

      {/* Sector Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar w-full">
        {tags.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              hapticFeedback.selection();
              setSelectedTag(t.id);
            }}
            className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 whitespace-nowrap ${selectedTag === t.id ? 'btn-pill-active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="w-full flex flex-col gap-3.5">
        {filteredProjects.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-white">Проекты не найдены</p>
            <p className="text-xs text-[#9da7ba]">Попробуйте другой фильтр или добавьте проект первым!</p>
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const isReviewed = reviewedPresentations.includes(proj.id);

            return (
              <div
                key={proj.id}
                onClick={() => handleOpenDeck(proj)}
                className="glass-card cursor-pointer transition-all active:scale-[0.99] space-y-2.5 group"
              >
                {/* Top Info */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] flex items-center justify-center text-xl shrink-0">
                      {proj.logoIcon}
                    </div>
                    <div>
                      <h3 className="font-display text-sm font-semibold text-white group-hover:text-[#d8ecf8] transition-colors">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-[#9da7ba]">
                        {proj.founder} · <span className="text-[#269684]">{proj.stage}</span>
                      </p>
                    </div>
                  </div>

                  <span className="badge badge-violet text-[11px] font-mono shrink-0">
                    {proj.tag}
                  </span>
                </div>

                <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed">
                  {lang === 'ru' ? proj.shortDesc : (proj.shortDescKz || proj.shortDesc)}
                </p>

                {/* Metrics */}
                {proj.metrics && (
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[rgba(5,6,15,0.6)] border border-[rgba(186,215,247,0.06)] text-center">
                    {proj.metrics.map((m, i) => (
                      <div key={i}>
                        <span className="text-[10px] text-[#9da7ba] block">{m.label}</span>
                        <span className="font-mono text-xs text-[#d1e4fa] block truncate">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-xs">
                  <div className="flex items-center gap-1 text-[#ffab91]">
                    <span>★ {proj.rating}</span>
                    <span className="text-[#9da7ba] text-[10px]">({proj.reviewsCount})</span>
                    {isReviewed && (
                      <span className="text-[10px] text-[#269684] ml-1 font-mono">✓ Оценен</span>
                    )}
                  </div>

                  <div className="btn-ghost-pill text-xs !py-1 !px-2.5 text-[#d8ecf8]">
                    <Presentation className="w-3 h-3 text-[#663af3]" />
                    <span>Слайды ({proj.presentation?.slidesCount || 4})</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
