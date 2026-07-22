"use client";
import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import {
  ChevronDown, Check, Upload, X,
  Info, AlertTriangle, Save,
} from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav } from "../_perso";

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION CARD
───────────────────────────────────────────────────────────────────────────── */
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"28px 32px", marginBottom:20, boxShadow:"0 2px 8px rgba(11,26,52,0.04)" }}>
      <div style={{ fontSize:10.5, fontWeight:800, color:PN.ink3, letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:FONT, marginBottom:14 }}>{title}</div>
      <div style={{ height:1, background:PN.bord, marginBottom:24 }} />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COLOR PICKER
───────────────────────────────────────────────────────────────────────────── */
function ColorPicker({ label, value, onChange }: { label:string; value:string; onChange:(v:string)=>void }) {
  const [raw, setRaw] = useState(value.toUpperCase());
  useEffect(() => { setRaw(value.toUpperCase()); }, [value]);

  function commitRaw(v: string) {
    const cleaned = v.startsWith("#") ? v : "#" + v;
    if (/^#[0-9A-Fa-f]{6}$/.test(cleaned)) onChange(cleaned);
    else setRaw(value.toUpperCase());
  }

  return (
    <div>
      <div style={{ fontSize:13, fontWeight:600, color:PN.ink2, fontFamily:FONT, marginBottom:8 }}>{label}</div>
      <label style={{ display:"inline-flex", alignItems:"stretch", border:`1px solid ${PN.bord}`, borderRadius:PN.r.sm, overflow:"hidden", cursor:"pointer", boxShadow:"0 1px 3px rgba(11,26,52,0.06)" }}>
        <div style={{ position:"relative", width:42, flexShrink:0, background:value }}>
          <input
            type="color" value={value}
            onChange={e => onChange(e.target.value)}
            style={{ position:"absolute", inset:0, opacity:0, width:"100%", height:"100%", cursor:"pointer", border:"none" }}
          />
        </div>
        <input
          type="text" value={raw}
          onChange={e => setRaw(e.target.value.toUpperCase())}
          onBlur={e => commitRaw(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") commitRaw(raw); }}
          maxLength={7}
          style={{ border:"none", padding:"0 14px", fontSize:13.5, fontFamily:"monospace", color:PN.ink, width:96, outline:"none", background:"#fff", height:40 }}
        />
      </label>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   UPLOAD ZONE
───────────────────────────────────────────────────────────────────────────── */
function UploadZone({ label, preview, onUpload, onRemove, accept, hint, square = false }: {
  label:string; preview:string|null;
  onUpload:(file:File, url:string)=>void; onRemove:()=>void;
  accept:string; hint:string; square?:boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = e => { if (e.target?.result) onUpload(file, e.target.result as string); };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div style={{ fontSize:13, fontWeight:600, color:PN.ink2, fontFamily:FONT, marginBottom:10 }}>{label}</div>
      <input ref={inputRef} type="file" accept={accept} style={{ display:"none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); e.dataTransfer.files?.[0] && handleFile(e.dataTransfer.files[0]); }}
        style={{
          border:`2px dashed ${dragging ? PN.primary : PN.bord}`,
          borderRadius:PN.r.lg,
          width: square ? 140 : "100%", height: square ? 140 : 148,
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          gap:10, cursor:"pointer",
          background: dragging ? PN.primaryBg : "#fafbfe",
          transition:"all 0.15s", boxSizing:"border-box",
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" style={{ maxHeight:70, maxWidth:square?100:160, objectFit:"contain" }} />
            <button
              onMouseDown={e => { e.stopPropagation(); onRemove(); }}
              style={{ display:"flex", alignItems:"center", gap:4, border:`1px solid ${PN.redBg}`, borderRadius:PN.r.sm, background:PN.redBg, cursor:"pointer", fontSize:11.5, color:PN.red, fontFamily:FONT, fontWeight:600, padding:"3px 10px" }}
            >
              <X size={11} /> Supprimer
            </button>
          </>
        ) : (
          <>
            <div style={{ width:44, height:44, borderRadius:PN.r.md, background:PN.surf, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Upload size={20} style={{ color:PN.ink3 }} strokeWidth={1.8} />
            </div>
            <button
              onMouseDown={e => { e.preventDefault(); inputRef.current?.click(); }}
              style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.sm, background:"#fff", cursor:"pointer", fontSize:13, fontFamily:FONT, color:PN.ink2, fontWeight:600, padding:"6px 18px" }}
            >
              Importer
            </button>
          </>
        )}
      </div>
      <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT, marginTop:8, lineHeight:1.45 }}>{hint}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEGAL ACCORDION
───────────────────────────────────────────────────────────────────────────── */
const LEGAL_PARAGRAPHS = [
  "L'utilisation d'un logo par le Marchand engage la pleine et entière responsabilité de ce dernier. En tout état de cause, la Banque se réserve la possibilité de refuser l'affichage d'un logo si celui-ci venait en contradiction avec le corps de règle de la Banque (défini ci-après), l'image de la Banque ou la protection des droits d'un tiers. Dans ce cas, la Banque en informera le Marchand, lequel ne pourra réclamer à cette occasion un quelconque dédommagement.",
  "En tout état de cause, le Marchand certifie et atteste à la Banque qu'il est l'auteur du logo ou qu'il en a acquis les droits.",
  "Le Marchand assume la pleine et entière responsabilité de ses déclarations et s'engage à prendre à sa charge toutes les conséquences que pourront avoir, à l'égard de la Banque, une déclaration mensongère.",
];
const LEGAL_BULLETS_INTERDIT = [
  "Texte et chiffres (ex : adresse, numéro de téléphone, e-mail, nom…) ;",
  "Personnages, références ou illustrations liés à la littérature, aux marques et à la publicité.",
];
const LEGAL_BULLETS_USAGE = [
  "Ayant une connotation politique ou religieuse ;",
  "Ayant une connotation ou un contenu violent, raciste, xénophobe, antisémite, subversif, choquant, provoquant, sexuel, obscène, ou contraire à la morale publique ou incitant au suicide, à la violation des dispositions légales ou réglementaires et notamment l'incitation à une violation du droit pénal, à la commission d'un délit, crime ou acte terroriste ;",
  "Qui soit en rapport avec : l'alcool, le tabac, la drogue ou tout autre stupéfiant ou produit dont la commercialisation et l'usage sont strictement contrôlés ou à leur usage ;",
  "Faisant l'apologie des crimes de guerre ou des crimes contre l'humanité ;",
  "Portant atteinte à la dignité et à l'intégrité de la personne humaine ;",
  "Les codes PIN, données personnelles et confidentielles au sens de la Loi Informatique et Libertés.",
];

function LegalAccordion() {
  const [open, setOpen] = useState(false);
  const pStyle: CSSProperties = { fontSize:13, color:PN.ink2, fontFamily:FONT, lineHeight:1.65, margin:"0 0 12px" };
  const liStyle: CSSProperties = { fontSize:13, color:PN.ink2, fontFamily:FONT, lineHeight:1.65, marginBottom:6 };
  return (
    <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.lg, overflow:"hidden", marginTop:20 }}>
      <button
        onClick={() => setOpen(o=>!o)}
        style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"14px 18px", border:"none", background:open?PN.primaryBg:PN.surf, cursor:"pointer", textAlign:"left" }}
      >
        <div style={{ width:22, height:22, borderRadius:"50%", background:PN.primary, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Info size={13} style={{ color:"#fff" }} strokeWidth={2.5} />
        </div>
        <span style={{ flex:1, fontSize:12, fontWeight:800, color:open?PN.primary:PN.ink, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT }}>
          Responsabilité &amp; règles d&apos;utilisation des logos
        </span>
        <ChevronDown size={16} style={{ color:PN.ink3, transform:open?"rotate(180deg)":"none", transition:"transform 0.2s", flexShrink:0 }} />
      </button>

      {open && (
        <div style={{ padding:"20px 20px 24px", borderTop:`1px solid ${PN.bord}` }}>
          {LEGAL_PARAGRAPHS.map((p, i) => <p key={i} style={pStyle}>{p}</p>)}

          <p style={{ ...pStyle, fontWeight:700, color:PN.ink, textTransform:"uppercase", fontSize:11.5, letterSpacing:"0.06em", margin:"20px 0 10px" }}>
            Corps de règles pour les logos
          </p>
          <p style={pStyle}>La Banque s&apos;interdit l&apos;affichage de logos comportant :</p>
          <ul style={{ margin:"0 0 14px", paddingLeft:20 }}>
            {LEGAL_BULLETS_INTERDIT.map((b,i) => <li key={i} style={liStyle}>{b}</li>)}
          </ul>
          <p style={pStyle}>La Banque interdit expressément l&apos;utilisation de photos, images, représentations, symboles et textes :</p>
          <ul style={{ margin:"0 0 8px", paddingLeft:20 }}>
            {LEGAL_BULLETS_USAGE.map((b,i) => <li key={i} style={liStyle}>{b}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FONT PICKER
───────────────────────────────────────────────────────────────────────────── */
const FONTS = [
  { name:"Manrope",   label:"Manrope · police du Design System" },
  { name:"Inter",     label:"Inter" },
  { name:"Roboto",    label:"Roboto" },
  { name:"Open Sans", label:"Open Sans" },
  { name:"Poppins",   label:"Poppins" },
  { name:"Nunito",    label:"Nunito" },
  { name:"Raleway",   label:"Raleway" },
  { name:"Lato",      label:"Lato" },
];

function FontPicker({ value, onChange }: { value:string; onChange:(v:string)=>void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e:MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button onClick={() => setOpen(o=>!o)} style={{
        display:"flex", alignItems:"center", gap:10, minWidth:220,
        border:`1px solid ${PN.bord}`, borderRadius:PN.r.sm, padding:"10px 14px",
        background:"#fff", cursor:"pointer", boxShadow:"0 1px 3px rgba(11,26,52,0.06)",
      }}>
        <span style={{ flex:1, fontSize:15, color:PN.ink, fontWeight:600, textAlign:"left", fontFamily:`${value}, sans-serif` }}>{value}</span>
        <ChevronDown size={14} style={{ color:PN.ink3, flexShrink:0 }} />
      </button>

      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, boxShadow:"0 8px 32px rgba(11,26,52,0.12)", zIndex:200, minWidth:280, overflow:"hidden" }}>
          {FONTS.map(f => (
            <button key={f.name} onClick={() => { onChange(f.name); setOpen(false); }} className="pn-filter-opt" style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              width:"100%", padding:"11px 16px", border:"none",
              background:f.name===value?PN.primaryBg:"transparent", cursor:"pointer", textAlign:"left",
            }}>
              <div>
                <div style={{ fontSize:15, color:f.name===value?PN.primary:PN.ink, fontWeight:f.name===value?700:400, fontFamily:`${f.name}, sans-serif` }}>{f.name}</div>
                {f.name === "Manrope" && <div style={{ fontSize:10.5, color:PN.ink3, fontFamily:FONT, marginTop:2 }}>Police du Design System · recommandée</div>}
              </div>
              {f.name === value && <Check size={13} style={{ color:PN.primary, flexShrink:0 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   COLOR PREVIEW BADGE
───────────────────────────────────────────────────────────────────────────── */
function ColorPreview({ primary, secondary }: { primary:string; secondary:string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:20, padding:"16px 18px", background:PN.surf, borderRadius:PN.r.lg, border:`1px solid ${PN.bord}` }}>
      <span style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, fontWeight:600 }}>Aperçu :</span>
      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <div style={{ width:28, height:28, borderRadius:PN.r.sm, background:primary, boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
          <div style={{ display:"flex", alignItems:"center", gap:6, background:primary, color:"#fff", borderRadius:PN.r.sm, padding:"6px 14px" }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:secondary }} />
            <span style={{ fontSize:12, fontWeight:700, fontFamily:FONT }}>Payer</span>
          </div>
        </div>
        <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT }}>bouton principal</div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:6, marginLeft:8 }}>
        <div style={{ width:28, height:28, borderRadius:PN.r.sm, background:secondary, boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }} />
        <span style={{ fontSize:11, color:PN.ink3, fontFamily:FONT }}>accent / liens</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function IdentiteMarquePage() {
  const [primaryColor,   setPrimaryColor]   = useState("#293C7A");
  const [secondaryColor, setSecondaryColor] = useState("#3774B9");
  const [logoPreview,    setLogoPreview]    = useState<string|null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string|null>(null);
  const [selectedFont,   setSelectedFont]   = useState("Manrope");
  const [isDirty,        setIsDirty]        = useState(false);
  const [saveSuccess,    setSaveSuccess]    = useState(false);

  /* track dirty state */
  const initial = useRef({ primaryColor:"#293C7A", secondaryColor:"#3774B9", selectedFont:"Manrope" });
  function markDirty() { setIsDirty(true); setSaveSuccess(false); }

  function handlePrimary(v: string)   { setPrimaryColor(v);   markDirty(); }
  function handleSecondary(v: string) { setSecondaryColor(v); markDirty(); }
  function handleFont(v: string)      { setSelectedFont(v);   markDirty(); }
  function handleLogo(f:File, url:string)    { setLogoPreview(url);    markDirty(); }
  function handleFavicon(f:File, url:string) { setFaviconPreview(url); markDirty(); }

  function save() {
    setIsDirty(false);
    setSaveSuccess(true);
    initial.current = { primaryColor, secondaryColor, selectedFont };
    setTimeout(() => setSaveSuccess(false), 3500);
  }

  function reset() {
    setPrimaryColor(initial.current.primaryColor);
    setSecondaryColor(initial.current.secondaryColor);
    setSelectedFont(initial.current.selectedFont);
    setLogoPreview(null);
    setFaviconPreview(null);
    setIsDirty(false);
  }

  return (
    <PayNowShell activePage="perso">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>

        <SecondaryNav activeId="identite" />

        {/* CONTENT */}
        <div style={{ flex:1, overflowY:"auto" }}>
          <div style={{ padding:"44px 44px 100px", maxWidth:860 }}>

            {/* HEADER */}
            <div style={{ marginBottom:32 }}>
              <h1 style={{ margin:"0 0 8px", fontSize:24, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>
                Identité de marque
              </h1>
              <p style={{ margin:0, fontSize:13.5, color:PN.ink2, fontFamily:FONT, lineHeight:1.55 }}>
                La socle visuel de votre marque. Repris par défaut sur tous vos parcours de paiement,
                e-mails et traductions. Les couleurs sont pré-remplies depuis le thème de votre marque.
              </p>
            </div>

            {/* SUCCESS TOAST */}
            {saveSuccess && (
              <div style={{ display:"flex", alignItems:"center", gap:10, background:PN.greenBg, border:`1px solid ${PN.green}40`, borderLeft:`3px solid ${PN.green}`, borderRadius:PN.r.md, padding:"12px 16px", marginBottom:20, fontFamily:FONT, fontSize:13.5, fontWeight:600, color:PN.greenText }}>
                <Check size={16} style={{ flexShrink:0 }} />
                Identité de marque sauvegardée avec succès.
              </div>
            )}

            {/* ── COULEURS ── */}
            <SectionCard title="Couleurs">
              <p style={{ margin:"0 0 20px", fontSize:13, color:PN.ink2, fontFamily:FONT, lineHeight:1.55 }}>
                Couleur principale et secondaire de votre espace de paiement. Utilisées sur les boutons,
                liens et éléments d&apos;interface de vos parcours.
              </p>
              <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
                <ColorPicker label="Couleur principale" value={primaryColor} onChange={handlePrimary} />
                <ColorPicker label="Couleur secondaire" value={secondaryColor} onChange={handleSecondary} />
              </div>
              <ColorPreview primary={primaryColor} secondary={secondaryColor} />
            </SectionCard>

            {/* ── LOGO & FAVICON ── */}
            <SectionCard title="Logo & Favicon">
              <p style={{ margin:"0 0 24px", fontSize:13, color:PN.ink2, fontFamily:FONT, lineHeight:1.55 }}>
                Le logo de votre boutique, repris par défaut sur vos parcours de paiement et e-mails.
                Le contraste (fond clair ou sombre) est calculé automatiquement à partir du logo.
              </p>

              <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:40, alignItems:"start" }}>
                {/* Logo */}
                <UploadZone
                  label="Logo par défaut de la boutique"
                  preview={logoPreview}
                  onUpload={handleLogo}
                  onRemove={() => { setLogoPreview(null); markDirty(); }}
                  accept="image/png,image/svg+xml"
                  hint="Format large recommandé (PNG / SVG transparent). Fond transparent recommandé pour le contraste automatique."
                />
                {/* Favicon */}
                <UploadZone
                  label="Favicon"
                  preview={faviconPreview}
                  onUpload={handleFavicon}
                  onRemove={() => { setFaviconPreview(null); markDirty(); }}
                  accept="image/png,image/x-icon,image/vnd.microsoft.icon"
                  hint={`Format carré PNG ou ICO\n32×32 px minimum`}
                  square
                />
              </div>

              <LegalAccordion />
            </SectionCard>

            {/* ── TYPOGRAPHIE ── */}
            <SectionCard title="Typographie">
              <p style={{ margin:"0 0 20px", fontSize:13, color:PN.ink2, fontFamily:FONT, lineHeight:1.55 }}>
                Une police unique pour l&apos;ensemble (corps et titres). Manrope, la police du Design System,
                est appliquée par défaut.
              </p>

              <div style={{ marginBottom:8 }}>
                <div style={{ fontSize:13, fontWeight:600, color:PN.ink2, fontFamily:FONT, marginBottom:10 }}>Police</div>
                <FontPicker value={selectedFont} onChange={handleFont} />
              </div>

              <div style={{ marginTop:20, padding:"16px 18px", background:PN.surf, borderRadius:PN.r.lg, border:`1px solid ${PN.bord}` }}>
                <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, marginBottom:8, fontWeight:600, letterSpacing:"0.05em", textTransform:"uppercase" }}>Aperçu typographique</div>
                <div style={{ fontFamily:`${selectedFont}, -apple-system, sans-serif`, marginBottom:6 }}>
                  <div style={{ fontSize:20, fontWeight:800, color:PN.ink, letterSpacing:"-0.02em", marginBottom:4 }}>Votre titre de page</div>
                  <div style={{ fontSize:13.5, color:PN.ink2, lineHeight:1.6 }}>Corps de texte · descriptions et libellés de votre formulaire de paiement.</div>
                  <div style={{ marginTop:10, display:"flex", gap:8 }}>
                    <span style={{ background:primaryColor, color:"#fff", borderRadius:6, padding:"7px 16px", fontSize:13, fontWeight:700, display:"inline-block" }}>PAYER</span>
                    <span style={{ color:secondaryColor, fontSize:13, fontWeight:600, padding:"7px 4px", textDecoration:"underline", cursor:"pointer" }}>Annuler</span>
                  </div>
                </div>
              </div>

              {selectedFont !== "Manrope" && (
                <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:14, fontSize:12.5, color:PN.amberText, fontFamily:FONT }}>
                  <AlertTriangle size={13} style={{ flexShrink:0 }} />
                  Manrope est la police recommandée pour la cohérence du Design System.
                </div>
              )}
            </SectionCard>

          </div>
        </div>
      </div>

      {/* ── STICKY SAVE FOOTER ── */}
      {(isDirty || saveSuccess) && (
        <div style={{
          position:"fixed", bottom:0, left:PN.sidebarW + 230, right:0,
          background:"#fff", borderTop:`1px solid ${PN.bord}`,
          padding:"14px 44px", display:"flex", alignItems:"center", justifyContent:"space-between",
          boxShadow:"0 -4px 20px rgba(11,26,52,0.08)", zIndex:50, fontFamily:FONT,
        }}>
          <span style={{ fontSize:13, color:PN.ink2 }}>
            {isDirty ? "Vous avez des modifications non sauvegardées." : ""}
          </span>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={reset} style={{ padding:"9px 20px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:"pointer", fontSize:13.5, fontFamily:FONT, color:PN.ink2, fontWeight:600 }}>
              Annuler
            </button>
            <button onClick={save} style={{ display:"flex", alignItems:"center", gap:7, padding:"9px 22px", border:"none", borderRadius:PN.r.md, background:PN.primary, color:"#fff", cursor:"pointer", fontSize:13.5, fontFamily:FONT, fontWeight:700, boxShadow:"0 2px 10px rgba(59,126,248,0.32)" }}>
              <Save size={14} strokeWidth={2.3} />
              Sauvegarder
            </button>
          </div>
        </div>
      )}
    </PayNowShell>
  );
}
