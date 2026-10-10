import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useMediaQuery';
import type { BackdropFx } from '../../theme';

type Rgb = [number, number, number];
const hex = (h: string): Rgb => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgba = ([r, g, b]: Rgb, a: number) => `rgba(${r},${g},${b},${a})`;

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, accent: Rgb, frame: number) => void;

/* ---------- Effects ---------- */

// ECO: floating pixel cubes drifting up through a faint grid + scanlines.
const crt: Draw = (ctx, w, h, t, accent) => {
  ctx.fillStyle = rgba(accent, 0.05);
  const g = 48;
  for (let x = (t * 10) % g; x < w; x += g) ctx.fillRect(x, 0, 1, h);
  for (let y = (t * 10) % g; y < h; y += g) ctx.fillRect(0, y, w, 1);
  const n = 22;
  for (let i = 0; i < n; i++) {
    const seed = i * 97.3;
    const s = 10 + ((i * 37) % 30);
    const x = ((seed * 13) % w) + Math.sin(t * 0.4 + i) * 20;
    const y = h - ((t * (12 + (i % 5) * 6) + seed * 7) % (h + 80)) + 40;
    ctx.fillStyle = rgba(accent, 0.12 + (i % 4) * 0.06);
    ctx.fillRect(Math.round(x), Math.round(y), s, s);
    ctx.fillStyle = rgba(accent, 0.35);
    ctx.fillRect(Math.round(x), Math.round(y), s, 2);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
};

// DIG or DIE: pixel night sky, twinkling stars, big moon, moving ground with spikes.
const stars: Draw = (ctx, w, h, t, accent) => {
  for (let i = 0; i < 140; i++) {
    const x = (i * 131.7) % w;
    const y = (i * 71.3) % (h * 0.75);
    const tw = 0.3 + 0.7 * Math.abs(Math.sin(t * (0.6 + (i % 7) * 0.2) + i));
    ctx.fillStyle = `rgba(240,235,210,${tw * 0.9})`;
    const s = i % 9 === 0 ? 3 : 2;
    ctx.fillRect(Math.round(x), Math.round(y), s, s);
  }
  // moon
  const mx = w * 0.82;
  const my = h * 0.2;
  ctx.fillStyle = 'rgba(240,235,210,0.9)';
  ctx.beginPath();
  ctx.arc(mx, my, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(240,235,210,0.25)';
  ctx.beginPath();
  ctx.arc(mx, my, 60 + Math.sin(t) * 4, 0, Math.PI * 2);
  ctx.fill();
  // ground
  const gy = h * 0.86;
  ctx.fillStyle = rgba(accent, 0.9);
  ctx.fillRect(0, gy, w, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, gy + 4, w, h - gy);
  // spikes scrolling
  const sp = 46;
  const off = (t * 60) % sp;
  ctx.fillStyle = 'rgba(240,235,210,0.85)';
  for (let x = -off; x < w; x += sp) {
    if (Math.floor((x + off) / sp) % 3 === 0) {
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + 8, gy - 18);
      ctx.lineTo(x + 16, gy);
      ctx.fill();
    }
  }
};

// Color GAP: three primary masks sliding over each other with the game's cycling rhythm.
const tricolor: Draw = (ctx, w, h, t) => {
  const cols: Rgb[] = [
    [242, 194, 48],
    [222, 70, 70],
    [60, 120, 230],
  ];
  const phase = Math.floor(t / 1.6) % 3;
  cols.forEach((c, i) => {
    const active = i === phase;
    const a = active ? 0.26 : 0.07;
    const cx = w * (0.2 + 0.3 * i) + Math.sin(t * 0.5 + i * 2) * 80;
    const cy = h * 0.55 + Math.cos(t * 0.4 + i) * 60;
    const r = Math.max(w, h) * (active ? 0.55 : 0.35);
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grd.addColorStop(0, rgba(c, a));
    grd.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);
  });
  // thin platform lines, one per colour, only the active one is solid
  cols.forEach((c, i) => {
    const y = h * (0.35 + i * 0.18);
    ctx.fillStyle = rgba(c, i === phase ? 0.9 : 0.12);
    const len = w * 0.22;
    const x = ((t * 40 + i * 300) % (w + len)) - len;
    ctx.fillRect(x, y, len, 3);
  });
};

