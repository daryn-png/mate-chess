import { getSupabaseClient } from './supabase';
import type { GameRecord, UserProfile } from '@/types';

// ─── Profile ──────────────────────────────────────────────

export async function getOrCreateProfile(userId: string, email: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();

  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (existing) return existing as UserProfile;

  // Create new profile
  const username = email.split('@')[0];
  const { data: created, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      username,
      rating: 1200,
      games_played: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      avg_accuracy: 0,
      xp: 0,
      level: 1,
    })
    .select()
    .single();

  if (error) { console.error('createProfile error:', error); return null; }
  return created as UserProfile;
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data as UserProfile;
}

// ─── Games ────────────────────────────────────────────────

export async function saveGame(game: Omit<GameRecord, 'id' | 'played_at'>): Promise<string | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('games')
    .insert(game)
    .select('id')
    .single();
  if (error) { console.error('saveGame error:', error); return null; }

  // Update profile stats
  await updateProfileStats(game.user_id, game.result, game.accuracy);

  return data.id;
}

export async function fetchGameHistory(userId: string, limit = 10): Promise<GameRecord[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return data as GameRecord[];
}

// ─── Profile stats update ─────────────────────────────────

async function updateProfileStats(
  userId: string,
  result: 'win' | 'loss' | 'draw',
  accuracy: number
) {
  const supabase = getSupabaseClient();
  const profile = await fetchProfile(userId);
  if (!profile) return;

  const newGames = profile.games_played + 1;
  const newWins = profile.wins + (result === 'win' ? 1 : 0);
  const newLosses = profile.losses + (result === 'loss' ? 1 : 0);
  const newDraws = profile.draws + (result === 'draw' ? 1 : 0);
  const newAvgAccuracy = Math.round(
    (profile.avg_accuracy * profile.games_played + accuracy) / newGames
  );

  // XP rewards
  const xpGain = result === 'win' ? 100 : result === 'draw' ? 50 : 20;
  const newXp = profile.xp + xpGain;
  const newLevel = Math.floor(newXp / 1000) + 1;

  // Simple rating adjustment
  const ratingDelta = result === 'win' ? 25 : result === 'draw' ? 5 : -20;
  const newRating = Math.max(800, profile.rating + ratingDelta);

  await supabase
    .from('profiles')
    .update({
      games_played: newGames,
      wins: newWins,
      losses: newLosses,
      draws: newDraws,
      avg_accuracy: newAvgAccuracy,
      xp: newXp,
      level: newLevel,
      rating: newRating,
    })
    .eq('id', userId);
}
