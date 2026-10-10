import { useRef, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Masthead } from './ui/Masthead';
import { MetaRow } from './ui/MetaRow';
import { BASE_CAHIER } from '../data/games';
import { cahierStyle, useCahierSection } from '../issue';
import { FEATURED, GAMES, PLAYABLE_HERE } from '../data/games';
import { toolsData } from '../data/toolsData';

const TOC = [
  ...FEATURED.map((g, i) => ({ n: i + 2, label: g.title, href: `#cahier-${g.slug}` })),
  { n: FEATURED.length + 2, label: 'index', href: '#games' },
  { n: FEATURED.length + 3, label: 'tools', href: '#tools' },
  { n: FEATURED.length + 4, label: 'contact', href: '#contact' },
];

/** Page 01: cover + editorial. Who, what, where to go. */
export function Cover() {
  const { t } = useTranslation();
  const baseRef = useRef<HTMLElement>(null);
  useCahierSection(baseRef, BASE_CAHIER);
  const totalDownloads = toolsData.reduce((s, tool) => s + (parseInt(tool.downloads.replace(/[^\d]/g, ''), 10) || 0), 0);

  return (
    <section ref={baseRef} style={cahierStyle(BASE_CAHIER) as CSSProperties} id="hero" className="flex min-h-[100svh] flex-col bg-paper pt-12 text-ink md:pt-14" aria-labelledby="cover-title">
      <div className="page flex flex-1 flex-col">
        <MetaRow left={t('cover.kicker')} center={t('cover.role')} right="p. 01" />

        <div className="grid-12 flex-1 py-10 md:py-16">
          <div className="col-span-4 md:col-span-7 md:border-r md:border-ink md:pr-6">
            <Masthead as="h1" lines={['Jules', 'Gilli']} className="[--mast-size:clamp(64px,13.9vw,200px)]" />
            <p id="cover-title" className="t-deck mt-8 max-w-[26ch]">
              {t('cover.deck')}
            </p>
            <p className="t-body mt-6">{t('cover.bio')}</p>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a href="#games" className="btn w-full md:w-auto">
                {t('cover.cta')} ↓
              </a>
              <a href="https://jules-gilli.itch.io" target="_blank" rel="noopener noreferrer" className="t-ui u-link">
                itch.io ↗
              </a>
              <a href="https://github.com/JulesGilli" target="_blank" rel="noopener noreferrer" className="t-ui u-link">
                GitHub ↗
              </a>
              <a href="https://www.linkedin.com/in/jules-gilli/" target="_blank" rel="noopener noreferrer" className="t-ui u-link">
                LinkedIn ↗
              </a>
            </div>
          </div>

          <div className="col-span-4 mt-12 md:col-span-4 md:col-start-9 md:mt-0">
            <h2 className="t-meta rule-b pb-2">{t('cover.toc')}</h2>
            <ol className="mt-1">
              {TOC.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="row-inv leader min-h-[44px] items-center px-1 py-2">
                    <span className="t-cell-strong">
                      <span className="t-meta ink2 mr-3 inline-block w-6">{String(item.n).padStart(2, '0')}</span>
                      {item.href.startsWith('#cahier') ? item.label : t(`cover.tocLabels.${item.label}`)}
                    </span>
                    <span className="t-meta">p. {String(item.n).padStart(2, '0')}</span>
                  </a>
                </li>
              ))}
            </ol>

            <p className="t-meta ink2 mt-10 max-w-[36ch]">{t('cover.note')}</p>
          </div>
        </div>

        <MetaRow
          rule="t"
          left={t('cover.stats', {
            games: GAMES.filter((g) => g.slug !== 'speed-typo').length,
            playable: PLAYABLE_HERE,
            tools: toolsData.length,
            downloads: Math.floor(totalDownloads / 1000),
          })}
          right={new Date().getFullYear()}
        />
      </div>
    </section>
  );
}
