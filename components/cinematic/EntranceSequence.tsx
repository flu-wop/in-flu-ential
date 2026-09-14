"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Cylinder } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

const GOLD = "#D4AF77";
const GOLD_LT = "#E8C97A";

type Phase = "closed" | "opening" | "flythrough" | "done";

const OPEN_DURATION = 0.9; // seconds
const FLY_DURATION = 3.4; // seconds
const DOOR_COUNT = 6;
const DOOR_SPACING = 4;
const CORRIDOR_LENGTH = DOOR_COUNT * DOOR_SPACING + 6;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── The glass entrance door ───────────────────────────────────────────
function GlassDoor({ openProgress }: { openProgress: React.MutableRefObject<number> }) {
  const doorGroup = useRef<THREE.Group>(null);
  const current = useRef(0);

  useFrame((_, delta) => {
    current.current += (openProgress.current - current.current) * Math.min(1, delta * 6);
    if (doorGroup.current) {
      doorGroup.current.rotation.y = -current.current * (Math.PI / 2.1);
    }
  });

  return (
    <group>
      {/* Frame */}
      <RoundedBox args={[4.4, 6.2, 0.3]} radius={0.04} smoothness={4} position={[0, 0, -0.4]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.4} roughness={0.7} />
      </RoundedBox>

      {/* Hinged glass door */}
      <group ref={doorGroup} position={[-1.9, 0, 0]}>
        <group position={[1.9, 0, 0]}>
          {/* Glass panel */}
          <RoundedBox args={[3.7, 5.8, 0.08]} radius={0.02} smoothness={4}>
            <meshPhysicalMaterial
              color="#dfe8ea"
              transmission={0.92}
              roughness={0.06}
              thickness={0.4}
              ior={1.5}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.1}
            />
          </RoundedBox>

          {/* Slim gold frame around the glass */}
          {[
            [0, 2.85, 3.7, 0.1],
            [0, -2.85, 3.7, 0.1],
            [-1.75, 0, 0.1, 5.8],
            [1.75, 0, 0.1, 5.8],
          ].map(([x, y, w, h], i) => (
            <RoundedBox key={i} args={[w, h, 0.1]} radius={0.02} smoothness={2} position={[x, y, 0.02]}>
              <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} />
            </RoundedBox>
          ))}

          {/* Vertical push bar handle */}
          <Cylinder args={[0.04, 0.04, 2.2, 16]} position={[1.3, -0.3, 0.14]}>
            <meshStandardMaterial color={GOLD_LT} metalness={1} roughness={0.2} />
          </Cylinder>
        </group>
      </group>
    </group>
  );
}

// ── Simple corridor for the flythrough ─────────────────────────────────
function Corridor() {
  const doors = Array.from({ length: DOOR_COUNT }, (_, i) => {
    const z = -6 - i * DOOR_SPACING;
    const side = i % 2 === 0 ? -1 : 1;
    return (
      <group key={i} position={[side * 2.3, 0, z]}>
        <RoundedBox args={[1.4, 2.6, 0.12]} radius={0.03} smoothness={3}>
          <meshStandardMaterial color="#15110b" metalness={0.5} roughness={0.5} />
        </RoundedBox>
        <RoundedBox args={[1.5, 2.7, 0.05]} radius={0.03} smoothness={3} position={[0, 0, -0.08]}>
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.35} />
        </RoundedBox>
        <pointLight position={[0, 1.6, 0.4]} intensity={6} color={GOLD_LT} distance={3.5} />
      </group>
    );
  });

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, -CORRIDOR_LENGTH / 2]}>
        <planeGeometry args={[6, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#0c0a08" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, -CORRIDOR_LENGTH / 2]}>
        <planeGeometry args={[6, CORRIDOR_LENGTH]} />
        <meshStandardMaterial color="#0a0806" roughness={0.8} />
      </mesh>
      {doors}
      <fog attach="fog" args={["#080706", 6, 26]} />
    </>
  );
}

function FlythroughRig({
  phase,
  openProgress,
  flyProgress,
}: {
  phase: React.MutableRefObject<Phase>;
  openProgress: React.MutableRefObject<number>;
  flyProgress: React.MutableRefObject<number>;
}) {
  useFrame(({ camera }) => {
    if (phase.current === "closed" || phase.current === "opening") {
      camera.position.set(0, 0, 6.5);
      camera.lookAt(0, 0, 0);
      return;
    }
    const eased = easeInOutCubic(flyProgress.current);
    const z = 6.5 - eased * (CORRIDOR_LENGTH - 4);
    const sway = Math.sin(flyProgress.current * Math.PI * 3) * 0.06;
    camera.position.set(sway, 0, z);
    camera.lookAt(sway * 0.5, 0, z - 6);
  });
  return null;
}

export default function EntranceSequence({ onComplete }: { onComplete: () => void }) {
  const [phaseState, setPhaseState] = useState<Phase>("closed");
  const phase = useRef<Phase>("closed");
  const openProgress = useRef(0);
  const flyProgress = useRef(0);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const openTimer = setTimeout(() => {
      phase.current = "opening";
      setPhaseState("opening");
      openProgress.current = 1;
    }, 400);

    const flyStart = setTimeout(() => {
      phase.current = "flythrough";
      setPhaseState("flythrough");
      const startTime = performance.now();
      const tick = () => {
        const t = Math.min(1, (performance.now() - startTime) / (FLY_DURATION * 1000));
        flyProgress.current = t;
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          phase.current = "done";
          setPhaseState("done");
          setTimeout(onComplete, 500);
        }
      };
      requestAnimationFrame(tick);
    }, 400 + OPEN_DURATION * 1000);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(flyStart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (webglFailed) {
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webglFailed]);

  function handleSkip() {
    phase.current = "done";
    setPhaseState("done");
    onComplete();
  }

  if (webglFailed) {
    // Worst case: no animation, straight to the grid. Never stuck.
    return null;
  }

  return (
    <AnimatePresence>
      {phaseState !== "done" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-10"
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 120% 100% at 50% 55%, #1a1208 0%, #080808 60%, #030303 100%)" }}
          />
          <Canvas
            camera={{ position: [0, 0, 6.5], fov: 45 }}
            dpr={[1, 2]}
            gl={{ antialias: true, powerPreference: "high-performance" }}
            onError={() => setWebglFailed(true)}
            className="absolute inset-0"
          >
            <ambientLight intensity={0.4} />
            <spotLight position={[0, 5, 8]} angle={0.5} penumbra={0.8} intensity={30} color={GOLD_LT} />
            <pointLight position={[0, 0, 4]} intensity={10} color="#fff4e0" />
            <Suspense fallback={null}>
              <GlassDoor openProgress={openProgress} />
              <Corridor />
            </Suspense>
            <FlythroughRig phase={phase} openProgress={openProgress} flyProgress={flyProgress} />
          </Canvas>

          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-20 text-[10px] tracking-[0.35em] uppercase text-[#A89880]/50 hover:text-[#D4AF77] transition-colors duration-300"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            Skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
