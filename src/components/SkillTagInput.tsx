import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Props {
  label: string;
  placeholder: string;
  addLabel: string;
  items: string[];
  onChange: (items: string[]) => void;
}

export default function SkillTagInput({ label, placeholder, addLabel, items, onChange }: Props) {
  const [input, setInput] = useState('');

  const addItem = () => {
    const val = input.trim();
    if (!val) return;
    onChange([...items, val]);
    setInput('');
  };

  const removeItem = (i: number) => {
    onChange(items.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{label}</label>

      {/* Tag list */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-100 dark:border-blue-800"
            >
              {item}
              <button
                onClick={() => removeItem(i)}
                className="text-blue-400 hover:text-red-500 transition-colors ml-0.5"
                aria-label="Remove"
                type="button"
              >
                <X size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addItem(); } }}
          placeholder={placeholder}
          className="flex-1 input-field"
        />
        <button
          type="button"
          onClick={addItem}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm whitespace-nowrap"
        >
          <Plus size={15} />
          {addLabel}
        </button>
      </div>
    </div>
  );
}
