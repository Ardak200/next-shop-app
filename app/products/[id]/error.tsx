"use client";

import Link from "next/link";

export default function ProductPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-3xl font-bold tracking-tight">
          Что-то пошло не так
        </h1>
        <p className="mt-3 leading-relaxed text-zinc-600 dark:text-zinc-400">
          {error.message}
        </p>

        {error.digest && (
          <p className="mt-4 font-mono text-xs text-zinc-400 dark:text-zinc-500">
            Код ошибки: {error.digest}
          </p>
        )}

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Попробовать снова
          </button>
          <Link
            href="/products"
            className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    </main>
  );
}
