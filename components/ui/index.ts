/* ================================================================
   Design System — Components barrel export
   Import: import { Button, Card, GlassCard, Icon, ... } from "@/components/ui"
   ================================================================ */

/* ── Fondations ── */
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { Input } from "./Input";
export type { InputProps } from "./Input";

/* ── Conteneurs ── */
export { Card, ListItem } from "./Card";
export type { CardProps, CardVariant, CardPadding, ListItemProps } from "./Card";

export { GlassCard } from "./GlassCard";
export type { GlassCardProps, GlassMesh, GlassRadius, GlassPadding } from "./GlassCard";

/* ── Cartes riches ── */
export { ProjectCard } from "./ProjectCard";
export type { ProjectCardProps, ProjectCoverGradient, ProjectTag } from "./ProjectCard";

export { FeatureCard } from "./FeatureCard";
export type { FeatureCardProps } from "./FeatureCard";

/* ── Atoms ── */
export { Badge } from "./Badge";
export type { BadgeProps, BadgeColor, BadgeSize } from "./Badge";

export { Icon } from "./Icon";
export type { IconProps, IconSize, IconColor, IconWrapColor, IconWrapSize } from "./Icon";

/* ── Contrôles interactifs ── */
export { SegmentedControl } from "./SegmentedControl";
export type { SegmentedControlProps, Segment } from "./SegmentedControl";

export { Toggle } from "./Toggle";
export type { ToggleProps, ToggleColor } from "./Toggle";

export { Progress, SkillBar } from "./Progress";
export type { ProgressProps, SkillBarProps, ProgressColor, ProgressSize } from "./Progress";

export { Toast, useToast } from "./Toast";
export type { ToastProps, ToastVariant, ToastConfig } from "./Toast";

/* ── Scroll & Animation ── */
export { Reveal } from "./Reveal";
export type { RevealProps, RevealDirection } from "./Reveal";

export { TimelineProgress } from "./TimelineProgress";
export type { TimelineProgressProps } from "./TimelineProgress";

/* ── Navigation ── */
export { NavBar, BackButton } from "./NavBar";
export type { NavBarProps, BackButtonProps } from "./NavBar";

export { TabBar } from "./TabBar";
export type { TabBarProps, TabItem } from "./TabBar";

/* ── Case Study ── */
export { CaseBreadcrumb } from "./CaseBreadcrumb";
export { CaseContactFooter } from "./CaseContactFooter";
export { DesktopOnlyModal } from "./DesktopOnlyModal";
export { ProcessFrise } from "./ProcessFrise";
export type { FrisePhase } from "./ProcessFrise";
