import type { Metadata } from 'next';
import { Syne, Instrument_Serif, DM_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '500', '600', '700', '800'],
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument',
  weight: '400',
  style: ['normal', 'italic'],
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'MÁTĒ — Chess Reimagined',
  description: 'Play chess against AI, analyze your games, and track your progress. The chess platform built for the modern player.',
  keywords: ['chess', 'online chess', 'chess AI', 'chess analysis', 'chess training'],
  openGraph: {
    title: 'MÁTĒ — Chess Reimagined',
    description: 'Play chess against AI, analyze your games, and track your progress.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${syne.variable} ${instrumentSerif.variable} ${dmMono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--toast-bg)',
                border: '1px solid var(--toast-border)',
                color: 'var(--toast-text)',
                fontFamily: 'var(--font-syne)',
                fontSize: '13px',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
