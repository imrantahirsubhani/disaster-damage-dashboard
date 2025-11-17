import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface ProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-3xl",
  "2xl": "max-w-4xl",
};

export const ProfessionalDialog = ({
  open,
  onOpenChange,
  title,
  children,
  size = "lg",
}: ProfessionalDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${sizeClasses[size]} max-h-[90vh] overflow-hidden flex flex-col rounded-xl border border-border/60 shadow-2xl p-0`}
      >
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-border/50">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
