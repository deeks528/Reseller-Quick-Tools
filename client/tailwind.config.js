/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../shared/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f4f7f6',
          100: '#e3ede9',
          200: '#c5d9d2',
          500: '#0e3d34',
          600: '#0a2e27',
          700: '#07231e',
          800: '#051915',
          900: '#03100e'
        },
        cream: {
          DEFAULT: '#faf9f6',
          subtle: '#fdfcf9',
          dark: '#f3efe8',
          border: '#e8e5de'
        },
        gold: {
          DEFAULT: '#b88a3b',
          light: '#e0b567',
          dark: '#936a25'
        },
        reseller: {
          bg: '#faf9f6',
          text: '#17221f',
          muted: '#687570',
          border: '#e7e4dc',
          'border-light': '#f0ede6',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace']
      },
      borderRadius: {
        '18': '18px',
        '22': '20px'
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 2px 14px -2px rgba(15, 35, 30, 0.04), 0 1px 3px 0 rgba(15, 35, 30, 0.02)',
        'float': '0 8px 30px -4px rgba(15, 35, 30, 0.08)'
      }
    },
  },
  plugins: [],
}
