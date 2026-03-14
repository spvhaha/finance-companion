// Tips and challenges content pools for both profile types

export const tips = {
  young: [
    { title: '"Pay yourself first"', body: 'Auto-save 20% on payday before anything else. Treat savings like a bill you can\'t skip.' },
    { title: '"The latte factor"', body: '$5/day = $1,825/yr. Invested at 8% for 30 years, that\'s over $200K. Small daily habits matter.' },
    { title: '"Index funds beat 90% of pros"', body: 'Over 15 years, most active managers lose to the S&P 500. Low-cost index funds are your friend.' },
    { title: '"Your credit score is your financial GPA"', body: 'Pay on time, keep credit utilization under 30%, and your future self will thank you.' },
    { title: '"Automate everything"', body: 'Set up auto-transfers on payday to savings & investing accounts. What you don\'t see, you don\'t spend.' },
    { title: '"Compound interest magic"', body: '$10K at 8% untouched for 30 years becomes $100K. Time is your biggest advantage — start now.' },
    { title: '"TFSA is your best friend"', body: 'Tax-free growth in Canada — no tax on withdrawals or gains. Max it out before RRSP if your income is under $60K.' },
    { title: '"Never panic sell"', body: 'The 2020 COVID crash recovered in just 5 months. Stay the course. Market drops are sales, not emergencies.' },
    { title: '"Dollar-cost averaging"', body: 'Invest the same amount monthly regardless of what the market does. You buy more when prices are low.' },
    { title: '"Avoid lifestyle inflation"', body: 'When your salary goes up, invest the raise. Live like you did last year, invest the difference.' },
    { title: '"Build 3-month emergency fund first"', body: 'Before you invest aggressively, have 3 months of expenses in a HISA. Sleep better at night.' },
    { title: '"High-interest debt is an emergency"', body: 'A 20% credit card balance is a guaranteed -20% return. Pay it off before investing a single dollar.' },
    { title: '"Negotiate your salary"', body: 'A $5K raise invested over 40 years at 7% = $130K+. One uncomfortable conversation, life-changing money.' },
    { title: '"Read one finance book per quarter"', body: 'Start with Wealthy Barber Returns by David Chilton. It\'s Canadian, funny, and actually useful.' },
    { title: '"Start a side income"', body: '$500/mo invested starting at 25 can be life-changing by 55. Side hustles fund your future freedom.' },
    { title: '"Don\'t invest money you need in 5 years"', body: 'Short-term money goes in a HISA or GICs. The stock market is for 5+ year horizons only.' },
    { title: '"50/30/20 rule"', body: '50% for needs, 30% for wants, 20% for savings and investing. Simple budgeting that actually works.' },
    { title: '"Track net worth monthly"', body: 'Assets minus debts. Watching this number grow is the most motivating financial habit you can build.' },
    { title: '"Get basic insurance"', body: 'Tenant\'s insurance + disability insurance protect your earning power. You ARE your biggest asset.' },
    { title: '"Your network is your net worth"', body: 'Career growth = more investable income. Invest in relationships and skills alongside your portfolio.' },
    { title: '"RRSP tax refund trick"', body: 'Contribute to your RRSP, get a tax refund, invest the refund in your TFSA. Double the impact.' },
    { title: '"One financial check-in per week"', body: 'Spend 15 minutes every Sunday reviewing your accounts. Awareness prevents overspending.' },
  ],
  senior: [
    { title: '"Withdrawal order matters"', body: 'Draw from non-registered first → RRSP/RRIF → TFSA last. This minimizes lifetime taxes on your savings.' },
    { title: '"Keep 30-40% in stocks"', body: 'Retirement can last 30+ years. You still need growth to outpace inflation. Don\'t go 100% bonds.' },
    { title: '"Delay CPP for more"', body: 'Taking CPP at 60 vs 65 = 36% less. Waiting to 70 gives 42% more than 65. Big guaranteed boost.' },
    { title: '"Dividend funds replace salary"', body: 'A 3-4% yield gives regular income without selling shares. Think of it as a paycheque from your portfolio.' },
    { title: '"Review beneficiaries annually"', body: 'Outdated beneficiary designations override your will. Check every account — RRSP, TFSA, insurance.' },
    { title: '"Fee-only financial planner"', body: 'No commission bias. They\'re paid by you, so they work for you. Worth every penny for a retirement plan.' },
    { title: '"GIC ladder strategy"', body: 'Split savings into 1, 2, 3, 4, 5-year GICs. Each year one matures — guaranteed returns with regular access.' },
    { title: '"Downsize strategically"', body: 'Home equity can become an income-generating portfolio. Smaller home + invested difference = more retirement income.' },
    { title: '"Inflation is the silent thief"', body: '$50K/yr buying power becomes $37K in just 10 years at 3% inflation. Your portfolio must outpace it.' },
    { title: '"Estate planning now"', body: 'Will, power of attorney, healthcare directive — do all three. Your family will thank you during a difficult time.' },
    { title: '"Pension income splitting"', body: 'Split eligible pension income with your spouse to lower your combined tax bracket. Legal and powerful.' },
    { title: '"Beware of scams"', body: 'Guaranteed high returns = always a scam. No legitimate investment promises 15%+ annually. If it sounds too good, it is.' },
    { title: '"Stay invested in retirement"', body: 'Your long-term portion (5+ years away) should still be in growth assets. Don\'t cash out everything.' },
    { title: '"Tax-loss harvesting"', body: 'Sell investments at a loss to offset capital gains. Mind the 30-day superficial loss rule in Canada.' },
    { title: '"Consider an annuity"', body: 'Guaranteed lifetime income covers your baseline expenses. Use a portion of savings for peace of mind.' },
    { title: '"Max unused TFSA room"', body: 'Contribution room carries forward from 2009. You may have $80K+ of room. Tax-free growth at any age.' },
    { title: '"Simplify your portfolio"', body: 'Consolidate scattered accounts into 1-2 balanced funds. Less complexity = fewer mistakes = lower fees.' },
    { title: '"Keep 2 years cash"', body: 'Cash buffer in a HISA means you never have to sell investments during a downturn. Sleep-well money.' },
    { title: '"Budget for healthcare"', body: 'Dental, prescriptions, and vision costs rise sharply after 65. Factor $3-5K/year into your plan.' },
    { title: '"Budget for joy"', body: 'Travel, hobbies, grandkids — you earned this retirement. The best financial plan includes living well.' },
    { title: '"OAS clawback threshold"', body: 'Keep net income below the OAS clawback threshold (~$87K). TFSA withdrawals don\'t count as income.' },
    { title: '"Prescribed rate loans"', body: 'Income splitting with a spouse using a prescribed rate loan can save significant tax in retirement.' },
  ],
};

