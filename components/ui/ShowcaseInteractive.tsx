"use client";

import { useState } from "react";
import { Grid2x2, List, LayoutGrid } from "lucide-react";
import { SegmentedControl } from "./SegmentedControl";
import { Toggle }           from "./Toggle";
import { Progress, SkillBar } from "./Progress";
import { Toast }            from "./Toast";
import { Card }             from "./Card";
import { Button }           from "./Button";

/* ──────────────────────────────────────────────────────────────
   ShowcaseInteractive — Wrapper "use client" pour les démos
   qui nécessitent de l'état React (useState).

   page.tsx est un Server Component → il ne peut pas avoir de state.
   Ce composant est importé par page.tsx et gère toute l'interactivité
   du showcase (Segmented Control, Toggle, Toast, Progress).
   ────────────────────────────────────────────────────────────── */

export function ShowcaseInteractive() {
  /* ── Segmented Control state ── */
  const [projectFilter, setProjectFilter] = useState("all");
  const [viewMode,      setViewMode]      = useState("grid");

  /* ── Toggle state ── */
  const [notifs,   setNotifs]   = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sounds,   setSounds]   = useState(false);

  /* ── Toast state ── */
  const [toastConfig, setToastConfig] = useState<{
    title: string;
    message?: string;
    variant: "success" | "warning" | "error" | "info";
    key: number;
  } | null>(null);

  const triggerToast = (variant: "success" | "warning" | "error" | "info") => {
    const configs = {
      success: { title: "Projet sauvegardé",   message: "Toutes tes modifications ont été enregistrées." },
      warning: { title: "Connexion instable",   message: "Certaines fonctionnalités peuvent être limitées." },
      error:   { title: "Erreur d'envoi",       message: "Le formulaire n'a pas pu être soumis. Réessaie." },
      info:    { title: "Nouvelle fonctionnalité", message: "La section projets vient d'être mise à jour." },
    };
    setToastConfig({ ...configs[variant], variant, key: Date.now() });
  };

  return (
    <div className="space-y-[var(--sp-16)]">

      {/* Toast rendu (outside normal flow) */}
      {toastConfig && (
        <Toast
          key={toastConfig.key}
          title={toastConfig.title}
          message={toastConfig.message}
          variant={toastConfig.variant}
          onDismiss={() => setToastConfig(null)}
        />
      )}


      {/* ═════════════════════════════════════════════════
          SEGMENTED CONTROL
          ═════════════════════════════════════════════════ */}
      <section>
        <div className="mb-[var(--sp-5)]">
          <h2 className="hig-title2 text-[var(--color-label)]">Segmented Control</h2>
          <p className="hig-subhead text-[var(--color-label-3)] mt-[var(--sp-1)]">
            UISegmentedControl · 2-5 options · sélection exclusive · spring animation
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="space-y-[var(--sp-6)]">

            {/* Filtrer des projets */}
            <div>
              <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-3)]">
                Cas d&apos;usage : filtrer des projets
              </p>
              <SegmentedControl
                aria-label="Filtrer les projets par catégorie"
                value={projectFilter}
                onChange={setProjectFilter}
                segments={[
                  { label: "Tous",   value: "all"    },
                  { label: "Design", value: "design" },
                  { label: "Dev",    value: "dev"    },
                  { label: "Mobile", value: "mobile" },
                ]}
              />
              <p className="hig-caption2 text-[var(--color-label-4)] mt-[var(--sp-2)]">
                Valeur active : <code className="text-[var(--color-blue)]">{projectFilter}</code>
              </p>
            </div>

            <div className="border-t border-[var(--color-sep)]" />

            {/* Switcher de vue avec icônes */}
            <div>
              <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-3)]">
                Avec icônes : changer la vue
              </p>
              <SegmentedControl
                aria-label="Mode d'affichage"
                value={viewMode}
                onChange={setViewMode}
                segments={[
                  { label: "Grille",  value: "grid",    icon: <Grid2x2 size={13} strokeWidth={2} /> },
                  { label: "Liste",   value: "list",    icon: <List    size={13} strokeWidth={2} /> },
                  { label: "Compact", value: "compact", icon: <LayoutGrid size={13} strokeWidth={2} /> },
                ]}
              />
            </div>

            <div className="border-t border-[var(--color-sep)]" />

            {/* Full width */}
            <div>
              <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-3)]">
                fullWidth : s&apos;étire sur toute la largeur
              </p>
              <SegmentedControl
                aria-label="Période"
                fullWidth
                value="week"
                onChange={() => {}}
                segments={[
                  { label: "Jour",    value: "day"   },
                  { label: "Semaine", value: "week"  },
                  { label: "Mois",    value: "month" },
                  { label: "Année",   value: "year"  },
                ]}
              />
            </div>

          </div>
        </Card>
      </section>


      {/* ═════════════════════════════════════════════════
          TOGGLE / SWITCH
          ═════════════════════════════════════════════════ */}
      <section>
        <div className="mb-[var(--sp-5)]">
          <h2 className="hig-title2 text-[var(--color-label)]">Toggle · UISwitch</h2>
          <p className="hig-subhead text-[var(--color-label-3)] mt-[var(--sp-1)]">
            51×31px · spring 300ms · action immédiate (pas de confirmation)
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="divide-y divide-[var(--color-sep)]">

            <div className="py-[var(--sp-3)] first:pt-0 last:pb-0">
              <Toggle
                checked={notifs}
                onChange={setNotifs}
                label="Notifications"
                sublabel="Recevoir les alertes de nouveaux projets"
                color="green"
              />
            </div>

            <div className="py-[var(--sp-3)]">
              <Toggle
                checked={darkMode}
                onChange={setDarkMode}
                label="Mode sombre"
                sublabel="Utiliser le thème sombre en permanence"
                color="blue"
              />
            </div>

            <div className="py-[var(--sp-3)] first:pt-0 last:pb-0">
              <Toggle
                checked={sounds}
                onChange={setSounds}
                label="Sons & haptiques"
                sublabel="Retour sonore sur les interactions"
                color="orange"
              />
            </div>

            <div className="pt-[var(--sp-3)]">
              <Toggle
                checked={true}
                onChange={() => {}}
                label="Partage analytique"
                sublabel="Cette option est désactivée"
                disabled
              />
            </div>

          </div>
        </Card>
      </section>


      {/* ═════════════════════════════════════════════════
          PROGRESS & SKILL BARS
          ═════════════════════════════════════════════════ */}
      <section>
        <div className="mb-[var(--sp-5)]">
          <h2 className="hig-title2 text-[var(--color-label)]">Progress & Skill Bars</h2>
          <p className="hig-subhead text-[var(--color-label-3)] mt-[var(--sp-1)]">
            UIProgressView · 3 tailles · indéterminé · skill bars pour le portfolio
          </p>
        </div>

        <div className="grid grid-cols-1 gap-[var(--sp-4)] sm:grid-cols-2">

          {/* Barres de progression */}
          <Card variant="elevated" padding="lg">
            <p className="hig-subhead font-semibold text-[var(--color-label)] mb-[var(--sp-5)]">
              Progress
            </p>
            <div className="space-y-[var(--sp-5)]">
              <div>
                <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-2)]">
                  sm · 4px (default)
                </p>
                <Progress value={65} color="accent" size="sm" aria-label="Progression générale" />
              </div>
              <div>
                <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-2)]">
                  md · 6px, couleur success
                </p>
                <Progress value={88} color="green" size="md" aria-label="Upload" />
              </div>
              <div>
                <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-2)]">
                  lg · 8px, avertissement
                </p>
                <Progress value={42} color="orange" size="lg" aria-label="Stockage" />
              </div>
              <div>
                <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-2)]">
                  Indéterminé : durée inconnue
                </p>
                <Progress indeterminate color="teal" size="sm" aria-label="Chargement" />
              </div>
            </div>
          </Card>

          {/* Skill bars (portfolio) */}
          <Card variant="elevated" padding="lg">
            <p className="hig-subhead font-semibold text-[var(--color-label)] mb-[var(--sp-5)]">
              Skill Bars · niveau de maîtrise
            </p>
            <div className="space-y-[var(--sp-5)]">
              <SkillBar label="Next.js"     value={90} color="accent"  sublabel="App Router, SSR, RSC" />
              <SkillBar label="Figma"       value={82} color="purple"  sublabel="Design systems, prototypage" />
              <SkillBar label="TypeScript"  value={78} color="teal"    sublabel="Types stricts, génériques" />
              <SkillBar label="React Native" value={65} color="green"  sublabel="Expo, Reanimated" />
              <SkillBar label="GraphQL"     value={55} color="orange"  sublabel="Apollo, queries" />
            </div>
          </Card>

        </div>
      </section>


      {/* ═════════════════════════════════════════════════
          TOAST / NOTIFICATION BANNER
          ═════════════════════════════════════════════════ */}
      <section>
        <div className="mb-[var(--sp-5)]">
          <h2 className="hig-title2 text-[var(--color-label)]">Toast · Notification Banner</h2>
          <p className="hig-subhead text-[var(--color-label-3)] mt-[var(--sp-1)]">
            Non-bloquant · frosted glass · auto-dismiss 4s · spring animation
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-4)]">
            Clique pour déclencher chaque variant
          </p>
          <div className="flex flex-wrap gap-[var(--sp-3)]">
            <Button variant="tinted"  onClick={() => triggerToast("success")}>
              ✓ Succès
            </Button>
            <Button variant="filled"  onClick={() => triggerToast("info")}
              style={{ backgroundColor: "var(--color-blue)" }}>
              ℹ Info
            </Button>
            <Button variant="gray"    onClick={() => triggerToast("warning")}>
              ⚠ Avertissement
            </Button>
            <Button
              variant="filled"
              onClick={() => triggerToast("error")}
              style={{ backgroundColor: "var(--color-red)" }}
            >
              ✕ Erreur
            </Button>
          </div>
        </Card>
      </section>

    </div>
  );
}
