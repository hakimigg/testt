import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-1 bg-slate-100/90 rounded-lg p-1 shadow-md border border-slate-200">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'en'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'fr'
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
        }`}
      >
        🇫🇷 FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
