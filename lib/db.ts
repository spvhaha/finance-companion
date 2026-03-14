import { createClient } from '@libsql/client';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

let initialized = false;

async function ensureInit() {
  if (initialized) return;
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS goals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      target REAL NOT NULL,
      current REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS journal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_date TEXT NOT NULL UNIQUE,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS streaks (
      id INTEGER PRIMARY KEY,
      current_streak INTEGER DEFAULT 0,
      last_visit TEXT
    );
    CREATE TABLE IF NOT EXISTS ask_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  initialized = true;
}

// Profile helpers
export async function getProfile() {
  await ensureInit();
  const result = await db.execute('SELECT * FROM profile WHERE id = 1');
  return result.rows[0] as unknown as { id: number; type: string; name: string | null; created_at: string } | undefined;
}

export async function createProfile(type: string, name?: string) {
  await ensureInit();
  await db.execute({ sql: 'INSERT OR REPLACE INTO profile (id, type, name) VALUES (1, ?, ?)', args: [type, name || null] });
}

export async function updateProfile(type?: string, name?: string) {
  await ensureInit();
  const profile = await getProfile();
  if (!profile) return;
  await db.execute({ sql: 'UPDATE profile SET type = ?, name = ? WHERE id = 1', args: [type || profile.type, name !== undefined ? name : profile.name] });
}

// Goals helpers
export async function getGoals() {
  await ensureInit();
  const result = await db.execute('SELECT * FROM goals ORDER BY created_at DESC');
  return result.rows as unknown as Array<{ id: number; name: string; target: number; current: number; created_at: string }>;
}

export async function createGoal(name: string, target: number) {
  await ensureInit();
  await db.execute({ sql: 'INSERT INTO goals (name, target) VALUES (?, ?)', args: [name, target] });
}

export async function updateGoal(id: number, current: number) {
  await ensureInit();
  await db.execute({ sql: 'UPDATE goals SET current = ? WHERE id = ?', args: [current, id] });
}

export async function deleteGoal(id: number) {
  await ensureInit();
  await db.execute({ sql: 'DELETE FROM goals WHERE id = ?', args: [id] });
}

// Journal helpers
export async function getJournalEntries() {
  await ensureInit();
  const result = await db.execute('SELECT * FROM journal ORDER BY created_at DESC');
  return result.rows as unknown as Array<{ id: number; text: string; created_at: string }>;
}

export async function createJournalEntry(text: string) {
  await ensureInit();
  await db.execute({ sql: 'INSERT INTO journal (text) VALUES (?)', args: [text] });
}

export async function updateJournalEntry(id: number, text: string) {
  await ensureInit();
  await db.execute({ sql: 'UPDATE journal SET text = ? WHERE id = ?', args: [text, id] });
}

export async function deleteJournalEntry(id: number) {
  await ensureInit();
  await db.execute({ sql: 'DELETE FROM journal WHERE id = ?', args: [id] });
}

// Challenge helpers
export async function getCompletedChallenges() {
  await ensureInit();
  const result = await db.execute('SELECT * FROM challenges ORDER BY challenge_date DESC');
  return result.rows as unknown as Array<{ id: number; challenge_date: string; completed_at: string }>;
}

export async function completeChallenge(date: string) {
  await ensureInit();
  await db.execute({ sql: 'INSERT OR IGNORE INTO challenges (challenge_date) VALUES (?)', args: [date] });
}

// Streak helpers
export async function getStreak() {
  await ensureInit();
  const result = await db.execute('SELECT * FROM streaks WHERE id = 1');
  const row = result.rows[0] as unknown as { id: number; current_streak: number; last_visit: string } | undefined;
  return row || { current_streak: 0, last_visit: null };
}

export async function updateStreak() {
  await ensureInit();
  const today = new Date().toISOString().split('T')[0];
  const streak = await getStreak();

  if (streak.last_visit === today) return streak;

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak: number;

  if (streak.last_visit === yesterday) {
    newStreak = streak.current_streak + 1;
  } else {
    newStreak = 1;
  }

  await db.execute({ sql: 'INSERT OR REPLACE INTO streaks (id, current_streak, last_visit) VALUES (1, ?, ?)', args: [newStreak, today] });
  return { current_streak: newStreak, last_visit: today };
}

// Ask history helpers
export async function getAskHistory() {
  await ensureInit();
  const result = await db.execute('SELECT * FROM ask_history ORDER BY created_at DESC');
  return result.rows as unknown as Array<{ id: number; question: string; answer: string; created_at: string }>;
}

export async function saveAskHistory(question: string, answer: string) {
  await ensureInit();
  await db.execute({ sql: 'INSERT INTO ask_history (question, answer) VALUES (?, ?)', args: [question, answer] });
}

// Data export
export async function exportAllData() {
  return {
    profile: await getProfile(),
    goals: await getGoals(),
    journal: await getJournalEntries(),
    challenges: await getCompletedChallenges(),
    streaks: await getStreak(),
    askHistory: await getAskHistory(),
  };
}

// Reset all data
export async function resetAllData() {
  await ensureInit();
  await db.executeMultiple(`
    DELETE FROM profile;
    DELETE FROM goals;
    DELETE FROM journal;
    DELETE FROM challenges;
    DELETE FROM streaks;
    DELETE FROM ask_history;
  `);
}
