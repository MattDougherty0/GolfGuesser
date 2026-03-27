"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { CuratedQuery } from "@/lib/coursemuse/types";

interface CourseMuseSearchProps {
  queries: CuratedQuery[];
}

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function CourseMuseSearch({ queries }: CourseMuseSearchProps) {
  const router = useRouter();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const n = normalize(q);
    if (n.length < 1) return queries;
    return queries.filter(
      (item) =>
        normalize(item.label).includes(n) ||
        item.keywords.some((k) => k.includes(n)) ||
        item.shape.includes(n)
    );
  }, [q, queries]);

  function runQuery(item: CuratedQuery) {
    const action = item.action;
    if (action.type === "scroll") {
      const cardId = action.cardId;
      router.push(`/coursemuse#${cardId}`);
      window.setTimeout(() => {
        document.getElementById(cardId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    } else {
      const path = `/coursemuse/${action.courseId}${action.hash ?? ""}`;
      router.push(path);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-cream/60">
        Search curated golf queries
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try: Sawgrass, holes in one, Masters…"
          className="mt-2 w-full rounded-xl border border-cream/15 bg-cream/5 px-4 py-3 text-cream placeholder:text-cream/30 outline-none focus:border-accent/50"
          autoComplete="off"
        />
      </label>
      <ul className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-cream/10 bg-background/80 p-2">
        {filtered.length === 0 ? (
          <li className="px-2 py-3 text-sm text-cream/45">No matches.</li>
        ) : (
          filtered.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => runQuery(item)}
                className="flex w-full flex-col rounded-md px-2 py-2 text-left text-sm text-cream/85 transition-colors hover:bg-cream/5"
              >
                <span>{item.label}</span>
                <span className="text-xs text-cream/40">{item.shape.replace(/_/g, " ")}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