// Tour Infinie: an endless tower of bricks scrolling down forever.
const tower: Draw = (ctx, w, h, t, accent) => {
  const bw = 54;
  const bh = 26;
  const tx = w * 0.62;
  const tw = w * 0.3;
  const off = (t * 40) % bh;
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(tx, 0, tw, h);
  for (let y = -bh + off; y < h; y += bh) {
    const row = Math.floor((y - off) / bh);
    const shift = row % 2 ? bw / 2 : 0;
    for (let x = tx - shift; x < tx + tw; x += bw) {
      const lit = (row * 7 + Math.floor(x / bw)) % 11 === 0;
      ctx.fillStyle = lit ? rgba(accent, 0.55) : rgba(accent, 0.1);
      ctx.fillRect(Math.max(x, tx), y, Math.min(bw - 3, tx + tw - x), bh - 3);
    }
  }
  // windows glow
  for (let i = 0; i < 6; i++) {
    const y = ((t * 40 + i * 180) % (h + 60)) - 60;
    ctx.fillStyle = rgba(accent, 0.8);
    ctx.fillRect(tx + tw * 0.5 - 6, y, 12, 16);
  }
};

// Echoes: rising embers in a dark cavern.
const abyss: Draw = (ctx, w, h, t, accent) => {
  for (let i = 0; i < 60; i++) {
    const x = ((i * 173.1) % w) + Math.sin(t * 0.8 + i) * 14;
    const y = h - ((t * (20 + (i % 6) * 8) + i * 91) % (h + 40));
    const a = 0.15 + 0.5 * Math.abs(Math.sin(t * 2 + i));
    ctx.fillStyle = rgba(accent, a);
    ctx.fillRect(Math.round(x), Math.round(y), 2, 2);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, w, h * 0.12);
  ctx.fillRect(0, h * 0.88, w, h * 0.12);
};

// Default: slow drifting dust in the accent colour.
const dust: Draw = (ctx, w, h, t, accent) => {
  for (let i = 0; i < 40; i++) {
    const x = ((i * 211.3 + t * (6 + (i % 4) * 3)) % (w + 40)) - 20;
    const y = (i * 97.7) % h;
    ctx.fillStyle = rgba(accent, 0.08 + (i % 3) * 0.05);
    ctx.beginPath();
    ctx.arc(x, y, 1.5 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
};

const FX: Record<Exclude<BackdropFx, 'cover'>, Draw> = { crt, stars, tricolor, tower, abyss, dust };

/* ---------- Canvas runner ---------- */

function FxCanvas({ fx, accent }: { fx: Exclude<BackdropFx, 'cover'>; accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const draw = FX[fx];
    const acc = hex(accent);
    let raf = 0;
    let frame = 0;
    const t0 = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const loop = (now: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, (now - t0) / 1000, acc, frame++);
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [fx, accent, reduced]);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden />;
}

/* ---------- Public component ---------- */

export function Backdrop({
  id,
  fx = 'cover',
  image,
  accent,
  visible = true,
}: {
  id: string | number;
  fx?: BackdropFx;
  image: string;
  accent: string;
  visible?: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.img
            src={image}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: 'blur(56px) saturate(1.4)', opacity: fx === 'cover' ? 0.9 : 0.45 }}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1.35 }}
            transition={{ duration: 12, ease: 'linear' }}
          />
          {fx !== 'cover' && <FxCanvas fx={fx} accent={accent} />}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/30 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/20 to-transparent" />
    </div>
  );
}
