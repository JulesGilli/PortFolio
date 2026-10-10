import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { MetaRow } from './ui/MetaRow';
import { BASE_CAHIER } from '../data/games';
import { cahierStyle, useCahierSection } from '../issue';
import { Masthead } from './ui/Masthead';
import { useAchievements } from './ui/Achievements';
import { FEATURED } from '../data/games';

const EMAIL = 'jules.gilli@live.fr';
const LINKS = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/jules-gilli/' },
  { key: 'github', label: 'GitHub', href: 'https://github.com/JulesGilli' },
  { key: 'itch', label: 'itch.io', href: 'https://jules-gilli.itch.io' },
];

/** Page 07: contact, then the colophon. */
export function Contact() {
  const { t } = useTranslation();
  const baseRef = useRef<HTMLElement>(null);
  useCahierSection(baseRef, BASE_CAHIER);
  const { unlock } = useAchievements();
  const [copied, setCopied] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const n = FEATURED.length + 4;

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          unlock('scroll-end');
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [unlock]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable: the mailto link still works */
    }
  };

  return (
    <>
      <section ref={baseRef} style={cahierStyle(BASE_CAHIER) as CSSProperties} id="contact" className="border-t border-ink bg-paper pt-12 text-ink md:pt-14" aria-labelledby="contact-title">
        <div className="page">
          <MetaRow left={`${String(n).padStart(2, '0')} — ${t('contact.label')}`} right={`p. ${String(n).padStart(2, '0')}`} />

          <div className="py-10 md:py-16">
            <Masthead as="h2" lines={[t('contact.title')]} className="[--mast-size:clamp(48px,11vw,160px)]" />
            <span id="contact-title" className="sr-only">
              {t('contact.title')}
            </span>

            <div className="grid-12 mt-10 gap-y-10 md:mt-16">
              <div className="col-span-4 md:col-span-7">
                <p className="t-body">{t('contact.subtitle')}</p>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-3">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="font-archivo text-[24px] font-semibold leading-tight underline decoration-spot decoration-2 underline-offset-8 md:text-[48px]"
                  >
                    {EMAIL}
                  </a>
                  <button type="button" onClick={copy} className="t-ui u-link" aria-live="polite">
                    {copied ? t('contact.copied') : t('contact.copy')}
                  </button>
                </div>
              </div>

              <ul className="col-span-4 border-t border-ink md:col-span-4 md:col-start-9">
                {LINKS.map((l) => (
                  <li key={l.key} className="row-inv rule-in">
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="flex min-h-[56px] items-center justify-between px-1">
                      <span className="t-row">{l.label}</span>
                      <span className="t-ui">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer ref={footerRef} className="border-t border-ink bg-paper text-ink">
        <div className="page t-meta grid gap-3 py-5 md:grid-cols-3">
          <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
          <span className="ink2">{t('footer.colophon')}</span>
          <a href="#hero" className="u-link md:text-right">
            {t('footer.top')} ↑
          </a>
        </div>
      </footer>
    </>
  );
}
