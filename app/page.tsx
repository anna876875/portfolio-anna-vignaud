"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import Link from "next/link";
import { useRouter } from "next/navigation";
import _C from "@/data/content.json";
const CH = _C.home;

/* ═══════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════ */
const SP    = [0.22, 1, 0.36, 1] as const;
const INK   = "var(--color-label)";
const INK2  = "var(--color-label-2)";
const INK3  = "var(--color-label-3)";
const BG    = "var(--color-bg-primary)";
const SURF  = "var(--color-bg-secondary)";
const BORD  = "var(--color-sep-opaque)";
const BLUE   = "#A259FF";
const NAVY   = "#1e3a8a";
const GRN    = "#34C759";
const FGRN   = "#A8D400";
const INDIGO = "#4F46E5";

function useIsMobile(bp = 768) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${bp}px)`);
    setM(mq.matches);
    const h = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, [bp]);
  return m;
}


/* ═══════════════════════════════════════════════════════════════════
   SVG MOCKUPS — même langage technique que la Hero
   ═══════════════════════════════════════════════════════════════════ */

/* ── PayNow Dashboard Mockup ── */
function PayNowMockupSVG() {
  const NAVY = "rgba(30,58,138,";
  const chartLine = "M 72,120 C 77,131 80,137 82,137 C 88,135 90,131 101,122 C 111,114 118,116 130,113 C 141,110 142,114 152,109 C 162,104 168,112 172,111 C 184,108 189,104 198,101 C 204,99 208,97 210,93";
  const chartArea = chartLine + " L 210,165 L 72,165 Z";
  const GR = "rgba(5,150,105,0.8)";
  const RD = "rgba(220,38,38,0.8)";

  const debitRows = [
    { label:"Taux d'accept.", val:"95.8 %", delta:"+0.1pt", positive:true },
    { label:"Nb. transactions",val:"28 220", delta:"+4.0 %", positive:true },
    { label:"Volume d'aff.",   val:"3.65 M€",delta:"+4.8 %", positive:true },
    { label:"Panier moyen",    val:"129 €",  delta:"+0.8 %", positive:true },
  ];
  const creditRows = [
    { label:"Taux d'accept.", val:"98.8 %", delta:"-0.1pt", positive:false },
    { label:"Nb. transactions",val:"815",    delta:"+1.6 %", positive:true },
    { label:"Volume d'aff.",   val:"105 K€", delta:"+2.0 %", positive:true },
    { label:"Panier moyen",    val:"129 €",  delta:"-0.2 %", positive:false },
  ];

  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      <defs>
        <linearGradient id="pnThumbFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1e40af" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#1e40af" stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* grid bg */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1="0" y1={38*i} x2="400" y2={38*i} stroke={NAVY+"0.04)"} strokeWidth="0.5" />
      ))}

      {/* ── Sidebar ── */}
      <rect x="8" y="8" width="50" height="174" rx="5" fill={NAVY+"0.06)"} stroke={NAVY+"0.18)"} strokeWidth="0.6" />
      {/* Logo */}
      <rect x="12" y="13" width="16" height="7" rx="1.5" fill={NAVY+"0.55)"} />
      <rect x="30" y="14" width="22" height="3" rx="1" fill={NAVY+"0.32)"} />
      <rect x="30" y="19" width="14" height="2" rx="1" fill={NAVY+"0.18)"} />
      {/* Nav items */}
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          <rect x="13" y={30+i*14} width="6" height="5" rx="1"
            fill={i===0 ? NAVY+"0.6)" : "rgba(0,0,0,0.1)"} />
          <rect x="22" y={31+i*14} width={i===0?26:18+((i*7)%12)} height="3" rx="1"
            fill={i===0 ? NAVY+"0.35)" : "rgba(0,0,0,0.07)"} />
        </g>
      ))}
      <line x1="12" y1="122" x2="54" y2="122" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x="13" y={126+i*12} width="5" height="5" rx="1" fill="rgba(0,0,0,0.09)" />
          <rect x="22" y={127+i*12} width="18" height="3" rx="1" fill="rgba(0,0,0,0.06)" />
        </g>
      ))}
      {/* User */}
      <circle cx="23" cy="175" r="7" fill="rgba(124,58,237,0.32)" />
      <rect x="33" y="172" width="20" height="3" rx="1" fill="rgba(0,0,0,0.1)" />
      <rect x="33" y="177" width="14" height="2.5" rx="1" fill="rgba(0,0,0,0.06)" />

      {/* ── Main area ── */}
      <rect x="62" y="8" width="330" height="174" rx="5" fill="white" stroke={NAVY+"0.1)"} strokeWidth="0.5" />
      {/* Header */}
      <rect x="62" y="8" width="330" height="19" rx="5" fill={NAVY+"0.04)"} />
      <rect x="62" y="20" width="330" height="7" fill={NAVY+"0.04)"} />
      <line x1="62" y1="27" x2="392" y2="27" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />
      <rect x="70" y="11" width="68" height="8" rx="2" fill="rgba(0,0,0,0.06)" />
      <rect x="300" y="11" width="24" height="7" rx="3.5" fill="rgba(59,130,246,0.38)" />
      <circle cx="318" cy="14.5" r="3" fill="white" />
      <circle cx="330" cy="14.5" r="3.5" fill="rgba(0,0,0,0.07)" />
      <circle cx="332" cy="11.5" r="2" fill="rgba(239,68,68,0.75)" />
      <rect x="342" y="11" width="14" height="7" rx="2" fill="rgba(0,0,0,0.05)" />
      {/* Title + active tab */}
      <text x="70" y="38" fontSize="7.5" fontWeight="600" fill={NAVY+"0.72)"} fontFamily="Inter,sans-serif">Dashboard</text>
      <rect x="295" y="30" width="50" height="10" rx="4" fill={NAVY+"0.78)"} />
      <rect x="348" y="30" width="36" height="10" rx="4" fill="transparent" />

      {/* ── Card 1: Volume chart ── */}
      <rect x="64" y="44" width="152" height="132" rx="5" stroke={NAVY+"0.13)"} strokeWidth="0.6" fill="white" />
      <text x="72" y="57" fontSize="5.5" fontWeight="600" fill="rgba(0,0,0,0.55)" fontFamily="Inter,sans-serif">Volume d&apos;affaires</text>
      <text x="72" y="65" fontSize="4.5" fill="rgba(0,0,0,0.28)" fontFamily="monospace">Mois dernier</text>
      {/* Chart grid */}
      <line x1="72" y1="141" x2="210" y2="141" stroke="rgba(0,0,0,0.045)" strokeWidth="0.5" />
      <line x1="72" y1="118" x2="210" y2="118" stroke="rgba(0,0,0,0.045)" strokeWidth="0.5" />
      <line x1="72" y1="94"  x2="210" y2="94"  stroke="rgba(0,0,0,0.045)" strokeWidth="0.5" />
      {/* Area + line */}
      <path d={chartArea} fill="url(#pnThumbFill)" />
      <path d={chartLine} fill="none" stroke="#1e3a8a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

      {/* ── Card 2: Métriques ── */}
      <rect x="220" y="44" width="168" height="132" rx="5" stroke={NAVY+"0.13)"} strokeWidth="0.6" fill="white" />
      <text x="228" y="57" fontSize="5.5" fontWeight="600" fill="rgba(0,0,0,0.55)" fontFamily="Inter,sans-serif">Métriques d&apos;acceptation</text>
      <rect x="312" y="48" width="70" height="10" rx="3" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.09)" strokeWidth="0.4" />
      <text x="316" y="55" fontSize="4.5" fill="rgba(0,0,0,0.4)" fontFamily="Inter,sans-serif">Autorisation ▾</text>
      {/* Column headers */}
      <text x="228" y="72" fontSize="4.5" fontWeight="600" fill="rgba(0,0,0,0.3)" fontFamily="monospace" letterSpacing="0.06em">DÉBIT</text>
      <text x="306" y="72" fontSize="4.5" fontWeight="600" fill="rgba(0,0,0,0.3)" fontFamily="monospace" letterSpacing="0.06em">CRÉDIT</text>
      <line x1="302" y1="67" x2="302" y2="171" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />
      {/* Metric rows */}
      {debitRows.map(({label,val,delta,positive},i) => (
        <g key={i}>
          <text x="228" y={80+i*22}   fontSize="4.5" fill="rgba(0,0,0,0.27)" fontFamily="Inter,sans-serif">{label}</text>
          <text x="228" y={88+i*22}   fontSize="5.5" fontWeight="600" fill="rgba(0,0,0,0.7)" fontFamily="Inter,sans-serif">{val}</text>
          <text x="258" y={88+i*22}   fontSize="4.5" fill={positive?GR:RD} fontFamily="monospace">{delta}</text>
        </g>
      ))}
      {creditRows.map(({label,val,delta,positive},i) => (
        <g key={i}>
          <text x="306" y={80+i*22}   fontSize="4.5" fill="rgba(0,0,0,0.27)" fontFamily="Inter,sans-serif">{label}</text>
          <text x="306" y={88+i*22}   fontSize="5.5" fontWeight="600" fill="rgba(0,0,0,0.7)" fontFamily="Inter,sans-serif">{val}</text>
          <text x="336" y={88+i*22}   fontSize="4.5" fill={positive?GR:RD} fontFamily="monospace">{delta}</text>
        </g>
      ))}
      <text x="384" y="170" textAnchor="end" fontSize="4" fill="rgba(0,0,0,0.22)" fontFamily="monospace">vs période précédente</text>

      {/* Corner brackets */}
      <path d="M 1 12 L 1 1 L 12 1"     stroke={NAVY+"0.28)"} strokeWidth="0.8" fill="none" />
      <path d="M 388 1 L 399 1 L 399 12"   stroke={NAVY+"0.28)"} strokeWidth="0.8" fill="none" />
      <path d="M 1 178 L 1 189 L 12 189"   stroke={NAVY+"0.28)"} strokeWidth="0.8" fill="none" />
      <path d="M 388 189 L 399 189 L 399 178" stroke={NAVY+"0.28)"} strokeWidth="0.8" fill="none" />
      <text x="4" y="189" fontSize="6" fill={NAVY+"0.22)"} fontFamily="monospace">fig.04 · dashboard fintech / SaaS · paiement B2B</text>
    </svg>
  );
}

function SystemMockupSVG() {
  const colors = [BLUE, "#5856D6", FGRN, "#FF9500", "#FF3B30", "#32ADE6"];
  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      {[0,1,2,3,4].map(i => (
        <line key={`h${i}`} x1="0" y1={38*i} x2="400" y2={38*i} stroke="rgba(37,99,235,0.04)" strokeWidth="0.5" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <line key={`v${i}`} x1={40*i} y1="0" x2={40*i} y2="190" stroke="rgba(37,99,235,0.04)" strokeWidth="0.5" />
      ))}
      <text x="12" y="14" fontSize="7" fontFamily="monospace" fill="rgba(37,99,235,0.5)" letterSpacing="0.10em">COLORS</text>
      {colors.map((c,i) => (
        <g key={i}>
          <circle cx={12+i*28} cy="30" r="11" fill={c} opacity="0.85" />
          <text x={12+i*28} y="50" textAnchor="middle" fontSize="5.5" fill="rgba(0,0,0,0.25)" fontFamily="monospace">
            {["blue","purple","green","amber","red","cyan"][i]}
          </text>
        </g>
      ))}
      <line x1="12" y1="19" x2="152" y2="19" stroke="rgba(37,99,235,0.12)" strokeWidth="0.5" />
      <line x1="12" y1="16" x2="12" y2="22" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1="152" y1="16" x2="152" y2="22" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <text x="82" y="17" textAnchor="middle" fontSize="5.5" fill="rgba(37,99,235,0.35)" fontFamily="monospace">6 system colors</text>
      <text x="210" y="14" fontSize="7" fontFamily="monospace" fill="rgba(37,99,235,0.5)" letterSpacing="0.10em">TYPOGRAPHY</text>
      <rect x="210" y="20" width="170" height="8" rx="2" fill="rgba(0,0,0,0.14)" />
      <rect x="210" y="32" width="130" height="6" rx="1.5" fill="rgba(0,0,0,0.09)" />
      <rect x="210" y="42" width="100" height="5" rx="1.5" fill="rgba(0,0,0,0.06)" />
      <line x1="388" y1="20" x2="388" y2="47" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1="385" y1="20" x2="391" y2="20" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1="385" y1="47" x2="391" y2="47" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1="12" y1="60" x2="388" y2="60" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
      <text x="12" y="75" fontSize="7" fontFamily="monospace" fill="rgba(37,99,235,0.5)" letterSpacing="0.10em">BUTTONS</text>
      <rect x="12" y="80" width="88" height="24" rx="12" fill={BLUE} opacity="0.9" />
      <rect x="110" y="80" width="88" height="24" rx="12" fill="none" stroke={BLUE} strokeWidth="1.2" opacity="0.6" />
      <rect x="208" y="80" width="88" height="24" rx="7" fill="rgba(0,0,0,0.07)" />
      <line x1="12" y1="110" x2="100" y2="110" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1="12" y1="107" x2="12" y2="113" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1="100" y1="107" x2="100" y2="113" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <text x="56" y="120" textAnchor="middle" fontSize="5.5" fill="rgba(37,99,235,0.35)" fontFamily="monospace">88px · 24px</text>
      <text x="12" y="134" fontSize="7" fontFamily="monospace" fill="rgba(37,99,235,0.5)" letterSpacing="0.10em">CARDS</text>
      <rect x="12" y="140" width="114" height="40" rx="8" fill="white" stroke={BORD} strokeWidth="1" />
      <rect x="140" y="140" width="114" height="40" rx="8" fill="rgba(37,99,235,0.05)" stroke="rgba(37,99,235,0.14)" strokeWidth="1" />
      <rect x="268" y="140" width="120" height="40" rx="8" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
      <text x="20" y="153" fontSize="6" fill="rgba(0,0,0,0.3)" fontFamily="monospace">default</text>
      <text x="148" y="153" fontSize="6" fill="rgba(37,99,235,0.5)" fontFamily="monospace">tinted</text>
      <text x="276" y="153" fontSize="6" fill="rgba(0,0,0,0.3)" fontFamily="monospace">glass</text>
      <rect x="20" y="158" width="70" height="3" rx="1.5" fill="rgba(0,0,0,0.08)" />
      <rect x="20" y="165" width="50" height="2.5" rx="1.2" fill="rgba(0,0,0,0.05)" />
      <path d="M 1 1 L 1 12 L 12 12" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 399 1 L 399 12 L 388 12" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 1 189 L 1 178 L 12 178" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 399 189 L 399 178 L 388 178" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <text x="4" y="189" fontSize="6" fill="rgba(37,99,235,0.22)" fontFamily="monospace">fig.01 · design system / 15 composants · 80+ tokens</text>
    </svg>
  );
}


function DashMockupSVG() {
  const bars = [65,42,85,30,72,55,90,40];
  const pts  = [[12,118],[28,98],[44,106],[60,82],[76,90],[92,68],[108,76],[124,60]] as [number,number][];
  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      {[0,1,2,3,4].map(i => (
        <line key={`h${i}`} x1="0" y1={38*i} x2="400" y2={38*i} stroke="rgba(5,150,105,0.04)" strokeWidth="0.5" />
      ))}
      <rect x="10" y="8" width="380" height="172" rx="8" stroke="rgba(5,150,105,0.22)" strokeWidth="1" fill="rgba(5,150,105,0.02)" />
      <rect x="10" y="8" width="380" height="18" rx="8" fill="rgba(5,150,105,0.07)" />
      {["#FF5F57","#FEBC2E","#28C840"].map((c,i) => (
        <circle key={i} cx={20+i*12} cy="17" r="4" fill={c} opacity="0.7" />
      ))}
      <rect x="60" y="12" width="280" height="10" rx="5" fill="rgba(0,0,0,0.05)" />
      {[
        { v:"−35%", l:"Lecture rapport",  c:"rgba(5,150,105,0.85)"  },
        { v:"78%",  l:"Adoption export",  c:"rgba(37,99,235,0.85)"  },
        { v:"89%",  l:"Satisfaction",     c:"rgba(124,58,237,0.85)" },
      ].map((m,i) => (
        <g key={i}>
          <rect x={18+i*90} y="34" width="82" height="28" rx="4" fill="rgba(255,255,255,0.85)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
          <text x={59+i*90} y="48" textAnchor="middle" fontSize="12" fontWeight="800" fill={m.c}>{m.v}</text>
          <text x={59+i*90} y="57" textAnchor="middle" fontSize="5.5" fill="rgba(0,0,0,0.3)" fontFamily="monospace">{m.l}</text>
        </g>
      ))}
      <text x="312" y="40" fontSize="6" fill="rgba(5,150,105,0.5)" fontFamily="monospace">3 KPIs</text>
      <text x="312" y="48" fontSize="6" fill="rgba(0,0,0,0.2)" fontFamily="monospace">(était 24)</text>
      <line x1="18" y1="70" x2="382" y2="70" stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" />
      <text x="18" y="82" fontSize="6" fill="rgba(0,0,0,0.25)" fontFamily="monospace" letterSpacing="0.08em">RAPPORT MENSUEL</text>
      {bars.map((h,i) => (
        <rect key={i} x={18+i*24} y={146-h*0.58} width="18" height={h*0.58} rx="2" fill={`rgba(5,150,105,${0.25+i*0.08})`} />
      ))}
      <line x1="18" y1="146" x2="210" y2="146" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />
      <polyline points={pts.map(([x,y]) => `${x+222},${y}`).join(" ")} stroke="rgba(5,150,105,0.65)" strokeWidth="1.5" fill="none" />
      <polygon
        points={[...pts.map(([x,y]) => `${x+222},${y}`), `${pts[pts.length-1][0]+222},146`, `${pts[0][0]+222},146`].join(" ")}
        fill="rgba(5,150,105,0.07)" />
      {pts.map(([x,y],i) => <circle key={i} cx={x+222} cy={y} r="2.5" fill="rgba(5,150,105,0.8)" />)}
      <path d="M 1 1 L 1 12 L 12 12" stroke="rgba(5,150,105,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 399 1 L 399 12 L 388 12" stroke="rgba(5,150,105,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 1 189 L 1 178 L 12 178" stroke="rgba(5,150,105,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 399 189 L 399 178 L 388 178" stroke="rgba(5,150,105,0.28)" strokeWidth="0.8" fill="none" />
      <text x="4" y="189" fontSize="6" fill="rgba(5,150,105,0.22)" fontFamily="monospace">fig.03 · data viz / 24 KPIs → 7 · −35% temps de lecture</text>
    </svg>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   ANNOTATED STATS — profil technique style spec-sheet
   ═══════════════════════════════════════════════════════════════════ */
function AnnotatedStats() {
  return (
    <svg viewBox="0 0 400 300" fill="none" aria-hidden="true"
      style={{ width: "100%", display: "block" }}>
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`h${i}`} x1="0" y1={i*40} x2="400" y2={i*40}
          stroke="rgba(37,99,235,0.04)" strokeWidth="0.5" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="300"
          stroke="rgba(37,99,235,0.04)" strokeWidth="0.5" />
      ))}

      <line x1="0" y1="28" x2="400" y2="28" stroke="rgba(37,99,235,0.1)" strokeWidth="0.5" />
      <text x="8" y="21" fontSize="7" fontFamily="monospace"
        fill="rgba(37,99,235,0.45)" letterSpacing="0.14em">PROFIL · ANNA V.</text>

      {/* STAT 01 — Projets */}
      <text x="12" y="88" fontFamily="Inter, -apple-system, sans-serif"
        fontSize="60" fontWeight="200" fill="rgba(37,99,235,0.85)" letterSpacing="-0.04em">3</text>
      <line x1="56" y1="54" x2="390" y2="54" stroke="rgba(228,228,231,1)" strokeWidth="0.5" />
      <text x="60" y="51" fontSize="7" fontFamily="monospace"
        fill="rgba(0,0,0,0.28)" letterSpacing="0.1em">01 · PROJETS EN PRODUCTION</text>
      <line x1="56" y1="70" x2="390" y2="70" stroke="rgba(228,228,231,1)" strokeWidth="0.5" />
      <text x="60" y="67" fontSize="7" fontFamily="monospace"
        fill="rgba(0,0,0,0.18)" letterSpacing="0.1em">Next.js · React Native · D3.js</text>
      <line x1="4" y1="38" x2="4" y2="96" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1="1" y1="38" x2="7" y2="38" stroke="rgba(37,99,235,0.25)" strokeWidth="0.5" />
      <line x1="1" y1="96" x2="7" y2="96" stroke="rgba(37,99,235,0.25)" strokeWidth="0.5" />

      <line x1="0" y1="108" x2="400" y2="108" stroke="rgba(228,228,231,1)" strokeWidth="0.5" />

      {/* STAT 02 — Formation */}
      <text x="12" y="168" fontFamily="Inter, -apple-system, sans-serif"
        fontSize="44" fontWeight="200" fill="rgba(124,58,237,0.85)" letterSpacing="-0.03em">Bac+5</text>
      <line x1="0" y1="180" x2="400" y2="180" stroke="rgba(228,228,231,1)" strokeWidth="0.5" />
      <text x="12" y="193" fontSize="7" fontFamily="monospace"
        fill="rgba(0,0,0,0.28)" letterSpacing="0.1em">02 · MASTER UX DESIGN</text>
      <line x1="0" y1="201" x2="400" y2="201" stroke="rgba(228,228,231,1)" strokeWidth="0.5" />
      <line x1="392" y1="138" x2="392" y2="201" stroke="rgba(124,58,237,0.2)" strokeWidth="0.5" />
      <line x1="388" y1="138" x2="396" y2="138" stroke="rgba(124,58,237,0.25)" strokeWidth="0.5" />
      <line x1="388" y1="201" x2="396" y2="201" stroke="rgba(124,58,237,0.25)" strokeWidth="0.5" />

      {/* STAT 03 — WCAG */}
      <text x="12" y="252" fontFamily="Inter, -apple-system, sans-serif"
        fontSize="40" fontWeight="200" fill="rgba(5,150,105,0.85)" letterSpacing="-0.02em">WCAG AA</text>
      <line x1="0" y1="262" x2="400" y2="262" stroke="rgba(228,228,231,1)" strokeWidth="0.5" />
      <text x="12" y="273" fontSize="7" fontFamily="monospace"
        fill="rgba(0,0,0,0.28)" letterSpacing="0.1em">03 · ACCESSIBILITÉ WEB CERTIFIÉE</text>

      <path d="M 1 1 L 1 12 L 12 12" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 399 1 L 399 12 L 388 12" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 1 299 L 1 288 L 12 288" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 399 299 L 399 288 L 388 288" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <text x="4" y="298" fontSize="6" fill="rgba(37,99,235,0.22)" fontFamily="monospace">fig.04 · profil / certifications</text>
    </svg>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   ABOUT ICONS — schémas techniques Figma-style en vert anis
   ═══════════════════════════════════════════════════════════════════ */
function IconResearch() {
  return (
    <svg viewBox="0 0 36 36" width="38" height="38" fill="none" aria-hidden="true">
      <circle cx="15" cy="13" r="5.5" stroke={FGRN} strokeWidth="2"/>
      <path d="M9 28c0-3.314 2.686-6 6-6h0c3.314 0 6 2.686 6 6" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="25" cy="25" r="5" stroke={FGRN} strokeWidth="2"/>
      <line x1="28.5" y1="28.5" x2="32" y2="32" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="2" y1="13" x2="5" y2="13" stroke={FGRN} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>
      <line x1="2" y1="17" x2="4" y2="17" stroke={FGRN} strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
    </svg>
  );
}

function IconDesign() {
  return (
    <svg viewBox="0 0 36 36" width="38" height="38" fill="none" aria-hidden="true">
      <rect x="7" y="7" width="22" height="22" rx="2" stroke={FGRN} strokeWidth="2"/>
      <line x1="7"  y1="3"  x2="7"  y2="5"  stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="18" y1="3"  x2="18" y2="5"  stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="29" y1="3"  x2="29" y2="5"  stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="7"  y1="31" x2="7"  y2="33" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="18" y1="31" x2="18" y2="33" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="29" y1="31" x2="29" y2="33" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="3"  y1="7"  x2="5"  y2="7"  stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="3"  y1="18" x2="5"  y2="18" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="3"  y1="29" x2="5"  y2="29" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="31" y1="7"  x2="33" y2="7"  stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="31" y1="18" x2="33" y2="18" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <line x1="31" y1="29" x2="33" y2="29" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
      <rect x="12" y="12" width="12" height="12" rx="1" stroke={FGRN} strokeWidth="1.5" opacity="0.4" fill={`${FGRN}18`}/>
    </svg>
  );
}

function IconCode() {
  return (
    <svg viewBox="0 0 36 36" width="38" height="38" fill="none" aria-hidden="true">
      <polyline points="12,9 5,18 12,27"  stroke={FGRN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="24,9 31,18 24,27" stroke={FGRN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="21" y1="7" x2="15" y2="29" stroke={FGRN} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function IconFormation() {
  return (
    <svg viewBox="0 0 36 36" width="38" height="38" fill="none" aria-hidden="true">
      <polygon points="18,4 32,18 18,32 4,18" stroke={FGRN} strokeWidth="2"/>
      <circle cx="18" cy="18" r="4" stroke={FGRN} strokeWidth="2" fill={`${FGRN}20`}/>
      <line x1="18" y1="4"  x2="18" y2="2"  stroke={FGRN} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="18" y1="32" x2="18" y2="34" stroke={FGRN} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="4"  y1="18" x2="2"  y2="18" stroke={FGRN} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
      <line x1="32" y1="18" x2="34" y2="18" stroke={FGRN} strokeWidth="1.5" opacity="0.4" strokeLinecap="round"/>
    </svg>
  );
}

function FloatCard({ icon, stat, label, sub, delay = 0, floatDelay = 0 }: {
  icon: React.ReactNode; stat: string; label: string; sub: string; delay?: number; floatDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: SP, delay: delay / 1000 }}>
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        style={{
          padding: "22px 20px",
          borderRadius: "var(--r-xl)",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 56, height: 56, borderRadius: 14,
          background: `${FGRN}12`, border: `1px solid ${FGRN}28`,
          marginBottom: 16 }}>
          {icon}
        </div>
        <p style={{ fontSize: "clamp(16px,1.4vw,20px)", fontWeight: 200, color: INK,
          letterSpacing: "-0.02em", marginBottom: 4, lineHeight: 1.1 }}>{stat}</p>
        <p className="hig-footnote" style={{ fontWeight: 500, color: INK, marginBottom: 4 }}>{label}</p>
        <p className="hig-caption2" style={{ color: INK3 }}>{sub}</p>
      </motion.div>
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   SKILL DIAGRAM — cartographie compétences style circuit / sequencer
   ═══════════════════════════════════════════════════════════════════ */
function SkillDiagram() {
  const tracks = [
    {
      label: "UX RESEARCH",
      textColor: "rgba(37,99,235,0.65)",
      lineColor: "rgba(37,99,235,0.18)",
      dotColor:  "rgba(37,99,235,1)",
      ringColor: "rgba(37,99,235,0.1)",
      y: 100,
      skills: ["Recherche", "Entretiens", "Personas", "Tests util.", "User flows", "Architecture"],
    },
    {
      label: "UI DESIGN",
      textColor: "rgba(124,58,237,0.65)",
      lineColor: "rgba(124,58,237,0.18)",
      dotColor:  "rgba(124,58,237,1)",
      ringColor: "rgba(124,58,237,0.1)",
      y: 195,
      skills: ["Design System", "Figma", "Typographie", "Prototypage", "WCAG AA", "Micro-anim."],
    },
    {
      label: "FRONTEND",
      textColor: "rgba(10,207,131,0.75)",
      lineColor: "rgba(10,207,131,0.18)",
      dotColor:  "#0ACF83",
      ringColor: "rgba(10,207,131,0.12)",
      y: 280,
      skills: ["React / Next.js", "TypeScript", "Tailwind CSS", "CSS anim.", "Framer Motion", "Vercel"],
    },
  ];

  const X0 = 110, X1 = 870, N = 6;
  const xs = [0,1,2,3,4,5].map(i => Math.round(X0 + i * (X1 - X0) / (N - 1)));

  return (
    <svg viewBox="0 0 900 330" fill="none" aria-hidden="true"
      style={{ width: "100%", display: "block", minWidth: 680 }}>
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <line key={`h${i}`} x1="0" y1={i*40} x2="900" y2={i*40}
          stroke="rgba(37,99,235,0.03)" strokeWidth="0.5" />
      ))}
      {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].map(i => (
        <line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="330"
          stroke="rgba(37,99,235,0.03)" strokeWidth="0.5" />
      ))}

      {/* Bracket de mesure supérieur */}
      <line x1={X0} y1="38" x2={X1} y2="38" stroke="rgba(37,99,235,0.15)" strokeWidth="0.5" />
      <line x1={X0} y1="34" x2={X0} y2="42" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <line x1={X1} y1="34" x2={X1} y2="42" stroke="rgba(37,99,235,0.2)" strokeWidth="0.5" />
      <text x={(X0+X1)/2} y="30" textAnchor="middle" fontSize="8"
        fill="rgba(37,99,235,0.4)" fontFamily="monospace" letterSpacing="0.1em">
        COMPÉTENCES TRANSVERSALES · 3 DOMAINES · 18 EXPERTISES
      </text>

      {tracks.map(track => (
        <g key={track.label}>
          {/* Label domaine placé AU-DESSUS de la ligne de track */}
          <text x="10" y={track.y - 12} fontSize="10" fontFamily="monospace"
            fill={track.textColor} letterSpacing="0.12em" fontWeight="600">
            {track.label}
          </text>
          {/* Ligne de track */}
          <line x1={xs[0]} y1={track.y} x2={xs[N-1]} y2={track.y}
            stroke={track.lineColor} strokeWidth="1" />
          {/* Skill dots + labels */}
          {track.skills.map((skill, si) => (
            <g key={`${track.label}-${si}`}>
              <circle cx={xs[si]} cy={track.y} r="8" fill={track.ringColor} />
              <circle cx={xs[si]} cy={track.y} r="3" fill={track.dotColor} />
              <line x1={xs[si]} y1={track.y+10} x2={xs[si]} y2={track.y+16}
                stroke="rgba(0,0,0,0.1)" strokeWidth="0.5" />
              <text x={xs[si]} y={track.y+27} textAnchor="middle"
                fontSize="9" fontFamily="monospace" fill="rgba(0,0,0,0.35)">{skill}</text>
            </g>
          ))}
        </g>
      ))}

      {/* Lignes d'interdépendance entre domaines */}
      <line x1={xs[2]} y1={tracks[0].y+10} x2={xs[2]} y2={tracks[1].y-10}
        stroke="rgba(37,99,235,0.07)" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1={xs[4]} y1={tracks[0].y+10} x2={xs[3]} y2={tracks[1].y-10}
        stroke="rgba(37,99,235,0.07)" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1={xs[1]} y1={tracks[1].y+10} x2={xs[1]} y2={tracks[2].y-10}
        stroke="rgba(37,99,235,0.07)" strokeWidth="0.5" strokeDasharray="3 3" />
      <line x1={xs[4]} y1={tracks[1].y+10} x2={xs[4]} y2={tracks[2].y-10}
        stroke="rgba(37,99,235,0.07)" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* Coins */}
      <path d="M 1 1 L 1 12 L 12 12" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 899 1 L 899 12 L 888 12" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 1 329 L 1 318 L 12 318" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <path d="M 899 329 L 899 318 L 888 318" stroke="rgba(37,99,235,0.28)" strokeWidth="0.8" fill="none" />
      <text x="4" y="328" fontSize="7" fill="rgba(37,99,235,0.22)" fontFamily="monospace">
        fig.05 · cartographie compétences / 3 domaines · 18 expertises
      </text>
    </svg>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   UI ATOMS
   ═══════════════════════════════════════════════════════════════════ */

/* Schéma technique décoratif — Hero homepage */
function HeroTechLines() {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 1.6, duration: 1.2 }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}
      aria-hidden="true">
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1440 900" fill="none" preserveAspectRatio="xMidYMid slice">

        {/* Coins de cadrage — ancrés sur la grille 48px (x=96=2×48, x=1344=28×48, y=48, y=864=18×48) */}
        <motion.path d="M 96 96 L 96 48 L 144 48" stroke={FGRN} strokeWidth="0.9"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 1.9, duration: 0.7, ease: "easeOut" }}/>
        <motion.path d="M 1344 48 L 1392 48 L 1392 96" stroke={FGRN} strokeWidth="0.9"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.0, duration: 0.7, ease: "easeOut" }}/>
        <motion.path d="M 96 816 L 96 864 L 144 864" stroke={FGRN} strokeWidth="0.9"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.1, duration: 0.7, ease: "easeOut" }}/>
        <motion.path d="M 1344 864 L 1392 864 L 1392 816" stroke={FGRN} strokeWidth="0.9"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 2.2, duration: 0.7, ease: "easeOut" }}/>

        {/* Règle de mesure horizontale — ancrée à x=96 (2e ligne de grille) */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: 2.3, duration: 0.6 }}>
          <line x1="96" y1="432" x2="480" y2="432" stroke={FGRN} strokeWidth="0.5" strokeDasharray="5 5"/>
          <line x1="96" y1="426" x2="96" y2="438" stroke={FGRN} strokeWidth="0.9"/>
          <line x1="480" y1="426" x2="480" y2="438" stroke={FGRN} strokeWidth="0.9"/>
          <text x="112" y="426" fontSize="7" fontFamily="monospace" fill={FGRN}>48px · grid</text>
        </motion.g>

        {/* Guide vertical droit + croix de repérage — x=1392=29×48 */}
        <motion.line x1="1392" y1="96" x2="1392" y2="768"
          stroke={FGRN} strokeWidth="0.5" strokeDasharray="3 8"
          initial={{ opacity: 0 }} animate={{ opacity: 0.28 }}
          transition={{ delay: 2.5, duration: 0.8 }}/>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: 2.7, duration: 0.5 }}>
          <circle cx="1392" cy="432" r="6" stroke={FGRN} strokeWidth="0.7" fill="none"/>
          <line x1="1384" y1="432" x2="1376" y2="432" stroke={FGRN} strokeWidth="0.6"/>
          <line x1="1400" y1="432" x2="1408" y2="432" stroke={FGRN} strokeWidth="0.6"/>
          <line x1="1392" y1="424" x2="1392" y2="416" stroke={FGRN} strokeWidth="0.6"/>
          <line x1="1392" y1="440" x2="1392" y2="448" stroke={FGRN} strokeWidth="0.6"/>
          <text x="1400" y="418" fontSize="7" fontFamily="monospace" fill={FGRN} opacity="0.7">reg_mark</text>
        </motion.g>

        {/* Annotation cote verticale — x=1344=28×48, y=192=4×48 à y=720=15×48 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ delay: 2.9, duration: 0.6 }}>
          <line x1="1344" y1="192" x2="1344" y2="720" stroke={FGRN} strokeWidth="0.5"/>
          <line x1="1338" y1="192" x2="1350" y2="192" stroke={FGRN} strokeWidth="0.7"/>
          <line x1="1338" y1="720" x2="1350" y2="720" stroke={FGRN} strokeWidth="0.7"/>
          <text x="1352" y="460" fontSize="7" fontFamily="monospace" fill={FGRN}>528px</text>
        </motion.g>

        {/* Petit circuit bas-gauche — micro-animation en boucle */}
        <motion.g
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 3.2 }}>
          <line x1="200" y1="820" x2="280" y2="820" stroke={FGRN} strokeWidth="0.6"/>
          <line x1="280" y1="820" x2="280" y2="800" stroke={FGRN} strokeWidth="0.6"/>
          <line x1="280" y1="800" x2="340" y2="800" stroke={FGRN} strokeWidth="0.6"/>
          <circle cx="200" cy="820" r="2" fill={FGRN}/>
          <circle cx="340" cy="800" r="2" fill={FGRN} opacity="0.5"/>
          <text x="202" y="815" fontSize="6" fontFamily="monospace" fill={FGRN}>figma.frame</text>
        </motion.g>
      </svg>
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="hig-caption2" style={{ fontWeight: 600, letterSpacing: "0.16em",
      textTransform: "uppercase", color: BLUE, marginBottom: 20 }}>
      {children}
    </p>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 22 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: SP, delay: delay / 1000 }}>
      {children}
    </motion.div>
  );
}

/* ── Onboarding Mockup ── */
function OnboardingMockupSVG() {
  const PNL  = "#1E3A8A";   /* panneau gauche */
  const ACC  = "#3B82F6";   /* accent bleu */
  const SF   = "Inter,system-ui,sans-serif";

  const steps = [
    "Création du compte", "Votre entreprise", "Documents KYB",
    "Coordonnées bancaires", "Configuration", "Confirmation",
  ];
  const active = 3;

  const docs = [
    { label: "Extrait Kbis",      file: "kbis_distrib.pdf", done: true  },
    { label: "Pièce d'identité",  file: "cni_durand.jpg",   done: true  },
    { label: "Justif. domicile",                             done: false },
    { label: "RIB entreprise",    file: "rib_distrib.pdf",  done: true  },
  ];

  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      <rect width="400" height="190" fill="#F8FAFC" />

      {/* Left panel */}
      <rect x="0" y="0" width="106" height="190" fill={PNL} />

      {/* Steps */}
      {steps.map((label, i) => {
        const done   = i + 1 < active;
        const isAct  = i + 1 === active;
        const y = 18 + i * 22;
        return (
          <g key={i}>
            <circle cx="22" cy={y} r="7"
              fill={done ? "#16A34A" : isAct ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}
              stroke={isAct ? "rgba(255,255,255,0.45)" : "none"} strokeWidth="1.5" />
            {done && <path d={`M${19},${y} l2,2 l4,-4`} stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none" />}
            {isAct && <circle cx="22" cy={y} r="3" fill="white" />}
            {!done && !isAct && <circle cx="22" cy={y} r="2.5" fill="rgba(255,255,255,0.2)" />}
            {i < steps.length - 1 && (
              <line x1="22" y1={y + 7} x2="22" y2={y + 15}
                stroke={done ? "rgba(22,163,74,0.45)" : "rgba(255,255,255,0.1)"} strokeWidth="1" />
            )}
            <text x="35" y={y + 3.5} fontFamily={SF} fontSize="6"
              fontWeight={isAct ? 700 : 400}
              fill={done ? "rgba(255,255,255,0.38)" : isAct ? "white" : "rgba(255,255,255,0.22)"}>
              {label.length > 15 ? label.slice(0, 13) + "…" : label}
            </text>
          </g>
        );
      })}

      {/* Progress bar */}
      <rect x="106" y="0" width="294" height="3" fill="#E2E8F0" />
      <rect x="106" y="0" width={294 * 0.4} height="3" fill={ACC} rx="0" />

      {/* Header */}
      <text x="118" y="17" fontFamily={SF} fontSize="7" fontWeight="700" fill={ACC} letterSpacing="0.08em">ÉTAPE 3 SUR 6</text>
      <text x="118" y="31" fontFamily={SF} fontSize="11.5" fontWeight="700" fill="#0F172A">Documents KYB</text>
      <text x="118" y="43" fontFamily={SF} fontSize="7" fill="#64748B">Pièces justificatives réglementaires</text>

      {/* Info box */}
      <rect x="118" y="49" width="268" height="14" rx="4" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="0.6" />
      <text x="127" y="59" fontFamily={SF} fontSize="5.5" fill={ACC}>ⓘ</text>
      <text x="136" y="59" fontFamily={SF} fontSize="5.8" fill="#64748B">Documents requis par la réglementation LCB-FT · transmission sécurisée</text>

      {/* Upload zones */}
      {docs.map(({ label, file, done }, i) => {
        const y = 71 + i * 25;
        return (
          <g key={label}>
            <text x="118" y={y} fontFamily={SF} fontSize="5" fontWeight="700"
              fill="#94A3B8" letterSpacing="0.07em">{label.toUpperCase()}</text>
            <rect x="118" y={y + 4} width="268" height="15" rx="4"
              fill={done ? "#DCFCE7" : "white"}
              stroke={done ? "#86EFAC" : "#E2E8F0"}
              strokeDasharray={done ? "0" : "3,2"} strokeWidth="1" />
            <text x="129" y={y + 14} fontFamily={SF} fontSize="6.5" fill={done ? "#16A34A" : "#94A3B8"}>
              {done ? "✓" : "↑"}
            </text>
            <text x="140" y={y + 14} fontFamily={SF} fontSize="6.5" fill={done ? "#334155" : "#94A3B8"}>
              {done ? file : "Cliquer pour téléverser"}
            </text>
            {done && <text x="379" y={y + 14} fontFamily={SF} fontSize="5.5" fill="#94A3B8" textAnchor="end">PDF</text>}
          </g>
        );
      })}

      {/* Navigation */}
      <rect x="118" y="172" width="68" height="13" rx="4" fill="white" stroke="#E2E8F0" strokeWidth="0.8" />
      <text x="152" y="181.5" fontFamily={SF} fontSize="6" fill="#64748B" textAnchor="middle">← Précédent</text>
      <rect x="300" y="172" width="86" height="13" rx="4" fill={ACC} />
      <text x="343" y="181.5" fontFamily={SF} fontSize="6" fontWeight="600" fill="white" textAnchor="middle">Continuer →</text>
    </svg>
  );
}

/* ── LCB-FT Sentinelle Dashboard Mockup ── */
function LcbftMockupSVG() {
  const ACC   = "#1E3A8A";   /* accent bleu foncé */
  const ACCL  = "#EFF6FF";
  const RED   = "#DC2626";
  const AMB   = "#D97706";
  const GRN   = "#16A34A";
  const BRD   = "#E2E8F0";
  const INK_  = "#0F172A";
  const INK2_ = "#64748B";
  const INK3_ = "#94A3B8";
  const SF    = "system-ui,sans-serif";

  const rows = [
    { id:"AML-0847", name:"TECH IMPORT SARL",  risk:"CRITIQUE", riskC:RED, riskBg:"#FEE2E2", st:"EN COURS",  stC:ACC, stBg:ACCL },
    { id:"AML-0846", name:"FAST TRANSFER SAS",  risk:"CRITIQUE", riskC:RED, riskBg:"#FEE2E2", st:"EN RETARD", stC:RED, stBg:"#FEE2E2" },
    { id:"AML-0845", name:"GLOBAL PAY LTD",     risk:"FORT",     riskC:AMB, riskBg:"#FFEDD5", st:"EN COURS",  stC:ACC, stBg:ACCL },
    { id:"AML-0844", name:"MARCHÉ PRO SAS",     risk:"MOYEN",    riskC:"#B45309", riskBg:"#FEF3C7", st:"OUVERTE", stC:GRN, stBg:"#DCFCE7" },
  ];

  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      <rect width="400" height="190" fill="#F8FAFC" />

      {/* Sidebar — blanc avec bordure droite */}
      <rect x="0" y="0" width="86" height="190" fill="white" />
      <line x1="86" y1="0" x2="86" y2="190" stroke={BRD} strokeWidth="0.8" />

      {/* Logo */}
      <rect x="8" y="8" width="22" height="22" rx="5" fill={ACC} />
      <text x="19" y="23" fontFamily={SF} fontSize="10" fontWeight="800" fill="white" textAnchor="middle">S</text>
      <text x="36" y="23" fontFamily={SF} fontSize="8" fontWeight="700" fill={INK_}>Sentinelle</text>
      <line x1="0" y1="38" x2="86" y2="38" stroke={BRD} strokeWidth="0.5" />

      {/* Nav items */}
      {[
        { label:"Tableau de bord", active:false, y:50 },
        { label:"Alertes",         active:true,  y:66 },
        { label:"Règles",          active:false, y:82 },
        { label:"Critères",        active:false, y:98 },
      ].map(({ label, active, y }) => (
        <g key={y}>
          <rect x="6" y={y - 8} width="74" height="15" rx="4"
            fill={active ? "rgba(30,58,138,0.08)" : "transparent"} />
          <rect x="11" y={y - 1} width="7" height="4" rx="1"
            fill={active ? ACC : INK3_} />
          <text x="23" y={y + 3} fontFamily={SF} fontSize="7"
            fontWeight={active ? 600 : 400}
            fill={active ? ACC : INK2_}>{label}</text>
          {label === "Alertes" && (
            <>
              <rect x="64" y={y - 7} width="16" height="11" rx="5.5" fill="#FEE2E2" />
              <text x="72" y={y + 1} fontFamily={SF} fontSize="6" fontWeight="700" fill={RED} textAnchor="middle">143</text>
            </>
          )}
        </g>
      ))}

      {/* Top bar */}
      <rect x="86" y="0" width="314" height="26" fill="white" />
      <line x1="86" y1="26" x2="400" y2="26" stroke={BRD} strokeWidth="0.8" />
      <circle cx="100" cy="13" r="3.5" fill={GRN} />
      <text x="108" y="17" fontFamily={SF} fontSize="6" fontWeight="600" fill={INK2_} letterSpacing="0.07em">ALIMENTATION</text>
      <text x="152" y="17" fontFamily={SF} fontSize="6" fill={INK3_}>À jour · 09:54</text>
      <line x1="177" y1="6" x2="177" y2="20" stroke={BRD} strokeWidth="0.6" />
      <rect x="296" y="6" width="86" height="14" rx="7" fill={ACCL} stroke="rgba(30,58,138,0.15)" strokeWidth="0.5" />
      <circle cx="307" cy="13" r="2.5" fill={ACC} />
      <text x="345" y="17" fontFamily={SF} fontSize="6.5" fontWeight="600" fill={ACC} textAnchor="middle">LCB-FT · AML</text>

      {/* KPI cards */}
      {[
        { x:94,  label:"ALERTES EN COURS", val:"47",   valC:ACC },
        { x:192, label:"CLÔTURÉES (MOIS)", val:"312",  valC:GRN },
        { x:291, label:"EN RETARD",        val:"12",   valC:RED },
      ].map(({ x, label, val, valC }) => (
        <g key={x}>
          <rect x={x} y="32" width="92" height="36" rx="6" fill="white" stroke={BRD} strokeWidth="0.6" />
          <text x={x + 8} y="45" fontFamily={SF} fontSize="5.5" fill={INK3_} letterSpacing="0.07em">{label}</text>
          <text x={x + 8} y="61" fontFamily={SF} fontSize="16" fontWeight="700" fill={valC}>{val}</text>
        </g>
      ))}

      {/* Alert table */}
      <rect x="94" y="76" width="298" height="108" rx="6" fill="white" stroke={BRD} strokeWidth="0.6" />
      <rect x="94" y="76" width="298" height="17" rx="6" fill="#F1F5F9" />
      <rect x="94" y="84" width="298" height="9" fill="#F1F5F9" />
      {[{ x:102, t:"RÉF." }, { x:158, t:"ENTITÉ" }, { x:256, t:"RISQUE" }, { x:322, t:"STATUT" }].map(({ x, t }) => (
        <text key={t} x={x} y="88" fontFamily={SF} fontSize="5.5" fill={INK3_} letterSpacing="0.08em" fontWeight="600">{t}</text>
      ))}

      {rows.map(({ id, name, risk, riskC, riskBg, st, stC, stBg }, i) => {
        const y = 93 + i * 23;
        const rw = risk === "CRITIQUE" ? 44 : risk === "FORT" ? 30 : risk === "MOYEN" ? 36 : 32;
        const sw = st === "EN COURS" ? 40 : st === "EN RETARD" ? 46 : st === "OUVERTE" ? 38 : 38;
        return (
          <g key={id}>
            {i > 0 && <line x1="94" y1={y} x2="392" y2={y} stroke="#F1F5F9" strokeWidth="0.8" />}
            <text x="102" y={y + 14} fontFamily="monospace,sans-serif" fontSize="6" fill={INK2_}>{id}</text>
            <text x="158" y={y + 14} fontFamily={SF} fontSize="6.5" fontWeight="500" fill={INK_}>{name}</text>
            <rect x="252" y={y + 4} width={rw} height="11" rx="3.5" fill={riskBg} />
            <text x={252 + rw / 2} y={y + 13} fontFamily={SF} fontSize="5.5" fontWeight="700"
              fill={riskC} textAnchor="middle">{risk}</text>
            <rect x="316" y={y + 4} width={sw} height="11" rx="3.5" fill={stBg} />
            <text x={316 + sw / 2} y={y + 13} fontFamily={SF} fontSize="5.5" fontWeight="600"
              fill={stC} textAnchor="middle">{st}</text>
          </g>
        );
      })}
    </svg>
  );
}


function RevisionMockupSVG() {
  const PINK  = "#EC4899";
  const PINKL = "#FCF0F9";
  const BG    = "#F7EEF9";
  const WHITE = "#FFFFFF";
  const BORD  = "#EDE0F0";
  const INK   = "#1A1A2E";
  const INK2  = "#9B7BB8";
  const INK3  = "#C4A8D8";
  const GRN   = "#10B981";
  const SF    = "system-ui, sans-serif";
  const SW    = 73;
  const SH    = 158;
  const X     = [7, 85, 163, 241, 319] as const;

  const tabLabels = ["Accueil", "Cours", "Stats", "Profil"];
  const TabBar = ({ i, active }: { i: number; active: number }) => (
    <g>
      <rect x={0} y={138} width={SW} height={20} fill={WHITE} />
      <line x1={0} y1={138} x2={SW} y2={138} stroke={BORD} strokeWidth={0.4} />
      {tabLabels.map((t, j) => {
        const tx = 9 + j * 18;
        const on = j === active;
        return (
          <g key={t}>
            <text x={tx} y={SH - 5} fontFamily={SF} fontSize={3}
              fill={on ? PINK : INK3} textAnchor="middle" fontWeight={on ? "700" : "400"}>{t}</text>
            {on && <circle cx={tx} cy={SH - 2} r={1.5} fill={PINK} />}
          </g>
        );
      })}
    </g>
  );

  const Header = ({ title, sub }: { title: string; sub: string }) => (
    <g>
      <circle cx={8.5} cy={9} r={5} fill={PINK} opacity={0.22} />
      <circle cx={8.5} cy={9} r={2.5} fill={PINK} opacity={0.55} />
      <text x={16} y={8.5} fontFamily={SF} fontSize={4.5} fontWeight="700" fill={INK}>{title}</text>
      <text x={16} y={14.5} fontFamily={SF} fontSize={3} fill={INK3}>{sub}</text>
      <line x1={0} y1={18} x2={SW} y2={18} stroke={BORD} strokeWidth={0.5} />
    </g>
  );

  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      <defs>
        {X.map((_, i) => (
          <clipPath key={i} id={`rev-phone-${i}`}>
            <rect x={0} y={0} width={SW} height={SH} rx={8} />
          </clipPath>
        ))}
      </defs>

      {/* Background */}
      <rect width="400" height="190" fill={BG} />

      {/* Top bar */}
      <rect x="0" y="0" width="400" height="20" fill={WHITE} />
      <line x1="0" y1="20" x2="400" y2="20" stroke={BORD} strokeWidth="0.8" />
      <rect x="7" y="6" width="7" height="7" rx="2" fill={PINK} />
      <text x="18" y="14" fontFamily={SF} fontSize="7" fontWeight="700" fill={INK}>App Révision · iOS</text>
      <text x="116" y="14" fontFamily={SF} fontSize="5.5" fill={INK2}>5 écrans · Design complet</text>

      {/* ── Screen 0 : Leçon active / Quiz ── */}
      <g transform={`translate(${X[0]}, 22)`} clipPath="url(#rev-phone-0)">
        <rect width={SW} height={SH} rx={8} fill={PINKL} />
        <Header title="Leçon · Quiz" sub="ethan@gmail.com" />
        {/* Progress bar */}
        <rect x={0} y={19} width={SW} height={3} fill={BORD} />
        <rect x={0} y={19} width={22} height={3} fill={PINK} />
        <text x={SW - 2} y={26} fontFamily={SF} fontSize={3} fill={INK3} textAnchor="end">Q3/10</text>
        {/* Quiz card */}
        <rect x={5} y={28} width={63} height={46} rx={5} fill={WHITE} stroke={BORD} strokeWidth={0.6} />
        <text x={36.5} y={38} fontFamily={SF} fontSize={3} fill={INK3} textAnchor="middle" letterSpacing="0.05em">TRADUISEZ LE MOT SUIVANT</text>
        <text x={36.5} y={47} fontFamily={SF} fontSize={5} fontWeight="700" fill={INK} textAnchor="middle">Comment dit-on</text>
        <text x={36.5} y={54} fontFamily={SF} fontSize={5} fontWeight="700" fill={INK} textAnchor="middle">{"« bonjour » ?"}</text>
        <line x1={22} y1={57} x2={51} y2={57} stroke={PINK} strokeWidth={0.7} opacity={0.5} />
        {/* Options */}
        {(["Hello", "Goodbye", "Please", "Thank you"] as const).map((opt, i) => {
          const oy = 78 + i * 13;
          const sel = i === 0;
          return (
            <g key={opt}>
              <rect x={5} y={oy} width={63} height={11} rx={3}
                fill={sel ? PINKL : WHITE}
                stroke={sel ? PINK : BORD}
                strokeWidth={sel ? 0.8 : 0.5} />
              <text x={11} y={oy + 7.5} fontFamily={SF} fontSize={4} fontWeight={sel ? "600" : "400"} fill={INK}>{opt}</text>
              <circle cx={62} cy={oy + 5.5} r={3} fill={sel ? PINK : WHITE} stroke={sel ? PINK : INK3} strokeWidth={0.6} />
              {sel && <>
                <line x1={60} y1={oy + 5.5} x2={61.5} y2={oy + 7} stroke={WHITE} strokeWidth={0.9} strokeLinecap="round" />
                <line x1={61.5} y1={oy + 7} x2={64.5} y2={oy + 3.5} stroke={WHITE} strokeWidth={0.9} strokeLinecap="round" />
              </>}
            </g>
          );
        })}
        {/* CTA */}
        <rect x={5} y={131} width={63} height={10} rx={4} fill={PINK} />
        <text x={36.5} y={138} fontFamily={SF} fontSize={3.5} fontWeight="700" fill={WHITE} textAnchor="middle">Valider la réponse</text>
        <TabBar i={0} active={1} />
      </g>

      {/* ── Screen 1 : Cours détail ── */}
      <g transform={`translate(${X[1]}, 22)`} clipPath="url(#rev-phone-1)">
        <rect width={SW} height={SH} rx={8} fill={PINKL} />
        <Header title="Cours d'Anglais" sub="ethan@gmail.com" />
        {/* Badge vocabulaire */}
        <rect x={5} y={21} width={32} height={6} rx={3} fill={`${PINK}1A`} />
        <text x={21} y={26} fontFamily={SF} fontSize={3} fontWeight="600" fill={PINK} textAnchor="middle">VOCABULAIRE</text>
        {/* Title */}
        <text x={5} y={35} fontFamily={SF} fontSize={5} fontWeight="700" fill={INK}>Élargissez votre</text>
        <text x={5} y={42} fontFamily={SF} fontSize={5} fontWeight="700" fill={INK}>vocabulaire anglais</text>
        {/* Progress */}
        <text x={5} y={51} fontFamily={SF} fontSize={3} fill={INK3}>Progression globale</text>
        <text x={SW - 4} y={51} fontFamily={SF} fontSize={3} fontWeight="700" fill={PINK} textAnchor="end">65%</text>
        <rect x={5} y={53} width={63} height={3} rx={1.5} fill={BORD} />
        <rect x={5} y={53} width={41} height={3} rx={1.5} fill={PINK} />
        {/* Lessons label */}
        <text x={5} y={63} fontFamily={SF} fontSize={3} fill={INK3} letterSpacing="0.06em">LEÇONS DU MODULE</text>
        {/* Lesson rows */}
        {[
          { label:"Leçon 1: Les salutations", sub:"Complétée · 10 questions", done:true,   active:false, locked:false },
          { label:"Leçon 2: La famille",      sub:"Complétée · 8 questions",  done:true,   active:false, locked:false },
          { label:"Leçon 3: Les couleurs",    sub:"En cours de lecture",       done:false,  active:true,  locked:false },
          { label:"Leçon 4: Les nombres",     sub:"Verrouillée",               done:false,  active:false, locked:true  },
        ].map(({ label, sub, done, active, locked }, i) => {
          const ly = 67 + i * 17;
          const ic = done ? "✓" : active ? "▶" : "🔒";
          const icFill = done ? GRN : active ? `${PINK}28` : BORD;
          const icTextFill = done ? WHITE : active ? PINK : INK3;
          return (
            <g key={i}>
              <rect x={5} y={ly} width={63} height={14} rx={3.5}
                fill={WHITE} stroke={active ? PINK : BORD} strokeWidth={active ? 0.9 : 0.5} />
              <circle cx={13} cy={ly + 7} r={4.5} fill={icFill} />
              <text x={13} y={ly + 9.5} fontFamily={SF} fontSize={locked ? 5 : 4} fill={icTextFill} textAnchor="middle">{ic}</text>
              <text x={21} y={ly + 7} fontFamily={SF} fontSize={3.5} fontWeight="600" fill={locked ? INK3 : INK}>{label.slice(0, 20)}</text>
              <text x={21} y={ly + 12} fontFamily={SF} fontSize={2.8} fill={INK3}>{sub}</text>
            </g>
          );
        })}
        {/* CTA */}
        <rect x={5} y={131} width={63} height={10} rx={4} fill={INK} />
        <text x={36.5} y={138} fontFamily={SF} fontSize={3.5} fontWeight="700" fill={WHITE} textAnchor="middle">Continuer le module</text>
        <TabBar i={1} active={1} />
      </g>

      {/* ── Screen 2 : Profil ── */}
      <g transform={`translate(${X[2]}, 22)`} clipPath="url(#rev-phone-2)">
        <rect width={SW} height={SH} rx={8} fill={PINKL} />
        <Header title="Mon Profil" sub="Niveau 12 · Apprenant" />
        {/* Avatar */}
        <circle cx={36.5} cy={38} r={15} fill={BORD} />
        <circle cx={36.5} cy={38} r={15} fill="none" stroke={PINK} strokeWidth={1.5} />
        <circle cx={36.5} cy={34} r={5} fill={INK2} />
        <ellipse cx={36.5} cy={47} rx={9} ry={5} fill={INK2} />
        {/* Name */}
        <text x={36.5} y={60} fontFamily={SF} fontSize={5} fontWeight="700" fill={INK} textAnchor="middle">Ethan Hall</text>
        <text x={36.5} y={66} fontFamily={SF} fontSize={3} fill={INK3} textAnchor="middle">Membre depuis octobre 2024</text>
        {/* Edit button */}
        <rect x={17} y={69} width={39} height={8} rx={3.5} fill={INK} />
        <text x={36.5} y={75} fontFamily={SF} fontSize={3.2} fontWeight="600" fill={WHITE} textAnchor="middle">Modifier le profil</text>
        {/* Stats */}
        <rect x={5} y={81} width={63} height={22} rx={5} fill={WHITE} stroke={BORD} strokeWidth={0.5} />
        {[
          { val:"12",  label:"Cours suivis",   x:16   },
          { val:"48h", label:"Temps d'étude",  x:36.5 },
          { val:"15🔥",label:"Jrs de série",   x:57   },
        ].map(({ val, label, x: tx }, i) => (
          <g key={i}>
            {i > 0 && <line x1={5 + i * 21} y1={84} x2={5 + i * 21} y2={101} stroke={BORD} strokeWidth={0.5} />}
            <text x={tx} y={93} fontFamily={SF} fontSize={6} fontWeight="800" fill={INK} textAnchor="middle">{val}</text>
            <text x={tx} y={100} fontFamily={SF} fontSize={2.8} fill={INK3} textAnchor="middle">{label}</text>
          </g>
        ))}
        {/* Badges */}
        <text x={5} y={111} fontFamily={SF} fontSize={3} fill={INK3} letterSpacing="0.05em">MES BADGES OBTENUS</text>
        {[
          { e:"🏆", name:"Pionnier", x:16  },
          { e:"🎯", name:"Sniper",   x:36.5},
          { e:"⚡", name:"Sérieux",  x:57  },
        ].map(({ e, name, x: tx }) => (
          <g key={name}>
            <rect x={tx - 10} y={115} width={20} height={18} rx={5} fill={WHITE} stroke={BORD} strokeWidth={0.5} />
            <text x={tx} y={128} fontFamily={SF} fontSize={10} textAnchor="middle">{e}</text>
            <text x={tx} y={138} fontFamily={SF} fontSize={3} fill={INK3} textAnchor="middle">{name}</text>
          </g>
        ))}
        <TabBar i={2} active={3} />
      </g>

      {/* ── Screen 3 : Classement ── */}
      <g transform={`translate(${X[3]}, 22)`} clipPath="url(#rev-phone-3)">
        <rect width={SW} height={SH} rx={8} fill={PINKL} />
        <Header title="Classement" sub="ethan@gmail.com" />
        {/* Tabs */}
        <rect x={5} y={21} width={63} height={9} rx={4.5} fill={WHITE} stroke={BORD} strokeWidth={0.5} />
        <rect x={5} y={21} width={23} height={9} rx={4.5} fill={INK} />
        <text x={16.5} y={27.5} fontFamily={SF} fontSize={3.2} fontWeight="700" fill={WHITE} textAnchor="middle">Semaine</text>
        <text x={36.5} y={27.5} fontFamily={SF} fontSize={3.2} fill={INK3} textAnchor="middle">Mois</text>
        <text x={55} y={27.5} fontFamily={SF} fontSize={3.2} fill={INK3} textAnchor="middle">Tous</text>
        {/* Podium */}
        {/* 2nd — Charlotte */}
        <circle cx={15} cy={60} r={12} fill="#F9A8D4" stroke={BORD} strokeWidth={0.6} />
        <circle cx={15} cy={56} r={4} fill={INK2} />
        <ellipse cx={15} cy={66} rx={6} ry={4} fill={INK2} />
        <text x={15} y={78} fontFamily={SF} fontSize={3} fontWeight="700" fill={INK} textAnchor="middle">Charlotte</text>
        <text x={15} y={84} fontFamily={SF} fontSize={4.5} fontWeight="800" fill={INK2} textAnchor="middle">2</text>
        {/* 1st — Sophia (bigger + crown) */}
        <text x={36.5} y={40} fontFamily={SF} fontSize={9} textAnchor="middle">👑</text>
        <circle cx={36.5} cy={59} r={13} fill={PINK} stroke={`${PINK}44`} strokeWidth={2} />
        <circle cx={36.5} cy={55} r={4.5} fill={WHITE} opacity={0.85} />
        <ellipse cx={36.5} cy={66} rx={7} ry={4.5} fill={WHITE} opacity={0.85} />
        <text x={36.5} y={78} fontFamily={SF} fontSize={3} fontWeight="700" fill={INK} textAnchor="middle">Sophia B.</text>
        <text x={36.5} y={84} fontFamily={SF} fontSize={5} fontWeight="800" fill={PINK} textAnchor="middle">1</text>
        {/* 3rd — Moi */}
        <circle cx={58} cy={62} r={11} fill="#C4B5FD" stroke={BORD} strokeWidth={0.6} />
        <circle cx={58} cy={58} r={3.8} fill={INK2} />
        <ellipse cx={58} cy={68} rx={5.5} ry={3.5} fill={INK2} />
        <text x={58} y={78} fontFamily={SF} fontSize={3} fontWeight="700" fill={INK} textAnchor="middle">Moi (Ethan)</text>
        <text x={58} y={84} fontFamily={SF} fontSize={4.5} fontWeight="800" fill={INK2} textAnchor="middle">3</text>
        {/* List */}
        <rect x={5} y={88} width={63} height={25} rx={5} fill={WHITE} stroke={BORD} strokeWidth={0.5} />
        {[{ rank:"4", name:"Jack Brown", pct:"42%" }, { rank:"5", name:"Liam Johnson", pct:"33%" }].map(({ rank, name, pct }, i) => {
          const ly = 93 + i * 12;
          return (
            <g key={i}>
              {i > 0 && <line x1={5} y1={ly - 2} x2={68} y2={ly - 2} stroke={BORD} strokeWidth={0.4} />}
              <text x={10} y={ly + 5} fontFamily={SF} fontSize={4} fontWeight="700" fill={INK2}>{rank}</text>
              <circle cx={19} cy={ly + 3} r={4} fill={BORD} />
              <text x={26} y={ly + 5} fontFamily={SF} fontSize={3.5} fill={INK}>{name}</text>
              <text x={63} y={ly + 5} fontFamily={SF} fontSize={3.5} fontWeight="700" fill={INK2} textAnchor="end">{pct}</text>
            </g>
          );
        })}
        <TabBar i={3} active={2} />
      </g>

      {/* ── Screen 4 : Paramètres ── */}
      <g transform={`translate(${X[4]}, 22)`} clipPath="url(#rev-phone-4)">
        <rect width={SW} height={SH} rx={8} fill={PINKL} />
        <Header title="Paramètres" sub="ethan@gmail.com" />
        {/* Profile card */}
        <rect x={5} y={21} width={63} height={22} rx={5} fill={WHITE} stroke={BORD} strokeWidth={0.5} />
        <circle cx={15} cy={32} r={8} fill={BORD} />
        <circle cx={15} cy={29} r={3} fill={INK2} />
        <ellipse cx={15} cy={37} rx={5.5} ry={3} fill={INK2} />
        <text x={27} y={29} fontFamily={SF} fontSize={4.5} fontWeight="700" fill={INK}>Ethan Hall</text>
        <text x={27} y={35} fontFamily={SF} fontSize={3} fill={INK3}>ID d'utilisateur</text>
        <text x={27} y={40} fontFamily={SF} fontSize={3} fontWeight="600" fill={INK2}>#52899</text>
        {/* Pref label */}
        <text x={5} y={50} fontFamily={SF} fontSize={3} fill={INK3} letterSpacing="0.05em">PRÉFÉRENCES DE L'APPLICATION</text>
        {/* Rows */}
        {[
          { icon:"🔔", label:"Notifications push", on:true,  val:undefined as string|undefined },
          { icon:"📅", label:"Rappels quotidiens",  on:true,  val:undefined },
          { icon:"🌙", label:"Mode sombre",          on:false, val:undefined },
          { icon:"🌐", label:"Langue de l'app",      on:false, val:"Français" },
        ].map(({ icon, label, on, val }, i) => {
          const ry = 54 + i * 15;
          return (
            <g key={i}>
              <rect x={5} y={ry} width={63} height={12} rx={3.5} fill={WHITE} stroke={BORD} strokeWidth={0.4} />
              <text x={10} y={ry + 8.5} fontFamily={SF} fontSize={6}>{icon}</text>
              <text x={20} y={ry + 8} fontFamily={SF} fontSize={3.5} fill={INK}>{label}</text>
              {val ? (
                <text x={63} y={ry + 8} fontFamily={SF} fontSize={3} fontWeight="600" fill={PINK} textAnchor="end">{val} ›</text>
              ) : (
                <g>
                  <rect x={53} y={ry + 3.5} width={12} height={6} rx={3} fill={on ? PINK : BORD} />
                  <circle cx={on ? 61 : 56} cy={ry + 6.5} r={2.5} fill={WHITE} />
                </g>
              )}
            </g>
          );
        })}
        {/* Se déconnecter */}
        <rect x={5} y={118} width={63} height={10} rx={4} fill="none" stroke={PINK} strokeWidth={1} />
        <text x={36.5} y={125} fontFamily={SF} fontSize={3.5} fontWeight="600" fill={PINK} textAnchor="middle">Se déconnecter</text>
        <TabBar i={4} active={3} />
      </g>
    </svg>
  );
}

function BrandMockupSVG() {
  const ACC  = "#FF9500";
  const BRD  = "#E2E8F0";
  const INK_ = "#1C1C1E";
  const INK2_= "#636366";
  const INK3_= "#AEAEB2";
  const SF   = "system-ui, sans-serif";
  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      <rect width="400" height="190" fill="#F5F5F7" />
      {/* Topbar */}
      <rect x="0" y="0" width="400" height="26" fill="white" />
      <line x1="0" y1="26" x2="400" y2="26" stroke={BRD} strokeWidth="0.8" />
      <rect x="8" y="9" width="8" height="8" rx="2" fill={ACC} />
      <text x="22" y="19" fontFamily={SF} fontSize="7" fontWeight="700" fill={INK_}>Brand workshop · Libellés formulaire</text>
      <rect x="320" y="8" width="70" height="10" rx="3" fill="rgba(255,149,0,0.12)" />
      <text x="355" y="16" fontFamily={SF} fontSize="5.5" fontWeight="600" fill={ACC} textAnchor="middle">EN COURS</text>

      {/* V1 */}
      <rect x="10" y="34" width="118" height="150" rx="7" fill="white" stroke={BRD} strokeWidth="0.7" />
      <text x="18" y="47" fontFamily={SF} fontSize="5.5" fill={INK3_} letterSpacing="0.08em">VERSION 1</text>
      <rect x="18" y="52" width="102" height="56" rx="4" fill="#F8FAFC" stroke={BRD} strokeWidth="0.6" />
      <text x="25" y="65" fontFamily={SF} fontSize="6" fill={INK2_}>Montant à payer</text>
      <text x="25" y="79" fontFamily={SF} fontSize="13" fontWeight="700" fill={INK_}>24,90 €</text>
      <rect x="25" y="87" width="89" height="11" rx="3.5" fill={ACC} />
      <text x="69" y="95.5" fontFamily={SF} fontSize="6" fontWeight="700" fill="white" textAnchor="middle">Payer maintenant</text>
      <line x1="69" y1="116" x2="69" y2="126" stroke="#DC2626" strokeWidth="0.6" strokeDasharray="2 2" />
      <circle cx="69" cy="113" r="5" fill="#FEE2E2" stroke="#DC2626" strokeWidth="0.6" />
      <text x="69" y="116.5" fontFamily={SF} fontSize="7" fill="#DC2626" textAnchor="middle">✕</text>
      <text x="69" y="135" fontFamily={SF} fontSize="5.5" fill="#DC2626" textAnchor="middle">Trop directif</text>
      <text x="69" y="145" fontFamily={SF} fontSize="5" fill={INK3_} textAnchor="middle">DSP2 · art. 24</text>

      {/* V2 — sélectionnée */}
      <rect x="141" y="34" width="118" height="150" rx="7" fill="white" stroke={ACC} strokeWidth="1.5" />
      <rect x="141" y="34" width="118" height="16" rx="7" fill={ACC} />
      <rect x="141" y="41" width="118" height="9" fill={ACC} />
      <text x="200" y="46" fontFamily={SF} fontSize="5.5" fontWeight="700" fill="white" textAnchor="middle">V2 · Retenue</text>
      <rect x="149" y="52" width="102" height="56" rx="4" fill="#F8FAFC" stroke={BRD} strokeWidth="0.6" />
      <text x="156" y="65" fontFamily={SF} fontSize="6" fill={INK2_}>Récapitulatif commande</text>
      <text x="156" y="79" fontFamily={SF} fontSize="13" fontWeight="700" fill={INK_}>24,90 €</text>
      <rect x="156" y="87" width="89" height="11" rx="3.5" fill={INK_} />
      <text x="200" y="95.5" fontFamily={SF} fontSize="6" fontWeight="700" fill="white" textAnchor="middle">Confirmer le paiement</text>
      <line x1="200" y1="116" x2="200" y2="126" stroke="#16A34A" strokeWidth="0.6" strokeDasharray="2 2" />
      <circle cx="200" cy="113" r="5" fill="#DCFCE7" stroke="#16A34A" strokeWidth="0.6" />
      <text x="200" y="116.5" fontFamily={SF} fontSize="7" fill="#16A34A" textAnchor="middle">✓</text>
      <text x="200" y="135" fontFamily={SF} fontSize="5.5" fill="#16A34A" textAnchor="middle">Conforme DSP2</text>
      <text x="200" y="145" fontFamily={SF} fontSize="5" fill={INK3_} textAnchor="middle">Testé · 5 participants</text>

      {/* V3 */}
      <rect x="272" y="34" width="118" height="150" rx="7" fill="white" stroke={BRD} strokeWidth="0.7" />
      <text x="280" y="47" fontFamily={SF} fontSize="5.5" fill={INK3_} letterSpacing="0.08em">VERSION 3</text>
      <rect x="280" y="52" width="102" height="56" rx="4" fill="#F8FAFC" stroke={BRD} strokeWidth="0.6" />
      <text x="287" y="65" fontFamily={SF} fontSize="6" fill={INK2_}>Votre paiement sécurisé</text>
      <text x="287" y="79" fontFamily={SF} fontSize="13" fontWeight="700" fill={INK_}>24,90 €</text>
      <rect x="287" y="87" width="89" height="11" rx="3.5" fill="#64748B" />
      <text x="331" y="95.5" fontFamily={SF} fontSize="6" fontWeight="700" fill="white" textAnchor="middle">Valider ma commande</text>
      <line x1="331" y1="116" x2="331" y2="126" stroke={INK3_} strokeWidth="0.6" strokeDasharray="2 2" />
      <circle cx="331" cy="113" r="5" fill="#F1F5F9" stroke={INK3_} strokeWidth="0.6" />
      <text x="331" y="117" fontFamily={SF} fontSize="7" fill={INK3_} textAnchor="middle">?</text>
      <text x="331" y="135" fontFamily={SF} fontSize="5.5" fill={INK3_} textAnchor="middle">À tester</text>
      <text x="331" y="145" fontFamily={SF} fontSize="5" fill={INK3_} textAnchor="middle">Session 2 prévue</text>
    </svg>
  );
}

function ProjectCard({ num, label, title, desc, color, accentBg, visual, tags, href, siteHref }: {
  num: string; label: string; title: string; desc: string;
  color: string; accentBg: string;
  visual: React.ReactNode; tags: string[];
  href?: string;
  siteHref?: string;
}) {
  const [hov, setHov] = useState(false);
  const V  = "hsl(262, 45%, 60%)";
  const VB = "hsla(262, 45%, 60%, 0.18)";
  return (
    <motion.article
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: SP }}
      style={{
        borderRadius: "var(--r-xl)", overflow: "hidden",
        border: `1px solid ${BORD}`,
        background: BG,
        display: "flex", flexDirection: "column", height: "100%",
      }}
    >
      {/* Zone visuelle */}
      <div style={{ position: "relative", background: accentBg, padding: "24px 28px" }}>
        {visual}
        <AnimatePresence>
          {hov && (
            <motion.div key="ov"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ position: "absolute", inset: 0, background: "rgba(9,9,11,0.55)",
                pointerEvents: "none" }} />
          )}
        </AnimatePresence>
      </div>

      {/* Zone texte */}
      <div style={{ padding: "20px 24px 24px", borderTop: `1px solid ${BORD}`,
        display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <span className="hig-caption2" style={{ fontWeight: 700, letterSpacing: "0.14em",
              color, display: "block", marginBottom: 4 }}>{num}</span>
            <p className="hig-caption1" style={{ color: INK3, marginBottom: 6 }}>{label}</p>
            <p className="hig-subhead" style={{ fontWeight: 600, color: INK, lineHeight: 1.35 }}>{title}</p>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0, marginLeft: 12,
            background: `color-mix(in srgb, ${color} 10%, transparent)`,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <ArrowUpRight size={14} style={{ color }} />
          </div>
        </div>

        <p className="hig-caption1" style={{ color: INK2, lineHeight: 1.6 }}>{desc}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map(tag => (
            <span key={tag} style={{
              fontSize: 11, fontWeight: 500, letterSpacing: "0.03em",
              padding: "3px 10px", borderRadius: 100,
              background: `color-mix(in srgb, ${color} 8%, transparent)`,
              color, border: `1px solid color-mix(in srgb, ${color} 18%, transparent)`,
            }}>{tag}</span>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto", paddingTop: 16 }}>
          {href && (
            <Link href={href}
              style={{ display: "inline-flex", alignItems: "center",
                gap: 6, padding: "9px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "#fff", color: V, border: `1px solid ${V}`,
                textDecoration: "none" }}
              onClick={e => e.stopPropagation()}>
              Voir le processus de création <ArrowUpRight size={13} strokeWidth={1.6} />
            </Link>
          )}
          {siteHref && (
            <Link href={siteHref}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                fontSize: 13, fontWeight: 500, color: V, whiteSpace: "nowrap",
                textDecoration: "underline", textUnderlineOffset: 3, background: "none" }}
              onClick={e => e.stopPropagation()}>
              Voir le site <ArrowUpRight size={13} strokeWidth={2} />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   FLOATING PROJECT WINDOWS — scène 2D libre
   ═══════════════════════════════════════════════════════════════════ */

interface ProjectData {
  id: string; num: string; label: string; title: string; desc: string;
  color: string; accentBg: string; visual: React.ReactNode; tags: string[];
  href?: string; siteHref?: string;
  x: number; y: number; width: number; rotation: number; zIndex: number;
  locked?: boolean;
}

function ProjectWindow({
  id, num, label, title, desc, color, accentBg, visual, tags,
  href, siteHref,
  x: initX, y: initY, width, rotation, zIndex,
  onPointerDown, delay = 0, isMobile = false,
}: ProjectData & {
  onPointerDown: () => void;
  delay?: number;
  isMobile?: boolean;
}) {
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);
  const [dragging, setDragging] = useState(false);
  const didDrag = useRef(false);
  const router = useRouter();

  if (isMobile) {
    return (
      <Link href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
        <motion.article
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.025, boxShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.5, delay, ease: SP }}
          style={{ borderRadius: 12, overflow: "hidden", background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
          <VisualArea accentBg={accentBg} visual={visual} />
          <WindowInfo num={num} title={title} color={color} tags={tags} isMobile />
        </motion.article>
      </Link>
    );
  }

  return (
    <motion.article
      drag dragMomentum={false} dragElastic={0}
      onPointerDown={() => { onPointerDown(); didDrag.current = false; }}
      onDragStart={() => { setDragging(true); didDrag.current = true; }}
      onDragEnd={() => setDragging(false)}
      onClick={() => { if (!didDrag.current && href) router.push(href); }}
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{
        opacity: 1, scale: 1,
        boxShadow: "0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
      }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 6px 20px rgba(0,0,0,0.10)",
      }}
      whileDrag={{
        scale: 1.05,
        boxShadow: "0 36px 80px rgba(0,0,0,0.26), 0 10px 28px rgba(0,0,0,0.14)",
      }}
      transition={{ duration: 0.5, delay, ease: SP }}
      style={{
        position: "absolute", left: 0, top: 0,
        x, y, rotate: rotation, width, zIndex,
        borderRadius: 14, overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.09)",
        cursor: dragging ? "grabbing" : "pointer",
        userSelect: "none",
        willChange: "transform",
      }}>
      <VisualArea accentBg={accentBg} visual={visual} />
      <WindowInfo num={num} title={title}
        color={color} tags={tags} href={href} />
    </motion.article>
  );
}

function LockedProjectWindow({
  num, label, title, desc, color, accentBg, visual, tags,
  x: initX, y: initY, width, rotation, zIndex,
  onPointerDown, delay = 0, isMobile = false,
}: Omit<ProjectData, "href" | "siteHref" | "locked"> & {
  onPointerDown: () => void;
  delay?: number;
  isMobile?: boolean;
}) {
  const x = useMotionValue(initX);
  const y = useMotionValue(initY);
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(isMobile);

  const inner = (
    <div style={{ position: "relative" }}>
      {/* Contenu flouté */}
      <div style={{
        filter: hovered ? "blur(4px) brightness(0.85)" : "blur(1.5px) grayscale(0.35)",
        transition: "filter 0.25s ease",
      }}>
        <VisualArea accentBg={accentBg} visual={visual} />
        <div style={{ padding: "10px 14px 13px", borderTop: "1px solid rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column", gap: 8, background: "#fff" }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "rgba(0,0,0,0.3)" }}>
            {num} · {label}
          </span>
          <p style={{ fontSize: 11, fontWeight: 600, color: INK, margin: 0,
            lineHeight: 1.4, letterSpacing: "-0.01em" }}>{title}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {tags.map(t => (
              <span key={t} style={{ fontSize: 9, fontWeight: 500,
                padding: "1px 6px", borderRadius: 100,
                background: `color-mix(in srgb, ${color} 8%, transparent)`,
                color, border: `1px solid color-mix(in srgb, ${color} 18%, transparent)` }}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="wip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(255,255,255,0.72)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              padding: "16px",
              pointerEvents: "none",
            }}>
            <div style={{ display: "flex", gap: 5 }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color: INK3,
                padding: "2px 7px", borderRadius: 100,
                background: "rgba(0,0,0,0.05)" }}>UI Design</span>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
                textTransform: "uppercase", color,
                padding: "2px 7px", borderRadius: 100,
                background: `color-mix(in srgb, ${color} 10%, transparent)` }}>En cours</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: INK,
              letterSpacing: "-0.01em", textAlign: "center", lineHeight: 1.3, margin: 0 }}>
              {title}
            </p>
            <p style={{ fontSize: 11, color: INK2, textAlign: "center",
              lineHeight: 1.5, margin: 0, maxWidth: 190 }}>
              {desc}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, justifyContent: "center" }}>
              {tags.map(t => (
                <span key={t} style={{ fontSize: 9, fontWeight: 500,
                  padding: "2px 7px", borderRadius: 100,
                  background: `color-mix(in srgb, ${color} 8%, transparent)`,
                  color, border: `1px solid color-mix(in srgb, ${color} 18%, transparent)` }}>
                  {t}
                </span>
              ))}
            </div>
            <span style={{ fontSize: 9, color: INK3, letterSpacing: "0.03em" }}>
              Disponible début août
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: SP }}
        style={{
          borderRadius: 12, overflow: "hidden", background: "#fff",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        }}>
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.article
      drag dragMomentum={false} dragElastic={0}
      onPointerDown={onPointerDown}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 0.82, scale: 1,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)" }}
      transition={{ duration: 0.5, delay, ease: SP }}
      style={{
        position: "absolute", left: 0, top: 0,
        x, y, rotate: rotation, width, zIndex,
        borderRadius: 14, overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.09)",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        willChange: "transform",
      }}>
      {inner}
    </motion.article>
  );
}

/* Barre chrome macOS */
function WindowChrome({ id }: { id: string }) {
  return (
    <div style={{ height: 24, background: "#EBEBEB",
      borderBottom: "1px solid rgba(0,0,0,0.09)",
      display: "flex", alignItems: "center", padding: "0 10px", gap: 10, flexShrink: 0 }}>
      <div style={{ display: "flex", gap: 4.5 }}>
        {([["#FF5F57","#E0443E"],["#FFBD2E","#DEA123"],["#28C840","#1DAD2B"]] as const)
          .map(([f, s], i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%",
            background: f, boxShadow: `0 0 0 0.5px ${s}` }} />
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <div style={{ padding: "1px 8px", background: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(0,0,0,0.10)", borderRadius: 4, maxWidth: 180 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 9,
            color: "rgba(0,0,0,0.38)", display: "block",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            portfolio.anna/{id}
          </span>
        </div>
      </div>
      <div style={{ width: 40 }} />
    </div>
  );
}

/* Zone visuelle 16:10 */
function VisualArea({ accentBg, visual }: { accentBg: string; visual: React.ReactNode }) {
  return (
    <div style={{ background: accentBg, padding: "8px 12px",
      aspectRatio: "16 / 10", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      {visual}
    </div>
  );
}

/* Barre d'info sous la fenêtre */
function WindowInfo({ num, title, color, tags, href, isMobile }: {
  num: string; title: string; color: string;
  tags: string[]; href?: string; isMobile?: boolean;
}) {
  return (
    <div style={{ padding: isMobile ? "14px 16px 16px" : "10px 14px 13px", borderTop: "1px solid rgba(0,0,0,0.06)",
      display: "flex", flexDirection: "column", gap: isMobile ? 10 : 8, background: "#fff" }}>
      <p style={{ fontSize: isMobile ? 15 : 11, fontWeight: 600, color: INK, margin: 0,
        lineHeight: 1.4, letterSpacing: "-0.01em" }}>{title}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {tags.map(t => (
          <span key={t} style={{ fontSize: isMobile ? 11 : 9, fontWeight: 500,
            padding: isMobile ? "3px 9px" : "1px 6px", borderRadius: 100,
            background: `color-mix(in srgb, ${color} 8%, transparent)`,
            color, border: `1px solid color-mix(in srgb, ${color} 18%, transparent)` }}>
            {t}
          </span>
        ))}
      </div>
      {href && (
        <Link href={href}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
            padding: isMobile ? "10px 0" : "6px 0", borderRadius: 6, fontSize: isMobile ? 13 : 10, fontWeight: 600,
            background: `color-mix(in srgb, ${color} 7%, transparent)`,
            color, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
            textDecoration: "none", width: "100%" }}
          onClick={e => e.stopPropagation()}>
          Voir le projet <ArrowUpRight size={isMobile ? 12 : 9} strokeWidth={2} />
        </Link>
      )}
    </div>
  );
}

/* Conteneur de la scène 2D */
function ProjectCanvas({ projects, isMobile }: { projects: ProjectData[]; isMobile: boolean }) {
  const [zMap, setZMap] = useState<Record<string, number>>(
    () => Object.fromEntries(projects.map(p => [p.id, p.zIndex]))
  );
  const zMax = useRef(projects.reduce((a, p) => Math.max(a, p.zIndex), 0));

  const bringToFront = (id: string) => {
    zMax.current += 1;
    setZMap(prev => ({ ...prev, [id]: zMax.current }));
  };

  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {projects.map((p, i) =>
          p.locked
            ? <LockedProjectWindow key={p.id} {...p} zIndex={zMap[p.id]}
                onPointerDown={() => bringToFront(p.id)} delay={i * 0.1} isMobile />
            : <ProjectWindow key={p.id} {...p} zIndex={zMap[p.id]}
                onPointerDown={() => bringToFront(p.id)} delay={i * 0.1} isMobile />
        )}
      </div>
    );
  }

  const canvasW = projects.reduce((max, p) => Math.max(max, p.x + p.width), 0) + 40;
  const canvasH = projects.reduce((max, p) => {
    const approxH = p.width * (10 / 16) + 185;
    return Math.max(max, p.y + approxH + 40);
  }, 400);

  return (
    <div style={{
      position: "relative",
      width: canvasW,
      maxWidth: "100%",
      minHeight: canvasH,
      overflow: "visible",
      margin: "0 auto",
    }}>
      {projects.map((p, i) =>
        p.locked
          ? <LockedProjectWindow key={p.id} {...p} zIndex={zMap[p.id]}
              onPointerDown={() => bringToFront(p.id)} delay={i * 0.12} />
          : <ProjectWindow key={p.id} {...p} zIndex={zMap[p.id]}
              onPointerDown={() => bringToFront(p.id)} delay={i * 0.12} />
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════
   GRID CANVAS — cadrillage interactif avec ripple au clic
   ═══════════════════════════════════════════════════════════════════ */
function GridCanvas({ heroRef }: { heroRef: React.RefObject<HTMLElement> }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const ripples    = useRef<{ x: number; y: number; r: number; a: number }[]>([]);
  const raf        = useRef(0);
  const trailCells = useRef<Map<string, number>>(new Map()); // key -> alpha 0..1
  const lastCell   = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero   = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext("2d")!;

    const GAP   = 48;
    const DECAY = 0.93; // par frame ≈ ~1 s pour disparaître à 60 fps
    let W = 0, H = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = hero.offsetWidth;
      H = hero.offsetHeight;
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / GAP);
      const rows = Math.ceil(H / GAP);

      // Trace curseur : cases colorées qui s'estompent
      for (const [key, alpha] of trailCells.current) {
        const [col, row] = key.split(",").map(Number);
        ctx.fillStyle = `rgba(162,89,255,${(alpha * 0.18).toFixed(3)})`;
        ctx.fillRect(col * GAP, row * GAP, GAP, GAP);
        const next = alpha * DECAY;
        if (next < 0.012) trailCells.current.delete(key);
        else trailCells.current.set(key, next);
      }

      // Lignes verticales
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "rgba(0,0,0,0.055)";
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath(); ctx.moveTo(c * GAP, 0); ctx.lineTo(c * GAP, H); ctx.stroke();
      }
      // Lignes horizontales
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * GAP); ctx.lineTo(W, r * GAP); ctx.stroke();
      }

      // Points d'intersection avec glow ripple
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const x = c * GAP, y = r * GAP;
          let glow = 0;
          for (const rip of ripples.current) {
            const d    = Math.hypot(x - rip.x, y - rip.y);
            const diff = Math.abs(d - rip.r);
            if (diff < 80) glow = Math.max(glow, (1 - diff / 80) * rip.a);
          }
          ctx.beginPath();
          ctx.arc(x, y, 1.2 + glow * 3.2, 0, Math.PI * 2);
          ctx.fillStyle = glow > 0.04
            ? `rgba(162,89,255,${(0.1 + glow * 0.75).toFixed(3)})`
            : "rgba(0,0,0,0.1)";
          ctx.fill();
        }
      }

      // Anneaux de ripple (clic)
      for (const rip of ripples.current) {
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(162,89,255,${(rip.a * 0.35).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ripples.current = ripples.current
        .map(rip => ({ ...rip, r: rip.r + 4.5, a: rip.a * 0.962 }))
        .filter(rip => rip.a > 0.007);

      raf.current = requestAnimationFrame(draw);
    };
    raf.current = requestAnimationFrame(draw);

    // Clic → ripple
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      ripples.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 0, a: 1 });
    };

    // Survol → allume la case (alpha=1), elle s'estompe seule
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const col  = Math.floor((e.clientX - rect.left) / GAP);
      const row  = Math.floor((e.clientY - rect.top)  / GAP);
      const key  = `${col},${row}`;
      if (key === lastCell.current) return;
      lastCell.current = key;
      trailCells.current.set(key, 1);
    };

    hero.addEventListener("click",     onClick);
    hero.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      hero.removeEventListener("click",     onClick);
      hero.removeEventListener("mousemove", onMouseMove);
    };
  }, [heroRef]);

  return (
    <canvas ref={canvasRef} aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        width: "100%", height: "100%",
      }} />
  );
}


/* ═══════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const heroRef  = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const PROJECTS: ProjectData[] = useMemo(() => {
    const pn = CH.projects.paynow;
    const ob = CH.projects.onboarding;
    const lc = CH.projects.lcbft;
    return [
      {
        id: "paynow", num: pn.num, label: pn.label,
        title: pn.title, desc: pn.desc,
        color: NAVY, accentBg: "rgba(30,58,138,0.04)",
        visual: <PayNowMockupSVG />,
        tags: pn.tags,
        href: "/paynow", siteHref: "/paynow/dashboard",
        x: 10, y: 25, width: 300, rotation: -2, zIndex: 1,
      },
      {
        id: "onboarding", num: ob.num, label: ob.label,
        title: ob.title, desc: ob.desc,
        color: BLUE, accentBg: `rgba(162,89,255,0.04)`,
        visual: <OnboardingMockupSVG />,
        tags: ob.tags,
        href: "/onboarding",
        x: 350, y: 10, width: 300, rotation: -1, zIndex: 2,
      },
      {
        id: "lcbft", num: lc.num, label: lc.label,
        title: lc.title, desc: lc.desc,
        color: "#A259FF", accentBg: "rgba(162,89,255,0.04)",
        visual: <LcbftMockupSVG />,
        tags: lc.tags,
        href: "/lcb-ft/description",
        siteHref: "/lcb-ft",
        x: 690, y: 20, width: 300, rotation: 1.5, zIndex: 3,
      },
      {
        id: "brand", num: "04", label: "Brand workshop, 2026",
        title: "Choix de la marque",
        desc: "Ateliers et itération sur le libellé d'un formulaire de paiement conformément aux nouvelles lois.",
        color: "#FF9500", accentBg: "rgba(255,149,0,0.04)",
        visual: <BrandMockupSVG />,
        tags: ["UX Writing", "Ateliers", "DSP2", "Conformité"],
        locked: true,
        x: 180, y: 415, width: 300, rotation: -1.5, zIndex: 4,
      },
      {
        id: "revision", num: "05", label: "Application mobile, 2024",
        title: "App Révision · tous niveaux",
        desc: "Application iOS de révision gamifiée : quiz adaptatifs, parcours de cours, classements et profil apprenant.",
        color: "#EC4899", accentBg: "rgba(236,72,153,0.04)",
        visual: <RevisionMockupSVG />,
        tags: ["iOS Design", "UX Research", "Gamification", "React Native"],
        locked: true,
        x: 530, y: 405, width: 300, rotation: 1.5, zIndex: 5,
      },
    ];
  }, []);

  const scrollTo = (id: string) =>
    id === "hero"
      ? window.scrollTo({ top: 0, behavior: "smooth" })
      : document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "var(--font-inter, var(--font-sans))",
      backgroundColor: BG, color: INK, colorScheme: "light" }}>

      <PortfolioHeader />


      {/* ══ HERO ═════════════════════════════════════════════════════ */}
      {/*
        isolation: isolate → crée un stacking context qui confine le z-index: -1
        du canvas à l'intérieur de la section (ne descend pas derrière le body).
      */}
      <section ref={heroRef as React.RefObject<HTMLElement>}
        className="pf2-hero-section"
        style={{
          minHeight: "100dvh", display: "flex", flexDirection: "column",
          justifyContent: "flex-start", overflow: "hidden",
          position: "relative", isolation: "isolate",
          cursor: "crosshair",
        }}
        aria-labelledby="hero-title">

        {/* Cadrillage interactif — z-index: -1 (derrière le contenu) */}
        <GridCanvas heroRef={heroRef as React.RefObject<HTMLElement>} />
        {/* Schéma technique décoratif — traits fins + micro-anim */}
        <HeroTechLines />

        <div className="pf2-hero-pad" style={{ maxWidth: 1152, margin: "0 auto", padding: "192px 48px 0" }}>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="hig-caption2"
            style={{ fontWeight: 600, letterSpacing: "0.16em",
              textTransform: "uppercase", color: BLUE, marginBottom: 48 }}>
            {CH.hero.eyebrow}
          </motion.p>

          {/* Headline — stagger mot par mot */}
          <h1 id="hero-title" style={{
            fontSize: "clamp(50px, 7.8vw, 110px)", fontWeight: 200,
            lineHeight: 1.0, letterSpacing: "var(--ls-display)",
            color: INK, margin: "0 0 48px 0",
          }}>
            <span style={{ display: "block" }}>
              {CH.hero.titleLine1.split(" ").map((w: string, i: number) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.14 + i * 0.08, duration: 0.72, ease: SP }}
                  style={{ display: "inline-block", marginRight: "0.3em" }}>
                  {w}
                </motion.span>
              ))}
            </span>
            <span style={{ display: "block", color: BLUE }}>
              {CH.hero.titleLine2.split(" ").map((w: string, i: number) => (
                <motion.span key={i}
                  initial={{ opacity: 0, y: 24, filter: "blur(5px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.46 + i * 0.08, duration: 0.72, ease: SP }}
                  style={{ display: "inline-block", marginRight: "0.3em" }}>
                  {w}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.84, duration: 0.6, ease: SP }}
            className="hig-body"
            style={{ color: INK3, maxWidth: 460, marginBottom: 48 }}>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6, ease: SP }}
            className="pf2-hero-ctas"
            style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <motion.button className="pf2-btn-primary"
              onClick={() => scrollTo("work")}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
              Voir les projets
            </motion.button>
            <button onClick={() => scrollTo("contact")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                fontSize: 15, fontWeight: 500, color: BLUE, letterSpacing: "-0.01em",
                display: "flex", alignItems: "center", gap: 6 }}>
              Me contacter <ArrowRight size={15} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

      </section>


      {/* ══ ABOUT ════════════════════════════════════════════════════ */}
      <section id="about" style={{ backgroundColor: BG, scrollMarginTop: "64px" }}
        aria-labelledby="about-title">
        <div className="pf2-section-pad pf2-about-grid" style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

          <Reveal>
            <SectionLabel>À propos</SectionLabel>
            <p style={{ fontSize: "clamp(30px,3.8vw,52px)", fontWeight: 300,
              letterSpacing: "var(--ls-title2)", color: INK, marginBottom: 16, lineHeight: 1.1 }}>
              {CH.about.greeting}
            </p>
            <h2 id="about-title" className="hig-title3" style={{ color: INK2, marginBottom: 28, fontWeight: 400 }}>
              {CH.about.role}
            </h2>
            <p className="hig-body" style={{ color: INK2, marginBottom: 20 }}>{CH.about.bio1}</p>
            <p className="hig-body" style={{ color: INK2, marginBottom: 20 }}>{CH.about.bio2}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {(CH.about.tools as string[]).map(tool => (
                <span key={tool} className="badge-neutral" style={{ padding: "4px 11px", borderRadius: 100 }}>{tool}</span>
              ))}
            </div>
          </Reveal>

          <div className="cs-two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {([
              { icon: <IconResearch />,  stat: "UX Research", label: "Recherche utilisateur", sub: "Entretiens · Tests util. · Personas",  delay: 0,   floatDelay: 0   },
              { icon: <IconDesign />,    stat: "UI Design",   label: "Design de produit",     sub: "Figma · Design System · Prototypage", delay: 80,  floatDelay: 0.9 },
              { icon: <IconDesign />,    stat: "Design System", label: "Composants & tokens",   sub: "Atoms · Variables · Documentation",   delay: 160, floatDelay: 1.8 },
              { icon: <IconFormation />, stat: "Design Thinking", label: "Approche centrée humain", sub: "Empathie · Idéation · Test",        delay: 240, floatDelay: 2.7 },
            ] as const).map((card, i) => (
              <FloatCard key={i} icon={card.icon} stat={card.stat} label={card.label} sub={card.sub} delay={card.delay} floatDelay={card.floatDelay} />
            ))}
          </div>

        </div>
      </section>



      {/* ══ SELECTED WORK ════════════════════════════════════════════ */}
      <section id="work" style={{ backgroundColor: BG, borderBottom: `1px solid ${BORD}` }}
        aria-labelledby="work-title">
        <div className="pf2-section-pad" style={{ maxWidth: 1152, margin: "0 auto" }}>

          <Reveal>
            <SectionLabel>{CH.work.label}</SectionLabel>
            <h2 id="work-title" style={{ fontSize: "clamp(30px,4vw,56px)", fontWeight: 300,
              letterSpacing: "var(--ls-title1)", color: INK, marginBottom: 48, lineHeight: 1.1 }}>
              {CH.work.title}
            </h2>
          </Reveal>

          <ProjectCanvas projects={PROJECTS} isMobile={isMobile} />


        </div>
      </section>




      {/* ══ CONTACT ══════════════════════════════════════════════════ */}
      <section id="contact" style={{ backgroundColor: INK }}
        aria-labelledby="contact-title">
        <div className="pf2-section-pad" style={{ maxWidth: 1152, margin: "0 auto" }}>
          <Reveal>
            <SectionLabel>Contact</SectionLabel>
            <h2 id="contact-title" style={{ fontSize:"clamp(40px,7vw,96px)", fontWeight:200,
              letterSpacing:"var(--ls-display)", color:"#FAFAFA", marginBottom:48, lineHeight:1.0 }}>
              {CH.contact.titleLine1}<br />{CH.contact.titleLine2}
            </h2>
            <p className="hig-body" style={{ color:"rgba(255,255,255,0.65)",
              maxWidth:400, marginBottom:48 }}>
              {CH.contact.body}
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {[
                { href:`mailto:${CH.contact.email}`, label: CH.contact.email,       dim:false },
                { href:"#",                          label: CH.contact.linkedinLabel, dim:true  },
                { href:"#",                          label: CH.contact.cvLabel,       dim:true  },
              ].map((link) => (
                <a key={link.label} href={link.href} className="pf2-contact-link"
                  style={{ fontSize:"clamp(18px,2.8vw,36px)", fontWeight:300,
                    color: link.dim ? "rgba(255,255,255,0.55)" : "#FAFAFA",
                    letterSpacing:"-0.025em" }}>
                  {link.label}
                  <ArrowUpRight size={22} strokeWidth={1.2} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>


      {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: INK,
        borderTop:"1px solid rgba(255,255,255,0.07)", padding:"20px 48px" }}>
        <div style={{ maxWidth:1152, margin:"0 auto",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          flexWrap:"wrap", gap:8 }}>
          <p className="hig-caption2" style={{ color:"rgba(255,255,255,0.22)" }}>{CH.footer.left}</p>
          <p className="hig-caption2" style={{ color:"rgba(255,255,255,0.22)" }}>{CH.footer.right}</p>
        </div>
      </footer>

    </div>
  );
}
