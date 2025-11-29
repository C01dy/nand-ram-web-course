import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ControlPanel } from '../components/UI/ControlPanel';
import { Button } from '../components/UI/Button';

export const ClockPage = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [clockState, setClockState] = useState(0);
  const [speed, setSpeed] = useState(1000); // 1 секунда на фазу (TICK или TOCK)
  const [time, setTime] = useState(0);
  const [phase, setPhase] = useState('tick'); // 'tick' or 'tock'
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);
  
  // DFF состояние
  const [inputD, setInputD] = useState(0);
  const [outputQ, setOutputQ] = useState(0);
  const [nextQ, setNextQ] = useState(0);
  const [history, setHistory] = useState([
    { time: 0, phase: 'tick', clock: 0, d: 0, q: 0, nextQ: 0 }
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height / 4; // Делим на 4 сигнала

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 16; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (canvas.height / 16) * i);
      ctx.lineTo(canvas.width, (canvas.height / 16) * i);
      ctx.stroke();
    }

    const recentHistory = history.slice(-20);
    const pointWidth = Math.max(40, width / Math.max(recentHistory.length, 10));

    // Helper function to draw signal
    const drawSignal = (data, yOffset, label, color = '#00ff00') => {
      ctx.fillStyle = color;
      ctx.font = '14px monospace';
      ctx.fillText(label, 5, yOffset + 15);

      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();

      data.forEach((point, i) => {
        const x = i * pointWidth + 100;
        const y = point === 1 ? yOffset + 10 : yOffset + height - 10;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();

      // Current position indicator
      if (data.length > 0) {
        const lastX = (data.length - 1) * pointWidth + 100;
        const lastY = data[data.length - 1] === 1 ? yOffset + 10 : yOffset + height - 10;
        ctx.fillStyle = color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    // Draw Clock signal
    drawSignal(recentHistory.map(h => h.clock), 0, 'CLK', '#00cc00');

    // Draw D signal
    drawSignal(recentHistory.map(h => h.d), height, 'D', '#33ff33');

    // Draw Next Q (internal)
    drawSignal(recentHistory.map(h => h.nextQ), height * 2, 'Next Q', '#00ff00');

    // Draw Q signal
    drawSignal(recentHistory.map(h => h.q), height * 3, 'Q', '#00ff00');

    // Draw rising edge markers
    ctx.fillStyle = '#ff0000';
    ctx.font = '20px monospace';
    recentHistory.forEach((h, i) => {
      if (h.risingEdge) {
        const x = i * pointWidth + 100;
        ctx.fillText('↑', x - 8, 25);
      }
    });

    // Draw phase labels
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px monospace';
    recentHistory.forEach((h, i) => {
      const x = i * pointWidth + 100;
      ctx.fillText(h.phase === 'tick' ? 'T' : 'K', x - 5, canvas.height - 5);
    });

  }, [history]);

  const handleStep = () => {
    setPhase(prev => {
      if (prev === 'tick') {
        // TICK → TOCK: Rising edge!
        setClockState(1);
        setNextQ(inputD);
        setHistory(h => [...h, { 
          time: time + 1, 
          phase: 'tock', 
          clock: 1, 
          d: inputD, 
          q: outputQ,
          nextQ: inputD,
          risingEdge: true 
        }]);
        setTime(t => t + 1);
        return 'tock';
      } else {
        // TOCK → TICK: Falling edge, update Q
        setClockState(0);
        setOutputQ(nextQ);
        setHistory(h => [...h, { 
          time: time + 1, 
          phase: 'tick', 
          clock: 0, 
          d: inputD, 
          q: nextQ,
          nextQ: nextQ 
        }]);
        setTime(t => t + 1);
        return 'tick';
      }
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setClockState(0);
    setTime(0);
    setPhase('tick');
    setInputD(0);
    setOutputQ(0);
    setNextQ(0);
    setHistory([{ time: 0, phase: 'tick', clock: 0, d: 0, q: 0, nextQ: 0 }]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('clock.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('clock.intro')}</p>

      <div className="border-2 border-terminal-green p-4 mb-8 bg-terminal-bg-light">
        <p className="text-terminal-green-light text-sm">
          ⏱️ <strong>Один полный цикл = 2 секунды</strong> (1 сек TICK + 1 сек TOCK)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="border-2 border-terminal-green p-4 box-glow">
          <h3 className="text-lg font-bold mb-2">{t('clock.currentState')}</h3>
          <div className={`text-5xl font-bold text-center py-6 ${clockState === 1 ? 'text-glow-strong' : ''}`}>
            {clockState === 1 ? t('clock.high') : t('clock.low')}
          </div>
          <div className="text-center text-3xl">
            {clockState}
          </div>
        </div>

        <div className={`border-2 p-4 transition-all ${phase === 'tick' ? 'border-terminal-green box-glow' : 'border-terminal-green-dark'}`}>
          <h3 className="text-lg font-bold mb-2">Phase</h3>
          <div className={`text-5xl font-bold text-center py-6 uppercase ${phase === 'tick' ? 'text-glow-strong' : ''}`}>
            {phase}
          </div>
          <div className="text-center text-sm mt-2">
            {phase === 'tick' ? 'Clock = 0' : 'Clock = 1'}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('clock.frequency')}</h3>
          <div className="text-3xl font-bold text-center py-6">
            {(1000 / (speed * 2)).toFixed(3)} Hz
          </div>
          <div className="text-center text-xs mt-2">
            (полный цикл)
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('clock.period')}</h3>
          <div className="text-3xl font-bold text-center py-6">
            {speed * 2} ms
          </div>
          <div className="text-center text-xs mt-2">
            (полный цикл)
          </div>
        </div>
      </div>

      {/* DFF Controls */}
      <div className="border-2 border-terminal-green p-6 mb-8 box-glow">
        <h3 className="text-xl font-bold mb-4">DFF with Clock Signal - Debug Mode</h3>
        <p className="text-terminal-green-light mb-6 text-sm">
          🐛 <strong>Режим отладки:</strong> Измените Input D перед каждым шагом и наблюдайте, как DFF записывает значение на переднем фронте (TICK→TOCK ↑)
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="border-2 border-terminal-green p-4">
            <h4 className="text-sm font-bold mb-2">Input D</h4>
            <div className="text-4xl font-bold text-center py-2">{inputD}</div>
            <div className="flex gap-2 mt-2">
              <Button 
                onClick={() => setInputD(0)} 
                className={`flex-1 text-sm py-1 ${inputD === 0 ? 'bg-terminal-green text-black' : ''}`}
              >
                0
              </Button>
              <Button 
                onClick={() => setInputD(1)} 
                className={`flex-1 text-sm py-1 ${inputD === 1 ? 'bg-terminal-green text-black' : ''}`}
              >
                1
              </Button>
            </div>
            <div className="text-center text-xs mt-2 text-terminal-green-light">
              Установите значение
            </div>
          </div>

          <div className={`border-2 p-4 transition-all duration-500 ${phase === 'tock' && clockState === 1 ? 'border-terminal-green bg-terminal-green text-black box-glow-strong' : 'border-terminal-green-dark'}`}>
            <h4 className={`text-sm font-bold mb-2 ${phase === 'tock' && clockState === 1 ? 'text-black' : ''}`}>
              Clock
            </h4>
            <div className={`text-4xl font-bold text-center py-2 ${phase === 'tock' && clockState === 1 ? 'text-black' : phase === 'tock' ? 'text-glow-strong' : ''}`}>
              {clockState}
            </div>
            <div className={`text-center text-xs mt-2 ${phase === 'tock' && clockState === 1 ? 'text-black font-bold' : ''}`}>
              {phase === 'tock' && clockState === 1 ? '↑ RISING EDGE!' : phase === 'tick' ? 'LOW (0)' : 'HIGH (1)'}
            </div>
          </div>

          <div className={`border-2 p-4 bg-terminal-bg-light transition-all duration-500 ${phase === 'tock' && clockState === 1 ? 'border-terminal-green box-glow animate-pulse' : 'border-terminal-green-dark'}`}>
            <h4 className="text-sm font-bold mb-2">Next Q (internal)</h4>
            <div className={`text-4xl font-bold text-center py-2 transition-all duration-300 ${phase === 'tock' && clockState === 1 ? 'text-terminal-green text-glow' : 'text-terminal-green-light'}`}>
              {nextQ}
            </div>
            <div className="text-center text-xs mt-2">
              {phase === 'tock' && clockState === 1 ? '✓ Записывается!' : 'Сохранено'}
            </div>
          </div>

          <div className="border-2 border-terminal-green p-4 box-glow">
            <h4 className="text-sm font-bold mb-2">Output Q</h4>
            <div className="text-4xl font-bold text-center py-2 text-glow-strong">
              {outputQ}
            </div>
            <div className="text-center text-xs mt-2">
              Видимое значение
            </div>
          </div>
        </div>

        {/* Debug info */}
        <div className="border-t-2 border-terminal-green-dark pt-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-3 bg-terminal-bg-light border border-terminal-green-dark">
              <div className="text-sm font-bold mb-2 text-terminal-green">📍 Текущее состояние:</div>
              <div className="space-y-1 text-xs text-terminal-green-light">
                <div>• Phase: <span className="text-terminal-green font-bold">{phase.toUpperCase()}</span></div>
                <div>• Clock: <span className="text-terminal-green font-bold">{clockState}</span></div>
                <div>• Input D: <span className="text-terminal-green font-bold">{inputD}</span></div>
                <div>• Next Q: <span className="text-terminal-green font-bold">{nextQ}</span></div>
                <div>• Output Q: <span className="text-terminal-green font-bold">{outputQ}</span></div>
              </div>
            </div>

            <div className="p-3 bg-terminal-bg-light border border-terminal-green-dark">
              <div className="text-sm font-bold mb-2 text-terminal-green">🔍 Что произойдет дальше:</div>
              <div className="text-xs text-terminal-green-light">
                {phase === 'tick' ? (
                  <>
                    <div className="mb-2">При нажатии <strong>STEP</strong>:</div>
                    <div>1. Clock: 0 → 1 (Rising Edge ↑)</div>
                    <div>2. D={inputD} записывается в Next Q</div>
                    <div>3. Output Q пока не изменится</div>
                    <div className="mt-2 text-terminal-green">→ Фаза станет TOCK</div>
                  </>
                ) : (
                  <>
                    <div className="mb-2">При нажатии <strong>STEP</strong>:</div>
                    <div>1. Clock: 1 → 0 (Falling Edge)</div>
                    <div>2. Output Q = {nextQ} (обновится!)</div>
                    <div>3. Next Q остается {nextQ}</div>
                    <div className="mt-2 text-terminal-green">→ Фаза станет TICK</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-6 box-glow">
        <h3 className="text-xl font-bold mb-4">Clock Waveform with DFF Signals</h3>
        <p className="text-terminal-green-light mb-4 text-sm">
          <strong>↑</strong> = Rising Edge (передний фронт) - момент записи D в DFF<br/>
          <strong>T</strong> = TICK (Clock = 0), <strong>K</strong> = TOCK (Clock = 1)
        </p>
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="w-full border border-terminal-green-dark"
        />
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-terminal-green-dark">CLK</span> - Тактовый сигнал
          </div>
          <div>
            <span className="text-terminal-green-light">D</span> - Входное значение
          </div>
          <div>
            <span className="text-terminal-green">Next Q</span> - Внутреннее состояние
          </div>
          <div>
            <span className="text-terminal-green text-glow">Q</span> - Выходное значение
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-8 bg-terminal-bg-light">
        <h3 className="text-xl font-bold mb-4">Как это работает:</h3>
        <div className="space-y-3 text-terminal-green-light">
          <div className="flex gap-3">
            <span className="text-terminal-green font-bold">1.</span>
            <div>
              <strong>TICK (Clock = 0):</strong> DFF стабилен, выход Q показывает предыдущее значение
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-terminal-green font-bold">2.</span>
            <div>
              <strong>TICK → TOCK (Rising Edge ↑):</strong> DFF захватывает значение D и записывает в Next Q
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-terminal-green font-bold">3.</span>
            <div>
              <strong>TOCK (Clock = 1):</strong> Значение записано, но Q еще не обновлен
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-terminal-green font-bold">4.</span>
            <div>
              <strong>TOCK → TICK (Falling Edge):</strong> Выход Q обновляется значением из Next Q
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-terminal-green font-bold">⚡</span>
            <div>
              <strong>Итог:</strong> Задержка в 1 полный цикл между изменением D и видимым изменением Q!
            </div>
          </div>
        </div>
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

