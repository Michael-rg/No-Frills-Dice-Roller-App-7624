/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce 2s infinite',
      },
      boxShadow: {
        '3d': '4px 4px 8px rgba(0, 0, 0, 0.2), inset -2px -2px 4px rgba(0, 0, 0, 0.1)',
        '3d-hover': '6px 6px 12px rgba(0, 0, 0, 0.25), inset -3px -3px 6px rgba(0, 0, 0, 0.15)',
      }
    },
  },
  plugins: [],
}