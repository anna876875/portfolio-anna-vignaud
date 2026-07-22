import { HTMLAttributes } from "react";

/* ──────────────────────────────────────────────────────────────
   BADGE / TAG — Apple HIG §Labels & Badges

   RÔLE UX : Le badge communique une catégorie, un statut, ou
   une technologie. Apple l'utilise dans deux contextes :
   → Tag/Chip : taxonomie (React, TypeScript, "Design", "Dev")
   → Status badge : état d'un objet ("En cours", "Livré", "Draft")
   → Notification badge : compteur sur icône (géré dans TabBar)

   RÈGLES APPLE :
   - Jamais plus de 3-4 badges dans le même contexte visuel
   - Toujours une couleur sémantique (pas décorative)
   - Hauteur min 20px pour la lisibilité, max ~28px pour rester discret
   - Font : Caption 1 (12px) ou Caption 2 (11px) selon le contexte
   - Coins : radius-full (pill) — le badge n'est pas un bouton
   ──────────────────────────────────────────────────────────────── */

export type BadgeColor = "neutral" | "blue" | "green" | "red" | "orange"
                       | "purple" | "teal" | "pink" | "indigo";
export type BadgeSize  = "sm" | "md";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?:  BadgeColor;
  size?:   BadgeSize;
}

export function Badge({
  color    = "neutral",
  size     = "md",
  className = "",
  children,
  ...props
}: BadgeProps) {
  /* Taille sm = Caption 2 (11px) — pour les listes denses
     Taille md = Caption 1 (12px) — standard dans les cartes */
  const sizeClass = size === "sm"
    ? "hig-caption2 font-semibold px-[var(--sp-2)] py-[1px]"
    : "hig-caption1 font-semibold px-[var(--sp-2)] py-[3px]";

  return (
    <span
      className={[
        "inline-flex items-center rounded-[var(--r-full)] select-none",
        /* La couleur vient de badge-* défini dans globals.css */
        `badge-${color}`,
        sizeClass,
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </span>
  );
}
