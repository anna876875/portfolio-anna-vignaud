import { LucideIcon } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   ICON — Wrapper SF Symbols-inspired (Lucide React)

   RÔLE UX : L'icône est le langage non-verbal de l'interface.
   Apple utilise SF Symbols (5000+ icônes) avec une grille optique
   précise. Lucide React s'en inspire avec le même soin de cohérence.

   SPÉCIFICATIONS SF SYMBOLS (Apple HIG) :
   - 9 graisses : ultralight → black (on suit la même graisse que le texte)
   - 3 scales : small / medium (défaut) / large
   - 4 rendering modes : monochrome, hierarchical, palette, multicolor
   - Tailles par contexte :
     • Navigation bar / toolbar : 22pt
     • Tab bar : 22pt (bounding box 30×30)
     • Boutons inline : 16-17pt
     • Contenu / listes : 20-24pt
     • Feature / hero : 28-48pt

   ICON CONTAINER (optionnel) :
   Le "rounded square" d'Apple pour les icônes dans les listes de
   réglages ou les feature cards. Rayon 14px (squircle approximé).
   ──────────────────────────────────────────────────────────────── */

export type IconSize    = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
export type IconColor   = "inherit" | "primary" | "secondary" | "tertiary"
                        | "accent" | "success" | "warning" | "danger"
                        | "blue" | "green" | "red" | "orange"
                        | "purple" | "teal" | "pink" | "indigo";
export type IconWrapColor = "neutral" | "blue" | "green" | "red" | "orange"
                           | "purple" | "teal" | "pink" | "indigo";
export type IconWrapSize  = "sm" | "md" | "lg" | "xl";

export interface IconProps {
  /** Composant Lucide React (ex: import { Github } from 'lucide-react') */
  icon: LucideIcon;
  /** Taille de l'icône — mappée sur les tailles SF Symbols */
  size?: IconSize;
  /** Couleur — mappée sur les tokens DS */
  color?: IconColor;
  /** Active le conteneur "rounded square" iOS style */
  wrap?: boolean;
  /** Taille du conteneur (si wrap=true) */
  wrapSize?: IconWrapSize;
  /** Couleur du conteneur (si wrap=true) */
  wrapColor?: IconWrapColor;
  /** Stroke width personnalisé (défaut: 1.5 — optique SF Symbols Regular) */
  strokeWidth?: number;
  className?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
}

/* Mapping taille → pixels (SF Symbols optical sizes) */
const SIZES: Record<IconSize, number> = {
  xs:   12,   /* micro-labels, badges */
  sm:   16,   /* boutons inline, texte */
  md:   20,   /* nav bar, toolbars (22pt ≈ 20px web) */
  lg:   24,   /* tab bar, listes */
  xl:   28,   /* feature sections */
  "2xl": 32,  /* cards, illustrations */
  "3xl": 48,  /* hero, empty states */
};

/* Mapping couleur → CSS variable */
const COLORS: Record<IconColor, string> = {
  inherit:   "currentColor",
  primary:   "var(--color-label)",
  secondary: "var(--color-label-2)",
  tertiary:  "var(--color-label-3)",
  accent:    "var(--color-blue)",
  success:   "var(--color-green)",
  warning:   "var(--color-orange)",
  danger:    "var(--color-red)",
  blue:      "var(--color-blue)",
  green:     "var(--color-green)",
  red:       "var(--color-red)",
  orange:    "var(--color-orange)",
  purple:    "var(--color-purple)",
  teal:      "var(--color-teal)",
  pink:      "var(--color-pink)",
  indigo:    "var(--color-indigo)",
};

export function Icon({
  icon: LucideComponent,
  size        = "md",
  color       = "inherit",
  wrap        = false,
  wrapSize    = "md",
  wrapColor   = "neutral",
  strokeWidth = 1.5,
  className   = "",
  "aria-label":  ariaLabel,
  "aria-hidden": ariaHidden = true,
}: IconProps) {
  const px    = SIZES[size];
  const fill  = COLORS[color];

  const icon = (
    <LucideComponent
      size={px}
      color={fill}
      strokeWidth={strokeWidth}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      className={wrap ? "" : className}
    />
  );

  if (!wrap) return icon;

  /* Conteneur "rounded square" style Apple Settings / Feature List */
  return (
    <span
      className={`icon-wrap icon-wrap-${wrapSize} icon-wrap-${wrapColor} ${className}`}
      aria-hidden={!ariaLabel ? "true" : undefined}
    >
      {icon}
    </span>
  );
}
