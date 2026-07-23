"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home, User, Layers, Mail } from "lucide-react";

const SP   = [0.22, 1, 0.36, 1] as const;
const INK  = "var(--color-label)";
const INK3 = "var(--color-label-3)";
const ACC  = "#A259FF";

const NAV = [
  { label: "Accueil",  href: "/"         },
  { label: "À propos", href: "/#about"   },
  { label: "Projets",  href: "/#work"    },
  { label: "Contact",  href: "/#contact" },
];

const MOB_NAV = [
  { label: "Accueil",  href: "/",         Icon: Home   },
  { label: "À propos", href: "/#about",   Icon: User   },
  { label: "Projets",  href: "/#work",    Icon: Layers },
  { label: "Contact",  href: "/#contact", Icon: Mail   },
];

const BOTTOM_NAV = MOB_NAV;

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

export function PortfolioHeader() {
  const pathname    = usePathname();
  const [scrollY, setScrollY]             = useState(0);
  const [menuOpen, setMenuOpen]           = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobile, setIsMobile]           = useState(false);

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
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
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
        </motion.header>

        {/* Bottom nav — icônes + labels */}
        <nav style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(24px) saturate(200%)",
          WebkitBackdropFilter: "blur(24px) saturate(200%)",
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

          <div className="pf-header-right" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="pf-header-status-dot" />
            <span className="hig-caption2" style={{ color: INK3 }}>Disponible</span>
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
        {BOTTOM_NAV.map(({ label, href, Icon }) => (
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
