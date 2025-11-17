import { ReactNode } from "react";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ModalHeaderProps {
  title: string;
  description?: string;
  onClose?: () => void;
  subtitle?: ReactNode;
}

export const ModalHeader = ({ title, description, subtitle, onClose }: ModalHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4 pb-6 border-b border-border">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {subtitle && <div className="mt-3">{subtitle}</div>}
      </div>
      {onClose && (
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 rounded-lg hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};
