"use client";
import { useState, useRef, useEffect, type CSSProperties, type ElementType } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown, Plus, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, RefreshCw, Columns2,
  CheckCircle2, Clock, XCircle, Info, Check,
  ArrowUpDown, X, Eye, Ban,
} from "lucide-react";
import { PayNowShell, PN, FONT } from "../_shell";
import { TransactionDetailDrawer, ConfirmDialog } from "../_drawers";
import type { TransactionDetailData } from "../_drawers";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
type Statut = "en_attente" | "expiree" | "refusee" | "presentee";
type Auth   = "reussie" | "tentative" | "echec" | "autorisee";
type Moyen  = "CB" | "Apple Pay" | "Mastercard" | "PayPal" | "Alma" | "Wero";

interface Transaction {
  id: number; ordre: string; montant: number;
  date: string; time: string;
  statut: Statut; moyen: Moyen; auth: Auth;
  uuid: string; email: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────────────────── */
const DATA: Transaction[] = [
  { id:1, ordre:"989858",  montant:12890.00, date:"31/07/26", time:"11:55", statut:"en_attente", moyen:"CB",         auth:"reussie",   uuid:"9B4u3iL8xY2", email:"turl@gmail.com" },
  { id:2, ordre:"875698",  montant:90.00,    date:"31/07/26", time:"09:09", statut:"expiree",    moyen:"Apple Pay",  auth:"tentative", uuid:"7Kp9mQr4sN1", email:"marc.d@gmail.com" },
  { id:3, ordre:"125487",  montant:190.00,   date:"30/07/26", time:"09:40", statut:"refusee",    moyen:"Mastercard", auth:"echec",     uuid:"3Fv8wXt6jL5", email:"client@boutique.fr" },
  { id:4, ordre:"875698",  montant:590.00,   date:"31/07/26", time:"11:09", statut:"presentee",  moyen:"PayPal",     auth:"autorisee", uuid:"1Yz2aKb5cM8", email:"sophie.m@gmail.com" },
  { id:5, ordre:"769856",  montant:290.00,   date:"29/06/26", time:"22:05", statut:"presentee",  moyen:"Alma",       auth:"reussie",   uuid:"6Dn4rWe7pQ3", email:"j.dupont@free.fr" },
  { id:6, ordre:"859656",  montant:90.00,    date:"30/07/26", time:"19:03", statut:"presentee",  moyen:"Wero",       auth:"reussie",   uuid:"8Hg5tYu9vR0", email:"a.martin@orange.fr" },
  { id:7, ordre:"74087",   montant:190.00,   date:"31/07/26", time:"13:50", statut:"presentee",  moyen:"CB",         auth:"reussie",   uuid:"2Cq7iNm3kB6", email:"turl@gmail.com" },
];

const PER_PAGE = 10;

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function fmtMontant(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function toMs(r: Transaction) {
  const [d, m, y] = r.date.split("/");
  return new Date(`20${y}-${m}-${d}T${r.time}`).getTime();
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT METHOD ICONS
───────────────────────────────────────────────────────────────────────────── */
function CBIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
      <rect width="38" height="24" rx="4" fill="#1434CB" />
      <text x="19" y="16.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily={FONT} letterSpacing="0.06em">CB</text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
      <rect width="38" height="24" rx="4" fill="#F5F5F5" />
      <circle cx="14" cy="12" r="8" fill="#EB001B" />
      <circle cx="24" cy="12" r="8" fill="#F79E1B" />
      <path d="M19 5.52A8 8 0 0 1 24 12a8 8 0 0 1-5 6.48A8 8 0 0 1 14 12a8 8 0 0 1 5-6.48Z" fill="#FF5F00" />
    </svg>
  );
}
function ApplePayIcon() {
  return (
    <svg width="56" height="24" viewBox="0 0 56 24" fill="none">
      <rect width="56" height="24" rx="4" fill="#000" />
      <text x="28" y="16" textAnchor="middle" fontSize="9" fontWeight="500" fill="#fff" fontFamily="-apple-system, sans-serif" letterSpacing="0.02em">Apple Pay</text>
    </svg>
  );
}
function PayPalIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
      <rect width="38" height="24" rx="4" fill="#003087" />
      <text x="19" y="17" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff" fontFamily="Georgia, serif" fontStyle="italic">P</text>
    </svg>
  );
}
function AlmaIcon() {
  return (
    <svg width="52" height="24" viewBox="0 0 52 24" fill="none">
      <rect width="52" height="24" rx="4" fill="#fff" stroke={PN.bord} strokeWidth="1" />
      <text x="26" y="16" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FF3F5A" fontFamily="'Manrope', sans-serif" letterSpacing="-0.04em">alma</text>
    </svg>
  );
}
function WeroIcon() {
  return (
    <svg width="52" height="24" viewBox="0 0 52 24" fill="none">
      <rect width="52" height="24" rx="4" fill="#5F2D91" />
      <text x="26" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="'Manrope', sans-serif" letterSpacing="0.06em">WERO</text>
    </svg>
  );
}
function PMIcon({ moyen }: { moyen: Moyen }) {
  if (moyen === "CB")        return <CBIcon />;
  if (moyen === "Apple Pay") return <ApplePayIcon />;
  if (moyen === "Mastercard")return <MastercardIcon />;
  if (moyen === "PayPal")    return <PayPalIcon />;
  if (moyen === "Alma")      return <AlmaIcon />;
  return <WeroIcon />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATUT BADGE
───────────────────────────────────────────────────────────────────────────── */
const STATUT_MAP: Record<Statut, { label: string; bg: string; text: string; dot: string }> = {
  en_attente: { label: "En attente de remise", bg: PN.amberBg,  text: PN.amberText, dot: PN.amber },
  expiree:    { label: "Expirée",               bg: "#F3F4F6",   text: "#4B5563",     dot: "#9CA3AF" },
  refusee:    { label: "Refusée",               bg: PN.redBg,    text: PN.redText,    dot: PN.red },
  presentee:  { label: "Présentée",             bg: PN.blueBg,   text: PN.blueText,   dot: PN.blue },
};

function StatutBadge({ statut }: { statut: Statut }) {
  const c = STATUT_MAP[statut];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:c.bg, color:c.text, borderRadius:PN.r.full,
      padding:"3px 10px 3px 7px", fontSize:12, fontWeight:600, fontFamily:FONT, whiteSpace:"nowrap",
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {c.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUTH BADGE
───────────────────────────────────────────────────────────────────────────── */
const AUTH_MAP: Record<Auth, { label: string; color: string; Icon: ElementType }> = {
  reussie:   { label:"Réussie",   color:PN.green, Icon:CheckCircle2 },
  tentative: { label:"Tentative", color:PN.amber, Icon:Clock },
  echec:     { label:"Échec",     color:PN.red,   Icon:XCircle },
  autorisee: { label:"Autorisée", color:PN.blue,  Icon:Info },
};

function AuthBadge({ auth }: { auth: Auth }) {
  const c = AUTH_MAP[auth];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, color:c.color, fontSize:12.5, fontWeight:600, fontFamily:FONT }}>
      <c.Icon size={13} strokeWidth={2.3} />
      {c.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTEXT MENU TRANSACTION
───────────────────────────────────────────────────────────────────────────── */
const TX_MENU_ITEMS = [
  { label:"Voir le détail",           Icon:Eye,       color:PN.ink },
  { label:"Bloquer la transaction",   Icon:Ban,       color:PN.red },
  { label:"Retenter la transaction",  Icon:RefreshCw, color:PN.primary },
];
function TxContextMenu({ rect, onClose, onItemClick }: { rect: DOMRect; onClose: () => void; onItemClick?: (label: string) => void }) {
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
        <button key={label} onClick={() => { onItemClick?.(label); onClose(); }} className="pn-filter-opt" style={{
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
   SEP
───────────────────────────────────────────────────────────────────────────── */
function Sep() {
  return <div style={{ width:1, height:22, background:PN.bord, flexShrink:0 }} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MINI CALENDAR
───────────────────────────────────────────────────────────────────────────── */
const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MONTHS_SHORT = ["jan.","fév.","mars","avr.","mai","juin","juil.","août","sep.","oct.","nov.","déc."];
const DAYS_HDR = ["L","M","M","J","V","S","D"];

function MiniCalendar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today   = new Date();
  const [vy, setVy] = useState(today.getFullYear());
  const [vm, setVm] = useState(today.getMonth());

  const prevMonth = () => { if (vm === 0) { setVm(11); setVy(y => y - 1); } else setVm(m => m - 1); };
  const nextMonth = () => { if (vm === 11) { setVm(0); setVy(y => y + 1); } else setVm(m => m + 1); };

  const offset       = (new Date(vy, vm, 1).getDay() + 6) % 7;
  const daysInMonth  = new Date(vy, vm + 1, 0).getDate();
  const todayStr     = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  return (
    <div style={{ width:196 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <button onClick={prevMonth} style={{ border:"none", background:"none", cursor:"pointer", padding:"3px 5px", color:PN.ink2, display:"flex", borderRadius:PN.r.xs }}>
          <ChevronLeft size={13} />
        </button>
        <span style={{ fontSize:12.5, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{MONTHS_FR[vm]} {vy}</span>
        <button onClick={nextMonth} style={{ border:"none", background:"none", cursor:"pointer", padding:"3px 5px", color:PN.ink2, display:"flex", borderRadius:PN.r.xs }}>
          <ChevronRight size={13} />
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,28px)", marginBottom:2 }}>
        {DAYS_HDR.map((d, i) => (
          <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:PN.ink3, fontFamily:FONT, lineHeight:"22px" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,28px)", gap:1 }}>
        {Array.from({ length: offset }, (_, i) => <div key={`e${i}`} style={{ width:28, height:28 }} />)}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day     = i + 1;
          const dateStr = `${vy}-${String(vm+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isSel   = value === dateStr;
          const isToday = dateStr === todayStr;
          return (
            <button key={day} onClick={() => onChange(dateStr)} style={{
              width:28, height:28, border:"none", cursor:"pointer",
              borderRadius:PN.r.xs,
              background: isSel ? PN.primary : "transparent",
              color: isSel ? "#fff" : isToday ? PN.primary : PN.ink,
              fontSize:12, fontFamily:FONT, fontWeight: isSel || isToday ? 700 : 400,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FILTER DROPDOWN — self-contained open state + click-outside
───────────────────────────────────────────────────────────────────────────── */
interface FDProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  onClear: () => void;
  dotColors?: Record<string, string>;
}
function FilterDropdown({ label, options, value, onSelect, onClear, dotColors }: FDProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const active = !!value;
  return (
    <div ref={ref} style={{ position:"relative", alignSelf:"stretch", display:"flex", alignItems:"center" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"0 14px", height:"100%",
          border:"none",
          background: open ? PN.surf : active ? PN.primaryBg : "transparent",
          cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
          color: active ? PN.primary : PN.ink2,
          fontSize:13.5, fontWeight: active ? 700 : 500, fontFamily:FONT,
          transition:"background 0.12s",
        }}
      >
        <span>{active ? value : label}</span>
        {active
          ? <span
              onMouseDown={e => { e.stopPropagation(); onClear(); setOpen(false); }}
              style={{ marginLeft:2, lineHeight:1, cursor:"pointer", opacity:0.7, fontSize:15 }}>×</span>
          : <ChevronDown size={13} style={{ color:PN.ink3, flexShrink:0 }} />
        }
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0,
          background:"#fff", border:`1px solid ${PN.bord}`,
          borderRadius:PN.r.md,
          boxShadow:"0 8px 32px rgba(11,26,52,0.10)",
          zIndex:200, minWidth:200, overflow:"hidden",
        }}>
          {options.map(opt => (
            <button
              key={opt}
              className="pn-filter-opt"
              onClick={() => { onSelect(opt); setOpen(false); }}
              style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                width:"100%", padding:"10px 14px",
                border:"none", background: opt === value ? PN.primaryBg : "transparent",
                cursor:"pointer", fontSize:13.5, fontFamily:FONT,
                color: opt === value ? PN.primary : PN.ink,
                fontWeight: opt === value ? 600 : 400, textAlign:"left",
              }}
            >
              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                {dotColors?.[opt] && (
                  <span style={{ width:7, height:7, borderRadius:"50%", background:dotColors[opt], flexShrink:0 }} />
                )}
                {opt}
              </span>
              {opt === value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATE FILTER DROPDOWN — presets à gauche, calendrier à droite
───────────────────────────────────────────────────────────────────────────── */
const DATE_PRESETS = ["Aujourd'hui","Hier","7 derniers jours","30 derniers jours","Ce mois-ci"];

function DateFilterDropdown({ value, onSelect, onClear }: { value: string; onSelect: (v: string) => void; onClear: () => void }) {
  const [open,       setOpen]       = useState(false);
  const [customDate, setCustomDate] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const active = !!value;

  function applyCustom() {
    if (!customDate) return;
    const [y, m, d] = customDate.split("-");
    onSelect(`${parseInt(d)} ${MONTHS_SHORT[parseInt(m)-1]} ${y}`);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position:"relative", alignSelf:"stretch", display:"flex", alignItems:"center" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display:"flex", alignItems:"center", gap:6,
        padding:"0 14px", height:"100%",
        border:"none",
        background: open ? PN.surf : active ? PN.primaryBg : "transparent",
        cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
        color: active ? PN.primary : PN.ink2,
        fontSize:13.5, fontWeight: active ? 700 : 500, fontFamily:FONT,
        transition:"background 0.12s",
      }}>
        <span>{active ? value : "Date d'opération"}</span>
        {active
          ? <span onMouseDown={e => { e.stopPropagation(); onClear(); setOpen(false); }} style={{ marginLeft:2, lineHeight:1, cursor:"pointer", opacity:0.7, fontSize:15 }}>×</span>
          : <ChevronDown size={13} style={{ color:PN.ink3, flexShrink:0 }} />
        }
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0,
          background:"#fff", border:`1px solid ${PN.bord}`,
          borderRadius:PN.r.md,
          boxShadow:"0 8px 32px rgba(11,26,52,0.10)",
          zIndex:200, display:"flex", overflow:"hidden",
        }}>
          {/* Presets */}
          <div style={{ minWidth:185, borderRight:`1px solid ${PN.bord}` }}>
            {DATE_PRESETS.map(opt => (
              <button key={opt} className="pn-filter-opt"
                onClick={() => { onSelect(opt); setOpen(false); }}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", padding:"10px 14px",
                  border:"none", background: opt === value ? PN.primaryBg : "transparent",
                  cursor:"pointer", fontSize:13.5, fontFamily:FONT,
                  color: opt === value ? PN.primary : PN.ink,
                  fontWeight: opt === value ? 600 : 400, textAlign:"left",
                }}>
                {opt}
                {opt === value && <Check size={13} />}
              </button>
            ))}
          </div>

          {/* Calendrier */}
          <div style={{ padding:"14px 14px 12px" }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, marginBottom:10 }}>
              Date spécifique
            </div>
            <MiniCalendar value={customDate} onChange={setCustomDate} />
            <button onClick={applyCustom} style={{
              marginTop:10, width:"100%",
              padding:"8px 0", border:"none",
              borderRadius:PN.r.md,
              background: customDate ? PN.primary : PN.surf,
              color: customDate ? "#fff" : PN.ink3,
              fontSize:13, fontWeight:700, fontFamily:FONT,
              cursor: customDate ? "pointer" : "default",
              transition:"background 0.15s, color 0.15s",
            }}>
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   AUTRES FILTRES DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
function AutresFiltres({ uuidVal, setUuidVal, refVal, setRefVal, montantMin, setMontantMin, montantMax, setMontantMax }: {
  uuidVal: string; setUuidVal: (v: string) => void;
  refVal: string; setRefVal: (v: string) => void;
  montantMin: string; setMontantMin: (v: string) => void;
  montantMax: string; setMontantMax: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasFilter = !!(uuidVal || refVal || montantMin || montantMax);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const inputStyle: CSSProperties = {
    border:`1px solid ${PN.bord}`, borderRadius:PN.r.md,
    padding:"7px 10px", fontSize:13, fontFamily:FONT, color:PN.ink,
    background:"#fff", width:"100%", boxSizing:"border-box",
    outline:"none",
  };

  return (
    <div ref={ref} style={{ position:"relative", alignSelf:"stretch", display:"flex", alignItems:"center" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display:"flex", alignItems:"center", gap:6,
          padding:"0 14px", height:"100%",
          border:"none",
          background: open ? PN.surf : hasFilter ? PN.primaryBg : "transparent",
          cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
          color: hasFilter ? PN.primary : PN.ink2,
          fontSize:13.5, fontWeight: hasFilter ? 700 : 500, fontFamily:FONT,
        }}
      >
        <Plus size={14} />
        Autres filtres
        {hasFilter && (
          <span style={{
            background:PN.primary, color:"#fff", borderRadius:PN.r.full,
            fontSize:10, fontWeight:700, padding:"1px 6px", minWidth:16, textAlign:"center",
          }}>
            {[uuidVal, refVal, montantMin, montantMax].filter(Boolean).length}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position:"absolute", top:"calc(100% + 6px)", left:0,
          background:"#fff", border:`1px solid ${PN.bord}`,
          borderRadius:PN.r.md,
          boxShadow:"0 8px 32px rgba(11,26,52,0.12)",
          zIndex:200, width:320, padding:20,
        }}>
          <div style={{ fontSize:12, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, marginBottom:16 }}>
            Filtres avancés
          </div>

          {/* UUID */}
          <label style={{ display:"block", marginBottom:12 }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:PN.ink2, fontFamily:FONT, display:"block", marginBottom:5 }}>UUID transaction</span>
            <input type="text" value={uuidVal} onChange={e => setUuidVal(e.target.value)} placeholder="9B4u3iL..." style={inputStyle} />
          </label>

          {/* Référence acheteur */}
          <label style={{ display:"block", marginBottom:12 }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:PN.ink2, fontFamily:FONT, display:"block", marginBottom:5 }}>Référence acheteur</span>
            <input type="text" value={refVal} onChange={e => setRefVal(e.target.value)} placeholder="REF-..." style={inputStyle} />
          </label>

          {/* Montant range */}
          <label style={{ display:"block", marginBottom:16 }}>
            <span style={{ fontSize:12.5, fontWeight:600, color:PN.ink2, fontFamily:FONT, display:"block", marginBottom:5 }}>Montant (EUR)</span>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <input type="number" value={montantMin} onChange={e => setMontantMin(e.target.value)} placeholder="Min" style={{ ...inputStyle, flex:1 }} />
              <span style={{ color:PN.ink3, fontSize:13 }}>à</span>
              <input type="number" value={montantMax} onChange={e => setMontantMax(e.target.value)} placeholder="Max" style={{ ...inputStyle, flex:1 }} />
            </div>
          </label>

          {/* Actions */}
          <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
            <button
              onClick={() => { setUuidVal(""); setRefVal(""); setMontantMin(""); setMontantMax(""); }}
              style={{ padding:"7px 14px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:"pointer", fontSize:13, fontFamily:FONT, color:PN.ink2 }}
            >
              Réinitialiser
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{ padding:"7px 14px", border:"none", borderRadius:PN.r.md, background:PN.primary, cursor:"pointer", fontSize:13, fontFamily:FONT, color:"#fff", fontWeight:600 }}
            >
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TABS CONFIG
───────────────────────────────────────────────────────────────────────────── */
const TABS = [
  { id:"toutes",        label:"Toutes les transactions" },
  { id:"paiements",     label:"Paiements" },
  { id:"remboursements",label:"Remboursements" },
  { id:"verifications", label:"Vérifications" },
  { id:"remises",       label:"Remises" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function TransactionsPage() {
  const [activeTab,      setActiveTab]      = useState("toutes");
  const [search,         setSearch]         = useState("");
  const [enAttente,      setEnAttente]      = useState(false);
  const [sortDir,        setSortDir]        = useState<"desc"|"asc">("desc");
  const [page,           setPage]           = useState(1);
  const [openMenu,   setOpenMenu]   = useState<{ id: number; rect: DOMRect } | null>(null);
  const [detailTxId, setDetailTxId] = useState<number | null>(null);
  const [blockTxId,  setBlockTxId]  = useState<number | null>(null);
  const [retryTxId,  setRetryTxId]  = useState<number | null>(null);

  /* ── filter state ── */
  const [dateVal,    setDateVal]    = useState("");
  const [typeVal,    setTypeVal]    = useState("");
  const [statutVal,  setStatutVal]  = useState("");
  const [moyenVal,   setMoyenVal]   = useState("");
  const [uuidVal,    setUuidVal]    = useState("");
  const [refVal,     setRefVal]     = useState("");
  const [montantMin, setMontantMin] = useState("");
  const [montantMax, setMontantMax] = useState("");

  /* ── filter logic ── */
  const STATUT_FILTER_MAP: Record<string, Statut> = {
    "En attente de remise": "en_attente",
    "Expirée": "expiree",
    "Refusée": "refusee",
    "Présentée": "presentee",
  };
  const TAB_AUTH_MAP: Record<string, Auth> = {
    paiements: "reussie", remboursements: "tentative", verifications: "autorisee",
  };

  let rows = DATA.filter(t => {
    if (activeTab !== "toutes") {
      if (activeTab === "paiements"      && t.auth !== "reussie")   return false;
      if (activeTab === "remboursements" && t.auth !== "echec")     return false;
      if (activeTab === "verifications"  && t.auth !== "autorisee") return false;
    }
    if (enAttente && t.statut !== "en_attente") return false;
    if (search && !t.ordre.includes(search) && !t.email.toLowerCase().includes(search.toLowerCase()) && !t.uuid.toLowerCase().includes(search.toLowerCase())) return false;
    if (statutVal && t.statut !== STATUT_FILTER_MAP[statutVal]) return false;
    if (moyenVal && t.moyen !== moyenVal) return false;
    if (uuidVal && !t.uuid.toLowerCase().includes(uuidVal.toLowerCase())) return false;
    if (refVal && !t.email.toLowerCase().includes(refVal.toLowerCase())) return false;
    if (montantMin && t.montant < parseFloat(montantMin)) return false;
    if (montantMax && t.montant > parseFloat(montantMax)) return false;
    return true;
  });

  rows = [...rows].sort((a, b) => sortDir === "desc" ? toMs(b) - toMs(a) : toMs(a) - toMs(b));

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const pageRows   = rows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleTab(id: string) { setActiveTab(id); setPage(1); }

  /* ─── Column headers ─── */
  const COLS = [
    { label:"N° DE COMMANDE",     w:140 },
    { label:"MONTANT",             w:130 },
    { label:"DATE",                w:140, sort:true },
    { label:"STATUT",              w:190 },
    { label:"MOYEN DE PAIEMENT",   w:160 },
    { label:"AUTORISATION",        w:120 },
    { label:"UUID",                w:150 },
    { label:"E-MAIL ACHETEUR",     w:180 },
    { label:"ACTIONS",             w:64 },
  ];

  return (
    <>
    <PayNowShell activePage="transactions">
      <div style={{ padding:"44px 44px 60px", background:PN.bg }}>

        {/* ── HEADER ── */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, gap:16 }}>
          <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>
            Transactions
          </h1>
          <button style={{
            display:"flex", alignItems:"center", gap:7,
            background:PN.primary, color:"#fff",
            border:"none", borderRadius:PN.r.md, padding:"10px 20px",
            fontSize:13.5, fontWeight:700, fontFamily:FONT,
            cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
            boxShadow:"0 2px 10px rgba(59,126,248,0.32)",
          }}>
            <Plus size={15} strokeWidth={2.5} />
            Créer un paiement MOTO
          </button>
        </div>

        {/* ── TABS ── */}
        <div style={{ display:"flex", borderBottom:`1px solid ${PN.bord}`, marginBottom:24 }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              style={{
                padding:"12px 20px",
                border:"none", background:"none",
                fontSize:13.5, fontFamily:FONT, cursor:"pointer",
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? PN.primary : PN.ink2,
                borderBottom: activeTab === tab.id ? `2px solid ${PN.primary}` : "2px solid transparent",
                marginBottom:-1, whiteSpace:"nowrap",
                transition:"color 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
          <button style={{
            padding:"12px 18px", border:"none", background:"none",
            fontSize:16, color:PN.ink3, cursor:"pointer",
            borderBottom:"2px solid transparent", marginBottom:-1,
          }}>+</button>
        </div>

        {/* ── FILTER BAR ── */}
        <div style={{
          display:"flex", alignItems:"center",
          height:50, background:"#fff",
          border:`1px solid ${PN.bord}`, borderRadius:PN.r.md,
          marginBottom:20, overflow:"visible", flexShrink:0,
        }}>
          <DateFilterDropdown value={dateVal} onSelect={v => { setDateVal(v); setPage(1); }} onClear={() => setDateVal("")} />
          <Sep />
          <FilterDropdown label="Type d'opération" options={["Paiement","Remboursement","Vérification","Paiement récurrent"]} value={typeVal} onSelect={v => { setTypeVal(v); setPage(1); }} onClear={() => setTypeVal("")} />
          <Sep />
          <FilterDropdown
            label="Statut"
            options={["En attente de remise","Présentée","Expirée","Refusée"]}
            value={statutVal}
            onSelect={v => { setStatutVal(v); setPage(1); }}
            onClear={() => setStatutVal("")}
            dotColors={{
              "En attente de remise": PN.amber,
              "Présentée":            PN.blue,
              "Expirée":              "#9CA3AF",
              "Refusée":              PN.red,
            }}
          />
          <Sep />
          <FilterDropdown label="Moyen de paiement" options={["CB","Mastercard","Visa","Apple Pay","PayPal","Alma","Wero"]} value={moyenVal} onSelect={v => { setMoyenVal(v); setPage(1); }} onClear={() => setMoyenVal("")} />
          <Sep />
          <AutresFiltres
            uuidVal={uuidVal} setUuidVal={setUuidVal}
            refVal={refVal} setRefVal={setRefVal}
            montantMin={montantMin} setMontantMin={setMontantMin}
            montantMax={montantMax} setMontantMax={setMontantMax}
          />
          <Sep />
          {/* En attente d'action */}
          <button
            onClick={() => { setEnAttente(v => !v); setPage(1); }}
            style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"0 14px", height:"100%",
              border:"none",
              background: enAttente ? PN.amberBg : "transparent",
              cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
              color: enAttente ? PN.amberText : PN.ink2,
              fontSize:13.5, fontWeight: enAttente ? 700 : 500, fontFamily:FONT,
              transition:"all 0.15s",
            }}
          >
            {enAttente && <Check size={13} strokeWidth={2.5} />}
            En attente d&apos;action
          </button>
          <Sep />
          {/* Search */}
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, padding:"0 14px", minWidth:0 }}>
            <Search size={14} style={{ color:PN.ink3, flexShrink:0 }} />
            <input
              type="text" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher une référence..."
              style={{
                border:"none", background:"none", flex:1,
                fontSize:13.5, fontFamily:FONT, color:PN.ink, outline:"none", minWidth:0,
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:2, color:PN.ink3, display:"flex" }}>
                <X size={13} />
              </button>
            )}
          </div>
          <Sep />
          {/* Tool buttons */}
          <button className="pn-tool-btn" style={{ display:"flex", alignItems:"center", padding:"0 12px", height:"100%", border:"none", background:"transparent", cursor:"pointer", color:PN.ink2, flexShrink:0 }}>
            <RefreshCw size={15} strokeWidth={2} />
            <span className="pn-tool-label">Rafraîchir</span>
          </button>
          <button className="pn-tool-btn" style={{ display:"flex", alignItems:"center", padding:"0 12px", height:"100%", border:"none", background:"transparent", cursor:"pointer", color:PN.ink2, borderRadius:`0 ${PN.r.md}px ${PN.r.md}px 0`, flexShrink:0 }}>
            <Columns2 size={15} strokeWidth={2} />
            <span className="pn-tool-label">Colonnes</span>
          </button>
        </div>

        {/* ── TABLE ── */}
        <div style={{
          background:"#fff", border:`1px solid ${PN.bord}`,
          borderRadius:PN.r.xl, overflow:"hidden",
          boxShadow:"0 2px 12px rgba(11,26,52,0.05)",
        }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:1120 }}>
              <thead>
                <tr style={{ background:PN.surf, borderBottom:`1px solid ${PN.bord}` }}>
                  {COLS.map(col => (
                    <th
                      key={col.label}
                      onClick={col.sort ? () => setSortDir(d => d === "desc" ? "asc" : "desc") : undefined}
                      style={{
                        padding:"12px 16px", textAlign: col.label === "ACTIONS" ? "center" : "left",
                        fontSize:10.5, fontWeight:700, color:PN.ink3,
                        letterSpacing:"0.07em", textTransform:"uppercase",
                        whiteSpace:"nowrap", fontFamily:FONT, width:col.w,
                        cursor: col.sort ? "pointer" : "default",
                        userSelect:"none", background:PN.surf,
                        ...(col.label === "ACTIONS" ? { position:"sticky", right:0, boxShadow:"-4px 0 8px rgba(11,26,52,0.04)" } : {}),
                      }}
                    >
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                        {col.label}
                        {col.sort && (
                          <ArrowUpDown size={11} strokeWidth={2} style={{ opacity:0.55, color: sortDir === "desc" ? PN.primary : PN.ink3 }} />
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0
                  ? (
                    <tr>
                      <td colSpan={9} style={{ padding:"52px 24px", textAlign:"center", color:PN.ink3, fontFamily:FONT, fontSize:14 }}>
                        Aucune transaction trouvée
                      </td>
                    </tr>
                  )
                  : pageRows.map((row, i) => (
                    <tr
                      key={row.id}
                      className="pn-tr"
                      style={{ borderBottom: i < pageRows.length - 1 ? `1px solid ${PN.bord}` : "none", cursor:"pointer" }}
                      onClick={() => setDetailTxId(row.id)}
                    >
                      {/* N° commande */}
                      <td style={{ padding:"15px 16px" }}>
                        <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:PN.ink, letterSpacing:"0.03em" }}>
                          {row.ordre}
                        </span>
                      </td>

                      {/* Montant */}
                      <td style={{ padding:"15px 16px" }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, whiteSpace:"nowrap" }}>
                          {fmtMontant(row.montant)}
                        </div>
                        <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginTop:1 }}>EUR</div>
                      </td>

                      {/* Date */}
                      <td style={{ padding:"15px 16px", whiteSpace:"nowrap" }}>
                        <div style={{ fontSize:13, fontWeight:600, color:PN.ink, fontFamily:FONT }}>{row.date}</div>
                        <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginTop:1 }}>{row.time}</div>
                      </td>

                      {/* Statut */}
                      <td style={{ padding:"15px 16px" }}>
                        <StatutBadge statut={row.statut} />
                      </td>

                      {/* Moyen de paiement */}
                      <td style={{ padding:"15px 16px" }}>
                        <PMIcon moyen={row.moyen} />
                      </td>

                      {/* Autorisation */}
                      <td style={{ padding:"15px 16px" }}>
                        <AuthBadge auth={row.auth} />
                      </td>

                      {/* UUID */}
                      <td style={{ padding:"15px 16px" }}>
                        <span style={{ fontFamily:"monospace", fontSize:12, color:PN.ink2 }}>
                          {row.uuid}…
                        </span>
                      </td>

                      {/* Email */}
                      <td style={{ padding:"15px 16px" }}>
                        <span style={{ fontSize:13, color:PN.ink2, fontFamily:FONT }}>{row.email}</span>
                      </td>

                      {/* Actions — sticky */}
                      <td style={{ padding:"10px 16px", textAlign:"center", position:"sticky", right:0, background:"#fff", boxShadow:"-4px 0 8px rgba(11,26,52,0.04)" }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setOpenMenu(openMenu?.id === row.id ? null : { id: row.id, rect: r });
                          }}
                          style={{ border:`1px solid ${openMenu?.id === row.id ? PN.primary : PN.bord}`, background: openMenu?.id === row.id ? PN.primaryBg : "#fff", borderRadius:PN.r.md, padding:"6px 8px", cursor:"pointer", display:"inline-flex", alignItems:"center", transition:"all 0.12s" }}
                        >
                          <MoreHorizontal size={16} style={{ color: openMenu?.id === row.id ? PN.primary : PN.ink3 }} />
                        </button>
                        {openMenu?.id === row.id && (
                          <TxContextMenu
                            rect={openMenu.rect}
                            onClose={() => setOpenMenu(null)}
                            onItemClick={label => {
                              if (label === "Voir le détail")          setDetailTxId(row.id);
                              else if (label === "Bloquer la transaction") setBlockTxId(row.id);
                              else if (label === "Retenter la transaction") setRetryTxId(row.id);
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"14px 20px", borderTop:`1px solid ${PN.bord}`,
          }}>
            <span style={{ fontSize:13, color:PN.ink3, fontFamily:FONT }}>
              {rows.length} transaction{rows.length !== 1 ? "s" : ""}
            </span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width:32, height:32, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md,
                  background:"#fff", cursor: page === 1 ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  opacity: page === 1 ? 0.35 : 1, color:PN.ink2,
                }}
              >
                <ChevronLeft size={14} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n} onClick={() => setPage(n)}
                  style={{
                    width:32, height:32, borderRadius:PN.r.md, cursor:"pointer",
                    border:`1px solid ${n === page ? PN.primary : PN.bord}`,
                    background: n === page ? PN.primaryBg : "#fff",
                    color: n === page ? PN.primary : PN.ink2,
                    fontSize:13, fontWeight: n === page ? 700 : 500, fontFamily:FONT,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  width:32, height:32, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md,
                  background:"#fff", cursor: page === totalPages ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  opacity: page === totalPages ? 0.35 : 1, color:PN.ink2,
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </PayNowShell>
    {/* ── Transaction detail drawer ── */}
    {detailTxId !== null && (() => {
      const row = DATA.find(r => r.id === detailTxId);
      if (!row) return null;
      const d: TransactionDetailData = {
        id: row.id, ordre: row.ordre, montant: row.montant,
        date: row.date, time: row.time, statut: row.statut,
        moyen: row.moyen, auth: row.auth, uuid: row.uuid, email: row.email,
      };
      return <TransactionDetailDrawer data={d} onClose={() => setDetailTxId(null)} />;
    })()}

    {/* ── Bloquer la transaction ── */}
    {blockTxId !== null && (() => {
      const row = DATA.find(r => r.id === blockTxId);
      return row ? (
        <ConfirmDialog
          title="Bloquer la transaction"
          message={`Voulez-vous bloquer la transaction ${row.ordre} (${row.montant.toLocaleString("fr-FR", { minimumFractionDigits:2 })} EUR) ? Cette action empêchera toute action future sur cette transaction.`}
          confirmLabel="Bloquer"
          confirmColor={PN.red}
          onConfirm={() => setBlockTxId(null)}
          onCancel={() => setBlockTxId(null)}
        />
      ) : null;
    })()}

    {/* ── Retenter la transaction ── */}
    {retryTxId !== null && (() => {
      const row = DATA.find(r => r.id === retryTxId);
      return row ? (
        <ConfirmDialog
          title="Retenter la transaction"
          message={`Voulez-vous relancer la transaction ${row.ordre} (${row.montant.toLocaleString("fr-FR", { minimumFractionDigits:2 })} EUR) avec le même moyen de paiement ?`}
          confirmLabel="Retenter"
          confirmColor={PN.primary}
          onConfirm={() => setRetryTxId(null)}
          onCancel={() => setRetryTxId(null)}
        />
      ) : null;
    })()}
    </>
  );
}
