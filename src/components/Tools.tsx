import { useRef, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { MetaRow } from './ui/MetaRow';
import { BASE_CAHIER } from '../data/games';
import { cahierStyle, useCahierSection } from '../issue';
import { useAchievements } from './ui/Achievements';
import { toolsData } from '../data/toolsData';
import { FEATURED } from '../data/games';

function count(s: string): number {
  return parseInt(s.replace(/[^\d]/g, ''), 10) || 0;
}

/** Page 06: the colophon of tools. Proof of craft, not a shop. */
export function Tools() {
  const { t, i18n } = useTranslation();
  const baseRef = useRef<HTMLElement>(null);
  useCahierSection(baseRef, BASE_CAHIER);
  const { unlock } = useAchievements();
  const n = FEATURED.length + 3;
  const tools = [...toolsData].sort((a, b) => count(b.downloads) - count(a.downloads));
  const total = tools.reduce((s, tool) => s + count(tool.downloads), 0);
  const fmt = (v: number) => new Intl.NumberFormat(i18n.language).format(v);

  return (
    <section ref={baseRef} style={cahierStyle(BASE_CAHIER) as CSSProperties} id="tools" className="border-t border-ink bg-paper pt-12 text-ink md:pt-14" aria-labelledby="tools-title">
      <div className="page">
        <MetaRow left={`${String(n).padStart(2, '0')} — ${t('tools.label')}`} right={`p. ${String(n).padStart(2, '0')}`} />

        <div className="grid-12 gap-y-8 py-8 md:py-12">
          <div className="col-span-4 md:col-span-3">
            <h2 id="tools-title" className="t-section">
              {t('tools.title')}
            </h2>
            <p className="t-body mt-5 text-[17px] leading-[26px]">{t('tools.lead')}</p>
            <p className="t-meta ink2 mt-6">{t('tools.meta', { n: tools.length, downloads: fmt(Math.floor(total / 1000) * 1000) })}</p>
          </div>

          <div className="col-span-4 md:col-span-9" onClickCapture={() => unlock('tools-peek')}>
            <div className="t-meta ink2 rule-in hidden grid-cols-[1fr_120px_120px_80px_200px] gap-4 py-2 md:grid">
              <span>{t('tools.cols.name')}</span>
              <span>{t('tools.cols.category')}</span>
              <span className="text-right">{t('tools.cols.downloads')}</span>
              <span className="text-right">{t('tools.cols.price')}</span>
              <span className="text-right">{t('tools.cols.links')}</span>
            </div>
            <ul>
              {tools.map((tool) => {
                const c = count(tool.downloads);
                const free = /gratuit|free/i.test(tool.price);
                return (
                  <li key={tool.id} className="row-inv rule-in">
                    <div className="grid min-h-[64px] grid-cols-1 gap-2 py-3 md:grid-cols-[1fr_120px_120px_80px_200px] md:items-center md:gap-4 md:py-2">
                      <div className="min-w-0">
                        <p className="t-cell-strong">{tool.name}</p>
                        <p className="t-cell ink2 truncate" title={t(`tools.descriptions.${tool.slug}`, { defaultValue: tool.summary })}>
                          {t(`tools.descriptions.${tool.slug}`, { defaultValue: tool.summary })}
                        </p>
                      </div>
                      <span className="t-meta">{tool.category}</span>
                      <span className="t-cell md:text-right">{c >= 100 ? `${fmt(c)}+` : t('tools.new')}</span>
                      <span className="t-cell md:text-right">{free ? t('tools.free') : tool.price}</span>
                      <span className="t-ui flex gap-4 whitespace-nowrap md:justify-end">
                        {tool.documentationLink && (
                          <a href={tool.documentationLink} target="_blank" rel="noopener noreferrer" className="u-link">
                            Doc ↗
                          </a>
                        )}
                        <a href={tool.link} target="_blank" rel="noopener noreferrer" className="u-link">
                          Asset Store ↗
                        </a>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
