import React from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="rounded-lg p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      ) : (
        <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}