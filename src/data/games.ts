/**
 * Content model for the games. Everything the magazine prints about a game lives here;
 * copy (hooks, body, captions) lives in i18n keyed by slug.
 *
 * `null` means "Jules has not provided this yet": the UI prints an em dash, never a raw key.
 */

export type Slug =
  | 'hello-garden'
  | 'feel'
  | 'eco'
  | 'hors-antenne'
  | 'color-gap'
  | 'mirapyde'
  | 'echoes'
  | 'whispers'
  | 'keep-dancing'
  | 'cursum'
  | 'speed-typo';

export type Platform = 'web' | 'win' | 'mac' | 'linux';
/** 'gamepad' = keyboard and mouse, or a controller (no touch) */
export type Controls = 'keyboard' | 'touch' | 'both' | 'gamepad';

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
  /** file stem under public/images/shots-web/<slug>/, e.g. "03" -> 03-400.webp (thumbs) / 03-800.webp / 03-1600.webp */
  id: string;
  /** native width/height of the source capture (used for aspect + max width) */
  w: number;
  h: number;
}

export interface Devlog {
  n: number;
  /** YouTube video id */
  id: string;
  title: string;
}

export const devlogUrl = (d: Devlog) => `https://www.youtube.com/watch?v=${d.id}`;

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
  /** not released yet: printed as a sticker and a specs row */
  status?: 'in-development';
  /** order of the cahiers on the home page */
  featured?: 1 | 2 | 3 | 4 | 5;
  /** in-site build; sizeMB = what the browser downloads (GitHub Pages gzips .wasm/.data/.js) */
  build?: { url: string; sizeMB: number };
  itch?: string;
  github?: string;
  /** making-of videos, in episode order; titles are printed as published (French) */
  devlogs?: { playlist: string; videos: Devlog[] };
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
    slug: 'hello-garden',
    title: 'Hello, Garden',
    genre: 'Tower defense',
    year: 2026,
    context: 'solo',
    role: 'Solo',
    team: 1,
    engine: 'Unity · C#',
    platforms: ['win'],
    controls: 'keyboard',
    players: '1',
    status: 'in-development',
    featured: 1,
    itch: 'https://jules-gilli.itch.io/hello-garden',
    shots: [
      { id: '01', w: 1920, h: 1080 },
      { id: '02', w: 1920, h: 1080 },
      { id: '04', w: 1920, h: 1080 },
      { id: '06', w: 1920, h: 1080 },
      { id: '08', w: 1920, h: 1080 },
    ],
    cover: { src: `${base}images/covers/hello-garden.png`, w: 630, h: 500 },
    cahier: {
      id: 'hello-garden',
      paper: '#EAF2D7',
      ink: '#1D2B2A',
      ink2: '#4B5A52',
      spot: '#0B6B74',
      onSpot: '#EAF2D7',
      rule: '#C5D2AC',
      ruleWidth: 1,
      mast: { wdth: 100, wght: 800, size: 'clamp(44px, 9.6vw, 138px)', tracking: '-0.02em' },
      scheme: 'light',
    },
  },
  {
    slug: 'feel',
    title: 'Feel',
    genre: 'First-person exploration',
    year: 2026,
    context: 'solo',
    role: 'Solo',
    team: 1,
    engine: 'Unity · C#',
    platforms: ['win'],
    controls: 'gamepad',
    players: '1',
    status: 'in-development',
    featured: 2,
    // no itch link yet: the page is restricted until Jules publishes it
    devlogs: {
      playlist: 'https://www.youtube.com/playlist?list=PLW8Fofhb2us0',
      videos: [
        { n: 1, id: 'CjuQ9VZV9zk', title: "J'ai mis le vrai ciel de 1377 dans mon jeu" },
        { n: 2, id: 'WMk9v_O5wtA', title: "Lire l'heure dans les étoiles, comme en 1377" },
        { n: 3, id: 'K3r2mPYXjec', title: 'Pourquoi les étoiles filantes viennent toutes du même point' },
        { n: 4, id: 'OhZJg7_8cb4', title: 'Une étoile vous dit où vous êtes : le quart de cercle' },
        { n: 5, id: '0fG5zzHdO6Y', title: "4 millions de touffes d'herbe en 16 ms : comment mon jeu triche" },
        { n: 6, id: '4lz2n6tQf5Y', title: 'Le ciel entier, en laiton : la sphère armillaire' },
        { n: 7, id: 'bvMoROwgFzA', title: 'La Lune marche : comment on la mesurait en 1377' },
      ],
    },
    shots: [
      { id: '02', w: 1920, h: 1080 },
      { id: '01', w: 1920, h: 1080 },
      { id: '04', w: 1920, h: 1080 },
      { id: '05', w: 1920, h: 1080 },
      { id: '07', w: 1920, h: 1080 },
    ],
    cover: { src: `${base}images/covers/feel.jpg`, w: 630, h: 500 },
    cahier: {
      id: 'feel',
      paper: '#0B1147',
      ink: '#EFE6CF',
      ink2: '#A9AED2',
      spot: '#E9B44C',
      onSpot: '#0B1147',
      rule: '#2B3378',
      ruleWidth: 1,
      mast: { wdth: 100, wght: 200, size: 'clamp(72px, 16vw, 232px)', tracking: '0.2em' },
      scheme: 'dark',
    },
  },
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
    featured: 3,
    build: { url: `${base}games/eco/index.html`, sizeMB: 27 },
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
    slug: 'hors-antenne',
    title: 'Hors Antenne',
    genre: 'First-person horror',
    year: 2026,
    context: 'jam',
    role: 'Co-dev',
    team: 2,
    engine: 'Unity · C#',
    platforms: ['web', 'win'],
    controls: 'gamepad',
    players: '1',
    award: '1st place — Dev&Play Jam 2026',
    featured: 4,
    // the data file is split in three parts (GitHub's 100 MB limit), see public/games/README.md
    build: { url: `${base}games/hors-antenne/index.html`, sizeMB: 110 },
    itch: 'https://jules-gilli.itch.io/hors-antenne',
    shots: [
      { id: '01', w: 1920, h: 1080 },
      { id: '05', w: 1920, h: 1080 },
      { id: '04', w: 1920, h: 1080 },
      { id: '02', w: 1920, h: 1080 },
      { id: '06', w: 1920, h: 1080 },
    ],
    cover: { src: `${base}images/covers/hors-antenne.jpg`, w: 1200, h: 900 },
    cahier: {
      id: 'hors-antenne',
      paper: '#070908',
      ink: '#D5DED6',
      ink2: '#93A096',
      spot: '#F0463A',
      onSpot: '#070908',
      rule: '#27302A',
      ruleWidth: 1,
      mast: { wdth: 75, wght: 700, size: 'clamp(46px, 11.5vw, 168px)', tracking: '0.04em' },
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
    featured: 5,
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
    build: { url: `${base}games/mirapyde/index.html`, sizeMB: 63 },
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
    build: { url: `${base}games/echoes/index.html`, sizeMB: 8 },
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

export function shotSrc(slug: Slug, shot: Shot, width: 400 | 800 | 1600): string {
  return `${base}images/shots-web/${slug}/${shot.id}-${width}.webp`;
}

export const PLAYABLE_HERE = GAMES.filter((g) => g.build && g.slug !== 'speed-typo').length;
