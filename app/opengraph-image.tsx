import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Anna V. · Product Designer UX/UI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#ffffff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 100px",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Grille décorative */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Contenu */}
        <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
          {/* Eyebrow */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#A259FF",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              marginBottom: 40,
            }}
          >
            Portfolio · 2025
          </div>

          {/* Nom */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 200,
              color: "#000000",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              marginBottom: 20,
            }}
          >
            Anna V.
          </div>

          {/* Titre */}
          <div
            style={{
              fontSize: 36,
              fontWeight: 300,
              color: "#A259FF",
              letterSpacing: "-0.01em",
              marginBottom: 40,
            }}
          >
            Product Designer UX/UI
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "rgba(60,60,67,0.65)",
              lineHeight: 1.6,
              maxWidth: 580,
            }}
          >
            Recherche utilisateur · Design d'interface · Développement frontend
          </div>

          {/* Tags projets */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 48,
            }}
          >
            {["PayNow", "LCB-FT Prism", "Onboarding", "App Révision"].map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#A259FF",
                  padding: "6px 16px",
                  borderRadius: 100,
                  border: "1px solid rgba(162,89,255,0.25)",
                  background: "rgba(162,89,255,0.05)",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>

        {/* Accent décoratif bas-droite */}
        <div
          style={{
            position: "absolute",
            right: 100,
            bottom: 80,
            fontSize: 13,
            fontWeight: 500,
            color: "rgba(60,60,67,0.35)",
            letterSpacing: "0.06em",
          }}
        >
          anna-v.design
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
