# Financial Companion — Development Guide

## Quick Reference

| Item | Value |
|------|-------|
| **Live URL** | https://finance-companion-two.vercel.app |
| **GitHub Repo** | https://github.com/spvhaha/finance-companion |
| **Vercel Dashboard** | https://vercel.com/spvhahas-projects/finance-companion/deployments |
| **Turso Dashboard** | https://app.turso.tech |
| **Turso DB Name** | finance-companion |
| **Turso DB URL** | libsql://finance-companion-sk-pk.aws-us-east-1.turso.io |
| **Turso Region** | aws-us-east-1 |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Turso (libsql)** | Cloud SQLite database (free tier: 9GB) |
| **Anthropic SDK** | AI Q&A via Claude API |
| **Vercel** | Hosting & auto-deployment |
| **GitHub** | Source code (spvhaha account) |

---

## Git Configuration

This project uses a **local** git config (separate from your work account):

```
# This project only:
Name:  Shital Kansara
Email: spvhaha@yahoo.com
GitHub: https://github.com/spvhaha

# All other projects (global default):
Name:  skansara-telus
Email: shital.kansara@telus.com
```

The local config is stored in `/Users/t850124/finance-companion/.git/config` and only applies to this folder.

---

## Environment Variables

### Local Development (`.env.local` — NOT committed to git)
File location: `/Users/t850124/finance-companion/.env.local`

