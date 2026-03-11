"use client";

import Link from "next/link";

interface HeaderProps {
  playerName?: string | null;
}

export default function Header({ playerName }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 sm:px-6">
      <Link href="/" className="font-serif text-xl text-cream tracking-tight hover:text-accent transition-colors">
        CourseIQ
      </Link>

      <div className="flex items-center gap-2">
        {playerName && (
          <span className="text-xs text-accent/70 font-medium">{playerName}</span>
        )}

        <Link
          href="/about"
          aria-label="About"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </Link>

        <Link
          href="/leaderboard"
          aria-label="Leaderboard"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
