"use client";
import { useRef, useCallback, Suspense, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, RoundedBox, Html, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";

// ─── constants ───────────────────────────────────────────────────────
const SCREEN_URLS = [
  "/paynow-screens/dashboard.png",
  "/onboarding/hero.png",
  "/figma/project-1.png",
];

const DEVICE_X: [number, number, number] = [-3.1, 0, 3.05];
const SNAP_POSITIONS: [number, number, number] = [3.1, 0, -3.05];
const MAX_OFFSET =  3.3;
const MIN_OFFSET = -3.2;
const SPRING = 0.09;
const SNAP_DELAY_MS = 500;

/*
 * White studio aesthetic — matches user brief:
 * - fond blanc pur
 * - podium blanc épuré
 * - appareils clairs (MacBook alu clair, iPhone blanc)
 */
const MAC_ALUM      = "#e2e2e0";
const MAC_ALUM_DARK = "#d4d4d2";
const IPHONE_WHITE  = "#e5e5ea";
const PODIUM_COLOR  = "#f7f8fa";
const BG_COLOR      = "#ffffff";

// ─── Shared drag state ────────────────────────────────────────────────
interface DragState {
  dragging:  boolean;
  lastX:     number;
  vel:       number;
  offset:    number;
  snapTarget: number;
  isSnapping: boolean;
  snapTimer?: ReturnType<typeof setTimeout>;
}

// ─── helpers ──────────────────────────────────────────────────────────
function makeScreenShape(w: number, h: number, r: number): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo( w / 2 - r, -h / 2);
  s.quadraticCurveTo( w / 2, -h / 2,  w / 2, -h / 2 + r);
  s.lineTo( w / 2,  h / 2 - r);
  s.quadraticCurveTo( w / 2,  h / 2,  w / 2 - r,  h / 2);
  s.lineTo(-w / 2 + r,  h / 2);
  s.quadraticCurveTo(-w / 2,  h / 2, -w / 2,  h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}

function snapToNearest(offset: number): number {
  let best = SNAP_POSITIONS[0];
  let bestDist = Infinity;
  for (let i = 0; i < 3; i++) {
    const d = Math.abs(offset - SNAP_POSITIONS[i]);
    if (d < bestDist) { bestDist = d; best = SNAP_POSITIONS[i]; }
  }
  return best;
}

function activeIndex(offset: number): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < 3; i++) {
    const d = Math.abs(DEVICE_X[i] + offset);
    if (d < bestDist) { bestDist = d; best = i; }
  }
  return best;
}

// ─── MacBook ──────────────────────────────────────────────────────────
interface MacBookProps {
  baseW:  number; baseD:   number;
  screenW: number; screenH: number;
  lidTilt: number;
  textureUrl: string;
  posX: number; rotY: number;
  isActive: boolean;
}

