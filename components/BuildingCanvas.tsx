"use client";
import { useEffect, useRef } from "react";

// Rooms — each window maps to a page
const ROOMS = [
  { label: "Music",     href: "/music",     row: 0, col: 1 },
  { label: "Business",  href: "/business",  row: 1, col: 0 },
  { label: "Products",  href: "/products",  row: 1, col: 2 },
  { label: "Portfolio", href: "/portfolio", row: 2, col: 1 },
  { label: "Vault",     href: "/vault",     row: 3, col: 1 },
];

export default function BuildingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: typeof import("three");

    async function init() {
      THREE = await import("three");

      const W = canvas!.offsetWidth;
      const H = canvas!.offsetHeight;

      const renderer = new THREE.WebGLRenderer({ canvas: canvas!, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.shadowMap.enabled = true;
      renderer.toneMapping       = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;

      const scene  = new THREE.Scene();
      scene.fog    = new THREE.FogExp2(0x080808, 0.035);

      const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
      camera.position.set(0, 2, 14);

      // ── LIGHTS ────────────────────────────────
      scene.add(new THREE.AmbientLight(0x111111, 1));

      const topLight = new THREE.DirectionalLight(0xC9A84C, 0.3);
      topLight.position.set(0, 20, 10);
      scene.add(topLight);

      // ── GROUND PLANE ──────────────────────────
      const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.MeshStandardMaterial({
          color: 0x080808,
          roughness: 0.1,
          metalness: 0.8,
        })
      );
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -6;
      scene.add(ground);

      // Reflected gold line on ground
      const reflLine = new THREE.Mesh(
        new THREE.PlaneGeometry(0.02, 20),
        new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.15 })
      );
      reflLine.rotation.x = -Math.PI / 2;
      reflLine.position.set(0, -5.99, 0);
      scene.add(reflLine);

      // ── BUILDING BODY ─────────────────────────
      const FLOORS   = 10;
      const BW       = 5;    // building width
      const BD       = 1.2;  // building depth
      const FH       = 1.4;  // floor height

      const buildingGroup = new THREE.Group();
      scene.add(buildingGroup);

      // Main structure
      const bodyGeo = new THREE.BoxGeometry(BW, FLOORS * FH, BD);
      const bodyMat = new THREE.MeshStandardMaterial({
        color:     0x0E0E0E,
        roughness: 0.6,
        metalness: 0.4,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = (FLOORS * FH) / 2 - 6;
      buildingGroup.add(body);

      // Edge trim — gold vertical lines
      [-BW / 2, BW / 2].forEach(x => {
        const trim = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, FLOORS * FH, BD + 0.02),
          new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.4 })
        );
        trim.position.set(x, body.position.y, 0);
        buildingGroup.add(trim);
      });

      // Floor divider lines
      for (let f = 0; f <= FLOORS; f++) {
        const y = f * FH - 6;
        const divider = new THREE.Mesh(
          new THREE.BoxGeometry(BW + 0.06, 0.03, BD + 0.04),
          new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: f === 0 || f === FLOORS ? 0.5 : 0.12 })
        );
        divider.position.y = y;
        buildingGroup.add(divider);
      }

      // Antenna / spire
      const spire = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.04, 3, 6),
        new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.6 })
      );
      spire.position.set(0, body.position.y + (FLOORS * FH) / 2 + 1.5, 0);
      buildingGroup.add(spire);

      // Spire glow
      const spireGlow = new THREE.PointLight(0xC9A84C, 0.8, 6);
      spireGlow.position.copy(spire.position);
      buildingGroup.add(spireGlow);

      // ── WINDOWS ────────────────────────────────
      const winW  = 0.55;
      const winH  = 0.7;
      const COLS  = 6;

      // Window light colors — mostly off, some warm, some cool
      const baseColors = [0x2A2000, 0x1A1A0A, 0x000000, 0x0A0A1A, 0x001A0A];

      const windows: import("three").Mesh[] = [];

      for (let f = 0; f < FLOORS; f++) {
        for (let c = 0; c < COLS; c++) {
          const isRoom = ROOMS.find(r => r.row === (FLOORS - 1 - f) % 4 && r.col === c % 3);
          const col    = isRoom ? 0xC9A84C : baseColors[Math.floor(Math.random() * baseColors.length)];
          const bright = isRoom || Math.random() > 0.65;

          const win = new THREE.Mesh(
            new THREE.PlaneGeometry(winW, winH),
            new THREE.MeshBasicMaterial({
              color:       bright ? col : 0x050505,
              transparent: true,
              opacity:     bright ? (isRoom ? 0.9 : 0.15 + Math.random() * 0.25) : 0.05,
            })
          );

          const x = (c - (COLS - 1) / 2) * ((BW - 0.4) / (COLS - 1));
          const y = f * FH - 6 + FH / 2;
          win.position.set(x, y, BD / 2 + 0.01);
          buildingGroup.add(win);
          windows.push(win);
        }
      }

      // ── BACKGROUND BUILDINGS (city silhouette) ─
      const cityColors = [0x0A0A0A, 0x080808, 0x090909];
      for (let i = 0; i < 12; i++) {
        const h   = 4 + Math.random() * 12;
        const w   = 1.5 + Math.random() * 3;
        const bg  = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, 0.8),
          new THREE.MeshStandardMaterial({ color: cityColors[i % 3], roughness: 1 })
        );
        const side = Math.random() > 0.5 ? 1 : -1;
        bg.position.set(
          side * (6 + Math.random() * 12),
          h / 2 - 6,
          -3 - Math.random() * 8
        );
        scene.add(bg);

        // A few lit windows on bg buildings
        for (let w2 = 0; w2 < Math.floor(Math.random() * 5); w2++) {
          const bgWin = new THREE.Mesh(
            new THREE.PlaneGeometry(0.15, 0.2),
            new THREE.MeshBasicMaterial({
              color: Math.random() > 0.5 ? 0xC9A84C : 0x7BA3C4,
              transparent: true, opacity: 0.3 + Math.random() * 0.3,
            })
          );
          bgWin.position.set(
            bg.position.x + (Math.random() - 0.5) * (w - 0.3),
            bg.position.y + (Math.random() - 0.5) * (h - 0.4),
            bg.position.z + 0.41
          );
          scene.add(bgWin);
        }
      }

      // ── GROUND FOG PARTICLES ───────────────────
      const fogGeo = new THREE.BufferGeometry();
      const fogPos = new Float32Array(300 * 3);
      for (let i = 0; i < 300; i++) {
        fogPos[i * 3]     = (Math.random() - 0.5) * 30;
        fogPos[i * 3 + 1] = -5.5 + Math.random() * 1.5;
        fogPos[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
      fogGeo.setAttribute("position", new THREE.BufferAttribute(fogPos, 3));
      const fogParticles = new THREE.Points(
        fogGeo,
        new THREE.PointsMaterial({ color: 0x444444, size: 0.05, transparent: true, opacity: 0.3 })
      );
      scene.add(fogParticles);

      // ── MOUSE PARALLAX ────────────────────────
      const onMouseMove = (e: MouseEvent) => {
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── RESIZE ────────────────────────────────
      const onResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      };
      window.addEventListener("resize", onResize);

      // ── ANIMATE ────────────────────────────────
      const clock  = new THREE.Clock();
      let   frame  = 0;

      function animate() {
        animId = requestAnimationFrame(animate);
        frame++;
        const t = clock.getElapsedTime();

        // Gentle camera parallax from mouse
        camera.position.x += (mouse.current.x * 1.2 - camera.position.x) * 0.02;
        camera.position.y += (-mouse.current.y * 0.6 + 2 - camera.position.y) * 0.02;
        camera.lookAt(0, 1, 0);

        // Subtle building sway
        buildingGroup.rotation.y = Math.sin(t * 0.1) * 0.008;

        // Spire pulse
        spireGlow.intensity = 0.5 + Math.sin(t * 2) * 0.3;

        // Occasional window flicker
        if (frame % 90 === 0) {
          const win = windows[Math.floor(Math.random() * windows.length)];
          const mat = win.material as import("three").MeshBasicMaterial;
          const base = mat.opacity;
          mat.opacity = base > 0.1 ? base * (0.6 + Math.random() * 0.4) : base;
        }

        // Fog drift
        fogParticles.position.x = Math.sin(t * 0.05) * 0.3;

        renderer.render(scene, camera);
      }
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    }

    const cleanup = init();
    return () => { cleanup.then(fn => fn && fn()); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