export const challenges = {
  young: [
    { text: 'Track every dollar you spend this week in a notebook or app', difficulty: 'Easy' as const, reward: 'You\'ll discover your biggest spending leak' },
    { text: 'Set up automatic transfers to a savings account on payday', difficulty: 'Easy' as const, reward: 'Savings on autopilot — you\'ll never miss the money' },
    { text: 'Open a TFSA if you don\'t have one (or check your contribution room)', difficulty: 'Medium' as const, reward: 'Unlock Canada\'s best tax-free investing account' },
    { text: 'Calculate your net worth (add all assets, subtract all debts)', difficulty: 'Medium' as const, reward: 'A clear snapshot of where you actually stand' },
    { text: 'Read one chapter of a personal finance book this week', difficulty: 'Easy' as const, reward: 'Financial literacy compounds just like interest' },
    { text: 'Review all subscriptions and cancel at least one you don\'t use', difficulty: 'Easy' as const, reward: 'Save $10-50/month without changing your lifestyle' },
    { text: 'Research and pick one low-cost index ETF you could invest in', difficulty: 'Hard' as const, reward: 'Your first step toward building real wealth' },
    { text: 'Create a budget using the 50/30/20 rule for this month', difficulty: 'Medium' as const, reward: 'A simple framework you can actually stick to' },
  ],
  senior: [
    { text: 'Review all your account beneficiary designations this week', difficulty: 'Medium' as const, reward: 'Ensure your assets go exactly where you want' },
    { text: 'Calculate your total monthly retirement income needs', difficulty: 'Medium' as const, reward: 'Clarity on exactly how much you need to live well' },
    { text: 'Check your TFSA contribution room on CRA My Account', difficulty: 'Easy' as const, reward: 'You might have unused tax-free room to fill' },
    { text: 'Get quotes from 2 fee-only financial planners', difficulty: 'Hard' as const, reward: 'Unbiased advice that could save thousands in retirement' },
    { text: 'Organize all financial documents in one secure place', difficulty: 'Medium' as const, reward: 'Peace of mind and easier estate management' },
    { text: 'Run the CPP calculator on the government website with different start ages', difficulty: 'Easy' as const, reward: 'See exactly how much more you get by delaying' },
    { text: 'Review your investment fees — are you paying over 1% MER?', difficulty: 'Medium' as const, reward: 'Switching to lower-fee funds could save $10K+ over time' },
    { text: 'Have "the money talk" with your partner or adult children', difficulty: 'Hard' as const, reward: 'Alignment and transparency reduce family stress enormously' },
  ],
};

export const writingPrompts = [
  'What money decision did you make today?',
  'What did you learn about finance this week?',
  'What\'s one financial goal you\'re proud of?',
  'What financial worry keeps you up at night?',
  'Describe your relationship with money in three words.',
  'What would you do with an extra $10,000?',
  'What\'s the best financial advice you\'ve ever received?',
  'What spending brings you the most joy?',
];

export const suggestionChips = {
  young: [
    'Should I pay off debt or invest?',
    'How much should I save monthly?',
    'What is an ETF?',
    'How do index funds work?',
    'What\'s the 50/30/20 rule?',
    'How does a TFSA work?',
    'Should I contribute to RRSP or TFSA first?',
    'How do I start investing with $100?',
  ],
  senior: [
    'When should I take CPP?',
    'What\'s a safe withdrawal rate?',
    'How do I protect against inflation?',
    'Should I pay off my mortgage?',
    'What are GIC ladders?',
    'How does OAS clawback work?',
    'What\'s the best withdrawal order?',
    'Should I convert my RRSP to a RRIF?',
  ],
};

export const goalTemplates = {
  young: [
    { name: 'Emergency fund', target: 5000 },
    { name: 'Max TFSA this year', target: 7000 },
    { name: 'First investment', target: 1000 },
  ],
  senior: [
    { name: '2-year cash buffer', target: 80000 },
    { name: 'Estate plan fund', target: 5000 },
    { name: 'Travel fund', target: 10000 },
  ],
};
