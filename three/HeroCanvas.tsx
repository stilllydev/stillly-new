"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import HeroParticles from "./HeroParticles";
import Effects from "./Effects";

/**
 * Client-only WebGL hero. Mounts after hydration to avoid SSR/hydration
 * mismatches, and falls back to a static gradient under reduced-motion.
 */
export default function HeroCanvas() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setMounted(true);
  }, []);

  if (!mounted || reduced) {
    return (
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 45%, rgba(255,255,255,0.10), transparent 70%)",
        }}
      />
    );
  }

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 9], fov: 55 }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <HeroParticles />
        <Effects />
      </Suspense>
    </Canvas>
  );
}
