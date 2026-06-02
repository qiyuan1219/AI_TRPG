/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        medieval: ['"MedievalSharp"', '"Cinzel"', 'serif'],
        body: ['"Crimson Text"', 'Georgia', 'serif'],
      },
      colors: {
        gold: '#d4a843',
        'gold-light': '#f0d68a',
        'gold-dark': '#8b6914',
        stone: '#3d3226',
        'stone-light': '#e0c68c',
        'stone-dark': '#1a1510',
        parchment: '#f5e6c8',
        'parchment-dark': '#e8d5a8',
        blood: '#8b1a1a',
        'blood-light': '#c0392b',
        'shadow-purple': '#2d1b4e',
      },
      backgroundImage: {
        'dungeon': 'linear-gradient(to bottom, #1a1510, #0d0a05)',
        'royal': 'linear-gradient(135deg, #3d2616 0%, #2d1b0e 50%, #1a0f05 100%)',
        'gold-grad': 'linear-gradient(135deg, #d4a843, #8b6914)',
      },
      animation: {
        'dice-roll': 'diceRoll 1.5s ease-out',
        'torch-flicker': 'torch 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        diceRoll: {
          '0%': { transform: 'rotate(0deg) scale(0.5)' },
          '50%': { transform: 'rotate(360deg) scale(1.3)' },
          '100%': { transform: 'rotate(720deg) scale(1)' },
        },
        torch: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
