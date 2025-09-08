"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, PieChart, TrendingUp, Users } from "lucide-react"
import type { ChartData, TarefaAtrasada, ProdutividadeData } from "../types"

interface DashboardChartsProps {
  chartProcessos: ChartData
  chartProdutividade: ChartData
  tarefasAtrasadas: TarefaAtrasada[]
  produtividade: ProdutividadeData[]
}

export function DashboardCharts({
  chartProcessos,
  chartProdutividade,
  tarefasAtrasadas,
  produtividade
}: DashboardChartsProps) {
  // Função para renderizar gráfico de pizza simulado
  const renderPieChart = (data: ChartData) => {
    const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
    const percentages = data.datasets[0].data.map(value => ((value / total) * 100).toFixed(1))
    
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            {/* Simulação visual de gráfico de pizza */}
            <div className="absolute inset-0 rounded-full border-8 border-green-500" 
                 style={{
                   borderRightColor: '#ef4444',
                   borderBottomColor: '#ef4444',
                   transform: `rotate(${(percentages[1] / 100) * 360}deg)`
                 }}
            />
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{percentages[0]}%</div>
                <div className="text-xs text-muted-foreground">Sucesso</div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          {data.labels.map((label, index) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: data.datasets[0].backgroundColor?.[index] }}
                />
                <span className="text-sm">{label}</span>
              </div>
              <div className="text-sm font-medium">
                {data.datasets[0].data[index]} ({percentages[index]}%)
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Função para renderizar gráfico de barras simulado
  const renderBarChart = (data: ChartData) => {
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data))
    
    return (
      <div className="space-y-4">
        {data.labels.map((label, index) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{label}</span>
              <span className="text-muted-foreground">
                {data.datasets[0].data[index]} tarefas | {data.datasets[1]?.data[index]}% eficiência
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${(data.datasets[0].data[index] / maxValue) * 100}%` }}
                />
              </div>
              {data.datasets[1] && (
                <div className="w-20 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-green-600 rounded-full transition-all"
                    style={{ width: `${data.datasets[1].data[index]}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Função para obter cor da prioridade
  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta": return "text-red-600 bg-red-50"
      case "media": return "text-yellow-600 bg-yellow-50"
      case "baixa": return "text-green-600 bg-green-50"
      default: return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
      {/* Gráfico de Processos Ganhos/Perdidos */}
      <Card className="col-span-full lg:col-span-3">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Percentual de Ganhos e Perdas</CardTitle>
              <CardDescription>Visão geral dos resultados dos processos</CardDescription>
            </div>
            <PieChart className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          {renderPieChart(chartProcessos)}
        </CardContent>
      </Card>

      {/* Gráfico de Produtividade */}
      <Card className="col-span-full lg:col-span-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Desempenho de Produtividade</CardTitle>
              <CardDescription>Tarefas concluídas e eficiência por usuário/cargo</CardDescription>
            </div>
            <BarChart className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grafico" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grafico">Gráfico</TabsTrigger>
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
            </TabsList>
            <TabsContent value="grafico" className="space-y-4">
              {renderBarChart(chartProdutividade)}
            </TabsContent>
            <TabsContent value="detalhes" className="space-y-4">
              <div className="space-y-2">
                {produtividade.map((item) => (
                  <div key={item.nome} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.nome}</div>
                      <div className="text-xs text-muted-foreground">{item.cargo}</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Concluídas: </span>
                        <span className="font-medium">{item.tarefasConcluidas}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Atrasadas: </span>
                        <span className="font-medium text-red-600">{item.tarefasAtrasadas}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Eficiência: </span>
                        <span className="font-medium text-green-600">{item.eficiencia}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lista de Tarefas Atrasadas */}
      <Card className="col-span-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tarefas Atrasadas</CardTitle>
              <CardDescription>
                {tarefasAtrasadas.length} tarefa(s) pendente(s) após o prazo
              </CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tarefasAtrasadas.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                Nenhuma tarefa atrasada encontrada
              </div>
            ) : (
              tarefasAtrasadas.map((tarefa) => (
                <div key={tarefa.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{tarefa.titulo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(tarefa.prioridade)}`}>
                        {tarefa.prioridade}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Responsável: {tarefa.responsavel}</span>
                      <span>Cargo: {tarefa.cargo}</span>
                      {tarefa.processo && <span>Processo: {tarefa.processo}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-red-600 font-medium">
                      {tarefa.diasAtraso} {tarefa.diasAtraso === 1 ? 'dia' : 'dias'}
                    </div>
                    <div className="text-xs text-muted-foreground">em atraso</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}