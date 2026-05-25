import { NextResponse } from "next/server";
import data from "@/data/products.json";

export async function GET() {
  await new Promise((r) => setTimeout(r, 500));
  return NextResponse.json(data);
}
