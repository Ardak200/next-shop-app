# Конспект пройденного

Объяснения по этапам 0–4. Цель — чтобы после восстановления контекста можно было быстро вспомнить «почему так, а не иначе». Все ссылки кликабельны, рядом — файлы из проекта.

См. также: [LEARNING_PLAN.md](LEARNING_PLAN.md) — полная дорожная карта.

---

## Этап 0 — Подготовка

**Коммит**: `a589635 chore: scaffold marketplace shell`

### Что сделали

- Удалили стартер Vercel из [app/page.tsx](app/page.tsx).
- Завели структуру: `app/`, `components/`, `lib/`, `data/`, `types/`.
- Создали [components/Header.tsx](components/Header.tsx) и [components/Footer.tsx](components/Footer.tsx).
- Подключили их в [app/layout.tsx](app/layout.tsx) — `RootLayout` оборачивает все страницы.

### Ключевые идеи

**Что такое `app/layout.tsx`?**
Корневой лейаут — единственное место, где живут теги `<html>` и `<body>`. Он рендерится на сервере один раз и оборачивает все страницы. Здесь подключают шрифты (`next/font`), глобальные стили, метаданные. **Внутри не вызывать React-хуки** — это Server Component по умолчанию.

**Чем Next отличается от CRA/Vite**:
- В CRA ты пишешь SPA — весь React улетает в браузер. Next из коробки рендерит на сервере (SSR/SSG), отдаёт готовый HTML и **только нужный** JS.
- Файловая маршрутизация: путь к файлу = путь в URL. Не нужен `react-router`.
- Server Components — главное новшество (см. этап 2).

### Подводные камни Next 16

- В `<html>` обязательно `lang`, иначе ругается линтер.
- `RootLayout` принимает `children: React.ReactNode` — это содержимое страницы, которое в него «вставляется».

---

## Этап 1 — App Router

**Коммит**: `89b7794 feat: add catalog, cart, about pages and header nav`

### Что сделали

- Создали страницы: [app/products/page.tsx](app/products/page.tsx), [app/cart/page.tsx](app/cart/page.tsx), [app/about/page.tsx](app/about/page.tsx).
- Сделали [components/Nav.tsx](components/Nav.tsx) — активная ссылка через `usePathname()`.

### Ключевые идеи

**Файл-конвенции App Router** (это не «просто файлы», у них зарезервированные имена):

| Файл | Что делает |
|---|---|
| `page.tsx` | Делает сегмент доступным как URL. Без него — папка не маршрут. |
| `layout.tsx` | Оборачивает все вложенные `page.tsx`. Не перерендеривается при навигации между дочерними страницами. |
| `loading.tsx` | Автоматический Suspense fallback для сегмента (этап 5). |
| `error.tsx` | Перехват ошибок сегмента (этап 5). |
| `not-found.tsx` | Кастомная 404 (этап 5). |
| `route.ts` | API endpoint, не страница (этап 10). |

**Папка → URL**: `app/products/page.tsx` → `/products`. Никаких `<Routes>` и `<Route>`.

**`<Link>` vs `<a>`**:
- `<Link href="...">` делает **client-side навигацию** — Next подгружает только новый сегмент через RSC payload, не делает full page reload.
- В тёплый кэш роутер кладёт `<Link>`-цели заранее (prefetch).

**Почему `Nav.tsx` помечен `"use client"`**:
- `usePathname()` — React-хук, работает только в браузере.
- Любой компонент с хуками (`useState`, `useEffect`, `usePathname`, `useRouter`) **обязан** быть Client Component (см. этап 2).

### Подводные камни Next 16

- `pages/`-роутер deprecated. Используем только `app/`.
- `useRouter` теперь импортируется из `next/navigation`, **не из `next/router`** (последний — старый API).

---

## Этап 2 — Server vs Client Components

**Отдельного коммита нет** — концепция уже работала через [components/Nav.tsx](components/Nav.tsx) с `"use client"`.

### Ключевые идеи

**По умолчанию всё — Server Component.** Чтобы стать Client Component, файл должен начинаться с `"use client"`.

