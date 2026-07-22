import { HTMLAttributes, forwardRef } from "react";

/* ──────────────────────────────────────────────────────────────
   CARD & LIST ITEM — Apple HIG §Collections & Lists

   RÔLE UX : La card est un "container d'information autonome".
   Elle dit à l'utilisateur : "Ce contenu forme une unité cohérente."
   Apple utilise les cards dans trois contextes principaux :
   1. Collection grids (App Store, Photos) — explorations visuelles
   2. Listes (Mail, Réglages) — navigation hiérarchique
   3. Widgets (accueil iOS) — information dense à la volée

   TROIS VARIANTES (selon le contexte d'utilisation) :
   → elevated  : Surface blanche avec ombre — "flotte" au-dessus du fond
                 Idéal sur fond secondaire (bg-secondary gris)
   → filled    : Surface gris bg-secondary — s'intègre dans la page
                 Idéal sur fond blanc (bg-primary)
   → outlined  : Bordure fine sans ombre — pour les listes denses
                 Économe visuellement, Apple l'utilise dans les tableaux

   COMPORTEMENT AU CLIC (prop interactive) :
   - scale(1.01) au hover : léger soulèvement (profondeur z)
   - scale(0.99) au press : compression tactile
   - Ombre plus profonde au hover
   Ces micro-animations reproduisent le ressenti physique des cartes iOS.
   ──────────────────────────────────────────────────────────────── */

export type CardVariant  = "elevated" | "filled" | "outlined";
export type CardPadding  = "none" | "sm" | "md" | "lg";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?:     CardVariant;
  padding?:     CardPadding;
  /** Active les états hover/active et le curseur pointer */
  interactive?: boolean;
  /** Rayon de coin — défaut: r-lg (14px), can override with r-xl (20px) */
  radius?: "r-lg" | "r-xl" | "r-2xl";
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant     = "elevated",
      padding     = "md",
      interactive = false,
      radius      = "r-lg",
      className   = "",
      children,
      ...props
    },
    ref
  ) => {
    const radiusMap = {
      "r-lg":  "rounded-[var(--r-lg)]",
      "r-xl":  "rounded-[var(--r-xl)]",
      "r-2xl": "rounded-[var(--r-2xl)]",
    };

    const base = [
      /* Structure */
      "overflow-hidden",
      radiusMap[radius],
      /* Transition fluide pour les micro-animations */
      "transition-all duration-[var(--dur-base)]",
      /* Comportement interactif */
      interactive
        ? [
            "cursor-pointer",
            "hover:scale-[1.01] hover:shadow-[var(--shadow-lg)]",
            "active:scale-[0.99] active:opacity-90",
          ].join(" ")
        : "",
    ]
      .filter(Boolean)
      .join(" ");

    const variants: Record<CardVariant, string> = {
      /* Fond blanc + ombre — la "card flottante" classique iOS */
      elevated: "bg-[var(--color-bg-primary)] shadow-[var(--shadow-card)]",
      /* Fond gris secondaire — s'intègre dans la page sans ombre */
      filled:   "bg-[var(--color-bg-secondary)]",
      /* Bordure fine sans fond distinct — pour les listes et tableaux */
      outlined: "bg-[var(--color-bg-primary)] border border-[var(--color-sep-opaque)]",
    };

    const paddings: Record<CardPadding, string> = {
      none: "",
      sm:   "p-[var(--sp-3)]",   /* 12px — compact */
      md:   "p-[var(--sp-4)]",   /* 16px — standard */
      lg:   "p-[var(--sp-6)]",   /* 24px — spacieux */
    };

    return (
      <div
        ref={ref}
        className={`${base} ${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";


/* ──────────────────────────────────────────────────────────────
   LIST ITEM — Apple HIG §Lists

   RÔLE UX : Unité de navigation dans une liste iOS.
   Structure canonique Apple : [icon?] [content] [accessory?]
   - Hauteur minimale 44px (touch target)
   - Séparateur inset (ne commence pas au bord — laisse respirer l'icône)
   - L'accessoire à droite indique la navigabilité (chevron, toggle, etc.)
   ──────────────────────────────────────────────────────────────── */

export interface ListItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Icône, avatar, ou symbole SF */
  leading?: React.ReactNode;
  /** Contenu secondaire à droite (chevron, badge, toggle...) */
  trailing?: React.ReactNode;
  /** Titre principal */
  title: string;
  /** Sous-titre optionnel */
  subtitle?: string;
  /** Affiche un séparateur en bas (désactiver sur le dernier item) */
  separator?: boolean;
}

export function ListItem({
  leading,
  trailing,
  title,
  subtitle,
  separator = true,
  className = "",
  ...props
}: ListItemProps) {
  return (
    <div
      className={[
        /* Structure */
        "flex items-center gap-[var(--sp-3)]",
        /* Touch target minimum 44px */
        "min-h-[44px] px-[var(--sp-4)] py-[var(--sp-2)]",
        /* Fond bg-primary, adaptatif light/dark */
        "bg-[var(--color-bg-primary)]",
        /* Interaction */
        props.onClick
          ? "cursor-pointer active:bg-[var(--color-fill-4)] transition-colors duration-[var(--dur-fast)]"
          : "",
        /* Séparateur inset (aligné sur le contenu, pas sur l'icône) */
        separator
          ? "border-b border-[var(--color-sep)] last:border-b-0"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {/* Leading */}
      {leading && (
        <span className="shrink-0 text-[var(--color-label-2)]">{leading}</span>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="hig-body text-[var(--color-label)] truncate">{title}</p>
        {subtitle && (
          <p className="hig-subhead text-[var(--color-label-2)] truncate mt-[1px]">
            {subtitle}
          </p>
        )}
      </div>

      {/* Trailing */}
      {trailing && (
        <span className="shrink-0 text-[var(--color-label-3)]">{trailing}</span>
      )}
    </div>
  );
}
