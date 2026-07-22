"use client";
import { useState, useCallback } from "react";
import { Pencil, Check, RotateCcw, AlertTriangle, XCircle, Clock, CreditCard, ShieldX, RefreshCw, Landmark, HelpCircle, Eye } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, SaveFooter, SaveToast, ToggleRow, FormField, fieldStyle, DeviceFrame, PreviewModal } from "../_perso";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────────────────────────────────────────── */
interface ErrorEntry { code:string; label:string; icon:React.ElementType; color:string; defaultMsg:string; customMsg:string }

const INIT_ERRORS: ErrorEntry[] = [
  { code:"PAYMENT_REFUSED",    label:"Paiement refusé",     icon:XCircle,      color:PN.red,   defaultMsg:"Votre paiement a été refusé. Veuillez vérifier vos informations ou contacter votre banque.",   customMsg:"" },
  { code:"INVALID_CARD",       label:"Carte invalide",       icon:CreditCard,   color:PN.red,   defaultMsg:"Les informations de carte sont incorrectes. Veuillez les vérifier.",                             customMsg:"" },
  { code:"INSUFFICIENT_FUNDS", label:"Fonds insuffisants",   icon:Landmark,     color:PN.amber, defaultMsg:"Votre carte ne dispose pas des fonds suffisants pour ce paiement.",                             customMsg:"" },
  { code:"EXPIRED_CARD",       label:"Carte expirée",        icon:Clock,        color:PN.amber, defaultMsg:"Votre carte bancaire est expirée. Veuillez utiliser une autre carte.",                          customMsg:"" },
  { code:"INVALID_CVV",        label:"CVV incorrect",        icon:ShieldX,      color:PN.amber, defaultMsg:"Le code de sécurité (CVV) est incorrect.",                                                      customMsg:"" },
  { code:"SESSION_TIMEOUT",    label:"Session expirée",      icon:Clock,        color:PN.blue,  defaultMsg:"Votre session a expiré. Veuillez recommencer votre paiement.",                                  customMsg:"" },
  { code:"TECHNICAL_ERROR",    label:"Erreur technique",     icon:AlertTriangle,color:PN.ink3,  defaultMsg:"Une erreur technique est survenue. Veuillez réessayer dans quelques instants.",                customMsg:"" },
  { code:"LIMIT_EXCEEDED",     label:"Plafond dépassé",      icon:RefreshCw,    color:PN.amber, defaultMsg:"Le plafond de votre carte a été atteint. Contactez votre banque ou essayez une autre carte.",  customMsg:"" },
];

const MAX_RETRY_OPTS = ["1","2","3","5","Illimité"];

