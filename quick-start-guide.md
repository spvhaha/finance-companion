# Quick Start — Run This in Your Terminal

## Step 1: Create project folder
```bash
mkdir finance-companion && cd finance-companion
```

## Step 2: Start Claude Code
```bash
claude
```

## Step 3: Paste the prompt
Copy the entire contents of `claude-code-prompt.md` and paste it into Claude Code.

Claude Code will:
- Initialize the Next.js project
- Install all dependencies (next, tailwindcss, better-sqlite3, @anthropic-ai/sdk)
- Create all pages, components, API routes, and database
- Set up the content pools with 40+ tips and 16+ challenges

## Step 4: Set your API key
```bash
# Create .env.local in project root
echo "ANTHROPIC_API_KEY=your-key-here" > .env.local
```

Get your API key from: https://console.anthropic.com/settings/keys

## Step 5: Run the app
```bash
npm run dev
```

Open http://localhost:3000 in your browser — done!

## Step 6: Use on your phone (same Wi-Fi)
Find your computer's local IP:
```bash
# Mac
ipconfig getifaddr en0

# Windows
ipv4 address from: ipconfig

# Linux
hostname -I
```
Then open `http://YOUR-IP:3000` on your phone browser.

## Optional: Deploy for free
If you want a real URL you can access anywhere:
```bash
# Ask Claude Code:
"Help me deploy this to Vercel for free"
```
Note: For Vercel, you'd need to switch from SQLite to a cloud DB (like Turso or Supabase). Claude Code can help with that migration.
