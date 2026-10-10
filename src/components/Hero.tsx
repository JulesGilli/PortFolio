import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDownIcon } from 'lucide-react';
import { MaskLine, EASE } from './ui/Reveal';
import { Marquee } from './ui/Marquee';
import { useIntroDone } from './ui/Intro';
import { onlineProjects } from '../data/projects';
import { toolsData } from '../data/toolsData';

const base = import.meta.env.BASE_URL;

const totalDownloads = toolsData.reduce((sum, tool) => {
  const n = parseInt(tool.downloads.replace(/[^\d]/g, ''), 10);
  return sum + (Number.isFinite(n) ? n : 0);
}, 0);

/** Who I am, in one screen. The games come right after. */
export function Hero() {
  const { t } = useTranslation();
  const ready = useIntroDone();
  const { scrollY } = useScroll();
  const nameY = useTransform(scrollY, [0, 800], [0, 140]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const marqueeItems = (t('hero.marquee') as string).split('—').map((s) => s.trim());
  const stats = [
    { value: String(onlineProjects.length), label: t('about.stats.games') },
    { value: String(toolsData.length), label: t('about.stats.tools') },
    { value: `${Math.floor(totalDownloads / 1000)}k+`, label: t('about.stats.downloads') },
  ];

  return (
    <section id="hero" className="relative z-10 flex min-h-screen flex-col justify-between px-5 pt-28 md:px-8 md:pt-32">
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <span className="meta">{t('hero.kicker')}</span>
        <span className="meta hidden sm:block">Unity · C# · React</span>
      </motion.div>

      <motion.div style={{ y: nameY, opacity: fade }} className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <h1 className="font-display font-bold display-tight text-[clamp(4.5rem,17vw,17rem)]">
            <MaskLine delay={0.15} play={ready}>
              Jules
            </MaskLine>
            <MaskLine delay={0.28} className="md:pl-[0.18em]" play={ready}>
              Gilli<span className="text-accent">.</span>
            </MaskLine>
          </h1>
          <MaskLine delay={0.5} play={ready} className="mt-4">
            <p className="font-serif text-3xl italic leading-tight md:text-4xl">
              {t('hero.role1')} <span className="text-muted">{t('hero.role2')}</span>
            </p>
          </MaskLine>
        </div>

        <motion.div
          className="md:col-span-4 md:pb-4"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.75, duration: 0.9, ease: EASE }}
        >
          <div className="flex items-start gap-5">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-bone/15 md:h-24 md:w-24">
              <img
                src={`${base}images/profile.png`}
                alt="Jules Gilli"
                className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <p className="text-sm leading-relaxed text-bone/80 md:text-base">{t('about.description')}</p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-bone/10 pt-5">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{s.value}</div>
                <div className="meta mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <a
            href="#games"
            data-cursor=""
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-bone py-3 pl-5 pr-2 text-sm font-medium text-ink"
          >
            <span className="flip">
              <span>{t('hero.cta')}</span>
              <span>{t('hero.cta')}</span>
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-out group-hover:translate-y-0.5">
              <ArrowDownIcon size={14} />
            </span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className="-mx-5 mt-14 border-t border-bone/10 md:-mx-8"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 1 }}
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
