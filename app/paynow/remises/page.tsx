"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ChevronDown, Search, MoreHorizontal,
  ChevronLeft, ChevronRight, RefreshCw, Columns2,
  Check, X, ArrowUpDown, Zap, Building2,
  Eye, RotateCcw, Download,
} from "lucide-react";
import { PayNowShell, PN, FONT } from "../_shell";
import { RemiseDetailDrawer, ConfirmDialog, type RemiseDetailData } from "../_drawers";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────────────────────────────────────────── */
type StatutRemise = "en_cours" | "envoyee" | "acceptee" | "refusee";

interface Remise {
  id: number; reference: string; date: string;
  banque: string; nbTx: number; montant: number; statut: StatutRemise;
}

const DATA: Remise[] = [
  { id:1, reference:"REM-2026-0847", date:"31/07/26", banque:"Société Générale", nbTx:124, montant:47892.00, statut:"acceptee" },
  { id:2, reference:"REM-2026-0846", date:"30/07/26", banque:"Crédit Agricole",  nbTx:89,  montant:31450.50, statut:"envoyee"  },
  { id:3, reference:"REM-2026-0845", date:"29/07/26", banque:"BNP Paribas",      nbTx:203, montant:82310.00, statut:"acceptee" },
  { id:4, reference:"REM-2026-0844", date:"28/07/26", banque:"Société Générale", nbTx:67,  montant:18920.75, statut:"refusee"  },
  { id:5, reference:"REM-2026-0843", date:"27/07/26", banque:"Crédit Agricole",  nbTx:156, montant:59840.00, statut:"acceptee" },
  { id:6, reference:"REM-2026-0842", date:"26/07/26", banque:"BNP Paribas",      nbTx:91,  montant:27650.25, statut:"en_cours" },
  { id:7, reference:"REM-2026-0841", date:"25/07/26", banque:"CIC",              nbTx:44,  montant:14220.00, statut:"acceptee" },
  { id:8, reference:"REM-2026-0840", date:"24/07/26", banque:"Société Générale", nbTx:112, montant:38760.50, statut:"acceptee" },
];

const PER_PAGE = 10;

/* ─────────────────────────────────────────────────────────────────────────────
   STATUT BADGE
───────────────────────────────────────────────────────────────────────────── */
const STATUT_CFG: Record<StatutRemise, { label:string; bg:string; text:string; dot:string }> = {
  en_cours: { label:"En cours",  bg:PN.blueBg,   text:PN.blueText,  dot:PN.blue  },
  envoyee:  { label:"Envoyée",   bg:PN.amberBg,  text:PN.amberText, dot:PN.amber },
  acceptee: { label:"Acceptée",  bg:PN.greenBg,  text:PN.greenText, dot:PN.green },
  refusee:  { label:"Refusée",   bg:PN.redBg,    text:PN.redText,   dot:PN.red   },
};

function StatutBadge({ statut }: { statut: StatutRemise }) {
  const c = STATUT_CFG[statut];
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:c.bg, color:c.text, borderRadius:PN.r.full, padding:"3px 10px 3px 7px", fontSize:12, fontWeight:600, fontFamily:FONT, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, flexShrink:0 }} />
      {c.label}
    </span>
  );
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
   FILTER DROPDOWN
