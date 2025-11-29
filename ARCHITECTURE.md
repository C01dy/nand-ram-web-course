# Архитектура проекта

## Обзор

Проект представляет собой Single Page Application (SPA) на React с использованием React Router для навигации между разделами. Приложение построено по компонентному принципу с четким разделением ответственности.

## Структура директорий

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Layout/         # Компоненты макета (Header, Sidebar, Layout)
│   ├── UI/             # UI компоненты (Button, ControlPanel, InfoBox)
│   └── Visualizations/ # Компоненты для визуализаций (SchematicBox, Wire)
├── pages/              # Компоненты страниц
├── contexts/           # React Context для глобального состояния
├── locales/            # JSON файлы с переводами
├── styles/             # Дополнительные стили (если нужны)
├── App.jsx             # Главный компонент с роутингом
├── main.jsx            # Точка входа
└── index.css           # Глобальные стили и Tailwind
```

## Ключевые концепции

### 1. Компонентная архитектура

Приложение разделено на три типа компонентов:

- **Layout компоненты**: Отвечают за общую структуру страницы
- **UI компоненты**: Переиспользуемые элементы интерфейса
- **Page компоненты**: Страницы с конкретным контентом

### 2. Управление состоянием

- **Локальное состояние**: Используется `useState` для состояния компонентов
- **Глобальное состояние**: Context API для языка интерфейса
- **Эффекты**: `useEffect` для анимаций и интервалов

### 3. Роутинг

React Router используется для навигации между страницами без перезагрузки:

```
/ → /memory (redirect)
/memory → MemoryPage
/clock → ClockPage
/ticktock → TickTockPage
/dff → DFFPage
/bit → BitPage
/register → RegisterPage
/ram → RAMPage
/pc → PCPage
```

### 4. Интернационализация (i18n)

Система переводов построена на:
- JSON файлы с переводами (en.json, ru.json)
- LanguageContext для управления языком
- Хук `useLanguage()` для доступа к переводам

Структура ключей переводов:
```
{
  "nav": { ... },      // Навигация
  "common": { ... },   // Общие элементы
  "memory": { ... },   // Специфичные для страницы
  ...
}
```

### 5. Стилизация

Комбинация подходов:
- **Tailwind CSS**: Utility-first классы для быстрой разработки
- **Custom CSS**: Специфичные эффекты (CRT, свечение, анимации)
- **CSS Variables**: Цветовая палитра в Tailwind config

## Паттерны кода

### Страницы

Каждая страница следует единому паттерну:

```jsx
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ControlPanel } from '../components/UI/ControlPanel';

export const PageName = () => {
  const { t } = useLanguage();
  const [state, setState] = useState(initialState);
  
  // Логика страницы
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-glow">
        {t('section.title')}
      </h1>
      {/* Контент */}
    </div>
  );
};
```

### Интерактивные визуализации

Для интерактивных элементов используется паттерн:

1. Состояние для управления анимацией
2. `useEffect` для автоматического воспроизведения
3. ControlPanel для управления
4. Canvas или SVG для визуализации

```jsx
const [isPlaying, setIsPlaying] = useState(false);
const [speed, setSpeed] = useState(1000);
const intervalRef = useRef(null);

useEffect(() => {
  if (isPlaying) {
    intervalRef.current = setInterval(() => {
      // Логика анимации
    }, speed);
  }
  return () => clearInterval(intervalRef.current);
}, [isPlaying, speed]);
```

## Производительность

### Оптимизации

1. **Lazy loading**: Можно добавить для страниц
2. **Мемоизация**: useCallback/useMemo для тяжелых вычислений
3. **Canvas**: Используется для сложных визуализаций вместо DOM

### Потенциальные улучшения

- Виртуализация для больших списков (RAM с большим количеством ячеек)
- Web Workers для сложных вычислений
- Service Worker для offline работы

## Расширяемость

### Добавление новой страницы

1. Создать компонент в `src/pages/`
2. Добавить переводы в `locales/en.json` и `locales/ru.json`
3. Добавить маршрут в `App.jsx`
4. Добавить пункт меню в `components/Layout/Sidebar.jsx`

### Добавление нового языка

1. Создать файл `locales/[lang].json`
2. Импортировать в `contexts/LanguageContext.jsx`
3. Добавить в объект `translations`

## Зависимости

### Production
- `react` - UI библиотека
- `react-dom` - React для браузера
- `react-router-dom` - Роутинг

### Development
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `postcss` - CSS обработка
- `autoprefixer` - Автопрефиксы CSS
- `eslint` - Линтер

## Сборка и деплой

### Development
```bash
bun run dev
```

### Production
```bash
bun run build
bun run preview
```

### Деплой
Проект можно задеплоить на:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Все они поддерживают SPA из коробки.

