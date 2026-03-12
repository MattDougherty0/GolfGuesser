import type { PuzzleRound } from "./types";

/**
 * 2025 PGA Tour schedule - lower 48 venues only.
 * Excludes Hawaii, Mexico, Puerto Rico, Canada, Scotland, Northern Ireland, Dominican Republic.
 */
export const PGA_TOUR_2025_COURSE_IDS: string[] = [
  "pga-west-stadium-course",
  "torrey-pines-south-course",
  "pebble-beach-golf-links",
  "spyglass-hill",
  "tpc-scottsdale-stadium-course",
  "pga-national-champion-course",
  "bay-hill-club-and-lodge",
  "tpc-sawgrass-stadium-course",
  "innisbrook-copperhead-course",
  "memorial-park-golf-course",
  "tpc-san-antonio-oaks-course",
  "augusta-national-golf-club",
  "harbour-town-golf-links",
  "tpc-louisiana",
  "tpc-craig-ranch",
  "philadelphia-cricket-club",
  "dunes-golf-and-beach-club",
  "quail-hollow-club",
  "colonial-country-club",
  "muirfield-village-golf-club",
  "oakmont-country-club",
  "tpc-river-highlands",
  "detroit-golf-club",
  "tpc-deere-run",
  "hurstbourne-country-club",
  "tahoe-mountain-club",
  "tpc-twin-cities",
  "sedgefield-country-club",
  "tpc-southwind",
  "caves-valley-golf-club",
  "east-lake-golf-club",
];

export const EXPLORE_SETS: Record<string, string[]> = {
  pga2025: PGA_TOUR_2025_COURSE_IDS,
};

/** Fisher-Yates shuffle. */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Build an explore puzzle from a set ID and count.
 * Shuffles courses and takes up to `count` (or all if count >= list length).
 */
export function buildExplorePuzzle(
  setId: string,
  count: number
): { rounds: PuzzleRound[] } | null {
  const courseIds = EXPLORE_SETS[setId];
  if (!courseIds || courseIds.length === 0) return null;

  const shuffled = shuffle(courseIds);
  const take = Math.min(count, shuffled.length);
  const selected = shuffled.slice(0, take);

  const rounds: PuzzleRound[] = selected.map((courseId) => ({
    courseId,
    imageKey: "aerialTight",
    difficulty: "medium",
  }));

  return { rounds };
}

export function getExploreSetCount(setId: string): number {
  return EXPLORE_SETS[setId]?.length ?? 0;
}
