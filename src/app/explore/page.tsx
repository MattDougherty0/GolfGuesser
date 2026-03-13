"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import MainWithSidebar from "@/components/layout/MainWithSidebar";
import { getExploreSetCount, getExploreSetCourseNames } from "@/lib/explore";
import { REGIONS, getStatesAbbrevForRegion } from "@/lib/regions";
import { getLocalPlayerId, getPlayer, getExploreLeaderboard, type Player, type LeaderboardEntry, type ExploreCount } from "@/lib/db";

const EXPLORE_OPTIONS = [
  {
    id: "pga2025",
    title: "2025 PGA Tour",
    description: "Courses from the 2025 PGA Tour schedule (lower 48)",
  },
  {
    id: "tiger",
    title: "Tiger's Wins",
    description: "Courses where Tiger Woods has won (1994 U.S. Amateur onward)",
  },
  {
    id: "erie",
    title: "Erie",
    description: "Courses in the Erie, PA area",
  },
  ...REGIONS.map((region) => ({
    id: `region-${region}` as const,
    title: region,
    description: `Courses in the ${region} region`,
  })),
  {
    id: "fazio",
    title: "Fazio Collection",
    description: "Courses designed by Tom Fazio",
  },
  {
    id: "ross",
    title: "Donald Ross Collection",
    description: "Courses designed by Donald Ross",
  },
  {
    id: "dye",
    title: "Pete Dye Collection",
    description: "Courses designed by Pete Dye",
  },
  {
    id: "cooreCrenshaw",
    title: "Coore & Crenshaw Collection",
    description: "Courses designed by Bill Coore & Ben Crenshaw",
  },
];

const EXPLORE_CARD_IMAGES: Record<string, string> = {
  pga2025: "/images/explore/pga2025.jpg",
  tiger: "/images/explore/tiger.png",
  fazio: "/images/explore/fazio.png",
  ross: "/images/explore/donald-ross.png",
  dye: "/images/explore/pete-dye.png",
  cooreCrenshaw: "/images/explore/coore-crenshaw.png",
  erie: "/images/explore/erie.jpg",
  "region-West": "/images/explore/west.jpg",
  "region-Southwest": "/images/explore/southwest.jpg",
  "region-Midwest": "/images/explore/midwest.jpg",
  "region-South": "/images/explore/south.jpg",
  "region-Mid Atlantic": "/images/explore/mid-atlantic.jpg",
  "region-New England": "/images/explore/new-england.jpg",
};

const COUNT_OPTIONS = [5, 10] as const;

function ExploreSetLeaderboard({
  setId,
  totalCount,
  playerId,
}: {
  setId: string;
  totalCount: number;
  playerId: string | null;
}) {
  const [tab, setTab] = useState<ExploreCount>("5");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async (count: ExploreCount) => {
    setLoading(true);
    const data = await getExploreLeaderboard(setId, count);
    setEntries(data);
    setLoading(false);
  }, [setId]);

  useEffect(() => {
    fetchLeaderboard(tab);
  }, [tab, fetchLeaderboard]);

  const tabLabels: { key: ExploreCount; label: string }[] = [
    { key: "5", label: "5 courses" },
    { key: "10", label: "10 courses" },
    { key: "all", label: `All (${totalCount})` },
  ];

  return (
    <div className="rounded-xl border border-cream/10 bg-card/50 px-4 py-4">
      <p className="text-xs font-medium uppercase tracking-wider text-cream/50 mb-3">
        Leaderboard
      </p>
      <div className="flex gap-1 mb-4 rounded-full border border-cream/10 bg-primary p-1">
        {tabLabels.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`
              flex-1 rounded-full py-1.5 text-xs font-medium transition-all
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
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-cream/20 border-t-accent" />
        </div>
      ) : entries.length === 0 ? (
        <p className="text-sm text-cream/40 py-4">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {entries.map((entry) => {
            const isMe = entry.player_id === playerId;
            return (
              <div
                key={`${entry.player_id}-${entry.rank}`}
                className={`
                  flex items-center gap-2 rounded-lg border p-2 text-sm
                  ${isMe ? "border-accent/30 bg-accent/5" : "border-cream/8 bg-card/30"}
                `}
              >
                <span className="w-6 shrink-0 text-center font-bold text-cream/60">
                  {entry.rank}
                </span>
                <span className={`flex-1 min-w-0 truncate ${isMe ? "text-accent" : "text-cream"}`}>
                  {entry.display_name}
                  {isMe && " (you)"}
                </span>
                <span className="shrink-0 tabular-nums font-semibold text-accent">
                  {entry.total_score.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

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
  const courseNames = selectedSet ? getExploreSetCourseNames(selectedSet) : [];

  return (
    <MainWithSidebar playerName={player?.display_name}>
      <main className="flex flex-1 flex-col px-4 py-8 sm:px-8">
        {selectedSet && (
          <button
            type="button"
            onClick={handleBack}
            className="mb-2 text-sm text-cream/50 hover:text-cream transition-colors text-left"
          >
            ← Back
          </button>
        )}
        <h1 className="font-serif text-3xl tracking-tight text-cream sm:text-4xl">
          Explore
        </h1>
        <p className="mt-2 text-sm text-cream/50">
          Play custom sets of courses.
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
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EXPLORE_OPTIONS.map((opt) => {
              const imageSrc = EXPLORE_CARD_IMAGES[opt.id];
              const isRegion = opt.id.startsWith("region-");
              const regionName = isRegion ? opt.id.replace("region-", "") : null;
              const statesStr = opt.id === "erie"
                ? "Erie, PA"
                : regionName
                  ? getStatesAbbrevForRegion(regionName)
                  : null;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleCardClick(opt.id)}
                  className="group relative aspect-[4/3] w-full min-w-0 overflow-hidden rounded-xl border border-cream/10 transition-all hover:scale-[1.02] hover:border-accent/30 focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: imageSrc ? `url(${imageSrc})` : undefined,
                      backgroundColor: !imageSrc ? "var(--color-card)" : undefined,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 text-left">
                    <h2 className="font-serif text-xl font-semibold text-cream sm:text-2xl">
                      {opt.title}
                    </h2>
                    {statesStr && (
                      <p className="mt-1 text-xs text-cream/70 sm:text-sm">
                        {statesStr}
                      </p>
                    )}
                    <p className="mt-2 text-xs font-medium text-accent">
                      {getExploreSetCount(opt.id)} courses
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-8">
            {/* How many courses - always first */}
            <p className="text-accent font-medium">
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

            {/* Desktop: courses list (left) | leaderboard (right) side by side */}
            {/* Mobile: leaderboard above courses list */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Courses list - left on desktop, below leaderboard on mobile */}
              {courseNames.length > 0 && (
                <div className="min-w-0 order-2 lg:order-1 rounded-xl border border-cream/10 bg-card/50 px-4 py-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-cream/50 mb-3">
                    Courses in this set
                  </p>
                  <ul className="text-sm text-cream/70 leading-relaxed list-disc list-inside space-y-1">
                    {courseNames.map((name) => (
                      <li key={name}>{name}</li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Leaderboard - right on desktop, above courses on mobile */}
              <div className="min-w-0 order-1 lg:order-2">
                <ExploreSetLeaderboard setId={selectedSet} totalCount={totalCount} playerId={getLocalPlayerId()} />
              </div>
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
