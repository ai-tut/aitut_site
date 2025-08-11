import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

interface SidebarProps {
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

export function Sidebar({ collections, modules }: SidebarProps) {
  const location = useLocation()

  return (
    <aside className="w-64 h-screen bg-background border-r border overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Collections Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Collections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {collections.map((collection) => (
              <div key={collection.id} className="space-y-1">
                <Link
                  to={`/collection/${collection.id}`}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname === `/collection/${collection.id}`
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {collection.title}
                </Link>
                {collection.pages.map((page) => (
                  <Link
                    key={page.id}
                    to={`/collection/${collection.id}/${page.id}`}
                    className={cn(
                      "block px-6 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
                      location.pathname === `/collection/${collection.id}/${page.id}` &&
                        "text-primary font-medium"
                    )}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Modules Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Modules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {modules.map((module) => (
              <div key={module.id} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{module.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {module.version}
                  </Badge>
                </div>
                {module.description && (
                  <p className="text-xs text-muted-foreground">
                    {module.description}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}