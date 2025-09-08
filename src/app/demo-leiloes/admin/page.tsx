"use client"

import { useState } from "react"
import { BarChart3, ArrowLeft, Users, DollarSign, MousePointer, Crown, Settings, AlertTriangle, Eye, Pause, Play, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Link from "next/link"

// Mock data para demonstração
const mockUsuarios = [
  {
    id: "1",
    nome: "Vítor Lima",
    email: "vitor@cavefood.com",
    plano: "Premium",
    status: "ativo",
    dataAssinatura: "2024-08-01",
    ultimoAcesso: "2024-09-10",
    cliques: 247,
    favoritos: 15,
    calculosRealizados: 89,
    valorPago: 49.90
  },
  {
    id: "2", 
    nome: "Maria Silva",
    email: "maria@email.com",
    plano: "Básico",
    status: "ativo",
    dataAssinatura: "2024-09-05",
    ultimoAcesso: "2024-09-09",
    cliques: 156,
    favoritos: 8,
    calculosRealizados: 34,
    valorPago: 29.90
  },
  {
    id: "3",
    nome: "João Santos",
    email: "joao@email.com", 
    plano: "Trial",
    status: "inativo",
    dataAssinatura: "2024-08-28",
    ultimoAcesso: "2024-09-03",
    cliques: 45,
    favoritos: 3,
    calculosRealizados: 12,
    valorPago: 0
  },
  {
    id: "4",
    nome: "Ana Costa",
    email: "ana@email.com",
    plano: "Empresarial", 
    status: "pendente",
    dataAssinatura: "2024-09-08",
    ultimoAcesso: "2024-09-10",
    cliques: 89,
    favoritos: 12,
    calculosRealizados: 23,
    valorPago: 99.90
  }
]

const mockLeiloeiros = [
  {
    nome: "Freitas Leilões",
    cliques: 1247,
    visualizacoes: 5689,
    conversao: 8.5,
    receita: 2450.50,
    veiculosAtivos: 89
  },
  {
    nome: "Porto Seguro Leilões", 
    cliques: 987,
    visualizacoes: 4321,
    conversao: 6.2,
    receita: 1876.30,
    veiculosAtivos: 67
  },
  {
    nome: "Copart Brasil",
    cliques: 756,
    visualizacoes: 3456,
    conversao: 4.8,
    receita: 1234.90,
    veiculosAtivos: 45
  },
  {
    nome: "Sodré Santoro",
    cliques: 654,
    visualizacoes: 2987,
    conversao: 7.1,
    receita: 987.60,
    veiculosAtivos: 34
  },
  {
    nome: "Zukerman Leilões",
    cliques: 543,
    visualizacoes: 2456,
    conversao: 5.9,
    receita: 765.40,
    veiculosAtivos: 28
  }
]

export default function AdminPanel() {
  const [usuarios, setUsuarios] = useState(mockUsuarios)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null)

  const calcularEstatisticasGerais = () => {
    const totalUsuarios = usuarios.length
    const usuariosAtivos = usuarios.filter(u => u.status === "ativo").length
    const usuariosInativos = usuarios.filter(u => u.status === "inativo").length
    const usuariosPendentes = usuarios.filter(u => u.status === "pendente").length
    const receitaMensal = usuarios.reduce((sum, u) => sum + u.valorPago, 0)
    const totalCliques = usuarios.reduce((sum, u) => sum + u.cliques, 0)

    return {
      totalUsuarios,
      usuariosAtivos,
      usuariosInativos,
      usuariosPendentes,
      receitaMensal,
      totalCliques
    }
  }

  const alterarStatusUsuario = (id: string, novoStatus: string) => {
    setUsuarios(prev => prev.map(u => 
      u.id === id ? { ...u, status: novoStatus } : u
    ))
    toast.success(`Status do usuário alterado para ${novoStatus}`)
  }

  const concederDiasGratis = (id: string, dias: number) => {
    // Simulação de concessão de dias grátis
    toast.success(`${dias} dias grátis concedidos ao usuário`)
  }

  const usuariosFiltrados = filtroStatus === "todos" ? 
    usuarios : usuarios.filter(u => u.status === filtroStatus)

  const stats = calcularEstatisticasGerais()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/demo-leiloes">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Leilões
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <Settings className="h-10 w-10 text-purple-600" />
            Painel Administrativo
          </h1>
          <p className="text-gray-600 text-lg">Gerencie usuários, assinaturas e métricas da plataforma</p>
          <div className="mt-4 p-4 bg-purple-100 rounded-lg border-l-4 border-purple-500">
            <p className="text-purple-800 font-medium">Funcionalidade sugerida pelo Otávio - Métricas e gestão completa</p>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsuarios}</div>
              <div className="text-sm text-gray-600">Total Usuários</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.usuariosAtivos}</div>
              <div className="text-sm text-gray-600">Ativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.usuariosInativos}</div>
              <div className="text-sm text-gray-600">Inativos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.usuariosPendentes}</div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-purple-600">
                R$ {stats.receitaMensal.toFixed(2).replace('.', ',')}
              </div>
              <div className="text-sm text-gray-600">Receita Mensal</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.totalCliques.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Cliques</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principais */}
        <Tabs defaultValue="usuarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="leiloeiros">Leiloeiros</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
          </TabsList>

          {/* Tab Usuários */}
          <TabsContent value="usuarios" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Gestão de Usuários
                  </CardTitle>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos Status</SelectItem>
                      <SelectItem value="ativo">Ativos</SelectItem>
                      <SelectItem value="inativo">Inativos</SelectItem>
                      <SelectItem value="pendente">Pendentes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Engajamento</TableHead>
                      <TableHead>Receita</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuariosFiltrados.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{usuario.nome}</div>
                            <div className="text-sm text-gray-500">{usuario.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            usuario.plano === "Empresarial" ? "bg-purple-500" :
                            usuario.plano === "Premium" ? "bg-blue-500" :
                            usuario.plano === "Básico" ? "bg-green-500" :
                            "bg-gray-500"
                          }>
                            {usuario.plano}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            usuario.status === "ativo" ? "bg-green-500" :
                            usuario.status === "inativo" ? "bg-red-500" :
                            "bg-yellow-500"
                          }>
                            {usuario.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(usuario.ultimoAcesso).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{usuario.cliques} cliques</div>
                            <div className="text-gray-500">{usuario.favoritos} favoritos</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          R$ {usuario.valorPago.toFixed(2).replace('.', ',')}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setUsuarioSelecionado(usuario)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Usuário</DialogTitle>
                                </DialogHeader>
                                {usuarioSelecionado && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label>Nome:</Label>
                                        <p className="font-medium">{usuarioSelecionado.nome}</p>
                                      </div>
                                      <div>
                                        <Label>Email:</Label>
                                        <p className="font-medium">{usuarioSelecionado.email}</p>
                                      </div>
                                      <div>
                                        <Label>Plano:</Label>
                                        <p className="font-medium">{usuarioSelecionado.plano}</p>
                                      </div>
                                      <div>
                                        <Label>Status:</Label>
                                        <p className="font-medium">{usuarioSelecionado.status}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Métricas de Uso:</Label>
                                      <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div className="text-center p-3 bg-blue-50 rounded">
                                          <div className="font-bold text-blue-600">{usuarioSelecionado.cliques}</div>
                                          <div>Cliques</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded">
                                          <div className="font-bold text-green-600">{usuarioSelecionado.favoritos}</div>
                                          <div>Favoritos</div>
                                        </div>
                                        <div className="text-center p-3 bg-purple-50 rounded">
                                          <div className="font-bold text-purple-600">{usuarioSelecionado.calculosRealizados}</div>
                                          <div>Cálculos</div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <Label>Ações Administrativas:</Label>
                                      <div className="flex gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => concederDiasGratis(usuarioSelecionado.id, 7)}
                                        >
                                          +7 dias grátis
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => concederDiasGratis(usuarioSelecionado.id, 30)}
                                        >
                                          +30 dias grátis
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {usuario.status === "ativo" ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => alterarStatusUsuario(usuario.id, "pausado")}
                              >
                                <Pause className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => alterarStatusUsuario(usuario.id, "ativo")}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => alterarStatusUsuario(usuario.id, "banido")}
                              className="text-red-500"
                            >
                              <Ban className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Leiloeiros */}
          <TabsContent value="leiloeiros" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance dos Leiloeiros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leiloeiro</TableHead>
                      <TableHead>Cliques</TableHead>
                      <TableHead>Visualizações</TableHead>
                      <TableHead>Taxa Conversão</TableHead>
                      <TableHead>Receita Gerada</TableHead>
                      <TableHead>Veículos Ativos</TableHead>
                      <TableHead>Ranking</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLeiloeiros.map((leiloeiro, index) => (
                      <TableRow key={leiloeiro.nome}>
                        <TableCell className="font-medium">{leiloeiro.nome}</TableCell>
                        <TableCell>{leiloeiro.cliques.toLocaleString()}</TableCell>
                        <TableCell>{leiloeiro.visualizacoes.toLocaleString()}</TableCell>
                        <TableCell>{leiloeiro.conversao}%</TableCell>
                        <TableCell>R$ {leiloeiro.receita.toFixed(2).replace('.', ',')}</TableCell>
                        <TableCell>{leiloeiro.veiculosAtivos}</TableCell>
                        <TableCell>
                          {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                          #{index + 1}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Financeiro */}
          <TabsContent value="financeiro" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Receita Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    R$ {stats.receitaMensal.toFixed(2).replace('.', ',')}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    +15% vs mês anterior
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    Pendências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {stats.usuariosPendentes}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Pagamentos pendentes
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Taxa Retenção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    87%
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Usuários que renovaram
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Detalhamento por plano */}
            <Card>
              <CardHeader>
                <CardTitle>Receita por Plano</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded">
                    <div className="text-xl font-bold">R$ 0,00</div>
                    <div className="text-sm text-gray-600">Trial (0 usuários)</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded">
                    <div className="text-xl font-bold">R$ 29,90</div>
                    <div className="text-sm text-gray-600">Básico (1 usuário)</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded">
                    <div className="text-xl font-bold">R$ 49,90</div>
                    <div className="text-sm text-gray-600">Premium (1 usuário)</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded">
                    <div className="text-xl font-bold">R$ 99,90</div>
                    <div className="text-sm text-gray-600">Empresarial (1 usuário)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Métricas */}
          <TabsContent value="metricas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Usuários por Engajamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {usuarios
                      .sort((a, b) => b.cliques - a.cliques)
                      .slice(0, 5)
                      .map((usuario, index) => (
                        <div key={usuario.id} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{usuario.nome}</div>
                            <div className="text-sm text-gray-500">{usuario.plano}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{usuario.cliques} cliques</div>
                            <div className="text-sm text-gray-500">#{index + 1}</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Uso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total de cliques hoje:</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cálculos realizados:</span>
                      <span className="font-bold">158</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Favoritos adicionados:</span>
                      <span className="font-bold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Novos cadastros hoje:</span>
                      <span className="font-bold">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Alertas do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Alertas do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <div className="font-medium text-red-800">Scraping com falha</div>
                    <div className="text-sm text-red-600">Copart Brasil - Última atualização há 6 horas</div>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="font-medium text-yellow-800">Pagamento pendente</div>
                    <div className="text-sm text-yellow-600">João Santos - Trial expirado há 2 dias</div>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <div className="font-medium text-blue-800">Alto engajamento</div>
                    <div className="text-sm text-blue-600">Vítor Lima - 247 cliques neste mês (+50%)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Resumo da Visão Administrativa */}
        <div className="mt-12 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-400">
          <h3 className="font-semibold text-purple-900 mb-4">Insights Administrativos:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-purple-800">Oportunidades de Crescimento:</p>
              <ul className="text-purple-700 mt-1 space-y-1">
                <li>• Freitas Leilões lidera em engajamento - oportunidade de parceria</li>
                <li>• Taxa de conversão pode melhorar com notificações WhatsApp</li>
                <li>• 3 usuários inativos - campanhas de reativação</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-purple-800">Ações Recomendadas:</p>
              <ul className="text-purple-700 mt-1 space-y-1">
                <li>• Corrigir scraping da Copart Brasil</li>
                <li>• Entrar em contato com usuários pendentes</li>
                <li>• Analisar padrões de uso dos top usuários</li>
                <li>• Implementar alertas automáticos de sistema</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
