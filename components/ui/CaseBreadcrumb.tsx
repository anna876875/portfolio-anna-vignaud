"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CaseBreadcrumbProps {
  label: string;
}

export function CaseBreadcrumb({ label }: CaseBreadcrumbProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05, duration: 0.5 }}
      style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--sp-5)" }}
    >
      <Link href="/" className="hig-subhead" style={{ color: "var(--color-label-3)", textDecoration: "none" }}>Accueil</Link>
      <ChevronRight size={12} style={{ color: "var(--color-label-3)" }} />
      <Link href="/#work" className="hig-subhead" style={{ color: "var(--color-label-3)", textDecoration: "none" }}>Projets</Link>
      <ChevronRight size={12} style={{ color: "var(--color-label-3)" }} />
      <span className="hig-subhead" style={{ color: "var(--color-label)", fontWeight: 600 }}>{label}</span>
    </motion.div>
  );
}