function MacBook({ baseW, baseD, screenW, screenH, lidTilt,
  textureUrl, posX, rotY, isActive }: MacBookProps) {
  const groupRef    = useRef<THREE.Group>(null!);
  const targetScale = isActive ? 1.08 : 0.9;
  const scaleVec    = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame(() => {
    if (!groupRef.current) return;
    scaleVec.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(scaleVec, 0.1);
  });

  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  /*
   * flipY = false : ShapeGeometry génère des UVs en Y croissant vers le haut
   * (convention mathématique), mais les PNG chargés par THREE ont flipY=true
   * par défaut (origine en haut). Sans cette correction, l'image est inversée.
   */
  texture.flipY = false;

  const screenShape = useMemo(
    () => makeScreenShape(screenW, screenH, 0.06),
    [screenW, screenH],
  );

  const BASE_H   = 0.085;
  const LID_THICK = 0.055;
  const lidH     = screenH + 0.22;

  return (
    <group ref={groupRef} position={[posX, 0, 0]} rotation={[0, rotY, 0]}>
      {/* Chassis (base keyboard) */}
      <RoundedBox args={[baseW, BASE_H, baseD]} radius={0.03} smoothness={4}
        position={[0, BASE_H / 2, 0]}>
        <meshStandardMaterial color={MAC_ALUM} roughness={0.18} metalness={0.38} />
      </RoundedBox>

      {/* Keyboard area inset */}
      <mesh position={[0, BASE_H + 0.0005, 0.08]}>
        <boxGeometry args={[baseW * 0.86, 0.001, baseD * 0.5]} />
        <meshStandardMaterial color={MAC_ALUM_DARK} roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, BASE_H + 0.001, baseD * 0.3]}>
        <boxGeometry args={[baseW * 0.36, 0.002, baseD * 0.22]} />
        <meshStandardMaterial color="#dddbd9" roughness={0.08} metalness={0.5} />
      </mesh>

      {/*
       * ── Lid pivot at hinge ──────────────────────────────────────────
       * Pivot group is positioned at the hinge: [0, BASE_H, -baseD/2]
       * The lid extends in +Y from this pivot when rotation=[0,0,0] (vertical).
       *
       * lidTilt > 0 → top of screen leans slightly AWAY from viewer (natural position)
       * Screen ShapeGeometry lives in XY plane, its +Z normal faces the viewer.
       * With lidTilt ~0.13-0.14 and camera at z=4.6 y=1.6, the dot-product
       * screen_normal·camera_ray ≈ 0.998 → near-perfect face-on view.
       */}
      <group position={[0, BASE_H, -baseD / 2]} rotation={[lidTilt, 0, 0]}>
        {/* Lid panel */}
        <RoundedBox args={[baseW, lidH, LID_THICK]} radius={0.03} smoothness={4}
          position={[0, lidH / 2, 0]}>
          <meshStandardMaterial color={MAC_ALUM} roughness={0.18} metalness={0.38} />
        </RoundedBox>

        {/* Apple logo — back face */}
        <mesh position={[0, lidH / 2, -LID_THICK / 2 - 0.001]}>
          <circleGeometry args={[0.09, 20]} />
          <meshStandardMaterial color="#c8c8c6" roughness={0.05} metalness={0.8} />
        </mesh>

        {/* Black bezel — front face */}
        <mesh position={[0, lidH / 2, LID_THICK / 2 + 0.001]}>
          <boxGeometry args={[screenW + 0.14, screenH + 0.14, 0.001]} />
          <meshStandardMaterial color="#0d0d0d" roughness={1} metalness={0} />
        </mesh>

        {/* Screen texture — XY plane, +Z normal → faces viewer */}
        <mesh position={[0, lidH / 2, LID_THICK / 2 + 0.003]}>
          <shapeGeometry args={[screenShape]} />
          <meshBasicMaterial map={texture} side={THREE.FrontSide} />
        </mesh>

        {/* Notch */}
        <mesh position={[0, lidH - 0.08, LID_THICK / 2 + 0.004]}>
          <boxGeometry args={[0.16, 0.038, 0.001]} />
          <meshStandardMaterial color="#111" roughness={1} metalness={0} />
        </mesh>
      </group>
    </group>
  );
}

