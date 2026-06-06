/**
 * Arcade registry. Each game is a self-contained static build vendored into
 * /public/games/<slug>/index.html and served same-origin (no CSP headaches),
 * embedded in a sandboxed iframe with fullscreen support.
 *
 * Only genuinely open-source / freely-embeddable titles are listed.
 * Proprietary games (Block Blast, People Playground) are intentionally excluded.
 */
export interface Game {
  slug: string;
  title: string;
  blurb: string;
  source: string;
  license: string;
  /** Set false until the static build is vendored into /public/games/<slug>. */
  available: boolean;
}

export const games: Game[] = [
  {
    slug: "2048",
    title: "2048",
    blurb: "Slide tiles, chase the big numbers. The classic time-sink.",
    source: "https://github.com/gabrielecirulli/2048",
    license: "MIT",
    available: false,
  },
  {
    slug: "hextris",
    title: "Hextris",
    blurb: "Tetris on a spinning hexagon. Deceptively hard.",
    source: "https://github.com/Hextris/hextris",
    license: "GPL-3.0",
    available: false,
  },
  {
    slug: "hexgl",
    title: "HexGL",
    blurb: "A blazing-fast futuristic WebGL racer.",
    source: "https://github.com/BKcore/HexGL",
    license: "MIT",
    available: false,
  },
  {
    slug: "astray",
    title: "Astray",
    blurb: "Tilt your way through a procedurally generated 3D maze.",
    source: "https://github.com/wwwtyro/astray",
    license: "MIT",
    available: false,
  },
  {
    slug: "block-puzzle",
    title: "Block Puzzle",
    blurb: "An open-source block-blast-style puzzle. Clear the grid.",
    source: "https://github.com/topics/block-puzzle",
    license: "Open source (verify on vendor)",
    available: false,
  },
  {
    slug: "sandbox",
    title: "Physics Sandbox",
    blurb: "Drop, drag and smash. A Matter.js playground.",
    source: "https://github.com/liabru/matter-js",
    license: "MIT",
    available: false,
  },
];

export const getGame = (slug: string) => games.find((g) => g.slug === slug);
