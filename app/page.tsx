"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence, useMotionValue } from "framer-motion";
import { ArrowRight, ArrowUpRight, X, Monitor } from "lucide-react";
import { PortfolioHeader } from "@/components/ui/PortfolioHeader";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import _C from "@/data/content.json";
import { useLang } from "@/components/ui/LanguageContext";

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
const FGRN   = "#A8D400";

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
  const { lang } = useLang();
  const tracks = [
    {
      label: "UX RESEARCH",
      textColor: "rgba(37,99,235,0.65)",
      lineColor: "rgba(37,99,235,0.18)",
      dotColor:  "rgba(37,99,235,1)",
      ringColor: "rgba(37,99,235,0.1)",
      y: 100,
      skills: lang === "en"
        ? ["Research", "Interviews", "Personas", "Usability tests", "User flows", "Architecture"]
        : ["Recherche", "Entretiens", "Personas", "Tests util.", "User flows", "Architecture"],
    },
    {
      label: "UI DESIGN",
      textColor: "rgba(124,58,237,0.65)",
      lineColor: "rgba(124,58,237,0.18)",
      dotColor:  "rgba(124,58,237,1)",
      ringColor: "rgba(124,58,237,0.1)",
      y: 195,
      skills: lang === "en"
        ? ["Design System", "Figma", "Typography", "Prototyping", "WCAG AA", "Micro-anim."]
        : ["Design System", "Figma", "Typographie", "Prototypage", "WCAG AA", "Micro-anim."],
    },
    {
      label: "FRONTEND",
      textColor: "rgba(52,199,89,0.75)",
      lineColor: "rgba(52,199,89,0.18)",
      dotColor:  "#34C759",
      ringColor: "rgba(52,199,89,0.12)",
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

function LivreBlanMockupSVG() {
  const TEAL  = "#0D9488";
  const T10   = "rgba(13,148,136,0.10)";
  const T20   = "rgba(13,148,136,0.20)";
  const GY    = "rgba(0,0,0,0.06)";
  const GY2   = "rgba(0,0,0,0.12)";
  return (
    <svg viewBox="0 0 400 190" fill="none" aria-hidden="true" style={{ width: "100%" }}>
      {/* bg grid */}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1="0" y1={38*i} x2="400" y2={38*i} stroke={GY} strokeWidth="0.5" />
      ))}

      {/* Nav bar */}
      <rect x="0" y="0" width="400" height="22" fill={TEAL} />
      <circle cx="12" cy="11" r="4" fill="rgba(255,255,255,0.3)" />
      <rect x="22" y="7" width="60" height="8" rx="2" fill="rgba(255,255,255,0.9)" />
      {[110,145,178].map(x => (
        <rect key={x} x={x} y="8" width="28" height="6" rx="1.5" fill="rgba(255,255,255,0.35)" />
      ))}
      <rect x="340" y="6" width="48" height="10" rx="5" fill="rgba(255,255,255,0.25)" />

      {/* Hero band */}
      <rect x="0" y="22" width="400" height="52" fill={T10} />
      <rect x="24" y="32" width="180" height="10" rx="2" fill={TEAL} opacity="0.7" />
      <rect x="24" y="46" width="240" height="7" rx="1.5" fill={GY2} />
      <rect x="24" y="57" width="180" height="7" rx="1.5" fill={GY2} />
      <rect x="24" y="66" width="90" height="14" rx="7" fill={TEAL} />
      <rect x="300" y="28" width="80" height="40" rx="6" fill={T20} />
      <circle cx="340" cy="48" r="12" fill={TEAL} opacity="0.2" />
      <text x="334" y="52" fontSize="10" fill={TEAL} fontWeight="700">A11Y</text>

      {/* Body — 2 colonnes */}
      {/* Col 1 */}
      <rect x="24" y="88" width="170" height="8" rx="2" fill={GY2} />
      <rect x="24" y="100" width="170" height="5" rx="1.5" fill={GY} />
      <rect x="24" y="108" width="140" height="5" rx="1.5" fill={GY} />
      <rect x="24" y="116" width="155" height="5" rx="1.5" fill={GY} />
      <rect x="24" y="128" width="60" height="9" rx="2" fill={T10} />
      <rect x="26" y="130" width="3" height="5" rx="1" fill={TEAL} />
      <rect x="32" y="131" width="50" height="4" rx="1" fill={GY2} />
      <rect x="24" y="142" width="60" height="9" rx="2" fill={T10} />
      <rect x="26" y="144" width="3" height="5" rx="1" fill={TEAL} />
      <rect x="32" y="145" width="45" height="4" rx="1" fill={GY2} />
      <rect x="24" y="156" width="60" height="9" rx="2" fill={T10} />
      <rect x="26" y="158" width="3" height="5" rx="1" fill={TEAL} />
      <rect x="32" y="159" width="52" height="4" rx="1" fill={GY2} />

      {/* Col 2 — stat cards */}
      <rect x="210" y="88" width="76" height="46" rx="8" fill={T10} stroke={T20} strokeWidth="1" />
      <text x="248" y="108" textAnchor="middle" fontSize="14" fontWeight="800" fill={TEAL}>92%</text>
      <rect x="224" y="112" width="48" height="4" rx="1" fill={T20} />
      <rect x="228" y="120" width="40" height="4" rx="1" fill={GY} />

      <rect x="298" y="88" width="76" height="46" rx="8" fill="rgba(99,102,241,0.07)" stroke="rgba(99,102,241,0.18)" strokeWidth="1" />
      <text x="336" y="108" textAnchor="middle" fontSize="14" fontWeight="800" fill="#6366F1">4.5:1</text>
      <rect x="310" y="112" width="52" height="4" rx="1" fill="rgba(99,102,241,0.2)" />
      <rect x="316" y="120" width="40" height="4" rx="1" fill={GY} />

      <rect x="210" y="142" width="164" height="5" rx="1.5" fill={GY} />
      <rect x="210" y="151" width="140" height="5" rx="1.5" fill={GY} />
      <rect x="210" y="160" width="100" height="5" rx="1.5" fill={GY} />

      {/* Footer */}
      <rect x="0" y="178" width="400" height="12" fill={GY} />
      <rect x="24" y="181" width="60" height="4" rx="1" fill={GY2} />
      <rect x="320" y="181" width="60" height="4" rx="1" fill={TEAL} opacity="0.4" />
    </svg>
  );
}

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
  desktopOnly?: boolean;
}

