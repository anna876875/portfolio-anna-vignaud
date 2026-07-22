"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SP   = [0.22, 1, 0.36, 1] as const;
const MONO = "var(--font-mono)";
const VIO  = "#A259FF";

export type FrisePhase = { id: string; label: string; livrable: string };

interface ProcessFriseProps {
  phases: FrisePhase[];
  accent?: string;
  dotColor?: string;
  renderPanel: (id: string) => React.ReactNode;
}

export function ProcessFrise({
  phases,
  accent = VIO,
  dotColor,
  renderPanel,
}: ProcessFriseProps) {
  const [active, setActive] = useState(phases[0].id);
  const cur = phases.find(p => p.id === active)!;
  const dot = dotColor ?? accent;

  return (
    <div>
      {/* Stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: "var(--sp-6)" }}>
        {phases.map((p, i) => {
          const on = active === p.id;
          return (
            <div key={p.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <motion.button
                onClick={() => setActive(p.id)}
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.18, ease: SP }}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  flex: 1, background: "none", border: "none", cursor: "pointer", padding: "4px 0",
                }}>
                <motion.div
                  animate={{ boxShadow: on ? `0 4px 20px ${accent}40` : "var(--shadow-sm)" }}
                  transition={{ duration: 0.25 }}
                  style={{
                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                    background: on ? accent : "var(--color-bg-primary)",
                    border: `2px solid ${on ? accent : "var(--color-sep-opaque)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
                  }}>
                  {on && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      style={{
                        position: "absolute", inset: -6, borderRadius: "50%",
                        border: `1.5px solid ${accent}`, opacity: 0.25,
                      }} />
                  )}
                  <span className="hig-caption1" style={{
                    fontWeight: 800, fontFamily: MONO,
                    color: on ? "#fff" : "var(--color-label-3)", letterSpacing: "0.04em",
                  }}>
                    {p.id}
                  </span>
                </motion.div>
                {/* hig-footnote (13px) pour une meilleure lisibilité vs hig-caption1 (12px) */}
                <span className="hig-footnote" style={{
                  fontWeight: on ? 700 : 500,
                  color: on ? accent : "var(--color-label-2)",
                  transition: "color 200ms",
                }}>
                  {p.label}
                </span>
              </motion.button>
              {i < phases.length - 1 && (
                <div style={{
                  height: 1, width: 32, flexShrink: 0, marginBottom: 28,
                  background: "var(--color-sep-opaque)",
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Panel */}
      <AnimatePresence mode="wait">
        <motion.div key={active}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: SP }}>
          <div className="mat-regular" style={{
            borderRadius: "var(--r-xl) var(--r-xl) 0 0",
            border: "1px solid rgba(255,255,255,0.45)", borderBottom: "none",
            padding: "14px var(--sp-6)", display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: dot, flexShrink: 0 }} />
            <span className="hig-callout" style={{ fontWeight: 500, color: "var(--color-label)" }}>
              {cur.label}
            </span>
            <span className="hig-footnote" style={{ color: "var(--color-label-3)", marginLeft: 4 }}>
              {cur.livrable}
            </span>
          </div>
          <div className="mat-regular" style={{
            border: "1px solid rgba(255,255,255,0.45)", borderTop: "none",
            borderRadius: "0 0 var(--r-xl) var(--r-xl)", padding: "var(--sp-6)",
          }}>
            {renderPanel(active)}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
