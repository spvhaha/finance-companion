// Seeded random number generator for consistent daily content
export function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Get a date-based seed (same number all day, changes tomorrow)
export function getDailySeed(): number {
  const today = new Date();
  return today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
}

// Get a week-based seed (same number all week, changes Monday)
export function getWeeklySeed(): number {
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 1);
  const diff = today.getTime() - startOfYear.getTime();
  const weekNumber = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
  return today.getFullYear() * 100 + weekNumber;
}

// Get time-of-day greeting
export function getGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  let greeting: string;
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';
  else greeting = 'Good evening';
  return name ? `${greeting}, ${name}` : greeting;
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Get today's date string
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Get this week's date string (Monday of current week)
export function getWeekString(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  return monday.toISOString().split('T')[0];
}
