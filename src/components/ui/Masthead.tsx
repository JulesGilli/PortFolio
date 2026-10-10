import { useEffect, useRef, type ReactNode, type ElementType } from 'react';

/**
 * Masthead lines slide out of a mask the first time they enter the viewport.
 * Pure CSS transition; the only entrance animation of the site.
 */
export function Masthead({
  lines,
  as: Tag = 'h2',
  className = '',
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const masks = Array.from(el.querySelectorAll<HTMLElement>('.mask'));
    let fallback: number | undefined;
    const reveal = () => {
      masks.forEach((m, i) => {
        m.querySelector('span')!.style.transitionDelay = `${i * 60}ms`;
        m.classList.add('in');
      });
      io.disconnect();
      window.clearTimeout(fallback);
    };
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && reveal(), { threshold: 0.1 });
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) reveal();
    else io.observe(el);
    // A masthead must never stay hidden, whatever the observer does.
    fallback = window.setTimeout(reveal, 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag ref={ref} className={`t-mast ${className}`}>
      {lines.map((line, i) => (
        <div key={i} className="mask">
          <span>{line}</span>
        </div>
      ))}
    </Tag>
  );
}
