# MÁTĒ — Chess Reimagined

> A modern chess platform built for players who care about their progress.

**Live Demo:** [https://mate-chess.vercel.app](https://mate-chess.vercel.app)

---

## What is MÁTĒ?

MÁTĒ is a full-stack chess web app where you can:

- **Play vs AI** with 4 difficulty levels (Novice → Master)
- **Analyze your games** — accuracy score, brilliant moves, blunders, AI summary
- **Track progress** — ELO rating, XP system, levels, win rate, game history
- **Save everything** — every game is stored in your account (Supabase)
- **Focus Mode** — distraction-free board for deep concentration
- **AI Coach** — real-time positional insights during play
- **Dark & Light themes** — with a single click

Built for chess learners who want feedback, not just a board to play on.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| State | Zustand |
| Auth & DB | Supabase (PostgreSQL + Auth) |
| Chess Logic | chess.js |
| AI Engine | Custom minimax with alpha-beta pruning |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/mate-chess.git
cd mate-chess
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. In the SQL Editor, run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from **Project Settings → API**

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy** — done in ~2 minutes

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── login/page.tsx    # Auth (sign in / sign up)
│   ├── game/page.tsx     # Main chess interface
│   └── profile/page.tsx  # User stats and history
├── components/
│   ├── board/
│   │   └── ChessBoard.tsx     # Rendered chess board
│   ├── game/
│   │   ├── PlayerBar.tsx      # Player info + timer
│   │   ├── MoveHistory.tsx    # Scrollable move list
│   │   ├── EvalBar.tsx        # Evaluation + AI coach
│   │   └── GameOverModal.tsx  # End-of-game overlay
│   └── layout/
│       └── Navbar.tsx         # Navigation + theme toggle
├── hooks/
│   ├── useAI.ts          # AI move computation hook
│   ├── useTimer.ts       # Game clock hook
│   └── useSound.ts       # Web Audio sound effects
├── lib/
│   ├── engine.ts         # Minimax AI engine
│   ├── analysis.ts       # Post-game analysis
│   ├── db.ts             # Supabase queries
│   ├── supabase.ts       # Client-side Supabase
│   └── supabase-server.ts # Server-side Supabase
├── store/
│   └── gameStore.ts      # Zustand global state
└── types/
    └── index.ts          # TypeScript types
```

---

## Features by Criteria

| Requirement | Status |
|-------------|--------|
| Play vs AI | ✅ Minimax engine, 4 difficulty levels |
| Game history | ✅ Saved per user in Supabase |
| Authentication | ✅ Supabase Auth (email + password) |
| Dark/Light theme | ✅ next-themes with CSS variables |
| Responsive design | ✅ Mobile-first layout |
| Supabase DB | ✅ Profiles + Games tables with RLS |
| Post-game analysis | ✅ Accuracy, blunders, AI summary |
| Progress tracking | ✅ Rating, XP, levels, winrate |

---

## Why users come back

1. **Rating changes after every game** — people are wired to care about their number
2. **XP + Level system** — a sense of progression beyond just wins
3. **AI Coach** — every game teaches you something new
4. **Analysis panel** — "I blundered?! Let me play again" loop
5. **Focus Mode** — respects the user's deep work

---

## License

MIT
