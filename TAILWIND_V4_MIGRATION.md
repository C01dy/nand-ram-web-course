# Миграция на Tailwind CSS 4.x

Проект использует Tailwind CSS 4.x, который имеет некоторые отличия от версии 3.x.

## Основные изменения

### 1. PostCSS плагин
В версии 4.x PostCSS плагин вынесен в отдельный пакет:

```bash
bun add -D @tailwindcss/postcss
```

### 2. Конфигурация через CSS
Вместо `tailwind.config.js` используется директива `@theme` в CSS:

```css
@theme {
  --color-terminal-bg: #000000;
  --color-terminal-green: #00ff00;
  --font-mono: 'Share Tech Mono', monospace;
}
```

### 3. Новый синтаксис импорта
Вместо:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Используется:
```css
@import "tailwindcss";
```

### 4. Использование кастомных цветов
Кастомные цвета определяются как CSS переменные и используются через Tailwind:

```css
/* Определение */
@theme {
  --color-terminal-bg: #000000;
}

/* Использование в HTML */
<div class="bg-terminal-bg">...</div>

/* Или напрямую через CSS переменные */
background-color: var(--color-terminal-bg);
```

## Конфигурация проекта

### postcss.config.js
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### src/index.css
```css
@import "tailwindcss";

@theme {
  --color-terminal-bg: #000000;
  --color-terminal-bg-light: #0a0a0a;
  --color-terminal-green: #00ff00;
  --color-terminal-green-light: #33ff33;
  --color-terminal-green-dark: #00cc00;
  --font-mono: 'Share Tech Mono', 'VT323', monospace;
}
```

## Преимущества версии 4.x

1. **Быстрее** - улучшенная производительность
2. **Проще** - меньше конфигурации
3. **CSS-нативно** - использование CSS переменных
4. **Современнее** - поддержка новых CSS фич

## Совместимость

Все Tailwind утилиты работают как обычно:
- `bg-terminal-bg` ✅
- `text-terminal-green` ✅
- `border-terminal-green-dark` ✅
- `hover:box-glow` ✅

Кастомные классы из `@layer` также работают без изменений.

## Ресурсы

- [Tailwind CSS 4.0 документация](https://tailwindcss.com/docs)
- [Миграция с v3 на v4](https://tailwindcss.com/docs/upgrade-guide)

