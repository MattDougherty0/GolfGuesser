// ── Course ──────────────────────────────────────────────

export interface CourseLocation {
  city: string;
  state: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface CourseDetails {
  type: "public" | "private" | "resort" | "municipal";
  architect: string;
  yearOpened: number;
  par: number;
  yardage: number;
  courseRating: number | null;
}

export interface CourseClues {
  region: string;
  typeHint: string;
  architectHint: string;
  tournamentHint: string;
  didYouKnow: string;
  /** Optional – PGA Tour courses only. */
  mostRecentWinnerHint?: string;
  /** Optional – PGA Tour courses only. */
  mostWinsHint?: string;
}

export interface RevealVideo {
  label: string;
  url: string;
  year?: number;
}

export interface CourseReveal {
  notableTournaments: string[];
  famousMoments: string[];
  signatureHole: string;
  description: string;
  /** Optional – PGA Tour courses with iconic moment links. */
  videos?: RevealVideo[];
}

export interface CourseImages {
  aerialTight: string;
  aerialMedium: string;
  aerialWide: string;
}

export interface Course {
  id: string;
  name: string;
  location: CourseLocation;
  details: CourseDetails;
  clues: CourseClues;
  reveal: CourseReveal;
  images: CourseImages;
}

// ── Daily Puzzle ────────────────────────────────────────

export interface PuzzleRound {
  courseId: string;
  imageKey: keyof CourseImages;
  difficulty: "easy" | "medium" | "hard";
}

export interface DailyPuzzle {
  date: string; // YYYY-MM-DD
  rounds: [PuzzleRound, PuzzleRound, PuzzleRound];
}

// ── Guess & Scoring ────────────────────────────────────

export interface GuessResult {
  courseId: string;
  nameGuess: string;
  nameCorrect: boolean;
  pinLat: number;
  pinLng: number;
  pinDistance: number; // miles
  hintsUsed: number;
  hintPenalty: number;
  timeSeconds: number;
  score: number;
}

export interface RoundResult {
  courseId: string;
  nameGuess?: string;
  nameCorrect: boolean;
  pinLat?: number;
  pinLng?: number;
  pinDistance: number;
  hintsUsed: number;
  hintPenalty?: number;
  timeSeconds: number;
  score: number;
}

// ── Player State (localStorage) ────────────────────────

export interface TodayResults {
  completed: boolean;
  rounds: RoundResult[];
  totalScore: number;
  /** lastPlayedDate before we started today (for streak increment when finishing) */
  _streakBaseDate?: string | null;
}

export interface PlayerState {
  currentStreak: number;
  longestStreak: number;
  gamesPlayed: number;
  totalScore: number;
  averageScore: number;
  lastPlayedDate: string | null; // YYYY-MM-DD
  todayResults: TodayResults | null;
  history: Record<string, TodayResults>; // keyed by date
}
