import { useEffect, useMemo } from 'react';
import { 
  getTelegramWebApp, 
  getTelegramUser, 
  initTelegramApp, 
  hapticFeedback, 
  openTelegramLink, 
  getSystemTheme 
} from '@/utils/telegram';

/**
 * Custom React Hook for Telegram WebApp SDK
 */
export const useTelegram = () => {
  const tg = useMemo(() => getTelegramWebApp(), []);

  useEffect(() => {
    initTelegramApp();
  }, []);

  return {
    tg,
    user: getTelegramUser(),
    haptics: hapticFeedback,
    openLink: openTelegramLink,
    systemTheme: getSystemTheme(),
    isAvailable: Boolean(tg)
  };
};
