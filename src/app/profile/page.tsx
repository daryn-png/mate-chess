'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseClient } from '@/lib/supabase';
import { fetchProfile, fetchGameHistory } from '@/lib/db';
import { generatePlaystyle } from '@/lib/analysis';
import type { UserProfile, GameRecord } from '@/types';
import Navbar from '@/components/layout/Navbar';

function StatCard({ label, value, color }: { label: string; value: string | number; color?: string }) {
  return (
    <div style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 24, fontWeight: 500, marginBottom: 4, color: color ?? 'var(--accent)' }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [games, setGames] = useState<GameRecord[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUser(user);

      const [p, g] = await Promise.all([
        fetchProfile(user.id),
        fetchGameHistory(user.id, 8),
      ]);
      setProfile(p);
      setGames(g);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <Navbar user={user} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 54px)', color: 'var(--text-3)' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  const winrate = profile && profile.games_played > 0
    ? Math.round((profile.wins / profile.games_played) * 100)
    : 0;

  const playstyle = profile
    ? generatePlaystyle(profile.wins, profile.losses, profile.avg_accuracy)
    : '';

  const xpForNextLevel = 1000;
  const xpProgress = profile ? (profile.xp % xpForNextLevel) : 0;
  const xpPercent = (xpProgress / xpForNextLevel) * 100;

  const resultColors: Record<string, string> = {
    win: 'var(--green)', loss: 'var(--red)', draw: 'var(--gold)',
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
      <Navbar user={user} />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '28px 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(232,213,163,.08)', border: '2px solid var(--accent-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-instrument)', fontSize: 26, color: 'var(--accent)', flexShrink: 0 }}>
            {user?.email?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: 'var(--font-instrument)', fontSize: 26, marginBottom: 4 }}>
              {profile?.username ?? user?.email?.split('@')[0]}
            </h1>
            <div style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-dm-mono)', marginBottom: 10 }}>
              Level {profile?.level ?? 1} · {profile?.xp ?? 0} XP
            </div>
            {/* XP bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 320 }}>
              <div style={{ flex: 1, height: 5, background: 'var(--bg-4)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${xpPercent}%`, background: 'linear-gradient(90deg, var(--accent-3), var(--accent))', borderRadius: 3, transition: 'width .5s ease' }} />
              </div>
              <span style={{ fontSize: 10, color: 'var(--text-3)', fontFamily: 'var(--font-dm-mono)', whiteSpace: 'nowrap' }}>
                {xpProgress} / {xpForNextLevel} XP
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 36, fontWeight: 500, color: 'var(--accent)', lineHeight: 1 }}>
              {profile?.rating ?? 1200}
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px', marginTop: 4 }}>Rating</div>
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatCard label="Games" value={profile?.games_played ?? 0} />
          <StatCard label="Wins" value={profile?.wins ?? 0} color="var(--green)" />
          <StatCard label="Losses" value={profile?.losses ?? 0} color="var(--red)" />
          <StatCard label="Draws" value={profile?.draws ?? 0} color="var(--gold)" />
          <StatCard label="Win Rate" value={`${winrate}%`} color="var(--blue)" />
          <StatCard label="Accuracy" value={`${profile?.avg_accuracy ?? 0}%`} color="var(--purple)" />
        </div>

        {/* Playstyle */}
        {profile && (
          <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 20px', marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>AI Playstyle Analysis</div>
            <p style={{ fontFamily: 'var(--font-instrument)', fontStyle: 'italic', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6 }}>
              "{playstyle}"
            </p>
          </div>
        )}

        {/* Game history */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-3)' }}>Recent Games</div>
          </div>
          {games.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-3)', fontSize: 13 }}>
              No games yet. <Link href="/game" style={{ color: 'var(--accent-2)', textDecoration: 'none' }}>Play your first game →</Link>
            </div>
          ) : (
            games.map((g, i) => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderBottom: i < games.length - 1 ? '1px solid var(--border)' : undefined }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: g.result === 'win' ? 'rgba(74,222,128,.1)' : g.result === 'loss' ? 'rgba(248,113,113,.1)' : 'rgba(251,191,36,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
                    {g.result === 'win' ? '♔' : g.result === 'loss' ? '♚' : '½'}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: resultColors[g.result] }}>
                      {g.result.charAt(0).toUpperCase() + g.result.slice(1)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-dm-mono)' }}>
                      vs AI · {g.difficulty} · {g.moves_count} moves
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, fontFamily: 'var(--font-dm-mono)', color: 'var(--text-2)' }}>
                    {g.accuracy}% accuracy
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                    {new Date(g.played_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <Link href="/game"
          style={{ display: 'inline-block', padding: '12px 24px', background: 'var(--accent)', color: 'var(--bg)', borderRadius: 10, fontSize: 13, fontWeight: 700, letterSpacing: '.3px', textTransform: 'uppercase', textDecoration: 'none' }}>
          Play Now →
        </Link>
      </div>
    </div>
  );
}
