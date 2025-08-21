"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { FileDown, Filter, Search, BarChart, PieChart, Users, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Pesquisa, 
  Resposta, 
  RespostaFilters, 
  TipoPergunta,
  PerfilUsuario 
} from "../types"
import { toast } from "sonner"

interface PesquisaResultsProps {
  pesquisa: Pesquisa
  respostas: Resposta[]
  perfis: PerfilUsuario[]
  filters: RespostaFilters
  onFilterChange: (filters: RespostaFilters) => void
  onExport: (formato: 'pdf' | 'excel') => Promise<void>
  getEstatisticas: (pesquisaId: string) => any
}

export function PesquisaResults({ 
  pesquisa,
  respostas,
  perfis,
  filters,
  onFilterChange,
  onExport,
  getEstatisticas
}: PesquisaResultsProps) {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTab, setSelectedTab] = useState("overview")

  const estatisticas = getEstatisticas(pesquisa.id)

  // Agrupar respostas por usuário
  const respostasPorUsuario = respostas.reduce((acc, resposta) => {
    if (!acc[resposta.usuarioId]) {
      acc[resposta.usuarioId] = {
        usuario: resposta.usuario,
        respostas: [],
        dataResposta: resposta.dataResposta
      }
    }
    acc[resposta.usuarioId].respostas.push(resposta)
    return acc
  }, {} as Record<string, { usuario: any, respostas: Resposta[], dataResposta: Date }>)

  // Filtrar respostas por termo de busca
  const respostasFiltradas = Object.values(respostasPorUsuario).filter(item => {
    if (!searchTerm) return true
    return item.usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           item.usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Cenário 10: Exportar resultados
  const handleExport = async (formato: 'pdf' | 'excel') => {
    setLoading(true)
    try {
      await onExport(formato)
      toast.success(`Resultados exportados em ${formato.toUpperCase()}`)
    } catch (error) {
      toast.error("Erro ao exportar resultados")
    } finally {
      setLoading(false)
    }
  }

  // Calcular NPS Score (se aplicável)
  const calcularNPS = () => {
    const perguntaNPS = pesquisa.perguntas.find(p => 
      p.texto.toLowerCase().includes("recomendar") && 
      p.tipo === TipoPergunta.MULTIPLA_ESCOLHA
    )
    
    if (!perguntaNPS) return null

    const respostasNPS = respostas.filter(r => r.perguntaId === perguntaNPS.id)
    if (respostasNPS.length === 0) return null

    let promotores = 0
    let neutros = 0
    let detratores = 0

    respostasNPS.forEach(r => {
      const valor = parseInt(r.resposta as string)
      if (valor >= 9) promotores++
      else if (valor >= 7) neutros++
      else detratores++
    })

    const nps = ((promotores - detratores) / respostasNPS.length) * 100
    
    return {
      score: Math.round(nps),
      promotores,
      neutros,
      detratores,
      total: respostasNPS.length
    }
  }

  const npsData = calcularNPS()

  return (
    <div className="space-y-6">
      {/* Filtros - Cenário 7 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold">Filtros de Resultados</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={loading}>
                  <FileDown className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Exportar PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('excel')}>
                  Exportar Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={filters.perfilId}
              onValueChange={(value) => onFilterChange({ ...filters, perfilId: value || undefined })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os perfis</SelectItem>
                {perfis.map(perfil => (
                  <SelectItem key={perfil.id} value={perfil.id}>
                    {perfil.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) => {
                if (value === 'todos') {
                  onFilterChange({ ...filters, periodo: undefined })
                } else {
                  const hoje = new Date()
                  let inicio = new Date()
                  
                  if (value === '7dias') inicio.setDate(hoje.getDate() - 7)
                  else if (value === '30dias') inicio.setDate(hoje.getDate() - 30)
                  else if (value === '90dias') inicio.setDate(hoje.getDate() - 90)
                  
                  onFilterChange({ 
                    ...filters, 
                    periodo: { inicio, fim: hoje } 
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todo período</SelectItem>
                <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                <SelectItem value="90dias">Últimos 90 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Visualização */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Respostas Detalhadas</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
        </TabsList>

        {/* Tab: Visão Geral */}
        <TabsContent value="overview" className="space-y-4">
          {/* Cards de Métricas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Respostas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas?.totalRespostas || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  de {pesquisa.usuariosEspecificos?.length || 100} convidados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taxa de Resposta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {estatisticas?.taxaResposta?.toFixed(1) || 0}%
                </div>
                <Progress 
                  value={estatisticas?.taxaResposta || 0} 
                  className="mt-2 h-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Perfis Alcançados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pesquisa.perfisAlvo.length}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {pesquisa.perfisAlvo.map(perfilId => {
                    const perfil = perfis.find(p => p.id === perfilId)
                    return perfil ? (
                      <Badge key={perfilId} variant="secondary" className="text-xs">
                        {perfil.nome}
                      </Badge>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>

            {npsData && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    NPS Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    <span className={npsData.score > 50 ? "text-green-600" : npsData.score > 0 ? "text-yellow-600" : "text-red-600"}>
                      {npsData.score}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    P: {npsData.promotores} | N: {npsData.neutros} | D: {npsData.detratores}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumo por Pergunta */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Resumo por Pergunta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {estatisticas?.estatisticasPorPergunta?.map((stat: any) => (
                <div key={stat.perguntaId} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{stat.pergunta}</h4>
                    <Badge variant="outline">
                      {stat.totalRespostas} respostas
                    </Badge>
                  </div>
                  
                  {stat.tipo === TipoPergunta.MULTIPLA_ESCOLHA ? (
                    <div className="space-y-2">
                      {Object.entries(stat.distribuicao || {}).map(([opcao, count]: [string, any]) => (
                        <div key={opcao} className="flex items-center gap-2">
                          <span className="text-sm w-32">{opcao}</span>
                          <Progress 
                            value={(count / stat.totalRespostas) * 100} 
                            className="flex-1 h-2"
                          />
                          <span className="text-sm text-muted-foreground w-12 text-right">
                            {count}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {stat.totalRespostas} resposta(s) discursiva(s) recebida(s)
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Respostas Detalhadas */}
        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">
                Respostas Individuais ({respostasFiltradas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {respostasFiltradas.map((item) => (
                    <Card key={item.usuario.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{item.usuario.nome}</h4>
                          <p className="text-sm text-muted-foreground">{item.usuario.email}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{item.usuario.perfil.nome}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(item.dataResposta), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {pesquisa.perguntas.map(pergunta => {
                          const resposta = item.respostas.find(r => r.perguntaId === pergunta.id)
                          if (!resposta) return null
                          
                          return (
                            <div key={pergunta.id} className="border-l-2 border-blue-100 pl-3">
                              <p className="text-sm font-medium mb-1">{pergunta.texto}</p>
                              <p className="text-sm">
                                {pergunta.tipo === TipoPergunta.MULTIPLA_ESCOLHA ? (
                                  <Badge variant="secondary">{resposta.resposta}</Badge>
                                ) : (
                                  <span className="text-muted-foreground italic">"{resposta.resposta}"</span>
                                )}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Análise */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Respostas Discursivas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Respostas Discursivas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {pesquisa.perguntas
                      .filter(p => p.tipo === TipoPergunta.DISCURSIVA)
                      .map(pergunta => {
                        const respostasPergunta = respostas.filter(r => r.perguntaId === pergunta.id)
                        
                        return (
                          <div key={pergunta.id} className="space-y-2">
                            <h4 className="font-medium text-sm">{pergunta.texto}</h4>
                            {respostasPergunta.map(r => (
                              <div key={r.id} className="bg-gray-50 p-3 rounded text-sm">
                                <p className="italic">"{r.resposta}"</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  - {r.usuario.nome}
                                </p>
                              </div>
                            ))}
                          </div>
                        )
                      })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Distribuição por Perfil */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Distribuição por Perfil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {perfis.map(perfil => {
                    const respostasPerfil = Object.values(respostasPorUsuario)
                      .filter(item => item.usuario.perfil.id === perfil.id)
                    const total = respostasPerfil.length
                    const porcentagem = respostasFiltradas.length > 0 
                      ? (total / respostasFiltradas.length) * 100 
                      : 0
                    
                    return (
                      <div key={perfil.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{perfil.nome}</span>
                          <span className="text-sm text-muted-foreground">
                            {total} ({porcentagem.toFixed(0)}%)
                          </span>
                        </div>
                        <Progress value={porcentagem} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline de Respostas */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Timeline de Respostas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground text-center py-8">
                Gráfico de timeline será implementado com biblioteca de charts
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}