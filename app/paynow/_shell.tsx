"use client";
import { useState, useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  LayoutDashboard, ArrowLeftRight, Building2, Tag, RefreshCcw,
  Paintbrush, Settings, BookOpen, HelpCircle,
  Search, Bell, Globe, ChevronDown, ChevronsUpDown, Zap, ArrowLeft,
  Wrench, ChevronRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DesktopOnlyModal } from "@/components/ui";

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
export const PN = {
  /* ── Two blues ── */
  primary:     "#3B7EF8",          // vivid electric blue — CTAs, active, links
  primaryDark: "#2352D6",          // hover / pressed
  primaryBg:   "#EBF2FF",          // active filter bg, active row tint
  navy:        "#0B1A34",          // dark navy — sidebar bg, headings

  /* ── Content surface ── */
  bg:    "#FFFFFF",                // pure white main content
  surf:  "#F4F7FF",                // table header, subtle sections
  bord:  "#E3E8F4",                // borders
  bordMd:"#C5CEE8",                // darker borders

  /* ── Text ── */
  ink:   "#0B1A34",                // headings (same as navy)
  ink2:  "#3A5070",                // body text
  ink3:  "#8A9EC0",                // secondary / placeholder
  ink4:  "#C0CEDF",                // disabled / dividers

  /* ── Status colors ── */
  green:     "#059669",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  amber:     "#D97706",
  amberBg:   "#FEF3C7",
  amberText: "#92400E",
  red:       "#DC2626",
  redBg:     "#FEE2E2",
  redText:   "#991B1B",
  blue:      "#2563EB",
  blueBg:    "#DBEAFE",
  blueText:  "#1E40AF",

  /* ── Dimensions ── */
  sidebarW: 264,
  headerH:  60,

  /* ── Radius ── */
  r: { xs:4, sm:7, md:10, lg:14, xl:20, full:100 },
};

export const FONT = "'Manrope', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";

/* Sidebar-specific palette — fond clair */
const SB = {
  bg:       "#FFFFFF",
  textAct:  "#3B7EF8",
  textIdle: "#3A5070",
  iconAct:  "#3B7EF8",
  iconIdle: "#8A9EC0",
  activeBg: "#EBF2FF",
  div:      "#E3E8F4",
};

/* ─────────────────────────────────────────────────────────────────────────────
   NAV CONFIG
───────────────────────────────────────────────────────────────────────────── */
const MAIN_NAV: { id: string; label: string; icon: LucideIcon; href: string }[] = [
  { id: "dashboard",    label: "Dashboard",    icon: LayoutDashboard, href: "/paynow/dashboard" },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight,  href: "/paynow/transactions" },
  { id: "alias",        label: "Alias",        icon: Tag,             href: "/paynow/alias" },
  { id: "abonnements",  label: "Abonnements",  icon: RefreshCcw,      href: "/paynow/abonnements" },
];

const BOTTOM_NAV: { id: string; label: string; icon: LucideIcon; href: string }[] = [
  { id: "perso",  label: "Personnalisation", icon: Paintbrush, href: "/paynow/personnalisation/identite" },
  { id: "params", label: "Paramètres",       icon: Settings,   href: "/paynow/parametres" },
  { id: "docs",   label: "Documentation",    icon: BookOpen,   href: "/paynow/documentation" },
  { id: "help",   label: "Assistance",       icon: HelpCircle, href: "/paynow/assistance" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────────────────────────────── */
export function PayNowLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      <div style={{
        background: PN.primary, color: "#fff",
        fontSize: 14, fontWeight: 800, lineHeight: 1.25,
        padding: "5px 10px 6px", borderRadius: PN.r.sm,
        letterSpacing: "-0.01em", fontFamily: FONT,
      }}>Pay</div>
      <span style={{
        color: PN.primary, fontSize: 16, fontWeight: 800,
        letterSpacing: "-0.03em", marginLeft: 4, fontFamily: FONT,
      }}>Now</span>
    </div>
  );
}

function NavItem({
  href, icon: Icon, label, active,
}: { href: string; icon: LucideIcon; label: string; active: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", marginBottom: 2 }}>
      <div
        className={active ? "pn-nav-active" : "pn-nav-idle"}
        style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 14px",
          borderRadius: PN.r.md,
          color: active ? SB.textAct : SB.textIdle,
          background: active ? SB.activeBg : "transparent",
          fontWeight: active ? 700 : 500,
          fontSize: 13.5, fontFamily: FONT,
          letterSpacing: "-0.01em",
          cursor: "pointer",
        }}
      >
        <Icon
          size={16}
          strokeWidth={active ? 2.4 : 1.8}
          style={{ color: active ? SB.iconAct : SB.iconIdle, flexShrink: 0 }}
        />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {label}
        </span>
      </div>
    </Link>
  );
}

export function ToggleSwitch({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 38, height: 22, borderRadius: PN.r.full,
        background: on ? PN.primary : PN.ink4,
        border: "none", cursor: "pointer", padding: 3,
        display: "flex", alignItems: "center",
        justifyContent: on ? "flex-end" : "flex-start",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: "50%",
        background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
      }} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DEV MODAL — page en cours de développement
