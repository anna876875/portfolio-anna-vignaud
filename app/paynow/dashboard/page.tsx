"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  TrendingUp, TrendingDown, ArrowRight, AlertTriangle,
  CheckCircle2, XCircle, Clock, MinusCircle,
  MoreHorizontal, Eye, Ban, RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { PayNowShell, PN, FONT } from "../_shell";

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function fmt(n: number, decimals = 0) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/* ─────────────────────────────────────────────────────────────────────────────
   VOLUME CHART  — SVG Catmull-Rom area
───────────────────────────────────────────────────────────────────────────── */
const CHART_DATA: Record<string, [number, number][]> = {
  "Mois dernier": [
    [1,392_000],[3,248_000],[5,294_000],[7,369_000],[9,418_000],
    [11,407_000],[13,449_000],[15,437_000],[17,479_000],[19,493_000],
    [21,464_000],[23,489_000],[25,519_000],[27,550_000],[29,583_000],[30,614_000],
  ],
  "Trimestre": [
    [1,1_120_000],[3,980_000],[5,1_050_000],[8,1_210_000],[11,1_380_000],
    [14,1_290_000],[17,1_450_000],[20,1_520_000],[24,1_630_000],[28,1_710_000],[30,1_840_000],
  ],
  "Semestre": [
    [1,2_100_000],[3,1_920_000],[6,2_280_000],[9,2_450_000],[12,2_380_000],
    [15,2_560_000],[18,2_710_000],[21,2_830_000],[24,3_050_000],[27,3_230_000],[30,3_450_000],
  ],
  "Année": [
    [1,5_200_000],[2,4_800_000],[3,5_600_000],[4,6_100_000],[5,5_900_000],
    [6,6_400_000],[7,6_800_000],[8,7_200_000],[9,7_600_000],[10,8_100_000],
    [11,8_400_000],[12,8_900_000],
  ],
};
const CHART_LABELS: Record<string, string[]> = {
  "Mois dernier": ["1 avr","5","10","15","20","25","30"],
  "Trimestre":    ["Jan","Fév","Mars"],
  "Semestre":     ["Jan","Fév","Mars","Avr","Mai","Juin"],
  "Année":        ["J","F","M","A","M","J","J","A","S","O","N","D"],
};

