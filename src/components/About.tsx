import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SectionHeader } from './ui/SectionHeader';
import { ScrollWords, FadeUp } from './ui/Reveal';
import { onlineProjects } from '../data/projects';
import { toolsData } from '../data/toolsData';

const base = import.meta.env.BASE_URL;

const totalDownloads = toolsData.reduce((sum, tool) => {
  const n = parseInt(tool.downloads.replace(/[^\d]/g, ''), 10);
  return sum + (Number.isFinite(n) ? n : 0);
}, 0);
const downloadsLabel = `${Math.floor(totalDownloads / 1000)}k+`;

export function About() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const imgRotate = useTransform(scrollYProgress, [0, 1], [-4, 3]);

  const stats = [
    { value: String(onlineProjects.length), label: t('about.stats.games') },
    { value: String(toolsData.length), label: t('about.stats.tools') },
    { value: downloadsLabel, label: t('about.stats.downloads') },
  ];

  return (
    <section id="about" ref={ref} className="relative z-10 px-5 py-28 md:px-8 md:py-40">
      <SectionHeader index="02" label={t('about.label')} title={t('about.title')} />

      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4 md:col-start-1">
          <motion.div
            style={{ y: imgY, rotate: imgRotate }}
            className="relative aspect-[4/5] w-56 overflow-hidden md:w-full md:max-w-xs"
          >
            <img
              src={`${base}images/profile.png`}
              alt="Jules Gilli"
              className="h-full w-full object-cover grayscale transition-all duration-700 ease-out hover:grayscale-0"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="meta absolute bottom-3 left-3 rounded-full bg-ink/70 px-2 py-1 !text-bone backdrop-blur">
              Jules Gilli
            </span>
          </motion.div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <ScrollWords
            text={t('about.description')}
            className="font-display text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.15] tracking-tight text-balance"
          />

          <div className="mt-16 grid grid-cols-3 gap-6 border-t border-bone/10 pt-8">
            {stats.map((s, i) => (
              <FadeUp key={s.label} delay={i * 0.08}>
                <div className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                  {s.value}
                </div>
                <div className="meta mt-2">{s.label}</div>
              </FadeUp>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
