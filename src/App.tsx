import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { Cover } from './components/Cover';
import { Cahier } from './components/Cahier';
import { GameIndex } from './components/GameIndex';
import { Tools } from './components/Tools';
import { Contact } from './components/Contact';
import { Dossier } from './components/Dossier';
import { PlayerProvider } from './components/ui/Player';
import { AchievementsProvider } from './components/ui/Achievements';
import { FEATURED, type Game } from './data/games';
import { useRoute } from './lib/route';
import { subscribeTurn, turn } from './lib/turn';

const featuredSlugs = FEATURED.map((g) => g.slug);

/** The page-turn panel: one instance, driven by lib/turn. */
function Turn() {
  const [phase, setPhase] = useState<'in' | 'out' | null>(null);
  useEffect(() => subscribeTurn(setPhase), []);
  if (!phase) return null;
  return <div aria-hidden className={`turn ${phase}`} />;
}

export function App() {
  const { i18n } = useTranslation();
  const { game, open, close } = useRoute();

  // <html lang> follows the UI language.
  useEffect(() => {
    const sync = (lng: string) => {
      document.documentElement.lang = lng.slice(0, 2);
    };
    sync(i18n.resolvedLanguage || i18n.language);
    i18n.on('languageChanged', sync);
    return () => i18n.off('languageChanged', sync);
  }, [i18n]);

  const openDossier = (g: Game) => turn(() => open(g));
  const closeDossier = () => turn(close);

  return (
    <AchievementsProvider featuredSlugs={featuredSlugs}>
      <PlayerProvider>
        <Header />
        <main>
          <Cover />
          {FEATURED.map((g, i) => (
            <Cahier key={g.slug} game={g} n={i + 2} onOpenDossier={openDossier} />
          ))}
          <GameIndex onOpenDossier={openDossier} />
          <Tools />
        </main>
        <Contact />
        {game && <Dossier game={game} onClose={closeDossier} onOpen={(g) => turn(() => open(g))} />}
        <Turn />
      </PlayerProvider>
    </AchievementsProvider>
  );
}
