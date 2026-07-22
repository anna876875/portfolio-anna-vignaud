"use client";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  X, ChevronUp, ChevronDown, MoreHorizontal,
  Copy, Check, Calendar, RotateCcw,
} from "lucide-react";
import { PN, FONT } from "./_shell";

/* ─── Couleur header commune ─── */
const HDR      = "#ECFDF5";   /* vert doux et clair — fond header */
const HDR_INK  = "#065F46";   /* vert foncé — texte + icônes actifs */
const HDR_ICON = "rgba(6,95,70,0.55)"; /* icônes secondaires */
const HDR_SEP  = "rgba(6,95,70,0.15)"; /* séparateur */
const GREEN_ACCENT = "#059669"; /* accentuation interne (badges, dates) */

/* ─────────────────────────────────────────────────────────────────────────────
   DRAWER SHELL (conteneur partagé)
───────────────────────────────────────────────────────────────────────────── */
function DrawerShell({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return createPortal(
    <div style={{ position:"fixed", inset:0, zIndex:9000, display:"flex", justifyContent:"flex-end" }}>
      {/* Backdrop */}
      <div
        style={{ position:"absolute", inset:0, background:"rgba(11,26,52,0.30)", backdropFilter:"blur(3px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div style={{ position:"relative", width:680, height:"100%", background:"#fff", display:"flex", flexDirection:"column", boxShadow:"-8px 0 48px rgba(11,26,52,0.22)" }}>

        {/* ── Header vert doux ── */}
        <div style={{ background:HDR, height:52, display:"flex", alignItems:"center", gap:2, padding:"0 14px", flexShrink:0, borderBottom:`1px solid rgba(6,95,70,0.12)` }}>
          <button onClick={onClose} style={hdrBtn}>
            <X size={15} />
          </button>
          <div style={{ width:1, height:18, background:HDR_SEP, margin:"0 6px" }} />
          <button style={hdrBtn}><ChevronDown size={14} /></button>
          <button style={hdrBtn}><ChevronUp size={14} /></button>

          <span style={{ flex:1, fontSize:14, fontWeight:700, color:HDR_INK, fontFamily:FONT, letterSpacing:"-0.01em", paddingLeft:8 }}>
            {title}
          </span>

          <button style={hdrBtn}><RotateCcw size={14} /></button>
          <button style={hdrBtn}><MoreHorizontal size={16} /></button>
        </div>

        {/* ── Corps ── */}
        <div style={{ flex:1, overflowY:"auto", padding:"22px 24px 32px" }}>
          {children}
        </div>

        {/* ── Footer (forms) ── */}
        {footer && (
          <div style={{ padding:"16px 24px", borderTop:`1px solid ${PN.bord}`, display:"flex", gap:10, justifyContent:"flex-end", background:"#fff", flexShrink:0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

const hdrBtn: React.CSSProperties = {
  border:"none", background:"none", cursor:"pointer",
  color:HDR_ICON, padding:"6px 8px",
  borderRadius:PN.r.md, display:"flex", flexShrink:0,
};

/* ─────────────────────────────────────────────────────────────────────────────
   FORM MODAL (create / edit — centré)
───────────────────────────────────────────────────────────────────────────── */
export function FormModal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return createPortal(
    <div style={{ position:"fixed", inset:0, zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(11,26,52,0.35)", backdropFilter:"blur(4px)" }} onClick={onClose} />
      <div style={{ position:"relative", background:"#fff", borderRadius:PN.r.xl, width:600, maxHeight:"88vh", display:"flex", flexDirection:"column", boxShadow:"0 24px 64px rgba(11,26,52,0.22)", overflow:"hidden" }}>
        {/* Header */}
        <div style={{ padding:"18px 24px 16px", borderBottom:`1px solid ${PN.bord}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <span style={{ fontSize:16, fontWeight:800, color:PN.ink, fontFamily:FONT, letterSpacing:"-0.02em" }}>{title}</span>
          <button onClick={onClose} style={{ border:"none", background:"none", cursor:"pointer", color:PN.ink3, padding:"4px 6px", display:"flex", borderRadius:PN.r.md }}>
            <X size={17} />
          </button>
        </div>
        {/* Body */}
        <div style={{ flex:1, overflowY:"auto", padding:"22px 24px 24px" }}>
          {children}
        </div>
        {/* Footer */}
        {footer && (
          <div style={{ padding:"14px 24px", borderTop:`1px solid ${PN.bord}`, display:"flex", gap:10, justifyContent:"flex-end", background:"#fff", flexShrink:0 }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────────────────────────────── */
function CopyBtn({ value }: { value: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard?.writeText(value); setOk(true); setTimeout(() => setOk(false), 1500); }}
      style={{ border:"none", background:"none", cursor:"pointer", padding:"1px 5px", color:PN.ink3, display:"inline-flex", verticalAlign:"middle", flexShrink:0 }}
    >
      {ok ? <Check size={12} style={{ color:GREEN_ACCENT }} /> : <Copy size={12} />}
    </button>
  );
}

function Field({ label, value, mono, copy }: { label:string; value:string; mono?:boolean; copy?:boolean }) {
  return (
    <div>
      <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3, fontWeight:500 }}>{label}</div>
      <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:mono?"monospace":FONT, letterSpacing:mono?"0.02em":undefined, display:"flex", alignItems:"center" }}>
        {value}{copy && <CopyBtn value={value} />}
      </div>
    </div>
  );
}

/* VISA icon */
function VisaIcon() {
  return (
    <svg width="38" height="24" viewBox="0 0 38 24" fill="none">
      <rect width="38" height="24" rx="4" fill="#1A1F71"/>
      <text x="19" y="17" textAnchor="middle" fontSize="12" fontWeight="900" fill="#fff" fontFamily="Arial,sans-serif" fontStyle="italic" letterSpacing="-0.5">VISA</text>
    </svg>
  );
}

/* Apple Pay icon */
function ApplePayIcon() {
  return (
    <svg width="52" height="24" viewBox="0 0 52 24" fill="none">
      <rect width="52" height="24" rx="4" fill="#000"/>
      <text x="26" y="16" textAnchor="middle" fontSize="8" fontWeight="500" fill="#fff" fontFamily="-apple-system,sans-serif" letterSpacing="0.03em">Apple Pay</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ALIAS DETAIL DRAWER
───────────────────────────────────────────────────────────────────────────── */
export interface AliasDetailData {
  id: string;
  status: string | null;
  reference: string;
  moyen: string;
  idMoyen: string;
  dateExpiration: string;
  dateCreation: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
}

const ALIAS_STATUS: Record<string, { bg:string; color:string; label:string }> = {
  actif:    { bg:GREEN_ACCENT, color:"#fff", label:"Actif" },
  inactif:  { bg:PN.red,      color:"#fff", label:"Inactif" },
  nouveau:  { bg:PN.primary,  color:"#fff", label:"Nouveau" },
  paiement: { bg:PN.amber,    color:"#fff", label:"1 paiement" },
};

export function AliasDetailDrawer({ data, onClose }: { data: AliasDetailData; onClose: () => void }) {
  const [tab, setTab] = useState<"acheteur" | "auth">("acheteur");
  const sc = data.status ? ALIAS_STATUS[data.status] : null;

  /* Données acheteur fictives (cohérentes avec la maquette) */
  const buyer = {
    nom:      "Eva Poree",
    email:    data.email || "johndoe@exemple.com",
    raison:   "Fintech Corp",
    mobile:   data.telephone || "06 55 82 36 54",
    tel:      "05 55 82 36 54",
    adresse:  data.adresse || "Allée des roses",
    compl:    "Bâtiments B",
    ip:       "185.244.73.82",
    info:     "PSP",
  };

  return (
    <DrawerShell title="Détail de l'alias plateforme" onClose={onClose}>

      {/* ── Ligne 1 : badge + référence | dates ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>

        {/* Badge statut + référence acheteur */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {sc && (
            <span style={{ display:"inline-flex", alignItems:"center", background:sc.bg, color:sc.color, borderRadius:PN.r.md, padding:"6px 16px", fontSize:13, fontWeight:700, fontFamily:FONT, width:"fit-content" }}>
              {sc.label}
            </span>
          )}
          <div>
            <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3 }}>Référence de l&apos; acheteur</div>
            <div style={{ fontSize:14, fontWeight:700, color:PN.ink, fontFamily:"monospace", display:"flex", alignItems:"center" }}>
              {data.reference}<CopyBtn value={data.reference} />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
          <Calendar size={16} style={{ color:PN.ink3, marginTop:2, flexShrink:0 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>Crée le <strong style={{ color:PN.ink }}>{data.dateCreation} à 12:12</strong></div>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>Résilié le : <strong style={{ color:PN.ink }}>04/08/2026</strong></div>
          </div>
        </div>
      </div>

      {/* ── Ligne 2 : infos auth | carte paiement ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:22 }}>

        {/* Colonne gauche */}
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <Field label="Date d'autorisation"   value={data.dateCreation} />
          <Field label="Numéro d'autorisation" value="356489" />
          <Field label="Boutique"              value="lygo-store.com (54568598)" />
          <div>
            <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3 }}>ID Alias</div>
            <div style={{ fontSize:13, fontWeight:700, color:PN.ink, fontFamily:"monospace", display:"flex", alignItems:"center", flexWrap:"wrap" }}>
              {data.id}<CopyBtn value={data.id} />
            </div>
          </div>
        </div>

        {/* Carte paiement */}
        <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"14px 16px", display:"flex", flexDirection:"column", gap:0 }}>

          {/* Carte */}
          <div style={{ paddingBottom:14 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, marginBottom:10 }}>Carte</div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
              <VisaIcon />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:PN.ink, fontFamily:"monospace", display:"flex", alignItems:"center" }}>
                  {data.idMoyen}<CopyBtn value={data.idMoyen} />
                </div>
                <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT }}>
                  Date d&apos;expiration : <strong style={{ color:GREEN_ACCENT }}>{data.dateExpiration}</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={{ height:1, background:PN.bord }} />

          {/* Token réseau */}
          <div style={{ paddingTop:14 }}>
            <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <ApplePayIcon />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, marginBottom:6 }}>Token réseau</div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:12.5, fontWeight:700, color:PN.ink, fontFamily:"monospace" }}>{data.idMoyen}</span>
                  <span style={{ fontSize:10.5, fontWeight:700, color:GREEN_ACCENT, fontFamily:FONT }}>Actif</span>
                </div>
                <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT }}>
                  Date d&apos;expiration : <strong style={{ color:GREEN_ACCENT }}>{data.dateExpiration}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:"flex", borderBottom:`1px solid ${PN.bord}`, marginBottom:20 }}>
        {(["acheteur","auth"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 20px", border:"none", background:"none", fontSize:13.5, fontFamily:FONT, cursor:"pointer", fontWeight:tab===t?700:500, color:tab===t?PN.ink:PN.ink3, borderBottom:tab===t?`2px solid ${PN.ink}`:"2px solid transparent", marginBottom:-1, display:"flex", alignItems:"center", gap:7 }}>
            {t === "acheteur" ? "Informations de l'acheteur" : "Authentification"}
            {t === "auth" && (
              <span style={{ width:18, height:18, borderRadius:"50%", border:`1.5px solid ${GREEN_ACCENT}`, display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                <Check size={10} style={{ color:GREEN_ACCENT }} />
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab acheteur ── */}
      {tab === "acheteur" ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 40px" }}>
          <Field label="Nom de l'acheteur"          value={buyer.nom} />
          <Field label="Adresse"                    value={buyer.adresse} />
          <div>
            <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3 }}>E-mail</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, display:"flex", alignItems:"center" }}>
              {buyer.email}<CopyBtn value={buyer.email} />
            </div>
          </div>
          <Field label="Complément d'adresse"       value={buyer.compl} />
          <Field label="Raison sociale"             value={buyer.raison} />
          <Field label="IP de l'acheteur"           value={buyer.ip} mono />
          <Field label="Téléphone mobile"           value={buyer.mobile} />
          <Field label="Informations de l'acheteur" value={buyer.info} />
          <Field label="Téléphone"                  value={buyer.tel} />
          <div>
            <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3 }}>Langue de la page de paiement</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, display:"flex", alignItems:"center", gap:7 }}>
              🇫🇷 Français
            </div>
          </div>
        </div>
      ) : (
        /* Tab authentification */
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div style={{ padding:"14px 16px", background:"#ECFDF5", borderRadius:PN.r.md, border:`1px solid #A7F3D0`, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ width:32, height:32, borderRadius:"50%", background:GREEN_ACCENT, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Check size={16} color="#fff" strokeWidth={2.5} />
            </span>
            <div>
              <div style={{ fontSize:13.5, fontWeight:700, color:"#065F46", fontFamily:FONT }}>Authentification réussie</div>
              <div style={{ fontSize:12, color:"#065F46", opacity:0.75, fontFamily:FONT, marginTop:2 }}>3DS v2 · Liabilité shift effectuée</div>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px 40px" }}>
            <Field label="Protocole"       value="3DS v2.1" />
            <Field label="Statut"          value="Authentifié" />
            <Field label="ARes"            value="Y" mono />
            <Field label="ECI"             value="05" mono />
            <Field label="Liabilité shift" value="Oui" />
            <Field label="Date"            value={data.dateCreation} />
          </div>
        </div>
      )}
    </DrawerShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ABONNEMENT DETAIL DRAWER  (même shell, contenu adapté)
───────────────────────────────────────────────────────────────────────────── */
export interface AbonnementDetailData {
  reference: string;
  dateCreation: string;
  dateEffet: string;
  dateResiliation: string;
  echeancesTraitees: number;
  echeancesTotales: number;
  montantFixe: string;
  montantInitial: string;
  referenceCommande: string;
  validation: string;
  alias: string;
  nomAcheteur: string;
  emailBoutique: string;
  referenceAcheteur: string;
}

const ABO_STATUS: Record<string, { bg:string; color:string; label:string }> = {
  Automatique: { bg:GREEN_ACCENT, color:"#fff", label:"Actif" },
  Manuelle:    { bg:PN.amber,  color:"#fff", label:"Manuel" },
};

export function AbonnementDetailDrawer({ data, onClose }: { data: AbonnementDetailData; onClose: () => void }) {
  const [tab, setTab] = useState<"recap" | "acheteur">("recap");
  const sc = ABO_STATUS[data.validation] ?? { bg:PN.ink3, color:"#fff", label:data.validation };

  return (
    <DrawerShell title="Détail de l'abonnement" onClose={onClose}>

      {/* ── Ligne 1 : badge + référence | dates ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <span style={{ display:"inline-flex", alignItems:"center", background:sc.bg, color:sc.color, borderRadius:PN.r.md, padding:"6px 16px", fontSize:13, fontWeight:700, fontFamily:FONT, width:"fit-content" }}>
            {sc.label}
          </span>
          <div>
            <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3 }}>Référence</div>
            <div style={{ fontSize:14, fontWeight:700, color:PN.ink, fontFamily:"monospace", display:"flex", alignItems:"center" }}>
              {data.reference}<CopyBtn value={data.reference} />
            </div>
          </div>
        </div>

        <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
          <Calendar size={16} style={{ color:PN.ink3, marginTop:2, flexShrink:0 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>Créé le <strong style={{ color:PN.ink }}>{data.dateCreation}</strong></div>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>Date d&apos;effet : <strong style={{ color:PN.ink }}>{data.dateEffet}</strong></div>
            <div style={{ fontSize:12.5, color:PN.ink3, fontFamily:FONT }}>Résilié le : {data.dateResiliation}</div>
          </div>
        </div>
      </div>

      {/* ── Métriques ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:22 }}>
        {[
          { label:"Montant fixe",    value:data.montantFixe },
          { label:"Montant initial", value:data.montantInitial },
          { label:"Échéances",       value:`${data.echeancesTraitees} / ${data.echeancesTotales}` },
        ].map(({ label, value }) => (
          <div key={label} style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"12px 14px", background:PN.surf }}>
            <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginBottom:5 }}>{label}</div>
            <div style={{ fontSize:16, fontWeight:800, color:PN.ink, fontFamily:FONT, letterSpacing:"-0.02em" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:"flex", borderBottom:`1px solid ${PN.bord}`, marginBottom:20 }}>
        {(["recap","acheteur"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 20px", border:"none", background:"none", fontSize:13.5, fontFamily:FONT, cursor:"pointer", fontWeight:tab===t?700:500, color:tab===t?PN.ink:PN.ink3, borderBottom:tab===t?`2px solid ${PN.ink}`:"2px solid transparent", marginBottom:-1 }}>
            {t === "recap" ? "Récapitulatif" : "Informations acheteur"}
          </button>
        ))}
      </div>

      {/* ── Contenu ── */}
      {tab === "recap" ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 40px" }}>
          <Field label="Référence de commande" value={data.referenceCommande} mono />
          <Field label="Alias associé"         value={data.alias === "N/A" ? "Non lié" : data.alias} mono={data.alias !== "—"} />
          <Field label="Validation"            value={data.validation} />
          <Field label="Email boutique"        value={data.emailBoutique} />
          <Field label="Référence acheteur"    value={data.referenceAcheteur} />
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 40px" }}>
          <Field label="Nom de l'acheteur"  value={data.nomAcheteur} />
          <div>
            <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3 }}>Email boutique</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, display:"flex", alignItems:"center" }}>
              {data.emailBoutique}<CopyBtn value={data.emailBoutique} />
            </div>
          </div>
          <Field label="Référence acheteur" value={data.referenceAcheteur} />
          <Field label="Alias"              value={data.alias === "N/A" ? "Non lié" : data.alias} />
        </div>
      )}
    </DrawerShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIRM DIALOG
───────────────────────────────────────────────────────────────────────────── */
export function ConfirmDialog({ title, message, confirmLabel, confirmColor, onConfirm, onCancel }: {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return createPortal(
    <div style={{ position:"fixed", inset:0, zIndex:9100, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ position:"absolute", inset:0, background:"rgba(11,26,52,0.38)", backdropFilter:"blur(4px)" }} onClick={onCancel} />
      <div style={{ position:"relative", background:"#fff", borderRadius:PN.r.xl, padding:"32px", width:440, boxShadow:"0 24px 64px rgba(11,26,52,0.22)" }}>
        <div style={{ fontSize:17, fontWeight:800, color:PN.ink, fontFamily:FONT, marginBottom:10 }}>{title}</div>
        <div style={{ fontSize:13.5, color:PN.ink2, fontFamily:FONT, lineHeight:1.65, marginBottom:28 }}>{message}</div>
        <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
          <button onClick={onCancel} style={{ padding:"10px 20px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", color:PN.ink2, fontSize:13.5, fontWeight:600, fontFamily:FONT, cursor:"pointer" }}>
            Annuler
          </button>
          <button onClick={onConfirm} style={{ padding:"10px 20px", border:"none", borderRadius:PN.r.md, background:confirmColor ?? PN.primary, color:"#fff", fontSize:13.5, fontWeight:700, fontFamily:FONT, cursor:"pointer" }}>
            {confirmLabel ?? "Confirmer"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FORM ATOMS
───────────────────────────────────────────────────────────────────────────── */
const inputStyle = {
  display:"block", width:"100%", height:42,
  padding:"0 12px", border:`1px solid ${PN.bord}`,
  borderRadius:PN.r.md, fontSize:13.5, fontFamily:FONT, color:PN.ink,
  background:"#fff", outline:"none", boxSizing:"border-box" as const,
};

function FormRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ minWidth:0 }}>
      <label style={{ display:"block", fontSize:11, fontWeight:700, color:PN.ink3, fontFamily:FONT, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      {children}
    </div>
  );
}

function BtnCancel({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding:"10px 20px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", color:PN.ink2, fontSize:13.5, fontWeight:600, fontFamily:FONT, cursor:"pointer" }}>
      Annuler
    </button>
  );
}

function BtnSave({ onClick, label }: { onClick: () => void; label?: string }) {
  return (
    <button onClick={onClick} style={{ padding:"10px 22px", border:"none", borderRadius:PN.r.md, background:PN.primary, color:"#fff", fontSize:13.5, fontWeight:700, fontFamily:FONT, cursor:"pointer" }}>
      {label ?? "Enregistrer"}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TRANSACTION DETAIL DRAWER
───────────────────────────────────────────────────────────────────────────── */
export interface TransactionDetailData {
  id: number;
  ordre: string;
  montant: number;
  date: string;
  time: string;
  statut: string;
  moyen: string;
  auth: string;
  uuid: string;
  email: string;
}

const TX_STATUT_CFG: Record<string, { label:string; bg:string; color:string; dot:string }> = {
  en_attente: { label:"En attente",  bg:"#FFFBEB", color:"#92400E", dot:"#F59E0B" },
  expiree:    { label:"Expirée",     bg:"#F3F4F6", color:"#4B5563", dot:"#9CA3AF" },
  refusee:    { label:"Refusée",     bg:"#FEF2F2", color:"#991B1B", dot:"#EF4444" },
  presentee:  { label:"Présentée",  bg:"#EFF6FF", color:"#1E40AF", dot:"#3B82F6" },
};

const TX_AUTH_CFG: Record<string, { label:string; color:string }> = {
  reussie:   { label:"Réussie",   color:"#059669" },
  tentative: { label:"Tentative", color:"#F59E0B" },
  echec:     { label:"Échec",     color:"#EF4444" },
  autorisee: { label:"Autorisée", color:"#3B82F6" },
};

export function TransactionDetailDrawer({ data, onClose }: { data: TransactionDetailData; onClose: () => void }) {
  const [tab, setTab] = useState<"acheteur" | "historique">("acheteur");
  const sc  = TX_STATUT_CFG[data.statut]  ?? { label:data.statut, bg:PN.surf, color:PN.ink2, dot:PN.ink3 };
  const ac  = TX_AUTH_CFG[data.auth]      ?? { label:data.auth,   color:PN.ink2 };
  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits:2, maximumFractionDigits:2 });

  return (
    <DrawerShell title="Détail de la transaction" onClose={onClose}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:18 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <div>
            <div style={{ fontSize:28, fontWeight:800, color:PN.ink, fontFamily:FONT, letterSpacing:"-0.04em", lineHeight:1 }}>{fmt(data.montant)}</div>
            <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginTop:3 }}>EUR</div>
          </div>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:sc.bg, color:sc.color, borderRadius:PN.r.md, padding:"6px 14px", fontSize:13, fontWeight:700, fontFamily:FONT, width:"fit-content" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, flexShrink:0 }} />
            {sc.label}
          </span>
        </div>
        <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start" }}>
          <Calendar size={16} style={{ color:PN.ink3, marginTop:2, flexShrink:0 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>Le <strong style={{ color:PN.ink }}>{data.date}</strong> à <strong style={{ color:PN.ink }}>{data.time}</strong></div>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>Ordre n° <strong style={{ color:PN.ink }}>{data.ordre}</strong></div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 40px", marginBottom:22 }}>
        <div>
          <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3, fontWeight:500 }}>UUID transaction</div>
          <div style={{ fontSize:13, fontWeight:700, color:PN.ink, fontFamily:"monospace", display:"flex", alignItems:"center" }}>{data.uuid}<CopyBtn value={data.uuid} /></div>
        </div>
        <Field label="Moyen de paiement" value={data.moyen} />
        <div>
          <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3, fontWeight:500 }}>Authentification</div>
          <div style={{ fontSize:13.5, fontWeight:700, color:ac.color, fontFamily:FONT }}>{ac.label}</div>
        </div>
        <div>
          <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3, fontWeight:500 }}>Email acheteur</div>
          <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, display:"flex", alignItems:"center" }}>{data.email}<CopyBtn value={data.email} /></div>
        </div>
      </div>
      <div style={{ display:"flex", borderBottom:`1px solid ${PN.bord}`, marginBottom:20 }}>
        {(["acheteur","historique"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding:"10px 20px", border:"none", background:"none", fontSize:13.5, fontFamily:FONT, cursor:"pointer", fontWeight:tab===t?700:500, color:tab===t?PN.ink:PN.ink3, borderBottom:tab===t?`2px solid ${PN.ink}`:"2px solid transparent", marginBottom:-1 }}>
            {t === "acheteur" ? "Informations acheteur" : "Historique"}
          </button>
        ))}
      </div>
      {tab === "acheteur" ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px 40px" }}>
          <Field label="Nom de l'acheteur" value="Eva Poree" />
          <Field label="IP acheteur" value="185.244.73.82" mono />
          <div>
            <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:3, fontWeight:500 }}>E-mail</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT, display:"flex", alignItems:"center" }}>{data.email}<CopyBtn value={data.email} /></div>
          </div>
          <Field label="Pays" value="France" />
          <Field label="Téléphone" value="06 55 82 36 54" />
          <Field label="Langue" value="fr-FR" />
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column" }}>
          {[
            { label:"Transaction initiée",     color:PN.ink3      },
            { label:"Authentification 3DS",     color:PN.amber     },
            { label:"Authentification réussie", color:GREEN_ACCENT },
            { label:`Statut: ${sc.label}`,      color:sc.dot       },
          ].map((ev, i, arr) => (
            <div key={i} style={{ display:"flex", gap:14, paddingBottom:i < arr.length-1 ? 20 : 0 }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:ev.color, marginTop:4, flexShrink:0 }} />
                {i < arr.length-1 && <div style={{ width:1, flex:1, background:PN.bord, marginTop:4 }} />}
              </div>
              <div>
                <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT }}>{data.date} {data.time}</div>
                <div style={{ fontSize:13.5, fontWeight:600, color:PN.ink, fontFamily:FONT, marginTop:2 }}>{ev.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DrawerShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCHEDULE DRAWER
───────────────────────────────────────────────────────────────────────────── */
export function ScheduleDrawer({ reference, montant, frequence, dateEffet, onClose }: {
  reference: string; montant: string; frequence: string; dateEffet?: string; onClose: () => void;
}) {
  const rows = Array.from({ length:12 }, (_, i) => ({
    num: i + 1,
    date: `${String(i + 1).padStart(2,"0")}/${String((i % 12) + 1).padStart(2,"0")}/2026`,
    statut: i < 3 ? "payee" : i === 3 ? "en_cours" : "a_venir",
  }));
  const SCFG = {
    payee:    { label:"Payée",    bg:PN.greenBg, color:PN.greenText },
    en_cours: { label:"En cours", bg:PN.amberBg, color:PN.amberText },
    a_venir:  { label:"À venir",  bg:PN.surf,    color:PN.ink3      },
  };
  return (
    <DrawerShell title={`Échéancier : ${reference}`} onClose={onClose}>
      <div style={{ display:"flex", gap:32, marginBottom:22 }}>
        {[{ label:"Montant", value:montant }, { label:"Fréquence", value:frequence }, { label:"Date d'effet", value:dateEffet ?? "N/A" }].map(({ label, value }) => (
          <div key={label}>
            <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginBottom:3, textTransform:"uppercase", letterSpacing:"0.06em", fontWeight:700 }}>{label}</div>
            <div style={{ fontSize:14, fontWeight:800, color:PN.ink, fontFamily:FONT }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:PN.surf }}>
              {["N°","Date","Montant","Statut"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, fontFamily:FONT, letterSpacing:"0.07em", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const sc = SCFG[r.statut as keyof typeof SCFG];
              return (
                <tr key={r.num} style={{ borderTop:`1px solid ${PN.bord}`, background:r.statut === "en_cours" ? PN.primaryBg : "#fff" }}>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:PN.ink3, fontFamily:FONT }}>{r.num}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, color:PN.ink, fontFamily:FONT }}>{r.date}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{montant}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ background:sc.bg, color:sc.color, borderRadius:PN.r.md, padding:"3px 10px", fontSize:12, fontWeight:600, fontFamily:FONT }}>{sc.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DrawerShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   BUYER EDIT DRAWER
───────────────────────────────────────────────────────────────────────────── */
export function BuyerEditDrawer({ aliasId, email, onClose }: { aliasId: string; email: string; onClose: () => void }) {
  const [nom, setNom] = useState("Eva Poree");
  const [emailV, setEmailV] = useState(email);
  const [raison, setRaison] = useState("Fintech Corp");
  const [mobile, setMobile] = useState("06 55 82 36 54");
  const [tel, setTel] = useState("05 55 82 36 54");
  const [adresse, setAdresse] = useState("Allée des roses");
  const [compl, setCompl] = useState("Bâtiment B");
  const [cp, setCp] = useState("31000");
  const [ville, setVille] = useState("Toulouse");
  const inp = inputStyle;
  return (
    <FormModal title="Modifier les infos acheteur" onClose={onClose} footer={<><BtnCancel onClick={onClose} /><BtnSave onClick={onClose} /></>}>
      <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginBottom:20 }}>
        Alias : <strong style={{ color:PN.ink, fontFamily:"monospace" }}>{aliasId}</strong>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 20px" }}>
        <FormRow label="Nom de l'acheteur"><input value={nom}     onChange={e=>setNom(e.target.value)}     style={inp} /></FormRow>
        <FormRow label="Adresse">          <input value={adresse} onChange={e=>setAdresse(e.target.value)} style={inp} /></FormRow>
        <FormRow label="E-mail">           <input value={emailV}  onChange={e=>setEmailV(e.target.value)}  style={inp} /></FormRow>
        <FormRow label="Complément">       <input value={compl}   onChange={e=>setCompl(e.target.value)}   style={inp} /></FormRow>
        <FormRow label="Raison sociale">   <input value={raison}  onChange={e=>setRaison(e.target.value)}  style={inp} /></FormRow>
        <FormRow label="Code postal">      <input value={cp}      onChange={e=>setCp(e.target.value)}      style={inp} /></FormRow>
        <FormRow label="Téléphone mobile"> <input value={mobile}  onChange={e=>setMobile(e.target.value)}  style={inp} /></FormRow>
        <FormRow label="Ville">            <input value={ville}   onChange={e=>setVille(e.target.value)}   style={inp} /></FormRow>
        <FormRow label="Téléphone">        <input value={tel}     onChange={e=>setTel(e.target.value)}     style={inp} /></FormRow>
        <FormRow label="Pays">
          <select style={inp}><option>France</option><option>Belgique</option><option>Espagne</option><option>Luxembourg</option></select>
        </FormRow>
      </div>
    </FormModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAYMENT UPDATE DRAWER
───────────────────────────────────────────────────────────────────────────── */
export function PaymentUpdateDrawer({ aliasId, currentCard, onClose }: { aliasId: string; currentCard: string; onClose: () => void }) {
  const [num, setNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const inp = inputStyle;
  return (
    <FormModal title="Mettre à jour le moyen de paiement" onClose={onClose} footer={<><BtnCancel onClick={onClose} /><BtnSave onClick={onClose} label="Mettre à jour" /></>}>
      <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"14px 18px", marginBottom:26, display:"flex", alignItems:"center", gap:14 }}>
        <VisaIcon />
        <div>
          <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginBottom:2, fontWeight:500 }}>Carte actuelle · Alias : {aliasId}</div>
          <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:"monospace" }}>{currentCard}</div>
        </div>
      </div>
      <div style={{ fontSize:11.5, fontWeight:700, color:PN.ink3, fontFamily:FONT, marginBottom:16, textTransform:"uppercase", letterSpacing:"0.07em" }}>Nouvelle carte</div>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <FormRow label="Numéro de carte"><input value={num} onChange={e=>setNum(e.target.value)} placeholder="0000 0000 0000 0000" style={inp} /></FormRow>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <FormRow label="Date d'expiration"><input value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="MM/AA" style={inp} /></FormRow>
          <FormRow label="CVV"><input value={cvv} onChange={e=>setCvv(e.target.value)} placeholder="***" style={inp} /></FormRow>
        </div>
        <FormRow label="Titulaire"><input value={holder} onChange={e=>setHolder(e.target.value)} placeholder="Nom sur la carte" style={inp} /></FormRow>
      </div>
    </FormModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CREATE SUBSCRIPTION DRAWER
