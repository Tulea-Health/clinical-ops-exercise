import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";

interface AppContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  appName: string;
  version: string;
}

const defaultContextValue: AppContextValue = {
  isDarkMode: false,
  toggleTheme: () => {},
  setTheme: () => {},
  appName: "Clinical Ops",
  version: "2.1.0",
};

const AppContext = createContext<AppContextValue>(defaultContextValue);

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
  });

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem("theme", newValue ? "dark" : "light");
      return newValue;
    });
  }, []);

  const setTheme = useCallback((dark: boolean) => {
    setIsDarkMode(dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, []);

  const contextValue = useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      setTheme,
      appName: "Clinical Ops",
      version: "2.1.0",
    }),
    [isDarkMode, toggleTheme, setTheme]
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContext;
