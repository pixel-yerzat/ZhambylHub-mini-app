import { useState, useEffect, useCallback } from 'react';
import { getTelegramWebApp, getSystemTheme, hapticFeedback } from '@/utils/telegram';
import { STORAGE_KEYS } from '@/constants/app';

/**
 * Custom React hook for theme synchronization (Dark / Light / System)
 */
export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    return getSystemTheme();
  });

  const applyTheme = useCallback((t) => {
    const activeTheme = t === 'system' ? getSystemTheme() : t;
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (activeTheme === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    // Listen to Telegram WebApp Theme changes
    const tg = getTelegramWebApp();
    const handleTgTheme = () => {
      if (theme === 'system' || !localStorage.getItem(STORAGE_KEYS.THEME)) {
        const newTheme = tg?.colorScheme || getSystemTheme();
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    if (tg?.onEvent) {
      tg.onEvent('themeChanged', handleTgTheme);
    }

    // Listen to OS prefers-color-scheme
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    const handleOsTheme = (e) => {
      if (theme === 'system' || !localStorage.getItem(STORAGE_KEYS.THEME)) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery?.addEventListener?.('change', handleOsTheme);

    return () => {
      if (tg?.offEvent) tg.offEvent('themeChanged', handleTgTheme);
      mediaQuery?.removeEventListener?.('change', handleOsTheme);
    };
  }, [theme, applyTheme]);

  const toggleTheme = useCallback(() => {
    hapticFeedback.selection();
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme
  };
};
