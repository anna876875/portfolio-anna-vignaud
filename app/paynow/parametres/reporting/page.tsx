"use client";
import { useState, useCallback } from "react";
import { Download, FileText, Calendar, Check } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, ToggleRow, SaveBar, fieldStyle, TabBar } from "../_params";

type Tab = "planifies" | "historique";

const SCHEDULED = [
  { id:"r1", name:"Rapport journalier",      freq:"Quotidien (J+1)",    format:"CSV",  active:true  },
  { id:"r2", name:"Récap hebdomadaire",       freq:"Lundi matin",        format:"XLSX", active:true  },
  { id:"r3", name:"Rapport mensuel complet",  freq:"1er du mois",        format:"PDF",  active:false },
];

const HISTORY = [
  { id:"h1", name:"Transactions · juin 2026", date:"01/07/2026", format:"CSV",  size:"1.2 Mo" },
  { id:"h2", name:"Récap · semaine 26",       date:"30/06/2026", format:"XLSX", size:"340 Ko" },
  { id:"h3", name:"Rapport mensuel · mai",    date:"01/06/2026", format:"PDF",  size:"890 Ko" },
  { id:"h4", name:"Transactions · mai 2026",  date:"01/06/2026", format:"CSV",  size:"2.1 Mo" },
];

const FORMAT_COLOR: Record<string,{bg:string;txt:string}> = {
  CSV:  {bg:PN.greenBg,   txt:PN.greenText},
  XLSX: {bg:"#EDE9FE",    txt:"#5B21B6"   },
  PDF:  {bg:PN.redBg,     txt:PN.redText  },
};

export default function ReportingPage() {
  const [tab,       setTab]       = useState<Tab>("planifies");
  const [scheduled, setScheduled] = useState(SCHEDULED);
  const [emailRpt,  setEmailRpt]  = useState("reports@boutique.fr");
  const [timezone,  setTimezone]  = useState("Europe/Paris");
  const [isDirty,   setIsDirty]   = useState(false);
  const mark = useCallback(()=>setIsDirty(true),[]);

  function save()  { setIsDirty(false); }
  function reset() { setIsDirty(false); }

  const inp = fieldStyle;

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="reporting" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Reporting</h1>
            <p style={{ margin:"0 0 24px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Exportez et planifiez vos rapports de transactions.</p>

            <TabBar tabs={[{id:"planifies" as Tab,label:"Rapports planifiés"},{id:"historique" as Tab,label:"Historique des exports"}]} active={tab} onChange={setTab} />

            {tab === "planifies" && (
              <>
                <SectionCard title="Paramètres d'envoi">
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                    <div>
                      <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>E-mail de réception</label>
                      <input value={emailRpt} onChange={e=>{setEmailRpt(e.target.value);mark();}} style={inp} placeholder="reports@votreentreprise.fr" />
                    </div>
                    <div>
                      <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Fuseau horaire</label>
                      <select value={timezone} onChange={e=>{setTimezone(e.target.value);mark();}} style={{...inp,cursor:"pointer"}}>
                        {["Europe/Paris","Europe/London","Europe/Berlin","America/New_York","UTC"].map(tz=><option key={tz}>{tz}</option>)}
                      </select>
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Rapports planifiés" subtitle="Configurez les rapports envoyés automatiquement par e-mail.">
                  <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden" }}>
                    <table style={{ width:"100%", borderCollapse:"collapse" }}>
                      <thead>
                        <tr style={{ background:PN.surf }}>
                          {["Rapport","Fréquence","Format","Actif"].map(h=>(
                            <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, fontFamily:FONT, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {scheduled.map(r=>(
                          <tr key={r.id} style={{ borderTop:`1px solid ${PN.bord}` }} className="pn-tr">
                            <td style={{ padding:"13px 16px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                <FileText size={13} style={{ color:PN.ink3, flexShrink:0 }} />
                                <span style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT }}>{r.name}</span>
                              </div>
                            </td>
                            <td style={{ padding:"13px 16px" }}>
                              <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:13, color:PN.ink2, fontFamily:FONT }}>
                                <Calendar size={12} style={{ color:PN.ink3 }} /> {r.freq}
                              </div>
                            </td>
                            <td style={{ padding:"13px 16px" }}>
                              <span style={{ fontSize:11.5, fontWeight:700, fontFamily:FONT, background:FORMAT_COLOR[r.format]?.bg, color:FORMAT_COLOR[r.format]?.txt, borderRadius:PN.r.md, padding:"3px 9px" }}>{r.format}</span>
                            </td>
                            <td style={{ padding:"13px 16px" }}>
                              <button onClick={()=>{setScheduled(s=>s.map(x=>x.id===r.id?{...x,active:!x.active}:x));mark();}}
                                style={{ width:38, height:22, borderRadius:PN.r.full, background:r.active?PN.primary:PN.ink4, border:"none", cursor:"pointer", padding:3, display:"flex", alignItems:"center", justifyContent:r.active?"flex-end":"flex-start", transition:"background 0.2s" }}>
                                <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.25)" }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SectionCard>
              </>
            )}

            {tab === "historique" && (
              <SectionCard title="Exports récents" subtitle="Téléchargez les rapports générés au cours des 90 derniers jours.">
                <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden" }}>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:PN.surf }}>
                        {["Rapport","Date","Format","Taille",""].map(h=>(
                          <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, fontFamily:FONT, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {HISTORY.map(h=>(
                        <tr key={h.id} style={{ borderTop:`1px solid ${PN.bord}` }} className="pn-tr">
                          <td style={{ padding:"13px 16px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <FileText size={13} style={{ color:PN.ink3, flexShrink:0 }} />
                              <span style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT }}>{h.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:"13px 16px", fontSize:13, color:PN.ink2, fontFamily:FONT }}>{h.date}</td>
                          <td style={{ padding:"13px 16px" }}>
                            <span style={{ fontSize:11.5, fontWeight:700, fontFamily:FONT, background:FORMAT_COLOR[h.format]?.bg, color:FORMAT_COLOR[h.format]?.txt, borderRadius:PN.r.md, padding:"3px 9px" }}>{h.format}</span>
                          </td>
                          <td style={{ padding:"13px 16px", fontSize:13, color:PN.ink3, fontFamily:"monospace" }}>{h.size}</td>
                          <td style={{ padding:"13px 16px", textAlign:"right" }}>
                            <button style={{ display:"inline-flex", alignItems:"center", gap:5, border:`1px solid ${PN.bord}`, background:"#fff", cursor:"pointer", padding:"6px 12px", borderRadius:PN.r.md, fontSize:12.5, fontFamily:FONT, color:PN.ink2, fontWeight:600 }}>
                              <Download size={12}/> Télécharger
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
