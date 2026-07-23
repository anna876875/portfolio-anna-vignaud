"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import { Badge, Button, Reveal, CaseBreadcrumb, ProcessFrise, CaseContactFooter } from "@/components/ui";
import type { FrisePhase } from "@/components/ui";
import Link from "next/link";
import _C from "@/data/content.json";
const C = _C.onboarding;

const SP   = [0.22, 1, 0.36, 1] as const;
const INK  = "var(--color-label)";
const INK2 = "var(--color-label-2)";
const INK3 = "var(--color-label-3)";
const BG   = "var(--color-bg-primary)";
const SURF = "var(--color-bg-secondary)";
const BORD = "var(--color-sep-opaque)";
const MONO = "var(--font-mono)";
const VIO  = "#A259FF";   /* violet du portfolio */
const VIO_L = "#F5EEFF";

/* Palette Stripe-inspired (écrans onboarding) */
const OBP  = "#0A2540";
const OBB  = "#1A56DB";
const OBL  = "#F6F9FC";
const OBE  = "#E0E6EB";
const OBS  = "#425466";
const OBLL = "#EBF5FF";

/* ═══════════════════════════════════════════════════════════════════
   LIVRABLES — illustrations SVG par phase DT
   ═══════════════════════════════════════════════════════════════════ */

