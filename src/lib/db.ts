import { supabase } from "./supabase";

// ── Player (anonymous auth) ──

export interface Player {
  id: string;
  display_name: string;
}

const PLAYER_KEY = "courseiq-player-id";
const SKIPPED_KEY = "courseiq-skipped-login";

export function getLocalPlayerId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PLAYER_KEY);
}

export function setLocalPlayerId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PLAYER_KEY, id);
}

export function hasSkippedLogin(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SKIPPED_KEY) === "true";
}

export function setSkippedLogin(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SKIPPED_KEY, "true");
}

export async function createPlayer(displayName: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .insert({ display_name: displayName.trim() })
    .select()
    .single();

  if (error || !data) return null;
  setLocalPlayerId(data.id);
  return data as Player;
}

export async function getPlayer(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .select("id, display_name")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Player;
}

// ── Daily Scores ──

export interface DailyScore {
  id: string;
  player_id: string;
  date: string;
  round_scores: number[];
  total_score: number;
  hints_used: number;
  time_seconds: number;
  created_at: string;
}

export async function submitDailyScore(params: {
  playerId: string;
  date: string;
  roundScores: number[];
  totalScore: number;
  hintsUsed: number;
  timeSeconds: number;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("daily_scores").insert({
    player_id: params.playerId,
    date: params.date,
    round_scores: params.roundScores,
    total_score: params.totalScore,
    hints_used: params.hintsUsed,
    time_seconds: params.timeSeconds,
  });

  if (error) {
    if (error.code === "23505") {
      return { success: false, error: "Already submitted today" };
    }
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function getPlayerScoreForDate(
  playerId: string,
  date: string
): Promise<DailyScore | null> {
  const { data } = await supabase
    .from("daily_scores")
    .select("*")
    .eq("player_id", playerId)
    .eq("date", date)
    .single();

  return (data as DailyScore) ?? null;
}

// ── Leaderboard ──

export interface LeaderboardEntry {
  rank: number;
  player_id: string;
  display_name: string;
  total_score: number;
}

interface ScoreRow {
  player_id: string;
  total_score: number;
  players: { display_name: string };
}

function extractName(row: ScoreRow): string {
  return row.players.display_name;
}

export async function getDailyLeaderboard(
  date: string,
  limit = 50
): Promise<LeaderboardEntry[]> {
  const { data } = await supabase
    .from("daily_scores")
    .select("player_id, total_score, players!inner(display_name)")
    .eq("date", date)
    .order("total_score", { ascending: false })
    .limit(limit);

  if (!data) return [];
  return (data as unknown as ScoreRow[]).map((row, i) => ({
    rank: i + 1,
    player_id: row.player_id,
    display_name: extractName(row),
    total_score: row.total_score,
  }));
}

export async function getWeeklyLeaderboard(
  dates: string[],
  limit = 50
): Promise<LeaderboardEntry[]> {
  const { data } = await supabase
    .from("daily_scores")
    .select("player_id, total_score, players!inner(display_name)")
    .in("date", dates)
    .order("total_score", { ascending: false });

  if (!data) return [];

  const totals = new Map<string, { display_name: string; total: number }>();
  for (const row of data as unknown as ScoreRow[]) {
    const pid = row.player_id;
    const name = extractName(row);
    const existing = totals.get(pid);
    if (existing) {
      existing.total += row.total_score;
    } else {
      totals.set(pid, { display_name: name, total: row.total_score });
    }
  }

  return [...totals.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, limit)
    .map(([pid, val], i) => ({
      rank: i + 1,
      player_id: pid,
      display_name: val.display_name,
      total_score: val.total,
    }));
}

export async function getAllTimeLeaderboard(
  limit = 50
): Promise<LeaderboardEntry[]> {
  const { data } = await supabase
    .from("daily_scores")
    .select("player_id, total_score, players!inner(display_name)");

  if (!data) return [];

  const totals = new Map<string, { display_name: string; total: number }>();
  for (const row of data as unknown as ScoreRow[]) {
    const pid = row.player_id;
    const name = extractName(row);
    const existing = totals.get(pid);
    if (existing) {
      existing.total += row.total_score;
    } else {
      totals.set(pid, { display_name: name, total: row.total_score });
    }
  }

  return [...totals.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, limit)
    .map(([pid, val], i) => ({
      rank: i + 1,
      player_id: pid,
      display_name: val.display_name,
      total_score: val.total,
    }));
}
