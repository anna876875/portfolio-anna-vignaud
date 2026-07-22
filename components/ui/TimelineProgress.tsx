"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────
   TIMELINE PROGRESS — Frise chronologique animée au scroll

   COMPORTEMENT :
   - Une ligne verticale gris clair (track) sur toute la hauteur
   - Une ligne colorée (fill) qui GRANDIT au fur et à mesure
     que l'utilisateur descend dans la section
   - Transition fluide sur height (80ms linear = "suit le scroll")

   CALCUL DU FILL :
   Quand le TOP de la section touche le BAS du viewport → 0%
   Quand le BOTTOM de la section touche le BAS du viewport → 100%
   Formula : (vh - rect.top) / rect.height × 100

   OFFSET left : 28px → le dot de chaque item est centré sur la ligne.
   Les items ont un padding-left de 64px pour ne pas chevaucher la ligne.
   ────────────────────────────────────────────────────────────── */

export interface TimelineProgressProps {
  children: ReactNode;
  /** Offset gauche de la ligne en px */
  lineLeft?:  number;
  /** Couleur de la partie remplie */
  fillColor?: string;
  /** Couleur du track vide */
  trackColor?: string;
}

export function TimelineProgress({
  children,
  lineLeft   = 28,
  fillColor  = "var(--color-blue)",
  trackColor = "var(--color-sep-opaque)",
}: TimelineProgressProps) {
  const containerRef    = useRef<HTMLDivElement>(null);
  const [fillPct, setFillPct] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;

      /* Commence quand le haut de la section passe sous le centre du viewport */
      const scrolled = vh - rect.top;
      const total    = rect.height;
      const pct      = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setFillPct(pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); /* calcul initial */
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative">

      {/* Track — ligne grise sur toute la hauteur */}
      <div
        className="absolute top-0 bottom-0 w-px pointer-events-none"
        style={{
          left:            lineLeft,
          backgroundColor: trackColor,
        }}
        aria-hidden="true"
      />

      {/* Fill — grandit au scroll */}
      <div
        className="absolute top-0 w-px pointer-events-none"
        style={{
          left:            lineLeft,
          height:          `${fillPct}%`,
          backgroundColor: fillColor,
          transition:      "height 80ms linear",
        }}
        aria-hidden="true"
      />

      {children}
    </div>
  );
}
