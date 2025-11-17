import { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  children: ReactNode;
}

export const DetailSection = ({ title, children }: DetailSectionProps) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
        {title}
      </h3>
      <div>{children}</div>
    </div>
  );
};
