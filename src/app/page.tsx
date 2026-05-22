'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Moon, Sun, Zap, BarChart2, Trophy, Users } from 'lucide-react';

const FEATURES = [
  { icon: Zap,       title: 'Play vs AI',         desc: 'Four difficulty levels — from casual to master-strength Stockfish.' },
  { icon: BarChart2, title: 'Analyze Games',       desc: 'Post-game analysis with accuracy score, blunders, and AI insights.' },
  { icon: Trophy,    title: 'Track Progress',      desc: 'XP system, levels, rating, and full game history.' },
  { icon: Users,     title: 'Compete & Improve',   desc: 'Daily puzzles and personalized AI playstyle coaching.' },
];

const MINI_BOARD = [
  ['♜','♞','♝','♛','♚','♝','♞','♜'],
  ['♟','♟','♟','♟','♟','♟','♟','♟'],
  ['','','','','','','',''],
  ['','','','','','','',''],
  ['','','','♙','','','',''],
  ['','','','','','','',''],
  ['♙','♙','♙','','♙','♙','♙','♙'],
  ['♖','♘','♗','♕','♔','♗','♘','♖'],
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 32px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,11,.88)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} className="pulse-dot" />
          <span style={{ fontFamily: 'var(--font-instrument)', fontSize: 22, color: 'var(--accent)', letterSpacing: '-.5px' }}>MÁTĒ</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ padding: '8px', background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', color: 'var(--text-2)', display: 'flex', alignItems: 'center' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/login" style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid var(--border-2)', background: 'transparent', color: 'var(--text-2)', fontSize: 13, fontWeight: 600, letterSpacing: '.3px', textDecoration: 'none', textTransform: 'uppercase' }}>
            Sign In
          </Link>
          <Link href="/login?signup=true" style={{ padding: '8px 18px', borderRadius: 8, background: 'var(--accent)', color: 'var(--bg)', fontSize: 13, fontWeight: 700, letterSpacing: '.3px', textDecoration: 'none', textTransform: 'uppercase' }}>
            Play Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(232,213,163,.08)', border: '1px solid rgba(232,213,163,.15)', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '.8px', textTransform: 'uppercase', color: 'var(--accent-2)', marginBottom: 24 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)' }} className="pulse-dot" />
            Now in Beta
          </div>
          <h1 style={{ fontFamily: 'var(--font-instrument)', fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.05, color: 'var(--text)', marginBottom: 20 }}>
            Chess, the way<br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>it should feel.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 1.7, marginBottom: 32, maxWidth: 440 }}>
            Play against adaptive AI, get deep post-game analysis, and track your journey from beginner to master. No ads. No clutter.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/login?signup=true" style={{
              padding: '14px 28px', background: 'var(--accent)', color: 'var(--bg)', borderRadius: 10,
              fontSize: 14, fontWeight: 700, letterSpacing: '.3px', textDecoration: 'none',
              textTransform: 'uppercase', display: 'inline-block',
            }}>
              Start Playing →
            </Link>
            <Link href="/game" style={{
              padding: '14px 28px', border: '1px solid var(--border-2)', background: 'transparent',
              color: 'var(--text-2)', borderRadius: 10, fontSize: 14, fontWeight: 600,
              letterSpacing: '.3px', textDecoration: 'none', textTransform: 'uppercase',
            }}>
              Play as Guest
            </Link>
          </div>
          <p style={{ marginTop: 16, fontSize: 12, color: 'var(--text-3)' }}>Free forever · No credit card</p>
        </motion.div>

        {/* Mini board preview */}
        <motion.div initial={{ opacity: 0, scale: .95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .5, delay: .15 }}
          style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ border: '2px solid var(--border)', borderRadius: 6, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,.5)' }}>
            {MINI_BOARD.map((row, ri) => (
              <div key={ri} style={{ display: 'flex' }}>
                {row.map((piece, fi) => (
                  <div key={fi} style={{
                    width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: (ri + fi) % 2 === 1 ? 'var(--sq-light)' : 'var(--sq-dark)',
                    fontSize: 32, lineHeight: 1,
                    filter: piece ? 'drop-shadow(0 2px 3px rgba(0,0,0,.4))' : undefined,
                  }}>
                    {piece}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: .4, delay: .1 * i }}
              style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(232,213,163,.08)', border: '1px solid rgba(232,213,163,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <f.icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 32px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
        MÁTĒ © 2024 · Chess Reimagined
      </footer>
    </div>
  );
}
