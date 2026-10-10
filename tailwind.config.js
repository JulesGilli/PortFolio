/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    // Print system: no radius, no shadow, no gradient.
    borderRadius: { none: '0', DEFAULT: '0', full: '0' },
    boxShadow: { none: 'none', DEFAULT: 'none' },
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        ink2: 'var(--ink2)',
        spot: 'var(--spot)',
        onspot: 'var(--on-spot)',
        rule: 'var(--rule)',
      },
      fontFamily: {
        archivo: ['"Archivo Variable"', 'Archivo', 'Arial Narrow', 'Arial', 'sans-serif'],
        news: ['"Newsreader Variable"', 'Newsreader', 'Georgia', 'serif'],
      },
      maxWidth: { page: '1344px' },
      spacing: { gutter: '24px', margin: '48px' },
      transitionTimingFunction: { print: 'cubic-bezier(0.76, 0, 0.24, 1)' },
    },
  },
  plugins: [],
}
