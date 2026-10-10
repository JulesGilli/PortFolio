import { animate } from 'framer-motion';

/** Animated world drawn behind a game on the stage. */
export type BackdropFx = 'cover' | 'crt' | 'stars' | 'tricolor' | 'tower' | 'abyss' | 'dust';

/** Per-game look: the page re-themes itself around whichever game is on screen. */
export interface GameTheme {
  /** Accent color, hex */
  accent: string;
  /** Page background, hex */
  ink?: string;
  /** Display face for the game title */
  font?: 'display' | 'pixel' | 'serif';
  /** Backdrop effect on the stage */
  fx?: BackdropFx;
}

export const DEFAULT_THEME: Required<GameTheme> = {
  accent: '#a66cff',
  ink: '#0b0b0c',
  font: 'display',
  fx: 'dust',
};

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const root = () => document.documentElement;
let current: Required<GameTheme> = DEFAULT_THEME;
const running: Array<{ stop: () => void }> = [];

function tweenVar(name: string, from: [number, number, number], to: [number, number, number], duration: number) {
  const ctrl = animate(0, 1, {
    duration,
    ease: [0.76, 0, 0.24, 1],
    onUpdate: (t) => {
      const v = from.map((f, i) => Math.round(f + (to[i] - f) * t));
      root().style.setProperty(name, v.join(' '));
    },
  });
  running.push(ctrl);
}

/** Smoothly move the whole page to a theme. Safe to call often; the last call wins. */
export function applyTheme(theme: GameTheme | undefined, duration = 0.9) {
  if (typeof document === 'undefined') return;
  const next: Required<GameTheme> = { ...DEFAULT_THEME, ...theme };
  if (next.accent === current.accent && next.ink === current.ink && next.font === current.font) return;

  running.splice(0).forEach((c) => c.stop());
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const d = reduced ? 0 : duration;

  tweenVar('--accent-rgb', hexToRgb(current.accent), hexToRgb(next.accent), d);
  tweenVar('--ink-rgb', hexToRgb(current.ink), hexToRgb(next.ink), d);
  root().dataset.font = next.font;
  current = next;
}

export const currentTheme = () => current;

let base: GameTheme | undefined;
/** The stage's theme: what the page returns to after a hover preview. */
export function setBaseTheme(theme: GameTheme | undefined) {
  base = theme;
  applyTheme(theme);
}
export const previewTheme = (theme: GameTheme | undefined) => applyTheme(theme, 0.5);
export const revertTheme = () => applyTheme(base, 0.7);
