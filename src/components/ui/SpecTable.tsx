import type { ReactNode } from 'react';

export interface SpecRow {
  label: string;
  value: ReactNode;
}

/** Specs table with internal hairlines, 40px rows, label 40% / value 60%. */
export function SpecTable({ rows, className = '' }: { rows: SpecRow[]; className?: string }) {
  return (
    <dl className={`t-cell border-t border-ink ${className}`}>
      {rows.map((r) => (
        <div key={r.label} className="rule-in grid min-h-[40px] grid-cols-[40%_60%] items-center gap-x-4 py-2">
          <dt className="t-meta ink2">{r.label}</dt>
          <dd className="m-0">{r.value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  );
}
