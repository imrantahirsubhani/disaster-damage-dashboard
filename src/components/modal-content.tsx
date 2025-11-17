import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export const ModalContent = ({ children, className }: ModalContentProps) => {
  return (
    <div className={cn("overflow-y-auto", className)}>
      {children}
    </div>
  );
};
