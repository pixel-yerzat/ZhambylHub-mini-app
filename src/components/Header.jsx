import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Globe } from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

export const Header = () => {
  const { lang, setLang, user } = useApp();

  const toggleLanguage = () => {
    hapticFeedback.selection();
    setLang(lang === 'ru' ? 'kz' : 'ru');
  };

  return (
    <header 
      className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#05060f]/95 border-b border-[rgba(186,215,247,0.14)] shadow-[0_4px_24px_rgba(0,0,0,0.5)] box-border"
      style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '16px', paddingBottom: '16px' }}
    >
      <div className="flex items-center justify-between gap-3 w-full max-w-md mx-auto">
        {/* Brand Wordmark & Logo with guaranteed margin */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-[rgba(102,58,243,0.18)] border border-[rgba(102,58,243,0.4)] flex items-center justify-center shadow-[0_0_15px_rgba(102,58,243,0.35)] shrink-0">
            <span className="font-display text-base font-bold text-[#d8ecf8]">Z</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-display text-base font-bold text-gradient-skywash tracking-tight leading-tight truncate">
              Zhambyl Hub
            </span>
            <span className="text-[10px] text-[#9da7ba] uppercase font-mono tracking-wider truncate">
              {lang === 'ru' ? 'IT Экосистема · Тараз' : 'IT Экожүйесі · Тараз'}
            </span>
          </div>
        </div>

        {/* Right Actions: Role Badge & Language Switch */}
        <div className="flex items-center gap-2 shrink-0">
          {user.role && (
            <span className="badge badge-violet text-xs !py-1 !px-2.5 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#a78bfa]" />
              <span className="text-[11px] font-medium">{user.role === 'moderator' ? 'Staff' : user.roleTitle}</span>
            </span>
          )}

          {/* Language Switch Button */}
          <button
            onClick={toggleLanguage}
            className="btn-ghost-pill !py-1.5 !px-3 text-xs font-mono text-[#c7d3ea] uppercase font-semibold hover:border-[#663af3] transition-all active:scale-95 flex items-center gap-1"
            title="Сменить язык"
          >
            <Globe className="w-3.5 h-3.5 text-[#663af3]" />
            <span>{lang === 'ru' ? 'RU' : 'KZ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
