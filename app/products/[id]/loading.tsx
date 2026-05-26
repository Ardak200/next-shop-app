import Link from "next/link";

export default function ProductPageLoading() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 animate-pulse px-4 py-12">
      <Link
        href="/products"
        className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← Назад в каталог
      </Link>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-4xl font-bold tracking-tight">
          <span className="rounded bg-zinc-200 text-transparent dark:bg-zinc-800">
            Загрузка названия
          </span>
        </h1>
        <p className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          <span className="rounded bg-zinc-200 text-transparent dark:bg-zinc-800">
            0 000 ₸
          </span>
        </p>
        <p className="mt-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
          <span className="rounded bg-zinc-200 text-transparent dark:bg-zinc-800">
            Загрузка описания товара
          </span>
        </p>

        <button
          type="button"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          В корзину
        </button>
      </div>
    </main>
  );
}
