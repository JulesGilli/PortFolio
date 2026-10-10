import { useRef, useState, type MouseEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { SectionHeader } from './ui/SectionHeader';
import { FadeUp, EASE } from './ui/Reveal';
import { allProjects, type Project } from '../data/projects';
import { useFinePointer } from '../hooks/useMediaQuery';

// Newest first.
const projects = [...allProjects].reverse();

function describe(p: Project, t: TFunction) {
  return p.slug ? t(`games.descriptions.${p.slug}`, { defaultValue: p.description }) : p.description;
}

export function Projects() {
  const { t } = useTranslation();
  const fine = useFinePointer();
  const [active, setActive] = useState<number | null>(null);

  // Floating preview follows the cursor with a soft spring.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 150, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 150, damping: 20, mass: 0.5 });
  const listRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    px.set(e.clientX);
    py.set(e.clientY);
  };

  const activeProject = active !== null ? projects[active] : null;

  return (
    <section id="games" className="relative z-10 px-5 py-28 md:px-8 md:py-40">
      <SectionHeader index="02" label={t('games.label')} title={t('games.title')} />

      <div
        ref={listRef}
        className="relative border-t border-bone/10"
        onMouseMove={fine ? onMove : undefined}
        onMouseLeave={() => setActive(null)}
      >
        {projects.map((p, i) => {
          const link = p.links?.demo;
          const Row = link ? 'a' : 'div';
          return (
            <FadeUp key={p.id} delay={Math.min(i * 0.04, 0.3)} y={16}>
              <Row
                href={link || undefined}
                target={link ? '_blank' : undefined}
                rel={link ? 'noopener noreferrer' : undefined}
                data-cursor={link ? t('games.view') : undefined}
                onMouseEnter={() => setActive(i)}
                className={`project-row group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-bone/10 px-2 py-5 transition-colors duration-500 md:grid-cols-[4rem_1fr_1fr_auto] md:px-4 md:py-7 ${
                  link ? '' : 'opacity-60'
                }`}
              >
                <span className="meta">{String(projects.length - i).padStart(2, '0')}</span>

                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold tracking-tight md:text-[clamp(2rem,4vw,3.75rem)] md:leading-none">
                    {p.title}
                  </h3>
                  {/* Mobile: description + image inline since there is no hover preview */}
                  <p className="mt-2 line-clamp-2 text-sm text-muted md:hidden">{describe(p, t)}</p>
                </div>

                <div className="meta hidden flex-wrap gap-x-3 md:flex">
                  {p.tags.slice(0, 3).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <span className="grid h-10 w-10 place-items-center rounded-full border border-current transition-transform duration-500 ease-out group-hover:rotate-45">
                  <ArrowUpRightIcon size={16} />
                </span>

                {/* Mobile thumbnail row */}
                <div className="col-span-3 -mt-1 md:hidden">
                  <img src={p.image} alt="" className="aspect-[16/9] w-full rounded-md object-cover" loading="lazy" />
                </div>
              </Row>
            </FadeUp>
          );
        })}

        {/* Floating preview (desktop, fine pointer only) */}
        {fine && (
          <motion.div
            className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
            style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
          >
            <AnimatePresence>
              {activeProject && (
                <motion.div
                  key={activeProject.id}
                  className="relative h-[240px] w-[360px] overflow-hidden rounded-lg"
                  initial={{ clipPath: 'inset(50% 0 50% 0)', scale: 0.9, rotate: -4 }}
                  animate={{ clipPath: 'inset(0% 0 0% 0)', scale: 1, rotate: 0 }}
                  exit={{ clipPath: 'inset(50% 0 50% 0)', scale: 0.95, rotate: 3 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <img src={activeProject.image} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4">
                    <p className="line-clamp-2 text-xs text-bone/90">{describe(activeProject, t)}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
