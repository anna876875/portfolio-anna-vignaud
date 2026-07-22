"use client";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Plus, MoreHorizontal, ChevronLeft, ChevronRight, Check, X, SlidersHorizontal, RefreshCw, Columns2, Eye, Pencil, CreditCard, Ban, Calendar } from "lucide-react";
import { PayNowShell, PN, FONT } from "../_shell";
import {
  AliasDetailDrawer, AbonnementDetailDrawer,
  BuyerEditDrawer, PaymentUpdateDrawer, CreateSubscriptionDrawer,
  EditSubscriptionDrawer, ScheduleDrawer, ConfirmDialog,
} from "../_drawers";
import type { AliasDetailData, AbonnementDetailData } from "../_drawers";

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT METHOD ICONS
───────────────────────────────────────────────────────────────────────────── */
function CBIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
      <rect width="30" height="20" rx="4" fill="#1A56DB" />
      <text x="15" y="13.5" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily={FONT}>CB</text>
    </svg>
  );
}
function MastercardIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
      <rect width="30" height="20" rx="4" fill="#F9FAFB" stroke="#E3E8F4" />
      <circle cx="12" cy="10" r="6.5" fill="#EB001B" fillOpacity="0.92" />
      <circle cx="18" cy="10" r="6.5" fill="#F79E1B" fillOpacity="0.92" />
      <path d="M15 4.5a6.5 6.5 0 0 1 0 11 6.5 6.5 0 0 1 0-11z" fill="#FF5F00" />
    </svg>
  );
}
function BDDIcon() {
  return (
    <svg width="30" height="20" viewBox="0 0 30 20" fill="none">
      <rect width="30" height="20" rx="4" fill="#E0F2FE" />
      <rect x="6"  y="13" width="3" height="5" rx="1" fill="#0284C7" />
      <rect x="11" y="10" width="3" height="8" rx="1" fill="#0284C7" />
      <rect x="16" y="7"  width="3" height="11" rx="1" fill="#0284C7" />
      <rect x="21" y="11" width="3" height="7" rx="1" fill="#0284C7" />
    </svg>
  );
}
function ApplePayIcon() {
  return (
    <svg width="44" height="20" viewBox="0 0 44 20" fill="none">
      <rect width="44" height="20" rx="4" fill="#000" />
      <text x="22" y="13" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff" fontFamily={FONT} letterSpacing="0.05em">Apple Pay</text>
    </svg>
  );
}

const PM_ICONS: Record<string, ReactNode> = {
  CB:          <CBIcon />,
  Mastercard:  <MastercardIcon />,
  BDD:         <BDDIcon />,
  "Apple Pay": <ApplePayIcon />,
};

/* ─────────────────────────────────────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────────────────────────────────────── */
type Status = "actif" | "inactif" | "nouveau" | "paiement" | null;

const STATUS_MAP: Record<NonNullable<Status>, { bg: string; text: string; dot: string; label: string }> = {
  actif:    { bg: PN.greenBg,  text: PN.greenText, dot: PN.green,  label: "Actif" },
  inactif:  { bg: PN.redBg,    text: PN.redText,   dot: PN.red,    label: "Inactif" },
  nouveau:  { bg: PN.blueBg,   text: PN.blueText,  dot: PN.blue,   label: "Nouveau" },
  paiement: { bg: PN.amberBg,  text: PN.amberText, dot: PN.amber,  label: "1 paiement" },
};

