import { getAllProducts } from "@/lib/products";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
      <h1 className="text-4xl font-bold tracking-tight">Каталог</h1>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    </main>
  );
}
