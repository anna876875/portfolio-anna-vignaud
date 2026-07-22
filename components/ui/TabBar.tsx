"use client";

import { HTMLAttributes } from "react";

/* ──────────────────────────────────────────────────────────────
   TAB BAR — Apple HIG §Tab Bars

   RÔLE UX : La Tab Bar est l'architecture de navigation principale.
   Elle répond à la question : "Quelles sont les grandes sections
   de cette application ?"

   RÈGLES STRICTES APPLE :
   → 2 à 5 onglets maximum. Au-delà, utiliser un "More" ou reconsidérer
     l'architecture d'information de l'app.
   → Icônes SF Symbols (ou équivalent SVG) + label Court (1-2 mots)
   → Onglet actif : couleur accent (--color-blue) sur l'icône ET le label
   → Onglet inactif : label-3 (30% opacité) — discret mais lisible
   → Hauteur 49px + safe area bottom (notch des iPhones)
   → Material Regular (flou) + séparateur supérieur

   POSITION :
   Fixée en bas de l'écran (fixed bottom-0).
   Sur desktop, on peut la repositionner à gauche (sidebar pattern)
   mais pour ce portfolio, on garde la convention mobile/iPad.

   LABEL (Caption 2 = 11px) :
   Le plus petit style typographique Apple. Utilisé UNIQUEMENT ici.
   Ne jamais utiliser Caption 2 pour du contenu principal —
   ce format existe spécifiquement pour les labels de Tab Bar.
   ──────────────────────────────────────────────────────────────── */

export interface TabItem {
  id:          string;
  label:       string;
  /** Icône état inactif */
  icon:        React.ReactNode;
  /** Icône état actif (optionnel — icône filled vs outline) */
  activeIcon?: React.ReactNode;
  /** Badge numérique (notifications) */
  badge?:      number;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  items:    TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

export function TabBar({ items, activeId, onChange, className = "", ...props }: TabBarProps) {
  return (
    <nav
      /* Fixed en bas, z-index élevé pour passer au-dessus du contenu */
      className={[
        "fixed bottom-0 left-0 right-0 z-50",
        "mat-regular border-t border-[var(--color-sep)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Navigation principale"
      {...props}
    >
      <div className="flex h-[49px] items-stretch">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              /* aria-current="page" = signal d'accessibilité pour l'onglet actif */
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
              className={[
                /* Layout : occupe une part égale de la barre */
                "relative flex flex-1 flex-col items-center justify-center gap-[2px]",
                /* Caption 2 — le seul contexte où ce style est légitime */
                "hig-caption2 font-medium",
                /* Couleur : accent si actif, label-3 sinon */
                isActive
                  ? "text-[var(--color-blue)]"
                  : "text-[var(--color-label-3)]",
                /* Hover discret — pas de highlight de fond (anti-pattern iOS) */
                "hover:text-[var(--color-label-2)]",
                "transition-colors duration-[var(--dur-fast)]",
                /* Press : micro compression */
                "active:scale-[0.92]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {/* Icône — 24px est le standard SF Symbols */}
              <span
                className={[
                  "text-[24px] leading-none",
                  /* Légère animation de scale sur l'activation */
                  isActive ? "scale-110" : "scale-100",
                  "transition-transform duration-[var(--dur-fast)]",
                ].join(" ")}
                aria-hidden="true"
              >
                {isActive && item.activeIcon ? item.activeIcon : item.icon}
              </span>

              {/* Label */}
              <span>{item.label}</span>

              {/* Badge de notification */}
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={[
                    "absolute top-[6px] text-white bg-[var(--color-red)]",
                    "hig-caption2 font-semibold leading-none",
                    "flex items-center justify-center",
                    /* Taille selon le nombre : pill si > 9, cercle sinon */
                    item.badge > 9
                      ? "min-w-[18px] h-[18px] px-[5px] rounded-full"
                      : "w-[18px] h-[18px] rounded-full",
                    /* Position relative à l'icône */
                    "left-[calc(50%+6px)]",
                  ].join(" ")}
                  aria-label={`${item.badge} notifications`}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Safe area bottom — espace pour le Home Indicator des iPhones */}
      <div className="h-safe-bottom" aria-hidden="true" />
    </nav>
  );
}
