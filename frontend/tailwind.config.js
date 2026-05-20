/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monochrome Editorial Palette
        mono: {
          0: '#000000',
          50: '#050505',
          100: '#0a0a0a',
          200: '#111111',
          300: '#1a1a1a',
          400: '#222222',
          500: '#333333',
          600: '#444444',
          700: '#525252',
          800: '#737373',
          900: '#a3a3a3',
          950: '#eeeeee',
          1000: '#ffffff',
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        'sans': ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['"JetBrains Mono"', 'monospace'],
        'editorial': ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['6rem', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-sm': ['4.5rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'h1': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        'h2': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h3': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'small': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        'editorial': '18px',
        'editorial-sm': '12px',
        'editorial-lg': '24px',
      },
      boxShadow: {
        'mono': '0 1px 3px rgba(255, 255, 255, 0.03)',
        'mono-md': '0 4px 16px rgba(255, 255, 255, 0.04)',
        'mono-lg': '0 8px 32px rgba(255, 255, 255, 0.05)',
        'mono-xl': '0 16px 64px rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 5s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
