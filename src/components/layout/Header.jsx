import React from 'react';
import { useApp } from '@/context';
import { ShieldCheck, Globe } from 'lucide-react';
import { hapticFeedback } from '@/utils/telegram';

export const Header = ({ isTransparent = false }) => {
  const { lang, setLang, user } = useApp();

  const toggleLanguage = () => {
    hapticFeedback.selection();
    setLang(lang === 'ru' ? 'kz' : 'ru');
  };

  return (
    <header className={`app-header ${isTransparent ? 'app-header--transparent' : ''}`}>
      <div className="flex items-center justify-between gap-2 w-full max-w-md mx-auto">
        {/* Brand Wordmark & Logo */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.4)] flex items-center justify-center shadow-[0_0_12px_rgba(102,58,243,0.35)] shrink-0">
            <span className="font-display text-sm sm:text-base font-bold text-[#d8ecf8]">Z</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-sm sm:text-base font-bold text-gradient-skywash tracking-tight leading-tight truncate">
              Zhambyl Hub
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#9da7ba] uppercase font-mono tracking-wider truncate">
              {lang === 'ru' ? 'IT Экосистема · Тараз' : 'IT Экожүйесі · Тараз'}
            </span>
          </div>
        </div>

        {/* Right Actions: Role Badge & Language Switch */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {user.role && (
            <span className="badge badge-violet text-[10px] sm:text-xs !py-1 !px-2 flex items-center gap-1 max-w-[85px] sm:max-w-none truncate">
              <ShieldCheck className="w-3 h-3 text-[#a78bfa] shrink-0" />
              <span className="font-medium truncate">{user.roleTitle}</span>
            </span>
          )}

          {/* Language Switch Button */}
          <button
            onClick={toggleLanguage}
            className="btn-ghost-pill !py-1 !px-2.5 text-[11px] sm:text-xs font-mono text-[#c7d3ea] uppercase font-semibold hover:border-[#663af3] transition-all active:scale-95 flex items-center gap-1 shrink-0"
            title="Сменить язык"
          >
            <Globe className="w-3 h-3 text-[#663af3] shrink-0" />
            <span>{lang === 'ru' ? 'RU' : 'KZ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
