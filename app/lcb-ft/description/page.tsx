"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, ExternalLink,
  Shield, Database, Clock,
  Users, FileText, Target, Lock, AlertTriangle,
} from "lucide-react";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import _C from "@/data/content.json";
const C = _C.lcbft;
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { CaseBreadcrumb, CaseContactFooter } from "@/components/ui";
import { ProcessFrise } from "@/components/ui/ProcessFrise";
import type { FrisePhase } from "@/components/ui/ProcessFrise";

/* ── Design tokens ────────────────────────────────────────────── */
const SP      = [0.22, 1, 0.36, 1] as const;
const INK     = "var(--color-label)";
const INK2    = "var(--color-label-2)";
const INK3    = "var(--color-label-3)";
const BG      = "var(--color-bg-primary)";
const SURF    = "var(--color-bg-secondary)";
const BORD    = "var(--color-sep-opaque)";
const MONO    = "var(--font-mono)";
const VIO  = "#A259FF";
const VIO_L = "#F5EEFF";

/* ── MacOS Browser Frame ─────────────────────────────────────── */
function MacFrame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 14, overflow: "hidden",
      boxShadow: "0 24px 64px rgba(0,0,0,0.13), 0 4px 16px rgba(0,0,0,0.07)",
      border: `1px solid ${BORD}` }}>
      <div style={{ height: 36, background: "#EBEBEB",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        display: "flex", alignItems: "center", padding: "0 14px" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {[{f:"#FF5F57",s:"#E0443E"},{f:"#FFBD2E",s:"#DEA123"},{f:"#28C840",s:"#1DAD2B"}]
            .map(({f,s},i) => (
              <div key={i} style={{ width:12, height:12, borderRadius:"50%",
                background:f, boxShadow:`0 0 0 0.5px ${s}` }} />
            ))}
        </div>
        <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
          <div className="mac-url-bar" style={{ padding:"2px 14px", background:"rgba(255,255,255,0.88)",
            border:"1px solid rgba(0,0,0,0.10)", borderRadius:6,
            display:"flex", alignItems:"center" }}>
            <span style={{ fontFamily:"monospace", fontSize:11, color:"rgba(0,0,0,0.38)" }}>
              sentinelle.app
            </span>
          </div>
        </div>
        <div style={{ width:60 }} />
      </div>
      <div style={{ lineHeight:0 }}>{children}</div>
    </div>
  );
}

/* ── Phases Process ──────────────────────────────────────────── */
const PHASES = [
  { id:"01", label:"Recherche",  livrable:"Interviews compliance officers · Audit réglementaire · Benchmark outils LCB-FT" },
  { id:"02", label:"Définition", livrable:"Flux de traitement alertes · Architecture information · 4 profils utilisateurs" },
  { id:"03", label:"Idéation",   livrable:"Design system · Encodage couleur risque · Workflow alertes · Composants clés" },
  { id:"04", label:"Design",     livrable:"Wireframes · Maquettes haute fidélité · Prototype interactif · Design system" },
  { id:"05", label:"Tests",      livrable:"Tests utilisateurs · Retours compliance · Itérations · Bilan impact" },
];

