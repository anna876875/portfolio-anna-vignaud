"use client";
import { useState } from "react";
import { Copy, Check, RefreshCw, Trash2, Plus, Eye, EyeOff, ExternalLink } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, fieldStyle, SaveBar } from "../_params";
import { FormModal, ConfirmDialog } from "../../_drawers";

/* ─── Atoms ─── */
function CopyBtn({ value }: { value:string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={()=>{navigator.clipboard.writeText(value);setCopied(true);setTimeout(()=>setCopied(false),1800);}} style={{ border:"none", background:"none", cursor:"pointer", padding:"6px 10px", borderRadius:PN.r.md, color:copied?PN.green:PN.ink3, display:"inline-flex", alignItems:"center", gap:5, fontSize:12.5, fontFamily:FONT, fontWeight:600 }}>
      {copied?<Check size={13}/>:<Copy size={13}/>}{copied?"Copié":"Copier"}
    </button>
  );
}

function ApiKeyRow({ env, keyVal, onRegen }: { env:"Live"|"Test"; keyVal:string; onRegen:()=>void }) {
  const [show, setShow] = useState(false);
  const masked = keyVal.slice(0,10)+"••••••••••••••••••••••••••••";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 0", borderBottom:`1px solid ${PN.bord}` }}>
      <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:PN.r.md, fontFamily:FONT, flexShrink:0, background:env==="Live"?PN.greenBg:PN.primaryBg, color:env==="Live"?PN.greenText:PN.primary }}>{env}</span>
      <code style={{ flex:1, fontSize:13, fontFamily:"monospace", color:PN.ink, background:PN.surf, padding:"8px 12px", borderRadius:PN.r.md, border:`1px solid ${PN.bord}`, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
        {show?keyVal:masked}
      </code>
      <button onClick={()=>setShow(s=>!s)} style={{ border:"none", background:"none", cursor:"pointer", padding:"6px 10px", borderRadius:PN.r.md, color:PN.ink3, display:"inline-flex" }}>
        {show?<EyeOff size={14}/>:<Eye size={14}/>}
      </button>
      <CopyBtn value={keyVal} />
      <button onClick={onRegen} style={{ display:"flex", alignItems:"center", gap:6, border:`1px solid ${PN.bord}`, background:"#fff", cursor:"pointer", padding:"6px 14px", borderRadius:PN.r.md, fontSize:12.5, fontFamily:FONT, color:PN.ink2, fontWeight:600 }}>
        <RefreshCw size={12}/> Régénérer
      </button>
    </div>
  );
}

/* ─── Data ─── */
const LIVE_KEY = "sk_live_DEMO_CLÉ_FICTIVE_PORTFOLIO";
const TEST_KEY = "sk_test_DEMO_CLÉ_FICTIVE_PORTFOLIO";

interface Webhook { id:number; url:string; events:string[]; active:boolean }
const INIT_HOOKS: Webhook[] = [
  { id:1, url:"https://api.boutique.fr/webhooks/payment",        events:["payment.success","payment.failed"],                active:true  },
  { id:2, url:"https://notifications.boutique.fr/events",        events:["subscription.created","subscription.cancelled"], active:true  },
  { id:3, url:"https://legacy.boutique.fr/hook",                 events:["payment.success"],                               active:false },
];
const ALL_EVENTS = ["payment.success","payment.failed","payment.refunded","subscription.created","subscription.cancelled","alias.created"];

