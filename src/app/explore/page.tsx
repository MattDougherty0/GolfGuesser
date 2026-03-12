"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MainWithSidebar from "@/components/layout/MainWithSidebar";
import { getExploreSetCount } from "@/lib/explore";
import { getLocalPlayerId, getPlayer, type Player } from "@/lib/db";

const EXPLORE_OPTIONS = [
  {
    id: "pga2025",
    title: "2025 PGA Tour",
    description: "Courses from the 2025 PGA Tour schedule (lower 48)",
  },
];

const COUNT_OPTIONS = [5, 10] as const;

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);

  const doneScore = searchParams.get("done") === "1" ? searchParams.get("score") : null;

  useEffect(() => {
    const pid = getLocalPlayerId();
    if (pid) getPlayer(pid).then((p) => p && setPlayer(p));
  }, []);

  const handleCardClick = (setId: string) => {
    setSelectedSet(setId);
  };

  const handleCountSelect = (setId: string, count: number) => {
    const countParam = count === 0 ? "all" : count;
    router.push(`/play?mode=explore&set=${setId}&count=${countParam}`);
  };

  const handleBack = () => {
    setSelectedSet(null);
  };

  const totalCount = selectedSet ? getExploreSetCount(selectedSet) : 0;

  return (
    <MainWithSidebar playerName={player?.display_name}>
      <main className="flex flex-1 flex-col px-4 py-8 sm:px-8">
        <h1 className="font-serif text-3xl tracking-tight text-cream sm:text-4xl">
          Explore
        </h1>
        <p className="mt-2 text-sm text-cream/50">
          Play custom sets of courses. No leaderboard—just practice.
        </p>

        {doneScore !== null && (
          <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 px-6 py-4">
            <p className="text-lg font-semibold text-accent">Done!</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-cream">
              {parseInt(doneScore, 10).toLocaleString()} points
            </p>
            <Link
              href="/explore"
              className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
            >
              Play again
            </Link>
          </div>
        )}

        {!selectedSet ? (
          <div className="mt-8 space-y-4">
            {EXPLORE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleCardClick(opt.id)}
                className="w-full rounded-xl border border-cream/10 bg-card px-6 py-5 text-left transition-all hover:border-accent/30 hover:bg-accent/5"
              >
                <h2 className="font-semibold text-cream">{opt.title}</h2>
                <p className="mt-1 text-sm text-cream/50">{opt.description}</p>
                <p className="mt-2 text-xs text-accent">
                  {getExploreSetCount(opt.id)} courses
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="mb-4 text-sm text-cream/50 hover:text-cream transition-colors"
            >
              ← Back
            </button>
            <p className="text-cream/70">
              How many courses do you want to play?
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleCountSelect(selectedSet, n)}
                  className="rounded-full border border-cream/15 bg-card px-6 py-2.5 text-sm font-medium text-cream transition-all hover:border-accent/40 hover:bg-accent/10"
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleCountSelect(selectedSet, 0)}
                className="rounded-full border border-cream/15 bg-card px-6 py-2.5 text-sm font-medium text-cream transition-all hover:border-accent/40 hover:bg-accent/10"
              >
                All ({totalCount})
              </button>
            </div>
          </div>
        )}
      </main>
    </MainWithSidebar>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-cream/50">Loading…</div>}>
      <ExploreContent />
    </Suspense>
  );
}
