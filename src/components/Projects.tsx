import { motion } from 'framer-motion';
import { ArrowUpRightIcon, PlayIcon, DownloadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { SectionHeader } from './ui/SectionHeader';
import { FadeUp, EASE } from './ui/Reveal';
import { usePlayer } from './ui/Player';
import { onlineProjects, type Project } from '../data/projects';
import { previewTheme, revertTheme } from '../theme';

// Featured first, then newest first.
const projects = [...onlineProjects].sort((a, b) => {
  if (a.featured && b.featured) return a.featured - b.featured;
  if (a.featured) return -1;
  if (b.featured) return 1;
  return b.id - a.id;
});

function describe(p: Project, t: TFunction) {
  return p.slug ? t(`games.descriptions.${p.slug}`, { defaultValue: p.description }) : p.description;
}

const PLATFORM_LABEL: Record<NonNullable<Project['platforms']>[number], string> = {
  win: 'Windows',
  mac: 'macOS',
  linux: 'Linux',
};

function GameCard({ project: p, index }: { project: Project; index: number }) {
  const { t } = useTranslation();
  const { play } = usePlayer();
  const cta = p.browser ? t('hero.play') : t('hero.download');

  return (
    <FadeUp delay={Math.min((index % 3) * 0.08, 0.3)} className="h-full">
      <motion.article
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-bone/10 bg-bone/[0.03] transition-colors duration-500 hover:border-accent/60"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.5, ease: EASE }}
        onMouseEnter={() => previewTheme(p.theme)}
        onMouseLeave={revertTheme}
      >
        <button
          type="button"
          onClick={() => play(p)}
          data-cursor={cta}
          aria-label={`${cta}: ${p.title}`}
          className="relative block aspect-[5/4] w-full overflow-hidden"
        >
          <img
            src={p.image}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <span className="absolute left-3 top-3 flex gap-1.5">
            {p.browser && <span className="meta rounded-full bg-accent px-2 py-1 !text-ink">{t('games.browser')}</span>}
            {p.award && <span className="meta rounded-full bg-ink/70 px-2 py-1 !text-bone backdrop-blur">🏆</span>}
          </span>
          <span className="absolute inset-0 grid place-items-center bg-ink/0 transition-colors duration-500 group-hover:bg-ink/30">
            <span className="grid h-14 w-14 scale-75 place-items-center rounded-full bg-bone text-ink opacity-0 transition-all duration-500 ease-out group-hover:scale-100 group-hover:opacity-100">
              {p.browser ? <PlayIcon size={18} className="fill-current" /> : <DownloadIcon size={18} />}
            </span>
          </span>
        </button>

        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{p.title}</h3>
            {p.genre && <span className="meta shrink-0 pt-1.5">{p.genre}</span>}
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">{describe(p, t)}</p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-5">
            <span className="meta">
              {[p.browser ? t('games.browser') : null, ...(p.platforms ?? []).map((pl) => PLATFORM_LABEL[pl])]
                .filter(Boolean)
                .join(' · ')}
            </span>
            {p.links?.demo && (
              <a
                href={p.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor=""
                className="inline-flex items-center gap-1 text-xs text-bone/70 transition-colors hover:text-accent"
              >
                itch.io <ArrowUpRightIcon size={12} />
              </a>
            )}
          </div>
        </div>
      </motion.article>
    </FadeUp>
  );
}

export function Projects() {
  const { t } = useTranslation();
  return (
    <section id="games" className="relative z-10 px-5 py-28 md:px-8 md:py-40">
      <SectionHeader index="02" label={t('games.all')} title={t('games.title')} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <GameCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
