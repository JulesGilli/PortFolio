import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from './ui/LanguageSelector';
import { TrophyButton, useAchievements } from './ui/Achievements';
import { useScrollLock } from '../lib/useScrollLock';
import { useDialogFocus } from '../lib/useDialogFocus';
import { bySlug } from '../data/games';

const NAV = [
  { key: 'about', href: '#hero', id: 'hero' },
  { key: 'games', href: '#games', id: 'games' },
  { key: 'tools', href: '#tools', id: 'tools' },
  { key: 'contact', href: '#contact', id: 'contact' },
] as const;

/** Reads the cahier currently printed on :root (set by issue.ts). */
function useCurrentCahier() {
  const [id, setId] = useState<string>('base');
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setId(root.dataset.cahier ?? 'base');
    read();
    const mo = new MutationObserver(read);
    mo.observe(root, { attributes: true, attributeFilter: ['data-cahier'] });
    return () => mo.disconnect();
  }, []);
  return id;
}

/** Which section covers the middle of the viewport, for the nav underline. */
function useActiveSection() {
  const [active, setActive] = useState<string>('hero');
  useEffect(() => {
    const ids = ['hero', 'games', 'tools', 'contact'];
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      let cur = 'hero';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= mid) cur = id;
      }
      // the three cahiers sit between hero and the index: count them as "games"
      const first = document.getElementById('cahier-eco');
      if (first && cur === 'hero' && first.getBoundingClientRect().top <= mid) cur = 'games';
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return active;
}

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const cahier = useCurrentCahier();
  const active = useActiveSection();
  const { unlock } = useAchievements();
  const clicks = useRef(0);
  const menu = useRef<HTMLDivElement>(null);
  useScrollLock(open);
  // no trap: the Close button lives in the header, above the menu
  useDialogFocus(menu, open, false);

  const game = cahier !== 'base' ? bySlug(cahier) : undefined;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-ink bg-paper text-ink">
        <div className="page flex h-12 items-center justify-between md:h-14">
          <a
            href="#hero"
            className="t-ui flex items-center gap-2"
            style={{ fontStretch: '75%' }}
            onClick={() => {
              clicks.current += 1;
              if (clicks.current >= 5) unlock('insistent');
            }}
          >
            <span>Jules Gilli</span>
            {game && (
              <span className="ink2 hidden sm:inline">
                — {t('cahier.label')} {game.title}
              </span>
            )}
          </a>

          <nav aria-label={t('nav.label')} className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.key}
                href={n.href}
                className={`t-ui border-b-2 py-1 ${active === n.id ? 'border-spot' : 'border-transparent hover:border-ink'}`}
                aria-current={active === n.id ? 'true' : undefined}
              >
                {t(`nav.${n.key}`)}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <TrophyButton />
            <div className="hidden md:block">
              <LanguageSelector />
            </div>
            <button
              type="button"
              className="t-ui flex h-11 items-center border border-ink px-3 md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? t('nav.close') : t('nav.menu')}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          ref={menu}
          id="mobile-menu"
          tabIndex={-1}
          className="fixed inset-0 z-40 flex flex-col pt-16 outline-none md:hidden"
          style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          role="dialog"
          aria-modal="true"
        >
          <nav className="page flex flex-1 flex-col" aria-label={t('nav.label')}>
            {NAV.map((n, i) => (
              <a
                key={n.key}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 border-t py-4 font-archivo text-[40px] font-bold uppercase leading-none"
                style={{ borderColor: 'var(--paper)' }}
              >
                <span className="t-meta">0{i + 1}</span>
                {t(`nav.${n.key}`)}
              </a>
            ))}
          </nav>
          <div className="page border-t py-5" style={{ borderColor: 'var(--paper)', ['--ink' as string]: 'var(--paper)' }}>
            <LanguageSelector inverted />
          </div>
        </div>
      )}
    </>
  );
}
