"use client";
import { useState } from "react";
import {
  CheckCircle2, AlertCircle, Clock, ChevronDown, ChevronUp,
  MessageSquarePlus, Mail, Phone, BookOpen, ExternalLink,
} from "lucide-react";
import { PayNowShell, PN, FONT } from "../_shell";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const SERVICES = [
  { name:"API Paiements",        status:"ok"      },
  { name:"Page de paiement",     status:"ok"      },
  { name:"Portail Back-office",  status:"ok"      },
  { name:"Notifications (email)",status:"degraded"},
  { name:"Webhooks",             status:"ok"      },
  { name:"Tableau de bord",      status:"ok"      },
];

interface Faq { q: string; a: string }
const FAQ: Faq[] = [
  {
    q: "Comment intégrer la page de paiement PayNow ?",
    a: "Redirigez votre client vers l'URL de paiement générée via notre API (POST /v3/payments). Incluez votre clé Live en en-tête Authorization. Le client revient sur votre return_url une fois le paiement effectué. Consultez le guide de démarrage rapide pour un exemple complet.",
  },
  {
    q: "Quels sont les délais de remise ?",
    a: "Le délai standard est de J+1 ouvré après la date de remise. Certaines banques acquéreuses peuvent appliquer J+2. Vous pouvez suivre l'état de chaque remise dans la section Remises du back-office.",
  },
  {
    q: "Comment configurer un abonnement récurrent ?",
    a: "Créez d'abord un alias (tokenisation du moyen de paiement), puis programmez des paiements via POST /v3/subscriptions en spécifiant la fréquence, le montant et la date de démarrage. La section Abonnements du BO vous permet de gérer tous vos plans.",
  },
  {
    q: "Mon webhook ne reçoit pas les événements. Que faire ?",
    a: "Vérifiez que votre endpoint est accessible publiquement (pas de localhost en production), que la signature HMAC-SHA256 est correctement validée, et que votre serveur répond avec un statut 200 en moins de 5 secondes. Consultez l'historique des appels dans Paramètres > Webhooks.",
  },
  {
    q: "Comment effectuer un remboursement ?",
    a: "Via l'API : POST /v3/payments/{id}/refund avec le montant souhaité. Via le back-office : ouvrez la transaction concernée dans Transactions et cliquez sur Rembourser. Le remboursement est traité sous 5 à 10 jours ouvrés selon l'émetteur de la carte.",
  },
  {
    q: "Puis-je tester sans impacter ma production ?",
    a: "Oui. Basculez sur l'environnement Test dans le back-office (toggle Live / Test dans la barre supérieure) et utilisez votre clé sk_test_*. Les cartes de test disponibles sont listées dans la documentation. Aucun prélèvement réel n'est effectué.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────────────────────────────── */
function StatusDot({ status }: { status: "ok"|"degraded"|"incident" }) {
  const cfg = {
    ok:       { color:PN.green, label:"Opérationnel" },
    degraded: { color:PN.amber, label:"Dégradé"      },
    incident: { color:PN.red,   label:"Incident"      },
  };
  const { color, label } = cfg[status];
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
      <span style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0, boxShadow:`0 0 0 3px ${color}33` }} />
      <span style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT }}>{label}</span>
    </div>
  );
}

