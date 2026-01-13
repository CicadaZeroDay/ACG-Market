import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';
import { useTelegram } from '@/contexts/TelegramContext';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ru');
  const { user } = useTelegram();

  // Auto-detect language from Telegram user
  useEffect(() => {
    if (user?.language_code) {
      const langCode = user.language_code.toLowerCase();
      if (langCode === 'ru') setLanguage('ru');
      else if (langCode === 'uk' || langCode === 'ua') setLanguage('ua');
      else setLanguage('en');
    }
  }, [user]);

  const t = translations[language];

  return {
    language,
    setLanguage,
    t
  };
}
