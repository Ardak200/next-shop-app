import { Product } from "@/types/products";
import data from "@/data/products.json";

export function getAllProducts(): Product[] {
  return data;
}

export function getProduct(id: string): Product | undefined {
  return data.find((p) => p.id === id);
}
