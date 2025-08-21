import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TarefaFilters, PRIORIDADE_OPTIONS, STATUS_OPTIONS, TIPO_ATIVIDADE_OPTIONS } from "../types"

interface TarefaFiltersComponentProps {
  filters: TarefaFilters
  onFiltersChange: (filters: TarefaFilters) => void
  clientes: Array<{ id: string; nome: string }>
  processos: Array<{ id: string; numero: string }>
  usuarios: Array<{ id: string; nome: string }>
}

export function TarefaFiltersComponent({
  filters,
  onFiltersChange,
  clientes,
  processos,
  usuarios
}: TarefaFiltersComponentProps) {
  
  const updateFilter = (key: keyof TarefaFilters, value: string | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === "todos" ? undefined : value
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros de Busca
            </CardTitle>
            <CardDescription>
              Filtre tarefas por diferentes critérios
            </CardDescription>
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
                className="gap-1"
              >
                <X className="h-3 w-3" />
                Limpar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* BUSCA TEXTUAL - Cenário 6 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar por nome ou responsável</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Digite o nome da tarefa ou responsável..."
              value={filters.busca || ""}
              onChange={(e) => updateFilter('busca', e.target.value)}
              className="pl-10 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* FILTROS PRINCIPAIS */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* RESPONSÁVEL */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Responsável</label>
            <Select 
              value={filters.responsavel || "todos"} 
              onValueChange={(value) => updateFilter('responsavel', value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Selecionar responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os responsáveis</SelectItem>
                {usuarios.map(usuario => (
                  <SelectItem key={usuario.id} value={usuario.id}>
                    {usuario.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* CLIENTE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cliente</label>
            <Select 
              value={filters.cliente || "todos"} 
              onValueChange={(value) => updateFilter('cliente', value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os clientes</SelectItem>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PROCESSO */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Processo</label>
            <Select 
              value={filters.processo || "todos"} 
              onValueChange={(value) => updateFilter('processo', value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Selecionar processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os processos</SelectItem>
                {processos.map(processo => (
                  <SelectItem key={processo.id} value={processo.id}>
                    {processo.numero}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PRIORIDADE - Cenário 7 */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Prioridade</label>
            <Select 
              value={filters.prioridade || "todos"} 
              onValueChange={(value) => updateFilter('prioridade', value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Selecionar prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as prioridades</SelectItem>
                {PRIORIDADE_OPTIONS.map(opcao => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select 
              value={filters.status || "todos"} 
              onValueChange={(value) => updateFilter('status', value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Selecionar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os status</SelectItem>
                {STATUS_OPTIONS.map(opcao => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* TIPO DE ATIVIDADE */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Atividade</label>
            <Select 
              value={filters.tipoAtividade || "todos"} 
              onValueChange={(value) => updateFilter('tipoAtividade', value)}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Selecionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {TIPO_ATIVIDADE_OPTIONS.map(opcao => (
                  <SelectItem key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}