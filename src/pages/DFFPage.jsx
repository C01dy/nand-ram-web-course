import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ControlPanel } from '../components/UI/ControlPanel';
import { Button } from '../components/UI/Button';

export const DFFPage = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputD, setInputD] = useState(0);
  const [outputQ, setOutputQ] = useState(0);
  const [clockState, setClockState] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [history, setHistory] = useState([{ clock: 0, d: 0, q: 0 }]);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setClockState(prev => {
          const newClock = prev === 0 ? 1 : 0;
          
          // Update Q on rising edge (0 -> 1)
          if (newClock === 1 && prev === 0) {
            setOutputQ(inputD);
            setHistory(h => [...h, { clock: newClock, d: inputD, q: inputD }]);
          } else {
            setHistory(h => [...h, { clock: newClock, d: inputD, q: outputQ }]);
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
  }, [isPlaying, speed, inputD, outputQ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 6; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (height / 6) * i);
      ctx.lineTo(width, (height / 6) * i);
      ctx.stroke();
    }

    const pointWidth = Math.max(20, width / Math.max(history.length, 20));
    const recentHistory = history.slice(-Math.floor(width / pointWidth));

    // Draw Clock signal
    ctx.strokeStyle = '#00cc00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    recentHistory.forEach((point, i) => {
      const x = i * pointWidth;
      const y = point.clock === 1 ? height / 6 : height / 3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw D signal
    ctx.strokeStyle = '#33ff33';
    ctx.lineWidth = 2;
    ctx.beginPath();
    recentHistory.forEach((point, i) => {
      const x = i * pointWidth;
      const y = point.d === 1 ? height / 2 : height * 2/3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw Q signal
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    recentHistory.forEach((point, i) => {
      const x = i * pointWidth;
      const y = point.q === 1 ? height * 5/6 : height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.fillText('CLK', 5, height / 6 - 5);
    ctx.fillText('D', 5, height / 2 - 5);
    ctx.fillText('Q', 5, height * 5/6 - 5);

  }, [history]);

  const handleStep = () => {
    const newClock = clockState === 0 ? 1 : 0;
    
    if (newClock === 1 && clockState === 0) {
      setOutputQ(inputD);
      setHistory(h => [...h, { clock: newClock, d: inputD, q: inputD }]);
    } else {
      setHistory(h => [...h, { clock: newClock, d: inputD, q: outputQ }]);
    }
    
    setClockState(newClock);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setInputD(0);
    setOutputQ(0);
    setClockState(0);
    setHistory([{ clock: 0, d: 0, q: 0 }]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">{t('dff.title')}</h1>
      <p className="text-xl mb-8 text-terminal-green-light">{t('dff.intro')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('dff.input')}</h3>
          <div className="text-6xl font-bold text-center py-4">
            {inputD}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setInputD(0)} className="flex-1">0</Button>
            <Button onClick={() => setInputD(1)} className="flex-1">1</Button>
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4">
          <h3 className="text-lg font-bold mb-2">{t('dff.clock')}</h3>
          <div className={`text-6xl font-bold text-center py-4 ${clockState === 1 ? 'text-glow-strong' : ''}`}>
            {clockState}
          </div>
          <div className="text-center text-sm mt-4">
            {clockState === 1 ? 'HIGH' : 'LOW'}
          </div>
        </div>

        <div className="border-2 border-terminal-green p-4 box-glow">
          <h3 className="text-lg font-bold mb-2">{t('dff.output')}</h3>
          <div className="text-6xl font-bold text-center py-4 text-glow-strong">
            {outputQ}
          </div>
          <div className="text-center text-sm mt-4">
            Stored Value
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">{t('dff.behavior')}</h3>
        <p className="text-terminal-green-light mb-4">{t('dff.behaviorDesc')}</p>
        
        <div className="grid grid-cols-2 gap-4 p-4 bg-terminal-bg-light border border-terminal-green-dark">
          <div className="text-center">
            <div className="text-sm mb-2">Rising Edge (0→1)</div>
            <div className="text-2xl">Q ← D</div>
          </div>
          <div className="text-center">
            <div className="text-sm mb-2">Other Times</div>
            <div className="text-2xl">Q unchanged</div>
          </div>
        </div>
      </div>

      <div className="border-2 border-terminal-green p-6 mb-6 box-glow">
        <h3 className="text-xl font-bold mb-4">{t('dff.timingDiagram')}</h3>
        <canvas
          ref={canvasRef}
          width={800}
          height={300}
          className="w-full border border-terminal-green-dark"
        />
      </div>

      <div className="border-2 border-terminal-green p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">{t('dff.truthTable')}</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-terminal-green">
              <th className="p-2 text-left">Clock Edge</th>
              <th className="p-2 text-left">D</th>
              <th className="p-2 text-left">Q (next)</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-terminal-green-dark">
              <td className="p-2">Rising (↑)</td>
              <td className="p-2">0</td>
              <td className="p-2">0</td>
            </tr>
            <tr className="border-b border-terminal-green-dark">
              <td className="p-2">Rising (↑)</td>
              <td className="p-2">1</td>
              <td className="p-2">1</td>
            </tr>
            <tr className="border-b border-terminal-green-dark">
              <td className="p-2">No edge</td>
              <td className="p-2">X</td>
              <td className="p-2">Q (previous)</td>
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