/* Phase 1 — Empathie : interviews + empathy map */
function DeliverableEmpathie() {
  const [tab, setTab] = useState<"interviews" | "empathy">("interviews");
  const LBL2 = "rgba(60,60,67,0.60)";

  const notes = [
    { col: "#FFF9C4", lines: ["« On nous demande des documents", "qu'on n'a jamais entendus. »", "Marchand e-commerce"] },
    { col: "#C8E6C9", lines: ["« L'ADV nous relance 3 fois", "avant que le dossier soit", "complet. »", "Équipe ADV"] },
    { col: "#BBDEFB", lines: ["« On veut un onboarding aussi", "rapide que la concurrence. »", "Partenaire PSP"] },
    { col: "#FFE0B2", lines: ["« Je ne sais pas où j'en suis", "dans mon dossier. »", "Marchand"] },
    { col: "#F8BBD9", lines: ["« Pourquoi vous avez besoin", "de mon KBIS et mon RIB ? »", "Marchand e-comm."] },
    { col: "#E1BEE7", lines: ["« On perd 2h/jour à relancer", "les marchands par email. »", "ADV"] },
  ];

  const quadrants = [
    { label: "DIT",     col: "#FFF9C4", items: ["« Je veux activer mon compte vite »", "« Pourquoi vous avez besoin de mon KBIS ? »"] },
    { label: "PENSE",   col: "#BBDEFB", items: ["« La concurrence est plus rapide »", "« Est-ce que mes données sont sûres ? »"] },
    { label: "FAIT",    col: "#C8E6C9", items: ["Envoie des emails à l'ADV", "Attend sans visibilité sur son dossier"] },
    { label: "RESSENT", col: "#F8BBD9", items: ["Frustration face à la lenteur", "Méfiance vis-à-vis des données demandées"] },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden",
      padding: "12px 12px 14px" }}>
      {/* Segmented control */}
      <div style={{ display: "flex", background: "rgba(0,0,0,0.06)", borderRadius: 8,
        padding: 2, marginBottom: 12 }}>
        {([["interviews", "Interviews"], ["empathy", "Empathy Map"]] as const).map(([t, lbl]) => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "none",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#000" : LBL2,
              fontSize: 12, fontWeight: tab === t ? 600 : 400, cursor: "pointer",
              boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
              transition: "all .15s", fontFamily: "var(--font-sans)" }}>
            {lbl}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18, ease: SP }}>

          {tab === "interviews" ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
              {notes.map((n, i) => (
                <div key={i} style={{ background: n.col, borderRadius: 4,
                  padding: "8px 9px 10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.07)" }}>
                  <div style={{ height: 1, background: "rgba(0,0,0,0.08)", marginBottom: 7 }} />
                  {n.lines.map((line, j) => (
                    <p key={j} style={{ fontSize: 9, color: "rgba(0,0,0,0.65)",
                      margin: "0 0 1px", lineHeight: 1.5,
                      fontFamily: "var(--font-sans)" }}>{line}</p>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {quadrants.map(({ label, col, items }) => (
                <div key={label} style={{ background: col, borderRadius: 8,
                  padding: "8px 10px 10px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em",
                    color: "rgba(0,0,0,0.45)", margin: "0 0 6px",
                    textTransform: "uppercase", fontFamily: MONO }}>{label}</p>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 4, alignItems: "flex-start", marginBottom: 3 }}>
                      <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(0,0,0,0.40)",
                        flexShrink: 0, marginTop: 4 }} />
                      <p style={{ fontSize: 10, color: "rgba(0,0,0,0.70)", margin: 0,
                        lineHeight: 1.4, fontFamily: "var(--font-sans)" }}>{item}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Phase 2 — Définition : Apple HIG grouped list */
function DeliverableDefinition() {
  /* Palette Apple system */
  const SYS_BG   = "#F2F2F7";   /* iOS secondary background */
  const CARD     = "#FFFFFF";
  const SEP      = "rgba(60,60,67,0.29)";
  const LBL      = "#000000";
  const LBL2     = "rgba(60,60,67,0.60)";
  const LBL3     = "rgba(60,60,67,0.30)";
  const SF       = "-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif";
  const SFD      = "-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif";

  const cells = [
    { icon: "⚡", iconBg: "#FF9500", title: "Goulot d'étranglement", sub: "L'ADV traite chaque dossier manuellement, un processus non scalable" },
    { icon: "?",  iconBg: "#FF3B30", title: "Abandon documentaire",  sub: "Le marchand ne comprend pas pourquoi on lui demande ses données" },
    { icon: "⊕",  iconBg: "#34C759", title: "Critères partenaires",  sub: "Chaque partenaire impose ses propres exigences d'éligibilité" },
  ];

  return (
    <svg viewBox="0 0 434 210" aria-hidden="true" style={{ width: "100%", display: "block" }}>
      {/* iOS page background */}
      <rect width="434" height="210" fill={SYS_BG} rx="10" />

      {/* ── Section 1 : HMW — grouped card ── */}
      <text x="28" y="18" fontSize="11" fontWeight="600" letterSpacing="0.01em"
        fill={LBL2} fontFamily={SF}>Question centrale</text>

      {/* Card */}
      <rect x="12" y="22" width="410" height="58" rx="10" fill={CARD} />

      {/* SF Symbol–style lightbulb icon */}
      <rect x="22" y="32" width="30" height="30" rx="7.5"
        fill={VIO} />
      <text x="37" y="52" fontSize="16" textAnchor="middle" fontFamily="apple color emoji,sans-serif">💡</text>

      {/* HMW text */}
      <text x="62" y="44" fontSize="12" fontWeight="600" fill={LBL} fontFamily={SFD}
        letterSpacing="-0.02em">Comment permettre à un marchand</text>
      <text x="62" y="60" fontSize="12" fontWeight="600" fill={LBL} fontFamily={SFD}
        letterSpacing="-0.02em">de s&apos;activer seul en moins de 15 min ?</text>

      {/* ── Section 2 : Insights — grouped list ── */}
      <text x="28" y="98" fontSize="11" fontWeight="600" letterSpacing="0.01em"
        fill={LBL2} fontFamily={SF}>Insights clés</text>

      {/* Grouped list card */}
      <rect x="12" y="104" width="410" height="96" rx="10" fill={CARD} />

      {cells.map(({ icon, iconBg, title, sub }, i) => {
        const y = 104 + i * 32;
        return (
          <g key={i}>
            {/* inset separator (not on first cell) */}
            {i > 0 && (
              <line x1="56" y1={y} x2="412" y2={y}
                stroke={SEP} strokeWidth="0.33" />
            )}
            {/* SF Symbol–style app icon */}
            <rect x="18" y={y + 7} width="24" height="24" rx="6"
              fill={iconBg} />
            <text x="30" y={y + 23} fontSize="13" textAnchor="middle"
              fontFamily="apple color emoji,sans-serif">{icon}</text>
            {/* Title */}
            <text x="52" y={y + 16} fontSize="13" fontWeight="400" fill={LBL}
              fontFamily={SF} letterSpacing="-0.01em">{title}</text>
            {/* Subtitle */}
            <text x="52" y={y + 29} fontSize="11" fill={LBL2}
              fontFamily={SF}>{sub}</text>
          </g>
        );
      })}

      {/* ── Caption ── */}
      <text x="217" y="207" fontSize="9" fill={LBL3} textAnchor="middle"
        fontFamily={SF} letterSpacing="0.02em">Insights · Question HMW</text>
    </svg>
  );
}

/* Phase 3 — Idéation : User Journey Map + User Flow */
function DeliverableIdeation() {
  const [tab,       setTab]       = useState<"journey" | "flow">("journey");
  const [modalOpen, setModalOpen] = useState(false);

  const LBL2 = "rgba(60,60,67,0.60)";
  const SEP  = "rgba(60,60,67,0.10)";

  const steps = [
    { phase:"Collecte",    action:"Saisit SIRET, raison sociale", emotion:"😤", pain:"Formulaire long",      bad:true  },
    { phase:"Documents",   action:"Envoie KBIS, CGU par email",   emotion:"😟", pain:"Format non évident",   bad:true  },
    { phase:"Attente ADV", action:"ADV ressaisit dans le BO",     emotion:"😒", pain:"Bloqué 2 à 5 jours",  bad:true  },
    { phase:"Validation",  action:"ADV coche · BO mis à jour",    emotion:"😐", pain:"Opaque pour le march.",bad:true  },
    { phase:"Activation",  action:"Peut enfin encaisser",         emotion:"🎉", pain:"Trop long",            bad:true  },
  ];

  return (
    <>
      <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden",
        padding: "12px 12px 14px" }}>
        {/* Segmented control */}
        <div style={{ display: "flex", background: "rgba(0,0,0,0.06)", borderRadius: 8,
          padding: 2, marginBottom: 12 }}>
          {([["journey","User Journey Map"],["flow","User Flow"]] as const).map(([t,lbl]) => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex: 1, padding: "5px 8px", borderRadius: 6, border: "none",
                background: tab === t ? "#fff" : "transparent",
                color: tab === t ? "#000" : LBL2,
                fontSize: 12, fontWeight: tab === t ? 600 : 400, cursor: "pointer",
                boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
                transition: "all .15s", fontFamily: "var(--font-sans)" }}>
              {lbl}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.18, ease: SP }}>

            {tab === "journey" ? (
              /* ── User Journey Map ── */
              <div>
                {/* Étapes horizontales */}
                <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ flex: 1, background: "#fff", borderRadius: 8,
                      padding: "8px 6px", textAlign: "center",
                      border: `1px solid ${SEP}`, position: "relative" }}>
                      {i < steps.length - 1 && (
                        <div style={{ position: "absolute", right: -7, top: "50%",
                          transform: "translateY(-50%)", fontSize: 10,
                          color: "rgba(0,0,0,0.25)", zIndex: 1 }}>→</div>
                      )}
                      <div style={{ fontSize: 18, marginBottom: 4, lineHeight: 1 }}>{s.emotion}</div>
                      <p style={{ fontSize: 9, fontWeight: 700, color: "#000",
                        margin: "0 0 2px", fontFamily: "var(--font-sans)" }}>{s.phase}</p>
                      <p style={{ fontSize: 8, color: LBL2, margin: 0,
                        fontFamily: "var(--font-sans)", lineHeight: 1.3 }}>{s.action}</p>
                    </div>
                  ))}
                </div>
                {/* Ligne de friction */}
                <div style={{ background: "#fff", borderRadius: 8, padding: "8px 10px",
                  border: `1px solid ${SEP}` }}>
                  <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.09em",
                    textTransform: "uppercase", color: LBL2, margin: "0 0 6px",
                    fontFamily: MONO }}>Points de friction</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    {steps.map((s, i) => (
                      <div key={i} style={{ flex: 1, textAlign: "center" }}>
                        <span style={{ fontSize: 8, padding: "2px 5px", borderRadius: 4,
                          background: s.bad ? "rgba(220,38,38,0.08)" : "rgba(52,199,89,0.10)",
                          color: s.bad ? "#DC2626" : "#059669",
                          border: `1px solid ${s.bad ? "rgba(220,38,38,0.2)" : "rgba(52,199,89,0.25)"}`,
                          fontFamily: "var(--font-sans)", lineHeight: 1.4,
                          display: "inline-block" }}>
                          {s.pain}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* ── User Flow ── */
              <div>
                <div style={{ borderRadius: 8, overflow: "hidden", marginBottom: 8,
                  border: `1px solid ${SEP}`, background: "#fff" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/onboarding/user-flow.png" alt="User flow : processus d'onboarding marchand"
                    style={{ width: "100%", display: "block", objectFit: "cover",
                      maxHeight: 160 }} />
                </div>
                <button onClick={() => setModalOpen(true)}
                  style={{ width: "100%", padding: "7px 0", borderRadius: 8,
                    background: VIO_L, color: VIO, border: `1px solid ${VIO}22`,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    fontFamily: "var(--font-sans)", display: "flex",
                    alignItems: "center", justifyContent: "center", gap: 5 }}>
                  Voir le schéma complet
                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                    <path d="M2 9L9 2M9 2H4M9 2V7" stroke={VIO} strokeWidth="1.4"
                      strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal plein écran user flow */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setModalOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 9999,
              background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24 }}>
            <motion.div
              initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }}
              transition={{ duration: 0.22, ease: SP }}
              onClick={e => e.stopPropagation()}
              style={{ position: "relative", borderRadius: 16, overflow: "hidden",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)", maxWidth: "92vw", maxHeight: "88vh" }}>
              <button onClick={() => setModalOpen(false)}
                style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32,
                  borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none",
                  color: "#fff", fontSize: 16, cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center", zIndex: 1 }}>✕</button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/onboarding/user-flow.png" alt="User flow complet"
                style={{ display: "block", maxWidth: "90vw", maxHeight: "85vh",
                  objectFit: "contain", background: "#fff" }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Phase 4 — Prototype : vrais écrans du flow onboarding */
function DeliverablePrototype() {
  const [tab, setTab] = useState<"compte" | "documents" | "confirmation">("compte");
  const stepMap = { compte: 1, documents: 3, confirmation: 6 } as const;
  const SF = "var(--font-sans)";

  const TABS = [
    { id: "compte",       label: "Compte"       },
    { id: "documents",    label: "Documents"    },
    { id: "confirmation", label: "Confirmation" },
  ] as const;

  return (
    <div style={{ background: OBL, borderRadius: 10, overflow: "hidden" }}>
      {/* Barre macOS */}
      <div style={{ height: 32, background: "#EBEBEB", borderBottom: `1px solid rgba(0,0,0,0.08)`,
        display: "flex", alignItems: "center", padding: "0 12px", gap: 6 }}>
        {[{f:"#FF5F57",s:"#E0443E"},{f:"#FFBD2E",s:"#DEA123"},{f:"#28C840",s:"#1DAD2B"}].map(({f,s},i)=>(
          <div key={i} style={{ width:10,height:10,borderRadius:"50%",background:f,boxShadow:`0 0 0 0.5px ${s}` }} />
        ))}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ padding: "2px 12px", background: "rgba(255,255,255,0.88)",
            border: "1px solid rgba(0,0,0,0.10)", borderRadius: 5 }}>
            <span style={{ fontFamily: MONO, fontSize: 10, color: "rgba(0,0,0,0.38)" }}>
              app.paynow.fr/onboarding
            </span>
          </div>
        </div>
        <div style={{ width: 52 }} />
      </div>

      {/* Barre onglets */}
      <div style={{ display: "flex", background: "#fff", borderBottom: `1px solid ${OBE}` }}>
        {TABS.map(({ id, label }) => (
          <button key={id} onClick={() => setTab(id)}
            style={{
              padding: "6px 14px", border: "none", cursor: "pointer",
              fontFamily: SF, fontSize: 10, fontWeight: tab === id ? 600 : 400,
              background: "transparent",
              color: tab === id ? OBB : OBS,
              borderBottom: tab === id ? `2px solid ${OBB}` : "2px solid transparent",
              transition: "color 150ms, border-color 150ms",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Écran */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18, ease: SP }}
          style={{ display: "flex", height: 300, overflow: "hidden" }}>
          <ObSidebar step={stepMap[tab]} />
          {tab === "compte"       && <ObAccount />}
          {tab === "documents"    && <ObDocuments />}
          {tab === "confirmation" && <ObConfirmation />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* Phase 5 — Test : métriques + tableau résultats */
function DeliverableTest() {
  const SF  = "var(--font-sans)";
  const SEP = "rgba(60,60,67,0.10)";

  const metrics = [
    { value: "12 min", label: "Temps moyen",        sub: "vs 45 min en manuel"        },
    { value:    "82 %", label: "Compréhension",      sub: "4/5 tâches sans aide"       },
    { value:   "−65 %", label: "Appels au support",  sub: "Requêtes ouvertes post-act." },
  ];

  const rows = [
    { tâche: "Trouver son SIRET",         ok: true,  friction: "Aucune"      },
    { tâche: "Uploader le KBIS",          ok: true,  friction: "Format PDF"  },
    { tâche: "Ajouter un bénéficiaire",   ok: false, friction: "Terme «UBO»" },
    { tâche: "Comprendre le récap final", ok: true,  friction: "Aucune"      },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden",
      padding: "12px 12px 14px" }}>

      {/* Métriques clés */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        {metrics.map(({ value, label, sub }) => (
          <div key={label} style={{ flex: 1, background: "#fff", borderRadius: 10,
            padding: "10px 8px", border: `1px solid ${SEP}`, textAlign: "center" }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#34C759",
              margin: "0 0 3px", fontFamily: SF, letterSpacing: "-0.03em" }}>{value}</p>
            <p style={{ fontSize: 9, fontWeight: 600, color: "#000",
              margin: "0 0 2px", fontFamily: SF, lineHeight: 1.2 }}>{label}</p>
            <p style={{ fontSize: 8, color: "rgba(60,60,67,0.5)",
              margin: 0, fontFamily: SF }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Tableau tâches */}
      <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden",
        border: `1px solid ${SEP}`, marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto",
          padding: "5px 12px", background: VIO_L, gap: 8 }}>
          {["Tâche testée", "Résultat", "Friction"].map(h => (
            <p key={h} style={{ margin: 0, fontSize: 8, fontWeight: 700,
              letterSpacing: "0.09em", color: VIO, textTransform: "uppercase",
              fontFamily: MONO }}>{h}</p>
          ))}
        </div>
        {rows.map(({ tâche, ok, friction }, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto",
            padding: "7px 12px", gap: 8, alignItems: "center",
            borderTop: i > 0 ? `0.5px solid ${SEP}` : "none" }}>
            <p style={{ margin: 0, fontSize: 10, color: "#000", fontFamily: SF }}>{tâche}</p>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4,
              background: ok ? "rgba(52,199,89,0.10)" : "rgba(220,38,38,0.08)",
              color: ok ? "#059669" : "#DC2626" }}>{ok ? "✓ OK" : "✗"}</span>
            <span style={{ fontSize: 8, color: friction === "Aucune" ? "#059669" : "#DC2626",
              fontFamily: SF, whiteSpace: "nowrap" }}>{friction}</span>
          </div>
        ))}
      </div>

      {/* Itération */}
      <div style={{ padding: "7px 10px", borderRadius: 8,
        background: "rgba(52,199,89,0.07)", border: "1px solid rgba(52,199,89,0.2)" }}>
        <p style={{ margin: 0, fontSize: 9, color: "#059669", fontFamily: SF }}>
          → Itération : «&nbsp;UBO&nbsp;» → «&nbsp;Représentant légal détenant +25&nbsp;%&nbsp;»
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PHASES DESIGN THINKING
   ═══════════════════════════════════════════════════════════════════ */
const PHASES = [
  {
    id: "01", label: "Empathie",
    livrable: "Interviews (×4 équipes) · Empathy Map",
    Livrable: DeliverableEmpathie,
    items: [
      { n:"01", t:"Interviews (×4 équipes)", s:"Partenariats, marchands, ADV et conformité : chaque partie prenante a ses propres contraintes. Les partenaires imposent des critères d'éligibilité, les marchands veulent aller vite, l'ADV est submergée de relances manuelles." },
      { n:"02", t:"Empathy Map", s:"Synthèse centrée marchand : ce qu'il dit, pense, fait et ressent lors de l'onboarding. Révèle la tension entre urgence d'activation et méfiance vis-à-vis des données sensibles demandées.", c: VIO },
    ],
  },
  {
    id: "02", label: "Définition",
    livrable: "Insights · Question HMW · Critères de succès",
    Livrable: DeliverableDefinition,
    items: [
      { n:"01", t:"Problème central", s:"L'onboarding manuel crée un goulot d'étranglement : lent pour le marchand, coûteux pour l'ADV, et moins compétitif que les concurrents qui proposent une activation quasi-instantanée." },
      { n:"02", t:"Contrainte réglementaire comme cadre", s:"La conformité KYB n'est pas une contrainte à contourner ; c'est le cadre qui donne de la légitimité au flux. Expliquer pourquoi une donnée est demandée réduit la friction mieux que de la masquer." },
      { n:"03", t:"Données sensibles : enjeu de confiance", s:"SIRET, KBIS, RIB, pièce d'identité du dirigeant : chaque champ doit être accompagné d'une explication simple et d'un signal de sécurité visible. L'UX de la confiance se conçoit, elle ne s'improvise pas." },
    ],
  },
  {
    id: "03", label: "Idéation",
    livrable: "User Journey Map · User Flow",
    Livrable: DeliverableIdeation,
    items: [
      { n:"01", t:"User Journey Map", s:"Cartographie de l'expérience marchand en 5 phases : collecte d'infos, documents, identité UBO, récap et activation. Révèle les moments de friction et les émotions à chaque étape." },
      { n:"02", t:"User Flow", s:"Schéma du flux complet : chemins nominaux, cas d'erreur (SIRET introuvable, document refusé, UBO manquant), règles de progression et points de sauvegarde automatique.", c: VIO },
    ],
  },
  {
    id: "04", label: "Prototype",
    livrable: "Wireframes · Maquettes haute fidélité · Design system",
    Livrable: DeliverablePrototype,
    items: [
      { n:"01", t:"Wireframes basse fidélité", s:"Exploration des patterns de progression (stepper latéral vs. stepper horizontal), des zones d'upload, et de la hiérarchie des informations de conformité." },
      { n:"02", t:"Maquettes haute fidélité", s:"Intégration dans le design system PayNow existant. Chaque écran reprend les composants établis : champs, boutons, toasts, modales, cohérence garantie avec le back-office." },
      { n:"03", t:"UX de la confiance", s:"Tooltips légaux inline pour chaque document requis, badge « Données chiffrées SSL », et résumé de l'utilisation des données avant chaque champ sensible." },
      { n:"04", t:"États de l'interface", s:"Chaque champ a ses états : vide, en cours, validé, en erreur, en attente de vérification. Le retour visuel est immédiat ; le marchand sait toujours où il en est.", c: VIO },
    ],
  },
  {
    id: "05", label: "Test",
    livrable: "Métriques · Tableau de résultats · Itérations",
    Livrable: DeliverableTest,
    items: [
      { n:"01", t:"Temps d'onboarding", s:"Mesuré sur 5 sessions enregistrées en staging. Temps moyen : 12 minutes, contre 3 à 4 jours pour le process manuel, soit une réduction de 97 % du délai d'activation." },
      { n:"02", t:"Taux de compréhension", s:"82 % des tâches réalisées sans aide ni relecture. Friction principale : le terme « UBO » non compris par aucun marchand testé." },
      { n:"03", t:"Appels au support : requêtes ouvertes", s:"Baisse de 65 % des sollicitations après livraison. Le self-service a absorbé la majorité des cas simples (SIRET, KBIS, documents PDF).", c: VIO },
    ],
  },
];

function PhasePanel({ items }: { items: { n: string; t: string; s: string; c?: string }[] }) {
  return (
    <div>
      {items.map((m, i) => (
        <div key={m.n} style={{ display: "flex", gap: "var(--sp-4)", alignItems: "flex-start",
          paddingBottom: "var(--sp-4)", marginBottom: "var(--sp-4)",
          borderBottom: i < items.length - 1 ? `1px solid ${BORD}` : "none" }}>
          <span className="hig-caption2" style={{ fontWeight: 700, color: m.c ?? VIO,
            fontFamily: MONO, flexShrink: 0, minWidth: 20 }}>{m.n}</span>
          <div>
            <p className="hig-callout" style={{ fontWeight: 500, color: INK, margin: "0 0 3px" }}>{m.t}</p>
            <p className="hig-footnote" style={{ color: m.c ? m.c : INK3, margin: 0,
              fontWeight: m.c ? 600 : 400 }}>{m.s}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Frise Design Thinking — composant partagé ProcessFrise ──────────── */
function DesignThinkingFrise() {
  const phases = PHASES.map(p => ({ id: p.id, label: p.label, livrable: p.livrable }));
  return (
    <ProcessFrise
      phases={phases}
      renderPanel={(id) => {
        const phase = PHASES.find(p => p.id === id)!;
        const { Livrable, items } = phase;
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "var(--sp-8)", alignItems: "start" }}>
            <PhasePanel items={items} />
            <div>
              <p className="hig-caption2" style={{ fontWeight: 700, letterSpacing: "0.12em",
                textTransform: "uppercase", color: INK3, fontFamily: MONO,
                marginBottom: "var(--sp-3)" }}>Livrable</p>
              <div style={{ borderRadius: 12, border: `1px solid ${BORD}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <Livrable />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ÉCRANS CLÉS — Mockup interactif du flow onboarding
   ═══════════════════════════════════════════════════════════════════ */
const OB_TABS = [
  { id: "compte",       label: "Création du compte" },
  { id: "documents",    label: "Documents KYC"      },
  { id: "confirmation", label: "Confirmation"        },
];

/* Sidebar claire style Stripe Connect — bord gauche bleu sur l'étape active */
function ObSidebar({ step }: { step: number }) {
  const steps = [
    "Création du compte", "Votre entreprise",
    "Documents KYC", "Coordonnées bancaires",
    "Configuration", "Confirmation",
  ];
  return (
    <div style={{ width: 168, background: OBL, borderRight: `1px solid ${OBE}`,
      padding: "18px 0", display: "flex", flexDirection: "column", flexShrink: 0 }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 16px", marginBottom: 24 }}>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: OBB,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontWeight: 900, fontSize: 11, color: "#fff" }}>P</span>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 700, color: OBP }}>PayNow</span>
      </div>

      <div style={{ height: 1, background: OBE, marginBottom: 16 }} />

      {/* Steps */}
      {steps.map((s, i) => {
        const done   = i + 1 < step;
        const active = i + 1 === step;
        return (
          <div key={s} style={{
            display: "flex", alignItems: "center", gap: 9,
            padding: "7px 16px",
            borderLeft: active ? `2.5px solid ${OBB}` : "2.5px solid transparent",
            background: active ? "#EEF4FF" : "transparent",
          }}>
            {/* Indicateur */}
            <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: done   ? "#DCFCE7"
                        : active ? OBB
                        : "#fff",
              border: done   ? "1.5px solid #86EFAC"
                     : active ? `1.5px solid ${OBB}`
                     : `1.5px solid ${OBE}`,
            }}>
              {done
                ? <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1 4l2.5 2.5L7 1.5" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>
                : active
                  ? <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
                  : <span style={{ fontSize: 7.5, fontWeight: 600, color: OBS }}>{i + 1}</span>
              }
            </div>
            <span style={{ fontSize: 10, lineHeight: 1.3,
              fontWeight: active ? 600 : 400,
              color: done ? "#94A3B8" : active ? OBP : OBS }}>
              {s}
            </span>
          </div>
        );
      })}

      {/* Footer */}
      <div style={{ marginTop: "auto", padding: "12px 16px 0",
        borderTop: `1px solid ${OBE}`, display: "flex", alignItems: "center", gap: 5 }}>
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
          <rect x="1" y="4" width="7" height="4.5" rx="1" stroke="#94A3B8" strokeWidth="1"/>
          <path d="M2.5 4V3a2 2 0 014 0v1" stroke="#94A3B8" strokeWidth="1"/>
        </svg>
        <span style={{ fontSize: 8, color: "#94A3B8" }}>Connexion sécurisée · TLS 1.3</span>
      </div>
    </div>
  );
}

/* Création du compte — style Stripe */
function ObAccount() {
  return (
    <div style={{ flex: 1, padding: "22px 24px", background: "#fff",
      display: "flex", flexDirection: "column", overflow: "hidden" }}>

      {/* Progress */}
      <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
        {[1,2,3,4,5,6].map(n => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 2,
            background: n === 1 ? OBB : OBE }} />
        ))}
      </div>

      <span style={{ fontSize: 8, fontWeight: 600, color: OBB,
        letterSpacing: "0.1em", marginBottom: 4 }}>ÉTAPE 1 SUR 6</span>
      <p style={{ fontSize: 13, fontWeight: 700, color: OBP, margin: "0 0 2px" }}>Création du compte</p>
      <p style={{ fontSize: 9, color: OBS, margin: "0 0 16px" }}>Renseignez vos informations de connexion</p>

      {/* Email */}
      <label style={{ fontSize: 9, fontWeight: 500, color: OBP, marginBottom: 4, display: "block" }}>
        Email professionnel
      </label>
      <div style={{ padding: "7px 10px", borderRadius: 6,
        border: `1.5px solid ${OBB}`, background: "#FAFBFF",
        fontSize: 10, color: OBP, marginBottom: 12, boxShadow: `0 0 0 3px ${OBLL}` }}>
        marc.durand@distrib-europe.fr
      </div>

      {/* Passwords */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {["Mot de passe", "Confirmer"].map(l => (
          <div key={l} style={{ flex: 1 }}>
            <label style={{ fontSize: 9, fontWeight: 500, color: OBP, marginBottom: 4, display: "block" }}>{l}</label>
            <div style={{ padding: "7px 10px", borderRadius: 6, border: `1px solid ${OBE}`,
              background: "#fff", fontSize: 10, color: OBP, letterSpacing: 3 }}>••••••••</div>
          </div>
        ))}
      </div>

      {/* CGU */}
      <div style={{ display: "flex", gap: 8, padding: "7px 10px", borderRadius: 6,
        background: OBLL, border: `1px solid #C7DEFF`, marginBottom: "auto" }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: OBB, flexShrink: 0, marginTop: 1,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="7" height="7" viewBox="0 0 7 7"><path d="M1 3.5l2 2 3-3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" fill="none"/></svg>
        </div>
        <span style={{ fontSize: 8.5, color: OBS, lineHeight: 1.6 }}>
          J&apos;accepte les <span style={{ color: OBB, fontWeight: 500 }}>Conditions d&apos;utilisation</span> et la <span style={{ color: OBB, fontWeight: 500 }}>Politique de confidentialité</span>
        </span>
      </div>

      {/* Actions */}
      <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ padding: "7px 18px", borderRadius: 6, background: OBB,
          color: "#fff", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          Continuer
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

/* Documents KYC — dropzone style Stripe */
function ObDocuments() {
  const docs = [
    { label: "Extrait Kbis",            file: "kbis_distrib.pdf", done: true  },
    { label: "Pièce d'identité",        file: "cni_durand.jpg",   done: true  },
    { label: "Justificatif de domicile",                           done: false },
    { label: "RIB de l'entreprise",     file: "rib_distrib.pdf",  done: true  },
  ];
  return (
    <div style={{ flex: 1, padding: "22px 24px", background: "#fff",
      display: "flex", flexDirection: "column", overflow: "hidden" }}>

      <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
        {[1,2,3,4,5,6].map(n => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 2,
            background: n <= 3 ? OBB : OBE }} />
        ))}
      </div>

      <span style={{ fontSize: 8, fontWeight: 600, color: OBB, letterSpacing: "0.1em", marginBottom: 4 }}>ÉTAPE 3 SUR 6</span>
      <p style={{ fontSize: 13, fontWeight: 700, color: OBP, margin: "0 0 2px" }}>Documents KYC</p>
      <p style={{ fontSize: 9, color: OBS, margin: "0 0 12px" }}>Requis par la réglementation LCB-FT · Vérification sous 24h ouvrées</p>

      {/* Info banner */}
      <div style={{ display: "flex", gap: 7, padding: "6px 10px", borderRadius: 6,
        background: OBLL, border: `1px solid #C7DEFF`, marginBottom: 12 }}>
        <span style={{ fontSize: 9, color: OBB, flexShrink: 0 }}>ⓘ</span>
        <span style={{ fontSize: 8, color: OBS, lineHeight: 1.6 }}>
          Requis par la réglementation LCB-FT · Vérification sous 24h ouvrées
        </span>
      </div>

      {docs.map((d) => (
        <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8,
          padding: "7px 10px", borderRadius: 6, marginBottom: 6,
          border: `1px solid ${d.done ? "#BBF7D0" : OBE}`,
          background: d.done ? "#F0FDF4" : "#fff" }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: d.done ? "#DCFCE7" : OBL, border: `1px solid ${d.done ? "#86EFAC" : OBE}` }}>
            {d.done
              ? <svg width="9" height="9" viewBox="0 0 9 9"><path d="M1 4.5l2.5 2.5L8 1.5" stroke="#16A34A" strokeWidth="1.6" strokeLinecap="round" fill="none"/></svg>
              : <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 7V2M2 4.5l2.5-2.5 2.5 2.5" stroke={OBS} strokeWidth="1.3" strokeLinecap="round"/></svg>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 8.5, fontWeight: 500, color: OBP, margin: 0 }}>{d.label}</p>
            <p style={{ fontSize: 7.5, color: d.done ? "#16A34A" : "#94A3B8", margin: 0 }}>
              {d.done ? d.file : "Cliquer pour déposer · PDF, JPG, PNG · 10 Mo max"}
            </p>
          </div>
          {d.done && <span style={{ fontSize: 7.5, color: "#94A3B8", flexShrink: 0 }}>234 Ko</span>}
        </div>
      ))}
    </div>
  );
}

/* Confirmation — style Stripe success */
function ObConfirmation() {
  return (
    <div style={{ flex: 1, padding: "22px 24px", background: "#fff",
      display: "flex", flexDirection: "column" }}>

      <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
        {[1,2,3,4,5,6].map(n => (
          <div key={n} style={{ flex: 1, height: 3, borderRadius: 2, background: OBB }} />
        ))}
      </div>

      {/* Success badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
        padding: "10px 14px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#DCFCE7",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="7.5" fill="#16A34A" />
            <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: OBP, margin: "0 0 1px" }}>Dossier soumis avec succès</p>
          <p style={{ fontSize: 8.5, color: OBS, margin: 0 }}>DISTRIB EUROPE SAS · Réf. ON-2024-8471</p>
        </div>
      </div>

      <p style={{ fontSize: 9, color: OBS, margin: "0 0 12px", lineHeight: 1.6 }}>
        Votre dossier est en cours de vérification. Vous recevrez une confirmation par email sous <strong style={{ color: OBP }}>1 à 2 jours ouvrés</strong>.
      </p>

      {[
        { label: "Informations légales", status: "Vérifiées",   dot: "#16A34A", bg: "#F0FDF4" },
        { label: "Documents KYC",        status: "En cours",    dot: "#D97706", bg: "#FFFBEB" },
        { label: "Vérification IBAN",    status: "En attente",  dot: "#94A3B8", bg: "#F8FAFC" },
      ].map((row) => (
        <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "7px 10px", borderRadius: 6, background: row.bg,
          border: `1px solid ${OBE}`, marginBottom: 5 }}>
          <span style={{ fontSize: 9, color: OBP }}>{row.label}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: row.dot }} />
            <span style={{ fontSize: 9, fontWeight: 600, color: row.dot }}>{row.status}</span>
          </div>
        </div>
      ))}

      <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
        <div style={{ padding: "7px 16px", borderRadius: 6, background: OBB,
          color: "#fff", fontSize: 10, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
          Accéder au tableau de bord
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function OBFocusList({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div>
      {items.map((o, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: "var(--sp-2)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: VIO, flexShrink: 0, marginTop: 6 }} />
          <div>
            <p className="hig-callout" style={{ fontWeight: 500, color: INK, margin: "0 0 2px" }}>{o.t}</p>
            <p className="hig-footnote" style={{ color: INK3, margin: 0 }}>{o.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const OB_ITEMS_COMPTE = [
  { t: "Formulaire en 3 champs",       d: "SIREN, e-mail professionnel, mot de passe. Aucune information superflue à la première étape." },
  { t: "Indicateur de progression",    d: "Barre d'étapes visible : le marchand sait où il en est et combien d'étapes restent." },
  { t: "Feedback inline",              d: "Erreurs signalées au niveau du champ concerné, avec un message explicite sur la correction attendue." },
];
const OB_ITEMS_DOCUMENTS = [
  { t: "Motif affiché par document",   d: "Pourquoi ce document est-il requis ? Une ligne suffit à lever la méfiance et éviter l'abandon." },
  { t: "Cadre légal visible",           d: "\"Requis par la réglementation LCB-FT · Vérification sous 24h ouvrées\" affiché : signal de confiance et de clarté réglementaire." },
  { t: "Statut par pièce",             d: "Reçu, en attente, refusé : chaque document a un état clair pour éviter les relances support." },
];
const OB_ITEMS_CONFIRMATION = [
  { t: "Délai communiqué",             d: "\"Vérification sous 24h\" affiché dès la soumission : supprimer l'incertitude post-dépôt." },
  { t: "Prochaines étapes explicites", d: "Ce qui va se passer, dans quel ordre, sans que le marchand ait à le demander." },
  { t: "Accès partiel immédiat",       d: "Navigation possible pendant la vérification : réduit l'impatience et les contacts support." },
];

function FocusCompte() {
  return (
    <div className="cs-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color: INK2, marginBottom: "var(--sp-5)", lineHeight: 1.6 }}>
          Première impression décisive. L&apos;objectif : collecter le minimum vital pour activer le compte, sans friction ni abandon.
        </p>
        <OBFocusList items={OB_ITEMS_COMPTE} />
      </div>
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: `1px solid ${BORD}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", height: 300 }}>
          <ObSidebar step={1} />
          <ObAccount />
        </div>
      </div>
    </div>
  );
}

function FocusDocuments() {
  return (
    <div className="cs-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color: INK2, marginBottom: "var(--sp-5)", lineHeight: 1.6 }}>
          Étape souvent abandonnée. L&apos;enjeu : rendre la collecte documentaire KYB compréhensible et rassurante pour le marchand.
        </p>
        <OBFocusList items={OB_ITEMS_DOCUMENTS} />
      </div>
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: `1px solid ${BORD}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", height: 300 }}>
          <ObSidebar step={3} />
          <ObDocuments />
        </div>
      </div>
    </div>
  );
}

function FocusConfirmation() {
  return (
    <div className="cs-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sp-6)" }}>
      <div>
        <p className="hig-body" style={{ color: INK2, marginBottom: "var(--sp-5)", lineHeight: 1.6 }}>
          L&apos;incertitude post-soumission est le premier motif de contact support. Cette étape la supprime.
        </p>
        <OBFocusList items={OB_ITEMS_CONFIRMATION} />
      </div>
      <div style={{ borderRadius: "var(--r-lg)", overflow: "hidden", border: `1px solid ${BORD}`,
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", height: 300 }}>
          <ObSidebar step={6} />
          <ObConfirmation />
        </div>
      </div>
    </div>
  );
}

function OnboardingScreensSection() {
  const [active, setActive] = useState<"compte" | "documents" | "confirmation">("compte");
  return (
    <div>
      <div style={{
        display: "inline-flex", background: "var(--color-bg-secondary)",
        borderRadius: "var(--r-lg)", padding: 3,
        border: `1px solid ${BORD}`, marginBottom: "var(--sp-5)",
      }}>
        {OB_TABS.map((t) => (
          <motion.button key={t.id} onClick={() => setActive(t.id as typeof active)}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: SP }}
            className="hig-footnote"
            style={{
              padding: "6px 18px", borderRadius: "var(--r-md)",
              fontWeight: active === t.id ? 600 : 400, cursor: "pointer", border: "none",
              background: active === t.id ? BG : "transparent",
              color: active === t.id ? INK : INK3,
              boxShadow: active === t.id ? "0 1px 4px rgba(0,0,0,0.10), 0 0.5px 1px rgba(0,0,0,0.06)" : "none",
              transition: "color 150ms, background 150ms, box-shadow 150ms",
              letterSpacing: "var(--ls-title2)", whiteSpace: "nowrap" as const,
            }}>{t.label}</motion.button>
        ))}
      </div>

      <div style={{ background: BG, border: `1px solid ${BORD}`,
        borderRadius: "var(--r-xl)", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8,
          padding: "var(--sp-4) var(--sp-6)", borderBottom: `1px solid ${BORD}` }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: VIO }} />
          <span className="hig-caption2" style={{ fontWeight: 700, color: VIO,
            letterSpacing: "0.12em", textTransform: "uppercase" as const, fontFamily: MONO }}>
            {OB_TABS.find(t => t.id === active)?.label}
          </span>
        </div>
        <div style={{ padding: "var(--sp-6)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: SP }}>
              {active === "compte"       && <FocusCompte />}
              {active === "documents"    && <FocusDocuments />}
              {active === "confirmation" && <FocusConfirmation />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function OnboardingPage() {
  return (
    <div style={{ fontFamily: "var(--font-inter, var(--font-sans))",
      backgroundColor: BG, color: INK, colorScheme: "light" }}>
      <PortfolioHeader />
      <div style={{ paddingTop: 60 }}>

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: BG, borderBottom: `1px solid ${BORD}`,
          padding: "var(--sp-20) var(--sp-8) 72px", position: "relative", isolation: "isolate", overflow: "hidden" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div className="cs-hero-grid" style={{ display: "grid",
              gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "flex-start" }}>

              <div>
                {/* Fil d'Ariane */}
                {C.hero.showBreadcrumb && <CaseBreadcrumb label="Onboarding marchands" />}
                {C.hero.showBadge && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08, duration: 0.5 }} style={{ marginBottom: "var(--sp-4)" }}>
                  <Badge color="purple" size="sm">{C.hero.badge as string}</Badge>
                </motion.div>
                )}

                <h1 style={{ fontSize: "clamp(40px,5.5vw,72px)", fontWeight: 200,
                  lineHeight: 1.0, letterSpacing: "-0.02em", color: INK, margin: "0 0 14px 0" }}>
                  {[C.hero.titleLine1, C.hero.titleLine2].map((w, i) => (
                    <motion.span key={i}
                      initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.16 + i * 0.12, duration: 0.72, ease: SP }}
                      style={{ display: "block" }}>
                      {w}
                    </motion.span>
                  ))}
                </h1>

                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.52, duration: 0.6, ease: SP }}
                  style={{ fontSize: "clamp(17px,2.4vw,26px)", fontWeight: 300,
                    color: VIO, letterSpacing: "-0.01em", marginBottom: 24 }}>
                  {C.hero.accentLine}
                </motion.p>

                <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68, duration: 0.6, ease: SP }}
                  style={{ fontSize: 16, color: INK2, lineHeight: 1.75,
                    maxWidth: 480, marginBottom: 36 }}>
                  {C.hero.subtitle}
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.86, duration: 0.6, ease: SP }}
                  style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["UX Research", "Self-Onboarding", "KYB / Conformité", "Fintech"].map(tag => (
                    <span key={tag} className="badge-neutral hig-caption2" style={{ display:"inline-flex",
                      alignItems:"center", padding:"4px 12px", borderRadius:"var(--r-full)", fontWeight:500 }}>{tag}</span>
                  ))}
                </motion.div>
              </div>

              {/* Visuel hero */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.9, ease: SP }}
                whileHover={{ y: -6 }}
                className="cs-perspective-wrap"
                style={{ transform: "perspective(1200px) rotateY(-3deg) rotateX(1deg)" }}>
                <div style={{
                  borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 24px 64px rgba(59,130,246,0.16), 0 4px 16px rgba(0,0,0,0.08)",
                  border: `1px solid ${BORD}`,
                }}>
                  {/* Barre macOS */}
                  <div style={{ height: 36, background: "#EBEBEB",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    display: "flex", alignItems: "center", padding: "0 14px", gap: 6 }}>
                    {[{f:"#FF5F57",s:"#E0443E"},{f:"#FFBD2E",s:"#DEA123"},{f:"#28C840",s:"#1DAD2B"}].map(({f,s},i)=>(
                      <div key={i} style={{ width:12,height:12,borderRadius:"50%",
                        background:f,boxShadow:`0 0 0 0.5px ${s}` }} />
                    ))}
                    <div style={{ flex:1, display:"flex", justifyContent:"center" }}>
                      <div style={{ padding:"2px 14px", background:"rgba(255,255,255,0.88)",
                        border:"1px solid rgba(0,0,0,0.10)", borderRadius:6 }}>
                        <span style={{ fontFamily:"monospace", fontSize:11, color:"rgba(0,0,0,0.38)" }}>
                          app.paynow.fr/onboarding
                        </span>
                      </div>
                    </div>
                    <div style={{ width:54 }} />
                  </div>
                  {/* Écran */}
                  <div className="cs-iframe-wrap" style={{ display:"flex", height:340 }}>
                    <ObSidebar step={1} />
                    <ObAccount />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ══ INFO STRIP ════════════════════════════════════════════════ */}
        <section style={{ borderBottom: `1px solid ${BORD}`, background: SURF }}>
          <div className="cs-info-strip" style={{ maxWidth: 1160, margin: "0 auto",
            padding: "0 32px", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
            {[
              { label: "Secteur",   value: "Fintech / Paiement" },
              { label: "Mon rôle",  value: "UX Designer"        },
              { label: "Contexte",  value: "Alternance"         },
              { label: "Livrables", value: "Flux + Écrans clés" },
            ].map((p, i) => (
              <div key={p.label} style={{ padding: "22px var(--sp-6)",
                borderRight: i < 3 ? `1px solid ${BORD}` : "none" }}>
                <p className="hig-caption2" style={{ fontWeight: 700, color: VIO,
                  letterSpacing: "0.14em", textTransform: "uppercase" as const,
                  fontFamily: MONO, margin: "0 0 6px" }}>{p.label}</p>
                <p className="hig-title3" style={{ fontWeight: 300, color: INK, margin: 0 }}>{p.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CONTEXTE ══════════════════════════════════════════════════ */}
        <section style={{ backgroundColor: SURF, borderBottom: `1px solid ${BORD}`,
          padding: "var(--sp-20) var(--sp-8)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <Reveal>
              <div className="cs-context-grid" style={{ display: "grid",
                gridTemplateColumns: "5fr 4fr", gap: "var(--sp-12)",
                alignItems: "flex-start", marginBottom: "var(--sp-10)" }}>
                <div>
                  <Badge color="purple" size="sm" className="mb-4">{C.context.badge}</Badge>
                  <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300,
                    letterSpacing: "-0.02em", color: INK, lineHeight: 1.1, margin: 0 }}>
                    {C.context.title}
                  </h2>
                </div>
                <div style={{ paddingTop: "var(--sp-8)" }}>
                  <p className="hig-body" style={{ color: INK2, margin: 0 }}>
                    {C.context.body}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="cs-two-col" style={{ display: "grid",
                gridTemplateColumns: "repeat(2,1fr)", gap: "var(--sp-4)" }}>
                {(C.problems as Array<{ tag: string; title: string; description: string; accent: boolean }>)
                  .map(({ tag, title, description, accent }) => (
                  <motion.div key={tag} className="mat-regular" whileHover={{ y: -3 }}
                    transition={{ duration: 0.22, ease: SP }}
                    style={{ padding: "22px var(--sp-6)", borderRadius: "var(--r-xl)", cursor: "default",
                      border: accent ? `1px solid ${VIO}50` : "1px solid rgba(0,0,0,0.06)",
                      boxShadow: accent
                        ? `0 8px 32px ${VIO}14, 0 2px 8px rgba(0,0,0,0.04)`
                        : "0 8px 32px rgba(0,0,0,0.05), 0 2px 8px rgba(0,0,0,0.04)" }}>
                    <p className="hig-caption2" style={{ fontWeight: 700, color: accent ? VIO : INK3,
                      letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: MONO,
                      margin: "0 0 8px" }}>{tag}</p>
                    <p className="hig-callout" style={{ fontWeight: 500, color: INK, margin: "0 0 6px" }}>{title}</p>
                    <p className="hig-footnote" style={{ color: INK2, margin: 0 }}>{description}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ DESIGN THINKING FRISE ═════════════════════════════════════ */}
        <section style={{ backgroundColor: BG, borderBottom: `1px solid ${BORD}`,
          padding: "var(--sp-20) var(--sp-8)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">{(C.process as Record<string,string>).badge}</Badge>
              <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300,
                letterSpacing: "-0.02em", color: INK, lineHeight: 1.1, marginBottom: 16 }}>
                {(C.process as Record<string,string>).title}
              </h2>
              <p className="hig-body" style={{ color: INK2, maxWidth: 640, marginBottom: "var(--sp-8)" }}>
                {(C.process as Record<string,string>).body}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <DesignThinkingFrise />
            </Reveal>
          </div>
        </section>

        {/* ══ ÉCRANS CLÉS ═══════════════════════════════════════════════ */}
        <section style={{ backgroundColor: SURF, borderBottom: `1px solid ${BORD}`, padding: "var(--sp-20) var(--sp-8)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <Reveal>
              <Badge color="purple" size="sm" className="mb-4">{(C.screens as Record<string,string>).badge}</Badge>
              <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 300,
                letterSpacing: "-0.02em", color: INK, marginBottom: "var(--sp-2)", lineHeight: 1.1 }}>
                {(C.screens as Record<string,string>).title}
              </h2>
              <p className="hig-body" style={{ color: INK2, maxWidth: 600, marginBottom: "var(--sp-10)" }}>
                {(C.screens as Record<string,string>).body}
              </p>
            </Reveal>
            <Reveal delay={40}>
              <OnboardingScreensSection />
            </Reveal>
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
                onClick={() => window.open("/onboarding/flow", "_blank")}
                icon={<ExternalLink size={15} />}>
                {C.cta.buttonText}
              </Button>
            </Reveal>
          </div>
        </section>

        <CaseContactFooter footerLeft={C.footer.left} />

      </div>
    </div>
  );
}
