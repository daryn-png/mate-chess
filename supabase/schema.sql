-- MÁTĒ Chess Platform — Supabase Database Schema
-- Run this in the Supabase SQL Editor

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with game stats

CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT NOT NULL,
  rating          INTEGER NOT NULL DEFAULT 1200,
  games_played    INTEGER NOT NULL DEFAULT 0,
  wins            INTEGER NOT NULL DEFAULT 0,
  losses          INTEGER NOT NULL DEFAULT 0,
  draws           INTEGER NOT NULL DEFAULT 0,
  avg_accuracy    INTEGER NOT NULL DEFAULT 0,
  xp              INTEGER NOT NULL DEFAULT 0,
  level           INTEGER NOT NULL DEFAULT 1,
  favorite_opening TEXT,
  playstyle       TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies: users can read all profiles, but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);


-- ─── Games ───────────────────────────────────────────────────────────────────

CREATE TYPE game_result AS ENUM ('win', 'loss', 'draw');
CREATE TYPE game_difficulty AS ENUM ('novice', 'club', 'expert', 'master');

CREATE TABLE IF NOT EXISTS public.games (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fen_final        TEXT NOT NULL,
  pgn              TEXT NOT NULL DEFAULT '',
  result           game_result NOT NULL,
  difficulty       game_difficulty NOT NULL DEFAULT 'club',
  moves_count      INTEGER NOT NULL DEFAULT 0,
  accuracy         INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  played_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own games"
  ON public.games FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own games"
  ON public.games FOR INSERT WITH CHECK (auth.uid() = user_id);


-- ─── Indexes ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS games_user_id_idx ON public.games (user_id);
CREATE INDEX IF NOT EXISTS games_played_at_idx ON public.games (played_at DESC);


-- ─── Auto-create profile on signup ───────────────────────────────────────────
-- This function runs automatically when a new user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── Seed demo data (optional) ───────────────────────────────────────────────
-- Only run if you want demo data for testing. Replace the UUID with a real user ID.
-- INSERT INTO public.games (user_id, fen_final, pgn, result, difficulty, moves_count, accuracy, duration_seconds)
-- VALUES
--   ('your-user-id-here', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', '1. e4 e5 2. Nf3', 'win', 'club', 24, 78, 240),
--   ('your-user-id-here', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', '1. d4 d5 2. c4', 'loss', 'expert', 38, 65, 420);
