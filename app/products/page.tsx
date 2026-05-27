import { SearchBox } from "@/components/SearchBox";
import { searchProducts } from "@/lib/products";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await searchProducts(q);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Каталог</h1>

      <div className="mt-6 max-w-md">
        <SearchBox />
      </div>

      {q && (
        <p className="mt-4 text-sm text-zinc-500">
          Результаты по запросу:{" "}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            «{q}»
          </span>{" "}
          <Link href="/products" className="ml-2 underline">
            Сбросить
          </Link>
        </p>
      )}

      {products.length === 0 ? (
        <p className="mt-8 text-zinc-500">Ничего не найдено.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                href={`/products/${p.id}`}
                className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800"
              >
                <h2 className="font-semibold">{p.title}</h2>
                <p className="text-zinc-500">{p.price} ₸</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
