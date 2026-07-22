"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

/* ── Tokens ─────────────────────────────────────────────────────── */
const BG   = "#F8FAFC";
const SURF = "#FFFFFF";
const BORD = "#E2E8F0";
const INK  = "#0F172A";
const INK2 = "#475569";
const INK3 = "#94A3B8";
const ACC  = "#A259FF";
const ACCL = "rgba(162,89,255,0.08)";
const GRN  = "#16A34A";
const SF   = "system-ui,-apple-system,sans-serif";

/* ── Types ─────────────────────────────────────────────────────── */
type Content   = Record<string, Record<string, Record<string, unknown>>>;
type SaveStatus = "idle" | "saving" | "pushed" | "save-only" | "error";
const PAGES = [
  { id: "home",       label: "Accueil",      match: (p: string) => p === "/" },
  { id: "about",      label: "À propos",     match: (p: string) => p === "/about" },
  { id: "work",       label: "Expériences",  match: (p: string) => p === "/work" },
  { id: "paynow",     label: "PayNow",       match: (p: string) => p.startsWith("/paynow") },
  { id: "lcbft",      label: "LCB-FT",       match: (p: string) => p.startsWith("/lcb-ft") },
  { id: "onboarding", label: "Onboarding",   match: (p: string) => p.startsWith("/onboarding") },
] as const;
type PageId = typeof PAGES[number]["id"];

/* ── Helpers ─────────────────────────────────────────────────────── */
function str(v: unknown): string   { return typeof v === "string"  ? v : ""; }
function bool(v: unknown): boolean { return typeof v === "boolean" ? v : true; }
function arr(v: unknown): string[] { return Array.isArray(v)       ? v as string[] : []; }

function setNested(obj: Content, path: string[], value: unknown): Content {
  const out = JSON.parse(JSON.stringify(obj)) as Content;
  let cur: Record<string, unknown> = out as Record<string, unknown>;
  for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]] as Record<string, unknown>;
  cur[path[path.length - 1]] = value;
  return out;
}

/* ── Atoms ─────────────────────────────────────────────────────── */
function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={value} onClick={() => onChange(!value)}
      style={{ width: 36, height: 20, borderRadius: 10, border: "none",
        background: value ? ACC : "#CBD5E1", position: "relative",
        cursor: "pointer", flexShrink: 0, transition: "background 0.18s" }}>
      <span style={{ position: "absolute", top: 2, left: value ? 18 : 2,
        width: 16, height: 16, borderRadius: "50%", background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.18s", display: "block" }} />
    </button>
  );
}

function Field({ label, value, onChange, multiline = false }: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean;
}) {
  const base: React.CSSProperties = {
    width: "100%", fontFamily: SF, fontSize: 12, color: INK,
    background: BG, border: `1px solid ${BORD}`, borderRadius: 7,
    padding: "7px 9px", outline: "none", boxSizing: "border-box", resize: "vertical",
    transition: "border-color 0.15s",
  };
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "block", fontSize: 10, fontWeight: 600,
        color: INK3, letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: 3 }}>{label}</label>
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)}
            style={base} onFocus={e => (e.target.style.borderColor = ACC)}
            onBlur={e => (e.target.style.borderColor = BORD)} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)}
            style={{ ...base, resize: undefined }}
            onFocus={e => (e.target.style.borderColor = ACC)}
            onBlur={e => (e.target.style.borderColor = BORD)} />}
    </div>
  );
}

function TagsField({ label, value, onChange }: {
  label: string; value: string[]; onChange: (v: string[]) => void;
}) {
  const [raw, setRaw] = useState(value.join(", "));
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "block", fontSize: 10, fontWeight: 600,
        color: INK3, letterSpacing: "0.08em", textTransform: "uppercase",
        marginBottom: 3 }}>{label} <span style={{ fontWeight: 400, textTransform: "none" }}>(virgules)</span></label>
      <input type="text" value={raw}
        onChange={e => { setRaw(e.target.value); onChange(e.target.value.split(",").map(s => s.trim()).filter(Boolean)); }}
        style={{ width: "100%", fontFamily: SF, fontSize: 12, color: INK,
          background: BG, border: `1px solid ${BORD}`, borderRadius: 7,
          padding: "7px 9px", outline: "none", boxSizing: "border-box" }}
        onFocus={e => (e.target.style.borderColor = ACC)}
        onBlur={e => (e.target.style.borderColor = BORD)} />
    </div>
  );
}

function VisibilityRow({ label, desc, value, onChange }: {
  label: string; desc?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 10, padding: "8px 0", borderBottom: `1px solid ${BORD}` }}>
      <div>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: INK }}>{label}</p>
        {desc && <p style={{ margin: 0, fontSize: 10, color: INK3 }}>{desc}</p>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

function Sect({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: INK2,
        letterSpacing: "0.06em", textTransform: "uppercase",
        paddingBottom: 6, borderBottom: `1px solid ${BORD}` }}>{title}</h3>
      {children}
    </div>
  );
}

