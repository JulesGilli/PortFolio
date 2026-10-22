# Jules Gilli — portfolio

Portfolio de Jules Gilli, développeur de jeux (Unity, C#), en ligne sur [gillijules.com](https://gillijules.com).

Le site est conçu comme un numéro de magazine jouable : une couverture, un cahier par jeu mis en avant
(ECO, DIG or DIE, Color GAP), un index de tous les jeux, les outils Asset Store en colophon, le contact.
Chaque cahier est imprimé sur son propre papier (fond, encre, couleur d'accompagnement, coupe du titre) ;
le chrome du site adopte le cahier qui couvre le milieu de l'écran, par coupe franche.
Les jeux qui ont un build navigateur se jouent dans la page.

## Stack

- React 18, Vite 5, TypeScript, Tailwind 3
- i18next (FR et EN complets ; ES et DE retombent sur EN). La langue suit l'URL (`/` = FR, `/en/` = EN), puis le choix mémorisé
- Polices auto-hébergées : Archivo (axes largeur/graisse) et Newsreader, via Fontsource
- Aucune bibliothèque d'animation : cinq mouvements en CSS (entrée de titre, tourner la page, inversion de ligne, coupe de planche, toast)

## Structure

- `src/data/games.ts` — modèle de contenu des jeux (specs, captures, build, cahier)
- `src/i18n/locales/*.json` — toute la copie (accroches, textes, légendes), clé par slug
- `src/issue.ts` — tokens d'impression (papier, encre, spot) et observateur de cahier
- `src/components/` — Cover, Cahier, GameIndex, Tools, Contact, Dossier (route `/jeux/<slug>`), Header
- `src/components/ui/` — Player (lecteur in-site), Achievements (succès), Figure, Masthead, MetaRow, SpecTable
- `public/games/<slug>/` — builds navigateur servis par le site (voir `public/games/README.md`)
- `public/images/shots-web/<slug>/` — captures de gameplay en WebP 400 (miniatures), 800 et 1600 px
- `lfs/shots-src/` — captures sources (non déployées)

## Développement

```bash
npm install
npm run dev
npm run build
npm run deploy   # gh-pages -d dist
```

`npm run build` pré-rend chaque page (`scripts/prerender.mjs`, via `src/entry-server.tsx`) : l'accueil et `/jeux/<slug>/`,
en français à la racine et en anglais sous `/en/`, chacune avec son titre, sa description, sa canonical, ses `hreflang`
et son image de partage. GitHub Pages les sert en 200. `public/404.html` ne sert plus qu'aux URLs inconnues.
