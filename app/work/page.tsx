"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { Reveal } from "@/components/ui/Reveal";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import _C from "@/data/content.json";
const CW = _C.work;

/* ══════════════════════════════════════════════════════════════════
   PAGE /work — Hero + Frise de bulles au scroll

   FONCTIONNEMENT :
   1. Hero sombre plein écran → invite à scroller
   2. Au scroll : une ligne verticale centrale se COLORE en bleu
      progressivement (fillPct via scroll listener)
   3. Chaque bulle entre dans le viewport → IntersectionObserver
      → classe .revealed → transition CSS opacity + translateX
   4. Desktop : bulles alternent gauche / droite (zigzag)
      Mobile  : toutes les bulles à droite de la ligne

   EXPÉRIENCES : 5 bulles individuelles (une par expérience)
   COMPÉTENCES : 1 bulle finale regroupant les 4 catégories
   ══════════════════════════════════════════════════════════════════ */

/* ── Types & constantes ─────────────────────────────────────── */
type AccentColor = "blue" | "purple" | "green" | "orange" | "teal";

const ACCENT_HEX: Record<AccentColor, string> = {
  blue:   "var(--color-blue)",
  purple: "var(--color-purple)",
  green:  "var(--color-green)",
  orange: "var(--color-orange)",
  teal:   "var(--color-teal)",
};

const EXPERIENCES = (CW.experiences as Array<{
  period: string; type: string; accent: string;
  title: string; organization: string; achievement: string; skills: string[];
}>).map((e, i) => ({ ...e, id: i + 1, accent: e.accent as AccentColor }));

const SKILL_GROUPS = (CW.skillGroups as Array<{
  category: string; accent: string; items: string[];
}>).map(g => ({ ...g, accent: g.accent as AccentColor }));

