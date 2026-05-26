import { RelatedProducts } from "@/components/RelatedProducts";
import { RelatedProductsSkeleton } from "@/components/RelatedProductsSkeleton";
import { getAllProducts, getProduct } from "@/lib/products";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateStaticParams() {
  const products = await getAllProducts();

  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) return notFound();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <Link
        href="/products"
        className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-zinc-100"
      >
        ← Назад в каталог
      </Link>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-4xl font-bold tracking-tight">{product.title}</h1>
        <p className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          {product.price.toLocaleString("ru-RU")} ₸
        </p>
        <p className="mt-6 leading-relaxed text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>

        <button
          type="button"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          В корзину
        </button>
      </div>

      <section className="mt-12">
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts currentId={id} />
        </Suspense>
      </section>
    </main>
  );
}
