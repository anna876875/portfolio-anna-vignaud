import { ArrowRight, MessageSquare } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import _C from "@/data/content.json";
const CA = _C.about;

/* ══════════════════════════════════════════════════════════════════
   PAGE À PROPOS — "Mon Parcours"
   Style : Apple.com — minimalisme extrême, whitespace généreux,
   typographie massive, timeline verticale ultra-clean.

   DÉCISIONS UX :
   - Hero centré plein écran : le NOM est le message. Pas de distraction.
   - Timeline fond gris très clair (#F5F5F7) : sépare visuellement
     le "qui je suis" (hero blanc) du "d'où je viens" (parcours gris).
   - Footer calqué sur apple.com : 3 colonnes de liens, 12px gris, border-top.
   ══════════════════════════════════════════════════════════════════ */

/* ── Données de la timeline ──────────────────────────────────────
   👉 Remplace chaque champ [entre crochets] par tes vraies informations.
   ─────────────────────────────────────────────────────────────── */
type BadgeColor = "blue" | "purple" | "green" | "orange" | "teal" | "red" | "neutral";
const PARCOURS = (CA.parcours as Array<{
  period: string; type: string; badgeColor: string;
  title: string; organization: string; location: string;
  description: string; current: boolean;
}>).map((p, i) => ({ ...p, id: i + 1, badgeColor: p.badgeColor as BadgeColor }));

/* ══════════════════════════════════════════════════════════════════
   PAGE COMPONENT
   ══════════════════════════════════════════════════════════════════ */
