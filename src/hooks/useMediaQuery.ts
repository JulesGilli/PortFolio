import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  const [matches, setMatches] = useState(get);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');
export const useFinePointer = () => useMediaQuery('(pointer: fine)');
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