function StatusBadge({ status }: { status: Status }) {
  if (!status) return <span style={{ color: PN.ink4, fontSize: 13 }}>N/A</span>;
  const s = STATUS_MAP[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 10px", borderRadius: PN.r.full,
      background: s.bg, color: s.text,
      fontSize: 12, fontWeight: 700, fontFamily: FONT, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CUSTOM CHECKBOX
───────────────────────────────────────────────────────────────────────────── */
function CustomCheck({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={e => { e.stopPropagation(); onChange(); }}
      style={{
        width: 17, height: 17, borderRadius: 5, flexShrink: 0,
        border: `1.5px solid ${checked ? PN.primary : PN.bordMd}`,
        background: checked ? PN.primary : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.12s",
      }}
    >
      {checked && <Check size={11} color="#fff" strokeWidth={3} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FILTER DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
function Sep() {
  return <div style={{ width: 1, height: 22, background: PN.bord, flexShrink: 0 }} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MINI CALENDAR + DATE DE CRÉATION DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
const MONTHS_FR_ALIAS    = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MONTHS_SHORT_ALIAS = ["jan.","fév.","mars","avr.","mai","juin","juil.","août","sep.","oct.","nov.","déc."];
const DAYS_HDR_ALIAS     = ["L","M","M","J","V","S","D"];

function MiniCalendarAlias({ value, onChange }: { value: string; onChange: (v: string) => void }) {
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
        <span style={{ fontSize:12.5, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{MONTHS_FR_ALIAS[vm]} {vy}</span>
        <button onClick={next} style={{ border:"none", background:"none", cursor:"pointer", padding:"3px 5px", color:PN.ink2, display:"flex", borderRadius:PN.r.xs }}><ChevronRight size={13} /></button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,28px)", marginBottom:2 }}>
        {DAYS_HDR_ALIAS.map((d,i) => <div key={i} style={{ textAlign:"center", fontSize:10, fontWeight:700, color:PN.ink3, fontFamily:FONT, lineHeight:"22px" }}>{d}</div>)}
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

function DateCreationDropdown({ value, onSelect, onClear }: { value:string; onSelect:(v:string)=>void; onClear:()=>void }) {
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
    onSelect(`${parseInt(d)} ${MONTHS_SHORT_ALIAS[parseInt(m)-1]} ${y}`);
    setOpen(false);
  }
  return (
    <div ref={ref} style={{ position:"relative", alignSelf:"stretch", display:"flex", alignItems:"center" }}>
      <button onClick={() => setOpen(o=>!o)} style={{ display:"flex", alignItems:"center", gap:7, height:"100%", padding:"0 15px", border:"none", background:active?PN.primaryBg:"transparent", fontSize:13.5, fontWeight:active?700:500, color:active?PN.primary:PN.ink2, cursor:"pointer", fontFamily:FONT, whiteSpace:"nowrap" }}>
        {active ? value : "Date de création"}
        {active
          ? <span onMouseDown={e=>{ e.stopPropagation(); onClear(); setOpen(false); }} style={{ marginLeft:2, lineHeight:1, cursor:"pointer", opacity:0.7, fontSize:15 }}>×</span>
          : <ChevronDown size={14} style={{ color:PN.ink3, transform:open?"rotate(180deg)":"none", transition:"transform 0.15s", flexShrink:0 }} />
        }
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, zIndex:300, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, boxShadow:"0 8px 32px rgba(11,26,52,0.14)", display:"flex", overflow:"hidden" }}>
          <div style={{ minWidth:185, borderRight:`1px solid ${PN.bord}` }}>
            {DATE_OPTIONS.map(opt => (
              <button key={opt.label} className="pn-filter-opt" onClick={() => { onSelect(opt.label); setOpen(false); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 14px", border:"none", background:opt.label===value?PN.primaryBg:"transparent", cursor:"pointer", fontSize:13.5, fontFamily:FONT, color:opt.label===value?PN.primary:PN.ink, fontWeight:opt.label===value?600:400, textAlign:"left" }}>
                {opt.label}
                {opt.label === value && <Check size={13} />}
              </button>
            ))}
          </div>
          <div style={{ padding:"14px 14px 12px" }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, marginBottom:10 }}>Date spécifique</div>
            <MiniCalendarAlias value={customDate} onChange={setCustomDate} />
            <button onClick={applyCustom} style={{ marginTop:10, width:"100%", padding:"8px 0", border:"none", borderRadius:PN.r.md, background:customDate?PN.primary:PN.surf, color:customDate?"#fff":PN.ink3, fontSize:13, fontWeight:700, fontFamily:FONT, cursor:customDate?"pointer":"default", transition:"background 0.15s, color 0.15s" }}>
              Appliquer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterDropdown({
  label, active, count, onClear, children,
}: {
  label: string; active: boolean; count?: number; onClear: () => void; children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", alignSelf: "stretch", display: "flex", alignItems: "center" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          height: "100%", padding: "0 15px", border: "none",
          background: active ? PN.primaryBg : "transparent",
          fontSize: 13.5, fontWeight: active ? 700 : 500,
          color: active ? PN.primary : PN.ink2,
          cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap",
        }}
      >
        {label}
        {count ? (
          <span style={{ background: PN.primary, color: "#fff", fontSize: 11, fontWeight: 800, padding: "1px 6px", borderRadius: PN.r.full, minWidth: 18, textAlign: "center", fontFamily: FONT }}>{count}</span>
        ) : null}
        <ChevronDown size={14} style={{ color: active ? PN.primary : PN.ink3, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 300,
          background: "#fff", border: `1px solid ${PN.bord}`, borderRadius: PN.r.md,
          boxShadow: "0 8px 32px rgba(11,26,52,0.14), 0 2px 8px rgba(11,26,52,0.06)",
          minWidth: 248, overflow: "hidden",
        }}>
          {children}
          {active && (
            <div style={{ padding: "10px 16px", borderTop: `1px solid ${PN.surf}` }}>
              <button onClick={() => { onClear(); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: PN.red, fontFamily: FONT, padding: 0 }}>
                <X size={13} /> Effacer la sélection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DropHeader({ title }: { title: string }) {
  return (
    <div style={{ padding: "12px 16px 8px", borderBottom: `1px solid ${PN.surf}` }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: PN.ink3, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT }}>{title}</span>
    </div>
  );
}

function CheckOpt({ label, checked, onChange, dot }: { label: string; checked: boolean; onChange: () => void; dot?: string }) {
  return (
    <label className="pn-filter-opt" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", borderBottom: `1px solid ${PN.surf}` }}>
      <CustomCheck checked={checked} onChange={onChange} />
      {dot && <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />}
      <span style={{ fontSize: 13.5, fontWeight: 500, color: PN.ink2, fontFamily: FONT }}>{label}</span>
    </label>
  );
}

function RadioOpt({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="pn-filter-opt" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", cursor: "pointer", borderBottom: `1px solid ${PN.surf}` }}>
      <div style={{ width: 17, height: 17, borderRadius: "50%", flexShrink: 0, border: `1.5px solid ${checked ? PN.primary : PN.bordMd}`, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 0.12s" }}>
        {checked && <div style={{ width: 9, height: 9, borderRadius: "50%", background: PN.primary }} />}
      </div>
      <span style={{ fontSize: 13.5, fontWeight: 500, color: PN.ink2, fontFamily: FONT }}>{label}</span>
    </label>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────────────────────────────────────────── */
type AliasRow = {
  id: string; abonnements: number; status: Status;
  reference: string; moyen: string; idMoyen: string;
  dateExpiration: string; dateCreation: string;
  email: string; telephone: string; adresse: string;
  codePostal: string; ville: string;
  daysAgo: number;
};

type AbonnementRow = {
  reference: string; dateCreation: string; dateEffet: string;
  dateResiliation: string; echeancesTraitees: number; echeancesTotales: number;
  montantFixe: string; montantInitial: string;
  referenceCommande: string; validation: string;
  alias: string; nomAcheteur: string;
  emailBoutique: string; referenceAcheteur: string;
};

const ALIAS_DATA: AliasRow[] = [
  { id: "ALIAS-8845210", abonnements: 2, status: "actif",    reference: "CUST-4471", moyen: "CB",         idMoyen: "497010XXXXXX6142", dateExpiration: "08/2026", dateCreation: "03/03/2026", email: "alice.d@gmail.com",      telephone: "+33 6 12 34 56 78", adresse: "12 rue de la Paix",    codePostal: "75001", ville: "Paris",            daysAgo: 30 },
  { id: "ALIAS-8845577", abonnements: 1, status: null,       reference: "CUST-4460", moyen: "Mastercard", idMoyen: "530101XXXXXX7788", dateExpiration: "11/2026", dateCreation: "08/03/2026", email: "marc.dupont@hotmail.fr", telephone: "+33 7 89 01 23 45", adresse: "45 avenue Foch",       codePostal: "69006", ville: "Lyon",             daysAgo: 25 },
  { id: "ALIAS-8844902", abonnements: 1, status: "nouveau",  reference: "CUST-4419", moyen: "BDD",        idMoyen: "FRXXXXXXXXXX0391", dateExpiration: "N/A",       dateCreation: "22/02/2026", email: "j.martin@free.fr",       telephone: "+33 6 45 67 89 01", adresse: "8 rue du Commerce",    codePostal: "33000", ville: "Bordeaux",         daysAgo: 45 },
  { id: "ALIAS-8845333", abonnements: 0, status: "actif",    reference: "CUST-4488", moyen: "CB",         idMoyen: "497010XXXXXX5521", dateExpiration: "03/2026", dateCreation: "23/03/2026", email: "sophie.b@gmail.com",     telephone: "+33 6 23 45 67 89", adresse: "3 place Bellecour",    codePostal: "69002", ville: "Lyon",             daysAgo: 10 },
  { id: "ALIAS-8845401", abonnements: 1, status: "paiement", reference: "CUST-4501", moyen: "Mastercard", idMoyen: "530101XXXXXX1290", dateExpiration: "02/2026", dateCreation: "28/03/2026", email: "pierre.l@outlook.fr",   telephone: "+33 7 12 34 56 78", adresse: "15 cours Mirabeau",    codePostal: "13100", ville: "Aix-en-Provence", daysAgo: 5  },
  { id: "ALIAS-8845152", abonnements: 0, status: null,       reference: "CUST-4517", moyen: "Apple Pay",  idMoyen: "DEVICE-XXXX-3390", dateExpiration: "N/A",       dateCreation: "01/04/2026", email: "emma.r@gmail.com",       telephone: "+33 6 98 76 54 32", adresse: "22 bd Haussmann",      codePostal: "75008", ville: "Paris",            daysAgo: 2  },
];

const ABONNEMENTS_DATA: Record<string, AbonnementRow[]> = {
  "ALIAS-8845210": [
    { reference: "ABNO-5512", dateCreation: "03/03/2026", dateEffet: "01/04/2026", dateResiliation: "N/A", echeancesTraitees: 3, echeancesTotales: 12, montantFixe: "49,90 €", montantInitial: "49,90 €", referenceCommande: "CMD-88452", validation: "Automatique", alias: "ALIAS-8845210", nomAcheteur: "Alice Dupont",  emailBoutique: "shop@exemple.fr",     referenceAcheteur: "CUST-4471" },
    { reference: "ABNO-5513", dateCreation: "15/03/2026", dateEffet: "15/04/2026", dateResiliation: "N/A", echeancesTraitees: 2, echeancesTotales: 6,  montantFixe: "19,90 €", montantInitial: "0,00 €",  referenceCommande: "CMD-88453", validation: "Manuelle",     alias: "ALIAS-8845210", nomAcheteur: "Alice Dupont",  emailBoutique: "shop@exemple.fr",     referenceAcheteur: "CUST-4471" },
  ],
  "ALIAS-8845577": [
    { reference: "ABNO-5489", dateCreation: "08/03/2026", dateEffet: "01/04/2026", dateResiliation: "N/A", echeancesTraitees: 3, echeancesTotales: 12, montantFixe: "29,90 €", montantInitial: "29,90 €", referenceCommande: "CMD-88577", validation: "Automatique", alias: "ALIAS-8845577", nomAcheteur: "Marc Dupont",   emailBoutique: "boutique@exemple.fr", referenceAcheteur: "CUST-4460" },
  ],
  "ALIAS-8844902": [
    { reference: "ABNO-5401", dateCreation: "22/02/2026", dateEffet: "01/03/2026", dateResiliation: "N/A", echeancesTraitees: 5, echeancesTotales: 24, montantFixe: "9,99 €",  montantInitial: "9,99 €",  referenceCommande: "CMD-88490", validation: "Automatique", alias: "ALIAS-8844902", nomAcheteur: "Jean Martin",   emailBoutique: "shop@exemple.fr",     referenceAcheteur: "CUST-4419" },
  ],
  "ALIAS-8845401": [
    { reference: "ABNO-5521", dateCreation: "28/03/2026", dateEffet: "01/05/2026", dateResiliation: "N/A", echeancesTraitees: 1, echeancesTotales: 12, montantFixe: "99,00 €", montantInitial: "0,00 €",  referenceCommande: "CMD-88540", validation: "Manuelle",     alias: "ALIAS-8845401", nomAcheteur: "Pierre Laurent",emailBoutique: "shop@exemple.fr",     referenceAcheteur: "CUST-4501" },
  ],
};

const DATE_OPTIONS: { label: string; days: number }[] = [
  { label: "Aujourd'hui",       days: 1   },
  { label: "Hier",              days: 2   },
  { label: "7 derniers jours",  days: 7   },
  { label: "30 derniers jours", days: 30  },
  { label: "3 derniers mois",   days: 90  },
  { label: "Cette année",       days: 365 },
];

const MOYEN_OPTIONS = ["CB", "Mastercard", "BDD", "Apple Pay"];
const STATUT_OPTIONS: { value: NonNullable<Status>; label: string; dot: string }[] = [
  { value: "actif",    label: "Actif",               dot: PN.green  },
  { value: "inactif",  label: "Inactif",             dot: PN.red    },
  { value: "nouveau",  label: "Nouveau",             dot: PN.blue   },
  { value: "paiement", label: "En attente paiement", dot: PN.amber  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STYLE CONSTANTS
───────────────────────────────────────────────────────────────────────────── */
const TH: React.CSSProperties = {
  padding: "13px 16px",
  textAlign: "left",
  fontSize: 11,
  fontWeight: 700,
  color: PN.ink3,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  fontFamily: FONT,
  background: PN.surf,
  borderBottom: `1px solid ${PN.bord}`,
};

const TD: React.CSSProperties = {
  padding: "14px 16px",
  fontSize: 13,
  color: PN.ink,
  fontFamily: FONT,
  borderBottom: `1px solid ${PN.bord}`,
  verticalAlign: "middle",
  background: "#fff",
  whiteSpace: "nowrap",
};

const SUB_TH: React.CSSProperties = {
  padding: "10px 14px",
  textAlign: "left",
  fontSize: 10.5,
  fontWeight: 700,
  color: PN.primary,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  fontFamily: FONT,
  background: PN.primaryBg,
  borderBottom: `1px solid ${PN.bord}`,
};

const SUB_TD: React.CSSProperties = {
  padding: "11px 14px",
  fontSize: 12.5,
  color: PN.ink,
  fontFamily: FONT,
  borderBottom: `1px solid ${PN.surf}`,
  verticalAlign: "middle",
  background: "#fff",
  whiteSpace: "nowrap",
};

const NCOLS = 14; // main table columns including actions

/* ─────────────────────────────────────────────────────────────────────────────
   CONTEXT MENUS
───────────────────────────────────────────────────────────────────────────── */
type MenuItem = {
  label: string;
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  color: string;
  separator?: boolean;
};

function ContextMenu({ rect, items, onClose, onItemClick }: { rect: DOMRect; items: MenuItem[]; onClose: () => void; onItemClick?: (label: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return createPortal(
    <div ref={ref} style={{
      position: "fixed", top: rect.bottom + 4,
      right: window.innerWidth - rect.right,
      zIndex: 9999, background: "#fff",
      border: `1px solid ${PN.bord}`, borderRadius: PN.r.md,
      boxShadow: "0 8px 24px rgba(11,26,52,0.13), 0 2px 8px rgba(11,26,52,0.06)",
      minWidth: 248, overflow: "hidden",
    }}>
      {items.map(({ label, Icon, color, separator }) => (
        <div key={label}>
          {separator && <div style={{ height: 1, background: PN.bord, margin: "3px 0" }} />}
          <button onClick={() => { onItemClick?.(label); onClose(); }} className="pn-filter-opt" style={{
            display: "flex", alignItems: "center", gap: 10,
            width: "100%", padding: "10px 16px",
            border: "none", background: "transparent", cursor: "pointer",
            fontSize: 13.5, fontFamily: FONT, color, textAlign: "left",
          }}>
            <Icon size={14} strokeWidth={2} />
            {label}
          </button>
        </div>
      ))}
    </div>,
    document.body
  );
}

const ALIAS_MENU_ITEMS: MenuItem[] = [
  { label: "Voir le détail de l'alias",          Icon: Eye,        color: PN.ink     },
  { label: "Modifier les infos acheteur",         Icon: Pencil,     color: PN.ink     },
  { label: "Mettre à jour le moyen de paiement", Icon: CreditCard, color: PN.ink     },
  { label: "Créer un abonnement",                Icon: Plus,       color: PN.primary },
  { label: "Résilier l'alias",                   Icon: Ban,        color: PN.red, separator: true },
];

const ABONNEMENT_MENU_ITEMS: MenuItem[] = [
  { label: "Voir le détail de l'abonnement", Icon: Eye,      color: PN.ink     },
  { label: "Modifier l'abonnement",          Icon: Pencil,   color: PN.ink     },
  { label: "Voir l'échéancier",              Icon: Calendar, color: PN.primary },
  { label: "Résilier",                       Icon: Ban,      color: PN.red, separator: true },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ALIAS PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function AliasPage() {
  const [search, setSearch]               = useState("");
  const [moyenFilter, setMoyenFilter]     = useState<string[]>([]);
  const [statutFilter, setStatutFilter]   = useState<NonNullable<Status>[]>([]);
  const [dateFilter, setDateFilter]       = useState("");
  const [refFilter, setRefFilter]         = useState("");
  const [idMoyenFilter, setIdMoyenFilter] = useState("");
  const [showExtras, setShowExtras]       = useState(false);
  const [rowsPerPage, setRowsPerPage]     = useState(20);
  const [page, setPage]                   = useState(1);
  const [expandedRow, setExpandedRow]     = useState<string | null>(null);
  const [openAliasMenu, setOpenAliasMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const [openAbnoMenu, setOpenAbnoMenu]   = useState<{ ref: string; rect: DOMRect } | null>(null);
  const [detailAliasId,    setDetailAliasId]    = useState<string | null>(null);
  const [detailAbnoRef,    setDetailAbnoRef]    = useState<string | null>(null);
  const [buyerEditId,      setBuyerEditId]      = useState<string | null>(null);
  const [paymentUpdateId,  setPaymentUpdateId]  = useState<string | null>(null);
  const [createSubId,      setCreateSubId]      = useState<string | null>(null);
  const [resiliateAliasId, setResiliateAliasId] = useState<string | null>(null);
  const [editSubRef,       setEditSubRef]       = useState<string | null>(null);
  const [scheduleRef,      setScheduleRef]      = useState<string | null>(null);
  const [resiliateSubRef,  setResiliateSubRef]  = useState<string | null>(null);

  const actionsColStyle: React.CSSProperties = { position: "sticky", right: 0, zIndex: 2, boxShadow: "-4px 0 8px rgba(11,26,52,0.04)" };

  const toggleRow = (id: string) => setExpandedRow(prev => prev === id ? null : id);

  const filtered = ALIAS_DATA.filter(row => {
    if (moyenFilter.length > 0 && !moyenFilter.includes(row.moyen)) return false;
    if (statutFilter.length > 0 && !statutFilter.includes(row.status as NonNullable<Status>)) return false;
    if (dateFilter) {
      const found = DATE_OPTIONS.find(d => d.label === dateFilter);
      if (found && row.daysAgo > found.days) return false;
    }
    if (refFilter && !row.reference.toLowerCase().includes(refFilter.toLowerCase())) return false;
    if (idMoyenFilter && !row.idMoyen.toLowerCase().includes(idMoyenFilter.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!row.id.toLowerCase().includes(q) && !row.reference.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageRows   = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const resetAll = () => {
    setMoyenFilter([]); setStatutFilter([]); setDateFilter("");
    setRefFilter(""); setIdMoyenFilter(""); setSearch(""); setShowExtras(false); setPage(1);
  };

  const anyFilter = moyenFilter.length > 0 || statutFilter.length > 0 || dateFilter !== "" || refFilter !== "" || idMoyenFilter !== "";
  const toggleMoyen  = (v: string)               => { setMoyenFilter(p  => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);  setPage(1); };
  const toggleStatut = (v: NonNullable<Status>)  => { setStatutFilter(p => p.includes(v) ? p.filter(x => x !== v) : [...p, v]);  setPage(1); };

  return (
    <PayNowShell activePage="alias">
      <div style={{ padding: "44px 44px 60px", background: PN.bg }}>

        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, gap: 16 }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: PN.primary, letterSpacing: "-0.035em", fontFamily: FONT }}>
            Alias plateforme
          </h1>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 20px", background: PN.primary, color: "#fff",
            border: "none", borderRadius: PN.r.md,
            fontSize: 13.5, fontWeight: 700, cursor: "pointer",
            fontFamily: FONT, whiteSpace: "nowrap",
            boxShadow: "0 3px 12px rgba(59,126,248,0.35)", letterSpacing: "-0.01em",
          }}>
            <Plus size={16} strokeWidth={2.5} />
            Créer un alias plateforme
          </button>
        </div>

        {/* ── Filter bar ── */}
        <style suppressHydrationWarning>{`
          .pn-tool-label { max-width:0; overflow:hidden; opacity:0; transition:max-width 0.2s ease,opacity 0.15s,margin-left 0.15s; display:inline-block; white-space:nowrap; font-size:13px; font-family:'Manrope',sans-serif; font-weight:600; margin-left:0; color:#3A5070; vertical-align:middle; }
          .pn-tool-btn:hover { background:#EBF2FF !important; }
          .pn-tool-btn:hover .pn-tool-label { max-width:80px; opacity:1; margin-left:7px; }
          .pn-sub-tr { cursor:pointer; }
          .pn-sub-tr td { transition:background 0.12s; }
          .pn-sub-tr:hover td { background:#F4F7FF !important; }
        `}</style>

        <div style={{
          display: "flex", alignItems: "center",
          background: "#fff", border: `1px solid ${PN.bord}`,
          borderRadius: PN.r.md, marginBottom: 16, height: 50,
          overflow: "visible", position: "relative",
          boxShadow: "0 1px 6px rgba(11,26,52,0.04)",
        }}>
          <FilterDropdown label="Moyen de paiement" active={moyenFilter.length > 0} count={moyenFilter.length || undefined} onClear={() => { setMoyenFilter([]); setPage(1); }}>
            <DropHeader title="Moyen de paiement" />
            {MOYEN_OPTIONS.map(opt => (
              <CheckOpt key={opt} label={opt} checked={moyenFilter.includes(opt)} onChange={() => toggleMoyen(opt)} />
            ))}
          </FilterDropdown>

          <Sep />

          <DateCreationDropdown value={dateFilter} onSelect={v => { setDateFilter(v); setPage(1); }} onClear={() => { setDateFilter(""); setPage(1); }} />

          <Sep />

          <FilterDropdown label="Statut" active={statutFilter.length > 0} count={statutFilter.length || undefined} onClear={() => { setStatutFilter([]); setPage(1); }}>
            <DropHeader title="Statut" />
            {STATUT_OPTIONS.map(opt => (
              <CheckOpt key={opt.value} label={opt.label} checked={statutFilter.includes(opt.value)} onChange={() => toggleStatut(opt.value)} dot={opt.dot} />
            ))}
          </FilterDropdown>

          <Sep />

          <button
            onClick={() => setShowExtras(e => !e)}
            style={{
              alignSelf: "stretch", display: "flex", alignItems: "center", gap: 7,
              padding: "0 15px", border: "none",
              background: showExtras ? PN.primaryBg : "transparent",
              fontSize: 13.5, fontWeight: showExtras ? 700 : 500,
              color: showExtras ? PN.primary : PN.ink3,
              cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap",
            }}
          >
            <SlidersHorizontal size={14} />
            Autres filtres
            {(refFilter !== "" || idMoyenFilter !== "") && (
              <span style={{ background: PN.primary, color: "#fff", fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: PN.r.full, marginLeft: 2 }}>
                {(refFilter !== "" ? 1 : 0) + (idMoyenFilter !== "" ? 1 : 0)}
              </span>
            )}
          </button>

          <Sep />

          <div style={{ flex: 1, alignSelf: "stretch", display: "flex", alignItems: "center", gap: 9, padding: "0 14px" }}>
            <Search size={14} style={{ color: PN.ink3, flexShrink: 0 }} />
            <input
              type="text" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Rechercher un ID alias ou un mail"
              style={{ border: "none", background: "transparent", fontSize: 13.5, color: PN.ink, fontFamily: FONT, width: "100%", fontWeight: 500, outline: "none" }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                <X size={14} style={{ color: PN.ink3 }} />
              </button>
            )}
          </div>

          {anyFilter && (
            <>
              <Sep />
              <button onClick={resetAll} style={{ alignSelf: "stretch", display: "flex", alignItems: "center", gap: 5, border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, color: PN.primary, padding: "0 14px", fontFamily: FONT, whiteSpace: "nowrap" }}>
                <X size={13} /> Réinitialiser
              </button>
            </>
          )}

          <Sep />

          <button className="pn-tool-btn" title="Rafraîchir" style={{ alignSelf: "stretch", display: "flex", alignItems: "center", padding: "0 14px", border: "none", background: "transparent", cursor: "pointer" }}>
            <RefreshCw size={15} style={{ color: PN.ink3, flexShrink: 0 }} />
            <span className="pn-tool-label">Rafraîchir</span>
          </button>

          <button className="pn-tool-btn" title="Colonnes" style={{ alignSelf: "stretch", display: "flex", alignItems: "center", padding: "0 14px", border: "none", background: "transparent", cursor: "pointer", borderRadius: `0 ${PN.r.md}px ${PN.r.md}px 0` }}>
            <Columns2 size={15} style={{ color: PN.ink3, flexShrink: 0 }} />
            <span className="pn-tool-label">Colonnes</span>
          </button>
        </div>

        {/* ── Autres filtres panel ── */}
        {showExtras && (
          <div style={{ background: "#fff", border: `1px solid ${PN.bord}`, borderRadius: PN.r.md, padding: "20px 24px", marginBottom: 16, display: "flex", alignItems: "flex-start", flexWrap: "wrap", gap: 20, boxShadow: "0 1px 6px rgba(11,26,52,0.04)" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: PN.ink3, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT, flexBasis: "100%", marginBottom: -4 }}>
              Filtres avancés
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: PN.ink3, marginBottom: 6, fontFamily: FONT }}>Référence de l&apos;acheteur</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: PN.surf, border: `1px solid ${refFilter ? PN.primary : PN.bord}`, borderRadius: PN.r.md, padding: "8px 14px", width: 220 }}>
                <Search size={13} style={{ color: PN.ink3 }} />
                <input type="text" value={refFilter} onChange={e => { setRefFilter(e.target.value); setPage(1); }} placeholder="Ex : CUST-4471" style={{ border: "none", background: "transparent", fontSize: 13, color: PN.ink, fontFamily: FONT, width: "100%", fontWeight: 500, outline: "none" }} />
                {refFilter && <button onClick={() => setRefFilter("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}><X size={13} style={{ color: PN.ink3 }} /></button>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: PN.ink3, marginBottom: 6, fontFamily: FONT }}>ID du moyen de paiement</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: PN.surf, border: `1px solid ${idMoyenFilter ? PN.primary : PN.bord}`, borderRadius: PN.r.md, padding: "8px 14px", width: 240 }}>
                <Search size={13} style={{ color: PN.ink3 }} />
                <input type="text" value={idMoyenFilter} onChange={e => { setIdMoyenFilter(e.target.value); setPage(1); }} placeholder="Ex : 497010XXXXXX6142" style={{ border: "none", background: "transparent", fontSize: 13, color: PN.ink, fontFamily: FONT, width: "100%", fontWeight: 500, outline: "none" }} />
                {idMoyenFilter && <button onClick={() => setIdMoyenFilter("")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0, display: "flex" }}><X size={13} style={{ color: PN.ink3 }} /></button>}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: PN.ink3, marginBottom: 6, fontFamily: FONT }}>Date d&apos;expiration</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: PN.surf, border: `1px solid ${PN.bord}`, borderRadius: PN.r.md, padding: "8px 14px", width: 150 }}>
                <input type="text" placeholder="MM/AAAA" style={{ border: "none", background: "transparent", fontSize: 13, color: PN.ink, fontFamily: FONT, width: "100%", fontWeight: 500, outline: "none" }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: PN.ink3, marginBottom: 6, fontFamily: FONT }}>Pays</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: PN.surf, border: `1px solid ${PN.bord}`, borderRadius: PN.r.md, padding: "8px 14px", width: 170, cursor: "pointer" }}>
                <span style={{ fontSize: 13, color: PN.ink3, fontFamily: FONT, flex: 1 }}>Tous les pays</span>
                <ChevronDown size={13} style={{ color: PN.ink4 }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Table ── */}
        <div style={{ background: "#fff", border: `1px solid ${PN.bord}`, borderRadius: PN.r.xl, overflow: "clip", boxShadow: "0 2px 12px rgba(11,26,52,0.06)" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1500 }}>
              <thead>
                <tr>
                  <th style={TH}>ID Alias</th>
                  <th style={TH}>Abonnements</th>
                  <th style={TH}>Statut</th>
                  <th style={TH}>Référence acheteur</th>
                  <th style={TH}>Moyen de paiement</th>
                  <th style={TH}>ID moyen de paiement</th>
                  <th style={TH}>Date d&apos;expiration</th>
                  <th style={TH}>Date de création</th>
                  <th style={TH}>E-mail</th>
                  <th style={TH}>Téléphone</th>
                  <th style={TH}>Adresse</th>
                  <th style={TH}>Code postal</th>
                  <th style={TH}>Ville</th>
                  <th style={{ ...TH, textAlign: "center", ...actionsColStyle }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td colSpan={NCOLS} style={{ ...TD, textAlign: "center", padding: "48px 20px", color: PN.ink3 }}>
                      <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: PN.ink2 }}>Aucun alias trouvé</div>
                      <div style={{ fontSize: 13 }}>Essayez d&apos;ajuster vos filtres</div>
                    </td>
                  </tr>
                ) : pageRows.map(row => (
                  <>
                    <tr key={row.id} className="pn-tr" onClick={() => setDetailAliasId(row.id)} style={{ cursor:"pointer" }}>
                      {/* ID Alias */}
                      <td style={TD}>
                        <span style={{ fontWeight: 700, color: PN.navy, fontSize: 13, letterSpacing: "-0.01em", fontFamily: "monospace" }}>
                          {row.id}
                        </span>
                      </td>

                      {/* Abonnements — cliquable si > 0 */}
                      <td style={TD}>
                        {row.abonnements === 0 ? (
                          <span style={{ fontSize: 13, color: PN.ink3, fontFamily: FONT }}>0 abonnement</span>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); toggleRow(row.id); }}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", color: PN.primary, fontWeight: 700, fontSize: 13, fontFamily: FONT, padding: 0 }}
                          >
                            {row.abonnements} abonnement{row.abonnements > 1 ? "s" : ""} associé{row.abonnements > 1 ? "s" : ""}
                            <ChevronDown
                              size={14}
                              style={{ transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)", transform: expandedRow === row.id ? "rotate(180deg)" : "none" }}
                            />
                          </button>
                        )}
                      </td>

                      {/* Statut */}
                      <td style={TD}><StatusBadge status={row.status} /></td>

                      {/* Référence */}
                      <td style={TD}><span style={{ fontSize: 13, color: PN.ink2, fontWeight: 500 }}>{row.reference}</span></td>

                      {/* Moyen de paiement */}
                      <td style={TD}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {PM_ICONS[row.moyen]}
                          <span style={{ fontSize: 13, color: PN.ink2, fontWeight: 600 }}>{row.moyen}</span>
                        </div>
                      </td>

                      {/* ID moyen */}
                      <td style={TD}><span style={{ fontSize: 12, color: PN.ink3, fontFamily: "monospace", letterSpacing: "0.02em" }}>{row.idMoyen}</span></td>

                      {/* Date expiration */}
                      <td style={TD}><span style={{ color: PN.ink3 }}>{row.dateExpiration}</span></td>

                      {/* Date création */}
                      <td style={TD}><span style={{ color: PN.ink2 }}>{row.dateCreation}</span></td>

                      {/* E-mail */}
                      <td style={TD}><span style={{ color: PN.ink2 }}>{row.email}</span></td>

                      {/* Téléphone */}
                      <td style={TD}><span style={{ color: PN.ink2, fontFamily: "monospace", fontSize: 12 }}>{row.telephone}</span></td>

                      {/* Adresse */}
                      <td style={TD}><span style={{ color: PN.ink2 }}>{row.adresse}</span></td>

                      {/* Code postal */}
                      <td style={TD}><span style={{ color: PN.ink3, fontFamily: "monospace", fontSize: 12 }}>{row.codePostal}</span></td>

                      {/* Ville */}
                      <td style={TD}><span style={{ color: PN.ink2, fontWeight: 600 }}>{row.ville}</span></td>

                      {/* Actions — sticky uniquement quand aucune ligne n'est dépliée */}
                      <td style={{ ...TD, textAlign: "center", ...actionsColStyle }}>
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            const r = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            setOpenAliasMenu(prev => prev?.id === row.id ? null : { id: row.id, rect: r });
                          }}
                          style={{ border: `1px solid ${openAliasMenu?.id === row.id ? PN.primary : PN.bord}`, background: openAliasMenu?.id === row.id ? PN.primaryBg : "#fff", borderRadius: PN.r.md, padding: "6px 8px", cursor: "pointer", display: "inline-flex", alignItems: "center", transition: "all 0.12s" }}
                        >
                          <MoreHorizontal size={16} style={{ color: openAliasMenu?.id === row.id ? PN.primary : PN.ink3 }} />
                        </button>
                      </td>
                    </tr>

                    {/* ── Panel abonnements — toujours dans le DOM, animé via grid-template-rows ── */}
                    <tr key={`${row.id}-exp`}>
                      <td colSpan={NCOLS} style={{ padding: 0, border: "none" }}>
                        <div style={{
                          display: "grid",
                          gridTemplateRows: expandedRow === row.id ? "1fr" : "0fr",
                          transition: "grid-template-rows 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}>
                          <div style={{ minHeight: 0, overflow: "hidden" }}>
                            <div style={{ padding: "16px 20px 20px", background: "#fff", borderTop: `1px solid ${PN.bord}`, borderBottom: `2px solid ${PN.bord}` }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: PN.primary, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: FONT, marginBottom: 12 }}>
                                Abonnements associés à {row.id}
                              </div>
                              <div style={{ overflowX: "auto", borderRadius: PN.r.md, border: `1px solid ${PN.bord}`, background: "#fff", boxShadow: "0 1px 6px rgba(11,26,52,0.05)" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1300 }}>
                                  <thead>
                                    <tr>
                                      <th style={SUB_TH}>Référence</th>
                                      <th style={SUB_TH}>Date de création</th>
                                      <th style={SUB_TH}>Date d&apos;effet</th>
                                      <th style={SUB_TH}>Date de résiliation</th>
                                      <th style={SUB_TH}>Échéances traitées</th>
                                      <th style={SUB_TH}>Échéances totales</th>
                                      <th style={SUB_TH}>Montant fixe</th>
                                      <th style={SUB_TH}>Montant initial</th>
                                      <th style={SUB_TH}>Réf. commande</th>
                                      <th style={SUB_TH}>Validation</th>
                                      <th style={SUB_TH}>Alias</th>
                                      <th style={SUB_TH}>Nom acheteur</th>
                                      <th style={SUB_TH}>Email boutique</th>
                                      <th style={SUB_TH}>Réf. acheteur</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(ABONNEMENTS_DATA[row.id] ?? []).map((ab, i, arr) => {
                                      const brd = i < arr.length - 1 ? `1px solid ${PN.surf}` : "none";
                                      return (
                                        <tr
                                          key={ab.reference}
                                          className="pn-sub-tr"
                                          onClick={() => setDetailAbnoRef(ab.reference)}
                                        >
                                          <td style={{ ...SUB_TD, borderBottom: brd, fontFamily: "monospace", fontWeight: 700, color: PN.primary }}>{ab.reference}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd }}>{ab.dateCreation}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd }}>{ab.dateEffet}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, color: PN.ink3 }}>{ab.dateResiliation}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, fontWeight: 700 }}>{ab.echeancesTraitees}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, color: PN.ink3 }}>{ab.echeancesTotales}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, fontWeight: 700 }}>{ab.montantFixe}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, color: PN.ink3 }}>{ab.montantInitial}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, fontFamily: "monospace" }}>{ab.referenceCommande}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd }}>
                                            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "2px 8px", borderRadius: PN.r.full, background: ab.validation === "Automatique" ? PN.greenBg : PN.amberBg, color: ab.validation === "Automatique" ? PN.greenText : PN.amberText }}>{ab.validation}</span>
                                          </td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, fontFamily: "monospace", fontSize: 11.5, color: PN.ink3 }}>{ab.alias}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd }}>{ab.nomAcheteur}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, color: PN.ink3 }}>{ab.emailBoutique}</td>
                                          <td style={{ ...SUB_TD, borderBottom: brd, fontFamily: "monospace", fontSize: 11.5, color: PN.ink3 }}>{ab.referenceAcheteur}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderTop: `1px solid ${PN.bord}`, background: "#fff", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 13.5, color: PN.ink3, fontFamily: FONT }}>
              {filtered.length === 0 ? "0" : `${(page - 1) * rowsPerPage + 1} à ${Math.min(page * rowsPerPage, filtered.length)}`} sur {filtered.length}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: `1px solid ${PN.bord}`, borderRadius: PN.r.md, background: "#fff", cursor: page === 1 ? "default" : "pointer", fontSize: 13.5, color: page === 1 ? PN.ink4 : PN.ink2, fontFamily: FONT, fontWeight: 500 }}>
                <ChevronLeft size={14} /> Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{ width: 36, height: 36, border: `1.5px solid ${n === page ? PN.primary : PN.bord}`, borderRadius: PN.r.md, background: n === page ? PN.primaryBg : "#fff", color: n === page ? PN.primary : PN.ink2, fontSize: 13.5, fontWeight: n === page ? 800 : 500, cursor: "pointer", fontFamily: FONT }}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", border: `1px solid ${PN.bord}`, borderRadius: PN.r.md, background: "#fff", cursor: page === totalPages ? "default" : "pointer", fontSize: 13.5, color: page === totalPages ? PN.ink4 : PN.ink2, fontFamily: FONT, fontWeight: 500 }}>
                Suivant <ChevronRight size={14} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13.5, color: PN.ink3, fontFamily: FONT }}>Lignes par page :</span>
              <select value={rowsPerPage} onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(1); }} style={{ border: `1px solid ${PN.bord}`, borderRadius: PN.r.md, padding: "6px 10px", background: "#fff", cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: PN.ink2, fontFamily: FONT, outline: "none" }}>
                {[10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Context menus (portals) ── */}
      {openAliasMenu && (
        <ContextMenu
          rect={openAliasMenu.rect}
          items={ALIAS_MENU_ITEMS}
          onClose={() => setOpenAliasMenu(null)}
          onItemClick={label => {
            const id = openAliasMenu.id;
            if (label === "Voir le détail de l'alias")          setDetailAliasId(id);
            else if (label === "Modifier les infos acheteur")    setBuyerEditId(id);
            else if (label === "Mettre à jour le moyen de paiement") setPaymentUpdateId(id);
            else if (label === "Créer un abonnement")            setCreateSubId(id);
            else if (label === "Résilier l'alias")              setResiliateAliasId(id);
          }}
        />
      )}
      {openAbnoMenu && (
        <ContextMenu
          rect={openAbnoMenu.rect}
          items={ABONNEMENT_MENU_ITEMS}
          onClose={() => setOpenAbnoMenu(null)}
          onItemClick={label => {
            const ref = openAbnoMenu.ref;
            if (label === "Voir le détail de l'abonnement") setDetailAbnoRef(ref);
            else if (label === "Modifier l'abonnement")     setEditSubRef(ref);
            else if (label === "Voir l'échéancier")         setScheduleRef(ref);
            else if (label === "Résilier")                  setResiliateSubRef(ref);
          }}
        />
      )}
      {/* ── Alias detail ── */}
      {detailAliasId && (() => {
        const d = ALIAS_DATA.find(r => r.id === detailAliasId);
        return d ? <AliasDetailDrawer data={d as AliasDetailData} onClose={() => setDetailAliasId(null)} /> : null;
      })()}

      {/* ── Abonnement detail ── */}
      {detailAbnoRef && (() => {
        let ab: AbonnementDetailData | undefined;
        for (const rows of Object.values(ABONNEMENTS_DATA)) {
          const found = rows.find(r => r.reference === detailAbnoRef);
          if (found) { ab = found as AbonnementDetailData; break; }
        }
        return ab ? <AbonnementDetailDrawer data={ab} onClose={() => setDetailAbnoRef(null)} /> : null;
      })()}

      {/* ── Modifier infos acheteur ── */}
      {buyerEditId && (() => {
        const d = ALIAS_DATA.find(r => r.id === buyerEditId);
        return d ? <BuyerEditDrawer aliasId={d.id} email={d.email} onClose={() => setBuyerEditId(null)} /> : null;
      })()}

      {/* ── Mettre à jour moyen de paiement ── */}
      {paymentUpdateId && (() => {
        const d = ALIAS_DATA.find(r => r.id === paymentUpdateId);
        return d ? <PaymentUpdateDrawer aliasId={d.id} currentCard={d.idMoyen} onClose={() => setPaymentUpdateId(null)} /> : null;
      })()}

      {/* ── Créer un abonnement ── */}
      {createSubId && (() => {
        const d = ALIAS_DATA.find(r => r.id === createSubId);
        return d ? <CreateSubscriptionDrawer aliasId={d.id} email={d.email} onClose={() => setCreateSubId(null)} /> : null;
      })()}

      {/* ── Résilier alias ── */}
      {resiliateAliasId && (
        <ConfirmDialog
          title="Résilier l'alias"
          message={`Voulez-vous résilier l'alias ${resiliateAliasId} ? Cette action est irréversible et supprimera l'accès aux moyens de paiement associés.`}
          confirmLabel="Résilier"
          confirmColor={PN.red}
          onConfirm={() => setResiliateAliasId(null)}
          onCancel={() => setResiliateAliasId(null)}
        />
      )}

      {/* ── Modifier abonnement ── */}
      {editSubRef && (() => {
        let ab: AbonnementDetailData | undefined;
        for (const rows of Object.values(ABONNEMENTS_DATA)) {
          const found = rows.find(r => r.reference === editSubRef);
          if (found) { ab = found as AbonnementDetailData; break; }
        }
        if (!ab) return null;
        return (
          <EditSubscriptionDrawer
            reference={ab.reference}
            montant={ab.montantFixe}
            frequence="Mensuel"
            validation={ab.validation}
            onClose={() => setEditSubRef(null)}
          />
        );
      })()}

      {/* ── Voir l'échéancier ── */}
      {scheduleRef && (() => {
        let ab: AbonnementDetailData | undefined;
        for (const rows of Object.values(ABONNEMENTS_DATA)) {
          const found = rows.find(r => r.reference === scheduleRef);
          if (found) { ab = found as AbonnementDetailData; break; }
        }
        return ab ? (
          <ScheduleDrawer
            reference={ab.reference}
            montant={ab.montantFixe}
            frequence="Mensuel"
            dateEffet={ab.dateEffet}
            onClose={() => setScheduleRef(null)}
          />
        ) : null;
      })()}

      {/* ── Résilier abonnement ── */}
      {resiliateSubRef && (
        <ConfirmDialog
          title="Résilier l'abonnement"
          message={`Voulez-vous résilier l'abonnement ${resiliateSubRef} ? Les prélèvements futurs seront annulés.`}
          confirmLabel="Résilier"
          confirmColor={PN.red}
          onConfirm={() => setResiliateSubRef(null)}
          onCancel={() => setResiliateSubRef(null)}
        />
      )}
    </PayNowShell>
  );
}
