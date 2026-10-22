import { useCallback, useEffect, useState } from 'react';
import { bySlug, type Game } from '../data/games';
import i18n from '../i18n';

/**
 * Minimal history router: "/" or "/jeux/<slug>/", each optionally under "/en".
 * The URL carries the language (FR at the root, EN under /en/) so both versions can be indexed.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const EN = /^\/en(?=\/|$)/;

/** Set by the pre-renderer, which has no window. */
let serverPath: string | null = null;
export function setServerPath(path: string) {
  serverPath = path;
}

function currentPath(): string {
  if (serverPath !== null) return serverPath;
  return typeof window === 'undefined' ? '/' : window.location.pathname.replace(BASE, '') || '/';
}

/** "/en" when the URL is the English edition, "" otherwise. */
export function langPrefix(path = currentPath()): '' | '/en' {
  return EN.test(path) ? '/en' : '';
}

export function gamePath(slug: string) {
  return `${BASE}${langPrefix()}/jeux/${slug}/`;
}

function read(): Game | null {
  const m = (currentPath().replace(EN, '') || '/').match(/^\/jeux\/([a-z0-9-]+)\/?$/);
  return m ? bySlug(m[1]) ?? null : null;
}

/** Keep the URL's edition in step with the language picked in the selector (ES/DE have no edition). */
export function syncLangPath(lng: string) {
  if (typeof window === 'undefined' || (lng !== 'fr' && lng !== 'en')) return;
  const path = currentPath();
  const want = lng === 'en' ? '/en' : '';
  if (langPrefix(path) === want) return;
  const rest = path.replace(EN, '') || '/';
  window.history.replaceState(window.history.state, '', `${BASE}${want}${rest}${window.location.hash}`);
}

export function useRoute() {
  const [game, setGame] = useState<Game | null>(read);

  useEffect(() => {
    const onPop = () => {
      // an entry pushed before a language switch carries the old edition
      syncLangPath(i18n.resolvedLanguage || i18n.language);
      setGame(read());
    };
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
      window.history.replaceState(null, '', `${BASE}${langPrefix()}/`);
      setGame(null);
    }
  }, []);

  return { game, open, close };
}
