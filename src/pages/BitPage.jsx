import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ControlPanel } from '../components/UI/ControlPanel';
import { Button } from '../components/UI/Button';

export const BitPage = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [input, setInput] = useState(0);
  const [load, setLoad] = useState(0);
  const [stored, setStored] = useState(0);
  const [clockState, setClockState] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setClockState(prev => {
          const newClock = prev === 0 ? 1 : 0;
          
          // Update on rising edge
          if (newClock === 1 && prev === 0) {
            if (load === 1) {
              setStored(input);
            }
          }
          
          return newClock;
        });
      }, speed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, input, load]);

  const handleStep = () => {
    const newClock = clockState === 0 ? 1 : 0;
    
    if (newClock === 1 && clockState === 0) {
      if (load === 1) {
        setStored(input);
      }
    }
    
    setClockState(newClock);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setInput(0);
    setLoad(0);
    setStored(0);
    setClockState(0);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('bit.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('bit.intro')}</p>

      <div className="border-2 border-terminal-green p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">{t('bit.operation')}</h3>
        <p className="text-terminal-green-light mb-4">{t('bit.operationDesc')}</p>
        
        <div className="grid grid-cols-2 gap-4 p-4 bg-terminal-bg-light border border-terminal-green-dark">
          <div>
            <div className="text-sm mb-2">LOAD = 1</div>
            <div className="text-lg">OUT ← IN</div>
          </div>
          <div>
            <div className="text-sm mb-2">LOAD = 0</div>
            <div className="text-lg">OUT ← OUT (unchanged)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('bit.in')}</h3>
          <div className="text-6xl font-bold text-center py-4">
            {input}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setInput(0)} className="flex-1">0</Button>
            <Button onClick={() => setInput(1)} className="flex-1">1</Button>
          </div>
        </div>

        <div className={`border-2 p-4 transition-all ${load === 1 ? 'border-terminal-green box-glow' : 'border-terminal-green-dark'}`}>
          <h3 className="text-lg font-bold mb-2">{t('bit.load')}</h3>
          <div className={`text-6xl font-bold text-center py-4 ${load === 1 ? 'text-glow-strong' : ''}`}>
            {load}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setLoad(0)} className="flex-1">0</Button>
            <Button onClick={() => setLoad(1)} className="flex-1">1</Button>
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">Clock</h3>
          <div className={`text-6xl font-bold text-center py-4 ${clockState === 1 ? 'text-glow-strong' : ''}`}>
            {clockState}
          </div>
          <div className="text-center text-sm mt-4">
            {clockState === 1 ? 'HIGH' : 'LOW'}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4 box-glow-strong">
          <h3 className="text-lg font-bold mb-2">{t('bit.stored')}</h3>
          <div className="text-6xl font-bold text-center py-4 text-glow-strong">
            {stored}
          </div>
          <div className="text-center text-sm mt-4">
            {t('bit.out')}
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-6 bg-terminal-bg-light">
        <h3 className="text-xl font-bold mb-4">Bit Register Schematic</h3>
        <div className="flex items-center justify-center gap-8 p-8">
          <div className="flex flex-col items-center">
            <div className="text-sm mb-2">IN</div>
            <div className={`w-16 h-16 border-2 border-terminal-green flex items-center justify-center text-3xl ${input === 1 ? 'box-glow' : ''}`}>
              {input}
            </div>
            <div className="w-0.5 h-12 bg-terminal-green mt-2"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm mb-2">LOAD</div>
            <div className={`w-16 h-16 border-2 flex items-center justify-center text-3xl ${load === 1 ? 'border-terminal-green box-glow' : 'border-terminal-green-dark'}`}>
              {load}
            </div>
            <div className="w-0.5 h-12 bg-terminal-green mt-2"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className={`w-32 h-32 border-4 border-terminal-green flex items-center justify-center ${clockState === 1 && load === 1 ? 'animate-pulse-glow' : ''}`}>
              <div className="text-center">
                <div className="text-xs">DFF</div>
                <div className="text-4xl font-bold">{stored}</div>
              </div>
            </div>
            <div className="w-0.5 h-12 bg-terminal-green mt-2"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm mb-2">OUT</div>
            <div className={`w-16 h-16 border-2 border-terminal-green flex items-center justify-center text-3xl box-glow-strong`}>
              {stored}
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Truth Table</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-terminal-green">
              <th className="p-2 text-left">LOAD</th>
              <th className="p-2 text-left">IN</th>
              <th className="p-2 text-left">OUT (t+1)</th>
              <th className="p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr className={`border-b border-terminal-green-dark ${load === 0 ? 'bg-terminal-bg-light' : ''}`}>
              <td className="p-2">0</td>
              <td className="p-2">X</td>
              <td className="p-2">OUT (t)</td>
              <td className="p-2 text-sm">Keep current value</td>
            </tr>
            <tr className={`border-b border-terminal-green-dark ${load === 1 && input === 0 ? 'bg-terminal-bg-light' : ''}`}>
              <td className="p-2">1</td>
              <td className="p-2">0</td>
              <td className="p-2">0</td>
              <td className="p-2 text-sm">Store 0</td>
            </tr>
            <tr className={`border-b border-terminal-green-dark ${load === 1 && input === 1 ? 'bg-terminal-bg-light' : ''}`}>
              <td className="p-2">1</td>
              <td className="p-2">1</td>
              <td className="p-2">1</td>
              <td className="p-2 text-sm">Store 1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ControlPanel
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStep={handleStep}
        onReset={handleReset}
        speed={speed}
        onSpeedChange={setSpeed}
      />
    </div>
  );
};

