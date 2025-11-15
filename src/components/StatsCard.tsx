import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "warning" | "success" | "info";
}

export const StatsCard = ({ title, value, icon: Icon, trend, variant = "default" }: StatsCardProps) => {
  const variantClasses = {
    default: "border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
    warning: "border-warning/30 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent",
    success: "border-success/30 bg-gradient-to-br from-success/10 via-success/5 to-transparent",
    info: "border-info/30 bg-gradient-to-br from-info/10 via-info/5 to-transparent",
  };

  const iconClasses = {
    default: "text-primary bg-primary/10",
    warning: "text-warning bg-warning/10",
    success: "text-success bg-success/10",
    info: "text-info bg-info/10",
  };

  return (
    <Card className={cn("p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border", variantClasses[variant])}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-4xl font-bold text-foreground">{value}</p>
          {trend && <p className="text-xs text-muted-foreground font-medium">{trend}</p>}
        </div>
        <div className={cn("p-4 rounded-2xl transition-transform duration-300 hover:scale-110", iconClasses[variant])}>
          <Icon className="h-8 w-8" strokeWidth={2.5} />
        </div>
      </div>
    </Card>
  );
};
