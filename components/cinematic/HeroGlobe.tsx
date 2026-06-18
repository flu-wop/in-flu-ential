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
  const ref = useRef<THREE.LineSegments>(null);

  const geom = useMemo(() => {
    const pts: number[] = [];
    const seg = 64;
    for (let i = 0; i < seg; i++) {
      const a1 = (i / seg) * Math.PI * 2;
      const a2 = ((i + 1) / seg) * Math.PI * 2;
      pts.push(Math.cos(a1) * radius, 0, Math.sin(a1) * radius);
      pts.push(Math.cos(a2) * radius, 0, Math.sin(a2) * radius);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [radius]);

  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.18 }),
    []
  );

  const lineObj = useMemo(() => new THREE.LineSegments(geom, mat), [geom, mat]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return <primitive object={lineObj} ref={ref} rotation={[tilt, 0, 0]} />;
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
