import { Chess } from 'chess.js';
import type { Difficulty } from '@/types';

// Piece values
const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
};

// Positional bonus tables (for white; flip for black)
const PAWN_TABLE = [
  0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5,  5, 10, 25, 25, 10,  5,  5,
  0,  0,  0, 20, 20,  0,  0,  0,
  5, -5,-10,  0,  0,-10, -5,  5,
  5, 10, 10,-20,-20, 10, 10,  5,
  0,  0,  0,  0,  0,  0,  0,  0,
];

function evaluateBoard(game: Chess): number {
  let score = 0;
  const board = game.board();

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f];
      if (!piece) continue;

      const val = PIECE_VALUES[piece.type] ?? 0;
      let positional = 0;

      if (piece.type === 'p') {
        const idx = piece.color === 'w' ? r * 8 + f : (7 - r) * 8 + f;
        positional = PAWN_TABLE[idx] ?? 0;
      }

      score += piece.color === 'w' ? val + positional : -(val + positional);
    }
  }

  return score;
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.game_over()) {
    if (game.in_checkmate()) return isMaximizing ? -99999 : 99999;
    if (game.in_draw() || game.in_stalemate()) return 0;
    return evaluateBoard(game);
  }

  const moves = game.moves({ verbose: true });

  if (isMaximizing) {
    let best = -Infinity;
    for (const move of moves) {
      game.move(move);
      best = Math.max(best, minimax(game, depth - 1, alpha, beta, false));
      game.undo();
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      game.move(move);
      best = Math.min(best, minimax(game, depth - 1, alpha, beta, true));
      game.undo();
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

const DEPTH_MAP: Record<Difficulty, number> = {
  novice: 1,
  club: 2,
  expert: 3,
  master: 4,
};

const RANDOMNESS_MAP: Record<Difficulty, number> = {
  novice: 0.8,
  club: 0.3,
  expert: 0.1,
  master: 0,
};

export function getBestMove(fen: string, difficulty: Difficulty): string | null {
  const game = new Chess(fen);
  if (game.game_over()) return null;

  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Novice: mostly random with occasional good moves
  if (difficulty === 'novice' && Math.random() < 0.6) {
    const randomMove = moves[Math.floor(Math.random() * moves.length)];
    return `${randomMove.from}:${randomMove.to}`;
  }

  const depth = DEPTH_MAP[difficulty];
  const randomness = RANDOMNESS_MAP[difficulty];

  const scoredMoves = moves.map((move) => {
    game.move(move);
    // AI plays black, so minimizing
    const score = minimax(game, depth - 1, -Infinity, Infinity, true);
    game.undo();
    // Add randomness noise to create varied play
    const noise = (Math.random() - 0.5) * 2 * randomness * 50;
    return { move, score: score + noise };
  });

  // Sort: black wants lowest score (most negative = best for black)
  scoredMoves.sort((a, b) => a.score - b.score);

  const best = scoredMoves[0].move;
  return `${best.from}:${best.to}`;
}

export function getEvaluation(fen: string): number {
  const game = new Chess(fen);
  return evaluateBoard(game) / 100; // in pawns
}
