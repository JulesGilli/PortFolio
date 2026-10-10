import { useCallback, useState } from 'react';
import { SmoothScroll } from './components/ui/SmoothScroll';
import { Background } from './components/ui/Background';
import { Cursor } from './components/ui/Cursor';
import { Intro, IntroContext, shouldSkipIntro } from './components/ui/Intro';
import { PlayerProvider } from './components/ui/Player';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Tools } from './components/Tools';
import { Contact } from './components/Contact';

export function App() {
  const [skipIntro] = useState(shouldSkipIntro);
  const [introDone, setIntroDone] = useState(skipIntro);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  return (
    <SmoothScroll>
      <IntroContext.Provider value={introDone}>
        <PlayerProvider>
          <div className="min-h-screen text-bone">
            <Background />
            <Cursor />
            {!skipIntro && <Intro onDone={onIntroDone} />}
            <Header />
            <main>
              <Hero />
              <Projects />
              <About />
              <Tools />
              <Contact />
            </main>
          </div>
        </PlayerProvider>
      </IntroContext.Provider>
    </SmoothScroll>
  );
}
