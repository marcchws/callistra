"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ChevronDown, ChevronRight } from "lucide-react"
import { sidebarConfig, moduleLabels } from "@/lib/sidebar-config"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [expandedModules, setExpandedModules] = useState<string[]>(["sistema", "escritorio"])

  const toggleModule = (module: string) => {
    setExpandedModules(prev => 
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    )
  }

  const groupedItems = sidebarConfig.reduce((acc, item) => {
    if (!acc[item.module]) {
      acc[item.module] = []
    }
    acc[item.module].push(item)
    return acc
  }, {} as Record<string, typeof sidebarConfig>)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <span className="text-xl font-bold">Callistra</span>
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-4">
          {Object.entries(groupedItems).map(([module, items]) => (
            <div key={module} className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-between px-2 font-medium text-sm"
                onClick={() => toggleModule(module)}
              >
                <span>{moduleLabels[module as keyof typeof moduleLabels]}</span>
                {expandedModules.includes(module) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
              
              {expandedModules.includes(module) && (
                <div className="space-y-1 pl-4">
                  {items.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          "hover:bg-blue-50 hover:text-blue-600",
                          isActive 
                            ? "bg-blue-600 text-white hover:bg-blue-700 hover:text-white" 
                            : "text-gray-700"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.title === "Alertas e Notificações" && (
                          <Badge variant="destructive" className="text-xs">
                            3
                          </Badge>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <span className="text-sm font-medium text-blue-600">U</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Usuário</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={cn("hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:border-r lg:bg-white", className)}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  )
}
