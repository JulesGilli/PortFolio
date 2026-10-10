import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRightIcon, PlayIcon, DownloadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EASE } from './ui/Reveal';
import { Marquee } from './ui/Marquee';
import { useIntroDone } from './ui/Intro';
import { usePlayer } from './ui/Player';
import { featuredProjects } from '../data/projects';
import { useReducedMotion } from '../hooks/useMediaQuery';
import { applyTheme } from '../theme';

const AUTO_MS = 7000;

export function Hero() {
  const { t } = useTranslation();
  const ready = useIntroDone();
  const reduced = useReducedMotion();
  const { play } = usePlayer();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0); // bumps to restart the progress bar

  const games = featuredProjects;
  const game = games[index];

  useEffect(() => {
    if (ready) applyTheme(game.theme);
  }, [ready, game]);

  // Auto-advance.
  useEffect(() => {
    if (!ready || paused || reduced || games.length < 2) return;
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % games.length);
      setCycle((c) => c + 1);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [ready, paused, reduced, index, cycle, games.length]);

  const go = (i: number) => {
    setIndex(i);
    setCycle((c) => c + 1);
  };

  const marqueeItems = (t('hero.marquee') as string).split('—').map((s) => s.trim());
  const description = game.slug
    ? t(`games.descriptions.${game.slug}`, { defaultValue: game.description })
    : game.description;

  return (
    <section
      id="hero"
      className="relative z-10 flex min-h-screen flex-col justify-between overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Blurred cover as ambient backdrop */}
      <div className="absolute inset-0 -z-10">
        <AnimatePresence mode="sync">
          <motion.div
            key={game.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <motion.img
              src={game.image}
              alt=""
              className="h-full w-full object-cover"
              style={{ filter: 'blur(48px) saturate(1.3)' }}
              initial={{ scale: 1.25 }}
              animate={{ scale: 1.4 }}
              transition={{ duration: AUTO_MS / 1000 + 2, ease: 'linear' }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent" />
      </div>

      {/* Top row: who */}
      <motion.div
        className="flex items-center justify-between px-5 pt-24 md:px-8 md:pt-28"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 1 }}
      >
        <p className="font-serif text-2xl italic text-bone md:text-3xl">
          Jules Gilli, <span className="text-bone/60">{t('hero.role')}</span>
        </p>
        <span className="meta hidden sm:block">Unity · C# · React</span>
      </motion.div>

      {/* Main: text left, cover right */}
      <div className="grid items-end gap-10 px-5 pb-10 md:grid-cols-12 md:px-8">
        <div className="md:col-span-7">
          <motion.div
            className="mb-5 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="meta !text-accent">{t('hero.featured')}</span>
            <span className="meta">
              {String(index + 1).padStart(2, '0')} / {String(games.length).padStart(2, '0')}
            </span>
          </motion.div>

          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 24 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE }}
          >
              <h1 className="game-title font-bold display-tight">{game.title}</h1>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {game.genre && <span className="meta rounded-full border border-bone/20 px-2.5 py-1 !text-bone">{game.genre}</span>}
                {game.browser && <span className="meta rounded-full bg-accent px-2.5 py-1 !text-ink">{t('hero.inBrowser')}</span>}
                {game.award && <span className="meta rounded-full border border-accent/60 px-2.5 py-1 !text-accent">🏆 {game.award}</span>}
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
        <motion.div
          className="md:col-span-5 md:justify-self-end"
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 1, ease: EASE }}
        >
          <div className="relative aspect-[5/4] w-full max-w-md overflow-hidden rounded-xl border border-bone/10 shadow-2xl shadow-black/50">
            <AnimatePresence mode="sync">
              <motion.img
                key={game.id}
                src={game.image}
                alt={game.title}
                className="absolute inset-0 h-full w-full cursor-pointer object-cover"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                onClick={() => play(game)}
                data-cursor={game.browser ? t('hero.play') : ''}
              />
            </AnimatePresence>
          </div>

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
                  className={`group relative h-14 w-20 overflow-hidden rounded-md border transition-all duration-500 md:h-16 md:w-24 ${
                    active ? 'border-bone/60' : 'border-bone/10 opacity-50 hover:opacity-90'
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
        </motion.div>
      </div>

      {/* Marquee strip */}
      <motion.div
        className="border-t border-bone/10"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1, duration: 1 }}
      >
        <Marquee duration={28} className="py-3">
          {marqueeItems.map((item, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-xs uppercase tracking-[0.2em] text-muted">
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
