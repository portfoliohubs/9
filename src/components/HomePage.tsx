import { Search, FileText, Star, Shield, Zap } from 'lucide-react';
import CONFIG from '../config';

interface Props {
  onPortfolio: () => void;
  onCV: () => void;
}

export default function HomePage({ onPortfolio, onCV }: Props) {
  const t = CONFIG.ui.en.home;

  return (
    <main className="min-h-[calc(100vh-65px)] flex flex-col">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">
        <div className="mb-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-5 border border-blue-100 dark:border-blue-800">
            <Star size={14} />
            Free · Professional · Instant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-3">
            {t.welcomeTitle}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-sm mx-auto">
            {t.welcomeSubtitle}
          </p>
        </div>

        {/* Two main buttons */}
        <div className="w-full max-w-sm space-y-4">
          {/* Portfolio button */}
          <button
            onClick={onPortfolio}
            className="group w-full flex items-start gap-4 p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Search size={22} />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight">{t.portfolioButtonTitle}</div>
              <div className="text-blue-100 text-sm mt-1 leading-snug">{t.portfolioButtonSubtitle}</div>
            </div>
          </button>

          {/* CV button */}
          <button
            onClick={onCV}
            className="group w-full flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md text-left transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
              <FileText size={22} />
            </div>
            <div>
              <div className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {t.cvButtonTitle}
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-snug">
                {t.cvButtonSubtitle}
              </div>
            </div>
          </button>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1.5">
            <Shield size={13} className="text-green-500" />
            Trusted by dental professionals
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={13} className="text-yellow-500" />
            Free forever
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={13} className="text-blue-500" />
            Mobile friendly
          </span>
        </div>
      </section>

      {/* SEO-rich hidden content for search engines */}
      <section className="sr-only" aria-hidden="true">
        <h2>PortfolioHubs - Dental CV Maker & Portfolio Builder</h2>
        <p>Create professional dental portfolios and CVs. Free CV PDF maker for dentists. Dental portfolio that appears on Google search. Best dental CV maker online. Free dental portfolio builder.</p>
        <ul>
          <li>portfoliohubs</li>
          <li>cv maker for dentists</li>
          <li>dental cv pdf maker</li>
          <li>free dental portfolio</li>
          <li>dental portfolio google search</li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-slate-600 border-t border-slate-100 dark:border-slate-800">
        <span>{t.footerNote}</span>
        <br />
        <span className="text-slate-300 dark:text-slate-700">
          © {new Date().getFullYear()} {CONFIG.brand.name}
        </span>
      </footer>
    </main>
  );
}