type PhaseItem = { n:string; t:string; s:string; c?:string };
function PhaseRows({ items }: { items: PhaseItem[] }) {
  return (
    <div>
      {items.map((m, i) => (
        <div key={m.n} style={{ display:"flex", gap:"var(--sp-4)", alignItems:"flex-start",
          paddingBottom:"var(--sp-4)", marginBottom:"var(--sp-4)",
          borderBottom: i < items.length - 1 ? `1px solid ${BORD}` : "none" }}>
          <span className="hig-caption2" style={{ fontWeight:700, color:m.c??VIO,
            fontFamily:MONO, flexShrink:0, minWidth:20 }}>{m.n}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{m.t}</p>
            <p className="hig-footnote" style={{ color:m.c??INK3, margin:0,
              fontWeight:m.c?600:400 }}>{m.s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProcessDiagram() {
  const panels: Record<string, PhaseItem[]> = {
    "01": [
      { n:"01", t:"Interviews utilisateurs",     s:"5 entretiens avec des compliance officers et analystes LAB-FT. Identification des pain points : alertes sans contexte, audit trail manuel, surcharge cognitive." },
      { n:"02", t:"Audit réglementaire",          s:"Étude des exigences ACPR et TRACFIN. Délais de traitement imposés, documentation obligatoire de chaque décision, archivage 5 ans." },
      { n:"03", t:"Benchmark outils existants",   s:"Actimize, NICE Actimize, Firco. Outils puissants mais interfaces complexes, courbes d'apprentissage longues, peu orientés UX analyste." },
      { n:"04", t:"Synthèse",                     s:"Opportunité claire : simplifier sans sacrifier la rigueur réglementaire. Les analystes veulent de la clarté, pas de la complexité." },
    ],
    "02": [
      { n:"01", t:"Architecture information",      s:"4 niveaux : dashboard → alertes → règles de détection → listes de référence. Un niveau = une intention utilisateur distincte." },
      { n:"02", t:"Profils utilisateurs",          s:"Analyste (traitement), superviseur (pilotage), compliance officer (validation), administrateur (configuration). Droits cloisonnés." },
      { n:"03", t:"Périmètre livrable",            s:"Dashboard analytique, gestion des alertes, règles de détection, listes PEP/sanctions. Audit trail intégré à chaque niveau." },
    ],
    "03": [
      { n:"01", t:"Design system sobre",          s:"Palette violet (Sentinelle) + gris neutres. Interface professionnelle, pas de couleurs distrayantes. La couleur est réservée à l'information critique." },
      { n:"02", t:"Encodage couleur risque",       s:"Critique (rouge), Fort (orange), Moyen (jaune), Faible (vert). Chaque niveau de risque lisible en un coup d'œil, sans lire le score." },
      { n:"03", t:"Workflow alertes",              s:"Ouverte → En cours → Examen renforcé / Clôturée. Chaque transition enregistrée automatiquement dans le journal d'audit." },
      { n:"04", t:"Composants prioritaires",       s:"KPI cards, barres de performance, tableau d'alertes dense, donut de risque. Densité maximale avec lisibilité maintenue." },
    ],
    "04": [
      { n:"01", t:"Wireframes flux complets",      s:"Parcours de traitement alerte de bout en bout, vue superviseur, configuration règle. Validés avec 2 compliance officers avant la maquette." },
      { n:"02", t:"Maquettes haute fidélité",      s:"Dashboard, table alertes, fiche alerte détaillée, règles de détection. États vides, états d'erreur, états de chargement documentés." },
      { n:"03", t:"Prototype interactif",          s:"Parcours complet traitement alerte : ouverture, assignation, investigation, clôture avec motif. Testable sans code." },
    ],
    "05": [
      { n:"01", t:"Tests utilisateurs",            s:"3 compliance officers, 2 analystes junior. Scénarios réels : traitement d'une alerte critique, recherche d'un client, clôture avec motif." },
      { n:"02", t:"Retours prioritaires",          s:"Manque de réassurance sur les clôtures irréversibles. Besoin d'un résumé contextuel avant de valider une décision de soupçon." },
      { n:"03", t:"Itérations",                    s:"Ajout de modales de confirmation, amélioration du tri par risque, enrichissement de la fiche alerte avec l'historique client." },
      { n:"04", t:"Résultat",                      s:"Temps moyen de traitement estimé à 5 min par alerte vs 30 min avec les processus Excel. Conformité audit trail atteinte.", c:VIO },
    ],
  };

  return (
    <ProcessFrise
      phases={PHASES}
      renderPanel={(id) => <PhaseRows items={panels[id]} />}
    />
  );
}

/* ── Focus pages ─────────────────────────────────────────────── */
function FocusList({ items }: { items: { t:string; d:string }[] }) {
  return (
    <div>
      {items.map((o, i) => (
        <div key={i} style={{ display:"flex", gap:10, marginBottom:"var(--sp-2)" }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:VIO, flexShrink:0, marginTop:6 }} />
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 2px" }}>{o.t}</p>
            <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{o.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const FOCUS_ITEMS_DASHBOARD = [
  { t:"4 KPIs temps réel",              d:"Alertes en cours, clôturées, en retard, délai moyen. Un seul coup d'œil pour piloter l'activité compliance." },
  { t:"Performance des règles",         d:"Taux de faux positifs par règle, nombre d'alertes déclenchées. Identifier les règles à recalibrer en un instant." },
  { t:"Règle × statut",                 d:"Graphique groupé pour visualiser la répartition (clôturée, en cours, examen renforcé, soupçon) par règle." },
  { t:"Charge par analyste",            d:"Vue superviseur pour répartir la charge de travail entre analystes et éviter les embouteillages." },
  { t:"Personnalisation et filtres",    d:"Filtre par période, vue par mois/semaine. Dashboard adaptable à chaque profil utilisateur." },
];

const FOCUS_ITEMS_ALERTES = [
  { t:"Score de risque coloré",         d:"Critique (rouge), Fort (orange), Moyen (jaune) : encodage couleur immédiat, sans lire le score numérique." },
  { t:"Statuts clairs et actionnables", d:"En cours, Ouverte, Clôturée : chaque statut traduit l'état du traitement, navigable en un clic." },
  { t:"Notifications proactives",       d:"3 types d'alertes système : alertes en attente +48h, backtesting prêt, nouvelles typologies GAFI publiées." },
  { t:"Table dense et lisible",         d:"6 colonnes : ID, score, entité, type, montant, statut. Densité maximale sans sacrifier la lisibilité." },
  { t:"Audit trail intégré",            d:"Chaque action (ouverture, assignation, clôture) horodatée automatiquement. Conformité ACPR garantie." },
];

const FOCUS_ITEMS_RISQUE = [
  { t:"Risque client : vue globale",    d:"Donut chart : répartition Élevé / Standard / Faible. Identifier en un instant la composition du portefeuille de risque." },
  { t:"Motifs de clôture",             d:"Classée sans suite, Examen renforcé, Erreur, Soupçon LAB-FT. Détecter les dérives et ajuster les règles." },
  { t:"Alertes par MCC",               d:"Top 5 codes MCC déclencheurs. Repérer les secteurs d'activité les plus exposés au risque de fraude." },
  { t:"Analyse multi-sources",         d:"Données consolidées de plusieurs sources (core banking, SWIFT, transactions) en une vue unifiée." },
  { t:"Export conforme ACPR",          d:"Rapports exportables pour les contrôles ACPR et les déclarations TRACFIN. Aucune ressaisie manuelle." },
];

function FocusDashboard({ onOpen }: { onOpen: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          La vue centrale de Sentinelle. Toute l&apos;activité compliance accessible en un coup d&apos;œil, sans navigation supplémentaire.
        </p>
        <FocusList items={FOCUS_ITEMS_DASHBOARD} />
      </div>
      <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        whileHover={{ y:-4 }} transition={{ duration:0.28, ease:SP }}
        className="cs-desktop-preview">
        <MacFrame>
          <div className="cs-iframe-wrap" style={{ position:"relative", overflow:"hidden", height:300 }}>
            <iframe src="/lcb-ft"
              style={{ width:"222%", height:667, transform:"scale(0.45)", transformOrigin:"top left",
                border:"none", pointerEvents:"none" }} />
            <AnimatePresence>
              {hov && (
                <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
                    display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                  <button onClick={onOpen} className="hig-subhead"
                    style={{ fontWeight:500, color:"#FAFAFA", display:"inline-flex", alignItems:"center",
                      gap:6, background:"none", border:"none", cursor:"pointer", padding:0 }}>
                    Ouvrir le dashboard <ArrowUpRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MacFrame>
      </motion.div>
    </div>
  );
}

function FocusAlertes({ onOpen }: { onOpen: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          Le cœur opérationnel de Sentinelle. Les analystes passent la majorité de leur temps ici : chaque micro-décision de design compte.
        </p>
        <FocusList items={FOCUS_ITEMS_ALERTES} />
      </div>
      <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        whileHover={{ y:-4 }} transition={{ duration:0.28, ease:SP }}
        className="cs-desktop-preview">
        <MacFrame>
          <div className="cs-iframe-wrap" style={{ position:"relative", overflow:"hidden", height:300 }}>
            <iframe src="/lcb-ft"
              style={{ width:"222%", height:667, transform:"scale(0.45)", transformOrigin:"top left",
                border:"none", pointerEvents:"none" }} />
            <AnimatePresence>
              {hov && (
                <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
                    display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                  <button onClick={onOpen} className="hig-subhead"
                    style={{ fontWeight:500, color:"#FAFAFA", display:"inline-flex", alignItems:"center",
                      gap:6, background:"none", border:"none", cursor:"pointer", padding:0 }}>
                    Ouvrir le dashboard <ArrowUpRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MacFrame>
      </motion.div>
    </div>
  );
}

function FocusRisque({ onOpen }: { onOpen: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          La vue analytique pour piloter la conformité à haut niveau. Superviseurs et compliance officers y trouvent les signaux faibles.
        </p>
        <FocusList items={FOCUS_ITEMS_RISQUE} />
      </div>
      <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        whileHover={{ y:-4 }} transition={{ duration:0.28, ease:SP }}
        className="cs-desktop-preview">
        <MacFrame>
          <div className="cs-iframe-wrap" style={{ position:"relative", overflow:"hidden", height:300 }}>
            <iframe src="/lcb-ft"
              style={{ width:"222%", height:667, transform:"scale(0.45)", transformOrigin:"top left",
                border:"none", pointerEvents:"none" }} />
            <AnimatePresence>
              {hov && (
                <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
                    display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                  <button onClick={onOpen} className="hig-subhead"
                    style={{ fontWeight:500, color:"#FAFAFA", display:"inline-flex", alignItems:"center",
                      gap:6, background:"none", border:"none", cursor:"pointer", padding:0 }}>
                    Ouvrir le dashboard <ArrowUpRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MacFrame>
      </motion.div>
    </div>
  );
}

const FOCUS_TABS = [
  { id:"dashboard", label:"Tableau de bord"     },
  { id:"alertes",   label:"Gestion des alertes" },
  { id:"risque",    label:"Analyse du risque"   },
];

function FocusPagesSection({ onOpen }: { onOpen: () => void }) {
  const [active, setActive] = useState("dashboard");
  return (
    <div>
      <div style={{
        display:"inline-flex", background:"var(--color-bg-secondary)",
        borderRadius:"var(--r-lg)", padding:3,
        border:`1px solid ${BORD}`, marginBottom:"var(--sp-5)",
      }}>
        {FOCUS_TABS.map(t => (
          <motion.button key={t.id} onClick={() => setActive(t.id)}
            whileTap={{ scale:0.97 }}
            transition={{ duration:0.15, ease:SP }}
            className="hig-footnote"
            style={{
              padding:"6px 18px", borderRadius:"var(--r-md)",
              fontWeight:active===t.id?600:400, cursor:"pointer", border:"none",
              background:active===t.id?BG:"transparent",
              color:active===t.id?INK:INK3,
              boxShadow:active===t.id?"0 1px 4px rgba(0,0,0,0.10), 0 0.5px 1px rgba(0,0,0,0.06)":"none",
              transition:"color 150ms, background 150ms, box-shadow 150ms",
              letterSpacing:"var(--ls-title2)", whiteSpace:"nowrap",
            }}>{t.label}</motion.button>
        ))}
      </div>
      <div style={{ background:BG, border:`1px solid ${BORD}`, borderRadius:"var(--r-xl)",
        padding:"var(--sp-6)", position:"relative" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:"var(--sp-5)" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:VIO }} />
          <span className="hig-caption2" style={{ fontWeight:700, color:VIO, letterSpacing:"0.12em",
            textTransform:"uppercase" as const, fontFamily:MONO }}>
            {FOCUS_TABS.find(t => t.id === active)?.label}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-6 }} transition={{ duration:0.2, ease:SP }}>
            {active === "dashboard" && <FocusDashboard onOpen={onOpen} />}
            {active === "alertes"   && <FocusAlertes   onOpen={onOpen} />}
            {active === "risque"    && <FocusRisque    onOpen={onOpen} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Stat block ──────────────────────────────────────────────── */
/* ==============================================================
   PAGE
   ============================================================== */
export default function LcbFtDescriptionPage() {
  const [previewHov, setPreviewHov] = useState(false);

  const openDashboard = () => window.open("/lcb-ft", "_blank");

  return (
    <div style={{ fontFamily:"var(--font-inter, var(--font-sans))",
      backgroundColor:BG, color:INK, colorScheme:"light" }}>
      <PortfolioHeader />
      <div style={{ paddingTop:60 }}>

        {/* ── HERO ─────────────────────────────────────────────────── */}
        <section style={{ backgroundColor:BG, borderBottom:`1px solid ${BORD}`,
          padding:"var(--sp-20) var(--sp-8) 72px", position:"relative", isolation:"isolate",
          overflow:"hidden" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <div className="cs-hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
              gap:64, alignItems:"flex-start" }}>

              {/* Texte */}
              <div>
                {C.hero.showBreadcrumb && <CaseBreadcrumb label="Sentinelle · LCB-FT" />}
                {C.hero.showBadge && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.08, duration:0.5 }} style={{ marginBottom:"var(--sp-4)" }}>
                  <Badge color="purple" size="sm">{C.hero.badge as string}</Badge>
                </motion.div>
                )}

                <h1 style={{ fontSize:"clamp(40px,5.5vw,72px)", fontWeight:200,
                  lineHeight:1.0, letterSpacing:"-0.02em", color:INK, margin:"0 0 14px" }}>
                  {[C.hero.titleLine1, C.hero.titleLine2].map((w,i) => (
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
                    color:VIO, letterSpacing:"-0.01em", marginBottom:24 }}>
                  {C.hero.accentLine}
                </motion.p>

                <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.68, duration:0.6, ease:SP }}
                  style={{ fontSize:16, color:INK2, lineHeight:1.75, maxWidth:480, marginBottom:36 }}>
                  {C.hero.subtitle}
                </motion.p>

                {(C.hero as { tags?: string[] }).tags && (
                <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                  transition={{ delay:0.86, duration:0.6, ease:SP }}
                  style={{ display:"flex", flexWrap:"wrap", gap:"var(--sp-2)" }}>
                  {((C.hero as { tags?: string[] }).tags ?? []).map((t:string) => (
                    <span key={t} className="badge-neutral hig-caption2" style={{ display:"inline-flex",
                      alignItems:"center", padding:"4px 12px", borderRadius:"var(--r-full)", fontWeight:500 }}>{t}</span>
                  ))}
                </motion.div>
                )}

              </div>

              {/* Preview iframe */}
              <motion.div initial={{ opacity:0, y:30, scale:0.97 }}
                animate={{ opacity:1, y:0, scale:1 }}
                transition={{ delay:0.4, duration:0.9, ease:SP }}>
                <motion.div onHoverStart={()=>setPreviewHov(true)} onHoverEnd={()=>setPreviewHov(false)}
                  whileHover={{ y:-6 }} transition={{ duration:0.35, ease:SP }}
                  className="cs-perspective-wrap"
                  style={{ transform:"perspective(1200px) rotateY(-4deg) rotateX(2deg)" }}>
                  <MacFrame>
                    <div className="cs-iframe-wrap" style={{ position:"relative", overflow:"hidden", height:340 }}>
                      <iframe src="/lcb-ft"
                        style={{ width:"222%", height:756, transform:"scale(0.45)",
                          transformOrigin:"top left", border:"none", pointerEvents:"none" }} />
                      <AnimatePresence>
                        {previewHov && (
                          <motion.div key="ov"
                            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                            transition={{ duration:0.18 }}
                            style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.78)",
                              display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                            <button onClick={openDashboard} className="hig-subhead"
                              style={{ fontWeight:500, color:"#FAFAFA", display:"inline-flex",
                                alignItems:"center", gap:6, background:"none", border:"none",
                                cursor:"pointer", padding:0 }}>
                              Voir le dashboard <ArrowUpRight size={14} />
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </MacFrame>
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
              { label:"Secteur",   value:"Fintech · Conformité" },
              { label:"Mon rôle",  value:"Designer UX/UI"      },
              { label:"Durée",     value:"3 mois"              },
              { label:"Livrables", value:"4 écrans clés"       },
            ].map((p, i) => (
              <div key={p.label} style={{ padding:"22px var(--sp-6)",
                borderRight: i < 3 ? `1px solid ${BORD}` : "none" }}>
                <p className="hig-caption2" style={{ fontWeight:700, color:VIO,
                  letterSpacing:"0.14em", textTransform:"uppercase" as const,
                  fontFamily:MONO, margin:"0 0 6px" }}>{p.label}</p>
                <p className="hig-title3" style={{ fontWeight:300, color:INK, margin:0 }}>{p.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTEXTE & CONTRAINTES ──────────────────────────────── */}
        <section style={{ backgroundColor:SURF, borderBottom:`1px solid ${BORD}`, padding:"var(--sp-20) var(--sp-8)" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>

            <Reveal>
              <div className="cs-context-grid" style={{ display:"grid", gridTemplateColumns:"5fr 4fr",
                gap:"var(--sp-12)", alignItems:"flex-start", marginBottom:"var(--sp-10)" }}>
                <div>
                  <Badge color="purple" size="sm" className="mb-4">{(C.context as Record<string,string>).badge}</Badge>
                  <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300,
                    letterSpacing:"-0.02em", color:INK, lineHeight:1.1, margin:0 }}>
                    {(C.context as Record<string,string>).title}
                  </h2>
                </div>
                <div style={{ paddingTop:"var(--sp-8)" }}>
                  <p className="hig-body" style={{ color:INK2, margin:0 }}>
                    {(C.context as Record<string,string>).body}
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Constats 2×2 */}
            <Reveal delay={80}>
              <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"var(--sp-4)" }}>
                {(C.constats as Array<{ tag:string; title:string; description:string; accent:boolean }>)
                  .map(({ tag, title, description, accent }) => (
                  <motion.div key={tag} className="mat-regular" whileHover={{ y:-3 }}
                    transition={{ duration:0.22, ease:SP }}
                    style={{ padding:"22px var(--sp-6)", borderRadius:"var(--r-xl)", cursor:"default",
                      border: accent ? `1px solid ${VIO}50` : `1px solid rgba(0,0,0,0.06)`,
                      boxShadow: accent ? `0 8px 32px ${VIO}14, 0 2px 8px rgba(0,0,0,0.04)` : "0 8px 32px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)" }}>
                    <p className="hig-caption2" style={{ fontWeight:700, color:accent?VIO:INK3,
                      letterSpacing:"0.12em", textTransform:"uppercase" as const, fontFamily:MONO, margin:"0 0 8px" }}>{tag}</p>
                    <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 6px" }}>{title}</p>
                    <p className="hig-footnote" style={{ color:INK2, margin:0 }}>{description}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Séparateur */}
            <Reveal delay={120}>
              <div style={{ position:"relative", display:"flex", alignItems:"center", margin:"var(--sp-6) 0" }}>
                <div style={{ flex:1, height:1, background:BORD }} />
                <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)",
                  display:"flex", alignItems:"center", gap:"var(--sp-2)",
                  background:BG, border:`1px solid ${BORD}`, borderRadius:"var(--r-full)",
                  padding:"var(--sp-1) var(--sp-3) var(--sp-1) var(--sp-2)" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:VIO, flexShrink:0 }} />
                  <span className="hig-caption2" style={{ color:INK3, fontFamily:MONO,
                    letterSpacing:"0.08em", whiteSpace:"nowrap" as const }}>les contraintes</span>
                </div>
              </div>
            </Reveal>

            {/* Contraintes 3-col */}
            <Reveal delay={160}>
              <div className="cs-three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"var(--sp-3)" }}>
                {[
                  { icon:<Shield size={13}/>,       t:"Audit trail ACPR",           d:"Chaque décision tracée, horodatée, archivée automatiquement 5 ans. Conformité immédiate aux contrôles ACPR." },
                  { icon:<Database size={13}/>,     t:"Screening PEP/sanctions",    d:"Vérification temps réel contre les listes internationales de personnes politiquement exposées et sanctions." },
                  { icon:<Clock size={13}/>,        t:"Délais réglementaires",      d:"Traitement sous 24h pour les alertes de haut risque. Système de priorisation automatique par score de criticité." },
                  { icon:<FileText size={13}/>,     t:"Multi-sources de données",   d:"Intégration core banking, SWIFT, transactions. Une seule vue consolidée pour l'analyste, sans changement d'outil." },
                  { icon:<Users size={13}/>,        t:"4 profils utilisateurs",     d:"Analyste, superviseur, compliance officer, administrateur. Droits cloisonnés, accès par profil strict." },
                  { icon:<AlertTriangle size={13}/>, t:"Priorisation intelligente",  d:"Score de risque automatique (critique/fort/moyen/faible). Les alertes critiques remontent en tête de liste." },
                  { icon:<Target size={13}/>,       t:"RGPD + secret bancaire",     d:"Cloisonnement strict des données clients. Accès nominatif tracé. Conformité RGPD intégrée dès la conception." },
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
        <section style={{ backgroundColor:BG, borderBottom:`1px solid ${BORD}`, padding:"var(--sp-20) var(--sp-8)" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">{(C.process as Record<string,string>).badge}</Badge>
              <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300,
                letterSpacing:"-0.02em", color:INK, marginBottom:14, lineHeight:1.1 }}>
                {(C.process as Record<string,string>).title}
              </h2>
              <p className="hig-body" style={{ color:INK2, maxWidth:520, marginBottom:"var(--sp-10)" }}>
                {(C.process as Record<string,string>).body}
              </p>
            </Reveal>
            <Reveal delay={60}>
              <ProcessDiagram />
            </Reveal>
          </div>
        </section>

        {/* ── ÉCRANS CLÉS ─────────────────────────────────────────── */}
        <section style={{ backgroundColor:SURF, borderBottom:`1px solid ${BORD}`, padding:"var(--sp-20) var(--sp-8)" }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">{(C.screens as Record<string,string>).badge}</Badge>
              <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300,
                letterSpacing:"-0.02em", color:INK, marginBottom:"var(--sp-2)", lineHeight:1.1 }}>
                {(C.screens as Record<string,string>).title}
              </h2>
              <p className="hig-body" style={{ color:INK2, maxWidth:600, marginBottom:"var(--sp-10)" }}>
                {(C.screens as Record<string,string>).body}
              </p>
            </Reveal>
            <Reveal delay={40}>
              <FocusPagesSection onOpen={openDashboard} />
            </Reveal>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section style={{ backgroundColor:BG, padding:"var(--sp-24) var(--sp-8)" }}>
          <div style={{ maxWidth:680, margin:"0 auto", textAlign:"center" as const }}>
            <Reveal>
              {C.cta.showBadge && <Badge color="purple" size="sm" className="mb-7">{C.cta.badge}</Badge>}
              <h2 style={{ fontSize:"clamp(32px,5vw,60px)", fontWeight:200,
                lineHeight:1.0, letterSpacing:"-0.02em", color:INK, marginBottom:16 }}>
                {C.cta.title}<br />
                <span style={{ color:VIO }}>{C.cta.titleAccent}</span>
              </h2>
              <p style={{ fontSize:16, color:INK2, lineHeight:1.75,
                maxWidth:460, margin:"0 auto 44px" }}>
                {C.cta.subtitle}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <Button variant="filled" size="large" color="purple" onClick={openDashboard}
                icon={<ExternalLink size={15} />}>
                {C.cta.buttonText}
              </Button>
            </Reveal>
          </div>
        </section>

        <CaseContactFooter footerLeft={C.footer.left} footerRight={C.footer.right} />

      </div>
    </div>
  );
}
