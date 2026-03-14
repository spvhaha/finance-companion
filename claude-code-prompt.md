# CLAUDE CODE PROMPT — Financial Companion App
# Copy everything below and paste into your terminal with Claude Code

---

Build me a full-stack personal financial companion web app using Next.js 14 (App Router) + Tailwind CSS + SQLite (via better-sqlite3 for simplicity). This is a daily-use app that gives personalized financial advice to two types of investors.

## Project setup
- Next.js 14 with App Router
- Tailwind CSS for styling
- better-sqlite3 for local persistent storage (no external DB needed)
- Anthropic SDK (@anthropic-ai/sdk) for AI-powered Q&A
- Deploy-ready with `npm run build && npm start`

## Two user profiles

**Profile A: "Growth Explorer" (age 20s-30s)**
- Beginner investor, 30-40 year horizon
- High risk tolerance, focused on learning & growing wealth
- Canadian context (TFSA, RRSP, CPP)
- Color accent: Purple (#7F77DD)

**Profile B: "Steady Protector" (age 50s-60s)**
- Pre-retirement investor, 5-15 year horizon
- Low-moderate risk tolerance, capital preservation & income
- Canadian context (TFSA, RRSP, CPP, OAS, GICs)
- Color accent: Teal (#1D9E75)

## Pages & features

### 1. Onboarding (first visit only)
- Friendly welcome screen with app description
- Two large cards to pick profile type
- Save choice to DB, redirect to dashboard
- Option to set a name (optional, for personalized greetings)

### 2. Dashboard / Home (`/`)
- Personalized greeting (time of day + name if set)
- **Daily tip card**: Rotate through 20+ tips per profile using date-based seed (same tip all day, new one tomorrow). Tips must be practical and specific — not generic advice.
- **Weekly challenge**: One actionable challenge per week with difficulty badge and reward description. "Mark complete" button.
- **Stats bar**: Visit streak (consecutive days), challenges completed, active goals
- **Goal progress preview**: Top 3 goals with mini progress bars

### 3. Goals page (`/goals`)
- CRUD for savings goals: name, target amount, current amount
- Progress bar per goal with percentage
- Quick-add buttons: +$50, +$100, +$500
- Celebration animation when goal reaches 100%
- Suggested goal templates per profile:
  - Young: "Emergency fund $5,000", "Max TFSA $7,000", "First investment $1,000"
  - Senior: "2-year cash buffer $80,000", "Estate plan fund $5,000", "Travel fund $10,000"

### 4. Journal page (`/journal`)
- Text entry with auto date stamp
- Reverse chronological list
- Writing prompts: "What money decision did you make today?", "What did you learn about finance this week?"
- Edit and delete entries

### 5. Ask Me page (`/ask`) — AI-powered Q&A
- Text input for any financial question
- **Suggestion chips** (clickable common questions):
  - Young: "Should I pay off debt or invest?", "How much should I save monthly?", "What is an ETF?", "How do index funds work?", "What's the 50/30/20 rule?"
  - Senior: "When should I take CPP?", "What's a safe withdrawal rate?", "How do I protect against inflation?", "Should I pay off my mortgage?", "What are GIC ladders?"
- API route (`/api/ask`) that calls Anthropic API:
  ```javascript
  import Anthropic from '@anthropic-ai/sdk';
  const client = new Anthropic(); // uses ANTHROPIC_API_KEY env var

  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a warm, friendly financial well-wisher — like a wise older sibling who knows a lot about money. The user is a ${profileContext}. Keep answers simple, practical, under 200 words. Use everyday language, not jargon. Canadian financial context (TFSA, RRSP, CPP). Always note you're not a licensed financial advisor.`,
    messages: [{ role: "user", content: question }]
  });
  ```
- Show loading spinner while waiting
- Display response in a styled card
- Save Q&A history so user can review past answers

### 6. Settings page (`/settings`)
- Current profile with switch option
- All stats displayed
- Option to set/change name
- Export data (JSON download)
- Reset all data (with confirmation)
- Disclaimer about educational content

## Database schema (SQLite)

```sql
CREATE TABLE profile (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL, -- 'young' or 'senior'
  name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  target REAL NOT NULL,
  current REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE journal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  challenge_date TEXT NOT NULL UNIQUE,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE streaks (
  id INTEGER PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  last_visit TEXT
);

CREATE TABLE ask_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Content pools — embed these in a `lib/content.ts` file

Include at least 20 tips and 8 challenges PER profile. Here are seeds:

### Young investor tips:
1. "Pay yourself first" — Auto-save 20% on payday before anything else
2. "The latte factor" — $5/day = $1,825/yr. At 8% for 30 years = $200K+
3. "Index funds beat 90% of pros" — Over 15 years, most managers lose to S&P 500
4. "Your credit score is your financial GPA" — Pay on time, keep usage under 30%
5. "Automate everything" — Set up auto-transfers on payday
6. "Compound interest magic" — $10K at 8% untouched = $100K in 30 years
7. "TFSA is your best friend" — Tax-free growth in Canada, max it out first
8. "Never panic sell" — 2020 crash recovered in 5 months
9. "Dollar-cost averaging" — Same amount monthly regardless of market
10. "Avoid lifestyle inflation" — When salary goes up, invest the raise
11. "Build 3-month emergency fund first" — Before aggressive investing
12. "High-interest debt is an emergency" — Pay 20% credit card before investing
13. "Negotiate your salary" — $5K raise invested over 40 years = $130K
14. "Read one finance book per quarter" — Start with Wealthy Barber Returns
15. "Start a side income" — $500/mo invested at 25 is life-changing by 55
16. "Don't invest money you need in 5 years" — Use savings account or GICs
17. "50/30/20 rule" — 50% needs, 30% wants, 20% savings
18. "Track net worth monthly" — Assets minus debts, most motivating habit
19. "Get basic insurance" — Tenant's + disability insurance protect earning power
20. "Your network is your net worth" — Career growth = more investable income

### Senior investor tips:
1. "Withdrawal order matters" — Non-registered → RRSP/RRIF → TFSA last
2. "Keep 30-40% stocks" — Retirement can last 30+ years, need growth for inflation
3. "Delay CPP for more" — 60→65 = +36%, 65→70 = +42%
4. "Dividend funds replace salary" — 3-4% yield gives regular income without selling
5. "Review beneficiaries annually" — Outdated designations override your will
6. "Fee-only financial planner" — No commission bias, truly in your interest
7. "GIC ladder" — 1-5 year terms for guaranteed returns with regular access
8. "Downsize strategically" — Home equity becomes income-generating portfolio
9. "Inflation is silent thief" — $50K/yr becomes $37K buying power in 10 years
10. "Estate planning now" — Will, power of attorney, healthcare directive
11. "Pension splitting" — Split eligible income with spouse to lower taxes
12. "Beware scams" — Guaranteed high returns = always a scam
13. "Stay invested in retirement" — Long-term portion should still grow
14. "Tax-loss harvesting" — Sell losers to offset gains, mind 30-day rule
15. "Consider annuity" — Guaranteed lifetime income for baseline expenses
16. "Max unused TFSA room" — Contribution room carries forward
17. "Simplify portfolio" — Consolidate scattered accounts to 1-2 funds
18. "Keep 2 years cash" — Buffer to avoid selling in downturns
19. "Budget for healthcare" — Dental, prescriptions rise sharply after 65
20. "Budget for joy" — Travel, hobbies — you earned this retirement

### Challenges (8 per profile with difficulty and reward):
Include Easy/Medium/Hard difficulty and a reward description.

## Design requirements

- **Font**: Use Google Fonts — "Source Serif 4" for headings, "DM Sans" for body
- **Palette**: Warm neutrals (#F9F8F5 background, #F1EFE8, #D3D1C7, #888780, #444441) with profile accent colors
- **Cards**: White background, subtle border, 12px radius, generous padding
- **Animations**: Subtle fade-in on page load, progress bar transitions
- **Layout**: Max-width 540px centered, mobile-first, works great on phone browsers
- **Dark mode**: Not required for v1, but use CSS variables so it's easy to add later

## Environment variables
- `ANTHROPIC_API_KEY` — for the AI Q&A feature (user sets this in .env.local)

## File structure
```
/app
  /page.tsx          -- dashboard/home
  /goals/page.tsx
  /journal/page.tsx
  /ask/page.tsx
  /settings/page.tsx
  /onboarding/page.tsx
  /api/ask/route.ts  -- AI endpoint
  /api/goals/route.ts
  /api/journal/route.ts
  /api/challenges/route.ts
  /api/profile/route.ts
  /api/streaks/route.ts
  layout.tsx
/components
  /Nav.tsx
  /TipCard.tsx
  /ChallengeCard.tsx
  /GoalCard.tsx
  /StatBar.tsx
  /AiChat.tsx
/lib
  /db.ts             -- SQLite setup & helpers
  /content.ts        -- Tips & challenges pools
  /utils.ts          -- Date helpers, seed random
/public
```

## Important
- Tone should be warm and encouraging, NEVER preachy or condescending
- All financial context is Canadian (TFSA, RRSP, CPP, OAS, GICs)
- Include clear disclaimer: "General financial education only. Not professional advice."
- The AI Q&A should have conversation history so follow-up questions work
- Streak tracking: if user visits consecutive days, streak increases. Miss a day = reset to 1
- Make it feel like a wellness app, not a Bloomberg terminal
