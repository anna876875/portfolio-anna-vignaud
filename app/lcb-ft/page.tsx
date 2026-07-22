"use client";
import { useState, useEffect, useRef } from "react";
import {
  LayoutGrid, Bell, List, BarChart2, BookOpen,
  Lock, Settings, ChevronRight, ChevronDown,
  Clock, CheckCircle, AlertTriangle, Timer,
  Calendar, SlidersHorizontal, Search, ChevronLeft,
  Filter, Download, Plus, X, Maximize2, MessageSquare,
  ArrowUpRight, TrendingUp,
} from "lucide-react";
import { DesktopOnlyModal } from "@/components/ui";

/* ─── Tokens ─────────────────────────────────────────────────── */
const C = {
  bg:      "#F8FAFC",
  card:    "#FFFFFF",
  brd:     "#E2E8F0",
  brdL:    "#F1F5F9",
  ink:     "#0F172A",
  ink2:    "#1E3A5F",
  ink3:    "#64748B",
  ink4:    "#94A3B8",
  /* Accent bleu foncé */
  acc:     "#1E3A8A",
  accL:    "#EFF6FF",
  accMd:   "#2563EB",
  /* Sidebar blanc */
  side:    "#FFFFFF",
  sideBrd: "#E2E8F0",
  sideAct: "rgba(30,58,138,0.07)",
  /* Status */
  green:   "#16A34A",
  greenL:  "#DCFCE7",
  red:     "#DC2626",
  redL:    "#FEE2E2",
  orange:  "#EA580C",
  orangeL: "#FFEDD5",
  amber:   "#D97706",
  amberL:  "#FEF3C7",
  blue:    "#2563EB",
  blueL:   "#DBEAFE",
  navy:    "#1E3A8A",
  teal:    "#0D9488",
  tealL:   "#F0FDFA",
} as const;

/* ─── Atoms ──────────────────────────────────────────────────── */
function Pill({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "2px 9px", borderRadius: 999,
      fontSize: 11, fontWeight: 600,
      background: bg, color, whiteSpace: "nowrap" as const,
    }}>
      {children}
    </span>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span style={{
      width: 7, height: 7, borderRadius: "50%",
      background: color, display: "inline-block", flexShrink: 0,
    }} />
  );
}

/* ─── WIPView — empty state "en cours de développement" ─────── */
const WIP_CONFIGS: Record<string, {
  icon: string; title: string; subtitle: string; features: string[]; eta: string;
}> = {
  criteres: {
    icon: "⊞",
    title: "Critères d'analyse",
    subtitle: "Moteur de scoring personnalisable par profil de risque marchand.",
    features: [
      "Pondération des critères par catégorie (volume, géographie, comportement)",
      "Calibration des seuils par segment MCC",
      "Backtesting sur 12 mois d'historique",
      "Export des matrices de pondération",
    ],
    eta: "Q3 2026",
  },
  listes: {
    icon: "☰",
    title: "Listes de référence",
    subtitle: "Gestion centralisée des listes noires, blanches et de surveillance.",
    features: [
      "Import / export CSV, XLSX et JSON",
      "Synchronisation automatique ACPR & GAFI",
      "Versionning avec historique des modifications",
      "API REST pour intégration SIEM tiers",
    ],
    eta: "Q3 2026",
  },
};

function WIPView({ viewId }: { viewId: string }) {
  const conf = WIP_CONFIGS[viewId] ?? {
    icon: "◌",
    title: "Section en développement",
    subtitle: "Cette fonctionnalité sera disponible prochainement.",
    features: [],
    eta: "Prochainement",
  };

  return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "60px 40px" }}>

      {/* Card principale */}
      <div style={{
        maxWidth: 560, width: "100%", background: C.card,
        border: `1.5px dashed ${C.brd}`, borderRadius: 16,
        padding: "48px 40px", textAlign: "center",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}>

        {/* Icône */}
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: C.accL, border: `1px solid ${C.brd}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, margin: "0 auto 20px",
        }}>{conf.icon}</div>

        {/* Badge */}
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase" as const,
          padding: "4px 12px", borderRadius: 999,
          background: C.amberL, color: C.amber,
          border: `1px solid ${C.amber}30`,
          marginBottom: 16,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%",
            background: C.amber, display: "inline-block",
            animation: "wipPulse 2s ease-in-out infinite" }} />
          En cours de développement
        </span>

        {/* Titre */}
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 700,
          color: C.ink, letterSpacing: "-0.02em" }}>{conf.title}</h2>

        {/* Sous-titre */}
        <p style={{ margin: "0 0 28px", fontSize: 14, color: C.ink3,
          lineHeight: 1.65 }}>{conf.subtitle}</p>

        {/* Features à venir */}
        {conf.features.length > 0 && (
          <div style={{ textAlign: "left", borderTop: `1px solid ${C.brdL}`,
            paddingTop: 22, marginBottom: 28 }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700,
              color: C.ink4, letterSpacing: "0.08em",
              textTransform: "uppercase" as const }}>
              Fonctionnalités prévues
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {conf.features.map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: C.brdL, border: `1px solid ${C.brd}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginTop: 1 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%",
                      background: C.ink4 }} />
                  </div>
                  <span style={{ fontSize: 13.5, color: C.ink2, lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ETA */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "9px 18px", borderRadius: 10,
          background: C.accL, border: `1px solid ${C.brd}`,
        }}>
          <span style={{ fontSize: 12, color: C.ink3 }}>Livraison estimée</span>
          <span style={{ width: 1, height: 14, background: C.brd }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.acc }}>{conf.eta}</span>
        </div>
      </div>

      <p style={{ marginTop: 20, fontSize: 12, color: C.ink4 }}>
        Sentinelle · Prism v1.0 · Module en construction
      </p>

      <style>{`
        @keyframes wipPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ─── Sidebar ─────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "dashboard", icon: <LayoutGrid size={16} />, label: "Tableau de bord"              },
  { id: "alertes",   icon: <Bell       size={16} />, label: "Alertes",       badge: "143"  },
  { id: "regles",    icon: <List       size={16} />, label: "Règles de détection"           },
  { id: "criteres",  icon: <BarChart2  size={16} />, label: "Critères d'analyse", sub: true },
  { id: "listes",    icon: <BookOpen   size={16} />, label: "Listes de référence"           },
];

function Sidebar({ activeView, onNav }: { activeView: string; onNav: (v: string) => void }) {
  return (
    <aside style={{
      width: 260, minWidth: 260, flexShrink: 0,
      background: C.side,
      borderRight: `1px solid ${C.sideBrd}`,
      display: "flex", flexDirection: "column",
      height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: "0 16px", height: 52,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: `1px solid ${C.sideBrd}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: C.acc,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0,
          }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: C.ink, letterSpacing: "-0.01em" }}>
            Sentinelle
          </span>
        </div>
        <button style={{ background: "none", border: "none", cursor: "pointer",
          color: C.ink4, padding: 4, borderRadius: 4 }}>
          <ChevronLeft size={14} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: "12px 12px 4px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 10px", borderRadius: 8,
          background: C.brdL, border: `1px solid ${C.brd}`,
        }}>
          <Search size={13} color={C.ink4} />
          <span style={{ fontSize: 12.5, color: C.ink4 }}>Rechercher…</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeView;
          return (
          <div key={item.label} onClick={() => onNav(item.id)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "8px 10px", borderRadius: 8, marginBottom: 2, cursor: "pointer",
            background: isActive ? C.sideAct : "transparent",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: isActive ? C.acc : C.ink4, flexShrink: 0 }}>
                {item.icon}
              </span>
              <span style={{
                fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                color: isActive ? C.acc : C.ink3,
              }}>{item.label}</span>
            </div>
            {item.badge && (
              <Pill bg={C.redL} color={C.red}>{item.badge}</Pill>
            )}
            {item.sub && <ChevronRight size={12} color={C.ink4} />}
          </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "8px 10px", borderTop: `1px solid ${C.sideBrd}` }}>
        {[
          { icon: <Lock     size={15} />, label: "Journal d'audit" },
          { icon: <Settings size={15} />, label: "Configuration"   },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px", borderRadius: 8, cursor: "pointer",
          }}>
            <span style={{ color: C.ink4 }}>{item.icon}</span>
            <span style={{ fontSize: 13, color: C.ink3 }}>{item.label}</span>
          </div>
        ))}

        {/* User */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 10px", marginTop: 4,
          borderTop: `1px solid ${C.sideBrd}`, cursor: "pointer",
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
            background: C.acc,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 11,
          }}>SD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: C.ink,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
              S. Dumont
            </p>
            <p style={{ margin: 0, fontSize: 11, color: C.ink4,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
              s.dumont@sentinelle.app
            </p>
          </div>
          <ChevronDown size={12} color={C.ink4} />
        </div>
      </div>
    </aside>
  );
}

