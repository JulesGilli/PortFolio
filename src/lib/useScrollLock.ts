import { useEffect } from 'react';

let locks = 0;

/** Locks page scroll while `active`. Reference counted so nested overlays behave. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    locks += 1;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      locks -= 1;
      if (locks === 0) document.documentElement.style.overflow = prev;
    };
  }, [active]);
}
