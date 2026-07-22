"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowUpRight,
  ChevronRight, Shield, Users, Target, Lightbulb, BarChart2, Bell,
} from "lucide-react";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

/* ── Design tokens ────────────────────────────────────────────── */
const SP     = [0.22, 1, 0.36, 1] as const;
const INK    = "var(--color-label)";
const INK2   = "var(--color-label-2)";
const INK3   = "var(--color-label-3)";
const BG     = "var(--color-bg-primary)";
const SURF   = "var(--color-bg-secondary)";
const BORD   = "var(--color-sep-opaque)";
const MONO   = "var(--font-mono)";
const ACCENT = "#A259FF";

/* ── GridCanvas (identique aux autres pages) ─────────────────── */
function GridCanvas({ sectionRef }: { sectionRef: React.RefObject<HTMLElement> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ripples   = useRef<{ x: number; y: number; r: number; a: number }[]>([]);
  const raf       = useRef(0);

  useEffect(() => {
    const canvas  = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d")!;
    const GAP = 48;
    let W = 0, H = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = section.offsetWidth; H = section.offsetHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(section);
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cols = Math.ceil(W / GAP), rows = Math.ceil(H / GAP);
      ctx.lineWidth = 0.5; ctx.strokeStyle = "rgba(0,0,0,0.045)";
      for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(c*GAP,0); ctx.lineTo(c*GAP,H); ctx.stroke(); }
      for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(0,r*GAP); ctx.lineTo(W,r*GAP); ctx.stroke(); }
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const x = c*GAP, y = r*GAP;
          let glow = 0;
          for (const rip of ripples.current) {
            const d = Math.hypot(x-rip.x, y-rip.y);
            const diff = Math.abs(d-rip.r);
            if (diff < 80) glow = Math.max(glow, (1-diff/80)*rip.a);
          }
          ctx.beginPath(); ctx.arc(x, y, 1.2+glow*3.2, 0, Math.PI*2);
          ctx.fillStyle = glow > 0.04
            ? `rgba(162,89,255,${(0.1+glow*0.75).toFixed(3)})`
            : "rgba(0,0,0,0.08)";
          ctx.fill();
        }
      }
      for (const rip of ripples.current) {
        ctx.beginPath(); ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI*2);
        ctx.strokeStyle = `rgba(162,89,255,${(rip.a*0.3).toFixed(3)})`; ctx.lineWidth = 1; ctx.stroke();
      }
      ripples.current = ripples.current.map(r=>({...r,r:r.r+4.5,a:r.a*0.962})).filter(r=>r.a>0.007);
      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.current.push({ x:e.clientX-rect.left, y:e.clientY-rect.top, r:0, a:1 });
    };
    section.addEventListener("click", onClick);
    return () => { cancelAnimationFrame(raf.current); ro.disconnect(); section.removeEventListener("click", onClick); };
  }, [sectionRef]);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      style={{ position:"absolute", inset:0, zIndex:-1, pointerEvents:"none", width:"100%", height:"100%" }} />
  );
}

/* ── PhoneFrame — cadre iOS ──────────────────────────────────── */
function PhoneFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div style={{
      borderRadius: 36, overflow: "hidden",
      boxShadow: "0 28px 64px rgba(162,89,255,0.18), 0 6px 20px rgba(0,0,0,0.12)",
      border: "8px solid #1A1A2E",
      background: "#1A1A2E",
      position: "relative",
      maxWidth: 260,
      margin: "0 auto",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: 80, height: 10, background: "#1A1A2E",
        borderRadius: "0 0 14px 14px", zIndex: 2,
      }} />
      <Image src={src} alt={alt} width={390} height={844}
        style={{ width: "100%", height: "auto", display: "block" }} priority />
    </div>
  );
}

/* ── Process phases ──────────────────────────────────────────── */
const PHASES = [
  { id:"01", label:"Recherche",  livrable:"Interviews · Benchmark Duolingo / Anki / Quizlet · Analyse des abandons" },
  { id:"02", label:"Définition", livrable:"Persona · User journey · Architecture de l'information · Flow de gamification" },
  { id:"03", label:"Idéation",   livrable:"Mécaniques d'engagement · Wireframes · Système de progression" },
  { id:"04", label:"Design",     livrable:"Maquettes iOS HIG · Design system · 5 écrans haute fidélité" },
  { id:"05", label:"Tests",      livrable:"Tests utilisateurs · Itérations · Bilan satisfaction" },
];

