"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, User, Layers, Mail, ChevronDown, Check } from "lucide-react";
import { useLang } from "@/components/ui/LanguageContext";

const SP   = [0.22, 1, 0.36, 1] as const;
const INK  = "var(--color-label)";
const INK3 = "var(--color-label-3)";
const ACC  = "#A259FF";

const NAV_FR = [
  { label: "Accueil",  href: "/"         },
  { label: "À propos", href: "/#about"   },
  { label: "Projets",  href: "/#work"    },
  { label: "Contact",  href: "/#contact" },
];
const NAV_EN = [
  { label: "Home",    href: "/"         },
  { label: "About",   href: "/#about"   },
  { label: "Work",    href: "/#work"    },
  { label: "Contact", href: "/#contact" },
];
const NAV_ES = [
  { label: "Inicio",    href: "/"         },
  { label: "Sobre mí",  href: "/#about"   },
  { label: "Proyectos", href: "/#work"    },
  { label: "Contacto",  href: "/#contact" },
];
const NAV_DE = [
  { label: "Start",     href: "/"         },
  { label: "Über mich", href: "/#about"   },
  { label: "Projekte",  href: "/#work"    },
  { label: "Kontakt",   href: "/#contact" },
];

const MOB_NAV_FR = [
  { label: "Accueil",  href: "/",         Icon: Home   },
  { label: "À propos", href: "/#about",   Icon: User   },
  { label: "Projets",  href: "/#work",    Icon: Layers },
  { label: "Contact",  href: "/#contact", Icon: Mail   },
];
const MOB_NAV_EN = [
  { label: "Home",    href: "/",         Icon: Home   },
  { label: "About",   href: "/#about",   Icon: User   },
  { label: "Work",    href: "/#work",    Icon: Layers },
  { label: "Contact", href: "/#contact", Icon: Mail   },
];
const MOB_NAV_ES = [
  { label: "Inicio",    href: "/",         Icon: Home   },
  { label: "Sobre mí",  href: "/#about",   Icon: User   },
  { label: "Proyectos", href: "/#work",    Icon: Layers },
  { label: "Contacto",  href: "/#contact", Icon: Mail   },
];
const MOB_NAV_DE = [
  { label: "Start",     href: "/",         Icon: Home   },
  { label: "Über mich", href: "/#about",   Icon: User   },
  { label: "Projekte",  href: "/#work",    Icon: Layers },
  { label: "Kontakt",   href: "/#contact", Icon: Mail   },
];

function isActive(href: string, pathname: string, activeSection: string): boolean {
  if (pathname === "/") {
    if (href === "/") return activeSection === "";
    return activeSection === href;
  }
  if (href === "/#work") {
    return pathname.startsWith("/paynow")
        || pathname.startsWith("/lcb-ft")
        || pathname.startsWith("/onboarding")
        || pathname.startsWith("/amplitudes")
        || pathname.startsWith("/revision");
  }
  if (href === "/") return pathname === "/";
  return false;
}

const LANG_OPTIONS = [
  { code: "fr" as const, label: "Français" },
  { code: "en" as const, label: "English" },
  { code: "es" as const, label: "Español" },
  { code: "de" as const, label: "Deutsch" },
];