| | Server Component | Client Component |
|---|---|---|
| Где выполняется | Только на сервере | Сервер (SSR) + браузер (hydration) |
| `async/await` | ✅ можно `async function` | ❌ обычная функция |
| Хуки React | ❌ нет `useState`, `useEffect` | ✅ всё доступно |
| Обработчики (`onClick`) | ❌ нельзя | ✅ можно |
| Прямой доступ к БД, ENV, файлам | ✅ да | ❌ нет (улетит в браузер) |
| Кладётся в JS-бандл клиента | ❌ нет | ✅ да |

**Почему это важно**:
- Server Component **не отправляет свой JS в браузер**. Меньше байт → быстрее загрузка.
- Чувствительные ключи API, токены БД безопасны в Server Component — они не утекут к юзеру.

**Composition pattern** — самое важное правило:
- Client Component **не может импортировать** Server Component напрямую.
- Зато может принимать его через `children` или `props`.
- Поэтому Server остаётся «внешним», а Client — «островком интерактивности» внутри.

```tsx
// ✅ хорошо
// Server Layout кладёт Client Nav внутрь
<header>
  <Nav />  {/* "use client" */}
</header>

// ❌ плохо
// Client Component пытается импортировать async Server Component
"use client";
import { ServerWidget } from "./ServerWidget"; // ошибка
```

### Подводные камни Next 16

- Props от Server в Client должны быть **сериализуемыми** (нельзя передать функцию, Date через JSON не пройдёт корректно).
- Если в файле есть `"use client"` — **весь поддерев** в этом файле клиентский. Это **не** значит, что детям тоже надо ставить директиву.

---

## Этап 3 — Динамические маршруты

**Коммит**: `aca67cd feat(catalog): add product detail page and data layer`

### Что сделали

- Создали [app/products/\[id\]/page.tsx](app/products/[id]/page.tsx) — страница товара.
- Завели data layer: [lib/products.ts](lib/products.ts), [data/products.json](data/products.json), [types/products.ts](types/products.ts).
- Добавили `notFound()` если товар не существует.

### Ключевые идеи

**Папка `[id]` = динамический сегмент.** Всё, что в URL после `/products/` попадает в `params.id`.

| Конвенция | URL пример | params |
|---|---|---|
| `[id]` | `/products/42` | `{ id: "42" }` |
| `[...slug]` (catch-all) | `/docs/a/b/c` | `{ slug: ["a","b","c"] }` |
| `[[...slug]]` (optional catch-all) | `/docs` и `/docs/a/b` | `{ slug?: ["a","b"] }` |

**🚨 Главное изменение в Next 16: `params` — это Promise.**

```tsx
// ❌ старый код (Next 14)
export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
}

// ✅ Next 16
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
}
```

То же самое касается `searchParams` (этап 6).

**`notFound()`**:
- Импорт из `next/navigation`.
- Прерывает рендер и показывает ближайший `not-found.tsx` (или встроенный 404).
- Возвращать его как обычно через `return notFound()` — даже хотя сама функция кидает исключение, TypeScript так лучше выводит типы.

**Зачем data layer в `lib/`**:
- Страница (`page.tsx`) не должна знать про `JSON.parse`, fetch, БД. Это «вид».
- `lib/products.ts` — единственная точка доступа к данным. Завтра JSON заменим на SQLite/Drizzle — страница не изменится.

### Подводные камни Next 16

- Если забыть `await params` — TypeScript подскажет, но рантайм даст странную ошибку «Cannot read properties of Promise».
- `notFound()` нельзя вызывать в Client Component.

---

## Этап 4 — Data fetching, prerendering, кэширование

**Коммиты**:
- `4c161e2 feat(catalog): make product data layer async and prerender pages`
- `a773e8b feat(api): add products route handler`

### Что сделали

- Сделали `getAllProducts` и `getProduct` **async** с задержкой 500 мс (имитация БД).
- Добавили `generateStaticParams` в [app/products/\[id\]/page.tsx](app/products/[id]/page.tsx) — Next предгенерирует все страницы товаров на билд-тайме.
- Создали [app/api/products/route.ts](app/api/products/route.ts) — простой Route Handler (это уже задел на этап 10).

### Ключевые идеи

**Server Component умеет `await` напрямую**:

```tsx
export default async function ProductsPage() {
  const products = await getAllProducts(); // на сервере, не уходит в браузер
  return <ul>...</ul>;
}
```

Никаких `useEffect + setState` для загрузки данных — это паттерн SPA, не Next.

**`generateStaticParams`** — говорит Next: «вот список значений `[id]`, для которых надо отрендерить страницу на билде».

