import coursesData from "@/data/courses.json";
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
