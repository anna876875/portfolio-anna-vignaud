"use client";

import { useEffect, useRef, ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────
   REVEAL — Wrapper scroll-reveal via IntersectionObserver

   RÔLE : Observes quand l'élément entre dans le viewport,
   ajoute la classe CSS `.revealed` → déclenche la transition
   définie dans globals.css (.reveal → .revealed).

   AVANTAGES vs GSAP/Framer :
   - Zéro dépendance externe
   - Pure Web API (IntersectionObserver + CSS transitions)
   - GPU-accelerated (opacity + transform)
   - Aucun layout thrash — la transition ne modifie pas le layout

   USAGE :
   <Reveal direction="up" delay={100}>
     <MonComposant />
   </Reveal>

   STAGGER :
   <Reveal direction="up" delay={0}>   <Card1 /></Reveal>
   <Reveal direction="up" delay={100}> <Card2 /></Reveal>
   <Reveal direction="up" delay={200}> <Card3 /></Reveal>
   ────────────────────────────────────────────────────────────── */

export type RevealDirection = "up" | "left" | "right" | "scale" | "fade";

export interface RevealProps {
  children:    ReactNode;
  direction?:  RevealDirection;
  /** Délai en ms avant le début de la transition (pour stagger) */
  delay?:      number;
  /** Fraction de l'élément visible pour déclencher (0–1) */
  threshold?:  number;
  /** Marge "anticipation" : déclenche avant que l'élément soit dans le viewport */
  rootMargin?: string;
  className?:  string;
}

export function Reveal({
  children,
  direction  = "up",
  delay      = 0,
  threshold  = 0.12,
  rootMargin = "0px 0px -60px 0px",
  className  = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el); /* on ne ré-observe pas — une seule révélation */
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={["reveal", `reveal-${direction}`, className]
        .filter(Boolean)
        .join(" ")}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
