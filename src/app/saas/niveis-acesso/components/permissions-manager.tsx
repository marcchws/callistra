import React, { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronRight, CheckSquare, Square } from 'lucide-react'
import { Permission, getScreensByModule } from '../types'
import { cn } from '@/lib/utils'

interface PermissionsManagerProps {
  permissions: Record<string, Permission>
  onChange: (permissions: Record<string, Permission>) => void
  readonly?: boolean
}

export function PermissionsManager({ permissions, onChange, readonly = false }: PermissionsManagerProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [localPermissions, setLocalPermissions] = useState<Record<string, Permission>>(permissions)
  const screensByModule = getScreensByModule()

  // Atualiza permissões locais quando prop muda
  useEffect(() => {
    setLocalPermissions(permissions)
  }, [permissions])

  // Expande todos os módulos inicialmente se houver permissões configuradas
  useEffect(() => {
    if (Object.keys(permissions).length > 0) {
      setExpandedModules(Object.keys(screensByModule))
    }
  }, [])

  // Toggle módulo expandido/colapsado
  const toggleModule = (module: string) => {
    setExpandedModules(prev =>
      prev.includes(module)
        ? prev.filter(m => m !== module)
        : [...prev, module]
    )
  }

  // Atualiza uma permissão específica
  const updatePermission = (screenId: string, permissionType: keyof Permission, value: boolean) => {
    const newPermissions = { ...localPermissions }
    
    if (!newPermissions[screenId]) {
      newPermissions[screenId] = {
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false
      }
    }
    
    newPermissions[screenId][permissionType] = value
    
    // Se marcou criar, editar ou excluir, marca visualizar automaticamente
    if ((permissionType === 'criar' || permissionType === 'editar' || permissionType === 'excluir') && value) {
      newPermissions[screenId].visualizar = true
    }
    
    // Se desmarcou visualizar, desmarca todas as outras
    if (permissionType === 'visualizar' && !value) {
      newPermissions[screenId] = {
        visualizar: false,
        criar: false,
        editar: false,
        excluir: false
      }
    }
    
    setLocalPermissions(newPermissions)
    onChange(newPermissions)
  }

  // Seleciona todas as permissões de um módulo
  const selectAllInModule = (module: string, permissionType: keyof Permission) => {
    const screens = screensByModule[module]
    const newPermissions = { ...localPermissions }
    
    screens.forEach(screen => {
      if (!newPermissions[screen.id]) {
        newPermissions[screen.id] = {
          visualizar: false,
          criar: false,
          editar: false,
          excluir: false
        }
      }
      
      newPermissions[screen.id][permissionType] = true
      
      // Se marcou criar, editar ou excluir, marca visualizar automaticamente
      if (permissionType !== 'visualizar') {
        newPermissions[screen.id].visualizar = true
      }
    })
    
    setLocalPermissions(newPermissions)
    onChange(newPermissions)
  }

  // Seleciona todas as permissões globalmente
  const selectAllGlobal = () => {
    const newPermissions: Record<string, Permission> = {}
    
    Object.values(screensByModule).flat().forEach(screen => {
      newPermissions[screen.id] = {
        visualizar: true,
        criar: true,
        editar: true,
        excluir: true
      }
    })
    
    setLocalPermissions(newPermissions)
    onChange(newPermissions)
    setExpandedModules(Object.keys(screensByModule))
  }

  // Limpa todas as permissões
  const clearAll = () => {
    const newPermissions: Record<string, Permission> = {}
    setLocalPermissions(newPermissions)
    onChange(newPermissions)
  }

  // Conta permissões selecionadas
  const countSelectedPermissions = () => {
    let total = 0
    Object.values(localPermissions).forEach(perm => {
      if (perm.visualizar) total++
      if (perm.criar) total++
      if (perm.editar) total++
      if (perm.excluir) total++
    })
    return total
  }

  // Verifica se todas as permissões de um tipo em um módulo estão marcadas
  const isAllSelectedInModule = (module: string, permissionType: keyof Permission): boolean => {
    const screens = screensByModule[module]
    return screens.every(screen => 
      localPermissions[screen.id]?.[permissionType] === true
    )
  }

  return (
    <div className="space-y-4">
      {/* Ações globais */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {countSelectedPermissions()} permissões selecionadas
        </div>
        {!readonly && (
          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={selectAllGlobal}
              className="gap-2"
            >
              <CheckSquare className="h-4 w-4" />
              Selecionar Todos
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm"
              onClick={clearAll}
              className="gap-2"
            >
              <Square className="h-4 w-4" />
              Limpar Todos
            </Button>
          </div>
        )}
      </div>

      {/* Lista de módulos e telas */}
      <div className="space-y-4">
        {Object.entries(screensByModule).map(([module, screens]) => (
          <Card key={module}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  className="p-0 h-auto font-normal justify-start gap-2"
                  onClick={() => toggleModule(module)}
                >
                  {expandedModules.includes(module) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <CardTitle className="text-base">{module}</CardTitle>
                </Button>
                
                {!readonly && expandedModules.includes(module) && (
                  <div className="flex gap-2 text-xs">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAllInModule(module, 'visualizar')}
                      className={cn(
                        "h-7 px-2",
                        isAllSelectedInModule(module, 'visualizar') && "text-blue-600"
                      )}
                    >
                      Visualizar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAllInModule(module, 'criar')}
                      className={cn(
                        "h-7 px-2",
                        isAllSelectedInModule(module, 'criar') && "text-blue-600"
                      )}
                    >
                      Criar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAllInModule(module, 'editar')}
                      className={cn(
                        "h-7 px-2",
                        isAllSelectedInModule(module, 'editar') && "text-blue-600"
                      )}
                    >
                      Editar
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => selectAllInModule(module, 'excluir')}
                      className={cn(
                        "h-7 px-2",
                        isAllSelectedInModule(module, 'excluir') && "text-blue-600"
                      )}
                    >
                      Excluir
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            
            {expandedModules.includes(module) && (
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {screens.map(screen => (
                    <div key={screen.id} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Label className="text-sm font-medium">{screen.nome}</Label>
                          {screen.descricao && (
                            <CardDescription className="text-xs mt-1">
                              {screen.descricao}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-6 pl-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${screen.id}-visualizar`}
                            checked={localPermissions[screen.id]?.visualizar || false}
                            onCheckedChange={(checked) => 
                              updatePermission(screen.id, 'visualizar', checked as boolean)
                            }
                            disabled={readonly}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label 
                            htmlFor={`${screen.id}-visualizar`} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            Visualizar
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${screen.id}-criar`}
                            checked={localPermissions[screen.id]?.criar || false}
                            onCheckedChange={(checked) => 
                              updatePermission(screen.id, 'criar', checked as boolean)
                            }
                            disabled={readonly || !localPermissions[screen.id]?.visualizar}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label 
                            htmlFor={`${screen.id}-criar`} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            Criar
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${screen.id}-editar`}
                            checked={localPermissions[screen.id]?.editar || false}
                            onCheckedChange={(checked) => 
                              updatePermission(screen.id, 'editar', checked as boolean)
                            }
                            disabled={readonly || !localPermissions[screen.id]?.visualizar}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label 
                            htmlFor={`${screen.id}-editar`} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            Editar
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`${screen.id}-excluir`}
                            checked={localPermissions[screen.id]?.excluir || false}
                            onCheckedChange={(checked) => 
                              updatePermission(screen.id, 'excluir', checked as boolean)
                            }
                            disabled={readonly || !localPermissions[screen.id]?.visualizar}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <Label 
                            htmlFor={`${screen.id}-excluir`} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            Excluir
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
