"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SSAO } from "@react-three/postprocessing";
import * as THREE from "three";
import type { ServiceData } from "./ServiceModal";

const GOLD = "#D4AF77";
const GOLD_LT = "#E8C97A";
const DM_MONO_URL = "/fonts/dmmono-medium.woff";

interface Hallway3DProps {
  services: ServiceData[];
  onOpen: (service: ServiceData) => void;
  scrollProgress: React.MutableRefObject<number>;
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

function HallDoor({
  service,
  position,
  side,
  index,
  onOpen,
  hovered,
  setHovered,
}: {
  service: ServiceData;
  position: [number, number, number];
  side: "left" | "right";
  index: number;
  onOpen: (s: ServiceData) => void;
  hovered: string | null;
  setHovered: (id: string | null) => void;
}) {
  const isHovered = hovered === service.id;
  const glowRef = useRef<THREE.PointLight>(null);
  const rotY = side === "left" ? Math.PI / 2 : -Math.PI / 2;
  const hasSconce = index % 2 !== 0;

  useFrame((_, delta) => {
    if (glowRef.current) {
      const target = isHovered ? 2.8 : 0.5;
      glowRef.current.intensity += (target - glowRef.current.intensity) * Math.min(1, delta * 5);
    }
  });

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Door frame recess */}
      <RoundedBox args={[1.8, 3.6, 0.15]} radius={0.03} smoothness={3} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#1a1610" metalness={0.35} roughness={0.75} />
      </RoundedBox>

      {/* Door slab */}
      <RoundedBox
        args={[1.5, 3.3, 0.12]}
        radius={0.03}
        smoothness={3}
        position={[0, 0, 0.12]}
        castShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(service.id);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(null);
          document.body.style.cursor = "default";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(service);
        }}
      >
        <meshStandardMaterial
          color={isHovered ? "#2a2115" : "#1e1912"}
          metalness={0.55}
          roughness={0.5}
          emissive={GOLD}
          emissiveIntensity={isHovered ? 0.15 : 0.02}
        />
      </RoundedBox>

      {/* Inset panel */}
      <RoundedBox args={[1.1, 2.8, 0.13]} radius={0.02} smoothness={2} position={[0, 0, 0.13]}>
        <meshStandardMaterial color="#16120c" metalness={0.4} roughness={0.55} />
      </RoundedBox>

      {/* Brass knob */}
      <mesh position={[side === "left" ? 0.55 : -0.55, 0, 0.22]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={GOLD_LT}
          metalness={1}
          roughness={0.25}
          emissive={GOLD_LT}
          emissiveIntensity={isHovered ? 0.45 : 0.12}
          toneMapped={false}
        />
      </mesh>

      {/* Number plate (self-hosted font — no CDN fetch, so Suspense resolves) */}
      <RoundedBox args={[0.5, 0.32, 0.14]} radius={0.02} smoothness={2} position={[0, 1.3, 0.14]}>
        <meshStandardMaterial
          color={GOLD}
          metalness={1}
          roughness={0.35}
          emissive={GOLD}
          emissiveIntensity={isHovered ? 0.35 : 0.12}
          toneMapped={false}
        />
      </RoundedBox>
      <Suspense fallback={null}>
        <Text
          position={[0, 1.3, 0.22]}
          fontSize={0.15}
          font={DM_MONO_URL}
          color="#1a1610"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.42}
        >
          {service.number}
        </Text>
      </Suspense>

      <pointLight ref={glowRef} position={[0, 0, 0.55]} intensity={0.5} color={GOLD_LT} distance={3} />

      {/* Sconce break-up on odd-indexed doors — a little visual variety */}
      {hasSconce && (
        <group position={[side === "left" ? -0.95 : 0.95, 1.1, 0.05]}>
          <mesh>
            <planeGeometry args={[0.22, 0.34]} />
            <meshStandardMaterial color={GOLD_LT} emissive={GOLD_LT} emissiveIntensity={1.3} toneMapped={false} />
          </mesh>
          <pointLight intensity={0.7} color={GOLD_LT} distance={3} position={[0, 0, 0.15]} />
        </group>
      )}
    </group>
  );
}

