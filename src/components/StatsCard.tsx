import { Card } from "@/components/ui/card";
import { type LucideIcon } from 'lucide-react';
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
    default: "border-primary/40 bg-gradient-to-br from-primary/15 via-primary/8 to-primary/0 shadow-lg shadow-primary/10",
    warning: "border-yellow-400/40 bg-gradient-to-br from-yellow-400/15 via-yellow-400/8 to-yellow-400/0 shadow-lg shadow-yellow-400/10",
    success: "border-emerald-400/40 bg-gradient-to-br from-emerald-400/15 via-emerald-400/8 to-emerald-400/0 shadow-lg shadow-emerald-400/10",
    info: "border-cyan-400/40 bg-gradient-to-br from-cyan-400/15 via-cyan-400/8 to-cyan-400/0 shadow-lg shadow-cyan-400/10",
  };

  const iconClasses = {
    default: "text-primary bg-primary/15",
    warning: "text-yellow-500 bg-yellow-500/15",
    success: "text-emerald-500 bg-emerald-500/15",
    info: "text-cyan-500 bg-cyan-500/15",
  };

  return (
    <Card className={cn("p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-1 border", variantClasses[variant])}>
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{title}</p>
          <p className="text-5xl font-bold text-foreground">{value}</p>
          {trend && <p className="text-sm text-muted-foreground font-medium">{trend}</p>}
        </div>
        <div className={cn("p-4 rounded-2xl transition-transform duration-300 hover:scale-110", iconClasses[variant])}>
          <Icon className="h-10 w-10" strokeWidth={2} />
        </div>
      </div>
    </Card>
  );
};
