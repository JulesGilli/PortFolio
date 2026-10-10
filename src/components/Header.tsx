import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './ui/LanguageSelector';
import { EASE } from './ui/Reveal';
import { useIntroDone } from './ui/Intro';
import { TrophyButton, useAchievements } from './ui/Achievements';

const navItems = [
  { key: 'games', href: '#games', index: '01' },
  { key: 'about', href: '#about', index: '02' },
  { key: 'tools', href: '#tools', index: '03' },
  { key: 'contact', href: '#contact', index: '04' },
] as const;

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ready = useIntroDone();
  const { unlock } = useAchievements();
  const logoClicks = useRef(0);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-8"
        initial={{ y: -20, opacity: 0 }}
        animate={ready ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
      >
        <a
          href="#hero"
          className="flex items-center gap-3"
          data-cursor=""
          onClick={() => {
            logoClicks.current += 1;
            if (logoClicks.current >= 5) unlock('insistent');
          }}
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-bone font-display text-[11px] font-bold text-ink">
            JG
          </span>
          <span className="hidden font-display text-sm font-medium tracking-tight sm:block">
            Jules Gilli
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-baseline gap-1.5 text-sm text-bone/80 transition-colors hover:text-bone"
              data-cursor=""
            >
              <span className="meta !text-[9px] text-muted transition-colors group-hover:text-accent">
                {item.index}
              </span>
              <span className="flip">
                <span>{t(`nav.${item.key}`)}</span>
                <span>{t(`nav.${item.key}`)}</span>
              </span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <TrophyButton />
          <LanguageSelector />
          <button
            type="button"
            className="meta rounded-full border border-bone/20 px-3 py-1.5 !text-bone md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Menu"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-5 pb-14 md:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {navItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-t border-bone/10 py-4 font-display text-5xl font-semibold display-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: EASE }}
              >
                <span className="meta">{item.index}</span>
                {t(`nav.${item.key}`)}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
