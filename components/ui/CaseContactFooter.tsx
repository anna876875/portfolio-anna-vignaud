"use client";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import _C from "@/data/content.json";

const HOME = _C.home;
const INK  = "var(--color-label)";
const INK2 = "var(--color-label-2)";
const INK3 = "var(--color-label-3)";
const SURF = "var(--color-bg-secondary)";
const BORD = "var(--color-sep-opaque)";

interface CaseContactFooterProps {
  footerLeft?: string;
  footerRight?: string;
}

export function CaseContactFooter({ footerLeft, footerRight }: CaseContactFooterProps) {
  const ct = HOME.contact;
  const ft = HOME.footer;

  const links = [
    { href: `mailto:${ct.email}`, label: ct.email, dim: false },
    { href: "https://www.linkedin.com/in/anna-vignaud-559367208", label: ct.linkedinLabel, dim: true },
    { href: "#", label: ct.cvLabel, dim: true },
  ];

  return (
    <>
      {/* ── Contact section ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0F0F0F" }} aria-labelledby="case-contact-title">
        <div className="pf2-section-pad" style={{ maxWidth: 1160, margin: "0 auto" }}>
          <Reveal>
            <p className="hig-caption2" style={{
              color: "rgba(255,255,255,0.35)", fontWeight: 600, letterSpacing: "0.12em",
              textTransform: "uppercase", marginBottom: 24,
            }}>
              Contact
            </p>
            <h2 id="case-contact-title" style={{
              fontSize: "clamp(40px,7vw,96px)", fontWeight: 200,
              letterSpacing: "var(--ls-display)", color: "#FAFAFA",
              marginBottom: 48, lineHeight: 1.0,
            }}>
              {ct.titleLine1}<br />{ct.titleLine2}
            </h2>
            <p className="hig-body" style={{
              color: "rgba(255,255,255,0.65)", maxWidth: 400, marginBottom: 48,
            }}>
              {ct.body}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {links.map((link) => (
                <a key={link.label} href={link.href} className="pf2-contact-link"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    fontSize: "clamp(18px,2.8vw,36px)", fontWeight: 300,
                    color: link.dim ? "rgba(255,255,255,0.55)" : "#FAFAFA",
                    letterSpacing: "-0.025em",
                  }}>
                  {link.label}
                  <ArrowUpRight size={22} strokeWidth={1.2} />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer bar ──────────────────────────────────────────────── */}
      <footer style={{
        backgroundColor: SURF, borderTop: `1px solid ${BORD}`, padding: "36px 32px",
      }}>
        <div style={{
          maxWidth: 1160, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16,
        }}>
          <p style={{ fontSize: 13, color: INK3, margin: 0 }}>
            {footerLeft ?? ft.left}
          </p>
          <Link href="/" style={{
            fontSize: 13, color: INK2, textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <ArrowLeft size={13} strokeWidth={1.5} /> Retour au portfolio
          </Link>
          {footerRight && (
            <p style={{ fontSize: 13, color: INK3, margin: 0 }}>{footerRight}</p>
          )}
        </div>
      </footer>
    </>
  );
}
