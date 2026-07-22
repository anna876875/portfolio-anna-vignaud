import { HTMLAttributes, forwardRef } from "react";

/* ──────────────────────────────────────────────────────────────
   GLASS CARD — Apple HIG §Materials & Vibrancy

   RÔLE UX : La Glass Card est une surface "intelligente" qui
   emprunte sa couleur à ce qui l'entoure. Elle dit à l'utilisateur :
   "Je suis là, mais je ne domine pas l'espace — le contenu derrière
   moi fait partie du contexte."

   Apple l'utilise pour :
   - Widgets et panneaux flottants (iOS, macOS, visionOS)
   - Navigation bars et toolbars (semi-transparentes)
   - Popovers et menus contextuels
   - Cartes posées sur des fonds colorés ou photographiques

   ANATOMIE (voir globals.css `.glass-card`) :
   ① backdrop-filter blur(24px) saturate(180%) = la vibrancy
   ② border rgba(255,255,255,0.20) = contour de verre
   ③ inset shadow top = reflet spéculaire (surface brillante)
   ④ inset shadow bottom = profondeur interne
   ⑤ ::before noise texture = grain de verre (3% opacité)

   MESH GRADIENT (optionnel) :
   On peut poser un mesh gradient DERRIÈRE la glass card pour
   créer un fond coloré sur lequel le verre "vibre".
   ──────────────────────────────────────────────────────────────── */

export type GlassMesh    = "none" | "blue-purple" | "orange-pink"
                         | "green-teal" | "indigo-cyan";
export type GlassRadius  = "lg" | "xl" | "2xl";
export type GlassPadding = "none" | "sm" | "md" | "lg";

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Fond dégradé mesh derrière la carte */
  mesh?:        GlassMesh;
  radius?:      GlassRadius;
  padding?:     GlassPadding;
  /** Enveloppe la carte dans son propre conteneur mesh */
  withMeshWrapper?: boolean;
  interactive?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      mesh             = "none",
      radius           = "xl",
      padding          = "md",
      withMeshWrapper  = false,
      interactive      = false,
      className        = "",
      children,
      ...props
    },
    ref
  ) => {
    const radiusMap: Record<GlassRadius, string> = {
      lg:   "rounded-[var(--r-lg)]",
      xl:   "rounded-[var(--r-xl)]",
      "2xl":"rounded-[var(--r-2xl)]",
    };

    const paddingMap: Record<GlassPadding, string> = {
      none: "",
      sm:   "p-[var(--sp-3)]",
      md:   "p-[var(--sp-5)]",
      lg:   "p-[var(--sp-6)]",
    };

    const card = (
      <div
        ref={ref}
        className={[
          "glass-card",
          radiusMap[radius],
          paddingMap[padding],
          interactive
            ? "cursor-pointer transition-transform duration-[var(--dur-base)] hover:scale-[1.01] active:scale-[0.99]"
            : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </div>
    );

    /* Quand withMeshWrapper=true, on enveloppe la carte dans un
       conteneur avec le gradient mesh — utile pour les showcases */
    if (withMeshWrapper && mesh !== "none") {
      return (
        <div
          className={`mesh-${mesh} rounded-[var(--r-2xl)] p-[var(--sp-6)]`}
        >
          {card}
        </div>
      );
    }

    return card;
  }
);

GlassCard.displayName = "GlassCard";
