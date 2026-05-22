'use client';

import { useGameStore } from '@/store/gameStore';

const PIECES: Record<string, string> = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
};

const FILES = 'abcdefgh';
const RANKS = '12345678';

export default function ChessBoard() {
  const {
    game, selectedSquare, legalMoves, lastFrom, lastTo,
    flipped, selectSquare,
  } = useGameStore();

  const ranks = flipped
    ? [0, 1, 2, 3, 4, 5, 6, 7]
    : [7, 6, 5, 4, 3, 2, 1, 0];
  const files = flipped
    ? [7, 6, 5, 4, 3, 2, 1, 0]
    : [0, 1, 2, 3, 4, 5, 6, 7];

  const inCheck = game.in_check();
  const currentKingColor = game.turn();

  function findKingSquare(): string | null {
    if (!inCheck) return null;
    const board = game.board();
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f];
        if (p?.type === 'k' && p.color === currentKingColor) {
          return FILES[f] + RANKS[r];
        }
      }
    }
    return null;
  }

  const checkSquare = findKingSquare();

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        border: '2px solid var(--border)',
        borderRadius: 4,
        overflow: 'hidden',
        aspectRatio: '1',
        width: '100%',
        maxWidth: 520,
        boxShadow: '0 20px 60px rgba(0,0,0,.5)',
      }}
    >
      {ranks.map((r, ri) =>
        files.map((f, fi) => {
          const sq = FILES[f] + RANKS[r];
          const isLight = (r + f) % 2 === 1;
          const piece = game.get(sq as any);
          const isSelected = sq === selectedSquare;
          const isLegal = legalMoves.includes(sq);
          const isLastFrom = sq === lastFrom;
          const isLastTo = sq === lastTo;
          const isCheck = sq === checkSquare;
          const isOccupied = !!piece;

          let bg = isLight ? 'var(--sq-light)' : 'var(--sq-dark)';
          if (isCheck) bg = 'var(--sq-check)';
          else if (isSelected) bg = 'var(--sq-selected)';
          else if (isLastFrom || isLastTo) bg = 'var(--sq-last)';

          return (
            <div
              key={sq}
              onClick={() => selectSquare(sq)}
              style={{
                background: bg,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background .08s',
                userSelect: 'none',
              }}
            >
              {/* Legal move indicator */}
              {isLegal && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                    pointerEvents: 'none',
                  }}
                >
                  {isOccupied ? (
                    <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--sq-legal)', borderRadius: 0 }} />
                  ) : (
                    <div style={{ width: '28%', height: '28%', borderRadius: '50%', background: 'var(--sq-legal)' }} />
                  )}
                </div>
              )}

              {/* Rank label */}
              {fi === 0 && (
                <span style={{
                  position: 'absolute', top: 2, left: 3,
                  fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-dm-mono)',
                  color: isLight ? 'var(--sq-dark)' : 'var(--sq-light)', opacity: .6, zIndex: 2,
                }}>
                  {RANKS[r]}
                </span>
              )}

              {/* File label */}
              {ri === 7 && (
                <span style={{
                  position: 'absolute', bottom: 1, right: 3,
                  fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-dm-mono)',
                  color: isLight ? 'var(--sq-dark)' : 'var(--sq-light)', opacity: .6, zIndex: 2,
                }}>
                  {FILES[f]}
                </span>
              )}

              {/* Piece */}
              {piece && (
                <span
                  style={{
                    fontSize: 'clamp(28px, 5vw, 40px)',
                    lineHeight: 1,
                    zIndex: 2,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.5))',
                    transform: isSelected ? 'scale(1.1)' : undefined,
                    transition: 'transform .1s',
                  }}
                >
                  {PIECES[(piece.color === 'w' ? 'w' : 'b') + piece.type.toUpperCase()]}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
