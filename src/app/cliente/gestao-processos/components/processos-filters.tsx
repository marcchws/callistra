"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter, Plus } from "lucide-react"
import { ProcessoFilters } from "../types"
import { 
  ACESSO_OPTIONS, 
  INSTANCIAS_OPTIONS, 
  TRIBUNAIS_OPTIONS 
} from "../types"

interface ProcessosFiltersProps {
  filtros: ProcessoFilters
  onFiltersChange: (filtros: ProcessoFilters) => void
  onAddNew: () => void
  totalProcessos: number
  processosEncontrados: number
}

export function ProcessosFilters({ 
  filtros, 
  onFiltersChange, 
  onAddNew,
  totalProcessos,
  processosEncontrados
}: ProcessosFiltersProps) {
  const [buscaGeral, setBuscaGeral] = useState("")
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  const handleBuscaGeralChange = (valor: string) => {
    setBuscaGeral(valor)
    
    // Aplicar busca em todos os campos pesquisáveis (AC2, AC8)
    onFiltersChange({
      ...filtros,
      pasta: valor,
      nomeCliente: valor,
      outrosEnvolvidos: valor,
      vara: valor,
      foro: valor,
      acao: valor,
      responsavel: valor
    })
  }

  const updateFilter = (key: keyof ProcessoFilters, value: string | undefined) => {
    onFiltersChange({
      ...filtros,
      [key]: value || undefined
    })
  }

  const limparFiltros = () => {
    setBuscaGeral("")
    onFiltersChange({})
  }

  const temFiltrosAtivos = Object.values(filtros).some(valor => 
    valor !== undefined && valor !== "" && valor !== "todos"
  )

  const contarFiltrosAtivos = () => {
    return Object.values(filtros).filter(valor => 
      valor !== undefined && valor !== "" && valor !== "todos"
    ).length
  }

  return (
    <div className="space-y-4">
      {/* Busca geral e controles principais */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestão de Processos</CardTitle>
              <CardDescription>
                {processosEncontrados} de {totalProcessos} processos
                {temFiltrosAtivos && " (filtrados)"}
              </CardDescription>
            </div>
            <Button 
              onClick={onAddNew}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Processo
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Busca geral */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por pasta, cliente, envolvidos, vara, foro, ação ou responsável..."
                value={buscaGeral}
                onChange={(e) => handleBuscaGeralChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setFiltrosAbertos(!filtrosAbertos)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {contarFiltrosAtivos() > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {contarFiltrosAtivos()}
                </Badge>
              )}
            </Button>
            {temFiltrosAtivos && (
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Limpar
              </Button>
            )}
          </div>

          {/* Filtros específicos */}
          {filtrosAbertos && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium">Pasta</label>
                <Input
                  placeholder="Ex: 2024/001"
                  value={filtros.pasta || ""}
                  onChange={(e) => updateFilter("pasta", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Cliente</label>
                <Input
                  placeholder="Nome do cliente"
                  value={filtros.nomeCliente || ""}
                  onChange={(e) => updateFilter("nomeCliente", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Outros Envolvidos</label>
                <Input
                  placeholder="Nome dos envolvidos"
                  value={filtros.outrosEnvolvidos || ""}
                  onChange={(e) => updateFilter("outrosEnvolvidos", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Vara</label>
                <Input
                  placeholder="Ex: 1ª Vara Cível"
                  value={filtros.vara || ""}
                  onChange={(e) => updateFilter("vara", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Foro</label>
                <Input
                  placeholder="Ex: Foro Central"
                  value={filtros.foro || ""}
                  onChange={(e) => updateFilter("foro", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Ação</label>
                <Input
                  placeholder="Tipo de ação"
                  value={filtros.acao || ""}
                  onChange={(e) => updateFilter("acao", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Responsável</label>
                <Input
                  placeholder="Nome do responsável"
                  value={filtros.responsavel || ""}
                  onChange={(e) => updateFilter("responsavel", e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Instância</label>
                <Select 
                  value={filtros.instancia || "todos"} 
                  onValueChange={(value) => updateFilter("instancia", value === "todos" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas as instâncias</SelectItem>
                    {INSTANCIAS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Tribunal</label>
                <Select 
                  value={filtros.tribunal || "todos"} 
                  onValueChange={(value) => updateFilter("tribunal", value === "todos" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os tribunais</SelectItem>
                    {TRIBUNAIS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Nível de Acesso</label>
                <Select 
                  value={filtros.acesso || "todos"} 
                  onValueChange={(value) => updateFilter("acesso", value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os níveis</SelectItem>
                    {ACESSO_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Exibir filtros ativos */}
          {temFiltrosAtivos && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {Object.entries(filtros).map(([key, value]) => {
                if (!value || value === "todos") return null
                
                const labels: Record<string, string> = {
                  pasta: "Pasta",
                  nomeCliente: "Cliente", 
                  outrosEnvolvidos: "Envolvidos",
                  vara: "Vara",
                  foro: "Foro",
                  acao: "Ação",
                  responsavel: "Responsável",
                  instancia: "Instância",
                  tribunal: "Tribunal",
                  acesso: "Acesso"
                }

                return (
                  <Badge key={key} variant="secondary" className="gap-1">
                    {labels[key]}: {value}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => updateFilter(key as keyof ProcessoFilters, undefined)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
