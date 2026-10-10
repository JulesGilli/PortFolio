import { useEffect } from 'react';
import { BASE_CAHIER, type Cahier } from './data/games';

/**
 * The "issue" is the set of print tokens the chrome of the site (header, selection,
 * toasts, theme-color) is currently printed with. Sections carry their own paper
 * statically; this only follows whichever cahier covers the middle of the viewport.
 * The swap is a hard cut: no colour is ever interpolated.
 */

const VARS: Array<[keyof Cahier, string]> = [
  ['paper', '--paper'],
  ['ink', '--ink'],
  ['ink2', '--ink2'],
  ['spot', '--spot'],
  ['onSpot', '--on-spot'],
  ['rule', '--rule'],
];

/** Inline style for a section printed on its own cahier. */
export function cahierStyle(c: Cahier): Record<string, string> {
  const style: Record<string, string> = {};
  for (const [k, v] of VARS) style[v] = String(c[k]);
  style['--rule-w'] = `${c.ruleWidth}px`;
  style['--mast-wdth'] = String(c.mast.wdth);
  style['--mast-wght'] = String(c.mast.wght);
  style['--mast-size'] = c.mast.size;
  style['--mast-tracking'] = c.mast.tracking;
  style.colorScheme = c.scheme;
  return style;
}

let current: Cahier['id'] | null = null;

export function applyIssue(c: Cahier) {
  if (typeof document === 'undefined' || current === c.id) return;
  current = c.id;
  const root = document.documentElement;
  Object.entries(cahierStyle(c)).forEach(([k, v]) => k.startsWith('--') && root.style.setProperty(k, v));
  root.dataset.cahier = c.id;
  root.style.colorScheme = c.scheme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = c.paper;
}

export const resetIssue = () => applyIssue(BASE_CAHIER);

/**
 * Register a section: when it covers the middle of the viewport, the chrome takes its cahier.
 * `locked` (player or dossier open) freezes the observer so nothing flips underneath an overlay.
 */
export function useCahierSection(ref: React.RefObject<HTMLElement>, cahier: Cahier, locked = false) {
  useEffect(() => {
    const el = ref.current;
    if (!el || locked) return;
    let t: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        window.clearTimeout(t);
        t = window.setTimeout(() => applyIssue(cahier), 80);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    io.observe(el);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [ref, cahier, locked]);
}
