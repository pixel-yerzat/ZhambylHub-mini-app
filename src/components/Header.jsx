import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Gift } from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const Header = () => {
  const { points, lang, setLang, quests, claimDaily, openModal } = useApp();
  const dailyQuest = quests.find(q => q.action === 'daily');

  const toggleLanguage = () => {
    hapticFeedback.selection();
    setLang(lang === 'ru' ? 'kz' : 'ru');
  };

  return (
    <header className="sticky top-0 z-40 w-full px-5 py-3.5 backdrop-blur-xl bg-[#05060f]/85 border-b border-[rgba(186,215,247,0.12)]">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Brand Wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[rgba(186,214,247,0.06)] border border-[rgba(186,215,247,0.14)] flex items-center justify-center">
            <span className="font-display text-xs font-semibold text-[#d8ecf8]">Z</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-medium text-gradient-skywash tracking-tight leading-tight">
              Zhambyl Hub
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono tracking-wider">
              {lang === 'ru' ? 'IT Экосистема' : 'IT Экожүйесі'}
            </span>
          </div>
        </div>

        {/* Right Actions: Daily Gift + Points Pill + Language */}
        <div className="flex items-center gap-2">
          {/* Daily Gift Button */}
          <button
            onClick={claimDaily}
            className={`btn-ghost-pill !p-2 text-xs transition-all ${
              !dailyQuest?.isDone
                ? '!border-[#663af3] !bg-[rgba(102,58,243,0.2)] !text-[#d8ecf8] shadow-[0_0_12px_rgba(102,58,243,0.35)]'
                : 'text-[#9da7ba]'
            }`}
            title="Ежедневный бонус"
          >
            <Gift className="w-3.5 h-3.5" />
          </button>

          {/* Points Balance Pill */}
          <div 
            onClick={() => openModal('rewards')}
            className="btn-ghost-pill !py-1.5 !px-3 text-xs cursor-pointer active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-[#d8ecf8]" />
            <span className="font-mono text-xs font-semibold text-white">
              {points.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#9da7ba]">pts</span>
          </div>

          {/* Language Switch */}
          <button
            onClick={toggleLanguage}
            className="btn-ghost-pill !py-1.5 !px-2.5 text-[11px] font-mono text-[#c7d3ea] uppercase"
          >
            {lang === 'ru' ? 'RU' : 'KZ'}
          </button>
        </div>
      </div>
    </header>
  );
};
