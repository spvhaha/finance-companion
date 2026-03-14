import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Source Serif 4"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        background: '#F9F8F5',
        foreground: '#444441',
      },
    },
  },
  plugins: [],
};
export default config;
