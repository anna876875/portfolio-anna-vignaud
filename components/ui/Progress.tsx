/* ──────────────────────────────────────────────────────────────
   PROGRESS & SKILL BAR — UIProgressView (Apple HIG)

   DEUX USAGES :
   1. Progress — indique l'avancement d'une tâche (upload, chargement)
   2. Skill bar — variante portfolio pour montrer un niveau de maîtrise

   RÈGLE UX APPLE :
   - Ne montrer une barre de progression que si l'opération prend
     entre 1 et 10 secondes. En dessous → ActivityIndicator.
     Au-dessus → afficher une estimation de temps.
   - L'état indéterminé (indeterminate) sert quand la durée est inconnue.

   SPECS (UIProgressView, iOS 16+) :
   - Hauteur track : 4pt (sm), 6pt (md), 8pt (lg)
   - Rayon : fully rounded (--r-full)
   - Track  : rgba(120,120,128,0.16) — un gris très léger
   - Fill   : accent color (ou couleur sémantique)
   - Transition du fill : 600ms ease-out
   ────────────────────────────────────────────────────────────── */

export type ProgressColor  = "accent" | "green" | "orange" | "red" | "purple" | "teal";
export type ProgressSize   = "sm" | "md" | "lg";

export interface ProgressProps {
  /** Valeur 0-100. Ignoré si indeterminate=true */
  value?:          number;
  indeterminate?:  boolean;
  color?:          ProgressColor;
  size?:           ProgressSize;
  "aria-label"?:   string;
  className?:      string;
}

export interface SkillBarProps {
  label:       string;
  value:       number; // 0-100
  sublabel?:   string;
  color?:      ProgressColor;
}

/* ── Progress (général) ─────────────────────────────────────── */
export function Progress({
  value         = 0,
  indeterminate = false,
  color         = "accent",
  size          = "sm",
  "aria-label": ariaLabel,
  className     = "",
}: ProgressProps) {
  const sizeClass  = `progress-track-${size}`;
  const colorClass = color === "accent" ? "" : `progress-fill-${color}`;
  const fillClass  = indeterminate
    ? "progress-fill progress-fill-indeterminate"
    : "progress-fill";

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
      aria-valuetext={indeterminate ? "En cours…" : `${Math.round(value)}%`}
      className={[
        "progress-track",
        sizeClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[fillClass, colorClass].filter(Boolean).join(" ")}
        style={indeterminate ? undefined : { width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

/* ── Skill Bar (variante portfolio) ─────────────────────────── */
export function SkillBar({ label, value, sublabel, color = "accent" }: SkillBarProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-[var(--sp-2)]">
      {/* En-tête : label + pourcentage */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="hig-subhead font-semibold text-[var(--color-label)]">
            {label}
          </span>
          {sublabel && (
            <span className="hig-caption1 text-[var(--color-label-3)] ml-[var(--sp-2)]">
              {sublabel}
            </span>
          )}
        </div>
        <span className="hig-footnote font-semibold text-[var(--color-label-2)] tabular-nums">
          {pct}%
        </span>
      </div>

      {/* Barre */}
      <Progress value={pct} color={color} size="md" aria-label={label} />
    </div>
  );
}
