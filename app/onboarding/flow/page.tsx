"use client";
import { useState } from "react";
import {
  Check, Upload, Building2, FileText, CreditCard,
  Settings, ChevronRight, ArrowLeft, Lock,
  AlertCircle, Eye, EyeOff, Clock,
  Code2, Link2, ShoppingCart, CheckCircle, UserPlus, Users,
} from "lucide-react";
import Link from "next/link";
import { DesktopOnlyModal } from "@/components/ui";

/* ─── Tokens ─────────────────────────────────────────────────── */
const C = {
  bg:     "#F8FAFC",
  white:  "#FFFFFF",
  brd:    "#E2E8F0",
  brdL:   "#F1F5F9",
  ink:    "#0F172A",
  ink2:   "#334155",
  ink3:   "#64748B",
  ink4:   "#94A3B8",
  blue:   "#3B82F6",
  blueL:  "#DBEAFE",
  blueXL: "#EFF6FF",
  blueDk: "#1D4ED8",
  panel:  "#1E3A8A",
  green:  "#16A34A",
  greenL: "#DCFCE7",
  red:    "#DC2626",
  redL:   "#FEE2E2",
  amber:  "#D97706",
  amberL: "#FEF3C7",
} as const;

/* ─── Steps ──────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Création du compte",        sub: "Email et mot de passe",        icon: <UserPlus   size={13} /> },
  { id: 2, label: "Votre entreprise",          sub: "Informations légales",          icon: <Building2  size={13} /> },
  { id: 3, label: "Documents KYB",             sub: "Pièces justificatives",         icon: <FileText   size={13} /> },
  { id: 4, label: "Bénéficiaires effectifs",   sub: "Déclaration des UBO",           icon: <Users      size={13} /> },
  { id: 5, label: "Coordonnées bancaires",     sub: "IBAN et vérification",          icon: <CreditCard size={13} /> },
  { id: 6, label: "Configuration",             sub: "Intégration et préférences",    icon: <Settings   size={13} /> },
  { id: 7, label: "Confirmation",              sub: "Compte en cours d'activation",  icon: <Check      size={13} /> },
];

/* ─── Atoms ──────────────────────────────────────────────────── */
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ margin: "0 0 7px", fontSize: 11.5, fontWeight: 700,
      color: C.ink3, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
      {children}
    </p>
  );
}

