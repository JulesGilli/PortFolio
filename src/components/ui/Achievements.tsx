import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollLock } from '../../lib/useScrollLock';
import { useDialogFocus } from '../../lib/useDialogFocus';

/* ---------- Definitions ---------- */

export type AchievementId =
  | 'first-play'
  | 'three-games'
  | 'all-featured'
  | 'scroll-end'
  | 'polyglot'
  | 'tools-peek'
  | 'finisher'
  | 'patient'
  | 'night-owl'
  | 'konami'
  | 'insistent';

export const ACHIEVEMENTS: { id: AchievementId; secret?: boolean }[] = [
  { id: 'first-play' },
  { id: 'three-games' },
  { id: 'all-featured' },
  { id: 'scroll-end' },
  { id: 'polyglot' },
  { id: 'tools-peek' },
  // { id: 'finisher' }: put back once a build posts { event: 'finished' } (see public/games/README.md);
  // until then nobody can get it.
  { id: 'patient' },
  { id: 'night-owl', secret: true },
  { id: 'konami', secret: true },
  { id: 'insistent', secret: true },
];

const listed = (id: AchievementId) => ACHIEVEMENTS.some((a) => a.id === id);

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

/* ---------- State ---------- */

type State = { unlocked: AchievementId[]; queue: AchievementId[]; current: AchievementId | null; panel: boolean };
type Action =
  | { type: 'unlock'; id: AchievementId }
  | { type: 'show' }
  | { type: 'hide' }
  | { type: 'panel'; open: boolean };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'unlock': {
      if (s.unlocked.includes(a.id) || !listed(a.id)) return s;
      const unlocked = [...s.unlocked, a.id];
      save(STORAGE_KEY, unlocked);
      return { ...s, unlocked, queue: [...s.queue, a.id] };
    }
    case 'show':
      if (s.current || s.queue.length === 0) return s;
      return { ...s, current: s.queue[0], queue: s.queue.slice(1) };
    case 'hide':
      return { ...s, current: null };
    case 'panel':
      return { ...s, panel: a.open };
  }
}

type Api = {
  unlocked: AchievementId[];
  unlock: (id: AchievementId) => void;
  trackPlay: (slug: string, featured: boolean) => void;
  openPanel: () => void;
};

const Ctx = createContext<Api>({ unlocked: [], unlock: () => {}, trackPlay: () => {}, openPanel: () => {} });
export const useAchievements = () => useContext(Ctx);

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function AchievementsProvider({ children, featuredSlugs }: { children: ReactNode; featuredSlugs: string[] }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    unlocked: load<AchievementId[]>(STORAGE_KEY, []).filter(listed),
    queue: [],
    current: null,
    panel: false,
  }));
  const played = useRef<{ slugs: string[]; featured: string[] }>(load(PLAYED_KEY, { slugs: [], featured: [] }));

  const unlock = useCallback((id: AchievementId) => dispatch({ type: 'unlock', id }), []);

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

  // Passive achievements.
  useEffect(() => {
    if (new Date().getHours() < 5) unlock('night-owl');
    const patient = window.setTimeout(() => unlock('patient'), 5 * 60 * 1000);
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
      window.clearTimeout(patient);
      window.removeEventListener('keydown', onKey);
    };
  }, [unlock]);

  // Toast queue: one at a time, 4.2 s each. Two separate effects so the timer never cancels itself.
  useEffect(() => {
    if (!state.current && state.queue.length) dispatch({ type: 'show' });
  }, [state.current, state.queue]);
  useEffect(() => {
    if (!state.current) return;
    const id = window.setTimeout(() => dispatch({ type: 'hide' }), 4200);
    return () => window.clearTimeout(id);
  }, [state.current]);

  const api = useMemo<Api>(
    () => ({ unlocked: state.unlocked, unlock, trackPlay, openPanel: () => dispatch({ type: 'panel', open: true }) }),
    [state.unlocked, unlock, trackPlay],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      <Toast id={state.current} count={state.unlocked.length} />
      <Panel open={state.panel} onClose={() => dispatch({ type: 'panel', open: false })} unlocked={state.unlocked} />
    </Ctx.Provider>
  );
}

/* ---------- Toast: a printed sticker ---------- */

function Toast({ id, count }: { id: AchievementId | null; count: number }) {
  const { t } = useTranslation();
  const index = id ? ACHIEVEMENTS.findIndex((a) => a.id === id) + 1 : 0;
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-[90] md:bottom-8 md:right-8">
      {id && (
        <div key={id} className="toast-in flex w-[calc(100vw-40px)] max-w-[320px] items-stretch border border-ink bg-spot text-onspot">
          <span className="t-mast flex w-16 shrink-0 items-center justify-center border-r border-ink [--mast-size:28px]">{String(index).padStart(2, '0')}</span>
          <div className="px-4 py-3">
            <p className="t-meta">
              {t('achievements.unlocked')} — {String(count).padStart(2, '0')}/{ACHIEVEMENTS.length}
            </p>
            <p className="t-cell-strong mt-1">{t(`achievements.items.${id}.title`)}</p>
            <p className="t-cell">{t(`achievements.items.${id}.desc`)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Trophy chip + drawer ---------- */

export function TrophyButton() {
  const { unlocked, openPanel } = useAchievements();
  const { t } = useTranslation();
  return (
    <button type="button" onClick={openPanel} aria-label={t('achievements.title')} className="t-ui flex h-11 items-center gap-2 border border-ink px-3 hover:bg-ink hover:text-paper">
      <span className="hidden sm:inline">{t('achievements.title')}</span>
      <span className="tabular-nums">
        {String(unlocked.length).padStart(2, '0')}/{ACHIEVEMENTS.length}
      </span>
    </button>
  );
}

function Panel({ open, onClose, unlocked }: { open: boolean; onClose: () => void; unlocked: AchievementId[] }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  useScrollLock(open);
  useDialogFocus(ref, open);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  const pct = Math.round((unlocked.length / ACHIEVEMENTS.length) * 100);

  return (
    <div className="fixed inset-0 z-[86] flex justify-end bg-ink/40" onClick={onClose}>
      <aside
        ref={ref}
        tabIndex={-1}
        className="flex h-full w-full max-w-[420px] flex-col border-l border-ink bg-paper text-ink outline-none"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t('achievements.title')}
      >
        <div className="flex items-center justify-between border-b border-ink px-5 py-4">
          <div>
            <p className="t-section">{t('achievements.title')}</p>
            <p className="t-meta ink2 mt-1">
              {String(unlocked.length).padStart(2, '0')}/{ACHIEVEMENTS.length} · {pct} %
            </p>
          </div>
          <button type="button" onClick={onClose} className="btn btn-ghost btn-sm">
            {t('player.close')}
          </button>
        </div>
        <div className="h-2 border-b border-ink">
          <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
        </div>
        <ol className="flex-1 overflow-y-auto px-5">
          {ACHIEVEMENTS.map((a, i) => {
            const done = unlocked.includes(a.id);
            const hidden = a.secret && !done;
            return (
              <li key={a.id} className="rule-in flex items-center gap-4 py-3">
                <span className={`t-cell-strong flex h-10 w-10 shrink-0 items-center justify-center border border-ink tabular-nums ${done ? 'bg-spot text-onspot' : 'ink2'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className={done ? '' : 'ink2'}>
                  <p className="t-cell-strong">{hidden ? t('achievements.secret') : t(`achievements.items.${a.id}.title`)}</p>
                  <p className="t-cell">{hidden ? '— — —' : t(`achievements.items.${a.id}.desc`)}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}
