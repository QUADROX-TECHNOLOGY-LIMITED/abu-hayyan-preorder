/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        book: {
          900: '#140b08', // Deepest background brown
          800: '#2a1b15', // Lighter brown for cards
          700: '#3e2a21', // Border brown
        },
        gold: {
          400: '#f9f295', // Highlight gold
          500: '#d4af37', // Base premium gold
          600: '#b8860b', // Deep bronze/gold
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}