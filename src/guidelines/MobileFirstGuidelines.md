### Гайдлайн: Mobile‑first адаптация React web‑приложения (минимум 320px) на Tailwind CSS

Ниже — чеклист и конкретные правила, по которым следует приводить код к mobile‑first. Цель — исключить горизонтальный скролл и «уезжающий» текст/контент на мобильных (особенно внутри оверлеев), сохранив корректное поведение на десктопе.

## Базовые требования
- **Минимальная ширина вьюпорта**: 320px (mobile baseline; обязательно).
- **Mobile‑first**: стили по умолчанию — для 320–480px; расширения — через `@media (min-width: …)`.
- **Запрет горизонтального скролла**: на странице и внутри компонентов по умолчанию.
- **Не ломать бизнес‑логику**: править только верстку, классы, стили, безопасные атрибуты.
- **Сохранить дизайн‑язык**: типографика/отступы остаются консистентными, но становятся адаптивными.

## Метатеги и глобальные правила
В `public/index.html` должно быть:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Глобальные стили (mobile‑first):

```css
*, *::before, *::after { box-sizing: border-box; }

html, body {
  width: 100%;
  min-width: 320px; /* базовый минимум для вьюпорта */
  overflow-x: hidden; /* запрещаем горизонтальный скролл глобально */
}

:root {
  /* токены для отступов/радиусов */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --radius: 8px;
}
```

Tailwind: используем утилиты из `src/index.css` по умолчанию (mobile-first) и наращиваем стили через медиазапросы `sm:`/`md:`/`lg:`. У вас уже есть многие готовые утилиты: `w-full`, `max-w-[calc(100%-2rem)]`, `min-w-0`, `overflow-x-hidden`, `text-wrap`, `truncate`, сеточные классы и брейкпоинты `sm`/`md`/`lg`.

## Текст: переносы и обрезка
Предотвращать вылет текста за контейнер:

```css
/* Tailwind утилита .text-wrap уже существует в index.css */
.text-wrap {
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

/* Однострочная обрезка используйте Tailwind-утилиту .truncate */

/* Многострочная обрезка (2 и 3 строки) — кастомные утилиты */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

Адаптивная типографика `clamp`:

```css
h1 { font-size: clamp(20px, 5vw, 28px); line-height: 1.2; }
h2 { font-size: clamp(18px, 4.5vw, 24px); line-height: 1.25; }
p, li { font-size: clamp(14px, 3.8vw, 16px); line-height: 1.45; }
```

## Контейнеры и сетка
- Блоки растягиваются на ширину контейнера, без фиксированных ширин < 320px.

```css
.container {
  width: 100%;
  max-width: 100%;
}

.block { min-width: 0; } /* flex/grid могут сжимать контент */

