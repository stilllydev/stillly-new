"use client";

import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

/** White bloom on the additive points + a soft vignette. Monochrome glow. */
export default function Effects() {
  return (
    <EffectComposer>
      <Bloom
        intensity={1.1}
        luminanceThreshold={0.12}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.7} />
    </EffectComposer>
  );
}