export default function ClesPage() {
  const [regenTarget,   setRegenTarget]   = useState<"Live"|"Test"|null>(null);
  const [hooks,         setHooks]         = useState<Webhook[]>(INIT_HOOKS);
  const [addWebhook,    setAddWebhook]    = useState(false);
  const [deleteHookId,  setDeleteHookId]  = useState<number|null>(null);
  const [newUrl,        setNewUrl]        = useState("");
  const [newEvents,     setNewEvents]     = useState<string[]>([]);

  const inp = fieldStyle;

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="cles" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>
            <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginBottom:10 }}>Paramètres Développeur</div>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Clés API</h1>
            <p style={{ margin:"0 0 28px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Authentification pour vos appels REST et configuration des points de terminaison.</p>

            {/* Keys */}
            <SectionCard title="Clés secrètes" subtitle="Utilisées côté serveur uniquement · ne jamais exposer côté client.">
              <ApiKeyRow env="Live" keyVal={LIVE_KEY} onRegen={()=>setRegenTarget("Live")} />
              <ApiKeyRow env="Test" keyVal={TEST_KEY} onRegen={()=>setRegenTarget("Test")} />
              <div style={{ marginTop:14, padding:"12px 16px", background:PN.amberBg, border:`1px solid ${PN.amber}30`, borderRadius:PN.r.md, fontSize:12.5, color:PN.amberText, fontFamily:FONT, lineHeight:1.6 }}>
                Les clés <strong>Live</strong> déclenchent de vraies transactions. Utilisez les clés <strong>Test</strong> pour votre environnement de développement.
              </div>
            </SectionCard>

            {/* Webhooks */}
            <SectionCard title="Webhooks" subtitle="Points de terminaison pour recevoir les événements en temps réel.">
              <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden", marginBottom:16 }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:PN.surf }}>
                      {["URL","Événements","Statut",""].map(h=>(
                        <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, fontFamily:FONT, textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hooks.map(h=>(
                      <tr key={h.id} style={{ borderTop:`1px solid ${PN.bord}` }} className="pn-tr">
                        <td style={{ padding:"13px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                            <ExternalLink size={12} style={{ color:PN.ink3, flexShrink:0 }} />
                            <code style={{ fontSize:12.5, fontFamily:"monospace", color:PN.ink, wordBreak:"break-all" }}>{h.url}</code>
                          </div>
                        </td>
                        <td style={{ padding:"13px 16px" }}>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                            {h.events.map(ev=>(
                              <span key={ev} style={{ fontSize:11, background:PN.surf, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"2px 8px", fontFamily:"monospace", color:PN.ink2 }}>{ev}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding:"13px 16px" }}>
                          <span style={{ fontSize:12, fontWeight:600, fontFamily:FONT, background:h.active?PN.greenBg:PN.surf, color:h.active?PN.greenText:PN.ink3, borderRadius:PN.r.md, padding:"3px 10px" }}>{h.active?"Actif":"Inactif"}</span>
                        </td>
                        <td style={{ padding:"13px 16px", textAlign:"right" }}>
                          <button onClick={()=>setDeleteHookId(h.id)} style={{ border:"none", background:"none", cursor:"pointer", padding:6, borderRadius:PN.r.md, color:PN.ink3, display:"inline-flex" }}>
                            <Trash2 size={14}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={()=>{setNewUrl("");setNewEvents([]);setAddWebhook(true);}} style={{ display:"inline-flex", alignItems:"center", gap:7, border:`1px dashed ${PN.primary}`, background:PN.primaryBg, color:PN.primary, cursor:"pointer", padding:"9px 18px", borderRadius:PN.r.md, fontSize:13, fontWeight:700, fontFamily:FONT }}>
                <Plus size={14} strokeWidth={2.5}/> Ajouter un webhook
              </button>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* Modal webhook */}
      {addWebhook && (
        <FormModal title="Ajouter un webhook" onClose={()=>setAddWebhook(false)}
          footer={
            <>
              <button onClick={()=>setAddWebhook(false)} style={{ padding:"10px 20px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", color:PN.ink2, fontSize:13.5, fontWeight:600, fontFamily:FONT, cursor:"pointer" }}>Annuler</button>
              <button onClick={()=>{if(newUrl)setHooks(h=>[...h,{id:Date.now(),url:newUrl,events:newEvents,active:true}]);setAddWebhook(false);}} style={{ padding:"10px 20px", border:"none", borderRadius:PN.r.md, background:PN.primary, color:"#fff", fontSize:13.5, fontWeight:700, fontFamily:FONT, cursor:"pointer" }}>Ajouter</button>
            </>
          }
        >
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>URL du endpoint</label>
              <input value={newUrl} onChange={e=>setNewUrl(e.target.value)} placeholder="https://votreserveur.fr/webhooks/paynow" style={inp} />
            </div>
            <div>
              <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:10 }}>Événements à écouter</label>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {ALL_EVENTS.map(ev=>(
                  <label key={ev} style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontSize:13.5, fontFamily:FONT, color:PN.ink }}>
                    <input type="checkbox" checked={newEvents.includes(ev)} onChange={()=>setNewEvents(p=>p.includes(ev)?p.filter(e=>e!==ev):[...p,ev])} style={{ width:16, height:16, accentColor:PN.primary, cursor:"pointer" }} />
                    <code style={{ fontSize:12.5, fontFamily:"monospace", color:PN.ink2 }}>{ev}</code>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FormModal>
      )}

      {regenTarget && (
        <ConfirmDialog title={`Régénérer la clé ${regenTarget}`} message={`La clé ${regenTarget} actuelle sera immédiatement révoquée. Toutes les intégrations utilisant cette clé cesseront de fonctionner. Cette action est irréversible.`} confirmLabel="Régénérer" confirmColor={PN.red} onConfirm={()=>setRegenTarget(null)} onCancel={()=>setRegenTarget(null)} />
      )}
      {deleteHookId && (
        <ConfirmDialog title="Supprimer le webhook" message="Ce point de terminaison ne recevra plus aucun événement. Cette action est irréversible." confirmLabel="Supprimer" confirmColor={PN.red} onConfirm={()=>{setHooks(h=>h.filter(w=>w.id!==deleteHookId));setDeleteHookId(null);}} onCancel={()=>setDeleteHookId(null)} />
      )}
    </PayNowShell>
  );
}
