"use client";

import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, Text } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, SSAO } from "@react-three/postprocessing";
import * as THREE from "three";
import type { ServiceData } from "./ServiceModal";
import {
  HALLWAY_DOOR_SPACING,
  HALLWAY_FIRST_DOOR_Z,
  HALLWAY_CAMERA_START_Z,
  getHallwayTravel,
} from "./hallwayLayout";
import { useNonBlockingTexture, useNonBlockingHDRIEnvironment } from "./nonBlockingAssets";

const GOLD = "#D4AF77";
const GOLD_LT = "#E8C97A";
const DM_MONO_URL = "/fonts/dmmono-medium.woff";
const HDRI_URL = "/hdri/office-interior.hdr";

interface Hallway3DProps {
  services: ServiceData[];
  onOpen: (service: ServiceData) => void;
  scrollProgress: React.MutableRefObject<number>;
  activeServiceId: string | null;
}

type PushPhase = "idle" | "pushing" | "held" | "easing";

interface PushState {
  phase: PushPhase;
  elapsed: number;
  service: ServiceData | null;
  doorX: number;
  doorZ: number;
}

const PUSH_DURATION = 0.5; // seconds — matches the ~0.5s spec for the door push-in

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Ceiling lights sit at z = -2, -6, -10, ... (every 4 units). Distance from a
// given z to the nearest one, for the camera's near-light upward glance.
function distanceToNearestLight(z: number) {
  const rel = (((z + 2) % 4) + 4) % 4;
  return Math.min(rel, 4 - rel);
}

