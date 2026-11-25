"use client";
import dynamic from "next/dynamic";

export const ProjectGalleryDynamic = dynamic(
  () => import("./ProjectGallery3D").then(m => ({ default: m.ProjectGallery3D })),
  { ssr: false, loading: () => (
    <div style={{ width: "100%", height: 480, background: "#f7f8fa", borderRadius: 20,
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontSize: 13, color: "#9ca3af", fontFamily: "system-ui" }}>
        Chargement de la galerie…
      </p>
    </div>
  )},
);
