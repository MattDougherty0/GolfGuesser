import type { CourseMuseCourseId } from "./types";

/** Allowlisted CourseMuse entity slugs (match `courses.json` ids). */
export const COURSE_MUSE_COURSE_IDS: readonly CourseMuseCourseId[] = [
  "pinehurst-no-2",
  "augusta-national-golf-club",
  "bethpage-black",
  "tpc-sawgrass-stadium-course",
  "oakmont-country-club",
] as const;

export const COURSE_MUSE_DISPLAY_NAME: Record<CourseMuseCourseId, string> = {
  "pinehurst-no-2": "Pinehurst No. 2",
  "augusta-national-golf-club": "Augusta National",
  "bethpage-black": "Bethpage Black",
  "tpc-sawgrass-stadium-course": "TPC Sawgrass",
  "oakmont-country-club": "Oakmont CC",
};

export function isCourseMuseCourseId(id: string): id is CourseMuseCourseId {
  return (COURSE_MUSE_COURSE_IDS as readonly string[]).includes(id);
}