function VolumeChart({ period }: { period: string }) {
  const L=44, R=524, T=12, B=170;
  const CW=R-L, CH=B-T;
  const raw = CHART_DATA[period] ?? CHART_DATA["Mois dernier"];
  const maxX = raw[raw.length-1][0];
  const MAX   = Math.max(...raw.map(([,v]) => v)) * 1.1;
  const px = (d: number) => L + (d / maxX) * CW;
  const py = (v: number) => B - (v / MAX) * CH;
  type Pt = {x:number; y:number};
  const pts: Pt[] = raw.map(([d,v]) => ({ x:px(d), y:py(v) }));
  let line = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i=0; i<pts.length-1; i++) {
    const p0=pts[Math.max(0,i-1)], p1=pts[i], p2=pts[i+1], p3=pts[Math.min(pts.length-1,i+2)];
    const c1x=p1.x+(p2.x-p0.x)/6, c1y=p1.y+(p2.y-p0.y)/6;
    const c2x=p2.x-(p3.x-p1.x)/6, c2y=p2.y-(p3.y-p1.y)/6;
    line += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  const area = line + ` L ${R},${B} L ${L},${B} Z`;
  const yVals = [MAX, MAX*0.75, MAX*0.5, MAX*0.25, 0].map(v => Math.round(v/1000)*1000);
  const labels = CHART_LABELS[period] ?? [];
  return (
    <svg viewBox="0 0 568 200" style={{ width:"100%", height:"auto", display:"block" }} aria-hidden="true">
      <defs>
        <linearGradient id="pn-dash-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={PN.primary} stopOpacity="0.14" />
          <stop offset="100%" stopColor={PN.primary} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {yVals.map(v => (
        <line key={v} x1={L} y1={py(v)} x2={R} y2={py(v)} stroke={PN.bord} strokeWidth="1" strokeDasharray="4 3" />
      ))}
      <path d={area} fill="url(#pn-dash-fill)" />
      <path d={line} fill="none" stroke={PN.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => i === pts.length-1 && (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={PN.primary} stroke="#fff" strokeWidth="2" />
      ))}
      {yVals.slice(0,-1).map(v => (
        <text key={`y${v}`} x={L-7} y={py(v)+4} textAnchor="end" fontSize="9" fill={PN.ink3} fontFamily={FONT}>
          {v>=1_000_000 ? `${(v/1_000_000).toFixed(1)}M€` : v>=1000 ? `${Math.round(v/1000)}k€` : `${v}€`}
        </text>
      ))}
      {labels.map((l, i) => {
        const x = L + (i / (labels.length-1)) * CW;
        return <text key={l} x={x} y={B+18} textAnchor="middle" fontSize="9" fill={PN.ink3} fontFamily={FONT}>{l}</text>;
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ACCEPTANCE GAUGE  — SVG donut
───────────────────────────────────────────────────────────────────────────── */
function AcceptanceGauge({ pctDeb, pctCred, tauxGlobal }: { pctDeb: number; pctCred: number; tauxGlobal: number }) {
  const r=40, c=2*Math.PI*r;
  const dashDeb  = (pctDeb  / 100) * c;
  const dashCred = (pctCred / 100) * c;
  const rotCred  = -90 + (pctDeb / 100) * 360;
  return (
    <svg width="108" height="108" viewBox="0 0 108 108">
      <circle cx="54" cy="54" r={r} fill="none" stroke={PN.surf} strokeWidth="9" />
      <circle cx="54" cy="54" r={r} fill="none" stroke={PN.primary} strokeWidth="9"
        strokeDasharray={`${dashDeb.toFixed(2)} ${(c-dashDeb).toFixed(2)}`}
        strokeLinecap="butt" transform="rotate(-90 54 54)" />
      <circle cx="54" cy="54" r={r} fill="none" stroke={PN.amber} strokeWidth="9"
        strokeDasharray={`${dashCred.toFixed(2)} ${(c-dashCred).toFixed(2)}`}
        strokeLinecap="butt" transform={`rotate(${rotCred} 54 54)`} />
      <text x="54" y="50" textAnchor="middle" fontSize="15" fontWeight="800" fill={PN.ink} fontFamily={FONT}>{tauxGlobal.toFixed(1)}</text>
      <text x="54" y="64" textAnchor="middle" fontSize="10" fill={PN.ink3} fontFamily={FONT}>%</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT METHOD ICONS  (small, 32×20)
───────────────────────────────────────────────────────────────────────────── */
function CBIcon()    { return <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#1434CB"/><text x="16" y="14" textAnchor="middle" fontSize="8.5" fontWeight="900" fill="#fff" fontFamily={FONT} letterSpacing="0.05em">CB</text></svg>; }
function MCIcon()    { return <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#F5F5F5"/><circle cx="12" cy="10" r="7" fill="#EB001B"/><circle cx="20" cy="10" r="7" fill="#F79E1B"/><path d="M16 4.48A7 7 0 0 1 20 10a7 7 0 0 1-4 5.52A7 7 0 0 1 12 10a7 7 0 0 1 4-5.52Z" fill="#FF5F00"/></svg>; }
function APIcon()    { return <svg width="44" height="20" viewBox="0 0 44 20" fill="none"><rect width="44" height="20" rx="3" fill="#000"/><text x="22" y="13.5" textAnchor="middle" fontSize="7.5" fontWeight="500" fill="#fff" fontFamily="-apple-system,sans-serif" letterSpacing="0.01em">Apple Pay</text></svg>; }
function PPIcon()    { return <svg width="32" height="20" viewBox="0 0 32 20" fill="none"><rect width="32" height="20" rx="3" fill="#003087"/><text x="16" y="14.5" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Georgia,serif" fontStyle="italic">P</text></svg>; }
function AlmaIcon()  { return <svg width="44" height="20" viewBox="0 0 44 20" fill="none"><rect width="44" height="20" rx="3" fill="#fff" stroke={PN.bord} strokeWidth="0.8"/><text x="22" y="13.5" textAnchor="middle" fontSize="10" fontWeight="800" fill="#FF3F5A" fontFamily={FONT} letterSpacing="-0.04em">alma</text></svg>; }
function WeroIcon()  { return <svg width="44" height="20" viewBox="0 0 44 20" fill="none"><rect width="44" height="20" rx="3" fill="#5F2D91"/><text x="22" y="13.5" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fff" fontFamily={FONT} letterSpacing="0.06em">WERO</text></svg>; }
function VisaIcon()  { return <svg width="44" height="20" viewBox="0 0 44 20" fill="none"><rect width="44" height="20" rx="3" fill="#1A1F71"/><text x="22" y="14" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily={FONT} letterSpacing="0.06em">VISA</text></svg>; }

/* ─────────────────────────────────────────────────────────────────────────────
   CONTEXT MENU TRANSACTION
───────────────────────────────────────────────────────────────────────────── */
const TX_MENU_ITEMS = [
  { label:"Voir le détail",           Icon:Eye,       color:PN.ink },
  { label:"Bloquer la transaction",   Icon:Ban,       color:PN.red },
  { label:"Retenter la transaction",  Icon:RefreshCw, color:PN.primary },
];
function TxContextMenu({ rect, onClose }: { rect: DOMRect; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  return createPortal(
    <div ref={ref} style={{
      position:"fixed", top: rect.bottom + 4, right: window.innerWidth - rect.right,
      zIndex:9999, background:"#fff", border:`1px solid ${PN.bord}`,
      borderRadius:PN.r.md, boxShadow:"0 8px 24px rgba(11,26,52,0.12)",
      minWidth:210, overflow:"hidden",
    }}>
      {TX_MENU_ITEMS.map(({ label, Icon, color }) => (
        <button key={label} onClick={onClose} className="pn-filter-opt" style={{
          display:"flex", alignItems:"center", gap:10,
          width:"100%", padding:"10px 14px",
          border:"none", background:"transparent",
          cursor:"pointer", fontSize:13.5, fontFamily:FONT,
          color, textAlign:"left",
        }}>
          <Icon size={14} strokeWidth={2} />
          {label}
        </button>
      ))}
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const PERIODS = ["Mois dernier", "Trimestre", "Semestre", "Année"];

const KPI_DATA: Record<string, { ca:number; tx:number; tauxDeb:number; tauxCred:number; partDeb:number; panier:number; rembTx:number; rembEur:number; pending:number }> = {
  "Mois dernier": { ca:3_650_840, tx:28_220, tauxDeb:95.8, tauxCred:98.8, partDeb:72, panier:129, rembTx:47, rembEur:4_820, pending:3 },
  "Trimestre":    { ca:10_320_400, tx:81_904, tauxDeb:95.4, tauxCred:98.5, partDeb:71, panier:126, rembTx:134, rembEur:13_890, pending:3 },
  "Semestre":     { ca:19_840_000, tx:158_720, tauxDeb:94.9, tauxCred:98.2, partDeb:70, panier:125, rembTx:262, rembEur:27_450, pending:3 },
  "Année":        { ca:38_200_000, tx:303_170, tauxDeb:95.1, tauxCred:98.4, partDeb:71, panier:126, rembTx:501, rembEur:52_100, pending:3 },
};

const DELTAS: Record<string, { ca:string; tx:string; taux:string; panier:string; remb:string; caPos:boolean; txPos:boolean; tauxPos:boolean; panierPos:boolean; rembPos:boolean }> = {
  "Mois dernier": { ca:"+4,8 %",  tx:"+4,0 %",  taux:"+0,1 pt", panier:"+0,8 %",  remb:"-2,1 %",  caPos:true,  txPos:true,  tauxPos:true,  panierPos:true,  rembPos:true },
  "Trimestre":    { ca:"+6,2 %",  tx:"+5,1 %",  taux:"-0,1 pt", panier:"+1,2 %",  remb:"+3,4 %",  caPos:true,  txPos:true,  tauxPos:false, panierPos:true,  rembPos:false },
  "Semestre":     { ca:"+8,4 %",  tx:"+7,2 %",  taux:"+0,3 pt", panier:"-0,4 %",  remb:"-1,8 %",  caPos:true,  txPos:true,  tauxPos:true,  panierPos:false, rembPos:true },
  "Année":        { ca:"+11,2 %", tx:"+9,8 %",  taux:"+0,5 pt", panier:"+2,1 %",  remb:"+5,2 %",  caPos:true,  txPos:true,  tauxPos:true,  panierPos:true,  rembPos:false },
};

const PAYMENT_METHODS = [
  { label:"Carte Bancaire", color:PN.primary,  pct:35, icon:<CBIcon /> },
  { label:"Visa",           color:"#1A1F71",   pct:22, icon:<VisaIcon /> },
  { label:"Mastercard",     color:"#EB001B",   pct:20, icon:<MCIcon /> },
  { label:"Apple Pay",      color:"#1A1A1A",   pct:12, icon:<APIcon /> },
  { label:"PayPal",         color:"#003087",   pct:6,  icon:<PPIcon /> },
  { label:"Alma",           color:"#FF3F5A",   pct:3,  icon:<AlmaIcon /> },
  { label:"Wero",           color:"#5F2D91",   pct:2,  icon:<WeroIcon /> },
];

type TxStatus = "en_attente" | "expiree" | "refusee" | "presentee";
const RECENT_TX = [
  { ordre:"989858", montant:12890,  moyen:"CB",         statut:"en_attente" as TxStatus, date:"31/07 - 11:55", email:"turl@gmail.com" },
  { ordre:"875698", montant:90,     moyen:"Apple Pay",  statut:"expiree"    as TxStatus, date:"31/07 - 09:09", email:"marc.d@gmail.com" },
  { ordre:"125487", montant:190,    moyen:"Mastercard", statut:"refusee"    as TxStatus, date:"30/07 - 09:40", email:"client@boutique.fr" },
  { ordre:"875698", montant:590,    moyen:"PayPal",     statut:"presentee"  as TxStatus, date:"31/07 - 11:09", email:"sophie.m@gmail.com" },
  { ordre:"769856", montant:290,    moyen:"Alma",       statut:"presentee"  as TxStatus, date:"29/07 - 22:05", email:"j.dupont@free.fr" },
];

const TX_STATUS_CFG: Record<TxStatus, { label:string; color:string; Icon: React.ElementType }> = {
  en_attente: { label:"En attente", color:PN.amber, Icon:Clock },
  expiree:    { label:"Expirée",    color:"#6B7280", Icon:MinusCircle },
  refusee:    { label:"Refusée",    color:PN.red,   Icon:XCircle },
  presentee:  { label:"Présentée",  color:PN.blue,  Icon:CheckCircle2 },
};

const PM_ICON: Record<string, React.ReactElement> = {
  "CB": <CBIcon />, "Apple Pay": <APIcon />, "Mastercard": <MCIcon />,
  "Visa": <VisaIcon />, "PayPal": <PPIcon />, "Alma": <AlmaIcon />, "Wero": <WeroIcon />,
};

/* ─────────────────────────────────────────────────────────────────────────────
   TREND CHIP
───────────────────────────────────────────────────────────────────────────── */
function Delta({ value, positive }: { value: string; positive: boolean }) {
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:3, fontSize:11.5, fontWeight:700, color:positive?PN.green:PN.red, fontFamily:FONT }}>
      <Icon size={11} strokeWidth={2.3} />{value}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION TITLE
───────────────────────────────────────────────────────────────────────────── */
function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
      <span style={{ fontSize:15, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{children}</span>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DASHBOARD PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function PayNowDashboard() {
  const [period, setPeriod]     = useState("Mois dernier");
  const [openMenu, setOpenMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const kpi = KPI_DATA[period];
  const delta = DELTAS[period];

  const txReussies = Math.round(kpi.tx * (kpi.tauxDeb / 100));
  const txRefusees = kpi.tx - txReussies - kpi.pending;

  return (
    <PayNowShell activePage="dashboard">
      <div style={{ padding:"44px 44px 60px", background:PN.bg }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:32, gap:16 }}>
          <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>
            Dashboard
          </h1>
          <div style={{ display:"flex", alignItems:"center", background:PN.surf, borderRadius:PN.r.lg, padding:4, gap:2, flexShrink:0 }}>
            {PERIODS.map(p => {
              const active = p === period;
              return (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding:"7px 16px", border:"none", cursor:"pointer",
                  borderRadius:PN.r.md, fontSize:13, fontWeight:active?700:500,
                  background:active?PN.primary:"transparent",
                  color:active?"#fff":PN.ink3,
                  transition:"all 0.15s", whiteSpace:"nowrap", fontFamily:FONT,
                  boxShadow:active?"0 2px 8px rgba(59,126,248,0.28)":"none",
                }}>
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ALERTE EN ATTENTE ── */}
        {kpi.pending > 0 && (
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            background:PN.amberBg, border:`1px solid ${PN.amber}30`,
            borderLeft:`3px solid ${PN.amber}`,
            borderRadius:PN.r.md, padding:"12px 16px",
            marginBottom:24,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <AlertTriangle size={16} style={{ color:PN.amber, flexShrink:0 }} />
              <span style={{ fontSize:13.5, fontWeight:600, color:PN.amberText, fontFamily:FONT }}>
                {kpi.pending} transaction{kpi.pending > 1 ? "s" : ""} en attente d&apos;action
              </span>
              <span style={{ fontSize:12.5, color:PN.amberText, opacity:0.75, fontFamily:FONT }}>
                nécessitent votre validation
              </span>
            </div>
            <Link href="/paynow/transactions" style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, fontWeight:700, color:PN.amberText, textDecoration:"none", whiteSpace:"nowrap", fontFamily:FONT }}>
              Voir les transactions <ArrowRight size={13} />
            </Link>
          </div>
        )}

        {/* ── KPI ROW ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:16, marginBottom:28 }}>
          {/* CA */}
          <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.lg, padding:"20px 22px", boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
            <div style={{ fontSize:11.5, fontWeight:600, color:PN.ink3, fontFamily:FONT, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Volume d&apos;affaires</div>
            <div style={{ fontSize:22, fontWeight:800, color:PN.ink, letterSpacing:"-0.03em", fontFamily:FONT, marginBottom:5 }}>
              {fmt(kpi.ca)} €
            </div>
            <Delta value={delta.ca} positive={delta.caPos} />
          </div>

          {/* NB TX */}
          <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.lg, padding:"20px 22px", boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
            <div style={{ fontSize:11.5, fontWeight:600, color:PN.ink3, fontFamily:FONT, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Transactions</div>
            <div style={{ fontSize:22, fontWeight:800, color:PN.ink, letterSpacing:"-0.03em", fontFamily:FONT, marginBottom:5 }}>
              {fmt(kpi.tx)}
            </div>
            <Delta value={delta.tx} positive={delta.txPos} />
          </div>

          {/* TAUX */}
          <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.lg, padding:"20px 22px", boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
            <div style={{ fontSize:11.5, fontWeight:600, color:PN.ink3, fontFamily:FONT, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Taux d&apos;acceptation</div>
            <div style={{ fontSize:22, fontWeight:800, color:kpi.tauxDeb >= 95 ? PN.green : PN.amber, letterSpacing:"-0.03em", fontFamily:FONT, marginBottom:5 }}>
              {kpi.tauxDeb.toFixed(1)} %
            </div>
            <Delta value={delta.taux} positive={delta.tauxPos} />
          </div>

          {/* PANIER */}
          <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.lg, padding:"20px 22px", boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
            <div style={{ fontSize:11.5, fontWeight:600, color:PN.ink3, fontFamily:FONT, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Panier moyen</div>
            <div style={{ fontSize:22, fontWeight:800, color:PN.ink, letterSpacing:"-0.03em", fontFamily:FONT, marginBottom:5 }}>
              {fmt(kpi.panier)} €
            </div>
            <Delta value={delta.panier} positive={delta.panierPos} />
          </div>

          {/* REMBOURSEMENTS */}
          <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.lg, padding:"20px 22px", boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
            <div style={{ fontSize:11.5, fontWeight:600, color:PN.ink3, fontFamily:FONT, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.05em" }}>Remboursements</div>
            <div style={{ fontSize:22, fontWeight:800, color:PN.ink, letterSpacing:"-0.03em", fontFamily:FONT, marginBottom:5 }}>
              {fmt(kpi.rembTx)}
            </div>
            <Delta value={delta.remb} positive={delta.rembPos} />
          </div>
        </div>

        {/* ── CHARTS ROW ── */}
        <div style={{ display:"grid", gridTemplateColumns:"1.65fr 1fr", gap:20, marginBottom:24 }}>

          {/* Volume chart */}
          <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"28px 28px 20px", boxShadow:"0 2px 12px rgba(11,26,52,0.05)" }}>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:4 }}>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:PN.ink, fontFamily:FONT }}>Volume d&apos;affaires</div>
                <div style={{ fontSize:12.5, color:PN.ink3, fontFamily:FONT, marginTop:2 }}>{period}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:22, fontWeight:800, color:PN.ink, letterSpacing:"-0.03em", fontFamily:FONT }}>{fmt(kpi.ca)} €</div>
                <Delta value={delta.ca} positive={delta.caPos} />
              </div>
            </div>
            <div style={{ marginTop:16 }}>
              <VolumeChart period={period} />
            </div>
          </div>

          {/* Right column: acceptance + status */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

            {/* Taux d'acceptation */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"24px", boxShadow:"0 2px 12px rgba(11,26,52,0.05)", flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700, color:PN.ink, fontFamily:FONT, marginBottom:16 }}>Taux d&apos;acceptation</div>
              <div style={{ display:"flex", alignItems:"center", gap:20 }}>
                <AcceptanceGauge
                  pctDeb={kpi.partDeb}
                  pctCred={100 - kpi.partDeb}
                  tauxGlobal={parseFloat((kpi.partDeb/100 * kpi.tauxDeb + (100-kpi.partDeb)/100 * kpi.tauxCred).toFixed(1))}
                />
                <div style={{ flex:1 }}>
                  {[
                    { label:"Débit",  pct:kpi.partDeb,           color:PN.primary },
                    { label:"Crédit", pct:100 - kpi.partDeb,     color:PN.amber },
                  ].map(row => (
                    <div key={row.label} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:12, color:PN.ink2, fontFamily:FONT }}>{row.label}</span>
                        <span style={{ fontSize:12, fontWeight:700, color:row.color, fontFamily:FONT }}>{row.pct} %</span>
                      </div>
                      <div style={{ height:5, background:PN.surf, borderRadius:3 }}>
                        <div style={{ height:5, background:row.color, width:`${row.pct}%`, borderRadius:3, transition:"width 0.4s ease" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Répartition par statut */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"24px", boxShadow:"0 2px 12px rgba(11,26,52,0.05)" }}>
              <div style={{ fontSize:15, fontWeight:700, color:PN.ink, fontFamily:FONT, marginBottom:16 }}>Statuts des transactions</div>
              {[
                { label:"Réussies",      n:txReussies, color:PN.green,    bg:PN.greenBg },
                { label:"Refusées",      n:txRefusees, color:PN.red,      bg:PN.redBg },
                { label:"En attente",    n:kpi.pending,color:PN.amber,    bg:PN.amberBg },
                { label:"Remboursées",   n:kpi.rembTx, color:PN.blue,     bg:PN.blueBg },
              ].map(row => (
                <div key={row.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 12px", background:row.bg, borderRadius:PN.r.md, marginBottom:8 }}>
                  <span style={{ fontSize:13, color:row.color, fontWeight:600, fontFamily:FONT }}>{row.label}</span>
                  <span style={{ fontSize:13.5, fontWeight:800, color:row.color, fontFamily:FONT }}>{fmt(row.n)}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── RECENT TRANSACTIONS ── */}
        <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, boxShadow:"0 2px 12px rgba(11,26,52,0.05)", marginBottom:24, overflow:"hidden" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 0" }}>
            <span style={{ fontSize:15, fontWeight:700, color:PN.ink, fontFamily:FONT }}>Transactions récentes</span>
            <Link href="/paynow/transactions" style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, fontWeight:600, color:PN.primary, textDecoration:"none", fontFamily:FONT }}>
              Voir toutes les transactions <ArrowRight size={13} />
            </Link>
          </div>
          <div style={{ overflowX:"auto", marginTop:16 }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:700 }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${PN.bord}` }}>
                  {["N° COMMANDE","MONTANT","MOYEN DE PAIEMENT","STATUT","DATE","CLIENT"].map(h => (
                    <th key={h} style={{ padding:"10px 24px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, background:PN.surf, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                  <th style={{ padding:"10px 16px", textAlign:"center", fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, background:PN.surf, whiteSpace:"nowrap", position:"sticky", right:0, boxShadow:"-4px 0 8px rgba(11,26,52,0.04)" }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_TX.map((tx, i) => {
                  const s = TX_STATUS_CFG[tx.statut];
                  return (
                    <tr key={i} className="pn-tr" style={{ borderBottom:i<RECENT_TX.length-1?`1px solid ${PN.bord}`:"none" }}>
                      <td style={{ padding:"14px 24px" }}>
                        <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:PN.ink }}>{tx.ordre}</span>
                      </td>
                      <td style={{ padding:"14px 24px" }}>
                        <span style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, whiteSpace:"nowrap" }}>
                          {tx.montant.toLocaleString("fr-FR",{minimumFractionDigits:2})} EUR
                        </span>
                      </td>
                      <td style={{ padding:"14px 24px" }}>
                        {PM_ICON[tx.moyen] ?? <span style={{ fontFamily:FONT, fontSize:13, color:PN.ink2 }}>{tx.moyen}</span>}
                      </td>
                      <td style={{ padding:"14px 24px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12.5, fontWeight:600, color:s.color, fontFamily:FONT }}>
                          <s.Icon size={13} strokeWidth={2.3} />
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding:"14px 24px" }}>
                        <span style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT, whiteSpace:"nowrap" }}>{tx.date}</span>
                      </td>
                      <td style={{ padding:"14px 24px" }}>
                        <span style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>{tx.email}</span>
                      </td>
                      <td style={{ padding:"10px 16px", textAlign:"center", position:"sticky", right:0, background:"#fff", boxShadow:"-4px 0 8px rgba(11,26,52,0.04)" }}>
                        <button
                          onClick={(e) => {
                            const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setOpenMenu(openMenu?.id === tx.ordre + i ? null : { id: tx.ordre + i, rect: r });
                          }}
                          style={{ border:"none", background:"none", cursor:"pointer", padding:"5px 7px", borderRadius:PN.r.sm, color:PN.ink3, display:"flex" }}
                          className="pn-filter-opt"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {openMenu?.id === tx.ordre + i && <TxContextMenu rect={openMenu.rect} onClose={() => setOpenMenu(null)} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── RÉPARTITION MOYENS DE PAIEMENT ── */}
        <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"28px", boxShadow:"0 2px 12px rgba(11,26,52,0.05)" }}>
          <SectionTitle>Répartition des moyens de paiement</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"10px 48px" }}>
            {PAYMENT_METHODS.map(m => {
              const tx = Math.round(kpi.tx * m.pct / 100);
              return (
                <div key={m.label}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                      {m.icon}
                      <span style={{ fontSize:13, fontWeight:600, color:PN.ink, fontFamily:FONT }}>{m.label}</span>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{m.pct} %</span>
                      <span style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginLeft:6 }}>{fmt(tx)} tx</span>
                    </div>
                  </div>
                  <div style={{ height:6, background:PN.surf, borderRadius:3 }}>
                    <div style={{ height:6, background:m.color, width:`${m.pct}%`, borderRadius:3, opacity:0.85, transition:"width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </PayNowShell>
  );
}
