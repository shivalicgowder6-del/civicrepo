/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0b1120',
        'dark-card': '#111827',
        'blue-glow': '#3b82f6',
      },
      boxShadow: {
        glow: '0 0 20px rgba(59,130,246,0.4)',
      },
    },
  },
  plugins: [],
}
