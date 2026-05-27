import { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './components/HomePage';
import PortfolioForm from './components/PortfolioForm';
import CVForm from './components/CVForm';

type Route = 'home' | 'portfolio' | 'cv';

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('ph-dark');
    if (stored !== null) return stored === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('ph-dark', String(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-200">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(d => !d)}
        onHome={() => setRoute('home')}
        showHome={route !== 'home'}
      />
      {route === 'home' && (
        <HomePage
          onPortfolio={() => setRoute('portfolio')}
          onCV={() => setRoute('cv')}
        />
      )}
      {route === 'portfolio' && (
        <PortfolioForm onBack={() => setRoute('home')} />
      )}
      {route === 'cv' && (
        <CVForm onBack={() => setRoute('home')} />
      )}
    </div>
  );
}
