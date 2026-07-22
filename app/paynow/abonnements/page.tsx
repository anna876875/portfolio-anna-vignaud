"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown, Plus, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, RefreshCw, Columns2,
  Check, X, ArrowUpDown, Eye, Pencil, Ban,
} from "lucide-react";
import { PayNowShell, PN, FONT } from "../_shell";
import { AbonnementDetailDrawer, EditSubscriptionDrawer, ConfirmDialog } from "../_drawers";
import type { AbonnementDetailData } from "../_drawers";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
type StatutAbo    = "actif" | "pause" | "annule" | "expire";
type FrequenceAbo = "quotidien" | "hebdomadaire" | "mensuel" | "annuel";
type Moyen        = "CB" | "Mastercard" | "Apple Pay" | "PayPal" | "Alma" | "Wero";

interface Abonnement {
  id: number; reference: string; email: string;
  montant: number; frequence: FrequenceAbo;
  prochainPrelev: string | null; statut: StatutAbo;
  moyen: Moyen; dateCreation: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────────────────── */
const DATA: Abonnement[] = [
  { id:1, reference:"SUB-7842", email:"turl@gmail.com",        montant:29.90,  frequence:"mensuel",      prochainPrelev:"01/08/26", statut:"actif",  moyen:"CB",          dateCreation:"01/07/26" },
  { id:2, reference:"SUB-7841", email:"marc.d@gmail.com",      montant:9.99,   frequence:"mensuel",      prochainPrelev:"03/08/26", statut:"actif",  moyen:"Mastercard",  dateCreation:"03/06/26" },
  { id:3, reference:"SUB-7840", email:"client@boutique.fr",    montant:199.00, frequence:"annuel",       prochainPrelev:"15/03/27", statut:"actif",  moyen:"CB",          dateCreation:"15/03/26" },
  { id:4, reference:"SUB-7839", email:"sophie.m@gmail.com",    montant:49.90,  frequence:"mensuel",      prochainPrelev:null,       statut:"pause",  moyen:"PayPal",      dateCreation:"12/01/26" },
  { id:5, reference:"SUB-7838", email:"j.dupont@free.fr",      montant:14.99,  frequence:"hebdomadaire", prochainPrelev:null,       statut:"annule", moyen:"Alma",        dateCreation:"28/04/26" },
  { id:6, reference:"SUB-7837", email:"a.martin@orange.fr",    montant:99.00,  frequence:"annuel",       prochainPrelev:null,       statut:"expire", moyen:"CB",          dateCreation:"10/07/25" },
  { id:7, reference:"SUB-7836", email:"emilie.v@gmail.com",    montant:4.99,   frequence:"mensuel",      prochainPrelev:"07/08/26", statut:"actif",  moyen:"Wero",        dateCreation:"07/06/26" },
  { id:8, reference:"SUB-7835", email:"thomas.b@hotmail.com",  montant:249.00, frequence:"annuel",       prochainPrelev:"22/12/26", statut:"actif",  moyen:"Apple Pay",   dateCreation:"22/12/25" },
];

const PER_PAGE = 10;
const FREQ_LABEL: Record<FrequenceAbo, string> = {
  quotidien:"Quotidien", hebdomadaire:"Hebdomadaire", mensuel:"Mensuel", annuel:"Annuel",
};
const FREQ_PERIOD: Record<FrequenceAbo, string> = {
  quotidien:"/j", hebdomadaire:"/sem", mensuel:"/mois", annuel:"/an",
};

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────────────────────────── */
const STATUT_CFG: Record<StatutAbo, { label:string; bg:string; text:string; dot:string }> = {
  actif:  { label:"Actif",    bg:PN.greenBg, text:PN.greenText, dot:PN.green },
  pause:  { label:"En pause", bg:PN.amberBg, text:PN.amberText, dot:PN.amber },
  annule: { label:"Annulé",   bg:PN.redBg,   text:PN.redText,   dot:PN.red   },
  expire: { label:"Expiré",   bg:"#F3F4F6",  text:"#4B5563",    dot:"#9CA3AF" },
};

function StatutBadge({ statut }: { statut: StatutAbo }) {
  const c = STATUT_CFG[statut];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:c.bg, color:c.text, borderRadius:PN.r.full, padding:"3px 10px 3px 7px", fontSize:12, fontWeight:600, fontFamily:FONT, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {c.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FREQUENCY BADGE
───────────────────────────────────────────────────────────────────────────── */
const FREQ_COLOR: Record<FrequenceAbo, { bg:string; text:string }> = {
  quotidien:    { bg:"#EDE9FE", text:"#5B21B6" },
  hebdomadaire: { bg:"#E0E7FF", text:"#3730A3" },
  mensuel:      { bg:PN.blueBg,  text:PN.blueText },
  annuel:       { bg:"#ECFDF5", text:"#065F46" },
};

function FreqBadge({ freq }: { freq: FrequenceAbo }) {
  const c = FREQ_COLOR[freq];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", background:c.bg, color:c.text, borderRadius:PN.r.md, padding:"3px 9px", fontSize:11.5, fontWeight:700, fontFamily:FONT, whiteSpace:"nowrap" }}>
      {FREQ_LABEL[freq]}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT METHOD ICONS
───────────────────────────────────────────────────────────────────────────── */
function CBIcon()         { return <svg width="38" height="24" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#1434CB"/><text x="19" y="16.5" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily={FONT} letterSpacing="0.06em">CB</text></svg>; }
function MastercardIcon() { return <svg width="38" height="24" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#F5F5F5"/><circle cx="14" cy="12" r="8" fill="#EB001B"/><circle cx="24" cy="12" r="8" fill="#F79E1B"/><path d="M19 5.52A8 8 0 0 1 24 12a8 8 0 0 1-5 6.48A8 8 0 0 1 14 12a8 8 0 0 1 5-6.48Z" fill="#FF5F00"/></svg>; }
function ApplePayIcon()   { return <svg width="56" height="24" viewBox="0 0 56 24" fill="none"><rect width="56" height="24" rx="4" fill="#000"/><text x="28" y="16" textAnchor="middle" fontSize="9" fontWeight="500" fill="#fff" fontFamily="-apple-system, sans-serif" letterSpacing="0.02em">Apple Pay</text></svg>; }
function PayPalIcon()     { return <svg width="38" height="24" viewBox="0 0 38 24" fill="none"><rect width="38" height="24" rx="4" fill="#003087"/><text x="19" y="17" textAnchor="middle" fontSize="14" fontWeight="900" fill="#fff" fontFamily="Georgia, serif" fontStyle="italic">P</text></svg>; }
function AlmaIcon()       { return <svg width="52" height="24" viewBox="0 0 52 24" fill="none"><rect width="52" height="24" rx="4" fill="#fff" stroke={PN.bord} strokeWidth="1"/><text x="26" y="16" textAnchor="middle" fontSize="12" fontWeight="800" fill="#FF3F5A" fontFamily="'Manrope', sans-serif" letterSpacing="-0.04em">alma</text></svg>; }
function WeroIcon()       { return <svg width="52" height="24" viewBox="0 0 52 24" fill="none"><rect width="52" height="24" rx="4" fill="#5F2D91"/><text x="26" y="16" textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff" fontFamily="'Manrope', sans-serif" letterSpacing="0.06em">WERO</text></svg>; }

function PMIcon({ moyen }: { moyen: Moyen }) {
  if (moyen === "CB")        return <CBIcon />;
  if (moyen === "Mastercard")return <MastercardIcon />;
  if (moyen === "Apple Pay") return <ApplePayIcon />;
  if (moyen === "PayPal")    return <PayPalIcon />;
  if (moyen === "Alma")      return <AlmaIcon />;
  return <WeroIcon />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function fmtMontant(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function Sep() {
  return <div style={{ width:1, height:22, background:PN.bord, flexShrink:0 }} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTEXT MENU
───────────────────────────────────────────────────────────────────────────── */
const ABO_MENU_ITEMS = [
  { label:"Voir le détail",      Icon:Eye,     color:PN.ink     },
  { label:"Modifier",            Icon:Pencil,  color:PN.ink     },
  { label:"Résilier",            Icon:Ban,     color:PN.red,    separator:true },
];

function AboContextMenu({ rect, onClose, onItemClick }: { rect:DOMRect; onClose:()=>void; onItemClick:(label:string)=>void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);
  return createPortal(
    <div ref={ref} style={{ position:"fixed", top:rect.bottom+4, right:window.innerWidth-rect.right, zIndex:9999, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, boxShadow:"0 8px 24px rgba(11,26,52,0.13)", minWidth:200, overflow:"hidden" }}>
      {ABO_MENU_ITEMS.map(({ label, Icon, color, separator }) => (
        <div key={label}>
          {separator && <div style={{ height:1, background:PN.bord, margin:"3px 0" }} />}
          <button onClick={() => { onItemClick(label); onClose(); }} style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 16px", border:"none", background:"transparent", cursor:"pointer", fontSize:13.5, fontFamily:FONT, color, textAlign:"left" }}>
            <Icon size={14} strokeWidth={2} />
            {label}
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FILTER DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
function FilterDropdown({ label, options, value, onSelect, onClear, dotColors }: {
  label:string; options:string[]; value:string;
  onSelect:(v:string)=>void; onClear:()=>void;
  dotColors?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const active = !!value;
  return (
    <div ref={ref} style={{ position:"relative", alignSelf:"stretch", display:"flex", alignItems:"center" }}>
      <button onClick={() => setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", gap:6, padding:"0 14px", height:"100%", border:"none", background:open?PN.surf:active?PN.primaryBg:"transparent", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, color:active?PN.primary:PN.ink2, fontSize:13.5, fontWeight:active?700:500, fontFamily:FONT, transition:"background 0.12s" }}>
        <span>{active ? value : label}</span>
        {active
          ? <span onMouseDown={e=>{ e.stopPropagation(); onClear(); setOpen(false); }} style={{ marginLeft:2, lineHeight:1, cursor:"pointer", opacity:0.7, fontSize:15 }}>×</span>
          : <ChevronDown size={13} style={{ color:PN.ink3, flexShrink:0 }} />}
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, boxShadow:"0 8px 32px rgba(11,26,52,0.10)", zIndex:200, minWidth:210, overflow:"hidden" }}>
          {options.map(opt => (
            <button key={opt} className="pn-filter-opt" onClick={() => { onSelect(opt); setOpen(false); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 14px", border:"none", background:opt===value?PN.primaryBg:"transparent", cursor:"pointer", fontSize:13.5, fontFamily:FONT, color:opt===value?PN.primary:PN.ink, fontWeight:opt===value?600:400, textAlign:"left" }}>
              <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                {dotColors?.[opt] && <span style={{ width:7, height:7, borderRadius:"50%", background:dotColors[opt], flexShrink:0 }} />}
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
   MINI CALENDAR + DATE FILTER DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
const MONTHS_FR_ABO    = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MONTHS_SHORT_ABO = ["jan.","fév.","mars","avr.","mai","juin","juil.","août","sep.","oct.","nov.","déc."];
const DAYS_HDR_ABO     = ["L","M","M","J","V","S","D"];
const DATE_PRESETS_ABO = ["Aujourd'hui","Hier","7 derniers jours","30 derniers jours","Ce mois-ci"];

function MiniCalendarAbo({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const today = new Date();
  const [vy, setVy] = useState(today.getFullYear());
  const [vm, setVm] = useState(today.getMonth());
  const prev = () => { if (vm === 0) { setVm(11); setVy(y=>y-1); } else setVm(m=>m-1); };
  const next = () => { if (vm === 11) { setVm(0); setVy(y=>y+1); } else setVm(m=>m+1); };
  const offset      = (new Date(vy, vm, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(vy, vm+1, 0).getDate();
  const todayStr    = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  return (
    <div style={{ width:196 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <button onClick={prev} style={{ border:"none", background:"none", cursor:"pointer", padding:"3px 5px", color:PN.ink2, display:"flex", borderRadius:PN.r.xs }}><ChevronLeft size={13} /></button>
        <span style={{ fontSize:12.5, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{MONTHS_FR_ABO[vm]} {vy}</span>
        <button onClick={next} style={{ border:"none", background:"none", cursor:"pointer", padding:"3px 5px", color:PN.ink2, display:"flex", borderRadius:PN.r.xs }}><ChevronRight size={13} /></button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,28px)", marginBottom:2 }}>
        {DAYS_HDR_ABO.map((d,i) => <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:PN.ink3, fontFamily:FONT, lineHeight:"22px" }}>{d}</div>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,28px)", gap:1 }}>
        {Array.from({ length:offset }, (_,i) => <div key={`e${i}`} style={{ width:28, height:28 }} />)}
        {Array.from({ length:daysInMonth }, (_,i) => {
          const day = i+1;
          const dateStr = `${vy}-${String(vm+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const isSel   = value === dateStr;
          const isToday = dateStr === todayStr;
          return (
            <button key={day} onClick={() => onChange(dateStr)} style={{ width:28, height:28, border:"none", cursor:"pointer", borderRadius:PN.r.xs, background:isSel?PN.primary:"transparent", color:isSel?"#fff":isToday?PN.primary:PN.ink, fontSize:12, fontFamily:FONT, fontWeight:isSel||isToday?700:400, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DateFilterDropdownAbo({ value, onSelect, onClear }: { value:string; onSelect:(v:string)=>void; onClear:()=>void }) {
  const [open, setOpen] = useState(false);
  const [customDate, setCustomDate] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const active = !!value;
  function applyCustom() {
    if (!customDate) return;
    const [y, m, d] = customDate.split("-");
    onSelect(`${parseInt(d)} ${MONTHS_SHORT_ABO[parseInt(m)-1]} ${y}`);
    setOpen(false);
  }
  return (
    <div ref={ref} style={{ position:"relative", alignSelf:"stretch", display:"flex", alignItems:"center" }}>
      <button onClick={() => setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", gap:6, padding:"0 14px", height:"100%", border:"none", background:open?PN.surf:active?PN.primaryBg:"transparent", cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, color:active?PN.primary:PN.ink2, fontSize:13.5, fontWeight:active?700:500, fontFamily:FONT, transition:"background 0.12s" }}>
        <span>{active ? value : "Date de création"}</span>
        {active
          ? <span onMouseDown={e=>{ e.stopPropagation(); onClear(); setOpen(false); }} style={{ marginLeft:2, lineHeight:1, cursor:"pointer", opacity:0.7, fontSize:15 }}>×</span>
          : <ChevronDown size={13} style={{ color:PN.ink3, flexShrink:0 }} />}
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, boxShadow:"0 8px 32px rgba(11,26,52,0.10)", zIndex:200, display:"flex", overflow:"hidden" }}>
          <div style={{ minWidth:185, borderRight:`1px solid ${PN.bord}` }}>
            {DATE_PRESETS_ABO.map(opt => (
              <button key={opt} className="pn-filter-opt" onClick={() => { onSelect(opt); setOpen(false); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 14px", border:"none", background:opt===value?PN.primaryBg:"transparent", cursor:"pointer", fontSize:13.5, fontFamily:FONT, color:opt===value?PN.primary:PN.ink, fontWeight:opt===value?600:400, textAlign:"left" }}>
                {opt}
                {opt === value && <Check size={13} />}
              </button>
            ))}
          </div>
          <div style={{ padding:"14px 14px 12px" }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, marginBottom:10 }}>Date spécifique</div>
            <MiniCalendarAbo value={customDate} onChange={setCustomDate} />
            <button onClick={applyCustom} style={{ marginTop:10, width:"100%", padding:"8px 0", border:"none", borderRadius:PN.r.md, background:customDate?PN.primary:PN.surf, color:customDate?"#fff":PN.ink3, fontSize:13, fontWeight:700, fontFamily:FONT, cursor:customDate?"pointer":"default", transition:"background 0.15s, color 0.15s" }}>
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TABS
───────────────────────────────────────────────────────────────────────────── */
const TABS = [
  { id:"tous",    label:"Tous les abonnements" },
  { id:"actif",   label:"Actifs" },
  { id:"pause",   label:"En pause" },
  { id:"annule",  label:"Annulés" },
];


/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function AbonnementsPage() {
  const [detailAboId,  setDetailAboId]  = useState<number | null>(null);
  const [openMenu,     setOpenMenu]     = useState<{ id:number; rect:DOMRect } | null>(null);
  const [editAboId,    setEditAboId]    = useState<number | null>(null);
  const [resiliateId,  setResiliateId]  = useState<number | null>(null);
  const [activeTab,    setActiveTab]    = useState("tous");
  const [search,       setSearch]       = useState("");
  const [dateVal,      setDateVal]      = useState("");
  const [statutVal,    setStatutVal]    = useState("");
  const [freqVal,      setFreqVal]      = useState("");
  const [moyenVal,     setMoyenVal]     = useState("");
  const [sortDir,      setSortDir]      = useState<"desc"|"asc">("desc");
  const [page,         setPage]         = useState(1);

  const STATUT_FILTER_MAP: Record<string, StatutAbo> = {
    "Actif":"actif", "En pause":"pause", "Annulé":"annule", "Expiré":"expire",
  };
  const FREQ_FILTER_MAP: Record<string, FrequenceAbo> = {
    "Quotidien":"quotidien", "Hebdomadaire":"hebdomadaire", "Mensuel":"mensuel", "Annuel":"annuel",
  };

  let rows = DATA.filter(r => {
    if (activeTab !== "tous" && r.statut !== activeTab) return false;
    if (statutVal && r.statut !== STATUT_FILTER_MAP[statutVal]) return false;
    if (freqVal && r.frequence !== FREQ_FILTER_MAP[freqVal]) return false;
    if (moyenVal && r.moyen !== moyenVal) return false;
    if (search && !r.reference.toLowerCase().includes(search.toLowerCase()) && !r.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  rows = [...rows].sort((a, b) => {
    const ts = (s:string) => { const [d,m,y] = s.split("/"); return new Date(`20${y}-${m}-${d}`).getTime(); };
    return sortDir === "desc" ? ts(b.dateCreation) - ts(a.dateCreation) : ts(a.dateCreation) - ts(b.dateCreation);
  });

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const pageRows   = rows.slice((page-1)*PER_PAGE, page*PER_PAGE);

  const COLS = [
    { label:"ID ABONNEMENT",        w:160, sort:false, sticky:false },
    { label:"CLIENT",               w:190, sort:false, sticky:false },
    { label:"MONTANT",              w:140, sort:false, sticky:false },
    { label:"FRÉQUENCE",            w:140, sort:false, sticky:false },
    { label:"PROCHAIN PRÉLÈVEMENT", w:175, sort:true,  sticky:false },
    { label:"STATUT",               w:120, sort:false, sticky:false },
    { label:"MOYEN DE PAIEMENT",    w:160, sort:false, sticky:false },
    { label:"ACTIONS",              w:100, sort:false, sticky:true  },
  ];

  return (
    <>
    <PayNowShell activePage="abonnements">
      <div style={{ padding:"44px 44px 60px", background:PN.bg }}>

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, gap:16 }}>
          <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>
            Abonnements
          </h1>
          <button style={{ display:"flex", alignItems:"center", gap:7, background:PN.primary, color:"#fff", border:"none", borderRadius:PN.r.md, padding:"10px 20px", fontSize:13.5, fontWeight:700, fontFamily:FONT, cursor:"pointer", whiteSpace:"nowrap", flexShrink:0, boxShadow:"0 2px 10px rgba(59,126,248,0.32)" }}>
            <Plus size={15} strokeWidth={2.5} />
            Créer un abonnement
          </button>
        </div>

        {/* TABS */}
        <div style={{ display:"flex", alignItems:"center", borderBottom:`1px solid ${PN.bord}`, marginBottom:20 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setPage(1); }} style={{ padding:"12px 20px", border:"none", background:"none", fontSize:13.5, fontFamily:FONT, cursor:"pointer", fontWeight:activeTab===tab.id?700:500, color:activeTab===tab.id?PN.primary:PN.ink2, borderBottom:activeTab===tab.id?`2px solid ${PN.primary}`:"2px solid transparent", marginBottom:-1, whiteSpace:"nowrap", transition:"color 0.15s" }}>
              {tab.label}
              {tab.id !== "tous" && (
                <span style={{ marginLeft:6, background: activeTab===tab.id?PN.primaryBg:PN.surf, color:activeTab===tab.id?PN.primary:PN.ink3, borderRadius:PN.r.full, fontSize:11, fontWeight:700, padding:"1px 7px", fontFamily:FONT }}>
                  {DATA.filter(r => r.statut === tab.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* FILTER BAR */}
        <div style={{ display:"flex", alignItems:"center", height:50, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, marginBottom:20, overflow:"visible", flexShrink:0 }}>
          <DateFilterDropdownAbo value={dateVal} onSelect={v => { setDateVal(v); setPage(1); }} onClear={() => { setDateVal(""); setPage(1); }} />
          <Sep />
          <FilterDropdown
            label="Statut"
            options={["Actif","En pause","Annulé","Expiré"]}
            value={statutVal}
            onSelect={v => { setStatutVal(v); setPage(1); }}
            onClear={() => { setStatutVal(""); setPage(1); }}
            dotColors={{ "Actif":PN.green, "En pause":PN.amber, "Annulé":PN.red, "Expiré":"#9CA3AF" }}
          />
          <Sep />
          <FilterDropdown label="Fréquence" options={["Quotidien","Hebdomadaire","Mensuel","Annuel"]} value={freqVal} onSelect={v => { setFreqVal(v); setPage(1); }} onClear={() => { setFreqVal(""); setPage(1); }} />
          <Sep />
          <FilterDropdown label="Moyen de paiement" options={["CB","Mastercard","Apple Pay","PayPal","Alma","Wero"]} value={moyenVal} onSelect={v => { setMoyenVal(v); setPage(1); }} onClear={() => { setMoyenVal(""); setPage(1); }} />
          <Sep />
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, padding:"0 14px", minWidth:0 }}>
            <Search size={14} style={{ color:PN.ink3, flexShrink:0 }} />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher un abonnement ou client..." style={{ border:"none", background:"none", flex:1, fontSize:13.5, fontFamily:FONT, color:PN.ink, outline:"none", minWidth:0 }} />
            {search && <button onClick={() => setSearch("")} style={{ border:"none", background:"none", cursor:"pointer", padding:2, color:PN.ink3, display:"flex" }}><X size={13} /></button>}
          </div>
          <Sep />
          <button className="pn-tool-btn" style={{ display:"flex", alignItems:"center", padding:"0 12px", height:"100%", border:"none", background:"transparent", cursor:"pointer", color:PN.ink2, flexShrink:0 }}>
            <RefreshCw size={15} strokeWidth={2} /><span className="pn-tool-label">Rafraîchir</span>
          </button>
          <button className="pn-tool-btn" style={{ display:"flex", alignItems:"center", padding:"0 12px", height:"100%", border:"none", background:"transparent", cursor:"pointer", color:PN.ink2, borderRadius:`0 ${PN.r.md}px ${PN.r.md}px 0`, flexShrink:0 }}>
            <Columns2 size={15} strokeWidth={2} /><span className="pn-tool-label">Colonnes</span>
          </button>
        </div>

        {/* TABLE */}
        <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"clip", boxShadow:"0 2px 12px rgba(11,26,52,0.05)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:1100 }}>
              <thead>
                <tr style={{ background:PN.surf, borderBottom:`1px solid ${PN.bord}` }}>
                  {COLS.map(col => (
                    <th key={col.label} onClick={col.sort ? () => setSortDir(d=>d==="desc"?"asc":"desc") : undefined} style={{ padding:"12px 16px", textAlign: col.sticky ? "center" : "left", fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap", fontFamily:FONT, width:col.w, cursor:col.sort?"pointer":"default", userSelect:"none", background:PN.surf, ...(col.sticky ? { position:"sticky", right:0, boxShadow:"-4px 0 8px rgba(11,26,52,0.04)" } : {}) }}>
                      <span style={{ display:"inline-flex", alignItems:"center", gap:4 }}>
                        {col.label}
                        {col.sort && <ArrowUpDown size={11} strokeWidth={2} style={{ opacity:0.55, color:sortDir==="desc"?PN.primary:PN.ink3 }} />}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0
                  ? <tr><td colSpan={8} style={{ padding:"52px 24px", textAlign:"center", color:PN.ink3, fontFamily:FONT, fontSize:14 }}>Aucun abonnement trouvé</td></tr>
                  : pageRows.map((row, i) => (
                    <tr key={row.id} className="pn-tr" style={{ borderBottom:i<pageRows.length-1?`1px solid ${PN.bord}`:"none", cursor:"pointer" }} onClick={() => setDetailAboId(row.id)}>
                      {/* ID */}
                      <td style={{ padding:"15px 16px" }}>
                        <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:PN.ink, letterSpacing:"0.03em" }}>{row.reference}</span>
                      </td>
                      {/* Client */}
                      <td style={{ padding:"15px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <div style={{ width:30, height:30, borderRadius:PN.r.full, background:PN.primaryBg, color:PN.primary, fontSize:11, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:FONT }}>
                            {row.email[0].toUpperCase()}
                          </div>
                          <span style={{ fontSize:13, color:PN.ink2, fontFamily:FONT }}>{row.email}</span>
                        </div>
                      </td>
                      {/* Montant */}
                      <td style={{ padding:"15px 16px" }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, whiteSpace:"nowrap" }}>
                          {fmtMontant(row.montant)} EUR
                        </div>
                        <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginTop:1 }}>{FREQ_PERIOD[row.frequence]}</div>
                      </td>
                      {/* Fréquence */}
                      <td style={{ padding:"15px 16px" }}><FreqBadge freq={row.frequence} /></td>
                      {/* Prochain prélèvement */}
                      <td style={{ padding:"15px 16px" }}>
                        {row.prochainPrelev
                          ? <span style={{ fontSize:13, fontWeight:600, color:PN.ink, fontFamily:FONT }}>{row.prochainPrelev}</span>
                          : <span style={{ fontSize:12, color:PN.ink4, fontFamily:FONT }}>N/A</span>
                        }
                      </td>
                      {/* Statut */}
                      <td style={{ padding:"15px 16px" }}><StatutBadge statut={row.statut} /></td>
                      {/* Moyen */}
                      <td style={{ padding:"15px 16px" }}><PMIcon moyen={row.moyen} /></td>
                      {/* Actions */}
                      <td style={{ padding:"15px 16px", textAlign:"center", position:"sticky", right:0, background:"#fff", boxShadow:"-4px 0 8px rgba(11,26,52,0.04)" }}>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setOpenMenu(prev => prev?.id === row.id ? null : { id:row.id, rect:r });
                          }}
                          style={{ border:`1px solid ${openMenu?.id===row.id?PN.primary:PN.bord}`, background:openMenu?.id===row.id?PN.primaryBg:"#fff", borderRadius:PN.r.md, padding:"6px 8px", cursor:"pointer", display:"inline-flex", alignItems:"center", transition:"all 0.12s" }}>
                          <MoreHorizontal size={16} style={{ color:openMenu?.id===row.id?PN.primary:PN.ink3 }} />
                        </button>
                        {openMenu?.id === row.id && (
                          <AboContextMenu
                            rect={openMenu.rect}
                            onClose={() => setOpenMenu(null)}
                            onItemClick={label => {
                              if (label === "Voir le détail") setDetailAboId(row.id);
                              else if (label === "Modifier")  setEditAboId(row.id);
                              else if (label === "Résilier")  setResiliateId(row.id);
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

          {/* PAGINATION */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderTop:`1px solid ${PN.bord}` }}>
            <span style={{ fontSize:13, color:PN.ink3, fontFamily:FONT }}>{rows.length} abonnement{rows.length!==1?"s":""}</span>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ width:32, height:32, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:page===1?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity:page===1?0.35:1, color:PN.ink2 }}>
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length:totalPages },(_,i)=>i+1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ width:32, height:32, borderRadius:PN.r.md, cursor:"pointer", border:`1px solid ${n===page?PN.primary:PN.bord}`, background:n===page?PN.primaryBg:"#fff", color:n===page?PN.primary:PN.ink2, fontSize:13, fontWeight:n===page?700:500, fontFamily:FONT, display:"flex", alignItems:"center", justifyContent:"center" }}>{n}</button>
              ))}
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ width:32, height:32, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:page===totalPages?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", opacity:page===totalPages?0.35:1, color:PN.ink2 }}>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </PayNowShell>

    {/* ── helpers ── */}
    {(() => {
      function makeAbono(row: typeof DATA[number]): AbonnementDetailData {
        return {
          reference:         row.reference,
          dateCreation:      row.dateCreation,
          dateEffet:         row.prochainPrelev ?? "N/A",
          dateResiliation:   row.statut === "annule" || row.statut === "expire" ? row.dateCreation : "N/A",
          echeancesTraitees: Math.floor(row.montant / 10),
          echeancesTotales:  12,
          montantFixe:       fmtMontant(row.montant) + " EUR",
          montantInitial:    fmtMontant(row.montant) + " EUR",
          referenceCommande: "CMD-" + (row.id * 1000 + 450),
          validation:        row.statut === "actif" ? "Automatique" : "Manuelle",
          alias:             "N/A",
          nomAcheteur:       row.email.split("@")[0],
          emailBoutique:     row.email,
          referenceAcheteur: "CUST-" + (row.id * 10 + 4400),
        };
      }
      const detailRow = detailAboId !== null ? DATA.find(r => r.id === detailAboId) : null;
      const editRow   = editAboId   !== null ? DATA.find(r => r.id === editAboId)   : null;
      const resRow    = resiliateId !== null ? DATA.find(r => r.id === resiliateId) : null;
      return (
        <>
          {detailRow && <AbonnementDetailDrawer data={makeAbono(detailRow)} onClose={() => setDetailAboId(null)} />}
          {editRow   && (
            <EditSubscriptionDrawer
              reference={editRow.reference}
              montant={fmtMontant(editRow.montant) + " EUR"}
              frequence={editRow.frequence}
              validation={editRow.statut === "actif" ? "Automatique" : "Manuelle"}
              onClose={() => setEditAboId(null)}
            />
          )}
          {resRow && (
            <ConfirmDialog
              title="Résilier l'abonnement"
              message={`Voulez-vous résilier l'abonnement ${resRow.reference} ? Les prélèvements futurs seront annulés.`}
              confirmLabel="Résilier"
              confirmColor={PN.red}
              onConfirm={() => setResiliateId(null)}
              onCancel={() => setResiliateId(null)}
            />
          )}
        </>
      );
    })()}
    </>
  );
}
