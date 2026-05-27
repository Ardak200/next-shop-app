import { Product } from "@/types/products";
import data from "@/data/products.json";

export async function getAllProducts(): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 300));
  return data;
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const products = await getAllProducts();
  return products.find((p) => p.id === id);
}

export async function getRelatedProducts(
  currentId: string,
): Promise<Product[]> {
  await new Promise((r) => setTimeout(r, 500));
  const all = await getAllProducts();
  return all.filter((p) => p.id !== currentId);
}

export async function searchProducts(query?: string): Promise<Product[]> {
  const all = await getAllProducts();
  if (!query) return all;
  const q = query.toLowerCase().trim();
  if (!q) return all;
  return all.filter((p) => p.title.toLowerCase().includes(q));
}
