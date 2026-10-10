import { useEffect, useState } from 'react';
import { ArrowUpRightIcon, ArrowUpIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MaskLine, FadeUp } from './ui/Reveal';

const EMAIL = 'jules.gilli@live.fr';

const socials = [
  { key: 'github', href: 'https://github.com/JulesGilli' },
  { key: 'linkedin', href: 'https://www.linkedin.com/in/jules-gilli/' },
  { key: 'itch', href: 'https://jules-gilli.itch.io' },
] as const;

function useClock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Paris',
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function Contact() {
  const { t } = useTranslation();
  const time = useClock();

  return (
    <section id="contact" className="relative z-10 flex min-h-screen flex-col justify-between px-5 pt-28 md:px-8 md:pt-40">
      <div>
        <FadeUp>
          <div className="mb-6 flex items-center gap-4">
            <span className="meta">04</span>
            <span className="rule flex-1" />
            <span className="meta">{t('contact.label')}</span>
          </div>
        </FadeUp>

        <h2 className="font-display font-bold display-tight text-[clamp(3.5rem,13vw,13rem)]">
          <MaskLine>{t('contact.title1')}</MaskLine>
          <MaskLine delay={0.12}>
            <span className="font-serif font-normal italic text-muted">{t('contact.title2')}</span>
          </MaskLine>
        </h2>

        <div className="mt-12 grid gap-10 md:mt-20 md:grid-cols-12">
          <FadeUp className="md:col-span-6">
            <p className="max-w-md text-base leading-relaxed text-muted md:text-lg">{t('contact.subtitle')}</p>
            <a
              href={`mailto:${EMAIL}`}
              data-cursor=""
              className="link-swipe mt-8 inline-block font-display text-2xl font-medium tracking-tight text-bone md:text-4xl"
            >
              {EMAIL}
            </a>
          </FadeUp>

          <div className="md:col-span-5 md:col-start-8">
            {socials.map((s, i) => (
              <FadeUp key={s.key} delay={i * 0.06}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor=""
                  className="group flex items-center justify-between border-t border-bone/10 py-5 font-display text-xl font-medium tracking-tight transition-colors hover:text-accent"
                >
                  <span className="flip">
                    <span>{t(`contact.labels.${s.key}`)}</span>
                    <span>{t(`contact.labels.${s.key}`)}</span>
                  </span>
                  <ArrowUpRightIcon
                    size={18}
                    className="transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </a>
              </FadeUp>
            ))}
            <div className="border-t border-bone/10" />
          </div>
        </div>
      </div>

      <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-bone/10 py-6">
        <span className="meta">{t('footer.rights', { year: new Date().getFullYear() })}</span>
        <span className="meta tabular-nums">
          {t('footer.localTime')} — {time}
        </span>
        <a href="#hero" data-cursor="" className="meta group inline-flex items-center gap-2 !text-bone">
          {t('footer.top')}
          <ArrowUpIcon size={12} className="transition-transform duration-500 group-hover:-translate-y-1" />
        </a>
      </footer>
    </section>
  );
}
