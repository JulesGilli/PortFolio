/**
 * "Tourner la page": a full panel in the current spot colour sweeps left→right,
 * the content is swapped while it covers the screen, then it leaves to the right.
 * One instance lives in App; everything else calls turn(swap).
 */

type Listener = (phase: 'in' | 'out' | null) => void;
const listeners = new Set<Listener>();
let busy = false;

export function subscribeTurn(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

const emit = (p: 'in' | 'out' | null) => listeners.forEach((l) => l(p));

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Run `swap` while the page is covered. Resolves when the panel has left. */
export function turn(swap: () => void): Promise<void> {
  if (reduced() || busy) {
    swap();
    return Promise.resolve();
  }
  busy = true;
  emit('in');
  return new Promise((resolve) => {
    window.setTimeout(() => {
      swap();
      emit('out');
      window.setTimeout(() => {
        emit(null);
        busy = false;
        resolve();
      }, 400);
    }, 420);
  });
}
