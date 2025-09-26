import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2 bg-blue-600 rounded-lg p-1 shadow-lg">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'en'
            ? 'bg-white text-blue-600 shadow-md'
            : 'text-white hover:bg-blue-700'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={`px-4 py-2 rounded-md text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
          i18n.language === 'fr'
            ? 'bg-white text-blue-600 shadow-md'
            : 'text-white hover:bg-blue-700'
        }`}
      >
        🇫🇷 FR
      </button>
    </div>
  );
};

export default LanguageSwitcher;
