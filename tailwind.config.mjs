/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-instrument)', 'Georgia', 'serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#0a0a0b',
          2: '#111113',
          3: '#1a1a1e',
          4: '#222228',
        },
        border: {
          DEFAULT: '#2a2a32',
          2: '#3a3a45',
        },
        accent: {
          DEFAULT: '#e8d5a3',
          2: '#c4a96b',
          3: '#8b6914',
        },
      },
    },
  },
  plugins: [],
};