/* ══════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */
export default function WorkPage() {
  const lineRef  = useRef<HTMLDivElement>(null);
  const [fillPct, setFillPct] = useState(0);

  /* Colore la ligne au fur et à mesure du scroll */
  useEffect(() => {
    const handle = () => {
      const el = lineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pct  = Math.min(100, Math.max(0,
        (window.innerHeight - rect.top) / rect.height * 100
      ));
      setFillPct(pct);
    };
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  return (
    <div style={{ fontFamily: "var(--font-inter, var(--font-sans))" }}>

      <PortfolioHeader />


      {/* ══════════════════════════════════════════════════════
          HERO — Plein écran, fond noir
          Titre 3 mots en stagger CSS (sans JS)
          ══════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-[100dvh] flex flex-col items-center
                   justify-center text-center px-[var(--sp-5)] pt-[60px]"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%," +
            " rgba(0,122,255,0.12), transparent 65%), #000000",
        }}
        aria-labelledby="hero-title"
      >
        {/* Eyebrow */}
        <p
          className="hero-subtitle hig-caption2 font-semibold uppercase
                     tracking-[0.14em] mb-[var(--sp-6)]"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {CW.hero.eyebrow}
        </p>

        {/* Titre 3 mots — stagger CSS au load */}
        <h1
          id="hero-title"
          aria-label={`${CW.hero.word1} ${CW.hero.word2} ${CW.hero.word3}`}
          className="mb-[var(--sp-7)]"
          style={{
            fontSize:      "clamp(52px, 9vw, 88px)",
            fontWeight:    700,
            lineHeight:    1.0,
            letterSpacing: "-0.04em",
            color:         "#F5F5F7",
          }}
        >
          <span className="hero-word">{CW.hero.word1}</span>
          <span className="hero-word" style={{ color: "var(--color-blue)" }}>{CW.hero.word2}</span>
          <span className="hero-word">{CW.hero.word3}</span>
        </h1>

        <p
          className="hero-subtitle hig-title3 font-normal max-w-[520px]
                     mb-[var(--sp-10)]"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {CW.hero.subtitle}
        </p>

        {/* Invite à scroller */}
        <a
          href="#frise"
          className="hero-cta flex flex-col items-center gap-[var(--sp-2)]"
          style={{ transition: "opacity var(--dur-fast)" }}
          aria-label="Scroller vers les expériences"
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.5")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <span className="hig-footnote" style={{ color: "rgba(255,255,255,0.45)" }}>
            Scroller pour découvrir
          </span>
          <ArrowDown
            size={18}
            strokeWidth={1.5}
            style={{ color: "rgba(255,255,255,0.45)", animation: "bounce-y 2s ease-in-out infinite" }}
            aria-hidden="true"
          />
        </a>

        {/* Fondu vers le blanc */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height:     "96px",
            background: "linear-gradient(to bottom, transparent, #ffffff)",
          }}
          aria-hidden="true"
        />
      </section>


      {/* ══════════════════════════════════════════════════════
          FRISE DE BULLES
          ══════════════════════════════════════════════════════ */}
      <section
        id="frise"
        style={{ backgroundColor: "#FFFFFF" }}
        aria-labelledby="frise-title"
      >
        <div className="max-w-[860px] mx-auto px-[var(--sp-5)] pt-[var(--sp-24)] pb-[var(--sp-20)]">

          {/* En-tête centré */}
          <Reveal direction="up">
            <div className="text-center mb-[var(--sp-20)]">
              <p
                className="hig-caption2 font-semibold uppercase tracking-[0.1em]
                           mb-[var(--sp-3)]"
                style={{ color: "var(--color-blue)" }}
              >
                Parcours
              </p>
              <h2
                id="frise-title"
                className="hig-title1 font-bold mb-[var(--sp-4)]"
                style={{ color: "var(--color-label)", letterSpacing: "-0.02em" }}
              >
                Mes expériences
              </h2>
            </div>
          </Reveal>

          {/* ── Conteneur de la frise ──────────────────────── */}
          <div ref={lineRef} className="bubble-container">

            {/* Ligne track grise (toute la hauteur) */}
            <div className="bubble-track" aria-hidden="true" />
            {/* Ligne fill bleue (hauteur = fillPct%) */}
            <div
              className="bubble-fill"
              style={{ height: `${fillPct}%` }}
              aria-hidden="true"
            />

            {/* ── Bulles d'expériences ───────────────────── */}
            {EXPERIENCES.map((exp, idx) => {
              const isLeft = idx % 2 === 0;
              const color  = ACCENT_HEX[exp.accent];
              return (
                <div
                  key={exp.id}
                  className={`bubble-node ${isLeft ? "bubble-node-left" : "bubble-node-right"}`}
                >
                  {/* Dot coloré sur la ligne */}
                  <div
                    className="bubble-dot"
                    style={{ backgroundColor: color }}
                    aria-hidden="true"
                  />

                  {/* Bras horizontal (desktop seulement, via CSS) */}
                  <div className="bubble-arm" aria-hidden="true" />

                  {/* Bulle avec scroll reveal */}
                  <div className="bubble-card-wrap">
                    <Reveal direction={isLeft ? "left" : "right"}>
                      <article
                        className="bubble-card"
                        style={{ borderTop: `3px solid ${color}` }}
                        aria-label={exp.title}
                      >
                        {/* Meta */}
                        <div
                          className="flex flex-wrap items-center gap-[var(--sp-2)]
                                     mb-[var(--sp-4)]"
                        >
                          <Badge color={exp.accent} size="sm">
                            {exp.type}
                          </Badge>
                          <time
                            className="hig-caption1"
                            style={{ color: "var(--color-label-2)" }}
                          >
                            {exp.period}
                          </time>
                        </div>

                        {/* Titre */}
                        <h3
                          className="hig-title3 font-semibold mb-[var(--sp-1)]"
                          style={{ color: "var(--color-label)", letterSpacing: "-0.01em" }}
                        >
                          {exp.title}
                        </h3>
                        <p
                          className="hig-subhead mb-[var(--sp-5)]"
                          style={{ color: "var(--color-label-2)" }}
                        >
                          {exp.organization}
                        </p>

                        {/* Réalisation */}
                        <blockquote
                          className="hig-body mb-[var(--sp-5)]"
                          style={{
                            color:       "var(--color-label)",
                            fontStyle:   "italic",
                            lineHeight:  "1.65",
                            borderLeft:  `2px solid ${color}50`,
                            paddingLeft: "var(--sp-4)",
                          }}
                        >
                          «&nbsp;{exp.achievement}&nbsp;»
                        </blockquote>

                        {/* Skill tags */}
                        <div className="flex flex-wrap gap-[var(--sp-2)]">
                          {exp.skills.map((s) => (
                            <Badge key={s} color="neutral" size="sm">{s}</Badge>
                          ))}
                        </div>
                      </article>
                    </Reveal>
                  </div>
                </div>
              );
            })}

            {/* ── Bulle Compétences (index 5 = droite) ──── */}
            <div className="bubble-node bubble-node-right">
              {/* Dot noir */}
              <div
                className="bubble-dot"
                style={{ backgroundColor: "#1D1D1F" }}
                aria-hidden="true"
              />
              <div className="bubble-arm" aria-hidden="true" />

              <div className="bubble-card-wrap">
                <Reveal direction="right">
                  <div
                    className="bubble-card"
                    style={{ borderTop: "3px solid #1D1D1F" }}
                  >
                    <p
                      className="hig-caption2 font-semibold uppercase
                                 tracking-[0.1em] mb-[var(--sp-5)]"
                      style={{ color: "#1D1D1F" }}
                    >
                      Compétences
                    </p>

                    {/* Grille 2 × 2 */}
                    <div className="grid grid-cols-2 gap-[var(--sp-4)]">
                      {SKILL_GROUPS.map((group) => {
                        const c = ACCENT_HEX[group.accent];
                        return (
                          <div key={group.category}>
                            <p
                              className="hig-footnote font-semibold mb-[var(--sp-2)]"
                              style={{ color: c }}
                            >
                              {group.category}
                            </p>
                            <div className="flex flex-wrap gap-[var(--sp-1)]">
                              {group.items.map((item) => (
                                <Badge
                                  key={item}
                                  color={group.accent}
                                  size="sm"
                                >
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* ── Point terminal de fin de frise ─────────── */}
            <div className="relative" style={{ height: 40, marginTop: 8 }}>
              <div
                className="bubble-terminal"
                style={{ top: 0 }}
                aria-hidden="true"
              />
            </div>

          </div>{/* /bubble-container */}
        </div>
      </section>


      {/* ══════════════════════════════════════════════════════
          CTA — Fond noir, referme le récit
          ══════════════════════════════════════════════════════ */}
      <section
        className="text-center px-[var(--sp-5)] py-[var(--sp-32)]"
        style={{ backgroundColor: "#000000" }}
        aria-labelledby="cta-title"
      >
        <Reveal direction="scale">
          <p
            className="hig-caption2 font-semibold uppercase tracking-[0.12em]
                       mb-[var(--sp-5)]"
            style={{ color: "var(--color-label-2)" }}
          >
            Collaboration
          </p>
          <h2
            id="cta-title"
            className="hig-display font-bold mb-[var(--sp-5)] max-w-[580px] mx-auto"
            style={{
              color:         "#F5F5F7",
              letterSpacing: "-0.04em",
              lineHeight:    1.05,
            }}
          >
            Travaillons
            ensemble.
          </h2>
          <p
            className="hig-body max-w-[420px] mx-auto mb-[var(--sp-10)]"
            style={{ color: "var(--color-label-2)" }}
          >
            Disponible pour des missions, stages et collaborations.
            Parlons de ton projet.
          </p>
          <div className="flex flex-wrap justify-center gap-[var(--sp-4)]">
            <Button
              variant="filled"
              size="large"
              icon={<ArrowRight size={18} strokeWidth={1.5} />}
            >
              Me contacter
            </Button>
            <a
              href="/"
              className="hig-body font-semibold flex items-center gap-[var(--sp-2)]"
              style={{
                color:      "#545457",
                transition: "opacity var(--dur-fast)",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Voir mes projets
              <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </section>


      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ backgroundColor: "#fff", borderTop: "1px solid #D2D2D7" }}>
        <div
          className="max-w-[var(--layout-xl)] mx-auto px-[var(--sp-5)]
                     py-[var(--sp-8)] flex flex-col sm:flex-row items-start
                     sm:items-center justify-between gap-[var(--sp-4)]"
        >
          <div>
            <p className="hig-caption2" style={{ color: "var(--color-label-2)" }}>
              © 2026 Anna V. · Product Designer
            </p>
            <p className="hig-caption2 mt-[2px]" style={{ color: "#636366" }}>
              Next.js 16 · Tailwind CSS v4 · Apple HIG Design System
            </p>
          </div>
          <nav
            className="flex items-center gap-[var(--sp-5)]"
            aria-label="Liens footer"
          >
            {([
              ["Accueil",  "/"],
              ["À propos", "/about"],
              ["GitHub",   "#"],
              ["LinkedIn", "#"],
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
