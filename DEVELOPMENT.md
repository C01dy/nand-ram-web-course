# Руководство по разработке

## Начало работы

### Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd nand-ram-web-course

# Установить зависимости
bun install

# Запустить dev сервер
bun run dev
```

Приложение будет доступно по адресу: http://localhost:5173/

## Команды

```bash
# Разработка
bun run dev          # Запустить dev сервер с hot reload

# Сборка
bun run build        # Собрать production версию
bun run preview      # Предпросмотр production сборки

# Линтинг
bun run lint         # Проверить код на ошибки
```

## Структура кода

### Именование файлов
- Компоненты: `PascalCase.jsx` (например, `Button.jsx`)
- Утилиты: `camelCase.js` (например, `helpers.js`)
- Стили: `kebab-case.css` (например, `custom-styles.css`)

### Импорты
Порядок импортов:
1. React и хуки
2. Сторонние библиотеки
3. Контексты
4. Компоненты
5. Утилиты
6. Стили

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/UI/Button';
import { formatValue } from '../utils/helpers';
import './styles.css';
```

## Стилизация

### Tailwind классы
Используйте Tailwind для большинства стилей:

```jsx
<div className="flex items-center gap-4 p-6 border-2 border-terminal-green">
  <h1 className="text-4xl font-bold text-glow">Title</h1>
</div>
```

### Кастомные классы
Для специфичных эффектов используйте кастомные классы из `index.css`:

```jsx
<div className="crt-screen">
  <div className="text-glow-strong">Glowing text</div>
  <div className="box-glow">Box with glow</div>
</div>
```

### Условные стили
```jsx
<div className={`
  border-2 p-4 transition-all
  ${isActive 
    ? 'border-terminal-green bg-terminal-green text-black' 
    : 'border-terminal-green-dark'
  }
`}>
  Content
</div>
```

## Работа с состоянием

### Локальное состояние
```jsx
const [value, setValue] = useState(0);
const [isActive, setIsActive] = useState(false);
```

### Эффекты
```jsx
useEffect(() => {
  // Код эффекта
  
  return () => {
    // Cleanup
  };
}, [dependencies]);
```

### Refs
```jsx
const intervalRef = useRef(null);
const canvasRef = useRef(null);
```

## Интернационализация

### Добавление переводов
1. Добавить ключи в `locales/en.json` и `locales/ru.json`
2. Использовать в компонентах через `t()`

```jsx
const { t } = useLanguage();

return <h1>{t('section.title')}</h1>;
```

### Структура переводов
```json
{
  "section": {
    "title": "Title",
    "description": "Description",
    "button": "Button text"
  }
}
```

## Анимации

### CSS анимации
Используйте встроенные анимации:
- `animate-pulse-glow` - пульсирующее свечение
- `transition-all duration-300` - плавные переходы

### JavaScript анимации
```jsx
const [frame, setFrame] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setFrame(prev => (prev + 1) % 60);
  }, 16); // 60 FPS

  return () => clearInterval(interval);
}, []);
```

## Canvas визуализации

### Базовый шаблон
```jsx
const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  // Очистить
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  // Рисовать
  ctx.strokeStyle = '#00ff00';
  ctx.lineWidth = 2;
  // ... код рисования

}, [dependencies]);

return (
  <canvas
    ref={canvasRef}
    width={800}
    height={300}
    className="w-full"
  />
);
```

## Производительность

### Оптимизация рендеринга
```jsx
import { memo, useCallback, useMemo } from 'react';

// Мемоизация компонента
export const MyComponent = memo(({ data }) => {
  // Мемоизация вычислений
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);

  // Мемоизация callback
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);

  return <div onClick={handleClick}>{processedData}</div>;
});
```

### Избегайте
- Создания функций в render
- Инлайн объектов в props
- Тяжелых вычислений без useMemo

## Отладка

### React DevTools
Используйте React DevTools для:
- Инспекции компонентов
- Просмотра props и state
- Профилирования производительности

### Console методы
```jsx
console.log('Value:', value);
console.table(arrayData);
console.time('operation');
// ... код
console.timeEnd('operation');
```

### Breakpoints
Используйте `debugger;` для остановки выполнения:
```jsx
const handleClick = () => {
  debugger; // Выполнение остановится здесь
  setValue(value + 1);
};
```

## Тестирование

### Ручное тестирование
Проверьте:
- [ ] Все страницы открываются
- [ ] Навигация работает
- [ ] Переключение языка работает
- [ ] Анимации плавные
- [ ] Интерактивные элементы отзывчивы
- [ ] Нет ошибок в консоли
- [ ] Responsive на разных экранах

### Браузеры
Тестируйте в:
- Chrome/Edge (основной)
- Firefox
- Safari (если доступен)

## Git workflow

### Коммиты
```bash
# Хорошие коммиты
git commit -m "feat: add DFF visualization"
git commit -m "fix: correct clock timing"
git commit -m "style: improve button hover effect"
git commit -m "docs: update README"

# Плохие коммиты
git commit -m "fix"
git commit -m "updates"
git commit -m "wip"
```

### Ветки
```bash
# Создать feature ветку
git checkout -b feature/new-page

# Создать fix ветку
git checkout -b fix/button-style
```

## Troubleshooting

### Проблема: Приложение не запускается
```bash
# Очистить node_modules и переустановить
rm -rf node_modules bun.lock
bun install
```

### Проблема: Стили не применяются
```bash
# Перезапустить dev сервер
# Ctrl+C
bun run dev
```

### Проблема: Изменения не видны
- Проверьте, что файл сохранен
- Проверьте консоль на ошибки
- Очистите кэш браузера (Ctrl+Shift+R)

## Полезные ресурсы

- [React документация](https://react.dev/)
- [Tailwind CSS документация](https://tailwindcss.com/docs)
- [React Router документация](https://reactrouter.com/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [NAND to Tetris](https://www.nand2tetris.org/)

## Контрибуция

1. Fork проекта
2. Создайте feature ветку
3. Сделайте изменения
4. Протестируйте
5. Создайте Pull Request

### Чеклист для PR
- [ ] Код следует стилю проекта
- [ ] Нет ошибок линтера
- [ ] Добавлены переводы для обоих языков
- [ ] Протестировано в браузере
- [ ] Обновлена документация (если нужно)