```tsx
export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ id: p.id })); // [{id:"1"},{id:"2"},{id:"3"}]
}
```

После `next build`:
- `/products/1`, `/products/2`, `/products/3` — **статичные HTML** (мгновенная отдача с CDN).
- `/products/999` (не из списка) — рендерится «по запросу» при первом обращении, потом кэшируется (поведение зависит от `dynamicParams`).

**🚨 Главное изменение в Next 16: `fetch` по умолчанию НЕ кэширует.**

```tsx
// Next 14: кэшировалось по умолчанию (force-cache)
// Next 16: НЕ кэшируется, нужно явно попросить
const data = await fetch(url, { cache: "force-cache" });        // статика
const data = await fetch(url, { cache: "no-store" });            // динамика (default в Next 16)
const data = await fetch(url, { next: { revalidate: 60 } });    // ISR — раз в 60 сек
const data = await fetch(url, { next: { tags: ["products"] } }); // тегированный кэш
```

Инвалидация:
```ts
import { revalidateTag, revalidatePath } from "next/cache";

revalidateTag("products");        // сбросить всё, помеченное этим тегом
revalidatePath("/products");      // сбросить конкретный маршрут
```

**Route Handler** — в [app/api/products/route.ts](app/api/products/route.ts):

```ts
export async function GET() {
  return NextResponse.json(data);
}
```

- Файл **должен называться `route.ts`**, не `page.tsx`.
- Экспортируются HTTP-методы: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`.
- Это полноценный API endpoint — можно дёрнуть его из браузера: `fetch("/api/products")`.

**Когда что использовать (забегая вперёд)**:
- **Server Action** (`"use server"`, этап 9) — для мутаций ИЗ своего фронта. Простая форма + БД.
- **Route Handler** (`route.ts`, этап 10) — для внешних клиентов: мобилка, webhook, сторонний сервис, OG-картинки.

### Подводные камни Next 16

- Импорты данных через `import data from "@/data/products.json"` работают синхронно — то есть `await new Promise(setTimeout(...))` в `lib/products.ts` сделан **специально**, чтобы потом заметить, как `loading.tsx` (этап 5) спасает UX.
- `generateStaticParams` сам по себе **не делает страницу статичной** — если внутри `page.tsx` есть `fetch` с `no-store` или `cookies()`, страница останется динамической.
- В Server Component нет CORS-вопросов — он на сервере, может ходить куда угодно.

---

## Этап 5 — Streaming и UX загрузки

**Коммиты**:
- `e0a5a5c feat(catalog): stream the products list with a skeleton`
- `331ea0e feat(catalog): stream the product detail page with a skeleton`
- `7ec19d3 style: reserve scrollbar gutter to prevent layout shift`
- `165a2f4 feat(catalog): stream related products via Suspense boundary`
- `4bbe7f1 feat(catalog): add error boundary for the product detail page`
- `8aa60c1 feat(catalog): add custom 404 for missing products`

### Что сделали

- [app/products/loading.tsx](app/products/loading.tsx) — скелетон каталога.
- [app/products/\[id\]/loading.tsx](app/products/[id]/loading.tsx) — скелетон страницы товара.
- [components/RelatedProducts.tsx](components/RelatedProducts.tsx) + [components/RelatedProductsSkeleton.tsx](components/RelatedProductsSkeleton.tsx) + `<Suspense>` в [app/products/\[id\]/page.tsx](app/products/[id]/page.tsx) — гранулярный streaming похожих товаров.
- [app/products/\[id\]/error.tsx](app/products/[id]/error.tsx) — кастомный UI ошибки с `reset()`.
- [app/products/\[id\]/not-found.tsx](app/products/[id]/not-found.tsx) — кастомная 404 для отсутствующего товара.
- `scrollbar-gutter: stable` в [app/globals.css](app/globals.css) — горизонтальный CLS.

### Ключевые идеи

**Иерархия boundary**:
```
<ErrorBoundary fallback={error.tsx}>
  <Suspense fallback={loading.tsx}>
    <NotFoundBoundary fallback={not-found.tsx}>
      <page.tsx />
    </NotFoundBoundary>
  </Suspense>