// Cheap baked AO/contact-shadow disc (a canvas radial gradient, no shadow-map
// cost) shared across every door instance instead of one canvas each.
let sharedAOTexture: THREE.CanvasTexture | null = null;
function getAOTexture() {
  if (sharedAOTexture) return sharedAOTexture;
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(0,0,0,0.5)");
  gradient.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  sharedAOTexture = new THREE.CanvasTexture(canvas);
  return sharedAOTexture;
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

  // Deterministic per-door variation — stable across renders (seeded by
  // index, not Math.random()) so 6 doors don't read as one repeated prefab.
  const variant = useMemo(() => {
    const rand = (salt: number) => {
      const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
      return x - Math.floor(x);
    };
    return {
      twoPanel: index % 3 === 1,
      knobY: (rand(1) - 0.5) * 0.3,
      panelWidth: 1.1 + (rand(2) - 0.5) * 0.12,
    };
  }, [index]);

  const aoTexture = useMemo(() => getAOTexture(), []);

  useFrame((_, delta) => {
    if (glowRef.current) {
      const target = isHovered ? 2.8 : 0.5;
      glowRef.current.intensity += (target - glowRef.current.intensity) * Math.min(1, delta * 5);
    }
  });

  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {/* Door frame recess — backing plane */}
      <RoundedBox args={[1.8, 3.6, 0.15]} radius={0.03} smoothness={3} position={[0, 0, 0.02]}>
        <meshStandardMaterial color="#1a1610" metalness={0.35} roughness={0.75} />
      </RoundedBox>

      {/* Jamb sides + lintel — real recessed depth instead of a painted-on
          backing plane. These close the gap between the wall face and the
          door slab so the recess reads as an actual cubby from any angle. */}
      <RoundedBox args={[0.06, 3.5, 0.2]} radius={0.01} smoothness={2} position={[-0.87, 0, 0.05]}>
        <meshStandardMaterial color="#100d09" metalness={0.3} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[0.06, 3.5, 0.2]} radius={0.01} smoothness={2} position={[0.87, 0, 0.05]}>
        <meshStandardMaterial color="#100d09" metalness={0.3} roughness={0.8} />
      </RoundedBox>
      <RoundedBox args={[1.74, 0.06, 0.2]} radius={0.01} smoothness={2} position={[0, 1.77, 0.05]}>
        <meshStandardMaterial color="#100d09" metalness={0.3} roughness={0.8} />
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

      {/* Inset panel(s) — single or two-panel split, varied per door */}
      {variant.twoPanel ? (
        <>
          <RoundedBox args={[variant.panelWidth, 1.25, 0.13]} radius={0.02} smoothness={2} position={[0, 0.78, 0.13]}>
            <meshStandardMaterial color="#16120c" metalness={0.4} roughness={0.55} />
          </RoundedBox>
          <RoundedBox args={[variant.panelWidth, 1.25, 0.13]} radius={0.02} smoothness={2} position={[0, -0.78, 0.13]}>
            <meshStandardMaterial color="#16120c" metalness={0.4} roughness={0.55} />
          </RoundedBox>
        </>
      ) : (
        <RoundedBox args={[variant.panelWidth, 2.8, 0.13]} radius={0.02} smoothness={2} position={[0, 0, 0.13]}>
          <meshStandardMaterial color="#16120c" metalness={0.4} roughness={0.55} />
        </RoundedBox>
      )}

      {/* Brass knob */}
      <mesh position={[side === "left" ? 0.55 : -0.55, variant.knobY, 0.22]}>
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

      {/* Baked AO/contact-shadow disc — grounds the door where it meets the
          floor, no shadow-map cost. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0.2]}>
        <circleGeometry args={[1.05, 24]} />
        <meshBasicMaterial map={aoTexture} transparent depthWrite={false} />
      </mesh>

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

function Corridor({ length, tier }: { length: number; tier: "mobile" | "desktop" }) {
  // Subtle surface normal maps — self-hosted, tiny tiling textures, loaded
  // non-blockingly (see nonBlockingAssets.ts) so a slow/failed fetch on a
  // real connection can never blank the whole corridor while it waits.
  // Loaded either way (cheap), but only wired into the material on desktop
  // so mobile skips the normal-map shader/GPU cost entirely.
  const floorNormalMap = useNonBlockingTexture("/textures/floor-normal.png");
  const wallNormalMap = useNonBlockingTexture("/textures/wall-normal.png");
  const desktop = tier === "desktop";

  useMemo(() => {
    if (!floorNormalMap || !wallNormalMap) return;
    floorNormalMap.wrapS = floorNormalMap.wrapT = THREE.RepeatWrapping;
    floorNormalMap.repeat.set(length / 2.5, 2);
    wallNormalMap.wrapS = wallNormalMap.wrapT = THREE.RepeatWrapping;
    wallNormalMap.repeat.set(length / 2.5, 2);
  }, [floorNormalMap, wallNormalMap, length]);

  return (
    <group>
      {/* Floor — polished for light pools */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, -length / 2]} receiveShadow>
        <planeGeometry args={[5, length]} />
        <meshStandardMaterial
          color="#0a0806"
          metalness={0.55}
          roughness={0.25}
          normalMap={desktop ? floorNormalMap : undefined}
          normalScale={new THREE.Vector2(0.35, 0.35)}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, -length / 2]} receiveShadow>
        <planeGeometry args={[5, length]} />
        <meshStandardMaterial color="#100e0a" metalness={0.25} roughness={0.85} />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-2.5, 0, -length / 2]} receiveShadow>
        <planeGeometry args={[length, 4.7]} />
        <meshStandardMaterial
          color="#110f0b"
          metalness={0.25}
          roughness={0.85}
          normalMap={desktop ? wallNormalMap : undefined}
          normalScale={new THREE.Vector2(0.3, 0.3)}
        />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[2.5, 0, -length / 2]} receiveShadow>
        <planeGeometry args={[length, 4.7]} />
        <meshStandardMaterial
          color="#110f0b"
          metalness={0.25}
          roughness={0.85}
          normalMap={desktop ? wallNormalMap : undefined}
          normalScale={new THREE.Vector2(0.3, 0.3)}
        />
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
            {/* Cove housing — a shallow trim lip around the strip so the
                light reads as recessed into a channel, not floating flush
                on the ceiling. Same thin-RoundedBox-reveal language as the
                baseboards/wall panels above. */}
            <RoundedBox args={[0.06, 0.1, 1.5]} radius={0.01} smoothness={2} position={[-0.25, 2.46, z]}>
              <meshStandardMaterial color="#0a0806" metalness={0.2} roughness={0.9} />
            </RoundedBox>
            <RoundedBox args={[0.06, 0.1, 1.5]} radius={0.01} smoothness={2} position={[0.25, 2.46, z]}>
              <meshStandardMaterial color="#0a0806" metalness={0.2} roughness={0.9} />
            </RoundedBox>
            <RoundedBox args={[0.5, 0.1, 0.06]} radius={0.01} smoothness={2} position={[0, 2.46, z - 0.75]}>
              <meshStandardMaterial color="#0a0806" metalness={0.2} roughness={0.9} />
            </RoundedBox>
            <RoundedBox args={[0.5, 0.1, 0.06]} radius={0.01} smoothness={2} position={[0, 2.46, z + 0.75]}>
              <meshStandardMaterial color="#0a0806" metalness={0.2} roughness={0.9} />
            </RoundedBox>

            <mesh position={[0, 2.44, z]} rotation={[Math.PI / 2, 0, 0]}>
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
  pushState,
  onOpen,
  tier,
}: {
  scrollProgress: React.MutableRefObject<number>;
  travel: number;
  pushState: React.MutableRefObject<PushState>;
  onOpen: (service: ServiceData) => void;
  tier: "mobile" | "desktop";
}) {
  const { camera } = useThree();
  const perspCamera = camera as THREE.PerspectiveCamera;
  const current = useRef(0);
  const prevPhase = useRef<PushPhase>("idle");
  const baseFov = tier === "mobile" ? 70 : 60;
  const pushFov = tier === "mobile" ? baseFov : baseFov - 12; // skip FOV narrowing on mobile per spec

  // Camera life: velocity-tracking for FOV breathing on fast scroll.
  const prevCurrent = useRef(0);
  const smoothedVel = useRef(0);

  // Snapshots captured at each phase transition so pushing/easing can lerp
  // from wherever the camera actually was, not a recomputed guess.
  const fromPos = useRef(new THREE.Vector3());
  const fromLookAt = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());

  const scrollDrivenPose = (t: number) => {
    const swayX = Math.sin(t * 0.3) * 0.05;
    const swayY = Math.cos(t * 0.23) * 0.04;
    const z = HALLWAY_CAMERA_START_Z - current.current * travel;
    // Slight upward glance as the camera passes under a ceiling light —
    // gets the light rig actually looked at instead of sailing past it.
    const lightDist = distanceToNearestLight(z);
    const pitchBoost = Math.max(0, 1 - lightDist / 1.5) * 0.15;
    return {
      pos: new THREE.Vector3(swayX, swayY, z),
      lookAt: new THREE.Vector3(swayX * 0.4, swayY * 0.4 + pitchBoost, z - 5),
    };
  };

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const push = pushState.current;

    if (push.phase === "idle") {
      current.current += (scrollProgress.current - current.current) * Math.min(1, delta * 1.6);

      // FOV breathing — widen slightly on fast scroll, like head-turn
      // parallax. Smoothed so it doesn't jitter frame to frame.
      const instVel = delta > 0 ? Math.abs(current.current - prevCurrent.current) / delta : 0;
      smoothedVel.current += (instVel - smoothedVel.current) * Math.min(1, delta * 4);
      prevCurrent.current = current.current;
      const fovBreath = Math.min(6, smoothedVel.current * 4);

      const pose = scrollDrivenPose(t);
      camera.position.copy(pose.pos);
      camera.lookAt(pose.lookAt);
      perspCamera.fov = baseFov + fovBreath;
      perspCamera.updateProjectionMatrix();
      prevPhase.current = "idle";
      return;
    }

    if (push.phase === "pushing" && prevPhase.current !== "pushing") {
      // Just clicked — snapshot where the camera is right now and compute
      // the dolly target: lean toward the door's side and push slightly
      // through its plane, narrowing FOV to sell "leaning in."
      const pose = scrollDrivenPose(t);
      fromPos.current.copy(pose.pos);
      fromLookAt.current.copy(pose.lookAt);
      targetPos.current.set(push.doorX * 0.9, 0, push.doorZ);
      targetLookAt.current.set(push.doorX * 1.3, 0, push.doorZ);
    }

    if (push.phase === "pushing") {
      const e = easeInOutCubic(Math.min(1, push.elapsed / PUSH_DURATION));
      camera.position.lerpVectors(fromPos.current, targetPos.current, e);
      camera.lookAt(fromLookAt.current.clone().lerp(targetLookAt.current, e));
      perspCamera.fov = THREE.MathUtils.lerp(baseFov, pushFov, e);
      perspCamera.updateProjectionMatrix();

      push.elapsed += delta;
      if (push.elapsed >= PUSH_DURATION) {
        push.phase = "held";
        push.elapsed = 0;
        if (push.service) onOpen(push.service);
      }
      prevPhase.current = "pushing";
      return;
    }

    if (push.phase === "held") {
      // Camera stays exactly where the push-in left it — modal is open.
      prevPhase.current = "held";
      return;
    }

    // Easing back — target is recomputed live each frame (not a frozen
    // snapshot) so the camera eases into wherever the natural scroll-driven
    // sway pose actually is by the time the ease finishes.
    const e = easeInOutCubic(Math.min(1, push.elapsed / PUSH_DURATION));
    const backPose = scrollDrivenPose(t);
    camera.position.lerpVectors(targetPos.current, backPose.pos, e);
    camera.lookAt(targetLookAt.current.clone().lerp(backPose.lookAt, e));
    perspCamera.fov = THREE.MathUtils.lerp(pushFov, baseFov, e);
    perspCamera.updateProjectionMatrix();

    push.elapsed += delta;
    if (push.elapsed >= PUSH_DURATION) {
      push.phase = "idle";
      push.elapsed = 0;
      push.service = null;
    }
    prevPhase.current = "easing";
  });

  return null;
}

