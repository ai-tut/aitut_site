import * as React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";
import { type CollectionConfig, type ModuleConfig } from "../../types";

interface MainLayoutProps {
  children: React.ReactNode;
  collections: CollectionConfig[];
  modules: ModuleConfig[];
}

export function MainLayout({ children, collections, modules }: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const newIsDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDarkMode(newIsDarkMode);
  }, []);

  React.useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <>
      <div className="min-h-screen bg-background">
        <Header onThemeToggle={toggleTheme} isDarkMode={isDarkMode} />
        <div className="flex">
          <Sidebar collections={collections} modules={modules} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </>
  );
}