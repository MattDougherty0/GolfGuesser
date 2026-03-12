"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isTodayCompleted, getTodayResults } from "@/lib/storage";
import { getLocalPlayerId, getPlayer, createPlayer, type Player } from "@/lib/db";
import MainWithSidebar from "@/components/layout/MainWithSidebar";
import UsernameModal from "@/components/auth/UsernameModal";

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

export default function Home() {
  const [completed, setCompleted] = useState(false);
  const [todayScore, setTodayScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [needsUsername, setNeedsUsername] = useState(false);

  const countdown = useMidnightCountdown();

  useEffect(() => {
    setMounted(true);
    const done = isTodayCompleted();
    setCompleted(done);
    if (done) {
      const results = getTodayResults();
      setTodayScore(results?.totalScore ?? 0);
    }
    requestAnimationFrame(() => window.scrollTo(0, 0));

    const pid = getLocalPlayerId();
    if (pid) {
      getPlayer(pid).then((p) => {
        if (p) setPlayer(p);
        else setNeedsUsername(true);
      });
    } else {
      setNeedsUsername(true);
    }
  }, []);

  async function handleCreatePlayer(name: string): Promise<boolean> {
    const p = await createPlayer(name);
    if (p) {
      setPlayer(p);
      setNeedsUsername(false);
      return true;
    }
    return false;
  }

  function handleSkipLogin() {
    setNeedsUsername(false);
  }

  const today = mounted
    ? new Date().toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <MainWithSidebar playerName={player?.display_name}>
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="rounded-2xl border border-cream/10 bg-card px-8 py-12 shadow-2xl sm:px-16 sm:py-16 text-center">
          <h1 className="font-serif text-5xl tracking-tight text-cream sm:text-6xl">
            GolfGuessr
          </h1>
          <p className="mt-3 text-lg text-cream/70">
            How well do you know America&apos;s golf courses?
          </p>

          {mounted && (
            <p className="mt-2 text-sm text-cream/40">{today}</p>
          )}

          {mounted && completed ? (
            <div className="mt-8 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-cream/40">Today&apos;s Score</p>
                <p className="text-5xl font-bold tabular-nums text-accent mt-1">
                  {todayScore.toLocaleString()}
                </p>
                <p className="text-sm text-cream/40 mt-1">out of 3,000</p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <Link
                  href="/results"
                  className="inline-block rounded-full bg-accent px-8 py-3 text-base font-semibold text-background transition-all hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
                >
                  View Results
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-sm font-medium text-accent underline underline-offset-2 hover:brightness-110 transition-colors"
                >
                  Leaderboard
                </Link>
              </div>

              <div className="pt-2">
                <p className="text-sm text-cream/40">Next puzzle in</p>
                <p className="text-lg font-mono tabular-nums text-cream/60 mt-0.5">
                  {countdown}
                </p>
              </div>
            </div>
          ) : mounted ? (
            <Link
              href="/play"
              className="mt-8 inline-block rounded-full bg-accent px-8 py-3 text-base font-semibold text-background transition-all hover:brightness-110 hover:shadow-lg hover:shadow-accent/20"
            >
              Play Today&apos;s Challenge
            </Link>
          ) : null}
        </div>
      </main>

      {needsUsername && <UsernameModal onSubmit={handleCreatePlayer} onSkip={handleSkipLogin} />}
    </MainWithSidebar>
  );
}
