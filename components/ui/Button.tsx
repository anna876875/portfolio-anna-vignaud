"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";

/* ──────────────────────────────────────────────────────────────
   BUTTON — Apple HIG §Buttons

   RÔLE UX : Le bouton est la voix de l'interface.
   Apple définit une hiérarchie stricte pour éviter la "paralysie du choix" :
   → Filled   = action primaire. UNE SEULE par vue. "C'est le moment d'agir."
   → Tinted   = action secondaire positive. Même énergie, moins de cri.
   → Gray     = action neutre. "Fais-le si tu veux, mais ce n'est pas urgent."
   → Plain    = action tertiaire. Utilisé dans les listes, les nav bars.

   PRINCIPE CLÉS :
   - Hauteur minimale 44pt (Apple HIG) = zone tactile sûre sur mobile
   - Font-weight 600 (Semibold) sur le label — jamais Regular
   - Coins très arrondis (r-2xl = 28px) = caractéristique visuelle Apple
   - L'état Disabled est opacity 30% — jamais caché, l'utilisateur
     doit comprendre POURQUOI il ne peut pas agir (via un message nearby)
   ──────────────────────────────────────────────────────────────── */

export type ButtonVariant = "filled" | "tinted" | "gray" | "plain";
export type ButtonSize    = "large" | "regular" | "small";
export type ButtonColor   = "blue" | "purple";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  /** Surcharge la couleur d'accent pour filled/tinted/plain */
  color?:    ButtonColor;
  fullWidth?: boolean;
  loading?:  boolean;
  /** Icône optionnelle avant le label */
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = "filled",
      size      = "regular",
      color,
      fullWidth = false,
      loading   = false,
      disabled,
      icon,
      className = "",
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    /* Surcharge locale de --color-blue pour les variantes colored */
    const colorStyle: React.CSSProperties =
      color === "purple" ? { "--color-blue": "#A259FF" } as React.CSSProperties : {};

    /* ── Base styles communs à toutes les variantes ── */
    const base = [
      "inline-flex items-center justify-center gap-2",
      "font-semibold select-none cursor-pointer",
      /* Focus ring Apple-style (keyboard only, pas au clic souris) */
      "focus-visible:outline-2 focus-visible:outline-offset-2",
      "focus-visible:outline-[var(--color-blue)] focus-visible:rounded-[var(--r-md)]",
      /* Feedback tactile : légère compression + transparence à l'appui */
      "transition-all duration-[120ms]",
      isDisabled
        ? "opacity-30 pointer-events-none cursor-not-allowed"
        : "active:scale-[0.97] active:opacity-70",
      fullWidth ? "w-full" : "",
    ]
      .filter(Boolean)
      .join(" ");

    /* ── Tailles ──
       large   = 50px — CTAs principaux, landing pages (iOS "Large Button")
       regular = 44px — Standard Apple HIG touch target minimum
       small   = 30px — Inline actions, navigation, toolbars */
    const sizes: Record<ButtonSize, string> = {
      large:   "h-[50px] px-6 text-[17px] rounded-[var(--r-2xl)]",
      regular: "h-11    px-5 text-[17px] rounded-[var(--r-2xl)]",
      small:   "h-[30px] px-4 text-[15px] rounded-[var(--r-lg)]",
    };

    /* ── Variantes ── */
    const variants: Record<ButtonVariant, string> = {
      /* Fond bleu plein, texte blanc. Contraste : 4.58:1 ✓ WCAG AA */
      filled: "bg-[var(--color-blue)] text-white hover:opacity-85",

      /* Tint bleu à 12% d'opacité. Classes CSS définies dans globals.css
         pour contourner les limitations de Tailwind avec color-mix(). */
      tinted: "btn-tinted",

      /* Fond gris neutre — ne capte pas l'attention */
      gray: "btn-gray",

      /* Transparent — le texte seul porte l'action */
      plain: "bg-transparent text-[var(--color-blue)] hover:opacity-70",
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        style={{ ...colorStyle, ...style }}
        {...props}
      >
        {loading ? (
          /* Spinner Apple-style : cercle avec gap en haut */
          <>
            <span
              aria-hidden="true"
              className="h-[15px] w-[15px] rounded-full border-2 border-current border-t-transparent animate-spin"
            />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && <span aria-hidden="true" className="shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
