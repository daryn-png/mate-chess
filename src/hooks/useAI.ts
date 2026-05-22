'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { getBestMove, getEvaluation } from '@/lib/engine';

export function useAI() {
  const {
    game, gameOver, aiThinking, difficulty,
    setAIMove, setAiThinking, setGameOver, setEvaluation,
    moveHistory,
  } = useGameStore();

  const thinkingRef = useRef(false);

  useEffect(() => {
    // Only trigger when it's black's turn (AI) and game is active
    if (game.turn() !== 'b') return;
    if (gameOver || thinkingRef.current) return;
    if (game.game_over()) return;

    thinkingRef.current = true;
    setAiThinking(true);

    // Delay for natural feel
    const delay = difficulty === 'master' ? 1200 : difficulty === 'expert' ? 800 : 400 + Math.random() * 400;

    const timer = setTimeout(() => {
      const fen = game.fen();
      const moveStr = getBestMove(fen, difficulty);

      if (!moveStr) {
        thinkingRef.current = false;
        setAiThinking(false);
        return;
      }

      const [from, to] = moveStr.split(':');
      setAIMove(from, to);

      // Update evaluation after move
      const eval_ = getEvaluation(game.fen());
      setEvaluation(eval_);

      // Check game state after AI move
      if (game.game_over()) {
        if (game.in_checkmate()) setGameOver('win'); // player wins if AI is mated
        else setGameOver('draw');
      }

      thinkingRef.current = false;
    }, delay);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveHistory.length, game.turn()]);

  // Check game state after player move
  useEffect(() => {
    if (game.turn() !== 'b') return; // just moved as white
    if (!game.game_over()) return;

    if (game.in_checkmate()) setGameOver('loss');
    else if (game.in_stalemate() || game.in_draw()) setGameOver('draw');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveHistory.length]);
}
