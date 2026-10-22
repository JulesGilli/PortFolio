// Pre-renders every route into dist/: the home page and one page per game, in French (/) and
// English (/en/). Each page gets its own text, title, description, canonical, hreflang and share
// image, and is served with a 200 by GitHub Pages. Runs after `vite build` and the SSR build.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const SITE = 'https://gillijules.com';
const DIST = resolve('dist');
const SSR = resolve('dist-ssr');

const { render, GAMES, fr, en } = await import(pathToFileURL(join(SSR, 'entry-server.js')).href);
const LOCALES = { fr, en };
const EDITIONS = [
  { lng: 'fr', prefix: '', ogLocale: 'fr_FR' },
  { lng: 'en', prefix: '/en', ogLocale: 'en_GB' },
];

const template = readFileSync(join(DIST, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function clip(text, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.—-]+$/, '') + '…';
}

/** Replace the content of the one tag matching `attr` (e.g. 'name="description"'); fail loudly if absent. */
function setTag(html, attr, value, key = 'content') {
  const re = new RegExp(`(<(?:meta|link) ${attr} ${key}=")[^"]*(")`);
  if (!re.test(html)) throw new Error(`template has no <… ${attr}>`);
  return html.replace(re, `$1${esc(value)}$2`);
}

// The two faces visible above the fold: Archivo (UI, mastheads) and Newsreader (body).
const assets = readdirSync(join(DIST, 'assets'));
const preloads = [/^archivo-latin-wdth-normal-.*\.woff2$/, /^newsreader-latin-opsz-normal-.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />`);

const games = GAMES.filter((g) => g.slug !== 'speed-typo');
const routes = [{ path: '/', game: null }, ...games.map((g) => ({ path: `/jeux/${g.slug}/`, game: g }))];

const sitemap = [];
for (const { path, game } of routes) {
  const alternates = EDITIONS.map((e) => ({ lng: e.lng, href: `${SITE}${e.prefix}${path}` }));
  const hreflang = [
    ...alternates.map((a) => `<link rel="alternate" hreflang="${a.lng}" href="${a.href}" />`),
    `<link rel="alternate" hreflang="x-default" href="${alternates[0].href}" />`,
  ];
  sitemap.push({ alternates });

  for (const { lng, prefix, ogLocale } of EDITIONS) {
    const t = LOCALES[lng];
    const url = `${SITE}${prefix}${path}`;
    const title = game ? `${game.title} — Jules Gilli` : t.meta.title;
    const copy = game && t.games[game.slug];
    const description = game ? clip(`${copy.hook} ${copy.body}`) : t.meta.description;
    const image = game
      ? { src: `${SITE}${game.cover.src}`, w: game.cover.w, h: game.cover.h, alt: game.title }
      : { src: `${SITE}/og-image.jpg`, w: 1200, h: 630, alt: 'Jules Gilli — Portfolio' };

    let html = template.replace('<html lang="fr">', `<html lang="${lng}">`);
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    html = setTag(html, 'name="description"', description);
    html = setTag(html, 'property="og:url"', url);
    html = setTag(html, 'property="og:title"', title);
    html = setTag(html, 'property="og:description"', description);
    html = setTag(html, 'property="og:image"', image.src);
    html = setTag(html, 'property="og:image:width"', image.w);
    html = setTag(html, 'property="og:image:height"', image.h);
    html = setTag(html, 'property="og:image:alt"', image.alt);
    html = setTag(html, 'property="og:locale"', ogLocale);
    html = setTag(html, 'name="twitter:url"', url);
    html = setTag(html, 'name="twitter:title"', title);
    html = setTag(html, 'name="twitter:description"', description);
    html = setTag(html, 'name="twitter:image"', image.src);
    html = setTag(html, 'rel="canonical"', url, 'href');
    html = html.replace('</head>', `    ${[...hreflang, ...preloads].join('\n    ')}\n  </head>`);
    html = html.replace('<div id="root"></div>', `<div id="root">${await render(`${prefix}${path}`, lng)}</div>`);

    const out = join(DIST, `${prefix}${path}`.replace(/^\//, ''), 'index.html');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, html);
  }
}

writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap
  .flatMap(({ alternates }) =>
    alternates.map(
      (page) =>
        `  <url>\n    <loc>${page.href}</loc>\n${alternates
          .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lng}" href="${a.href}" />`)
          .join('\n')}\n  </url>`,
    ),
  )
  .join('\n')}
</urlset>
`,
);

if (existsSync(SSR)) rmSync(SSR, { recursive: true, force: true });
console.log(`prerendered ${routes.length * EDITIONS.length} pages, sitemap with ${sitemap.length * EDITIONS.length} URLs`);
