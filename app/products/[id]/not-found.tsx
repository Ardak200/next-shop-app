import Link from "next/link";

export default function ProductPageNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-3xl font-bold tracking-tight">Товар не найден</h1>
        <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
          Возможно, его сняли с продажи или вы перешли по устаревшей ссылке.
        </p>

        <Link
          href="/products"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Вернуться в каталог
        </Link>
      </div>
    </main>
  );
}
