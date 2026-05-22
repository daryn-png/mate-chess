'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';
import { toast } from 'sonner';

export function useTimer() {
  const { gameOver, whiteTime, tickTimer, setGameOver } = useGameStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (gameOver) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameOver, tickTimer]);

  // White timeout
  useEffect(() => {
    if (whiteTime === 0 && !gameOver) {
      setGameOver('loss');
      toast.error('Time out! You lost on time.');
    }
  }, [whiteTime, gameOver, setGameOver]);
}
