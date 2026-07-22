import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PageTransition } from "@/components/ui/PageTransition";
import { TweaksDrawer } from "@/components/ui/TweaksDrawer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anna V. · Product Designer UX/UI",
  description: "Portfolio de Anna V., Product Designer diplômée d'un Master UX Design. Spécialisée en recherche utilisateur, design d'interface et développement frontend.",
  colorScheme: "light",
  openGraph: {
    title: "Anna V. · Product Designer UX/UI",
    description: "Portfolio de Anna V., Product Designer diplômée d'un Master UX Design. Spécialisée en recherche utilisateur, design d'interface et développement frontend.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anna V. · Product Designer UX/UI",
    description: "Portfolio de Anna V., Product Designer diplômée d'un Master UX Design.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`h-full ${inter.variable}`} style={{ colorScheme: "light", backgroundColor: "#ffffff" }}>
      <body className="min-h-full flex flex-col antialiased" style={{ backgroundColor: "#ffffff", color: "#000000", colorScheme: "light" }}><PageTransition>{children}</PageTransition><TweaksDrawer /></body>
    </html>
  );
}
