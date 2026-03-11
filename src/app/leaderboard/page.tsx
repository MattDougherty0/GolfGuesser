"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getDailyLeaderboard,
  getWeeklyLeaderboard,
  getAllTimeLeaderboard,
  getLocalPlayerId,
  type LeaderboardEntry,
} from "@/lib/db";
import { getTodayDateET } from "@/lib/daily";
import Header from "@/components/layout/Header";

type Tab = "daily" | "weekly" | "alltime";

function getWeekDates(): string[] {
  const today = new Date(getTodayDateET() + "T12:00:00-05:00");
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export default function LeaderboardPage() {
  const [tab, setTab] = useState<Tab>("daily");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const playerId = getLocalPlayerId();

  const fetchLeaderboard = useCallback(async (t: Tab) => {
    setLoading(true);
    let data: LeaderboardEntry[] = [];
    if (t === "daily") {
      data = await getDailyLeaderboard(getTodayDateET());
    } else if (t === "weekly") {
      data = await getWeeklyLeaderboard(getWeekDates());
    } else {
      data = await getAllTimeLeaderboard();
    }
    setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLeaderboard(tab);
  }, [tab, fetchLeaderboard]);

  const tabLabels: { key: Tab; label: string }[] = [
    { key: "daily", label: "Today" },
    { key: "weekly", label: "This Week" },
    { key: "alltime", label: "All Time" },
  ];

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden">
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 sm:py-10">
        <h1 className="text-center font-serif text-3xl text-cream mb-6">Leaderboard</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-6 rounded-full border border-cream/10 bg-card p-1">
          {tabLabels.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`
                flex-1 rounded-full py-2 text-xs font-medium transition-all
                ${tab === key
                  ? "bg-accent text-background"
                  : "text-cream/50 hover:text-cream/80"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cream/20 border-t-accent" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-cream/40">No scores yet</p>
            <p className="text-xs text-cream/25 mt-1">Be the first to play!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const isMe = entry.player_id === playerId;
              return (
                <div
                  key={`${entry.player_id}-${entry.rank}`}
                  className={`
                    flex items-center gap-3 rounded-xl border p-3 transition-all
                    ${isMe
                      ? "border-accent/30 bg-accent/5"
                      : "border-cream/8 bg-card/50"
                    }
                  `}
                >
                  {/* Rank */}
                  <div className={`
                    flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold
                    ${entry.rank <= 3
                      ? "bg-accent/20 text-accent"
                      : "bg-primary text-cream/50"
                    }
                  `}>
                    {entry.rank}
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isMe ? "text-accent" : "text-cream"}`}>
                      {entry.display_name}
                      {isMe && <span className="ml-1.5 text-xs text-accent/60">(you)</span>}
                    </p>
                  </div>

                  {/* Score */}
                  <p className="shrink-0 tabular-nums text-sm font-bold text-accent">
                    {entry.total_score.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
