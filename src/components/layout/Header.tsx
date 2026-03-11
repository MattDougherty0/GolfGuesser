"use client";

import Link from "next/link";

interface HeaderProps {
  onStatsClick?: () => void;
}

export default function Header({ onStatsClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 sm:px-6">
      <Link href="/" className="font-serif text-xl text-cream tracking-tight hover:text-accent transition-colors">
        CourseIQ
      </Link>

      {onStatsClick && (
        <button
          onClick={onStatsClick}
          aria-label="View stats"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
          </svg>
        </button>
      )}
    </header>
  );
}
