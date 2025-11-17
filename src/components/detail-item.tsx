interface DetailItemProps {
  label: string;
  value: string | number;
}

export const DetailItem = ({ label, value }: DetailItemProps) => {
  return (
    <div className="p-4 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted transition-colors">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground break-words">{value}</p>
    </div>
  );
};
