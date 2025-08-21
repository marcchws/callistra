"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Clock, 
  Users, 
  Download,
  Filter,
  Search,
  RefreshCw,
  PieChart,
  Activity
} from "lucide-react"
import { toast } from 'sonner'
import { useDashboard } from "./use-dashboard"
import type { DashboardFilters, ExportFormat } from "./types"

export default function DashboardAnaliticoPage() {
  const {
    data,
    loading,
    error,
    filters,
    updateFilters,
    exportData,
    refreshData
  } = useDashboard()

  const [searchTerm, setSearchTerm] = useState("")
  const [exportLoading, setExportLoading] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setExportLoading(format)
    try {
      await exportData(format, filters)
      toast.success(`Dashboard exportado em ${format.toUpperCase()} com sucesso!`, {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (error) {
      toast.error(`Erro ao exportar dashboard em ${format.toUpperCase()}.`, {
        duration: 3000,
        position: "bottom-right"
      })
    } finally {
      setExportLoading(null)
    }
  }

  const handleRefresh = async () => {
    try {
      await refreshData()
      toast.success("Dados atualizados com sucesso!", {
        duration: 2000,
        position: "bottom-right"
      })
    } catch (error) {
      toast.error("Erro ao atualizar dados.", {
        duration: 3000,
        position: "bottom-right"
      })
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateFilters({ searchTerm: value })
  }

  if (error) {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Analítico</h1>
            <p className="text-muted-foreground">Indicadores estratégicos e operacionais do escritório</p>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                Erro ao carregar dashboard: {error}
              </div>
              <div className="flex justify-center mt-4">
                <Button onClick={handleRefresh} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Analítico</h1>
          <p className="text-muted-foreground">
            Indicadores estratégicos e operacionais com visualização de processos, faturamento e produtividade
          </p>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Filtros</CardTitle>
            <CardDescription>
              Filtre os dados por período, usuário, cargo ou status para análise personalizada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Período */}
              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filters.dateRange?.from?.toISOString().split('T')[0] || ''}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value)
                      updateFilters({ 
                        dateRange: { 
                          from: newDate, 
                          to: filters.dateRange?.to || new Date() 
                        } 
                      })
                    }}
                    className="focus:ring-blue-500"
                  />
                  <span className="self-center text-muted-foreground">até</span>
                  <Input
                    type="date"
                    value={filters.dateRange?.to?.toISOString().split('T')[0] || ''}
                    onChange={(e) => {
                      const newDate = new Date(e.target.value)
                      updateFilters({ 
                        dateRange: { 
                          from: filters.dateRange?.from || new Date(new Date().getFullYear(), new Date().getMonth(), 1), 
                          to: newDate 
                        } 
                      })
                    }}
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Usuário */}
              <div className="space-y-2">
                <Label htmlFor="usuario">Usuário</Label>
                <Select 
                  value={filters.userId || "todos"} 
                  onValueChange={(value) => updateFilters({ userId: value === "todos" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar usuário" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os usuários</SelectItem>
                    {data.usuarios?.map((usuario) => (
                      <SelectItem key={usuario.id} value={usuario.id}>
                        {usuario.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cargo */}
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Select 
                  value={filters.cargo || "todos"} 
                  onValueChange={(value) => updateFilters({ cargo: value === "todos" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os cargos</SelectItem>
                    {data.cargos?.map((cargo) => (
                      <SelectItem key={cargo} value={cargo}>
                        {cargo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={filters.status || "todos"} 
                  onValueChange={(value) => updateFilters({ status: value === "todos" ? null : value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os status</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Busca e Ações */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar processo específico..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="max-w-sm focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                
                <Button
                  onClick={() => handleExport('pdf')}
                  disabled={loading || exportLoading === 'pdf'}
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="h-4 w-4" />
                  {exportLoading === 'pdf' ? 'Exportando...' : 'PDF'}
                </Button>
                
                <Button
                  onClick={() => handleExport('excel')}
                  disabled={loading || exportLoading === 'excel'}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {exportLoading === 'excel' ? 'Exportando...' : 'Excel'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards de Indicadores Principais */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : data.processosAtivos}</div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : `+${data.processosAtivosTendencia}% do mês anterior`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Processos Concluídos</CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : data.processosConcluidos}</div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : `+${data.processosConcluidosTendencia}% do mês anterior`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : `R$ ${data.faturamento?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : `+${data.faturamentoTendencia}% do mês anterior`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium">Tarefas Atrasadas</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : data.tarefasAtrasadas}</div>
              <p className="text-xs text-muted-foreground">
                {loading ? '...' : 'Requer atenção imediata'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos e Tabelas */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Gráfico Principal - Ganhos/Perdas */}
          <Card className="col-span-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Percentual de Ganhos/Perdas</CardTitle>
              <CardDescription>
                Distribuição de resultados dos processos por período
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-muted-foreground">Carregando gráfico...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {data.percentualGanhos}%
                      </div>
                      <div className="text-sm text-green-600">Processos Ganhos</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">
                        {data.percentualPerdas}%
                      </div>
                      <div className="text-sm text-red-600">Processos Perdidos</div>
                    </div>
                  </div>
                  
                  {/* Placeholder para gráfico de pizza */}
                  <div className="h-[200px] bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm text-gray-500">Gráfico de Pizza - Ganhos/Perdas</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Desempenho de Produtividade */}
          <Card className="col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Produtividade</CardTitle>
              <CardDescription>
                {filters.userId ? 'Desempenho individual' : 'Desempenho por cargo'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-muted-foreground">Carregando...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.produtividade?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{item.nome}</div>
                        <div className="text-sm text-muted-foreground">{item.cargo}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.pontuacao}</div>
                        <div className="text-sm text-muted-foreground">pontos</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tarefas Atrasadas */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-medium">Tarefas Atrasadas</CardTitle>
                <CardDescription>
                  {filters.userId ? 'Tarefas atrasadas do usuário selecionado' : 'Tarefas atrasadas por cargo'}
                </CardDescription>
              </div>
              <Badge variant="destructive">{data.tarefasAtrasadas} atrasadas</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Carregando tarefas...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarefa</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Cargo</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Atraso</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.tarefasAtrasadasDetalhes?.map((tarefa) => (
                    <TableRow key={tarefa.id}>
                      <TableCell className="font-medium">{tarefa.titulo}</TableCell>
                      <TableCell>{tarefa.responsavel}</TableCell>
                      <TableCell>{tarefa.cargo}</TableCell>
                      <TableCell>{new Date(tarefa.vencimento).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">
                          {tarefa.diasAtraso} dias
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{tarefa.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Exportações */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Histórico de Exportações</CardTitle>
            <CardDescription>
              Arquivos exportados com data, formato e filtros utilizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Carregando histórico...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Formato</TableHead>
                    <TableHead>Filtros Aplicados</TableHead>
                    <TableHead>Usuário</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.historicoExportacoes?.map((exportacao) => (
                    <TableRow key={exportacao.id}>
                      <TableCell>{new Date(exportacao.data).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{exportacao.formato.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {exportacao.filtros}
                      </TableCell>
                      <TableCell>{exportacao.usuario}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}