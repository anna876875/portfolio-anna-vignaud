"use client";

import { useState, useEffect, useCallback, useId } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   TOAST / NOTIFICATION BANNER — Style iOS Live Notification

   RÔLE UX : Informer l'utilisateur d'un événement système sans
   l'interrompre dans son workflow. Le toast s'affiche en haut,
   reste quelques secondes, puis disparaît automatiquement.

   DIFFÉRENCE AVEC UNE ALERTE :
   - Alerte = bloque l'interface, demande une action
   - Toast  = non-bloquant, informatif, éphémère

   QUAND UTILISER (Apple HIG) :
   - Confirmation d'une action (email envoyé, projet sauvegardé)
   - Erreur non-critique (perte de connexion, timeout)
   - Information contextuelle (nouvelle fonctionnalité)
   - NE PAS utiliser pour des erreurs critiques → utiliser Alert

   SPECS (iOS Notification Banner, iOS 16+) :
   - Position : fixed top-center, 16px du bord supérieur
   - Largeur  : full-width mobile, max 400px desktop
   - Rayon    : 18px (--r-xl)
   - Fond     : frosted glass (mat-regular + backdrop-filter)
   - Hauteur  : auto, min 56px
   - Auto-dismiss : 4000ms par défaut
   - Animation entrée : slide-down spring 350ms
   - Animation sortie : slide-up ease-in 280ms
   ────────────────────────────────────────────────────────────── */

export type ToastVariant = "default" | "success" | "warning" | "error" | "info";

export interface ToastProps {
  /** Texte principal (obligatoire) */
  title:        string;
  /** Description optionnelle (plus petite) */
  message?:     string;
  variant?:     ToastVariant;
  /** Durée d'affichage en ms. 0 = persistant (fermeture manuelle) */
  duration?:    number;
  /** Callback quand le toast disparaît */
  onDismiss?:   () => void;
}

const ICONS: Record<ToastVariant, typeof CheckCircle | null> = {
  default: null,
  success: CheckCircle,
  warning: AlertTriangle,
  error:   XCircle,
  info:    Info,
};

const ICON_CLASSES: Record<ToastVariant, string> = {
  default: "",
  success: "toast-icon-success",
  warning: "toast-icon-warning",
  error:   "toast-icon-error",
  info:    "toast-icon-info",
};

export function Toast({
  title,
  message,
  variant   = "default",
  duration  = 4000,
  onDismiss,
}: ToastProps) {
  const [state, setState] = useState<"entering" | "visible" | "leaving">("entering");
  const toastId = useId();

  const dismiss = useCallback(() => {
    setState("leaving");
  }, []);

  /* Après l'animation d'entrée → passe en "visible" */
  useEffect(() => {
    const t = setTimeout(() => setState("visible"), 360);
    return () => clearTimeout(t);
  }, []);

  /* Auto-dismiss après [duration]ms */
  useEffect(() => {
    if (duration === 0) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [duration, dismiss]);

  /* Quand la sortie est terminée → appelle onDismiss */
  const handleAnimationEnd = () => {
    if (state === "leaving") onDismiss?.();
  };

  const IconComponent = ICONS[variant];

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      id={toastId}
      className="toast"
      data-state={state === "visible" ? undefined : state}
      onAnimationEnd={handleAnimationEnd}
    >
      {/* Icône sémantique */}
      {IconComponent && (
        <div className={`toast-icon ${ICON_CLASSES[variant]}`} aria-hidden="true">
          <IconComponent size={18} strokeWidth={2} />
        </div>
      )}

      {/* Contenu textuel */}
      <div className="toast-content">
        <p className="toast-title">{title}</p>
        {message && <p className="toast-message">{message}</p>}
      </div>

      {/* Bouton fermeture */}
      <button
        type="button"
        className="toast-close"
        onClick={dismiss}
        aria-label="Fermer la notification"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ── useToast — hook pour déclencher des toasts facilement ──── */

export interface ToastConfig extends Omit<ToastProps, "onDismiss"> {}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastConfig & { id: string })[]>([]);

  const show = useCallback((config: ToastConfig) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { ...config, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const ToastContainer = () => (
    <>
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onDismiss={() => dismiss(t.id)} />
      ))}
    </>
  );

  return { show, dismiss, ToastContainer };
}
