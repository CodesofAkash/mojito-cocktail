"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshTransmissionMaterial, Lathe } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function GlassMesh() {
  const mesh = useRef<THREE.Mesh>(null);

  // The silhouette of a coupe glass, in 2D. Revolving it gives the solid.
  const profile = useMemo(
    () =>
      [
        [0.0, -1.0], [0.35, -1.0], [0.36, -0.95], [0.08, -0.9],
        [0.06, -0.35], [0.1, -0.25], [0.55, 0.05], [0.72, 0.45],
        [0.75, 0.62], [0.73, 0.62], [0.7, 0.45], [0.53, 0.06],
        [0.05, -0.26], [0.03, -0.9], [0.0, -0.9],
      ].map(([x, y]) => new THREE.Vector2(x, y)),
    [],
  );

  useFrame((state, delta) => {
    if (mesh.current) mesh.current.rotation.y += delta * 0.25;
  });

  return (
    <Lathe ref={mesh} args={[profile, 64]} position={[0, 0, 0]}>
      {/* Transmission is what makes it read as glass: light passes through and
          bends. `samples` is the quality/cost dial — 6 is a deliberate
          compromise for mid-range GPUs. */}
      <MeshTransmissionMaterial
        thickness={0.45}
        roughness={0.05}
        transmission={1}
        ior={1.5}
        chromaticAberration={0.35}
        backside
        samples={6}
        resolution={512}
      />
    </Lathe>
  );
}

export function GlassCanvas() {
  return (
    <Canvas
      // Capped device pixel ratio: uncapped, a 3x phone screen renders nine
      // times the pixels for no visible gain.
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.8} />
      <GlassMesh />
      {/* Transmission needs something to refract, or the glass looks flat. */}
      <Environment preset="city" />
    </Canvas>
  );
}
