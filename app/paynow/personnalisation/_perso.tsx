"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, ChevronRight, Paintbrush, Mail, Globe, Layout, Save, Check, Shield, X } from "lucide-react";
import { PN, FONT } from "../_shell";

/* ─────────────────────────────────────────────────────────────────────────────
   SECONDARY NAV
───────────────────────────────────────────────────────────────────────────── */
export const SEC_NAV = [
  { id:"identite",  label:"Identité de marque",   icon:Paintbrush, href:"/paynow/personnalisation/identite",    children:[] },
  { id:"parcours",  label:"Parcours de paiement",  icon:Layout,     href:"#",
    children:[
      { id:"redirection", label:"Page de redirection",               href:"/paynow/personnalisation/redirection" },
      { id:"collecte",    label:"Formulaires de collecte de données", href:"/paynow/personnalisation/collecte"    },
      { id:"erreur",      label:"Formulaires erreur",                 href:"/paynow/personnalisation/erreur"      },
    ],
  },
  { id:"templates",   label:"Templates e-mail", icon:Mail,  href:"/paynow/personnalisation/templates",   children:[] },
  { id:"traductions", label:"Traductions",       icon:Globe, href:"/paynow/personnalisation/traductions", children:[] },
];

const PARCOURS_IDS = new Set(["redirection","collecte","erreur"]);

