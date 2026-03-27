/** StatMuse Golf Lab answer shapes (ontology demo). */

export type AnswerShape =
  | "venue_entity"
  | "venue_record"
  | "player_at_venue"
  | "event_at_venue"
  | "query_rescue"
  | "record_book";

export interface AnswerCard {
  id: string;
  shape: AnswerShape;
  /** Short question line */
  title: string;
  /** Answer body — short paragraphs or bullets */
  lines: string[];
  /** Human-readable source name */
  sourceLabel: string;
  /** Scope / coverage (season, tournament, venue) */
  scope: string;
  /** Official page where a reader can verify, when available */
  primarySourceUrl?: string;
  /** Optional course page association */
  courseId?: CourseMuseCourseId;
}

export type CourseMuseCourseId =
  | "pinehurst-no-2"
  | "augusta-national-golf-club"
  | "bethpage-black"
  | "tpc-sawgrass-stadium-course"
  | "oakmont-country-club";

export interface CoursePageContent {
  courseId: CourseMuseCourseId;
  /** One-line identity (lab copy; may differ slightly from game JSON) */
  identityLine: string;
  /** Single paragraph */
  whyItMatters: string;
  /** Card ids shown on this course page (subset of answer-cards) */
  cardIds: string[];
  /** Example questions for chips */
  queryChips: string[];
}

export type SearchAction =
  | { type: "scroll"; cardId: string }
  | { type: "course"; courseId: CourseMuseCourseId; hash?: string };

export interface CuratedQuery {
  id: string;
  label: string;
  shape: AnswerShape;
  keywords: string[];
  action: SearchAction;
}

export interface CitationGap {
  cardId: string;
  reason: string;
}
