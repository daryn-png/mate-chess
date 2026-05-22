'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { getSupabaseClient } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsSignup(params.get('signup') === 'true');
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = getSupabaseClient();

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { toast.error(error.message); setLoading(false); return; }
      toast.success('Account created! Check your email to confirm.');
      router.push('/game');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error('Invalid email or password'); setLoading(false); return; }
      toast.success('Welcome back!');
      router.push('/game');
    }

    setLoading(false);
  }

  async function handleGuest() {
    router.push('/game');
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: 'var(--bg-3)',
    border: '1px solid var(--border-2)', borderRadius: 8, color: 'var(--text)',
    fontSize: 14, fontFamily: 'var(--font-syne)', outline: 'none',
    transition: 'border-color .15s',
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-instrument)', fontSize: 32, color: 'var(--accent)' }}>MÁTĒ</span>
          </Link>
          <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text-2)' }}>
            {isSignup ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 24, position: 'relative' }}>
              <label style={{ fontSize: 12, fontWeight: 600, letterSpacing: '.5px', textTransform: 'uppercase', color: 'var(--text-3)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isSignup ? 'Min. 6 characters' : '••••••••'}
                  style={{ ...inputStyle, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '13px', background: loading ? 'var(--accent-3)' : 'var(--accent)', color: 'var(--bg)', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-syne)', transition: 'background .2s' }}>
              {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-3)' }}>
              {isSignup ? 'Already have an account? ' : 'No account? '}
            </span>
            <button onClick={() => setIsSignup(!isSignup)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-2)', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
              {isSignup ? 'Sign In' : 'Sign Up Free'}
            </button>
          </div>

          <div style={{ margin: '20px 0', borderTop: '1px solid var(--border)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--bg-2)', padding: '0 10px', fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '.5px' }}>or</span>
          </div>

          <button onClick={handleGuest}
            style={{ width: '100%', padding: '12px', background: 'transparent', color: 'var(--text-2)', borderRadius: 8, border: '1px solid var(--border-2)', fontSize: 13, fontWeight: 600, letterSpacing: '.3px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-syne)' }}>
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
