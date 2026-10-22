import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, rememberLanguage, type SupportedLanguage } from '../../i18n';
import { useAchievements } from './Achievements';

/** Segmented control: FR · EN · ES · DE. Four options do not need a menu. */
export function LanguageSelector({ inverted = false }: { inverted?: boolean }) {
  const { i18n, t } = useTranslation();
  const { unlock } = useAchievements();
  const current = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2) as SupportedLanguage;
  const safe = (SUPPORTED_LANGUAGES as readonly string[]).includes(current) ? current : 'en';

  const change = (lng: SupportedLanguage) => {
    if (lng !== safe) unlock('polyglot');
    rememberLanguage(lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div role="radiogroup" aria-label={t('language.label')} className="t-ui flex border border-ink">
      {SUPPORTED_LANGUAGES.map((lng) => {
        const active = lng === safe;
        return (
          <button
            key={lng}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => change(lng)}
            className={`h-[42px] px-3 ${active ? (inverted ? 'bg-paper text-ink' : 'bg-ink text-paper') : 'hover:underline'}`}
          >
            {lng}
          </button>
        );
      })}
    </div>
  );
}
