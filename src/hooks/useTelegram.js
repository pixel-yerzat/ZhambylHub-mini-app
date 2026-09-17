import { useEffect, useMemo } from 'react';
import { 
  getTelegramWebApp, 
  initTelegramApp, 
  hapticFeedback, 
  openTelegramLink, 
  getSystemTheme 
} from '@/utils/telegram';

/**
 * Custom React Hook for Telegram WebApp viewport and styling integration
 */
export const useTelegram = () => {
  const tg = useMemo(() => getTelegramWebApp(), []);

  useEffect(() => {
    initTelegramApp();
  }, []);

  return {
    tg,
    haptics: hapticFeedback,
    openLink: openTelegramLink,
    systemTheme: getSystemTheme(),
    isAvailable: Boolean(tg)
  };
};
