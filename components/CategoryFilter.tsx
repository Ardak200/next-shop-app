import Link from "next/link";

const categories = [
  { id: "dishes", label: "Посуда" },
  { id: "clothing", label: "Одежда" },
  { id: "stationery", label: "Канцелярия" },
];

export function CategoryFilter({
  currentCategory,
  currentQuery,
}: {
  currentCategory?: string;
  currentQuery?: string;
}) {
  function buildHref(catId?: string) {
    const params = new URLSearchParams();
    if (currentQuery) params.set("q", currentQuery);
    if (catId) params.set("cat", catId);
    const qs = params.toString();
    return qs ? `/products?${qs}` : "/products";
  }

  const baseClass =
    "inline-flex items-center rounded-full px-3 py-1.5 text-sm transition-colors";
  const activeClass =
    "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900";
  const inactiveClass =
    "border border-zinc-200 hover:border-zinc-400 dark:border-zinc-800 dark:hover:border-zinc-600";

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <Link
        href={buildHref()}
        className={`${baseClass} ${!currentCategory ? activeClass : inactiveClass}`}
      >
        Все
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={buildHref(cat.id)}
          className={`${baseClass} ${currentCategory === cat.id ? activeClass : inactiveClass}`}
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
