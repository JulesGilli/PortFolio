import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES, LANGUAGE_LABELS, type SupportedLanguage } from '../../i18n';
import { useAchievements } from './Achievements';

export function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { unlock } = useAchievements();

  const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2) as SupportedLanguage;
  const safeCurrent = (SUPPORTED_LANGUAGES as readonly string[]).includes(current) ? current : 'en';

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const change = (lng: SupportedLanguage) => {
    if (lng !== safeCurrent) unlock('polyglot');
    i18n.changeLanguage(lng);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="meta rounded-full border border-bone/20 px-3 py-1.5 !text-bone transition-colors hover:border-bone/50"
        aria-label={t('language.label')}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-cursor=""
      >
        {safeCurrent}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
            className="absolute right-0 z-50 mt-2 min-w-[150px] border border-bone/15 bg-ink py-1"
          >
            {SUPPORTED_LANGUAGES.map((lng) => {
              const isActive = lng === safeCurrent;
              return (
                <li key={lng}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => change(lng)}
                    data-cursor=""
                    className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-sm transition-colors ${
                      isActive ? 'text-bone' : 'text-muted hover:bg-bone/5 hover:text-bone'
                    }`}
                  >
                    <span>{LANGUAGE_LABELS[lng].native}</span>
                    {isActive && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
