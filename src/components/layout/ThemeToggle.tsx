import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { LOCAL_STORAGE_KEYS } from '../../constants';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
    const hasDarkClass = document.documentElement.classList.contains('dark');
    const initialIsDark = storedTheme ? storedTheme === 'dark' : hasDarkClass;

    if (initialIsDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsDark(initialIsDark);

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.theme) {
        setIsDark(customEvent.detail.theme === 'dark');
      } else {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, 'light');
    }
    setIsDark(nextDark);
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: nextDark ? 'dark' : 'light' } }));
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-2xs transition-all duration-200 flex items-center gap-2 text-xs font-semibold cursor-pointer active:scale-95"
    >
      {isDark ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 animate-in zoom-in-75 duration-200" />
          <span className="hidden sm:inline text-slate-200">Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600/20 animate-in zoom-in-75 duration-200" />
          <span className="hidden sm:inline text-slate-700">Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;

