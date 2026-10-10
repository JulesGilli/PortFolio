import { FadeUp, MaskLine } from './Reveal';

export function SectionHeader({
  index,
  label,
  title,
  className = '',
}: {
  index: string;
  label: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={`mb-12 md:mb-20 ${className}`}>
      <FadeUp>
        <div className="mb-6 flex items-center gap-4">
          <span className="meta">{index}</span>
          <span className="rule flex-1" />
          <span className="meta">{label}</span>
        </div>
      </FadeUp>
      <MaskLine
        as="h2"
        className="font-display font-semibold display-tight text-[clamp(3rem,9vw,8.5rem)]"
      >
        {title}
      </MaskLine>
    </div>
  );
}
