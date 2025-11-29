# Примеры использования

## Создание новой интерактивной страницы

### Шаг 1: Создать компонент страницы

```jsx
// src/pages/NewPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ControlPanel } from '../components/UI/ControlPanel';
import { Button } from '../components/UI/Button';

export const NewPage = () => {
  const { t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [value, setValue] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const intervalRef = useRef(null);

  // Автоматическое воспроизведение
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setValue(prev => (prev + 1) % 10);
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
    setValue(prev => (prev + 1) % 10);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setValue(0);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">
        {t('newpage.title')}
      </h1>
      <p className="text-xl mb-8 text-terminal-green-light">
        {t('newpage.intro')}
      </p>

      {/* Визуализация */}
      <div className="border-2 border-terminal-green p-8 mb-8 box-glow">
        <div className="text-8xl font-bold text-center text-glow-strong">
          {value}
        </div>
      </div>

      {/* Панель управления */}
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
```

### Шаг 2: Добавить переводы

```json
// src/locales/en.json
{
  "newpage": {
    "title": "New Page Title",
    "intro": "Description of the new page"
  }
}

// src/locales/ru.json
{
  "newpage": {
    "title": "Название новой страницы",
    "intro": "Описание новой страницы"
  }
}
```

### Шаг 3: Добавить маршрут

```jsx
// src/App.jsx
import { NewPage } from './pages/NewPage';

// В Routes добавить:
<Route path="newpage" element={<NewPage />} />
```

### Шаг 4: Добавить в навигацию

```jsx
// src/components/Layout/Sidebar.jsx
const routes = [
  // ... существующие маршруты
  { path: '/newpage', key: 'nav.newpage' },
];

// В переводы добавить:
// en.json: "nav": { "newpage": "New Page" }
// ru.json: "nav": { "newpage": "Новая страница" }
```

## Использование Canvas для визуализации

```jsx
import { useRef, useEffect } from 'react';

export const CanvasVisualization = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Очистить canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    // Нарисовать сетку
    ctx.strokeStyle = '#003300';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (height / 10) * i);
      ctx.lineTo(width, (height / 10) * i);
      ctx.stroke();
    }

    // Нарисовать данные
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((point, i) => {
      const x = (width / data.length) * i;
      const y = height - (point / 100) * height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={300}
      className="w-full border border-terminal-green-dark"
    />
  );
};
```

## Создание анимированной схемы

```jsx
import { SchematicBox } from '../components/Visualizations/SchematicBox';
import { Wire } from '../components/Visualizations/Wire';

export const AnimatedSchematic = ({ inputValue, outputValue, isActive }) => {
  return (
    <div className="flex items-center justify-center gap-4 p-8">
      {/* Вход */}
      <SchematicBox 
        label="INPUT" 
        value={inputValue} 
        isActive={isActive}
        size="medium"
      />

      {/* Провод */}
      <Wire 
        direction="horizontal" 
        length="medium" 
        isActive={isActive} 
      />

      {/* Процессор */}
      <div className={`
        w-32 h-32 border-4 border-terminal-green 
        flex items-center justify-center
        ${isActive ? 'animate-pulse-glow' : ''}
      `}>
        <div className="text-center">
          <div className="text-xs">PROCESSOR</div>
          <div className="text-2xl font-bold">{inputValue * 2}</div>
        </div>
      </div>

      {/* Провод */}
      <Wire 
        direction="horizontal" 
        length="medium" 
        isActive={isActive} 
      />

      {/* Выход */}
      <SchematicBox 
        label="OUTPUT" 
        value={outputValue} 
        isActive={isActive}
        isHighlighted={true}
        size="medium"
      />
    </div>
  );
};
```

## Создание таблицы истинности

```jsx
export const TruthTable = ({ currentInputs }) => {
  const rows = [
    { a: 0, b: 0, out: 0 },
    { a: 0, b: 1, out: 0 },
    { a: 1, b: 0, out: 0 },
    { a: 1, b: 1, out: 1 },
  ];

  return (
    <div className="border-2 border-terminal-green p-6">
      <h3 className="text-xl font-bold mb-4">Truth Table</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-terminal-green">
            <th className="p-2 text-left">A</th>
            <th className="p-2 text-left">B</th>
            <th className="p-2 text-left">OUT</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const isCurrent = 
              currentInputs?.a === row.a && 
              currentInputs?.b === row.b;
            
            return (
              <tr 
                key={i}
                className={`
                  border-b border-terminal-green-dark
                  ${isCurrent ? 'bg-terminal-green text-black font-bold' : ''}
                `}
              >
                <td className="p-2">{row.a}</td>
                <td className="p-2">{row.b}</td>
                <td className="p-2">{row.out}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

## Создание интерактивного ввода

```jsx
import { useState } from 'react';
import { Button } from '../components/UI/Button';

export const InteractiveInput = ({ onSubmit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const num = parseInt(value);
    if (!isNaN(num) && num >= 0 && num <= 65535) {
      onSubmit(num);
      setValue('');
    }
  };

  return (
    <div className="border-2 border-terminal-green p-6">
      <h3 className="text-xl font-bold mb-4">Enter Value</h3>
      <div className="flex gap-4">
        <input
          type="number"
          min="0"
          max="65535"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          className="terminal-input flex-1"
          placeholder="0-65535"
        />
        <Button onClick={handleSubmit}>
          SUBMIT
        </Button>
      </div>
    </div>
  );
};
```

## Создание временной шкалы

```jsx
export const Timeline = ({ history, currentIndex }) => {
  return (
    <div className="border-2 border-terminal-green p-6">
      <h3 className="text-xl font-bold mb-4">Timeline</h3>
      <div className="flex gap-2 overflow-x-auto pb-4">
        {history.map((item, i) => {
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;
          
          return (
            <div
              key={i}
              className={`
                min-w-24 border-2 p-3 transition-all
                ${isCurrent
                  ? 'border-terminal-green bg-terminal-green text-black box-glow-strong scale-110'
                  : isPast
                  ? 'border-terminal-green-dark'
                  : 'border-terminal-green-dark opacity-30'
                }
              `}
            >
              <div className="text-xs mb-1">Step {i}</div>
              <div className="text-2xl font-bold text-center">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

## Кастомные хуки

### useAnimation - для управления анимациями

```jsx
import { useState, useEffect, useRef } from 'react';

export const useAnimation = (callback, speed = 1000) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(callback, speed);
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
  }, [isPlaying, speed, callback]);

  return {
    isPlaying,
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    toggle: () => setIsPlaying(prev => !prev)
  };
};

// Использование:
const { isPlaying, play, pause } = useAnimation(() => {
  setValue(prev => prev + 1);
}, 1000);
```

### useLocalStorage - для сохранения состояния

```jsx
import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

// Использование:
const [progress, setProgress] = useLocalStorage('progress', {});
```

