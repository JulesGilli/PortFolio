import { useEffect, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Masthead } from './ui/Masthead';
import { MetaRow } from './ui/MetaRow';
import { Figure } from './ui/Figure';
import { SpecTable } from './ui/SpecTable';
import { GameMast, PlayButtons, useSpecs } from './Cahier';
import { cahierOf, INDEXED, type Game } from '../data/games';
import { applyIssue, cahierStyle, resetIssue } from '../issue';
import { useScrollLock } from '../lib/useScrollLock';

const CONTROLS: Record<Game['controls'], string> = { keyboard: 'controls.keyboard', touch: 'controls.touch', both: 'controls.both' };

/** /jeux/<slug>: the full dossier, printed on the game's paper, over the magazine. */
export function Dossier({ game, onClose, onOpen }: { game: Game; onClose: () => void; onOpen: (g: Game) => void }) {
  const { t } = useTranslation();
  const cahier = cahierOf(game);
  const specs = useSpecs(game);
  const captions = t(`games.${game.slug}.captions`, { returnObjects: true, defaultValue: [] }) as string[];
  const inGame = t(`games.${game.slug}.inGame`, { returnObjects: true, defaultValue: [] }) as string[];
  const paragraphs = (t(`games.${game.slug}.long`, { defaultValue: t(`games.${game.slug}.body`) }) as string).split('\n\n');
  const games = INDEXED.filter((g) => g.slug !== 'speed-typo');
  const i = games.indexOf(game);
  const prev = games[(i - 1 + games.length) % games.length];
  const next = games[(i + 1) % games.length];
  useScrollLock(true);

  useEffect(() => {
    applyIssue(cahier);
    document.title = `${game.title} — Jules Gilli`;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onOpen(next);
      if (e.key === 'ArrowLeft') onOpen(prev);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.title = 'Jules Gilli — Développeur de jeux';
      resetIssue();
    };
  }, [cahier, game, next, prev, onClose, onOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
      style={cahierStyle(cahier) as CSSProperties}
      className="fixed inset-0 z-[70] overflow-y-auto bg-paper pt-12 text-ink md:pt-14"
    >
      <div className="page pb-16">
        <MetaRow
          left={`${t('dossier.label')} — ${game.title}`}
          center={[game.genre, game.engine, game.year].filter(Boolean).join(' · ')}
          right={
            <button type="button" onClick={onClose} className="u-link text-ink">
              ← {t('dossier.back')}
            </button>
          }
        />

        <div className="rule-b py-6 md:py-8">
          <Masthead as="h1" lines={[<GameMast key="m" game={game} />]} />
          <span id="dossier-title" className="sr-only">
            {game.title}
          </span>
        </div>

        <div className="grid-12 gap-y-10 py-8 md:py-10">
          <div className="col-span-4 md:col-span-4">
            <p className="t-deck-sm">{t(`games.${game.slug}.hook`)}</p>
            <SpecTable
              rows={[
                ...specs,
                { label: t('cahier.specs.players'), value: game.players },
                { label: t('cahier.specs.controls'), value: t(CONTROLS[game.controls]) },
                ...(game.build ? [{ label: t('cahier.specs.size'), value: `${game.build.sizeMB} Mo` }] : []),
              ]}
              className="mt-8"
            />
            <PlayButtons game={game} className="mt-8" />
            {game.github && (
              <a href={game.github} target="_blank" rel="noopener noreferrer" className="t-ui u-link mt-4 block">
                GitHub ↗
              </a>
            )}
          </div>

          <div className="col-span-4 md:col-span-8">
            {paragraphs.map((p, k) => (
              <p key={k} className="t-body mb-5 max-w-[65ch]">
                {p}
              </p>
            ))}
            {inGame.length > 0 && (
              <div className="mt-8 border-t border-ink">
                <h2 className="t-meta py-3">{t('dossier.inGame')}</h2>
                <ul className="t-cell">
                  {inGame.map((line, k) => (
                    <li key={k} className="rule-in flex gap-4 py-3">
                      <span className="t-meta ink2 w-6 shrink-0">{String(k + 1).padStart(2, '0')}</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {game.shots.length > 0 && (
          <div className="rule-t py-8">
            <h2 className="t-meta mb-6">{t('dossier.gallery')}</h2>
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2">
              {game.shots.map((s, k) => (
                <Figure key={s.id} slug={game.slug} shot={s} n={k + 1} caption={captions[k]} sizes="(min-width: 768px) 640px, 100vw" />
              ))}
            </div>
          </div>
        )}

        <MetaRow
          rule="t"
          left={
            <button type="button" onClick={() => onOpen(prev)} className="u-link text-ink">
              ← {prev.title}
            </button>
          }
          center={
            <button type="button" onClick={onClose} className="u-link text-ink">
              {t('dossier.back')}
            </button>
          }
          right={
            <button type="button" onClick={() => onOpen(next)} className="u-link text-ink">
              {t('cahier.next')} : {next.title} →
            </button>
          }
        />
      </div>
    </div>
  );
}
