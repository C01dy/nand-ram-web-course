# Документация компонентов

## Layout компоненты

### Layout
Основной layout компонент с CRT эффектом, содержит Header и Sidebar.

### Header
Шапка приложения с названием и переключателем языка.

### Sidebar
Боковое меню навигации со списком всех разделов.

## UI компоненты

### Button
Стилизованная кнопка в терминальном стиле.

**Props:**
- `children` - содержимое кнопки
- `onClick` - обработчик клика
- `className` - дополнительные CSS классы
- `disabled` - отключить кнопку

**Пример:**
```jsx
<Button onClick={handleClick}>Click Me</Button>
```

### ControlPanel
Панель управления для интерактивных визуализаций.

**Props:**
- `isPlaying` - состояние воспроизведения
- `onPlay` - обработчик запуска
- `onPause` - обработчик паузы
- `onStep` - обработчик шага
- `onReset` - обработчик сброса
- `speed` - скорость анимации (опционально)
- `onSpeedChange` - обработчик изменения скорости (опционально)

**Пример:**
```jsx
<ControlPanel
  isPlaying={isPlaying}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
  onStep={handleStep}
  onReset={handleReset}
  speed={1000}
  onSpeedChange={setSpeed}
/>
```

### InfoBox
Информационный блок с рамкой.

**Props:**
- `title` - заголовок блока
- `children` - содержимое
- `variant` - вариант стиля ('default', 'highlight', 'dark')
- `className` - дополнительные CSS классы

**Пример:**
```jsx
<InfoBox title="Important" variant="highlight">
  <p>Some important information</p>
</InfoBox>
```

## Visualization компоненты

### SchematicBox
Визуальный блок для отображения элементов схемы.

**Props:**
- `label` - подпись элемента
- `value` - отображаемое значение
- `isActive` - активное состояние (подсветка)
- `isHighlighted` - выделенное состояние
- `size` - размер ('small', 'medium', 'large')
- `className` - дополнительные CSS классы

**Пример:**
```jsx
<SchematicBox 
  label="Input" 
  value={1} 
  isActive={true} 
  size="medium" 
/>
```

### Wire
Визуальное представление провода/соединения.

**Props:**
- `direction` - направление ('horizontal', 'vertical')
- `length` - длина ('short', 'medium', 'long')
- `isActive` - активное состояние (подсветка)

**Пример:**
```jsx
<Wire direction="horizontal" length="medium" isActive={true} />
```

## Context

### LanguageContext
Контекст для управления языком приложения.

**API:**
- `language` - текущий язык ('en' или 'ru')
- `setLanguage(lang)` - установить язык
- `toggleLanguage()` - переключить язык
- `t(key)` - получить перевод по ключу

**Пример:**
```jsx
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t, language, toggleLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('nav.title')}</h1>
      <button onClick={toggleLanguage}>
        Switch to {language === 'en' ? 'RU' : 'EN'}
      </button>
    </div>
  );
}
```

## CSS классы

### Терминальные стили
- `terminal-button` - стилизованная кнопка
- `terminal-input` - стилизованный input
- `text-glow` - свечение текста
- `text-glow-strong` - сильное свечение текста
- `box-glow` - свечение рамки
- `box-glow-strong` - сильное свечение рамки
- `crt-screen` - эффект CRT монитора
- `cursor-blink` - мигающий курсор

### Цвета
- `terminal-bg` - черный фон (#000000)
- `terminal-bg-light` - светлый черный (#0a0a0a)
- `terminal-green` - основной зеленый (#00ff00)
- `terminal-green-light` - светлый зеленый (#33ff33)
- `terminal-green-dark` - темный зеленый (#00cc00)

### Анимации
- `animate-pulse-glow` - пульсирующее свечение
- `flicker` - мерцание (CRT эффект)
- `blink` - мигание курсора

