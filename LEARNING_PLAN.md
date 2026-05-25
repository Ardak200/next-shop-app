# План обучения Next.js 16 + Tailwind 4

## Контекст

- **Цель**: освоить Next.js 16 (текущая стабильная — `16.2.6`) с нуля, опираясь на знание React.
- **Стек**: Next.js 16.2.6, React 19.2.4, Tailwind CSS 4, TypeScript 5.
- **Проект**: мини-маркетплейс товаров.
- **Источник данных**: локальный JSON → SQLite + Drizzle ORM (на этапе Server Actions).
- **Формат**: ученик пишет код, наставник объясняет концепции, проверяет и комментирует.

## Важное про Next.js 16

В версии 16 есть ломающие изменения относительно того, что часто всплывает в туториалах:

- `params` и `searchParams` теперь **Promise** — нужно `await`.
- `App Router` — единственный рекомендованный путь (`pages/` устарел).
- Server Components по умолчанию, Client Components — только через `'use client'`.
- Кэширование переделано: `fetch` по умолчанию **не кэширует** в Next 16 (раньше кэшировал) — теперь нужен явный `cache: 'force-cache'` или тэги.
- `revalidateTag` и `revalidatePath` — основной способ инвалидации.

Документация: `node_modules/next/dist/docs/01-app/` — единый источник истины.

## Про Tailwind CSS v4

- **Нет `tailwind.config.js`** — конфиг живёт в CSS через `@theme`.
- Импорт: `@import "tailwindcss";` (вместо `@tailwind base/components/utilities`).
- Цвета в OKLCH, нативные CSS-переменные.
- Новый движок (Oxide) — быстрее, без PurgeCSS.
- В этом проекте уже подключён через `@tailwindcss/postcss` в [postcss.config.mjs](postcss.config.mjs).

---

## Что строим — мини-маркетплейс

**Фичи финального приложения**:

1. Главная — витрина с категориями.
2. Каталог `/products` с фильтрами (категория, цена, поиск) через URL.
3. Страница товара `/products/[id]` со связанными товарами.
4. Корзина как **intercepting modal** поверх каталога + полноценная страница `/cart`.
5. Чекаут (мок) с Server Actions.
6. Простая админка `/admin` для добавления товаров (учебная, без auth).

---

## Дорожная карта

### Этап 0 — Подготовка (1 сессия)

**Цель**: убрать стартовый шаблон, заложить структуру.

- Чистим [app/page.tsx](app/page.tsx) и [app/layout.tsx](app/layout.tsx) от Vercel-стартера.
- Структура папок: `app/`, `components/`, `lib/`, `data/`, `types/`.
- Базовый header/footer в RootLayout.
- Подключаем Tailwind 4 темы через `@theme` в [app/globals.css](app/globals.css).
- **Концепция**: разница между Next.js и CRA/Vite.

### Этап 1 — App Router (1 сессия)

**Цель**: понять файловую маршрутизацию.

- Страницы `/`, `/products`, `/cart`, `/about`.
- Вложенные layouts (`app/products/layout.tsx`).
- Навигация через `<Link>`, активная ссылка через `usePathname()`.
- **Концепция**: `page.tsx`, `layout.tsx`, route groups `(group)`, файл-конвенции.

### Этап 2 — Server vs Client Components (1 сессия)

**Цель**: главный mental model Next.js.

- По умолчанию всё на сервере. Где нужен `'use client'`?
- Что можно/нельзя в Server Component (нет `useState`, нет `onClick`, есть `async`).
- Передача props через границу server→client.
- **Концепция**: composition pattern — server component внутри client component через `children`.

### Этап 3 — Динамические маршруты (1 сессия)

**Цель**: страница товара `/products/[id]`.

- Папка `[id]/page.tsx`.
- **Важно для Next 16**: `params: Promise<{ id: string }>` — обязательно `await`.
- `notFound()` при отсутствии товара.
- **Концепция**: catch-all `[...slug]`, optional `[[...slug]]`.

### Этап 4 — Data fetching и кэширование (1-2 сессии)

**Цель**: правильно загружать данные товаров.

- `async` Server Component читает JSON-файл.
- `fetch` с `cache: 'force-cache' | 'no-store' | { next: { revalidate: N } }`.
- `generateStaticParams` для предгенерации страниц товаров.
- Тэги: `fetch(url, { next: { tags: ['products'] } })`.
- **Концепция**: разница между статикой/динамикой; кэш Next 16 по умолчанию **выключен** для fetch.

