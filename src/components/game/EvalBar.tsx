'use client';

import { useGameStore } from '@/store/gameStore';

const INSIGHTS = [
  'Control the <b>center</b> with your pawns early.',
  'Develop knights before bishops.',
  'Castle early to keep your king safe.',
  'Connect your rooks by clearing the back rank.',
  'Look for <b>tactical opportunities</b> — forks and pins.',
  'Your position is strong. Look to open lines.',
  'Activate your rooks on open files.',
  'In the endgame, your king is a <b>fighting piece</b>.',
];

export default function EvalBar() {
  const { evaluation, moveHistory } = useGameStore();

  const clamped = Math.max(-8, Math.min(8, evaluation));
  // Percentage: 50% = equal, higher = better for white
  const whitePct = ((clamped + 8) / 16) * 100;
  const displayEval = evaluation >= 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1);

  const insight = INSIGHTS[moveHistory.length % INSIGHTS.length];

  return (
    <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
        Evaluation
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-dm-mono)' }}>B</span>
        <div style={{ flex: 1, height: 7, background: 'var(--bg-4)', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${whitePct}%`, background: 'var(--accent)', borderRadius: 4, transition: 'width .4s ease' }} />
        </div>
        <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-dm-mono)' }}>W</span>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', color: 'var(--text-2)', minWidth: 42, textAlign: 'right' }}>
          {displayEval}
        </span>
      </div>

      {/* AI Coach */}
      <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 12px' }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>AI Coach</div>
        <div
          style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: insight.replace(/<b>(.*?)<\/b>/g, '<span style="color:var(--accent);font-style:normal">$1</span>') }}
        />
      </div>
    </div>
  );
}