───────────────────────────────────────────────────────────────────────────── */
function FilterDropdown({ label, options, value, onSelect, onClear }: {
  label:string; options:string[]; value:string;
  onSelect:(v:string)=>void; onClear:()=>void;
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
      <button onClick={() => setOpen(o=>!o)} style={{
        display:"flex", alignItems:"center", gap:6, padding:"0 14px", height:"100%",
        border:"none", background: open ? PN.surf : active ? PN.primaryBg : "transparent",
        cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
        color: active ? PN.primary : PN.ink2,
        fontSize:13.5, fontWeight: active ? 700 : 500, fontFamily:FONT, transition:"background 0.12s",
      }}>
        <span>{active ? value : label}</span>
        {active
          ? <span onMouseDown={e => { e.stopPropagation(); onClear(); setOpen(false); }} style={{ marginLeft:2, lineHeight:1, cursor:"pointer", opacity:0.7, fontSize:15 }}>×</span>
          : <ChevronDown size={13} style={{ color:PN.ink3, flexShrink:0 }} />
        }
      </button>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 6px)", left:0, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, boxShadow:"0 8px 32px rgba(11,26,52,0.10)", zIndex:200, minWidth:200, overflow:"hidden" }}>
          {options.map(opt => (
            <button key={opt} className="pn-filter-opt" onClick={() => { onSelect(opt); setOpen(false); }} style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              width:"100%", padding:"10px 14px", border:"none",
              background: opt === value ? PN.primaryBg : "transparent",
              cursor:"pointer", fontSize:13.5, fontFamily:FONT,
              color: opt === value ? PN.primary : PN.ink, fontWeight: opt === value ? 600 : 400, textAlign:"left",
            }}>
              {opt}
              {opt === value && <Check size={13} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TABS
───────────────────────────────────────────────────────────────────────────── */
const TABS = [
  { id:"toutes",    label:"Toutes les remises" },
  { id:"en_cours",  label:"En cours" },
  { id:"envoyees",  label:"Envoyées" },
  { id:"acceptees", label:"Acceptées" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   CONTEXT MENU
───────────────────────────────────────────────────────────────────────────── */
function RemiseContextMenu({ x, y, onDetail, onRetransmettre, onExport, onClose }: {
  x:number; y:number;
  onDetail:()=>void; onRetransmettre:()=>void; onExport:()=>void; onClose:()=>void;
}) {
  const ITEMS = [
    { Icon: Eye,       label:"Voir le détail",    action: onDetail,         color: PN.ink },
    { Icon: RotateCcw, label:"Retransmettre",     action: onRetransmettre,  color: PN.amber },
    { Icon: Download,  label:"Exporter (CSV)",    action: onExport,         color: PN.ink },
  ];
  return createPortal(
    <>
      <div style={{ position:"fixed", inset:0, zIndex:8000 }} onClick={onClose} />
      <div style={{ position:"fixed", left:x, top:y, zIndex:8001, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, boxShadow:"0 8px 32px rgba(11,26,52,0.13)", minWidth:190, overflow:"hidden", padding:"4px 0" }}>
        {ITEMS.map(({ Icon, label, action, color }) => (
          <button key={label} onClick={() => { action(); onClose(); }} style={{
            display:"flex", alignItems:"center", gap:10, width:"100%", padding:"10px 16px",
            border:"none", background:"none", cursor:"pointer",
            fontSize:13.5, fontFamily:FONT, color, textAlign:"left",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = PN.surf)}
          onMouseLeave={e => (e.currentTarget.style.background = "none")}>
            <Icon size={14} style={{ flexShrink:0 }} />
            {label}
          </button>
        ))}
      </div>
    </>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function RemisesPage() {
  const [activeTab,  setActiveTab]  = useState("toutes");
  const [search,     setSearch]     = useState("");
  const [banqueVal,  setBanqueVal]  = useState("");
  const [statutVal,  setStatutVal]  = useState("");
  const [dateVal,    setDateVal]    = useState("");
  const [sortDir,    setSortDir]    = useState<"desc"|"asc">("desc");
  const [page,       setPage]       = useState(1);

  /* Drawers / dialogs */
  const [detailData,    setDetailData]    = useState<RemiseDetailData | null>(null);
  const [retransmetId,  setRetransmetId]  = useState<number | null>(null);
  const [menuState,     setMenuState]     = useState<{ row: Remise; x: number; y: number } | null>(null);

  const TAB_STATUT: Record<string, StatutRemise|undefined> = {
    en_cours: "en_cours", envoyees: "envoyee", acceptees: "acceptee",
  };

  const STATUT_FILTER_MAP: Record<string, StatutRemise> = {
    "En cours": "en_cours", "Envoyée": "envoyee", "Acceptée": "acceptee", "Refusée": "refusee",
  };

  let rows = DATA.filter(r => {
    if (activeTab !== "toutes" && TAB_STATUT[activeTab] && r.statut !== TAB_STATUT[activeTab]) return false;
    if (banqueVal && r.banque !== banqueVal) return false;
    if (statutVal && r.statut !== STATUT_FILTER_MAP[statutVal]) return false;
    if (search && !r.reference.toLowerCase().includes(search.toLowerCase()) && !r.banque.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  rows = [...rows].sort((a, b) => {
    const ts = (s:string) => { const [d,m,y] = s.split("/"); return new Date(`20${y}-${m}-${d}`).getTime(); };
    return sortDir === "desc" ? ts(b.date) - ts(a.date) : ts(a.date) - ts(b.date);
  });

  const totalPages = Math.max(1, Math.ceil(rows.length / PER_PAGE));
  const pageRows   = rows.slice((page-1)*PER_PAGE, page*PER_PAGE);

  /* KPI summary */
  const allAcceptees = DATA.filter(r => r.statut === "acceptee");
  const totalMontant = DATA.reduce((s, r) => s + r.montant, 0);
  const txTotal      = DATA.reduce((s, r) => s + r.nbTx, 0);
  const tauxAcc      = Math.round((allAcceptees.length / DATA.length) * 100);

  const openDetail = (row: Remise) => setDetailData({ id:row.id, reference:row.reference, date:row.date, banque:row.banque, nbTx:row.nbTx, montant:row.montant, statut:row.statut });

  const COLS = [
    { label:"N° DE REMISE",   w:200, sort:false },
    { label:"DATE",            w:110, sort:true  },
    { label:"BANQUE",          w:180, sort:false },
    { label:"TRANSACTIONS",    w:130, sort:false },
    { label:"MONTANT",         w:150, sort:false },
    { label:"STATUT",          w:140, sort:false },
    { label:"ACTIONS",         w:64,  sort:false },
  ];

  const retransmetRow = DATA.find(r => r.id === retransmetId);

  return (
    <PayNowShell activePage="remises">
      <div style={{ padding:"44px 44px 60px", background:PN.bg }}>

        {/* HEADER */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28, gap:16 }}>
          <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>
            Remises
          </h1>
          <button style={{
            display:"flex", alignItems:"center", gap:7,
            background:PN.primary, color:"#fff", border:"none",
            borderRadius:PN.r.md, padding:"10px 20px",
            fontSize:13.5, fontWeight:700, fontFamily:FONT,
            cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
            boxShadow:"0 2px 10px rgba(59,126,248,0.32)",
          }}>
            <Zap size={14} strokeWidth={2.5} />
            Forcer une remise
          </button>
        </div>

        {/* KPI ROW */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:16, marginBottom:28 }}>
          {[
            { label:"Remises ce mois",    value:DATA.length.toString(),          sub:"total" },
            { label:"Montant global",     value:fmtMontant(totalMontant),        sub:"EUR" },
            { label:"Taux d'acceptation", value:`${tauxAcc} %`,                  sub:"sur toutes les remises" },
            { label:"Transactions",       value:txTotal.toLocaleString("fr-FR"), sub:"traitées" },
          ].map(kpi => (
            <div key={kpi.label} style={{
              background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md,
              padding:"18px 20px", boxShadow:"0 2px 8px rgba(11,26,52,0.04)",
            }}>
              <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginBottom:6 }}>{kpi.label}</div>
              <div style={{ fontSize:20, fontWeight:800, color:PN.ink, letterSpacing:"-0.03em", fontFamily:FONT }}>{kpi.value}</div>
              <div style={{ fontSize:11, color:PN.ink4, fontFamily:FONT, marginTop:3 }}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display:"flex", alignItems:"center", borderBottom:`1px solid ${PN.bord}`, marginBottom:20 }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setPage(1); }} style={{
              padding:"12px 20px", border:"none", background:"none",
              fontSize:13.5, fontFamily:FONT, cursor:"pointer",
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? PN.primary : PN.ink2,
              borderBottom: activeTab === tab.id ? `2px solid ${PN.primary}` : "2px solid transparent",
              marginBottom:-1, whiteSpace:"nowrap", transition:"color 0.15s",
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* FILTER BAR */}
        <div style={{ display:"flex", alignItems:"center", height:50, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, marginBottom:20, overflow:"visible" }}>
          <FilterDropdown label="Date de remise" options={["Aujourd'hui","7 derniers jours","30 derniers jours","Ce mois-ci","Personnalisée..."]} value={dateVal} onSelect={v => { setDateVal(v); setPage(1); }} onClear={() => setDateVal("")} />
          <Sep />
          <FilterDropdown label="Banque" options={["Société Générale","Crédit Agricole","BNP Paribas","CIC"]} value={banqueVal} onSelect={v => { setBanqueVal(v); setPage(1); }} onClear={() => setBanqueVal("")} />
          <Sep />
          <FilterDropdown label="Statut" options={["En cours","Envoyée","Acceptée","Refusée"]} value={statutVal} onSelect={v => { setStatutVal(v); setPage(1); }} onClear={() => setStatutVal("")} />
          <Sep />
          <div style={{ flex:1, display:"flex", alignItems:"center", gap:8, padding:"0 14px", minWidth:0 }}>
            <Search size={14} style={{ color:PN.ink3, flexShrink:0 }} />
            <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Rechercher une remise..." style={{ border:"none", background:"none", flex:1, fontSize:13.5, fontFamily:FONT, color:PN.ink, outline:"none", minWidth:0 }} />
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
        <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"hidden", boxShadow:"0 2px 12px rgba(11,26,52,0.05)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
              <thead>
                <tr style={{ background:PN.surf, borderBottom:`1px solid ${PN.bord}` }}>
                  {COLS.map(col => (
                    <th key={col.label} onClick={col.sort ? () => setSortDir(d => d==="desc"?"asc":"desc") : undefined} style={{
                      padding:"12px 16px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3,
                      letterSpacing:"0.07em", textTransform:"uppercase", whiteSpace:"nowrap",
                      fontFamily:FONT, width:col.w, cursor:col.sort?"pointer":"default", userSelect:"none",
                    }}>
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
                  ? <tr><td colSpan={7} style={{ padding:"52px 24px", textAlign:"center", color:PN.ink3, fontFamily:FONT, fontSize:14 }}>Aucune remise trouvée</td></tr>
                  : pageRows.map((row, i) => (
                    <tr
                      key={row.id}
                      className="pn-tr"
                      onClick={() => openDetail(row)}
                      style={{ borderBottom: i < pageRows.length-1 ? `1px solid ${PN.bord}` : "none", cursor:"pointer" }}
                    >
                      {/* Référence */}
                      <td style={{ padding:"15px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          <div style={{ width:28, height:28, borderRadius:PN.r.md, background:PN.surf, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <Building2 size={13} style={{ color:PN.ink3 }} />
                          </div>
                          <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:PN.ink }}>{row.reference}</span>
                        </div>
                      </td>
                      {/* Date */}
                      <td style={{ padding:"15px 16px", whiteSpace:"nowrap" }}>
                        <span style={{ fontSize:13, fontWeight:600, color:PN.ink, fontFamily:FONT }}>{row.date}</span>
                      </td>
                      {/* Banque */}
                      <td style={{ padding:"15px 16px" }}>
                        <span style={{ fontSize:13, color:PN.ink2, fontFamily:FONT }}>{row.banque}</span>
                      </td>
                      {/* Nb transactions */}
                      <td style={{ padding:"15px 16px" }}>
                        <span style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{row.nbTx.toLocaleString("fr-FR")}</span>
                        <span style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginLeft:4 }}>tx</span>
                      </td>
                      {/* Montant */}
                      <td style={{ padding:"15px 16px" }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, whiteSpace:"nowrap" }}>{fmtMontant(row.montant)}</div>
                        <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginTop:1 }}>EUR</div>
                      </td>
                      {/* Statut */}
                      <td style={{ padding:"15px 16px" }}><StatutBadge statut={row.statut} /></td>
                      {/* Actions */}
                      <td style={{ padding:"15px 16px", textAlign:"center" }}>
                        <button
                          onClick={e => { e.stopPropagation(); setMenuState({ row, x: e.clientX, y: e.clientY }); }}
                          style={{ border:"none", background:"none", cursor:"pointer", padding:5, borderRadius:PN.r.md, color:PN.ink3, display:"inline-flex", alignItems:"center" }}
                        >
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", borderTop:`1px solid ${PN.bord}` }}>
            <span style={{ fontSize:13, color:PN.ink3, fontFamily:FONT }}>{rows.length} remise{rows.length!==1?"s":""}</span>
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

      {/* CONTEXT MENU */}
      {menuState && (
        <RemiseContextMenu
          x={menuState.x} y={menuState.y}
          onDetail={() => openDetail(menuState.row)}
          onRetransmettre={() => setRetransmetId(menuState.row.id)}
          onExport={() => {}}
          onClose={() => setMenuState(null)}
        />
      )}

      {/* DETAIL DRAWER */}
      {detailData && (
        <RemiseDetailDrawer data={detailData} onClose={() => setDetailData(null)} />
      )}

      {/* CONFIRM — retransmettre */}
      {retransmetId && retransmetRow && (
        <ConfirmDialog
          title="Retransmettre la remise"
          message={`Êtes-vous sûr de vouloir retransmettre la remise ${retransmetRow.reference} (${fmtMontant(retransmetRow.montant)} EUR) vers ${retransmetRow.banque} ?`}
          confirmLabel="Retransmettre"
          confirmColor={PN.amber}
          onConfirm={() => setRetransmetId(null)}
          onCancel={() => setRetransmetId(null)}
        />
      )}
    </PayNowShell>
  );
}