function Scene({
  services,
  onOpen,
  scrollProgress,
  tier,
  activeServiceId,
}: {
  services: ServiceData[];
  onOpen: (s: ServiceData) => void;
  scrollProgress: React.MutableRefObject<number>;
  tier: "mobile" | "desktop";
  activeServiceId: string | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const spacing = HALLWAY_DOOR_SPACING;
  const length = services.length * spacing + 6;
  const travel = getHallwayTravel(services.length);

  // Non-blocking — the corridor renders immediately either way; the HDRI
  // just fills in gold/brass reflections whenever (if) it finishes loading.
  useNonBlockingHDRIEnvironment(HDRI_URL, tier === "desktop");

  const pushState = useRef<PushState>({
    phase: "idle",
    elapsed: 0,
    service: null,
    doorX: 0,
    doorZ: 0,
  });

  const handleDoorClick = (service: ServiceData, doorX: number, doorZ: number) => {
    if (pushState.current.phase !== "idle") return;
    pushState.current = { phase: "pushing", elapsed: 0, service, doorX, doorZ };
  };

  // Modal just closed (activeServiceId went non-null -> null) while the
  // camera is holding its pushed-in position — ease back to the hallway.
  const prevActiveServiceId = useRef(activeServiceId);
  useEffect(() => {
    if (prevActiveServiceId.current !== null && activeServiceId === null && pushState.current.phase === "held") {
      pushState.current.phase = "easing";
      pushState.current.elapsed = 0;
    }
    prevActiveServiceId.current = activeServiceId;
  }, [activeServiceId]);

  return (
    <>
      {/* Higher ambient so the scene is never pure black */}
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#1a1610", "#080808", 0.35]} />

      <fog attach="fog" args={["#080706", 8, tier === "mobile" ? 26 : 34]} />

      <Corridor length={length} tier={tier} />
      <DustMotes count={tier === "mobile" ? 50 : 110} length={length} />

      {services.map((service, i) => {
        const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
        const z = HALLWAY_FIRST_DOOR_Z - i * spacing;
        const x = side === "left" ? -2.42 : 2.42;
        return (
          <HallDoor
            key={service.id}
            service={service}
            position={[x, 0, z]}
            side={side}
            index={i}
            onOpen={() => handleDoorClick(service, x, z)}
            hovered={hovered}
            setHovered={setHovered}
          />
        );
      })}

      <CameraRig scrollProgress={scrollProgress} travel={travel} pushState={pushState} onOpen={onOpen} tier={tier} />

      <EffectComposer enableNormalPass={tier === "desktop"} multisampling={0}>
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

export default function Hallway3D({ services, onOpen, scrollProgress, activeServiceId }: Hallway3DProps) {
  const tier = useDeviceTier();
  const [webglFailed, setWebglFailed] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!webglFailed && (
        <Canvas
          shadows
          camera={{ position: [0, 0, HALLWAY_CAMERA_START_Z], fov: tier === "mobile" ? 70 : 60 }}
          dpr={tier === "mobile" ? [1, 1.4] : [1, 1.75]}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
          }}
          onError={() => setWebglFailed(true)}
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <Scene services={services} onOpen={onOpen} scrollProgress={scrollProgress} tier={tier} activeServiceId={activeServiceId} />
          </Suspense>
        </Canvas>
      )}

      {/* Fallback if WebGL unavailable — static hallway shot instead of a blank canvas */}
      {webglFailed && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hallway.webp')" }}
        />
      )}
    </div>
  );
}
