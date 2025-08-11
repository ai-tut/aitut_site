import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

interface HeaderProps {
  title?: string
  onThemeToggle?: () => void
  isDarkMode?: boolean
}

export function Header({ title = "AITUT Website", onThemeToggle, isDarkMode }: HeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  return (
    <header className="h-16 bg-background border-b border px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold text-foreground hover:text-primary transition-colors">
          {title}
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        
        {onThemeToggle && (
          <Button
            variant="outline"
            size="sm"
            onClick={onThemeToggle}
            className="px-3"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </Button>
        )}
      </div>
    </header>
  )
}