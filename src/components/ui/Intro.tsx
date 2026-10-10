import { createContext, useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { EASE } from './Reveal';
import { useLenis } from './SmoothScroll';

const SEEN_KEY = 'intro-seen';

/** True once the intro curtain has lifted (or was skipped). Hero animations wait for it. */
export const IntroContext = createContext(true);
export const useIntroDone = () => useContext(IntroContext);

export function shouldSkipIntro(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

const COUNT_DURATION = 1500; // ms for 0 → 100
const HOLD = 250; // ms at 100 before lifting

export function Intro({ onDone }: { onDone: () => void }) {
  const lenis = useLenis();
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'count' | 'lift' | 'gone'>('count');

  // Freeze scrolling while the curtain is up.
  useEffect(() => {
    if (!lenis) return;
    if (phase === 'gone') lenis.start();
    else lenis.stop();
    return () => lenis.start();
  }, [lenis, phase]);

  // Eased counter.
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / COUNT_DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          setPhase('lift');
          onDone();
          try {
            sessionStorage.setItem(SEEN_KEY, '1');
          } catch {
            /* private mode */
          }
        }, HOLD);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  if (phase === 'gone') return null;
  const lifting = phase === 'lift';

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-5 py-6 text-bone md:px-8"
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      animate={{ clipPath: lifting ? 'inset(0 0 100% 0)' : 'inset(0 0 0% 0)' }}
      transition={{ duration: 1, ease: EASE }}
      onAnimationComplete={() => lifting && setPhase('gone')}
      aria-hidden
    >
      <div className="flex items-center justify-between">
        <span className="meta !text-bone">Jules Gilli</span>
        <span className="meta">Portfolio</span>
      </div>

      <div className="flex items-end justify-between">
        <div className="overflow-hidden">
          <motion.div
            className="font-display font-bold display-tight text-[clamp(5rem,18vw,16rem)] tabular-nums"
            animate={{ y: lifting ? '-110%' : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {String(count).padStart(3, '0')}
          </motion.div>
        </div>
        <span className="meta mb-6 hidden sm:block">Loading</span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-bone/10">
        <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${count}%` }} />
      </div>
    </motion.div>
  );
}
