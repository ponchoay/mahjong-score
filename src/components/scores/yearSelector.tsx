interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onSelect: (year: number) => void;
}

export function YearSelector({
  years,
  selectedYear,
  onSelect,
}: YearSelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {years.map((year) => (
        <button
          type="button"
          key={year}
          onClick={() => onSelect(year)}
          className={`rounded-btn px-4 py-2 text-sm font-medium transition-colors ${
            year === selectedYear
              ? "bg-brand-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}
