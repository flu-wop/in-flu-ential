"use client";
import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let THREE: typeof import("three");

    async function init() {
      THREE = await import("three");

      const renderer = new THREE.WebGLRenderer({ canvas: canvas!, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas!.offsetWidth, canvas!.offsetHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, canvas!.offsetWidth / canvas!.offsetHeight, 0.1, 1000);
      camera.position.z = 5;

      // ── Particle geometry ────────────────────
      const COUNT = 1800;
      const positions = new Float32Array(COUNT * 3);
      const sizes = new Float32Array(COUNT);
      const opacities = new Float32Array(COUNT);

      for (let i = 0; i < COUNT; i++) {
        // Spread particles in a wide flat field
        positions[i * 3]     = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
        sizes[i] = Math.random() * 2.5 + 0.5;
        opacities[i] = Math.random() * 0.6 + 0.1;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
      geo.setAttribute("opacity", new THREE.BufferAttribute(opacities, 1));

      // ── Shader material — gold particles ─────
      const mat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime:  { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uColor: { value: new THREE.Color("#C9A84C") },
        },
        vertexShader: `
          attribute float size;
          attribute float opacity;
          uniform float uTime;
          uniform vec2 uMouse;
          varying float vOpacity;

          void main() {
            vOpacity = opacity;
            vec3 pos = position;

            // Gentle float
            pos.y += sin(uTime * 0.3 + position.x * 0.5) * 0.08;
            pos.x += cos(uTime * 0.2 + position.y * 0.4) * 0.04;

            // Mouse repulsion
            vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
            vec2 screenPos = mvPos.xy / -mvPos.z;
            float dist = distance(screenPos, uMouse * vec2(4.0, 2.5));
            float repel = smoothstep(1.2, 0.0, dist) * 0.6;
            pos.x += (pos.x - uMouse.x * 4.0) * repel * 0.04;
            pos.y += (pos.y - uMouse.y * 2.5) * repel * 0.04;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (280.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying float vOpacity;

          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, d) * vOpacity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
      });

      const particles = new THREE.Points(geo, mat);
      scene.add(particles);

      // ── Subtle connecting lines between nearby particles ──
      const lineGeo = new THREE.BufferGeometry();
      const linePositions: number[] = [];
      const threshold = 2.2;
      for (let i = 0; i < COUNT; i++) {
        for (let j = i + 1; j < COUNT; j++) {
          const dx = positions[i*3]   - positions[j*3];
          const dy = positions[i*3+1] - positions[j*3+1];
          const dz = positions[i*3+2] - positions[j*3+2];
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          if (dist < threshold) {
            linePositions.push(
              positions[i*3], positions[i*3+1], positions[i*3+2],
              positions[j*3], positions[j*3+1], positions[j*3+2]
            );
          }
        }
      }
      lineGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(linePositions), 3));
      const lineMat = new THREE.LineBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.04 });
      scene.add(new THREE.LineSegments(lineGeo, lineMat));

      // ── Mouse tracking ───────────────────────
      const mouse = new THREE.Vector2(0, 0);
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
        mat.uniforms.uMouse.value.set(mouse.x, mouse.y);
      };
      window.addEventListener("mousemove", onMouseMove);

      // ── Resize ──────────────────────────────
      const onResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
      };
      window.addEventListener("resize", onResize);

      // ── Animate ─────────────────────────────
      const clock = new THREE.Clock();
      function animate() {
        animId = requestAnimationFrame(animate);
        mat.uniforms.uTime.value = clock.getElapsedTime();
        particles.rotation.y = clock.getElapsedTime() * 0.01;
        renderer.render(scene, camera);
      }
      animate();

      return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
        geo.dispose();
        mat.dispose();
      };
    }

    const cleanup = init();
    return () => { cleanup.then((fn) => fn && fn()); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
