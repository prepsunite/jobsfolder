import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
export type ActiveTheme = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: ActiveTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('prepunite-theme-mode');
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      const legacyTheme = localStorage.getItem('prepunite-theme');
      if (legacyTheme === 'light' || legacyTheme === 'dark') {
        return legacyTheme;
      }
    }
    return 'system';
  });

  const [activeTheme, setActiveTheme] = useState<ActiveTheme>('light');

  useEffect(() => {
    const getSystemTheme = (): ActiveTheme =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const resolvedTheme: ActiveTheme =
      themeMode === 'system' ? getSystemTheme() : themeMode;

    setActiveTheme(resolvedTheme);

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    localStorage.setItem('prepunite-theme-mode', themeMode);
    localStorage.setItem('prepunite-theme', resolvedTheme);
    localStorage.setItem('prepunite-doc-darkmode', String(resolvedTheme === 'dark'));

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newSysTheme = mediaQuery.matches ? 'dark' : 'light';
        setActiveTheme(newSysTheme);
        root.classList.remove('light', 'dark');
        root.classList.add(newSysTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleTheme = () => {
    setThemeModeState(prev => {
      const current = prev === 'system' ? activeTheme : prev;
      return current === 'dark' ? 'light' : 'dark';
    });
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme: activeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
