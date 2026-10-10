import type { ReactNode } from 'react';

/** The 40px meta row that opens every page: left label, centre tags, right folio. */
export function MetaRow({
  left,
  center,
  right,
  rule = 'b',
  className = '',
}: {
  left: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  rule?: 'b' | 't' | 'none';
  className?: string;
}) {
  return (
    <div
      className={`t-meta flex min-h-[40px] flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 ${
        rule === 'b' ? 'rule-b' : rule === 't' ? 'rule-t' : ''
      } ${className}`}
    >
      <span>{left}</span>
      {center && <span className="ink2 hidden md:inline">{center}</span>}
      {right && <span className="ink2">{right}</span>}
    </div>
  );
}
