interface Props {
  steps: string[];
  current: number;
  onStep?: (i: number) => void;
}

export default function StepProgress({ steps, current, onStep }: Props) {
  return (
    <div className="flex items-center gap-1 px-2 overflow-x-auto scrollbar-hide py-1">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onStep && i < current && onStep(i)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              i === current
                ? 'bg-blue-600 text-white'
                : i < current
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-default'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
              i === current ? 'bg-white/30' : i < current ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
            }`}>
              {i < current ? '✓' : i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </button>
          {i < steps.length - 1 && (
            <div className={`w-3 h-px flex-shrink-0 ${i < current ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
