import { getRelatedProducts } from "@/lib/products";
import Link from "next/link";

export async function RelatedProducts({ currentId }: { currentId: string }) {
  const products = await getRelatedProducts(currentId);

  return (
    <div>
      <h2 className="text-2xl font-semibold">Похожие товары</h2>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <li key={p.id}>
            <Link
              href={`/products/${p.id}`}
              className="block rounded-lg border border-zinc-200 p-4 hover:border-zinc-400 dark:border-zinc-800"
            >
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-zinc-500">{p.price} ₸</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
