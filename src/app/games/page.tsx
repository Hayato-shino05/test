"use client";
import Link from "next/link";

const games = [
  { href: "/games/memory", label: "Memory Card" },
  // Sau này sẽ thêm các game khác
];

export default function GamesPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Mini-Games</h1>
      <ul className="space-y-3">
        {games.map((g) => (
          <li key={g.href}>
            <Link
              href={g.href}
              className="block p-4 rounded border hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              {g.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
