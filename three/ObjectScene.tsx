"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

type Shape = "knot" | "ico";

function Spinner({ shape }: { shape: Shape }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    mesh.current.rotation.x += delta * 0.18;
    mesh.current.rotation.y += delta * 0.26;
  });
  return (
    <mesh ref={mesh}>
      {shape === "knot" ? (
        <torusKnotGeometry args={[1.1, 0.34, 220, 32]} />
      ) : (
        <icosahedronGeometry args={[1.5, 1]} />
      )}
      <meshStandardMaterial
        color="#ffffff"
        wireframe
        emissive="#ffffff"
        emissiveIntensity={0.25}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}

/** A small client-only canvas with a rotating monochrome wireframe form. */
export default function ObjectScene({ shape = "knot" }: { shape?: Shape }) {
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
        className="h-full w-full rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.12), transparent)",
        }}
      />
    );
  }

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }} gl={{ alpha: true }} aria-hidden>
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <pointLight position={[4, 4, 4]} intensity={40} />
        <pointLight position={[-4, -2, -2]} intensity={15} />
        <Spinner shape={shape} />
      </Suspense>
    </Canvas>
  );
}
