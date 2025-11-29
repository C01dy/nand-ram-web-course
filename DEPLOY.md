# 🚀 Деплой на GitHub Pages

## Шаги для деплоя:

### 1. Создайте репозиторий на GitHub

1. Зайдите на https://github.com
2. Нажмите "New repository"
3. Название: `nand-ram-web-course`
4. Описание: "Interactive guide for NAND to Tetris - DFF, Registers, RAM"
5. Public (чтобы GitHub Pages работал бесплатно)
6. **НЕ** добавляйте README, .gitignore или license (у нас уже есть)
7. Нажмите "Create repository"

### 2. Обновите package.json

Замените `ВАШЕ_ИМЯ` в `package.json` на ваш GitHub username:

```json
"homepage": "https://ВАШЕ_ИМЯ.github.io/nand-ram-web-course"
```

Например, если ваш username `coldy`:
```json
"homepage": "https://coldy.github.io/nand-ram-web-course"
```

### 3. Инициализируйте Git и загрузите на GitHub

```bash
# Инициализируйте git (если еще не сделано)
git init

# Добавьте все файлы
git add .

# Сделайте первый коммит
git commit -m "Initial commit: Interactive NAND to Tetris guide"

# Добавьте remote (замените ВАШЕ_ИМЯ на ваш username)
git remote add origin https://github.com/ВАШЕ_ИМЯ/nand-ram-web-course.git

# Переименуйте ветку в main (если нужно)
git branch -M main

# Загрузите на GitHub
git push -u origin main
```

### 4. Задеплойте на GitHub Pages

```bash
# Соберите и задеплойте
bun run deploy
```

Эта команда:
1. Соберет production версию (`bun run build`)
2. Создаст ветку `gh-pages`
3. Загрузит собранные файлы на GitHub

### 5. Настройте GitHub Pages

1. Зайдите в репозиторий на GitHub
2. Settings → Pages (в левом меню)
3. Source: выберите `gh-pages` branch
4. Folder: `/ (root)`
5. Нажмите Save

### 6. Готово! 🎉

Через 1-2 минуты ваш сайт будет доступен по адресу:
```
https://ВАШЕ_ИМЯ.github.io/nand-ram-web-course
```

## Обновление сайта

После внесения изменений:

```bash
# Закоммитьте изменения
git add .
git commit -m "Update: описание изменений"
git push

# Задеплойте новую версию
bun run deploy
```

## Альтернатива: Vercel (еще проще!)

Если хотите еще проще:

1. Зайдите на https://vercel.com
2. Войдите через GitHub
3. Нажмите "Import Project"
4. Выберите репозиторий `nand-ram-web-course`
5. Framework Preset: Vite
6. Нажмите Deploy

Готово! Vercel автоматически деплоит при каждом push.

## Альтернатива: Netlify

1. Зайдите на https://netlify.com
2. Войдите через GitHub
3. "Add new site" → "Import an existing project"
4. Выберите репозиторий
5. Build command: `bun run build`
6. Publish directory: `dist`
7. Deploy

## Проблемы?

### Ошибка 404 при переходе по ссылкам

Если при переходе по ссылкам (например, `/clock`) появляется 404:

**Для GitHub Pages:**
Создайте файл `public/404.html` с редиректом на `index.html`

**Для Vercel/Netlify:**
Они автоматически обрабатывают SPA роутинг

### Стили не загружаются

Проверьте, что в `vite.config.js` правильно указан `base`:
```js
base: '/nand-ram-web-course/',
```

## Полезные ссылки

- [GitHub Pages документация](https://pages.github.com/)
- [Vite деплой гайд](https://vitejs.dev/guide/static-deploy.html)
- [gh-pages пакет](https://www.npmjs.com/package/gh-pages)

