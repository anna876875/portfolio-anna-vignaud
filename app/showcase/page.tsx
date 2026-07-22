import {
  Code2, Palette, Smartphone, Globe, Layers,
  Cpu, Sparkles, Zap, Shield, Star,
  GitBranch, Mail, ArrowRight, PenTool,
  BarChart3, Lock, Cloud,
} from "lucide-react";

import {
  Button, Card, GlassCard, Input,
  ListItem, NavBar, Badge, Icon,
  ProjectCard, FeatureCard,
} from "@/components/ui";
import { ShowcaseInteractive } from "@/components/ui/ShowcaseInteractive";

export default function DesignSystemShowcase() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">

      <NavBar
        title="Design System"
        largeTitle
        rightAction={
          <Button variant="plain" size="small">v1.1</Button>
        }
      />

      <main className="max-w-[var(--layout-xl)] mx-auto px-[var(--sp-4)] py-[var(--sp-8)] space-y-[var(--sp-16)]">

        {/* ════════════════════════════════════════════════
            SECTION : ICONS — SF Symbols style
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Icons · SF Symbols"
            subtitle="9 tailles · couleurs sémantiques · conteneur rounded square"
          />
          <Card variant="elevated" padding="lg">
            {/* Tailles */}
            <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-4)]">Tailles (xs → 3xl)</p>
            <div className="flex items-end gap-[var(--sp-5)] flex-wrap mb-[var(--sp-6)]">
              {(["xs","sm","md","lg","xl","2xl","3xl"] as const).map((s) => (
                <div key={s} className="flex flex-col items-center gap-[var(--sp-2)]">
                  <Icon icon={Star} size={s} color="accent" />
                  <span className="hig-caption2 text-[var(--color-label-3)]">{s}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-sep)] mb-[var(--sp-6)]" />

            {/* Couleurs sémantiques */}
            <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-4)]">Couleurs sémantiques</p>
            <div className="flex flex-wrap gap-[var(--sp-4)] mb-[var(--sp-6)]">
              {([
                { icon: Star,     color: "accent"   as const, label: "accent"   },
                { icon: Shield,   color: "success"  as const, label: "success"  },
                { icon: Zap,      color: "warning"  as const, label: "warning"  },
                { icon: Lock,     color: "danger"   as const, label: "danger"   },
                { icon: Cloud,    color: "secondary"as const, label: "secondary"},
                { icon: Sparkles, color: "tertiary" as const, label: "tertiary" },
              ]).map(({ icon, color, label }) => (
                <div key={label} className="flex flex-col items-center gap-[var(--sp-1)]">
                  <Icon icon={icon} size="lg" color={color} />
                  <span className="hig-caption2 text-[var(--color-label-3)]">{label}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-sep)] mb-[var(--sp-6)]" />

            {/* Icon containers */}
            <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-4)]">
              Icon containers — rounded square (style iOS Settings)
            </p>
            <div className="flex flex-wrap gap-[var(--sp-4)]">
              {([
                { icon: Code2,    color: "blue"   as const },
                { icon: Palette,  color: "purple" as const },
                { icon: Smartphone,color:"green"  as const },
                { icon: Globe,    color: "teal"   as const },
                { icon: Layers,   color: "orange" as const },
                { icon: Cpu,      color: "red"    as const },
                { icon: PenTool,  color: "pink"   as const },
                { icon: BarChart3,color: "indigo" as const },
                { icon: GitBranch,color: "neutral"as const },
              ]).map(({ icon, color }) => (
                <Icon
                  key={color}
                  icon={icon}
                  size="lg"
                  wrap
                  wrapSize="lg"
                  wrapColor={color}
                  aria-label={color}
                />
              ))}
            </div>
          </Card>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : BADGES
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Badges & Tags"
            subtitle="Catégories, technologies, statuts"
          />
          <Card variant="elevated" padding="lg">
            <div className="space-y-[var(--sp-5)]">
              {/* Toutes les couleurs, taille md */}
              <div>
                <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-3)]">
                  Couleurs · taille md
                </p>
                <div className="flex flex-wrap gap-[var(--sp-2)]">
                  <Badge color="neutral">Neutral</Badge>
                  <Badge color="blue">Blue</Badge>
                  <Badge color="green">Green</Badge>
                  <Badge color="red">Red</Badge>
                  <Badge color="orange">Orange</Badge>
                  <Badge color="purple">Purple</Badge>
                  <Badge color="teal">Teal</Badge>
                  <Badge color="pink">Pink</Badge>
                  <Badge color="indigo">Indigo</Badge>
                </div>
              </div>

              <div className="border-t border-[var(--color-sep)]" />

              {/* Contexte réel : stack technique */}
              <div>
                <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-3)]">
                  Cas d&apos;usage : stack technique
                </p>
                <div className="flex flex-wrap gap-[var(--sp-2)]">
                  <Badge color="blue">Next.js</Badge>
                  <Badge color="teal">React</Badge>
                  <Badge color="blue">TypeScript</Badge>
                  <Badge color="purple">Tailwind</Badge>
                  <Badge color="orange">Figma</Badge>
                  <Badge color="neutral">Node.js</Badge>
                  <Badge color="green">Vercel</Badge>
                  <Badge color="indigo">GraphQL</Badge>
                </div>
              </div>

              <div className="border-t border-[var(--color-sep)]" />

              {/* Statuts */}
              <div>
                <p className="hig-caption1 text-[var(--color-label-3)] mb-[var(--sp-3)]">
                  Statuts
                </p>
                <div className="flex flex-wrap gap-[var(--sp-2)]">
                  <Badge color="green" size="sm">● Livré</Badge>
                  <Badge color="orange" size="sm">● En cours</Badge>
                  <Badge color="neutral" size="sm">● Draft</Badge>
                  <Badge color="red" size="sm">● Archivé</Badge>
                </div>
              </div>
            </div>
          </Card>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : GLASS CARDS
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Glass Cards · Materials & Vibrancy"
            subtitle="Le verre n'existe que sur fond coloré · backdrop-filter blur(24px) saturate(200%)"
          />

          {/* Hero vivid : fond très saturé pour révéler le blur */}
          <div className="mesh-demo-vivid relative rounded-[var(--r-2xl)] overflow-hidden p-[var(--sp-8)] mb-[var(--sp-5)]">
            {/* Blobs lumineux pour complexifier le fond */}
            <div
              className="pointer-events-none absolute top-[-80px] left-[-80px] w-[320px] h-[320px] rounded-full opacity-50"
              style={{ background: "radial-gradient(circle, #FFD60A, transparent 70%)" }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, #30D158, transparent 70%)" }}
              aria-hidden="true"
            />

            <p className="hig-caption1 text-white/60 mb-[var(--sp-6)] relative z-10">
              Fond multi-couleurs saturé : le blur des cartes est maintenant parfaitement lisible
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--sp-4)] relative z-10">
              <GlassCard padding="md" radius="xl">
                <div className="flex items-start gap-[var(--sp-3)]">
                  <Icon icon={Code2} size="xl" color="blue" />
                  <div>
                    <p className="hig-headline text-white">Développement</p>
                    <p className="hig-callout text-white/70 mt-[var(--sp-1)]">
                      Next.js · TypeScript · Tailwind
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard padding="md" radius="xl">
                <div className="flex items-start gap-[var(--sp-3)]">
                  <Icon icon={Palette} size="xl" color="orange" />
                  <div>
                    <p className="hig-headline text-white">Design</p>
                    <p className="hig-callout text-white/70 mt-[var(--sp-1)]">
                      Figma · Apple HIG · Motion
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard padding="md" radius="xl">
                <div className="flex items-start gap-[var(--sp-3)]">
                  <Icon icon={Smartphone} size="xl" color="green" />
                  <div>
                    <p className="hig-headline text-white">Mobile</p>
                    <p className="hig-callout text-white/70 mt-[var(--sp-1)]">
                      React Native · iOS · Android
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard padding="md" radius="xl">
                <div className="flex items-start gap-[var(--sp-3)]">
                  <Icon icon={Layers} size="xl" color="indigo" />
                  <div>
                    <p className="hig-headline text-white">Système</p>
                    <p className="hig-callout text-white/70 mt-[var(--sp-1)]">
                      Design Systems · Tokens · Docs
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Cards individuelles sur mesh gradient (standard) */}
          <div className="grid grid-cols-1 gap-[var(--sp-4)] sm:grid-cols-2">
            <GlassCard mesh="blue-purple" withMeshWrapper padding="md" radius="xl">
              <div className="flex items-center gap-[var(--sp-3)]">
                <Icon icon={Zap} size="lg" color="blue" />
                <div>
                  <p className="hig-subhead font-semibold text-[var(--color-label)]">Performance</p>
                  <p className="hig-footnote text-[var(--color-label-2)]">Core Web Vitals · Lighthouse 100</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard mesh="orange-pink" withMeshWrapper padding="md" radius="xl">
              <div className="flex items-center gap-[var(--sp-3)]">
                <Icon icon={Shield} size="lg" color="orange" />
                <div>
                  <p className="hig-subhead font-semibold text-[var(--color-label)]">Accessibilité</p>
                  <p className="hig-footnote text-[var(--color-label-2)]">WCAG AA · ARIA · Keyboard nav</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : PROJECT CARDS
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Project Cards"
            subtitle="Cover gradient · catégorie · tags · hover lift"
          />
          <div className="grid grid-cols-1 gap-[var(--sp-5)] sm:grid-cols-2 lg:grid-cols-3">
            <ProjectCard
              title="Portfolio Personnel"
              description="Design system inspiré d'Apple HIG, construit avec Next.js 16 et Tailwind CSS v4."
              category="Design System"
              coverEmoji="✦"
              gradient="blue-purple"
              tags={[
                { label: "Next.js",    color: "blue"   },
                { label: "TypeScript", color: "blue"   },
                { label: "Tailwind",   color: "purple" },
              ]}
              href="#"
            />
            <ProjectCard
              title="App Mobile iOS"
              description="Application native-feel avec React Native, animations Reanimated et gestures fluides."
              category="Mobile"
              coverEmoji="📱"
              gradient="green-teal"
              tags={[
                { label: "React Native", color: "teal"  },
                { label: "Expo",         color: "green" },
                { label: "TypeScript",   color: "blue"  },
              ]}
              href="#"
            />
            <ProjectCard
              title="Dashboard Analytics"
              description="Interface de visualisation de données avec graphiques interactifs et filtres en temps réel."
              category="Web App"
              coverEmoji="📊"
              gradient="orange-pink"
              tags={[
                { label: "React",      color: "teal"   },
                { label: "D3.js",      color: "orange" },
                { label: "GraphQL",    color: "indigo" },
              ]}
              href="#"
            />
          </div>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : FEATURE CARDS
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader
            title="Feature Cards"
            subtitle="Grille verticale · liste horizontale · variant glass"
          />

          {/* Layout vertical (grille) */}
          <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-4)]">
            Layout vertical · grille
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--sp-4)] mb-[var(--sp-8)]">
            <FeatureCard
              icon={Code2}
              title="Clean Code"
              description="Architecture modulaire, composants réutilisables, zéro dette technique."
              iconColor="blue"
            />
            <FeatureCard
              icon={Palette}
              title="Design System"
              description="Tokens cohérents, composants atomiques, documentation vivante."
              iconColor="purple"
            />
            <FeatureCard
              icon={Zap}
              title="Performance"
              description="Core Web Vitals optimisés, lazy loading, prefetch intelligent."
              iconColor="orange"
            />
          </div>

          {/* Layout horizontal (liste) */}
          <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-4)]">
            Layout horizontal · liste
          </p>
          <div className="space-y-[var(--sp-3)]">
            <FeatureCard
              icon={Shield}
              title="Accessibilité WCAG AA"
              description="Contrastes conformes, navigation clavier, ARIA labels, screen readers."
              iconColor="green"
              layout="horizontal"
            />
            <FeatureCard
              icon={Sparkles}
              title="Apple HIG"
              description="Human Interface Guidelines respectées · typography, spacing, touch targets."
              iconColor="teal"
              layout="horizontal"
            />
            <FeatureCard
              icon={Globe}
              title="Internationalisation"
              description="Support RTL, formats locaux, traductions next-intl."
              iconColor="indigo"
              layout="horizontal"
            />
          </div>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : BUTTONS
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader title="Buttons" subtitle="4 variants · 3 tailles · états" />
          <Card variant="elevated" padding="lg">
            <div className="space-y-[var(--sp-6)]">
              <div>
                <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-3)]">Variantes</p>
                <div className="flex flex-wrap gap-[var(--sp-3)]">
                  <Button variant="filled">Filled</Button>
                  <Button variant="tinted">Tinted</Button>
                  <Button variant="gray">Gray</Button>
                  <Button variant="plain">Plain</Button>
                </div>
              </div>
              <div className="border-t border-[var(--color-sep)]" />
              <div>
                <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-3)]">Tailles</p>
                <div className="flex flex-wrap items-center gap-[var(--sp-3)]">
                  <Button variant="filled" size="large">Large · 50px</Button>
                  <Button variant="filled" size="regular">Regular · 44px</Button>
                  <Button variant="filled" size="small">Small · 30px</Button>
                </div>
              </div>
              <div className="border-t border-[var(--color-sep)]" />
              <div>
                <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-3)]">Avec icônes</p>
                <div className="flex flex-wrap items-center gap-[var(--sp-3)]">
                  <Button variant="filled" icon={<GitBranch size={16} strokeWidth={1.5}/>}>
                    GitHub
                  </Button>
                  <Button variant="tinted" icon={<Mail size={16} strokeWidth={1.5}/>}>
                    Contact
                  </Button>
                  <Button variant="gray" icon={<ArrowRight size={16} strokeWidth={1.5}/>}>
                    Voir plus
                  </Button>
                </div>
              </div>
              <div className="border-t border-[var(--color-sep)]" />
              <div>
                <p className="hig-subhead text-[var(--color-label-3)] mb-[var(--sp-3)]">États</p>
                <div className="flex flex-wrap items-center gap-[var(--sp-3)]">
                  <Button variant="filled">Default</Button>
                  <Button variant="filled" loading>Loading</Button>
                  <Button variant="filled" disabled>Disabled</Button>
                </div>
              </div>
              <div className="border-t border-[var(--color-sep)]" />
              <Button variant="filled" size="large" fullWidth>
                Voir mes projets →
              </Button>
            </div>
          </Card>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : INPUTS
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader title="Inputs & Search Fields" subtitle="label · hint · error · search" />
          <Card variant="elevated" padding="lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--sp-5)]">
              <Input label="Nom complet" placeholder="Anna Dupont"
                hint="Tel qu'il apparaîtra sur ton profil" />
              <Input label="Adresse email" type="email" placeholder="anna@exemple.com"
                error="Cette adresse est déjà utilisée" />
              <Input isSearch placeholder="Rechercher un projet…" />
              <Input label="Message" placeholder="Ton projet…" disabled
                hint="Désactivé pour cette démo" />
            </div>
          </Card>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : TYPOGRAPHIE
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader title="Typographie · Apple HIG Scale" subtitle="SF Pro · 12 text styles · tracking négatif" />
          <Card variant="elevated" padding="lg">
            <div className="space-y-[var(--sp-5)]">
              {[
                { cls: "hig-display",    label: "Display",    spec: "64px · Bold · -0.05em",    text: "Portfolio" },
                { cls: "hig-largetitle", label: "Large Title",spec: "34px · Bold · -0.03em",    text: "Bonjour, je suis Anna." },
                { cls: "hig-title1",     label: "Title 1",   spec: "28px · Bold · -0.02em",    text: "Mes Projets" },
                { cls: "hig-title2",     label: "Title 2",   spec: "22px · Bold · -0.02em",    text: "Design & Développement" },
                { cls: "hig-headline",   label: "Headline",  spec: "17px · Semibold",           text: "Design System fondé sur Apple HIG" },
                { cls: "hig-body",       label: "Body",      spec: "17px · Regular · lh 1.47", text: "Je crée des interfaces qui équilibrent esthétique et performance." },
                { cls: "hig-caption1",   label: "Caption 1", spec: "12px · Regular",            text: "Mis à jour hier · 3 min de lecture" },
                { cls: "hig-caption2",   label: "Caption 2", spec: "11px · Regular · +0.01em",  text: "ACCUEIL  ·  PROJETS  ·  CONTACT" },
              ].map(({ cls, label, spec, text }) => (
                <div key={label}>
                  <p className="hig-caption1 text-[var(--color-label-3)] mb-[2px]">
                    {label} · {spec}
                  </p>
                  <p className={`${cls} text-[var(--color-label)]`}>{text}</p>
                </div>
              ))}
            </div>
          </Card>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : COULEURS
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader title="Palette Système" subtitle="Light & Dark adaptatifs · WCAG AA" />
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-[var(--sp-3)]">
            {[
              { name: "Blue",   v: "var(--color-blue)"   },
              { name: "Green",  v: "var(--color-green)"  },
              { name: "Red",    v: "var(--color-red)"    },
              { name: "Orange", v: "var(--color-orange)" },
              { name: "Purple", v: "var(--color-purple)" },
              { name: "Pink",   v: "var(--color-pink)"   },
              { name: "Teal",   v: "var(--color-teal)"   },
              { name: "Indigo", v: "var(--color-indigo)" },
              { name: "Mint",   v: "var(--color-mint)"   },
              { name: "Brown",  v: "var(--color-brown)"  },
            ].map((c) => (
              <div key={c.name} className="overflow-hidden rounded-[var(--r-lg)]">
                <div className="h-12" style={{ backgroundColor: c.v }} />
                <div className="bg-[var(--color-bg-primary)] px-[var(--sp-2)] py-[var(--sp-1)]">
                  <p className="hig-caption1 font-semibold text-[var(--color-label)]">{c.name}</p>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ════════════════════════════════════════════════
            SECTION : ANIMATIONS
            ════════════════════════════════════════════════ */}
        <section>
          <SectionHeader title="Animations & Keyframes" subtitle="fade-up · scale-in · shimmer skeleton" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--sp-4)]">
            <Card variant="elevated" padding="md" className="animate-fade-up">
              <p className="hig-headline text-[var(--color-label)]">Fade Up</p>
              <p className="hig-subhead text-[var(--color-label-2)] mt-1">Entrée depuis le bas</p>
            </Card>
            <Card variant="elevated" padding="md" className="animate-scale-in" style={{ animationDelay: "100ms" }}>
              <p className="hig-headline text-[var(--color-label)]">Scale In</p>
              <p className="hig-subhead text-[var(--color-label-2)] mt-1">Apparition depuis le centre</p>
            </Card>
            <div className="rounded-[var(--r-xl)] p-[var(--sp-4)] bg-[var(--color-bg-primary)] shadow-[var(--shadow-card)] space-y-[var(--sp-3)]">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-1/2" />
              <p className="hig-caption1 text-[var(--color-label-3)] mt-2">Skeleton shimmer</p>
            </div>
          </div>
        </section>


        {/* ════════════════════════════════════════════════
            SECTIONS INTERACTIVES (Segmented, Toggle, Progress, Toast)
            Wrapped dans ShowcaseInteractive ("use client")
            ════════════════════════════════════════════════ */}
        <ShowcaseInteractive />


        <footer className="text-center py-[var(--sp-8)] border-t border-[var(--color-sep)]">
          <p className="hig-footnote text-[var(--color-label-3)]">
            Design System · Apple HIG Inspired · v1.2
          </p>
          <p className="hig-caption2 text-[var(--color-label-4)] mt-1">
            SF Pro · Lucide React · Next.js 16 · Tailwind CSS v4
          </p>
        </footer>

      </main>
    </div>
  );
}

/* ── Section Header helper ── */
function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-[var(--sp-5)]">
      <h2 className="hig-title2 text-[var(--color-label)]">{title}</h2>
      {subtitle && (
        <p className="hig-subhead text-[var(--color-label-3)] mt-[var(--sp-1)]">{subtitle}</p>
      )}
    </div>
  );
}