/* ─── Top bar ─────────────────────────────────────────────────── */
function TopBar() {
  return (
    <div style={{
      height: 44, background: C.card,
      borderBottom: `1px solid ${C.brd}`,
      display: "flex", alignItems: "center",
      paddingLeft: 28, paddingRight: 20, gap: 24,
      position: "sticky", top: 0, zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Dot color={C.green} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: "0.07em" }}>
          ALIMENTATION
        </span>
        <span style={{ fontSize: 11.5, color: C.ink4 }}>À jour · Auj. 09:54</span>
      </div>
      <div style={{ width: 1, height: 14, background: C.brd }} />
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Dot color={C.green} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.ink3, letterSpacing: "0.07em" }}>
          TRAITEMENT
        </span>
        <span style={{ fontSize: 11.5, color: C.ink4 }}>Dernière exécution : Auj. 09:58</span>
        <ChevronDown size={12} color={C.ink4} />
      </div>
      <div style={{ flex: 1 }} />
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "5px 12px", borderRadius: 8,
        background: C.accL, border: `1px solid rgba(30,58,138,0.15)`,
      }}>
        <Dot color={C.acc} />
        <span style={{ fontSize: 11, fontWeight: 600, color: C.acc }}>LCB-FT · AML</span>
      </div>
    </div>
  );
}

