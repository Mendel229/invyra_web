"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/cn";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {title && <h1 className="text-2xl font-semibold tracking-tight text-noir-doux sm:text-[28px]">{title}</h1>}
        {subtitle && <p className={cn("max-w-2xl text-sm text-noir-doux/50", title && "mt-1.5")}>{subtitle}</p>}
      </div>
      {action && <div className="flex shrink-0 gap-2">{action}</div>}
    </div>
  );
}

export function Panel({ className, children, ...props }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
      className={cn("rounded-2xl bg-white ring-1 ring-black/5", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Alias conservé pour compatibilité avec les pages déjà écrites.
export const Card = Panel;

export function PanelHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div>
        <h2 className="text-base font-semibold text-noir-doux">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-noir-doux/50">{description}</p>}
      </div>
      {action}
    </div>
  );
}

/** Nombre qui "monte" jusqu'à sa valeur à l'affichage. */
export function AnimatedNumber({ value }: { value: number }) {
  const motionValue = useMotionValue(0);
  const text = useTransform(motionValue, (v) => new Intl.NumberFormat("fr-FR").format(Math.round(v)));

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1.1, ease: EASE_OUT });
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span>{text}</motion.span>;
}

export type Trend = { label: string; direction: "up" | "down" | "flat" };

const TREND_STYLES = {
  up: "bg-brand-success/10 text-brand-success",
  down: "bg-brand-error/10 text-brand-error",
  flat: "bg-noir-doux/5 text-noir-doux/50",
} as const;

/** Carte de chiffre clé. `highlight` : la carte principale, en dégradé violet. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  trend,
  highlight = false,
  index = 0,
}: {
  label: string;
  value: number;
  hint?: string;
  icon: React.ReactNode;
  trend?: Trend;
  highlight?: boolean;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: EASE_OUT }}
      whileHover={{ y: -3 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl p-5 transition-shadow",
        highlight
          ? "bg-gradient-to-br from-violet-royal via-violet-royal to-violet-royal-alt text-white shadow-xl shadow-violet-royal/30"
          : "bg-white ring-1 ring-black/5 hover:shadow-lg hover:shadow-black/5",
      )}
    >
      {highlight && (
        <>
          <span aria-hidden className="absolute -top-10 -right-10 size-36 rounded-full border-[18px] border-white/10" />
          <span aria-hidden className="absolute -right-4 -bottom-16 size-32 rounded-full bg-white/10" />
        </>
      )}
      <div className="relative flex items-start justify-between gap-2">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-xl [&_svg]:size-[18px]",
            highlight ? "bg-white/20 text-white ring-1 ring-white/25" : "bg-violet-royal/8 text-violet-royal ring-1 ring-violet-royal/10",
          )}
        >
          {icon}
        </span>
        {trend && (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap",
              highlight ? "bg-white/20 text-white" : TREND_STYLES[trend.direction],
            )}
          >
            {trend.label}
          </span>
        )}
      </div>
      <p className={cn("relative mt-5 text-sm font-medium", highlight ? "text-white/80" : "text-noir-doux/50")}>{label}</p>
      <p className={cn("relative mt-1 text-[28px] leading-tight font-semibold tracking-tight tabular-nums", highlight ? "text-white" : "text-noir-doux")}>
        <AnimatedNumber value={value} />
      </p>
      {hint && <p className={cn("relative mt-1 text-xs", highlight ? "text-white/70" : "text-noir-doux/40")}>{hint}</p>}
    </motion.div>
  );
}

const PILL_TONES = {
  slate: "bg-noir-doux/5 text-noir-doux/60 ring-noir-doux/10",
  violet: "bg-violet-royal/8 text-violet-royal ring-violet-royal/20",
  gold: "bg-or-africain/15 text-or-africain ring-or-africain/30",
  success: "bg-brand-success/10 text-brand-success ring-brand-success/20",
  error: "bg-brand-error/10 text-brand-error ring-brand-error/20",
  info: "bg-brand-info/10 text-brand-info ring-brand-info/20",
} as const;

export function Pill({
  tone = "slate",
  children,
  className,
}: {
  tone?: keyof typeof PILL_TONES;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset [&_svg]:size-3", PILL_TONES[tone], className)}>
      {children}
    </span>
  );
}

const STATUS_TONES: Record<string, keyof typeof PILL_TONES> = {
  a_venir: "info",
  en_cours: "success",
  termine: "slate",
  cloture: "slate",
  brouillon: "slate",
  envoye: "info",
  vue: "gold",
  confirme: "success",
  decline: "error",
  gratuit: "slate",
  essentiel: "violet",
  flex: "gold",
  premium: "gold",
  actif: "success",
  inactif: "slate",
};

export function StatusBadge({ status }: { status: string | null }) {
  const key = status ?? "inconnu";
  return (
    <Pill tone={STATUS_TONES[key] ?? "slate"} className="capitalize">
      {key.replace("_", " ")}
    </Pill>
  );
}

export function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: EASE_OUT }}
      className="flex flex-col items-center px-6 py-14 text-center"
    >
      <motion.span
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-royal/10 to-beige-creme-alt text-violet-royal [&_svg]:size-6"
      >
        {icon}
      </motion.span>
      <p className="mt-4 font-semibold text-noir-doux">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-noir-doux/50">{description}</p>}
    </motion.div>
  );
}

export function StaggerList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.04 } } }} className={className}>
      {children}
    </motion.ul>
  );
}

const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } },
};

export function StaggerItem({ className, children, ...props }: HTMLMotionProps<"li">) {
  return (
    <motion.li variants={STAGGER_ITEM} className={className} {...props}>
      {children}
    </motion.li>
  );
}

export function InitialsAvatar({ name, className }: { name: string; className?: string }) {
  const parts = name.trim().split(/[\s@._-]+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? "").concat(parts[1]?.[0] ?? "").toUpperCase();
  return (
    <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-royal to-violet-royal-alt text-sm font-semibold text-white", className)}>
      {letters || "?"}
    </span>
  );
}

export function BreakdownBars({
  data,
  total,
  colors,
}: {
  data: Record<string, number>;
  total: number;
  /** Couleur par clé — une donnée simple (sérialisable), pas une fonction :
   * ce composant est un Client Component, il ne peut pas recevoir de
   * fonction en props depuis un Server Component. */
  colors?: Record<string, string>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    return <p className="text-sm text-noir-doux/40">Aucune donnée.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {entries.map(([key, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={key}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-noir-doux capitalize">{key}</span>
              <span className="text-noir-doux/50">
                {count} ({pct}%)
              </span>
            </div>
            <div className="h-2 rounded-full bg-beige-creme-alt overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors?.[key] ?? "var(--color-violet-royal)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