</ErrorBoundary>
```

**`loading.tsx` vs `<Suspense>`**:
- `loading.tsx` — на **весь сегмент**. Простой, но грубый: вся страница ждёт самое медленное.
- `<Suspense fallback={...}>` — точечно. Быстрая часть рендерится сразу, медленная «дотекает» позже.
- Под капотом `loading.tsx` — автоматическая обёртка `<Suspense>` вокруг `page.tsx`. Не магия.

**HTTP streaming** — что технически происходит:
1. Сервер отдаёт первый кусок HTML сразу: статичную часть + fallback'и Suspense.
2. По мере того, как async-компоненты резолвятся, сервер «дописывает» `<template>`-блоки в конец ответа.
3. Маленькие `<script>` после каждого `<template>` подменяют fallback на реальный контент.
4. Один HTTP-ответ, длительный, отдаваемый частями. Не WebSocket, не SSE — простой HTTP.

Посмотреть это вживую: DevTools → Network → запрос документа → Timing → `Content Download` растянут на длительность медленных Suspense.

**Когда нужен `<Suspense>`** (не «когда долгое», а архитектурно):
> На странице есть **критичная быстрая часть** (название товара, цена, кнопка купить) и **второстепенная медленная** (похожие товары, отзывы). Suspense не даёт второстепенному блокировать критичное.

**Несколько Suspense — независимые лейны**:
```tsx
<Suspense fallback={...}><Rating /></Suspense>      {/* 0.8s */}
<Suspense fallback={...}><Related /></Suspense>     {/* 1.5s */}
<Suspense fallback={...}><Reviews /></Suspense>     {/* 3s */}
```
Все три async-компонента стартуют параллельно. Появляются по мере готовности.

**`error.tsx` vs `not-found.tsx`**:

| | `error.tsx` | `not-found.tsx` |
|---|---|---|
| Триггер | `throw` где угодно в дереве | вызов `notFound()` |
| Семантика | «сломалось» | «не существует» |
| HTTP | 500 | **404** (важно для SEO) |
| Тип компонента | `"use client"` (есть `reset`) | Server Component |
| Props | `{ error: Error, reset: () => void }` | без пропсов |
| `error.message` в проде | скрыто, остаётся только `digest` | — |

### Подводные камни Next 16

1. **`notFound()` всегда ДО любого `<Suspense>`.** Как только Suspense зарендерил fallback — HTTP-статус зафиксирован 200 OK, и реальный 404 больше не отдать.

2. **`error.tsx` обязательно `"use client"`.** Прямой `reset: () => void` нельзя сериализовать через server→client границу.

3. **`error.tsx` НЕ ловит ошибки в `layout.tsx` своего сегмента.** Error boundary живёт внутри layout — если layout сам упал, рендерить error UI негде. Для таких случаев — корневой `app/global-error.tsx`.

4. **Skeleton должен повторять разметку реального контента.** Те же теги (`<h1>`/`<p>`/`<Link>`), те же классы, столько же элементов. Иначе CLS при подмене. Самый железный приём — реальный тег с `<span>` внутри, где `text-transparent bg-zinc-200`.

5. **`<a>` vs `<div>` дают разную высоту line-box.** Inline vs block считаются по-разному. Не подменяй типы тегов в скелетоне.

6. **`scrollbar-gutter: stable`** на `html` — резервирует место под скроллбар. Без этого появление/исчезновение скролла двигает центрированный контент по горизонтали.

7. **`<Suspense>` импортируется из `react`**, не из `next`.

---

## Шпаргалка по Next 16 — что чаще всего ломается

1. **`params` и `searchParams` — Promise**. Всегда `await`.
2. **`fetch` НЕ кэширует по умолчанию**. Нужен `cache: 'force-cache'` или `next: { revalidate: ... }`.
3. **Client Component не импортирует async Server Component**. Передавай через `children`.
4. **`useRouter` из `next/navigation`**, не из `next/router`.
5. **Props в Client Component должны быть сериализуемыми** (нет функций, нет классов).
6. **`"use client"` помечает весь файл и его поддерев**. Не нужно ставить во всех детях.
7. **Деривация: если что-то можно посчитать на сервере — посчитай на сервере.** Меньше JS у клиента.
8. **`notFound()` — до Suspense, иначе HTTP 200 навсегда.**
9. **`error.tsx` — `"use client"`, `not-found.tsx` — Server.**
10. **Skeleton = те же теги/классы, что и в `page.tsx`** — иначе layout shift.