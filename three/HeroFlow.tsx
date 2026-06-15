"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";

/**
 * Full-screen flowing "liquid ink" hero. Domain-warped fractal noise in pure
 * grayscale: dark base, bright drifting filaments, a calm darker center so the
 * white headline stays readable, and a light that follows the cursor.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;     // -1..1
  uniform vec2 uRes;

  float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1,0)), c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 6; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
    vec2 p = (uv - 0.5) * aspect * 3.0;
    float t = uTime * 0.05;

    // domain warp (flowing ink)
    vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 2.0 * q + vec2(1.7, 9.2) + 1.1 * t),
                  fbm(p + 2.0 * q + vec2(8.3, 2.8) - 0.9 * t));
    float f = fbm(p + 2.4 * r);

    // cursor light
    vec2 m = uMouse * 0.5 + 0.5;
    float md = distance(uv, m);
    f += smoothstep(0.55, 0.0, md) * 0.22;

    float c = pow(clamp(f, 0.0, 1.0), 1.7);

    // darker, calm center band so the headline reads; livelier toward edges
    float dc = distance(uv, vec2(0.5, 0.46));
    c *= mix(0.30, 1.0, smoothstep(0.06, 0.55, dc));

    vec3 col = vec3(c);
    // faint cool-white core glow
    col += vec3(smoothstep(0.7, 0.0, dc)) * 0.05;
    // vignette
    col *= 1.0 - smoothstep(0.45, 1.05, distance(uv, vec2(0.5))) * 0.7;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function HeroFlow() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size, viewport } = useThree();
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uRes: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uRes.value.set(size.width * viewport.dpr, size.height * viewport.dpr);
    target.current.set(state.pointer.x, state.pointer.y);
    (u.uMouse.value as THREE.Vector2).lerp(target.current, Math.min(1, delta * 2));
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}