───────────────────────────────────────────────────────────────────────────── */
export function DevModal({ onClose }: { onClose: () => void }) {
  const suggestions = [
    { href: "/paynow/personnalisation/identite", Icon: Paintbrush, label: "Personnalisation", sub: "Identité, couleurs, e-mails" },
    { href: "/paynow/abonnements",               Icon: RefreshCcw,  label: "Créer un abonnement", sub: "Paramétrer un nouveau plan" },
    { href: "#",                                 Icon: Settings,    label: "Paramètres", sub: "Configuration du compte" },
  ];

  return createPortal(
    <div
      style={{ position:"fixed", inset:0, zIndex:10000, background:"rgba(11,26,52,0.32)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}
    >
      <div
        style={{ background:"#fff", borderRadius:PN.r.xl, width:400, maxWidth:"90vw", boxShadow:"0 32px 80px rgba(11,26,52,0.22), 0 2px 8px rgba(11,26,52,0.06)", overflow:"hidden" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding:"28px 28px 20px" }}>
          <div style={{ width:48, height:48, borderRadius:PN.r.md, background:PN.amberBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
            <Wrench size={22} style={{ color:PN.amber }} />
          </div>
          <h2 style={{ margin:"0 0 8px", fontSize:18, fontWeight:800, color:PN.ink, letterSpacing:"-0.03em", fontFamily:FONT }}>
            En cours de développement
          </h2>
          <p style={{ margin:0, fontSize:13.5, color:PN.ink3, fontFamily:FONT, lineHeight:1.65 }}>
            Cette fonctionnalité n&apos;est pas encore disponible dans ce prototype. Voici ce que vous pouvez explorer dès maintenant :
          </p>
        </div>

        {/* Suggestions */}
        <div style={{ padding:"0 28px", display:"flex", flexDirection:"column", gap:8 }}>
          {suggestions.map(({ href, Icon, label, sub }) => (
            <Link
              key={label}
              href={href}
              onClick={onClose}
              style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 14px", background:PN.surf, border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, textDecoration:"none" }}
            >
              <div style={{ width:36, height:36, borderRadius:PN.r.sm, background:PN.primaryBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <Icon size={16} style={{ color:PN.primary }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:PN.ink, fontFamily:FONT }}>{label}</div>
                <div style={{ fontSize:12, color:PN.ink3, fontFamily:FONT, marginTop:2 }}>{sub}</div>
              </div>
              <ChevronRight size={14} style={{ color:PN.ink4, flexShrink:0 }} />
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding:"20px 28px 24px", display:"flex", justifyContent:"flex-end" }}>
          <button
            onClick={onClose}
            style={{ padding:"9px 22px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.md, background:"#fff", cursor:"pointer", fontSize:13.5, fontWeight:600, color:PN.ink2, fontFamily:FONT }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHELL
───────────────────────────────────────────────────────────────────────────── */
export function PayNowShell({ children, activePage }: { children: ReactNode; activePage: string }) {
  const [live, setLive] = useState(true);
  const [inIframe, setInIframe] = useState(false);
  useEffect(() => {
    try { setInIframe(window.self !== window.top); } catch { setInIframe(true); }
  }, []);

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');

        /* Nav hover — fond clair */
        .pn-nav-idle:hover {
          background: #F4F7FF !important;
          color: #0B1A34 !important;
        }
        .pn-nav-idle:hover svg {
          color: #3B7EF8 !important;
        }

        /* Table row hover */
        .pn-tr:hover td {
          background: #EBF2FF !important;
        }

        /* Filter option hover */
        .pn-filter-opt:hover {
          background: #F4F7FF;
        }

        /* Inputs */
        input::placeholder { color: #8A9EC0; }
        input:focus { outline: none; }

        /* Toolbar button label reveal on hover */
        .pn-tool-label {
          max-width: 0; overflow: hidden; opacity: 0;
          transition: max-width 0.2s ease, opacity 0.15s, margin-left 0.15s;
          display: inline-block; white-space: nowrap;
          font-size: 13px; font-family: 'Manrope', sans-serif; font-weight: 600;
          margin-left: 0; color: #3A5070; vertical-align: middle;
        }
        .pn-tool-btn:hover { background: #EBF2FF !important; }
        .pn-tool-btn:hover .pn-tool-label { max-width: 90px; opacity: 1; margin-left: 7px; }

        /* Scrollbar thin */
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
      `}</style>

      <DesktopOnlyModal backHref="/paynow" backLabel="Retour au case study" />

      {/* ── Barre fixe "Retour au portfolio" — masquée dans les iframes ── */}
      {!inIframe && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, height: 40, zIndex: 200,
          background: "hsla(262, 45%, 97%, 0.95)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid hsla(262, 45%, 60%, 0.18)",
          display: "flex", alignItems: "center", padding: "0 20px",
          fontFamily: FONT,
        }}>
          <Link href="/paynow" style={{
            display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, fontWeight: 600, color: PN.ink3,
            textDecoration: "none", letterSpacing: "0.01em",
          }}>
            <ArrowLeft size={12} strokeWidth={2.5} />
            Retour au portfolio
          </Link>
        </div>
      )}

      <div style={{
        position: "fixed", top: inIframe ? 0 : 40, left: 0, right: 0, bottom: 0, display: "flex",
        fontFamily: FONT, background: PN.bg, color: PN.ink,
        fontSize: 13.5, lineHeight: 1.55,
      }}>

        {/* ════ SIDEBAR ════ */}
        <aside style={{
          width: PN.sidebarW, flexShrink: 0,
          background: SB.bg,
          borderRight: `1px solid ${PN.bord}`,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Logo */}
          <div style={{ padding: "16px 18px 16px", borderBottom: `1px solid ${SB.div}` }}>
            <PayNowLogo />
          </div>

          {/* Main nav */}
          <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
            {MAIN_NAV.map(item => (
              <NavItem key={item.id} {...item} active={activePage === item.id} />
            ))}
          </nav>

          {/* Divider */}
          <div style={{ margin: "0 14px", height: 1, background: SB.div }} />

          {/* Bottom nav */}
          <div style={{ padding: "12px 10px" }}>
            {BOTTOM_NAV.map(item => (
              <NavItem key={item.id} {...item} active={false} />
            ))}
          </div>

          {/* User */}
          <div style={{
            padding: "14px 16px",
            borderTop: `1px solid ${SB.div}`,
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: PN.r.full,
              background: "#7C3AED", color: "#fff",
              fontSize: 12, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontFamily: FONT, letterSpacing: "0.03em",
            }}>GM</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: PN.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT }}>
                Gérard Menfroi
              </div>
              <div style={{ fontSize: 11.5, color: PN.ink3, fontFamily: FONT }}>SAS Trippy</div>
            </div>
            <ChevronsUpDown size={14} style={{ color: PN.ink4, flexShrink: 0 }} />
          </div>
        </aside>

        {/* ════ RIGHT PANEL ════ */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "clip" }}>

          {/* Header */}
          <header style={{
            height: PN.headerH, flexShrink: 0,
            background: "#fff", borderBottom: `1px solid ${PN.bord}`,
            display: "flex", alignItems: "center",
            padding: "0 28px", gap: 12,
          }}>
            {/* Search */}
            <div style={{
              display: "flex", alignItems: "center", gap: 9,
              background: PN.surf, border: `1px solid ${PN.bord}`,
              borderRadius: PN.r.md, padding: "7px 14px", width: 260, flexShrink: 0,
            }}>
              <Search size={14} style={{ color: PN.ink3 }} />
              <span style={{ fontSize: 13.5, color: PN.ink3, flex: 1, fontFamily: FONT }}>Rechercher...</span>
              <span style={{ fontSize: 10, color: PN.ink3, background: "#fff", border: `1px solid ${PN.bord}`, padding: "1px 6px", borderRadius: PN.r.xs, fontFamily: "monospace" }}>⌘K</span>
            </div>

            <div style={{ flex: 1 }} />

            {/* Live / Test */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13.5, fontWeight: live ? 700 : 500, color: live ? PN.ink : PN.ink3, fontFamily: FONT }}>Live</span>
              <ToggleSwitch on={live} onChange={() => setLive(l => !l)} />
              <span style={{ fontSize: 13.5, fontWeight: !live ? 700 : 500, color: !live ? PN.ink : PN.ink3, fontFamily: FONT }}>Test</span>
            </div>

            <div style={{ width: 1, height: 22, background: PN.bord }} />

            {/* État des services */}
            <button style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", color: PN.green, fontSize: 13.5, fontWeight: 700, padding: "5px 8px", borderRadius: PN.r.sm, fontFamily: FONT, whiteSpace: "nowrap" }}>
              <Zap size={15} strokeWidth={2.3} />
              État des services
            </button>

            <div style={{ width: 1, height: 22, background: PN.bord }} />

            {/* Bell */}
            <button style={{ position: "relative", border: "none", background: "none", cursor: "pointer", padding: "6px 7px", borderRadius: PN.r.sm, display: "flex" }}>
              <Bell size={18} style={{ color: PN.ink2 }} />
              <span style={{ position: "absolute", top: 5, right: 5, width: 8, height: 8, borderRadius: "50%", background: "#EF4444", border: "2px solid #fff" }} />
            </button>

            <button style={{ border: "none", background: "none", cursor: "pointer", padding: "6px 7px", borderRadius: PN.r.sm, display: "flex" }}>
              <Globe size={18} style={{ color: PN.ink2 }} />
            </button>

            <button style={{ display: "flex", alignItems: "center", gap: 4, border: "none", background: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 700, color: PN.ink2, padding: "5px 8px", borderRadius: PN.r.sm, fontFamily: FONT }}>
              FR <ChevronDown size={13} />
            </button>
          </header>

          {/* Content */}
          <main style={{ flex: 1, overflow: "auto" }}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