.grid-auto {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 600px) {
  .grid-auto { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 900px) {
  .grid-auto { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
```

Рекомендации:
- Избегать фиксированных `width/height` в `px` у контентных блоков.
- Использовать Tailwind‑утилиты: `w-full`, `max-w-[calc(100%-2rem)]`, `flex-1`, `min-w-0`.
- Для сеток используйте `grid`, `grid-cols-1`, а на брейкпоинтах `sm:grid-cols-2`, `md:grid-cols-3`.
- На внутренних flex/grid контейнерах с текстом — `min-w-0`.

## Кнопки, инпуты, кликабельные элементы
- Минимальная интерактивная зона: 44×44px.
- Текст в кнопках/табах — перенос (`.text-wrap`) или обрезка (`.truncate`) по контексту.
- Инпуты/селекты: `width: 100%` на мобилке; избегать фиксированной ширины.

## Медиа и изображения

```css
img, video, canvas, svg {
  max-width: 100%;
  height: auto;
}
.media-cover { object-fit: cover; width: 100%; height: 100%; }
.media-contain { object-fit: contain; width: 100%; height: auto; }
```

## Оверлеи, модалки, сайдшиты
Оверлей не вызывает горизонтальный скролл. Контент внутри — вертикально скроллится, учитываются safe‑area и `dvh`:

```css
.modal {
  position: fixed; inset: 0;
  display: grid; place-items: center;
  padding: max(var(--space-4), env(safe-area-inset-top)) var(--space-4) max(var(--space-4), env(safe-area-inset-bottom));
}
.modal__panel {
  width: min(100%, 560px);
  max-height: min(100dvh - 2rem, 720px); /* используйте также утилиту .max-h-90dvh при необходимости */
  overflow: auto;
  border-radius: var(--radius);
}
@supports not (height: 100dvh) {
  .modal__panel { max-height: min(100vh - 2rem, 720px); }
}

.sheet {
  position: fixed; left: 0; right: 0; bottom: 0;
  max-height: 90dvh; /* см. Tailwind-утилиту .max-h-90dvh */
  overflow: auto;
  border-top-left-radius: var(--radius);
  border-top-right-radius: var(--radius);
}
```

При открытой модалке — блокировать скролл `body`, при необходимости компенсировать ширину скроллбара.

## Таблицы и списки
- На мобилке предпочитать «карточки вместо строк».
- Если таблица обязательна — обертка со скроллом и мягкими переносами:

```css
.table-wrap {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
.table-wrap table { width: 100%; border-collapse: collapse; }
.table-wrap td, .table-wrap th { word-break: break-word; }
```

## Навигация и шапки
- Фиксированные хедеры компенсировать `scroll-padding-top`:

```css
:root { scroll-padding-top: 64px; }
```

- Длинные пункты навигации — перенос или обрезка до 1 строки.

## Безопасные области и мобильные браузеры
- Добавлять отступы с учетом `env(safe-area-inset-*)` для фиксированных элементов.
- Заменять `100vh` на `100dvh` там, где критична высота (iOS Safari).

## Единицы и значения
- Минимизировать жесткие `px`; предпочитать `rem`, `em`, `ch`, `vw`, `vh/dvh`, `clamp()`.
- Избегать отрицательных маргинов и «магических чисел».
- Радиусы/тени — через токены/переменные.

## Практики для React‑компонентов
- Компонент обязан:
  - принимать `className` и прокидывать его в корневой элемент;
  - не задавать фиксированные ширины/высоты на мобилке;
  - использовать `min-w-0` (Tailwind) внутри flex/grid, где есть текст;
  - не использовать инлайн‑стили с фиксированными `px` для размеров контента.
- Для сторонних UI — переопределять через `className`/style‑props, не менять логику.

## Паттерны автоматических правок
- Ищем фиксированные ширины/высоты у контентных блоков (`width`, `height`, `max-height`) и заменяем:
  - `width: XXXpx` → `width: 100%` (или `max-width: XXXpx` через медиазапрос на десктопе).
  - `height: XXXpx` у контейнеров с текстом → `min-height` или `max-height` + `overflow: auto`.
- Добавляем `.text-wrap` в заголовки карточек, кнопки с длинными названиями, табы, элементы меню.
- Заменяем `100vh` на `100dvh` в полноэкранных блоках/оверлеях (или применяем утилиту `.h-screen-dvh`).
- Для крупных шрифтов — `font-size: Npx` → `clamp(min, vw, max)`.

## Рекомендуемые брейкпоинты
- base: 320–599px
- sm: 600px
- md: 900px
- lg: 1200px

На base запрещен горизонтальный скролл у `body` и основных скроллящихся контейнеров.

## Definition of Done (проверки качества)
На ширине 320px:
- нет горизонтального скролла у `body`;
- все модалки/оверлеи видимы и скроллятся внутри себя;
- текст нигде не выезжает за границы; длинные строки переносятся/обрезаются;
- интерактивные элементы ≥ 44×44px;
- изображения/видео не выходят за контейнер.

Дополнительно проверяем 375/390/414/768/1024px на стабильность. Тестируем iOS Safari (адресная строка) и Android Chrome (`dvh`).

## Инструменты и автопроверки (по возможности)
- В Storybook/превью вьюпорты: 320, 375, 390, 414, 768, 1024.
- E2E/визуальные тесты на 320px для ключевых экранов и оверлеев.
- Линтеры: `eslint-plugin-jsx-a11y` (размер клика), `stylelint` — запрет фиксированных `px` у ширин/высот в мобильных стилях.

## Tailwind‑ориентированные правила (с учётом вашего `index.css`)
- Использовать готовые утилиты: `w-full`, `max-w-[calc(100%-2rem)]`, `min-w-0`, `overflow-x-hidden`, `text-wrap`, `truncate`, `grid`, `grid-cols-1`, `sm:grid-cols-2`, `md:grid-cols-3`.
- Для предотвращения вылетов текста в flex/grid — обязательно `min-w-0` на вложенных контейнерах.
- Для модалок и листов — использовать утилиты `overflow-auto`, и собственные dvh‑утилиты (см. ниже).
- Для многострочной обрезки — использовать `.line-clamp-2`/`.line-clamp-3` (добавлены как кастомные утилиты).

Если утилит не хватает, добавить в `src/index.css` (раздел кастомных утилит):

```css
/* dvh утилиты */
.h-screen-dvh { height: 100dvh; }
.min-h-screen-dvh { min-height: 100dvh; }
.max-h-90dvh { max-height: 90dvh; }

/* многострочная обрезка */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## Пример для React

```tsx
// Карточка с безопасной типографикой (Tailwind)
export function Card({ title, children, className = '' }) {
  return (
    <section className={`card w-full ${className}`}>
      <h3 className="text-wrap line-clamp-2">{title}</h3>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
```

## Что еще можно добавить
- Контентные лимиты: длина заголовков (например, ≤ 60 символов), fallback‑кроп сверхдлинных строк/URL.
- i18n/RTL: проверять переносы, управление пробелами и направлением текста.
- Скелетоны/лоадеры: не фиксировать ширины на мобилке, использовать проценты.
- Ошибки форм: сообщения — многострочные, переносятся; не ломают высоту инпута.

---

Краткий чеклист:
- Базовый вьюпорт 320px; запрещаем горизонтальный скролл.
- Текст: переносы/обрезка, `clamp` типографика.
- Контейнеры: `w-full`, `min-w-0`, без фиксированных `px`.
- Медиа: `max-width: 100%`, `object-fit` по месту.
- Оверлеи: `max-height` с `100dvh` (или `.max-h-90dvh`), внутренний скролл, safe‑area.
- Таблицы: карточки либо управляемый `overflow-x` в обертке.
- React: пропуск `className`, без инлайн‑px.
- Проверяем 320/375/390/414/768/1024.


