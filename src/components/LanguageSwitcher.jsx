import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    console.log('🌐 Switching to language:', lng);
    i18n.changeLanguage(lng);
  };

  // Debug logging
  console.log('🔧 LanguageSwitcher rendering, current language:', i18n.language);

  return (
    <div>
      {/* Debug element - remove this after testing */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'lime',
        color: 'black',
        padding: '5px',
        zIndex: 99999,
        fontSize: '12px'
      }}>
        🐛 DEBUG: LanguageSwitcher Loaded
      </div>

      <div className="flex items-center space-x-2 bg-red-600 rounded-lg p-2 shadow-xl border-2 border-red-400" style={{zIndex: 9999, position: 'relative'}}>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-4 py-3 rounded-md text-base font-bold transition-all duration-300 transform hover:scale-110 ${
            i18n.language === 'en'
              ? 'bg-yellow-400 text-red-600 shadow-lg'
              : 'text-white hover:bg-red-700'
          }`}
        >
          🇺🇸 ENGLISH
        </button>
        <button
          onClick={() => changeLanguage('fr')}
          className={`px-4 py-3 rounded-md text-base font-bold transition-all duration-300 transform hover:scale-110 ${
            i18n.language === 'fr'
              ? 'bg-yellow-400 text-red-600 shadow-lg'
              : 'text-white hover:bg-red-700'
          }`}
        >
          🇫🇷 FRANÇAIS
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
