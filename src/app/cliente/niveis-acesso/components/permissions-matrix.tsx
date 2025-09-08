"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Square, Loader2 } from "lucide-react"
import { 
  ScreenPermission, 
  systemModules,
  permissionLabels,
  PermissionType
} from "../types"
import { cn } from "@/lib/utils"

interface PermissionsMatrixProps {
  permissions: ScreenPermission[]
  onChange: (permissions: ScreenPermission[]) => void
  loading?: boolean
}

export function PermissionsMatrix({ 
  permissions, 
  onChange,
  loading = false 
}: PermissionsMatrixProps) {
  
  // Atualizar uma permissão específica
  const handlePermissionChange = (
    screenId: string, 
    permissionType: PermissionType, 
    enabled: boolean
  ) => {
    const updated = permissions.map(screen => {
      if (screen.screenId === screenId) {
        return {
          ...screen,
          permissions: screen.permissions.map(perm => 
            perm.type === permissionType 
              ? { ...perm, enabled } 
              : perm
          )
        }
      }
      return screen
    })
    onChange(updated)
  }

  // Selecionar todas as permissões
  const handleSelectAll = () => {
    const updated = permissions.map(screen => ({
      ...screen,
      permissions: screen.permissions.map(perm => ({
        ...perm,
        enabled: true
      }))
    }))
    onChange(updated)
  }

  // Desmarcar todas as permissões
  const handleDeselectAll = () => {
    const updated = permissions.map(screen => ({
      ...screen,
      permissions: screen.permissions.map(perm => ({
        ...perm,
        enabled: false
      }))
    }))
    onChange(updated)
  }

  // Selecionar todas as permissões de um módulo
  const handleSelectModule = (moduleId: string) => {
    const module = systemModules.find(m => m.id === moduleId)
    if (!module) return

    const updated = permissions.map(screen => {
      const isInModule = module.screens.some(s => s.id === screen.screenId)
      return {
        ...screen,
        permissions: screen.permissions.map(perm => ({
          ...perm,
          enabled: isInModule ? true : perm.enabled
        }))
      }
    })
    onChange(updated)
  }

  // Desmarcar todas as permissões de um módulo
  const handleDeselectModule = (moduleId: string) => {
    const module = systemModules.find(m => m.id === moduleId)
    if (!module) return

    const updated = permissions.map(screen => {
      const isInModule = module.screens.some(s => s.id === screen.screenId)
      return {
        ...screen,
        permissions: screen.permissions.map(perm => ({
          ...perm,
          enabled: isInModule ? false : perm.enabled
        }))
      }
    })
    onChange(updated)
  }

  // Selecionar todas as permissões de uma tela
  const handleSelectScreen = (screenId: string) => {
    const updated = permissions.map(screen => {
      if (screen.screenId === screenId) {
        return {
          ...screen,
          permissions: screen.permissions.map(perm => ({
            ...perm,
            enabled: true
          }))
        }
      }
      return screen
    })
    onChange(updated)
  }

  // Desmarcar todas as permissões de uma tela
  const handleDeselectScreen = (screenId: string) => {
    const updated = permissions.map(screen => {
      if (screen.screenId === screenId) {
        return {
          ...screen,
          permissions: screen.permissions.map(perm => ({
            ...perm,
            enabled: false
          }))
        }
      }
      return screen
    })
    onChange(updated)
  }

  // Contar permissões ativas
  const countActivePermissions = () => {
    return permissions.reduce((total, screen) => 
      total + screen.permissions.filter(p => p.enabled).length, 0
    )
  }

  const totalPermissions = permissions.reduce((total, screen) => 
    total + screen.permissions.length, 0
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Ações globais */}
      <div className="flex items-center justify-between rounded-lg border bg-blue-50/50 p-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">
            Permissões selecionadas:
          </Label>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {countActivePermissions()} de {totalPermissions}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="gap-1 text-blue-600 hover:bg-blue-50"
          >
            <CheckSquare className="h-3 w-3" />
            Selecionar Todos
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="gap-1"
          >
            <Square className="h-3 w-3" />
            Desmarcar Todos
          </Button>
        </div>
      </div>

      {/* Accordion com módulos */}
      <Accordion type="multiple" className="w-full space-y-2">
        {systemModules.map((module) => {
          const moduleScreens = permissions.filter(screen => 
            module.screens.some(s => s.id === screen.screenId)
          )
          
          const moduleActivePermissions = moduleScreens.reduce((total, screen) => 
            total + screen.permissions.filter(p => p.enabled).length, 0
          )
          
          const moduleTotalPermissions = moduleScreens.reduce((total, screen) => 
            total + screen.permissions.length, 0
          )

          return (
            <AccordionItem 
              key={module.id} 
              value={module.id}
              className="border rounded-lg"
            >
              <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50">
                <div className="flex items-center justify-between w-full pr-2">
                  <span className="font-medium">{module.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {moduleActivePermissions}/{moduleTotalPermissions} permissões
                    </Badge>
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectModule(module.id)}
                        className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50"
                      >
                        Selecionar Módulo
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeselectModule(module.id)}
                        className="h-7 px-2 text-xs"
                      >
                        Desmarcar Módulo
                      </Button>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  {moduleScreens.map((screen) => {
                    const screenActive = screen.permissions.filter(p => p.enabled).length
                    const screenTotal = screen.permissions.length
                    const allSelected = screenActive === screenTotal

                    return (
                      <div 
                        key={screen.screenId}
                        className="rounded-lg border bg-white p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{screen.screenName}</h4>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs",
                                allSelected && "bg-green-50 text-green-700 border-green-200"
                              )}
                            >
                              {screenActive}/{screenTotal}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSelectScreen(screen.screenId)}
                              className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-50"
                            >
                              Todos
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeselectScreen(screen.screenId)}
                              className="h-6 px-2 text-xs"
                            >
                              Nenhum
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {screen.permissions.map((permission) => (
                            <label
                              key={`${screen.screenId}-${permission.type}`}
                              className={cn(
                                "flex items-center space-x-2 cursor-pointer rounded-md px-3 py-2 transition-colors",
                                permission.enabled 
                                  ? "bg-blue-50 border border-blue-200" 
                                  : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                              )}
                            >
                              <Checkbox
                                checked={permission.enabled}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(
                                    screen.screenId, 
                                    permission.type, 
                                    checked as boolean
                                  )
                                }
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <span className={cn(
                                "text-sm select-none",
                                permission.enabled ? "text-blue-700 font-medium" : "text-gray-600"
                              )}>
                                {permission.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
