# Arcade — vendored games & attributions

These are self-contained static builds served from `/games/<slug>/` and embedded
in sandboxed iframes on `/arcade`. Each upstream project's license file is kept
alongside its build. Only freely-licensed / original games are included —
proprietary titles (Block Blast, People Playground) are **not** embedded.

| Slug | Game | Source | License |
|---|---|---|---|
| `2048` | 2048 | https://github.com/gabrielecirulli/2048 | MIT |
| `hextris` | Hextris | https://github.com/Hextris/hextris | GPL-3.0 |
| `hexgl` | HexGL | https://github.com/BKcore/HexGL | MIT (trimmed: removed `package.zip`) |
| `astray` | Astray | https://github.com/wwwtyro/astray | MIT |
| `block-puzzle` | Block Puzzle | original, written for this site | MIT |
| `sandbox` | Physics Sandbox | original, built on [Matter.js](https://github.com/liabru/matter-js) | MIT |

To add a game: drop its static build at `public/games/<slug>/index.html`, keep its
LICENSE, then add an entry to `lib/games.ts` with `available: true`.
