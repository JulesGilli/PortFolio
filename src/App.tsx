import { SmoothScroll } from './components/ui/SmoothScroll';
import { Background } from './components/ui/Background';
import { Cursor } from './components/ui/Cursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Tools } from './components/Tools';
import { Contact } from './components/Contact';

export function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen text-bone">
        <Background />
        <Cursor />
        <Header />
        <main>
          <Hero />
          <About />
          <Projects />
          <Tools />
          <Contact />
        </main>
      </div>
    </SmoothScroll>
  );
}
