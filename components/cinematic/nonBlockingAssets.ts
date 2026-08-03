"use client";

// Non-suspending asset loaders for decorative extras (normal maps, HDRI
// environments). These must NEVER block the scene: a slow or failed
// self-hosted fetch on a real cellular connection is exactly the kind of
// thing that turned a CDN font into a full-scene Suspense hang in Phase 1.
// drei's useTexture()/<Environment> both suspend on the same boundary as
// the rest of the scene, so a stalled request blanks everything. These
// hooks load imperatively instead: the scene renders immediately with
// plain materials, and the extras just fade in whenever (if) they resolve.

import { useEffect, useState } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function useNonBlockingTexture(url: string): THREE.Texture | undefined {
  const [texture, setTexture] = useState<THREE.Texture | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      (tex) => {
        if (!cancelled) setTexture(tex);
      },
      undefined,
      () => {
        // Swallow — texture just never attaches, material stays flat color.
      }
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  return texture;
}

export function useNonBlockingHDRIEnvironment(url: string, enabled: boolean) {
  const { gl, scene } = useThree();

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const pmrem = new THREE.PMREMGenerator(gl);
    pmrem.compileEquirectangularShader();

    const loader = new RGBELoader();
    loader.load(
      url,
      (hdrTexture) => {
        if (cancelled) {
          hdrTexture.dispose();
          pmrem.dispose();
          return;
        }
        const envMap = pmrem.fromEquirectangular(hdrTexture).texture;
        scene.environment = envMap;
        hdrTexture.dispose();
        pmrem.dispose();
      },
      undefined,
      () => {
        pmrem.dispose();
      }
    );

    return () => {
      cancelled = true;
      if (scene.environment) {
        scene.environment.dispose();
        scene.environment = null;
      }
    };
  }, [gl, scene, url, enabled]);
}
