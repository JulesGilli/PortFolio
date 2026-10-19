import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cahierOf, shotSrc, type Game } from '../../data/games';
import { cahierStyle, pushIssue } from '../../issue';
import { turn } from '../../lib/turn';
import { useScrollLock } from '../../lib/useScrollLock';
import { useDialogFocus } from '../../lib/useDialogFocus';
import { useAchievements } from './Achievements';

type PlayerApi = {
  /** Open the in-site player for a game that has a build; otherwise open its itch page. */
  play: (g: Game) => void;
  close: () => void;
  current: Game | null;
};

const Ctx = createContext<PlayerApi>({ play: () => {}, close: () => {}, current: null });
export const usePlayer = () => useContext(Ctx);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Game | null>(null);
  const { trackPlay } = useAchievements();

  const play = useCallback(
    (g: Game) => {
      trackPlay(g.slug, !!g.featured);
      if (g.build) {
        turn(() => setCurrent(g));
      } else if (g.itch) {
        window.open(g.itch, '_blank', 'noopener,noreferrer');
      }
    },
    [trackPlay],
  );
  const close = useCallback(() => {
    turn(() => setCurrent(null));
  }, []);

  const api = useMemo(() => ({ play, close, current }), [play, close, current]);
  return (
    <Ctx.Provider value={api}>
      {children}
      {current && <PlayerOverlay game={current} onClose={close} />}
    </Ctx.Provider>
  );
}

/**
 * The player: a cartridge screen first (what, controls, build size), then the build
 * in an iframe. Printed on the game's paper. The page behind never flips while it is open.
 */
function PlayerOverlay({ game, onClose }: { game: Game; onClose: () => void }) {
  const { t } = useTranslation();
  const { unlock } = useAchievements();
  const cahier = cahierOf(game);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const touchOnly = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
  useScrollLock(true);
  useDialogFocus(ref);

  useEffect(() => pushIssue(cahier), [cahier]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    // A self-hosted build can talk to the page:
    //   window.parent.postMessage({ source: 'jules-portfolio', event: 'finished' | 'escape' }, '*')
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      const d = e.data as { source?: string; event?: string } | null;
      if (!d || d.source !== 'jules-portfolio') return;
      if (d.event === 'finished') unlock('finisher');
      if (d.event === 'escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onMessage);
    };
  }, [onClose, unlock]);

  useEffect(() => {
    if (loaded) frame.current?.focus();
  }, [loaded]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${import.meta.env.BASE_URL}jeux/${game.slug}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* no clipboard */
    }
  };

  const shot = game.shots[0];

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={game.title}
      tabIndex={-1}
      style={cahierStyle(cahier) as CSSProperties}
      className="fixed inset-0 z-[80] flex flex-col bg-paper text-ink outline-none"
    >
      <div className="flex h-12 items-center justify-between gap-4 border-b border-ink px-5 md:h-14 md:px-8">
        <div className="t-meta flex items-baseline gap-4">
          <span className="font-bold">{game.title}</span>
          <span className="ink2 hidden sm:inline">
            {t('index.playableHere')} · {loaded ? t('player.closeHint') : t('player.hint')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {game.itch && (
            <a href={game.itch} target="_blank" rel="noopener noreferrer" className="t-ui u-link hidden sm:inline">
              itch.io ↗
            </a>
          )}
          <button type="button" onClick={onClose} className="btn btn-sm">
            {t('player.close')}
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-black">
        {loaded && game.build ? (
          <iframe
            ref={frame}
            src={game.build.url}
            title={game.title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; gamepad; xr-spatial-tracking"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 overflow-y-auto bg-paper">
            <div className="page grid-12 gap-y-8 py-8 md:py-12">
              <div className="col-span-4 md:col-span-7">
                {shot && (
                  <div className="border border-ink" style={{ aspectRatio: `${shot.w} / ${shot.h}` }}>
                    <img
                      src={shotSrc(game.slug, shot, 1600)}
                      srcSet={`${shotSrc(game.slug, shot, 800)} 800w, ${shotSrc(game.slug, shot, 1600)} 1600w`}
                      sizes="(min-width: 768px) 760px, 100vw"
                      width={shot.w}
                      height={shot.h}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="col-span-4 md:col-span-4 md:col-start-9">
                <p className="t-deck-sm">{t(`games.${game.slug}.hook`)}</p>
                <dl className="t-cell mt-6 border-t border-ink">
                  {[
                    [t('cahier.specs.players'), game.players],
                    [t('cahier.specs.controls'), t(`controls.${game.controls}`)],
                    [t('cahier.specs.size'), game.build ? `${game.build.sizeMB} Mo` : '—'],
                    [t('player.selfHosted'), game.engine],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="rule-in grid grid-cols-[40%_60%] gap-4 py-2">
                      <dt className="t-meta ink2">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>

                {touchOnly && game.controls === 'keyboard' ? (
                  <div className="mt-8 border border-ink p-4">
                    <p className="t-cell">{t('player.keyboardOnly')}</p>
                    <button type="button" onClick={copyLink} className="btn btn-ghost btn-sm mt-4">
                      {copied ? t('player.copied') : t('player.copyLink')}
                    </button>
                  </div>
                ) : (
                  <>
                    <button type="button" className="btn mt-8 w-full md:w-auto" onClick={() => setLoaded(true)} data-autofocus>
                      {t('player.load', { size: game.build?.sizeMB ?? 0 })} ▶
                    </button>
                    {game.build && game.build.sizeMB > 30 && <p className="t-meta ink2 mt-3">{t('player.wifi')}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="t-meta hidden h-8 items-center justify-between border-t border-ink px-5 md:flex md:px-8">
        <span className="ink2">
          {t('player.selfHosted')} · {game.engine}
        </span>
        <span className="ink2">{loaded ? t('player.closeHint') : t('player.hint')}</span>
      </div>
    </div>
  );
}