// ─── iPhone 15 Pro (blanc/silver) ─────────────────────────────────────
function IPhone({ textureUrl, posX, isActive }: {
  textureUrl: string; posX: number; isActive: boolean;
}) {
  const groupRef    = useRef<THREE.Group>(null!);
  const targetScale = isActive ? 1.08 : 0.9;
  const scaleVec    = useMemo(() => new THREE.Vector3(1, 1, 1), []);

  useFrame(() => {
    if (!groupRef.current) return;
    scaleVec.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(scaleVec, 0.1);
  });

  const texture = useTexture(textureUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;

  const W = 0.76, H = 1.65, D = 0.096;
  const screenShape = useMemo(() => makeScreenShape(W - 0.1, H - 0.14, 0.085), []);

  return (
    <group ref={groupRef} position={[posX, 0, 0]} rotation={[-0.04, -0.18, 0]}>
      {/* Body — blanc titane */}
      <RoundedBox args={[W, H, D]} radius={0.095} smoothness={6}
        position={[0, H / 2, 0]}>
        <meshStandardMaterial color={IPHONE_WHITE} roughness={0.14} metalness={0.55} />
      </RoundedBox>

      {/* Screen */}
      <mesh position={[0, H / 2, D / 2 + 0.002]}>
        <shapeGeometry args={[screenShape]} />
        <meshBasicMaterial map={texture} side={THREE.FrontSide} />
      </mesh>

      {/* Dynamic island */}
      <mesh position={[0, H - 0.14, D / 2 + 0.003]}>
        <boxGeometry args={[0.21, 0.05, 0.001]} />
        <meshStandardMaterial color="#111" roughness={1} />
      </mesh>

      {/* Side button */}
      <mesh position={[W / 2 + 0.004, H * 0.55, 0]}>
        <boxGeometry args={[0.012, 0.18, D * 0.6]} />
        <meshStandardMaterial color="#d8d8d6" roughness={0.1} metalness={0.8} />
      </mesh>
    </group>
  );
}

// ─── Scene ────────────────────────────────────────────────────────────
function Scene({
  projects, drag, onActiveChange,
}: {
  projects: { title: string; href: string; accentColor: string }[];
  drag: React.MutableRefObject<DragState>;
  onActiveChange: (idx: number) => void;
}) {
  const sliderRef = useRef<THREE.Group>(null!);
  const prevIdx   = useRef(-1);

  useFrame(() => {
    const d = drag.current;
    if (d.dragging) {
      d.offset += d.vel * 0.08;
      d.vel *= 0.88;
    } else if (d.isSnapping) {
      d.offset += (d.snapTarget - d.offset) * SPRING;
      if (Math.abs(d.snapTarget - d.offset) < 0.004) {
        d.offset    = d.snapTarget;
        d.isSnapping = false;
      }
    } else {
      d.vel    *= 0.88;
      d.offset += d.vel * 0.08;
      d.offset  = Math.max(MIN_OFFSET, Math.min(MAX_OFFSET, d.offset));
    }
    if (sliderRef.current) sliderRef.current.position.x = d.offset;

    // Notify parent of active index change
    const idx = activeIndex(d.offset);
    if (idx !== prevIdx.current) { prevIdx.current = idx; onActiveChange(idx); }
  });

  const idx = activeIndex(drag.current.offset);

  return (
    <>
      {/*
       * ── Studio lighting ──────────────────────────────────────────────
       * - ambientLight: base fill uniforme
       * - hemisphereLight: simulé sky/ground pour adoucir les ombres
       * - directionalLight key: depuis avant-haut, doux (ombres douces)
       * - directionalLight fill: depuis gauche, plus doux
       * Pas de point lights pour éviter les reflets ponctuels agressifs.
       */}
      <ambientLight intensity={1.5} />
      <hemisphereLight args={["#ffffff", "#f0f0f5", 0.7]} />
      <directionalLight
        position={[2, 10, 8]} intensity={0.9}
        color="#fff8f4"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-5, 6, 3]} intensity={0.4} color="#f0f4ff" />

      <group ref={sliderRef}>
        {/* Podium octagonal blanc épuré */}
        <mesh rotation={[0, Math.PI / 8, 0]} position={[0, 0.2, 0]} receiveShadow>
          <cylinderGeometry args={[6.0, 6.0, 0.4, 8]} />
          <meshStandardMaterial color={PODIUM_COLOR} roughness={0.42} metalness={0.04} />
        </mesh>
        {/* Rim highlight */}
        <mesh rotation={[0, Math.PI / 8, 0]} position={[0, 0.402, 0]}>
          <cylinderGeometry args={[6.02, 6.02, 0.006, 8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.08} metalness={0.25} />
        </mesh>

        <ContactShadows
          position={[0, 0.202, 0]}
          opacity={0.18} scale={18} blur={2.8} far={2.5}
          color="#c8c8d4"
        />

        {/* Devices */}
        <group position={[0, 0.4, -0.1]}>
          <Suspense fallback={null}>
            <MacBook
              baseW={1.72} baseD={1.12} screenW={1.44} screenH={0.9}
              lidTilt={0.14} textureUrl={SCREEN_URLS[0]}
              posX={DEVICE_X[0]} rotY={0.22} isActive={idx === 0}
            />
            <MacBook
              baseW={2.0} baseD={1.3} screenW={1.72} screenH={1.07}
              lidTilt={0.13} textureUrl={SCREEN_URLS[1]}
              posX={DEVICE_X[1]} rotY={0} isActive={idx === 1}
            />
            <IPhone
              textureUrl={SCREEN_URLS[2]}
              posX={DEVICE_X[2]} isActive={idx === 2}
            />
          </Suspense>
        </group>
      </group>
    </>
  );
}