function Field({ label, value = "", type = "text", placeholder, hint, half }: {
  label: string; value?: string; type?: string;
  placeholder?: string; hint?: string; half?: boolean;
}) {
  const [vis, setVis] = useState(false);
  const isPwd = type === "password";
  return (
    <div style={{ marginBottom: 16, width: half ? "calc(50% - 6px)" : "100%" }}>
      <Label>{label}</Label>
      <div style={{ position: "relative" }}>
        <input
          type={isPwd && !vis ? "password" : "text"}
          defaultValue={value}
          placeholder={placeholder}
          style={{
            width: "100%", boxSizing: "border-box" as const,
            padding: isPwd ? "10px 40px 10px 13px" : "10px 13px",
            borderRadius: 9, border: `1.5px solid ${C.brd}`,
            background: C.white, fontSize: 13.5, color: C.ink,
            outline: "none", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => { e.target.style.borderColor = C.blue; }}
          onBlur={(e)  => { e.target.style.borderColor = C.brd; }}
        />
        {isPwd && (
          <button onClick={() => setVis((v) => !v)} style={{
            position: "absolute", right: 10, top: "50%",
            transform: "translateY(-50%)", background: "none",
            border: "none", cursor: "pointer", color: C.ink4, padding: 2,
          }}>
            {vis ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
      {hint && <p style={{ margin: "5px 0 0", fontSize: 11.5, color: C.ink4 }}>{hint}</p>}
    </div>
  );
}

function SelectField({ label, value, options, half }: {
  label: string; value: string; options: string[]; half?: boolean;
}) {
  return (
    <div style={{ marginBottom: 16, width: half ? "calc(50% - 6px)" : "100%" }}>
      <Label>{label}</Label>
      <div style={{ position: "relative" }}>
        <select defaultValue={value} style={{
          width: "100%", boxSizing: "border-box" as const,
          padding: "10px 32px 10px 13px", borderRadius: 9,
          border: `1.5px solid ${C.brd}`, background: C.white,
          fontSize: 13.5, color: C.ink, outline: "none",
          cursor: "pointer", fontFamily: "inherit",
          appearance: "none", WebkitAppearance: "none",
        }}>
          {options.map((o) => <option key={o}>{o}</option>)}
        </select>
        <div style={{ position: "absolute", right: 10, top: "50%",
          transform: "translateY(-50%)", pointerEvents: "none",
          display: "flex", flexDirection: "column", gap: 2 }}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 5L5 1L9 5" stroke={C.ink4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M1 1L5 5L9 1" stroke={C.ink4} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 12 }}>{children}</div>;
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", gap: 10, padding: "13px 15px",
      borderRadius: 10, background: C.blueXL,
      border: `1px solid ${C.blueL}`, marginBottom: 22,
    }}>
      <AlertCircle size={15} color={C.blue} style={{ flexShrink: 0, marginTop: 1 }} />
      <p style={{ margin: 0, fontSize: 12.5, color: C.ink3, lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}

type DocStatus = "done" | "pending" | "error";
function DocUpload({ label, filename, status }: {
  label: string; filename?: string; status: DocStatus;
}) {
  const cfg = {
    done:    { bg: C.greenL, brd: "#86EFAC", icon: <Check size={14} />,         col: C.green, text: filename ?? "Téléversé" },
    pending: { bg: C.white,  brd: C.brd,     icon: <Upload size={14} />,        col: C.ink4,  text: "Cliquer pour téléverser" },
    error:   { bg: C.redL,   brd: "#FCA5A5", icon: <AlertCircle size={14} />,   col: C.red,   text: "Document refusé, à remplacer" },
  }[status];
  return (
    <div style={{ marginBottom: 12 }}>
      <Label>{label}</Label>
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", borderRadius: 10, cursor: "pointer",
        background: cfg.bg, border: `1.5px dashed ${cfg.brd}`,
      }}>
        <span style={{ color: cfg.col, flexShrink: 0 }}>{cfg.icon}</span>
        <span style={{ fontSize: 13, color: status === "done" ? C.ink2 : C.ink4, flex: 1 }}>
          {cfg.text}
        </span>
        {status === "done" && <span style={{ fontSize: 11, color: C.ink4 }}>PDF · 234 Ko</span>}
      </div>
    </div>
  );
}

/* ─── Step content ───────────────────────────────────────────── */
function StepContent({ step }: { step: number }) {

  /* 1 — Compte */
  if (step === 1) return (
    <>
      <Field label="Adresse email" value="marc@distrib-europe.fr" type="email" />
      <Row>
        <Field label="Mot de passe" value="Distrib2026!" type="password" half />
        <Field label="Confirmer"   value="Distrib2026!" type="password" half />
      </Row>
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "13px 15px", borderRadius: 10,
        background: C.blueXL, border: `1px solid ${C.blueL}`,
        marginBottom: 16, cursor: "pointer",
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
          background: C.blue, border: `2px solid ${C.blue}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: 1,
        }}>
          <Check size={10} color="#fff" strokeWidth={3} />
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: C.ink3, lineHeight: 1.6 }}>
          J'accepte les <span style={{ color: C.blue }}>Conditions Générales d'Utilisation</span>{" "}
          et la <span style={{ color: C.blue }}>Politique de confidentialité</span> de PayNow.
        </p>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px", borderRadius: 9,
        background: C.brdL, fontSize: 12, color: C.ink4,
      }}>
        <Lock size={12} color={C.ink4} />
        <span>Connexion chiffrée TLS 1.3 · vos données sont protégées</span>
      </div>
    </>
  );

  /* 2 — Entreprise */
  if (step === 2) return (
    <>
      <InfoBox>
        Entrez votre numéro SIRET pour pré-remplir automatiquement les informations depuis le registre INSEE.
      </InfoBox>
      <Field label="Numéro SIRET" value="834 981 276 00023"
        hint="14 chiffres · vérification automatique via l'INSEE" />
      <Field label="Raison sociale" value="DISTRIB EUROPE SAS" />
      <Row>
        <SelectField label="Forme juridique" value="SAS" half
          options={["SAS", "SARL", "SA", "EURL", "Auto-entrepreneur", "Autre"]} />
        <SelectField label="Secteur d'activité" value="Commerce de détail" half
          options={["Commerce de détail", "E-commerce", "Services B2B", "Restauration", "Hébergement", "Autre"]} />
      </Row>
      <Field label="Site web" value="www.distrib-europe.fr" placeholder="https://monsite.fr" />
    </>
  );

  /* 3 — Documents */
  if (step === 3) return (
    <>
      <InfoBox>
        Ces documents sont requis par la réglementation LCB-FT. Ils sont transmis de façon chiffrée et n'ont pour seul usage que la vérification réglementaire.
      </InfoBox>
      <DocUpload label="Extrait Kbis (moins de 3 mois)" filename="kbis_distrib_europe.pdf" status="done" />
      <DocUpload label="Pièce d'identité du dirigeant"  filename="cni_m_durand_recto.jpg"  status="done" />
      <DocUpload label="Justificatif de domicile du siège"                                  status="pending" />
      <DocUpload label="RIB de l'entreprise"            filename="rib_distrib_europe.pdf"   status="done" />
      <p style={{ margin: "14px 0 0", fontSize: 12, color: C.ink4 }}>
        Formats acceptés : PDF, JPG, PNG · Taille max. 10 Mo par fichier
      </p>
    </>
  );

  /* 4 — Bénéficiaires effectifs */
  if (step === 4) return (
    <>
      <InfoBox>
        Toute personne physique détenant directement ou indirectement <strong>plus de 25 % du capital</strong> doit être déclarée comme bénéficiaire effectif (art. L.561-45-1 du CMF).
      </InfoBox>

      {/* Carte UBO existante */}
      <div style={{
        border: `1.5px solid ${C.brd}`, borderRadius: 12,
        background: C.white, marginBottom: 12, overflow: "hidden",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: `1px solid ${C.brdL}`,
          background: C.brdL,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: C.blueXL,
              border: `1.5px solid ${C.blueL}`, display: "flex",
              alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>MD</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.ink }}>Marc Durand</p>
              <p style={{ margin: 0, fontSize: 11.5, color: C.ink4 }}>Représentant légal · Gérant</p>
            </div>
          </div>
          <div style={{
            padding: "4px 10px", borderRadius: 20,
            background: C.blueXL, border: `1px solid ${C.blueL}`,
            fontSize: 12, fontWeight: 700, color: C.blue,
          }}>
            80 %
          </div>
        </div>

        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {[
            { label: "Date de naissance", value: "14/03/1978" },
            { label: "Nationalité",        value: "Française"  },
            { label: "Pays de résidence",  value: "France"     },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: C.ink4 }}>{label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: C.ink2 }}>{value}</span>
            </div>
          ))}
          <div style={{
            marginTop: 4, display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8,
            background: C.greenL, border: `1px solid #86EFAC`,
          }}>
            <Check size={13} color={C.green} strokeWidth={3} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: C.green, fontWeight: 500 }}>
              CNI_Marc_Durand.pdf · Identité vérifiée
            </span>
          </div>
        </div>
      </div>

      {/* Bouton ajouter */}
      <button style={{
        width: "100%", padding: "11px", borderRadius: 10, cursor: "pointer",
        border: `1.5px dashed ${C.brd}`, background: C.white,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        fontSize: 13.5, fontWeight: 500, color: C.ink3, fontFamily: "inherit",
      }}>
        <Users size={15} color={C.ink4} />
        Ajouter un bénéficiaire effectif
      </button>

      <p style={{ margin: "14px 0 0", fontSize: 12, color: C.ink4, lineHeight: 1.6 }}>
        Si aucun actionnaire ne dépasse 25 %, déclarez le(s) dirigeant(s) exerçant un contrôle effectif.
      </p>
    </>
  );

  /* 5 — Banque */
  if (step === 5) return (
    <>
      <InfoBox>
        Les virements seront effectués sur ce compte selon votre calendrier (J+1 ou J+7 ouvrés).
      </InfoBox>
      <Field label="Titulaire du compte" value="DISTRIB EUROPE SAS" />
      <Field label="IBAN" value="FR76 3000 4028 3798 7654 3210 943"
        hint="Zone SEPA uniquement" />
      <Row>
        <Field label="BIC / SWIFT" value="BNPAFRPPXXX" half />
        <Field label="Banque" value="BNP Paribas" half />
      </Row>
      <div style={{
        display: "flex", gap: 12, padding: "16px 18px", borderRadius: 12,
        background: C.brdL, border: `1px solid ${C.brd}`, marginTop: 6,
      }}>
        <Clock size={16} color={C.ink3} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ margin: "0 0 5px", fontSize: 13.5, fontWeight: 600, color: C.ink2 }}>
            Vérification par micro-virement
          </p>
          <p style={{ margin: 0, fontSize: 12.5, color: C.ink3, lineHeight: 1.6 }}>
            Nous déposerons moins de 0,50 € sur ce compte sous 24 h.
            Confirmez le montant exact dans votre espace pour valider le RIB.
          </p>
        </div>
      </div>
    </>
  );

  /* 6 — Configuration */
  if (step === 6) return (
    <>
      {/* Volume */}
      <div style={{ marginBottom: 24 }}>
        <Label>Volume mensuel estimé</Label>
        <div style={{ display: "flex", gap: 8 }}>
          {["< 5 000 €", "5 à 50 k€", "50 à 200 k€", "> 200 k€"].map((v, i) => (
            <button key={v} style={{
              flex: 1, padding: "10px 4px", borderRadius: 9,
              cursor: "pointer", fontFamily: "inherit", fontSize: 12.5,
              border: `1.5px solid ${i === 1 ? C.blue : C.brd}`,
              background: i === 1 ? C.blueXL : C.white,
              color: i === 1 ? C.blue : C.ink3,
              fontWeight: i === 1 ? 600 : 400,
            }}>{v}</button>
          ))}
        </div>
      </div>

      {/* Pays */}
      <div style={{ marginBottom: 24 }}>
        <Label>Pays d'activité</Label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
          {[
            { name: "France", sel: true },
            { name: "Belgique", sel: true },
            { name: "Suisse", sel: false },
            { name: "Luxembourg", sel: false },
            { name: "Espagne", sel: false },
            { name: "Italie", sel: false },
          ].map((p) => (
            <div key={p.name} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "7px 14px", borderRadius: 8, cursor: "pointer",
              border: `1.5px solid ${p.sel ? C.blue : C.brd}`,
              background: p.sel ? C.blueXL : C.white,
            }}>
              {p.sel && <Check size={12} color={C.blue} strokeWidth={3} />}
              <span style={{
                fontSize: 13, fontWeight: p.sel ? 600 : 400,
                color: p.sel ? C.blue : C.ink3,
              }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intégration */}
      <div>
        <Label>Type d'intégration</Label>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {[
            { label: "API REST",           sub: "Intégration sur mesure, contrôle total des flux", icon: <Code2        size={18} />, sel: false },
            { label: "Lien de paiement",   sub: "Aucun code requis · envoi par email ou SMS",      icon: <Link2        size={18} />, sel: true  },
            { label: "Plugin e-commerce",  sub: "WooCommerce, Shopify, PrestaShop, Magento",       icon: <ShoppingCart size={18} />, sel: false },
          ].map((opt) => (
            <div key={opt.label} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "14px 16px", borderRadius: 11, cursor: "pointer",
              border: `1.5px solid ${opt.sel ? C.blue : C.brd}`,
              background: opt.sel ? C.blueXL : C.white,
            }}>
              <span style={{ color: opt.sel ? C.blue : C.ink4 }}>{opt.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 600,
                  color: opt.sel ? C.blue : C.ink }}>{opt.label}</p>
                <p style={{ margin: 0, fontSize: 12, color: C.ink4 }}>{opt.sub}</p>
              </div>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${opt.sel ? C.blue : C.brd}`,
                background: opt.sel ? C.blue : C.white,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {opt.sel && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  /* 7 — Confirmation */
  return (
    <div style={{ textAlign: "center" as const, padding: "16px 0" }}>
      <div style={{
        width: 76, height: 76, borderRadius: "50%",
        background: C.greenL, border: "3px solid #86EFAC",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
      }}>
        <CheckCircle size={38} color={C.green} />
      </div>
      <h2 style={{ margin: "0 0 10px", fontSize: 24, fontWeight: 700,
        color: C.ink, letterSpacing: "-0.02em" }}>
        Dossier envoyé !
      </h2>
      <p style={{ margin: "0 0 32px", fontSize: 14.5, color: C.ink3, lineHeight: 1.65, maxWidth: 380, marginInline: "auto" }}>
        Le compte marchand <strong>DISTRIB EUROPE SAS</strong> est en cours de vérification.
        Confirmation par email sous <strong>1 à 2 jours ouvrés</strong>.
      </p>

      {/* Status tracker */}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: 10, marginBottom: 32, textAlign: "left" as const }}>
        {[
          { label: "Informations légales", status: "Vérifiées",    color: C.green, icon: <Check size={13} /> },
          { label: "Documents KYB",        status: "En cours",     color: C.amber, icon: <Clock size={13} /> },
          { label: "Vérification IBAN",    status: "En attente",   color: C.ink4,  icon: <Clock size={13} /> },
        ].map((row) => (
          <div key={row.label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 16px", borderRadius: 10,
            background: C.brdL, border: `1px solid ${C.brd}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: row.color }}>{row.icon}</span>
              <span style={{ fontSize: 13.5, color: C.ink2 }}>{row.label}</span>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: row.color }}>{row.status}</span>
          </div>
        ))}
      </div>

      <Link href="/paynow/dashboard" style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600,
        background: C.blue, color: "#fff", textDecoration: "none",
      }}>
        Accéder au back-office <ChevronRight size={15} />
      </Link>
    </div>
  );
}

