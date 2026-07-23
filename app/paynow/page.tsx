"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import { Badge, Button, Reveal, CaseBreadcrumb, ProcessFrise, CaseContactFooter } from "@/components/ui";
import type { FrisePhase } from "@/components/ui";
import { ArrowUpRight, ExternalLink, CheckCircle, Users, Lightbulb, Target, Shield, Database } from "lucide-react";
import _C from "@/data/content.json";
const C = _C.paynow;

/* ─── Tokens — Design System Apple HIG ─────────────────────────────────── */
const INK   = "var(--color-label)";
const INK2  = "var(--color-label-2)";
const INK3  = "var(--color-label-3)";
const BG    = "var(--color-bg-primary)";
const SURF  = "var(--color-bg-secondary)";
const BORD  = "var(--color-sep-opaque)";
const MONO  = "var(--font-mono)";
const VIO  = "#A259FF";
const FGRN  = "#A8D400";
const SP    = [0.22, 1, 0.36, 1] as const;

/* ─── Schéma technique décoratif — PayNow hero ──────────────────────────── */
function PayNowTechLines() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.9 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}
      aria-hidden="true">
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1200 700" fill="none" preserveAspectRatio="xMidYMid slice">

        {/* Coins de cadrage — se dessinent au chargement */}
        <motion.path d="M 40 88 L 40 48 L 80 48" stroke={FGRN} strokeWidth="1.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.9, duration: 0.55, ease: "easeOut" }}/>
        <motion.path d="M 1120 48 L 1160 48 L 1160 88" stroke={FGRN} strokeWidth="1.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.0, duration: 0.55, ease: "easeOut" }}/>
        <motion.path d="M 40 612 L 40 652 L 80 652" stroke={FGRN} strokeWidth="1.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.1, duration: 0.55, ease: "easeOut" }}/>
        <motion.path d="M 1120 652 L 1160 652 L 1160 612" stroke={FGRN} strokeWidth="1.8"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.2, duration: 0.55, ease: "easeOut" }}/>

        {/* Règle de mesure horizontale */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ delay: 1.4, duration: 0.5 }}>
          <line x1="40" y1="350" x2="560" y2="350" stroke={FGRN} strokeWidth="1" strokeDasharray="5 5"/>
          <line x1="40"  y1="342" x2="40"  y2="358" stroke={FGRN} strokeWidth="1.5"/>
          <line x1="560" y1="342" x2="560" y2="358" stroke={FGRN} strokeWidth="1.5"/>
          <text x="56" y="342" fontSize="8" fontFamily="monospace" fill={FGRN}>col 1/2 viewport</text>
        </motion.g>

        {/* Guide vertical droit pointillé */}
        <motion.line x1="1140" y1="80" x2="1140" y2="620"
          stroke={FGRN} strokeWidth="1" strokeDasharray="4 8"
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
          transition={{ delay: 1.6, duration: 0.7 }}/>

        {/* Croix de repérage avec pulse */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 1.8, duration: 0.4 }}>
          <motion.circle cx="1140" cy="350" r="7"
            stroke={FGRN} strokeWidth="1.2" fill="none"
            animate={{ r: [7, 10, 7], opacity: [0.75, 0.3, 0.75] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}/>
          <line x1="1130" y1="350" x2="1120" y2="350" stroke={FGRN} strokeWidth="1.2"/>
          <line x1="1150" y1="350" x2="1160" y2="350" stroke={FGRN} strokeWidth="1.2"/>
          <line x1="1140" y1="340" x2="1140" y2="330" stroke={FGRN} strokeWidth="1.2"/>
          <line x1="1140" y1="360" x2="1140" y2="370" stroke={FGRN} strokeWidth="1.2"/>
          <text x="1148" y="328" fontSize="8" fontFamily="monospace" fill={FGRN} opacity="0.8">reg_mark</text>
        </motion.g>

        {/* Micro-circuit bas — boucle lente */}
        <motion.g
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2.0 }}>
          <line x1="140" y1="630" x2="250" y2="630" stroke={FGRN} strokeWidth="1.2"/>
          <line x1="250" y1="630" x2="250" y2="608" stroke={FGRN} strokeWidth="1.2"/>
          <line x1="250" y1="608" x2="340" y2="608" stroke={FGRN} strokeWidth="1.2"/>
          <line x1="340" y1="608" x2="340" y2="630" stroke={FGRN} strokeWidth="1.2"/>
          <line x1="340" y1="630" x2="440" y2="630" stroke={FGRN} strokeWidth="1.2"/>
          <circle cx="140" cy="630" r="3" fill={FGRN}/>
          <circle cx="440" cy="630" r="3" fill={FGRN} opacity="0.55"/>
          <text x="258" y="604" fontSize="7" fontFamily="monospace" fill={FGRN}>paynow.component</text>
        </motion.g>

        {/* Cote de hauteur droite */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.62 }} transition={{ delay: 1.9, duration: 0.5 }}>
          <line x1="1088" y1="180" x2="1088" y2="520" stroke={FGRN} strokeWidth="1"/>
          <line x1="1080" y1="180" x2="1096" y2="180" stroke={FGRN} strokeWidth="1.4"/>
          <line x1="1080" y1="520" x2="1096" y2="520" stroke={FGRN} strokeWidth="1.4"/>
          <text x="1096" y="356" fontSize="8" fontFamily="monospace" fill={FGRN}>340px</text>
        </motion.g>
      </svg>
    </motion.div>
  );
}

