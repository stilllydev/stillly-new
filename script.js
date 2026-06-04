/* =========================================================
   Alex Rivera — Portfolio interactions
   Vanilla JS, no dependencies.
   ========================================================= */
(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Data ---------- */
  const skills = [
    { icon: "🎨", name: "Design Engineering", tags: ["Design systems", "Figma", "Motion", "A11y"] },
    { icon: "⚛️", name: "Frontend", tags: ["TypeScript", "React", "Svelte", "CSS"] },
    { icon: "🦀", name: "Systems", tags: ["Rust", "Go", "WASM", "Performance"] },
    { icon: "🧊", name: "Graphics", tags: ["WebGL", "Three.js", "GLSL", "Canvas"] },
    { icon: "☁️", name: "Infra & DX", tags: ["Node", "Edge", "CI/CD", "Tooling"] },
    { icon: "🔭", name: "Product", tags: ["Prototyping", "Research", "Strategy"] },
  ];

  const marqueeWords = ["TypeScript", "Rust", "WebGL", "React", "Design Systems", "Performance", "Accessibility", "Svelte", "GLSL", "Motion"];

  const projects = [
    { num: "01", cat: "Product · WebGL", color: "#7c5cff", wide: true,
      title: "Aurora — Realtime 3D Editor",
      desc: "A browser-based 3D scene editor with a custom WebGL renderer, collaborative cursors, and 120fps interactions. Shipped to 40k creators.",
      tags: ["Rust/WASM", "WebGL", "CRDT", "TypeScript"] },
    { num: "02", cat: "Design System", color: "#00e0c6",
      title: "Lumen UI",
      desc: "An open-source component library powering 12 products, themable down to the token.",
      tags: ["React", "Tokens", "A11y"] },
    { num: "03", cat: "Developer Tool", color: "#ff5c87",
      title: "Pulse Profiler",
      desc: "Flamegraph profiler that finds render bottlenecks in seconds.",
      tags: ["Go", "Canvas", "CLI"] },
    { num: "04", cat: "Experiment · Generative", color: "#ffb347", wide: true,
      title: "Driftfield",
      desc: "A generative art engine simulating fluid particle fields in real time — featured in an Awwwards roundup.",
      tags: ["GLSL", "Three.js", "Audio-reactive"] },
  ];

  const timeline = [
    { year: "2024 — Now", role: "Principal Engineer", org: "Lumen", desc: "Leading design-engineering org; owning the design system & rendering platform." },
    { year: "2021 — 2024", role: "Senior Frontend Engineer", org: "Northwind", desc: "Built the realtime collaboration layer and shaved 60% off load times." },
    { year: "2018 — 2021", role: "Product Engineer", org: "Studio Kelp", desc: "Shipped 20+ client products, from prototype to production." },
    { year: "2016 — 2018", role: "Freelance Developer", org: "Self-employed", desc: "Learned to wear every hat: design, code, deploy, support." },
  ];

  /* ---------- Render dynamic content ---------- */
  function render() {
    $("#skills-grid").innerHTML = skills.map((s, i) => `
      <article class="skill" data-reveal style="transition-delay:${i * 60}ms">
        <div class="skill__icon">${s.icon}</div>
        <h3 class="skill__name">${s.name}</h3>
        <div class="skill__tags">${s.tags.map(t => `<span class="skill__tag">${t}</span>`).join("")}</div>
      </article>`).join("");

    const items = marqueeWords.map(w => `<span class="marquee__item">${w}</span>`).join("");
    $("#marquee-track").innerHTML = items + items; // duplicate for seamless loop

    $("#projects-grid").innerHTML = projects.map(p => `
      <article class="project ${p.wide ? "project--wide" : ""}" data-reveal data-tilt style="--proj:${p.color}">
        <span class="project__glow"></span>
        <span class="project__num">${p.num}</span>
        <span class="project__cat">${p.cat}</span>
        <a href="#" class="project__link" aria-label="Open ${p.title}"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 17L17 7M7 7h10v10"/></svg></a>
        <h3 class="project__title">${p.title}</h3>
        <p class="project__desc">${p.desc}</p>
        <div class="project__tags">${p.tags.map(t => `<span class="project__tag">${t}</span>`).join("")}</div>
      </article>`).join("");

    $("#timeline-list").innerHTML = timeline.map(t => `
      <li class="timeline__item" data-reveal>
        <div class="timeline__year">${t.year}</div>
        <div class="timeline__role">${t.role}</div>
        <div class="timeline__org">${t.org}</div>
        <p class="timeline__desc">${t.desc}</p>
      </li>`).join("");

    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    const els = $$("[data-reveal]");
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ---------- Hero line reveal ---------- */
  function initHeroLines() {
    const lines = $$(".reveal-line > span");
    lines.forEach((l, i) => {
      if (prefersReduced) { l.style.transform = "none"; return; }
      l.animate(
        [{ transform: "translateY(110%)" }, { transform: "translateY(0)" }],
        { duration: 900, delay: 200 + i * 120, easing: "cubic-bezier(0.16,1,0.3,1)", fill: "forwards" }
      );
    });
  }

  /* ---------- Typed accent word ---------- */
  function initTyped() {
    const el = $("#typed");
    if (!el || prefersReduced) return;
    const words = ["feel alive.", "load instantly.", "spark joy.", "scale gracefully."];
    let wi = 0;
    const cycle = () => {
      wi = (wi + 1) % words.length;
      const next = words[wi];
      let i = el.textContent.length;
      const erase = setInterval(() => {
        el.textContent = el.textContent.slice(0, -1);
        if (--i <= 0) {
          clearInterval(erase);
          let j = 0;
          const type = setInterval(() => {
            el.textContent = next.slice(0, ++j);
            if (j >= next.length) { clearInterval(type); setTimeout(cycle, 2400); }
          }, 60);
        }
      }, 40);
    };
    setTimeout(cycle, 2800);
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    const stats = $$(".hero__stats dt");
    const animate = (el) => {
      const target = +el.dataset.count;
      if (prefersReduced) { el.textContent = target; return; }
      const dur = 1400; const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    stats.forEach(s => io.observe(s));
  }

  /* ---------- Nav: scroll state + active link + burger ---------- */
  function initNav() {
    const nav = $("#nav");
    const links = $$(".nav__link");
    const burger = $("#nav-burger");
    const menu = $(".nav__links");

    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
      const sp = $("#scroll-progress");
      const h = document.documentElement.scrollHeight - window.innerHeight;
      sp.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Active section highlighting
    const sections = $$("main section[id]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
        }
      });
    }, { threshold: 0.3, rootMargin: "-30% 0px -55% 0px" });
    sections.forEach(s => io.observe(s));

    const closeMenu = () => { menu.classList.remove("is-open"); burger.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });
    links.forEach(l => l.addEventListener("click", closeMenu));

    $("#to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" }));
  }

  /* ---------- Theme toggle (persisted) ---------- */
  function initTheme() {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    if (saved) root.setAttribute("data-theme", saved);
    $("#theme-toggle").addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- Custom cursor + magnetic + tilt ---------- */
  function initCursor() {
    if (window.matchMedia("(pointer: coarse)").matches || prefersReduced) return;
    const ring = $("#cursor"); const dot = $("#cursor-dot");
    let rx = 0, ry = 0, dx = 0, dy = 0;
    window.addEventListener("mousemove", (e) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%, -50%)`;
    });
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    $$("a, button, [data-magnetic]").forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });

    // Magnetic buttons
    $$("[data-magnetic]").forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * 0.25}px, ${my * 0.35}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // Project glow follows pointer
    $$(".project").forEach(card => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* ---------- Particle background ---------- */
  function initParticles() {
    const canvas = $("#bg-canvas");
    if (!canvas || prefersReduced) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles = [], raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.width = innerWidth * DPR;
      h = canvas.height = innerHeight * DPR;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      const count = Math.min(90, Math.floor((innerWidth * innerHeight) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25 * DPR, vy: (Math.random() - 0.5) * 0.25 * DPR,
        r: (Math.random() * 1.6 + 0.4) * DPR,
      }));
    };

    const mouse = { x: -9999, y: -9999 };
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7c5cff";
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent + "cc";
        ctx.fill();
        // link to nearby
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d2 = (p.x - q.x) ** 2 + (p.y - q.y) ** 2;
          const max = (130 * DPR) ** 2;
          if (d2 < max) {
            ctx.globalAlpha = (1 - d2 / max) * 0.4;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = accent; ctx.lineWidth = DPR * 0.6; ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
        // mouse repel
        const md2 = (p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2;
        const mr = (150 * DPR) ** 2;
        if (md2 < mr) {
          const f = (1 - md2 / mr) * 0.8;
          const ang = Math.atan2(p.y - mouse.y, p.x - mouse.x);
          p.x += Math.cos(ang) * f * DPR; p.y += Math.sin(ang) * f * DPR;
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", () => { cancelAnimationFrame(raf); resize(); draw(); });
    // Pause when tab hidden
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { cancelAnimationFrame(raf); draw(); }
    });
    draw();
  }

  /* ---------- Init ---------- */
  function init() {
    render();
    initReveal();
    initHeroLines();
    initTyped();
    initCounters();
    initNav();
    initTheme();
    initCursor();
    initParticles();
    console.log("%c✦ Built with care by Alex Rivera", "color:#7c5cff;font-weight:bold;font-size:13px;");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
