import type { PlayerState, RoundResult, TodayResults } from "./types";
import { getTodayDateET } from "./daily";
import { getLocalPlayerId, submitDailyScore } from "./db";

const STORAGE_KEY = "courseiq-player-state";

function defaultState(): PlayerState {
  return {
    currentStreak: 0,
    longestStreak: 0,
    gamesPlayed: 0,
    totalScore: 0,
    averageScore: 0,
    lastPlayedDate: null,
    todayResults: null,
    history: {},
  };
}

/** Read the full player state from localStorage. */
export function getPlayerState(): PlayerState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return JSON.parse(raw) as PlayerState;
  } catch {
    return defaultState();
  }
}

/** Write the full player state to localStorage. */
export function setPlayerState(state: PlayerState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Get today's results, or null if not started. */
export function getTodayResults(): TodayResults | null {
  const state = getPlayerState();
  const today = getTodayDateET();

  // If todayResults exists but is from a previous day, clear it
  if (state.lastPlayedDate !== today) {
    return null;
  }

  return state.todayResults;
}

/** Check if today's puzzle has been completed (all 3 rounds). */
export function isTodayCompleted(): boolean {
  const results = getTodayResults();
  return results?.completed ?? false;
}

/** Save a round result. Appends to today's rounds and updates totals. */
export function saveRoundResult(result: RoundResult): void {
  const state = getPlayerState();
  const today = getTodayDateET();

  // Initialize todayResults if needed or if it's a new day
  if (!state.todayResults || state.lastPlayedDate !== today) {
    state.todayResults = {
      completed: false,
      rounds: [],
      totalScore: 0,
      _streakBaseDate: state.lastPlayedDate, // capture before overwrite (for streak increment)
    };
    state.lastPlayedDate = today;
  }

  state.todayResults.rounds.push(result);
  state.todayResults.totalScore += result.score;

  // Mark completed after 3 rounds
  if (state.todayResults.rounds.length >= 3) {
    state.todayResults.completed = true;
    finalizeDailyResults(state, today);
    submitToLeaderboard(state.todayResults, today);
  }

  setPlayerState(state);
}

async function submitToLeaderboard(results: TodayResults, date: string) {
  const playerId = getLocalPlayerId();
  if (!playerId) return;

  await submitDailyScore({
    playerId,
    date,
    roundScores: results.rounds.map((r) => r.score),
    totalScore: results.totalScore,
    hintsUsed: results.rounds.reduce((sum, r) => sum + r.hintsUsed, 0),
    timeSeconds: results.rounds.reduce((sum, r) => sum + r.timeSeconds, 0),
  });
}

/**
 * Called when all 3 rounds are done.
 * Updates streak, games played, averages, and history.
 */
function finalizeDailyResults(state: PlayerState, today: string): void {
  const previousLastPlayedDate = state.todayResults?._streakBaseDate ?? null;
  updateStreak(state, today, previousLastPlayedDate);

  // Update totals
  state.gamesPlayed += 1;
  state.totalScore += state.todayResults!.totalScore;
  state.averageScore = Math.round(state.totalScore / state.gamesPlayed);

  // Save to history
  state.history[today] = { ...state.todayResults! };
}

/**
 * Update the streak based on consecutive days played.
 * Uses previousLastPlayedDate (before today overwrote it) to detect yesterday.
 */
function updateStreak(
  state: PlayerState,
  today: string,
  previousLastPlayedDate: string | null
): void {
  if (!previousLastPlayedDate) {
    // First time playing
    state.currentStreak = 1;
  } else {
    const yesterday = getYesterdayDateET(today);
    if (previousLastPlayedDate === yesterday) {
      state.currentStreak += 1;
    } else if (previousLastPlayedDate === today) {
      // Already played today earlier (e.g. resumed and finished) — don't double-count
    } else {
      // Gap — reset streak
      state.currentStreak = 1;
    }
  }

  if (state.currentStreak > state.longestStreak) {
    state.longestStreak = state.currentStreak;
  }
}

/** Get yesterday's date string relative to a given YYYY-MM-DD date. */
function getYesterdayDateET(today: string): string {
  const date = new Date(today + "T12:00:00-05:00"); // noon ET to avoid DST edge cases
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}
