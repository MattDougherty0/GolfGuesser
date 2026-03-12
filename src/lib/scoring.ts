import { haversineDistance } from "./distance";

/** 300 if correct, 0 if wrong. */
export function calculateNameScore(correct: boolean): number {
  return correct ? 300 : 0;
}

/**
 * Pin accuracy (max 300).
 * Tiered scoring: closer = more points.
 */
export function calculatePinScore(distanceMiles: number): number {
  if (distanceMiles < 20) return 300;
  if (distanceMiles < 50) return 250;
  if (distanceMiles < 100) return 200;
  if (distanceMiles < 250) return 150;
  if (distanceMiles < 500) return 100;
  if (distanceMiles < 1000) return 50;
  return 0;
}

/**
 * Speed bonus (max 100).
 * 100 if answered within 15 seconds, linear decay to 0 at 90 seconds.
 */
export function calculateSpeedBonus(timeSeconds: number): number {
  if (timeSeconds <= 15) return 100;
  if (timeSeconds >= 90) return 0;
  return Math.round(100 * (1 - (timeSeconds - 15) / 75));
}

/**
 * Hint costs: Region(85), Type(45), Architect(20), Tournament(105), Fun Fact(45).
 * Deducted from a 300-point hint bonus pool.
 */
export const HINT_COSTS = [85, 45, 20, 105, 45];
export const HINT_POOL = 300;

/** Sum the costs of the first N hints (sequential fallback). */
export function calculateHintPenalty(hintsUsed: number): number {
  let total = 0;
  for (let i = 0; i < Math.min(hintsUsed, HINT_COSTS.length); i++) {
    total += HINT_COSTS[i];
  }
  return total;
}

/** Hint bonus = pool minus penalty (always >= 0). */
export function calculateHintBonus(hintPenalty: number): number {
  return Math.max(0, HINT_POOL - hintPenalty);
}

export function calculatePinDistance(
  guessLat: number,
  guessLng: number,
  courseLat: number,
  courseLng: number
): number {
  return haversineDistance(guessLat, guessLng, courseLat, courseLng);
}

/**
 * Round score = name(300) + pin(300) + speed(100) + hintBonus(300) = 1000 max.
 */
export function calculateRoundScore(params: {
  nameCorrect: boolean;
  pinDistanceMiles: number;
  timeSeconds: number;
  hintsUsed: number;
  hintPenalty?: number;
}): number {
  const name = calculateNameScore(params.nameCorrect);
  const pin = calculatePinScore(params.pinDistanceMiles);
  const speed = calculateSpeedBonus(params.timeSeconds);
  const penalty = params.hintPenalty ?? calculateHintPenalty(params.hintsUsed);
  const hintBonus = calculateHintBonus(penalty);

  return name + pin + speed + hintBonus;
}
