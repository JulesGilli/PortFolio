import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowDownIcon } from 'lucide-react';
import { MaskLine, EASE } from './ui/Reveal';
import { Marquee } from './ui/Marquee';
import { useIntroDone } from './ui/Intro';

export function Hero() {
  const { t } = useTranslation();
  const ready = useIntroDone();
  const { scrollY } = useScroll();
  const nameY = useTransform(scrollY, [0, 800], [0, 160]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  const marqueeItems = (t('hero.marquee') as string).split('—').map((s) => s.trim());

  return (
    <section id="hero" className="relative z-10 flex min-h-screen flex-col justify-between px-5 pt-28 md:px-8 md:pt-32">
      {/* Top meta row */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 1 }}
      >
        <span className="meta">{t('hero.kicker')}</span>
        <span className="meta hidden sm:block">Unity · C# · React</span>
      </motion.div>

      {/* Name + subtitle */}
      <motion.div style={{ y: nameY, opacity: fade }} className="grid gap-8 md:grid-cols-12 md:items-end">
        <h1 className="font-display font-bold display-tight text-[clamp(5rem,19vw,19rem)] md:col-span-8">
          <MaskLine delay={0.15} play={ready}>Jules</MaskLine>
          <MaskLine delay={0.28} className="md:pl-[0.18em]" play={ready}>
            Gilli<span className="text-accent">.</span>
          </MaskLine>
        </h1>

        <div className="md:col-span-4 md:pb-6">
          <MaskLine delay={0.5} play={ready}>
            <p className="font-serif text-3xl italic leading-tight text-bone md:text-4xl">
              {t('hero.role1')}
              <br />
              <span className="text-muted">{t('hero.role2')}</span>
            </p>
          </MaskLine>
          <motion.p
            className="mt-5 max-w-xs text-sm leading-relaxed text-muted"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
          >
            {t('hero.tagline')}
          </motion.p>
          <motion.a
            href="#games"
            data-cursor=""
            className="group mt-7 inline-flex items-center gap-3 rounded-full bg-bone py-3 pl-5 pr-2 text-sm font-medium text-ink"
            initial={{ opacity: 0, y: 12 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.95, duration: 0.9, ease: EASE }}
          >
            <span className="flip">
              <span>{t('hero.cta')}</span>
              <span>{t('hero.cta')}</span>
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-out group-hover:rotate-45">
              <ArrowDownIcon size={14} />
            </span>
          </motion.a>
        </div>
      </motion.div>

      {/* Bottom strip */}
      <motion.div
        className="-mx-5 mt-16 border-t border-bone/10 md:-mx-8"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 1.1, duration: 1 }}
      >
        <Marquee duration={28} className="py-4">
          {marqueeItems.map((item, i) => (
            <span key={i} className="flex items-center gap-12 font-display text-sm uppercase tracking-[0.2em] text-muted">
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  );
}
