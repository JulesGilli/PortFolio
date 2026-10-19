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

function paint(c: Cahier) {
  if (typeof document === 'undefined' || current === c.id) return;
  current = c.id;
  const root = document.documentElement;
  Object.entries(cahierStyle(c)).forEach(([k, v]) => k.startsWith('--') && root.style.setProperty(k, v));
  root.dataset.cahier = c.id;
  root.style.colorScheme = c.scheme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = c.paper;
}

/** The cahier of the page under the overlays, and the overlays (dossier, player) stacked on top. */
let page: Cahier = BASE_CAHIER;
const overlays: Cahier[] = [];

const top = () => overlays[overlays.length - 1] ?? page;

/** An overlay prints the chrome with its cahier until the returned release is called. */
export function pushIssue(c: Cahier): () => void {
  const entry = { ...c };
  overlays.push(entry);
  paint(top());
  return () => {
    const i = overlays.lastIndexOf(entry);
    if (i >= 0) overlays.splice(i, 1);
    paint(top());
  };
}

/**
 * Register a section: when it covers the middle of the viewport, the chrome takes its cahier.
 * While an overlay is open the section is remembered but nothing flips underneath it.
 */
export function useCahierSection(ref: React.RefObject<HTMLElement>, cahier: Cahier) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        window.clearTimeout(t);
        t = window.setTimeout(() => {
          page = cahier;
          paint(top());
        }, 80);
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    io.observe(el);
    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, [ref, cahier]);
}