/* ─── macOS Window Frame ─────────────────────────────────────────────────── */
function MacOSFrame({ children, url = "app.paynow.fr" }: { children: React.ReactNode; url?: string }) {
  return (
    <div style={{
      borderRadius: "var(--r-lg)", overflow: "hidden",
      boxShadow: "0 28px 64px rgba(0,0,0,0.16), 0 6px 20px rgba(0,0,0,0.09), 0 1px 4px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.08)",
    }}>
      {/* Barre titre macOS */}
      <div style={{
        height: 36, background: "#EBEBEB",
        borderBottom: "1px solid rgba(0,0,0,0.09)",
        display: "flex", alignItems: "center",
        padding: "0 14px", userSelect: "none",
      }}>
        {/* Traffic lights */}
        <div style={{ display:"flex", gap:6, flexShrink:0 }}>
          {[{f:"#FF5F57",s:"#E0443E"},{f:"#FFBD2E",s:"#DEA123"},{f:"#28C840",s:"#1DAD2B"}].map(({f,s},i)=>(
            <div key={i} style={{ width:12, height:12, borderRadius:"50%", background:f, boxShadow:`0 0 0 0.5px ${s}` }} />
          ))}
        </div>
        {/* URL bar centré */}
        <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
          <div className="mac-url-bar" style={{
            width:240, height:22,
            background:"rgba(255,255,255,0.88)",
            border:"1px solid rgba(0,0,0,0.10)",
            borderRadius:6,
            display:"flex", alignItems:"center", justifyContent:"center", gap:5,
          }}>
            <svg width="9" height="10" viewBox="0 0 16 16" fill="none" style={{ opacity:0.35, flexShrink:0 }}>
              <path d="M8 1a4 4 0 0 0-4 4v1H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1V5a4 4 0 0 0-4-4zm3 5V5a3 3 0 1 0-6 0v1h6z" fill="currentColor"/>
            </svg>
            <span className="hig-caption2" style={{ color:"rgba(0,0,0,0.38)", fontFamily:MONO, letterSpacing:0 }}>{url}</span>
          </div>
        </div>
        <div style={{ width:60, flexShrink:0 }} />
      </div>
      <div style={{ lineHeight:0 }}>{children}</div>
    </div>
  );
}

