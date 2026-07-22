import { LucideIcon } from "lucide-react";
import { Icon, IconWrapColor } from "./Icon";

/* ──────────────────────────────────────────────────────────────
   FEATURE CARD — Apple HIG §Feature List / App Store What's New

   RÔLE UX : La Feature Card met en valeur une compétence, un service,
   ou une fonctionnalité. Elle traduit une capacité abstraite en
   une information visuelle scannable.

   Apple l'utilise dans :
   - App Store "What's New" section (icône + titre + description)
   - Apple.com feature rows (icône + ligne + sous-ligne)
   - System Settings (iOS/macOS) — chaque groupe de réglages

   RÈGLES APPLE (App Store / apple.com) :
   - Icône dans un "rounded square" 56×56pt (squircle, r-xl)
   - Titre en Headline (17pt/600)
   - Description en Body ou Callout (17pt ou 16pt, Regular)
   - Espacement entre l'icône et le texte : 16pt (sp-4)
   - Jamais plus de 4-5 features en grille (sinon : list)

   DEUX LAYOUTS :
   → vertical (défaut) : icône en haut, texte en dessous (grille)
   → horizontal : icône à gauche, texte à droite (liste)
   ──────────────────────────────────────────────────────────────── */

export interface FeatureCardProps {
  icon:          LucideIcon;
  title:         string;
  description:   string;
  iconColor?:    IconWrapColor;
  /** vertical = icône en haut (grille) | horizontal = icône à gauche (liste) */
  layout?:       "vertical" | "horizontal";
  /** Applique le fond glass sur la carte */
  glass?:        boolean;
  className?:    string;
}

export function FeatureCard({
  icon,
  title,
  description,
  iconColor  = "blue",
  layout     = "vertical",
  glass      = false,
  className  = "",
}: FeatureCardProps) {
  const isHorizontal = layout === "horizontal";

  const baseCard = [
    "rounded-[var(--r-xl)] p-[var(--sp-5)]",
    glass
      ? "glass-card"
      : "bg-[var(--color-bg-primary)] shadow-[var(--shadow-card)] border border-[var(--color-sep-opaque)]",
    isHorizontal
      ? "flex items-start gap-[var(--sp-4)]"
      : "flex flex-col gap-[var(--sp-4)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={baseCard}>
      {/* Icône dans son conteneur rounded square */}
      <Icon
        icon={icon}
        size="xl"
        wrap
        wrapSize="lg"
        wrapColor={iconColor}
        aria-hidden={true}
      />

      {/* Texte */}
      <div className={isHorizontal ? "flex-1 min-w-0 pt-[var(--sp-1)]" : ""}>
        <h3 className="hig-headline text-[var(--color-label)] mb-[var(--sp-1)]">
          {title}
        </h3>
        <p className="hig-callout text-[var(--color-label-2)]">
          {description}
        </p>
      </div>
    </div>
  );
}