function FaqItem({ item }: { item: Faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom:`1px solid ${PN.bord}` }}>
      <button
        onClick={() => setOpen(o=>!o)}
        style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between", gap:16, padding:"18px 0", border:"none", background:"none", cursor:"pointer", textAlign:"left" }}
      >
        <span style={{ fontSize:14, fontWeight:600, color:PN.ink, fontFamily:FONT, lineHeight:1.45 }}>{item.q}</span>
        {open
          ? <ChevronUp size={16} style={{ color:PN.ink3, flexShrink:0 }} />
          : <ChevronDown size={16} style={{ color:PN.ink3, flexShrink:0 }} />
        }
      </button>
      {open && (
        <div style={{ paddingBottom:18, fontSize:13.5, color:PN.ink2, fontFamily:FONT, lineHeight:1.7 }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function AssistancePage() {
  const degraded = SERVICES.filter(s => s.status !== "ok");
  const allOk    = degraded.length === 0;

  return (
    <PayNowShell activePage="help">
      <div style={{ padding:"44px 44px 80px", background:PN.bg }}>

        {/* HEADER */}
        <div style={{ marginBottom:36 }}>
          <h1 style={{ margin:"0 0 6px", fontSize:24, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>
            Assistance
          </h1>
          <p style={{ margin:0, fontSize:13.5, color:PN.ink3, fontFamily:FONT }}>
            Statut des services, FAQ et moyens de contact.
          </p>
        </div>

        {/* STATUS BANNER */}
        <div style={{
          display:"flex", alignItems:"center", gap:14, padding:"18px 24px", borderRadius:PN.r.md, marginBottom:32,
          background: allOk ? PN.greenBg : PN.amberBg,
          border: `1px solid ${allOk ? PN.green + "40" : PN.amber + "40"}`,
        }}>
          {allOk
            ? <CheckCircle2 size={20} style={{ color:PN.green, flexShrink:0 }} />
            : <AlertCircle  size={20} style={{ color:PN.amber, flexShrink:0 }} />
          }
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color: allOk ? PN.greenText : PN.amberText, fontFamily:FONT }}>
              {allOk ? "Tous les services sont opérationnels" : `${degraded.length} service${degraded.length>1?"s":""} dégradé${degraded.length>1?"s":""}`}
            </div>
            <div style={{ fontSize:12.5, color: allOk ? PN.greenText : PN.amberText, fontFamily:FONT, opacity:0.8, marginTop:2 }}>
              Dernière vérification : il y a 2 minutes
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12.5, color: allOk ? PN.greenText : PN.amberText, fontFamily:FONT, fontWeight:600 }}>
            <ExternalLink size={12} /> Page de statut
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32, alignItems:"start" }}>
          <div>
            {/* SERVICES GRID */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"hidden", marginBottom:32 }}>
              <div style={{ padding:"18px 24px", borderBottom:`1px solid ${PN.bord}`, fontSize:14, fontWeight:800, color:PN.ink, fontFamily:FONT }}>
                État des services
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                {SERVICES.map((s, i) => (
                  <div key={s.name} style={{ padding:"16px 24px", borderRight: i%2===0 ? `1px solid ${PN.bord}` : "none", borderTop: i>1 ? `1px solid ${PN.bord}` : "none", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                    <span style={{ fontSize:13.5, color:PN.ink, fontFamily:FONT }}>{s.name}</span>
                    <StatusDot status={s.status as "ok"|"degraded"|"incident"} />
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"hidden", padding:"4px 28px 0" }}>
              <div style={{ padding:"18px 0 14px", fontSize:14, fontWeight:800, color:PN.ink, fontFamily:FONT, borderBottom:`1px solid ${PN.bord}`, marginBottom:4 }}>
                Questions fréquentes
              </div>
              {FAQ.map((f, i) => <FaqItem key={i} item={f} />)}
            </div>
          </div>

          {/* SIDEBAR — Contact */}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {/* Ticket */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"hidden" }}>
              <div style={{ background:PN.primary, padding:"24px 24px 20px" }}>
                <MessageSquarePlus size={24} style={{ color:"rgba(255,255,255,0.7)", marginBottom:12 }} />
                <div style={{ fontSize:15, fontWeight:800, color:"#fff", fontFamily:FONT, marginBottom:6 }}>Ouvrir un ticket</div>
                <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.70)", fontFamily:FONT, lineHeight:1.55 }}>
                  Notre équipe répond sous 4 heures ouvrées.
                </div>
              </div>
              <div style={{ padding:"20px 24px" }}>
                <button style={{ width:"100%", padding:"11px", background:PN.primary, border:"none", borderRadius:PN.r.md, color:"#fff", fontSize:13.5, fontWeight:700, fontFamily:FONT, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                  <MessageSquarePlus size={14} /> Nouveau ticket
                </button>
              </div>
            </div>

            {/* Contact */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"22px 24px" }}>
              <div style={{ fontSize:14, fontWeight:800, color:PN.ink, fontFamily:FONT, marginBottom:18 }}>Contact direct</div>
              {[
                { Icon: Mail,  label:"E-mail",    value:"support@paynow.fr",  sub:"Réponse sous 4h ouvrées" },
                { Icon: Phone, label:"Téléphone", value:"0 800 PayNow",       sub:"Lun. au ven. 9h à 18h" },
              ].map(c => (
                <div key={c.label} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                  <div style={{ width:36, height:36, borderRadius:PN.r.md, background:PN.primaryBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <c.Icon size={15} style={{ color:PN.primary }} />
                  </div>
                  <div>
                    <div style={{ fontSize:11, color:PN.ink3, fontFamily:FONT, textTransform:"uppercase", letterSpacing:"0.05em", fontWeight:700 }}>{c.label}</div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{c.value}</div>
                    <div style={{ fontSize:11.5, color:PN.ink3, fontFamily:FONT }}>{c.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Documentation link */}
            <div style={{ background:PN.surf, border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, padding:"20px 24px", display:"flex", alignItems:"center", gap:14 }}>
              <BookOpen size={20} style={{ color:PN.primary, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT }}>Documentation</div>
                <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginTop:2 }}>Guides, API et exemples de code</div>
              </div>
              <ChevronDown size={14} style={{ color:PN.ink3, transform:"rotate(-90deg)" }} />
            </div>

            {/* Horaires */}
            <div style={{ border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, padding:"16px 20px", display:"flex", alignItems:"flex-start", gap:10 }}>
              <Clock size={14} style={{ color:PN.ink3, marginTop:2, flexShrink:0 }} />
              <div style={{ fontSize:12.5, color:PN.ink2, fontFamily:FONT, lineHeight:1.65 }}>
                <strong style={{ color:PN.ink }}>Horaires du support</strong><br />
                Lundi au vendredi : 9h00 à 18h00<br />
                Incidents critiques : astreinte 24/7
              </div>
            </div>
          </div>
        </div>
      </div>
    </PayNowShell>
  );
}
