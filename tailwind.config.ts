import type { Config } from 'tailwindcss';
const { fontFamily } = require('tailwindcss/defaultTheme');

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: Royal/Azure Blue
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Main royal blue
          600: '#2563eb',
          700: '#1d4ed8', // Darker panels
          800: '#1e40af',
          900: '#1e3a8a', // Deep navy (labels)
          950: '#172554',
        },
        // Accent: Warm Saffron/Yellow
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24', // Main saffron
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Neutrals
        neutral: {
          ice: '#f8fafc', // Ice white
          light: '#f1f5f9', // Light gray
          DEFAULT: '#e2e8f0',
          dark: '#64748b',
        },
        // Text colors
        text: {
          hero: '#ffffff', // White for hero headlines
          label: '#1e3a8a', // Deep navy for labels
          body: '#334155', // Slate for body text
          muted: '#64748b',
        },
        // Background
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        // Single clean sans-serif for minimal design
        sans: ['var(--font-inter)', 'Inter', ...fontFamily.sans],
      },
      borderRadius: {
        card: '1.5rem', // Big radius for browser-card container
        pill: '9999px', // Pill buttons
      },
      boxShadow: {
        // Minimal subtle shadows
        card: '0 1px 3px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
        product: '0 1px 2px rgba(0, 0, 0, 0.04)',
        'product-hover': '0 4px 8px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        // Textured blue background gradient
        'hero-gradient':
          'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #1d4ed8 100%)',
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        'fade-underline': {
          '0%': { width: '0%', opacity: '0' },
          '100%': { width: '100%', opacity: '1' },
        },
        'carousel-rotate': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-360deg)' },
        },
      },
      animation: {
        lift: 'lift 0.2s ease-out forwards',
        'fade-underline': 'fade-underline 0.3s ease-out forwards',
        'carousel-rotate': 'carousel-rotate 60s infinite linear',
      },
    },
  },
  plugins: [],
} satisfies Config;
