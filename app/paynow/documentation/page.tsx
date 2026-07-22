"use client";
import { useState } from "react";
import { Search, BookOpen, Code2, Webhook, Layers, Zap, HelpCircle, ChevronRight, X, ExternalLink, Clock } from "lucide-react";
import { PayNowShell, PN, FONT } from "../_shell";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
interface Article { id:number; title:string; category:string; duration:string; description:string; badge?:string }

const CATEGORIES = [
  { id:"all",       label:"Tout",            icon: BookOpen },
  { id:"start",     label:"Démarrage",       icon: Zap      },
  { id:"api",       label:"API REST",        icon: Code2    },
  { id:"webhooks",  label:"Webhooks",        icon: Webhook  },
  { id:"sdk",       label:"SDKs",            icon: Layers   },
  { id:"guides",    label:"Guides métier",   icon: BookOpen },
  { id:"faq",       label:"FAQ",             icon: HelpCircle },
];

const ARTICLES: Article[] = [
  { id:1,  title:"Démarrage rapide : premier paiement en 5 min",   category:"start",    duration:"5 min",  description:"Créez votre premier appel API et encaissez un paiement test en moins de 5 minutes.",  badge:"Nouveau" },
  { id:2,  title:"Authentification et sécurité des clés API",      category:"start",    duration:"8 min",  description:"Comment stocker et utiliser vos clés Live et Test en toute sécurité." },
  { id:3,  title:"Référence complète de l'API REST",               category:"api",      duration:"15 min", description:"Toutes les routes, paramètres, codes de retour et exemples de la v3 de l'API." },
  { id:4,  title:"Créer et gérer des paiements",                   category:"api",      duration:"10 min", description:"Cycle de vie complet d'un paiement : création, capture, annulation, remboursement." },
  { id:5,  title:"Gestion des alias (tokenisation)",               category:"api",      duration:"7 min",  description:"Enregistrez des moyens de paiement pour faciliter les achats récurrents." },
  { id:6,  title:"Webhooks : référence des événements",            category:"webhooks", duration:"12 min", description:"Liste exhaustive des événements, format JSON et logique de ré-essai.",  badge:"Mis à jour" },
  { id:7,  title:"Sécuriser et vérifier les webhooks",             category:"webhooks", duration:"6 min",  description:"Validation de signature HMAC-SHA256 pour garantir l'authenticité des appels." },
  { id:8,  title:"SDK JavaScript / Node.js",                       category:"sdk",      duration:"9 min",  description:"Installation via npm, exemples d'intégration côté serveur et edge functions." },
  { id:9,  title:"SDK PHP",                                        category:"sdk",      duration:"9 min",  description:"Composer, exemples Laravel et Symfony, gestion des erreurs." },
  { id:10, title:"Plugin WooCommerce",                             category:"sdk",      duration:"4 min",  description:"Installez le plugin officiel et configurez-le en moins de 10 minutes." },
  { id:11, title:"Mettre en place des abonnements",                category:"guides",   duration:"11 min", description:"Créez des plans tarifaires récurrents avec prélèvement automatique." },
  { id:12, title:"Comprendre et réduire les remises refusées",     category:"guides",   duration:"8 min",  description:"Causes fréquentes de refus bancaire et bonnes pratiques pour y remédier." },
  { id:13, title:"Intégrer la page de paiement hébergée",          category:"guides",   duration:"6 min",  description:"Redirigez vos clients vers une page sécurisée sans stocker de données carte." },
  { id:14, title:"Quels sont les délais de remise ?",              category:"faq",      duration:"2 min",  description:"Délais standards par banque acquéreuse et comment les suivre dans le BO." },
  { id:15, title:"Comment tester sans impacter la production ?",   category:"faq",      duration:"3 min",  description:"Utilisation de l'environnement Test, cartes de test et cas de refus simulés." },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ARTICLE CARD
───────────────────────────────────────────────────────────────────────────── */
function ArticleCard({ article }: { article: Article }) {
  return (
    <div
      className="pn-tr"
      style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"20px 22px", cursor:"pointer", transition:"box-shadow 0.15s" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,126,248,0.10)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:8 }}>
        <div style={{ fontSize:14, fontWeight:700, color:PN.ink, fontFamily:FONT, lineHeight:1.4 }}>{article.title}</div>
        {article.badge && (
          <span style={{ fontSize:10.5, fontWeight:700, background:PN.primaryBg, color:PN.primary, borderRadius:PN.r.md, padding:"3px 8px", fontFamily:FONT, whiteSpace:"nowrap", flexShrink:0 }}>{article.badge}</span>
        )}
      </div>
      <div style={{ fontSize:12.5, color:PN.ink3, fontFamily:FONT, lineHeight:1.55, marginBottom:14 }}>{article.description}</div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:PN.ink3, fontFamily:FONT }}>
          <Clock size={11} />
          {article.duration} de lecture
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:4, fontSize:12.5, color:PN.primary, fontWeight:600, fontFamily:FONT }}>
          Lire l'article
          <ChevronRight size={13} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function DocumentationPage() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("all");

  const filtered = ARTICLES.filter(a => {
    if (category !== "all" && a.category !== category) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !a.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <PayNowShell activePage="docs">
      <div style={{ padding:"44px 44px 80px", background:PN.bg }}>

        {/* HERO */}
        <div style={{ background:`linear-gradient(135deg, ${PN.navy} 0%, #1A3060 100%)`, borderRadius:PN.r.xl, padding:"40px 48px", marginBottom:36, display:"flex", alignItems:"center", justifyContent:"space-between", gap:32 }}>
          <div>
            <h1 style={{ margin:"0 0 10px", fontSize:26, fontWeight:800, color:"#fff", letterSpacing:"-0.04em", fontFamily:FONT }}>Documentation</h1>
            <p style={{ margin:"0 0 24px", fontSize:14, color:"rgba(255,255,255,0.65)", fontFamily:FONT, lineHeight:1.6 }}>
              Guides d'intégration, références API et exemples de code pour exploiter PayNow.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:6, background:PN.primary, color:"#fff", borderRadius:PN.r.md, padding:"10px 20px", fontSize:13, fontWeight:700, fontFamily:FONT, textDecoration:"none" }}>
                <Zap size={13} strokeWidth={2.5} /> Démarrage rapide
              </a>
              <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.10)", color:"#fff", borderRadius:PN.r.md, padding:"10px 20px", fontSize:13, fontWeight:700, fontFamily:FONT, textDecoration:"none" }}>
                <ExternalLink size={13} /> Référence API
              </a>
            </div>
          </div>
          <BookOpen size={80} style={{ color:"rgba(255,255,255,0.08)", flexShrink:0 }} />
        </div>

        {/* SEARCH */}
        <div style={{ position:"relative", marginBottom:28 }}>
          <Search size={16} style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:PN.ink3 }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans la documentation..."
            style={{ width:"100%", height:48, paddingLeft:46, paddingRight:search?44:16, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, fontSize:14, fontFamily:FONT, color:PN.ink, background:"#fff", outline:"none", boxSizing:"border-box" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", border:"none", background:"none", cursor:"pointer", color:PN.ink3, display:"flex" }}>
              <X size={15} />
            </button>
          )}
        </div>

        {/* CATEGORIES */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:28 }}>
          {CATEGORIES.map(c => {
            const Icon = c.icon;
            const active = category === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 16px", border:`1px solid ${active?PN.primary:PN.bord}`, borderRadius:PN.r.md, background:active?PN.primaryBg:"#fff", color:active?PN.primary:PN.ink2, fontSize:13, fontWeight:active?700:500, fontFamily:FONT, cursor:"pointer", transition:"all 0.12s" }}
              >
                <Icon size={13} />
                {c.label}
                <span style={{ fontSize:11, background:active?PN.primary:PN.surf, color:active?"#fff":PN.ink3, borderRadius:PN.r.full, padding:"1px 6px", fontFamily:FONT, fontWeight:700 }}>
                  {c.id === "all" ? ARTICLES.length : ARTICLES.filter(a => a.category === c.id).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* RESULTS */}
        {filtered.length === 0 ? (
          <div style={{ textAlign:"center", padding:"60px 24px", color:PN.ink3, fontFamily:FONT, fontSize:14 }}>
            Aucun article ne correspond à votre recherche.
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:16 }}>
            {filtered.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </div>
    </PayNowShell>
  );
}
