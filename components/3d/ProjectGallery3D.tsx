"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ── Types ────────────────────────────────────────────────────────────────

export interface ProjectItem {
  title: string;
  href: string;
  accentColor?: string;
  label?: string;
  tags?: string[];
}

// ── Shadow texture (ellipse sombre, partagée entre écrans) ───────────────

function mkShadowTex(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 64;
  const ctx = c.getContext("2d")!;
  const grad = ctx.createRadialGradient(128, 32, 0, 128, 32, 128);
  grad.addColorStop(0,    "rgba(8,6,24,0.50)");
  grad.addColorStop(0.35, "rgba(8,6,24,0.22)");
  grad.addColorStop(0.70, "rgba(8,6,24,0.06)");
  grad.addColorStop(1,    "rgba(0,0,0,0)");
  ctx.fillStyle = grad; ctx.fillRect(0, 0, 256, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}


// ── Rounded-rectangle ShapeGeometry ──────────────────────────────────────

function roundedRect(w: number, h: number, r: number): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  const hw = w / 2, hh = h / 2;
  shape.moveTo(-hw + r, -hh);
  shape.lineTo( hw - r, -hh);
  shape.absarc( hw - r, -hh + r, r, -Math.PI / 2, 0,               false);
  shape.lineTo( hw,      hh - r);
  shape.absarc( hw - r,  hh - r, r,  0,            Math.PI / 2,     false);
  shape.lineTo(-hw + r,  hh);
  shape.absarc(-hw + r,  hh - r, r,  Math.PI / 2,  Math.PI,         false);
  shape.lineTo(-hw,     -hh + r);
  shape.absarc(-hw + r, -hh + r, r,  Math.PI,      Math.PI * 3 / 2, false);
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape, 20);
  // ShapeGeometry émet les coordonnées XY brutes comme UV (u ∈ [-w/2, w/2]).
  // On les normalise manuellement vers [0, 1] × [0, 1].
  const pos = geo.attributes.position as THREE.BufferAttribute;
  const uv  = geo.attributes.uv       as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  }
  uv.needsUpdate = true;
  return geo;
}

// ── Drag state ────────────────────────────────────────────────────────────

interface Drag {
  isDragging: boolean;
  pointerStartX: number;
  startOffsetX: number;
  targetOffsetX: number;
  currentOffsetX: number;
}

// ── Constants ─────────────────────────────────────────────────────────────

// Devices rapprochés à ±4.2 : les écrans adjacents sont ~40-47 % visibles au repos
const DEVICE_X = [-4.2, 0, 4.2] as const;
const SNAPS    = [4.2, 0, -4.2] as const;
const CLAMP    = 4.2;

// ── ScreenCard : rounded corners · halo · Y-rotation · depth transitions ─

function ScreenCard({
  localX, width, height, texture, groupRef, drag,
}: {
  localX: number;
  width: number;
  height: number;
  texture: THREE.Texture;
  groupRef: { current: THREE.Group | null };
  drag: { current: Drag };
}) {
  const frameRef  = useRef<THREE.MeshStandardMaterial>(null);
  const screenRef = useRef<THREE.MeshBasicMaterial>(null);
  const shadowRef = useRef<THREE.MeshBasicMaterial>(null);

  const frameGeo  = useMemo(() => roundedRect(width + 0.18, height + 0.18, 0.14), [width, height]);
  const screenGeo = useMemo(() => roundedRect(width, height, 0.08), [width, height]);
  const shadowGeo = useMemo(() => new THREE.PlaneGeometry(width * 1.5, 0.45), [width]);
  const shadowTex = useMemo(() => mkShadowTex(), []);

  useEffect(() => () => {
    frameGeo.dispose(); screenGeo.dispose();
    shadowGeo.dispose(); shadowTex.dispose();
  }, [frameGeo, screenGeo, shadowGeo, shadowTex]);

  useFrame(() => {
    if (!groupRef.current) return;
    const worldX = localX + drag.current.currentOffsetX;
    const dist   = Math.abs(worldX);

    const tOpacity = 0.35 + 0.65 * Math.exp(-dist * 0.5);
    const tZ       = -dist * 0.14;
    const tScale   = 0.86 + 0.14 * Math.exp(-dist * 0.45);
    const tRotY    = -worldX * 0.095;

    if (frameRef.current)  frameRef.current.opacity  = THREE.MathUtils.lerp(frameRef.current.opacity,  tOpacity,       0.09);
    if (screenRef.current) screenRef.current.opacity = THREE.MathUtils.lerp(screenRef.current.opacity, tOpacity,       0.09);
    if (shadowRef.current) shadowRef.current.opacity = THREE.MathUtils.lerp(shadowRef.current.opacity, tOpacity * 0.6, 0.09);

    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, tZ,    0.09);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, tRotY, 0.09);
    const s = THREE.MathUtils.lerp(groupRef.current.scale.x, tScale, 0.09);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef} position={[localX, 0, 0]}>
      {/* Cadre (bezel) arrondi */}
      <mesh geometry={frameGeo} position={[0, 0, -0.002]}>
        <meshStandardMaterial
          ref={frameRef}
          transparent
          color={0x0c0e1a}
          metalness={0.85}
          roughness={0.08}
          emissive={0x06081a}
          emissiveIntensity={0.65}
        />
      </mesh>
      {/* Contenu écran arrondi — UV normalisés */}
      <mesh geometry={screenGeo} position={[0, 0, 0.012]}>
        <meshBasicMaterial ref={screenRef} map={texture} transparent />
      </mesh>
      {/* Ombre portée sous l'écran */}
      <mesh geometry={shadowGeo} position={[0, -height / 2 - 0.06, -0.28]}>
        <meshBasicMaterial ref={shadowRef} map={shadowTex} transparent depthWrite={false} />
      </mesh>
    </group>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────