type PhaseItem = { n: string; t: string; s: string; c?: string };
function PhaseRows({ items }: { items: PhaseItem[] }) {
  return (
    <div>
      {items.map((m, i) => (
        <div key={m.n} style={{ display:"flex", gap:"var(--sp-4)", alignItems:"flex-start",
          paddingBottom:"var(--sp-4)", marginBottom:"var(--sp-4)",
          borderBottom: i < items.length - 1 ? `1px solid ${BORD}` : "none" }}>
          <span className="hig-caption2" style={{ fontWeight:700, color:m.c ?? ACCENT,
            fontFamily:MONO, flexShrink:0, minWidth:20 }}>{m.n}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{m.t}</p>
            <p className="hig-footnote" style={{ color: m.c ? INK3 : INK3, margin:0, fontWeight: m.c ? 600 : 400 }}>{m.s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProcessDiagram() {
  const [active, setActive] = useState("01");
  const activePhase = PHASES.find(p => p.id === active)!;

  const panels: Record<string, PhaseItem[]> = {
    "01": [
      { n:"01", t:"Interviews apprenants",      s:"6 entretiens avec des étudiants et professionnels en reconversion. Principaux points de douleur : ennui après quelques sessions, manque de visibilité sur les acquis, absence de motivation sociale." },
      { n:"02", t:"Benchmark concurrentiel",    s:"Duolingo (gamification forte), Anki (répétition espacée), Quizlet (flashcards). Analyse des mécaniques d'engagement et des taux de rétention à 30 jours." },
      { n:"03", t:"Analyse des abandons",       s:"73 % des utilisateurs abandonnent une app d'apprentissage dans les 7 premiers jours. Cause principale : absence de feedback immédiat et progression non visible." },
    ],
    "02": [
      { n:"01", t:"Persona principal",          s:"Apprenant autonome, 18-35 ans, réviseur de courte durée (5-15 min/jour). Cherche à progresser sans contrainte horaire, sensible à la compétition amicale." },
      { n:"02", t:"User journey",               s:"Découverte → Inscription → Premier cours → Quiz → Résultat → Classement → Retour quotidien. Chaque étape conçue pour limiter la friction et maximiser la récompense." },
      { n:"03", t:"Architecture de l'information", s:"4 zones : Accueil (hub), Cours (contenu), Stats (classement), Profil (paramètres + badge). Navigation par tab bar iOS standard." },
    ],
    "03": [
      { n:"01", t:"Mécaniques de gamification", s:"Jours de série (streak), badges par niveau, classement hebdomadaire/mensuel/tous temps. Chaque mécanique répond à un besoin motivationnel identifié en recherche." },
      { n:"02", t:"Système de progression",     s:"Barre de progression par module, leçons verrouillées débloquées séquentiellement, score en temps réel sur le quiz. Feedback immédiat à chaque réponse." },
      { n:"03", t:"Wireframes basse fidélité",  s:"5 écrans esquissés sur papier, validés avec 3 utilisateurs avant Figma. Ordre d'importance : quiz actif → détail cours → classement → profil → paramètres." },
    ],
    "04": [
      { n:"01", t:"Design system iOS HIG",     s:"Palette rose-violet, composants natifs iOS (tab bar, segmented control, toggles). Typographie SF Pro respectée, zones de touch cibles ≥ 44×44pt." },
      { n:"02", t:"5 écrans haute fidélité",   s:"Leçon active, détail de cours, profil, classement, paramètres. États intermédiaires documentés : chargement, réponse correcte/incorrecte, liste vide." },
      { n:"03", t:"Prototype interactif",      s:"Parcours complet testable sur Figma : de la sélection du cours jusqu'à la validation d'une réponse et la consultation du classement." },
    ],
    "05": [
      { n:"01", t:"Tests utilisateurs",        s:"5 participants, scénarios réels : compléter une leçon, consulter son rang, modifier les paramètres. Sessions de 20 min chacune." },
      { n:"02", t:"Retours prioritaires",      s:"Besoin d'un récapitulatif après chaque quiz, confusion sur les icônes de la tab bar, demande de mode hors ligne pour les révisions en déplacement." },
      { n:"03", t:"Itérations",               s:"Ajout d'un écran de résultat post-quiz, remplacement des icônes ambiguës par des labels permanents, indication de disponibilité hors ligne." },
      { n:"04", t:"Résultat",                 s:"Score de satisfaction moyen 4,4/5. 100 % des participants déclarent vouloir utiliser l'application au quotidien.", c:ACCENT },
    ],
  };

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", marginBottom:"var(--sp-6)" }}>
        {PHASES.map((p, i) => {
          const on = active === p.id;
          return (
            <div key={p.id} style={{ display:"flex", alignItems:"center", flex:1 }}>
              <motion.button onClick={() => setActive(p.id)}
                whileHover={{ scale:1.08 }} whileTap={{ scale:0.95 }}
                transition={{ duration:0.18, ease:SP }}
                style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10,
                  flex:1, background:"none", border:"none", cursor:"pointer", padding:"4px 0" }}>
                <motion.div
                  animate={{ boxShadow: on ? `0 4px 20px ${ACCENT}40` : "var(--shadow-sm)" }}
                  transition={{ duration:0.25 }}
                  style={{ width:48, height:48, borderRadius:"50%", flexShrink:0,
                    background: on ? ACCENT : BG, border:`2px solid ${on ? ACCENT : BORD}`,
                    display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                  {on && (
                    <motion.div initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
                      style={{ position:"absolute", inset:-6, borderRadius:"50%",
                        border:`1.5px solid ${ACCENT}`, opacity:0.25 }} />
                  )}
                  <span className="hig-caption1" style={{ fontWeight:800, fontFamily:MONO,
                    color: on ? "#fff" : INK3, letterSpacing:"0.04em" }}>{p.id}</span>
                </motion.div>
                <span className="hig-caption1" style={{ fontWeight: on ? 700 : 500,
                  color: on ? ACCENT : INK2, transition:"color 200ms" }}>{p.label}</span>
              </motion.button>
              {i < PHASES.length - 1 && (
                <div style={{ height:1, width:32, flexShrink:0, marginBottom:28, background:BORD }} />
              )}
            </div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0, y:-8 }} transition={{ duration:0.22, ease:SP }}>
          <div className="mat-regular" style={{ borderRadius:"var(--r-xl) var(--r-xl) 0 0",
            border:`1px solid rgba(255,255,255,0.45)`, borderBottom:"none",
            padding:"14px var(--sp-6)", display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:ACCENT, flexShrink:0 }} />
            <span className="hig-callout" style={{ fontWeight:500, color:INK }}>{activePhase.label}</span>
            <span className="hig-footnote" style={{ color:INK3, marginLeft:4 }}>{activePhase.livrable}</span>
          </div>
          <div className="mat-regular" style={{ border:`1px solid rgba(255,255,255,0.45)`,
            borderTop:"none", borderRadius:`0 0 var(--r-xl) var(--r-xl)`, padding:"var(--sp-6)" }}>
            <PhaseRows items={panels[active]} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ── Focus screens ───────────────────────────────────────────── */
function FocusList({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div>
      {items.map((o, i) => (
        <div key={i} style={{ display:"flex", gap:10, marginBottom:"var(--sp-2)" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:ACCENT, flexShrink:0, marginTop:6 }} />
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 2px" }}>{o.t}</p>
            <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{o.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FocusQuiz() {
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)", alignItems:"center" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          L&apos;écran central de l&apos;application. Chaque question est présentée dans une carte épurée,
          les réponses validées instantanément avec un feedback visuel immédiat.
        </p>
        <FocusList items={[
          { t:"Progression en temps réel",    d:"Indicateur «Q3/10» et barre de complétion en haut de l'écran, visible sans effort." },
          { t:"Réponse unique mise en valeur", d:"Bordure rose et coche sur l'option sélectionnée, conformité iOS HIG pour les radio buttons." },
          { t:"CTA persistant",               d:"Bouton «Valider la réponse» toujours visible, pas de scroll pour valider." },
          { t:"Contexte utilisateur",         d:"Avatar et nom visibles en en-tête pour renforcer la personnalisation et le sentiment d'appartenance." },
        ]} />
      </div>
      <PhoneFrame src="/revision/lesson-active.png" alt="Leçon active — Quiz" />
    </div>
  );
}

function FocusCours() {
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)", alignItems:"center" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          La vue module donne à l&apos;apprenant une vision claire de sa progression et du chemin restant.
          Les leçons se débloquent séquentiellement pour maintenir la cohérence pédagogique.
        </p>
        <FocusList items={[
          { t:"Progression globale visible",   d:"Barre de complétion et pourcentage affiché dès l'entrée dans le module (65 %)." },
          { t:"Statuts de leçon lisibles",     d:"✓ vert (complétée), ▶ bleu (en cours), 🔒 (verrouillée) : encodage couleur immédiat." },
          { t:"CTA contextuel",                d:"«Continuer le module» relance exactement là où l'apprenant s'est arrêté." },
          { t:"Badge de catégorie",            d:"«VOCABULAIRE» en rose en tête de section pour ancrer le contexte pédagogique." },
        ]} />
      </div>
      <PhoneFrame src="/revision/course-detail.png" alt="Détail du cours" />
    </div>
  );
}

function FocusSocial() {
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)", alignItems:"center" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          Le classement est la mécanique sociale clé de l&apos;application. Le podium met en scène
          la compétition amicale et motive le retour quotidien pour grimper dans le classement.
        </p>
        <FocusList items={[
          { t:"Podium visuel",                d:"Les 3 premiers affichés avec avatars et positions, rendant le classement immédiatement lisible." },
          { t:"Filtres temporels",            d:"Semaine / Mois / Tous : l'apprenant peut suivre sa progression à différentes échelles de temps." },
          { t:"Position personnelle visible", d:"«Moi (Ethan)» identifié visuellement dans la liste, pas besoin de chercher son rang." },
          { t:"Scores comparatifs",           d:"Pourcentages affichés pour chaque participant, donnant une idée de l'écart à combler." },
        ]} />
      </div>
      <PhoneFrame src="/revision/leaderboard.png" alt="Classement" />
    </div>
  );
}

function FocusProfil() {
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)", alignItems:"center" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          Le profil regroupe les indicateurs de performance personnels et les récompenses débloquées.
          Il renforce le sentiment d&apos;accomplissement et encourage la fidélité à l&apos;application.
        </p>
        <FocusList items={[
          { t:"Métriques d'engagement",       d:"Cours suivis, temps d'étude total, jours de série : trois indicateurs clés en un coup d'œil." },
          { t:"Système de badges",            d:"Pionnier, Sniper, Sérieux : badges gagnés débloquent des récompenses visibles et partageables." },
          { t:"Niveau affiché",               d:"«Niveau 12 · Apprenant» en sous-titre de la page : progression continue et gratifiante." },
          { t:"Paramètres intégrés",          d:"Notifications, rappels, langue et mode sombre accessibles depuis la vue Paramètres dédiée." },
        ]} />
      </div>
      <PhoneFrame src="/revision/profile.png" alt="Mon profil" />
    </div>
  );
}

function FocusPagesSection() {
  const [active, setActive] = useState("quiz");
  return (
    <div>
      <div style={{ marginBottom:"var(--sp-5)" }}>
        <SegmentedControl
          segments={[
            { label:"Leçon · Quiz",      value:"quiz"    },
            { label:"Cours",             value:"cours"   },
            { label:"Classement",        value:"social"  },
            { label:"Profil",            value:"profil"  },
          ]}
          value={active}
          onChange={setActive}
          aria-label="Écrans de l'application"
        />
      </div>
      <Card variant="elevated" radius="r-xl" padding="lg">
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"var(--sp-5)" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:ACCENT }} />
          <span className="hig-caption2" style={{ fontWeight:700, color:ACCENT, letterSpacing:"0.12em",
            textTransform:"uppercase" as const, fontFamily:MONO }}>
            {active === "quiz" ? "Leçon active · Quiz"
              : active === "cours" ? "Détail du cours"
              : active === "social" ? "Classement"
              : "Mon profil"}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-6 }} transition={{ duration:0.2, ease:SP }}>
            {active === "quiz"   && <FocusQuiz />}
            {active === "cours"  && <FocusCours />}
            {active === "social" && <FocusSocial />}
            {active === "profil" && <FocusProfil />}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function RevisionPage() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <div style={{ fontFamily:"var(--font-inter, var(--font-sans))",
      backgroundColor:BG, color:INK, colorScheme:"light" }}>
      <PortfolioHeader />
      <div style={{ paddingTop:60 }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section ref={heroRef as React.RefObject<HTMLElement>}
          style={{ backgroundColor:BG, borderBottom:`1px solid ${BORD}`,
            padding:"80px 32px 72px", position:"relative", isolation:"isolate",
            overflow:"hidden", cursor:"crosshair" }}>
          <GridCanvas sectionRef={heroRef as React.RefObject<HTMLElement>} />
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <div className="cs-hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:64, alignItems:"center" }}>

              <div>
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                  transition={{ delay:0.05, duration:0.5 }}
                  style={{ display:"flex", alignItems:"center", gap:6, marginBottom:"var(--sp-5)" }}>
                  <Link href="/" className="hig-footnote" style={{ color:INK3, textDecoration:"none" }}>Accueil</Link>
                  <ChevronRight size={11} style={{ color:INK3 }} />
                  <Link href="/#work" className="hig-footnote" style={{ color:INK3, textDecoration:"none" }}>Projets</Link>
                  <ChevronRight size={11} style={{ color:INK3 }} />
                  <span className="hig-footnote" style={{ color:INK, fontWeight:600 }}>App Révision</span>
                </motion.div>

                <h1 style={{ fontSize:"clamp(40px,5.5vw,72px)", fontWeight:200,
                  lineHeight:1.0, letterSpacing:"-0.02em", color:INK, margin:"0 0 14px" }}>
                  {["App Révision", "tous niveaux."].map((w, i) => (
                    <motion.span key={i}
                      initial={{ opacity:0, y:24, filter:"blur(5px)" }}
                      animate={{ opacity:1, y:0, filter:"blur(0px)" }}
                      transition={{ delay:0.16+i*0.12, duration:0.72, ease:SP }}
                      style={{ display:"block" }}>
                      {w}
                    </motion.span>
                  ))}
                </h1>

                <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.52, duration:0.6, ease:SP }}
                  style={{ fontSize:"clamp(17px,2.4vw,26px)", fontWeight:300,
                    color:ACCENT, letterSpacing:"-0.01em", marginBottom:24 }}>
                  Une expérience d&apos;apprentissage gamifiée.
                </motion.p>

                <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.68, duration:0.6, ease:SP }}
                  style={{ fontSize:16, color:INK2, lineHeight:1.75, maxWidth:480, marginBottom:36 }}>
                  Application iOS conçue pour s&apos;adapter à tous les niveaux.
                  Quiz adaptatifs, progression par module, classements entre pairs
                  et suivi de performance pour ancrer les habitudes d&apos;apprentissage.
                </motion.p>

                <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.85, duration:0.6, ease:SP }}
                  style={{ display:"flex", flexWrap:"wrap", gap:"var(--sp-2)" }}>
                  {["iOS Design", "UX Research", "Gamification", "React Native", "Figma"].map(t => (
                    <span key={t} className="badge-neutral hig-caption2"
                      style={{ display:"inline-flex", alignItems:"center",
                        padding:"4px 12px", borderRadius:"var(--r-full)", fontWeight:500 }}>{t}</span>
                  ))}
                </motion.div>
              </div>

              {/* Phone hero */}
              <motion.div initial={{ opacity:0, y:30, scale:0.97 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ delay:0.4, duration:0.9, ease:SP }}>
                <motion.div whileHover={{ y:-6 }} transition={{ duration:0.35, ease:SP }}
                  style={{ transform:"perspective(1200px) rotateY(-4deg) rotateX(2deg)" }}>
                  <PhoneFrame src="/revision/lesson-active.png" alt="Leçon active" />
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── INFO STRIP ──────────────────────────────────────────── */}
        <section style={{ borderBottom:`1px solid ${BORD}`, background:SURF }}>
          <div className="cs-info-strip" style={{ maxWidth:1160, margin:"0 auto", padding:"0 32px",
            display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {[
              { label:"Secteur",   value:"Éducation · Mobile" },
              { label:"Mon rôle",  value:"UX/UI Designer iOS" },
              { label:"Durée",     value:"3 mois"             },
              { label:"Livrables", value:"5 écrans iOS"       },
            ].map((p, i) => (
              <div key={p.label} style={{ padding:"22px var(--sp-6)",
                borderRight: i < 3 ? `1px solid ${BORD}` : "none" }}>
                <p className="hig-caption2" style={{ fontWeight:700, color:ACCENT,
                  letterSpacing:"0.14em", textTransform:"uppercase" as const,
                  fontFamily:MONO, margin:"0 0 6px" }}>{p.label}</p>
                <p className="hig-title3" style={{ fontWeight:300, color:INK, margin:0 }}>{p.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTEXTE & CONTRAINTES ──────────────────────────────── */}
        <section style={{ backgroundColor:SURF, borderBottom:`1px solid ${BORD}`, padding:"80px var(--sp-8)" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>

            <Reveal>
              <div className="cs-context-grid" style={{ display:"grid", gridTemplateColumns:"5fr 4fr",
                gap:"var(--sp-12)", alignItems:"flex-start", marginBottom:"var(--sp-10)" }}>
                <div>
                  <Badge color="purple" size="sm" className="mb-4">Contexte &amp; Enjeux</Badge>
                  <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300,
                    letterSpacing:"-0.02em", color:INK, lineHeight:1.1, margin:0 }}>
                    Apprendre régulièrement, sans se forcer.
                  </h2>
                </div>
                <div style={{ paddingTop:"var(--sp-8)" }}>
                  <p className="hig-body" style={{ color:INK2, margin:0 }}>
                    Les applications de révision existantes peinent à maintenir l&apos;engagement au-delà
                    de quelques sessions. L&apos;enjeu : concevoir une application qui transforme la révision
                    en habitude quotidienne grâce à la gamification, sans sacrifier l&apos;efficacité
                    pédagogique ni la lisibilité iOS.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"var(--sp-4)" }}>
                {[
                  { tag:"Constat 1", t:"73 % d'abandon dans les 7 premiers jours",
                    d:"Les apprenants décrochent faute de feedback immédiat et de progression visible. Pas de signal de récompense, pas de raison de revenir.", accent:false },
                  { tag:"Constat 2", t:"Manque de dimension sociale",
                    d:"Les applications existantes sont des expériences solo. L'absence de comparaison avec les pairs supprime un levier motivationnel majeur.", accent:false },
                  { tag:"Constat 3", t:"Interfaces surchargées ou trop austères",
                    d:"Duolingo surcharge de notifications, Anki est perçu comme trop technique. Aucun acteur ne cible le juste milieu pour l'apprenant autonome.", accent:false },
                  { tag:"Objectif", t:"Gamifier sans distraire",
                    d:"Concevoir une interface iOS native qui maximise l'engagement quotidien par des mécaniques de progression, de compétition et de récompense claires.", accent:true },
                ].map(({ tag, t, d, accent }) => (
                  <motion.div key={t} whileHover={{ y:-3 }} transition={{ duration:0.22, ease:SP }}>
                    <Card variant={accent ? "elevated" : "outlined"} radius="r-xl" padding="lg" interactive>
                      <Badge color={accent ? "purple" : "neutral"} size="sm" className="mb-3">{tag}</Badge>
                      <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 6px" }}>{t}</p>
                      <p className="hig-footnote" style={{ color:INK2, margin:0 }}>{d}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div style={{ position:"relative", display:"flex", alignItems:"center", margin:"var(--sp-6) 0" }}>
                <div style={{ flex:1, height:1, background:BORD }} />
                <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)",
                  display:"flex", alignItems:"center", gap:"var(--sp-2)",
                  background:BG, border:`1px solid ${BORD}`, borderRadius:"var(--r-full)",
                  padding:"var(--sp-1) var(--sp-3) var(--sp-1) var(--sp-2)" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:ACCENT, flexShrink:0 }} />
                  <span className="hig-caption2" style={{ color:INK3, fontFamily:MONO,
                    letterSpacing:"0.08em", whiteSpace:"nowrap" as const }}>les contraintes</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="cs-three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"var(--sp-3)" }}>
                {[
                  { icon:<Shield size={13}/>,     t:"iOS Human Interface Guidelines", d:"Composants natifs, zones de touch ≥ 44pt, typographie SF Pro, dark mode anticipé." },
                  { icon:<Users size={13}/>,      t:"Tous niveaux",                   d:"Interface adaptée du débutant complet à l'expert : difficulté progressive, jamais bloquante." },
                  { icon:<Target size={13}/>,     t:"Engagement long terme",          d:"Mécaniques de streak, badges et classement conçus pour motiver le retour à J+7, J+30." },
                  { icon:<Lightbulb size={13}/>,  t:"Feedback immédiat",              d:"Validation de réponse en temps réel, score affiché à chaque étape, pas d'écran de résultat caché." },
                  { icon:<BarChart2 size={13}/>,  t:"Progression visible",            d:"Barre de complétion par module, pourcentage global, indicateur de leçon active vs verrouillée." },
                  { icon:<Bell size={13}/>,       t:"Rappels non intrusifs",          d:"Notifications quotidiennes paramétrables, rappels de streak uniquement si la série risque de se briser." },
                ].map((c, i) => (
                  <motion.div key={i} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.3+i*0.06, duration:0.5, ease:SP }} whileHover={{ y:-2 }}>
                    <Card variant="filled" radius="r-lg" padding="sm">
                      <div style={{ display:"flex", alignItems:"flex-start", gap:"var(--sp-2)" }}>
                        <div style={{ color:INK3, flexShrink:0, marginTop:2 }}>{c.icon}</div>
                        <div>
                          <p className="hig-caption1" style={{ fontWeight:600, color:INK, margin:"0 0 var(--sp-1)" }}>{c.t}</p>
                          <p className="hig-caption2" style={{ color:INK3, margin:0 }}>{c.d}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </Reveal>

          </div>
        </section>

        {/* ── PROCESS UX ──────────────────────────────────────────── */}
        <section style={{ backgroundColor:BG, borderBottom:`1px solid ${BORD}`, padding:"88px 32px" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">Process UX</Badge>
              <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300,
                letterSpacing:"-0.02em", color:INK, marginBottom:14, lineHeight:1.1 }}>
                5 phases, de la recherche utilisateur au prototype testé.
              </h2>
              <p className="hig-body" style={{ color:INK2, maxWidth:520, marginBottom:"var(--sp-10)" }}>
                Cliquez sur une phase pour explorer les livrables, les méthodes et les décisions associées.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <ProcessDiagram />
            </Reveal>
          </div>
        </section>

        {/* ── ÉCRANS CLÉS ─────────────────────────────────────────── */}
        <section style={{ backgroundColor:SURF, borderBottom:`1px solid ${BORD}`, padding:"80px 32px" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">Écrans clés</Badge>
              <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300,
                letterSpacing:"-0.02em", color:INK, marginBottom:14, lineHeight:1.1 }}>
                Chaque écran, une intention UX précise.
              </h2>
              <p className="hig-body" style={{ color:INK2, maxWidth:540, marginBottom:"var(--sp-10)" }}>
                4 vues principales, 4 moments distincts dans le parcours apprenant.
                Naviguez entre les écrans pour explorer les décisions de design.
              </p>
            </Reveal>
            <Reveal delay={60}>
              <FocusPagesSection />
            </Reveal>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section style={{ backgroundColor:BG, padding:"100px 32px" }}>
          <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" as const }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-7">App Révision · iOS Design</Badge>
              <h2 style={{ fontSize:"clamp(32px,5vw,60px)", fontWeight:200,
                lineHeight:1.0, letterSpacing:"-0.02em", color:INK, marginBottom:16 }}>
                Un apprentissage<br />
                <span style={{ color:ACCENT }}>qui crée l&apos;habitude.</span>
              </h2>
              <p style={{ fontSize:16, color:INK2, lineHeight:1.75,
                maxWidth:460, margin:"0 auto 44px" }}>
                5 écrans conçus selon les Apple Human Interface Guidelines pour une expérience
                native, intuitive et engageante. Score de satisfaction 4,4/5 en tests utilisateurs.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <Button variant="filled" size="large" color="purple"
                onClick={() => window.open("/#work", "_self")}
                icon={<ArrowUpRight size={15} />}>
                Voir tous les projets
              </Button>
            </Reveal>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────── */}
        <footer style={{ backgroundColor:SURF, borderTop:`1px solid ${BORD}`, padding:"36px 32px" }}>
          <div style={{ maxWidth:1160, margin:"0 auto",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            flexWrap:"wrap", gap:16 }}>
            <p style={{ fontSize:13, color:INK3, margin:0 }}>Projet académique · 2024</p>
            <Link href="/" style={{ fontSize:13, color:INK2, textDecoration:"none",
              display:"flex", alignItems:"center", gap:6 }}>
              <ArrowLeft size={13} strokeWidth={1.5} /> Retour au portfolio
            </Link>
            <p style={{ fontSize:13, color:INK3, margin:0 }}>iOS Design · React Native · Figma</p>
          </div>
        </footer>

      </div>
    </div>
  );
}
