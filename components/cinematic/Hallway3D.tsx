"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SSAO } from "@react-three/postprocessing";
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

      {/* Door slab — clickable + casts shadow */}
      <RoundedBox
        args={[1.5, 3.3, 0.12]}
        radius={0.03}
        smoothness={3}
        position={[0, 0, 0.12]}
        castShadow
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

      {/* Door number rendered on the plate */}
      <Text
        position={[0, 1.3, 0.22]}
        fontSize={0.18}
        color="#080808"
        anchorX="center"
        anchorY="middle"
        font={undefined}
        letterSpacing={0.05}
      >
        {service.number ?? service.id}
      </Text>

      {/* Per-door glow that rises on hover */}
      <pointLight ref={glowRef} position={[0, 0, 0.6]} intensity={0.6} color={GOLD_LT} distance={3.2} />
    </group>
  );
}

// ── Corridor geometry: floor, ceiling, two walls + architecture cues ─
function Corridor({ length }: { length: number }) {
  const wallMat = (
    <meshStandardMaterial color="#0c0a07" metalness={0.3} roughness={0.85} />
  );

  return (
    <group>
      {/* Floor — polished for light pools */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -length / 2]} receiveShadow>
        <planeGeometry args={[5, length]} />
        <meshStandardMaterial color="#0a0806" metalness={0.55} roughness={0.25} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, -length / 2]} receiveShadow>
        <planeGeometry args={[5, length]} />
        {wallMat}
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-2.5, 0, -length / 2]} receiveShadow>
        <planeGeometry args={[length, 4.7]} />
        {wallMat}
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[2.5, 0, -length / 2]} receiveShadow>
        <planeGeometry args={[length, 4.7]} />
        {wallMat}
      </mesh>

      {/* Baseboard trim — left */}
      <RoundedBox
        args={[0.08, 0.1, length]}
        radius={0.01}
        smoothness={2}
        position={[-2.46, -2.15, -length / 2]}
        receiveShadow
      >
        <meshStandardMaterial color="#2a2115" metalness={0.6} roughness={0.4} />
      </RoundedBox>

      {/* Baseboard trim — right */}
      <RoundedBox
        args={[0.08, 0.1, length]}
        radius={0.01}
        smoothness={2}
        position={[2.46, -2.15, -length / 2]}
        receiveShadow
      >
        <meshStandardMaterial color="#2a2115" metalness={0.6} roughness={0.4} />
      </RoundedBox>

      {/* Wall panel rhythm — subtle recessed panels between doors */}
      {Array.from({ length: Math.floor(length / 4.5) }).map((_, i) => {
        const z = -2.2 - i * 4.5;
        return (
          <group key={`panel-${i}`}>
            {/* Left wall inset */}
            <RoundedBox args={[0.04, 2.4, 1.6]} radius={0.02} smoothness={2} position={[-2.48, 0.1, z]}>
              <meshStandardMaterial color="#090706" metalness={0.25} roughness={0.9} />
            </RoundedBox>
            {/* Right wall inset */}
            <RoundedBox args={[0.04, 2.4, 1.6]} radius={0.02} smoothness={2} position={[2.48, 0.1, z]}>
              <meshStandardMaterial color="#090706" metalness={0.25} roughness={0.9} />
            </RoundedBox>
          </group>
        );
      })}

      {/* Ceiling light strips + real point lights that cast shadows */}
      {Array.from({ length: Math.floor(length / 4) }).map((_, i) => {
        const z = -2 - i * 4;
        return (
          <group key={i}>
            <mesh position={[0, 2.45, z]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.4, 1.4]} />
              <meshStandardMaterial color={GOLD_LT} emissive={GOLD_LT} emissiveIntensity={2.2} toneMapped={false} />
            </mesh>
            <pointLight
              position={[0, 2.3, z]}
              intensity={2.5}
              color={GOLD_LT}
              distance={5}
              castShadow
              shadow-mapSize-width={512}
              shadow-mapSize-height={512}
            />
          </group>
        );
      })}

      {/* Occasional wall sconces to break perfect repetition */}
      {Array.from({ length: Math.floor(length / 9) }).map((_, i) => {
        const z = -4.5 - i * 9;
        const side = i % 2 === 0 ? -1 : 1;
        return (
          <group key={`sconce-${i}`}>
            <mesh position={[side * 2.35, 1.1, z]}>
              <planeGeometry args={[0.25, 0.12]} />
              <meshStandardMaterial color={GOLD_LT} emissive={GOLD_LT} emissiveIntensity={1.4} toneMapped={false} />
            </mesh>
            <pointLight position={[side * 2.2, 1.1, z]} intensity={0.8} color={GOLD_LT} distance={3.5} />
          </group>
        );
      })}
    </group>
  );
}

// ── Floating dust motes drifting in the corridor light ──────────────
function DustMotes({ count, length }: { count: number; length: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 4.2;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 4.2;
      arr[i * 3 + 2] = -Math.random() * length;
    }
    return arr;
  }, [count, length]);

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

// ── Camera rig ──────────────────────────────────────────────────────
function CameraRig({ scrollProgress, travel }: { scrollProgress: React.MutableRefObject<number>; travel: number }) {
  const { camera } = useThree();
  const current = useRef(0);
  useFrame((state, delta) => {
    current.current += (scrollProgress.current - current.current) * Math.min(1, delta * 1.6);
    const t = state.clock.elapsedTime;
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
      <ambientLight intensity={0.22} />
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

      <EffectComposer>
        {tier === "desktop" && <SSAO intensity={18} radius={0.28} />}
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
      shadows
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
