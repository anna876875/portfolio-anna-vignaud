"use client";

import { useId } from "react";

/* ──────────────────────────────────────────────────────────────
   TOGGLE / SWITCH — UISwitch (Apple HIG)

   RÔLE UX : Activer ou désactiver une option binaire de manière
   IMMÉDIATE, sans confirmation. C'est le composant de Settings iOS —
   chaque changement est appliqué instantanément.

   DIFFÉRENCE AVEC UNE CHECKBOX :
   - Checkbox = valeur à confirmer dans un formulaire
   - Toggle   = action immédiate (ex: activer le mode sombre)

   QUAND UTILISER :
   - Préférences utilisateur (notifications, visibilité, etc.)
   - Feature flags visibles
   - Mode sombre / clair
   - Ne PAS utiliser pour des formulaires à soumettre → préférer Checkbox

   SPECS APPLE (UISwitch, iOS 16+) :
   - Track : 51×31pt, rayon 15.5pt (fully rounded)
   - Thumb : 27×27pt, rayon 13.5pt, ombre portée
   - Position off : thumb à 2pt du bord gauche
   - Position on  : thumb à 22pt du bord gauche (51-27-2)
   - Couleur on par défaut : systemGreen (#30D158)
   - Transition : spring 300ms cubic-bezier(0.34,1.2,0.64,1)
   ────────────────────────────────────────────────────────────── */

export type ToggleColor = "green" | "blue" | "orange" | "red";

export interface ToggleProps {
  checked:    boolean;
  onChange:   (checked: boolean) => void;
  label?:     string;
  sublabel?:  string;
  disabled?:  boolean;
  color?:     ToggleColor;
  className?: string;
  id?:        string;
}

export function Toggle({
  checked,
  onChange,
  label,
  sublabel,
  disabled   = false,
  color      = "green",
  className  = "",
  id: externalId,
}: ToggleProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;

  return (
    <div
      className={[
        "flex items-center justify-between gap-[var(--sp-4)]",
        disabled ? "opacity-40" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Label (si fourni, positionné à gauche) */}
      {(label || sublabel) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className="toggle-label cursor-pointer block"
            >
              {label}
            </label>
          )}
          {sublabel && (
            <p className="hig-footnote text-[var(--color-label-3)] mt-[2px]">
              {sublabel}
            </p>
          )}
        </div>
      )}

      {/* Track (le bouton) + Thumb (l'indicateur glissant) */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        data-color={color}
        className="toggle-track"
        onClick={() => !disabled && onChange(!checked)}
        aria-label={!label ? "toggle" : undefined}
      >
        <span className="toggle-thumb" aria-hidden="true" />
      </button>
    </div>
  );
}
