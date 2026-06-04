# ✦ Portfolio — Alex Rivera

A stunning, single-page developer portfolio built with **zero frameworks and zero build step**. Just open `index.html` and it runs.

## Highlights

- **Animated particle backdrop** — interactive constellation canvas that reacts to your cursor and pauses when the tab is hidden.
- **Custom cursor** with a smoothed follow-ring and magnetic buttons.
- **Reveal-on-scroll** animations via `IntersectionObserver`.
- **Typewriter hero** that cycles through phrases.
- **Animated stat counters** that count up when scrolled into view.
- **Dark / light theme** toggle, persisted to `localStorage`.
- **Scroll progress bar** + active-section nav highlighting.
- **Fully responsive** with an off-canvas mobile menu.
- **Accessible & considerate** — semantic HTML, ARIA labels, and full `prefers-reduced-motion` support that disables every animation.

## Tech

Pure HTML, modern CSS (custom properties, `color-mix`, gradient masks), and vanilla JavaScript. Fonts via Google Fonts (Space Grotesk, Inter, JetBrains Mono).

## Run it

```bash
# any static server works, e.g.
python3 -m http.server 8000
# then open http://localhost:8000
```

Or simply double-click `index.html`.

## Structure

```
index.html   — markup & content
styles.css   — design tokens, layout, motion
script.js    — particles, reveals, cursor, theme, data
```

Content is mock/sample data — swap the arrays at the top of `script.js` and the copy in `index.html` to make it yours.