/* ─────────────────────────────────────────────────────────────────────────────
   ERROR PREVIEW
───────────────────────────────────────────────────────────────────────────── */
function ErrorPreview({ error, showCode, allowRetry, showHelp, helpUrl }: {
  error:ErrorEntry; showCode:boolean; allowRetry:boolean; showHelp:boolean; helpUrl:string;
}) {
  const Icon = error.icon;
  const msg = error.customMsg || error.defaultMsg;
  const isRed = error.color === PN.red;
  const isBlue = error.color === PN.blue;
  const bgColor = isRed ? PN.redBg : isBlue ? PN.blueBg : PN.amberBg;
  const txtColor = isRed ? PN.redText : isBlue ? PN.blueText : PN.amberText;
  return (
    <div style={{ padding:"24px 28px 36px", fontFamily:FONT }}>
      {/* Page title */}
      <div style={{ fontSize:15, fontWeight:700, color:PN.ink, marginBottom:16, letterSpacing:"-0.02em" }}>Paiement en ligne sécurisé</div>

      {/* Order summary */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:PN.surf, borderRadius:PN.r.md, padding:"10px 14px", marginBottom:16, border:`1px solid ${PN.bord}` }}>
        <span style={{ fontSize:12.5, color:PN.ink3 }}>Total à régler</span>
        <span style={{ fontSize:16, fontWeight:800, color:PN.ink, letterSpacing:"-0.02em" }}>129,90 EUR</span>
      </div>

      {/* Error banner */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"14px 16px", background:bgColor, border:`1px solid ${error.color}30`, borderLeft:`3px solid ${error.color}`, borderRadius:PN.r.md, marginBottom:20 }}>
        <Icon size={17} style={{ color:error.color, flexShrink:0, marginTop:1 }} />
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:txtColor, marginBottom:3 }}>{error.label}</div>
          <div style={{ fontSize:12.5, color:txtColor, lineHeight:1.6, opacity:0.9 }}>{msg}</div>
          {showCode && <div style={{ fontSize:10.5, fontFamily:"monospace", color:error.color, marginTop:6, opacity:0.7 }}>Code : {error.code}</div>}
        </div>
      </div>

      {/* Card fields */}
      {[
        { label:"Numéro de carte", errored: error.code==="INVALID_CARD" },
        { label:"Date d'expiration", errored: error.code==="EXPIRED_CARD" },
        { label:"CVV", errored: error.code==="INVALID_CVV" || error.code==="INVALID_CARD" },
      ].map(({ label, errored }) => (
        <div key={label} style={{ marginBottom:12 }}>
          <div style={{ fontSize:12, fontWeight:600, color:PN.ink2, marginBottom:5 }}>{label} *</div>
          <div style={{ height:40, background:"#fff", border:`1px solid ${errored?PN.red:PN.bord}`, borderRadius:PN.r.md, display:"flex", alignItems:"center", paddingLeft:12, gap:8 }}>
            <div style={{ flex:1, height:10, borderRadius:4, background:errored?"#FEE2E2":PN.surf }} />
            {errored && <XCircle size={14} style={{ color:PN.red, marginRight:12 }} />}
          </div>
        </div>
      ))}

      {/* Actions */}
      <div style={{ display:"flex", flexDirection:"column", gap:9, marginTop:18 }}>
        {allowRetry && (
          <button style={{ width:"100%", padding:"12px", background:PN.primary, border:"none", borderRadius:PN.r.md, color:"#fff", fontSize:13.5, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <RefreshCw size={13} /> Réessayer le paiement
          </button>
        )}
        <button style={{ width:"100%", padding:"11px", background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, color:PN.ink2, fontSize:13, fontWeight:600, cursor:"pointer" }}>
          Retourner à la boutique
        </button>
        {showHelp && helpUrl && (
          <div style={{ textAlign:"center", fontSize:12, color:PN.primary, marginTop:2, cursor:"pointer" }}>
            Besoin d'aide ? <span style={{ textDecoration:"underline" }}>Consulter notre assistance</span>
          </div>
        )}
      </div>

      {/* Secure footer */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5, marginTop:18 }}>
        <Check size={10} style={{ color:PN.green }} />
        <span style={{ fontSize:10.5, color:PN.ink3 }}>Transaction sécurisée SSL/TLS</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ERROR ROW
───────────────────────────────────────────────────────────────────────────── */
function ErrorRow({ entry, onSave, onReset }: {
  entry:ErrorEntry; onSave:(v:string)=>void; onReset:()=>void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft,   setDraft]   = useState(entry.customMsg || entry.defaultMsg);
  const Icon = entry.icon;
  const hasCustom = !!entry.customMsg;

  function startEdit() { setDraft(entry.customMsg || entry.defaultMsg); setEditing(true); }
  function save() { onSave(draft); setEditing(false); }
  function cancel() { setEditing(false); }

  return (
    <div style={{ borderBottom:`1px solid ${PN.bord}`, margin:"0 -28px", padding:"14px 28px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
        <div style={{ width:30, height:30, borderRadius:PN.r.md, background:entry.color+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:2 }}>
          <Icon size={14} style={{ color:entry.color }} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
            <span style={{ fontSize:13, fontWeight:700, color:PN.ink }}>{entry.label}</span>
            {hasCustom && <span style={{ fontSize:10.5, fontWeight:700, color:PN.primary, background:PN.primaryBg, borderRadius:PN.r.md, padding:"2px 7px" }}>Personnalisé</span>}
          </div>
          {!editing && <div style={{ fontSize:12, color:hasCustom?PN.ink2:PN.ink3, fontStyle:hasCustom?"normal":"italic", lineHeight:1.5, overflow:"hidden", textOverflow:"ellipsis", display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical" as "vertical" }}>{hasCustom?entry.customMsg:entry.defaultMsg}</div>}
          {editing && (
            <div style={{ marginTop:8 }}>
              <textarea value={draft} onChange={e=>setDraft(e.target.value)} rows={3} style={{...fieldStyle,height:"auto",padding:"9px 12px",resize:"vertical",lineHeight:1.55,marginBottom:8}} autoFocus />
              <div style={{ display:"flex", gap:7 }}>
                <button onClick={e=>{e.stopPropagation();save();}} style={{ display:"inline-flex", alignItems:"center", gap:5, border:"none", background:PN.primary, cursor:"pointer", padding:"6px 14px", borderRadius:PN.r.md, fontSize:12.5, color:"#fff", fontWeight:700, fontFamily:FONT }}>
                  <Check size={12} /> Enregistrer
                </button>
                <button onClick={e=>{e.stopPropagation();cancel();}} style={{ border:`1px solid ${PN.bord}`, background:"#fff", cursor:"pointer", padding:"6px 14px", borderRadius:PN.r.md, fontSize:12.5, color:PN.ink2, fontWeight:600, fontFamily:FONT }}>
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
        {!editing && (
          <div style={{ display:"flex", gap:5, flexShrink:0 }}>
            {hasCustom && <button onClick={e=>{e.stopPropagation();onReset();}} title="Restaurer" style={{ border:"none", background:"none", cursor:"pointer", padding:"5px", borderRadius:PN.r.md, color:PN.ink3, display:"inline-flex" }}><RotateCcw size={12} /></button>}
            <button onClick={e=>{e.stopPropagation();startEdit();}} style={{ display:"inline-flex", alignItems:"center", gap:4, border:`1px solid ${PN.bord}`, background:"#fff", cursor:"pointer", padding:"5px 10px", borderRadius:PN.r.md, fontSize:12, color:PN.ink2, fontWeight:600, fontFamily:FONT }}>
              <Pencil size={11} /> Modifier
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function ErreurPage() {
  const [errors,      setErrors]      = useState<ErrorEntry[]>(INIT_ERRORS);
  const [previewCode, setPreviewCode] = useState("PAYMENT_REFUSED");
  const [showCodes,   setShowCodes]   = useState(false);
  const [allowRetry,  setAllowRetry]  = useState(true);
  const [maxRetry,    setMaxRetry]    = useState("3");
  const [showHelp,    setShowHelp]    = useState(true);
  const [helpUrl,     setHelpUrl]     = useState("https://boutique.fr/aide-paiement");
  const [showPreview, setShowPreview] = useState(false);
  const [isDirty,     setIsDirty]     = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const mark = useCallback(() => setIsDirty(true), []);

  function saveMsg(code:string, msg:string) { setErrors(es => es.map(e => e.code===code ? {...e, customMsg: msg!==e.defaultMsg?msg:""} : e)); mark(); }
  function resetMsg(code:string) { setErrors(es => es.map(e => e.code===code ? {...e, customMsg:""} : e)); mark(); }
  function save()  { setIsDirty(false); setSaveSuccess(true); setTimeout(()=>setSaveSuccess(false),3500); }
  function reset() { setErrors(INIT_ERRORS); setShowCodes(false); setAllowRetry(true); setMaxRetry("3"); setShowHelp(true); setHelpUrl("https://boutique.fr/aide-paiement"); setIsDirty(false); }

  const previewError = errors.find(e => e.code === previewCode) ?? errors[0];
  const customCount  = errors.filter(e => !!e.customMsg).length;

  return (
    <PayNowShell activePage="perso">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="erreur" />

        {/* ── SETTINGS ── */}
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, marginBottom:28 }}>
              <div>
                <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Formulaires erreur</h1>
                <p style={{ margin:0, fontSize:13, color:PN.ink3, fontFamily:FONT, lineHeight:1.55 }}>Messages affichés lors d'un échec de paiement.</p>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                {customCount > 0 && <span style={{ fontSize:11.5, fontWeight:700, color:PN.primary, background:PN.primaryBg, borderRadius:PN.r.full, padding:"3px 10px", fontFamily:FONT }}>{customCount} perso.</span>}
                <button onClick={() => setShowPreview(true)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", border:"none", borderRadius:PN.r.md, background:PN.primary, cursor:"pointer", fontSize:13.5, fontWeight:700, fontFamily:FONT, color:"#fff", whiteSpace:"nowrap" }}>
                  <Eye size={14} /> Aperçu
                </button>
              </div>
            </div>

            {saveSuccess && <SaveToast message="Messages d'erreur sauvegardés." />}

            {/* Error messages list */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"hidden", padding:"0 28px", marginBottom:16 }}>
              <div style={{ fontSize:10.5, fontWeight:800, color:PN.ink3, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:FONT, borderBottom:`1px solid ${PN.bord}`, margin:"0 -28px", padding:"16px 28px 12px" }}>
                Messages par type d'erreur
              </div>
              {errors.map(entry => (
                <ErrorRow key={entry.code} entry={entry} onSave={v=>saveMsg(entry.code,v)} onReset={()=>resetMsg(entry.code)} />
              ))}
            </div>

            {/* Comportement */}
            <SectionCard title="Comportement">
              <ToggleRow label="Afficher le code d'erreur" sub="Affiche le code technique sous le message." on={showCodes} onChange={()=>{setShowCodes(c=>!c);mark();}} />
              <ToggleRow label="Permettre de réessayer" sub="Bouton pour relancer sans quitter la page." on={allowRetry} onChange={()=>{setAllowRetry(r=>!r);mark();}} />
              {allowRetry && (
                <div style={{ padding:"12px 0", borderBottom:`1px solid ${PN.bord}` }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:PN.ink2, fontFamily:FONT, marginBottom:8 }}>Max. tentatives</div>
                  <div style={{ display:"flex", gap:6 }}>
                    {MAX_RETRY_OPTS.map(o => (
                      <button key={o} onClick={()=>{setMaxRetry(o);mark();}} style={{ padding:"5px 10px", border:`1px solid ${o===maxRetry?PN.primary:PN.bord}`, borderRadius:PN.r.md, background:o===maxRetry?PN.primaryBg:"#fff", color:o===maxRetry?PN.primary:PN.ink2, fontSize:12, fontWeight:o===maxRetry?700:500, fontFamily:FONT, cursor:"pointer" }}>{o}</button>
                    ))}
                  </div>
                </div>
              )}
              <ToggleRow label="Lien d'aide" sub="Renvoie vers votre page d'assistance." on={showHelp} onChange={()=>{setShowHelp(h=>!h);mark();}} last={!showHelp} />
              {showHelp && (
                <div style={{ paddingTop:12 }}>
                  <div style={{ position:"relative" }}>
                    <HelpCircle size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:PN.ink3 }} />
                    <input value={helpUrl} onChange={e=>{setHelpUrl(e.target.value);mark();}} style={{...fieldStyle,paddingLeft:32}} placeholder="https://boutique.fr/aide" />
                  </div>
                </div>
              )}
            </SectionCard>

            <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"14px 16px", background:PN.amberBg, border:`1px solid ${PN.amber}30`, borderRadius:PN.r.md }}>
              <AlertTriangle size={14} style={{ color:PN.amber, marginTop:2, flexShrink:0 }} />
              <div style={{ fontSize:12, color:PN.amberText, fontFamily:FONT, lineHeight:1.6 }}>
                Les messages personnalisés ne sont disponibles qu'en français. Ajoutez les traductions via la section Traductions.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} title="Aperçu : Formulaires erreur">
        <DeviceFrame
          controls={
            <div style={{ display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center", maxWidth:520 }}>
              {errors.map(e => {
                const EIcon = e.icon;
                const sel = e.code === previewCode;
                return (
                  <button key={e.code} onClick={() => setPreviewCode(e.code)} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 12px", border:`1px solid ${sel?e.color+"80":PN.bord}`, borderRadius:PN.r.md, background:sel?e.color+"12":"rgba(255,255,255,0.85)", cursor:"pointer", fontSize:12, fontWeight:sel?700:500, color:sel?e.color:PN.ink2, fontFamily:FONT, backdropFilter:"blur(4px)", transition:"all 0.12s" }}>
                    <EIcon size={11} /> {e.label}
                  </button>
                );
              })}
            </div>
          }
        >
          <ErrorPreview error={previewError} showCode={showCodes} allowRetry={allowRetry} showHelp={showHelp} helpUrl={helpUrl} />
        </DeviceFrame>
      </PreviewModal>

      <SaveFooter dirty={isDirty} success={saveSuccess} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
