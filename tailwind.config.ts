import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#08080F',
          surface: '#0F0F1A',
          card: '#141420',
          'card-hover': '#1A1A2C',
        },
        purple: {
          bright: '#C4B5FD',
          mid: '#A78BFA',
          dim: '#7C3AED',
        },
        pink: {
          soft: '#F0ABFC',
        },
        teal: {
          soft: '#5EEAD4',
        },
        amber: {
          soft: '#FCD34D',
        },
        green: {
          soft: '#86EFAC',
        },
        text: {
          primary: '#F0EEFF',
          secondary: '#9B97B8',
          muted: '#4A4865',
        },
      },
      fontFamily: {
        display: ['Clash Display', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '10px',
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '56px',
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(167,139,250,0.12)',
        'glow-md': '0 0 50px rgba(167,139,250,0.18)',
        'glow-lg': '0 0 100px rgba(167,139,250,0.25)',
      },
      animation: {
        'mesh-shift': 'meshShift 20s infinite alternate ease-in-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'typewriter': 'typewriter 0.05s steps(1) forwards',
      },
      keyframes: {
        meshShift: {
          '0%': { backgroundPosition: '15% 60%, 85% 25%, 50% 90%' },
          '100%': { backgroundPosition: '20% 55%, 80% 30%, 55% 85%' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
}

export default config
