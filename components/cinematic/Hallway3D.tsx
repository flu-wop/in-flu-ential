"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import type { ServiceData } from "./ServiceModal";

const GOLD = "#D4AF77";
const GOLD_LT = "#E8C97A";

interface Hallway3DProps {
  services: ServiceData[];
  onOpen: (service: ServiceData) => void;
  scrollProgress: React.MutableRefObject<number>; // 0..1 from parent scroll
}

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

// ── A single door set into a wall ───────────────────────────────────
function HallDoor({
  service,
  position,
  side,
  onOpen,
  hovered,
  setHovered,
}: {
  service: ServiceData;
  position: [number, number, number];
  side: "left" | "right";
  onOpen: (s: ServiceData) => void;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) {
  const isHovered = hovered === service.id;
  const glowRef = useRef<THREE.PointLight>(null);
  const rotY = side === "left" ? Math.PI / 2 : -Math.PI / 2;

  useFrame((_, delta) => {
    if (glowRef.current) {
      const target = isHovered ? 3.2 : 0.6;
      glowRef.current.intensity += (target - glowRef.current.intensity) * Math.min(1, delta * 5);
    }
  });

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Door frame recess */}
      <RoundedBox args={[1.8, 3.6, 0.15]} radius={0.03} smoothness={3} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#0d0b07" metalness={0.4} roughness={0.8} />
      </RoundedBox>

      {/* Door slab — clickable */}
      <RoundedBox
        args={[1.5, 3.3, 0.12]}
        radius={0.03}
        smoothness={3}
        position={[0, 0, 0.12]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(service.id); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(null); document.body.style.cursor = "default"; }}
        onClick={(e) => { e.stopPropagation(); onOpen(service); }}
      >
        <meshStandardMaterial
          color={isHovered ? "#241d12" : "#181410"}
          metalness={0.7}
          roughness={0.45}
          emissive={GOLD}
          emissiveIntensity={isHovered ? 0.18 : 0}
        />
      </RoundedBox>

      {/* Inset panel lines */}
      <RoundedBox args={[1.1, 2.8, 0.13]} radius={0.02} smoothness={2} position={[0, 0, 0.13]}>
        <meshStandardMaterial color="#13100a" metalness={0.6} roughness={0.5} />
      </RoundedBox>

      {/* Brass knob */}
      <mesh position={[side === "left" ? 0.55 : -0.55, 0, 0.22]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={GOLD_LT} metalness={1} roughness={0.2} emissive={GOLD_LT} emissiveIntensity={isHovered ? 0.5 : 0.15} toneMapped={false} />
      </mesh>

      {/* Door number plate */}
      <RoundedBox args={[0.5, 0.32, 0.14]} radius={0.02} smoothness={2} position={[0, 1.3, 0.14]}>
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.35} emissive={GOLD} emissiveIntensity={isHovered ? 0.4 : 0.1} toneMapped={false} />
      </RoundedBox>

      {/* Per-door glow that rises on hover */}
      <pointLight ref={glowRef} position={[0, 0, 0.6]} intensity={0.6} color={GOLD_LT} distance={3.2} />
    </group>
  );
}

// ── Corridor geometry: floor, ceiling, two walls ────────────────────
function Corridor({ length }: { length: number }) {
  const wallMat = (
    <meshStandardMaterial color="#0c0a07" metalness={0.3} roughness={0.85} />
  );
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -length / 2]}>
        <planeGeometry args={[5, length]} />
        <meshStandardMaterial color="#0a0806" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, -length / 2]}>
        <planeGeometry args={[5, length]} />
        {wallMat}
      </mesh>
      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-2.5, 0, -length / 2]}>
        <planeGeometry args={[length, 4.7]} />
        {wallMat}
      </mesh>
      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[2.5, 0, -length / 2]}>
        <planeGeometry args={[length, 4.7]} />
        {wallMat}
      </mesh>

      {/* Ceiling light strips running down the hall */}
      {Array.from({ length: Math.floor(length / 4) }).map((_, i) => (
        <mesh key={i} position={[0, 2.45, -2 - i * 4]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.4, 1.4]} />
          <meshStandardMaterial color={GOLD_LT} emissive={GOLD_LT} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// ── Floating dust motes drifting in the corridor light ──────────────
function DustMotes({ count, length }: { count: number; length: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4.2;      // x across corridor
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4.2;  // y
      arr[i * 3 + 2] = -Math.random() * length;      // z down the hall
    }
    return arr;
  }, [count, length]);

  // Per-mote drift speed
  const speeds = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = 0.04 + Math.random() * 0.08;
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const geom = ref.current.geometry as THREE.BufferGeometry;
    const pos = geom.attributes.position as THREE.BufferAttribute;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const baseY = pos.getY(i);
      // Gentle vertical bob + slow drift
      pos.setY(i, baseY + Math.sin(t * speeds[i] * 4 + i) * 0.0009);
    }
    pos.needsUpdate = true;
    ref.current.rotation.y = Math.sin(t * 0.02) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD_LT}
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ── Camera rig: scroll moves you down the corridor, with cinematic drift ─
function CameraRig({ scrollProgress, travel }: { scrollProgress: React.MutableRefObject<number>; travel: number }) {
  const { camera } = useThree();
  const current = useRef(0);
  useFrame((state, delta) => {
    // Slower easing → floating feel (was delta*3)
    current.current += (scrollProgress.current - current.current) * Math.min(1, delta * 1.6);
    const t = state.clock.elapsedTime;
    // Subtle handheld sway
    const swayX = Math.sin(t * 0.3) * 0.06;
    const swayY = Math.cos(t * 0.23) * 0.05;
    camera.position.z = 4 - current.current * travel;
    camera.position.x = swayX;
    camera.position.y = swayY;
    camera.lookAt(swayX * 0.5, swayY * 0.5, camera.position.z - 5);
  });
  return null;
}

function Scene({ services, onOpen, scrollProgress, tier }: {
  services: ServiceData[];
  onOpen: (s: ServiceData) => void;
  scrollProgress: React.MutableRefObject<number>;
  tier: "mobile" | "desktop";
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const spacing = 4.5;
  const length = services.length * spacing + 6;
  const travel = length - 6;

  return (
    <>
      <ambientLight intensity={0.25} />
      <fog attach="fog" args={["#060504", 6, tier === "mobile" ? 22 : 30]} />
      <Corridor length={length} />
      <DustMotes count={tier === "mobile" ? 70 : 160} length={length} />
      {services.map((service, i) => {
        const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
        const z = -3 - i * spacing;
        const x = side === "left" ? -2.42 : 2.42;
        return (
          <HallDoor
            key={service.id}
            service={service}
            position={[x, 0, z]}
            side={side}
            onOpen={onOpen}
            hovered={hovered}
            setHovered={setHovered}
          />
        );
      })}
      <CameraRig scrollProgress={scrollProgress} travel={travel} />

      {/* Cinematic post — bloom on the gold emissives + corner vignette */}
      <EffectComposer>
        <Bloom
          intensity={tier === "mobile" ? 0.7 : 1.1}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
          radius={0.7}
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export default function Hallway3D({ services, onOpen, scrollProgress }: Hallway3DProps) {
  const tier = useDeviceTier();
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: tier === "mobile" ? 70 : 60 }}
      dpr={tier === "mobile" ? [1, 1.5] : [1, 2]}
      gl={{ antialias: tier === "desktop", powerPreference: "high-performance" }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; }}
      className="absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene services={services} onOpen={onOpen} scrollProgress={scrollProgress} tier={tier} />
      </Suspense>
    </Canvas>
  );
}
