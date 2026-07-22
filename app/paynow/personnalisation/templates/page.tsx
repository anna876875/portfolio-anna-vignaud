"use client";
import { useState, useCallback } from "react";
import { CheckCircle2, XCircle, RefreshCw, Bell, Eye, Monitor, Smartphone } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, SaveFooter, SaveToast, FormField, fieldStyle, EmailFrame, PreviewModal } from "../_perso";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────────────────────────────────────────── */
interface Template {
  id: string; label: string; icon: React.ElementType; color: string;
  defaultSubject: string; description: string;
  variables: { code:string; label:string }[];
}

const TEMPLATES: Template[] = [
  {
    id:"confirmation", label:"Confirmation de paiement", icon:CheckCircle2, color:PN.green,
    defaultSubject:"Votre paiement de {{montant}} est confirmé · {{marchand}}",
    description:"Envoyé immédiatement après un paiement accepté.",
    variables:[
      {code:"{{montant}}",    label:"Montant"},
      {code:"{{reference}}",  label:"Référence commande"},
      {code:"{{marchand}}",   label:"Nom du marchand"},
      {code:"{{date}}",       label:"Date du paiement"},
      {code:"{{moyen}}",      label:"Moyen de paiement"},
      {code:"{{lien_retour}}",label:"Lien retour boutique"},
    ],
  },
  {
    id:"refund", label:"Reçu de remboursement", icon:RefreshCw, color:PN.blue,
    defaultSubject:"Votre remboursement de {{montant}} est en cours · {{marchand}}",
    description:"Envoyé dès qu'un remboursement est initié.",
    variables:[
      {code:"{{montant}}",   label:"Montant remboursé"},
      {code:"{{reference}}", label:"Référence"},
      {code:"{{marchand}}",  label:"Marchand"},
      {code:"{{delai}}",     label:"Délai estimé"},
    ],
  },
  {
    id:"failed", label:"Échec de paiement", icon:XCircle, color:PN.red,
    defaultSubject:"Votre paiement n'a pas abouti · {{marchand}}",
    description:"Envoyé lorsque le paiement est refusé.",
    variables:[
      {code:"{{montant}}",  label:"Montant"},
      {code:"{{raison}}",   label:"Motif du refus"},
      {code:"{{marchand}}", label:"Marchand"},
      {code:"{{lien}}",     label:"Lien de réessai"},
    ],
  },
  {
    id:"sub_created", label:"Abonnement activé", icon:CheckCircle2, color:"#7C3AED",
    defaultSubject:"Bienvenue ! Votre abonnement {{plan}} est actif · {{marchand}}",
    description:"Envoyé à l'activation d'un abonnement.",
    variables:[
      {code:"{{plan}}",        label:"Nom du plan"},
      {code:"{{montant}}",     label:"Montant périodique"},
      {code:"{{frequence}}",   label:"Fréquence"},
      {code:"{{prochaine}}",   label:"Prochaine échéance"},
      {code:"{{marchand}}",    label:"Marchand"},
    ],
  },
  {
    id:"sub_cancelled", label:"Résiliation d'abonnement", icon:XCircle, color:PN.amber,
    defaultSubject:"Votre abonnement {{plan}} a été résilié · {{marchand}}",
    description:"Envoyé lors de la résiliation d'un abonnement.",
    variables:[
      {code:"{{plan}}",        label:"Nom du plan"},
      {code:"{{date_fin}}",    label:"Date de fin d'accès"},
      {code:"{{marchand}}",    label:"Marchand"},
      {code:"{{lien_reabo}}", label:"Lien de réabonnement"},
    ],
  },
  {
    id:"reminder", label:"Rappel de prélèvement", icon:Bell, color:PN.primary,
    defaultSubject:"Rappel : prélèvement de {{montant}} prévu le {{date}} · {{marchand}}",
    description:"Envoyé 3 jours avant un prélèvement automatique.",
    variables:[
      {code:"{{montant}}",   label:"Montant"},
      {code:"{{date}}",      label:"Date du prélèvement"},
      {code:"{{plan}}",      label:"Nom du plan"},
      {code:"{{marchand}}", label:"Marchand"},
      {code:"{{lien}}",      label:"Lien de gestion"},
    ],
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   EMAIL BODY RENDERERS
───────────────────────────────────────────────────────────────────────────── */
function EmailBody({ id, primary, subject }: { id:string; primary:string; subject:string }) {
  const H = { fontFamily:"Arial,sans-serif", margin:0 };
  const td = { padding:"0 32px 24px", fontFamily:"Arial,sans-serif", fontSize:14, color:"#3A5070", lineHeight:"1.65" };
  const tableRow = (k:string, v:string) => (
    <tr key={k} style={{ borderBottom:"1px solid #EEF0F5" }}>
      <td style={{ padding:"10px 0", fontSize:13, color:"#8A9EC0", fontFamily:"Arial,sans-serif", whiteSpace:"nowrap",paddingRight:20 }}>{k}</td>
      <td style={{ padding:"10px 0", fontSize:13, fontWeight:600, color:"#0B1A34", fontFamily:"Arial,sans-serif" }}>{v}</td>
    </tr>
  );

  const bodies: Record<string, React.ReactNode> = {
    confirmation: (
      <>
        <tr><td style={{ padding:"28px 32px 0" }}><div style={{ width:52, height:52, borderRadius:"50%", background:"#D1FAE5", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:24 }}>✓</span></div></td></tr>
        <tr><td style={{ padding:"16px 32px 8px", ...H }}><div style={{ fontSize:20, fontWeight:700, color:"#0B1A34" }}>Paiement confirmé !</div></td></tr>
        <tr><td style={td}>Merci pour votre commande. Votre paiement a bien été reçu et votre commande est en cours de traitement.</td></tr>
        <tr><td style={{ padding:"0 32px 24px" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", background:"#F8F9FB", borderRadius:8, overflow:"hidden" }}>
            <tbody>
              {tableRow("Référence","CMD-2026-48291")}
              {tableRow("Montant","129,90 EUR")}
              {tableRow("Moyen","Visa ····6142")}
              {tableRow("Date","07/07/2026 à 14:32")}
            </tbody>
          </table>
        </td></tr>
        <tr><td style={{ padding:"0 32px 32px" }}><a href="#" style={{ display:"inline-block", padding:"12px 24px", background:primary, color:"#fff", textDecoration:"none", borderRadius:8, fontSize:14, fontWeight:700, fontFamily:"Arial,sans-serif" }}>Voir ma commande</a></td></tr>
      </>
    ),
    refund: (
      <>
        <tr><td style={{ padding:"28px 32px 0" }}><div style={{ width:52, height:52, borderRadius:"50%", background:"#DBEAFE", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:22 }}>↩</span></div></td></tr>
        <tr><td style={{ padding:"16px 32px 8px", ...H }}><div style={{ fontSize:20, fontWeight:700, color:"#0B1A34" }}>Remboursement en cours</div></td></tr>
        <tr><td style={td}>Nous avons bien initié votre remboursement. Le montant sera crédité sur votre compte sous <strong>5 à 10 jours ouvrés</strong> selon votre établissement bancaire.</td></tr>
        <tr><td style={{ padding:"0 32px 24px" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", background:"#F8F9FB", borderRadius:8, overflow:"hidden" }}>
            <tbody>
              {tableRow("Montant remboursé","129,90 EUR")}
              {tableRow("Référence","CMD-2026-48291")}
              {tableRow("Délai estimé","5 à 10 jours ouvrés")}
            </tbody>
          </table>
        </td></tr>
        <tr><td style={{ padding:"0 32px 32px", fontSize:13, color:"#8A9EC0", fontFamily:"Arial,sans-serif" }}>En cas de question, contactez notre support.</td></tr>
      </>
    ),
    failed: (
      <>
        <tr><td style={{ padding:"28px 32px 0" }}><div style={{ width:52, height:52, borderRadius:"50%", background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:24 }}>✕</span></div></td></tr>
        <tr><td style={{ padding:"16px 32px 8px", ...H }}><div style={{ fontSize:20, fontWeight:700, color:"#0B1A34" }}>Paiement non abouti</div></td></tr>
        <tr><td style={td}>Votre paiement de <strong>129,90 EUR</strong> n'a pas pu être traité. Veuillez vérifier vos informations bancaires ou contacter votre banque.</td></tr>
        <tr><td style={{ padding:"0 32px 20px" }}><div style={{ background:"#FEE2E2", border:"1px solid #FECACA", borderRadius:8, padding:"12px 16px", fontSize:13, color:"#991B1B", fontFamily:"Arial,sans-serif" }}>Motif : Paiement refusé par la banque émettrice</div></td></tr>
        <tr><td style={{ padding:"0 32px 32px" }}><a href="#" style={{ display:"inline-block", padding:"12px 24px", background:primary, color:"#fff", textDecoration:"none", borderRadius:8, fontSize:14, fontWeight:700, fontFamily:"Arial,sans-serif" }}>Réessayer le paiement</a></td></tr>
      </>
    ),
    sub_created: (
      <>
        <tr><td style={{ padding:"28px 32px 0" }}><div style={{ width:52, height:52, borderRadius:"50%", background:"#EDE9FE", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:22 }}>★</span></div></td></tr>
        <tr><td style={{ padding:"16px 32px 8px", ...H }}><div style={{ fontSize:20, fontWeight:700, color:"#0B1A34" }}>Bienvenue ! Abonnement activé</div></td></tr>
        <tr><td style={td}>Votre abonnement <strong>Plan Premium</strong> est maintenant actif. Profitez de tous vos avantages dès maintenant.</td></tr>
        <tr><td style={{ padding:"0 32px 24px" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", background:"#F8F9FB", borderRadius:8 }}>
            <tbody>
              {tableRow("Plan","Premium mensuel")}
              {tableRow("Montant","29,90 EUR / mois")}
              {tableRow("Prochain prélèvement","07/08/2026")}
            </tbody>
          </table>
        </td></tr>
        <tr><td style={{ padding:"0 32px 32px" }}><a href="#" style={{ display:"inline-block", padding:"12px 24px", background:primary, color:"#fff", textDecoration:"none", borderRadius:8, fontSize:14, fontWeight:700, fontFamily:"Arial,sans-serif" }}>Gérer mon abonnement</a></td></tr>
      </>
    ),
    sub_cancelled: (
      <>
        <tr><td style={{ padding:"28px 32px 0" }}><div style={{ width:52, height:52, borderRadius:"50%", background:"#FEF3C7", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:22 }}>⚠</span></div></td></tr>
        <tr><td style={{ padding:"16px 32px 8px", ...H }}><div style={{ fontSize:20, fontWeight:700, color:"#0B1A34" }}>Abonnement résilié</div></td></tr>
        <tr><td style={td}>Votre abonnement <strong>Plan Premium</strong> a été résilié. Vous conservez l'accès à vos avantages jusqu'au <strong>07/08/2026</strong>.</td></tr>
        <tr><td style={{ padding:"0 32px 24px", fontSize:13, color:"#8A9EC0", fontFamily:"Arial,sans-serif" }}>Nous espérons vous revoir bientôt. Vous pouvez vous réabonner à tout moment.</td></tr>
        <tr><td style={{ padding:"0 32px 32px" }}><a href="#" style={{ display:"inline-block", padding:"12px 24px", background:primary, color:"#fff", textDecoration:"none", borderRadius:8, fontSize:14, fontWeight:700, fontFamily:"Arial,sans-serif" }}>Me réabonner</a></td></tr>
      </>
    ),
    reminder: (
      <>
        <tr><td style={{ padding:"28px 32px 0" }}><div style={{ width:52, height:52, borderRadius:"50%", background:"#EBF2FF", display:"flex", alignItems:"center", justifyContent:"center" }}><span style={{ fontSize:22 }}>🔔</span></div></td></tr>
        <tr><td style={{ padding:"16px 32px 8px", ...H }}><div style={{ fontSize:20, fontWeight:700, color:"#0B1A34" }}>Rappel de prélèvement</div></td></tr>
        <tr><td style={td}>Un prélèvement automatique de <strong>29,90 EUR</strong> est prévu dans <strong>3 jours</strong> pour votre abonnement Plan Premium.</td></tr>
        <tr><td style={{ padding:"0 32px 24px" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", background:"#F8F9FB", borderRadius:8 }}>
            <tbody>
              {tableRow("Montant","29,90 EUR")}
              {tableRow("Date du prélèvement","10/07/2026")}
              {tableRow("Moyen","Visa ····6142")}
            </tbody>
          </table>
        </td></tr>
        <tr><td style={{ padding:"0 32px 32px" }}><a href="#" style={{ display:"inline-block", padding:"12px 24px", background:primary, color:"#fff", textDecoration:"none", borderRadius:8, fontSize:14, fontWeight:700, fontFamily:"Arial,sans-serif" }}>Gérer mon abonnement</a></td></tr>
      </>
    ),
  };

  return (
    <div style={{ padding:"16px", fontFamily:"Arial,sans-serif" }}>
      <table style={{ width:"100%", maxWidth:560, margin:"0 auto", borderCollapse:"collapse" }}>
        <tbody>
          <tr>
            <td style={{ background:primary, padding:"20px 32px", borderRadius:"8px 8px 0 0" }}>
              <div style={{ fontSize:16, fontWeight:800, color:"#fff", fontFamily:"Arial,sans-serif" }}>Boutique.fr</div>
            </td>
          </tr>
          <tr>
            <td style={{ background:"#fff" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <tbody>{bodies[id]}</tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ background:"#F8F9FB", padding:"16px 32px", borderRadius:"0 0 8px 8px", borderTop:"1px solid #EEF0F5" }}>
              <div style={{ fontSize:11, color:"#8A9EC0", fontFamily:"Arial,sans-serif", lineHeight:1.6 }}>
                Boutique SAS · 12 rue de la Paix, 75001 Paris<br />
                Vous recevez cet e-mail car vous êtes client de <strong>Boutique.fr</strong>.<br />
                <a href="#" style={{ color:"#8A9EC0" }}>Se désabonner</a> · <a href="#" style={{ color:"#8A9EC0" }}>Politique de confidentialité</a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function TemplatesPage() {
  const [activeId,     setActiveId]     = useState("confirmation");
  const [subjects,     setSubjects]     = useState<Record<string,string>>(Object.fromEntries(TEMPLATES.map(t=>[t.id,t.defaultSubject])));
  const [fromName,     setFromName]     = useState("Boutique.fr");
  const [replyTo,      setReplyTo]      = useState("support@boutique.fr");
  const [primaryColor, setPrimaryColor] = useState(PN.primary);
  const [device,       setDevice]       = useState<"desktop"|"mobile">("desktop");
  const [showPreview,  setShowPreview]  = useState(false);
  const [isDirty,      setIsDirty]      = useState(false);
  const [saveSuccess,  setSaveSuccess]  = useState(false);
  const mark = useCallback(()=>setIsDirty(true),[]);

  const active = TEMPLATES.find(t=>t.id===activeId)!;

  function insertVariable(code:string) {
    setSubjects(prev => ({ ...prev, [activeId]: (prev[activeId]||"") + code }));
    mark();
  }

  function save()  { setIsDirty(false); setSaveSuccess(true); setTimeout(()=>setSaveSuccess(false),3500); }
  function reset() { setSubjects(Object.fromEntries(TEMPLATES.map(t=>[t.id,t.defaultSubject]))); setFromName("Boutique.fr"); setReplyTo("support@boutique.fr"); setPrimaryColor(PN.primary); setIsDirty(false); }

  const inp = fieldStyle;

  return (
    <PayNowShell activePage="perso">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="templates" />

        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, marginBottom:28 }}>
              <div>
                <h1 style={{ margin:"0 0 6px", fontSize:20, fontWeight:800, color:PN.primary, letterSpacing:"-0.03em", fontFamily:FONT }}>Templates e-mail</h1>
                <p style={{ margin:0, fontSize:13, color:PN.ink3, fontFamily:FONT, lineHeight:1.55 }}>Personnalisez les e-mails envoyés automatiquement à vos clients.</p>
              </div>
              <button onClick={() => setShowPreview(true)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", border:"none", borderRadius:PN.r.md, background:PN.primary, cursor:"pointer", fontSize:13.5, fontWeight:700, fontFamily:FONT, color:"#fff", flexShrink:0, whiteSpace:"nowrap" }}>
                <Eye size={14} /> Aperçu
              </button>
            </div>

            {saveSuccess && <SaveToast message="Templates sauvegardés avec succès." />}

            {/* Template selector */}
            <SectionCard title="Sélectionner un template">
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {TEMPLATES.map(t => {
                  const TIcon = t.icon;
                  const sel = t.id === activeId;
                  return (
                    <button key={t.id} onClick={()=>setActiveId(t.id)} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", border:`1px solid ${sel?t.color+"60":PN.bord}`, borderRadius:PN.r.md, background:sel?t.color+"0D":"#fff", cursor:"pointer", textAlign:"left", transition:"all 0.12s" }}>
                      <div style={{ width:28, height:28, borderRadius:PN.r.md, background:t.color+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <TIcon size={13} style={{ color:t.color }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:sel?700:500, color:sel?PN.ink:PN.ink2, fontFamily:FONT }}>{t.label}</div>
                        <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginTop:1 }}>{t.description}</div>
                      </div>
                      {sel && <div style={{ width:6, height:6, borderRadius:"50%", background:t.color, flexShrink:0 }} />}
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            {/* Active template settings */}
            <SectionCard title={`Paramètres : ${active.label}`}>
              <FormField label="Objet de l'e-mail">
                <input value={subjects[activeId]||""} onChange={e=>{setSubjects(p=>({...p,[activeId]:e.target.value}));mark();}} style={inp} />
              </FormField>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:PN.ink3, fontFamily:FONT, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:8 }}>Variables disponibles</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {active.variables.map(v => (
                    <button key={v.code} onClick={()=>insertVariable(v.code)} title={`Insérer ${v.code}`} style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:PN.surf, cursor:"pointer", fontSize:11.5, fontFamily:"monospace", color:PN.primary, fontWeight:600 }}>
                      {v.code}
                      <span style={{ fontFamily:FONT, fontSize:10.5, color:PN.ink3, fontWeight:400 }}>{v.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* Global settings */}
            <SectionCard title="Paramètres globaux">
              <FormField label="Nom de l'expéditeur" sub="Affiché dans le champ 'De' de l'e-mail.">
                <input value={fromName} onChange={e=>{setFromName(e.target.value);mark();}} style={inp} />
              </FormField>
              <FormField label="Adresse de réponse (Reply-to)">
                <input value={replyTo} onChange={e=>{setReplyTo(e.target.value);mark();}} style={inp} placeholder="support@boutique.fr" />
              </FormField>
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:10 }}>Couleur de l'en-tête</div>
                <label style={{ display:"inline-flex", alignItems:"stretch", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden", cursor:"pointer" }}>
                  <div style={{ position:"relative", width:42, background:primaryColor, flexShrink:0 }}>
                    <input type="color" value={primaryColor} onChange={e=>{setPrimaryColor(e.target.value);mark();}} style={{ position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer", border:"none" }} />
                  </div>
                  <div style={{ padding:"0 14px", fontSize:13, fontFamily:"monospace", color:PN.ink, display:"flex", alignItems:"center", height:42 }}>{primaryColor.toUpperCase()}</div>
                </label>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} title={`Aperçu : ${active.label}`}>
        <EmailFrame
          device={device}
          controls={
            <div style={{ display:"flex", background:"rgba(255,255,255,0.85)", backdropFilter:"blur(6px)", borderRadius:PN.r.md, padding:4, gap:4, border:`1px solid ${PN.bord}` }}>
              <button onClick={()=>setDevice("desktop")} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", border:"none", borderRadius:PN.r.md, background:device==="desktop"?PN.primary:"transparent", color:device==="desktop"?"#fff":PN.ink3, fontSize:12.5, fontWeight:device==="desktop"?700:500, fontFamily:FONT, cursor:"pointer", transition:"all 0.15s" }}>
                <Monitor size={13} /> Bureau
              </button>
              <button onClick={()=>setDevice("mobile")} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", border:"none", borderRadius:PN.r.md, background:device==="mobile"?PN.primary:"transparent", color:device==="mobile"?"#fff":PN.ink3, fontSize:12.5, fontWeight:device==="mobile"?700:500, fontFamily:FONT, cursor:"pointer", transition:"all 0.15s" }}>
                <Smartphone size={13} /> Mobile
              </button>
            </div>
          }
        >
          <EmailBody id={activeId} primary={primaryColor} subject={subjects[activeId]||""} />
        </EmailFrame>
      </PreviewModal>

      <SaveFooter dirty={isDirty} success={saveSuccess} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
