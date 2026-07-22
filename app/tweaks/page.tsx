"use client";

import { useEffect, useState, useCallback } from "react";

/* ── Tokens ── */
const BG    = "#F8FAFC";
const SURF  = "#FFFFFF";
const BORD  = "#E2E8F0";
const INK   = "#0F172A";
const INK2  = "#475569";
const INK3  = "#94A3B8";
const ACC   = "#A259FF";
const ACCL  = "rgba(162,89,255,0.08)";
const GRN   = "#16A34A";
const SF    = "system-ui, -apple-system, sans-serif";

/* ── Types ── */
type Content = Record<string, Record<string, Record<string, unknown>>>;

/* ── Atoms ── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11, border: "none",
        background: value ? ACC : "#CBD5E1",
        position: "relative", cursor: "pointer", flexShrink: 0,
        transition: "background 0.18s",
      }}>
      <span style={{
        position: "absolute", top: 3, left: value ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        transition: "left 0.18s",
        display: "block",
      }} />
    </button>
  );
}

function Field({
  label, value, onChange, multiline = false,
}: {
  label: string; value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%", fontFamily: SF, fontSize: 13, color: INK,
    background: BG, border: `1px solid ${BORD}`, borderRadius: 8,
    padding: "8px 10px", outline: "none", boxSizing: "border-box",
    resize: "vertical" as const,
    transition: "border-color 0.15s",
  };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600,
        color: INK3, letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: 4 }}>{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
            style={base} onFocus={e => (e.target.style.borderColor = ACC)}
            onBlur={e => (e.target.style.borderColor = BORD)} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)}
            style={{ ...base, resize: undefined }} onFocus={e => (e.target.style.borderColor = ACC)}
            onBlur={e => (e.target.style.borderColor = BORD)} />
      }
    </div>
  );
}

function TagsField({ label, value, onChange }: {
  label: string; value: string[]; onChange: (v: string[]) => void;
}) {
  const raw = value.join(", ");
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600,
        color: INK3, letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: 4 }}>{label} <span style={{ fontWeight:400, textTransform:"none" }}>(séparés par des virgules)</span></label>
      <input type="text" defaultValue={raw}
        onBlur={e => { onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean)); e.target.style.borderColor = BORD; }}
        style={{ width: "100%", fontFamily: SF, fontSize: 13, color: INK,
          background: BG, border: `1px solid ${BORD}`, borderRadius: 8,
          padding: "8px 10px", outline: "none", boxSizing: "border-box" }}
        onFocus={e => (e.target.style.borderColor = ACC)} />
    </div>
  );
}

function VisibilityRow({ label, desc, value, onChange }: {
  label: string; desc?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, padding: "10px 0", borderBottom: `1px solid ${BORD}` }}>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: INK }}>{label}</p>
        {desc && <p style={{ margin: 0, fontSize: 11, color: INK3 }}>{desc}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h3 style={{ margin: "0 0 14px", fontSize: 13, fontWeight: 700, color: INK2,
        letterSpacing: "0.06em", textTransform: "uppercase",
        paddingBottom: 8, borderBottom: `1px solid ${BORD}` }}>{title}</h3>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: SURF, border: `1px solid ${BORD}`,
      borderRadius: 12, padding: 20, marginBottom: 16 }}>
      {children}
    </div>
  );
}

/* ── Page tabs ── */
const PAGES = [
  { id: "home",       label: "Accueil",    href: "/" },
  { id: "paynow",     label: "PayNow",     href: "/paynow" },
  { id: "lcbft",      label: "LCB-FT",     href: "/lcb-ft/description" },
  { id: "onboarding", label: "Onboarding", href: "/onboarding" },
] as const;
type PageId = typeof PAGES[number]["id"];

/* ── Helpers ── */
function str(v: unknown): string { return typeof v === "string" ? v : ""; }
function bool(v: unknown): boolean { return typeof v === "boolean" ? v : true; }
function arr(v: unknown): string[] { return Array.isArray(v) ? v as string[] : []; }

