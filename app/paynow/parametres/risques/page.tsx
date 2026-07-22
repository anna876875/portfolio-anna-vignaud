"use client";
import { useState, useCallback } from "react";
import { AlertTriangle } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, ToggleRow, SaveBar, fieldStyle } from "../_params";

export default function RisquesPage() {
  const [velocityOn,   setVelocityOn]   = useState(true);
  const [maxPerHour,   setMaxPerHour]   = useState("5");
  const [maxAmount24h, setMaxAmount24h] = useState("2000");
  const [ipBlacklist,  setIpBlacklist]  = useState("185.220.101.0/24\n194.165.16.11");
  const [ipOn,         setIpOn]         = useState(false);
  const [isDirty,      setIsDirty]      = useState(false);
  const mark = useCallback(()=>setIsDirty(true),[]);

  function save()  { setIsDirty(false); }
  function reset() { setIsDirty(false); }

  const inp = fieldStyle;

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="risques" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Gestion des risques</h1>
            <p style={{ margin:"0 0 28px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Règles anti-fraude et restrictions pour sécuriser vos encaissements.</p>

            <SectionCard title="Contrôle de vélocité" subtitle="Limite le nombre et le volume de transactions par acheteur.">
              <ToggleRow label="Activer le contrôle de vélocité" on={velocityOn} onChange={()=>{setVelocityOn(v=>!v);mark();}} last={!velocityOn} />
              {velocityOn && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, paddingTop:14 }}>
                  <div>
                    <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Transactions max. / heure / carte</label>
                    <input value={maxPerHour} onChange={e=>{setMaxPerHour(e.target.value);mark();}} style={inp} type="number" min={1} />
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Montant max. sur 24 h (EUR)</label>
                    <input value={maxAmount24h} onChange={e=>{setMaxAmount24h(e.target.value);mark();}} style={inp} type="number" min={0} />
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Liste noire d'adresses IP">
              <ToggleRow label="Activer le blocage par IP" on={ipOn} onChange={()=>{setIpOn(v=>!v);mark();}} last={!ipOn} />
              {ipOn && (
                <div style={{ paddingTop:14 }}>
                  <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Adresses bloquées (une par ligne, CIDR accepté)</label>
                  <textarea value={ipBlacklist} onChange={e=>{setIpBlacklist(e.target.value);mark();}} rows={4} style={{...inp,height:"auto",padding:"10px 12px",lineHeight:1.7,resize:"vertical",fontFamily:"monospace",fontSize:13}} />
                </div>
              )}
            </SectionCard>

            <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"14px 16px", background:PN.amberBg, border:`1px solid ${PN.amber}30`, borderRadius:PN.r.md }}>
              <AlertTriangle size={14} style={{ color:PN.amber, marginTop:2, flexShrink:0 }} />
              <div style={{ fontSize:12.5, color:PN.amberText, fontFamily:FONT, lineHeight:1.6 }}>
                Des règles trop restrictives peuvent bloquer des paiements légitimes. Testez vos paramètres en environnement Test avant de les activer en production.
              </div>
            </div>
          </div>
        </div>
      </div>
      <SaveBar dirty={isDirty} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
