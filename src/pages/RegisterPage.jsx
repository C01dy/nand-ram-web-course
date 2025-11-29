import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/UI/Button';

export const RegisterPage = () => {
  const { t } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [storedValue, setStoredValue] = useState(0);
  const [load, setLoad] = useState(false);

  const handleLoad = () => {
    const value = parseInt(inputValue) || 0;
    if (value >= 0 && value <= 65535) {
      setStoredValue(value);
      setLoad(true);
      setTimeout(() => setLoad(false), 500);
    }
  };

  const toBinary = (num) => {
    return num.toString(2).padStart(16, '0');
  };

  const toHex = (num) => {
    return '0x' + num.toString(16).toUpperCase().padStart(4, '0');
  };

  const binary = toBinary(storedValue);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('register.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('register.intro')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('register.decimal')}</h3>
          <div className="text-4xl font-bold text-center py-4 text-glow-strong">
            {storedValue}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('register.hexadecimal')}</h3>
          <div className="text-4xl font-bold text-center py-4 text-glow-strong">
            {toHex(storedValue)}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('register.binary')}</h3>
          <div className="text-2xl font-bold text-center py-4 text-glow-strong font-mono">
            {binary.slice(0, 8)} {binary.slice(8)}
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8 box-glow">
        <h3 className="text-xl font-bold mb-4">16-Bit Register Visualization</h3>
        <div className="grid grid-cols-16 gap-1 mb-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="text-center text-xs text-terminal-green-dark">
              {15 - i}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-16 gap-1">
          {binary.split('').map((bit, i) => (
            <div
              key={i}
              className={`aspect-square border-2 flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                bit === '1'
                  ? 'border-terminal-green bg-terminal-green text-black box-glow'
                  : 'border-terminal-green-dark'
              } ${load ? 'animate-pulse-glow' : ''}`}
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {bit}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-16 gap-1 mt-2">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="text-center text-xs text-terminal-green-dark">
              Bit{15 - i}
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">{t('register.load')}</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-2">{t('register.enterValue')}</label>
            <input
              type="number"
              min="0"
              max="65535"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="terminal-input w-full"
              placeholder="0-65535"
            />
          </div>
          <Button onClick={handleLoad}>
            {t('register.load')}
          </Button>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8 bg-terminal-bg-light">
        <h3 className="text-xl font-bold mb-4">Parallel Bit Storage</h3>
        <div className="space-y-4">
          <p className="text-terminal-green-light">
            A 16-bit register consists of 16 one-bit registers (Bit chips) working in parallel.
            When LOAD=1, all 16 bits are stored simultaneously.
          </p>
          
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, group) => (
              <div key={group} className="border border-terminal-green-dark p-3">
                <div className="text-xs mb-2 text-center">Bits {15 - group * 4} - {12 - group * 4}</div>
                <div className="space-y-1">
                  {Array.from({ length: 4 }).map((_, i) => {
                    const bitIndex = group * 4 + i;
                    const bit = binary[bitIndex];
                    return (
                      <div
                        key={i}
                        className={`h-8 border flex items-center justify-center text-sm ${
                          bit === '1'
                            ? 'border-terminal-green bg-terminal-green text-black'
                            : 'border-terminal-green-dark'
                        }`}
                      >
                        Bit {15 - bitIndex}: {bit}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6">
        <h3 className="text-xl font-bold mb-4">Quick Values</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            { label: 'Zero', value: 0 },
            { label: 'Max (2¹⁶-1)', value: 65535 },
            { label: 'Half', value: 32768 },
            { label: 'Random', value: Math.floor(Math.random() * 65536) },
            { label: '0xFF00', value: 0xFF00 },
            { label: '0x00FF', value: 0x00FF },
            { label: '0xAAAA', value: 0xAAAA },
            { label: '0x5555', value: 0x5555 },
          ].map((preset) => (
            <Button
              key={preset.label}
              onClick={() => {
                setInputValue(preset.value.toString());
                setStoredValue(preset.value);
                setLoad(true);
                setTimeout(() => setLoad(false), 500);
              }}
              className="text-sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

