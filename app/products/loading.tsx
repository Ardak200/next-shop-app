export default function ProductsPageLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 animate-pulse px-4 py-12">
      <div className="h-10 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div className="h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="mt-3 h-4 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          </li>
        ))}
      </ul>
    </main>
  );
}