```
TURSO_DATABASE_URL=libsql://finance-companion-sk-pk.aws-us-east-1.turso.io
TURSO_AUTH_TOKEN=<your-turso-auth-token>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

> **Where to find these tokens:**
> - Turso token: run `turso db tokens create finance-companion`
> - Anthropic key: https://console.anthropic.com → API Keys
> - All three are already set in your `.env.local` file and in Vercel Environment Variables

### Vercel (Production)
Same three variables are set in Vercel dashboard:
**Vercel → Project Settings → Environment Variables**

---

## Project Structure

```
/Users/t850124/finance-companion/
├── app/
│   ├── layout.tsx              # Root layout with Google Fonts
│   ├── globals.css             # Global styles, CSS variables, animations
│   ├── page.tsx                # Dashboard / Home page
│   ├── onboarding/page.tsx     # First-time setup (profile selection)
│   ├── goals/page.tsx          # Savings goals CRUD
│   ├── journal/page.tsx        # Financial journal
│   ├── ask/page.tsx            # AI Q&A page
│   ├── settings/page.tsx       # Settings & data management
│   └── api/
│       ├── profile/route.ts    # GET/POST/PUT profile
│       ├── goals/route.ts      # GET/POST/PUT/DELETE goals
│       ├── journal/route.ts    # GET/POST/PUT/DELETE journal entries
│       ├── challenges/route.ts # GET/POST challenges
│       ├── streaks/route.ts    # GET/POST streaks
│       ├── ask/route.ts        # GET history / POST question to Claude AI
│       ├── export/route.ts     # GET all data as JSON
│       └── reset/route.ts      # POST reset all data
├── components/
│   ├── Nav.tsx                 # Bottom navigation bar
│   ├── TipCard.tsx             # Daily tip display
│   ├── ChallengeCard.tsx       # Weekly challenge with complete button
│   ├── GoalCard.tsx            # Goal with progress bar & quick-add
│   ├── StatBar.tsx             # Three-stat display (streak, challenges, goals)
│   └── AiChat.tsx              # AI chat interface with history
├── lib/
│   ├── db.ts                   # Turso database client & all DB functions
│   ├── content.ts              # Tips, challenges, prompts, templates
│   └── utils.ts                # Date helpers, seeded random, formatting
├── .env.local                  # Environment variables (NOT in git)
├── .env.example                # Template for env vars
├── .eslintrc.json              # ESLint config
├── tailwind.config.ts          # Tailwind with custom fonts & colors
├── next.config.mjs             # Next.js config
├── tsconfig.json               # TypeScript config
├── package.json                # Dependencies
└── DEVELOPMENT.md              # This file
```

---

## Database Schema (Turso/SQLite)

```sql
-- User profile (always id=1, single user app)
CREATE TABLE profile (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL,          -- 'young' or 'senior'
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Savings goals
CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  target REAL NOT NULL,
  current REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Journal entries
CREATE TABLE journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Completed weekly challenges
CREATE TABLE challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_date TEXT NOT NULL UNIQUE,  -- Monday of the week
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Visit streaks
CREATE TABLE streaks (
  id INTEGER PRIMARY KEY,              -- always id=1
  current_streak INTEGER DEFAULT 0,
  last_visit TEXT                       -- YYYY-MM-DD
);

-- AI Q&A history
CREATE TABLE ask_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Tables are auto-created on first request (see `ensureInit()` in `lib/db.ts`).

---

## Running Locally

### Prerequisites
- Node.js 18+ installed
- npm installed

### Start Development Server
```bash
cd /Users/t850124/finance-companion
npm install          # only needed first time or after adding packages
npm run dev -- -p 3003   # starts on port 3003 (3000 is in use)
```
Open http://localhost:3003

### Build for Production
```bash
npm run build
npm start -- -p 3003
```

### Important: Port 3000 is already in use on your machine. Always use port 3003.

---

## Deploying Changes

### Automatic (Recommended)
Every push to `main` branch auto-deploys to Vercel.

```bash
# 1. Make your changes
# 2. Stage and commit
git add -A
git commit -m "Description of changes"

# 3. Push to GitHub → Vercel auto-deploys
git push
```

Check deployment status: https://vercel.com/spvhahas-projects/finance-companion/deployments

### Manual Deploy via Vercel CLI
```bash
npx vercel --prod
```

---

## Account Credentials & Logins

### GitHub (personal)
- **Account:** spvhaha
- **Email:** spvhaha@yahoo.com
- **Repo:** https://github.com/spvhaha/finance-companion
- **CLI auth:** `gh auth login` (login via browser as spvhaha)

### Vercel
- **Username:** spvhaha (vercel.com/spvhaha)
- **Email:** spvhaha@yahoo.com (Verified, Primary)
- **Default Team:** spvhahas-projects
- **Dashboard:** https://vercel.com/spvhahas-projects
- **Project:** https://vercel.com/spvhahas-projects/finance-companion/deployments
- **Live URL:** https://finance-companion-two.vercel.app
- **CLI auth:** `vercel login` (login via browser)

### Turso
- **Dashboard:** https://app.turso.tech
- **CLI auth:** `turso auth login` (login via browser)
- **DB shell:** `turso db shell finance-companion` (run SQL queries directly)

### Turso
- **Dashboard:** https://app.turso.tech/sk-pk
- **CLI auth:** `turso auth login` (login via browser)
- **DB shell:** `turso db shell finance-companion`
- **Generate new token:** `turso db tokens create finance-companion`

### Anthropic
- **Console:** https://console.anthropic.com
- **API Key starts with:** `sk-ant-api03-...` (stored in .env.local and Vercel)

---

## Useful Commands

```bash
# --- Git ---
git status                    # see what's changed
git log --oneline -10         # recent commits
git push                      # deploy to production

# --- Turso Database ---
turso auth login              # login to Turso CLI
turso db shell finance-companion   # open SQL shell to query data
turso db show finance-companion    # show DB info
turso db tokens create finance-companion  # generate new auth token

# --- GitHub CLI ---
gh auth login                 # login (use spvhaha account)
gh auth status                # check who you're logged in as
gh repo view --web            # open repo in browser

# --- Development ---
npm run dev -- -p 3003        # start dev server on port 3003
npm run build                 # production build
npm start -- -p 3003          # start production server
npm run lint                  # check for code issues
```

---

## Design System

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Background | `#F9F8F5` | Page background |
| Card bg | `#FFFFFF` | Card backgrounds |
| Secondary bg | `#F1EFE8` | Progress bar backgrounds, subtle fills |
| Border | `#D3D1C7` | Card borders, input borders |
| Muted text | `#888780` | Secondary text, labels |
| Primary text | `#444441` | Headings, body text |
| Young accent | `#7F77DD` | Purple — Growth Explorer profile |
| Senior accent | `#1D9E75` | Teal — Steady Protector profile |

### Fonts
- **Headings:** Source Serif 4 (serif) — class: `font-heading`
- **Body:** DM Sans (sans-serif) — class: `font-body`
- Loaded via Google Fonts in `app/layout.tsx`

### Layout
- Max width: 540px, centered
- Mobile-first design
- Bottom navigation bar (fixed)
- Cards: white bg, 1px border, 12px radius, generous padding

---

## How Key Features Work

### Daily Tips
- 20+ tips per profile stored in `lib/content.ts`
- Uses date-based seed (`getDailySeed()`) to pick the same tip all day
- New tip automatically appears the next day

### Weekly Challenges
- 8 challenges per profile in `lib/content.ts`
- Uses week-based seed (`getWeeklySeed()`) — same challenge all week
- "Mark Complete" writes the week's Monday date to `challenges` table
- Each week can only be completed once

### Visit Streaks
- On every dashboard visit, `POST /api/streaks` is called
- If last visit was yesterday → streak + 1
- If last visit was today → no change
- If last visit was 2+ days ago → streak resets to 1

### AI Q&A
- Uses Anthropic Claude Sonnet model
- System prompt tailored to user's profile type
- Last 5 Q&A pairs sent as conversation history for follow-ups
- All Q&As saved to `ask_history` table

---

## Troubleshooting

### "Port 3000 already in use"
Always use port 3003: `npm run dev -- -p 3003`

### Git push denied (wrong account)
```bash
gh auth setup-git    # reconfigure git to use gh CLI credentials
git push             # try again
```

### Turso token expired
```bash
turso db tokens create finance-companion
```
Update the token in `.env.local` AND in Vercel Environment Variables.

### Vercel deployment failed
Check build logs: https://vercel.com/spvhahas-projects/finance-companion/deployments

### Database tables not creating
Tables auto-create on first API request. If issues persist:
```bash
turso db shell finance-companion
# Then run CREATE TABLE statements from the schema above
```

---

## Future Enhancements (Ideas)
- Dark mode (CSS variables already in place)
- Push notifications for daily reminders
- Chart visualizations for goal progress over time
- Multiple user support
- PWA (Progressive Web App) for offline access
