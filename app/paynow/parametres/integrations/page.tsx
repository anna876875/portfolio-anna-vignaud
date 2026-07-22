"use client";
import { useState, useCallback } from "react";
import { Info } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, fieldStyle, ToggleRow, SaveBar, TabBar } from "../_params";

type Tab = "redirection" | "embarque";

export default function IntegrationsPage() {
  const [tab, setTab] = useState<Tab>("redirection");

  /* ── Paiement en redirection ── */
  const [maxRetry,       setMaxRetry]       = useState("2");
  const [notifyOnRetry,  setNotifyOnRetry]  = useState(false);
  const [captcha,        setCaptcha]        = useState(false);
  const [counterValue,   setCounterValue]   = useState(false);
  const [protocol,       setProtocol]       = useState("https");
  const [returnUrl,      setReturnUrl]      = useState("cabinet-immobilier-delafusse.com/paiement");
  const [showSummary,    setShowSummary]    = useState(true);
  const [animBtn,        setAnimBtn]        = useState(true);

  /* ── Paiement embarqué ── */
  const [theme,          setTheme]          = useState("light");
  const [showLogos,      setShowLogos]      = useState(true);
  const [autoSubmit,     setAutoSubmit]     = useState(false);
  const [animBtnE,       setAnimBtnE]       = useState(true);

  const [isDirty,  setIsDirty]  = useState(false);
  const [saved,    setSaved]    = useState(false);
  const mark = useCallback(() => setIsDirty(true), []);

  function save()  { setIsDirty(false); setSaved(true); setTimeout(()=>setSaved(false),2500); }
  function reset() { setMaxRetry("2"); setNotifyOnRetry(false); setCaptcha(false); setCounterValue(false); setProtocol("https"); setReturnUrl("cabinet-immobilier-delafusse.com/paiement"); setShowSummary(true); setAnimBtn(true); setTheme("light"); setShowLogos(true); setAutoSubmit(false); setAnimBtnE(true); setIsDirty(false); }

  const inp = fieldStyle;

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="integrations" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>

            {/* Breadcrumb */}
            <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginBottom:10 }}>Paramètres Développeur</div>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Intégrations</h1>
            <p style={{ margin:"0 0 24px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Configuration du comportement de vos pages de paiement.</p>

            <TabBar
              tabs={[{ id:"redirection" as Tab, label:"Paiement en redirection" },{ id:"embarque" as Tab, label:"Paiement embarqué" }]}
              active={tab}
              onChange={setTab}
            />

            {/* ── REDIRECTION ── */}
            {tab === "redirection" && (
              <>
                <SectionCard title="Comportement en cas d'échec">
                  {/* Retry count */}
                  <div style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 0", borderBottom:`1px solid ${PN.bord}` }}>
                    <span style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT, flex:1 }}>En cas de refus de paiement, autoriser</span>
                    <input
                      type="number" min={0} max={10} value={maxRetry}
                      onChange={e=>{setMaxRetry(e.target.value);mark();}}
                      style={{ width:64, height:36, padding:"0 10px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, fontSize:14, fontFamily:FONT, color:PN.ink, textAlign:"center", outline:"none", background:"#fff" }}
                    />
                    <span style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT, whiteSpace:"nowrap" }}>tentative{Number(maxRetry)>1?"s":""} supplémentaire{Number(maxRetry)>1?"s":""}</span>
                  </div>
                  <ToggleRow
                    label="Appeler l'URL de notification à chaque tentative refusée"
                    on={notifyOnRetry} onChange={()=>{setNotifyOnRetry(v=>!v);mark();}}
                  />
                  <ToggleRow
                    label="Activation du Captcha sur la page de paiement par carte"
                    on={captcha} onChange={()=>{setCaptcha(v=>!v);mark();}}
                  />
                  <ToggleRow
                    label="Affichage de la contre-valeur"
                    sub="L'affichage de la contre-valeur est nécessaire si vous utilisez le service de conversion de devises de la plateforme de paiement."
                    on={counterValue} onChange={()=>{setCounterValue(v=>!v);mark();}}
                    last
                  />
                </SectionCard>

                <SectionCard title="URL de retour à la boutique">
                  <div style={{ marginBottom:18 }}>
                    <label style={{ display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:8 }}>URL</label>
                    <div style={{ display:"flex", alignItems:"stretch", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden" }}>
                      <select value={protocol} onChange={e=>{setProtocol(e.target.value);mark();}} style={{ height:42, padding:"0 10px", border:"none", borderRight:`1px solid ${PN.bord}`, fontSize:13, fontFamily:"monospace", color:PN.primary, background:PN.primaryBg, outline:"none", cursor:"pointer", fontWeight:700 }}>
                        <option>https</option>
                        <option>http</option>
                      </select>
                      <input value={returnUrl} onChange={e=>{setReturnUrl(e.target.value);mark();}} placeholder="votre-site.fr/confirmation" style={{ flex:1, height:42, padding:"0 12px", border:"none", fontSize:13.5, fontFamily:FONT, color:PN.ink, outline:"none", background:"#fff" }} />
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 16px", background:PN.blueBg, border:`1px solid ${PN.primary}22`, borderRadius:PN.r.md }}>
                    <Info size={15} style={{ color:PN.primary, flexShrink:0, marginTop:1 }} />
                    <div style={{ fontSize:12.5, color:PN.blueText, fontFamily:FONT, lineHeight:1.7 }}>
                      L'URL de retour est utilisée lorsque l'acheteur clique sur « Retourner à la boutique » après son paiement. Elle doit par ailleurs confirmer l'URL de notification instantanée, configurée dans l'écran Règles de notifications.
                      <br /><br />
                      Lors des tests, pensez à fermer la navigation à la fin du paiement puis cliquer sur « Retourner à la boutique », afin de valider le fonctionnement de la notification instantanée.
                    </div>
                  </div>
                </SectionCard>

                <SectionCard title="Apparence" subtitle="Personnalisation visuelle de la page de paiement hébergée.">
                  <ToggleRow label="Afficher le récapitulatif commande" sub="Montant, référence et moyen de paiement en haut de page." on={showSummary} onChange={()=>{setShowSummary(v=>!v);mark();}} />
                  <ToggleRow label="Animation du bouton de paiement" on={animBtn} onChange={()=>{setAnimBtn(v=>!v);mark();}} last />
                </SectionCard>
              </>
            )}

            {/* ── EMBARQUÉ ── */}
            {tab === "embarque" && (
              <>
                <SectionCard title="Configuration du widget">
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:10 }}>Thème</div>
                    <div style={{ display:"flex", gap:8 }}>
                      {(["light","dark","system"] as const).map(t => (
                        <button key={t} onClick={()=>{setTheme(t);mark();}} style={{ padding:"8px 18px", border:`1px solid ${t===theme?PN.primary:PN.bord}`, borderRadius:PN.r.md, background:t===theme?PN.primaryBg:"#fff", color:t===theme?PN.primary:PN.ink2, fontSize:13, fontWeight:t===theme?700:500, fontFamily:FONT, cursor:"pointer", transition:"all 0.12s" }}>
                          {t==="light"?"Clair":t==="dark"?"Sombre":"Système"}
                        </button>
                      ))}
                    </div>
                  </div>
                  <ToggleRow label="Afficher les logos des moyens de paiement" on={showLogos} onChange={()=>{setShowLogos(v=>!v);mark();}} />
                  <ToggleRow label="Validation automatique à saisie complète" sub="Soumet le formulaire dès que tous les champs carte sont remplis et valides." on={autoSubmit} onChange={()=>{setAutoSubmit(v=>!v);mark();}} />
                  <ToggleRow label="Animation du bouton de paiement" on={animBtnE} onChange={()=>{setAnimBtnE(v=>!v);mark();}} last />
                </SectionCard>

                <SectionCard title="Snippet d'intégration" subtitle="Copiez ce code dans votre page de paiement côté client.">
                  <div style={{ background:"#1A1F2E", borderRadius:PN.r.md, padding:"18px 20px", fontFamily:"monospace", fontSize:12.5, color:"#A9B4D0", lineHeight:1.85, overflowX:"auto" }}>
                    <span style={{ color:"#7C8FC7" }}>{`<!-- PayNow Widget -->`}</span><br />
                    <span style={{ color:"#59A5FF" }}>{`<script`}</span>{" "}
                    <span style={{ color:"#A9D1FF" }}>src</span><span style={{ color:"#fff" }}>=</span>
                    <span style={{ color:"#B3FFB3" }}>{`"https://static.paynow.fr/widget.js"`}</span>
                    <span style={{ color:"#59A5FF" }}>{`></script>`}</span><br /><br />
                    <span style={{ color:"#59A5FF" }}>{`<div`}</span><br />
                    {"  "}<span style={{ color:"#A9D1FF" }}>id</span><span style={{ color:"#fff" }}>=</span><span style={{ color:"#B3FFB3" }}>{`"pn-widget"`}</span><br />
                    {"  "}<span style={{ color:"#A9D1FF" }}>data-key</span><span style={{ color:"#fff" }}>=</span><span style={{ color:"#B3FFB3" }}>{`"pk_live_3B7EF8…"`}</span><br />
                    {"  "}<span style={{ color:"#A9D1FF" }}>data-theme</span><span style={{ color:"#fff" }}>=</span><span style={{ color:"#B3FFB3" }}>{`"${theme}"`}</span><br />
                    {"  "}<span style={{ color:"#A9D1FF" }}>data-auto-submit</span><span style={{ color:"#fff" }}>=</span><span style={{ color:"#B3FFB3" }}>{`"${autoSubmit}"`}</span><br />
                    <span style={{ color:"#59A5FF" }}>{`></div>`}</span>
                  </div>
                </SectionCard>

                {/* Preview */}
                <SectionCard title="Aperçu du widget" subtitle="Rendu indicatif selon les paramètres ci-dessus.">
                  <div style={{ background:theme==="dark"?"#0B1A34":"#fff", borderRadius:PN.r.md, padding:"24px", border:`1px solid ${PN.bord}` }}>
                    {showLogos && (
                      <div style={{ display:"flex", gap:8, marginBottom:20, justifyContent:"center" }}>
                        {["CB","Visa","Mastercard","Apple Pay"].map(m=>(
                          <div key={m} style={{ background:theme==="dark"?"#1A2A44":"#F4F7FF", border:`1px solid ${theme==="dark"?"#2A3A54":PN.bord}`, borderRadius:PN.r.md, padding:"4px 10px", fontSize:11, fontWeight:700, color:theme==="dark"?"#A9B4D0":PN.ink2 }}>{m}</div>
                        ))}
                      </div>
                    )}
                    {["Numéro de carte","Date d'expiration","CVV"].map(label=>(
                      <div key={label} style={{ marginBottom:12 }}>
                        <div style={{ fontSize:11.5, fontWeight:600, color:theme==="dark"?"#8A9EC0":PN.ink3, fontFamily:FONT, marginBottom:5 }}>{label}</div>
                        <div style={{ height:40, background:theme==="dark"?"#1A2A44":"#F4F7FF", border:`1px solid ${theme==="dark"?"#2A3A54":PN.bord}`, borderRadius:PN.r.md }} />
                      </div>
                    ))}
                    <button style={{ width:"100%", padding:"12px", background:PN.primary, border:"none", borderRadius:PN.r.md, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", marginTop:4 }}>PAYER</button>
                  </div>
                </SectionCard>
              </>
            )}
          </div>
        </div>
      </div>
      <SaveBar dirty={isDirty} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
