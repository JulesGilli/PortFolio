import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Masthead } from './ui/Masthead';
import { MetaRow } from './ui/MetaRow';
import { Figure } from './ui/Figure';
import { SpecTable, type SpecRow } from './ui/SpecTable';
import { usePlayer } from './ui/Player';
import { useAchievements } from './ui/Achievements';
import { cahierOf, shotSrc, type Game, FEATURED } from '../data/games';
import { cahierStyle, useCahierSection } from '../issue';

const PLATFORM: Record<string, string> = { web: 'Web', win: 'Windows', mac: 'macOS', linux: 'Linux' };

/** Masthead text with the game's identity mark (quoted, never copied). */
export function GameMast({ game }: { game: Game }) {
  if (game.slug === 'color-gap') {
    return (
      <>
        <span className="strike-color">Color</span> GAP
        <span className="ml-[0.2em] inline-flex gap-[0.08em] align-baseline">
          <span className="inline-block h-[0.18em] w-[0.18em] bg-[#F2C230]" />
          <span className="inline-block h-[0.18em] w-[0.18em] bg-[#DE4646]" />
          <span className="inline-block h-[0.18em] w-[0.18em] bg-[#2B5FC4]" />
        </span>
      </>
    );
  }
  if (game.slug === 'dig-or-die') {
    return (
      <>
        DIG <span className="text-spot">or</span> DIE
      </>
    );
  }
  return <>{game.title}</>;
}

export function useSpecs(game: Game): SpecRow[] {
  const { t } = useTranslation();
  const dash = '—';
  return [
    { label: t('cahier.specs.role'), value: game.role ? t(`games.${game.slug}.role`, { defaultValue: game.role }) : dash },
    { label: t('cahier.specs.team'), value: game.team ? String(game.team) : dash },
    { label: t('cahier.specs.engine'), value: game.engine },
    { label: t('cahier.specs.duration'), value: t(`games.${game.slug}.duration`, { defaultValue: dash }) },
    { label: t('cahier.specs.year'), value: game.year ?? dash },
    { label: t('cahier.specs.platforms'), value: game.platforms.map((p) => PLATFORM[p]).join(' · ') },
    ...(game.award ? [{ label: t('cahier.specs.award'), value: t(`games.${game.slug}.award`, { defaultValue: game.award }) }] : []),
  ];
}

export function PlayButtons({ game, className = '' }: { game: Game; className?: string }) {
  const { t } = useTranslation();
  const { play } = usePlayer();
  const { trackPlay } = useAchievements();
  const inSite = !!game.build;
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      {inSite ? (
        <button type="button" className="btn w-full md:w-auto" onClick={() => play(game)}>
          {t('cahier.play')} ▶
        </button>
      ) : (
        game.itch && (
          // a download counts as playing: Color GAP has no build and is one of the "Fan" games
          <a
            href={game.itch}
            target="_blank"
            rel="noopener noreferrer"
            className="btn w-full md:w-auto"
            onClick={() => trackPlay(game.slug, !!game.featured)}
          >
            {t('cahier.download')} ↗
          </a>
        )
      )}
      {inSite && game.itch && (
        <a href={game.itch} target="_blank" rel="noopener noreferrer" className="t-ui u-link">
          itch.io ↗
        </a>
      )}
    </div>
  );
}

/**
 * One cahier: the game printed on its own paper. `abridged` is the home-page chapter,
 * the full version is the dossier.
 */
export function Cahier({
  game,
  n,
  onOpenDossier,
}: {
  game: Game;
  n: number;
  onOpenDossier: (g: Game) => void;
}) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const cahier = cahierOf(game);
  useCahierSection(ref, cahier);
  const [shot, setShot] = useState(0);
  const specs = useSpecs(game);
  const captions = t(`games.${game.slug}.captions`, { returnObjects: true, defaultValue: [] }) as string[];
  const next = FEATURED[FEATURED.indexOf(game) + 1];
  const folio = `p. ${String(n).padStart(2, '0')}`;

  return (
    <section
      id={`cahier-${game.slug}`}
      ref={ref}
      style={cahierStyle(cahier) as CSSProperties}
      className="min-h-[100svh] border-t border-ink bg-paper pt-12 text-ink md:pt-14"
      aria-labelledby={`mast-${game.slug}`}
    >
      <div className="page">
        <MetaRow
          left={`${t('cahier.label')} ${String(n).padStart(2, '0')} — ${game.title}`}
          center={[game.genre, game.engine, game.year, game.build ? 'WebGL' : null].filter(Boolean).join(' · ')}
          right={folio}
        />

        <div className="rule-b py-6 md:py-8" id={`mast-${game.slug}`}>
          <Masthead lines={[<GameMast key="m" game={game} />]} />
        </div>

        <div className="grid-12 gap-y-10 py-8 md:py-10">
          {/* Figure first on mobile, right column on desktop */}
          <div className="col-span-4 md:order-2 md:col-span-8">
            <div className="relative">
              {game.award && (
                <span className="t-meta absolute -left-3 -top-3 z-10 bg-spot px-3 py-2 text-onspot">
                  {t(`games.${game.slug}.award`, { defaultValue: game.award })}
                </span>
              )}
              <Figure
                slug={game.slug}
                shot={game.shots[shot]}
                n={shot + 1}
                caption={captions[shot]}
                priority={game.featured === 1}
              />
            </div>
            {game.shots.length > 1 && (
              <div className="filmstrip mt-5" role="tablist" aria-label={t('cahier.figures')}>
                {game.shots.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={i === shot}
                    onClick={() => setShot(i)}
                    className={`border-b-2 pb-2 ${i === shot ? 'border-spot' : 'border-transparent'}`}
                  >
                    <img
                      src={shotSrc(game.slug, s, 400)}
                      alt=""
                      width={160}
                      height={Math.round((160 * s.h) / s.w)}
                      loading="lazy"
                      decoding="async"
                      className={`h-[68px] w-[120px] border object-cover md:h-[90px] md:w-[160px] ${i === shot ? 'border-ink' : 'border-rule'}`}
                    />
                    <span className="t-meta mt-2 block">{String(i + 1).padStart(2, '0')}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-4 md:order-1 md:col-span-4">
            <p className="t-deck-sm">{t(`games.${game.slug}.hook`)}</p>
            <p className="t-body mt-5">{t(`games.${game.slug}.body`)}</p>
            <SpecTable rows={specs} className="mt-8" />
            <PlayButtons game={game} className="mt-8" />
            <button type="button" onClick={() => onOpenDossier(game)} className="t-ui u-link mt-5 block">
              {t('cahier.dossier')} →
            </button>
          </div>
        </div>

        <MetaRow
          rule="t"
          left={
            next ? (
              <a href={`#cahier-${next.slug}`} className="u-link">
                {t('cahier.next')} : {String(n + 1).padStart(2, '0')} — {next.title} ↓
              </a>
            ) : (
              <a href="#games" className="u-link">
                {t('cahier.next')} : {t('index.title')} ↓
              </a>
            )
          }
          right={folio}
          className="pb-6"
        />
      </div>
    </section>
  );
}

export function Sticker({ children }: { children: ReactNode }) {
  return <span className="t-meta bg-spot px-3 py-2 text-onspot">{children}</span>;
}