/* ─── ScreenCapture ──────────────────────────────────────────────────────── */
type Callout = { n:string; x:string; y:string; text:string; desc:string };
function ScreenCapture({ title, src, callouts, href }: {
  title:string; src:string; callouts:Callout[]; href:string;
}) {
  const [hov, setHov] = useState(false);
  const slug = title.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
  return (
    <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
      whileHover={{ y:-4 }} transition={{ duration:0.28, ease:SP }}>
      <MacOSFrame url={`app.paynow.fr/${slug}`}>
        <div style={{ position:"relative", lineHeight:0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={title} style={{ width:"100%", display:"block" }} />
          {callouts.map(c=>(
            <div key={c.n} style={{
              position:"absolute", left:c.x, top:c.y, transform:"translate(-50%,-50%)",
              width:22, height:22, borderRadius:"50%", background:VIO, border:"2px solid #fff",
              color:"#fff", fontSize:10, fontWeight:800, display:"flex", alignItems:"center",
              justifyContent:"center", boxShadow:`0 2px 8px ${VIO}55`,
              fontFamily:MONO, pointerEvents:"none",
              animation:"callout-pulse 2.5s ease-in-out infinite",
            }}>{c.n}</div>
          ))}
          <AnimatePresence>
            {hov && (
              <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:0.18 }}
                style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
                  display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                <p className="hig-caption2" style={{ letterSpacing:"0.1em",
                  color:"rgba(255,255,255,0.65)", marginBottom:6 }}>{title.toUpperCase()}</p>
                <Link href={href} className="hig-subhead" style={{ fontWeight:500, color:"#FAFAFA",
                  display:"inline-flex", alignItems:"center", gap:6, textDecoration:"none" }}>
                  Ouvrir l&apos;écran <ArrowUpRight size={14} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MacOSFrame>
      <div style={{ padding:"var(--sp-4) var(--sp-2) 0" }}>
        <div style={{ marginBottom:12 }}>
          <span className="hig-caption1" style={{ fontWeight:700, color:VIO, letterSpacing:"0.1em",
            textTransform:"uppercase", fontFamily:MONO }}>{title}</span>
        </div>
        <div className="sc-callouts" style={{ display:"grid", gridTemplateColumns:`repeat(${callouts.length},1fr)`, gap:10 }}>
          {callouts.map(c=>(
            <div key={c.n} style={{ display:"flex", gap:7, alignItems:"flex-start" }}>
              <div style={{ width:16, height:16, borderRadius:"50%", background:VIO, flexShrink:0, marginTop:1,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:8, fontWeight:800, fontFamily:MONO }}>{c.n}</div>
              <div>
                <p className="hig-caption1" style={{ fontWeight:600, color:INK, margin:"0 0 1px" }}>{c.text}</p>
                <p className="hig-caption2" style={{ color:INK3, margin:0 }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


/* ─── Phase definitions ──────────────────────────────────────────────────── */
const PHASES = [
  { id:"01", label:"Recherche",
    livrable:"Rapport de recherche, 2 personas, Audit fonctionnel, Benchmark" },
  { id:"02", label:"Définition",
    livrable:"Synthèse des besoins, Matrice Impact x Effort, Architecture cible" },
  { id:"03", label:"Idéation",
    livrable:"Pistes de solutions" },
  { id:"04", label:"Design",
    livrable:"Wireframes basse fidélité, 5 modules haute fidélité, Specs handoff" },
  { id:"05", label:"Tests",
    livrable:"Rapport tests utilisateurs, Priorisation usability, Itérations" },
];

/* ─── Phase panels ───────────────────────────────────────────────────────── */
function PhasePanel01() {
  return (
    <div>
      {[
        { n:"01", label:"Entretiens semi-directifs", sub:"4 participants, 45 à 60 min" },
        { n:"02", label:"Observation terrain",       sub:"En situation de travail réelle" },
        { n:"03", label:"Audit fonctionnel",         sub:"Cartographie de l'interface existante" },
        { n:"04", label:"Benchmark marché",          sub:"Stripe, Adyen, Mollie, PayPlug" },
      ].map((m,i)=>(
        <div key={m.n} style={{ display:"flex", gap:"var(--sp-4)", alignItems:"flex-start",
          paddingBottom:"var(--sp-4)", marginBottom:"var(--sp-4)",
          borderBottom:i<3?`1px solid ${BORD}`:"none" }}>
          <span className="hig-caption2" style={{ fontWeight:700, color:VIO, fontFamily:MONO, flexShrink:0, minWidth:20 }}>{m.n}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{m.label}</p>
            <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{m.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhasePanel02() {
  const versions = [
    { v:"V1", modules:["Transactions","Alias","Abonnements","Dashboard"], color:VIO, d:"Fonctionnalités coeur, utilisées quotidiennement par tous les profils." },
    { v:"V2", modules:["Paramétrage"],                                    color:VIO, d:"Configuration du compte et des moyens de paiement." },
    { v:"V3", modules:["Personnalisation"],                               color:VIO, d:"Thème, marque blanche et expérience sur-mesure." },
  ];
  return (
    <div>
      {versions.map((v, i) => (
        <div key={v.v} style={{ display:"flex", gap:"var(--sp-4)", alignItems:"flex-start",
          paddingBottom:"var(--sp-4)", marginBottom:"var(--sp-4)",
          borderBottom:i<2?`1px solid ${BORD}`:"none" }}>
          <span className="hig-caption2" style={{ fontWeight:800, color:v.color, fontFamily:MONO, flexShrink:0, minWidth:24 }}>{v.v}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>
              {v.modules.join(", ")}
            </p>
            <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{v.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhasePanel03() {
  return (
    <div>
      {[
        { n:"01", t:"Brainstorming",   o:"Génération libre, sans contrainte, divergence maximale." },
        { n:"02", t:"Crazy 8",         o:"8 esquisses en 8 min pour forcer la variété des pistes." },
        { n:"03", t:"Croquis rapides, zoning", o:"Parcours sur papier avant Figma, convergence." },
      ].map((w,i)=>(
        <div key={w.n} style={{ display:"flex", gap:"var(--sp-4)", alignItems:"flex-start",
          paddingBottom:"var(--sp-4)", marginBottom:"var(--sp-4)",
          borderBottom:i<2?`1px solid ${BORD}`:"none" }}>
          <span className="hig-caption2" style={{ fontWeight:800, color:FGRN, fontFamily:MONO, flexShrink:0, minWidth:20 }}>{w.n}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{w.t}</p>
            <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{w.o}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhasePanel04() {
  return (
    <div>
      {[
        { step:"01", phase:"Wireframes basse fidélité",  focus:"Parcours, organisation, interactions principales" },
        { step:"02", phase:"Maquettes haute fidélité",   focus:"Hiérarchie visuelle, composants, états, filtres" },
        { step:"03", phase:"Cas d'erreur et messages",   focus:"États vides, messages système, confirmations" },
      ].map((s,i)=>(
        <div key={s.step} style={{ display:"flex", gap:"var(--sp-4)", alignItems:"flex-start",
          paddingBottom:"var(--sp-4)", marginBottom:"var(--sp-4)",
          borderBottom:i<2?`1px solid ${BORD}`:"none" }}>
          <span className="hig-caption2" style={{ fontWeight:800, color:VIO, fontFamily:MONO, flexShrink:0, minWidth:20 }}>{s.step}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{s.phase}</p>
            <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{s.focus}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PhasePanel05() {
  return (
    <div>
      {[
        { n:"01", t:"Segmentation utilisateur",   d:"Profils testeurs recrutés selon les rôles réels : commerçants, gestionnaires de compte, support." },
        { n:"02", t:"Rédaction des protocoles",   d:"Scénarios de test réalistes, tâches concrètes tirées des cas d'usage les plus fréquents." },
        { n:"03", t:"KPIs suivis",                d:"SUS Score (84 vs 51 avant refonte), taux de complétion des tâches, temps sur tâche, taux d'erreur, satisfaction déclarative." },
        { n:"04", t:"Tests via Maze et Figma",     d:"Tests non modérés sur Maze pour les parcours clés, sessions modérées sur prototype Figma pour les cas complexes." },
      ].map((it,i)=>(
        <div key={it.n} style={{ display:"flex", gap:"var(--sp-4)", alignItems:"flex-start",
          paddingBottom:"var(--sp-4)", marginBottom:"var(--sp-4)",
          borderBottom:i<3?`1px solid ${BORD}`:"none" }}>
          <span className="hig-caption2" style={{ fontWeight:800, color:VIO, fontFamily:MONO, flexShrink:0, minWidth:20 }}>{it.n}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{it.t}</p>
            <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{it.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Frise process — composant partagé ProcessFrise ────────────────────── */
function InteractiveProcessDiagram() {
  return (
    <ProcessFrise
      phases={PHASES}
      dotColor={FGRN}
      renderPanel={(id) => {
        if (id === "01") return <PhasePanel01 />;
        if (id === "02") return <PhasePanel02 />;
        if (id === "03") return <PhasePanel03 />;
        if (id === "04") return <PhasePanel04 />;
        return <PhasePanel05 />;
      }}
    />
  );
}

/* ─── Focus 4 pages clés ─────────────────────────────────────────────────── */
const FOCUS_TABS=[
  { id:"dashboard",       label:"Dashboard"       },
  { id:"parametres",      label:"Paramètres"      },
  { id:"personnalisation",label:"Personnalisation" },
];

function FocusDashboard() {
  const [hov, setHov] = useState(false);
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          Comprendre l&apos;état de son activité en moins de 30 secondes, sans cliquer. Une surface de pilotage opérationnel, pas une page décorative.
        </p>
        {[
          { icon:<Target size={14}/>,                               t:"Visibilité des KPIs",               d:"Volume, taux d'acceptation, panier moyen, sans scroll." },
          { icon:<Users size={14}/>,                                t:"Hiérarchisation de l'information",  d:"Le taux d'acceptation, premier indicateur cité, affiché en priorité." },
          { icon:<Lightbulb size={14}/>,                            t:"Prise de décision améliorée",       d:"Badge d'alerte uniquement si des transactions nécessitent une action." },
          { icon:<CheckCircle size={14} style={{color:FGRN}}/>,    t:"Lecture simplifiée",                d:"Courbe J-30 pour détecter une anomalie. Statuts agrégés." },
        ].map((o,i)=>(
          <div key={i} style={{ display:"flex", gap:10, marginBottom:"var(--sp-2)" }}>
            <div style={{ color:VIO, flexShrink:0, marginTop:1 }}>{o.icon}</div>
            <div>
              <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{o.t}</p>
              <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{o.d}</p>
            </div>
          </div>
        ))}
      </div>
      <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        whileHover={{ y:-4 }} transition={{ duration:0.28, ease:SP }}
        className="cs-desktop-preview">
        <MacOSFrame url="app.paynow.fr/dashboard">
          <div className="cs-iframe-wrap" style={{ position:"relative", overflow:"hidden", height:300 }}>
            <iframe
              src="/paynow/dashboard"
              style={{ width:"222%", height:667, transform:"scale(0.45)", transformOrigin:"top left", border:"none", pointerEvents:"none" }}
            />
            <AnimatePresence>
              {hov && (
                <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
                    display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                  <Link href="/paynow/dashboard" className="hig-subhead"
                    style={{ fontWeight:500, color:"#FAFAFA", display:"inline-flex", alignItems:"center", gap:6, textDecoration:"none" }}>
                    Ouvrir l&apos;écran <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MacOSFrame>
      </motion.div>
    </div>
  );
}

function FocusParametres() {
  const [hov, setHov] = useState(false);
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          Chaque intitulé a été retraduit dans le langage des commerçants pour supprimer la charge cognitive et rendre le paramétrage autonome.
        </p>
        {[
          { icon:<Shield size={14}/>,       t:"Langage commerçant",         d:"Zéro jargon bancaire : \"Raison sociale\" plutôt que \"Merchant entity name\"." },
          { icon:<Target size={14}/>,       t:"Paramétrage autonome",       d:"Chaque section configurable sans passer par le support ou un intégrateur." },
          { icon:<Database size={14}/>,     t:"Navigation contextuelle",    d:"Menu secondaire catégorisé : Entreprise, Clés API, Intégrations, Sécurité…" },
        ].map((o,i)=>(
          <div key={i} style={{ display:"flex", gap:10, marginBottom:"var(--sp-2)" }}>
            <div style={{ color:VIO, flexShrink:0, marginTop:1 }}>{o.icon}</div>
            <div>
              <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{o.t}</p>
              <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{o.d}</p>
            </div>
          </div>
        ))}
      </div>
      <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        whileHover={{ y:-4 }} transition={{ duration:0.28, ease:SP }}
        className="cs-desktop-preview">
        <MacOSFrame url="app.paynow.fr/parametres">
          <div className="cs-iframe-wrap" style={{ position:"relative", overflow:"hidden", height:300 }}>
            <iframe
              src="/paynow/parametres"
              style={{ width:"222%", height:667, transform:"scale(0.45)", transformOrigin:"top left", border:"none", pointerEvents:"none" }}
            />
            <AnimatePresence>
              {hov && (
                <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
                    display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                  <Link href="/paynow/parametres" className="hig-subhead"
                    style={{ fontWeight:500, color:"#FAFAFA", display:"inline-flex", alignItems:"center", gap:6, textDecoration:"none" }}>
                    Ouvrir l&apos;écran <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MacOSFrame>
      </motion.div>
    </div>
  );
}

function FocusPersonnalisation() {
  const [hov, setHov] = useState(false);
  return (
    <div className="cs-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color:INK2, marginBottom:"var(--sp-5)", lineHeight:1.6 }}>
          La personnalisation de la page de paiement permet à chaque entité bancaire d&apos;adapter l&apos;interface à sa propre marque, tout en garantissant l&apos;accessibilité RGAA pour tous les utilisateurs.
        </p>
        {[
          { icon:<CheckCircle size={14} style={{color:FGRN}}/>, t:"Ratios de contraste",     d:"Chaque couleur vérifiée en temps réel contre les exigences AA (4,5:1)." },
          { icon:<Lightbulb size={14}/>,                        t:"Aperçu live obligatoire", d:"Sans preview, les tests montraient des abandons systématiques." },
          { icon:<Shield size={14}/>,                           t:"Alternative accessible",  d:"Avertissement si la couleur ne passe pas le ratio RGAA." },
        ].map((c,i)=>(
          <div key={i} style={{ display:"flex", gap:10, marginBottom:"var(--sp-2)" }}>
            <div style={{ color:VIO, flexShrink:0, marginTop:1 }}>{c.icon}</div>
            <div>
              <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 3px" }}>{c.t}</p>
              <p className="hig-footnote" style={{ color:INK3, margin:0 }}>{c.d}</p>
            </div>
          </div>
        ))}
      </div>
      <motion.div onHoverStart={()=>setHov(true)} onHoverEnd={()=>setHov(false)}
        whileHover={{ y:-4 }} transition={{ duration:0.28, ease:SP }}
        className="cs-desktop-preview">
        <MacOSFrame url="app.paynow.fr/personnalisation">
          <div className="cs-iframe-wrap" style={{ position:"relative", overflow:"hidden", height:300 }}>
            <iframe
              src="/paynow/personnalisation/identite"
              style={{ width:"222%", height:667, transform:"scale(0.45)", transformOrigin:"top left", border:"none", pointerEvents:"none" }}
            />
            <AnimatePresence>
              {hov && (
                <motion.div key="ov" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  transition={{ duration:0.18 }}
                  style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.82)",
                    display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:20 }}>
                  <Link href="/paynow/personnalisation/identite" className="hig-subhead"
                    style={{ fontWeight:500, color:"#FAFAFA", display:"inline-flex", alignItems:"center", gap:6, textDecoration:"none" }}>
                    Ouvrir l&apos;écran <ArrowUpRight size={14} />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </MacOSFrame>
      </motion.div>
    </div>
  );
}

function FocusPagesSection() {
  const [active,setActive]=useState("dashboard");
  return (
    <div>
      {/* ── Segmented Control Apple HIG ── */}
      <div style={{
        display:"inline-flex", background:"var(--color-bg-secondary)",
        borderRadius:"var(--r-lg)", padding:3,
        border:`1px solid ${BORD}`, marginBottom:"var(--sp-5)",
      }}>
        {FOCUS_TABS.map(t=>(
          <motion.button key={t.id} onClick={()=>setActive(t.id)}
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
            textTransform:"uppercase", fontFamily:MONO }}>
            {FOCUS_TABS.find(t=>t.id===active)?.label}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-6 }} transition={{ duration:0.2, ease:SP }}>
            {active==="dashboard"       &&<FocusDashboard/>}
            {active==="parametres"      &&<FocusParametres/>}
            {active==="personnalisation"&&<FocusPersonnalisation/>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function PayNowCaseStudy() {
  return (
    <div style={{ background:BG, color:INK, colorScheme:"light" }}>
      <style suppressHydrationWarning>{`
        @keyframes callout-pulse {
          0%,100% { transform:translate(-50%,-50%) scale(1); }
          50%      { transform:translate(-50%,-50%) scale(1.18); }
        }
      `}</style>
      <PortfolioHeader />
      <div style={{ paddingTop:60 }}>

        {/* ══ 1. HERO ══════════════════════════════════════════════════ */}
        <section style={{ padding:"var(--sp-20) var(--sp-8) 72px", borderBottom:`1px solid ${BORD}`,
            position:"relative", isolation:"isolate", overflow:"hidden", background:BG }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <div className="cs-hero-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"flex-start" }}>
            <div>
              {C.hero.showBreadcrumb && <CaseBreadcrumb label="PayNow" />}
              {C.hero.showBadge && (
              <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.08, duration:0.5 }} style={{ marginBottom:"var(--sp-4)" }}>
                <Badge color="purple" size="sm">{C.hero.badge}</Badge>
              </motion.div>
              )}
              <h1 style={{ fontSize:"clamp(40px,5.5vw,72px)", fontWeight:200,
                letterSpacing:"-0.02em", color:INK, lineHeight:1.0, margin:"0 0 14px" }}>
                {[C.hero.titleLine1, C.hero.titleLine2].map((w,i)=>(
                  <motion.span key={i}
                    initial={{ opacity:0, y:24, filter:"blur(5px)" }}
                    animate={{ opacity:1, y:0, filter:"blur(0px)" }}
                    transition={{ delay:0.16+i*0.12, duration:0.72, ease:SP }}
                    style={{ display:"block" }}>
                    {w}
                  </motion.span>
                ))}
              </h1>
              {(C.hero as { accentLine?: string }).accentLine && (
              <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.52, duration:0.6, ease:SP }}
                style={{ fontSize:"clamp(17px,2.4vw,26px)", fontWeight:300,
                  color:VIO, letterSpacing:"-0.01em", marginBottom:24 }}>
                {(C.hero as { accentLine?: string }).accentLine}
              </motion.p>
              )}
              <motion.p initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.68, duration:0.6, ease:SP }}
                style={{ fontSize:16, color:INK2, lineHeight:1.75, maxWidth:480, marginBottom:36 }}>
                {C.hero.subtitle}
              </motion.p>
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                transition={{ delay:0.86, duration:0.6, ease:SP }}
                style={{ display:"flex", flexWrap:"wrap", gap:"var(--sp-2)" }}>
                {C.hero.tags.map((t: string)=>(
                  <span key={t} className="badge-neutral hig-caption2" style={{ display:"inline-flex",
                    alignItems:"center", padding:"4px 12px", borderRadius:"var(--r-full)", fontWeight:500 }}>{t}</span>
                ))}
              </motion.div>
            </div>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:0.5, duration:0.7, ease:SP }}>
              <motion.div whileHover={{ y:-6 }}
                transition={{ duration:0.35, ease:SP }}
                className="cs-perspective-wrap"
                style={{ transform:"perspective(1200px) rotateY(-4deg) rotateX(2deg)" }}>
                <MacOSFrame url="app.paynow.fr/dashboard">
                  <div className="cs-iframe-wrap" style={{ overflow:"hidden", height:350 }}>
                    <iframe
                      src="/paynow/dashboard"
                      style={{ width:"222%", height:778, transform:"scale(0.45)", transformOrigin:"top left", border:"none", pointerEvents:"none" }}
                    />
                  </div>
                </MacOSFrame>
              </motion.div>
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
                transition={{ delay:1.1, duration:0.5 }}
                style={{ display:"flex", justifyContent:"flex-end", marginTop:14 }}>
                <Link href="/paynow/dashboard"
                  style={{
                    display:"inline-flex", alignItems:"center", gap:5,
                    fontSize:13, color:INK2, textDecoration:"underline",
                    textUnderlineOffset:3, textDecorationColor:"rgba(0,0,0,0.25)",
                  }}>
                  Visiter le site <ArrowUpRight size={13} strokeWidth={1.6} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
          </div>
        </section>

        {/* ══ 2. INFO STRIP ════════════════════════════════════════════ */}
        <section style={{ borderBottom:`1px solid ${BORD}`, background:SURF }}>
          <div className="cs-info-strip" style={{ maxWidth:1160, margin:"0 auto", padding:`0 var(--sp-8)`, display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
            {[
              { label:"Secteur",   value:"Prestataire de paiement" },
              { label:"Mon rôle",  value:"Product Designer"         },
              { label:"Durée",     value:"6 mois"                  },
              { label:"Livrables", value:"4 modules"               },
            ].map((p,i)=>(
              <div key={p.label} style={{ padding:"22px var(--sp-6)", borderRight:i<3?`1px solid ${BORD}`:"none" }}>
                <p className="hig-caption2" style={{ fontWeight:700, color:VIO, letterSpacing:"0.14em",
                  textTransform:"uppercase", fontFamily:MONO, margin:"0 0 6px" }}>{p.label}</p>
                <p className="hig-title3" style={{ fontWeight:300, color:INK, margin:0 }}>{p.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ 3. CONTEXTE ══════════════════════════════════════════════ */}
        <section style={{ padding:"var(--sp-20) var(--sp-8)", borderBottom:`1px solid ${BORD}`, background:SURF }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>

            {/* Intro 2-col */}
            <Reveal>
              <div className="cs-context-grid" style={{ display:"grid", gridTemplateColumns:"5fr 4fr", gap:"var(--sp-12)", alignItems:"flex-start", marginBottom:"var(--sp-10)" }}>
                <div>
                  {C.context.showBadge && <Badge color="purple" size="sm" className="mb-4">{C.context.badge}</Badge>}
                  <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, letterSpacing:"-0.02em",
                    color:INK, lineHeight:1.1, margin:0 }}>
                    {C.context.title}
                  </h2>
                </div>
                <div style={{ paddingTop:"var(--sp-8)" }}>
                  <p className="hig-body" style={{ color:INK2, margin:0 }}>
                    {C.context.body}
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
                      letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:MONO, margin:"0 0 8px" }}>{tag}</p>
                    <p className="hig-callout" style={{ fontWeight:500, color:INK, margin:"0 0 6px" }}>{title}</p>
                    <p className="hig-footnote" style={{ color:INK2, margin:0 }}>{description}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>

            {/* Séparateur → Contraintes */}
            <Reveal delay={120}>
              <div style={{ position:"relative", display:"flex", alignItems:"center", margin:"var(--sp-6) 0" }}>
                <div style={{ flex:1, height:1, background:BORD }}/>
                <div style={{ position:"absolute", left:"50%", transform:"translateX(-50%)",
                  display:"flex", alignItems:"center", gap:"var(--sp-2)",
                  background:BG, border:`1px solid ${BORD}`,
                  borderRadius:"var(--r-full)", padding:"var(--sp-1) var(--sp-3) var(--sp-1) var(--sp-2)" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:FGRN, flexShrink:0 }}/>
                  <span className="hig-caption2" style={{ color:INK3, fontFamily:MONO, letterSpacing:"0.08em", whiteSpace:"nowrap" }}>
                    les contraintes
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Contraintes 3-col × 2 rangées */}
            <Reveal delay={160}>
              <div className="cs-three-col" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"var(--sp-3)" }}>
                {[
                  { icon:<Shield size={13}/>,    t:"PCI-DSS / DSP2 & Données sensibles", d:"Réglementation stricte, parcours réglementés, sobriété UI imposée" },
                  { icon:<Database size={13}/>,  t:"Volumétrie élevée",    d:"Milliers de lignes"                  },
                  { icon:<Users size={13}/>,     t:"Marque blanche",       d:"Banque Populaire, Caisse d'Épargne…" },
                  { icon:<Lightbulb size={13}/>, t:"Multilingue",          d:"Interface en plusieurs langues"      },
                  { icon:<Target size={13}/>,    t:"Périmètre étendu",     d:"Plusieurs dizaines d'écrans"         },
                ].map((c,i)=>(
                  <motion.div key={i} className="mat-thin"
                    initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.3+i*0.06, duration:0.5, ease:SP }}
                    whileHover={{ y:-2 }}
                    style={{
                      padding:"var(--sp-4) var(--sp-3)", borderRadius:"var(--r-lg)",
                      border: `1px solid rgba(0,0,0,0.05)`,
                      display:"flex", alignItems:"flex-start", gap:"var(--sp-2)",
                    }}>
                    <div style={{ color: INK3, flexShrink:0, marginTop:1 }}>{c.icon}</div>
                    <div>
                      <p className="hig-caption1" style={{ fontWeight:600, color:INK, margin:"0 0 var(--sp-1)" }}>{c.t}</p>
                      <p className="hig-caption2" style={{ color:INK3, margin:0 }}>{c.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>

          </div>
        </section>

        {/* ══ 4. PROCESS UX ════════════════════════════════════════════ */}
        <section style={{ padding:"var(--sp-20) var(--sp-8)", borderBottom:`1px solid ${BORD}`, background:BG }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">{(C.process as Record<string,string>).badge}</Badge>
              <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, letterSpacing:"-0.02em",
                color:INK, marginBottom:"var(--sp-2)", lineHeight:1.1 }}>{(C.process as Record<string,string>).title}</h2>
              <p className="hig-body" style={{ color:INK2, maxWidth:520, marginBottom:"var(--sp-10)" }}>
                {(C.process as Record<string,string>).body}
              </p>
            </Reveal>
            <Reveal delay={60}><InteractiveProcessDiagram /></Reveal>
          </div>
        </section>

        {/* ══ 5. SOLUTIONS ══════════════════════════════════════════════ */}
        <section style={{ padding:"var(--sp-20) var(--sp-8)", background:SURF, borderBottom:`1px solid ${BORD}` }}>
          <div style={{ maxWidth:1160, margin:"0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">{(C.solutions as Record<string,string>).badge}</Badge>
              <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:300, letterSpacing:"-0.02em",
                color:INK, marginBottom:"var(--sp-2)", lineHeight:1.1 }}>{(C.solutions as Record<string,string>).title}</h2>
              <p className="hig-body" style={{ color:INK2, maxWidth:600, marginBottom:"var(--sp-10)" }}>
                {(C.solutions as Record<string,string>).body}
              </p>
            </Reveal>
            <Reveal delay={40}><FocusPagesSection /></Reveal>
          </div>
        </section>


        {/* ══ CTA ══════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: BG, padding: "var(--sp-24) var(--sp-8)" }}>
          <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center" as const }}>
            <Reveal>
              {C.cta.showBadge && <Badge color="purple" size="sm" className="mb-7">{C.cta.badge}</Badge>}
              <h2 style={{ fontSize: "clamp(32px,5vw,60px)", fontWeight: 200,
                lineHeight: 1.0, letterSpacing: "-0.02em", color: INK, marginBottom: 16 }}>
                {C.cta.title}<br />
                <span style={{ color: VIO }}>{C.cta.titleAccent}</span>
              </h2>
              <p style={{ fontSize: 16, color: INK2, lineHeight: 1.75,
                maxWidth: 460, margin: "0 auto 44px" }}>
                {C.cta.subtitle}
              </p>
            </Reveal>
            <Reveal delay={100}>
              <Button variant="filled" size="large" color="purple"
                onClick={() => window.open("/paynow/dashboard", "_blank")}
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
