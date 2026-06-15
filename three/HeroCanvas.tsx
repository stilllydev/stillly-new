"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import HeroFlow from "./HeroFlow";
import HeroDust from "./HeroDust";

/**
 * Client-only WebGL hero: a flowing grayscale ink field + drifting dust, with
 * bloom on the brightest filaments. Mounts after hydration; falls back to a
 * static gradient under reduced-motion or before mount.
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
            "radial-gradient(120% 90% at 50% 30%, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 40%, #000 75%)",
        }}
      />
    );
  }

  return (
    <Canvas
      className="absolute inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 55 }}
      aria-hidden
    >
      <color attach="background" args={["#000000"]} />
      <Suspense fallback={null}>
        <HeroFlow />
        <HeroDust />
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.55} luminanceSmoothing={0.85} mipmapBlur />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
