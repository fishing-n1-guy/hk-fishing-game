/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: '#e0f2fe',
          100: '#bae6fd',
          200: '#7dd3fc',
          300: '#38bdf8',
          400: '#0ea5e9',
          500: '#0284c7',
          600: '#0369a1',
          700: '#075985',
          800: '#0c4a6e',
          900: '#082f49',
        },
        sand: {
          50: '#fef9e7',
          100: '#fdf3c4',
          200: '#fce685',
          300: '#fcd34d',
        },
        wood: {
          light: '#deb887',
          DEFAULT: '#a0826d',
          dark: '#5d4037',
        },
      },
      fontFamily: {
        cn: ['"PingFang TC"', '"Microsoft JhengHei"', '"Noto Sans TC"', 'sans-serif'],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        swim1: 'swim1 8s linear infinite',
        swim2: 'swim2 12s linear infinite',
        swim3: 'swim3 10s linear infinite',
        wiggle: 'wiggle 2s ease-in-out infinite',
        ripple: 'ripple 3s ease-out infinite',
        bob: 'bob 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        swim1: {
          '0%': { transform: 'translate(-30px, 0)' },
          '50%': { transform: 'translate(calc(100vw + 30px), -10px)' },
          '100%': { transform: 'translate(-30px, 0)' },
        },
        swim2: {
          '0%': { transform: 'translate(30px, 0) scaleX(-1)' },
          '50%': { transform: 'translate(calc(-100vw - 30px), 15px) scaleX(-1)' },
          '100%': { transform: 'translate(30px, 0) scaleX(-1)' },
        },
        swim3: {
          '0%': { transform: 'translate(-50px, 0)' },
          '50%': { transform: 'translate(calc(100vw + 50px), 20px)' },
          '100%': { transform: 'translate(-50px, 0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.5)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        bob: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
    },
  },
  plugins: [],
}