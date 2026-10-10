/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--ink-rgb) / <alpha-value>)',
        bone: 'rgb(var(--bone-rgb) / <alpha-value>)',
        muted: '#8b877f',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
        pixel: ['Silkscreen', '"Bricolage Grotesque"', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
    },
  },
  plugins: [],
}
