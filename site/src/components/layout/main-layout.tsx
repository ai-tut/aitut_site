import * as React from "react"
import { Header } from "./header"
import { Sidebar } from "./sidebar"

interface MainLayoutProps {
  children: React.ReactNode
  collections: Array<{
    id: string
    title: string
    description?: string
    pages: Array<{
      id: string
      title: string
      path: string
    }>
  }>
  modules: Array<{
    id: string
    name: string
    version: string
    description?: string
  }>
}

export function MainLayout({ children, collections, modules }: MainLayoutProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  React.useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  React.useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onThemeToggle={toggleTheme} 
        isDarkMode={isDarkMode}
      />
      <div className="flex">
        <Sidebar collections={collections} modules={modules} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}