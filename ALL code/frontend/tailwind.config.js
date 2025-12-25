/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0B0C15',
        'cyber-dark': '#12131E',
        'cyber-gray': '#1A1B2E',
        'cyber-slate': '#252640',
        'cyber-cyan': '#00FFFF',
        'cyber-blue': '#00BFFF',
        'cyber-purple': '#BC13FE',
        'cyber-magenta': '#FF00FF',
        'cyber-violet': '#8B5CF6',
        'cyber-gold': '#FFD700',
        'cyber-green': '#00FF88',
        'cyber-white': '#FFFFFF',
        'cyber-muted': '#8F90A6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
