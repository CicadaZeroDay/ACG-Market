import { useState, useEffect, useCallback } from 'react';

// Telegram WebApp types
interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    start_param?: string;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: { text?: string; color?: string; text_color?: string; is_active?: boolean; is_visible?: boolean }) => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  showPopup: (params: { title?: string; message: string; buttons?: Array<{ id?: string; type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'; text?: string }> }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, callback: () => void) => void;
  offEvent: (eventType: string, callback: () => void) => void;
  sendData: (data: string) => void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export interface UseTelegramWebAppReturn {
  webApp: TelegramWebApp | null;
  isMiniApp: boolean;
  isReady: boolean;
  user: TelegramWebApp['initDataUnsafe']['user'] | null;
  platform: string;
  colorScheme: 'light' | 'dark';
  viewportHeight: number;
  viewportStableHeight: number;
  themeParams: TelegramWebApp['themeParams'];
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection') => void;
  showMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  setMainButtonLoading: (loading: boolean) => void;
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  showAlert: (message: string) => Promise<void>;
  showConfirm: (message: string) => Promise<boolean>;
  close: () => void;
}

export function useTelegramWebApp(): UseTelegramWebAppReturn {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [mainButtonCallback, setMainButtonCallback] = useState<(() => void) | null>(null);
  const [backButtonCallback, setBackButtonCallback] = useState<(() => void) | null>(null);

  // Проверяем что это реально Telegram Mini App, а не просто загруженный SDK
  // initData существует только когда сайт открыт внутри Telegram
  const isMiniApp = Boolean(webApp && typeof window !== 'undefined' && (window.Telegram?.WebApp as any)?.initData);

  useEffect(() => {
    const tgWebApp = window.Telegram?.WebApp;

    if (tgWebApp) {
      setWebApp(tgWebApp);

      // Initialize the Mini App
      tgWebApp.ready();
      tgWebApp.expand();

      // Set theme colors
      tgWebApp.setHeaderColor('#0a0a0a');
      tgWebApp.setBackgroundColor('#0a0a0a');

      // Apply theme params to CSS variables
      const root = document.documentElement;
      if (tgWebApp.themeParams.bg_color) {
        root.style.setProperty('--tg-theme-bg-color', tgWebApp.themeParams.bg_color);
      }
      if (tgWebApp.themeParams.text_color) {
        root.style.setProperty('--tg-theme-text-color', tgWebApp.themeParams.text_color);
      }
      if (tgWebApp.themeParams.secondary_bg_color) {
        root.style.setProperty('--tg-theme-secondary-bg-color', tgWebApp.themeParams.secondary_bg_color);
      }

      // Set viewport height CSS variable
      root.style.setProperty('--tg-viewport-height', `${tgWebApp.viewportHeight}px`);
      root.style.setProperty('--tg-viewport-stable-height', `${tgWebApp.viewportStableHeight}px`);

      // Add mini-app-mode class to body
      document.body.classList.add('mini-app-mode');

      setIsReady(true);

      // Listen for viewport changes
      const handleViewportChanged = () => {
        root.style.setProperty('--tg-viewport-height', `${tgWebApp.viewportHeight}px`);
        root.style.setProperty('--tg-viewport-stable-height', `${tgWebApp.viewportStableHeight}px`);
      };

      tgWebApp.onEvent('viewportChanged', handleViewportChanged);

      return () => {
        tgWebApp.offEvent('viewportChanged', handleViewportChanged);
        document.body.classList.remove('mini-app-mode');
      };
    } else {
      setIsReady(true); // Ready even without Telegram (browser mode)
    }
  }, []);

  const hapticFeedback = useCallback((type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection') => {
    if (!webApp?.HapticFeedback) return;

    if (type === 'selection') {
      webApp.HapticFeedback.selectionChanged();
    } else if (type === 'success' || type === 'error' || type === 'warning') {
      webApp.HapticFeedback.notificationOccurred(type);
    } else {
      webApp.HapticFeedback.impactOccurred(type);
    }
  }, [webApp]);

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (!webApp?.MainButton) return;

    // Remove previous callback
    if (mainButtonCallback) {
      webApp.MainButton.offClick(mainButtonCallback);
    }

    webApp.MainButton.setParams({
      text,
      color: '#FFD200',
      text_color: '#000000',
      is_active: true,
      is_visible: true,
    });

    webApp.MainButton.onClick(onClick);
    setMainButtonCallback(() => onClick);
    webApp.MainButton.show();
  }, [webApp, mainButtonCallback]);

  const hideMainButton = useCallback(() => {
    if (!webApp?.MainButton) return;

    if (mainButtonCallback) {
      webApp.MainButton.offClick(mainButtonCallback);
      setMainButtonCallback(null);
    }
    webApp.MainButton.hide();
  }, [webApp, mainButtonCallback]);

  const setMainButtonLoading = useCallback((loading: boolean) => {
    if (!webApp?.MainButton) return;

    if (loading) {
      webApp.MainButton.showProgress(true);
    } else {
      webApp.MainButton.hideProgress();
    }
  }, [webApp]);

  const showBackButton = useCallback((onClick: () => void) => {
    if (!webApp?.BackButton) return;

    // Remove previous callback
    if (backButtonCallback) {
      webApp.BackButton.offClick(backButtonCallback);
    }

    webApp.BackButton.onClick(onClick);
    setBackButtonCallback(() => onClick);
    webApp.BackButton.show();
  }, [webApp, backButtonCallback]);

  const hideBackButton = useCallback(() => {
    if (!webApp?.BackButton) return;

    if (backButtonCallback) {
      webApp.BackButton.offClick(backButtonCallback);
      setBackButtonCallback(null);
    }
    webApp.BackButton.hide();
  }, [webApp, backButtonCallback]);

  const openLink = useCallback((url: string) => {
    if (webApp) {
      webApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  }, [webApp]);

  const openTelegramLink = useCallback((url: string) => {
    if (webApp) {
      webApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  }, [webApp]);

  const showAlert = useCallback((message: string): Promise<void> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showAlert(message, () => resolve());
      } else {
        alert(message);
        resolve();
      }
    });
  }, [webApp]);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => resolve(confirmed));
      } else {
        resolve(confirm(message));
      }
    });
  }, [webApp]);

  const close = useCallback(() => {
    if (webApp) {
      webApp.close();
    }
  }, [webApp]);

  return {
    webApp,
    isMiniApp,
    isReady,
    user: webApp?.initDataUnsafe?.user || null,
    platform: webApp?.platform || 'browser',
    colorScheme: webApp?.colorScheme || 'dark',
    viewportHeight: webApp?.viewportHeight || (typeof window !== 'undefined' ? window.innerHeight : 0),
    viewportStableHeight: webApp?.viewportStableHeight || (typeof window !== 'undefined' ? window.innerHeight : 0),
    themeParams: webApp?.themeParams || {},
    hapticFeedback,
    showMainButton,
    hideMainButton,
    setMainButtonLoading,
    showBackButton,
    hideBackButton,
    openLink,
    openTelegramLink,
    showAlert,
    showConfirm,
    close,
  };
}

export default useTelegramWebApp;
