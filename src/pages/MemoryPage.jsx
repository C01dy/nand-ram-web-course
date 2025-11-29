import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const MemoryPage = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);

  const levels = [
    {
      id: 'registers',
      title: t('memory.registers'),
      desc: t('memory.registersDesc'),
      size: 'small',
      speed: 'fastest',
      color: 'terminal-green'
    },
    {
      id: 'ram',
      title: t('memory.ram'),
      desc: t('memory.ramDesc'),
      size: 'medium',
      speed: 'fast',
      color: 'terminal-green-light'
    },
    {
      id: 'storage',
      title: t('memory.storage'),
      desc: t('memory.storageDesc'),
      size: 'large',
      speed: 'slow',
      color: 'terminal-green-dark'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('memory.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('memory.intro')}</p>

      <div className="mb-8 text-terminal-green-light">
        <p className="animate-pulse">{t('memory.clickToExplore')}</p>
      </div>

      <div className="space-y-6">
        {levels.map((level, index) => {
          const isSelected = selected === level.id;
          const widthClass = level.size === 'small' ? 'w-1/3' : level.size === 'medium' ? 'w-2/3' : 'w-full';
          
          return (
            <div
              key={level.id}
              className={`${widthClass} mx-auto transition-all duration-500 cursor-pointer`}
              onClick={() => setSelected(isSelected ? null : level.id)}
            >
              <div
                className={`border-4 p-6 transition-all duration-300 ${
                  isSelected
                    ? `border-${level.color} box-glow-strong bg-terminal-bg-light`
                    : `border-${level.color} hover:box-glow`
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-2xl font-bold text-${level.color}`}>
                    [{index + 1}] {level.title}
                  </h3>
                  <div className={`text-sm text-${level.color}`}>
                    {level.speed.toUpperCase()}
                  </div>
                </div>
                
                {isSelected && (
                  <div className="mt-4 animate-pulse">
                    <p className={`text-${level.color}`}>{level.desc}</p>
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {Array.from({ length: level.size === 'small' ? 4 : level.size === 'medium' ? 8 : 16 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 flex-1 border-2 border-${level.color} ${
                        isSelected ? 'animate-pulse-glow' : ''
                      }`}
                      style={{
                        animationDelay: `${i * 100}ms`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-6 border-2 border-terminal-green bg-terminal-bg-light">
        <h3 className="text-xl font-bold mb-4 text-terminal-green">Memory Hierarchy Pyramid</h3>
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-16 border-2 border-terminal-green flex items-center justify-center text-xs">
            CPU
          </div>
          <div className="w-32 h-16 border-2 border-terminal-green flex items-center justify-center text-xs">
            Registers
          </div>
          <div className="w-48 h-16 border-2 border-terminal-green-light flex items-center justify-center text-xs">
            RAM
          </div>
          <div className="w-64 h-16 border-2 border-terminal-green-dark flex items-center justify-center text-xs">
            Storage
          </div>
        </div>
      </div>
    </div>
  );
};

