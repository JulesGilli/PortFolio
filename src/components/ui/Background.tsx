import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '../../hooks/useMediaQuery';

/** Ink background, a slow cursor-following accent glow, and film grain on top. */
export function Background() {
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 30, damping: 20 });
  const sy = useSpring(y, { stiffness: 30, damping: 20 });

  useEffect(() => {
    if (!fine) return;
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight / 2);
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [fine, x, y]);

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-0 bg-ink">
        {fine && (
          <motion.div
            className="absolute h-[60vmax] w-[60vmax] rounded-full"
            style={{
              x: sx,
              y: sy,
              translateX: '-50%',
              translateY: '-50%',
              background:
                'radial-gradient(circle, rgba(217,255,74,0.07) 0%, rgba(217,255,74,0.025) 35%, transparent 70%)',
            }}
          />
        )}
      </div>
      <div className="grain" aria-hidden />
    </>
  );
}