export function SecondaryNav({ activeId }: { activeId: string }) {
  const inParcours = PARCOURS_IDS.has(activeId);
  const [parcoursOpen, setParcoursOpen] = useState(inParcours || activeId === "parcours");
  return (
    <aside style={{ width:230, flexShrink:0, borderRight:`1px solid ${PN.bord}`, overflowY:"auto", background:"#fff" }}>
      <div style={{ padding:"20px 14px 12px" }}>
        <div style={{ fontSize:10, fontWeight:800, color:PN.ink3, letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:FONT, marginBottom:14, paddingLeft:8 }}>
          Personnalisation
        </div>
        {SEC_NAV.map(item => {
          const active = item.id === activeId;
          const Icon = item.icon;
          const hasChildren = item.children.length > 0;
          const isOpen = item.id === "parcours" && parcoursOpen;
          return (
            <div key={item.id}>
              <button
                onClick={() => { if (hasChildren) setParcoursOpen(o => !o); else if (item.href !== "#") window.location.href = item.href; }}
                className={active ? "" : "pn-nav-idle"}
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
                    const childActive = child.id === activeId;
                    return (
                      <button key={child.id} onClick={() => { if (child.href !== "#") window.location.href = child.href; }}
                        style={{ display:"block", width:"100%", padding:"7px 10px", border:"none", background:childActive?PN.primaryBg:"transparent", cursor:"pointer", fontSize:13, fontFamily:FONT, color:childActive?PN.primary:PN.ink3, textAlign:"left", borderRadius:PN.r.md, fontWeight:childActive?700:400 }}
                        className={childActive?"":"pn-nav-idle"}>
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

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────────────────────────── */
export function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"24px 28px", marginBottom:16, boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
      <div style={{ fontSize:10.5, fontWeight:800, color:PN.ink3, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:FONT, marginBottom:subtitle?4:14 }}>{title}</div>
      {subtitle && <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT, marginBottom:14, lineHeight:1.55 }}>{subtitle}</div>}
      <div style={{ height:1, background:PN.bord, marginBottom:20 }} />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SAVE FOOTER
───────────────────────────────────────────────────────────────────────────── */
export function SaveFooter({ dirty, success, onSave, onReset }: { dirty:boolean; success:boolean; onSave:()=>void; onReset:()=>void }) {
  if (!dirty && !success) return null;
  return (
    <div style={{ position:"fixed", bottom:0, left:PN.sidebarW+230, right:0, background:"#fff", borderTop:`1px solid ${PN.bord}`, padding:"12px 32px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:"0 -4px 20px rgba(11,26,52,0.08)", zIndex:50, fontFamily:FONT }}>
      <span style={{ fontSize:13, color:PN.ink2 }}>{dirty?"Modifications non sauvegardées.":""}</span>
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onReset} style={{ padding:"8px 18px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:"pointer", fontSize:13.5, fontFamily:FONT, color:PN.ink2, fontWeight:600 }}>Annuler</button>
        <button onClick={onSave} style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 20px", border:"none", borderRadius:PN.r.md, background:PN.primary, color:"#fff", cursor:"pointer", fontSize:13.5, fontFamily:FONT, fontWeight:700, boxShadow:"0 2px 10px rgba(59,126,248,0.32)" }}>
          <Save size={14} strokeWidth={2.3} /> Sauvegarder
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SAVE TOAST
───────────────────────────────────────────────────────────────────────────── */
export function SaveToast({ message }: { message: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, background:PN.greenBg, border:`1px solid ${PN.green}40`, borderLeft:`3px solid ${PN.green}`, borderRadius:PN.r.md, padding:"11px 16px", marginBottom:16, fontFamily:FONT, fontSize:13.5, fontWeight:600, color:PN.greenText }}>
      <Check size={15} style={{ flexShrink:0 }} /> {message}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TOGGLE ROW
───────────────────────────────────────────────────────────────────────────── */
export function ToggleRow({ label, sub, on, onChange, last }: { label:string; sub?:string; on:boolean; onChange:()=>void; last?:boolean }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, padding:"13px 0", borderBottom:last?"none":`1px solid ${PN.bord}` }}>
      <div>
        <div style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT, fontWeight:500 }}>{label}</div>
        {sub && <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginTop:2 }}>{sub}</div>}
      </div>
      <button onClick={onChange} style={{ width:38, height:22, borderRadius:PN.r.full, background:on?PN.primary:PN.ink4, border:"none", cursor:"pointer", padding:3, display:"flex", alignItems:"center", justifyContent:on?"flex-end":"flex-start", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.25)" }} />
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FORM FIELD
───────────────────────────────────────────────────────────────────────────── */
export const fieldStyle = {
  display:"block", width:"100%", height:42, padding:"0 12px",
  border:`1px solid ${PN.bord}`, borderRadius:PN.r.md,
  fontSize:13.5, fontFamily:FONT, color:PN.ink,
  background:"#fff", outline:"none", boxSizing:"border-box" as const,
};

export function FormField({ label, sub, children }: { label:string; sub?:string; children:React.ReactNode }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:sub?4:8 }}>{label}</label>
      {sub && <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginBottom:8 }}>{sub}</div>}
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEVICE FRAME  — browser chrome pour les pages de paiement
───────────────────────────────────────────────────────────────────────────── */
export function DeviceFrame({ children, controls, url = "secure.paynow.fr" }: {
  children: React.ReactNode; controls?: React.ReactNode; url?: string;
}) {
  return (
    <div style={{ flex:1, background:"#DDE3F0", display:"flex", flexDirection:"column", alignItems:"center", padding:"28px 20px 60px", overflowY:"auto", minHeight:0 }}>
      {controls && (
        <div style={{ width:"100%", maxWidth:500, display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:20 }}>
          {controls}
        </div>
      )}
      {/* Drop shadow "table" illusion */}
      <div style={{ width:"100%", maxWidth:500, background:"#fff", borderRadius:PN.r.xl, boxShadow:"0 32px 80px rgba(11,26,52,0.22), 0 4px 12px rgba(11,26,52,0.10)", overflow:"hidden" }}>
        {/* Browser chrome */}
        <div style={{ background:"#F3F4F8", borderBottom:`1px solid #D4D8E4`, padding:"10px 14px", display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", gap:5, flexShrink:0 }}>
            {(["#FF5F57","#FEBC2E","#28C840"] as const).map(c => (
              <div key={c} style={{ width:11, height:11, borderRadius:"50%", background:c }} />
            ))}
          </div>
          <div style={{ flex:1, background:"#E8E9EF", borderRadius:PN.r.md, height:28, display:"flex", alignItems:"center", padding:"0 10px", gap:6 }}>
            <Shield size={11} style={{ color:PN.green, flexShrink:0 }} />
            <span style={{ fontSize:12, color:PN.ink2, fontFamily:FONT, letterSpacing:"0.01em", flex:1 }}>{url}</span>
          </div>
        </div>
        {/* Page content */}
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PREVIEW MODAL
───────────────────────────────────────────────────────────────────────────── */
export function PreviewModal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title?: string; children: React.ReactNode;
}) {
  if (!open || typeof document === "undefined") return null;
  return createPortal(
    <div style={{ position:"fixed", inset:0, zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(11,26,52,0.54)", backdropFilter:"blur(8px)" }} />
      <div style={{ position:"relative", width:"92vw", height:"88vh", background:"#DDE3F0", borderRadius:PN.r.xl, overflow:"hidden", boxShadow:"0 48px 120px rgba(11,26,52,0.38), 0 8px 32px rgba(11,26,52,0.14)", display:"flex", flexDirection:"column" }}>
        {/* Modal header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 20px", background:"#fff", borderBottom:`1px solid ${PN.bord}`, flexShrink:0 }}>
          <span style={{ fontSize:14, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{title ?? "Aperçu"}</span>
          <button onClick={onClose} style={{ display:"flex", alignItems:"center", justifyContent:"center", width:30, height:30, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:"pointer", color:PN.ink2 }}>
            <X size={14} />
          </button>
        </div>
        {/* Modal body */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EMAIL FRAME  — client mail pour templates
───────────────────────────────────────────────────────────────────────────── */
export function EmailFrame({ children, controls, device }: {
  children: React.ReactNode; controls?: React.ReactNode; device: "desktop"|"mobile";
}) {
  const maxW = device === "mobile" ? 380 : 620;
  return (
    <div style={{ flex:1, background:"#E2E6EF", display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 20px 60px", overflowY:"auto", minHeight:0 }}>
      {controls && (
        <div style={{ width:"100%", maxWidth:maxW, display:"flex", alignItems:"center", justifyContent:"flex-end", gap:8, marginBottom:16 }}>
          {controls}
        </div>
      )}
      {/* Email client chrome */}
      <div style={{ width:"100%", maxWidth:maxW, background:"#fff", borderRadius:PN.r.xl, boxShadow:"0 24px 64px rgba(11,26,52,0.20), 0 4px 12px rgba(11,26,52,0.08)", overflow:"hidden" }}>
        {/* Client header */}
        <div style={{ background:"#F8F9FB", borderBottom:`1px solid #E0E3EC`, padding:"12px 18px" }}>
          <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:6 }}>
            <span style={{ color:PN.ink2, fontWeight:600 }}>De :</span> Boutique.fr &lt;no-reply@boutique.fr&gt;
          </div>
          <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT }}>
            <span style={{ color:PN.ink2, fontWeight:600 }}>À :</span> alice.dupont@gmail.com
          </div>
        </div>
        {/* Email content */}
        <div style={{ background:"#F0F0F0" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
