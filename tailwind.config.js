/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0b0c',
        bone: '#ece8e1',
        muted: '#8b877f',
        accent: '#d9ff4a',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'Inter', 'system-ui', 'sans-serif'],
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
