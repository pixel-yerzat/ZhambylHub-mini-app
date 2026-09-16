import React, { useState } from 'react';
import { useApp } from '@/context';
import { 
  Rocket, Search, Trophy, Star, Plus, ChevronRight, FileText, 
  CheckCircle2, Sparkles, Award 
} from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';
import { PROJECT_TAGS } from '@/constants/app';
import { ProjectStatusBadge } from '@/components/common/Badge';

export const ProjectsView = () => {
  const { projects, pastWinners, openModal, reviewedPresentations, lang } = useApp();

  const [activeCatalogTab, setActiveCatalogTab] = useState('projects'); // 'projects' | 'winners'
  const [selectedTag, setSelectedTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tags = PROJECT_TAGS.map(t => ({
    id: t.id,
    label: lang === 'ru' ? t.labelRu : t.labelKz
  }));

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
          className="btn-violet !py-1.5 !px-3 text-xs flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Подать' : 'Қосу'}</span>
        </button>
      </div>

      {/* 2. Mode Subtabs: Projects Catalog vs Past Winners Registry */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[rgba(186,214,247,0.04)] border border-[rgba(186,215,247,0.1)] w-full mb-3">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveCatalogTab('projects');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeCatalogTab === 'projects'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>{lang === 'ru' ? 'Стартапы экосистемы' : 'Жобалар'} ({approvedProjects.length})</span>
        </button>

        <button
          onClick={() => {
            hapticFeedback.selection();
            setActiveCatalogTab('winners');
          }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeCatalogTab === 'winners'
              ? 'bg-[#663af3] text-white shadow-[0_0_12px_rgba(102,58,243,0.4)]'
              : 'text-[#9da7ba] hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#ffab91]" />
          <span>{lang === 'ru' ? 'Победители хакатонов' : 'Жеңімпаздар'} ({pastWinners.length})</span>
        </button>
      </div>

      {/* 3. Search Bar */}
      <div className="search-bar-row">
        <Search className="w-4 h-4 text-[#9da7ba] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            activeCatalogTab === 'projects'
              ? (lang === 'ru' ? 'Поиск стартапа, ниши или основателя...' : 'Стартап немесе бағытты іздеу...')
              : (lang === 'ru' ? 'Поиск среди проектов-победителей...' : 'Жеңімпаз жобаларды іздеу...')
          }
          className="glass-input text-xs"
        />
      </div>

      {/* 4. Filter Tags (Only for projects catalog) */}
      {activeCatalogTab === 'projects' && (
        <div className="filter-pills-row no-scrollbar">
          {tags.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                hapticFeedback.selection();
                setSelectedTag(t.id);
              }}
              className={`filter-pill ${selectedTag === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* 5. TAB 1: Projects Cards Grid */}
      {activeCatalogTab === 'projects' && (
        <div className="space-y-3 pb-6 w-full">
          {filteredProjects.length === 0 ? (
            <div className="glass-card text-center p-8 space-y-2">
              <Rocket className="w-8 h-8 text-[#9da7ba] mx-auto opacity-60" />
              <p className="text-xs font-semibold text-white">Проекты не найдены</p>
              <p className="text-[11px] text-[#9da7ba]">Будьте первым, кто подаст проект в этой категории!</p>
              <button
                onClick={() => openModal('submit-project')}
                className="btn-violet py-2 px-4 text-xs inline-flex items-center gap-1.5 mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Загрузить PDF питч-дек</span>
              </button>
            </div>
          ) : (
            filteredProjects.map((proj) => {
              const hasReviewed = reviewedPresentations.includes(proj.id);

              return (
                <div
                  key={proj.id}
                  onClick={() => handleOpenDeck(proj)}
                  className="glass-card !p-4 cursor-pointer hover:border-[#663af3]/70 transition-all space-y-3 group"
                >
                  {/* Header Row: Icon, Title, Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.35)] flex items-center justify-center text-lg shrink-0 shadow-[0_0_12px_rgba(102,58,243,0.25)]">
                        {proj.logoIcon || '🚀'}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-display text-sm font-bold text-white group-hover:text-gradient-skywash transition-all truncate">
                            {proj.name}
                          </h3>
                        </div>
                        <p className="text-[11px] text-[#9da7ba] truncate mt-0.5">
                          {proj.category} · {proj.stage}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <ProjectStatusBadge status={proj.status || 'approved'} size="xs" />
                  </div>

                  {/* Short Description */}
                  <p className="text-xs text-[#d1e4fa] line-clamp-2 leading-relaxed">
                    {proj.shortDesc}
                  </p>

                  {/* PDF Deck Info Strip */}
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[rgba(102,58,243,0.1)] border border-[rgba(102,58,243,0.25)] text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-[#a78bfa] shrink-0" />
                      <span className="text-[11px] text-white font-medium truncate">
                        {proj.pdfDeckName || 'Pitch_Deck.pdf'}
                      </span>
                      <span className="text-[10px] text-[#9da7ba] font-mono shrink-0">
                        {proj.pdfDeckSize || 'PDF'}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#a78bfa] font-semibold flex items-center gap-1 shrink-0">
                      <span>Смотреть</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Footer: Founder & Evaluation status */}
                  <div className="flex items-center justify-between pt-1 border-t border-[rgba(186,215,247,0.08)] text-[11px] text-[#9da7ba]">
                    <span className="truncate">
                      Фаундер: <strong className="text-white font-medium">{proj.founder}</strong>
                    </span>

                    {hasReviewed ? (
                      <span className="text-[#80cbc4] flex items-center gap-1 font-mono text-[10px] shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Вы оценили</span>
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-[#ffab91]">
                        <Star className="w-3 h-3 fill-[#ffab91]" />
                        <span className="font-bold text-white">{proj.rating || '5.0'}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 6. TAB 2: Past Hackathon Winners Registry */}
      {activeCatalogTab === 'winners' && (
        <div className="space-y-3 pb-6 w-full">
          <div className="p-3 rounded-2xl bg-[rgba(102,58,243,0.12)] border border-[rgba(102,58,243,0.3)] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#ffab91] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#d1e4fa] leading-relaxed">
              {lang === 'ru'
                ? 'Реестр проектов, завоевавших призовые места на хакатонах и Demo Day Zhambyl Hub. Сервис Gemini AI проверяет новые заявки на отсутствие повторов данных решений.'
                : 'Zhambyl Hub хакатондарында жеңіске жеткен жобалар тізімі.'}
            </p>
          </div>

          {pastWinners.map((winner) => (
            <div
              key={winner.id}
              className="glass-card !p-4 space-y-2.5 relative overflow-hidden group border-[rgba(228,109,76,0.25)] hover:border-[#e46d4c]"
            >
              {/* Background amber glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#e46d4c]/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-[rgba(228,109,76,0.18)] border border-[rgba(228,109,76,0.35)] flex items-center justify-center text-base shrink-0 shadow-[0_0_12px_rgba(228,109,76,0.3)]">
                    🏆
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-[#ffab91] transition-colors truncate">
                      {winner.title}
                    </h3>
                    <span className="text-[10px] font-mono text-[#ffab91] block truncate">
                      {winner.track}
                    </span>
                  </div>
                </div>

                <span className="badge badge-amber text-[10px] font-mono shrink-0">
                  {winner.year}
                </span>
              </div>

              <p className="text-xs text-[#d1e4fa] leading-relaxed relative z-10">
                {winner.description}
              </p>

              {winner.features && winner.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 relative z-10">
                  {winner.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] py-0.5 px-2 rounded-lg bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.12)] text-[#c7d3ea]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[rgba(186,215,247,0.08)] text-[10px] text-[#9da7ba]">
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#ffab91]" />
                  <span>{winner.eventName}</span>
                </span>
                <span className="font-mono text-[#80cbc4]">Защищен AI</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
