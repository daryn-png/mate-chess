'use client';

import { useRouter } from 'next/navigation';
import { useGameStore } from '@/store/gameStore';
import { analyzeGame } from '@/lib/analysis';

interface GameOverModalProps {
  onNewGame: () => void;
  onAnalyze: () => void;
}

export default function GameOverModal({ onNewGame, onAnalyze }: GameOverModalProps) {
  const { gameResult, moveHistory, whiteTime, resetGame } = useGameStore();
  const router = useRouter();

  if (!gameResult) return null;

  const icons = { win: '♔', loss: '♚', draw: '½' };
  const titles = { win: 'You Win!', loss: 'Checkmate', draw: 'Draw' };
  const subtitles = {
    win: 'Excellent play — you delivered checkmate!',
    loss: 'The AI checkmated you. Study the position and try again.',
    draw: 'A hard-fought draw. Close game!',
  };

  const timeUsed = Math.max(0, 600 - whiteTime);
  const analysis = analyzeGame(moveHistory.map(m => m.san).join(' '));

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.75)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(4px)', padding: 16,
    }}>
      <div style={{
        background: 'var(--bg-2)', border: '1px solid var(--border-2)',
        borderRadius: 20, padding: '32px 28px', maxWidth: 380, width: '100%',
        textAlign: 'center', animation: 'fade-in .3s ease',
      }}>
        <div style={{ fontSize: 52, marginBottom: 14, lineHeight: 1 }}>
          {icons[gameResult]}
        </div>
        <h2 style={{ fontFamily: 'var(--font-instrument)', fontSize: 30, marginBottom: 8, color: 'var(--text)' }}>
          {titles[gameResult]}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-2)', marginBottom: 24, lineHeight: 1.5 }}>
          {subtitles[gameResult]}
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 24 }}>
          {[
            { label: 'Moves', value: moveHistory.length, color: 'var(--accent)' },
            { label: 'Accuracy', value: `${analysis.accuracy}%`, color: 'var(--green)' },
            { label: 'Time', value: `${timeUsed}s`, color: 'var(--blue)' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 8px' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 18, fontWeight: 500, marginBottom: 3, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onAnalyze}
            style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid var(--border-2)', background: 'transparent', color: 'var(--text-2)', fontSize: 13, fontWeight: 600, letterSpacing: '.3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}
          >
            ⚡ Analyze
          </button>
          <button
            onClick={() => { resetGame(); onNewGame(); }}
            style={{ flex: 1, padding: '12px', borderRadius: 10, background: 'var(--accent)', color: 'var(--bg)', border: 'none', fontSize: 13, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
