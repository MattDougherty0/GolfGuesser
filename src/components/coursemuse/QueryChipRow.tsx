"use client";

interface QueryChipRowProps {
  chips: string[];
  onChip?: (label: string) => void;
}

export default function QueryChipRow({ chips, onChip }: QueryChipRowProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onChip?.(label)}
          className="rounded-full border border-cream/15 bg-cream/5 px-3 py-1.5 text-xs font-medium text-cream/80 transition-colors hover:border-accent/40 hover:bg-accent/10 hover:text-cream"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
