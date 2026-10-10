import { ArrowUpRightIcon, BookOpenIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FadeUp, MaskLine } from './ui/Reveal';
import { toolsData } from '../data/toolsData';
import { useAchievements } from './ui/Achievements';

/** Compact credit list: tools are kept as proof of skill, not as a showcase. */
export function Tools() {
  const { t } = useTranslation();
  const { unlock } = useAchievements();
  const totalDownloads = toolsData.reduce((sum, tool) => {
    const n = parseInt(tool.downloads.replace(/[^\d]/g, ''), 10);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);

  return (
    <section id="tools" className="relative z-10 px-5 py-24 md:px-8 md:py-32">
      <FadeUp>
        <div className="mb-6 flex items-center gap-4">
          <span className="meta">03</span>
          <span className="rule flex-1" />
          <span className="meta">{t('tools.label')}</span>
        </div>
      </FadeUp>

      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <MaskLine as="h2" className="font-display text-[clamp(2rem,5vw,4rem)] font-semibold display-tight">
            {t('tools.title')}
          </MaskLine>
          <FadeUp delay={0.1}>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{t('tools.lead')}</p>
            <p className="meta mt-6">
              {toolsData.length} {t('about.stats.tools').toLowerCase()} · {Math.floor(totalDownloads / 1000)}k+ {t('tools.downloads')}
            </p>
          </FadeUp>
        </div>

        <div className="md:col-span-7" onClickCapture={() => unlock('tools-peek')}>
          {toolsData.map((tool, i) => (
            <FadeUp key={tool.id} delay={Math.min(i * 0.05, 0.25)}>
              <div className="group grid grid-cols-[1fr_auto] items-center gap-4 border-t border-bone/10 py-4 md:grid-cols-[1fr_auto_auto] md:gap-8">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h3 className="font-display text-lg font-medium tracking-tight">{tool.name}</h3>
                    <span className="meta">{tool.category}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">
                    {t(`tools.descriptions.${tool.slug}`, { defaultValue: tool.summary })}
                  </p>
                </div>
                <span className="meta hidden md:block">
                  {tool.downloads} · {tool.price}
                </span>
                <div className="flex items-center gap-1.5">
                  {tool.documentationLink && (
                    <a
                      href={tool.documentationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor=""
                      aria-label={t('tools.documentation')}
                      className="grid h-9 w-9 place-items-center rounded-full border border-bone/15 text-bone/70 transition-colors hover:border-bone/50 hover:text-bone"
                    >
                      <BookOpenIcon size={14} />
                    </a>
                  )}
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor=""
                    aria-label={t('tools.viewOnAssetStore')}
                    className="grid h-9 w-9 place-items-center rounded-full border border-bone/15 text-bone/70 transition-colors hover:bg-bone hover:text-ink"
                  >
                    <ArrowUpRightIcon size={14} />
                  </a>
                </div>
              </div>
            </FadeUp>
          ))}
          <div className="border-t border-bone/10" />
        </div>
      </div>
    </section>
  );
}
