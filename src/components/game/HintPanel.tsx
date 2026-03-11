"use client";

import { useState } from "react";
import type { CourseClues } from "@/lib/types";
import { HINT_COSTS } from "@/lib/scoring";

interface HintPanelProps {
  clues: CourseClues;
  onHintsUsedChange: (count: number, penalty: number) => void;
}

const HINT_CONFIG = [
  { key: "region" as const, label: "Region" },
  { key: "typeHint" as const, label: "Type" },
  { key: "architectHint" as const, label: "Architect" },
  { key: "tournamentHint" as const, label: "Tournament" },
  { key: "didYouKnow" as const, label: "Fun Fact" },
] satisfies { key: keyof CourseClues; label: string }[];

export default function HintPanel({ clues, onHintsUsedChange }: HintPanelProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function revealHint(index: number) {
    if (revealed.has(index)) return;
    const next = new Set(revealed);
    next.add(index);
    setRevealed(next);
    let penalty = 0;
    for (const idx of next) penalty += HINT_COSTS[idx];
    onHintsUsedChange(next.size, penalty);
  }

  return (
    <div className="w-full max-w-[500px] min-w-0 space-y-3">
      {/* Hint buttons */}
      <div className="flex flex-wrap justify-center gap-2">
        {HINT_CONFIG.map((hint, i) => {
          const isRevealed = revealed.has(i);

          return (
            <button
              key={hint.key}
              onClick={isRevealed ? undefined : () => revealHint(i)}
              disabled={isRevealed}
              className={`
                rounded-full px-4 py-1.5 text-xs font-medium transition-all
                ${isRevealed
                  ? "border border-accent/30 bg-accent/10 text-accent/70"
                  : "border border-cream/20 bg-card text-cream cursor-pointer hover:border-accent/50 hover:text-accent active:scale-95"
                }
              `}
            >
              {hint.label}
              {!isRevealed && (
                <span className="ml-1.5 text-[10px] opacity-50">-{HINT_COSTS[i]}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Revealed hints */}
      {revealed.size > 0 && (
        <div className="rounded-xl border border-cream/8 bg-card/40 px-4 py-3">
          <div className="space-y-2.5">
            {HINT_CONFIG.map((hint, i) =>
              revealed.has(i) ? (
                <div key={hint.key} className="text-sm leading-relaxed">
                  <span className="font-medium text-accent/80">{hint.label} <span className="text-accent/50">(-{HINT_COSTS[i]})</span>: </span>
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
