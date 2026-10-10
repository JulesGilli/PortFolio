import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRightIcon, PlayIcon, DownloadIcon, ArrowDownIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EASE } from './ui/Reveal';
import { Backdrop } from './ui/Backdrop';
import { usePlayer } from './ui/Player';
import { featuredProjects } from '../data/projects';
import { useReducedMotion, useFinePointer } from '../hooks/useMediaQuery';
import { setBaseTheme } from '../theme';

const AUTO_MS = 8000;
const WIPE_MS = 420; // content swaps when the wipe covers the screen

/** Full-screen showcase: one game at a time, the whole page dressed in its colours. */
export function Stage() {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const { play } = usePlayer();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [wipe, setWipe] = useState(0);
  const wipeAccent = useRef('#a66cff');

  const games = featuredProjects;
  const game = games[index];

  useEffect(() => {
    setBaseTheme(game.theme);
  }, [game]);

  const go = (i: number) => {
    if (i === index) return;
    wipeAccent.current = games[i].theme?.accent ?? '#a66cff';
    setWipe((w) => w + 1);
    setCycle((c) => c + 1);
    window.setTimeout(() => setIndex(i), reduced ? 0 : WIPE_MS);
  };

  useEffect(() => {
    if (paused || reduced || games.length < 2) return;
    const id = setTimeout(() => go((index + 1) % games.length), AUTO_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, reduced, index, cycle, games.length]);

  // Cover card tilts toward the pointer.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 });
  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const description = game.slug
    ? t(`games.descriptions.${game.slug}`, { defaultValue: game.description })
    : game.description;
  const accent = game.theme?.accent ?? '#a66cff';

  return (
    <section
      id="games"
      className="relative z-10 flex min-h-screen flex-col justify-between overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        mx.set(0);
        my.set(0);
      }}
      onMouseMove={fine ? onMove : undefined}
    >
      <Backdrop id={game.id} fx={game.theme?.fx ?? 'dust'} image={game.image} accent={accent} />

      {/* Giant ghost title as texture */}
      <div
        aria-hidden
        className="game-title pointer-events-none absolute -bottom-[0.1em] -left-[0.05em] select-none whitespace-nowrap font-bold leading-none opacity-[0.06]"
        style={{ fontSize: 'calc(28vw * var(--title-scale))', color: 'rgb(var(--bone-rgb))' }}
      >
        {game.title}
      </div>

      {/* Wipe transition */}
      {wipe > 0 && (
        <motion.div
          key={wipe}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30"
          style={{ backgroundColor: wipeAccent.current }}
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)', 'inset(0 0 0 100%)'] }}
          transition={{ duration: 0.95, times: [0, 0.44, 1], ease: EASE }}
        />
      )}

      {/* Header row */}
      <div className="relative flex items-center justify-between px-5 pt-24 md:px-8 md:pt-28">
        <div className="flex items-center gap-3">
          <span className="meta !text-accent">{t('hero.featured')}</span>
          <span className="meta">
            {String(index + 1).padStart(2, '0')} / {String(games.length).padStart(2, '0')}
          </span>
        </div>
        <span className="meta hidden sm:block">{game.genre}</span>
      </div>

      {/* Body */}
      <div className="relative grid items-end gap-10 px-5 pb-12 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <h2 className="game-title font-bold display-tight">{game.title}</h2>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              {game.browser && <span className="meta rounded-full bg-accent px-2.5 py-1 !text-ink">{t('hero.inBrowser')}</span>}
              {game.award && <span className="meta rounded-full border border-accent/60 px-2.5 py-1 !text-accent">🏆 {game.award}</span>}
              {game.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="meta rounded-full border border-bone/20 px-2.5 py-1 !text-bone/80">
                  {tag}
                </span>
              ))}
            </div>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-bone/80 md:text-lg">{description}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => play(game)}
                data-cursor=""
                className="group inline-flex items-center gap-3 rounded-full bg-bone py-3 pl-6 pr-2 text-sm font-medium text-ink"
              >
                <span className="flip">
                  <span>{game.browser ? t('hero.play') : t('hero.download')}</span>
                  <span>{game.browser ? t('hero.play') : t('hero.download')}</span>
                </span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-out group-hover:scale-110">
                  {game.browser ? <PlayIcon size={13} className="fill-current" /> : <DownloadIcon size={14} />}
                </span>
              </button>
              {game.links?.demo && (
                <a
                  href={game.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor=""
                  className="link-swipe inline-flex items-center gap-1.5 text-sm text-bone/80 hover:text-bone"
                >
                  {t('hero.itch')} <ArrowUpRightIcon size={14} />
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Cover + selector */}
        <div className="md:col-span-5 md:justify-self-end" style={{ perspective: 1200 }}>
          <motion.div
            className="relative aspect-[5/4] w-full max-w-md overflow-hidden rounded-xl border border-bone/10 shadow-2xl shadow-black/60"
            style={{ rotateX: fine ? rx : 0, rotateY: fine ? ry : 0, transformStyle: 'preserve-3d' }}
          >
            <motion.img
              key={game.id}
              src={game.image}
              alt={game.title}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
              onClick={() => play(game)}
              data-cursor={game.browser ? t('hero.play') : ''}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
          </motion.div>

          <div className="mt-4 flex gap-2">
            {games.map((g, i) => {
              const active = i === index;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => go(i)}
                  data-cursor=""
                  aria-label={g.title}
                  className={`relative h-14 w-20 overflow-hidden rounded-md border transition-all duration-500 md:h-16 md:w-24 ${
                    active ? 'border-accent' : 'border-bone/10 opacity-50 hover:opacity-90'
                  }`}
                >
                  <img src={g.image} alt="" className="h-full w-full object-cover" />
                  {active && !reduced && (
                    <motion.span
                      key={cycle}
                      className="absolute bottom-0 left-0 h-0.5 bg-accent"
                      initial={{ width: '0%' }}
                      animate={{ width: paused ? undefined : '100%' }}
                      transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-between border-t border-bone/10 px-5 py-3 md:px-8">
        <span className="meta">{t('games.all')} ↓</span>
        <ArrowDownIcon size={14} className="text-muted" />
      </div>
    </section>
  );
}
