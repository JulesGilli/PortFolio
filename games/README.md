# Self-hosted game builds

Each folder is a browser build served as-is at `/games/<slug>/index.html` and
opened inside the site's player (see `src/components/ui/Player.tsx`).

- `eco`, `dig-or-die`, `tour-infinie`, `mirapyde`: Unity WebGL (uncompressed files,
  so any static host works, GitHub Pages included).
- `echoes`: libGDX / GWT build.

A build can talk to the site:

```js
window.parent.postMessage({ source: 'jules-portfolio', event: 'finished' }, '*');
```

`event: 'finished'` unlocks the "Finisher" achievement.