function Crd({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: SURF, border: `1px solid ${BORD}`,
      borderRadius: 10, padding: 14, marginBottom: 12 }}>
      {children}
    </div>
  );
}

/* ── Page editors ─────────────────────────────────────────────── */
function HomeEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h  = (data.home?.hero    ?? {}) as Record<string, unknown>;
  const ab = (data.home?.about   ?? {}) as Record<string, unknown>;
  const wk = (data.home?.work    ?? {}) as Record<string, unknown>;
  const ct = (data.home?.contact ?? {}) as Record<string, unknown>;
  const ft = (data.home?.footer  ?? {}) as Record<string, unknown>;
  const pn = ((data.home?.projects as Record<string, unknown>)?.paynow     ?? {}) as Record<string, unknown>;
  const ob = ((data.home?.projects as Record<string, unknown>)?.onboarding ?? {}) as Record<string, unknown>;
  const lc = ((data.home?.projects as Record<string, unknown>)?.lcbft      ?? {}) as Record<string, unknown>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));
  return (
    <>
      <Sect title="Hero">
        <Crd>
          <Field label="Accroche" value={str(h.eyebrow)} onChange={v => set(["home","hero","eyebrow"], v)} />
          <Field label="Titre ligne 1 (noir)" value={str(h.titleLine1)} onChange={v => set(["home","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2 (violet)" value={str(h.titleLine2)} onChange={v => set(["home","hero","titleLine2"], v)} />
          <VisibilityRow label="Grille interactive" value={bool(h.showGrid)} onChange={v => set(["home","hero","showGrid"], v)} />
          <VisibilityRow label="Traits techniques" value={bool(h.showTechLines)} onChange={v => set(["home","hero","showTechLines"], v)} />
          <VisibilityRow label="Flèche de scroll" value={bool(h.showScrollArrow)} onChange={v => set(["home","hero","showScrollArrow"], v)} />
        </Crd>
      </Sect>
      <Sect title="Section À propos">
        <Crd>
          <Field label="Accroche" value={str(ab.greeting)} onChange={v => set(["home","about","greeting"], v)} />
          <Field label="Rôle" value={str(ab.role)} onChange={v => set(["home","about","role"], v)} />
          <Field label="Bio (paragraphe 1)" value={str(ab.bio1)} onChange={v => set(["home","about","bio1"], v)} multiline />
          <Field label="Bio (paragraphe 2)" value={str(ab.bio2)} onChange={v => set(["home","about","bio2"], v)} multiline />
          <TagsField label="Outils" value={arr(ab.tools)} onChange={v => set(["home","about","tools"], v)} />
        </Crd>
      </Sect>
      <Sect title="Section Projets">
        <Crd>
          <Field label="Label section" value={str(wk.label)} onChange={v => set(["home","work","label"], v)} />
          <Field label="Titre" value={str(wk.title)} onChange={v => set(["home","work","title"], v)} />
        </Crd>
      </Sect>
      <Sect title="Section Contact">
        <Crd>
          <Field label="Titre ligne 1" value={str(ct.titleLine1)} onChange={v => set(["home","contact","titleLine1"], v)} />
          <Field label="Titre ligne 2" value={str(ct.titleLine2)} onChange={v => set(["home","contact","titleLine2"], v)} />
          <Field label="Corps" value={str(ct.body)} onChange={v => set(["home","contact","body"], v)} />
          <Field label="Email" value={str(ct.email)} onChange={v => set(["home","contact","email"], v)} />
          <Field label="Label LinkedIn" value={str(ct.linkedinLabel)} onChange={v => set(["home","contact","linkedinLabel"], v)} />
          <Field label="Label CV" value={str(ct.cvLabel)} onChange={v => set(["home","contact","cvLabel"], v)} />
        </Crd>
      </Sect>
      <Sect title="Footer">
        <Crd>
          <Field label="Texte gauche" value={str(ft.left)} onChange={v => set(["home","footer","left"], v)} />
          <Field label="Texte droite" value={str(ft.right)} onChange={v => set(["home","footer","right"], v)} />
        </Crd>
      </Sect>
      <Sect title="Carte PayNow">
        <Crd>
          <Field label="Numéro" value={str(pn.num)} onChange={v => set(["home","projects","paynow","num"], v)} />
          <Field label="Label" value={str(pn.label)} onChange={v => set(["home","projects","paynow","label"], v)} />
          <Field label="Titre" value={str(pn.title)} onChange={v => set(["home","projects","paynow","title"], v)} />
          <Field label="Description" value={str(pn.desc)} onChange={v => set(["home","projects","paynow","desc"], v)} multiline />
          <TagsField label="Tags" value={arr(pn.tags)} onChange={v => set(["home","projects","paynow","tags"], v)} />
        </Crd>
      </Sect>
      <Sect title="Carte Onboarding">
        <Crd>
          <Field label="Numéro" value={str(ob.num)} onChange={v => set(["home","projects","onboarding","num"], v)} />
          <Field label="Label" value={str(ob.label)} onChange={v => set(["home","projects","onboarding","label"], v)} />
          <Field label="Titre" value={str(ob.title)} onChange={v => set(["home","projects","onboarding","title"], v)} />
          <Field label="Description" value={str(ob.desc)} onChange={v => set(["home","projects","onboarding","desc"], v)} multiline />
          <TagsField label="Tags" value={arr(ob.tags)} onChange={v => set(["home","projects","onboarding","tags"], v)} />
        </Crd>
      </Sect>
      <Sect title="Carte LCB-FT">
        <Crd>
          <Field label="Numéro" value={str(lc.num)} onChange={v => set(["home","projects","lcbft","num"], v)} />
          <Field label="Label" value={str(lc.label)} onChange={v => set(["home","projects","lcbft","label"], v)} />
          <Field label="Titre" value={str(lc.title)} onChange={v => set(["home","projects","lcbft","title"], v)} />
          <Field label="Description" value={str(lc.desc)} onChange={v => set(["home","projects","lcbft","desc"], v)} multiline />
          <TagsField label="Tags" value={arr(lc.tags)} onChange={v => set(["home","projects","lcbft","tags"], v)} />
        </Crd>
      </Sect>
    </>
  );
}

function AboutEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h = (data.about?.hero ?? {}) as Record<string, unknown>;
  const parcours = ((data.about?.parcours ?? []) as unknown) as Array<Record<string, unknown>>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  const setParcours = (i: number, key: string, v: unknown) => {
    const next = JSON.parse(JSON.stringify(parcours)) as Array<Record<string, unknown>>;
    next[i][key] = v;
    onChange(setNested(data, ["about","parcours"], next));
  };

  return (
    <>
      <Sect title="Hero">
        <Crd>
          <Field label="Accroche (\\n = saut de ligne)" value={str(h.greeting)} onChange={v => set(["about","hero","greeting"], v)} multiline />
          <Field label="Rôle" value={str(h.role)} onChange={v => set(["about","hero","role"], v)} />
          <Field label="Bio (paragraphe 1)" value={str(h.bio1)} onChange={v => set(["about","hero","bio1"], v)} multiline />
          <Field label="Bio (paragraphe 2)" value={str(h.bio2)} onChange={v => set(["about","hero","bio2"], v)} multiline />
          <TagsField label="Outils" value={arr(h.tools)} onChange={v => set(["about","hero","tools"], v)} />
        </Crd>
      </Sect>
      <Sect title="Timeline · Parcours">
        {parcours.map((item, i) => (
          <Crd key={i}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: INK3,
              letterSpacing: "0.08em", textTransform: "uppercase" }}>Entrée {i + 1}</p>
            <Field label="Période" value={str(item.period)} onChange={v => setParcours(i, "period", v)} />
            <Field label="Type (badge)" value={str(item.type)} onChange={v => setParcours(i, "type", v)} />
            <Field label="Titre" value={str(item.title)} onChange={v => setParcours(i, "title", v)} />
            <Field label="Organisation" value={str(item.organization)} onChange={v => setParcours(i, "organization", v)} />
            <Field label="Lieu" value={str(item.location)} onChange={v => setParcours(i, "location", v)} />
            <Field label="Description" value={str(item.description)} onChange={v => setParcours(i, "description", v)} multiline />
          </Crd>
        ))}
      </Sect>
    </>
  );
}

function WorkEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h = (data.work?.hero ?? {}) as Record<string, unknown>;
  const experiences = ((data.work?.experiences ?? []) as unknown) as Array<Record<string, unknown>>;
  const skillGroups = ((data.work?.skillGroups ?? []) as unknown) as Array<Record<string, unknown>>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  const setExp = (i: number, key: string, v: unknown) => {
    const next = JSON.parse(JSON.stringify(experiences)) as Array<Record<string, unknown>>;
    next[i][key] = v;
    onChange(setNested(data, ["work","experiences"], next));
  };

  const setSkill = (i: number, key: string, v: unknown) => {
    const next = JSON.parse(JSON.stringify(skillGroups)) as Array<Record<string, unknown>>;
    next[i][key] = v;
    onChange(setNested(data, ["work","skillGroups"], next));
  };

  return (
    <>
      <Sect title="Hero">
        <Crd>
          <Field label="Accroche" value={str(h.eyebrow)} onChange={v => set(["work","hero","eyebrow"], v)} />
          <Field label="Mot 1" value={str(h.word1)} onChange={v => set(["work","hero","word1"], v)} />
          <Field label="Mot 2 (bleu)" value={str(h.word2)} onChange={v => set(["work","hero","word2"], v)} />
          <Field label="Mot 3" value={str(h.word3)} onChange={v => set(["work","hero","word3"], v)} />
          <Field label="Sous-titre" value={str(h.subtitle)} onChange={v => set(["work","hero","subtitle"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="Expériences">
        {experiences.map((exp, i) => (
          <Crd key={i}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: INK3,
              letterSpacing: "0.08em", textTransform: "uppercase" }}>Expérience {i + 1}</p>
            <Field label="Période" value={str(exp.period)} onChange={v => setExp(i, "period", v)} />
            <Field label="Type (badge)" value={str(exp.type)} onChange={v => setExp(i, "type", v)} />
            <Field label="Titre" value={str(exp.title)} onChange={v => setExp(i, "title", v)} />
            <Field label="Organisation" value={str(exp.organization)} onChange={v => setExp(i, "organization", v)} />
            <Field label="Réalisation clé" value={str(exp.achievement)} onChange={v => setExp(i, "achievement", v)} multiline />
            <TagsField label="Compétences" value={arr(exp.skills)} onChange={v => setExp(i, "skills", v)} />
          </Crd>
        ))}
      </Sect>
      <Sect title="Groupes de compétences">
        {skillGroups.map((grp, i) => (
          <Crd key={i}>
            <Field label="Catégorie" value={str(grp.category)} onChange={v => setSkill(i, "category", v)} />
            <TagsField label="Items" value={arr(grp.items)} onChange={v => setSkill(i, "items", v)} />
          </Crd>
        ))}
      </Sect>
    </>
  );
}

function PayNowEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h   = (data.paynow?.hero      ?? {}) as Record<string, unknown>;
  const ct  = (data.paynow?.context   ?? {}) as Record<string, unknown>;
  const pr  = (data.paynow?.process   ?? {}) as Record<string, unknown>;
  const sol = (data.paynow?.solutions ?? {}) as Record<string, unknown>;
  const ca  = (data.paynow?.cta       ?? {}) as Record<string, unknown>;
  const ft  = (data.paynow?.footer    ?? {}) as Record<string, unknown>;
  const cn  = ((data.paynow?.constats ?? []) as unknown) as Array<Record<string, unknown>>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  const setConstat = (i: number, key: string, v: unknown) => {
    const next = JSON.parse(JSON.stringify(cn)) as Array<Record<string, unknown>>;
    next[i][key] = v;
    onChange(setNested(data, ["paynow","constats"], next));
  };

  return (
    <>
      <Sect title="Hero">
        <Crd>
          <Field label="Badge" value={str(h.badge)} onChange={v => set(["paynow","hero","badge"], v)} />
          <Field label="Titre ligne 1" value={str(h.titleLine1)} onChange={v => set(["paynow","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2 (violet)" value={str(h.titleLine2)} onChange={v => set(["paynow","hero","titleLine2"], v)} />
          <Field label="Sous-titre" value={str(h.subtitle)} onChange={v => set(["paynow","hero","subtitle"], v)} multiline />
          <TagsField label="Tags" value={arr(h.tags)} onChange={v => set(["paynow","hero","tags"], v)} />
          <VisibilityRow label="Fil d'Ariane" value={bool(h.showBreadcrumb)} onChange={v => set(["paynow","hero","showBreadcrumb"], v)} />
          <VisibilityRow label="Badge hero" value={bool(h.showBadge)} onChange={v => set(["paynow","hero","showBadge"], v)} />
          <VisibilityRow label="Grille" value={bool(h.showGrid)} onChange={v => set(["paynow","hero","showGrid"], v)} />
        </Crd>
      </Sect>
      <Sect title="Section Contexte">
        <Crd>
          <Field label="Badge" value={str(ct.badge)} onChange={v => set(["paynow","context","badge"], v)} />
          <Field label="Titre" value={str(ct.title)} onChange={v => set(["paynow","context","title"], v)} />
          <Field label="Corps" value={str(ct.body)} onChange={v => set(["paynow","context","body"], v)} multiline />
          <VisibilityRow label="Badge section" value={bool(ct.showBadge)} onChange={v => set(["paynow","context","showBadge"], v)} />
        </Crd>
      </Sect>
      <Sect title="Cartes Constats / Objectif">
        {cn.map((card, i) => (
          <Crd key={i}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: INK3,
              letterSpacing: "0.08em", textTransform: "uppercase" }}>{str(card.tag)}</p>
            <Field label="Titre" value={str(card.title)} onChange={v => setConstat(i, "title", v)} />
            <Field label="Description" value={str(card.description)} onChange={v => setConstat(i, "description", v)} multiline />
          </Crd>
        ))}
      </Sect>
      <Sect title="Section Processus UX">
        <Crd>
          <Field label="Badge" value={str(pr.badge)} onChange={v => set(["paynow","process","badge"], v)} />
          <Field label="Titre" value={str(pr.title)} onChange={v => set(["paynow","process","title"], v)} />
          <Field label="Corps" value={str(pr.body)} onChange={v => set(["paynow","process","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="Section Solutions">
        <Crd>
          <Field label="Badge" value={str(sol.badge)} onChange={v => set(["paynow","solutions","badge"], v)} />
          <Field label="Titre" value={str(sol.title)} onChange={v => set(["paynow","solutions","title"], v)} />
          <Field label="Corps" value={str(sol.body)} onChange={v => set(["paynow","solutions","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="CTA final">
        <Crd>
          <Field label="Badge" value={str(ca.badge)} onChange={v => set(["paynow","cta","badge"], v)} />
          <Field label="Titre (noir)" value={str(ca.title)} onChange={v => set(["paynow","cta","title"], v)} />
          <Field label="Titre accent (violet)" value={str(ca.titleAccent)} onChange={v => set(["paynow","cta","titleAccent"], v)} />
          <Field label="Sous-titre" value={str(ca.subtitle)} onChange={v => set(["paynow","cta","subtitle"], v)} />
          <Field label="Texte bouton" value={str(ca.buttonText)} onChange={v => set(["paynow","cta","buttonText"], v)} />
        </Crd>
      </Sect>
      <Sect title="Footer">
        <Crd>
          <Field label="Texte gauche" value={str(ft.left)} onChange={v => set(["paynow","footer","left"], v)} />
          <Field label="Texte droite" value={str(ft.right)} onChange={v => set(["paynow","footer","right"], v)} />
        </Crd>
      </Sect>
    </>
  );
}

function LcbftEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h   = (data.lcbft?.hero    ?? {}) as Record<string, unknown>;
  const cx  = (data.lcbft?.context ?? {}) as Record<string, unknown>;
  const pr  = (data.lcbft?.process ?? {}) as Record<string, unknown>;
  const sc  = (data.lcbft?.screens ?? {}) as Record<string, unknown>;
  const ca  = (data.lcbft?.cta     ?? {}) as Record<string, unknown>;
  const ft  = (data.lcbft?.footer  ?? {}) as Record<string, unknown>;
  const cn  = ((data.lcbft?.constats ?? []) as unknown) as Array<Record<string, unknown>>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  const setConstat = (i: number, key: string, v: unknown) => {
    const next = JSON.parse(JSON.stringify(cn)) as Array<Record<string, unknown>>;
    next[i][key] = v;
    onChange(setNested(data, ["lcbft","constats"], next));
  };

  return (
    <>
      <Sect title="Hero">
        <Crd>
          <Field label="Badge" value={str(h.badge)} onChange={v => set(["lcbft","hero","badge"], v)} />
          <Field label="Titre ligne 1" value={str(h.titleLine1)} onChange={v => set(["lcbft","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2" value={str(h.titleLine2)} onChange={v => set(["lcbft","hero","titleLine2"], v)} />
          <Field label="Ligne accent (violet)" value={str(h.accentLine)} onChange={v => set(["lcbft","hero","accentLine"], v)} />
          <Field label="Sous-titre" value={str(h.subtitle)} onChange={v => set(["lcbft","hero","subtitle"], v)} multiline />
          <VisibilityRow label="Fil d'Ariane" value={bool(h.showBreadcrumb)} onChange={v => set(["lcbft","hero","showBreadcrumb"], v)} />
          <VisibilityRow label="Badge hero" value={bool(h.showBadge)} onChange={v => set(["lcbft","hero","showBadge"], v)} />
          <VisibilityRow label="Grille" value={bool(h.showGrid)} onChange={v => set(["lcbft","hero","showGrid"], v)} />
        </Crd>
      </Sect>
      <Sect title="Section Contexte">
        <Crd>
          <Field label="Badge" value={str(cx.badge)} onChange={v => set(["lcbft","context","badge"], v)} />
          <Field label="Titre" value={str(cx.title)} onChange={v => set(["lcbft","context","title"], v)} />
          <Field label="Corps" value={str(cx.body)} onChange={v => set(["lcbft","context","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="Cartes Constats / Objectif">
        {cn.map((card, i) => (
          <Crd key={i}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: INK3,
              letterSpacing: "0.08em", textTransform: "uppercase" }}>{str(card.tag)}</p>
            <Field label="Titre" value={str(card.title)} onChange={v => setConstat(i, "title", v)} />
            <Field label="Description" value={str(card.description)} onChange={v => setConstat(i, "description", v)} multiline />
          </Crd>
        ))}
      </Sect>
      <Sect title="Section Processus UX">
        <Crd>
          <Field label="Badge" value={str(pr.badge)} onChange={v => set(["lcbft","process","badge"], v)} />
          <Field label="Titre" value={str(pr.title)} onChange={v => set(["lcbft","process","title"], v)} />
          <Field label="Corps" value={str(pr.body)} onChange={v => set(["lcbft","process","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="Section Écrans clés">
        <Crd>
          <Field label="Badge" value={str(sc.badge)} onChange={v => set(["lcbft","screens","badge"], v)} />
          <Field label="Titre" value={str(sc.title)} onChange={v => set(["lcbft","screens","title"], v)} />
          <Field label="Corps" value={str(sc.body)} onChange={v => set(["lcbft","screens","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="CTA final">
        <Crd>
          <Field label="Badge" value={str(ca.badge)} onChange={v => set(["lcbft","cta","badge"], v)} />
          <Field label="Titre (noir)" value={str(ca.title)} onChange={v => set(["lcbft","cta","title"], v)} />
          <Field label="Titre accent (violet)" value={str(ca.titleAccent)} onChange={v => set(["lcbft","cta","titleAccent"], v)} />
          <Field label="Sous-titre" value={str(ca.subtitle)} onChange={v => set(["lcbft","cta","subtitle"], v)} multiline />
          <Field label="Texte bouton" value={str(ca.buttonText)} onChange={v => set(["lcbft","cta","buttonText"], v)} />
        </Crd>
      </Sect>
      <Sect title="Footer">
        <Crd>
          <Field label="Texte gauche" value={str(ft.left)} onChange={v => set(["lcbft","footer","left"], v)} />
          <Field label="Texte droite" value={str(ft.right)} onChange={v => set(["lcbft","footer","right"], v)} />
        </Crd>
      </Sect>
    </>
  );
}

function OnboardingEditor({ data, onChange }: { data: Content; onChange: (d: Content) => void }) {
  const h  = (data.onboarding?.hero    ?? {}) as Record<string, unknown>;
  const cx = (data.onboarding?.context ?? {}) as Record<string, unknown>;
  const ca = (data.onboarding?.cta     ?? {}) as Record<string, unknown>;
  const ft = (data.onboarding?.footer  ?? {}) as Record<string, unknown>;
  const pb = ((data.onboarding?.problems ?? []) as unknown) as Array<Record<string, unknown>>;
  const set = (path: string[], v: unknown) => onChange(setNested(data, path, v));

  const setProb = (i: number, key: string, v: unknown) => {
    const next = JSON.parse(JSON.stringify(pb)) as Array<Record<string, unknown>>;
    next[i][key] = v;
    onChange(setNested(data, ["onboarding","problems"], next));
  };

  return (
    <>
      <Sect title="Hero">
        <Crd>
          <Field label="Badge" value={str(h.badge)} onChange={v => set(["onboarding","hero","badge"], v)} />
          <Field label="Titre ligne 1" value={str(h.titleLine1)} onChange={v => set(["onboarding","hero","titleLine1"], v)} />
          <Field label="Titre ligne 2" value={str(h.titleLine2)} onChange={v => set(["onboarding","hero","titleLine2"], v)} />
          <Field label="Ligne accent (violet)" value={str(h.accentLine)} onChange={v => set(["onboarding","hero","accentLine"], v)} />
          <Field label="Sous-titre" value={str(h.subtitle)} onChange={v => set(["onboarding","hero","subtitle"], v)} multiline />
          <VisibilityRow label="Fil d'Ariane" value={bool(h.showBreadcrumb)} onChange={v => set(["onboarding","hero","showBreadcrumb"], v)} />
          <VisibilityRow label="Grille" value={bool(h.showGrid)} onChange={v => set(["onboarding","hero","showGrid"], v)} />
        </Crd>
      </Sect>
      <Sect title="Section Contexte">
        <Crd>
          <Field label="Badge" value={str(cx.badge)} onChange={v => set(["onboarding","context","badge"], v)} />
          <Field label="Titre" value={str(cx.title)} onChange={v => set(["onboarding","context","title"], v)} />
          <Field label="Corps" value={str(cx.body)} onChange={v => set(["onboarding","context","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="Cartes Problèmes / Objectif">
        {pb.map((card, i) => (
          <Crd key={i}>
            <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: INK3,
              letterSpacing: "0.08em", textTransform: "uppercase" }}>{str(card.tag)}</p>
            <Field label="Titre" value={str(card.title)} onChange={v => setProb(i, "title", v)} />
            <Field label="Description" value={str(card.description)} onChange={v => setProb(i, "description", v)} multiline />
          </Crd>
        ))}
      </Sect>
      <Sect title="Section Processus">
        <Crd>
          <Field label="Badge" value={str((data.onboarding?.process as Record<string,unknown> ?? {}).badge)} onChange={v => set(["onboarding","process","badge"], v)} />
          <Field label="Titre" value={str((data.onboarding?.process as Record<string,unknown> ?? {}).title)} onChange={v => set(["onboarding","process","title"], v)} />
          <Field label="Corps" value={str((data.onboarding?.process as Record<string,unknown> ?? {}).body)} onChange={v => set(["onboarding","process","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="Section Écrans clés">
        <Crd>
          <Field label="Badge" value={str((data.onboarding?.screens as Record<string,unknown> ?? {}).badge)} onChange={v => set(["onboarding","screens","badge"], v)} />
          <Field label="Titre" value={str((data.onboarding?.screens as Record<string,unknown> ?? {}).title)} onChange={v => set(["onboarding","screens","title"], v)} />
          <Field label="Corps" value={str((data.onboarding?.screens as Record<string,unknown> ?? {}).body)} onChange={v => set(["onboarding","screens","body"], v)} multiline />
        </Crd>
      </Sect>
      <Sect title="CTA final">
        <Crd>
          <Field label="Badge" value={str(ca.badge)} onChange={v => set(["onboarding","cta","badge"], v)} />
          <Field label="Titre (noir)" value={str(ca.title)} onChange={v => set(["onboarding","cta","title"], v)} />
          <Field label="Titre accent (violet)" value={str(ca.titleAccent)} onChange={v => set(["onboarding","cta","titleAccent"], v)} />
          <Field label="Sous-titre" value={str(ca.subtitle)} onChange={v => set(["onboarding","cta","subtitle"], v)} multiline />
          <Field label="Texte bouton" value={str(ca.buttonText)} onChange={v => set(["onboarding","cta","buttonText"], v)} />
        </Crd>
      </Sect>
      <Sect title="Footer">
        <Crd>
          <Field label="Texte gauche" value={str(ft.left)} onChange={v => set(["onboarding","footer","left"], v)} />
        </Crd>
      </Sect>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   TWEAKS DRAWER — FAB + panel latéral
   ══════════════════════════════════════════════════════════════════ */
export function TweaksDrawer() {
  const pathname = usePathname();

  /* masquer sur /tweaks (l'admin a déjà son propre UI) */
  if (pathname === "/tweaks") return null;

  return <TweaksDrawerInner pathname={pathname} />;
}

function TweaksDrawerInner({ pathname }: { pathname: string }) {
  const [open, setOpen]     = useState(false);
  const [data, setData]     = useState<Content | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [gitError, setGitErr] = useState("");
  const [dirty, setDirty]   = useState(false);

  /* page active par défaut selon l'URL courante */
  const defaultPage = PAGES.find(p => p.match(pathname))?.id ?? "home";
  const [activeTab, setTab] = useState<PageId>(defaultPage);

  /* sync tab quand la page change */
  useEffect(() => {
    const match = PAGES.find(p => p.match(pathname));
    if (match) setTab(match.id);
  }, [pathname]);

  /* charger content.json au premier clic */
  useEffect(() => {
    if (!open || data) return;
    fetch("/api/tweaks")
      .then(r => r.json())
      .then(d => setData(d as Content))
      .catch(() => setStatus("error"));
  }, [open, data]);

  /* fermer avec Escape */
  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open]);

  const handleChange = useCallback((d: Content) => {
    setData(d); setDirty(true); setStatus("idle");
  }, []);

  const save = async () => {
    if (!data) return;
    setStatus("saving"); setGitErr("");
    try {
      const r = await fetch("/api/tweaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!r.ok) { setStatus("error"); return; }
      const json = await r.json() as { ok: boolean; pushed: boolean; gitError?: string };
      setStatus(json.pushed ? "pushed" : "save-only");
      if (json.gitError) setGitErr(json.gitError);
      setDirty(false);
    } catch { setStatus("error"); }
  };

  /* ── bouton Save ── */
  const saveBtnBg = status === "save-only" ? "#D97706" : dirty ? ACC : "#CBD5E1";
  const saveBtnLabel =
    status === "saving"    ? "Envoi…"
  : status === "pushed"    ? "Poussé ↑"
  : status === "save-only" ? "Sauvé · push échoué"
  : status === "error"     ? "Erreur"
  : "Enregistrer";

  return (
    <>
      <style>{`
        @keyframes tw-spin { to { transform: rotate(360deg); } }
        .tw-fab:hover { transform: scale(1.07); box-shadow: 0 8px 24px rgba(162,89,255,0.35) !important; }
        .tw-fab:active { transform: scale(0.97); }
        .tw-tab:hover { background: ${ACCL} !important; color: ${ACC} !important; }
        * { box-sizing: border-box; }
        textarea { font-family: inherit; }
      `}</style>

      {/* FAB ──────────────────────────────────────────────────────── */}
      <button
        className="tw-fab"
        onClick={() => setOpen(o => !o)}
        aria-label="Ouvrir l'éditeur de contenu"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9999,
          width: 48, height: 48, borderRadius: "50%", border: "none",
          background: open ? "#334155" : ACC,
          color: "white", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(162,89,255,0.28)",
          transition: "transform 0.18s, box-shadow 0.18s, background 0.18s",
        }}>
        {open ? (
          /* X */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3l10 10M13 3L3 13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        ) : (
          /* pencil */
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M12.5 2.5l3 3L5 16H2v-3L12.5 2.5z" stroke="white" strokeWidth="1.6"
              strokeLinejoin="round" strokeLinecap="round"/>
            <path d="M10.5 4.5l3 3" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        )}
        {dirty && !open && (
          <span style={{ position: "absolute", top: 8, right: 8,
            width: 8, height: 8, borderRadius: "50%", background: "#F59E0B",
            border: "1.5px solid white" }} />
        )}
      </button>

      {/* Backdrop ──────────────────────────────────────────────────── */}
      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, zIndex: 9997,
            background: "rgba(0,0,0,0.18)", backdropFilter: "blur(1px)",
            transition: "opacity 0.2s" }} />
      )}

      {/* Drawer ────────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 9998,
        width: 400, background: SURF,
        boxShadow: open ? "-4px 0 32px rgba(0,0,0,0.12)" : "none",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.26s cubic-bezier(0.22,1,0.36,1)",
        display: "flex", flexDirection: "column", fontFamily: SF,
      }}>

        {/* Header ── */}
        <div style={{ flexShrink: 0, borderBottom: `1px solid ${BORD}`,
          padding: "0 16px", height: 52,
          display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: ACC,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1.5 3.5h10M1.5 6.5h7M1.5 9.5h5" stroke="white" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>Tweaks</span>
          <span style={{ fontSize: 11, color: INK3 }}>· contenu de la page</span>
          <div style={{ flex: 1 }} />

          {/* Save ── */}
          <button onClick={() => void save()} disabled={!dirty || status === "saving"}
            style={{ height: 30, padding: "0 14px", borderRadius: 8, border: "none",
              background: saveBtnBg, color: "white",
              fontSize: 12, fontWeight: 600,
              cursor: dirty ? "pointer" : "default",
              display: "flex", alignItems: "center", gap: 6,
              transition: "background 0.18s", opacity: status === "saving" ? 0.75 : 1,
              flexShrink: 0 }}>
            {status === "saving" ? (
              <span style={{ width: 10, height: 10, borderRadius: "50%",
                border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "white",
                animation: "tw-spin 0.7s linear infinite", display: "block" }} />
            ) : status === "pushed" ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : status === "error" || status === "save-only" ? (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 1v5M5 8.5v.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M5 8V2M2 5l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            {saveBtnLabel}
          </button>
        </div>

        {/* Tabs ── */}
        <div style={{ flexShrink: 0, display: "flex", padding: "8px 12px",
          gap: 4, borderBottom: `1px solid ${BORD}` }}>
          {PAGES.map(p => (
            <button key={p.id} className="tw-tab" onClick={() => setTab(p.id)}
              style={{ padding: "5px 10px", borderRadius: 6, border: "none",
                background: activeTab === p.id ? ACCL : "transparent",
                color: activeTab === p.id ? ACC : INK2,
                fontSize: 12, fontWeight: activeTab === p.id ? 600 : 400,
                cursor: "pointer", transition: "background 0.15s, color 0.15s",
                position: "relative" }}>
              {p.label}
              {activeTab === p.id && p.match(pathname) && (
                <span style={{ position: "absolute", bottom: -1, left: "50%",
                  transform: "translateX(-50%)",
                  width: 4, height: 4, borderRadius: "50%", background: ACC }} />
              )}
            </button>
          ))}
        </div>

        {/* Status bar ── */}
        {(status !== "idle" || dirty) && (
          <div style={{ flexShrink: 0, padding: "6px 16px",
            background: status === "pushed"    ? "rgba(22,163,74,0.06)"
                      : status === "save-only" ? "rgba(217,119,6,0.06)"
                      : status === "error"     ? "rgba(220,38,38,0.06)"
                      : "rgba(162,89,255,0.05)",
            borderBottom: `1px solid ${BORD}` }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600,
              color: status === "pushed"    ? GRN
                   : status === "save-only" ? "#D97706"
                   : status === "error"     ? "#DC2626"
                   : ACC }}>
              {status === "pushed"    ? "✓ Enregistré · poussé sur main"
             : status === "save-only" ? "⚠ Enregistré · push échoué"
             : status === "error"     ? "✗ Erreur d'enregistrement"
             : "Modifications non sauvegardées · ⌘S"}
            </p>
            {status === "save-only" && gitError && (
              <p style={{ margin: "2px 0 0", fontSize: 9, color: "#D97706",
                wordBreak: "break-all" }}>{gitError}</p>
            )}
          </div>
        )}

        {/* Content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
          {!data ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center",
              height: 120, color: INK3, fontSize: 13 }}>
              {status === "error" ? "Impossible de charger le contenu." : "Chargement…"}
            </div>
          ) : (
            <>
              {activeTab === "home"       && <HomeEditor       data={data} onChange={handleChange} />}
              {activeTab === "about"      && <AboutEditor      data={data} onChange={handleChange} />}
              {activeTab === "work"       && <WorkEditor       data={data} onChange={handleChange} />}
              {activeTab === "paynow"     && <PayNowEditor     data={data} onChange={handleChange} />}
              {activeTab === "lcbft"      && <LcbftEditor      data={data} onChange={handleChange} />}
              {activeTab === "onboarding" && <OnboardingEditor data={data} onChange={handleChange} />}
            </>
          )}
        </div>

        {/* Footer ── */}
        <div style={{ flexShrink: 0, borderTop: `1px solid ${BORD}`,
          padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <a href="/tweaks" target="_blank"
            style={{ fontSize: 11, color: INK3, textDecoration: "none",
              display: "flex", alignItems: "center", gap: 4 }}
            onMouseEnter={e => (e.currentTarget.style.color = ACC)}
            onMouseLeave={e => (e.currentTarget.style.color = INK3)}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 1.5h7v7M8.5 1.5L1.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Vue complète
          </a>
          <span style={{ fontSize: 10, color: INK3 }}>⌘S · Enregistrer</span>
        </div>
      </div>
    </>
  );
}
