# Internship Tracker

A production-ready, Apple-level polished web app for tracking Summer 2027 internship applications.
Built for Rumaisa Kashif — NUS CS student targeting SWE, ML/AI, and Quant roles at top firms.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19 + Vite + TypeScript (strict) |
| Styling | Tailwind CSS v3 + Framer Motion |
| Database | Supabase (Postgres + Realtime) |
| State | Zustand (persisted) |
| Data fetch | TanStack Query v5 |
| AI | Claude API (Anthropic) |
| API | Vercel Serverless Functions |
| Automation | n8n (self-hosted on Render) |
| Deployment | Vercel |

## Features

- **Dashboard** — Animated stat cards, urgency banners, next scan countdown, recent activity feed
- **Job Postings** — Realtime Supabase subscription, match scoring, skill chip highlighting, scan log
- **Timeline** — All target companies with open/upcoming dates, notes, SVG connector lines
- **LeetCode** — 80+ problems, pattern progress rings, streak tracker, Claude-powered explanations
- **Resume Optimizer** — Paste job URL → Claude rewrites resume + cover letter, diff view
- **Referral Network** — Outreach strategies, LinkedIn queries, Claude-drafted cold DMs
- **Settings** — Full profile, skills, companies, API key management

## Quick Start

```bash
git clone <repo>
chmod +x setup.sh
./setup.sh
```

The setup script installs dependencies, prompts for env vars, builds the app, and prints next steps.

## Environment Variables

| Variable | Where to get |
|----------|-------------|
| `VITE_SUPABASE_URL` | supabase.com → Project → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | supabase.com → Project → Settings → API |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `VITE_N8N_WEBHOOK_URL` | n8n UI after deploying on Render |

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Open SQL Editor
3. Run in order:
   ```
   supabase/schema.sql   → creates tables, enums, indexes
   supabase/rls.sql      → enables RLS with allow-all policies
   supabase/seed.sql     → seeds Rumaisa's profile, companies, LC problems, timeline, listings
   ```
4. Enable Realtime on `internships` and `scan_logs` tables:
   - Go to Database → Replication → add those tables

## Vercel Deployment

```bash
npm install -g vercel
vercel deploy
```

Add these environment variables in Vercel dashboard:
- `ANTHROPIC_API_KEY` → sk-ant-...
- The `VITE_*` vars (also need to be in Vercel for build time)

## n8n Setup (Render)

1. Go to [render.com](https://render.com) → New → Web Service
2. Use Docker image: `docker.io/n8nio/n8n:latest`
3. Add persistent disk: mount at `/home/node/.n8n`, 1GB
4. Set environment variables from `render.yaml`
5. Once deployed, open n8n UI at `https://your-n8n.onrender.com`
6. Import workflows from `n8n/` folder:
   - `gmail-scanner.json` → Gmail email scanning
   - `date-monitor.json` → Application date research
   - `resume-optimizer.json` → Resume optimization webhook
7. Set up credentials in n8n:
   - **Gmail OAuth2**: credentials → Gmail OAuth2 API
   - **Supabase**: URL + Service Role Key (from Supabase Settings → API)
   - **Anthropic**: HTTP Header Auth → `x-api-key: sk-ant-...`
8. Copy the Gmail Scanner webhook URL → add to `VITE_N8N_WEBHOOK_URL` in `.env` and Vercel
9. Activate all three workflows

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/scrape` | POST | Fetch job page via Jina.ai, extract title/requirements |
| `/api/optimize` | POST | Stream Claude resume optimization + cover letter |
| `/api/draft-dm` | POST | Generate personalized LinkedIn DM via Claude |
| `/api/explain-lc` | POST | Stream Claude LeetCode explanation with Python solution |

## Design System

- **Background**: `#08080F` near-black with animated mesh gradient (purple/pink/teal)
- **Cards**: Glass morphism — `rgba(20,20,32,0.75)` + `backdrop-filter: blur(16px)`
- **Typography**: Clash Display (headings) + Inter (body) + JetBrains Mono (code)
- **Accent**: Violet/purple family — `#C4B5FD` bright, `#A78BFA` mid, `#7C3AED` dim
- **Motion**: Framer Motion throughout — staggered entry, spring hovers, AnimatePresence

## Project Structure

```
src/
  components/
    layout/     Sidebar (collapsible), PageWrapper
    ui/         30+ components — Button, Card, Modal, Drawer, ProgressRing, etc.
    features/   (page-specific)
  pages/        Dashboard, Jobs, Timeline, LeetCode, Optimizer, Referrals, Settings
  hooks/        useSupabase, useScan, useOptimizer, useLeetCode, useRealtime
  lib/          supabase.ts, claude.ts, utils.ts
  store/        Zustand global store (persisted)
  styles/       globals.css — CSS variables, mesh animation, glass card mixin
api/            Vercel serverless functions (scrape, optimize, draft-dm, explain-lc)
n8n/            Importable workflow JSON files
supabase/       schema.sql, rls.sql, seed.sql
```

## Target Companies (Timeline)

| Company | Expected Window | Urgency |
|---------|----------------|---------|
| Jane Street | Open now (FTTP/FOCUS) | 🔴 Apply now |
| D.E. Shaw | Open now | 🔴 Apply now |
| Optiver SG | Rolling | 🔴 Apply now |
| Databricks | July 2026 | 🟡 Upcoming |
| Amazon | July 2026 | 🟡 Upcoming |
| Two Sigma | August 2026 | 🟡 Upcoming |
| Microsoft | Mid-August 2026 | 🟡 Upcoming |
| Meta | Early September 2026 | 🟡 Upcoming |
| Apple | September–November | 🟡 Upcoming |
| Citadel | August–September 2026 | 🟡 Upcoming |
| **Google** | **Mid-October 2026 (2–4 week window)** | **⚠️ CRITICAL** |
| Palantir | October 2026 | 🟡 Upcoming |
| Stripe | October 2026 | 🟡 Upcoming |
| Anthropic | Rolling | ❓ Monitor |
| OpenAI | Rolling | ❓ Monitor |
