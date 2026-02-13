import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  trend?: { value: number; label: string };
}

const variantStyles = {
  default: "bg-card border-border",
  success: "bg-card border-l-4 border-l-success border-t-0 border-r-0 border-b-0",
  warning: "bg-card border-l-4 border-l-warning border-t-0 border-r-0 border-b-0",
  destructive: "bg-card border-l-4 border-l-destructive border-t-0 border-r-0 border-b-0",
  info: "bg-card border-l-4 border-l-info border-t-0 border-r-0 border-b-0",
};

const iconVariantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default", trend }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border p-5 shadow-sm transition-shadow hover:shadow-md", variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-card-foreground">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <p className={cn("text-xs font-medium", trend.value >= 0 ? "text-success" : "text-destructive")}>
              {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