export default function AboutPage() {
  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "var(--font-inter, var(--font-sans))", color: "var(--color-label)" }}
    >

      <PortfolioHeader />


      {/* ══════════════════════════════════════════════════════════
          HERO — Plein écran centré, style Apple keynote
          Maxime Apple : "The product is the hero." Ici le hero, c'est toi.
          ══════════════════════════════════════════════════════════ */}
      <section
        className="min-h-[100dvh] flex flex-col items-center justify-center
                   text-center px-[var(--sp-5)]
                   pt-[60px]" /* compense la nav fixed */
        style={{ backgroundColor: "#FFFFFF" }}
        aria-labelledby="hero-name"
      >
        {/* Eyebrow */}
        <p
          className="hig-caption2 font-semibold uppercase tracking-[0.12em] mb-[var(--sp-5)]"
          style={{ color: "var(--color-label-3)" }}
        >
          À propos
        </p>

        {/* Headline principale — volontairement massive */}
        <h1
          id="hero-name"
          className="hig-display font-bold mb-[var(--sp-5)]
                     max-w-[800px] mx-auto"
          style={{
            color: "var(--color-label)",
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            whiteSpace: "pre-line",
          }}
        >
          {CA.hero.greeting}
        </h1>

        {/* Sous-titre rôle — gris secondaire, sobre */}
        <p
          className="hig-title3 font-normal mb-[var(--sp-5)] max-w-[600px] mx-auto"
          style={{ color: "var(--color-label-2)" }}
        >
          {CA.hero.role}
        </p>

        {/* Description courte */}
        <p
          className="hig-body max-w-[520px] mx-auto mb-[var(--sp-4)]"
          style={{ color: "var(--color-label-2)", lineHeight: "1.65" }}
        >
          {CA.hero.bio1}
        </p>
        <p
          className="hig-body max-w-[480px] mx-auto mb-[var(--sp-8)]"
          style={{ color: "var(--color-label-2)", lineHeight: "1.65" }}
        >
          {CA.hero.bio2}
        </p>

        {/* Outils */}
        <div
          className="flex flex-wrap items-center justify-center gap-[var(--sp-2)] mb-[var(--sp-10)]"
          aria-label="Outils"
        >
          {(CA.hero.tools as string[]).map(tool => (
            <span
              key={tool}
              className="hig-footnote"
              style={{
                padding: "5px 14px",
                borderRadius: 100,
                background: "var(--color-bg-secondary)",
                border: "1px solid var(--color-sep-opaque)",
                color: "var(--color-label-2)",
                fontWeight: 500,
              }}
            >
              {tool}
            </span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-[var(--sp-4)]">
          <Button
            variant="filled"
            size="large"
            icon={<ArrowRight size={18} strokeWidth={1.5} />}
          >
            Voir mes projets
          </Button>
          <Button
            variant="plain"
            size="large"
            icon={<MessageSquare size={18} strokeWidth={1.5} />}
          >
            Me contacter
          </Button>
        </div>

        {/* Scroll indicator — subtil, animation CSS */}
        <div
          className="absolute bottom-[var(--sp-8)] left-1/2 -translate-x-1/2
                     flex flex-col items-center gap-[var(--sp-2)]"
          aria-hidden="true"
        >
          <p
            className="hig-caption2 uppercase tracking-[0.1em]"
            style={{ color: "var(--color-label-4)" }}
          >
            Défiler
          </p>
          <ScrollChevron />
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          TIMELINE "Mon Parcours"
          Fond : #F5F5F7 (gris très clair d'Apple)
          Ligne : 1px, couleur sep-opaque
          Dot : 10px, couleur badge selon le type
          ══════════════════════════════════════════════════════════ */}
      <section
        aria-labelledby="parcours-title"
        style={{ backgroundColor: "var(--color-bg-secondary)" }}
      >
        <div
          className="max-w-[var(--layout-xl)] mx-auto px-[var(--sp-5)]
                     py-[var(--sp-24)]"
        >

          {/* En-tête de section */}
          <div className="mb-[var(--sp-16)] max-w-[580px]">
            <p
              className="hig-caption2 font-semibold uppercase tracking-[0.1em] mb-[var(--sp-3)]"
              style={{ color: "var(--color-blue)" }}
            >
              Mon parcours
            </p>
            <h2
              id="parcours-title"
              className="hig-title1 font-bold"
              style={{ color: "var(--color-label)", letterSpacing: "-0.02em" }}
            >
              De la curiosité
              à la création.
            </h2>
            <p
              className="hig-body mt-[var(--sp-4)]"
              style={{ color: "var(--color-label-2)" }}
            >
              Chaque étape m'a appris quelque chose de nouveau sur le design,
              le code et surtout les utilisateurs.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-[720px]">

            {/* Ligne verticale continue */}
            <div
              className="absolute left-[7px] top-[10px] bottom-[10px] w-px"
              style={{ backgroundColor: "var(--color-sep-opaque)" }}
              aria-hidden="true"
            />

            <ol className="space-y-0" aria-label="Frise chronologique">
              {PARCOURS.map((item, idx) => (
                <TimelineItem
                  key={item.id}
                  item={item}
                  isLast={idx === PARCOURS.length - 1}
                />
              ))}
            </ol>
          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════════════════════
          FOOTER — Calqué sur apple.com
          Fond : #F5F5F7 / Texte : 12px gris / Border-top : 1px
          Structure : copyright + 3 colonnes liens
          ══════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: "#fff", borderTop: "1px solid #D2D2D7" }}
        role="contentinfo"
      >
        <div
          className="max-w-[var(--layout-xl)] mx-auto px-[var(--sp-5)]
                     py-[var(--sp-8)] flex flex-col sm:flex-row items-start
                     sm:items-center justify-between gap-[var(--sp-4)]"
        >
          <div>
            <p className="hig-caption2" style={{ color: "var(--color-label-2)" }}>
              © 2026 Anna V. · Product Designer
            </p>
          </div>
          <nav
            className="flex items-center gap-[var(--sp-5)]"
            aria-label="Liens footer"
          >
            {([
              ["Accueil",      "/"],
              ["Expériences",  "/work"],
              ["GitHub",       "#"],
              ["LinkedIn",     "#"],
            ] as [string, string][]).map(([label, href]) => (
              <a key={label} href={href} className="hig-caption2 footer-link">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>

    </div>
  );
}


/* ════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ════════════════════════════════════════════════════════════════ */

/* ── Scroll Chevron animé ─────────────────────────────────────── */
function ScrollChevron() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        color: "var(--color-label-4)",
        animation: "bounce-y 2s ease-in-out infinite",
      }}
    >
      <path
        d="M1 1L8 8L15 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <style>{`
        @keyframes bounce-y {
          0%, 100% { transform: translateY(0);    opacity: 0.4; }
          50%       { transform: translateY(4px);  opacity: 0.8; }
        }
      `}</style>
    </svg>
  );
}


/* ── Timeline Item ────────────────────────────────────────────── */
interface TimelineItemData {
  id:           number;
  period:       string;
  type:         string;
  badgeColor:   "blue" | "purple" | "green" | "orange" | "teal" | "red" | "neutral";
  title:        string;
  organization: string;
  location:     string;
  description:  string;
  current:      boolean;
}

function TimelineItem({
  item,
  isLast,
}: {
  item: TimelineItemData;
  isLast: boolean;
}) {
  return (
    <li
      className="relative flex gap-[var(--sp-8)]"
      style={{ paddingBottom: isLast ? 0 : "var(--sp-14)" }}
    >
      {/* Dot sur la ligne */}
      <div className="relative flex-shrink-0 mt-[3px]" aria-hidden="true">
        <div
          className="w-[14px] h-[14px] rounded-full border-2 border-white"
          style={{
            backgroundColor:
              item.badgeColor === "blue"    ? "var(--color-blue)"   :
              item.badgeColor === "purple"  ? "var(--color-purple)" :
              item.badgeColor === "green"   ? "var(--color-green)"  :
              item.badgeColor === "orange"  ? "var(--color-orange)" :
              item.badgeColor === "teal"    ? "var(--color-teal)"   :
              item.badgeColor === "red"     ? "var(--color-red)"    :
              "var(--color-label-3)",
            boxShadow: item.current
              ? `0 0 0 3px color-mix(in srgb, ${
                  item.badgeColor === "blue" ? "var(--color-blue)" : "var(--color-green)"
                } 20%, transparent)`
              : "none",
          }}
        />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0 pb-[2px]">

        {/* Meta : période + badge type */}
        <div className="flex flex-wrap items-center gap-[var(--sp-3)] mb-[var(--sp-2)]">
          <time
            className="hig-caption1 font-semibold"
            style={{ color: "var(--color-label-3)" }}
          >
            {item.period}
          </time>
          <Badge color={item.badgeColor} size="sm">
            {item.type}
          </Badge>
          {item.current && (
            <Badge color="green" size="sm">● En cours</Badge>
          )}
        </div>

        {/* Titre de l'étape */}
        <h3
          className="hig-title3 font-semibold mb-[var(--sp-1)]"
          style={{ color: "var(--color-label)", letterSpacing: "-0.01em" }}
        >
          {item.title}
        </h3>

        {/* Organisation + localisation */}
        <p
          className="hig-subhead mb-[var(--sp-3)]"
          style={{ color: "var(--color-label-2)" }}
        >
          {item.organization}
          {item.location && (
            <span style={{ color: "var(--color-label-4)" }}>
              {" "}· {item.location}
            </span>
          )}
        </p>

        {/* Description */}
        <p
          className="hig-body"
          style={{ color: "var(--color-label-2)", lineHeight: "1.6", maxWidth: "540px" }}
        >
          {item.description}
        </p>

      </div>
    </li>
  );
}

