/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        polar: {
          950: '#070b12',
          900: '#0c1322',
          850: '#111b30',
          800: '#17243e',
          700: '#233658',
          600: '#344e7c',
          500: '#4b6ca4',
          400: '#6d8fc9',
          300: '#9db8e8',
          200: '#c8d9f6',
          100: '#e5eeff',
          50: '#f4f8ff',
        },
        aurora: {
          cyan: '#00f2fe',
          teal: '#4facfe',
          green: '#00f5a0',
          amber: '#f6d365',
          rose: '#ff5858',
          purple: '#b176ff',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aurora-glow': 'aurora 8s ease infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { opacity: '0.6', filter: 'blur(20px)' },
          '50%': { opacity: '0.9', filter: 'blur(28px)' },
        }
      }
    },
  },
  plugins: [],
}
