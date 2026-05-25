import Link from "next/link";
import { Nav } from "./Nav";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="font-semibold text-black dark:text-white">
          Магазин
        </Link>
        <Nav />
      </div>
    </header>
  );
}
