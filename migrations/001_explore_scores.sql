-- Explore mode leaderboard: scores per set + count (5, 10, or all)
-- Run this in Supabase Dashboard → SQL Editor
CREATE TABLE IF NOT EXISTS explore_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  set_id TEXT NOT NULL,
  count TEXT NOT NULL CHECK (count IN ('5', '10', 'all')),
  total_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_explore_scores_set_count ON explore_scores(set_id, count);
CREATE INDEX IF NOT EXISTS idx_explore_scores_leaderboard ON explore_scores(set_id, count, total_score DESC);

-- RLS: allow read for all, insert for authenticated (we use anon for players)
ALTER TABLE explore_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read explore_scores" ON explore_scores FOR SELECT USING (true);
CREATE POLICY "Allow insert explore_scores" ON explore_scores FOR INSERT WITH CHECK (true);
