import { cn } from "@/lib/utils";

type BadgeVariant = "healthy" | "degraded" | "progressing" | "synced" | "outOfSync" | "success" | "failed" | "critical" | "warning" | "info" | "default";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  healthy: "bg-success/15 text-success border-success/20",
  degraded: "bg-destructive/15 text-destructive border-destructive/20",
  progressing: "bg-primary/15 text-primary border-primary/20",
  synced: "bg-success/15 text-success border-success/20",
  outOfSync: "bg-warning/15 text-warning border-warning/20",
  success: "bg-success/15 text-success border-success/20",
  failed: "bg-destructive/15 text-destructive border-destructive/20",
  critical: "bg-destructive/15 text-destructive border-destructive/20",
  warning: "bg-warning/15 text-warning border-warning/20",
  info: "bg-info/15 text-info border-info/20",
  default: "bg-muted text-muted-foreground border-border",
};

function autoVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (s === "healthy" || s === "synced" || s === "success") return s as BadgeVariant;
  if (s === "degraded" || s === "failed" || s === "critical") return s as BadgeVariant;
  if (s === "outofsync") return "outOfSync";
  if (s === "progressing") return "progressing";
  if (s === "warning") return "warning";
  if (s === "info") return "info";
  return "default";
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const v = variant ?? autoVariant(status);
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold", variantMap[v], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": v === "healthy" || v === "synced" || v === "success",
        "bg-destructive": v === "degraded" || v === "failed" || v === "critical",
        "bg-warning": v === "outOfSync" || v === "warning",
        "bg-primary": v === "progressing",
        "bg-info": v === "info",
        "bg-muted-foreground": v === "default",
      })} />
      {status}
    </span>
  );
}
