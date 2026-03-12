"use client";

import { useState, useMemo } from "react";
import type { CourseClues } from "@/lib/types";

interface HintPanelProps {
  clues: CourseClues;
  onHintsUsedChange: (count: number, penalty: number) => void;
}

/** Option 3 costs: all variants sum to 300. */
const HINT_COSTS_5 = [85, 45, 20, 105, 45] as const;
const HINT_COSTS_6 = [55, 30, 15, 85, 35, 80] as const; // one optional
const HINT_COSTS_7 = [55, 30, 15, 85, 35, 45, 35] as const; // both optional

const BASE_HINTS = [
  { key: "region" as const, label: "Region" },
  { key: "typeHint" as const, label: "Type" },
  { key: "architectHint" as const, label: "Architect" },
  { key: "tournamentHint" as const, label: "Tournament" },
  { key: "didYouKnow" as const, label: "Fun Fact" },
] satisfies { key: keyof CourseClues; label: string }[];

const OPTIONAL_HINTS = [
  { key: "mostRecentWinnerHint" as const, label: "Recent Winner" },
  { key: "mostWinsHint" as const, label: "Most Wins" },
] satisfies { key: keyof CourseClues; label: string }[];

function buildHintConfig(clues: CourseClues): { key: keyof CourseClues; label: string; cost: number }[] {
  const hasRecent = !!clues.mostRecentWinnerHint;
  const hasWins = !!clues.mostWinsHint;
  const optionalCount = (hasRecent ? 1 : 0) + (hasWins ? 1 : 0);
  const costs = optionalCount === 0 ? HINT_COSTS_5 : optionalCount === 1 ? HINT_COSTS_6 : HINT_COSTS_7;

  const config: { key: keyof CourseClues; label: string; cost: number }[] = BASE_HINTS.map(
    (h, i) => ({ ...h, cost: costs[i] })
  );

  if (hasRecent) config.push({ ...OPTIONAL_HINTS[0], cost: hasWins ? 45 : 80 });
  if (hasWins) config.push({ ...OPTIONAL_HINTS[1], cost: 35 });

  return config;
}

export default function HintPanel({ clues, onHintsUsedChange }: HintPanelProps) {
  const hintConfig = useMemo(() => buildHintConfig(clues), [clues]);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function revealHint(index: number) {
    if (revealed.has(index)) return;
    const next = new Set(revealed);
    next.add(index);
    setRevealed(next);
    const penalty = [...next].reduce((sum, i) => sum + hintConfig[i].cost, 0);
    onHintsUsedChange(next.size, penalty);
  }

  return (
    <div className="min-w-0 w-full max-w-full space-y-3">
      {/* Hint buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {hintConfig.map((hint, i) => {
          const isRevealed = revealed.has(i);

          return (
            <button
              key={hint.key}
              onClick={isRevealed ? undefined : () => revealHint(i)}
              disabled={isRevealed}
              className={`
                shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium transition-all sm:px-4 sm:text-xs
                ${isRevealed
                  ? "border border-accent/30 bg-accent/10 text-accent/70"
                  : "border border-cream/20 bg-card text-cream cursor-pointer hover:border-accent/50 hover:text-accent active:scale-95"
                }
              `}
            >
              {hint.label}
              {!isRevealed && (
                <span className="ml-1.5 text-[10px] text-accent">-{hint.cost}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Revealed hints */}
      {revealed.size > 0 && (
        <div className="rounded-xl border border-cream/8 bg-card/40 px-4 py-3">
          <div className="space-y-2.5">
            {hintConfig.map((hint, i) =>
              revealed.has(i) ? (
                <div key={hint.key} className="text-sm leading-relaxed">
                  <span className="font-medium text-accent/80">{hint.label} <span className="text-accent">(-{hint.cost})</span>: </span>
                  <span className="text-cream/70">{clues[hint.key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
