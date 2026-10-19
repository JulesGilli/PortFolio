/**
 * Content model for the games. Everything the magazine prints about a game lives here;
 * copy (hooks, body, captions) lives in i18n keyed by slug.
 *
 * `null` means "Jules has not provided this yet": the UI prints an em dash, never a raw key.
 */

export type Slug =
  | 'eco'
  | 'dig-or-die'
  | 'color-gap'
  | 'tour-infinie'
  | 'mirapyde'
  | 'echoes'
  | 'whispers'
  | 'keep-dancing'
  | 'cursum'
  | 'speed-typo';

export type Platform = 'web' | 'win' | 'mac' | 'linux';
export type Controls = 'keyboard' | 'touch' | 'both';

/** One printed cahier: paper, ink, spot, plus the masthead cut. */
export interface Cahier {
  id: Slug | 'base';
  paper: string;
  ink: string;
  ink2: string;
  spot: string;
  /** text colour that passes 4.5:1 on the spot colour */
  onSpot: string;
  rule: string;
  ruleWidth: 1 | 2;
  /** masthead cut: width axis (62..125), weight (100..900), size as clamp() */
  mast: { wdth: number; wght: number; size: string; tracking: string };
  scheme: 'light' | 'dark';
}

export interface Shot {
  /** file stem under public/images/shots-web/<slug>/, e.g. "03" -> 03-800.webp / 03-1600.webp */
  id: string;
  /** native width/height of the source capture (used for aspect + max width) */
  w: number;
  h: number;
}

export interface Game {
  slug: Slug;
  title: string;
  /** itch.io genre label, shown as-is */
  genre: string;
  year: number | null;
  /** 'jam' | 'solo' | 'team' | 'school' | 'web' */
  context: 'jam' | 'solo' | 'team' | 'school' | 'web';
  /** e.g. "48 h", "8 mois" (fr) — translated via i18n key games.specs.<slug>.duration when present */
  role: string | null;
  team: number | null;
  engine: string;
  platforms: Platform[];
  controls: Controls;
  players: string;
  award?: string;
  featured?: 1 | 2 | 3;
  /** in-site build */
  build?: { url: string; sizeMB: number };
  itch?: string;
  github?: string;
  /** gameplay captures, in print order; the first one is the figure of the abridged cahier */
  shots: Shot[];
  /** small cover for the index (itch cover, shown at 0.5x) */
  cover: { src: string; w: number; h: number };
  cahier?: Cahier;
}

const base = import.meta.env.BASE_URL;

export const BASE_CAHIER: Cahier = {
  id: 'base',
  paper: '#F2EFE6',
  ink: '#121212',
  ink2: '#4A4842',
  spot: '#C8321F',
  onSpot: '#F2EFE6',
  rule: '#C9C4B6',
  ruleWidth: 1,
  mast: { wdth: 100, wght: 800, size: 'clamp(72px, 13.9vw, 200px)', tracking: '-0.03em' },
  scheme: 'light',
};

