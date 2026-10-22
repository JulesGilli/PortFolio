/**
 * Build-time renderer (scripts/prerender.mjs): turns a route into HTML so every page ships with
 * its text, and crawlers and link previews read the right page without running JavaScript.
 */
import { renderToString } from 'react-dom/server';
import i18n from './i18n';
import { App } from './App';
import { setServerPath } from './lib/route';

export { GAMES } from './data/games';
export { default as fr } from './i18n/locales/fr.json';
export { default as en } from './i18n/locales/en.json';

export async function render(path: string, lng: 'fr' | 'en'): Promise<string> {
  setServerPath(path);
  await i18n.changeLanguage(lng);
  return renderToString(<App />);
}
