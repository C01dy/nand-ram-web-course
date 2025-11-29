import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ControlPanel } from '../components/UI/ControlPanel';
import { Button } from '../components/UI/Button';

export const TickTockPage = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState('tick'); // 'tick' or 'tock'
  const [cycle, setCycle] = useState(0);
  const [speed, setSpeed] = useState(1000); // 1 секунда на фазу (полный цикл = 2 сек)
  const intervalRef = useRef(null);
  
  // DFF состояние
  const [inputD, setInputD] = useState(0);
  const [outputQ, setOutputQ] = useState(0);
  const [nextQ, setNextQ] = useState(0); // Значение, которое будет записано
  const [history, setHistory] = useState([
    { cycle: 0, phase: 'tick', clock: 0, d: 0, q: 0, nextQ: 0 }
  ]);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleStep();
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
  }, [isPlaying, speed]);

  const handleStep = () => {
    setPhase(prev => {
      if (prev === 'tick') {
        // TICK → TOCK: Rising edge! Записываем D в nextQ
        setNextQ(inputD);
        setHistory(h => [...h, { 
          cycle, 
          phase: 'tock', 
          clock: 1, 
          d: inputD, 
          q: outputQ,
          nextQ: inputD,
          risingEdge: true 
        }]);
        return 'tock';
      } else {
        // TOCK → TICK: Обновляем выход Q значением nextQ
        setOutputQ(nextQ);
        setCycle(c => c + 1);
        setHistory(h => [...h, { 
          cycle: cycle + 1, 
          phase: 'tick', 
          clock: 0, 
          d: inputD, 
          q: nextQ,
          nextQ: nextQ 
        }]);
        return 'tick';
      }
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setPhase('tick');
    setCycle(0);
    setInputD(0);
    setOutputQ(0);
    setNextQ(0);
    setHistory([{ cycle: 0, phase: 'tick', clock: 0, d: 0, q: 0, nextQ: 0 }]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('ticktock.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('ticktock.intro')}</p>

      <div className="border-2 border-terminal-green p-4 mb-8 bg-terminal-bg-light">
        <p className="text-terminal-green-light text-sm">
          ⏱️ <strong>Один полный цикл = 2 секунды</strong> (1 сек TICK + 1 сек TOCK)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('ticktock.cycle')}</h3>
          <div className="text-6xl font-bold text-center py-8">
            {cycle}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('ticktock.phase')}</h3>
          <div className={`text-6xl font-bold text-center py-8 uppercase ${phase === 'tick' ? 'text-glow-strong' : ''}`}>
            {phase}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">Clock</h3>
          <div className={`text-6xl font-bold text-center py-8 ${phase === 'tock' ? 'text-glow-strong' : ''}`}>
            {phase === 'tock' ? '1' : '0'}
          </div>
        </div>
      </div>

      {/* DFF Visualization */}
      <div className="border-2 border-terminal-green p-6 mb-8 box-glow">
        <h3 className="text-xl font-bold mb-4">DFF Behavior in Tick-Tock Cycle</h3>
        <p className="text-terminal-green-light mb-6">
          Наблюдайте, как DFF записывает значение на переднем фронте (TICK→TOCK), но выход обновляется только в следующем такте!
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="border-2 border-terminal-green p-4">
            <h4 className="text-sm font-bold mb-2">Input D</h4>
            <div className="text-4xl font-bold text-center py-2">{inputD}</div>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => setInputD(0)} className="flex-1 text-sm py-1">0</Button>
              <Button onClick={() => setInputD(1)} className="flex-1 text-sm py-1">1</Button>
            </div>
          </div>

          <div className={`border-2 p-4 transition-all ${phase === 'tock' ? 'border-terminal-green box-glow-strong' : 'border-terminal-green-dark'}`}>
            <h4 className="text-sm font-bold mb-2">Clock (Rising Edge)</h4>
            <div className={`text-4xl font-bold text-center py-2 ${phase === 'tock' ? 'text-glow-strong' : ''}`}>
              {phase === 'tock' ? '↑' : phase === 'tick' ? '0' : '1'}
            </div>
            <div className="text-center text-xs mt-2">
              {phase === 'tock' ? 'CAPTURING!' : phase === 'tick' ? 'LOW' : 'HIGH'}
            </div>
          </div>

          <div className="border-2 border-terminal-green-dark p-4 bg-terminal-bg-light">
            <h4 className="text-sm font-bold mb-2">Next Q (будет)</h4>
            <div className="text-4xl font-bold text-center py-2 text-terminal-green-light">
              {nextQ}
            </div>
            <div className="text-center text-xs mt-2">
              Записано на фронте
            </div>
          </div>

          <div className="border-2 border-terminal-green p-4 box-glow">
            <h4 className="text-sm font-bold mb-2">Output Q (текущий)</h4>
            <div className="text-4xl font-bold text-center py-2 text-glow-strong">
              {outputQ}
            </div>
            <div className="text-center text-xs mt-2">
              Видимое значение
            </div>
          </div>
        </div>

        {/* Explanation boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className={`border-2 p-4 transition-all ${phase === 'tock' ? 'border-terminal-green bg-terminal-green text-black' : 'border-terminal-green-dark'}`}>
            <div className="font-bold mb-2">📝 TICK → TOCK (Rising Edge 0→1)</div>
            <div className={phase === 'tock' ? 'text-black' : 'text-terminal-green-light'}>
              • D записывается во внутреннее состояние<br/>
              • Q пока не изменился (старое значение)<br/>
              • Новое значение "готовится"
            </div>
          </div>

          <div className={`border-2 p-4 transition-all ${phase === 'tick' ? 'border-terminal-green bg-terminal-green text-black' : 'border-terminal-green-dark'}`}>
            <div className="font-bold mb-2">✅ TOCK → TICK (Falling Edge 1→0)</div>
            <div className={phase === 'tick' ? 'text-black' : 'text-terminal-green-light'}>
              • Q обновляется записанным значением<br/>
              • Теперь новое значение видно на выходе<br/>
              • Готовы к следующему циклу
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div
          className={`border-4 p-6 transition-all duration-500 ${
            phase === 'tick'
              ? 'border-terminal-green bg-terminal-green text-black box-glow-strong'
              : 'border-terminal-green-dark'
          }`}
        >
          <h3 className={`text-2xl font-bold mb-4 ${phase === 'tick' ? 'text-black' : 'text-terminal-green'}`}>
            {t('ticktock.tick')}
          </h3>
          <p className={phase === 'tick' ? 'text-black font-bold' : 'text-terminal-green-light'}>
            {t('ticktock.tickDesc')}
          </p>
          
          <div className="mt-6">
            <div className={`text-sm mb-2 ${phase === 'tick' ? 'text-black' : 'text-terminal-green'}`}>
              Clock = 0 (LOW)
            </div>
            <div className="text-sm">
              DFF output Q = {outputQ} (stable)
            </div>
          </div>
        </div>

        <div
          className={`border-4 p-6 transition-all duration-500 ${
            phase === 'tock'
              ? 'border-terminal-green bg-terminal-green text-black box-glow-strong'
              : 'border-terminal-green-dark'
          }`}
        >
          <h3 className={`text-2xl font-bold mb-4 ${phase === 'tock' ? 'text-black' : 'text-terminal-green'}`}>
            {t('ticktock.tock')}
          </h3>
          <p className={phase === 'tock' ? 'text-black font-bold' : 'text-terminal-green-light'}>
            {t('ticktock.tockDesc')}
          </p>

          <div className="mt-6">
            <div className={`text-sm mb-2 ${phase === 'tock' ? 'text-black' : 'text-terminal-green'}`}>
              Clock = 1 (HIGH) - Rising Edge!
            </div>
            <div className="text-sm">
              DFF capturing D = {inputD} → Next Q
            </div>
          </div>
        </div>
      </div>

      {/* Timing Diagram */}
      <div className="border-2 border-terminal-green p-6 mb-6 box-glow">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold">Timing Diagram - DFF Operation</h3>
            <p className="text-terminal-green-light text-sm mt-2">
              Обратите внимание: D записывается на переднем фронте (↑), но Q обновляется только в следующем такте!
            </p>
          </div>
          
          {/* Control Panel inline */}
          <div className="flex gap-2 flex-wrap">
            {!isPlaying ? (
              <Button onClick={() => setIsPlaying(true)}>{t('common.play')}</Button>
            ) : (
              <Button onClick={() => setIsPlaying(false)}>{t('common.pause')}</Button>
            )}
            <Button onClick={handleStep}>{t('common.step')}</Button>
            <Button onClick={handleReset}>{t('common.reset')}</Button>
          </div>
        </div>
        
        {/* Speed control */}
        <div className="mb-4 flex items-center gap-4">
          <label className="text-terminal-green text-sm">{t('common.speed')}: {speed}ms</label>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="flex-1 max-w-xs accent-terminal-green"
          />
        </div>
        
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Headers */}
            <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(80px,1fr))] gap-1 mb-2">
              <div className="text-sm font-bold">Signal</div>
              {history.slice(-12).map((h, i) => (
                <div key={i} className="text-xs text-center">
                  C{h.cycle} {h.phase === 'tick' ? 'T' : 'K'}
                </div>
              ))}
            </div>

            {/* Clock signal */}
            <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(80px,1fr))] gap-1 mb-1">
              <div className="text-sm">Clock</div>
              {history.slice(-12).map((h, i) => (
                <div
                  key={i}
                  className={`h-12 border flex items-center justify-center text-lg font-bold transition-all ${
                    i === history.slice(-12).length - 1
                      ? 'border-terminal-green bg-terminal-green text-black box-glow'
                      : h.clock === 1
                      ? 'border-terminal-green-light bg-terminal-green-dark'
                      : 'border-terminal-green-dark'
                  }`}
                >
                  {h.clock}
                  {h.risingEdge && <span className="ml-1 text-sm">↑</span>}
                </div>
              ))}
            </div>

            {/* D signal */}
            <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(80px,1fr))] gap-1 mb-1">
              <div className="text-sm">Input D</div>
              {history.slice(-12).map((h, i) => (
                <div
                  key={i}
                  className={`h-12 border flex items-center justify-center text-lg font-bold transition-all ${
                    i === history.slice(-12).length - 1
                      ? 'border-terminal-green bg-terminal-bg-light'
                      : h.d === 1
                      ? 'border-terminal-green-light'
                      : 'border-terminal-green-dark'
                  }`}
                >
                  {h.d}
                </div>
              ))}
            </div>

            {/* Next Q (internal) */}
            <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(80px,1fr))] gap-1 mb-1">
              <div className="text-sm">Next Q (internal)</div>
              {history.slice(-12).map((h, i) => (
                <div
                  key={i}
                  className={`h-12 border flex items-center justify-center text-lg font-bold transition-all ${
                    i === history.slice(-12).length - 1
                      ? 'border-terminal-green bg-terminal-bg-light'
                      : h.risingEdge
                      ? 'border-terminal-green bg-terminal-green-dark animate-pulse-glow'
                      : 'border-terminal-green-dark'
                  }`}
                >
                  {h.nextQ}
                  {h.risingEdge && <span className="ml-1 text-xs">✓</span>}
                </div>
              ))}
            </div>

            {/* Q signal */}
            <div className="grid grid-cols-[120px_repeat(auto-fit,minmax(80px,1fr))] gap-1 mb-1">
              <div className="text-sm">Output Q</div>
              {history.slice(-12).map((h, i) => (
                <div
                  key={i}
                  className={`h-12 border flex items-center justify-center text-lg font-bold transition-all ${
                    i === history.slice(-12).length - 1
                      ? 'border-terminal-green bg-terminal-green text-black box-glow-strong'
                      : h.q === 1
                      ? 'border-terminal-green-light bg-terminal-green-dark'
                      : 'border-terminal-green-dark'
                  }`}
                >
                  {h.q}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 border border-terminal-green-dark bg-terminal-bg-light">
          <div className="text-sm space-y-2">
            <div>
              <span className="text-terminal-green font-bold">↑</span> = Rising Edge (передний фронт) - момент записи D в DFF
            </div>
            <div>
              <span className="text-terminal-green font-bold">✓</span> = Значение записано во внутреннее состояние (Next Q)
            </div>
            <div>
              <span className="text-terminal-green font-bold">Важно:</span> Output Q обновляется только в следующем такте после записи!
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Timeline</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-4">
          {Array.from({ length: Math.max(10, cycle * 2 + 2) }).map((_, i) => {
            const isTick = i % 2 === 0;
            const cycleNum = Math.floor(i / 2);
            const isCurrent = cycleNum === cycle && ((isTick && phase === 'tick') || (!isTick && phase === 'tock'));
            
            return (
              <div
                key={i}
                className={`min-w-24 h-16 border-2 flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'border-terminal-green bg-terminal-green text-black box-glow-strong scale-110'
                    : i < cycle * 2 + (phase === 'tock' ? 1 : 0)
                    ? 'border-terminal-green-dark'
                    : 'border-terminal-green-dark opacity-30'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs">{isTick ? 'TICK' : 'TOCK'}</div>
                  <div className="text-lg font-bold">{cycleNum}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

