import { useLanguage } from '../../contexts/LanguageContext';

export const Header = () => {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <header className="bg-terminal-bg-light border-b-2 border-terminal-green p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-glow cursor-blink">
          {t('nav.title')}
        </h1>
        
        <button
          onClick={toggleLanguage}
          className="terminal-button text-sm"
        >
          {language === 'en' ? 'RU' : 'EN'}
        </button>
      </div>
    </header>
  );
};

