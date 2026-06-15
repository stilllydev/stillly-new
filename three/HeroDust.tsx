"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/** Soft round sprite for premium dust motes (vs. hard square points). */
function makeSprite() {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}

/** Slow upward-drifting dust with gentle mouse parallax. Additive white. */
export default function HeroDust({ count = 160 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);
  const points = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const sprite = useMemo(makeSprite, []);

  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sp[i] = 0.12 + Math.random() * 0.4;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, speeds: sp };
  }, [count]);

  useFrame((state, delta) => {
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * delta;
      if (y > 4.6) y = -4.6;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    if (group.current) {
      // gentle parallax toward the cursor
      group.current.position.x += (state.pointer.x * 0.5 - group.current.position.x) * delta * 1.5;
      group.current.position.y += (state.pointer.y * 0.3 - group.current.position.y) * delta * 1.5;
    }
  });

  const scale = Math.min(1, viewport.width / 12);

  return (
    <group ref={group} scale={scale}>
      <points ref={points} geometry={geometry}>
        <pointsMaterial
          map={sprite}
          size={0.13}
          sizeAttenuation
          transparent
          depthWrite={false}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
