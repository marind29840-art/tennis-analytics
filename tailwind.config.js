/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#020617',
        },
        // Tennis-themed accents
        ball: {
          DEFAULT: '#ccff00',
          50:  '#f7ffd9',
          100: '#eeff8a',
          200: '#e0ff52',
          300: '#ccff00',  // Pantone-ish tennis ball
          400: '#a3d600',
          500: '#7ba600',
          600: '#5e7d00',
        },
        court: {
          clay:   '#c66d3c',  // terre battue
          hard:   '#1f5fa8',  // dur (US Open / AO blue)
          grass:  '#3c8c3a',  // gazon
          carpet: '#7c3aed',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-25%)' },
        },
        ballSpin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'ball-bounce': 'bounce 0.8s ease-in-out infinite',
        'ball-spin':   'ballSpin 8s linear infinite',
      },
    },
  },
  plugins: [],
}