function ProjectWindow({
  id, num, label, title, desc, color, accentBg, visual, tags,
  href, siteHref, desktopOnly,
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
  const { lang } = useLang();

  if (isMobile) {
    return (
      <Link href={href ?? "#"} style={{ textDecoration: "none", display: "block" }}>
        <motion.article
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay, ease: SP }}
          style={{ borderRadius: 12, overflow: "hidden", background: "#fff",
            border: "1px solid rgba(0,0,0,0.08)", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)", position: "relative" }}>
          <VisualArea accentBg={accentBg} visual={visual} />
          <WindowInfo num={num} title={title} color={color} tags={tags} href={href} siteHref={siteHref} isMobile />
          {desktopOnly && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              gap: 10, padding: 20,
              pointerEvents: "none",
            }}>
              <Monitor size={24} strokeWidth={1.5} color={color} />
              <p style={{ fontSize: 14, fontWeight: 700, color: INK,
                margin: 0, textAlign: "center", lineHeight: 1.3 }}>
                {lang === "en" ? "Desktop experience" : "Expérience desktop"}
              </p>
              <p style={{ fontSize: 12, color: INK2, margin: 0,
                textAlign: "center", lineHeight: 1.5, maxWidth: 200 }}>
                {lang === "en"
                  ? "Open this portfolio on a computer to access the interactive demo"
                  : "Ouvre ce portfolio sur ordinateur pour accéder à la démo interactive"}
              </p>
              <span style={{ fontSize: 11, fontWeight: 600, color,
                padding: "4px 12px", borderRadius: 100,
                background: `color-mix(in srgb, ${color} 10%, transparent)`,
                border: `1px solid color-mix(in srgb, ${color} 20%, transparent)` }}>
                {lang === "en" ? "View case study →" : "Voir le case study →"}
              </span>
            </div>
          )}
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
        color={color} tags={tags} href={href} siteHref={siteHref} />
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
  const { lang } = useLang();
  const inner = (
    <div style={{ position: "relative", pointerEvents: "none" }}>
      {/* Contenu flouté en permanence */}
      <div style={{ filter: "blur(3px) brightness(0.88) grayscale(0.2)" }}>
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

      {/* Overlay permanent */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 8,
        padding: "16px",
      }}>
        <div style={{ display: "flex", gap: 5 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: INK3,
            padding: "2px 7px", borderRadius: 100,
            background: "rgba(0,0,0,0.05)" }}>UI Design</span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color,
            padding: "2px 7px", borderRadius: 100,
            background: `color-mix(in srgb, ${color} 10%, transparent)` }}>{lang === "en" ? "In progress" : "En cours"}</span>
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
          {lang === "en" ? "Available early August" : "Disponible début août"}
        </span>
      </div>
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
          cursor: "default",
        }}>
        {inner}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 0.82, scale: 1,
        boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.05)" }}
      transition={{ duration: 0.5, delay, ease: SP }}
      style={{
        position: "absolute", left: initX, top: initY,
        rotate: rotation, width, zIndex,
        borderRadius: 14, overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.09)",
        cursor: "default",
        userSelect: "none",
      }}>
      {inner}
    </motion.div>
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
function WindowInfo({ num, title, color, tags, href, siteHref, isMobile }: {
  num: string; title: string; color: string;
  tags: string[]; href?: string; siteHref?: string; isMobile?: boolean;
}) {
  const { lang } = useLang();
  const isExternal = href?.startsWith("http");
  const fs = isMobile ? 12 : 9;
  const pad = isMobile ? "9px 10px" : "5px 8px";
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
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {href && !isExternal && (
          <Link href={href}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              padding: pad, borderRadius: 6, fontSize: fs, fontWeight: 600,
              background: `color-mix(in srgb, ${color} 7%, transparent)`,
              color, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)`,
              textDecoration: "none", whiteSpace: "nowrap" }}
            onClick={e => e.stopPropagation()}>
            {lang === "en" ? "Creation process" : "Voir le processus"}
            <ArrowUpRight size={isMobile ? 11 : 8} strokeWidth={2} />
          </Link>
        )}
        {siteHref && (
          <Link href={siteHref}
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              padding: pad, borderRadius: 6, fontSize: fs, fontWeight: 600,
              background: color, color: "#fff",
              textDecoration: "none", whiteSpace: "nowrap" }}
            onClick={e => e.stopPropagation()}>
            {lang === "en" ? "Visit the SaaS" : "Visiter le SaaS"}
            <ArrowUpRight size={isMobile ? 11 : 8} strokeWidth={2} />
          </Link>
        )}
        {href && isExternal && (
          <a href={href} target="_blank" rel="noopener noreferrer"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              padding: pad, borderRadius: 6, fontSize: fs, fontWeight: 600,
              background: color, color: "#fff",
              textDecoration: "none", whiteSpace: "nowrap" }}
            onClick={e => e.stopPropagation()}>
            {lang === "en" ? "Visit the site" : "Visiter le site"}
            <ArrowUpRight size={isMobile ? 11 : 8} strokeWidth={2} />
          </a>
        )}
      </div>
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
  const { lang } = useLang();
  const CH = lang === "en" ? _C.homeEn : _C.home;

  const PROJECTS: ProjectData[] = useMemo(() => {
    const pn = CH.projects.paynow;
    const ob = CH.projects.onboarding;
    const lc = CH.projects.lcbft;
    const lb = CH.projects.livreBlanc;
    return [
      {
        id: "paynow", num: pn.num, label: pn.label,
        title: pn.title, desc: pn.desc,
        color: NAVY, accentBg: "rgba(30,58,138,0.04)",
        visual: <PayNowMockupSVG />,
        tags: pn.tags,
        href: "/paynow", siteHref: "/paynow/dashboard",
        desktopOnly: true,
        x: 10, y: 25, width: 300, rotation: -2, zIndex: 1,
      },
      {
        id: "onboarding", num: ob.num, label: ob.label,
        title: ob.title, desc: ob.desc,
        color: BLUE, accentBg: `rgba(162,89,255,0.04)`,
        visual: <OnboardingMockupSVG />,
        tags: ob.tags,
        href: "/onboarding",
        desktopOnly: true,
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
        desktopOnly: true,
        x: 690, y: 20, width: 300, rotation: 1.5, zIndex: 3,
      },
      {
        id: "livreBlanc", num: lb.num, label: lb.label,
        title: lb.title, desc: lb.desc,
        color: "#0D9488", accentBg: "rgba(13,148,136,0.04)",
        visual: <LivreBlanMockupSVG />,
        tags: lb.tags,
        href: "https://accessibilite-paiement-ux-design.netlify.app/",
        desktopOnly: false,
        x: 350, y: 415, width: 300, rotation: -1, zIndex: 4,
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CH]);

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
              {lang === "en" ? "View projects" : "Voir les projets"}
            </motion.button>
            <button onClick={() => scrollTo("contact")}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0,
                fontSize: 15, fontWeight: 500, color: BLUE, letterSpacing: "-0.01em",
                display: "flex", alignItems: "center", gap: 6 }}>
              {lang === "en" ? "Contact me" : "Me contacter"} <ArrowRight size={15} strokeWidth={1.5} />
            </button>
          </motion.div>
        </div>

      </section>


      {/* ══ ABOUT ════════════════════════════════════════════════════ */}
      <section id="about" style={{ backgroundColor: BG, scrollMarginTop: "64px" }}
        aria-labelledby="about-title">
        <div className="pf2-section-pad pf2-about-grid" style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>

          <Reveal>
            <SectionLabel>{lang === "en" ? "About" : "À propos"}</SectionLabel>
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
              { icon: <IconResearch />,  stat: "UX Research",
                label: lang === "en" ? "User research"            : "Recherche utilisateur",
                sub:   lang === "en" ? "Interviews · Usability · Personas" : "Entretiens · Tests util. · Personas",
                delay: 0,   floatDelay: 0   },
              { icon: <IconDesign />,    stat: "UI Design",
                label: lang === "en" ? "Product design"           : "Design de produit",
                sub:   lang === "en" ? "Figma · Design System · Prototyping" : "Figma · Design System · Prototypage",
                delay: 80,  floatDelay: 0.9 },
              { icon: <IconDesign />,    stat: "Design System",
                label: lang === "en" ? "Components & tokens"      : "Composants & tokens",
                sub:   "Atoms · Variables · Documentation",
                delay: 160, floatDelay: 1.8 },
              { icon: <IconFormation />, stat: "Design Thinking",
                label: lang === "en" ? "Human-centered approach"  : "Approche centrée humain",
                sub:   lang === "en" ? "Empathy · Ideation · Test": "Empathie · Idéation · Test",
                delay: 240, floatDelay: 2.7 },
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

          <Reveal>
            <div style={{ marginTop: 24 }}>

              {/* ── Header section ── */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 16, marginBottom: 28,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <svg width="24" height="36" viewBox="0 0 38 57" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
                    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83"/>
                    <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262"/>
                    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
                    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
                  </svg>
                  <div>
                    <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
                      {lang === "en" ? "My Figma creations" : "Mes créations Figma"}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 13, color: INK3 }}>
                      {lang === "en" ? "Prototypes, design systems and UI explorations" : "Prototypes, design systems et explorations UI"}
                    </p>
                  </div>
                </div>
                <a
                  href="https://www.figma.com/@anavignaud"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 18px", borderRadius: 100,
                    border: `1px solid ${BORD}`,
                    color: INK3, textDecoration: "none",
                    fontSize: 13, fontWeight: 500,
                    transition: "border-color 180ms, color 180ms",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = BLUE;
                    (e.currentTarget as HTMLAnchorElement).style.color = BLUE;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = BORD;
                    (e.currentTarget as HTMLAnchorElement).style.color = INK3;
                  }}
                >
                  {lang === "en" ? "See all projects" : "Voir les autres projets"}
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </a>
              </div>

              {/* ── Cards ── */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 20,
              }}>
                {[
                  {
                    title: "Mobile app — design",
                    href: "https://www.figma.com/community/file/1672975154087606867",
                    img: "/figma/project-1.png",
                  },
                  {
                    title: "Dashboard + Mobile app — Full medical app",
                    href: "https://www.figma.com/community/file/1672954127897387498",
                    img: "/figma/project-2.png",
                  },
                  {
                    title: "WEB / Responsive — School website",
                    href: "https://www.figma.com/community/file/1672968757199015472",
                    img: "/figma/project-3.png",
                  },
                  {
                    title: "Mobile app — Health care",
                    href: "https://www.figma.com/community/file/1672654429665508615",
                    img: "/figma/project-4.png",
                  },
                  {
                    title: "Holy — UI Kit",
                    href: "https://www.figma.com/community/file/1672963772588846617",
                    img: "/figma/project-5.png",
                  },
                ].map((project) => (
                  <motion.a
                    key={project.href}
                    href={project.href}
                    target="_blank" rel="noopener noreferrer"
                    whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
                    transition={{ duration: 0.22, ease: SP }}
                    style={{
                      display: "flex", flexDirection: "column",
                      borderRadius: 16,
                      border: `1px solid ${BORD}`,
                      overflow: "hidden",
                      background: "#fff",
                      textDecoration: "none",
                      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                    }}
                  >
                    {/* Thumbnail */}
                    <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: SURF }}>
                      <Image
                        src={project.img}
                        alt={project.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>

                    {/* Footer card */}
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px", gap: 12,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                        <svg width="14" height="21" viewBox="0 0 38 57" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
                          <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
                          <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83"/>
                          <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262"/>
                          <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
                          <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
                        </svg>
                        <span style={{
                          fontSize: 13, fontWeight: 600, color: INK,
                          letterSpacing: "-0.01em",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>
                          {project.title}
                        </span>
                      </div>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 12, fontWeight: 600, color: BLUE,
                        flexShrink: 0, whiteSpace: "nowrap",
                      }}>
                        {lang === "en" ? "Open in Figma" : "Voir sur Figma"}
                        <ArrowUpRight size={12} strokeWidth={2} />
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>

            </div>
          </Reveal>

          {/* ── Livre blanc ───────────────────────────────────────── */}
          <Reveal>
            <div style={{ marginTop: 48, paddingTop: 40, borderTop: `1px solid ${BORD}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: "#0D9488",
                  padding: "3px 10px", borderRadius: 100,
                  background: "rgba(13,148,136,0.08)",
                  border: "1px solid rgba(13,148,136,0.2)",
                }}>
                  {lang === "en" ? "White paper" : "Livre blanc"}
                </span>
                <span style={{ fontSize: 13, color: INK3 }}>2026</span>
              </div>

              <motion.a
                href="https://accessibilite-paiement-ux-design.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.10)" }}
                transition={{ duration: 0.22, ease: SP }}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: 20,
                  padding: "28px 32px",
                  borderRadius: 16,
                  border: "1px solid rgba(13,148,136,0.2)",
                  background: "linear-gradient(135deg, rgba(13,148,136,0.04) 0%, rgba(13,148,136,0.01) 100%)",
                  textDecoration: "none",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: INK, letterSpacing: "-0.02em" }}>
                    {lang === "en"
                      ? "Inclusion beyond regulations — Accessibility in payments"
                      : "Inclure au-delà du réglementaire — L'accessibilité dans le paiement"}
                  </p>
                  <p style={{ margin: 0, fontSize: 14, color: INK3, lineHeight: 1.6, maxWidth: 600 }}>
                    {lang === "en"
                      ? "A research paper exploring how to design truly inclusive payment experiences — rethinking forms, flows and error states for all users."
                      : "Une réflexion sur la conception d'expériences de paiement réellement inclusives — formulaires, parcours et états d'erreur repensés pour tous."}
                  </p>
                  <div style={{ display: "flex", gap: 6, marginTop: 14, flexWrap: "wrap" }}>
                    {["Accessibilité", "UX Writing", "WCAG AA", "Paiement"].map(tag => (
                      <span key={tag} style={{
                        fontSize: 11, fontWeight: 500, padding: "3px 10px", borderRadius: 100,
                        background: "rgba(13,148,136,0.08)", color: "#0D9488",
                        border: "1px solid rgba(13,148,136,0.2)",
                      }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "11px 22px", borderRadius: 100,
                  background: "#0D9488", color: "#fff",
                  fontSize: 13, fontWeight: 600, flexShrink: 0,
                  whiteSpace: "nowrap",
                }}>
                  {lang === "en" ? "Read the white paper" : "Lire le livre blanc"}
                  <ArrowUpRight size={14} strokeWidth={1.8} />
                </span>
              </motion.a>
            </div>
          </Reveal>

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
                { href:"https://www.linkedin.com/in/anna-vignaud-559367208", label: CH.contact.linkedinLabel, dim:true  },
                { href:"#",                          label: CH.contact.cvLabel,       dim:true  },
              ].map((link) => (
                <a key={link.label} href={link.href} className="pf2-contact-link"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
