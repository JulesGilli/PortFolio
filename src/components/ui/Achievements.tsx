import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TrophyIcon, XIcon, LockIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EASE } from './Reveal';

/* ---------- Definitions ---------- */

export type AchievementId =
  | 'first-play'
  | 'three-games'
  | 'all-featured'
  | 'scroll-end'
  | 'polyglot'
  | 'tools-peek'
  | 'patient'
  | 'night-owl'
  | 'konami'
  | 'insistent';

export const ACHIEVEMENTS: { id: AchievementId; icon: string; secret?: boolean }[] = [
  { id: 'first-play', icon: '🎮' },
  { id: 'three-games', icon: '🕹️' },
  { id: 'all-featured', icon: '⭐' },
  { id: 'scroll-end', icon: '🏁' },
  { id: 'polyglot', icon: '🌍' },
  { id: 'tools-peek', icon: '🔧' },
  { id: 'patient', icon: '⏳' },
  { id: 'night-owl', icon: '🦉', secret: true },
  { id: 'konami', icon: '👾', secret: true },
  { id: 'insistent', icon: '🔁', secret: true },
];

const STORAGE_KEY = 'achievements';
const PLAYED_KEY = 'achievements-played';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

/* ---------- Context ---------- */

type Api = {
  unlocked: AchievementId[];
  unlock: (id: AchievementId) => void;
  /** Call when a game is launched; handles play-count achievements. */
  trackPlay: (slug: string, featured: boolean) => void;
  openPanel: () => void;
};

const Ctx = createContext<Api>({ unlocked: [], unlock: () => {}, trackPlay: () => {}, openPanel: () => {} });
export const useAchievements = () => useContext(Ctx);

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function AchievementsProvider({
  children,
  featuredSlugs,
}: {
  children: ReactNode;
  featuredSlugs: string[];
}) {
  const [unlocked, setUnlocked] = useState<AchievementId[]>(() => load(STORAGE_KEY, []));
  const [queue, setQueue] = useState<AchievementId[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const played = useRef<{ slugs: string[]; featured: string[] }>(load(PLAYED_KEY, { slugs: [], featured: [] }));

  const unlock = useCallback((id: AchievementId) => {
    setUnlocked((cur) => {
      if (cur.includes(id)) return cur;
      const next = [...cur, id];
      save(STORAGE_KEY, next);
      setQueue((q) => [...q, id]);
      return next;
    });
  }, []);

  const trackPlay = useCallback(
    (slug: string, featured: boolean) => {
      const p = played.current;
      if (!p.slugs.includes(slug)) p.slugs.push(slug);
      if (featured && !p.featured.includes(slug)) p.featured.push(slug);
      save(PLAYED_KEY, p);
      unlock('first-play');
      if (p.slugs.length >= 3) unlock('three-games');
      if (featuredSlugs.length > 0 && featuredSlugs.every((s) => p.featured.includes(s))) unlock('all-featured');
    },
    [unlock, featuredSlugs],
  );

  // Passive achievements: time on site, night visit, Konami code.
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) unlock('night-owl');
    const patient = setTimeout(() => unlock('patient'), 5 * 60 * 1000);

    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        unlock('konami');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(patient);
      window.removeEventListener('keydown', onKey);
    };
  }, [unlock]);

  // Toast queue: show one at a time.
  const [current, setCurrent] = useState<AchievementId | null>(null);
  useEffect(() => {
    if (current || queue.length === 0) return;
    setCurrent(queue[0]);
    setQueue((q) => q.slice(1));
    const id = setTimeout(() => setCurrent(null), 4200);
    return () => clearTimeout(id);
  }, [queue, current]);

  const api = useMemo<Api>(
    () => ({ unlocked, unlock, trackPlay, openPanel: () => setPanelOpen(true) }),
    [unlocked, unlock, trackPlay],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <Toast id={current} />
      <Panel open={panelOpen} onClose={() => setPanelOpen(false)} unlocked={unlocked} />
    </Ctx.Provider>
  );
}

/* ---------- Toast ---------- */

function Toast({ id }: { id: AchievementId | null }) {
  const { t } = useTranslation();
  const def = ACHIEVEMENTS.find((a) => a.id === id);
  return (
    <div className="pointer-events-none fixed bottom-5 left-5 z-[85] md:bottom-8 md:left-8">
      <AnimatePresence>
        {id && def && (
          <motion.div
            key={id}
            className="flex items-center gap-4 rounded-xl border border-accent/40 bg-ink/90 p-3 pr-5 shadow-2xl shadow-black/50 backdrop-blur"
            initial={{ x: -40, opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <motion.span
              className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-2xl"
              initial={{ rotate: -20, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 14, delay: 0.15 }}
            >
              {def.icon}
            </motion.span>
            <div>
              <div className="meta !text-accent">{t('achievements.unlocked')}</div>
              <div className="font-display text-base font-semibold tracking-tight">{t(`achievements.items.${id}.title`)}</div>
              <div className="text-xs text-muted">{t(`achievements.items.${id}.desc`)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Trophy button + panel ---------- */

export function TrophyButton() {
  const { unlocked, openPanel } = useAchievements();
  const { t } = useTranslation();
  return (
    <button
      type="button"
      onClick={openPanel}
      data-cursor=""
      aria-label={t('achievements.title')}
      className="meta inline-flex items-center gap-1.5 rounded-full border border-bone/20 px-3 py-1.5 !text-bone transition-colors hover:border-bone/50"
    >
      <TrophyIcon size={12} className={unlocked.length ? 'text-accent' : ''} />
      {unlocked.length}/{ACHIEVEMENTS.length}
    </button>
  );
}

function Panel({ open, onClose, unlocked }: { open: boolean; onClose: () => void; unlocked: AchievementId[] }) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[86] flex justify-end bg-ink/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.aside
            className="flex h-full w-full max-w-md flex-col border-l border-bone/10 bg-ink"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={t('achievements.title')}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-bone/10 px-5 py-4">
              <div>
                <div className="font-display text-xl font-semibold tracking-tight">{t('achievements.title')}</div>
                <div className="meta mt-1">
                  {unlocked.length}/{ACHIEVEMENTS.length} · {Math.round((unlocked.length / ACHIEVEMENTS.length) * 100)}%
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                data-cursor=""
                aria-label={t('player.close')}
                className="grid h-9 w-9 place-items-center rounded-full border border-bone/20 text-bone"
              >
                <XIcon size={14} />
              </button>
            </div>

            <div className="h-1 bg-bone/10">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                animate={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
              />
            </div>

            <ul className="flex-1 overflow-y-auto px-5 py-3">
              {ACHIEVEMENTS.map((a, i) => {
                const done = unlocked.includes(a.id);
                const hidden = a.secret && !done;
                return (
                  <motion.li
                    key={a.id}
                    className={`flex items-center gap-4 border-b border-bone/10 py-4 ${done ? '' : 'opacity-50'}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: done ? 1 : 0.5, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.04, duration: 0.5, ease: EASE }}
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg text-xl ${
                        done ? 'bg-accent' : 'border border-bone/15'
                      }`}
                    >
                      {hidden ? <LockIcon size={14} /> : done ? a.icon : <span className="grayscale opacity-60">{a.icon}</span>}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-sm font-semibold tracking-tight">
                        {hidden ? t('achievements.secret') : t(`achievements.items.${a.id}.title`)}
                      </div>
                      <div className="text-xs text-muted">
                        {hidden ? t('achievements.secretHint') : t(`achievements.items.${a.id}.desc`)}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
