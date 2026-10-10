import { useCallback, useEffect, useState } from 'react';
import { bySlug, type Game } from '../data/games';

/** Minimal history router: "/" or "/jeux/<slug>". */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function gamePath(slug: string) {
  return `${BASE}/jeux/${slug}`;
}

function read(): Game | null {
  if (typeof window === 'undefined') return null;
  const m = window.location.pathname.replace(BASE, '').match(/^\/jeux\/([a-z0-9-]+)\/?$/);
  return m ? bySlug(m[1]) ?? null : null;
}

export function useRoute() {
  const [game, setGame] = useState<Game | null>(read);

  useEffect(() => {
    const onPop = () => setGame(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const open = useCallback((g: Game) => {
    window.history.pushState({ slug: g.slug }, '', gamePath(g.slug));
    setGame(g);
  }, []);

  const close = useCallback(() => {
    if (window.history.state?.slug) window.history.back();
    else {
      window.history.replaceState(null, '', `${BASE}/`);
      setGame(null);
    }
  }, []);

  return { game, open, close };
}