function Scene({ drag, labelRefs }: {
  drag: { current: Drag };
  labelRefs: { current: (HTMLDivElement | null)[] };
}) {
  const { camera, size, gl } = useThree();

  // Chargement des vraies captures d'écran depuis /public
  const textures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    const load = (url: string) => {
      const t = loader.load(url);
      t.colorSpace    = THREE.SRGBColorSpace;
      // Textures non-POT : désactiver les mipmaps pour éviter le flou
      t.minFilter     = THREE.LinearFilter;
      t.magFilter     = THREE.LinearFilter;
      t.generateMipmaps = false;
      // Anisotropie max → netteté lors des rotations coverflow
      t.anisotropy    = maxAniso;
      return t;
    };
    return {
      t0: load("/paynow-screens/dashboard.png"),   // 1280×800 → Mac13 16:10 ✓
      t1: load("/figma/project-1.png"),             // 1606×904 → Mac14 16:9
      t2: load("/revision/profile.png"),            // 390×844  → iPhone portrait ✓
    };
  }, [gl]);

  useEffect(() => () => {
    textures.t0.dispose();
    textures.t1.dispose();
    textures.t2.dispose();
  }, [textures]);

  const devicesGroupRef = useRef<THREE.Group>(null);
  const mac13Ref        = useRef<THREE.Group>(null);
  const mac14Ref        = useRef<THREE.Group>(null);
  const iphoneRef       = useRef<THREE.Group>(null);
  const tmpV = useRef(new THREE.Vector3());

  useFrame(() => {
    const d = drag.current;
    // Lerp adaptatif : rapide au loin, doux à l'arrivée
    const gap = Math.abs(d.targetOffsetX - d.currentOffsetX);
    const lf  = gap > 1.0 ? 0.15 : 0.1;
    d.currentOffsetX = THREE.MathUtils.lerp(d.currentOffsetX, d.targetOffsetX, lf);
    if (devicesGroupRef.current) devicesGroupRef.current.position.x = d.currentOffsetX;

    [mac13Ref, mac14Ref, iphoneRef].forEach((ref, idx) => {
      const el = labelRefs.current[idx];
      if (!el || !ref.current) return;
      ref.current.getWorldPosition(tmpV.current);
      tmpV.current.y -= 1.5;
      tmpV.current.project(camera);
      el.style.left = `${(tmpV.current.x * 0.5 + 0.5) * size.width}px`;
      el.style.top  = `${(-tmpV.current.y * 0.5 + 0.5) * size.height}px`;
    });
  });

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 6]} intensity={0.55} />
      <directionalLight position={[-3, 2, 4]} intensity={0.3} color={0xe8eeff} />

      <group ref={devicesGroupRef}>
        <ScreenCard localX={DEVICE_X[0]} width={3.4} height={2.125} texture={textures.t0} groupRef={mac13Ref}  drag={drag} />
        <ScreenCard localX={DEVICE_X[1]} width={3.8} height={2.375} texture={textures.t1} groupRef={mac14Ref}  drag={drag} />
        <ScreenCard localX={DEVICE_X[2]} width={1.1} height={2.2}   texture={textures.t2} groupRef={iphoneRef} drag={drag} />
      </group>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────

