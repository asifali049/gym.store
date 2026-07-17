import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111827',
          accent: '#22c55e',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
