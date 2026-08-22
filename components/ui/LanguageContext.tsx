"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "en";

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "fr",
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === "undefined") return "fr";
    const saved = localStorage.getItem("pf-lang") as Lang | null;
    return saved === "en" ? "en" : "fr";
  });

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("pf-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
