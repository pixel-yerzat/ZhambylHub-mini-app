import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Rocket, Search, Presentation, Star, Plus, ChevronRight, FileText, CheckCircle2 
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
    { id: 'GovTech', label: 'GovTech' },
    { id: 'MedTech', label: 'MedTech' },
    { id: 'FinTech', label: 'FinTech' }
  ];

  const approvedProjects = projects.filter(p => p.status === 'approved' || !p.status);

  const filteredProjects = approvedProjects.filter((proj) => {
    if (selectedTag !== 'all' && !proj.tag?.toLowerCase().includes(selectedTag.toLowerCase()) && !proj.category?.toLowerCase().includes(selectedTag.toLowerCase())) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = proj.name?.toLowerCase().includes(q);
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
    <div className="app-main-content">
      {/* 1. Page Header */}
      <div className="page-header-row">
        <div className="min-w-0 flex-1 pr-2">
          <h1 className="font-display text-lg font-bold text-gradient-skywash leading-tight truncate">
            {lang === 'ru' ? 'Каталог стартапов' : 'Стартаптар каталогы'}
          </h1>
          <p className="text-xs text-[#9da7ba] mt-0.5 truncate">
            {lang === 'ru' ? 'PDF питч-деки и IT проекты' : 'PDF питч-дектер'}
          </p>
        </div>

        <button
          onClick={() => openModal('submit-project')}
          className="btn-violet text-xs !py-1.5 !px-3 flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Подать PDF' : 'PDF қосу'}</span>
        </button>
      </div>

      {/* 2. Search Bar */}
      <div className="search-bar-row">
        <Search className="w-4 h-4 text-[#9da7ba] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={lang === 'ru' ? 'Поиск проекта по названию или сфере...' : 'Жобаны іздеу...'}
          className="glass-input pl-10 text-xs"
        />
      </div>

      {/* 3. Sector Filter Chips (No scrollbar, comfortable touch targets) */}
      <div className="filter-pills-row no-scrollbar">
        {tags.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              hapticFeedback.selection();
              setSelectedTag(t.id);
            }}
            className={`btn-ghost-pill text-xs !py-1.5 !px-3.5 whitespace-nowrap shrink-0 ${selectedTag === t.id ? 'btn-pill-active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 4. Projects Cards List */}
      <div className="cards-list-wrapper">
        {filteredProjects.length === 0 ? (
          <div className="glass-card p-8 text-center space-y-2">
            <p className="text-sm font-semibold text-white">Проекты не найдены</p>
            <p className="text-xs text-[#9da7ba]">Попробуйте другой фильтр или загрузите PDF первым!</p>
            <button
              onClick={() => openModal('submit-project')}
              className="btn-violet text-xs !py-1.5 !px-3.5 mt-2"
            >
              + Загрузить PDF питч-дек
            </button>
          </div>
        ) : (
          filteredProjects.map((proj) => {
            const isReviewed = reviewedPresentations?.includes(proj.id);

            return (
              <div
                key={proj.id}
                onClick={() => handleOpenDeck(proj)}
                className="glass-card cursor-pointer transition-all active:scale-[0.99] group"
              >
                {/* Project Header Row */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.14)] flex items-center justify-center text-white shrink-0 shadow-sm">
                      <Rocket className="w-5 h-5 text-[#663af3]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-semibold text-white group-hover:text-[#d8ecf8] transition-colors truncate">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-[#9da7ba] truncate mt-0.5">
                        {proj.founder || proj.founder_name} · <span className="text-[#80cbc4]">{proj.stage}</span>
                      </p>
                    </div>
                  </div>

                  <span className="badge badge-violet font-mono text-[11px] shrink-0">
                    PDF Deck
                  </span>
                </div>

                {/* Project Description */}
                <p className="text-xs text-[#c7d3ea] line-clamp-2 leading-relaxed mb-3.5">
                  {proj.shortDesc}
                </p>

                {/* Tags and Metrics */}
                <div className="flex items-center gap-2 flex-wrap mb-3.5">
                  <span className="badge badge-teal text-[10px]">
                    {proj.category}
                  </span>
                  {proj.teamMembers && (
                    <span className="badge badge-blue text-[10px] max-w-[200px] truncate">
                      Команда: {proj.teamMembers}
                    </span>
                  )}
                  {isReviewed && (
                    <span className="badge badge-amber text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#ffab91]" />
                      <span>Оценен вами</span>
                    </span>
                  )}
                </div>

                {/* Bottom Bar: Rating & View Link */}
                <div className="flex items-center justify-between pt-3 border-t border-[rgba(186,215,247,0.08)] text-xs">
                  <div className="flex items-center gap-1 text-[#ffab91]">
                    <Star className="w-3.5 h-3.5 fill-[#ffab91]" />
                    <span className="font-semibold">{proj.rating}</span>
                    <span className="text-[#9da7ba] text-[11px]">({proj.reviewsCount})</span>
                  </div>

                  <div className="text-[#d8ecf8] font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <FileText className="w-3.5 h-3.5 text-[#663af3]" />
                    <span>Смотреть PDF дек</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#663af3]" />
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
