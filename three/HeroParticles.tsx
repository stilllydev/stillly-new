"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A living monochrome point cloud. Points sit on a sphere shell and are
 * displaced by 3D simplex noise over time (an organic "nebula" breathing),
 * then nudged by the pointer. White additive points + bloom = the glow.
 * Deliberately NOT modelled on any avatar — it's an abstract, original form.
 */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;       // -1..1 normalized
  uniform float uMouseForce;
  uniform float uSize;
  attribute float aScale;
  varying float vGlow;

  // --- Ashima simplex noise (snoise) ---
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 pos = position;
    float n = snoise(pos * 0.55 + vec3(0.0, 0.0, uTime * 0.18));
    float n2 = snoise(pos * 1.4 - vec3(uTime * 0.1));
    float displacement = n * 0.85 + n2 * 0.25;
    pos += normalize(position) * displacement;

    // pointer influence: push points toward the cursor direction in view space
    vec2 m = uMouse * uMouseForce;
    pos.x += m.x * (0.6 + 0.4 * n);
    pos.y += m.y * (0.6 + 0.4 * n);

    vGlow = smoothstep(-1.0, 1.2, displacement);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * aScale * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  varying float vGlow;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    float bright = mix(0.35, 1.0, vGlow);
    gl_FragColor = vec4(vec3(bright), alpha * (0.5 + 0.5 * vGlow));
  }
`;

export default function HeroParticles({ count = 6000 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const targetMouse = useRef(new THREE.Vector2(0, 0));

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const radius = 4;
    for (let i = 0; i < count; i++) {
      // even-ish distribution on a sphere shell
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = radius * (0.82 + Math.random() * 0.18);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      scales[i] = 0.5 + Math.random() * 1.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    return {
      geometry: geo,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseForce: { value: 0.9 },
        uSize: { value: 5.5 },
      },
    };
  }, [count]);

  useFrame((state, delta) => {
    if (!mat.current || !points.current) return;
    const t = state.clock.elapsedTime;
    mat.current.uniforms.uTime.value = t;
    // mouse from pointer (-1..1)
    targetMouse.current.set(state.pointer.x, state.pointer.y);
    const u = mat.current.uniforms.uMouse.value as THREE.Vector2;
    u.lerp(targetMouse.current, Math.min(1, delta * 2.5));
    // slow auto-rotation for life even without a mouse
    points.current.rotation.y += delta * 0.04;
    points.current.rotation.x = Math.sin(t * 0.1) * 0.15;
  });

  // keep the form framed on narrow viewports
  const scale = Math.min(1, viewport.width / 9);

  return (
    <points ref={points} geometry={geometry} scale={scale}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
