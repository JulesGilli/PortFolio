import type { CSSProperties, ReactNode } from 'react';

export function Marquee({
  children,
  duration = 30,
  className = '',
}: {
  children: ReactNode;
  duration?: number;
  className?: string;
}) {
  const style = { '--marquee-duration': `${duration}s` } as CSSProperties;
  return (
    <div className={`marquee ${className}`} style={style} aria-hidden>
      <div className="marquee__track">{children}</div>
      <div className="marquee__track">{children}</div>
    </div>
  );
}
