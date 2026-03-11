"use client";

import { useEffect, useState } from "react";
import {
  calculateNameScore,
  calculatePinScore,
  calculateSpeedBonus,
  calculateHintBonus,
  HINT_POOL,
} from "@/lib/scoring";
import type { GuessResult } from "@/lib/types";

interface ScoreBreakdownProps {
  result: GuessResult;
}

function useCountUp(target: number, durationMs = 600): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / durationMs, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);

  return value;
}

function ScoreRow({
  label,
  detail,
  points,
  isPositive = true,
  delay = 0,
}: {
  label: string;
  detail: string;
  points: number;
  isPositive?: boolean;
  delay?: number;
}) {
  const [visible, setVisible] = useState(delay === 0);
  const animatedPoints = useCountUp(visible ? Math.abs(points) : 0);

  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);

  return (
    <div
      className={`flex items-center justify-between py-2 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-cream/90">{label}</span>
        <span className="text-xs text-cream/40">{detail}</span>
      </div>
      <span
        className={`tabular-nums text-sm font-semibold ${
          isPositive ? "text-accent" : "text-red-400"
        }`}
      >
        {isPositive ? "+" : "-"}
        {animatedPoints}
      </span>
    </div>
  );
}

export default function ScoreBreakdown({ result }: ScoreBreakdownProps) {
  const nameScore = calculateNameScore(result.nameCorrect);
  const pinScore = calculatePinScore(result.pinDistance);
  const speedScore = calculateSpeedBonus(result.timeSeconds);
  const hintBonus = calculateHintBonus(result.hintPenalty ?? 0);
  const hintDetail =
    result.hintsUsed === 0
      ? "No hints!"
      : `${result.hintsUsed} used (−${result.hintPenalty ?? 0} from ${HINT_POOL})`;

  const [showTotal, setShowTotal] = useState(false);
  const animatedTotal = useCountUp(showTotal ? result.score : 0, 800);

  useEffect(() => {
    const t = setTimeout(() => setShowTotal(true), 700);
    return () => clearTimeout(t);
  }, []);

  const minutes = Math.floor(result.timeSeconds / 60);
  const seconds = result.timeSeconds % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="w-full rounded-xl border border-cream/10 bg-card p-4">
      <div className="divide-y divide-cream/5">
        <ScoreRow
          label={result.nameCorrect ? "✓ Correct" : "✗ Incorrect"}
          detail="Course name"
          points={nameScore}
          delay={0}
        />
        <ScoreRow
          label="📍 Pin"
          detail={`${Math.round(result.pinDistance)} miles away`}
          points={pinScore}
          delay={100}
        />
        <ScoreRow
          label="⏱ Speed"
          detail={timeStr}
          points={speedScore}
          delay={200}
        />
        <ScoreRow
          label="💡 Hints"
          detail={hintDetail}
          points={hintBonus}
          delay={300}
        />
      </div>

      {/* Total */}
      <div
        className={`mt-3 flex items-center justify-between border-t border-cream/10 pt-3 transition-all duration-500 ${
          showTotal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
      >
        <span className="text-base font-semibold text-cream">Round Total</span>
        <span className="tabular-nums text-2xl font-bold text-accent">
          {animatedTotal}
        </span>
      </div>
    </div>
  );
}
