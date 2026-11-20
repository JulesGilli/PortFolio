# Self-hosted game builds

Each folder is a browser build served as-is at `/games/<slug>/index.html` and
opened inside the site's player (see `src/components/ui/Player.tsx`).

- `eco`, `mirapyde`, `hors-antenne`: Unity WebGL (uncompressed files,
  so any static host works, GitHub Pages included).
- `hors-antenne` only: its data file weighs 113 MB, over GitHub's 100 MB limit, and
  barely compresses. It is stored as `Build/WebGL.part{1,2,3}.data`; a small `fetch`
  wrapper at the top of its `index.html` streams the parts back as `Build/WebGL.data`
  for the Unity loader. To update the build: split the new data file the same way and
  update `PARTS` and `TOTAL` in that script.
- `echoes`: libGDX / GWT build.

A build can talk to the site:

```js
window.parent.postMessage({ source: 'jules-portfolio', event: 'finished' }, '*');
```

`event: 'finished'` unlocks the "Finisher" achievement.
