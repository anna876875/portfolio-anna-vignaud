"use client";

import { forwardRef, InputHTMLAttributes } from "react";

/* ──────────────────────────────────────────────────────────────
   INPUT / SEARCH FIELD — Apple HIG §Text Fields & Search Fields

   RÔLE UX : Le champ texte est une invitation au dialogue.
   Apple différencie deux types :
   → Text Field  : données structurées (nom, email, mot de passe)
   → Search Field: exploration/filtrage, toujours avec icône loupe

   PRINCIPES APPLE :
   - Fond fill-3 (gris très léger) au repos — l'input est "dans" la surface
   - Pas de bordure au repos — Apple évite les cadres qui alourdissent
   - Bordure accent au focus — signal clair sans agressivité visuelle
   - Placeholder en label-3 (30% opacité) — suggère, ne remplace pas un vrai label
   - Le label au-dessus est TOUJOURS présent pour l'accessibilité
     (le placeholder disparaît dès la frappe, l'utilisateur perd le contexte)
   - Erreur en rouge + message en dessous — jamais dans le champ lui-même
   - Hauteur 44px = touch target minimum Apple HIG
   ──────────────────────────────────────────────────────────────── */

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label visible au-dessus du champ (recommandé pour l'accessibilité) */
  label?: string;
  /** Message d'erreur — déclenche le style d'erreur sur le champ */
  error?: string;
  /** Texte d'aide sous le champ, affiché uniquement s'il n'y a pas d'erreur */
  hint?: string;
  /** Mode Search Field : ajoute la loupe et le comportement de recherche */
  isSearch?: boolean;
  /** Icône à gauche (remplacée par la loupe si isSearch=true) */
  leftIcon?: React.ReactNode;
  /** Icône ou bouton à droite (ex: bouton "Effacer") */
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      isSearch = false,
      leftIcon,
      rightIcon,
      id,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const hasLeftContent = isSearch || !!leftIcon;

    return (
      <div className="flex flex-col gap-[var(--sp-1)] w-full">
        {/* ── Label ──
            Position au-dessus, pas dans le champ.
            Apple recommande des labels courts (1-3 mots). */}
        {label && (
          <label
            htmlFor={inputId}
            className="hig-subhead font-medium text-[var(--color-label)]"
          >
            {label}
          </label>
        )}

        {/* ── Conteneur du champ (pour positionner les icônes) ── */}
        <div className="relative flex items-center">
          {/* Icône gauche ou loupe Search */}
          {hasLeftContent && (
            <span
              aria-hidden="true"
              className="absolute left-[var(--sp-3)] text-[var(--color-label-3)] pointer-events-none"
            >
              {isSearch ? <SearchIcon /> : leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                ? `${inputId}-hint`
                : undefined
            }
            className={[
              /* Dimensions — 44px = touch target minimum */
              "w-full h-11 rounded-[var(--r-md)]",
              /* Typographie */
              "hig-body text-[var(--color-label)]",
              /* Padding horizontal — plus si icône présente */
              hasLeftContent ? "pl-10 pr-[var(--sp-3)]" : "px-[var(--sp-3)]",
              rightIcon ? "pr-10" : "",
              /* Fond fill-3 au repos (léger gris translucide) */
              "bg-[var(--color-fill-3)]",
              /* Placeholder — doit être discret, pas un label de substitution */
              "placeholder:text-[var(--color-label-3)]",
              /* Bordure : transparente au repos, accent au focus, rouge en erreur */
              "border border-transparent",
              "outline-none",
              "transition-all duration-[var(--dur-fast)]",
              /* Focus : fond légèrement plus sombre + bordure accent */
              "focus:bg-[var(--color-fill-2)] focus:border-[var(--color-blue)]",
              /* Erreur : bordure rouge, remplace l'accent au focus */
              error
                ? "border-[var(--color-red)] focus:border-[var(--color-red)]"
                : "",
              /* Désactivé */
              disabled ? "opacity-30 pointer-events-none cursor-not-allowed" : "",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {/* Icône droite */}
          {rightIcon && (
            <span className="absolute right-[var(--sp-3)] text-[var(--color-label-3)]">
              {rightIcon}
            </span>
          )}
        </div>

        {/* ── Erreur ──
            aria-live="polite" annonce l'erreur aux lecteurs d'écran */}
        {error && (
          <span
            id={`${inputId}-error`}
            role="alert"
            className="hig-caption1 text-[var(--color-red)]"
          >
            {error}
          </span>
        )}

        {/* ── Hint ── (masqué si une erreur est présente) */}
        {hint && !error && (
          <span
            id={`${inputId}-hint`}
            className="hig-caption1 text-[var(--color-label-2)]"
          >
            {hint}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

/* ── Icône loupe (Search Field) — SVG inline, pas de dépendance externe ── */
function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10.5 10.5L14 14M6.5 11.5C4.01472 11.5 2 9.48528 2 7C2 4.51472 4.01472 2.5 6.5 2.5C8.98528 2.5 11 4.51472 11 7C11 9.48528 8.98528 11.5 6.5 11.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