function Corridor({ length }: { length: number }) {
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
        <meshStandardMaterial color="#100e0a" metalness={0.25} roughness={0.85} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-2.5, 0, -length / 2]} receiveShadow>
        <planeGeometry args={[length, 4.7]} />
        <meshStandardMaterial color="#110f0b" metalness={0.25} roughness={0.85} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[2.5, 0, -length / 2]} receiveShadow>
        <planeGeometry args={[length, 4.7]} />
        <meshStandardMaterial color="#110f0b" metalness={0.25} roughness={0.85} />
      </mesh>

      {/* Baseboards */}
      <RoundedBox args={[0.08, 0.1, length]} radius={0.01} smoothness={2} position={[-2.46, -2.15, -length / 2]} receiveShadow>
        <meshStandardMaterial color="#2a2115" metalness={0.5} roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[0.08, 0.1, length]} radius={0.01} smoothness={2} position={[2.46, -2.15, -length / 2]} receiveShadow>
        <meshStandardMaterial color="#2a2115" metalness={0.5} roughness={0.45} />
      </RoundedBox>

      {/* Wall panel rhythm — subtle recessed panels between doors */}
      {Array.from({ length: Math.floor(length / 4.5) }).map((_, i) => {
        const z = -2.2 - i * 4.5;
        return (
          <group key={`panel-${i}`}>
            <RoundedBox args={[0.04, 2.4, 1.6]} radius={0.02} smoothness={2} position={[-2.48, 0.1, z]}>
              <meshStandardMaterial color="#090706" metalness={0.25} roughness={0.9} />
            </RoundedBox>
            <RoundedBox args={[0.04, 2.4, 1.6]} radius={0.02} smoothness={2} position={[2.48, 0.1, z]}>
              <meshStandardMaterial color="#090706" metalness={0.25} roughness={0.9} />
            </RoundedBox>
          </group>
        );
      })}

      {/* Ceiling light strips + point lights.
          Only the first two (nearest the camera's starting position) cast
          shadows — point-light shadow passes are expensive, the rest are
          illumination-only. */}
      {Array.from({ length: Math.floor(length / 4) }).map((_, i) => {
        const z = -2 - i * 4;
        const shouldCastShadow = i < 2;
        return (
          <group key={i}>
            <mesh position={[0, 2.45, z]} rotation={[Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.4, 1.4]} />
              <meshStandardMaterial
                color={GOLD_LT}
                emissive={GOLD_LT}
                emissiveIntensity={1.8}
                toneMapped={false}
              />
            </mesh>
            <pointLight
              position={[0, 2.25, z]}
              intensity={3.2}
              color={GOLD_LT}
              distance={6}
              castShadow={shouldCastShadow}
              shadow-mapSize-width={shouldCastShadow ? 512 : undefined}
              shadow-mapSize-height={shouldCastShadow ? 512 : undefined}
            />
          </group>
        );
      })}
    </group>
  );
}

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

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.02) * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD_LT}
        size={0.016}
        sizeAttenuation
        transparent
        opacity={0.4}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig({
  scrollProgress,
  travel,
}: {
  scrollProgress: React.MutableRefObject<number>;
  travel: number;
}) {
  const { camera } = useThree();
  const current = useRef(0);

  useFrame((state, delta) => {
    current.current += (scrollProgress.current - current.current) * Math.min(1, delta * 1.6);
    const t = state.clock.elapsedTime;
    const swayX = Math.sin(t * 0.3) * 0.05;
    const swayY = Math.cos(t * 0.23) * 0.04;
    camera.position.z = 4 - current.current * travel;
    camera.position.x = swayX;
    camera.position.y = swayY;
    camera.lookAt(swayX * 0.4, swayY * 0.4, camera.position.z - 5);
  });

  return null;
}

function Scene({
  services,
  onOpen,
  scrollProgress,
  tier,
}: {
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
      {/* Higher ambient so the scene is never pure black */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#1a1610", "#080808", 0.35]} />

      <fog attach="fog" args={["#080706", 8, tier === "mobile" ? 26 : 34]} />

      <Corridor length={length} />
      <DustMotes count={tier === "mobile" ? 50 : 110} length={length} />

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
            index={i}
            onOpen={onOpen}
            hovered={hovered}
            setHovered={setHovered}
          />
        );
      })}

      <CameraRig scrollProgress={scrollProgress} travel={travel} />

      <EffectComposer enableNormalPass={tier === "desktop"}>
        {tier === "desktop" ? (
          <>
            <SSAO
              intensity={18}
              radius={0.28}
              worldDistanceThreshold={1}
              worldDistanceFalloff={0.2}
              worldProximityThreshold={0.5}
              worldProximityFalloff={0.1}
            />
            <Bloom intensity={1.1} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </>
        ) : (
          <>
            <Bloom intensity={0.7} luminanceThreshold={0.2} luminanceSmoothing={0.9} mipmapBlur radius={0.7} />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </>
        )}
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
      dpr={tier === "mobile" ? [1, 1.4] : [1, 1.75]}
      gl={{ antialias: tier === "desktop", powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
      }}
      className="absolute inset-0"
    >
      <Suspense fallback={null}>
        <Scene services={services} onOpen={onOpen} scrollProgress={scrollProgress} tier={tier} />
      </Suspense>
    </Canvas>
  );
}
