"use client";
import { useState, useCallback } from "react";
import { Mail, Webhook } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, ToggleRow, SaveBar, TabBar, fieldStyle } from "../_params";

type Tab = "email" | "instantanee";

const EMAIL_NOTIFS = [
  { id:"n_pay_ok",   label:"Paiement reçu",                   sub:"Envoyé à chaque transaction acceptée.",                  init:true  },
  { id:"n_refund",   label:"Remboursement effectué",           sub:"Confirmation de remboursement.",                         init:true  },
  { id:"n_fail",     label:"Échec de paiement",               sub:"Après épuisement des tentatives autorisées.",            init:true  },
  { id:"n_alias",    label:"Alias créé",                      sub:"Enregistrement d'un nouveau moyen de paiement.",         init:false },
  { id:"n_sub_ok",   label:"Abonnement activé",               sub:"Création d'un nouvel abonnement.",                       init:false },
  { id:"n_sub_ko",   label:"Abonnement résilié",              sub:"Résiliation par le client ou automatique.",              init:true  },
  { id:"n_sub_fail", label:"Échec de prélèvement",            sub:"Prélèvement automatique en échec.",                      init:true  },
  { id:"n_report",   label:"Rapport quotidien (J+1)",          sub:"Récapitulatif des transactions de la veille.",           init:false },
];

const INSTANT_RULES = [
  { id:"r1", event:"payment.success",          url:"https://api.boutique.fr/ipn/success", active:true  },
  { id:"r2", event:"payment.failed",           url:"https://api.boutique.fr/ipn/failed",  active:true  },
  { id:"r3", event:"subscription.created",     url:"https://api.boutique.fr/ipn/sub",     active:true  },
  { id:"r4", event:"subscription.cancelled",   url:"",                                     active:false },
];

export default function NotificationsPage() {
  const [tab, setTab] = useState<Tab>("email");
  const [notifs, setNotifs] = useState<Record<string,boolean>>(Object.fromEntries(EMAIL_NOTIFS.map(n=>[n.id,n.init])));
  const [emailTo, setEmailTo] = useState("alerts@boutique.fr");
  const [rules,   setRules]   = useState(INSTANT_RULES);
  const [isDirty, setIsDirty] = useState(false);
  const mark = useCallback(()=>setIsDirty(true),[]);

  function save()  { setIsDirty(false); }
  function reset() { setNotifs(Object.fromEntries(EMAIL_NOTIFS.map(n=>[n.id,n.init]))); setEmailTo("alerts@boutique.fr"); setRules(INSTANT_RULES); setIsDirty(false); }

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="notifications" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Centre de notifications</h1>
            <p style={{ margin:"0 0 24px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Gérez les alertes e-mail et les notifications instantanées (IPN).</p>

            <TabBar
              tabs={[{ id:"email" as Tab, label:"Notifications e-mail" },{ id:"instantanee" as Tab, label:"Notifications instantanées (IPN)" }]}
              active={tab} onChange={setTab}
            />

            {tab === "email" && (
              <>
                <SectionCard title="Adresse de réception" subtitle="Toutes les notifications e-mail sont envoyées à cette adresse.">
                  <div>
                    <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Adresse e-mail</label>
                    <input value={emailTo} onChange={e=>{setEmailTo(e.target.value);mark();}} style={fieldStyle} placeholder="admin@votreentreprise.fr" />
                  </div>
                </SectionCard>
                <SectionCard title="Événements" subtitle="Choisissez les événements pour lesquels vous souhaitez être alerté.">
                  {EMAIL_NOTIFS.map((n,i) => (
                    <ToggleRow key={n.id} label={n.label} sub={n.sub} on={notifs[n.id]} onChange={()=>{setNotifs(p=>({...p,[n.id]:!p[n.id]}));mark();}} last={i===EMAIL_NOTIFS.length-1} />
                  ))}
                </SectionCard>
              </>
            )}

            {tab === "instantanee" && (
              <SectionCard title="Règles de notification instantanée" subtitle="URLs appelées par PayNow lors d'événements de paiement (HTTP POST).">
                <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:PN.surf }}>
                        {["Événement","URL de notification","Statut"].map(h=>(
                          <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, fontFamily:FONT, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rules.map((r,i) => (
                        <tr key={r.id} style={{ borderTop:`1px solid ${PN.bord}` }} className="pn-tr">
                          <td style={{ padding:"13px 16px" }}>
                            <code style={{ fontSize:12, fontFamily:"monospace", color:PN.primary, background:PN.primaryBg, borderRadius:PN.r.md, padding:"3px 8px" }}>{r.event}</code>
                          </td>
                          <td style={{ padding:"10px 16px" }}>
                            <input
                              value={r.url}
                              onChange={e=>{setRules(rs=>rs.map(x=>x.id===r.id?{...x,url:e.target.value}:x));mark();}}
                              placeholder="https://votreserveur.fr/ipn"
                              style={{ width:"100%", height:36, padding:"0 10px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, fontSize:12.5, fontFamily:"monospace", color:PN.ink, outline:"none", background:"#fff", boxSizing:"border-box" }}
                            />
                          </td>
                          <td style={{ padding:"13px 16px" }}>
                            <button onClick={()=>{setRules(rs=>rs.map(x=>x.id===r.id?{...x,active:!x.active}:x));mark();}}
                              style={{ fontSize:12, fontWeight:600, fontFamily:FONT, background:r.active?PN.greenBg:PN.surf, color:r.active?PN.greenText:PN.ink3, borderRadius:PN.r.md, padding:"4px 12px", border:"none", cursor:"pointer" }}>
                              {r.active?"Actif":"Inactif"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop:14, padding:"12px 16px", background:PN.blueBg, border:`1px solid ${PN.primary}22`, borderRadius:PN.r.md, fontSize:12.5, color:PN.blueText, fontFamily:FONT, lineHeight:1.65 }}>
                  PayNow effectue jusqu'à <strong>3 tentatives</strong> d'appel en cas d'échec (délais : 5 min, 30 min, 2 h). Votre serveur doit retourner un <strong>HTTP 200</strong> pour confirmer la réception.
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
      <SaveBar dirty={isDirty} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
