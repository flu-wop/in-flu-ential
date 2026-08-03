"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#D4AF77";
const GOLD_LT = "#E8C97A";

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

// A slowly turning wireframe solid — structure/blueprint feel to pair with
// "we architect cultural moments." Cheap: unlit line/point materials only,
// no lights or shadows needed.
function WireframeSolid({ tier }: { tier: "mobile" | "desktop" }) {
  const group = useRef<THREE.Group>(null);
  const innerGroup = useRef<THREE.Group>(null);

  const outerEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.7, 0)), []);
  const innerEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.9, 0)), []);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.18;
    }
    if (innerGroup.current) {
      innerGroup.current.rotation.y -= delta * 0.16;
      innerGroup.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group position={[tier === "mobile" ? 0 : 2.4, 0, 0]}>
      <group ref={group}>
        <lineSegments geometry={outerEdges}>
          <lineBasicMaterial color={GOLD} transparent opacity={0.38} />
        </lineSegments>
      </group>
      <group ref={innerGroup}>
        <lineSegments geometry={innerEdges}>
          <lineBasicMaterial color={GOLD_LT} transparent opacity={0.3} />
        </lineSegments>
      </group>
      {/* Soft glowing core */}
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial color={GOLD_LT} transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

export default function ApproachAccent() {
  const tier = useDeviceTier();

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={tier === "mobile" ? [1, 1.4] : [1, 1.75]}
      gl={{ antialias: tier === "desktop", alpha: true, powerPreference: "high-performance" }}
      className="absolute inset-0"
    >
      <WireframeSolid tier={tier} />
    </Canvas>
  );
}
