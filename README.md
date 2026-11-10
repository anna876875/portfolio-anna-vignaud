# Portfolio — Anna Vignaud · Product Designer UX/UI

Prototype public de mon portfolio, construit avec **Next.js 16**, **TypeScript** et **Tailwind CSS v4**.  
Il inclut un design system personnel inspiré des Apple Human Interface Guidelines, et trois case studies interactifs fictifs illustrant mes compétences en UX/Product Design.

## Projets

| Case study | Domaine | Description |
|---|---|---|
| **PayNow** | Paiement B2B | Prototype de refonte d'un back-office marchand (PSP fictif) |
| **Sentinelle** | RegTech / LCB-FT | Prototype d'un logiciel de conformité AML (workflow alertes, scoring risque) |
| **Onboarding marchands** | Fintech | Prototype d'un parcours d'activation self-service en < 15 min |

> Toutes les données, entités, noms de marchands et transactions présents dans ces prototypes sont **entièrement fictifs**.

## Stack technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Style** : Tailwind CSS v4 + tokens CSS custom (Apple HIG)
- **Animations** : Framer Motion
- **Icônes** : Lucide React

## Lancer le projet

```bash
cd mon-portfolio
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Design System

Le design system est documenté dans `/app/showcase` et couvre :
- Tokens CSS (couleurs, typographie, espacement, radius)
- Composants : Button, Input, Card, GlassCard, Badge, NavBar, TabBar, Toggle, Toast…
- Glass morphism, mesh gradients, animations spring

---

© 2026 Anna Vignaud · [vignaudanna87520@gmail.com](mailto:vignaudanna87520@gmail.com)
