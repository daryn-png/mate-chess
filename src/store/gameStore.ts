import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { Difficulty, MoveQuality } from '@/types';

interface MoveRecord {
  san: string;
  from: string;
  to: string;
  color: 'w' | 'b';
  ply: number;
}

interface GameStore {
  // Game state
  game: Chess;
  fen: string;
  pgn: string;
  selectedSquare: string | null;
  legalMoves: string[];
  lastFrom: string | null;
  lastTo: string | null;
  flipped: boolean;

  // Meta state
  gameOver: boolean;
  gameResult: 'win' | 'loss' | 'draw' | null;
  aiThinking: boolean;
  difficulty: Difficulty;
  soundEnabled: boolean;
  focusMode: boolean;

  // Timer
  whiteTime: number;
  blackTime: number;

  // History
  moveHistory: MoveRecord[];
  evaluation: number;

  // Move quality analysis
  moveQualities: MoveQuality[];

  // Actions
  selectSquare: (sq: string) => void;
  clearSelection: () => void;
  makeMove: (from: string, to: string) => boolean;
  setAIMove: (from: string, to: string, promotion?: string) => void;
  setDifficulty: (d: Difficulty) => void;
  flipBoard: () => void;
  undoMove: () => void;
  resetGame: () => void;
  setAiThinking: (v: boolean) => void;
  setGameOver: (result: 'win' | 'loss' | 'draw') => void;
  tickTimer: () => void;
  toggleSound: () => void;
  toggleFocusMode: () => void;
  setEvaluation: (v: number) => void;
}

function freshGame() {
  return new Chess();
}

export const useGameStore = create<GameStore>((set, get) => ({
  game: freshGame(),
  fen: new Chess().fen(),
  pgn: '',
  selectedSquare: null,
  legalMoves: [],
  lastFrom: null,
  lastTo: null,
  flipped: false,
  gameOver: false,
  gameResult: null,
  aiThinking: false,
  difficulty: 'club',
  soundEnabled: true,
  focusMode: false,
  whiteTime: 600,
  blackTime: 600,
  moveHistory: [],
  evaluation: 0,
  moveQualities: [],

  selectSquare: (sq) => {
    const { game, selectedSquare, legalMoves, gameOver, aiThinking } = get();
    if (gameOver || aiThinking) return;
    if (game.turn() === 'b') return; // player is always white

    const piece = game.get(sq as any);

    // If clicking a legal move destination
    if (selectedSquare && legalMoves.includes(sq)) {
      get().makeMove(selectedSquare, sq);
      return;
    }

    // If clicking own piece
    if (piece && piece.color === game.turn()) {
      const moves = game.moves({ square: sq as any, verbose: true });
      set({
        selectedSquare: sq,
        legalMoves: moves.map((m: any) => m.to),
      });
      return;
    }

    // Deselect
    set({ selectedSquare: null, legalMoves: [] });
  },

  clearSelection: () => set({ selectedSquare: null, legalMoves: [] }),

  makeMove: (from, to) => {
    const { game } = get();
    // Auto-promote to queen
    const piece = game.get(from as any);
    const isPromotion =
      piece?.type === 'p' &&
      ((piece.color === 'w' && to[1] === '8') ||
        (piece.color === 'b' && to[1] === '1'));

    const move = game.move({
      from: from as any,
      to: to as any,
      promotion: isPromotion ? 'q' : undefined,
    });

    if (!move) return false;

    set((state) => ({
      fen: game.fen(),
      pgn: game.pgn(),
      lastFrom: from,
      lastTo: to,
      selectedSquare: null,
      legalMoves: [],
      moveHistory: [
        ...state.moveHistory,
        { san: move.san, from, to, color: move.color, ply: state.moveHistory.length },
      ],
    }));

    return true;
  },

  setAIMove: (from, to, promotion = 'q') => {
    const { game } = get();
    const move = game.move({ from: from as any, to: to as any, promotion: promotion as any });
    if (!move) return;

    set((state) => ({
      fen: game.fen(),
      pgn: game.pgn(),
      lastFrom: from,
      lastTo: to,
      aiThinking: false,
      moveHistory: [
        ...state.moveHistory,
        { san: move.san, from, to, color: move.color, ply: state.moveHistory.length },
      ],
    }));
  },

  setDifficulty: (d) => set({ difficulty: d }),
  flipBoard: () => set((s) => ({ flipped: !s.flipped })),

  undoMove: () => {
    const { game, moveHistory, gameOver } = get();
    if (gameOver || moveHistory.length < 2) return;
    game.undo(); // undo AI move
    game.undo(); // undo player move
    set({
      fen: game.fen(),
      pgn: game.pgn(),
      lastFrom: null,
      lastTo: null,
      moveHistory: moveHistory.slice(0, -2),
      gameOver: false,
      gameResult: null,
    });
  },

  resetGame: () => {
    const newGame = freshGame();
    set({
      game: newGame,
      fen: newGame.fen(),
      pgn: '',
      selectedSquare: null,
      legalMoves: [],
      lastFrom: null,
      lastTo: null,
      gameOver: false,
      gameResult: null,
      aiThinking: false,
      whiteTime: 600,
      blackTime: 600,
      moveHistory: [],
      evaluation: 0,
      moveQualities: [],
    });
  },

  setAiThinking: (v) => set({ aiThinking: v }),

  setGameOver: (result) => set({ gameOver: true, gameResult: result }),

  tickTimer: () =>
    set((state) => {
      if (state.gameOver) return state;
      if (state.game.turn() === 'w') {
        return { whiteTime: Math.max(0, state.whiteTime - 1) };
      } else {
        return { blackTime: Math.max(0, state.blackTime - 1) };
      }
    }),

  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
  setEvaluation: (v) => set({ evaluation: v }),
}));