export function ProjectGallery3D({ projects = [] }: { projects?: ProjectItem[] }) {
  const drag = useRef<Drag>({
    isDragging: false,
    pointerStartX: 0,
    startOffsetX: 0,
    targetOffsetX: 0,
    currentOffsetX: 0,
  });
  const labelRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragVelocity = useRef(0);
  const lastClientX  = useRef(0);

  const snapNearest = (offset: number): number =>
    [...SNAPS].reduce((best, s) =>
      Math.abs(s - offset) < Math.abs(best - offset) ? s : best
    );

  const goTo = (direction: -1 | 1) => {
    const cur = snapNearest(drag.current.targetOffsetX);
    const idx = SNAPS.indexOf(cur as typeof SNAPS[number]);
    const next = idx + direction;
    if (next >= 0 && next < SNAPS.length) drag.current.targetOffsetX = SNAPS[next];
  };

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag.current.isDragging) return;
      dragVelocity.current = e.clientX - lastClientX.current;
      lastClientX.current  = e.clientX;
      const dx = (e.clientX - drag.current.pointerStartX) * 0.015;
      drag.current.targetOffsetX = Math.max(-CLAMP, Math.min(CLAMP, drag.current.startOffsetX + dx));
    };
    const onUp = () => {
      if (!drag.current.isDragging) return;
      drag.current.isDragging = false;
      // Snap momentum : si vitesse > seuil, passe au suivant dans la direction
      const vel = dragVelocity.current;
      const cur = snapNearest(drag.current.targetOffsetX);
      const idx = SNAPS.indexOf(cur as typeof SNAPS[number]);
      if      (vel < -4 && idx < SNAPS.length - 1) drag.current.targetOffsetX = SNAPS[idx + 1];
      else if (vel >  4 && idx > 0)                drag.current.targetOffsetX = SNAPS[idx - 1];
      else                                          drag.current.targetOffsetX = cur;
      if (containerRef.current) containerRef.current.style.cursor = "grab";
    };
    const onWheel = (e: WheelEvent) => {
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const cur = snapNearest(drag.current.targetOffsetX);
      const idx = SNAPS.indexOf(cur as typeof SNAPS[number]);
      if (delta > 20 && idx < SNAPS.length - 1) drag.current.targetOffsetX = SNAPS[idx + 1];
      if (delta < -20 && idx > 0)              drag.current.targetOffsetX = SNAPS[idx - 1];
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("wheel", onWheel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labels = projects.length >= 3
    ? projects.slice(0, 3).map((p) => p.title)
    : ["PayNow", "Sentinelle", "Révision"];

  const ff = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif";

  const arrowStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    [side]: 28,
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 15,
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.09)",
    background: "rgba(255,255,255,0.78)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 20,
    color: "#36393f",
    boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
    pointerEvents: "auto",
    lineHeight: 1,
  });

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100vh", background: "#ffffff", overflow: "hidden", userSelect: "none", cursor: "grab", fontFamily: ff, color: "#1c1d20" }}
      onPointerDown={(e) => {
        drag.current.isDragging    = true;
        drag.current.pointerStartX = e.clientX;
        drag.current.startOffsetX  = drag.current.targetOffsetX;
        dragVelocity.current       = 0;
        lastClientX.current        = e.clientX;
        if (containerRef.current) containerRef.current.style.cursor = "grabbing";
      }}
    >
      {/* Header */}
      <div style={{ position: "absolute", top: 34, left: 0, right: 0, zIndex: 10, pointerEvents: "none", textAlign: "center" }}>
        <div style={{ fontSize: "clamp(12px,1.35vw,20px)", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#26282c", marginBottom: 14 }}>
          ANNA VIGNAUD · PRODUCT DESIGNER UX/UI
        </div>
        <h2 style={{ margin: 0, fontSize: "clamp(24px,3.3vw,48px)", fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6f747d" }}>
          PROJETS SÉLECTIONNÉS
        </h2>
      </div>

      {/* Labels projetés depuis la 3D */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, pointerEvents: "none" }}>
        {labels.map((label, i) => (
          <div
            key={i}
            ref={(el) => { labelRefs.current[i] = el; }}
            style={{ position: "absolute", transform: "translate(-50%, 0)", fontSize: "clamp(11px,1.05vw,15px)", fontWeight: 500, color: "#36393f", whiteSpace: "nowrap", letterSpacing: "-0.01em" }}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Flèche gauche */}
      <button
        onClick={(e) => { e.stopPropagation(); goTo(-1); }}
        style={arrowStyle("left")}
        aria-label="Projet précédent"
      >
        ‹
      </button>

      {/* Flèche droite */}
      <button
        onClick={(e) => { e.stopPropagation(); goTo(1); }}
        style={arrowStyle("right")}
        aria-label="Projet suivant"
      >
        ›
      </button>

      {/* Hint */}
      <div style={{ position: "absolute", bottom: 58, left: "50%", transform: "translateX(-50%)", zIndex: 10, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8b9099", pointerEvents: "none", whiteSpace: "nowrap" }}>
        Glisser ou scroller pour changer de projet
      </div>

      {/* Nav dots */}
      <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 15, display: "flex", gap: 10, alignItems: "center" }}>
        {SNAPS.map((s, i) => (
          <button key={i} onClick={() => { drag.current.targetOffsetX = s; }}
            style={{ width: drag.current.targetOffsetX === s ? 22 : 8, height: 8, borderRadius: 999, border: "none", padding: 0, background: drag.current.targetOffsetX === s ? "#2b2e34" : "#d1d5db", cursor: "pointer", transition: "all 0.3s ease" }}
          />
        ))}
      </div>

      {/* R3F Canvas */}
      <Canvas
        style={{ position: "absolute", inset: 0 }}
        camera={{ fov: 34, position: [0, 0, 7.5] as [number, number, number], near: 0.1, far: 100 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          // NoToneMapping : couleurs exactes des screenshots UI (pas de courbe S cinématique)
          gl.toneMapping        = THREE.NoToneMapping;
          gl.setClearColor(0xffffff, 1);
        }}
      >
        <Scene drag={drag} labelRefs={labelRefs} />
      </Canvas>
    </div>
  );
}
