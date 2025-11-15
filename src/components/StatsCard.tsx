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
    default: "border-primary/20 bg-primary/5",
    warning: "border-warning/20 bg-warning/5",
    success: "border-success/20 bg-success/5",
    info: "border-info/20 bg-info/5",
  };

  const iconClasses = {
    default: "text-primary",
    warning: "text-warning",
    success: "text-success",
    info: "text-info",
  };

  return (
    <Card className={cn("p-6 border-2 transition-all hover:shadow-lg", variantClasses[variant])}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
        </div>
        <div className={cn("p-4 rounded-xl bg-background/50", iconClasses[variant])}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </Card>
  );
};
