export function RelatedProductsSkeleton() {
  return (
    <div className="animate-pulse">
      <h2 className="text-2xl font-semibold">
        <span className="rounded bg-zinc-200 text-transparent dark:bg-zinc-800">
          Похожие товары
        </span>
      </h2>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <li
            key={i}
            className="block rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <h3 className="font-semibold">
              <span className="rounded bg-zinc-200 text-transparent dark:bg-zinc-800">
                Загрузка названия
              </span>
            </h3>
            <p className="text-zinc-500">
              <span className="rounded bg-zinc-200 text-transparent dark:bg-zinc-800">
                0 000 ₸
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