// ─── Public export ────────────────────────────────────────────────────
export function ProjectGallery3D({ projects }: {
  projects: { title: string; href: string; accentColor: string; label?: string; tags?: string[] }[];
}) {
  const [activeIdx, setActiveIdx] = useState(1);
  const drag = useRef<DragState>({
    dragging:   false, lastX:  0, vel: 0,
    offset:     0,     snapTarget: 0, isSnapping: false,
  });

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a")) return;
    drag.current.dragging  = true;
    drag.current.lastX     = e.clientX;
    drag.current.vel       = 0;
    drag.current.isSnapping = false;
    clearTimeout(drag.current.snapTimer);
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    (e.currentTarget as HTMLDivElement).style.cursor = "grabbing";
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.dragging) return;
    const dx = (e.clientX - drag.current.lastX) / 160;
    drag.current.vel    = dx;
    drag.current.lastX  = e.clientX;
    drag.current.offset = Math.max(MIN_OFFSET, Math.min(MAX_OFFSET,
      drag.current.offset + dx));
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.dragging) return;
    drag.current.dragging = false;
    (e.currentTarget as HTMLDivElement).style.cursor = "grab";
    clearTimeout(drag.current.snapTimer);
    drag.current.snapTimer = setTimeout(() => {
      drag.current.snapTarget  = snapToNearest(drag.current.offset);
      drag.current.isSnapping  = true;
    }, SNAP_DELAY_MS);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (e.deltaX >  30 || e.deltaY >  30) {
      d.snapTarget  = snapToNearest(d.offset - 3.1);
      d.isSnapping  = true;
    } else if (e.deltaX < -30 || e.deltaY < -30) {
      d.snapTarget  = snapToNearest(d.offset + 3.1);
      d.isSnapping  = true;
    }
  }, []);

  const active = projects[activeIdx];

  return (
    <div style={{ position: "relative", width: "100%", borderRadius: 20, overflow: "hidden" }}>

      {/* ── Header fixe en haut ──────────────────────────────── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        textAlign: "center", pointerEvents: "none",
        padding: "20px 24px 0",
      }}>
        <p style={{
          margin: 0, fontSize: 10, fontWeight: 700,
          letterSpacing: "0.18em", textTransform: "uppercase",
          color: "#A259FF",
        }}>
          ANNA VIGNAUD · PRODUCT DESIGNER UX/UI
        </p>
        <p style={{
          margin: "4px 0 0", fontSize: 11.5, fontWeight: 700,
          letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#1a1a1a",
        }}>
          PROJETS SÉLECTIONNÉS
        </p>
      </div>

      {/* ── Canvas 3D ────────────────────────────────────────── */}
      <div
        style={{
          width: "100%", height: "64vh",
          minHeight: 480, maxHeight: 680,
          cursor: "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={handleWheel}
      >
        <Canvas
          /*
           * Camera: y=1.6 (eye-level), z=4.6 (proche), fov=55 (large).
           * lookAt(0, 0.9, 0) centre les écrans des MacBooks dans la vue.
           * Avec lidTilt=0.13-0.14, le produit scalaire screen_normal·ray ≈ 0.998.
           */
          camera={{ position: [0, 1.6, 4.6], fov: 55 }}
          onCreated={({ camera }) => { camera.lookAt(0, 0.9, 0); }}
          gl={{ antialias: true, alpha: false }}
          dpr={[1, 1.5]}
          style={{ background: BG_COLOR }}
        >
          <color attach="background" args={[BG_COLOR]} />
          <Scene projects={projects} drag={drag} onActiveChange={setActiveIdx} />
        </Canvas>
      </div>

      {/* ── Labels sous le slider (position statique par index) ─ */}
      <div style={{
        position: "absolute",
        bottom: 60,
        left: `${(activeIdx / (projects.length - 1)) * 100}%`,
        transform: "translateX(-50%)",
        textAlign: "center",
        transition: "left 0.4s cubic-bezier(0.22,1,0.36,1)",
        pointerEvents: "none",
        zIndex: 10,
        minWidth: 240,
      }}>
        {active && (
          <>
            <p style={{
              margin: "0 0 2px", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: active.accentColor,
            }}>
              {String(activeIdx + 1).padStart(2, "0")}
            </p>
            <p style={{
              margin: "0 0 2px", fontSize: 15, fontWeight: 600,
              color: "#1a1a1a", letterSpacing: "-0.02em",
            }}>
              {active.title}
            </p>
            {active.label && (
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#6b7280" }}>
                {active.label}
              </p>
            )}
            {active.tags && active.tags.length > 0 && (
              <div style={{ display: "flex", gap: 5, justifyContent: "center", flexWrap: "wrap", pointerEvents: "none" }}>
                {active.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 600,
                    background: active.accentColor + "15",
                    color: active.accentColor,
                    border: `1px solid ${active.accentColor}30`,
                  }}>{tag}</span>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Boutons de navigation + hint ─────────────────────── */}
      <div style={{
        position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 12, zIndex: 10,
      }}>
        {projects.map((p, i) => (
          <button key={p.href} onClick={() => {
            const d = drag.current;
            d.snapTarget  = SNAP_POSITIONS[i];
            d.isSnapping  = true;
          }} style={{
            width: activeIdx === i ? 20 : 8, height: 8,
            borderRadius: 999, border: "none", padding: 0,
            background: activeIdx === i ? "#A259FF" : "#d1d5db",
            cursor: "pointer", transition: "all 0.3s ease",
          }} />
        ))}
      </div>
      <div style={{
        position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)",
        fontSize: 10, color: "#9ca3af", letterSpacing: "0.08em",
        textTransform: "uppercase", pointerEvents: "none", zIndex: 10,
        whiteSpace: "nowrap",
      }}>
        ← glisser pour explorer →
      </div>
    </div>
  );
}
