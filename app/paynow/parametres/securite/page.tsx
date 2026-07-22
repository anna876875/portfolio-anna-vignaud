"use client";
import { useState, useCallback } from "react";
import { ShieldCheck, Lock, Smartphone, Key, LogOut, Activity } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, ToggleRow, SaveBar, fieldStyle } from "../_params";
import { ConfirmDialog } from "../../_drawers";

const SESSION_OPTS = ["15 minutes","30 minutes","1 heure","4 heures","8 heures","Jamais (non recommandé)"];

const RECENT_SESSIONS = [
  { id:1, device:"MacBook Pro · Safari 17",    ip:"92.148.12.47",   location:"Paris, FR",     date:"Il y a 2 min",    current:true  },
  { id:2, device:"iPhone 15 · Chrome Mobile", ip:"92.148.12.47",   location:"Paris, FR",     date:"Il y a 3 h",      current:false },
  { id:3, device:"Windows 11 · Edge 120",     ip:"185.74.20.112",  location:"Lyon, FR",      date:"Hier à 14:32",    current:false },
];

export default function SecuritePage() {
  const [twoFA,       setTwoFA]       = useState(false);
  const [session,     setSession]     = useState(SESSION_OPTS[2]);
  const [ipWhitelist, setIpWhitelist] = useState(false);
  const [ips,         setIps]         = useState("92.148.12.0/24\n185.74.20.112");
  const [confirmRevoke, setConfirmRevoke] = useState<number|null>(null);
  const [isDirty,     setIsDirty]     = useState(false);
  const mark = useCallback(()=>setIsDirty(true),[]);

  function save()  { setIsDirty(false); }
  function reset() { setIsDirty(false); }

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="securite" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Sécurité</h1>
            <p style={{ margin:"0 0 28px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Protégez l'accès à votre espace PayNow.</p>

            {/* Authentification */}
            <SectionCard title="Authentification">
              <ToggleRow
                label="Double authentification (2FA)"
                sub="Application TOTP : Google Authenticator, Authy, 1Password…"
                on={twoFA} onChange={()=>{setTwoFA(v=>!v);mark();}}
              />
              {twoFA && (
                <div style={{ padding:"16px 0", borderBottom:`1px solid ${PN.bord}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:100, height:100, background:PN.surf, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ fontSize:9, fontFamily:"monospace", color:PN.ink3, textAlign:"center", lineHeight:1.5 }}>QR Code<br/>2FA</div>
                    </div>
                    <div>
                      <div style={{ fontSize:13, color:PN.ink, fontFamily:FONT, fontWeight:600, marginBottom:6 }}>Scannez ce QR Code</div>
                      <div style={{ fontSize:12.5, color:PN.ink3, fontFamily:FONT, lineHeight:1.6, marginBottom:12 }}>Utilisez votre application d'authentification pour scanner ce code, puis saisissez le code à 6 chiffres.</div>
                      <div style={{ display:"flex", gap:6 }}>
                        {Array.from({length:6}).map((_,i)=>(
                          <input key={i} maxLength={1} style={{ width:40, height:46, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, textAlign:"center", fontSize:18, fontWeight:700, fontFamily:"monospace", color:PN.ink, outline:"none", background:"#fff" }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"13px 0", borderBottom:`1px solid ${PN.bord}` }}>
                <div>
                  <div style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT }}>Expiration de session</div>
                  <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginTop:3 }}>Déconnexion automatique après inactivité</div>
                </div>
                <select value={session} onChange={e=>{setSession(e.target.value);mark();}} style={{ height:36, padding:"0 12px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, fontSize:13, fontFamily:FONT, color:PN.ink, background:"#fff", outline:"none", cursor:"pointer" }}>
                  {SESSION_OPTS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{ padding:"16px 0" }}>
                <div style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT, fontWeight:500, marginBottom:12 }}>Mot de passe</div>
                <button style={{ display:"flex", alignItems:"center", gap:7, border:`1px solid ${PN.bord}`, background:"#fff", cursor:"pointer", padding:"9px 18px", borderRadius:PN.r.md, fontSize:13.5, fontWeight:600, fontFamily:FONT, color:PN.ink2 }}>
                  <Lock size={13}/> Changer le mot de passe
                </button>
              </div>
            </SectionCard>

            {/* IP Whitelist */}
            <SectionCard title="Restriction par adresse IP" subtitle="Limitez l'accès à votre espace à des adresses IP spécifiques.">
              <ToggleRow label="Activer la restriction IP" sub="Seules les adresses autorisées pourront se connecter." on={ipWhitelist} onChange={()=>{setIpWhitelist(v=>!v);mark();}} last={!ipWhitelist} />
              {ipWhitelist && (
                <div style={{ paddingTop:16 }}>
                  <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 }}>Adresses IP autorisées (une par ligne, CIDR accepté)</label>
                  <textarea value={ips} onChange={e=>{setIps(e.target.value);mark();}} rows={4} style={{...fieldStyle,height:"auto",padding:"10px 12px",lineHeight:1.7,resize:"vertical",fontFamily:"monospace",fontSize:13}} placeholder={"192.168.1.0/24\n85.74.20.112"} />
                </div>
              )}
            </SectionCard>

            {/* Sessions actives */}
            <SectionCard title="Sessions actives" subtitle="Toutes les connexions en cours à votre espace.">
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {RECENT_SESSIONS.map((s,i) => (
                  <div key={s.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:i<RECENT_SESSIONS.length-1?`1px solid ${PN.bord}`:"none" }}>
                    <div style={{ width:36, height:36, borderRadius:PN.r.md, background:s.current?PN.primaryBg:PN.surf, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Smartphone size={15} style={{ color:s.current?PN.primary:PN.ink3 }} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:PN.ink, fontFamily:FONT, display:"flex", alignItems:"center", gap:8 }}>
                        {s.device}
                        {s.current && <span style={{ fontSize:10.5, fontWeight:700, color:PN.greenText, background:PN.greenBg, borderRadius:PN.r.full, padding:"2px 8px" }}>Session actuelle</span>}
                      </div>
                      <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginTop:2 }}>{s.ip} · {s.location} · {s.date}</div>
                    </div>
                    {!s.current && (
                      <button onClick={()=>setConfirmRevoke(s.id)} style={{ display:"flex", alignItems:"center", gap:5, border:`1px solid ${PN.bord}`, background:"#fff", cursor:"pointer", padding:"6px 12px", borderRadius:PN.r.md, fontSize:12, fontFamily:FONT, color:PN.red, fontWeight:600 }}>
                        <LogOut size={12}/> Révoquer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {confirmRevoke && (
        <ConfirmDialog title="Révoquer la session" message="Cette session sera immédiatement déconnectée." confirmLabel="Révoquer" confirmColor={PN.red} onConfirm={()=>setConfirmRevoke(null)} onCancel={()=>setConfirmRevoke(null)} />
      )}

      <SaveBar dirty={isDirty} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
