"use client";
import { useState, useCallback } from "react";
import { GripVertical, Lock, CreditCard, Calendar, ShieldCheck, User, Mail, Phone, MapPin, Hash, Globe, Eye } from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav, SectionCard, SaveFooter, SaveToast, ToggleRow, fieldStyle, DeviceFrame, PreviewModal } from "../_perso";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & DATA
───────────────────────────────────────────────────────────────────────────── */
interface Field { id:string; label:string; icon:React.ElementType; required:boolean; visible:boolean; locked?:boolean }

const INIT_FIELDS: Field[] = [
  { id:"card_number",  label:"Numéro de carte",   icon:CreditCard,  required:true,  visible:true,  locked:true },
  { id:"expiry",       label:"Date d'expiration",  icon:Calendar,    required:true,  visible:true,  locked:true },
  { id:"cvv",          label:"CVV",                icon:ShieldCheck, required:true,  visible:true,  locked:true },
  { id:"holder_name",  label:"Nom du porteur",      icon:User,        required:false, visible:true  },
  { id:"email",        label:"Adresse e-mail",      icon:Mail,        required:false, visible:true  },
  { id:"phone",        label:"Téléphone",           icon:Phone,       required:false, visible:false },
  { id:"address",      label:"Adresse",             icon:MapPin,      required:false, visible:false },
  { id:"postal_code",  label:"Code postal",         icon:Hash,        required:false, visible:false },
  { id:"city",         label:"Ville",               icon:Globe,       required:false, visible:false },
];

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT FORM PREVIEW
───────────────────────────────────────────────────────────────────────────── */
function FormPreview({ fields, showAmount, showRef, showLogos, primary }: {
  fields:Field[]; showAmount:boolean; showRef:boolean; showLogos:boolean; primary:string;
}) {
  const visible = fields.filter(f => f.visible);
  const LOGOS = ["CB","Visa","Mastercard","Apple Pay"];
  return (
    <div style={{ padding:"28px 32px 36px", fontFamily:FONT }}>
      {showLogos && (
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:20 }}>
          {LOGOS.map(m => (
            <div key={m} style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"5px 10px", fontSize:11, fontWeight:700, color:PN.ink2, boxShadow:"0 1px 3px rgba(0,0,0,0.06)" }}>{m}</div>
          ))}
        </div>
      )}
      {showAmount && (
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:PN.surf, borderRadius:PN.r.md, padding:"12px 16px", marginBottom:18, border:`1px solid ${PN.bord}` }}>
          <span style={{ fontSize:13, color:PN.ink3 }}>Total à régler</span>
          <span style={{ fontSize:18, fontWeight:800, color:PN.ink, letterSpacing:"-0.02em" }}>129,90 EUR</span>
        </div>
      )}
      {showRef && (
        <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:"monospace", marginBottom:14, paddingLeft:2 }}>Réf. CMD-2026-48291</div>
      )}
      {visible.map(f => (
        <div key={f.id} style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:600, color:PN.ink2, marginBottom:6 }}>
            {f.label}{f.required && <span style={{ color:PN.red, marginLeft:2 }}>*</span>}
          </div>
          <div style={{ height:42, background:f.locked?"#F5F8FF":"#fff", border:`1px solid ${f.locked?"#C5D3F0":PN.bord}`, borderRadius:PN.r.md, display:"flex", alignItems:"center", paddingLeft:12, gap:8 }}>
            <f.icon size={14} style={{ color:f.locked?PN.primary:PN.ink3, flexShrink:0 }} />
            {f.locked && <Lock size={11} style={{ color:PN.primary, opacity:0.6 }} />}
            <div style={{ flex:1, height:12, borderRadius:4, background:f.locked?"#DCE7FF":PN.surf }} />
          </div>
        </div>
      ))}
      <button style={{ width:"100%", padding:"13px", background:primary, border:"none", borderRadius:PN.r.md, color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", marginTop:6, letterSpacing:"0.03em" }}>
        PAYER
      </button>
      <div style={{ textAlign:"center", marginTop:14, fontSize:11, color:PN.ink3 }}>
        Paiement 100% sécurisé · chiffrement SSL/TLS
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FIELD ROW
───────────────────────────────────────────────────────────────────────────── */
function FieldRow({ field, onVisibleChange, onRequiredChange }: { field:Field; onVisibleChange:()=>void; onRequiredChange:()=>void }) {
  const Icon = field.icon;
  const tog = (on:boolean, disabled:boolean, onClick:()=>void, color:string) => (
    <button onClick={disabled?undefined:onClick} disabled={disabled}
      style={{ width:36, height:20, borderRadius:PN.r.full, background:on?color:PN.ink4, border:"none", cursor:disabled?"not-allowed":"pointer", padding:2, display:"flex", alignItems:"center", justifyContent:on?"flex-end":"flex-start", opacity:disabled?0.3:1, transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 4px rgba(0,0,0,0.2)" }} />
    </button>
  );
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 0", borderBottom:`1px solid ${PN.bord}` }}>
      <GripVertical size={14} style={{ color:field.locked?"transparent":PN.ink4, cursor:field.locked?"default":"grab", flexShrink:0 }} />
      <div style={{ width:26, height:26, borderRadius:PN.r.md, background:PN.surf, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={13} style={{ color:PN.ink3 }} />
      </div>
      <div style={{ flex:1, fontSize:13.5, color:PN.ink, fontFamily:FONT }}>
        {field.label}
        {field.locked && <span style={{ marginLeft:8, fontSize:10.5, fontWeight:700, color:PN.blueText, background:PN.blueBg, borderRadius:PN.r.md, padding:"2px 7px" }}>Fixe</span>}
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:52 }}>
        <span style={{ fontSize:10, color:PN.ink3, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>Visible</span>
        {tog(field.visible, !!field.locked, onVisibleChange, PN.primary)}
      </div>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, minWidth:68 }}>
        <span style={{ fontSize:10, color:PN.ink3, fontWeight:700, letterSpacing:"0.05em", textTransform:"uppercase" }}>Requis</span>
        {tog(field.required, !!field.locked || !field.visible, onRequiredChange, PN.red)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function CollectePage() {
  const [fields,      setFields]      = useState<Field[]>(INIT_FIELDS);
  const [showAmount,  setShowAmount]  = useState(true);
  const [showRef,     setShowRef]     = useState(true);
  const [showLogos,   setShowLogos]   = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isDirty,     setIsDirty]     = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const mark = useCallback(() => setIsDirty(true), []);

  function toggleVisible(id:string)  { setFields(fs => fs.map(f => f.id===id ? {...f, visible:!f.visible, required:!f.visible?f.required:false} : f)); mark(); }
  function toggleRequired(id:string) { setFields(fs => fs.map(f => f.id===id ? {...f, required:!f.required} : f)); mark(); }
  function save()  { setIsDirty(false); setSaveSuccess(true); setTimeout(()=>setSaveSuccess(false),3500); }
  function reset() { setFields(INIT_FIELDS); setShowAmount(true); setShowRef(true); setShowLogos(true); setIsDirty(false); }

  return (
    <PayNowShell activePage="perso">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="collecte" />

        {/* ── SETTINGS ── */}
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>

            {/* Header */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:20, marginBottom:28 }}>
              <div>
                <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Collecte de données</h1>
                <p style={{ margin:0, fontSize:13, color:PN.ink3, fontFamily:FONT, lineHeight:1.55 }}>Champs affichés sur votre formulaire de paiement hébergé.</p>
              </div>
              <button onClick={() => setShowPreview(true)} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 18px", border:"none", borderRadius:PN.r.md, background:PN.primary, cursor:"pointer", fontSize:13.5, fontWeight:700, fontFamily:FONT, color:"#fff", flexShrink:0, whiteSpace:"nowrap" }}>
                <Eye size={14} /> Aperçu
              </button>
            </div>

            {saveSuccess && <SaveToast message="Formulaire sauvegardé avec succès." />}

            <SectionCard title="Champs du formulaire" subtitle="Champs carte toujours actifs. Les autres sont configurables.">
              <div style={{ borderTop:`1px solid ${PN.bord}` }}>
                {fields.map(f => (
                  <FieldRow key={f.id} field={f} onVisibleChange={()=>toggleVisible(f.id)} onRequiredChange={()=>toggleRequired(f.id)} />
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Affichage">
              <ToggleRow label="Montant total" sub="Affiché en haut du formulaire." on={showAmount} onChange={()=>{setShowAmount(a=>!a);mark();}} />
              <ToggleRow label="Référence commande" sub="Numéro transmis dans la requête API." on={showRef} onChange={()=>{setShowRef(r=>!r);mark();}} />
              <ToggleRow label="Logos des moyens de paiement" sub="CB, Visa, Mastercard, Apple Pay…" on={showLogos} onChange={()=>{setShowLogos(l=>!l);mark();}} last />
            </SectionCard>
          </div>
        </div>
      </div>

      {/* ── PREVIEW MODAL ── */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} title="Aperçu : Formulaire de collecte">
        <DeviceFrame>
          <FormPreview fields={fields} showAmount={showAmount} showRef={showRef} showLogos={showLogos} primary={PN.primary} />
        </DeviceFrame>
      </PreviewModal>

      <SaveFooter dirty={isDirty} success={saveSuccess} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
