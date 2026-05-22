'use client';

import { useGameStore } from '@/store/gameStore';

interface PlayerBarProps {
  side: 'top' | 'bottom'; // top = AI (black), bottom = player (white)
  username?: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function PlayerBar({ side, username }: PlayerBarProps) {
  const { game, whiteTime, blackTime, aiThinking, gameOver } = useGameStore();

  const isAI = side === 'top';
  const isActive = isAI ? (game.turn() === 'b' && !gameOver) : (game.turn() === 'w' && !gameOver);
  const time = isAI ? blackTime : whiteTime;
  const isDanger = !isAI && whiteTime < 30 && !gameOver;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 14px',
      background: isActive ? 'rgba(139,105,20,.06)' : 'var(--bg-2)',
      border: `1px solid ${isActive ? 'var(--accent-3)' : 'var(--border)'}`,
      borderRadius: 12,
      transition: 'all .2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: isAI ? 'rgba(167,139,250,.12)' : 'rgba(232,213,163,.1)',
          border: `1px solid ${isAI ? 'rgba(167,139,250,.2)' : 'rgba(232,213,163,.15)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 700,
          color: isAI ? 'var(--purple)' : 'var(--accent)',
          fontFamily: 'var(--font-instrument)',
        }}>
          {isAI ? '♟' : (username?.[0]?.toUpperCase() ?? 'Y')}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            {isAI ? 'Stockfish' : (username ?? 'You')}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-dm-mono)' }}>
            {isAI ? 'AI Opponent' : 'Rating 1200'}
          </div>
        </div>
      </div>

      {/* AI thinking indicator */}
      {isAI && aiThinking && (
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginRight: 8 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: '50%', background: 'var(--purple)',
              animation: `bounce-dot .6s ${i * 0.15}s infinite`,
            }} />
          ))}
        </div>
      )}

      {/* Timer */}
      <div style={{
        fontFamily: 'var(--font-dm-mono)',
        fontSize: 17,
        fontWeight: 500,
        padding: '6px 12px',
        background: isActive ? 'var(--bg-3)' : 'var(--bg-3)',
        border: `1px solid ${isDanger ? 'var(--red)' : isActive ? 'var(--accent-3)' : 'var(--border)'}`,
        borderRadius: 8,
        color: isDanger ? 'var(--red)' : isActive ? 'var(--accent)' : 'var(--text-2)',
        minWidth: 68, textAlign: 'center',
        animation: isDanger ? 'timer-flash .5s infinite' : undefined,
        transition: 'all .2s',
      }}>
        {formatTime(time)}
      </div>
    </div>
  );
}
