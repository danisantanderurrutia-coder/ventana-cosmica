/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#FAF9F6',   // High-end warm alabaster
          100: '#F4F1EA',  // Surface tint
          150: '#EFECE2',  // Card background
          200: '#E5E0D5',  // Hairline borders
          300: '#D5CFC3',  // Dividers
          700: '#57534E',
          800: '#292524',
          900: '#1C1917',  // Deep mineral ink
        },
        editorial: {
          blue: '#1E40AF',
          purple: '#6B21A8',
          emerald: '#047857',
          crimson: '#B91C1C',
        }
      },
      fontFamily: {
        serif: ['Newsreader', 'Charter', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'paper-sm': '0 1px 2px 0 rgba(28, 25, 23, 0.04)',
        'paper-md': '0 4px 12px -2px rgba(28, 25, 23, 0.06), 0 2px 6px -1px rgba(28, 25, 23, 0.03)',
        'paper-lg': '0 12px 28px -4px rgba(28, 25, 23, 0.08), 0 4px 12px -2px rgba(28, 25, 23, 0.03)',
      }
    },
  },
  plugins: [],
}
