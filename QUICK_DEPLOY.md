# ⚡ Быстрый деплой

## Вариант 1: GitHub Pages (традиционный)

### Шаг 1: Создайте репозиторий на GitHub
- Название: `nand-ram-web-course`
- Public

### Шаг 2: Обновите package.json
Замените `ВАШЕ_ИМЯ` на ваш GitHub username:
```json
"homepage": "https://ВАШЕ_ИМЯ.github.io/nand-ram-web-course"
```

### Шаг 3: Загрузите на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШЕ_ИМЯ/nand-ram-web-course.git
git branch -M main
git push -u origin main
```

### Шаг 4: Деплой
```bash
bun run deploy
```

### Шаг 5: Настройте GitHub Pages
Settings → Pages → Source: `gh-pages` branch → Save

**Готово!** Сайт будет доступен через 1-2 минуты:
```
https://ВАШЕ_ИМЯ.github.io/nand-ram-web-course
```

---

## Вариант 2: Vercel (САМЫЙ ПРОСТОЙ! ⭐)

### Шаг 1: Загрузите на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШЕ_ИМЯ/nand-ram-web-course.git
git branch -M main
git push -u origin main
```

### Шаг 2: Деплой на Vercel
1. Зайдите на https://vercel.com
2. Войдите через GitHub
3. "Import Project"
4. Выберите `nand-ram-web-course`
5. Deploy

**Готово!** Vercel даст вам ссылку типа:
```
https://nand-ram-web-course.vercel.app
```

**Бонус:** При каждом `git push` Vercel автоматически обновит сайт!

---

## Вариант 3: Netlify (тоже просто!)

### Шаг 1: Загрузите на GitHub (как выше)

### Шаг 2: Деплой на Netlify
1. Зайдите на https://netlify.com
2. Войдите через GitHub
3. "Add new site" → "Import an existing project"
4. Выберите репозиторий
5. Build command: `bun run build`
6. Publish directory: `dist`
7. Deploy

**Готово!** Netlify даст вам ссылку.

---

## Рекомендация

🌟 **Используйте Vercel** - это самый простой вариант:
- Автоматический деплой при push
- Бесплатный SSL
- Быстрый CDN
- Нет настройки

## Обновление сайта

После изменений:
```bash
git add .
git commit -m "Update: описание"
git push
```

- **Vercel/Netlify**: автоматически обновят
- **GitHub Pages**: запустите `bun run deploy`

