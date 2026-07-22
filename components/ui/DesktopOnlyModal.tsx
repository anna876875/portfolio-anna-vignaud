"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DesktopOnlyModalProps {
  backHref: string;
  backLabel?: string;
}

export function DesktopOnlyModal({
  backHref,
  backLabel = "Retour au case study",
}: DesktopOnlyModalProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="desktop-only-modal">
      <div className="desktop-only-modal__card">
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "var(--color-bg-secondary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 4,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-label-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </svg>
        </div>

        <h2 className="hig-title3" style={{ color: "var(--color-label)", margin: 0 }}>
          Expérience desktop
        </h2>

        <p className="hig-subhead" style={{
          color: "var(--color-label-3)", margin: 0,
          maxWidth: 280, lineHeight: 1.6, textAlign: "center",
        }}>
          Ce prototype est conçu pour les écrans larges. Ouvre-le sur un ordinateur pour l&apos;explorer pleinement.
        </p>

        <Link href={backHref} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "11px 20px", borderRadius: "var(--r-full)",
          background: "var(--color-label)", color: "var(--color-bg-primary)",
          fontSize: 14, fontWeight: 600, textDecoration: "none",
          letterSpacing: "-0.01em",
        }}>
          <ArrowLeft size={14} strokeWidth={2.5} />
          {backLabel}
        </Link>

        <button
          onClick={() => setDismissed(true)}
          className="hig-footnote"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-label-3)", padding: "4px 8px",
          }}
        >
          Voir quand même
        </button>
      </div>
    </div>
  );
}
