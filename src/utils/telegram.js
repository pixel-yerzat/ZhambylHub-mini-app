/**
 * Telegram WebApp Helpers & Haptic Feedback & Theme Detection
 */

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor?.('#05060f');
      tg.setBackgroundColor?.('#05060f');
      tg.setBottomBarColor?.('#05060f');
      tg.enableClosingConfirmation?.();
    } catch (e) {
      console.warn('Telegram closing confirmation not supported', e);
    }
  }
};

export const getSystemTheme = () => {
  const tg = getTelegramWebApp();
  if (tg?.colorScheme) {
    return tg.colorScheme; // 'light' | 'dark'
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};

export const hapticFeedback = {
  impact: (style = 'medium') => {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback?.impactOccurred) {
      tg.HapticFeedback.impactOccurred(style);
    }
  },
  notification: (type = 'success') => {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback?.notificationOccurred) {
      tg.HapticFeedback.notificationOccurred(type);
    }
  },
  selection: () => {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback?.selectionChanged) {
      tg.HapticFeedback.selectionChanged();
    }
  }
};


export const openTelegramLink = (url) => {
  const tg = getTelegramWebApp();
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
};