function LangToggle() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: "flex", alignItems: "center", gap: 5,
          padding: "4px 10px", borderRadius: 8,
          background: "rgba(0,0,0,0.06)",
          border: "none", cursor: "pointer",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.06em",
          color: INK, textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
        }}
      >
        {lang.toUpperCase()}
        <ChevronDown
          size={10} strokeWidth={2.5}
          style={{ transition: "transform 200ms", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute", top: "calc(100% + 6px)", right: 0,
              background: "#fff", borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              overflow: "hidden", minWidth: 130, zIndex: 200,
              listStyle: "none", margin: 0, padding: "4px 0",
            }}
          >
            {LANG_OPTIONS.map(l => (
              <li key={l.code} role="option" aria-selected={lang === l.code}>
                <button
                  onClick={() => { setLang(l.code); setOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "8px 14px",
                    background: lang === l.code ? "rgba(0,0,0,0.04)" : "transparent",
                    border: "none", cursor: "pointer",
                    fontSize: 13, fontWeight: lang === l.code ? 600 : 400,
                    color: lang === l.code ? INK : INK3,
                    textAlign: "left", fontFamily: "var(--font-sans)",
                  }}
                >
                  {l.label}
                  {lang === l.code && <Check size={12} strokeWidth={2.5} color={ACC} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PortfolioHeader() {
  const pathname    = usePathname();
  const { lang }    = useLang();
  const [scrollY, setScrollY]             = useState(0);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobile, setIsMobile]           = useState(false);

  const NAV     = lang === "en" ? NAV_EN : lang === "es" ? NAV_ES : lang === "de" ? NAV_DE : NAV_FR;
  const MOB_NAV = lang === "en" ? MOB_NAV_EN : lang === "es" ? MOB_NAV_ES : lang === "de" ? MOB_NAV_DE : MOB_NAV_FR;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const SECTIONS = [
      { id: "contact", href: "/#contact" },
      { id: "work",    href: "/#work"    },
      { id: "about",   href: "/#about"   },
    ];
    const update = () => {
      for (const { id, href } of SECTIONS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= window.innerHeight * 0.55) {
          setActiveSection(href);
          return;
        }
      }
      setActiveSection("");
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollY]);

  /* ── Header mobile ─────────────────────────────────────────── */
  if (isMobile) {
    return (
      <>
        {/* Top bar — logo centré uniquement */}
        <motion.header
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.28, ease: SP }}
          style={{
            position: "fixed", inset: "0 0 auto 0", zIndex: 100,
            background: "#ffffff",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            display: "flex", justifyContent: "center", alignItems: "center",
            height: 52,
          }}>
          <Link href="/" style={{
            fontWeight: 700, fontSize: 16, color: INK,
            letterSpacing: "-0.02em", textDecoration: "none",
          }}>
            Anna V.
          </Link>
          <div style={{ position: "absolute", right: 16 }}>
            <LangToggle />
          </div>
        </motion.header>

        {/* Bottom nav — icônes + labels */}
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "#ffffff",
          borderTop: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}>
          {MOB_NAV.map(({ label, href, Icon }) => {
            const on = isActive(href, pathname, activeSection);
            return (
              <Link key={label} href={href} style={{
                flex: 1, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 4, padding: "10px 4px 12px",
                textDecoration: "none", minHeight: 52,
                color: on ? ACC : INK3,
                transition: "color 180ms",
              }}>
                <Icon size={22} strokeWidth={on ? 2.2 : 1.6} />
                <span style={{
                  fontSize: 10, fontWeight: on ? 700 : 500,
                  lineHeight: 1, letterSpacing: "0.01em",
                  fontFamily: "var(--font-sans)",
                }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </>
    );
  }

  /* ── Header desktop (inchangé) ─────────────────────────────── */
  return (
    <>
      <motion.header
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.28, ease: SP }}
        className="pf-header-bg"
        style={{
          position: "fixed", inset: "0 0 auto 0", zIndex: 100, height: 60,
          display: "flex", alignItems: "center",
        }}>
        <div style={{
          maxWidth: 1160, width: "100%", margin: "0 auto", padding: "0 var(--sp-8)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" className="hig-subhead"
            style={{ fontWeight: 600, color: INK, letterSpacing: "var(--ls-title2)", textDecoration: "none" }}>
            Anna V.
          </Link>

          <nav className="pf-header-nav" style={{ display: "flex", gap: 28 }}>
            {NAV.map(({ label, href }) => (
              <Link key={label} href={href}
                className={`pf-header-nav-btn${isActive(href, pathname, activeSection) ? " active" : ""}`}
                style={{ textDecoration: "none" }}>
                {label}
              </Link>
            ))}
          </nav>

          <div className="pf-header-right" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LangToggle />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="pf-header-status-dot" />
              <span className="hig-caption2" style={{ color: INK3 }}>
                {lang === "de" ? "Verfügbar" : lang === "fr" ? "Disponible" : lang === "es" ? "Disponible" : "Available"}
              </span>
            </div>
          </div>

          <button className="pf-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="pf-mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: SP }}>
            {NAV.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={`pf-mobile-nav-item${isActive(href, pathname, activeSection) ? " active" : ""}`}
                style={{ textDecoration: "none" }}
                onClick={() => setMenuOpen(false)}>
                {label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>

      <nav className="pf-bottom-nav" aria-label="Navigation principale">
        {MOB_NAV.map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className={`pf-bottom-nav-item${isActive(href, pathname, activeSection) ? " active" : ""}`}>
            <Icon size={22} strokeWidth={1.6} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
