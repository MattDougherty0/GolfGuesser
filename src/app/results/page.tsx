"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPlayerState, getTodayResults } from "@/lib/storage";
import { getTodayDateET } from "@/lib/daily";
import { getCourseById } from "@/lib/courses";
import type { PlayerState, TodayResults, RoundResult, Course, GuessResult } from "@/lib/types";
import Header from "@/components/layout/Header";
import StatsModal from "@/components/layout/StatsModal";
import RevealCard from "@/components/reveal/RevealCard";
import { calculateHintPenalty } from "@/lib/scoring";

function RevealModal({
  onClose,
  course,
  result,
  roundNumber,
}: {
  onClose: () => void;
  course: Course;
  result: GuessResult;
  roundNumber: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm py-8 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-6 sm:py-10">
          <RevealCard
            course={course}
            result={result}
            roundNumber={roundNumber}
            totalRounds={3}
            onClose={onClose}
            standalone
          />
        </div>
      </div>
    </div>
  );
}

function roundResultToGuessResult(round: RoundResult, course: Course): GuessResult {
  const lat = course.location.latitude;
  const lng = course.location.longitude;
  return {
    courseId: round.courseId,
    nameGuess: round.nameGuess ?? "",
    nameCorrect: round.nameCorrect,
    pinLat: round.pinLat ?? lat,
    pinLng: round.pinLng ?? lng,
    pinDistance: round.pinDistance,
    hintsUsed: round.hintsUsed,
    hintPenalty: round.hintPenalty ?? calculateHintPenalty(round.hintsUsed),
    timeSeconds: round.timeSeconds,
    score: round.score,
  };
}

function useMidnightCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const etNow = new Date(
        now.toLocaleString("en-US", { timeZone: "America/New_York" })
      );
      const midnight = new Date(etNow);
      midnight.setDate(midnight.getDate() + 1);
      midnight.setHours(0, 0, 0, 0);

      const diff = midnight.getTime() - etNow.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return timeLeft;
}

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<TodayResults | null>(null);
  const [stats, setStats] = useState<PlayerState | null>(null);
  const [courses, setCourses] = useState<(Course | undefined)[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [revealRoundIndex, setRevealRoundIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  const countdown = useMidnightCountdown();

  useEffect(() => {
    setMounted(true);
    const todayResults = getTodayResults();
    if (!todayResults || !todayResults.completed) {
      router.replace("/");
      return;
    }
    setResults(todayResults);
    setStats(getPlayerState());

    const roundCourses = todayResults.rounds.map((r) => getCourseById(r.courseId));
    setCourses(roundCourses);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [router]);

  if (!mounted || !results) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-cream/40">Loading results…</span>
      </div>
    );
  }

  const today = new Date().toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const totalHints = results.rounds.reduce((sum, r) => sum + r.hintsUsed, 0);
  const bestRound = Math.max(...results.rounds.map((r) => r.score));
  const avgPinDistance =
    Math.round(
      results.rounds.reduce((sum, r) => sum + r.pinDistance, 0) / results.rounds.length
    );

  const dateShort = getTodayDateET().slice(5).replace("-", "/"); // "03/10"

  function handleShare() {
    const text = `GolfGuessr ${dateShort} — ${results!.totalScore.toLocaleString()}/3,000\n\n${results!.rounds
      .map((r, i) => {
        const correct = r.nameCorrect ? "✅" : "❌";
        return `R${i + 1}: ${correct} ${r.score}pts`;
      })
      .join("\n")}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6 sm:py-10">
        {/* Date heading */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-wider text-cream/40">Today&apos;s Results</p>
          <p className="text-sm text-cream/60 mt-1">{today}</p>
        </div>

        {/* Round summary cards */}
        <div className="space-y-3 mb-6">
          {results.rounds.map((round, i) => (
            <RoundSummaryCard
              key={i}
              round={round}
              course={courses[i]}
              roundNumber={i + 1}
              onClick={() => setRevealRoundIndex(i)}
            />
          ))}
        </div>

        {/* Total score */}
        <div className="text-center mb-6">
          <p className="text-5xl font-bold tabular-nums text-accent">
            {results.totalScore.toLocaleString()}
          </p>
          <p className="text-sm text-cream/40 mt-1">out of 3,000</p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={handleShare}
            className="rounded-full border border-cream/15 bg-card px-6 py-2.5 text-sm font-medium text-cream transition-all hover:border-accent/30 hover:bg-accent/5"
          >
            {copied ? "Copied!" : "Share Results"}
          </button>
          <a
            href="/leaderboard"
            className="rounded-full border border-accent/30 bg-accent/5 px-6 py-2.5 text-sm font-medium text-accent transition-all hover:bg-accent/10"
          >
            Leaderboard
          </a>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <QuickStat label="Hints Used" value={String(totalHints)} />
          <QuickStat label="Best Round" value={String(bestRound)} />
          <QuickStat label="Avg Pin" value={`${avgPinDistance} mi`} />
        </div>

        {/* Streak */}
        {stats && stats.currentStreak > 0 && (
          <div className="rounded-xl border border-cream/10 bg-card p-4 text-center mb-6">
            <p className="text-3xl font-bold text-accent">{stats.currentStreak}</p>
            <p className="text-xs text-cream/40 mt-0.5">
              day streak {stats.currentStreak >= stats.longestStreak ? "🔥 Personal best!" : ""}
            </p>
          </div>
        )}

        {/* My Stats link */}
        {stats && (
          <div className="text-center mb-6">
            <button
              onClick={() => setShowStats(true)}
              className="text-sm text-cream/40 hover:text-cream/70 transition-colors"
            >
              View full stats
            </button>
          </div>
        )}

        {/* Countdown */}
        <div className="text-center pb-8">
          <p className="text-sm text-cream/40">Next puzzle in</p>
          <p className="text-lg font-mono tabular-nums text-cream/60 mt-0.5">
            {countdown}
          </p>
        </div>
      </main>

      {showStats && stats && (
        <StatsModal stats={stats} onClose={() => setShowStats(false)} />
      )}

      {/* Reveal modal - matches play page reveal layout */}
      {revealRoundIndex !== null && courses[revealRoundIndex] && (
        <RevealModal
          onClose={() => setRevealRoundIndex(null)}
          course={courses[revealRoundIndex]!}
          result={roundResultToGuessResult(results.rounds[revealRoundIndex], courses[revealRoundIndex]!)}
          roundNumber={revealRoundIndex + 1}
        />
      )}
    </div>
  );
}

// ── Sub-components ──

function RoundSummaryCard({
  round,
  course,
  roundNumber,
  onClick,
}: {
  round: RoundResult;
  course: Course | undefined;
  roundNumber: number;
  onClick: () => void;
}) {
  const minutes = Math.floor(round.timeSeconds / 60);
  const seconds = round.timeSeconds % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-xl border border-cream/10 bg-card p-4 text-left transition-colors hover:border-cream/20 hover:bg-card/80 cursor-pointer"
    >
      {/* Round number badge */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-cream/70">
        R{roundNumber}
      </div>

      {/* Course info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-cream truncate">
          {course?.name ?? "Unknown Course"}
        </p>
        <div className="flex gap-3 mt-0.5 text-xs text-cream/40">
          <span>{round.nameCorrect ? "✓ Correct" : "✗ Wrong"}</span>
          <span>{Math.round(round.pinDistance)} mi</span>
          <span>{timeStr}</span>
          {round.hintsUsed > 0 && <span>{round.hintsUsed} hint{round.hintsUsed > 1 ? "s" : ""}</span>}
        </div>
      </div>

      {/* Score */}
      <div className="shrink-0 text-right">
        <p className="text-lg font-bold tabular-nums text-accent">{round.score}</p>
      </div>
    </button>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-cream/5 bg-card/50 p-3 text-center">
      <p className="text-lg font-semibold tabular-nums text-cream">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-cream/35 mt-0.5">{label}</p>
    </div>
  );
}
