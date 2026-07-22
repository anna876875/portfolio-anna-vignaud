"use client";
import { useState } from "react";
import { Building2, Package, Shield, BarChart2, Bell, Code2, ChevronDown, ChevronRight, Save } from "lucide-react";
import { PN, FONT } from "../_shell";

/* ─── Secondary nav data ─── */
export const PARAM_NAV = [
  { id:"entreprise",    label:"Entreprise",              icon:Building2, href:"/paynow/parametres",              children:[] },
  { id:"produits",      label:"Produits",                icon:Package,   href:"/paynow/parametres/produits",      children:[] },
  { id:"risques",       label:"Gestion des risques",     icon:Shield,    href:"/paynow/parametres/risques",       children:[] },
  { id:"reporting",     label:"Reporting",               icon:BarChart2, href:"/paynow/parametres/reporting",     children:[] },
  { id:"notifications", label:"Centre de notifications", icon:Bell,      href:"/paynow/parametres/notifications", children:[] },
  { id:"developpeur",   label:"Développeur",             icon:Code2,     href:"#",
    children:[
      { id:"cles",         label:"Clés API",     href:"/paynow/parametres/cles"         },
      { id:"integrations", label:"Intégrations", href:"/paynow/parametres/integrations" },
    ],
  },
];

const DEV_IDS = new Set(["cles","integrations"]);

export function SecondaryNav({ activeId }: { activeId: string }) {
  const inDev = DEV_IDS.has(activeId);
  const [devOpen, setDevOpen] = useState(inDev || activeId === "developpeur");
  return (
    <aside style={{ width:230, flexShrink:0, borderRight:`1px solid ${PN.bord}`, overflowY:"auto", background:"#fff" }}>
      <div style={{ padding:"20px 14px 12px" }}>
        <div style={{ fontSize:10, fontWeight:800, color:PN.ink3, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:FONT, marginBottom:14, paddingLeft:8 }}>
          Paramètres
        </div>
        {PARAM_NAV.map(item => {
          const active  = item.id === activeId;
          const Icon    = item.icon;
          const hasChildren = item.children.length > 0;
          const isOpen  = item.id === "developpeur" && devOpen;
          return (
            <div key={item.id}>
              <button
                onClick={() => { if (hasChildren) setDevOpen(o=>!o); else if (item.href !== "#") window.location.href = item.href; }}
                className={active?"":"pn-nav-idle"}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"9px 10px", borderRadius:PN.r.md, border:"none", cursor:"pointer", marginBottom:2, background:active?PN.primaryBg:"transparent", color:active?PN.primary:PN.ink2, fontWeight:active?700:500, fontSize:13.5, fontFamily:FONT, textAlign:"left" }}
              >
                <span style={{ display:"flex", alignItems:"center", gap:9 }}>
                  <Icon size={15} strokeWidth={active?2.4:1.8} style={{ color:active?PN.primary:PN.ink3, flexShrink:0 }} />
                  {item.label}
                </span>
                {hasChildren && (isOpen ? <ChevronDown size={13} style={{ color:PN.ink3 }} /> : <ChevronRight size={13} style={{ color:PN.ink3 }} />)}
              </button>
              {hasChildren && isOpen && (
                <div style={{ marginLeft:24, marginBottom:4 }}>
                  {item.children.map(child => {
                    const ca = child.id === activeId;
                    return (
                      <button key={child.id} onClick={() => window.location.href = child.href}
                        className={ca?"":"pn-nav-idle"}
                        style={{ display:"block", width:"100%", padding:"7px 10px", border:"none", background:ca?PN.primaryBg:"transparent", cursor:"pointer", fontSize:13, fontFamily:FONT, color:ca?PN.primary:PN.ink3, textAlign:"left", borderRadius:PN.r.md, fontWeight:ca?700:400 }}>
                        {child.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ─── Shared atoms ─── */
export function SectionCard({ title, subtitle, children }: { title:string; subtitle?:string; children:React.ReactNode }) {
  return (
    <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"hidden", marginBottom:20, boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
      <div style={{ padding:"18px 24px", borderBottom:`1px solid ${PN.bord}` }}>
        <div style={{ fontSize:14, fontWeight:800, color:PN.ink, fontFamily:FONT, letterSpacing:"-0.02em" }}>{title}</div>
        {subtitle && <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT, marginTop:3, lineHeight:1.55 }}>{subtitle}</div>}
      </div>
      <div style={{ padding:"22px 24px" }}>{children}</div>
    </div>
  );
}

export const fieldStyle = {
  display:"block", width:"100%", height:42, padding:"0 12px",
  border:`1px solid ${PN.bord}`, borderRadius:PN.r.md,
  fontSize:13.5, fontFamily:FONT, color:PN.ink,
  background:"#fff", outline:"none", boxSizing:"border-box" as const,
};

export function ToggleRow({ label, sub, on, onChange, last }: { label:string; sub?:string; on:boolean; onChange:()=>void; last?:boolean }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, padding:"13px 0", borderBottom:last?"none":`1px solid ${PN.bord}` }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT, fontWeight:500 }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginTop:3, lineHeight:1.55 }}>{sub}</div>}
      </div>
      <button onClick={onChange} style={{ width:38, height:22, borderRadius:PN.r.full, background:on?PN.primary:PN.ink4, border:"none", cursor:"pointer", padding:3, display:"flex", alignItems:"center", justifyContent:on?"flex-end":"flex-start", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.25)" }} />
      </button>
    </div>
  );
}

export function SaveBar({ dirty, onSave, onReset }: { dirty:boolean; onSave:()=>void; onReset:()=>void }) {
  if (!dirty) return null;
  return (
    <div style={{ position:"fixed", bottom:0, left:PN.sidebarW+230, right:0, background:"#fff", borderTop:`1px solid ${PN.bord}`, padding:"12px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 -4px 20px rgba(11,26,52,0.08)", zIndex:50, fontFamily:FONT }}>
      <span style={{ fontSize:13, color:PN.ink2 }}>Modifications non sauvegardées.</span>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onReset} style={{ padding:"8px 18px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:"pointer", fontSize:13.5, fontFamily:FONT, color:PN.ink2, fontWeight:600 }}>Annuler</button>
        <button onClick={onSave} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 20px", border:"none", borderRadius:PN.r.md, background:PN.primary, color:"#fff", cursor:"pointer", fontSize:13.5, fontFamily:FONT, fontWeight:700, boxShadow:"0 2px 10px rgba(59,126,248,0.32)" }}>
          <Save size={14} strokeWidth={2.3} /> Sauvegarder
        </button>
      </div>
    </div>
  );
}

/* ─── Tab bar (reusable) ─── */
export function TabBar<T extends string>({ tabs, active, onChange }: { tabs:{id:T;label:string}[]; active:T; onChange:(t:T)=>void }) {
  return (
    <div style={{ position:"relative", display:"flex", gap:0, marginBottom:28 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)} style={{ padding:"11px 20px 10px", border:"none", background:"none", cursor:"pointer", fontSize:13.5, fontFamily:FONT, fontWeight:active===t.id?700:500, color:active===t.id?PN.primary:PN.ink2, position:"relative", transition:"color 0.15s", whiteSpace:"nowrap" }}>
          {t.label}
          {active===t.id && <span style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:PN.primary, borderRadius:"2px 2px 0 0", zIndex:1 }} />}
        </button>
      ))}
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:PN.bord }} />
    </div>
  );
}
