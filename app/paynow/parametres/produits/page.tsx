"use client";
import { useState, useCallback } from "react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, ToggleRow, SaveBar, fieldStyle } from "../_params";

const CURRENCIES = ["EUR","USD","GBP","CHF","CAD","JPY"];
const PAYMENT_METHODS = [
  { id:"cb",         label:"Carte bancaire (CB)",  sub:"Visa, Mastercard, American Express",          init:true  },
  { id:"apple_pay",  label:"Apple Pay",             sub:"Paiement sans contact sur iPhone et Mac",     init:true  },
  { id:"google_pay", label:"Google Pay",            sub:"Paiement sans contact sur Android",           init:true  },
  { id:"sepa",       label:"Virement SEPA",         sub:"Paiement bancaire direct (J+1 à J+3)",        init:false },
  { id:"paypal",     label:"PayPal",                sub:"Via compte ou carte PayPal",                  init:false },
  { id:"alma",       label:"Alma (3x 4x)",          sub:"Paiement en plusieurs fois",                  init:false },
];

export default function ProduitsPage() {
  const [currency,   setCurrency]   = useState("EUR");
  const [minAmount,  setMinAmount]  = useState("0.50");
  const [maxAmount,  setMaxAmount]  = useState("10000");
  const [methods,    setMethods]    = useState<Record<string,boolean>>(Object.fromEntries(PAYMENT_METHODS.map(m=>[m.id,m.init])));
  const [threeds,    setThreeds]    = useState(true);
  const [threedsMin, setThreedsMin] = useState("30");
  const [isDirty,    setIsDirty]    = useState(false);
  const mark = useCallback(()=>setIsDirty(true),[]);

  function save()  { setIsDirty(false); }
  function reset() { setCurrency("EUR"); setMinAmount("0.50"); setMaxAmount("10000"); setMethods(Object.fromEntries(PAYMENT_METHODS.map(m=>[m.id,m.init]))); setThreeds(true); setThreedsMin("30"); setIsDirty(false); }

  const inp = fieldStyle;

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="produits" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Produits</h1>
            <p style={{ margin:"0 0 28px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Moyens de paiement acceptés et paramètres de transaction.</p>

            <SectionCard title="Devise et montants">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Devise principale</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {CURRENCIES.map(c=>(
                      <button key={c} onClick={()=>{setCurrency(c);mark();}} style={{ padding:"7px 16px", border:`1px solid ${c===currency?PN.primary:PN.bord}`, borderRadius:PN.r.md, background:c===currency?PN.primaryBg:"#fff", color:c===currency?PN.primary:PN.ink2, fontSize:13, fontWeight:c===currency?700:500, fontFamily:FONT, cursor:"pointer" }}>{c}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Montant minimum ({currency})</label>
                  <input value={minAmount} onChange={e=>{setMinAmount(e.target.value);mark();}} style={inp} placeholder="0.50" type="number" min={0} step={0.01} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Montant maximum ({currency})</label>
                  <input value={maxAmount} onChange={e=>{setMaxAmount(e.target.value);mark();}} style={inp} placeholder="10000" type="number" min={0} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Moyens de paiement" subtitle="Activez les moyens de paiement proposés à vos clients.">
              {PAYMENT_METHODS.map((m,i)=>(
                <ToggleRow key={m.id} label={m.label} sub={m.sub} on={methods[m.id]} onChange={()=>{setMethods(p=>({...p,[m.id]:!p[m.id]}));mark();}} last={i===PAYMENT_METHODS.length-1} />
              ))}
            </SectionCard>

            <SectionCard title="3D Secure" subtitle="Authentification renforcée du porteur de carte.">
              <ToggleRow label="Activer 3D Secure" sub="Recommandé pour tous les paiements supérieurs au seuil défini." on={threeds} onChange={()=>{setThreeds(v=>!v);mark();}} last={!threeds} />
              {threeds && (
                <div style={{ paddingTop:14 }}>
                  <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Seuil de déclenchement ({currency})</label>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <input value={threedsMin} onChange={e=>{setThreedsMin(e.target.value);mark();}} style={{...inp,width:120}} type="number" min={0} />
                    <span style={{ fontSize:13, color:PN.ink3, fontFamily:FONT }}>3DS activé pour tout montant supérieur ou égal à ce seuil</span>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
      <SaveBar dirty={isDirty} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
