import { Sun, Moon, Home } from 'lucide-react';
import CONFIG from '../config';

interface Props {
  darkMode: boolean;
  onToggleDark: () => void;
  onHome?: () => void;
  showHome?: boolean;
}

export default function Header({ darkMode, onToggleDark, onHome, showHome }: Props) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 flex-shrink-0 ring-2 ring-blue-500">
            <img
              src={CONFIG.brand.logoUrl}
              alt={CONFIG.brand.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-blue-600 dark:text-blue-400 text-lg leading-tight tracking-tight">
              {CONFIG.brand.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium" dir="rtl">
              {CONFIG.brand.slogan}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {showHome && onHome && (
            <button
              onClick={onHome}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Home"
            >
              <Home size={18} />
            </button>
          )}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