───────────────────────────────────────────────────────────────────────────── */
export function CreateSubscriptionDrawer({ aliasId, email, onClose }: { aliasId: string; email: string; onClose: () => void }) {
  const [montant, setMontant] = useState("");
  const [freq, setFreq] = useState("mensuel");
  const [dateEffet, setDateEffet] = useState("");
  const [echeances, setEcheances] = useState("12");
  const [reference, setReference] = useState("");
  const [validation, setValidation] = useState("Automatique");
  const inp = inputStyle;
  return (
    <FormModal title="Créer un abonnement" onClose={onClose} footer={<><BtnCancel onClick={onClose} /><BtnSave onClick={onClose} label="Créer l'abonnement" /></>}>
      <div style={{ background:PN.surf, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"12px 16px", marginBottom:22, fontSize:13, color:PN.ink2, fontFamily:FONT }}>
        Alias : <strong style={{ color:PN.ink, fontFamily:"monospace" }}>{aliasId}</strong> · Acheteur : <strong style={{ color:PN.ink }}>{email}</strong>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 20px" }}>
        <FormRow label="Montant (EUR)"><input value={montant} onChange={e=>setMontant(e.target.value)} placeholder="29.90" style={inp} /></FormRow>
        <FormRow label="Fréquence">
          <select value={freq} onChange={e=>setFreq(e.target.value)} style={inp}>
            <option value="quotidien">Quotidien</option><option value="hebdomadaire">Hebdomadaire</option>
            <option value="mensuel">Mensuel</option><option value="annuel">Annuel</option>
          </select>
        </FormRow>
        <FormRow label="Date d'effet"><input type="date" value={dateEffet} onChange={e=>setDateEffet(e.target.value)} style={inp} /></FormRow>
        <FormRow label="Échéances"><input value={echeances} onChange={e=>setEcheances(e.target.value)} placeholder="12" style={inp} /></FormRow>
        <FormRow label="Référence commande"><input value={reference} onChange={e=>setReference(e.target.value)} placeholder="CMD-XXXX" style={inp} /></FormRow>
        <FormRow label="Validation">
          <select value={validation} onChange={e=>setValidation(e.target.value)} style={inp}>
            <option>Automatique</option><option>Manuelle</option>
          </select>
        </FormRow>
      </div>
    </FormModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EDIT SUBSCRIPTION DRAWER
───────────────────────────────────────────────────────────────────────────── */
export function EditSubscriptionDrawer({ reference, montant, frequence, validation, onClose }: {
  reference: string; montant: string; frequence: string; validation: string; onClose: () => void;
}) {
  const [montantV, setMontantV] = useState(montant);
  const [freqV, setFreqV] = useState(frequence.toLowerCase());
  const [dateRes, setDateRes] = useState("");
  const [validationV, setValidationV] = useState(validation);
  const inp = inputStyle;
  return (
    <FormModal title="Modifier l'abonnement" onClose={onClose} footer={<><BtnCancel onClick={onClose} /><BtnSave onClick={onClose} /></>}>
      <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginBottom:20 }}>
        Référence : <strong style={{ color:PN.ink, fontFamily:"monospace" }}>{reference}</strong>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px 20px" }}>
        <FormRow label="Montant (EUR)"><input value={montantV} onChange={e=>setMontantV(e.target.value)} style={inp} /></FormRow>
        <FormRow label="Fréquence">
          <select value={freqV} onChange={e=>setFreqV(e.target.value)} style={inp}>
            <option value="quotidien">Quotidien</option><option value="hebdomadaire">Hebdomadaire</option>
            <option value="mensuel">Mensuel</option><option value="annuel">Annuel</option>
          </select>
        </FormRow>
        <FormRow label="Date de résiliation"><input type="date" value={dateRes} onChange={e=>setDateRes(e.target.value)} style={inp} /></FormRow>
        <FormRow label="Validation">
          <select value={validationV} onChange={e=>setValidationV(e.target.value)} style={inp}>
            <option>Automatique</option><option>Manuelle</option>
          </select>
        </FormRow>
      </div>
    </FormModal>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REMISE DETAIL DRAWER
───────────────────────────────────────────────────────────────────────────── */
export interface RemiseDetailData {
  id: number; reference: string; date: string;
  banque: string; nbTx: number; montant: number;
  statut: "en_cours" | "envoyee" | "acceptee" | "refusee";
}

const REMISE_SC: Record<string, { bg:string; color:string; dot:string; label:string }> = {
  en_cours: { bg:PN.blueBg,   color:PN.blueText,  dot:PN.blue,  label:"En cours"  },
  envoyee:  { bg:PN.amberBg,  color:PN.amberText, dot:PN.amber, label:"Envoyée"   },
  acceptee: { bg:PN.greenBg,  color:PN.greenText, dot:PN.green, label:"Acceptée"  },
  refusee:  { bg:PN.redBg,    color:PN.redText,   dot:PN.red,   label:"Refusée"   },
};

const TX_MOYENS = ["Visa", "Mastercard", "CB", "Apple Pay", "American Express"];

export function RemiseDetailDrawer({ data, onClose }: { data: RemiseDetailData; onClose: () => void }) {
  const sc  = REMISE_SC[data.statut];
  const fmt = (n: number) => n.toLocaleString("fr-FR", { minimumFractionDigits:2, maximumFractionDigits:2 });

  const mockTx = Array.from({ length: Math.min(data.nbTx, 8) }, (_, i) => {
    const seed      = data.id * 13 + i * 7;
    const moyen     = TX_MOYENS[seed % TX_MOYENS.length];
    const baseMontant = data.montant / data.nbTx;
    const factor    = 0.7 + (seed % 60) / 100;
    const montantTx = +(baseMontant * factor).toFixed(2);
    const refused   = seed % 11 === 0;
    return { ordre: String(850000 + data.id * 100 + i), montantTx, moyen, refused };
  });

  return (
    <DrawerShell title={`Remise ${data.reference}`} onClose={onClose}>
      {/* Status + reference block */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:20 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, background:sc.bg, color:sc.color, borderRadius:PN.r.md, padding:"6px 16px", fontSize:13, fontWeight:700, fontFamily:FONT, width:"fit-content" }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:sc.dot, flexShrink:0 }} />
            {sc.label}
          </span>
          <div style={{ fontSize:13, color:PN.ink2, fontFamily:FONT }}>
            Banque : <strong style={{ color:PN.ink }}>{data.banque}</strong>
          </div>
        </div>
        <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"14px 16px", display:"flex", gap:10, alignItems:"flex-start" }}>
          <Calendar size={15} style={{ color:PN.ink3, marginTop:2, flexShrink:0 }} />
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>
              Émise le <strong style={{ color:PN.ink }}>{data.date}</strong>
            </div>
            <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>
              Référence : <strong style={{ color:PN.ink, fontFamily:"monospace" }}>{data.reference}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:24 }}>
        {[
          { label:"Transactions",  value: data.nbTx.toLocaleString("fr-FR") },
          { label:"Montant total", value: `${fmt(data.montant)} €` },
          { label:"Panier moyen",  value: `${fmt(data.montant / data.nbTx)} €` },
        ].map(m => (
          <div key={m.label} style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"12px 14px", background:PN.surf }}>
            <div style={{ fontSize:10.5, color:PN.ink3, fontFamily:FONT, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>{m.label}</div>
            <div style={{ fontSize:16, fontWeight:800, color:PN.ink, fontFamily:FONT, letterSpacing:"-0.02em" }}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Transactions table */}
      <div style={{ fontSize:11, fontWeight:700, color:PN.ink3, textTransform:"uppercase", letterSpacing:"0.06em", fontFamily:FONT, marginBottom:10 }}>
        Transactions incluses{data.nbTx > 8 ? ` (aperçu : ${data.nbTx} au total)` : ""}
      </div>
      <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:PN.surf }}>
              {["N° Commande","Montant","Moyen","Statut"].map(h => (
                <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, fontFamily:FONT, letterSpacing:"0.07em", textTransform:"uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTx.map((tx, i) => (
              <tr key={i} style={{ borderTop:`1px solid ${PN.bord}` }}>
                <td style={{ padding:"11px 14px", fontSize:13, fontFamily:"monospace", fontWeight:700, color:PN.ink }}>{tx.ordre}</td>
                <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{fmt(tx.montantTx)} €</td>
                <td style={{ padding:"11px 14px", fontSize:13, color:PN.ink2, fontFamily:FONT }}>{tx.moyen}</td>
                <td style={{ padding:"11px 14px" }}>
                  <span style={{ background:tx.refused?PN.redBg:PN.greenBg, color:tx.refused?PN.redText:PN.greenText, borderRadius:PN.r.md, padding:"3px 10px", fontSize:12, fontWeight:600, fontFamily:FONT }}>
                    {tx.refused ? "Refusée" : "Acceptée"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DrawerShell>
  );
}

