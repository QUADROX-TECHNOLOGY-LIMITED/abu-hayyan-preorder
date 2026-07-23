import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // This wildcard guarantees Tailwind scans every single file inside src
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#060B19', 
          800: '#0F172A',
          700: '#1E293B',
        },
        amber: {
          400: '#FFBF00', 
          500: '#D4AF37', 
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
export default config;