import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { type CollectionConfig, type ModuleConfig } from "../../types";

interface SidebarProps {
  collections: CollectionConfig[];
  modules: ModuleConfig[];
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
                  to={`/${collection.id}`}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    location.pathname.startsWith(`/${collection.id}`)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {collection.tocData?.title || collection.id}
                </Link>
                {collection.pages && collection.pages.map((page) => (
                  <Link
                    key={page.slug}
                    to={`/${collection.id}/${page.slug}`}
                    className={cn(
                      "block pl-6 pr-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors",
                      location.pathname === `/${collection.id}/${page.slug}` &&
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
              <div key={module.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{module.name}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}