"use client";

import { useRef, useLayoutEffect, useState, ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────
   SEGMENTED CONTROL — UISegmentedControl (Apple HIG)

   RÔLE UX : Sélectionner UN état parmi N options mutuellement
   exclusives. Apple l'utilise pour switcher entre vues (ex: "Tous /
   Mes projets / Favoris") ou paramètres (ex: "Jour / Semaine / Mois").

   DIFFÉRENCE AVEC DES BOUTONS RADIO :
   - Les boutons radio sont verticaux et occupent de l'espace
   - Le Segmented Control est horizontal, compact, cohérent visuellement
   - Le "thumb" glissant donne un feedback immédiat de la sélection

   QUAND UTILISER :
   - 2 à 5 options (au-delà → utiliser un Picker/Select)
   - Options courtes (1-2 mots, idéalement)
   - Sélection mutuellement exclusive (pas pour des filtres multiples)

   USAGE PORTFOLIO :
   - Filtrer les projets : "Tous | Design | Dev | Mobile"
   - Switcher la vue : "Grille | Liste"
   ────────────────────────────────────────────────────────────── */

export interface Segment {
  label:     string;
  value:     string;
  icon?:     ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  segments:   Segment[];
  value:      string;
  onChange:   (value: string) => void;
  fullWidth?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function SegmentedControl({
  segments,
  value,
  onChange,
  fullWidth    = false,
  className    = "",
  "aria-label": ariaLabel,
}: SegmentedControlProps) {
  const rootRef  = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [thumb, setThumb] = useState({ left: 0, width: 0 });

  /* Calcule la position du thumb en mesurant le DOM */
  useLayoutEffect(() => {
    const idx  = segments.findIndex((s) => s.value === value);
    const item = itemRefs.current[idx];
    const root = rootRef.current;
    if (!item || !root) return;

    const rootRect = root.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    setThumb({
      left:  itemRect.left - rootRect.left - 2, // -2 = padding du root
      width: itemRect.width,
    });
  }, [value, segments]);

  return (
    <div
      ref={rootRef}
      role="tablist"
      aria-label={ariaLabel}
      className={[
        "seg-root",
        fullWidth ? "w-full" : "w-fit",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Thumb glissant (indicateur de sélection) */}
      <div
        className="seg-thumb"
        style={{ left: thumb.left, width: thumb.width }}
        aria-hidden="true"
      />

      {segments.map((seg, idx) => (
        <button
          key={seg.value}
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          role="tab"
          type="button"
          aria-selected={value === seg.value}
          disabled={seg.disabled}
          className="seg-item"
          onClick={() => onChange(seg.value)}
        >
          {seg.icon && <span aria-hidden="true">{seg.icon}</span>}
          {seg.label}
        </button>
      ))}
    </div>
  );
}
