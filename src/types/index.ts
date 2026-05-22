export type Difficulty = 'novice' | 'club' | 'expert' | 'master';

export interface GameRecord {
  id: string;
  user_id: string;
  fen_final: string;
  pgn: string;
  result: 'win' | 'loss' | 'draw';
  difficulty: Difficulty;
  moves_count: number;
  accuracy: number;
  duration_seconds: number;
  played_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  rating: number;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
  avg_accuracy: number;
  xp: number;
  level: number;
  favorite_opening: string | null;
  playstyle: string | null;
  created_at: string;
}

export interface MoveQuality {
  san: string;
  quality: 'brilliant' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
  eval_before: number;
  eval_after: number;
}

export interface GameAnalysis {
  accuracy: number;
  brilliant: number;
  good: number;
  inaccuracy: number;
  mistakes: number;
  blunders: number;
  moves: MoveQuality[];
  summary: string;
}
