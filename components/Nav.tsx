"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/products", label: "Каталог" },
  { href: "/cart", label: "Корзина" },
  { href: "/about", label: "О магазине" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            pathname === link.href
              ? "font-semibold text-black dark:text-white"
              : "text-zinc-500"
          }
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