/* ─── Left Panel ─────────────────────────────────────────────── */
function LeftPanel({ current }: { current: number }) {
  return (
    <aside style={{
      width: 272, minWidth: 272, flexShrink: 0,
      background: C.panel, display: "flex",
      flexDirection: "column", padding: "32px 24px",
      minHeight: "100vh",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 44 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "#fff", display: "flex",
          alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <span style={{ fontWeight: 900, fontSize: 17, color: C.panel, letterSpacing: "-0.03em" }}>P</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 17, color: "#fff", letterSpacing: "-0.01em" }}>PayNow</span>
      </div>

      <p style={{ margin: "0 0 6px", fontSize: 10.5, fontWeight: 700,
        color: "rgba(255,255,255,0.38)", letterSpacing: "0.12em",
        textTransform: "uppercase" as const }}>
        Activation marchand
      </p>
      <h2 style={{ margin: "0 0 36px", fontSize: 19, fontWeight: 700,
        color: "#fff", lineHeight: 1.35, letterSpacing: "-0.02em" }}>
        Votre compte<br />en 15 minutes
      </h2>

      {/* Step list */}
      <div style={{ flex: 1 }}>
        {STEPS.map((s, i) => {
          const done   = s.id < current;
          const active = s.id === current;
          return (
            <div key={s.id} style={{ display: "flex", gap: 14 }}>
              {/* Indicator + connector */}
              <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", width: 24, flexShrink: 0 }}>
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background:   done   ? C.green
                              : active ? "rgba(255,255,255,0.12)"
                              : "rgba(255,255,255,0.07)",
                  border: active ? `2px solid rgba(255,255,255,0.5)` : "none",
                }}>
                  {done
                    ? <Check size={12} color="#fff" strokeWidth={3} />
                    : active
                    ? <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "block" }} />
                    : <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.22)", display: "block" }} />
                  }
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 1.5, minHeight: 24, flex: 1,
                    background: done ? "rgba(22,163,74,0.45)" : "rgba(255,255,255,0.1)",
                    margin: "4px 0",
                  }} />
                )}
              </div>
              {/* Label */}
              <div style={{ paddingBottom: i < STEPS.length - 1 ? 18 : 0, paddingTop: 2 }}>
                <p style={{
                  margin: "0 0 2px", fontSize: 13.5, lineHeight: 1.2,
                  fontWeight: active ? 700 : 500,
                  color: done ? "rgba(255,255,255,0.5)" : active ? "#fff" : "rgba(255,255,255,0.3)",
                }}>{s.label}</p>
                {active && (
                  <p style={{ margin: 0, fontSize: 11.5, color: "rgba(255,255,255,0.45)" }}>{s.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: 28, paddingTop: 22,
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
          <Lock size={12} color="rgba(255,255,255,0.35)" />
          <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)" }}>Données chiffrées et sécurisées</span>
        </div>
        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
          Besoin d'aide ?{" "}
          <span style={{ color: "rgba(255,255,255,0.5)", cursor: "pointer", textDecoration: "underline" }}>
            support@paynow.fr
          </span>
        </p>
      </div>
    </aside>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const isLast    = step === STEPS.length;
  const progress  = ((step - 1) / (STEPS.length - 1)) * 100;
  const isSubmit  = step === STEPS.length - 1;

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "Inter, system-ui, sans-serif",
      background: C.bg, colorScheme: "light",
    }}>
      <LeftPanel current={step} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Progress bar */}
        <div style={{ height: 3, background: C.brdL, flexShrink: 0 }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: C.blue, transition: "width 0.45s ease",
          }} />
        </div>

        {/* Content area */}
        <div style={{
          flex: 1, display: "flex", alignItems: "flex-start",
          justifyContent: "center", padding: "52px 32px 48px",
          overflowY: "auto",
        }}>
          <div style={{ width: "100%", maxWidth: 520 }}>

            {/* Step header */}
            {!isLast && (
              <div style={{ marginBottom: 32 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  color: C.blue, textTransform: "uppercase" as const,
                }}>
                  Étape {step} sur {STEPS.length}
                </span>
                <h1 style={{ margin: "8px 0 6px", fontSize: 28, fontWeight: 700,
                  color: C.ink, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                  {STEPS[step - 1].label}
                </h1>
                <p style={{ margin: 0, fontSize: 14.5, color: C.ink3 }}>
                  {STEPS[step - 1].sub}
                </p>
              </div>
            )}

            {/* Step content */}
            <StepContent step={step} />

            {/* Navigation */}
            {!isLast && (
              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginTop: 28,
                paddingTop: 22, borderTop: `1px solid ${C.brdL}`,
              }}>
                {step > 1 ? (
                  <button onClick={() => setStep((s) => s - 1)} style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 18px", borderRadius: 9,
                    background: "none", border: `1.5px solid ${C.brd}`,
                    cursor: "pointer", color: C.ink3, fontSize: 13.5,
                    fontFamily: "inherit",
                  }}>
                    <ArrowLeft size={14} /> Précédent
                  </button>
                ) : (
                  <Link href="/onboarding" style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "10px 18px", borderRadius: 9,
                    border: `1.5px solid ${C.brd}`, textDecoration: "none",
                    color: C.ink3, fontSize: 13.5,
                  }}>
                    <ArrowLeft size={14} /> Retour
                  </Link>
                )}

                <button onClick={() => setStep((s) => s + 1)} style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "10px 26px", borderRadius: 9,
                  background: C.blue, border: "none",
                  cursor: "pointer", color: "#fff",
                  fontSize: 13.5, fontWeight: 600, fontFamily: "inherit",
                }}>
                  {isSubmit ? "Envoyer le dossier" : "Continuer"}
                  {!isSubmit && <ChevronRight size={14} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <DesktopOnlyModal backHref="/onboarding" backLabel="Retour au case study" />
    </div>
  );
}
