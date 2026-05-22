'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, LogOut, User } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase';
import { toast } from 'sonner';

interface NavbarProps {
  user?: { email?: string } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const navItems = [
    { href: '/game', label: 'Play' },
    { href: '/profile', label: 'Profile' },
  ];

  async function handleSignOut() {
    const supabase = getSupabaseClient();
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/');
  }

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: 54,
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,11,.9)', backdropFilter: 'blur(12px)',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} className="pulse-dot" />
        <span style={{ fontFamily: 'var(--font-instrument)', fontSize: 20, color: 'var(--accent)', letterSpacing: '-.5px' }}>MÁTĒ</span>
      </Link>

      {/* Nav items */}
      <div style={{ display: 'flex', gap: 2 }}>
        {navItems.map(item => (
          <Link key={item.href} href={item.href} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
            letterSpacing: '.4px', textTransform: 'uppercase', textDecoration: 'none',
            transition: 'all .15s',
            background: pathname === item.href ? 'var(--accent)' : 'transparent',
            color: pathname === item.href ? 'var(--bg)' : 'var(--text-2)',
            border: `1px solid ${pathname === item.href ? 'transparent' : 'transparent'}`,
          }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-3)', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-2)' }}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(232,213,163,.1)', border: '1px solid var(--accent-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-instrument)' }}>
              {user.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <button onClick={handleSignOut}
              style={{ width: 28, height: 28, borderRadius: 6, background: 'transparent', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
              <LogOut size={12} />
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ padding: '7px 14px', borderRadius: 8, background: 'var(--accent)', color: 'var(--bg)', fontSize: 12, fontWeight: 700, textDecoration: 'none', letterSpacing: '.3px', textTransform: 'uppercase' }}>
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
