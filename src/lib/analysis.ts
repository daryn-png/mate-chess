import type { GameAnalysis, MoveQuality } from '@/types';

// Classify move quality based on eval drop
function classifyMove(evalBefore: number, evalAfter: number, isWhite: boolean): MoveQuality['quality'] {
  // Normalize: positive = good for the side who just moved
  const evalDrop = isWhite
    ? evalBefore - evalAfter   // white wants positive eval
    : evalAfter - evalBefore;  // black wants negative eval

  if (evalDrop <= -0.3) return 'brilliant'; // unexpected good move
  if (evalDrop <= 0.1) return 'good';
  if (evalDrop <= 0.5) return 'inaccuracy';
  if (evalDrop <= 1.5) return 'mistake';
  return 'blunder';
}

// Simple mock analysis (real version would use Stockfish WASM)
export function analyzeGame(pgn: string): GameAnalysis {
  const lines = pgn.split(' ').filter((t) => t && !t.includes('.'));
  const sanMoves = lines;

  let brilliant = 0, good = 0, inaccuracy = 0, mistakes = 0, blunders = 0;
  const moveQualities: MoveQuality[] = [];

  sanMoves.forEach((san, i) => {
    // Simulate eval changes (in real app: run Stockfish on each position)
    const baseEval = (Math.random() - 0.5) * 2;
    const evalBefore = baseEval;
    const evalAfter = baseEval + (Math.random() - 0.45) * 0.8;
    const isWhite = i % 2 === 0;
    const quality = classifyMove(evalBefore, evalAfter, isWhite);

    moveQualities.push({ san, quality, eval_before: evalBefore, eval_after: evalAfter });

    if (quality === 'brilliant') brilliant++;
    else if (quality === 'good') good++;
    else if (quality === 'inaccuracy') inaccuracy++;
    else if (quality === 'mistake') mistakes++;
    else blunders++;
  });

  const total = sanMoves.length;
  const accuracy = total > 0
    ? Math.round(((brilliant * 1 + good * 0.9 + inaccuracy * 0.6 + mistakes * 0.3) / total) * 100)
    : 0;

  const summaries = [
    `You controlled the center well in the opening. ${brilliant > 0 ? `Your ${brilliant} brilliant move(s) showed deep tactical vision.` : ''} Watch out for ${blunders > 0 ? 'blunders' : 'inaccuracies'} in complex positions.`,
    `A solid game overall. Your opening preparation was evident. The middlegame became sharp — ${mistakes > 1 ? 'a few mistakes cost you tempo' : 'you navigated it well'}.`,
    `You played aggressively and created threats. ${brilliant > 1 ? 'Multiple brilliant moves show great tactical awareness.' : 'Work on finding those brilliant continuations.'} Keep practicing endgames.`,
  ];

  return {
    accuracy,
    brilliant,
    good,
    inaccuracy,
    mistakes,
    blunders,
    moves: moveQualities,
    summary: summaries[Math.floor(Math.random() * summaries.length)],
  };
}

// Generate AI playstyle description based on stats
export function generatePlaystyle(wins: number, losses: number, avgAccuracy: number): string {
  if (avgAccuracy > 85) return 'Precision Engineer — you rarely make mistakes and grind opponents down with technique.';
  if (avgAccuracy > 75 && wins > losses) return 'Bold Tactician — you create complications and thrive in sharp positions.';
  if (wins > losses * 2) return 'Aggressive Attacker — you love to sacrifice material and launch kingside attacks.';
  if (losses < wins * 0.5) return 'Solid Defender — you are hard to beat and excel at converting equal positions.';
  return 'Creative Strategist — you prefer positional play and long-term planning over quick tactics.';
}
