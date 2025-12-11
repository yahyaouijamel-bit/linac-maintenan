import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "warning" | "danger" | "success";
  className?: string;
}

export const KPICard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
}: KPICardProps) => {
  const variantStyles = {
    default: "border-border",
    warning: "border-l-4 border-l-status-maintenance",
    danger: "border-l-4 border-l-status-down",
    success: "border-l-4 border-l-status-operational",
  };

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    warning: "bg-status-maintenance/10 text-status-maintenance",
    danger: "bg-status-down/10 text-status-down",
    success: "bg-status-operational/10 text-status-operational",
  };

  return (
    <div
      className={cn(
        "kpi-card animate-fade-in",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="kpi-label">{title}</p>
          <p className="kpi-value">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", iconStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
