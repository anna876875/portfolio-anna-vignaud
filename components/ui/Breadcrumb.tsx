"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const INK  = "var(--color-label)";
const INK3 = "var(--color-label-3)";
const BG   = "var(--color-bg-primary)";
const BORD = "var(--color-sep-opaque)";

const CRUMBS = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/#work" },
];

export function Breadcrumb({ label }: { label: string }) {
  return (
    <div style={{ background: BG, borderBottom: `1px solid ${BORD}` }}>
      <div style={{
        maxWidth: 1160, margin: "0 auto", padding: "0 var(--sp-8)",
        height: 40, display: "flex", alignItems: "center", gap: 6,
      }}>
        {CRUMBS.map(({ label: l, href }) => (
          <span key={href} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link href={href} className="footer-link hig-footnote" style={{ textDecoration: "none" }}>
              {l}
            </Link>
            <ChevronRight size={12} style={{ color: INK3 }} />
          </span>
        ))}
        <span className="hig-footnote" style={{ color: INK, fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
}
