import { useRef, type ReactNode, type ElementType } from 'react';
import { motion, useInView, useScroll, useTransform, type MotionValue } from 'framer-motion';

export const EASE = [0.76, 0, 0.24, 1] as const;

/** A line of text that slides up from behind a mask. Stack several with increasing `delay`. */
export function MaskLine({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  once = true,
  play = true,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
  once?: boolean;
  /** Hold the line hidden until true (e.g. while the intro curtain is up). */
  play?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-10% 0px' });
  return (
    <Tag ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        className="will-change-transform"
        initial={{ y: '110%', rotate: 2 }}
        animate={inView && play ? { y: 0, rotate: 0 } : { y: '110%', rotate: 2 }}
        transition={{ duration: 1, ease: EASE, delay }}
        style={{ transformOrigin: 'left bottom' }}
      >
        {children}
      </motion.div>
    </Tag>
  );
}

/** Simple fade + rise on scroll into view. */
export function FadeUp({
  children,
  delay = 0,
  className = '',
  y = 24,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <span className="relative inline-block mr-[0.28em]">
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
}

/** Paragraph whose words light up one by one as the user scrolls through it. */
export function ScrollWords({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p ref={ref} className={`relative flex flex-wrap ${className}`}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={`${w}-${i}`} progress={scrollYProgress} range={[start, end]}>
            {w}
          </Word>
        );
      })}
    </p>
  );
}