/* ─── KPI Card ───────────────────────────────────────────────── */
function KpiCard({
  title, icon, value, sub, subColor, accent,
}: {
  title: string; icon: React.ReactNode; value: string;
  sub: string; subColor?: string; accent?: string;
}) {
  return (
    <div style={{
      flex: 1, background: C.card,
      border: `1px solid ${C.brd}`,
      borderTop: `1px solid ${C.brd}`,
      borderRadius: 12, padding: "18px 22px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: 12.5, fontWeight: 500, color: C.ink3 }}>{title}</span>
        <span style={{ color: accent ?? C.ink4 }}>{icon}</span>
      </div>
      <p style={{ margin: "0 0 6px", fontSize: 36, fontWeight: 700, color: C.ink, lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ margin: 0, fontSize: 12, color: subColor ?? C.ink4 }}>{sub}</p>
    </div>
  );
}

/* ─── Performance des règles ─────────────────────────────────── */
const RULES = [
  { name: "Volume > 10k€",        alerts: 128, fp: 4.2,  pct: 100, color: C.acc  },
  { name: "Virements GAFI",        alerts: 47,  fp: 1.8,  pct: 37,  color: C.blue },
  { name: "Cumul mensuel",         alerts: 12,  fp: 18.5, pct: 9,   color: C.red  },
  { name: "Marchands liste noire", alerts: 0,   fp: null, pct: 0,   color: C.brd  },
];

function PerformanceRules() {
  return (
    <div style={{
      flex: 1, background: C.card, border: `1px solid ${C.brd}`,
      borderRadius: 12, padding: 22,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <h3 style={{ margin: "0 0 20px", fontSize: 14.5, fontWeight: 600, color: C.ink }}>
        Performance des règles
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {RULES.map((r) => (
          <div key={r.name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "baseline" }}>
              <span style={{ fontSize: 13, color: r.alerts === 0 ? C.ink4 : C.ink2 }}>{r.name}</span>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.ink3 }}>
                  {r.alerts > 0 ? `${r.alerts} alertes` : "0 alertes"}
                </span>
                {r.fp !== null && (
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: r.fp > 10 ? C.red : C.ink4,
                  }}>{r.fp}% FP</span>
                )}
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: C.brdL, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${r.pct}%`,
                background: r.color, borderRadius: 4,
                transition: "width 0.4s",
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Règle × statut (SVG grouped bar chart) ─────────────────── */
const RULE_GROUPS = [
  { label: "Volume > 10k€",  values: [88, 28, 10, 4] },
  { label: "Virements GAFI", values: [30, 10,  5, 2] },
  { label: "Fractionnement", values: [16,  8,  3, 1] },
  { label: "Activité (< 30)",values: [22, 10,  8, 3] },
  { label: "Cumul mensuel",  values: [ 8,  3,  2, 0] },
];
const RULE_COLORS = [C.green, C.teal, C.orange, C.red];
const RULE_LEGENDS = ["Clôturée", "En cours", "Examen renforcé", "Soupçon LAB-FT"];

function RuleStatusChart() {
  const W = 340, H = 160, PL = 28, PB = 44, PT = 10, PR = 8;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;
  const maxVal = 100;
  const groupW = chartW / RULE_GROUPS.length;
  const barW = 10, barGap = 2;
  const yTicks = [0, 25, 50, 100];

  return (
    <div style={{
      flex: 1, background: C.card, border: `1px solid ${C.brd}`,
      borderRadius: 12, padding: 22,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14.5, fontWeight: 600, color: C.ink }}>
        Règle × statut
      </h3>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        {yTicks.map((t) => {
          const y = PT + chartH - (t / maxVal) * chartH;
          return (
            <g key={t}>
              <line x1={PL} y1={y} x2={PL + chartW} y2={y}
                stroke={C.brd} strokeWidth={0.75} />
              <text x={PL - 5} y={y + 3.5}
                fontSize={9} fill={C.ink4} textAnchor="end">{t}</text>
            </g>
          );
        })}
        {RULE_GROUPS.map((group, gi) => {
          const groupX = PL + gi * groupW + groupW / 2;
          const totalBarW = 4 * barW + 3 * barGap;
          const startX = groupX - totalBarW / 2;
          return (
            <g key={group.label}>
              {group.values.map((val, ci) => {
                const bh = (val / maxVal) * chartH;
                const x = startX + ci * (barW + barGap);
                const y = PT + chartH - bh;
                return <rect key={ci} x={x} y={y} width={barW} height={bh}
                  fill={RULE_COLORS[ci]} rx={2} />;
              })}
              <text x={groupX} y={PT + chartH + 12} fontSize={8.5}
                fill={C.ink4} textAnchor="middle">
                {group.label.length > 12 ? group.label.substring(0, 12) + "…" : group.label}
              </text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 4 }}>
        {RULE_LEGENDS.map((l, i) => (
          <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%",
              background: RULE_COLORS[i], display: "inline-block" }} />
            <span style={{ fontSize: 11, color: C.ink3 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Motifs de clôture ──────────────────────────────────────── */
const MOTIFS = [
  { label: "Classée sans suite",      count: 168, pct: 68 },
  { label: "Examen renforcé",         count: 87,  pct: 35 },
  { label: "Erreur",                  count: 27,  pct: 11 },
  { label: "Soupçon LAB-FT historio", count: 9,   pct: 4  },
  { label: "FIA",                     count: 9,   pct: 4  },
];

function ClotureMotifs() {
  return (
    <div style={{
      flex: 1, background: C.card, border: `1px solid ${C.brd}`,
      borderRadius: 12, padding: 22,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.ink }}>Motifs de clôture</h3>
        <Pill bg={C.orangeL} color={C.orange}>Examen renforcé · 21.4%</Pill>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {MOTIFS.map((m) => (
          <div key={m.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: C.ink2 }}>{m.label}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: C.ink3 }}>{m.count}</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: C.brdL, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${m.pct}%`,
                background: C.acc, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Alertes par MCC ────────────────────────────────────────── */
const MCC_DATA = [
  { code: "5912", label: "Numérisations",      count: 64 },
  { code: "7995", label: "Jeux d'argent",      count: 58 },
  { code: "5047", label: "Risque de santé",    count: 47 },
  { code: "4829", label: "Transfert de fonds", count: 38 },
  { code: "5060", label: "Commerce divers",    count: 30 },
];

function AlertsByMcc() {
  const max = 64;
  return (
    <div style={{
      flex: 1, background: C.card, border: `1px solid ${C.brd}`,
      borderRadius: 12, padding: 22,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.ink }}>Alertes par MCC</h3>
        <button style={{ fontSize: 12, color: C.acc, background: "none",
          border: "none", cursor: "pointer", fontWeight: 500 }}>Voir 10</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {MCC_DATA.map((m, i) => (
          <div key={m.code} style={{
            display: "grid", gridTemplateColumns: "52px 1fr 28px",
            alignItems: "center", gap: 10, padding: "9px 0",
            borderBottom: i < MCC_DATA.length - 1 ? `1px solid ${C.brdL}` : "none",
          }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: C.ink4 }}>{m.code}</span>
            <div>
              <div style={{ fontSize: 12.5, color: C.ink2, marginBottom: 4 }}>{m.label}</div>
              <div style={{ height: 5, borderRadius: 3, background: C.brdL, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(m.count / max) * 100}%`,
                  background: C.acc, borderRadius: 3 }} />
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: C.ink2, textAlign: "right" as const }}>
              {m.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Donut Chart — Alertes par risque client ────────────────── */
const RISK_DATA = [
  { label: "Élevé",    value: 58,  pct: 23, color: C.orange },
  { label: "Standard", value: 121, pct: 49, color: C.acc    },
  { label: "Faible",   value: 69,  pct: 28, color: C.green  },
];

function DonutChart() {
  const r = 54, cx = 70, cy = 70;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = RISK_DATA.reduce((s, d) => s + d.value, 0);

  const segments = RISK_DATA.map((d) => {
    const pct = d.value / total;
    const dash = pct * circ;
    const result = { ...d, dash, offset: -(offset * circ) };
    offset += pct;
    return result;
  });

  return (
    <div style={{
      flex: 1, background: C.card, border: `1px solid ${C.brd}`,
      borderRadius: 12, padding: 22,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <h3 style={{ margin: "0 0 16px", fontSize: 14.5, fontWeight: 600, color: C.ink }}>
        Alertes par risque client
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width={140} height={140} viewBox="0 0 140 140" style={{ flexShrink: 0 }}>
          {segments.map((s, i) => (
            <circle key={i} cx={cx} cy={cy} r={r}
              fill="none" stroke={s.color} strokeWidth={22}
              strokeDasharray={`${s.dash} ${circ}`}
              strokeDashoffset={s.offset}
              transform={`rotate(-90 ${cx} ${cy})`} />
          ))}
          <circle cx={cx} cy={cy} r={43} fill={C.card} />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {RISK_DATA.map((d) => (
            <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 9, height: 9, borderRadius: "50%",
                background: d.color, display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: C.ink2 }}>
                {d.label}{" "}
                <span style={{ fontWeight: 600, color: C.ink }}>{d.value}</span>
                <span style={{ color: C.ink4 }}> ({d.pct}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Charge par analyste ────────────────────────────────────── */
const ANALYSTS = [
  { name: "S. Martin",  encours: 120, cloturees: 88 },
  { name: "H. Dupont",  encours: 50,  cloturees: 32 },
  { name: "C. Bernard", encours: 30,  cloturees: 22 },
  { name: "L. Petit",   encours: 24,  cloturees: 16 },
];

function AnalystLoad() {
  const max = 208;
  return (
    <div style={{
      flex: 1, background: C.card, border: `1px solid ${C.brd}`,
      borderRadius: 12, padding: 22,
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.ink }}>Charge par analyste</h3>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ label: "En cours", color: C.acc }, { label: "Clôturées", color: C.green }].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2,
                background: l.color, display: "inline-block" }} />
              <span style={{ fontSize: 11, color: C.ink3 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {ANALYSTS.map((a) => {
          const total = a.encours + a.cloturees;
          const encoursPct = (a.encours / max) * 100;
          const clotPct    = (a.cloturees / max) * 100;
          return (
            <div key={a.name} style={{ display: "grid", gridTemplateColumns: "90px 1fr 36px", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.ink2 }}>{a.name}</span>
              <div style={{ height: 10, borderRadius: 5, background: C.brdL, overflow: "hidden", display: "flex" }}>
                <div style={{ width: `${encoursPct}%`, background: C.acc, borderRadius: "5px 0 0 5px" }} />
                <div style={{ width: `${clotPct}%`, background: C.green }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: C.ink3, textAlign: "right" as const }}>
                {total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Notifications ──────────────────────────────────────────── */
const NOTIFS_INIT = [
  {
    id: 1,
    title: "12 alertes en attente depuis + 48h",
    desc: "Règle « Virements vers pays à risque » : 12 alertes ouvertes sans assignation depuis plus de 2 jours.",
    actions: ["Voir les alertes", "Ignorer"],
  },
  {
    id: 2,
    title: "Backtesting prêt à lancer",
    desc: "« Fractionnement de paiements v1.0 » est configurée et prête pour le backtesting sur les 90 derniers jours.",
    actions: ["Lancer le test", "Ignorer"],
  },
  {
    id: 3,
    title: "3 nouvelles typologies GAFI publiées",
    desc: "Mise à jour mars 2026 : vérifier la couverture des règles actives par rapport aux nouvelles typologies.",
    actions: ["Consulter", "Ignorer"],
  },
];

function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFS_INIT);
  if (notifs.length === 0) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {notifs.map((n) => (
        <div key={n.id} style={{
          background: C.card, border: `1px solid ${C.brd}`,
          borderLeft: "none",
          borderRadius: 12, padding: "16px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <h4 style={{ margin: "0 0 5px", fontSize: 14, fontWeight: 600, color: C.ink }}>{n.title}</h4>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: C.ink3, lineHeight: 1.55 }}>{n.desc}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
              style={{
                padding: "5px 14px", borderRadius: 7, fontSize: 12.5, fontWeight: 500,
                background: C.accL, border: `1px solid rgba(30,58,138,0.15)`,
                cursor: "pointer", color: C.acc,
              }}>{n.actions[0]}</button>
            <button onClick={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
              style={{
                padding: "5px 14px", borderRadius: 7, fontSize: 12.5,
                background: "none", border: "none", cursor: "pointer", color: C.ink4,
              }}>Ignorer</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Alertes récentes table ─────────────────────────────────── */
const RECENT_ALERTS = [
  { id: "ALT-20260605-00001", time: "Auj. 07:58", score: 824, scoreLabel: "critique", entity: "Shopname",  type: "Fraude", amount: "473,32 €", status: "En cours" },
  { id: "ALT-20260605-00002", time: "Auj. 04:55", score: 560, scoreLabel: "fort",     entity: "Nomshop",   type: "Fraude", amount: "473,32 €", status: "Ouverte"  },
  { id: "ALT-20260605-00003", time: "Auj. 03:14", score: 912, scoreLabel: "critique", entity: "Shopname",  type: "LAB",    amount: "473,32 €", status: "En cours" },
];

const SCORE_STYLE: Record<string, { bg: string; color: string }> = {
  critique: { bg: C.redL,    color: C.red    },
  fort:     { bg: C.orangeL, color: C.orange },
  moyen:    { bg: C.amberL,  color: C.amber  },
};
const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  "En cours": { bg: C.accL,   color: C.acc   },
  "Ouverte":  { bg: C.greenL, color: C.green },
  "Clôturée": { bg: C.brdL,   color: C.ink3  },
};

function RecentAlerts() {
  const TH = {
    padding: "0 14px 10px", fontSize: 10.5, fontWeight: 700,
    color: C.ink4, letterSpacing: "0.07em", textAlign: "left" as const,
    whiteSpace: "nowrap" as const,
  };
  const TD = {
    padding: "12px 14px", fontSize: 12.5, color: C.ink2,
    borderTop: `1px solid ${C.brdL}`,
    whiteSpace: "nowrap" as const,
  };

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.brd}`,
      borderRadius: 12, overflow: "hidden",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "18px 22px 12px" }}>
        <h3 style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: C.ink }}>Alertes récentes</h3>
        <button style={{ fontSize: 12.5, color: C.acc, background: "none",
          border: "none", cursor: "pointer", fontWeight: 500 }}>
          Voir toutes les alertes →
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
        <thead>
          <tr>
            {["ALERTE", "SCORE DE RISQUE", "ENTITÉ", "TYPE", "MONTANT", "STATUT"].map(h => (
              <th key={h} style={TH}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {RECENT_ALERTS.map((a) => {
            const sc = SCORE_STYLE[a.scoreLabel] ?? SCORE_STYLE.moyen;
            const st = STATUS_STYLE[a.status]  ?? STATUS_STYLE["Ouverte"];
            return (
              <tr key={a.id} style={{ cursor: "pointer" }}>
                <td style={TD}>
                  <div style={{ fontWeight: 600, color: C.ink, marginBottom: 2, fontSize: 12.5 }}>{a.id}</div>
                  <div style={{ fontSize: 11, color: C.ink4 }}>{a.time}</div>
                </td>
                <td style={TD}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center",
                      padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                      background: sc.bg, color: sc.color,
                    }}>{a.scoreLabel}</span>
                    <span style={{ fontSize: 12, color: C.ink3 }}>({a.score})</span>
                  </div>
                </td>
                <td style={TD}>{a.entity}</td>
                <td style={TD}>{a.type}</td>
                <td style={{ ...TD, fontWeight: 500 }}>{a.amount}</td>
                <td style={TD}>
                  <span style={{
                    display: "inline-flex", alignItems: "center",
                    padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 500,
                    background: st.bg, color: st.color,
                  }}>{a.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Toggle ─────────────────────────────────────────────────── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <div onClick={(e) => { e.stopPropagation(); onToggle(); }} style={{
      width: 36, height: 20, borderRadius: 10, cursor: "pointer",
      background: on ? C.acc : C.brd, position: "relative",
      transition: "background 0.15s", flexShrink: 0,
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3, left: on ? 19 : 3,
        transition: "left 0.15s", boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </div>
  );
}

/* ─── ALERTES VIEW ────────────────────────────────────────────── */
const ALERTS_ITEMS = [
  { id: "AML-0847", entity: "TECH IMPORT SARL",  risk: "critique", rule: "Volume > 10k€",  amount: "48 200 €", analyst: "S. Dumont",  status: "En cours",  age: 2 },
  { id: "AML-0846", entity: "FAST TRANSFER SAS",  risk: "critique", rule: "Virements GAFI", amount: "36 500 €", analyst: "M. Legrand", status: "En retard", age: 4 },
  { id: "AML-0845", entity: "GLOBAL PAY LTD",     risk: "fort",     rule: "Cumul mensuel",  amount: "22 750 €", analyst: "H. Dupont",  status: "En cours",  age: 3 },
  { id: "AML-0844", entity: "MARCHÉ PRO SAS",     risk: "fort",     rule: "Volume > 10k€",  amount: "18 000 €", analyst: "S. Martin",  status: "Ouverte",   age: 1 },
  { id: "AML-0843", entity: "DISTRIB EUROPE",     risk: "moyen",    rule: "Fractionnement", amount:  "9 800 €", analyst: "C. Bernard", status: "En cours",  age: 5 },
  { id: "AML-0842", entity: "TRADE & CO",         risk: "moyen",    rule: "Activité < 30j", amount:  "6 200 €", analyst: "L. Petit",   status: "Clôturée",  age: 8 },
  { id: "AML-0841", entity: "FINEX SARL",         risk: "critique", rule: "Virements GAFI", amount: "61 000 €", analyst: "M. Legrand", status: "En retard", age: 7 },
  { id: "AML-0840", entity: "OCEAN DIGITAL SAS",  risk: "faible",   rule: "Volume > 10k€",  amount: "11 200 €", analyst: "H. Dupont",  status: "Clôturée",  age: 9 },
  { id: "AML-0839", entity: "MEDIA INVEST GROUP", risk: "fort",     rule: "Cumul mensuel",  amount: "31 000 €", analyst: "S. Martin",  status: "Ouverte",   age: 1 },
  { id: "AML-0838", entity: "RAPID MOVE SAS",     risk: "moyen",    rule: "Listes noires",  amount:  "4 500 €", analyst: "S. Dumont",  status: "En cours",  age: 6 },
];

/* Données de détail par alerte (pour le drawer) */
const ALERT_DETAIL: Record<string, {
  detectedAt: string; severity: string; txCount: number; period: string; scoreTotal: number;
  description: string;
  rules: { id: string; name: string; severity: "critique" | "fort" | "moyen"; highlight?: string }[];
  merchant: { mcc: string; clientRisk: string; createdAt: string; kybStatus: string;
    avgVolume: string; avgTx: string; last30: string; riskScore: number; incidents: string };
  riskHistory: number[];
  history: { actor: string; action: string; time: string }[];
  comments: number;
}> = {
  "AML-0847": {
    detectedAt: "Auj. 07:58", severity: "Critique · R2",
    txCount: 8, period: "24 dernières heures", scoreTotal: 824,
    description: "Détection de 8 transactions fractionnées sur 24h totalisant 48 200 €, dépassant le seuil de déclaration de 10 000 €. Comportement de vélocité anormal sur un client récent.",
    rules: [
      { id: "RULE_VELOCITY_24H_R1", name: "Nombre moyen de transactions dépassé · seuil 250 / mois → 342 / mois", severity: "critique", highlight: "seuil 250 / mois → 342 / mois" },
      { id: "RULE_VELOCITY_24H_R2", name: "Vélocité horaire anormale", severity: "fort" },
      { id: "RULE_HIGH_FREQ_R1",    name: "Fréquence élevée sur 1h", severity: "fort" },
      { id: "RULE_AMOUNT_THRESHOLD_R1", name: "Volume mensuel dépassé · seuil 15 000 € → 48 210 €", severity: "critique", highlight: "seuil 15 000 € → 48 210 €" },
      { id: "RULE_GEO_RISK_R1",    name: "Présence géographique à risque", severity: "moyen" },
    ],
    merchant: { mcc: "5651 · Prêt-à-porter", clientRisk: "Élevé", createdAt: "12/03/2023", kybStatus: "Certifié", avgVolume: "12 480 €", avgTx: "218 / mois", last30: "48 210 €", riskScore: 71, incidents: "3 alertes" },
    riskHistory: [22, 25, 28, 30, 35, 38, 42, 47, 51, 55, 59, 65, 71, 78],
    history: [
      { actor: "Système", action: "Alerte créée par le moteur de règles", time: "Auj. 07:58" },
      { actor: "Système", action: "Assignée automatiquement par le Système", time: "Auj. 08:00" },
    ],
    comments: 5,
  },
  "AML-0846": {
    detectedAt: "Hier 14:12", severity: "Critique · R1",
    txCount: 3, period: "48 dernières heures", scoreTotal: 760,
    description: "Virements successifs vers des entités domiciliées dans des pays classés GAFI à risque élevé. Montant cumulé : 36 500 €.",
    rules: [
      { id: "RULE_GAFI_R1", name: "Destination pays GAFI liste rouge", severity: "critique" },
      { id: "RULE_GAFI_R2", name: "Bénéficiaire sanctionné ONU", severity: "critique" },
      { id: "RULE_AMOUNT_THRESHOLD_R1", name: "Seuil de déclaration dépassé", severity: "fort" },
    ],
    merchant: { mcc: "6211 · Services financiers", clientRisk: "Critique", createdAt: "04/11/2022", kybStatus: "Certifié", avgVolume: "28 000 €", avgTx: "95 / mois", last30: "36 500 €", riskScore: 89, incidents: "7 alertes" },
    riskHistory: [40, 45, 52, 58, 63, 67, 72, 75, 79, 82, 84, 86, 88, 89],
    history: [
      { actor: "Système", action: "Alerte créée par la règle GAFI", time: "Hier 14:12" },
      { actor: "M. Legrand", action: "Prise en charge de l'analyse", time: "Hier 15:00" },
      { actor: "M. Legrand", action: "Demande de documents complémentaires", time: "Hier 16:30" },
    ],
    comments: 2,
  },
  "AML-0845": {
    detectedAt: "Auj. 09:15", severity: "Fort · R3",
    txCount: 12, period: "30 derniers jours", scoreTotal: 610,
    description: "Cumul mensuel dépassant le seuil réglementaire. Progression linéaire du volume sur 3 mois consécutifs sans justificatif d'activité.",
    rules: [
      { id: "RULE_CUMUL_MONTHLY_R1", name: "Cumul mensuel > 50 000 € · seuil atteint à 22 750 €", severity: "fort" },
      { id: "RULE_TREND_R1", name: "Progression continue du volume (3 mois)", severity: "moyen" },
    ],
    merchant: { mcc: "7299 · Services divers", clientRisk: "Modéré", createdAt: "17/06/2021", kybStatus: "Certifié", avgVolume: "18 500 €", avgTx: "310 / mois", last30: "22 750 €", riskScore: 55, incidents: "1 alerte" },
    riskHistory: [20, 22, 25, 27, 30, 33, 37, 40, 44, 48, 51, 53, 55, 55],
    history: [
      { actor: "Système", action: "Alerte créée automatiquement", time: "Auj. 09:15" },
      { actor: "H. Dupont", action: "Assignée pour analyse cumulative", time: "Auj. 09:30" },
    ],
    comments: 1,
  },
};

/* Fallback detail pour les autres alertes */
function getDetail(id: string) {
  return ALERT_DETAIL[id] ?? {
    detectedAt: "Auj.", severity: "Moyen · R1",
    txCount: 4, period: "24 dernières heures", scoreTotal: 420,
    description: "Comportement transactionnel inhabituel détecté par le moteur de règles automatiques.",
    rules: [{ id: "RULE_DEFAULT_R1", name: "Règle générique déclenchée", severity: "moyen" as const }],
    merchant: { mcc: "5999 · Commerce divers", clientRisk: "Modéré", createdAt: "01/01/2023", kybStatus: "Certifié", avgVolume: "8 000 €", avgTx: "120 / mois", last30: "8 500 €", riskScore: 42, incidents: "0 alerte" },
    riskHistory: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 41, 42, 42],
    history: [{ actor: "Système", action: "Alerte créée automatiquement", time: "Auj." }],
    comments: 0,
  };
}

/* ─── ALERT DRAWER ───────────────────────────────────────────── */
function RiskScoreChart({ data }: { data: number[] }) {
  const W = 420, H = 90, PL = 28, PR = 12, PT = 8, PB = 8;
  const innerW = W - PL - PR;
  const innerH = H - PT - PB;
  const min = 0, max = 100;
  const toX = (i: number) => PL + (i / (data.length - 1)) * innerW;
  const toY = (v: number) => PT + innerH - ((v - min) / (max - min)) * innerH;
  const path = data.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai"].slice(0, Math.min(5, data.length));
  const gridVals = [20, 80];
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} style={{ width: "100%", display: "block" }}>
      {gridVals.map(v => {
        const y = toY(v);
        return <g key={v}>
          <line x1={PL} y1={y} x2={W - PR} y2={y}
            stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 3" />
          <text x={PL - 4} y={y + 3.5} fontSize="8" fill="#94A3B8" textAnchor="end">{v}</text>
        </g>;
      })}
      <path d={path} fill="none" stroke="#C2410C" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round" />
      {/* Last point dot */}
      <circle cx={toX(data.length - 1)} cy={toY(data[data.length - 1])} r="3.5" fill="#C2410C" />
      {/* Month labels */}
      {months.map((m, i) => {
        const idx = Math.round(i * (data.length - 1) / (months.length - 1));
        return <text key={m} x={toX(idx)} y={H + 16} fontSize="9" fill="#94A3B8" textAnchor="middle">{m}</text>;
      })}
      {/* Legend */}
      <line x1={W / 2 - 20} y1={H + 10} x2={W / 2 - 6} y2={H + 10} stroke="#C2410C" strokeWidth="1.5" />
      <circle cx={W / 2 - 13} cy={H + 10} r="2.5" fill="#C2410C" />
      <text x={W / 2 - 2} y={H + 14} fontSize="9" fill="#64748B">Score</text>
    </svg>
  );
}

const RULE_SEVERITY_DOT: Record<string, string> = {
  critique: "#DC2626", fort: "#EA580C", moyen: "#D97706",
};

/* ── DrawerWIP — empty state compact pour les onglets du drawer ── */
function DrawerWIP({ icon, title, description, items }: {
  icon: string; title: string; description: string; items: string[];
}) {
  return (
    <div style={{ padding: "32px 22px 32px", display: "flex",
      flexDirection: "column", alignItems: "center", textAlign: "center" }}>

      {/* Icône */}
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: C.accL, border: `1px solid ${C.brd}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 14,
      }}>{icon}</div>

      {/* Badge */}
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        padding: "3px 10px", borderRadius: 999,
        background: C.amberL, color: C.amber,
        border: `1px solid ${C.amber}40`,
        marginBottom: 12,
      }}>
        <span style={{ width: 5, height: 5, borderRadius: "50%",
          background: C.amber, display: "inline-block",
          animation: "wipPulse 2s ease-in-out infinite" }} />
        En développement
      </span>

      <p style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: C.ink }}>{title}</p>
      <p style={{ margin: "0 0 22px", fontSize: 12.5, color: C.ink3,
        lineHeight: 1.6, maxWidth: 360 }}>{description}</p>

      {/* Liste */}
      <div style={{ width: "100%", textAlign: "left",
        border: `1.5px dashed ${C.brd}`, borderRadius: 10, padding: "16px 18px" }}>
        <p style={{ margin: "0 0 10px", fontSize: 10.5, fontWeight: 700,
          color: C.ink4, letterSpacing: "0.08em",
          textTransform: "uppercase" as const }}>Fonctionnalités prévues</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {items.map((it) => (
            <div key={it} style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                background: C.brdL, border: `1px solid ${C.brd}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginTop: 1 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.ink4 }} />
              </div>
              <span style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.5 }}>{it}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AlertDrawer({ alertId, onClose }: { alertId: string; onClose: () => void }) {
  const alert  = ALERTS_ITEMS.find(a => a.id === alertId)!;
  const detail = getDetail(alertId);
  const [drawerTab, setDrawerTab]     = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  /* couleurs selon sévérité */
  const isC = alert.risk === "critique";
  const isF = alert.risk === "fort";
  const headerBg  = isC ? "#FFF1F2" : isF ? "#FFF7ED" : "#FFFBEB";
  const headerBrd = isC ? "#FCA5A5" : isF ? "#FED7AA" : "#FDE68A";
  const headerAcc = isC ? "#DC2626" : isF ? "#EA580C" : "#D97706";

  const DTABS = [
    { label: "Contexte marchand",        icon: "⊞" },
    { label: "Transactions impliquées",   icon: "⇄" },
    { label: "Analyse des flux",          icon: "⚡" },
  ];

  /* Champ merchant avec label petit + valeur en orange pour signaux anomalies */
  const MF = ({ label, value, orange, badge }:
    { label: string; value: string; orange?: boolean; badge?: "A" | "B" }) => (
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: "0 0 3px", fontSize: 11.5, color: C.ink4, fontWeight: 400 }}>
        {label}
        {badge && (
          <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 700,
            background: "#FFF3CD", color: "#92400E",
            padding: "1px 4px", borderRadius: 3, verticalAlign: "middle" }}>{badge}</span>
        )}
      </p>
      <p style={{ margin: 0, fontSize: 15, fontWeight: orange ? 500 : 400,
        color: orange ? "#C2410C" : C.ink }}>{value}</p>
    </div>
  );

  /* Pill pour statut KYB / Risque BO */
  const StatusPill = ({ text, type }: { text: string; type: "risk" | "kyb" }) => {
    const isElevé    = text === "Élevé" || text === "Critique";
    const isCertifié = text === "Certifié";
    return (
      <span style={{
        display: "inline-block", fontSize: 12, fontWeight: 500,
        padding: "3px 10px", borderRadius: 999,
        background: isElevé ? "#FFF1F2" : isCertifié ? "#F0FDF4" : "#FFF7ED",
        color: isElevé ? "#DC2626" : isCertifié ? "#16A34A" : "#EA580C",
        border: `1px solid ${isElevé ? "#FCA5A5" : isCertifié ? "#86EFAC" : "#FED7AA"}`,
      }}>{text}</span>
    );
  };

  /* Transactions factices déterministes (pas de Math.random) */
  const TX_DATA = [
    { ref: "TX-10001", type: "Paiement CB",  time: "08:14", amount: "6 240,00 €" },
    { ref: "TX-10002", type: "Paiement CB",  time: "09:02", amount: "7 810,50 €" },
    { ref: "TX-10003", type: "Virement SEPA",time: "10:47", amount: "12 350,00 €" },
    { ref: "TX-10004", type: "Paiement CB",  time: "11:23", amount: "4 900,00 €" },
    { ref: "TX-10005", type: "Virement SEPA",time: "13:56", amount: "9 100,00 €" },
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.22)", zIndex: 40,
      }} />

      {/* Drawer */}
      <div ref={drawerRef} style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 500, zIndex: 50,
        background: "#fff", boxShadow: "-6px 0 32px rgba(0,0,0,0.14)",
        display: "flex", flexDirection: "column",
        animation: "slideIn 0.24s cubic-bezier(0.22,1,0.36,1)",
      }}>

        {/* ── HEADER ─────────────────────────────────────────── */}
        <div style={{ background: headerBg, borderBottom: `1px solid ${headerBrd}`, flexShrink: 0 }}>

          {/* Ligne 1 : ID + close */}
          <div style={{ padding: "11px 14px 0", display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginRight: 2 }}>
              <ChevronRight size={12} color={headerAcc} style={{ transform: "rotate(-90deg)" }} />
              <ChevronRight size={12} color={headerAcc} style={{ transform: "rotate(90deg)", marginLeft: -6 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.ink, fontFamily: "monospace",
              letterSpacing: "0.02em" }}>{alert.id}</span>
            <span style={{ fontSize: 11.5, color: C.ink3, flex: 1 }}>
              {alert.rule} / 24h · {alert.entity} · {detail.detectedAt}
            </span>
            <button style={{ width: 26, height: 26, borderRadius: 6, border: `1px solid ${headerBrd}`,
              background: "rgba(255,255,255,0.75)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Maximize2 size={11} color={C.ink3} />
            </button>
            <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: 6,
              border: `1px solid ${headerBrd}`, background: "rgba(255,255,255,0.75)",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={11} color={C.ink3} />
            </button>
          </div>

          {/* Ligne 2 : statut + détection + badge sévérité */}
          <div style={{ padding: "8px 14px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px",
              borderRadius: 6, border: `1px solid ${C.brd}`, background: "#fff",
              fontSize: 12.5, fontWeight: 500, color: C.ink, cursor: "pointer" }}>
              <Dot color={A_STATUS[alert.status]?.color ?? C.ink3} />
              {alert.status} <ChevronDown size={11} color={C.ink3} />
            </button>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <Calendar size={11} color={C.ink4} />
                <span style={{ fontSize: 11, color: C.ink4 }}>Détectée le {detail.detectedAt}</span>
              </div>
              <span style={{ fontSize: 11, padding: "2px 9px", borderRadius: 999, fontWeight: 600,
                background: headerAcc + "18", color: headerAcc }}>{detail.severity}</span>
            </div>
          </div>
        </div>

        {/* ── BODY (scroll) ───────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Description */}
          <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.brdL}` }}>
            <p style={{ margin: 0, fontSize: 13, color: C.ink2, lineHeight: 1.65 }}>{detail.description}</p>
          </div>

          {/* 2 colonnes : métriques | règles */}
          <div style={{ display: "grid", gridTemplateColumns: "45% 55%",
            borderBottom: `1px solid ${C.brdL}` }}>

            {/* Gauche */}
            <div style={{ padding: "16px 18px", borderRight: `1px solid ${C.brdL}` }}>
              {[
                { label: "Entité concernée",            value: alert.entity },
                { label: "Score de risque",             value: String(detail.scoreTotal) },
                { label: "Nombre de transactions",      value: String(detail.txCount) },
                { label: "Information complémentaire",  value: "N/A" },
                { label: "Montant total",               value: alert.amount },
                { label: "Période",                     value: detail.period },
              ].map((f) => (
                <div key={f.label} style={{ marginBottom: 14 }}>
                  <p style={{ margin: "0 0 1px", fontSize: 11, color: C.ink4 }}>{f.label}</p>
                  <p style={{ margin: 0,
                    fontSize: f.label === "Score de risque" ? 22 : f.label === "Montant total" ? 17 : 13.5,
                    fontWeight: f.label === "Score de risque" || f.label === "Montant total" ? 700 : 500,
                    color: f.label === "Score de risque" || f.label === "Montant total" ? headerAcc : C.ink,
                  }}>{f.value}</p>
                </div>
              ))}
            </div>

            {/* Droite : règles */}
            <div style={{ padding: "16px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Règles déclenchées</span>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 999,
                  background: C.redL, color: C.red }}>{detail.rules.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {detail.rules.map((r) => (
                  <div key={r.id} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", marginTop: 4, flexShrink: 0,
                      background: RULE_SEVERITY_DOT[r.severity] }} />
                    <div>
                      <p style={{ margin: 0, fontSize: 10.5, fontWeight: 600, color: C.ink3,
                        fontFamily: "monospace" }}>{r.id}</p>
                      {r.highlight ? (
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: C.ink4, lineHeight: 1.45 }}>
                          {r.name.split(r.highlight)[0]}
                          <strong style={{ color: RULE_SEVERITY_DOT[r.severity], fontWeight: 600 }}>{r.highlight}</strong>
                          {r.name.split(r.highlight)[1]}
                        </p>
                      ) : (
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: C.ink4 }}>{r.name}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button style={{ marginTop: 14, background: "none", border: "none", padding: 0,
                fontSize: 11.5, color: C.acc, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4 }}>
                Voir la règle principale <ArrowUpRight size={11} />
              </button>
            </div>
          </div>

          {/* ── Tabs ─────────────────────────────────────────── */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.brd}`, background: "#fff" }}>
            {DTABS.map((t, i) => (
              <button key={t.label} onClick={() => setDrawerTab(i)} style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "11px 14px", background: "none", border: "none",
                borderBottom: drawerTab === i ? `2px solid ${C.acc}` : "2px solid transparent",
                color: drawerTab === i ? C.acc : C.ink3,
                fontWeight: drawerTab === i ? 600 : 400, fontSize: 12.5,
                cursor: "pointer", marginBottom: -1, whiteSpace: "nowrap" as const,
              }}>
                <span style={{ fontSize: 11 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Onglet 0 : Contexte marchand ─────────────────── */}
          {drawerTab === 0 && (
            <div style={{ padding: "20px 18px 24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>

                <MF label="Secteur (MCC)" value={detail.merchant.mcc} />
                <div style={{ marginBottom: 20 }}>
                  <p style={{ margin: "0 0 5px", fontSize: 11.5, color: C.ink4 }}>Risque client (BO)</p>
                  <StatusPill text={detail.merchant.clientRisk} type="risk" />
                </div>

                <MF label="Date de création" value={detail.merchant.createdAt} />
                <div style={{ marginBottom: 20 }}>
                  <p style={{ margin: "0 0 5px", fontSize: 11.5, color: C.ink4 }}>Statut KYB</p>
                  <StatusPill text={detail.merchant.kybStatus} type="kyb" />
                </div>

                <MF label="Volume mensuel moyen" value={detail.merchant.avgVolume} orange badge="A" />
                <MF label="Nombre moyen de transactions" value={detail.merchant.avgTx} orange badge="B" />
                <MF label="30 derniers jours" value={detail.merchant.last30} orange />
                <MF label="Score de risque global" value={String(detail.merchant.riskScore)} orange />
                <MF label="Incidents / 90 jours" value={detail.merchant.incidents} />
              </div>

              {/* Graphe score */}
              <div style={{ marginTop: 4, borderTop: `1px solid ${C.brdL}`, paddingTop: 18 }}>
                <p style={{ margin: "0 0 12px", fontSize: 10.5, fontWeight: 700, color: C.ink4,
                  letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Évolution du score de risque
                </p>
                <RiskScoreChart data={detail.riskHistory} />
              </div>

              {/* Historique */}
              <div style={{ marginTop: 20, borderTop: `1px solid ${C.brdL}`, paddingTop: 18 }}>
                <p style={{ margin: "0 0 14px", fontSize: 10.5, fontWeight: 700, color: C.ink4,
                  letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Historique de l'alerte
                </p>
                <div style={{ position: "relative" }}>
                  {detail.history.map((h, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start",
                      marginBottom: i < detail.history.length - 1 ? 20 : 0 }}>
                      {/* Avatar + ligne verticale */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                        <div style={{ width: 30, height: 30, borderRadius: "50%",
                          background: C.brdL, border: `1px solid ${C.brd}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, fontWeight: 700, color: C.ink3 }}>
                          {h.actor.includes(".") ? h.actor.split(".")[1]?.trim()[0] ?? h.actor[0] : h.actor[0]}
                        </div>
                        {i < detail.history.length - 1 && (
                          <div style={{ width: 1, flex: 1, minHeight: 16, background: C.brdL, margin: "4px 0" }} />
                        )}
                      </div>
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.ink }}>{h.actor}</p>
                          <span style={{ fontSize: 11, color: C.ink4 }}>{h.time}</span>
                        </div>
                        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: C.ink3 }}>{h.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Onglet 1 : Transactions impliquées — WIP ─────── */}
          {drawerTab === 1 && <DrawerWIP
            icon="⇄"
            title="Transactions impliquées"
            description={`Visualisation des ${detail.txCount} transactions liées à cette alerte sur ${detail.period}.`}
            items={[
              "Tableau détaillé avec statut, canal et montant par transaction",
              "Filtres par type de flux et plage horaire",
              "Export CSV des transactions sélectionnées",
            ]}
          />}

          {/* ── Onglet 2 : Analyse des flux — WIP ───────────── */}
          {drawerTab === 2 && <DrawerWIP
            icon="⚡"
            title="Analyse des flux"
            description="Cartographie des flux entrants / sortants et détection de circuits atypiques."
            items={[
              "Graphe de flux interactif (entrant / sortant / cross-border)",
              "Détection automatique de schémas de fractionnement",
              "Corrélation avec d'autres alertes ouvertes",
            ]}
          />}
        </div>

        {/* ── Footer: Commentaires ─────────────────────────────── */}
        <div style={{ borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <button onClick={() => setCommentsOpen(o => !o)} style={{
            width: "100%", padding: "14px 16px", background: "none", border: "none",
            display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
          }}>
            <MessageSquare size={14} color={C.ink3} />
            <span style={{ fontSize: 13, color: C.ink, fontWeight: 500 }}>Commentaire d'analyse</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: C.accL, color: C.acc,
              padding: "1px 7px", borderRadius: 999 }}>{detail.comments}</span>
            <ChevronDown size={13} color={C.ink4} style={{ marginLeft: "auto",
              transform: commentsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {commentsOpen && (
            <div style={{ padding: "0 16px 16px" }}>
              {detail.comments > 0 ? (
                <div style={{ padding: "10px 12px", background: C.bg, borderRadius: 8,
                  border: `1px solid ${C.brdL}`, fontSize: 12.5, color: C.ink2 }}>
                  {detail.comments} commentaire{detail.comments > 1 ? "s" : ""} d'analyse. Cliquez pour consulter.
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 12.5, color: C.ink4 }}>Aucun commentaire pour l'instant.</p>
              )}
              <textarea placeholder="Ajouter un commentaire…" rows={3} style={{
                marginTop: 10, width: "100%", padding: "10px 12px",
                border: `1px solid ${C.brd}`, borderRadius: 8, fontSize: 13,
                resize: "none", fontFamily: "inherit", color: C.ink, outline: "none",
                boxSizing: "border-box" as const,
              }} />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </>
  );
}

const A_SCORE: Record<string, { bg: string; color: string; label: string }> = {
  critique: { bg: C.redL,    color: C.red,    label: "Critique" },
  fort:     { bg: C.orangeL, color: C.orange, label: "Fort"     },
  moyen:    { bg: C.amberL,  color: C.amber,  label: "Moyen"    },
  faible:   { bg: C.greenL,  color: C.green,  label: "Faible"   },
};
const A_STATUS: Record<string, { bg: string; color: string }> = {
  "En cours":  { bg: C.accL,   color: C.acc    },
  "Ouverte":   { bg: C.greenL, color: C.green  },
  "En retard": { bg: C.redL,   color: C.red    },
  "Clôturée":  { bg: C.brdL,   color: C.ink3   },
};
const A_TABS = [
  { label: "Toutes",    count: 143 },
  { label: "Critiques", count: 12  },
  { label: "En cours",  count: 47  },
  { label: "En retard", count: 8   },
  { label: "Clôturées", count: 76  },
];

function AlertsView({ onOpen }: { onOpen: (id: string) => void }) {
  const [tab, setTab] = useState(0);

  const TH = {
    padding: "0 14px 10px", fontSize: 11, fontWeight: 700,
    color: C.ink4, letterSpacing: "0.06em", textTransform: "uppercase" as const,
    textAlign: "left" as const, whiteSpace: "nowrap" as const,
  };
  const TD = {
    padding: "20px 16px", fontSize: 13.5, color: C.ink2,
    borderTop: `1px solid ${C.brdL}`, whiteSpace: "nowrap" as const,
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12.5, color: C.ink4 }}>Mardi 14 avril 2026</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>
            Alertes LCB-FT
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 8, fontSize: 12.5,
            background: C.card, border: `1px solid ${C.brd}`,
            cursor: "pointer", color: C.ink2, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}><Download size={13} /> Exporter CSV</button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 8, fontSize: 12.5,
            background: C.acc, border: "none",
            cursor: "pointer", color: "#fff", fontWeight: 500,
          }}><Plus size={13} /> Assigner en lot</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total actives", value: "143",  color: C.ink    },
          { label: "Critiques",     value: "12",   color: C.red    },
          { label: "En retard",     value: "8",    color: C.orange },
          { label: "Délai moyen",   value: "4.2h", color: C.acc    },
        ].map((k) => (
          <div key={k.label} style={{
            flex: 1, background: C.card, border: `1px solid ${C.brd}`,
            borderRadius: 10, padding: "14px 18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <p style={{ margin: "0 0 5px", fontSize: 11.5, color: C.ink4 }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.brd}`, marginBottom: 0 }}>
        {A_TABS.map((t, i) => (
          <button key={t.label} onClick={() => setTab(i)} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 18px", background: "none", border: "none",
            borderBottom: tab === i ? `2px solid ${C.acc}` : "2px solid transparent",
            color: tab === i ? C.acc : C.ink3,
            fontWeight: tab === i ? 600 : 400, fontSize: 13.5,
            cursor: "pointer", marginBottom: -1,
          }}>
            {t.label}
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 999,
              background: tab === i ? C.accL : C.brdL,
              color: tab === i ? C.acc : C.ink4,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, padding: "14px 0", marginBottom: 16, alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          flex: "0 0 260px", padding: "8px 12px",
          background: C.card, border: `1px solid ${C.brd}`,
          borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <Search size={14} color={C.ink4} />
          <span style={{ fontSize: 13, color: C.ink4 }}>Rechercher par entité, réf…</span>
        </div>
        {["Risque", "Statut", "Analyste", "Période"].map((f) => (
          <button key={f} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 12px", background: C.card,
            border: `1px solid ${C.brd}`, borderRadius: 8,
            fontSize: 13, color: C.ink3, cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>{f} <ChevronDown size={12} /></button>
        ))}
        <button style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
          padding: "8px 12px", background: "none", border: "none",
          fontSize: 13, color: C.ink4, cursor: "pointer",
        }}><Filter size={13} /> Filtres avancés</button>
      </div>

      {/* Table */}
      <div style={{
        background: C.card, border: `1px solid ${C.brd}`,
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
          <thead>
            <tr style={{ background: C.brdL }}>
              <th style={{ ...TH, width: 16 }}></th>
              <th style={TH}>Réf.</th>
              <th style={TH}>Entité</th>
              <th style={TH}>Risque</th>
              <th style={TH}>Règle déclenchée</th>
              <th style={{ ...TH, textAlign: "right" as const }}>Montant</th>
              <th style={TH}>Analyste</th>
              <th style={TH}>Statut</th>
              <th style={TH}>Âge</th>
              <th style={{ ...TH, textAlign: "right" as const }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ALERTS_ITEMS.map((a) => {
              const rs = A_SCORE[a.risk];
              const st = A_STATUS[a.status];
              const initials = a.analyst.split(" ").map((w) => w[0]).join("");
              return (
                <tr key={a.id} onClick={() => onOpen(a.id)}
                  style={{ cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.brdL + "60")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ ...TD, paddingLeft: 14 }}>
                    <div style={{
                      width: 14, height: 14, borderRadius: 3,
                      border: `1.5px solid ${C.brd}`, flexShrink: 0,
                    }} />
                  </td>
                  <td style={TD}>
                    <span style={{ fontFamily: "monospace", fontSize: 12, color: C.ink3 }}>{a.id}</span>
                  </td>
                  <td style={{ ...TD, fontWeight: 500, color: C.ink }}>{a.entity}</td>
                  <td style={TD}><Pill bg={rs.bg} color={rs.color}>{rs.label}</Pill></td>
                  <td style={{ ...TD, color: C.ink3 }}>{a.rule}</td>
                  <td style={{ ...TD, textAlign: "right" as const, fontWeight: 500 }}>{a.amount}</td>
                  <td style={TD}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: "50%",
                        background: C.accL, display: "flex", alignItems: "center",
                        justifyContent: "center", color: C.acc,
                        fontSize: 9, fontWeight: 700, flexShrink: 0,
                      }}>{initials}</div>
                      <span style={{ fontSize: 12.5 }}>{a.analyst}</span>
                    </div>
                  </td>
                  <td style={TD}><Pill bg={st.bg} color={st.color}>{a.status}</Pill></td>
                  <td style={TD}>
                    <span style={{
                      fontSize: 12, fontWeight: 600,
                      color: a.age >= 5 ? C.red : a.age >= 3 ? C.orange : C.ink4,
                    }}>J+{a.age}</span>
                  </td>
                  <td style={{ ...TD, textAlign: "right" as const }}>
                    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}
                      onClick={e => e.stopPropagation()}>
                      <button onClick={() => onOpen(a.id)} style={{
                        padding: "4px 10px", borderRadius: 6, fontSize: 11.5, fontWeight: 500,
                        background: C.accL, border: "none", cursor: "pointer", color: C.acc,
                      }}>Analyser</button>
                      {a.status !== "Clôturée" && (
                        <button style={{
                          padding: "4px 10px", borderRadius: 6, fontSize: 11.5,
                          background: C.brdL, border: "none", cursor: "pointer", color: C.ink3,
                        }}>Clôturer</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "14px 20px", borderTop: `1px solid ${C.brdL}`,
        }}>
          <span style={{ fontSize: 12.5, color: C.ink4 }}>10 sur 143 alertes</span>
          <div style={{ display: "flex", gap: 4 }}>
            {([1, 2, 3, "…", 15] as (number | string)[]).map((p, i) => (
              <button key={i} style={{
                width: 30, height: 30, borderRadius: 6,
                border: `1px solid ${p === 1 ? C.acc : C.brd}`,
                background: p === 1 ? C.acc : C.card,
                color: p === 1 ? "#fff" : C.ink3,
                fontSize: 12.5, cursor: "pointer",
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── RÈGLES DE DÉTECTION VIEW ───────────────────────────────── */
const REGLES_ITEMS = [
  { id: "R01", name: "Volume transaction > 10 000 €",  category: "Volume",       type: "Seuil",     triggers: 128, fp: 4.2,  lastAlert: "Auj.",  active: true  },
  { id: "R02", name: "Virements vers pays GAFI",        category: "Géographie",   type: "Référence", triggers: 47,  fp: 1.8,  lastAlert: "Hier",  active: true  },
  { id: "R03", name: "Cumul mensuel > 50 000 €",        category: "Volume",       type: "Seuil",     triggers: 34,  fp: 7.1,  lastAlert: "12/04", active: true  },
  { id: "R04", name: "Fractionnement < 10 000 €",       category: "Comportement", type: "Pattern",   triggers: 22,  fp: 14.3, lastAlert: "11/04", active: true  },
  { id: "R05", name: "Activité < 30 j. d'ouverture",   category: "Comportement", type: "Temporel",  triggers: 18,  fp: 22.2, lastAlert: "13/04", active: true  },
  { id: "R06", name: "Marchands liste noire ACPR",      category: "Listes",       type: "Référence", triggers: 0,   fp: null, lastAlert: "N/A",   active: false },
  { id: "R07", name: "Fréquence > 20 tx / 24 h",       category: "Comportement", type: "Fréquence", triggers: 41,  fp: 6.5,  lastAlert: "Auj.",  active: true  },
  { id: "R08", name: "Pays sous sanctions ONU",         category: "Géographie",   type: "Référence", triggers: 3,   fp: 0,    lastAlert: "08/04", active: true  },
  { id: "R09", name: "Variance des montants élevée",    category: "Comportement", type: "Pattern",   triggers: 15,  fp: 31.2, lastAlert: "10/04", active: false },
];

const R_CATS = ["Toutes", "Volume", "Comportement", "Géographie", "Listes"];

const CAT_PILL: Record<string, { bg: string; color: string }> = {
  "Volume":       { bg: C.accL,    color: C.acc    },
  "Géographie":   { bg: C.tealL,   color: C.teal   },
  "Comportement": { bg: C.amberL,  color: C.amber  },
  "Listes":       { bg: C.redL,    color: C.red    },
};
const TYPE_PILL: Record<string, { bg: string; color: string }> = {
  "Seuil":     { bg: C.blueL,   color: C.blue   },
  "Référence": { bg: C.greenL,  color: C.green  },
  "Pattern":   { bg: C.amberL,  color: C.amber  },
  "Temporel":  { bg: C.orangeL, color: C.orange },
  "Fréquence": { bg: C.tealL,   color: C.teal   },
};

function fpColor(fp: number | null) {
  if (fp === null) return C.ink4;
  if (fp <= 5)  return C.green;
  if (fp <= 15) return C.amber;
  return C.red;
}

function ReglesView() {
  const [cat, setCat] = useState("Toutes");
  const [rules, setRules] = useState(REGLES_ITEMS);

  const filtered     = cat === "Toutes" ? rules : rules.filter((r) => r.category === cat);
  const activeCount  = rules.filter((r) => r.active).length;
  const totalTrig    = rules.reduce((s, r) => s + r.triggers, 0);
  const withFp       = rules.filter((r) => r.fp !== null);
  const avgFp        = withFp.length ? (withFp.reduce((s, r) => s + (r.fp ?? 0), 0) / withFp.length).toFixed(1) : "N/A";

  const TH = {
    padding: "0 16px 10px", fontSize: 11, fontWeight: 700,
    color: C.ink4, letterSpacing: "0.06em", textTransform: "uppercase" as const,
    textAlign: "left" as const, whiteSpace: "nowrap" as const,
  };
  const TD = {
    padding: "14px 16px", fontSize: 13, color: C.ink2,
    borderTop: `1px solid ${C.brdL}`, whiteSpace: "nowrap" as const,
  };

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12.5, color: C.ink4 }}>Mardi 14 avril 2026</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>
            Règles de détection
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 8, fontSize: 12.5,
            background: C.card, border: `1px solid ${C.brd}`,
            cursor: "pointer", color: C.ink2, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}><Download size={13} /> Exporter</button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 8, fontSize: 12.5,
            background: C.acc, border: "none",
            cursor: "pointer", color: "#fff", fontWeight: 500,
          }}><Plus size={13} /> Nouvelle règle</button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Règles actives",       value: `${activeCount} / ${rules.length}`, color: C.acc   },
          { label: "Déclenchements / mois",value: String(totalTrig),                   color: C.ink   },
          { label: "Tx FP moyen",          value: `${avgFp}%`,                         color: fpColor(parseFloat(String(avgFp))) },
          { label: "Dernière mise à jour", value: "Auj. 09:58",                        color: C.ink3  },
        ].map((k) => (
          <div key={k.label} style={{
            flex: 1, background: C.card, border: `1px solid ${C.brd}`,
            borderRadius: 10, padding: "14px 18px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>
            <p style={{ margin: "0 0 5px", fontSize: 11.5, color: C.ink4 }}>{k.label}</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${C.brd}`, marginBottom: 0 }}>
        {R_CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)} style={{
            padding: "9px 18px", background: "none", border: "none",
            borderBottom: cat === c ? `2px solid ${C.acc}` : "2px solid transparent",
            color: cat === c ? C.acc : C.ink3,
            fontWeight: cat === c ? 600 : 400, fontSize: 13.5,
            cursor: "pointer", marginBottom: -1,
          }}>{c}</button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, padding: "14px 0", marginBottom: 16, alignItems: "center" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          flex: "0 0 260px", padding: "8px 12px",
          background: C.card, border: `1px solid ${C.brd}`,
          borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}>
          <Search size={14} color={C.ink4} />
          <span style={{ fontSize: 13, color: C.ink4 }}>Rechercher une règle…</span>
        </div>
        {["Type", "Performance"].map((f) => (
          <button key={f} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 12px", background: C.card,
            border: `1px solid ${C.brd}`, borderRadius: 8,
            fontSize: 13, color: C.ink3, cursor: "pointer",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}>{f} <ChevronDown size={12} /></button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        background: C.card, border: `1px solid ${C.brd}`,
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
          <thead>
            <tr style={{ background: C.brdL }}>
              <th style={TH}>ID</th>
              <th style={TH}>Règle</th>
              <th style={TH}>Catégorie</th>
              <th style={TH}>Type</th>
              <th style={{ ...TH, textAlign: "right" as const }}>Décl. / mois</th>
              <th style={{ ...TH, textAlign: "right" as const }}>Tx FP</th>
              <th style={TH}>Dernière alerte</th>
              <th style={{ ...TH, textAlign: "center" as const }}>Actif</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => {
              const cs = CAT_PILL[r.category] ?? { bg: C.brdL, color: C.ink3 };
              const ts = TYPE_PILL[r.type]    ?? { bg: C.brdL, color: C.ink3 };
              return (
                <tr key={r.id} style={{ opacity: r.active ? 1 : 0.5 }}>
                  <td style={TD}>
                    <span style={{ fontFamily: "monospace", fontSize: 11.5, color: C.ink4 }}>{r.id}</span>
                  </td>
                  <td style={{ ...TD, fontWeight: 500, color: C.ink }}>{r.name}</td>
                  <td style={TD}><Pill bg={cs.bg} color={cs.color}>{r.category}</Pill></td>
                  <td style={TD}><Pill bg={ts.bg} color={ts.color}>{r.type}</Pill></td>
                  <td style={{ ...TD, textAlign: "right" as const, fontWeight: 500 }}>
                    {r.triggers > 0 ? r.triggers : "0"}
                  </td>
                  <td style={{ ...TD, textAlign: "right" as const }}>
                    <span style={{ fontWeight: 600, color: fpColor(r.fp) }}>
                      {r.fp !== null ? `${r.fp}%` : "N/A"}
                    </span>
                  </td>
                  <td style={{ ...TD, color: C.ink4 }}>{r.lastAlert}</td>
                  <td style={{ ...TD, textAlign: "center" as const }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Toggle on={r.active} onToggle={() =>
                        setRules((prev) => prev.map((x) => x.id === r.id ? { ...x, active: !x.active } : x))
                      } />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FP legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 16 }}>
        <span style={{ fontSize: 12, color: C.ink4 }}>Taux FP :</span>
        {[
          { label: "Excellent ≤ 5%",   color: C.green  },
          { label: "Acceptable 5 à 15%", color: C.amber  },
          { label: "Élevé > 15%",      color: C.red    },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 12, color: C.ink4 }}>{label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── DASHBOARD VIEW ─────────────────────────────────────────── */
function DashboardView() {
  return (
    <>
      {/* Greeting */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", marginBottom: 26 }}>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12.5, color: C.ink4 }}>Mardi 14 avril 2026</p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>
            Bonjour, S. Dumont 👋
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 8, fontSize: 12.5,
            background: C.card, border: `1px solid ${C.brd}`,
            cursor: "pointer", color: C.ink2, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}><Calendar size={13} /> Mois en cours <ChevronDown size={12} /></button>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 14px", borderRadius: 8, fontSize: 12.5,
            background: C.card, border: `1px solid ${C.brd}`,
            cursor: "pointer", color: C.ink2, boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}><SlidersHorizontal size={13} /> Personnaliser</button>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <KpiCard title="Alertes en cours"   icon={<Clock         size={16} />} value="47"   sub="en traitement"      accent={C.acc}   />
        <KpiCard title="Clôturées (mois)"   icon={<CheckCircle   size={16} />} value="312"  sub="↑ +24 / sem."       accent={C.green} subColor={C.green} />
        <KpiCard title="En retard (> 30 j)" icon={<AlertTriangle size={16} />} value="12"   sub="↓ seuil dépassé"    accent={C.red}   subColor={C.red} />
        <KpiCard title="Délai moyen"        icon={<Timer         size={16} />} value="4.2h" sub="création → clôture" accent={C.acc}   />
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <PerformanceRules />
        <RuleStatusChart />
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <ClotureMotifs />
        <AlertsByMcc />
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 26 }}>
        <DonutChart />
        <AnalystLoad />
      </div>
      <div style={{ marginBottom: 20 }}><Notifications /></div>
      <RecentAlerts />
    </>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
export default function LcbFtDashboard() {
  const [activeView, setActiveView]       = useState("dashboard");
  const [openAlertId, setOpenAlertId]     = useState<string | null>(null);
  return (
    <div style={{
      display: "flex", fontFamily: "Inter, system-ui, sans-serif",
      background: C.bg, minHeight: "100vh", colorScheme: "light",
    }}>
      <Sidebar activeView={activeView} onNav={(v) => { setActiveView(v); setOpenAlertId(null); }} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <main style={{ flex: 1, padding: "26px 30px", overflowY: "auto" }}>
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "alertes"   && <AlertsView onOpen={setOpenAlertId} />}
          {activeView === "regles"    && <ReglesView />}
          {activeView === "criteres"  && <WIPView viewId="criteres" />}
          {activeView === "listes"    && <WIPView viewId="listes" />}
        </main>
      </div>

      {openAlertId && (
        <AlertDrawer alertId={openAlertId} onClose={() => setOpenAlertId(null)} />
      )}
      <DesktopOnlyModal backHref="/lcb-ft/description" backLabel="Retour au case study" />
    </div>
  );
}
