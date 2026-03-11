import scheduleData from "@/data/schedule.json";
import type { DailyPuzzle } from "./types";

const schedule: DailyPuzzle[] = scheduleData as DailyPuzzle[];

/**
 * Get today's date string in YYYY-MM-DD format, Eastern timezone.
 */
export function getTodayDateET(): string {
  return new Date().toLocaleDateString("en-CA", {
    timeZone: "America/New_York",
  });
}

/**
 * If today's date has a direct match in the schedule, use it.
 * Otherwise, wrap around using modular arithmetic so there's always a puzzle.
 */
export function getTodayPuzzle(): DailyPuzzle | undefined {
  const today = getTodayDateET();
  const exact = schedule.find((p) => p.date === today);
  if (exact) return exact;

  if (schedule.length === 0) return undefined;

  const epoch = new Date(schedule[0].date + "T00:00:00-05:00").getTime();
  const todayMs = new Date(today + "T00:00:00-05:00").getTime();
  const daysSinceStart = Math.floor((todayMs - epoch) / (1000 * 60 * 60 * 24));
  const idx =
    ((daysSinceStart % schedule.length) + schedule.length) % schedule.length;

  return { ...schedule[idx], date: today };
}

/**
 * Get the puzzle for a specific date (YYYY-MM-DD).
 */
export function getPuzzleByDate(date: string): DailyPuzzle | undefined {
  return schedule.find((p) => p.date === date);
}

/**
 * Check if a given date has a scheduled puzzle.
 */
export function hasScheduledPuzzle(date: string): boolean {
  return schedule.some((p) => p.date === date);
}
