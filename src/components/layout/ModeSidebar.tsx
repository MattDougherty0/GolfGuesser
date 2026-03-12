"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ModeSidebar() {
  const pathname = usePathname();
  const isToday = pathname === "/";
  const isExplore = pathname.startsWith("/explore");

  return (
    <aside className="flex shrink-0 flex-col gap-1 border-r border-cream/10 bg-card/30 px-4 py-6">
      <Link
        href="/"
        className={`text-sm font-medium transition-colors ${
          isToday ? "text-accent" : "text-cream/50 hover:text-cream/80"
        }`}
      >
        Today&apos;s Challenge
      </Link>
      <Link
        href="/explore"
        className={`text-sm font-medium transition-colors ${
          isExplore ? "text-accent" : "text-cream/50 hover:text-cream/80"
        }`}
      >
        Explore
      </Link>
    </aside>
  );
}
