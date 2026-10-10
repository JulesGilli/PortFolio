import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useReducedMotion } from '../../hooks/useMediaQuery';

/**
 * Custom cursor: a small dot that follows the pointer tightly, and a ring
 * that lags behind on a spring. Any element with `data-cursor` grows the ring;
 * if the attribute has text, that text is shown inside the ring.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const [label, setLabel] = useState<string | null>(null);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!fine) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(target ? target.dataset.cursor || '' : null);
    };
    // Scrolling moves the page under a still pointer: re-resolve the hovered element.
    const onScroll = () => {
      const el = document.elementFromPoint(x.get(), y.get()) as HTMLElement | null;
      const target = el?.closest<HTMLElement>('[data-cursor]');
      setLabel(target ? target.dataset.cursor || '' : null);
    };
    const onLeave = () => setHidden(true);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, [fine, x, y]);

  if (!fine || reduced) return null;

  const active = label !== null;
  const hasText = !!label;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full bg-bone mix-blend-difference"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: active ? 0 : 6, height: active ? 0 : 6, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full border"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: hasText ? 88 : active ? 44 : 28,
          height: hasText ? 88 : active ? 44 : 28,
          opacity: hidden ? 0 : 1,
          backgroundColor: hasText ? 'rgba(166,108,255,1)' : 'rgba(166,108,255,0)',
          borderColor: hasText ? 'rgba(166,108,255,0)' : 'rgba(236,232,225,0.7)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      >
        <motion.span
          className="meta font-medium"
          style={{ color: '#ece8e1' }}
          animate={{ opacity: hasText ? 1 : 0, scale: hasText ? 1 : 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </motion.div>
    </>
  );
}