### Этап 5 — Streaming и UX загрузки (1 сессия)

**Цель**: чтобы страница не зависала на медленных запросах.

- `loading.tsx` — автоматический Suspense.
- Свой `<Suspense fallback>` для частичной загрузки.
- `error.tsx` — обработка ошибок на уровне сегмента.
- `not-found.tsx` — кастомная 404.
- **Концепция**: React Server Components + streaming HTML.

### Этап 6 — Search params как state (1 сессия)

**Цель**: фильтры каталога живут в URL, а не в `useState`.

- `searchParams: Promise<{ q?: string; cat?: string }>`.
- Серверная фильтрация JSON по query.
- Форма фильтров — Client Component, обновляет URL через `useRouter().replace`.
- Debounce для текстового поиска.
- **Концепция**: shareable URLs, серверная фильтрация, единый источник правды.

### Этап 7 — Image, Font, Metadata (1 сессия)

**Цель**: профессиональная подача.

- `next/image` — автоматическая оптимизация, sizes, priority.
- `next/font` — уже подключён Geist, разберём как.
- `generateMetadata` для динамических OG-тегов на странице товара.
- **Концепция**: CLS, LCP, SEO.

### Этап 8 — Parallel + Intercepting Routes (1-2 сессии)

**Цель**: корзина открывается как модалка из каталога, но при перезагрузке — полноценная страница.

- `@modal` slot в layout (parallel route).
- `(.)cart` интерсептит навигацию на `/cart` (intercepting route).
- `default.tsx` для незанятых слотов.
- **Концепция**: самая «магическая» фича Next.js — браузерный URL и UI расходятся осмысленно.

### Этап 9 — Server Actions + БД (2 сессии)

**Цель**: реальные мутации без отдельного API.

- Установка `drizzle-orm`, `better-sqlite3`, миграция JSON → SQLite.
- Server Action: `'use server'` для добавления товара в корзину / создания заказа.
- `<form action={action}>` без JS, `useActionState` для loading/errors.
- `revalidateTag('cart')` после мутации.
- Optimistic UI через `useOptimistic`.
- **Концепция**: одна функция работает как API, валидация, ревалидация — забываем про fetch+route handler для своих мутаций.

### Этап 10 — Route Handlers + Middleware (1 сессия)

**Цель**: настоящий API для внешних клиентов + защита.

- `app/api/products/route.ts` — GET/POST.
- Middleware `middleware.ts` — простая проверка query-токена для `/admin`.
- Когда выбирать Route Handler vs Server Action.
- **Концепция**: Next.js может быть и фронтом, и API одновременно.

### Этап 11 — Финал (1 сессия)

**Цель**: довести до состояния, которое не стыдно показать.

- `npm run build` — разбор output, какие страницы статичные/динамичные.
- Деплой на Vercel.
- Чек-лист продакшна: env vars, error logging, robots.txt, sitemap.
- Что учить дальше: auth (NextAuth/Clerk), тесты (Playwright), мониторинг.

---

## Файлы, которые трогаем

- [app/layout.tsx](app/layout.tsx) — корневой лейаут, header/footer.
- [app/page.tsx](app/page.tsx) — главная.
- [app/globals.css](app/globals.css) — Tailwind 4 темы.
- `app/products/page.tsx`, `app/products/[id]/page.tsx`, `app/products/layout.tsx`.
- `app/cart/page.tsx`, `app/@modal/(.)cart/page.tsx`.
- `app/admin/page.tsx`, `app/api/products/route.ts`, `middleware.ts`.
- `lib/db.ts`, `lib/actions.ts`, `lib/products.ts`.
- `data/products.json` (стартовые данные).
- [next.config.ts](next.config.ts), [postcss.config.mjs](postcss.config.mjs).

## Темп

- Один этап = 1-2 сессии по 30-60 минут.
- В сумме ~14-18 сессий до полностью рабочего приложения.
- Между сессиями полезно перечитывать `node_modules/next/dist/docs/01-app/...` по теме.

## Как мы работаем

1. В начале этапа я объясняю концепцию и показываю минимальный пример из доки.
2. Ставлю задачу — ты пишешь код.
3. Я ревьюю: что верно, что можно улучшить, где скрытая ловушка Next 16.
4. Запускаем (`npm run dev`), смотрим в браузере, разбираем DevTools / Network / RSC payload.
5. Переходим к следующему этапу только после того, как тема «защёлкнулась».

## Прогресс

Отмечаем по этапам в этом файле или через todo-список ассистента.
