"use client";
import Link from "next/link";
import { useT } from "@/providers/I18nProvider";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const links = [
  { href: "/dashboard", key: "dashboard" },
  
  { href: "/", key: "home" },
  { href: "/album", key: "album" },
  { href: "/community", key: "community" },
  { href: "/games", key: "games" },
  { href: "/share", key: "share" },
  { href: "/bulletin", key: "bulletin" },
  { href: "/ecard", key: "ecard" },
  { href: "/invite", key: "invite" },
];

export default function Navbar() {
  const t = useT();
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b dark:bg-neutral-900/70">
      <nav className="max-w-5xl mx-auto flex items-center h-12 px-4 gap-4 text-sm font-medium">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              pathname === l.href
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            }
          >
            {t(l.key)}
          </Link>
        ))}
      </nav>
        <LanguageSwitcher />
    </header>
  );
}
