import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRightIcon, BookOpenIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from './ui/SectionHeader';
import { FadeUp } from './ui/Reveal';
import { toolsData } from '../data/toolsData';
import { useIsDesktop } from '../hooks/useMediaQuery';

type Tool = (typeof toolsData)[number];

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const { t } = useTranslation();
  return (
    <article className="group flex h-full flex-col border border-bone/10 bg-ink/40 p-4 md:p-5">
      <div className="relative aspect-[16/10] overflow-hidden rounded-md">
        <img
          src={tool.coverImage}
          alt={tool.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="meta absolute left-3 top-3 rounded-full bg-ink/70 px-2 py-1 !text-bone backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span
          className={`meta absolute right-3 top-3 rounded-full px-2 py-1 backdrop-blur ${
            /gratuit|free/i.test(tool.price) ? 'bg-accent !text-ink' : 'bg-ink/70 !text-bone'
          }`}
        >
          {tool.price}
        </span>
      </div>

      <div className="mt-5 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{tool.name}</h3>
          <span className="meta pt-2">{tool.category}</span>
        </div>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">
          {t(`tools.descriptions.${tool.slug}`, { defaultValue: tool.summary })}
        </p>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div className="meta">
            {tool.downloads} {t('tools.downloads')}
          </div>
          <div className="flex items-center gap-2">
            {tool.documentationLink && (
              <a
                href={tool.documentationLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor=""
                aria-label={t('tools.documentation')}
                className="grid h-10 w-10 place-items-center rounded-full border border-bone/20 text-bone transition-colors hover:bg-bone hover:text-ink"
              >
                <BookOpenIcon size={15} />
              </a>
            )}
            <a
              href={tool.link}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor=""
              className="inline-flex items-center gap-2 rounded-full bg-bone py-2.5 pl-4 pr-3 text-xs font-medium text-ink"
            >
              <span className="flip">
                <span>{t('tools.viewOnAssetStore')}</span>
                <span>{t('tools.viewOnAssetStore')}</span>
              </span>
              <ArrowUpRightIcon size={14} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Desktop: the section pins and the cards scroll horizontally as the page scrolls. */
function HorizontalTools() {
  const { t } = useTranslation();
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      const extra = track.current.scrollWidth - window.innerWidth;
      setDistance(Math.max(0, extra));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const progressW = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={outer} className="relative" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div ref={track} style={{ x }} className="flex w-max items-stretch gap-6 px-8">
          {/* Lead-in panel */}
          <div className="flex w-[22vw] min-w-[220px] flex-col justify-between py-2">
            <p className="font-serif text-3xl italic leading-tight text-muted">{t('tools.intro')}</p>
            <span className="meta">{t('tools.hint')}</span>
          </div>
          {toolsData.map((tool, i) => (
            <div key={tool.id} className="w-[34vw] min-w-[380px] max-w-[520px]">
              <ToolCard tool={tool} index={i} />
            </div>
          ))}
          <div className="w-[8vw]" />
        </motion.div>

        <div className="absolute inset-x-8 bottom-8 h-px bg-bone/10">
          <motion.div className="h-full bg-accent" style={{ width: progressW }} />
        </div>
      </div>
    </div>
  );
}

export function Tools() {
  const { t } = useTranslation();
  const desktop = useIsDesktop();

  return (
    <section id="tools" className="relative z-10 py-28 md:py-40">
      <div className="px-5 md:px-8">
        <SectionHeader index="03" label={t('tools.label')} title={t('tools.title')} className="md:mb-0" />
      </div>

      {desktop ? (
        <HorizontalTools />
      ) : (
        <div className="grid gap-5 px-5">
          {toolsData.map((tool, i) => (
            <FadeUp key={tool.id} delay={0.05}>
              <ToolCard tool={tool} index={i} />
            </FadeUp>
          ))}
        </div>
      )}
    </section>
  );
}
