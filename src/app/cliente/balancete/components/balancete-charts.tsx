"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { Balancete, EvolucaoFinanceira } from "../types"

interface BalanceteChartsProps {
  balancete: Balancete | null
  evolucaoMensal: EvolucaoFinanceira[]
  loading?: boolean
}

const CORES = {
  receitas: "#2563eb", // blue-600
  despesas: "#dc2626", // red-600
  lucro: "#16a34a", // green-600
  inadimplencia: "#f59e0b", // amber-500
  outros: ["#8b5cf6", "#06b6d4", "#ec4899", "#10b981", "#f97316"]
}

export function BalanceteCharts({ balancete, evolucaoMensal, loading }: BalanceteChartsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Análise Gráfica</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!balancete) return null

  // Dados para o gráfico de pizza de receitas
  const dadosReceitas = balancete.detalhamento.porCategoria
    .filter(cat => cat.tipo === 'receita')
    .map((cat, index) => ({
      nome: cat.categoria,
      valor: cat.valor,
      percentual: cat.percentual
    }))

  // Dados para o gráfico de pizza de despesas
  const dadosDespesas = balancete.detalhamento.porCategoria
    .filter(cat => cat.tipo === 'despesa')
    .map((cat, index) => ({
      nome: cat.categoria,
      valor: cat.valor,
      percentual: cat.percentual
    }))

  // Dados para o gráfico de barras por tipo de serviço
  const dadosServicos = balancete.detalhamento.porTipoServico.map(servico => ({
    tipo: servico.label,
    receitas: servico.receitas,
    despesas: servico.despesas,
    lucro: servico.lucro
  }))

  // Custom tooltip para valores em reais
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: R$ {entry.value.toLocaleString('pt-BR')}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  // Custom label para gráfico de pizza
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    if (percent < 0.05) return null // Não mostrar label se for menor que 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Análise Gráfica</CardTitle>
        <CardDescription>
          Visualização interativa dos dados financeiros
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="evolucao" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="evolucao">Evolução Mensal</TabsTrigger>
            <TabsTrigger value="servicos">Por Serviço</TabsTrigger>
            <TabsTrigger value="receitas">Receitas</TabsTrigger>
            <TabsTrigger value="despesas">Despesas</TabsTrigger>
          </TabsList>

          {/* Evolução Mensal */}
          <TabsContent value="evolucao" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolucaoMensal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis 
                    tickFormatter={(value) => 
                      `R$ ${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="receitas" 
                    stackId="1"
                    stroke={CORES.receitas}
                    fill={CORES.receitas}
                    fillOpacity={0.6}
                    name="Receitas"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="despesas" 
                    stackId="2"
                    stroke={CORES.despesas}
                    fill={CORES.despesas}
                    fillOpacity={0.6}
                    name="Despesas"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="lucro" 
                    stroke={CORES.lucro}
                    strokeWidth={2}
                    name="Lucro"
                    dot={{ fill: CORES.lucro }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Por Tipo de Serviço */}
          <TabsContent value="servicos" className="space-y-4">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosServicos}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tipo" />
                  <YAxis 
                    tickFormatter={(value) => 
                      `R$ ${(value / 1000).toFixed(0)}k`
                    }
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="receitas" fill={CORES.receitas} name="Receitas" />
                  <Bar dataKey="despesas" fill={CORES.despesas} name="Despesas" />
                  <Bar dataKey="lucro" fill={CORES.lucro} name="Lucro" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Distribuição de Receitas */}
          <TabsContent value="receitas" className="space-y-4">
            <div className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosReceitas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dadosReceitas.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CORES.outros[index % CORES.outros.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => 
                      `R$ ${value.toLocaleString('pt-BR')}`
                    }
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => 
                      `${value} (${entry.payload.percentual.toFixed(1)}%)`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Distribuição de Despesas */}
          <TabsContent value="despesas" className="space-y-4">
            <div className="h-[400px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dadosDespesas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="valor"
                  >
                    {dadosDespesas.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CORES.outros[index % CORES.outros.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => 
                      `R$ ${value.toLocaleString('pt-BR')}`
                    }
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value, entry: any) => 
                      `${value} (${entry.payload.percentual.toFixed(1)}%)`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
