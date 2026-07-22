import { ArrowUpRight } from "lucide-react";
import { Badge, BadgeColor } from "./Badge";

/* ──────────────────────────────────────────────────────────────
   PROJECT CARD — Portfolio Component

   RÔLE UX : La Project Card est une "vitrine compacte" d'un projet.
   Elle doit répondre en 3 secondes aux questions de l'utilisateur :
   1. "Qu'est-ce que c'est ?" → Titre + description
   2. "Avec quoi c'est fait ?" → Tags technologies
   3. "Puis-je en voir plus ?" → Indicateur d'action (flèche)

   Apple App Store utilise exactement ce pattern pour ses fiches apps :
   - Image/cover en haut (ratio 16:9 ou personnalisé)
   - Métadonnées en bas (titre, catégorie, note)
   - Affordance de navigation (bouton GET ou chevron)

   STRUCTURE :
   ┌────────────────────────────┐
   │  COVER (gradient ou image) │  ← zone visuelle principale
   │                            │
   ├────────────────────────────┤
   │  [Category]                │  ← hig-caption2, accent color
   │  Titre du projet           │  ← hig-headline
   │  Description courte        │  ← hig-subhead, label-2
   │  [Tag] [Tag] [Tag]     [↗] │  ← badges + action icon
   └────────────────────────────┘
   ──────────────────────────────────────────────────────────────── */

export type ProjectCoverGradient =
  | "blue-purple"
  | "orange-pink"
  | "green-teal"
  | "indigo-cyan";

export interface ProjectTag {
  label: string;
  color?: BadgeColor;
}

export interface ProjectCardProps {
  title:        string;
  description:  string;
  category?:    string;
  tags?:        ProjectTag[];
  href?:        string;
  /** Gradient de couverture prédéfini */
  gradient?:    ProjectCoverGradient;
  /** Image de couverture (prioritaire sur gradient) */
  coverImage?:  string;
  coverAlt?:    string;
  /** Emoji ou texte court centré dans le cover (si pas d'image) */
  coverEmoji?:  string;
  className?:   string;
}

const COVER_GRADIENTS: Record<ProjectCoverGradient, string> = {
  "blue-purple": "mesh-blue-purple",
  "orange-pink": "mesh-orange-pink",
  "green-teal":  "mesh-green-teal",
  "indigo-cyan": "mesh-indigo-cyan",
};

export function ProjectCard({
  title,
  description,
  category,
  tags         = [],
  href,
  gradient     = "blue-purple",
  coverImage,
  coverAlt,
  coverEmoji,
  className    = "",
}: ProjectCardProps) {
  const Wrapper = href ? "a" : "div";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <Wrapper
      {...(wrapperProps as object)}
      className={[
        "group block",
        "bg-[var(--color-bg-primary)] rounded-[var(--r-xl)]",
        "overflow-hidden",
        "shadow-[var(--shadow-card)]",
        "border border-[var(--color-sep-opaque)]",
        "transition-all duration-[var(--dur-base)]",
        href
          ? "hover:shadow-[var(--shadow-xl)] hover:-translate-y-1 cursor-pointer"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Cover ── */}
      <div
        className={[
          "relative h-44 overflow-hidden flex items-center justify-center",
          /* Gradient mesh si pas d'image */
          !coverImage ? COVER_GRADIENTS[gradient] : "",
        ].join(" ")}
        style={coverImage ? { backgroundImage: `url(${coverImage})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
        aria-hidden={!coverAlt}
      >
        {coverImage && coverAlt && (
          <span className="sr-only">{coverAlt}</span>
        )}
        {!coverImage && coverEmoji && (
          <span
            className="text-[56px] select-none transition-transform duration-[var(--dur-slow)] group-hover:scale-110"
            aria-hidden="true"
          >
            {coverEmoji}
          </span>
        )}
        {/* Gradient de fondu bas — fondu vers le fond de la carte */}
        <div
          className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, var(--color-bg-primary))",
          }}
          aria-hidden="true"
        />
      </div>

      {/* ── Contenu ── */}
      <div className="p-[var(--sp-4)] pt-[var(--sp-3)]">
        {/* Catégorie */}
        {category && (
          <p className="hig-caption2 font-semibold text-[var(--color-blue)] uppercase tracking-[0.06em] mb-[var(--sp-1)]">
            {category}
          </p>
        )}

        {/* Titre */}
        <h3 className="hig-headline text-[var(--color-label)] mb-[var(--sp-1)] leading-snug">
          {title}
        </h3>

        {/* Description */}
        <p className="hig-subhead text-[var(--color-label-2)] mb-[var(--sp-3)] line-clamp-2">
          {description}
        </p>

        {/* Footer : tags + flèche */}
        <div className="flex items-center justify-between gap-[var(--sp-2)]">
          <div className="flex flex-wrap gap-[var(--sp-1)]">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag.label} color={tag.color ?? "neutral"} size="sm">
                {tag.label}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge color="neutral" size="sm">+{tags.length - 3}</Badge>
            )}
          </div>

          {href && (
            <span
              className={[
                "shrink-0 flex items-center justify-center",
                "w-7 h-7 rounded-[var(--r-full)]",
                "bg-[var(--color-blue)] text-white",
                "transition-all duration-[var(--dur-fast)]",
                "group-hover:scale-110 group-hover:rotate-45",
              ].join(" ")}
              aria-hidden="true"
            >
              <ArrowUpRight size={14} strokeWidth={2} />
            </span>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
