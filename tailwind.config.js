/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('nativewind/preset')],
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}', './App.tsx'],
  theme: {
    extend: {
      colors: {
        primary: '#6C3FC5',
        secondary: '#0EA5E9',
        background: '#0D0F1A',
        card: '#1E2440',
      },
    },
  },
  plugins: [],
};
