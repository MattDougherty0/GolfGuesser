import type { PuzzleRound } from "./types";
import { getAllCourses } from "./courses";
import { REGIONS } from "./regions";

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

/**
 * Tiger Woods win venues (lower 48) - from 1994 U.S. Amateur through 2019.
 * One entry per unique venue. Includes US Amateur (3) + PGA Tour (82) venues in continental US.
 */
export const TIGER_WINS_COURSE_IDS: string[] = [
  "tpc-sawgrass-stadium-course",
  "newport-country-club",
  "pumpkin-ridge-witch-hollow",
  "tpc-summerlin",
  "walt-disney-world-magnolia",
  "pebble-beach-golf-links",
  "bay-hill-club-and-lodge",
  "muirfield-village-golf-club",
  "medinah-country-club",
  "firestone-country-club",
  "east-lake-golf-club",
  "trump-national-doral-blue-monster",
  "augusta-national-golf-club",
  "torrey-pines-south-course",
  "bethpage-black",
  "congressional-country-club",
  "warwick-hills-golf-and-country-club",
  "capital-city-club-crabapple",
  "omni-la-costa-resort-champions",
  "cog-hill-dubsdread",
  "southern-hills-country-club",
  "valhalla-golf-club",
  "quail-hollow-club",
  "the-gallery-golf-club",
  "tpc-harding-park",
  "sherwood-country-club",
  "cordevalle",
  "aronimink",
  "tpc-boston",
  "tpc-sugarloaf",
];

/** Erie, PA area courses - its own Explore set. */
export const ERIE_COURSE_IDS: string[] = [
  "lake-shore-country-club",
  "elk-valley-golf-course",
  "lawrence-park-golf-club",
  "lake-view-country-club",
  "the-kahkwa-club",
  "over-lake-golf-course",
  "downing-golf-course",
  "whispering-woods-golf-club",
  "the-ridge-at-crab-apple",
  "mound-grove-golf-club",
  "scenic-heights-golf-course",
  "beechwood-golf-club",
  "green-meadows-golf-course",
  "culbertson-hills-golf-club",
  "riverside-golf",
  "peakn-peak-upper-course",
  "north-hills-golf-course",
  "union-city-golf-course",
  "country-club-of-meadville",
];

/** Build region sets from course data. */
function buildRegionSets(): Record<string, string[]> {
  const courses = getAllCourses();
  const sets: Record<string, string[]> = {};
  for (const region of REGIONS) {
    sets[`region-${region}`] = courses
      .filter((c) => c.location.region === region)
      .map((c) => c.id);
  }
  return sets;
}

export const EXPLORE_SETS: Record<string, string[]> = {
  pga2025: PGA_TOUR_2025_COURSE_IDS,
  tiger: TIGER_WINS_COURSE_IDS,
  erie: ERIE_COURSE_IDS,
  ...buildRegionSets(),
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

  const imageKey = "aerialMedium";
  const rounds: PuzzleRound[] = selected.map((courseId) => ({
    courseId,
    imageKey,
    difficulty: "medium",
  }));

  return { rounds };
}

export function getExploreSetCount(setId: string): number {
  return EXPLORE_SETS[setId]?.length ?? 0;
}
