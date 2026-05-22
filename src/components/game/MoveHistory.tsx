'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function MoveHistory() {
  const { moveHistory } = useGameStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moveHistory.length]);

  if (moveHistory.length === 0) {
    return (
      <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>♟</div>
        Make your first move
      </div>
    );
  }

  const pairs: Array<{ white?: typeof moveHistory[0]; black?: typeof moveHistory[0]; num: number }> = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairs.push({ white: moveHistory[i], black: moveHistory[i + 1], num: i / 2 + 1 });
  }

  return (
    <div
      ref={scrollRef}
      style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 8px' }}
    >
      {pairs.map((pair) => (
        <div key={pair.num} style={{
          display: 'grid', gridTemplateColumns: '24px 1fr 1fr',
          gap: 4, marginBottom: 2, alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-dm-mono)' }}>
            {pair.num}.
          </span>
          <MoveCell move={pair.white} isLast={!pair.black && pair.white === moveHistory[moveHistory.length - 1]} />
          <MoveCell move={pair.black} isLast={pair.black === moveHistory[moveHistory.length - 1]} />
        </div>
      ))}
    </div>
  );
}

function MoveCell({ move, isLast }: { move?: typeof import('@/store/gameStore').useGameStore extends (() => infer S) ? S extends { moveHistory: Array<infer M> } ? M : never : never; isLast?: boolean }) {
  if (!move) return <div />;

  return (
    <div style={{
      padding: '4px 8px', borderRadius: 5, fontSize: 12,
      fontFamily: 'var(--font-dm-mono)', cursor: 'pointer',
      background: isLast ? 'rgba(139,105,20,.2)' : 'transparent',
      border: `1px solid ${isLast ? 'var(--accent-3)' : 'transparent'}`,
      color: isLast ? 'var(--accent)' : 'var(--text-2)',
      transition: 'all .15s',
    }}>
      {move.san}
    </div>
  );
}
