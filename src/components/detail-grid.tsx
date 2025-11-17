import { ReactNode } from "react";

interface DetailGridProps {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export const DetailGrid = ({ children, cols = 2 }: DetailGridProps) => {
  const colsClass = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  }[cols];

  return <div className={`grid ${colsClass} gap-4`}>{children}</div>;
};