export const GAMES: Game[] = [
  {
    slug: 'eco',
    title: 'ECO',
    genre: 'Puzzle-platformer',
    year: 2026,
    context: 'solo',
    role: 'Solo',
    team: 1,
    engine: 'Unity · C#',
    platforms: ['web', 'win', 'mac', 'linux'],
    controls: 'keyboard',
    players: '1–2',
    featured: 1,
    build: { url: `${base}games/eco/index.html`, sizeMB: 86 },
    itch: 'https://jules-gilli.itch.io/eco',
    shots: [
      { id: '03', w: 2187, h: 1230 },
      { id: '06', w: 1920, h: 1080 },
      { id: '04', w: 2187, h: 1230 },
      { id: '05', w: 1920, h: 1080 },
      { id: '01', w: 1232, h: 706 },
    ],
    cover: { src: `${base}images/covers/eco.png`, w: 315, h: 250 },
    cahier: {
      id: 'eco',
      paper: '#0B1020',
      ink: '#DCE6F5',
      ink2: '#9AA6BC',
      spot: '#5CC8FF',
      onSpot: '#0B1020',
      rule: '#2A3550',
      ruleWidth: 2,
      mast: { wdth: 125, wght: 900, size: 'clamp(96px, 22vw, 320px)', tracking: '-0.02em' },
      scheme: 'dark',
    },
  },
  {
    slug: 'dig-or-die',
    title: 'DIG or DIE',
    genre: 'Puzzle',
    year: 2026,
    context: 'jam',
    role: 'Solo',
    team: 1,
    engine: 'Unity · C#',
    platforms: ['web'],
    controls: 'keyboard',
    players: '1',
    award: '1st place — game jam',
    featured: 2,
    build: { url: `${base}games/dig-or-die/index.html`, sizeMB: 60 },
    itch: 'https://jules-gilli.itch.io/dig-or-die',
    shots: [
      { id: '03', w: 1280, h: 720 },
      { id: '05', w: 1280, h: 720 },
      { id: '02', w: 1280, h: 720 },
      { id: '04', w: 1280, h: 720 },
      { id: '06', w: 1280, h: 720 },
    ],
    cover: { src: `${base}images/covers/dig-or-die.png`, w: 630, h: 500 },
    cahier: {
      id: 'dig-or-die',
      paper: '#0E1118',
      ink: '#F3E9C6',
      ink2: '#B9B095',
      spot: '#E8605A',
      onSpot: '#0E1118',
      rule: '#2E3340',
      ruleWidth: 1,
      mast: { wdth: 62, wght: 900, size: 'clamp(64px, 12.5vw, 180px)', tracking: '0' },
      scheme: 'dark',
    },
  },
  {
    slug: 'color-gap',
    title: 'Color GAP',
    genre: 'Platformer',
    year: 2026,
    context: 'jam',
    role: 'Co-dev',
    team: 2,
    engine: 'Unity · C#',
    platforms: ['win'],
    controls: 'keyboard',
    players: '1',
    award: 'Jury’s Favorite — Global Game Jam 2026',
    featured: 3,
    itch: 'https://jules-gilli.itch.io/color-gap',
    shots: [
      { id: '01', w: 2055, h: 1369 },
      { id: '02', w: 1914, h: 1075 },
      { id: '03', w: 1910, h: 1078 },
    ],
    cover: { src: `${base}images/covers/color-gap.png`, w: 691, h: 551 },
    cahier: {
      id: 'color-gap',
      paper: '#F4F1EA',
      ink: '#15150F',
      ink2: '#4A4842',
      spot: '#2B5FC4',
      onSpot: '#F4F1EA',
      rule: '#C9C4B6',
      ruleWidth: 1,
      mast: { wdth: 100, wght: 300, size: 'clamp(56px, 11vw, 160px)', tracking: '-0.01em' },
      scheme: 'light',
    },
  },
  {
    slug: 'tour-infinie',
    title: 'Tour Infinie',
    genre: 'Roguelite auto-battler',
    year: 2026,
    context: 'solo',
    role: 'Solo',
    team: 1,
    engine: 'Unity · C#',
    platforms: ['web', 'win', 'mac', 'linux'],
    controls: 'both',
    players: '1–2 (en ligne)',
    build: { url: `${base}games/tour-infinie/index.html`, sizeMB: 96 },
    itch: 'https://jules-gilli.itch.io/tour-infinie',
    shots: [
      { id: '02', w: 1920, h: 1080 },
      { id: '03', w: 1920, h: 1080 },
      { id: '05', w: 1920, h: 1080 },
      { id: '06', w: 1920, h: 1080 },
    ],
    cover: { src: `${base}images/covers/tour-infinie.png`, w: 630, h: 500 },
  },
  {
    slug: 'mirapyde',
    title: 'Mirapyde',
    genre: 'Platformer',
    year: 2025,
    context: 'solo',
    role: 'Solo',
    team: 1,
    engine: 'Unity · C#',
    platforms: ['web'],
    controls: 'keyboard',
    players: '1',
    build: { url: `${base}games/mirapyde/index.html`, sizeMB: 112 },
    itch: 'https://jules-gilli.itch.io/mirapyde',
    shots: [
      { id: '02', w: 2220, h: 1245 },
      { id: '03', w: 2217, h: 1231 },
      { id: '04', w: 2214, h: 1233 },
      { id: '01', w: 2225, h: 1247 },
    ],
    cover: { src: `${base}images/covers/mirapyde.png`, w: 495, h: 280 },
  },
  {
    slug: 'echoes',
    title: 'Echoes of the Abyss',
    genre: 'Action',
    year: 2024,
    context: 'school',
    role: 'Co-dev',
    team: 2,
    engine: 'Java · libGDX',
    platforms: ['web', 'win', 'mac', 'linux'],
    controls: 'keyboard',
    players: '1',
    build: { url: `${base}games/echoes/index.html`, sizeMB: 18 },
    itch: 'https://jules-gilli.itch.io/echoes-of-the-abyss',
    shots: [{ id: '02', w: 1787, h: 705 }],
    cover: { src: `${base}images/covers/echoes.png`, w: 495, h: 280 },
  },
  {
    slug: 'whispers',
    title: 'Whispers of the Tree',
    genre: 'Interactive fiction',
    year: 2024,
    context: 'school',
    role: 'Lead',
    team: 5,
    engine: 'Unity · C#',
    platforms: ['win'],
    controls: 'keyboard',
    players: '1',
    itch: 'https://jules-gilli.itch.io/whispers-of-the-tree',
    shots: [
      { id: '01', w: 2127, h: 1184 },
      { id: '04', w: 2128, h: 1184 },
      { id: '03', w: 1745, h: 978 },
    ],
    cover: { src: `${base}images/covers/whispers.png`, w: 315, h: 250 },
  },
  {
    slug: 'keep-dancing',
    title: 'Keep Dancing to Live',
    genre: 'Rhythm',
    year: 2024,
    context: 'jam',
    role: 'Prog + design',
    team: 4,
    engine: 'Unity · C#',
    platforms: ['win'],
    controls: 'keyboard',
    players: '1',
    itch: 'https://jules-gilli.itch.io/keep-dancing-to-live',
    shots: [
      { id: '01', w: 1755, h: 987 },
      { id: '04', w: 900, h: 500 },
    ],
    cover: { src: `${base}images/covers/keep-dancing.png`, w: 495, h: 280 },
  },
  {
    slug: 'cursum',
    title: 'Cursum',
    genre: 'Platformer',
    year: 2023,
    context: 'solo',
    role: 'solo',
    team: 1,
    engine: 'Unity · C#',
    platforms: ['win'],
    controls: 'keyboard',
    players: '1',
    itch: 'https://jules-gilli.itch.io/cursum',
    shots: [
      { id: '01', w: 1204, h: 614 },
      { id: '03', w: 1288, h: 710 },
      { id: '02', w: 1152, h: 622 },
    ],
    cover: { src: `${base}images/covers/cursum.jpg`, w: 1047, h: 974 },
  },
  {
    slug: 'speed-typo',
    title: 'Speed Typo',
    genre: 'Typing',
    year: 2024,
    context: 'web',
    role: 'solo',
    team: 1,
    engine: 'React',
    platforms: ['web'],
    controls: 'keyboard',
    players: '1',
    build: { url: 'https://julesgilli.github.io/SpeedType/', sizeMB: 1 },
    itch: 'https://julesgilli.github.io/SpeedType/',
    shots: [],
    cover: { src: `${base}images/covers/cursum.jpg`, w: 0, h: 0 },
  },
];

export const FEATURED: Game[] = GAMES.filter((g) => g.featured).sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0));

/** Index order: featured first, then newest first. */
export const INDEXED: Game[] = [
  ...FEATURED,
  ...GAMES.filter((g) => !g.featured).sort((a, b) => (b.year ?? 0) - (a.year ?? 0)),
  // unknown years sort last; Jules will fill them in
];

export const bySlug = (slug: string): Game | undefined => GAMES.find((g) => g.slug === slug);

export function cahierOf(game: Game | undefined): Cahier {
  return game?.cahier ?? BASE_CAHIER;
}

export function shotSrc(slug: Slug, shot: Shot, width: 800 | 1600): string {
  return `${base}images/shots-web/${slug}/${shot.id}-${width}.webp`;
}

export const PLAYABLE_HERE = GAMES.filter((g) => g.build && g.slug !== 'speed-typo').length;
