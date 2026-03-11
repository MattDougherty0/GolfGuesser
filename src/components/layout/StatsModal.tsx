"use client";

import { useEffect } from "react";
import type { PlayerState } from "@/lib/types";

interface StatsModalProps {
  stats: PlayerState;
  onClose: () => void;
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Find best daily score from history
  const bestScore = Object.values(stats.history).reduce(
    (max, day) => Math.max(max, day.totalScore),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-cream/10 bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-cream">Statistics</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-cream/40 hover:bg-cream/5 hover:text-cream transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatBox label="Current Streak" value={stats.currentStreak} unit="days" />
          <StatBox label="Longest Streak" value={stats.longestStreak} unit="days" />
          <StatBox label="Games Played" value={stats.gamesPlayed} />
          <StatBox label="Average Score" value={stats.averageScore} />
          <StatBox label="Best Score" value={bestScore} highlight />
          <StatBox label="Total Points" value={stats.totalScore.toLocaleString()} />
        </div>

        {stats.gamesPlayed === 0 && (
          <p className="mt-4 text-center text-sm text-cream/40">
            Play your first game to see stats!
          </p>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: number | string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg bg-background/50 p-3 text-center">
      <p className={`text-2xl font-bold tabular-nums ${highlight ? "text-accent" : "text-cream"}`}>
        {value}
      </p>
      <p className="text-xs text-cream/40 mt-0.5">
        {label}
        {unit && <span className="ml-1 text-cream/25">{unit}</span>}
      </p>
    </div>
  );
}
