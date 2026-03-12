import coursesData from "@/data/courses.json";
import decoyNames from "@/data/course-names-decoys.json";
import type { Course } from "./types";

const courses: Course[] = coursesData as Course[];

/** Get all courses in the pool. */
export function getAllCourses(): Course[] {
  return courses;
}

/** Get a single course by its slug ID. Returns undefined if not found. */
export function getCourseById(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

/**
 * Search courses by name for autocomplete.
 * Case-insensitive partial match. Returns all matches.
 */
export function searchCourses(query: string): Course[] {
  if (query.length < 2) return [];
  const lower = query.toLowerCase();
  return courses.filter((c) => c.name.toLowerCase().includes(lower));
}

export const MAX_SUGGESTIONS = 30;

export type SearchResult = { id: string; name: string } | { id: null; name: string };

/**
 * Search playable courses and decoy names for autocomplete.
 * Playable matches first, then decoys. Capped at MAX_SUGGESTIONS total.
 * Requires min 3 characters.
 */
const playableNamesLower = new Set(
  (coursesData as Course[]).map((c) => c.name.toLowerCase())
);

export function searchCoursesWithDecoys(query: string): SearchResult[] {
  if (query.length < 3) return [];
  const lower = query.toLowerCase();
  const playable = courses
    .filter((c) => c.name.toLowerCase().includes(lower))
    .map((c) => ({ id: c.id, name: c.name } as SearchResult));
  const decoys = (decoyNames as string[])
    .filter(
      (n) =>
        n.toLowerCase().includes(lower) &&
        !playableNamesLower.has(n.toLowerCase())
    )
    .map((n) => ({ id: null, name: n } as SearchResult));
  const combined = [...playable, ...decoys];
  return combined.slice(0, MAX_SUGGESTIONS);
}