function setNested(obj: Content, path: string[], value: unknown): Content {
  const out = JSON.parse(JSON.stringify(obj)) as Content;
  let cur: Record<string, unknown> = out as Record<string, unknown>;
  for (let i = 0; i < path.length - 1; i++) {
    cur = cur[path[i]] as Record<string, unknown>;
  }
  cur[path[path.length - 1]] = value;
  return out;
}

/* ══════════════════════════════════════════════════════════════
   PAGE EDITORS
   ══════════════════════════════════════════════════════════════ */

function HomeEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h = (data.home?.hero ?? {}) as Record<string, unknown>;
  const p = (data.home?.projects ?? {}) as Record<string, unknown>;
  const pn = (p.paynow ?? {}) as Record<string, unknown>;
  const ob = (p.onboarding ?? {}) as Record<string, unknown>;
  const lc = (p.lcbft ?? {}) as Record<string, unknown>;

  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  return (
    <>
      <Section title="Hero">
        <Card>
          <Field label="Accroche" value={str(h.eyebrow)}
            onChange={v => set(["home","hero","eyebrow"], v)} />
          <Field label="Titre ligne 1 (noir)" value={str(h.titleLine1)}
            onChange={v => set(["home","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2 (violet)" value={str(h.titleLine2)}
            onChange={v => set(["home","hero","titleLine2"], v)} />
          <VisibilityRow label="Grille interactive" desc="Cadrillage avec ripple au clic"
            value={bool(h.showGrid)} onChange={v => set(["home","hero","showGrid"], v)} />
          <VisibilityRow label="Traits techniques" desc="Schéma décoratif en fond"
            value={bool(h.showTechLines)} onChange={v => set(["home","hero","showTechLines"], v)} />
          <VisibilityRow label="Flèche de scroll"
            value={bool(h.showScrollArrow)} onChange={v => set(["home","hero","showScrollArrow"], v)} />
        </Card>
      </Section>

      <Section title="Carte projet : PayNow">
        <Card>
          <Field label="Numéro" value={str(pn.num)} onChange={v => set(["home","projects","paynow","num"], v)} />
          <Field label="Label / sous-titre" value={str(pn.label)} onChange={v => set(["home","projects","paynow","label"], v)} />
          <Field label="Titre" value={str(pn.title)} onChange={v => set(["home","projects","paynow","title"], v)} />
          <Field label="Description" value={str(pn.desc)} onChange={v => set(["home","projects","paynow","desc"], v)} multiline />
          <TagsField label="Tags" value={arr(pn.tags)} onChange={v => set(["home","projects","paynow","tags"], v)} />
        </Card>
      </Section>

      <Section title="Carte projet : Self-onboarding">
        <Card>
          <Field label="Numéro" value={str(ob.num)} onChange={v => set(["home","projects","onboarding","num"], v)} />
          <Field label="Label / sous-titre" value={str(ob.label)} onChange={v => set(["home","projects","onboarding","label"], v)} />
          <Field label="Titre" value={str(ob.title)} onChange={v => set(["home","projects","onboarding","title"], v)} />
          <Field label="Description" value={str(ob.desc)} onChange={v => set(["home","projects","onboarding","desc"], v)} multiline />
          <TagsField label="Tags" value={arr(ob.tags)} onChange={v => set(["home","projects","onboarding","tags"], v)} />
        </Card>
      </Section>

      <Section title="Carte projet : LCB-FT">
        <Card>
          <Field label="Numéro" value={str(lc.num)} onChange={v => set(["home","projects","lcbft","num"], v)} />
          <Field label="Label / sous-titre" value={str(lc.label)} onChange={v => set(["home","projects","lcbft","label"], v)} />
          <Field label="Titre" value={str(lc.title)} onChange={v => set(["home","projects","lcbft","title"], v)} />
          <Field label="Description" value={str(lc.desc)} onChange={v => set(["home","projects","lcbft","desc"], v)} multiline />
          <TagsField label="Tags" value={arr(lc.tags)} onChange={v => set(["home","projects","lcbft","tags"], v)} />
        </Card>
      </Section>
    </>
  );
}

function PayNowEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h  = (data.paynow?.hero    ?? {}) as Record<string, unknown>;
  const ct = (data.paynow?.context ?? {}) as Record<string, unknown>;
  const ca = (data.paynow?.cta     ?? {}) as Record<string, unknown>;
  const ft = (data.paynow?.footer  ?? {}) as Record<string, unknown>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  return (
    <>
      <Section title="Hero">
        <Card>
          <VisibilityRow label="Fil d'Ariane" desc="Accueil > Projets > PayNow"
            value={bool(h.showBreadcrumb)} onChange={v => set(["paynow","hero","showBreadcrumb"], v)} />
          <VisibilityRow label="Badge hero" desc="Prototyper sur Figma, développé par Claude"
            value={bool(h.showBadge)} onChange={v => set(["paynow","hero","showBadge"], v)} />
          <VisibilityRow label="Grille interactive"
            value={bool(h.showGrid)} onChange={v => set(["paynow","hero","showGrid"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Badge texte" value={str(h.badge)} onChange={v => set(["paynow","hero","badge"], v)} />
          <Field label="Titre ligne 1" value={str(h.titleLine1)} onChange={v => set(["paynow","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2 (violet)" value={str(h.titleLine2)} onChange={v => set(["paynow","hero","titleLine2"], v)} />
          <Field label="Sous-titre" value={str(h.subtitle)} onChange={v => set(["paynow","hero","subtitle"], v)} multiline />
          <TagsField label="Tags compétences" value={arr(h.tags)} onChange={v => set(["paynow","hero","tags"], v)} />
        </Card>
      </Section>

      <Section title="Section Contexte">
        <Card>
          <VisibilityRow label="Badge section" value={bool(ct.showBadge)} onChange={v => set(["paynow","context","showBadge"], v)} />
          <VisibilityRow label="Séparateur de section" value={bool(ct.showDivider)} onChange={v => set(["paynow","context","showDivider"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Texte badge" value={str(ct.badge)} onChange={v => set(["paynow","context","badge"], v)} />
          <Field label="Titre" value={str(ct.title)} onChange={v => set(["paynow","context","title"], v)} />
          <Field label="Texte intro" value={str(ct.body)} onChange={v => set(["paynow","context","body"], v)} multiline />
        </Card>
      </Section>

      <Section title="CTA final">
        <Card>
          <VisibilityRow label="Badge CTA" value={bool(ca.showBadge)} onChange={v => set(["paynow","cta","showBadge"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Badge texte" value={str(ca.badge)} onChange={v => set(["paynow","cta","badge"], v)} />
          <Field label="Titre (noir)" value={str(ca.title)} onChange={v => set(["paynow","cta","title"], v)} />
          <Field label="Titre accent (violet)" value={str(ca.titleAccent)} onChange={v => set(["paynow","cta","titleAccent"], v)} />
          <Field label="Sous-titre" value={str(ca.subtitle)} onChange={v => set(["paynow","cta","subtitle"], v)} />
          <Field label="Texte bouton" value={str(ca.buttonText)} onChange={v => set(["paynow","cta","buttonText"], v)} />
        </Card>
      </Section>

      <Section title="Footer">
        <Card>
          <VisibilityRow label="Séparateur footer" value={bool(ft.showDivider)} onChange={v => set(["paynow","footer","showDivider"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Texte gauche" value={str(ft.left)} onChange={v => set(["paynow","footer","left"], v)} />
          <Field label="Texte droite" value={str(ft.right)} onChange={v => set(["paynow","footer","right"], v)} />
        </Card>
      </Section>
    </>
  );
}

function LcbftEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h  = (data.lcbft?.hero   ?? {}) as Record<string, unknown>;
  const ca = (data.lcbft?.cta    ?? {}) as Record<string, unknown>;
  const ft = (data.lcbft?.footer ?? {}) as Record<string, unknown>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  return (
    <>
      <Section title="Hero">
        <Card>
          <VisibilityRow label="Fil d'Ariane" desc="Accueil > Projets > Sentinelle · LCB-FT"
            value={bool(h.showBreadcrumb)} onChange={v => set(["lcbft","hero","showBreadcrumb"], v)} />
          <VisibilityRow label="Grille interactive"
            value={bool(h.showGrid)} onChange={v => set(["lcbft","hero","showGrid"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Titre ligne 1" value={str(h.titleLine1)} onChange={v => set(["lcbft","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2" value={str(h.titleLine2)} onChange={v => set(["lcbft","hero","titleLine2"], v)} />
          <Field label="Ligne accent (violet)" value={str(h.accentLine)} onChange={v => set(["lcbft","hero","accentLine"], v)} />
          <Field label="Sous-titre" value={str(h.subtitle)} onChange={v => set(["lcbft","hero","subtitle"], v)} multiline />
        </Card>
      </Section>

      <Section title="CTA final">
        <Card>
          <VisibilityRow label="Badge CTA" value={bool(ca.showBadge)} onChange={v => set(["lcbft","cta","showBadge"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Badge texte" value={str(ca.badge)} onChange={v => set(["lcbft","cta","badge"], v)} />
          <Field label="Titre (noir)" value={str(ca.title)} onChange={v => set(["lcbft","cta","title"], v)} />
          <Field label="Titre accent (violet)" value={str(ca.titleAccent)} onChange={v => set(["lcbft","cta","titleAccent"], v)} />
          <Field label="Sous-titre" value={str(ca.subtitle)} onChange={v => set(["lcbft","cta","subtitle"], v)} multiline />
          <Field label="Texte bouton" value={str(ca.buttonText)} onChange={v => set(["lcbft","cta","buttonText"], v)} />
        </Card>
      </Section>

      <Section title="Footer">
        <Card>
          <VisibilityRow label="Séparateur footer" value={bool(ft.showDivider)} onChange={v => set(["lcbft","footer","showDivider"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Texte gauche" value={str(ft.left)} onChange={v => set(["lcbft","footer","left"], v)} />
          <Field label="Texte droite" value={str(ft.right)} onChange={v => set(["lcbft","footer","right"], v)} />
        </Card>
      </Section>
    </>
  );
}

function OnboardingEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h  = (data.onboarding?.hero   ?? {}) as Record<string, unknown>;
  const ca = (data.onboarding?.cta    ?? {}) as Record<string, unknown>;
  const ft = (data.onboarding?.footer ?? {}) as Record<string, unknown>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  return (
    <>
      <Section title="Hero">
        <Card>
          <VisibilityRow label="Fil d'Ariane" desc="Accueil > Projets > Onboarding"
            value={bool(h.showBreadcrumb)} onChange={v => set(["onboarding","hero","showBreadcrumb"], v)} />
          <VisibilityRow label="Grille interactive"
            value={bool(h.showGrid)} onChange={v => set(["onboarding","hero","showGrid"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Badge texte" value={str(h.badge)} onChange={v => set(["onboarding","hero","badge"], v)} />
          <Field label="Titre ligne 1" value={str(h.titleLine1)} onChange={v => set(["onboarding","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2" value={str(h.titleLine2)} onChange={v => set(["onboarding","hero","titleLine2"], v)} />
          <Field label="Ligne accent (violet)" value={str(h.accentLine)} onChange={v => set(["onboarding","hero","accentLine"], v)} />
          <Field label="Sous-titre" value={str(h.subtitle)} onChange={v => set(["onboarding","hero","subtitle"], v)} multiline />
        </Card>
      </Section>

      <Section title="CTA final">
        <Card>
          <VisibilityRow label="Badge CTA" value={bool(ca.showBadge)} onChange={v => set(["onboarding","cta","showBadge"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Badge texte" value={str(ca.badge)} onChange={v => set(["onboarding","cta","badge"], v)} />
          <Field label="Titre (noir)" value={str(ca.title)} onChange={v => set(["onboarding","cta","title"], v)} />
          <Field label="Titre accent (violet)" value={str(ca.titleAccent)} onChange={v => set(["onboarding","cta","titleAccent"], v)} />
          <Field label="Sous-titre" value={str(ca.subtitle)} onChange={v => set(["onboarding","cta","subtitle"], v)} multiline />
          <Field label="Texte bouton" value={str(ca.buttonText)} onChange={v => set(["onboarding","cta","buttonText"], v)} />
        </Card>
      </Section>

      <Section title="Footer">
        <Card>
          <VisibilityRow label="Séparateur footer" value={bool(ft.showDivider)} onChange={v => set(["onboarding","footer","showDivider"], v)} />
          <div style={{ height: 12 }} />
          <Field label="Texte gauche" value={str(ft.left)} onChange={v => set(["onboarding","footer","left"], v)} />
        </Card>
      </Section>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */
export default function TweaksPage() {
  const [data, setData]         = useState<Content | null>(null);
  const [activePage, setActive] = useState<PageId>("home");
  const [status, setStatus]     = useState<"idle" | "saving" | "pushed" | "save-only" | "error">("idle");
  const [gitError, setGitError] = useState<string>("");
  const [dirty, setDirty]       = useState(false);

  /* Load */
  useEffect(() => {
    fetch("/api/tweaks")
      .then(r => r.json())
      .then(d => setData(d as Content))
      .catch(() => setStatus("error"));
  }, []);

  const handleChange = useCallback((d: Content) => {
    setData(d);
    setDirty(true);
    setStatus("idle");
  }, []);

  /* Save + push */
  const save = async () => {
    if (!data) return;
    setStatus("saving");
    setGitError("");
    try {
      const r = await fetch("/api/tweaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) { setStatus("error"); return; }
      const json = await r.json() as { ok: boolean; pushed: boolean; gitError?: string };
      if (json.pushed) {
        setStatus("pushed");
      } else {
        setStatus("save-only");
        setGitError(json.gitError ?? "");
      }
      setDirty(false);
    } catch {
      setStatus("error");
    }
  };

  const activePg = PAGES.find(p => p.id === activePage)!;

  /* Keyboard shortcut Cmd+S */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (dirty) void save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: SF, display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <header style={{ background: SURF, borderBottom: `1px solid ${BORD}`,
        height: 56, display: "flex", alignItems: "center", padding: "0 24px",
        gap: 16, position: "sticky", top: 0, zIndex: 100 }}>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ACC,
            display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M2 7h7M2 10h5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: INK }}>Tweaks</span>
          <span style={{ fontSize: 12, color: INK3 }}>· éditeur de contenu</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Preview link */}
        <a href={activePg.href} target="_blank" rel="noopener"
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13,
            color: INK2, textDecoration: "none", padding: "6px 12px",
            border: `1px solid ${BORD}`, borderRadius: 8, background: BG,
            transition: "border-color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = ACC)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = BORD)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 2h8v8M10 2L2 10" stroke={INK2} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Prévisualiser
        </a>

        {/* Save + push button */}
        <button onClick={() => void save()} disabled={!dirty || status === "saving"}
          style={{
            height: 36, padding: "0 20px", borderRadius: 10, border: "none",
            background: status === "save-only" ? "#D97706"
                      : dirty               ? ACC
                      : "#CBD5E1",
            color: "white",
            fontSize: 13, fontWeight: 600, cursor: dirty ? "pointer" : "default",
            display: "flex", alignItems: "center", gap: 8,
            transition: "background 0.18s, opacity 0.18s",
            opacity: status === "saving" ? 0.7 : 1,
          }}>
          {status === "saving" ? (
            <>
              <span style={{ width: 12, height: 12, borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white",
                animation: "spin 0.7s linear infinite", display: "block" }} />
              Envoi en cours…
            </>
          ) : status === "pushed" ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Enregistré · Poussé ↑
            </>
          ) : status === "save-only" ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Enregistré · push échoué
            </>
          ) : status === "error" ? (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 2l8 8M10 2l-8 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Erreur
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 9V3M3 6l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Enregistrer
            </>
          )}
        </button>
      </header>

      <div style={{ display: "flex", flex: 1 }}>

        {/* Sidebar nav */}
        <nav style={{ width: 200, background: SURF, borderRight: `1px solid ${BORD}`,
          padding: "20px 12px", flexShrink: 0, position: "sticky", top: 56,
          height: "calc(100vh - 56px)", overflowY: "auto" }}>
          <p style={{ margin: "0 0 8px 8px", fontSize: 10, fontWeight: 700,
            color: INK3, letterSpacing: "0.12em", textTransform: "uppercase" }}>Pages</p>
          {PAGES.map(p => (
            <button key={p.id} onClick={() => setActive(p.id)}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "9px 12px", borderRadius: 8, border: "none",
                background: activePage === p.id ? ACCL : "transparent",
                color: activePage === p.id ? ACC : INK2,
                fontSize: 13, fontWeight: activePage === p.id ? 600 : 400,
                cursor: "pointer", marginBottom: 2,
                transition: "background 0.15s, color 0.15s",
              }}>
              {p.label}
            </button>
          ))}

          <div style={{ marginTop: 32, padding: "12px 8px",
            background: status === "pushed"    ? "rgba(22,163,74,0.08)"
                      : status === "save-only" ? "rgba(217,119,6,0.08)"
                      : status === "error"     ? "rgba(220,38,38,0.08)"
                      : BORD + "30",
            borderRadius: 8, border: `1px solid ${
              status === "pushed"    ? "rgba(22,163,74,0.2)"
            : status === "save-only" ? "rgba(217,119,6,0.2)"
            : status === "error"     ? "rgba(220,38,38,0.2)"
            : BORD}` }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 600,
              color: status === "pushed"    ? GRN
                   : status === "save-only" ? "#D97706"
                   : status === "error"     ? "#DC2626"
                   : INK3 }}>
              {status === "pushed"    ? "✓ Enregistré · poussé sur main"
             : status === "save-only" ? "⚠ Enregistré · push échoué"
             : status === "error"     ? "✗ Erreur d'enregistrement"
             : dirty                  ? "Modifications en attente"
             : "Aucune modification"}
            </p>
            {status === "save-only" && gitError && (
              <p style={{ margin: "4px 0 0", fontSize: 9, color: "#D97706",
                wordBreak: "break-all", lineHeight: 1.4 }}>{gitError}</p>
            )}
            {status !== "save-only" && (
              <p style={{ margin: "4px 0 0", fontSize: 10, color: INK3 }}>⌘S pour enregistrer</p>
            )}
          </div>
        </nav>

        {/* Main area */}
        <main style={{ flex: 1, padding: "28px 32px", maxWidth: 680, overflowY: "auto" }}>

          {!data ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
              height: 200, color: INK3, fontSize: 14 }}>
              Chargement du contenu…
            </div>
          ) : (
            <>
              {activePage === "home"       && <HomeEditor       data={data} onChange={handleChange} />}
              {activePage === "paynow"     && <PayNowEditor     data={data} onChange={handleChange} />}
              {activePage === "lcbft"      && <LcbftEditor      data={data} onChange={handleChange} />}
              {activePage === "onboarding" && <OnboardingEditor data={data} onChange={handleChange} />}
            </>
          )}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        textarea { font-family: inherit; }
      `}</style>
    </div>
  );
}
