"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CheckSquare, Square, ChevronDown, ChevronRight } from "lucide-react"
import {
  systemScreens,
  systemModules,
  ScreenPermissions,
  PermissionType,
  getPermissionLabel
} from "../types"

interface PermissionsGridProps {
  value: ScreenPermissions[]
  onChange: (permissions: ScreenPermissions[]) => void
  disabled?: boolean
}

export function PermissionsGrid({ value, onChange, disabled }: PermissionsGridProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(["escritorio"])
  const [permissions, setPermissions] = useState<Map<string, Set<PermissionType>>>(new Map())

  // Inicializar permissões com os valores recebidos
  useEffect(() => {
    const permMap = new Map<string, Set<PermissionType>>()
    value.forEach(screenPerm => {
      permMap.set(screenPerm.screenId, new Set(screenPerm.permissions))
    })
    setPermissions(permMap)
  }, [value])

  // Atualizar valor quando permissões mudam
  useEffect(() => {
    const screenPermissions: ScreenPermissions[] = []
    permissions.forEach((perms, screenId) => {
      if (perms.size > 0) {
        screenPermissions.push({
          screenId,
          permissions: Array.from(perms)
        })
      }
    })
    onChange(screenPermissions)
  }, [permissions, onChange])

  // Toggle módulo expandido/colapsado
  const toggleModule = (module: string) => {
    setExpandedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    )
  }

  // Toggle permissão individual
  const togglePermission = (screenId: string, permission: PermissionType) => {
    if (disabled) return

    setPermissions(prev => {
      const newMap = new Map(prev)
      const screenPerms = newMap.get(screenId) || new Set<PermissionType>()
      
      if (screenPerms.has(permission)) {
        screenPerms.delete(permission)
      } else {
        screenPerms.add(permission)
      }
      
      if (screenPerms.size === 0) {
        newMap.delete(screenId)
      } else {
        newMap.set(screenId, screenPerms)
      }
      
      return newMap
    })
  }

  // Selecionar todas as permissões de uma tela (Cenário 5)
  const selectAllScreenPermissions = (screenId: string) => {
    if (disabled) return

    const screen = systemScreens.find(s => s.id === screenId)
    if (!screen) return

    setPermissions(prev => {
      const newMap = new Map(prev)
      const currentPerms = newMap.get(screenId) || new Set<PermissionType>()
      
      // Se já tem todas, remove todas. Senão, adiciona todas
      if (currentPerms.size === screen.availablePermissions.length) {
        newMap.delete(screenId)
      } else {
        newMap.set(screenId, new Set(screen.availablePermissions))
      }
      
      return newMap
    })
  }

  // Selecionar todas as permissões de um módulo (Cenário 5)
  const selectAllModulePermissions = (module: keyof typeof systemModules) => {
    if (disabled) return

    const moduleScreens = systemScreens.filter(s => s.module === module)
    
    setPermissions(prev => {
      const newMap = new Map(prev)
      
      // Verificar se todas as telas do módulo já estão com todas as permissões
      const allSelected = moduleScreens.every(screen => {
        const screenPerms = newMap.get(screen.id)
        return screenPerms && screenPerms.size === screen.availablePermissions.length
      })
      
      moduleScreens.forEach(screen => {
        if (allSelected) {
          // Se todas estão selecionadas, desmarcar todas
          newMap.delete(screen.id)
        } else {
          // Senão, marcar todas
          newMap.set(screen.id, new Set(screen.availablePermissions))
        }
      })
      
      return newMap
    })
  }

  // Selecionar TODAS as permissões do sistema (Cenário 4)
  const selectAllPermissions = () => {
    if (disabled) return

    // Verificar se todas já estão selecionadas
    const allSelected = systemScreens.every(screen => {
      const screenPerms = permissions.get(screen.id)
      return screenPerms && screenPerms.size === screen.availablePermissions.length
    })
    
    if (allSelected) {
      // Desmarcar todas
      setPermissions(new Map())
    } else {
      // Marcar todas
      const newMap = new Map<string, Set<PermissionType>>()
      systemScreens.forEach(screen => {
        newMap.set(screen.id, new Set(screen.availablePermissions))
      })
      setPermissions(newMap)
    }
  }

  // Verificar se uma tela tem todas as permissões selecionadas
  const isScreenFullySelected = (screenId: string): boolean => {
    const screen = systemScreens.find(s => s.id === screenId)
    if (!screen) return false
    
    const screenPerms = permissions.get(screenId)
    return screenPerms ? screenPerms.size === screen.availablePermissions.length : false
  }

  // Verificar se um módulo tem todas as permissões selecionadas
  const isModuleFullySelected = (module: keyof typeof systemModules): boolean => {
    const moduleScreens = systemScreens.filter(s => s.module === module)
    return moduleScreens.every(screen => isScreenFullySelected(screen.id))
  }

  // Verificar se todas as permissões estão selecionadas
  const areAllPermissionsSelected = (): boolean => {
    return systemScreens.every(screen => isScreenFullySelected(screen.id))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium">Permissões por Tela</CardTitle>
            <CardDescription>
              Selecione as permissões para cada tela do sistema
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={selectAllPermissions}
            disabled={disabled}
            className="gap-2"
          >
            {areAllPermissionsSelected() ? (
              <>
                <Square className="h-4 w-4" />
                Desmarcar Todos
              </>
            ) : (
              <>
                <CheckSquare className="h-4 w-4" />
                Selecionar Todos
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            {Object.entries(systemModules).map(([moduleKey, moduleLabel]) => {
              const module = moduleKey as keyof typeof systemModules
              const moduleScreens = systemScreens.filter(s => s.module === module)
              const isExpanded = expandedModules.includes(module)
              
              return (
                <div key={module} className="space-y-2">
                  {/* Header do Módulo */}
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleModule(module)}
                      className="gap-2 font-medium"
                      disabled={disabled}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      {moduleLabel}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAllModulePermissions(module)}
                      disabled={disabled}
                      className="text-xs"
                    >
                      {isModuleFullySelected(module) ? "Desmarcar Módulo" : "Selecionar Módulo"}
                    </Button>
                  </div>
                  
                  {/* Telas do Módulo */}
                  {isExpanded && (
                    <div className="ml-6 space-y-3">
                      {moduleScreens.map(screen => {
                        const screenPerms = permissions.get(screen.id) || new Set()
                        
                        return (
                          <div key={screen.id} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{screen.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => selectAllScreenPermissions(screen.id)}
                                disabled={disabled}
                                className="text-xs"
                              >
                                {isScreenFullySelected(screen.id) ? "Desmarcar Tela" : "Selecionar Tela"}
                              </Button>
                            </div>
                            
                            <div className="ml-4 flex flex-wrap gap-4">
                              {screen.availablePermissions.map(permission => (
                                <label
                                  key={`${screen.id}-${permission}`}
                                  className="flex items-center space-x-2 cursor-pointer"
                                >
                                  <Checkbox
                                    checked={screenPerms.has(permission)}
                                    onCheckedChange={() => togglePermission(screen.id, permission)}
                                    disabled={disabled}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    {getPermissionLabel(permission)}
                                  </span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
