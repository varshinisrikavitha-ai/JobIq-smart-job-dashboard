/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#07111f',
        surface: 'rgba(12, 20, 36, 0.72)',
        panel: 'rgba(18, 28, 48, 0.88)',
        accent: {
          50: '#eefdf7',
          100: '#d6fae8',
          200: '#acf4cf',
          300: '#77ebb0',
          400: '#40d48b',
          500: '#18b96a',
          600: '#118555',
          700: '#0e6845',
          800: '#0d5239',
          900: '#0a432f'
        }
      },
      boxShadow: {
        glass: '0 20px 80px rgba(0, 0, 0, 0.35)'
      },
      backgroundImage: {
        'dashboard-grid': 'radial-gradient(circle at top left, rgba(64, 212, 139, 0.22), transparent 26%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.14), transparent 28%), linear-gradient(180deg, rgba(7, 17, 31, 0.92), rgba(5, 10, 20, 1))'
      },
      dropShadow: {
        glow: '0 0 24px rgba(64, 212, 139, 0.22)'
      }
    }
  },
  plugins: []
};