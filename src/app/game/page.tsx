'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RotateCcw, Volume2, VolumeX, Flag, Maximize2, Minimize2, Undo2 } from 'lucide-react';

import { useGameStore } from '@/store/gameStore';
import { useAI } from '@/hooks/useAI';
import { useTimer } from '@/hooks/useTimer';
import { useSound } from '@/hooks/useSound';
import { analyzeGame } from '@/lib/analysis';

import ChessBoard from '@/components/board/ChessBoard';
import PlayerBar from '@/components/game/PlayerBar';
import MoveHistory from '@/components/game/MoveHistory';
import EvalBar from '@/components/game/EvalBar';
import GameOverModal from '@/components/game/GameOverModal';
import Navbar from '@/components/layout/Navbar';
import type { Difficulty } from '@/types';

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'novice', label: 'Novice' },
  { key: 'club', label: 'Club' },
  { key: 'expert', label: 'Expert' },
  { key: 'master', label: 'Master' },
];

export default function GamePage() {
  useAI();
  useTimer();

  const { playMove, playCheck } = useSound();
  const {
    game, gameOver, gameResult, aiThinking, focusMode, difficulty,
    resetGame, flipBoard, undoMove, toggleSound, toggleFocusMode,
    setDifficulty, soundEnabled, moveHistory,
  } = useGameStore();

  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<ReturnType<typeof analyzeGame> | null>(null);
  const [modalKey, setModalKey] = useState(0);

  // Play sounds on moves
  const prevMoveCount = moveHistory.length;
  useEffect(() => {
    if (moveHistory.length === 0) return;
    const lastMove = moveHistory[moveHistory.length - 1];
    const isCapture = lastMove.san.includes('x');
    playMove(isCapture);
    if (game.in_check()) playCheck();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moveHistory.length]);

  function handleNewGame() {
    resetGame();
    setShowAnalysis(false);
    setAnalysis(null);
    setModalKey(k => k + 1);
    toast.success('♟ New game — you play White');
  }

  function handleAnalyze() {
    if (moveHistory.length < 4) { toast.error('Play more moves first!'); return; }
    const result = analyzeGame(moveHistory.map(m => m.san).join(' '));
    setAnalysis(result);
    setShowAnalysis(true);
    toast.success('⚡ Analysis ready!');
  }

  function handleResign() {
    if (gameOver || moveHistory.length < 4) return;
    toast.error('You resigned. The AI wins.');
    useGameStore.getState().setGameOver('loss');
  }

  const statusText = aiThinking ? null : gameOver ? 'Game Over' : 'Your Turn';
  const statusColor = gameOver ? 'var(--red)' : 'var(--green)';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar />

      <div style={{
        display: focusMode ? 'flex' : 'grid',
        gridTemplateColumns: focusMode ? undefined : '1fr 300px',
        gap: 0,
        minHeight: 'calc(100vh - 54px)',
        justifyContent: focusMode ? 'center' : undefined,
        alignItems: focusMode ? 'center' : undefined,
      }}>
        {/* ─── Main board column ─── */}
        <div style={{ padding: focusMode ? 24 : '16px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: focusMode ? 'none' : '1px solid var(--border)' }}>

          {/* Game header */}
          <div style={{ width: '100%', maxWidth: 520, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              {/* Difficulty */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: '.5px', color: 'var(--text-2)', textTransform: 'uppercase', marginRight: 6 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)' }} />
                  vs AI
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {DIFFICULTIES.map(d => (
                    <button key={d.key} onClick={() => { setDifficulty(d.key); toast.info(`Difficulty: ${d.label}`); }}
                      style={{ padding: '4px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', cursor: 'pointer', border: '1px solid var(--border)', background: difficulty === d.key ? 'var(--accent-3)' : 'transparent', color: difficulty === d.key ? 'var(--accent)' : 'var(--text-3)', fontFamily: 'var(--font-syne)', transition: 'all .15s' }}>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', gap: 5 }}>
                {[
                  { icon: <RotateCcw size={13} />, action: flipBoard, title: 'Flip board' },
                  { icon: <Undo2 size={13} />, action: undoMove, title: 'Undo' },
                  { icon: soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />, action: toggleSound, title: 'Sound' },
                  { icon: focusMode ? <Minimize2 size={13} /> : <Maximize2 size={13} />, action: toggleFocusMode, title: 'Focus mode' },
                  { icon: <Flag size={13} />, action: handleResign, title: 'Resign' },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.action} title={btn.title}
                    style={{ width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .15s' }}
                    onMouseEnter={e => { (e.target as HTMLElement).closest('button')!.style.background = 'var(--bg-3)'; (e.target as HTMLElement).closest('button')!.style.color = 'var(--text)'; }}
                    onMouseLeave={e => { (e.target as HTMLElement).closest('button')!.style.background = 'transparent'; (e.target as HTMLElement).closest('button')!.style.color = 'var(--text-3)'; }}>
                    {btn.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* AI bar */}
            <PlayerBar side="top" />
          </div>

          {/* Status */}
          <div style={{ marginBottom: 8 }}>
            {aiThinking ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(167,139,250,.08)', border: '1px solid rgba(167,139,250,.2)', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: 'var(--purple)', textTransform: 'uppercase' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--purple)', animation: `bounce-dot .6s ${i * 0.15}s infinite` }} />
                  ))}
                </div>
                AI thinking
              </div>
            ) : (
              <div style={{ padding: '5px 14px', background: gameOver ? 'rgba(248,113,113,.08)' : 'rgba(74,222,128,.08)', border: `1px solid ${gameOver ? 'rgba(248,113,113,.2)' : 'rgba(74,222,128,.2)'}`, borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '.4px', color: statusColor, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor, animation: gameOver ? undefined : 'pulse-dot 1.5s infinite' }} />
                {statusText}
              </div>
            )}
          </div>

          {/* Board */}
          <div style={{ width: '100%', maxWidth: 520, padding: '4px 0' }}>
            <ChessBoard />
          </div>

          {/* Player bar */}
          <div style={{ width: '100%', maxWidth: 520, marginTop: 8 }}>
            <PlayerBar side="bottom" />
          </div>

          {/* Mobile action buttons */}
          <div style={{ display: 'flex', gap: 8, marginTop: 12, width: '100%', maxWidth: 520 }}>
            <button onClick={handleNewGame}
              style={{ flex: 1, padding: '11px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
              New Game
            </button>
            <button onClick={handleAnalyze}
              style={{ flex: 1, padding: '11px', background: 'transparent', color: 'var(--text-2)', border: '1px solid var(--border-2)', borderRadius: 8, fontSize: 12, fontWeight: 600, letterSpacing: '.4px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
              ⚡ Analyze
            </button>
          </div>
        </div>

        {/* ─── Sidebar ─── */}
        {!focusMode && (
          <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 54px)', position: 'sticky', top: 54 }}>
            <EvalBar />

            {/* Analysis panel */}
            {showAnalysis && analysis && (
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-2)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Analysis</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                  {[
                    { label: 'Accuracy', value: `${analysis.accuracy}%`, color: 'var(--green)' },
                    { label: 'Brilliant', value: analysis.brilliant, color: 'var(--blue)' },
                    { label: 'Mistakes', value: analysis.mistakes, color: 'var(--gold)' },
                    { label: 'Blunders', value: analysis.blunders, color: 'var(--red)' },
                  ].map(s => (
                    <div key={s.label} style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 7, padding: '8px 10px' }}>
                      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 16, fontWeight: 500, marginBottom: 2, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                  "{analysis.summary}"
                </div>
              </div>
            )}

            {/* Move history */}
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px 4px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-3)' }}>Moves</div>
              </div>
              <MoveHistory />
            </div>

            {/* Bottom actions */}
            <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <button onClick={undoMove}
                style={{ flex: 1, padding: '9px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', borderRadius: 7, fontSize: 11, fontWeight: 600, letterSpacing: '.3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
                ↩ Undo
              </button>
              <button onClick={handleNewGame}
                style={{ flex: 1, padding: '9px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: 7, fontSize: 11, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
                New Game
              </button>
              <button onClick={handleAnalyze}
                style={{ flex: 1, padding: '9px', border: '1px solid var(--border-2)', background: 'transparent', color: 'var(--text-2)', borderRadius: 7, fontSize: 11, fontWeight: 600, letterSpacing: '.3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
                Analyze
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Game over modal */}
      {gameOver && gameResult && (
        <GameOverModal
          key={modalKey}
          onNewGame={handleNewGame}
          onAnalyze={handleAnalyze}
        />
      )}
    </div>
  );
}
