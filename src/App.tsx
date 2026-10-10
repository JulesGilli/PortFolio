import { useCallback, useState } from 'react';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { Background } from './components/ui/Background';
import { Cursor } from './components/ui/Cursor';
import { Intro, IntroContext, shouldSkipIntro } from './components/ui/Intro';
import { PlayerProvider } from './components/ui/Player';
import { AchievementsProvider } from './components/ui/Achievements';
import { featuredProjects } from './data/projects';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stage } from './components/Stage';
import { Projects } from './components/Projects';
import { Tools } from './components/Tools';
import { Contact } from './components/Contact';

const featuredSlugs = featuredProjects.map((p) => p.slug).filter((s): s is string => !!s);

export function App() {
  const [skipIntro] = useState(shouldSkipIntro);
  const [introDone, setIntroDone] = useState(skipIntro);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <SmoothScroll>
      <IntroContext.Provider value={introDone}>
        <AchievementsProvider featuredSlugs={featuredSlugs}>
          <PlayerProvider>
            <div className="min-h-screen text-bone">
              <Background />
              <Cursor />
              {!skipIntro && <Intro onDone={onIntroDone} />}
              <Header />
              <main>
                <Hero />
                <Stage />
                <Projects />
                <Tools />
                <Contact />
              </main>
            </div>
          </PlayerProvider>
        </AchievementsProvider>
      </IntroContext.Provider>
    </SmoothScroll>
  );
}
