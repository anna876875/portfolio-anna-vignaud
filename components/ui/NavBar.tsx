import { HTMLAttributes } from "react";

/* ──────────────────────────────────────────────────────────────
   NAVIGATION BAR — Apple HIG §Navigation Bars

   RÔLE UX : La barre de navigation est le "fil d'Ariane" de l'interface.
   Elle répond à la question fondamentale de l'utilisateur : "Où suis-je ?"
   Apple en définit deux modes :

   → Standard (44px) : titre centré, boutons action à gauche/droite
     Utilisé pour les vues secondaires (drill-down navigation)
     Le titre est en Headline (17px/600) — visible d'un coup d'œil

   → Large Title (44px + extension) : grand titre à gauche qui se réduit
     en titre standard au scroll (comportement iOS natif)
     Utilisé pour les vues de premier niveau (onglets principaux)
     Le grand titre est en Large Title (34px/700) — ancrage visuel fort

   MATERIAL :
   La navigation bar utilise un matériau "Regular" (flou + transparence).
   Elle est sticky — reste visible lors du scroll.
   La bordure inférieure (separator) indique visuellement la séparation
   entre la navigation et le contenu.

   BOUTONS D'ACTION :
   Toujours en variant "plain" (texte bleu) ou icône.
   Le bouton gauche est typiquement "< Retour" (Back).
   Le bouton droit est l'action principale de la vue (Edit, Done, +).
   ──────────────────────────────────────────────────────────────── */

export interface NavBarProps extends HTMLAttributes<HTMLElement> {
  /** Titre de la vue courante */
  title?: string;
  /** Active le Large Title (grand titre sous la barre standard) */
  largeTitle?: boolean;
  /** Slot gauche — typiquement un bouton "Retour" */
  leftAction?: React.ReactNode;
  /** Slot droit — typiquement l'action primaire de la vue */
  rightAction?: React.ReactNode;
  /** Barre complètement transparente (pour overlays sur images/vidéos) */
  transparent?: boolean;
}

export function NavBar({
  title,
  largeTitle = false,
  leftAction,
  rightAction,
  transparent = false,
  className = "",
  ...props
}: NavBarProps) {
  return (
    <header
      className={[
        "sticky top-0 z-50 w-full",
        /* Material Regular : flou + semi-transparence */
        transparent ? "bg-transparent" : "mat-regular border-b border-[var(--color-sep)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {/* ── Barre standard 44px ── */}
      <div className="relative flex h-11 items-center justify-between px-[var(--sp-4)]">
        {/* Slot gauche — min-w pour ne pas écraser le titre centré */}
        <div className="flex items-center gap-2 min-w-[60px]">
          {leftAction}
        </div>

        {/* Titre centré (mode standard, masqué en mode largeTitle) */}
        {!largeTitle && title && (
          <span
            /* absolute + translate pour centrage parfait sans dépendre des slots */
            className="absolute left-1/2 -translate-x-1/2 hig-headline text-[var(--color-label)] truncate max-w-[200px]"
          >
            {title}
          </span>
        )}

        {/* Slot droit */}
        <div className="flex items-center gap-2 min-w-[60px] justify-end">
          {rightAction}
        </div>
      </div>

      {/* ── Large Title — extension sous la barre standard ──
          En iOS, ce titre se réduit vers la barre au scroll (JS needed).
          Ici on pose la structure statique. */}
      {largeTitle && title && (
        <div className="px-[var(--sp-4)] pb-[var(--sp-2)]">
          <h1 className="hig-largetitle text-[var(--color-label)]">{title}</h1>
        </div>
      )}
    </header>
  );
}


/* ──────────────────────────────────────────────────────────────
   BACK BUTTON — Bouton retour standard Apple
   Composant utilitaire pour le slot leftAction de NavBar
   ──────────────────────────────────────────────────────────────── */
export interface BackButtonProps {
  label?: string;
  onClick?: () => void;
}

export function BackButton({ label = "Retour", onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-[var(--color-blue)] hig-body hover:opacity-70 active:opacity-50 transition-opacity duration-[var(--dur-fast)]"
    >
      <ChevronLeftIcon />
      <span>{label}</span>
    </button>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden="true">
      <path
        d="M10 18L2 10L10 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
