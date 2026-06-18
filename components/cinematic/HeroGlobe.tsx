"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#D4AF77";

function useDeviceTier() {
  const [tier, setTier] = useState<"mobile" | "desktop">("desktop");
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setTier(mq.matches ? "mobile" : "desktop");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return tier;
}

// ── Globe of points: fibonacci-sphere distribution ──────────────────
function PointGlobe({ count, pointer }: { count: number; pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      arr[i * 3] = Math.cos(theta) * radius * 2.4;
      arr[i * 3 + 1] = y * 2.4;
      arr[i * 3 + 2] = Math.sin(theta) * radius * 2.4;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Constant slow drift
    group.current.rotation.y += delta * 0.08;
    // Gentle cursor parallax — easing toward pointer
    const targetX = pointer.current.y * 0.25;
    const targetZ = pointer.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * delta * 2;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * delta * 2;
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={GOLD}
          size={0.035}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      {/* Faint inner sphere for depth */}
      <mesh>
        <sphereGeometry args={[2.38, 32, 32]} />
        <meshBasicMaterial color="#0a0805" transparent opacity={0.35} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

// ── A few orbiting arcs to suggest connection/reach ─────────────────
function OrbitRing({ radius, tilt, speed }: { radius: number; tilt: number; speed: number }) {
  const ref = useRef<THREE.Line>(null);
  const geom = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return (
    // @ts-expect-error line is a valid three element
    <line ref={ref} geometry={geom} rotation={[tilt, 0, 0]}>
      <lineBasicMaterial color={GOLD} transparent opacity={0.18} />
    </line>
  );
}

function Scene({ tier, pointer }: { tier: "mobile" | "desktop"; pointer: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <PointGlobe count={tier === "mobile" ? 600 : 1400} pointer={pointer} />
      <OrbitRing radius={3.0} tilt={0.4} speed={0.05} />
      {tier === "desktop" && <OrbitRing radius={3.4} tilt={-0.6} speed={-0.035} />}
    </>
  );
}

export default function HeroGlobe() {
  const tier = useDeviceTier();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={tier === "mobile" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: tier === "desktop", alpha: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene tier={tier} pointer={pointer} />
      </Suspense>
    </Canvas>
  );
}
