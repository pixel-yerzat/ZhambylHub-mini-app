/**
 * Telegram WebApp Helpers & Haptic Feedback
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
    // Enable closing confirmation if needed
    try {
      tg.enableClosingConfirmation?.();
    } catch (e) {
      console.warn('Telegram closing confirmation not supported', e);
    }
  }
};

export const hapticFeedback = {
  impact: (style = 'medium') => {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback?.impactOccurred) {
      tg.HapticFeedback.impactOccurred(style); // 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
    }
  },
  notification: (type = 'success') => {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback?.notificationOccurred) {
      tg.HapticFeedback.notificationOccurred(type); // 'error' | 'success' | 'warning'
    }
  },
  selection: () => {
    const tg = getTelegramWebApp();
    if (tg?.HapticFeedback?.selectionChanged) {
      tg.HapticFeedback.selectionChanged();
    }
  }
};

export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg?.initDataUnsafe?.user) {
    return {
      id: tg.initDataUnsafe.user.id,
      firstName: tg.initDataUnsafe.user.first_name || 'Инноватор',
      lastName: tg.initDataUnsafe.user.last_name || '',
      username: tg.initDataUnsafe.user.username || 'zhambyl_member',
      photoUrl: tg.initDataUnsafe.user.photo_url || null,
      isTelegram: true
    };
  }

  // Fallback demo user for browser preview
  return {
    id: 777001,
    firstName: 'Yerzat',
    lastName: 'Innovator',
    username: 'yerzat_taraz',
    photoUrl: null,
    isTelegram: false
  };
};

export const openTelegramLink = (url) => {
  const tg = getTelegramWebApp();
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(url);
  } else {
    window.open(url, '_blank');
  }
};
