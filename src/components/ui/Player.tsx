import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRightIcon, XIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../../data/projects';
import { EASE } from './Reveal';
import { useLenis } from './SmoothScroll';
import { useAchievements } from './Achievements';
import { previewTheme, revertTheme } from '../../theme';

type PlayerApi = {
  /** Open the in-site player if the project can be embedded; otherwise open its itch/web page in a new tab. */
  play: (p: Project) => void;
  close: () => void;
  current: Project | null;
};

const PlayerContext = createContext<PlayerApi>({ play: () => {}, close: () => {}, current: null });
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Project | null>(null);
  const { trackPlay } = useAchievements();

  const play = useCallback(
    (p: Project) => {
      if (p.embedUrl) {
        setCurrent(p);
        previewTheme(p.theme);
      }
      else if (p.links?.demo) window.open(p.links.demo, '_blank', 'noopener,noreferrer');
      trackPlay(p.slug ?? String(p.id), !!p.featured);
    },
    [trackPlay],
  );
  const close = useCallback(() => {
    setCurrent(null);
    revertTheme();
  }, []);

  const api = useMemo(() => ({ play, close, current }), [play, close, current]);

  return (
    <PlayerContext.Provider value={api}>
      {children}
      <PlayerOverlay />
    </PlayerContext.Provider>
  );
}

function PlayerOverlay() {
  const { t } = useTranslation();
  const { current, close } = usePlayer();
  const lenis = useLenis();
  const { unlock } = useAchievements();

  // Self-hosted builds can talk to the page:
  //   window.parent.postMessage({ source: 'jules-portfolio', event: 'finished' }, '*')
  useEffect(() => {
    if (!current) return;
    const onMessage = (e: MessageEvent) => {
      const d = e.data as { source?: string; event?: string } | null;
      if (!d || d.source !== 'jules-portfolio') return;
      if (d.event === 'finished') unlock('finisher');
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [current, unlock]);

  useEffect(() => {
    if (!current) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [current, close, lenis]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-ink"
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          exit={{ clipPath: 'inset(100% 0 0 0)' }}
          transition={{ duration: 0.8, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
        >
          <div className="flex items-center justify-between gap-4 border-b border-bone/10 px-5 py-3 md:px-8">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-lg font-semibold tracking-tight">{current.title}</span>
              <span className="meta hidden sm:inline">{current.genre}</span>
            </div>
            <div className="flex items-center gap-2">
              {current.links?.demo && (
                <a
                  href={current.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor=""
                  className="meta hidden items-center gap-1 rounded-full border border-bone/20 px-3 py-1.5 !text-bone sm:inline-flex"
                >
                  itch.io <ArrowUpRightIcon size={12} />
                </a>
              )}
              <button
                type="button"
                onClick={close}
                data-cursor=""
                className="inline-flex items-center gap-2 rounded-full bg-bone py-1.5 pl-4 pr-2 text-xs font-medium text-ink"
                aria-label={t('player.close')}
              >
                {t('player.close')}
                <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-bone">
                  <XIcon size={12} />
                </span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 bg-black">
            <iframe
              key={current.id}
              src={current.embedUrl}
              title={current.title}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; gamepad; xr-spatial-tracking"
              allowFullScreen
            />
          </div>

          <div className="meta border-t border-bone/10 px-5 py-2 text-center md:px-8">{t('player.hint')}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
