import { useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { MetaRow } from './ui/MetaRow';
import { BASE_CAHIER } from '../data/games';
import { cahierStyle, useCahierSection } from '../issue';
import { Figure } from './ui/Figure';
import { usePlayer } from './ui/Player';
import { INDEXED, FEATURED, type Game } from '../data/games';

const PLATFORM: Record<string, string> = { web: 'web', win: 'win', mac: 'mac', linux: 'linux' };

/** Page 05: the index. One row per game, a contact sheet on the right. */
export function GameIndex({ onOpenDossier }: { onOpenDossier: (g: Game) => void }) {
  const { t } = useTranslation();
  const baseRef = useRef<HTMLElement>(null);
  useCahierSection(baseRef, BASE_CAHIER);
  const { play } = usePlayer();
  const games = INDEXED.filter((g) => g.slug !== 'speed-typo');
  const [hover, setHover] = useState<Game>(games[0]);
  const n = FEATURED.length + 2;
  const captions = t(`games.${hover.slug}.captions`, { returnObjects: true, defaultValue: [] }) as string[];

  return (
    <section ref={baseRef} style={cahierStyle(BASE_CAHIER) as CSSProperties} id="games" className="border-t border-ink bg-paper pt-12 text-ink md:pt-14" aria-labelledby="index-title">
      <div className="page">
        <MetaRow left={`${String(n).padStart(2, '0')} — ${t('index.title')}`} right={`p. ${String(n).padStart(2, '0')}`} />
        <h2 id="index-title" className="t-section rule-b py-6">
          {t('index.title')}
        </h2>

        <div className="grid-12 gap-y-10 py-8">
          <div className="col-span-4 md:col-span-8">
            <div className="t-meta ink2 rule-in hidden grid-cols-[48px_1fr_140px_64px_120px_120px] gap-4 py-2 md:grid">
              <span>N°</span>
              <span>{t('index.cols.title')}</span>
              <span>{t('index.cols.genre')}</span>
              <span>{t('index.cols.year')}</span>
              <span>{t('index.cols.platforms')}</span>
              <span className="text-right">{t('index.cols.action')}</span>
            </div>
            <ol>
              {games.map((g, i) => (
                <li
                  key={g.slug}
                  className="row-inv rule-in"
                  onMouseEnter={() => setHover(g)}
                  onFocus={() => setHover(g)}
                >
                  <div className="grid min-h-[64px] grid-cols-[32px_1fr_auto] items-center gap-3 py-3 md:grid-cols-[48px_1fr_140px_64px_120px_120px] md:gap-4 md:py-0">
                    <span className="t-meta">{String(i + 1).padStart(2, '0')}</span>
                    <button type="button" onClick={() => onOpenDossier(g)} className="t-row text-left">
                      {g.title}
                      {g.build && (
                        <span className="t-meta ml-3 hidden whitespace-nowrap bg-ink px-2 py-1 align-middle text-paper md:inline">{t('index.playableHere')}</span>
                      )}
                    </button>
                    <span className="t-meta md:hidden">{g.year ?? '—'}</span>
                    <span className="t-cell hidden md:block">{g.genre}</span>
                    <span className="t-cell hidden md:block">{g.year ?? '—'}</span>
                    <span className="t-meta hidden md:block">{g.platforms.map((p) => PLATFORM[p]).join(' · ')}</span>
                    <span className="col-span-3 flex justify-start md:col-span-1 md:justify-end">
                      {g.build ? (
                        <button type="button" onClick={() => play(g)} className="btn btn-sm">
                          {t('index.play')} ▶
                        </button>
                      ) : (
                        g.itch && (
                          <a href={g.itch} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                            itch ↗
                          </a>
                        )
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <aside className="col-span-4 hidden md:col-span-4 md:block">
            <div className="sticky top-24">
              <p className="t-meta rule-b pb-2">{t('index.contactSheet')}</p>
              {hover.shots[0] ? (
                <Figure slug={hover.slug} shot={hover.shots[0]} n={1} caption={captions[0]} sizes="432px" className="mt-4" />
              ) : (
                <div className="mt-4 border border-ink p-4">
                  <p className="t-meta">{hover.title}</p>
                </div>
              )}
              <p className="t-cell-strong mt-4">{hover.title}</p>
              <p className="t-meta ink2 mt-1">{[hover.genre, hover.engine, hover.year].filter(Boolean).join(' · ')}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
