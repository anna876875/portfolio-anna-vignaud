"use client";
import { useState, useRef, useCallback } from "react";
import { Check, AlertTriangle, ExternalLink, ArrowLeft, Eye } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, SaveFooter, SaveToast, ToggleRow, FormField, fieldStyle, DeviceFrame, PreviewModal } from "../_perso";

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT RESULT PAGE PREVIEW
───────────────────────────────────────────────────────────────────────────── */
function ResultPreview({ scene, btnLabel, showBtn, showSummary, primary, msg }: {
  scene:"success"|"cancel"; btnLabel:string; showBtn:boolean; showSummary:boolean; primary:string; msg:string;
}) {
  const ok = scene === "success";
  return (
    <div style={{ padding:"40px 32px 48px", fontFamily:FONT }}>
      <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
        <div style={{ width:72, height:72, borderRadius:"50%", background:ok?"#D1FAE5":"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 0 12px ${ok?"#D1FAE530":"#FEE2E230"}` }}>
          {ok
            ? <Check size={32} strokeWidth={2.5} style={{ color:PN.green }} />
            : <AlertTriangle size={32} strokeWidth={2} style={{ color:PN.red }} />
          }
        </div>
      </div>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <div style={{ fontSize:20, fontWeight:800, color:PN.ink, letterSpacing:"-0.025em", marginBottom:10 }}>
          {ok ? "Merci pour votre commande !" : "Paiement annulé"}
        </div>
        <div style={{ fontSize:14, color:PN.ink3, lineHeight:1.65, maxWidth:340, margin:"0 auto" }}>
          {msg || (ok ? "Votre paiement a bien été pris en compte." : "Votre paiement a été annulé.")}
        </div>
      </div>
      {showSummary && (
        <div style={{ background:PN.surf, borderRadius:PN.r.md, border:`1px solid ${PN.bord}`, padding:"16px 20px", marginBottom:20 }}>
          <div style={{ fontSize:11, fontWeight:700, color:PN.ink3, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:12 }}>Récapitulatif</div>
          {[["Référence","CMD-2026-48291"],["Montant","129,90 EUR"],["Moyen","Visa ····6142"],["Date","07/07/2026"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:13, color:PN.ink3 }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:600, color:PN.ink, fontFamily:k==="Référence"?"monospace":FONT }}>{v}</span>
            </div>
          ))}
        </div>
      )}
      {showBtn && (
        <button style={{ width:"100%", padding:"13px", background:primary, border:"none", borderRadius:PN.r.md, color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
          <ArrowLeft size={15} /> {btnLabel || "Retourner à la boutique"}
        </button>
      )}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:20 }}>
        <Check size={11} style={{ color:PN.green }} />
        <span style={{ fontSize:11, color:PN.ink3, fontFamily:FONT }}>Transaction sécurisée SSL</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
const DELAY_OPTS = ["Aucune","3 s","5 s","10 s","30 s"];

export default function RedirectionPage() {
  const init = useRef({ urlSuccess:"https://boutique.fr/confirmation", urlCancel:"https://boutique.fr/panier", urlError:"", autoRedirect:true, delay:"5 s", showSummary:true, btnLabel:"Retourner à la boutique", showBtn:true, msgSuccess:"Votre paiement a bien été pris en compte.", msgCancel:"Votre paiement a été annulé.", primaryColor:PN.primary });
  const [urlSuccess,   setUrlSuccess]   = useState(init.current.urlSuccess);
  const [urlCancel,    setUrlCancel]    = useState(init.current.urlCancel);
  const [urlError,     setUrlError]     = useState(init.current.urlError);
  const [autoRedirect, setAutoRedirect] = useState(init.current.autoRedirect);
  const [delay,        setDelay]        = useState(init.current.delay);
  const [showSummary,  setShowSummary]  = useState(init.current.showSummary);
  const [btnLabel,     setBtnLabel]     = useState(init.current.btnLabel);
  const [showBtn,      setShowBtn]      = useState(init.current.showBtn);
  const [msgSuccess,   setMsgSuccess]   = useState(init.current.msgSuccess);
  const [msgCancel,    setMsgCancel]    = useState(init.current.msgCancel);
  const [primaryColor, setPrimaryColor] = useState(init.current.primaryColor);
  const [scene,        setScene]        = useState<"success"|"cancel">("success");
  const [showPreview,  setShowPreview]  = useState(false);
  const [isDirty,      setIsDirty]      = useState(false);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const mark = useCallback(() => setIsDirty(true), []);

  function save()  { setIsDirty(false); setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3500); }
  function reset() { const i = init.current; setUrlSuccess(i.urlSuccess); setUrlCancel(i.urlCancel); setUrlError(i.urlError); setAutoRedirect(i.autoRedirect); setDelay(i.delay); setShowSummary(i.showSummary); setBtnLabel(i.btnLabel); setShowBtn(i.showBtn); setMsgSuccess(i.msgSuccess); setMsgCancel(i.msgCancel); setPrimaryColor(i.primaryColor); setIsDirty(false); }

  const inp = fieldStyle;

  return (
    <PayNowShell activePage="perso">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="redirection" />

        {/* ── SETTINGS ── */}
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, marginBottom:28 }}>
              <div>
                <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Page de redirection</h1>
                <p style={{ margin:0, fontSize:13, color:PN.ink3, fontFamily:FONT, lineHeight:1.55 }}>URLs et messages affichés après le paiement.</p>
              </div>
              <button onClick={() => setShowPreview(true)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", border:"none", borderRadius:PN.r.md, background:PN.primary, cursor:"pointer", fontSize:13.5, fontWeight:700, fontFamily:FONT, color:"#fff", flexShrink:0, whiteSpace:"nowrap" }}>
                <Eye size={14} /> Aperçu
              </button>
            </div>

            {saveSuccess && <SaveToast message="Sauvegardé avec succès." />}

            <SectionCard title="URLs de retour">
              <FormField label="URL succès">
                <div style={{ position:"relative" }}><input value={urlSuccess} onChange={e=>{setUrlSuccess(e.target.value);mark();}} style={{...inp,paddingRight:34}} placeholder="https://boutique.fr/confirmation" /><ExternalLink size={12} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:PN.ink3}} /></div>
              </FormField>
              <FormField label="URL annulation">
                <div style={{ position:"relative" }}><input value={urlCancel} onChange={e=>{setUrlCancel(e.target.value);mark();}} style={{...inp,paddingRight:34}} placeholder="https://boutique.fr/panier" /><ExternalLink size={12} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:PN.ink3}} /></div>
              </FormField>
              <FormField label="URL erreur" sub="Optionnel · si vide, l'URL annulation est utilisée.">
                <div style={{ position:"relative" }}><input value={urlError} onChange={e=>{setUrlError(e.target.value);mark();}} style={{...inp,paddingRight:34}} placeholder="https://boutique.fr/erreur" /><ExternalLink size={12} style={{position:"absolute",right:11,top:"50%",transform:"translateY(-50%)",color:PN.ink3}} /></div>
              </FormField>
            </SectionCard>

            <SectionCard title="Comportement">
              <ToggleRow label="Redirection automatique" sub="Le client est redirigé sans cliquer." on={autoRedirect} onChange={()=>{setAutoRedirect(a=>!a);mark();}} />
              {autoRedirect && (
                <div style={{ padding:"12px 0", borderBottom:`1px solid ${PN.bord}` }}>
                  <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT, fontWeight:600, marginBottom:8 }}>Délai avant redirection</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {DELAY_OPTS.map(d => (
                      <button key={d} onClick={()=>{setDelay(d);mark();}} style={{ padding:"5px 12px", border:`1px solid ${d===delay?PN.primary:PN.bord}`, borderRadius:PN.r.md, background:d===delay?PN.primaryBg:"#fff", color:d===delay?PN.primary:PN.ink2, fontSize:12.5, fontWeight:d===delay?700:500, fontFamily:FONT, cursor:"pointer" }}>{d}</button>
                    ))}
                  </div>
                </div>
              )}
              <ToggleRow label="Récapitulatif commande" sub="Référence, montant, moyen de paiement." on={showSummary} onChange={()=>{setShowSummary(s=>!s);mark();}} />
              <ToggleRow label="Bouton retour boutique" on={showBtn} onChange={()=>{setShowBtn(s=>!s);mark();}} last={!showBtn} />
              {showBtn && (
                <div style={{ paddingTop:12 }}>
                  <FormField label="Libellé du bouton">
                    <input value={btnLabel} onChange={e=>{setBtnLabel(e.target.value);mark();}} style={inp} placeholder="Retourner à la boutique" />
                  </FormField>
                </div>
              )}
            </SectionCard>

            <SectionCard title="Messages">
              <FormField label="Succès">
                <textarea value={msgSuccess} onChange={e=>{setMsgSuccess(e.target.value);mark();}} rows={3} style={{...inp,height:"auto",padding:"10px 12px",resize:"vertical",lineHeight:1.55}} />
              </FormField>
              <FormField label="Annulation">
                <textarea value={msgCancel} onChange={e=>{setMsgCancel(e.target.value);mark();}} rows={3} style={{...inp,height:"auto",padding:"10px 12px",resize:"vertical",lineHeight:1.55}} />
              </FormField>
            </SectionCard>

            <SectionCard title="Couleur du bouton">
              <div style={{ fontSize:12.5, color:PN.ink3, fontFamily:FONT, marginBottom:14 }}>Héritée de l'identité de marque. Surcharge possible ici.</div>
              <label style={{ display:"inline-flex", alignItems:"stretch", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden", cursor:"pointer" }}>
                <div style={{ position:"relative", width:42, flexShrink:0, background:primaryColor }}>
                  <input type="color" value={primaryColor} onChange={e=>{setPrimaryColor(e.target.value);mark();}} style={{ position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer", border:"none" }} />
                </div>
                <div style={{ padding:"0 14px", fontSize:13, fontFamily:"monospace", color:PN.ink, display:"flex", alignItems:"center", height:42 }}>{primaryColor.toUpperCase()}</div>
              </label>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} title="Aperçu : Page de redirection">
        <DeviceFrame
          controls={
            <div style={{ display:"flex", background:"#fff", borderRadius:PN.r.md, padding:4, gap:4, boxShadow:"0 2px 10px rgba(11,26,52,0.10)" }}>
              {(["success","cancel"] as const).map(s => (
                <button key={s} onClick={()=>setScene(s)} style={{ padding:"7px 20px", border:"none", borderRadius:PN.r.md, background:s===scene?PN.primary:"transparent", color:s===scene?"#fff":PN.ink3, fontSize:13, fontWeight:s===scene?700:500, fontFamily:FONT, cursor:"pointer", transition:"all 0.15s" }}>
                  {s==="success"?"Succès":"Annulation"}
                </button>
              ))}
            </div>
          }
        >
          <ResultPreview scene={scene} btnLabel={btnLabel} showBtn={showBtn} showSummary={showSummary} primary={primaryColor} msg={scene==="success"?msgSuccess:msgCancel} />
        </DeviceFrame>
      </PreviewModal>

      <SaveFooter dirty={isDirty} success={saveSuccess} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
